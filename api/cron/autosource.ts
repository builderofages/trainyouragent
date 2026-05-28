// api/cron/autosource.ts — v198
//
// Runs every sourcing_rules row whose `last_run_at + cadence_hours <= now()`
// and is enabled. For each one, calls the discover endpoint internally.
//
// Scheduled in vercel.json at "0 */6 * * *" (every 6h). The cadence_hours
// per rule is the operator-set throttle — this cron just runs the SQL filter
// and skips anything not yet due.

import { getSupabase, supabaseConfigured } from "../_lib/supabase.js";
import { checkAdmin } from "../_lib/admin-auth.js";
import { discoverProspects, geocodeCity, queryForNiche, guessEmail } from "../_lib/lead-sourcing.js";

export const config = { runtime: "edge" };

function j(o: unknown, status = 200): Response {
  return new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });
}

type Rule = {
  id: string;
  niche: string;
  niche_label: string | null;
  city: string;
  state: string | null;
  radius_meters: number;
  query_string: string | null;
  cadence_hours: number;
  max_per_run: number;
  last_run_at: string | null;
  total_added: number | null;
};

export default async function handler(req: Request): Promise<Response> {
  if (!checkAdmin(req)) return j({ ok: false, error: "unauthorized" }, 401);
  if (!supabaseConfigured()) return j({ ok: true, considered: 0, ran: 0, reason: "supabase-not-configured" });
  const sb = getSupabase();
  if (!sb) return j({ ok: false, error: "supabase-init-failed" }, 500);

  const { data: all, error } = await sb
    .from("sourcing_rules")
    .select("id, niche, niche_label, city, state, radius_meters, query_string, cadence_hours, max_per_run, last_run_at, total_added")
    .eq("enabled", true);
  if (error) return j({ ok: false, error: "select-failed", detail: error.message }, 500);

  const rules = (all || []) as Rule[];
  const now = Date.now();
  const dueRules = rules.filter((r) => {
    if (!r.cadence_hours || r.cadence_hours <= 0) return false;
    if (!r.last_run_at) return true;
    const dueAt = new Date(r.last_run_at).getTime() + r.cadence_hours * 3600_000;
    return now >= dueAt;
  });

  const out: Array<{ id: string; niche: string; city: string; discovered: number; promoted: number; error?: string }> = [];

  for (const rule of dueRules) {
    const geo = await geocodeCity(rule.city);
    if (!geo) {
      await sb.from("sourcing_rules").update({
        last_run_at: new Date().toISOString(),
        last_run_error: "geocode-failed",
        last_run_added: 0,
      }).eq("id", rule.id);
      out.push({ id: rule.id, niche: rule.niche, city: rule.city, discovered: 0, promoted: 0, error: "geocode" });
      continue;
    }
    const query = queryForNiche(rule.niche, rule.query_string || undefined);
    let raw;
    try {
      raw = await discoverProspects({ query, geo, radius_meters: rule.radius_meters, max: rule.max_per_run });
    } catch (e) {
      await sb.from("sourcing_rules").update({
        last_run_at: new Date().toISOString(),
        last_run_error: (e as Error).message.slice(0, 200),
        last_run_added: 0,
      }).eq("id", rule.id);
      out.push({ id: rule.id, niche: rule.niche, city: rule.city, discovered: 0, promoted: 0, error: "discover" });
      continue;
    }

    let promoted = 0;
    for (const p of raw) {
      // landing zone
      const { data: sp } = await sb.from("sourced_prospects").upsert({
        rule_id:          rule.id,
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
      }, { onConflict: "source,source_id", ignoreDuplicates: false }).select("id").maybeSingle();

      // dedupe against template_sends
      const { data: existing } = await sb
        .from("template_sends")
        .select("id")
        .eq("prospect_company_norm", p.prospect_company.toLowerCase())
        .eq("niche", rule.niche)
        .limit(1);
      if (existing && existing.length > 0) {
        if (sp?.id) await sb.from("sourced_prospects").update({ skipped_reason: "dup" }).eq("id", sp.id);
        continue;
      }
      const email = p.email || (p.website ? guessEmail(p.website) : null);
      const { data: ts } = await sb.from("template_sends").insert({
        prospect_company: p.prospect_company,
        prospect_city:    rule.city,
        prospect_email:   email,
        prospect_phone:   p.phone || null,
        niche:            rule.niche,
        niche_label:      rule.niche_label,
        channel:          "autosourced",
        meta: {
          source:       p.source,
          source_id:    p.source_id,
          website:      p.website || null,
          email_source: p.email ? "discovered" : (email ? "pattern-guess" : "none"),
          rule_id:      rule.id,
          sourced_id:   sp?.id ?? null,
        },
      }).select("id").maybeSingle();
      if (ts?.id && sp?.id) {
        await sb.from("sourced_prospects").update({ promoted_at: new Date().toISOString(), promoted_send_id: ts.id }).eq("id", sp.id);
        promoted++;
      }
    }

    await sb.from("sourcing_rules").update({
      last_run_at: new Date().toISOString(),
      last_run_added: promoted,
      last_run_error: null,
      total_added: (rule.total_added || 0) + promoted,
    }).eq("id", rule.id);

    out.push({ id: rule.id, niche: rule.niche, city: rule.city, discovered: raw.length, promoted });
  }

  return j({
    ok: true,
    ts: new Date().toISOString(),
    considered: rules.length,
    due: dueRules.length,
    results: out,
  });
}
