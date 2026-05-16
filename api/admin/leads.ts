// api/admin/leads.ts
// v41: token-gated recent-leads list. Returns last 100, emails masked.

import { checkAdmin, unauthorized } from "../_lib/admin-auth.js";
import { getLeads } from "../_lib/lead-store.js";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (!checkAdmin(req)) return unauthorized();
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ ok: false, error: "method" }), {
      status: 405, headers: { "content-type": "application/json" },
    });
  }
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100", 10) || 100, 500);
  const leads = getLeads(limit).map((l) => ({
    ts: new Date(l.ts).toISOString(),
    source: l.source,
    email: l.emailHash, // already masked
    path: l.path,
  }));
  return new Response(JSON.stringify({ ok: true, count: leads.length, data: leads }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}
