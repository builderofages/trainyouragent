// api/event.ts — Vercel edge function. Generic client-side event recorder.
//
// v42: thin POST endpoint that the website fires for funnel events
// (site_visit, router_view, router_lane_chosen, router_email_gate). All
// writes go through recordEvent() which writes to Supabase if configured
// and to the in-memory fallback otherwise.
//
// Hardening:
//   - 60 req / IP / hour rate limit
//   - CORS allowlist
//   - Event-type allowlist (no arbitrary client-controlled strings)
//   - Body size cap
//   - meta is sanitized server-side

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";
import { recordEvent } from "./_lib/lead-store.js";

export const config = { runtime: "edge" };

const MAX_BODY_BYTES = 4 * 1024;

const ALLOWED_EVENT_TYPES = new Set([
  "site_visit",
  "router_view",
  "router_lane_chosen",
  "router_email_gate",
  "tool_used",
  "demo_used",
  "report_view",
  "pricing_view",
  // v50A: public roadmap voting
  "roadmap_upvote",
]);

type Body = {
  event_type?: string;
  source?: string;
  meta?: Record<string, unknown>;
};

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);

  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405, cors.headers);

  const ip = ipFromRequest(req);
  const rl = rateLimit(`event:${ip}`, { limit: 60, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return json({ ok: false, error: "rate-limited" }, 429, { ...cors.headers, ...rl.headers });

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too-large" }, 413, cors.headers);

  let body: Body;
  try { body = JSON.parse(raw); } catch { return json({ ok: false, error: "bad-json" }, 400, cors.headers); }

  const eventType = typeof body.event_type === "string" ? body.event_type : "";
  if (!ALLOWED_EVENT_TYPES.has(eventType)) {
    return json({ ok: false, error: "bad-event-type" }, 400, cors.headers);
  }

  const source = typeof body.source === "string" ? body.source.slice(0, 80) : undefined;
  const meta = sanitizeMeta(body.meta);

  try {
    recordEvent(eventType, { source, data: meta });
  } catch (e) {
    console.error("[event] record failed", (e as Error)?.message);
    // Never block on logging — return 200 so the client doesn't retry-storm.
  }

  return json({ ok: true }, 200, { ...cors.headers, ...rl.headers });
}

function sanitizeMeta(p: unknown): Record<string, unknown> | undefined {
  if (!p || typeof p !== "object" || Array.isArray(p)) return undefined;
  const out: Record<string, unknown> = {};
  let n = 0;
  for (const [k, v] of Object.entries(p as Record<string, unknown>)) {
    if (n++ > 12) break;
    const key = String(k).replace(/[^\w.-]/g, "").slice(0, 32);
    if (!key) continue;
    if (typeof v === "string") out[key] = v.slice(0, 200);
    else if (typeof v === "number" || typeof v === "boolean") out[key] = v;
    // drop anything else — no nested objects, no arrays.
  }
  return Object.keys(out).length ? out : undefined;
}

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extra },
  });
}
