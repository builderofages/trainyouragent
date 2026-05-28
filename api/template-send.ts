// api/template-send.ts — v192
//
// Logs an outbound "send" event from the operator's gallery to the
// public.template_sends Supabase table. Called by /admin/templates on every
// DM-copy / Email / SMS / Share / Link-copy / Open-site action.
//
// Auth: ?token=ADMIN_TOKEN (operator gallery already requires the soft pin,
// but this endpoint is server-side so it gets the real token via the gallery
// fetch — see gallery code).
//
// Required env: ADMIN_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_KEY.

import { getSupabase, supabaseConfigured } from "./_lib/supabase.js";
import { checkAdmin } from "./_lib/admin-auth.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";

export const config = { runtime: "edge" };

function sanitize(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, max);
}

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "method" }), {
      status: 405, headers: { "content-type": "application/json", ...cors.headers },
    });
  }
  if (!checkAdmin(req)) {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
      status: 401, headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* allow empty */ }

  const prospect_company = sanitize(body.prospect_company, 120);
  const niche            = sanitize(body.niche, 60);
  const channel          = sanitize(body.channel, 16);
  if (!prospect_company || !niche || !channel) {
    return new Response(JSON.stringify({ ok: false, error: "missing-fields" }), {
      status: 400, headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  const row = {
    prospect_company,
    prospect_city:  sanitize(body.prospect_city,  60)  || null,
    prospect_email: sanitize(body.prospect_email, 200) || null,
    prospect_phone: sanitize(body.prospect_phone, 30)  || null,
    prospect_name:  sanitize(body.prospect_name,  120) || null,
    niche,
    niche_label:    sanitize(body.niche_label, 60)     || null,
    channel,
    operator_id:    sanitize(body.operator_id, 60)     || null,
    meta:           body.meta && typeof body.meta === "object" ? body.meta : {},
  };

  if (!supabaseConfigured()) {
    // Soft-fail: gallery still works without Supabase. Operator just won't
    // get the Recent-Activity panel or the nurture follow-ups.
    return new Response(JSON.stringify({ ok: true, stored: false, reason: "supabase-not-configured" }), {
      status: 200, headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  const sb = getSupabase();
  if (!sb) {
    return new Response(JSON.stringify({ ok: false, error: "supabase-init-failed" }), {
      status: 500, headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  const { data, error } = await sb.from("template_sends").insert(row).select("id").maybeSingle();
  if (error) {
    return new Response(JSON.stringify({ ok: false, error: "insert-failed", detail: error.message }), {
      status: 500, headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  return new Response(JSON.stringify({ ok: true, stored: true, id: data?.id ?? null }), {
    status: 200, headers: { "content-type": "application/json", ...cors.headers },
  });
}
