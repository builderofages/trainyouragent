// api/admin/metrics.ts
// v41: token-gated metrics endpoint.
// Returns leads (24h/7d/30d), bookings, purchases, MRR estimate.
// Auth: ?token=... or x-admin-token header (env ADMIN_TOKEN, fallback baked).

import { checkAdmin, unauthorized } from "../_lib/admin-auth.js";
import { getMetrics } from "../_lib/lead-store.js";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
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
