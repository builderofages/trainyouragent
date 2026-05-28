// api/template-opened.ts — v192
//
// Called by /template/[niche] on mount when ?company= is present.
// Marks the most-recent template_sends row for { prospect_company, niche }
// with opened_at = now() (only if not already set), so the operator's
// /admin/templates dashboard can show "ACME opened your link 2h ago".
//
// PUBLIC endpoint (no admin token). Defended via:
//   - CORS allowlist
//   - Rate limit per IP
//   - Only updates if a matching unopened row exists (no insert path)
//
// Required env: SUPABASE_URL, SUPABASE_SERVICE_KEY.

import { getSupabase, supabaseConfigured } from "./_lib/supabase.js";
import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
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

  const ip = ipFromRequest(req);
  const rl = rateLimit(`tplopen:${ip}`, { limit: 120, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) {
    return new Response(JSON.stringify({ ok: false, error: "rate-limited" }), {
      status: 429, headers: { "content-type": "application/json", ...cors.headers, ...rl.headers },
    });
  }

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* allow empty */ }

  const prospect_company = sanitize(body.prospect_company, 120);
  const niche            = sanitize(body.niche, 60);
  if (!prospect_company || !niche) {
    return new Response(JSON.stringify({ ok: false, error: "missing-fields" }), {
      status: 400, headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  if (!supabaseConfigured()) {
    return new Response(JSON.stringify({ ok: true, updated: false, reason: "supabase-not-configured" }), {
      status: 200, headers: { "content-type": "application/json", ...cors.headers },
    });
  }
  const sb = getSupabase();
  if (!sb) {
    return new Response(JSON.stringify({ ok: false, error: "supabase-init-failed" }), {
      status: 500, headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  // Find the most-recent unopened send for this company+niche.
  const { data: rows, error: selErr } = await sb
    .from("template_sends")
    .select("id, opened_at")
    .eq("prospect_company_norm", prospect_company.toLowerCase())
    .eq("niche", niche)
    .is("opened_at", null)
    .order("sent_at", { ascending: false })
    .limit(1);

  if (selErr) {
    return new Response(JSON.stringify({ ok: false, error: "select-failed", detail: selErr.message }), {
      status: 500, headers: { "content-type": "application/json", ...cors.headers },
    });
  }
  if (!rows || rows.length === 0) {
    return new Response(JSON.stringify({ ok: true, updated: false, reason: "no-matching-send" }), {
      status: 200, headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  const id = rows[0].id;
  const { error: updErr } = await sb
    .from("template_sends")
    .update({ opened_at: new Date().toISOString() })
    .eq("id", id);

  if (updErr) {
    return new Response(JSON.stringify({ ok: false, error: "update-failed", detail: updErr.message }), {
      status: 500, headers: { "content-type": "application/json", ...cors.headers },
    });
  }

  return new Response(JSON.stringify({ ok: true, updated: true, id }), {
    status: 200, headers: { "content-type": "application/json", ...cors.headers },
  });
}
