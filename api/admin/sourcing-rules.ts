// api/admin/sourcing-rules.ts — v198
//
// CRUD for sourcing_rules. Used by the operator gallery's Autopilot panel.
//
//   GET             → list rules + most-recent sourced_prospects
//   POST            → create rule { niche, city, cadence_hours, max_per_run, query?, radius_meters?, notes? }
//   POST ?op=update → update rule { id, ...fields }
//   POST ?op=delete → delete rule { id }
//
// Auth: ADMIN_TOKEN required.

import { getSupabase, supabaseConfigured } from "../_lib/supabase.js";
import { checkAdmin } from "../_lib/admin-auth.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "../_lib/cors.js";

export const config = { runtime: "edge" };

function j(o: unknown, status = 200, cors: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", ...cors } });
}
function s(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, max);
}
function n(v: unknown, def: number, min: number, max: number): number {
  const x = parseInt(String(v ?? def), 10);
  if (!isFinite(x)) return def;
  return Math.min(max, Math.max(min, x));
}

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (!checkAdmin(req)) return j({ ok: false, error: "unauthorized" }, 401, cors.headers);
  if (!supabaseConfigured()) return j({ ok: true, rules: [], recent: [], reason: "supabase-not-configured" }, 200, cors.headers);
  const sb = getSupabase();
  if (!sb) return j({ ok: false, error: "supabase-init-failed" }, 500, cors.headers);

  const url = new URL(req.url);
  const op = url.searchParams.get("op") || (req.method === "GET" ? "list" : "create");

  if (op === "list") {
    const [rulesR, recentR] = await Promise.all([
      sb.from("sourcing_rules").select("*").order("created_at", { ascending: false }).limit(40),
      sb.from("sourced_prospects").select("id, prospect_company, city, niche, niche_label, source, phone, email, website, promoted_at, skipped_reason, created_at").order("created_at", { ascending: false }).limit(40),
    ]);
    if (rulesR.error)  return j({ ok: false, error: "rules-select-failed",  detail: rulesR.error.message  }, 500, cors.headers);
    if (recentR.error) return j({ ok: false, error: "recent-select-failed", detail: recentR.error.message }, 500, cors.headers);
    return j({ ok: true, rules: rulesR.data || [], recent: recentR.data || [] }, 200, cors.headers);
  }

  const body = await req.json().catch(() => ({})) as Record<string, unknown>;

  if (op === "create") {
    const niche = s(body.niche, 60);
    const city  = s(body.city,  80);
    if (!niche || !city) return j({ ok: false, error: "missing-fields", hint: "{niche, city, ...}" }, 400, cors.headers);
    const row = {
      niche,
      niche_label:   s(body.niche_label, 80) || niche,
      city,
      state:         s(body.state, 8)  || null,
      country:       s(body.country, 4) || "US",
      radius_meters: n(body.radius_meters, 25000, 2000, 50000),
      query_string:  s(body.query_string, 200) || null,
      cadence_hours: n(body.cadence_hours, 24, 0, 720),
      max_per_run:   n(body.max_per_run, 10, 1, 50),
      enabled:       body.enabled !== false,
      notes:         s(body.notes, 240) || null,
    };
    const { data, error } = await sb.from("sourcing_rules").insert(row).select("*").maybeSingle();
    if (error) return j({ ok: false, error: "insert-failed", detail: error.message }, 500, cors.headers);
    return j({ ok: true, rule: data }, 200, cors.headers);
  }

  if (op === "update") {
    const id = s(body.id, 64);
    if (!id) return j({ ok: false, error: "missing-id" }, 400, cors.headers);
    const patch: Record<string, unknown> = {};
    if (typeof body.enabled       === "boolean") patch.enabled = body.enabled;
    if (body.niche_label !== undefined)  patch.niche_label   = s(body.niche_label, 80) || null;
    if (body.city !== undefined)         patch.city          = s(body.city, 80);
    if (body.state !== undefined)        patch.state         = s(body.state, 8) || null;
    if (body.radius_meters !== undefined) patch.radius_meters = n(body.radius_meters, 25000, 2000, 50000);
    if (body.query_string !== undefined)  patch.query_string  = s(body.query_string, 200) || null;
    if (body.cadence_hours !== undefined) patch.cadence_hours = n(body.cadence_hours, 24, 0, 720);
    if (body.max_per_run !== undefined)   patch.max_per_run   = n(body.max_per_run, 10, 1, 50);
    if (body.notes !== undefined)         patch.notes         = s(body.notes, 240) || null;
    if (Object.keys(patch).length === 0) return j({ ok: false, error: "no-fields" }, 400, cors.headers);
    const { data, error } = await sb.from("sourcing_rules").update(patch).eq("id", id).select("*").maybeSingle();
    if (error) return j({ ok: false, error: "update-failed", detail: error.message }, 500, cors.headers);
    return j({ ok: true, rule: data }, 200, cors.headers);
  }

  if (op === "delete") {
    const id = s(body.id, 64);
    if (!id) return j({ ok: false, error: "missing-id" }, 400, cors.headers);
    const { error } = await sb.from("sourcing_rules").delete().eq("id", id);
    if (error) return j({ ok: false, error: "delete-failed", detail: error.message }, 500, cors.headers);
    return j({ ok: true }, 200, cors.headers);
  }

  return j({ ok: false, error: "unknown-op", op }, 400, cors.headers);
}
