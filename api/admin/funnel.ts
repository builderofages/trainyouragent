// api/admin/funnel.ts
// v41: token-gated funnel snapshot. Visitor → router → email → booking → purchase.

import { checkAdmin, unauthorized } from "../_lib/admin-auth.js";
import { getFunnel } from "../_lib/lead-store.js";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
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
