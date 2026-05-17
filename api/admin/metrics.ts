// api/admin/metrics.ts
// v41: token-gated metrics endpoint.
// Returns leads (24h/7d/30d), bookings, purchases, MRR estimate.
// Auth: ?token=... or x-admin-token header (env ADMIN_TOKEN, fallback baked).

import { checkAdmin, unauthorized } from "../_lib/admin-auth.js";
import { rateLimit, ipFromRequest } from "../_lib/rate-limit.js";
import { getMetrics } from "../_lib/lead-store.js";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  // v55a: 60/IP/hour, BEFORE checkAdmin, so the token can't be brute-forced.
  const ip = ipFromRequest(req);
  const rl = rateLimit(`adm-metrics:${ip}`, { limit: 60, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return unauthorized({ "retry-after": String(Math.ceil((rl.reset - Date.now()) / 1000)) });
  if (!checkAdmin(req)) return unauthorized();
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ ok: false, error: "method" }), {
      status: 405, headers: { "content-type": "application/json" },
    });
  }
  const data = getMetrics();
  return new Response(JSON.stringify({ ok: true, data }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}
