// api/admin/leads.ts
// v41: token-gated recent-leads list. Returns last 100, emails masked.

import { checkAdmin, unauthorized } from "../_lib/admin-auth.js";
import { rateLimit, ipFromRequest } from "../_lib/rate-limit.js";
import { getLeads } from "../_lib/lead-store.js";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  // v55a: 60/IP/hour — defense against token brute-force even when the token
  // is wrong (rate limit BEFORE checkAdmin so attackers can't probe freely).
  const ip = ipFromRequest(req);
  const rl = rateLimit(`adm-leads:${ip}`, { limit: 60, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return unauthorized({ "retry-after": String(Math.ceil((rl.reset - Date.now()) / 1000)) });
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
