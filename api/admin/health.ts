// api/admin/health.ts — v201
//
// Single endpoint the operator hits to confirm the whole autopilot stack is
// healthy. Checks env presence + does live pings where reasonable + queries
// Supabase for recent cron activity. Returns a structured report.
//
// Auth: ADMIN_TOKEN required.

import { getSupabase, supabaseConfigured } from "../_lib/supabase.js";
import { checkAdmin } from "../_lib/admin-auth.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "../_lib/cors.js";

export const config = { runtime: "edge" };

function j(o: unknown, status = 200, cors: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", ...cors } });
}

type Check = {
  name: string;
  status: "ok" | "warn" | "fail" | "skip";
  note?: string;
};

async function ping(url: string, init?: RequestInit): Promise<boolean> {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 4000);
  try {
    const r = await fetch(url, { ...init, signal: c.signal });
    return r.status < 500;
  } catch { return false; } finally { clearTimeout(t); }
}

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (!checkAdmin(req)) return j({ ok: false, error: "unauthorized" }, 401, cors.headers);

  const checks: Check[] = [];

  // ── Required envs ──────────────────────────────────────────────────
  const envs = [
    ["SUPABASE_URL", "supabase URL"],
    ["SUPABASE_SERVICE_KEY", "supabase service key"],
    ["ADMIN_TOKEN", "admin token"],
    ["RESEND_API_KEY", "resend api key"],
    ["CAL_WEBHOOK_SECRET", "cal webhook secret"],
    ["ELEVENLABS_API_KEY", "elevenlabs api key"],
    ["ANTHROPIC_API_KEY", "anthropic api key"],
    ["SENDER_POSTAL_ADDRESS", "CAN-SPAM postal address"],
    ["RESEND_WEBHOOK_SECRET", "resend bounce webhook secret"],
  ] as const;
  for (const [k, n] of envs) {
    const v = process.env[k] || "";
    if (!v) checks.push({ name: n, status: k === "RESEND_WEBHOOK_SECRET" || k === "SENDER_POSTAL_ADDRESS" ? "warn" : "fail", note: `${k} not set` });
    else if (k === "SENDER_POSTAL_ADDRESS" && /^(Tampa Bay, FL · USA)?$/i.test(v.trim()))
      checks.push({ name: n, status: "warn", note: "default placeholder — set your real PO Box / virtual mailbox / registered-agent address" });
    else checks.push({ name: n, status: "ok" });
  }

  // ── Optional envs (warn if missing, ok with note if set) ──────────
  const optional = [
    ["GOOGLE_PLACES_API_KEY", "google places (richer sourcing)"],
    ["OPENAI_API_KEY", "openai (TTS + chat fallback)"],
    ["GROQ_API_KEY", "groq (chat fallback)"],
    ["GEMINI_API_KEY", "gemini (chat fallback)"],
    ["SLACK_WEBHOOK_URL", "slack notifications"],
    ["LEAD_NOTIFY_TO", "lead notification email"],
    ["LEAD_NOTIFY_FROM", "lead notification from"],
  ] as const;
  for (const [k, n] of optional) {
    if (!process.env[k]) checks.push({ name: n, status: "skip", note: `${k} optional, not set` });
    else checks.push({ name: n, status: "ok" });
  }

  // ── Supabase ───────────────────────────────────────────────────────
  if (!supabaseConfigured()) {
    checks.push({ name: "supabase connect", status: "fail", note: "env not configured" });
  } else {
    const sb = getSupabase();
    if (!sb) checks.push({ name: "supabase connect", status: "fail", note: "client init failed" });
    else {
      // round-trip: count one row from each new table — confirms migrations ran
      const tables = ["template_sends", "sourcing_rules", "sourced_prospects"] as const;
      for (const t of tables) {
        const r = await sb.from(t).select("id", { count: "exact", head: true }).limit(1);
        if (r.error) checks.push({ name: `table.${t}`, status: "fail", note: r.error.message.slice(0, 80) });
        else checks.push({ name: `table.${t}`, status: "ok", note: `${r.count ?? 0} rows` });
      }
      // recent cron sentinels
      const last24h = new Date(Date.now() - 24 * 3600_000).toISOString();
      const nurtureR = await sb.from("template_sends").select("id", { count: "exact", head: true }).gte("last_nurture_at", last24h);
      checks.push({ name: "nurture cron", status: (nurtureR.count ?? 0) >= 0 && !nurtureR.error ? "ok" : "warn", note: `${nurtureR.count ?? 0} sends in last 24h` });
      const sourceR = await sb.from("sourcing_rules").select("id", { count: "exact", head: true }).gte("last_run_at", last24h);
      checks.push({ name: "autosource cron", status: !sourceR.error ? "ok" : "warn", note: `${sourceR.count ?? 0} rules ran in last 24h` });
    }
  }

  // ── Live external pings ────────────────────────────────────────────
  const resendUp = process.env.RESEND_API_KEY ? await ping("https://api.resend.com/", { headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}` } }) : false;
  checks.push({ name: "resend.com reachable", status: process.env.RESEND_API_KEY ? (resendUp ? "ok" : "fail") : "skip" });
  const elUp = process.env.ELEVENLABS_API_KEY ? await ping("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY } }) : false;
  checks.push({ name: "elevenlabs reachable", status: process.env.ELEVENLABS_API_KEY ? (elUp ? "ok" : "fail") : "skip" });
  // OSM Overpass — no auth, just availability
  const osmUp = await ping("https://overpass-api.de/api/status");
  checks.push({ name: "OSM Overpass reachable", status: osmUp ? "ok" : "warn", note: osmUp ? "free fallback live" : "OSM down — relying on Google Places only" });
  const nomUp = await ping("https://nominatim.openstreetmap.org/status?format=json");
  checks.push({ name: "Nominatim geocode", status: nomUp ? "ok" : "warn" });

  // ── Summarize ──────────────────────────────────────────────────────
  const fails = checks.filter((c) => c.status === "fail").length;
  const warns = checks.filter((c) => c.status === "warn").length;
  const overall = fails > 0 ? "fail" : warns > 0 ? "warn" : "ok";

  return j({
    ok: true,
    ts: new Date().toISOString(),
    overall,
    fails,
    warns,
    checks,
  }, 200, cors.headers);
}
