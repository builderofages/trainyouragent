// api/admin/funnel.ts
// v41: token-gated funnel snapshot. Visitor → router → email → booking → purchase.

import { checkAdmin, unauthorized } from "../_lib/admin-auth.js";
import { rateLimit, ipFromRequest } from "../_lib/rate-limit.js";
import { getFunnel } from "../_lib/lead-store.js";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  // v55a: 60/IP/hour, BEFORE checkAdmin, so the token can't be brute-forced.
  const ip = ipFromRequest(req);
  const rl = rateLimit(`adm-funnel:${ip}`, { limit: 60, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return unauthorized({ "retry-after": String(Math.ceil((rl.reset - Date.now()) / 1000)) });
  if (!checkAdmin(req)) return unauthorized();
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ ok: false, error: "method" }), {
      status: 405, headers: { "content-type": "application/json" },
    });
  }
  const data = getFunnel();
  return new Response(JSON.stringify({ ok: true, data }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}
