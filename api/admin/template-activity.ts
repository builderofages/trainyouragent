// api/admin/template-activity.ts — v192
//
// Returns recent rows from public.template_sends so the operator's
// /admin/templates dashboard can show a live "Recent activity" panel:
//   • who was sent what, on which channel, when
//   • whether they opened the link, how long ago
//   • whether they booked
//   • whether a Day-3 / Day-7 nurture has fired
//
// Auth: ?token=$ADMIN_TOKEN (or x-admin-token header).
// Read-only. Service-role Supabase client, RLS-bypassing.

import { getSupabase, supabaseConfigured } from "../_lib/supabase.js";
import { checkAdmin } from "../_lib/admin-auth.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "../_lib/cors.js";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);

  if (!checkAdmin(req)) {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
      status: 401, headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  if (!supabaseConfigured()) {
    return new Response(JSON.stringify({ ok: true, rows: [], summary: empty(), reason: "supabase-not-configured" }), {
      status: 200, headers: { "content-type": "application/json", ...cors.headers },
    });
  }
  const sb = getSupabase();
  if (!sb) {
    return new Response(JSON.stringify({ ok: false, error: "supabase-init-failed" }), {
      status: 500, headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "60", 10) || 60, 200);
  const days  = Math.min(parseInt(url.searchParams.get("days") || "30", 10) || 30, 90);
  const since = new Date(Date.now() - days * 86400_000).toISOString();

  const { data, error } = await sb
    .from("template_sends")
    .select("id, prospect_company, prospect_city, prospect_email, prospect_phone, niche, niche_label, channel, sent_at, opened_at, booked_at, last_nurture_template, last_nurture_at, nurture_stopped_reason")
    .gte("sent_at", since)
    .order("sent_at", { ascending: false })
    .limit(limit);

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: "select-failed", detail: error.message }), {
      status: 500, headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  const rows = data || [];
  const summary = {
    window_days: days,
    total: rows.length,
    opened: rows.filter((r) => r.opened_at).length,
    booked: rows.filter((r) => r.booked_at).length,
    pending_nurture: rows.filter((r) => !r.booked_at && !r.last_nurture_template).length,
    by_niche: countBy(rows, "niche"),
    by_channel: countBy(rows, "channel"),
  };

  return new Response(JSON.stringify({ ok: true, rows, summary }), {
    status: 200, headers: { "content-type": "application/json", ...cors.headers, "cache-control": "no-cache" },
  });
}

function countBy<T extends Record<string, unknown>>(rows: T[], key: keyof T): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) {
    const k = String(r[key] ?? "");
    if (!k) continue;
    out[k] = (out[k] || 0) + 1;
  }
  return out;
}

function empty() {
  return { window_days: 0, total: 0, opened: 0, booked: 0, pending_nurture: 0, by_niche: {}, by_channel: {} };
}
