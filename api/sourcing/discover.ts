// api/sourcing/discover.ts — v198
//
// Run one sourcing rule (or an ad-hoc query). Pulls prospects from the
// configured data source, dedupes against template_sends + sourced_prospects,
// promotes the new ones into template_sends with channel='autosourced' so
// the nurture cron picks them up.
//
// Auth: admin-token or x-vercel-cron.
//
// Modes:
//   POST { rule_id: "..." }                — run one saved rule
//   POST { niche, city, max, query? }      — ad-hoc one-off run (saves no rule)

import { getSupabase, supabaseConfigured } from "../_lib/supabase.js";
import { checkAdmin } from "../_lib/admin-auth.js";
import { rateLimit, ipFromRequest } from "../_lib/rate-limit.js";
import { discoverProspects, geocodeCity, queryForNiche, guessEmail, type RawProspect } from "../_lib/lead-sourcing.js";

export const config = { runtime: "edge" };

function j(o: unknown, status = 200): Response {
  return new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });
}
function s(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, max);
}

type Rule = {
  id: string;
  niche: string;
  niche_label: string | null;
  city: string;
  state: string | null;
  radius_meters: number;
  query_string: string | null;
  max_per_run: number;
  enabled: boolean;
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return j({ ok: false, error: "method" }, 405);
  if (!checkAdmin(req)) return j({ ok: false, error: "unauthorized" }, 401);
  // v201: defense-in-depth rate limit even though admin-gated — if ADMIN_TOKEN
  // ever leaks, this caps the blast radius on Google Places spend.
  const rl = rateLimit(`discover:${ipFromRequest(req)}`, { limit: 30, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return j({ ok: false, error: "rate-limited", hint: "30/h cap" }, 429);
  if (!supabaseConfigured()) return j({ ok: false, error: "supabase-not-configured" }, 500);
  const sb = getSupabase();
  if (!sb) return j({ ok: false, error: "supabase-init-failed" }, 500);

  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  let rule: Rule | null = null;

  if (s(body.rule_id, 64)) {
    const { data, error } = await sb
      .from("sourcing_rules")
      .select("id, niche, niche_label, city, state, radius_meters, query_string, max_per_run, enabled")
      .eq("id", s(body.rule_id, 64))
      .maybeSingle();
    if (error || !data) return j({ ok: false, error: "rule-not-found", detail: error?.message }, 404);
    rule = data as Rule;
  } else {
    const niche = s(body.niche, 60);
    const city  = s(body.city, 80);
    if (!niche || !city) return j({ ok: false, error: "missing-fields", hint: "rule_id or {niche, city, max?, query?}" }, 400);
    rule = {
      id: "__adhoc__",
      niche,
      niche_label: s(body.niche_label, 80) || niche,
      city,
      state: s(body.state, 8) || null,
      radius_meters: Math.min(50000, Math.max(2000, parseInt(String(body.radius_meters ?? 25000), 10) || 25000)),
      query_string: s(body.query, 200) || null,
      max_per_run: Math.min(50, Math.max(1, parseInt(String(body.max ?? 10), 10) || 10)),
      enabled: true,
    };
  }

  const dryRun = body.dry_run === true;

  // ── Discover ────────────────────────────────────────────────────────
  const geo = await geocodeCity(rule.city);
  if (!geo) return j({ ok: false, error: "geocode-failed", city: rule.city }, 502);

  const query = queryForNiche(rule.niche, rule.query_string || undefined);
  const raw = await discoverProspects({ query, geo, radius_meters: rule.radius_meters, max: rule.max_per_run });

  // ── Dry-run: just report what we'd find without writing anything ───
  if (dryRun) {
    // Quick stats: total, with-email, with-phone, with-website. Plus dedupe
    // counts against the live template_sends table.
    const withEmail   = raw.filter((p) => p.email).length;
    const withPhone   = raw.filter((p) => p.phone).length;
    const withWebsite = raw.filter((p) => p.website).length;
    // Pattern-guess potential: rows without an email but WITH a website (we'd
    // synthesize info@domain). Surfacing this so operator knows what to expect.
    const wouldGuess  = raw.filter((p) => !p.email && p.website).length;

    // Per-prospect dedupe check
    let alreadyContacted = 0;
    const newProspects: Array<{ company: string; phone?: string; email?: string; website?: string; emailSource?: "discovered" | "pattern-guess" | "none" }> = [];
    for (const p of raw) {
      const r = await sb.from("template_sends").select("id").eq("prospect_company_norm", p.prospect_company.toLowerCase()).eq("niche", rule.niche).limit(1);
      if (r.data && r.data.length > 0) alreadyContacted++;
      else newProspects.push({
        company: p.prospect_company,
        phone: p.phone,
        email: p.email,
        website: p.website,
        emailSource: p.email ? "discovered" : (p.website ? "pattern-guess" : "none"),
      });
    }

    return j({
      ok: true,
      dry_run: true,
      rule_id: rule.id,
      niche: rule.niche,
      city: rule.city,
      data_source: raw.length > 0 ? raw[0].source : (process.env.GOOGLE_PLACES_API_KEY ? "google-places (or osm fallback)" : "osm"),
      discovered: raw.length,
      with_verified_email: withEmail,
      with_pattern_guess_email_possible: wouldGuess,
      with_phone: withPhone,
      with_website: withWebsite,
      already_contacted_skip: alreadyContacted,
      would_promote_new: newProspects.length,
      preview: newProspects.slice(0, 10),
    });
  }

  // ── Dedupe + insert into sourced_prospects ─────────────────────────
  const inserted: Array<{ p: RawProspect; sourced_id: string | null }> = [];
  for (const p of raw) {
    const { data, error } = await sb
      .from("sourced_prospects")
      .upsert({
        rule_id:          rule.id === "__adhoc__" ? null : rule.id,
        source:           p.source,
        source_id:        p.source_id,
        prospect_company: p.prospect_company,
        city:             rule.city,
        state:            rule.state || geo.state || null,
        address:          p.address || null,
        phone:            p.phone || null,
        email:            p.email || (p.website ? guessEmail(p.website) : null),
        website:          p.website || null,
        niche:            rule.niche,
        niche_label:      rule.niche_label,
        raw:              p.raw || {},
      }, { onConflict: "source,source_id", ignoreDuplicates: false })
      .select("id")
      .maybeSingle();
    if (error) continue;
    inserted.push({ p, sourced_id: data?.id ?? null });
  }

  // ── Promote: insert template_sends row for each NEW prospect ──────
  // Skip if a template_sends row already exists for this company+niche
  // (case-insensitive). Soft dedupe — prevents repeat outreach.
  let promoted = 0;
  let skippedDup = 0;
  for (const { p, sourced_id } of inserted) {
    const co = p.prospect_company;
    const norm = co.toLowerCase();
    const { data: existing } = await sb
      .from("template_sends")
      .select("id")
      .eq("prospect_company_norm", norm)
      .eq("niche", rule.niche)
      .limit(1);
    if (existing && existing.length > 0) {
      if (sourced_id) await sb.from("sourced_prospects").update({ skipped_reason: "dup" }).eq("id", sourced_id);
      skippedDup++;
      continue;
    }
    const email = p.email || (p.website ? guessEmail(p.website) : null);
    const ins = await sb
      .from("template_sends")
      .insert({
        prospect_company: co,
        prospect_city:    rule.city,
        prospect_email:   email,
        prospect_phone:   p.phone || null,
        niche:            rule.niche,
        niche_label:      rule.niche_label,
        channel:          "autosourced",
        meta: {
          source:        p.source,
          source_id:     p.source_id,
          website:       p.website || null,
          email_source:  p.email ? "discovered" : (email ? "pattern-guess" : "none"),
          rule_id:       rule.id === "__adhoc__" ? null : rule.id,
          sourced_id,
        },
      })
      .select("id")
      .maybeSingle();
    if (ins.error || !ins.data) continue;
    if (sourced_id) {
      await sb.from("sourced_prospects").update({
        promoted_at: new Date().toISOString(),
        promoted_send_id: ins.data.id,
      }).eq("id", sourced_id);
    }
    promoted++;
  }

  // ── Update rule bookkeeping ─────────────────────────────────────────
  if (rule.id !== "__adhoc__") {
    await sb.from("sourcing_rules").update({
      last_run_at: new Date().toISOString(),
      last_run_added: promoted,
      last_run_error: null,
      total_added: rule.id === "__adhoc__" ? undefined : (undefined as unknown as number), // no-op; postgres has its own counter approach below
    }).eq("id", rule.id);
    // Increment total_added atomically via RPC-style upsert:
    await sb.rpc?.("noop"); // not used; the increment is best-effort via a follow-up update
    if (promoted > 0) {
      // Best-effort increment. Race-tolerant enough for one cron tick.
      const { data: cur } = await sb.from("sourcing_rules").select("total_added").eq("id", rule.id).maybeSingle();
      const next = (cur?.total_added || 0) + promoted;
      await sb.from("sourcing_rules").update({ total_added: next }).eq("id", rule.id);
    }
  }

  return j({
    ok: true,
    rule_id: rule.id,
    niche: rule.niche,
    city: rule.city,
    discovered: raw.length,
    new_to_db: inserted.length,
    promoted_to_outreach: promoted,
    skipped_duplicate: skippedDup,
  });
}
