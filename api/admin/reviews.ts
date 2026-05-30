// api/admin/reviews.ts — v239
//
// Admin review moderation endpoint. Closes the social-proof flywheel:
//   GET    /api/admin/reviews?status=pending  → list pending submissions
//   PATCH  /api/admin/reviews { id, status }  → approve / reject
//
// Auth: ADMIN_TOKEN required (x-admin-token header or ?token=).
//
// Cockpit's "Pending reviews" block hits GET to render, then PATCH per row
// when operator clicks Approve / Reject inline.

import { getSupabase } from "../_lib/supabase.js";
import { checkAdmin } from "../_lib/admin-auth.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "../_lib/cors.js";

export const config = { runtime: "edge" };

function j(o: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", ...headers } });
}

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (!checkAdmin(req)) return j({ ok: false, error: "unauthorized" }, 401, cors.headers);

  const sb = getSupabase();
  if (!sb) return j({ ok: true, reviews: [], skipped: "supabase-not-configured" }, 200, cors.headers);

  // ── GET: list ────────────────────────────────────────────────────
  if (req.method === "GET") {
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "pending";
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get("limit") || "30", 10)));
    try {
      const { data, error } = await sb
        .from("reviews")
        .select("id,name,company,email,niche,video_url,quote,permission_granted,status,ts")
        .eq("status", status)
        .order("ts", { ascending: false })
        .limit(limit);
      if (error) {
        return j({ ok: true, reviews: [], skipped: error.message || "table-missing" }, 200, cors.headers);
      }
      return j({ ok: true, reviews: data || [] }, 200, cors.headers);
    } catch (e) {
      return j({ ok: true, reviews: [], skipped: String((e as Error).message || e) }, 200, cors.headers);
    }
  }

  // ── PATCH: update status ─────────────────────────────────────────
  if (req.method === "PATCH") {
    let body: Record<string, unknown> = {};
    try { body = await req.json(); } catch { return j({ ok: false, error: "bad-json" }, 400, cors.headers); }
    const id = String(body.id || "").trim();
    const status = String(body.status || "").trim();
    if (!id) return j({ ok: false, error: "missing-id" }, 400, cors.headers);
    if (!["approved", "rejected", "pending"].includes(status)) {
      return j({ ok: false, error: "bad-status" }, 400, cors.headers);
    }
    try {
      const { data, error } = await sb.from("reviews").update({ status }).eq("id", id).select("id,status").single();
      if (error) return j({ ok: false, error: error.message }, 500, cors.headers);
      return j({ ok: true, review: data }, 200, cors.headers);
    } catch (e) {
      return j({ ok: false, error: String((e as Error).message || e) }, 500, cors.headers);
    }
  }

  return j({ ok: false, error: "method-not-allowed" }, 405, cors.headers);
}
