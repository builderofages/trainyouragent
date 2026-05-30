// api/admin/recent-errors.ts — v234
//
// Returns the last N client errors so /admin/cockpit can show what's
// actually breaking in production. Auth: ADMIN_TOKEN.
//
// Gracefully empty if the client_errors table isn't migrated yet — the
// cockpit shows "No errors yet" instead of a red X.

import { getSupabase } from "../_lib/supabase.js";
import { checkAdmin } from "../_lib/admin-auth.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "../_lib/cors.js";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (!checkAdmin(req)) {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), { status: 401, headers: { "content-type": "application/json", ...cors.headers } });
  }
  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(50, parseInt(url.searchParams.get("limit") || "12", 10)));

  const sb = getSupabase();
  if (!sb) {
    return new Response(JSON.stringify({ ok: true, errors: [], skipped: "supabase-not-configured" }), { status: 200, headers: { "content-type": "application/json", ...cors.headers } });
  }
  try {
    const { data, error } = await sb.from("client_errors").select("ts,kind,msg,url,ua").order("ts", { ascending: false }).limit(limit);
    if (error) {
      // Table likely not migrated yet — treat as empty, not error.
      return new Response(JSON.stringify({ ok: true, errors: [], skipped: error.message || "table-missing" }), { status: 200, headers: { "content-type": "application/json", ...cors.headers } });
    }
    return new Response(JSON.stringify({ ok: true, errors: data || [] }), { status: 200, headers: { "content-type": "application/json", ...cors.headers } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: true, errors: [], skipped: String((e as Error).message || e) }), { status: 200, headers: { "content-type": "application/json", ...cors.headers } });
  }
}
