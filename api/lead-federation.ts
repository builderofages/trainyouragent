// api/lead-federation.ts — v101
// Public lead intake endpoint for sibling ventures (cnnct.ai, tyahq.com).
// Forwards into the same Supabase store as /api/lead but tags each lead
// with its origin venture so we get a single CRM across all three sites.
//
// Required env vars (Vercel):
//   LEAD_FEDERATION_TOKENS   Comma-separated venture:token pairs, e.g.
//                            "ghost:gh_abc123,tyahq:hq_xyz789"
//                            Tokens are shared secrets only the sibling
//                            sites know. Rotate by editing this env var.
//
// Sibling site call shape:
//   POST https://trainyouragent.com/api/lead-federation
//   Headers:
//     content-type: application/json
//     x-venture: ghost                (or tyahq)
//     x-federation-token: gh_abc123
//   Body:
//     { email, source, path?, payload?, brandUrl? }
//
// Response: 202 Accepted {ok:true,received:1} | 401 | 400 | 429 | 500
//
// CORS is open by design — sibling sites are different origins. The token
// header is the auth; we never trust the Origin header.

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { recordLead, type Venture } from "./_lib/lead-store.js";

export const config = { runtime: "edge" };

const RAW_TOKENS = process.env.LEAD_FEDERATION_TOKENS || "";

// Parse "ghost:abc,tyahq:def" → { ghost: "abc", tyahq: "def" }.
function parseTokenMap(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const pair of RAW_TOKENS.split(",").map((s) => s.trim()).filter(Boolean)) {
    const [venture, token] = pair.split(":");
    if (venture && token) out[venture.trim()] = token.trim();
  }
  return out;
}

const TOKEN_MAP = parseTokenMap();

const VALID_VENTURES = new Set<Venture>(["ghost", "tyahq"]); // tya uses /api/lead directly

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(msg: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status,
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
  });
}

function preflight() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type, x-venture, x-federation-token",
      "access-control-max-age": "86400",
    },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return preflight();
  if (req.method !== "POST") return badRequest("Method not allowed", 405);

  // 1. Venture + token auth
  const venture = (req.headers.get("x-venture") || "").trim().toLowerCase() as Venture;
  const token   = (req.headers.get("x-federation-token") || "").trim();
  if (!VALID_VENTURES.has(venture)) {
    return badRequest("unknown venture", 401);
  }
  if (!TOKEN_MAP[venture] || token !== TOKEN_MAP[venture]) {
    return badRequest("invalid federation token", 401);
  }

  // 2. Rate limit per venture+IP — 60/hr is generous (each sibling site
  //    has its own visitor pool).
  const ip = ipFromRequest(req);
  const rl = rateLimit(`fed:${venture}:${ip}`, 60, 60 * 60_000);
  if (!rl.ok) {
    return new Response(JSON.stringify({ ok: false, error: "rate limited" }), {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": String(rl.retryAfterMs / 1000 | 0),
        "access-control-allow-origin": "*",
      },
    });
  }

  // 3. Parse body
  let body: Record<string, unknown>;
  try {
    const txt = await req.text();
    if (txt.length > 8192) return badRequest("payload too large", 413);
    body = txt ? JSON.parse(txt) : {};
  } catch {
    return badRequest("invalid json");
  }

  const email    = String(body.email || "").trim().toLowerCase();
  const source   = String(body.source || "").trim();
  const path     = body.path ? String(body.path).slice(0, 256) : undefined;
  const brandUrl = body.brandUrl ? String(body.brandUrl).slice(0, 128) : undefined;

  if (!EMAIL_RE.test(email)) return badRequest("invalid email");
  if (!source || source.length > 64) return badRequest("invalid source");

  // 4. Persist via the same lead store /api/lead uses. Venture tag
  //    routes it into the right bucket; cross_sell flag computed inside.
  try {
    recordLead({
      email,
      source: `fed:${venture}:${source}`.slice(0, 96),
      path,
      ip,
      payload: body.payload ?? null,
      venture,
      brandUrl,
    });
  } catch (err) {
    console.error("[lead-federation] recordLead failed", err);
    return badRequest("internal error", 500);
  }

  return new Response(JSON.stringify({ ok: true, received: 1, venture }), {
    status: 202,
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
  });
}
