// api/meta-capi-send.ts — v57a
// POST a single Meta Conversion API event from the server. Thin layer over
// Meta's Graph API that handles SHA-256 PII hashing + event_id passthrough.
//
// REQUIRES env: META_PIXEL_ID, META_CAPI_ACCESS_TOKEN
// Optional env: META_TEST_EVENT_CODE
//
// Returns 200 with {"ok": false, "error": "not-configured"} when env unset
// (graceful degradation — never 500).
//
// Event-name allowlist matches the spec:
//   PageView, ViewContent, Lead, Schedule, Purchase, CompleteRegistration
//
// For the legacy endpoint, see api/meta-event.ts. Both forward to the same
// Meta Graph endpoint; this one accepts the new {access_token} env name
// (META_CAPI_ACCESS_TOKEN) per v57a spec and is preferred for new code.

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";
import { sha256Lower, genEventId } from "./_lib/eventid.js";

export const config = { runtime: "edge" };

const PIXEL_ID = process.env.META_PIXEL_ID || "";
// Accept either env var name (CAPI_TOKEN is the legacy name, CAPI_ACCESS_TOKEN
// is the v57a spec name — both work so existing deployments don't break).
const CAPI_TOKEN =
  process.env.META_CAPI_ACCESS_TOKEN || process.env.META_CAPI_TOKEN || "";
const TEST_CODE = process.env.META_TEST_EVENT_CODE || "";
const GRAPH_VERSION = "v19.0";
const MAX_BODY_BYTES = 8 * 1024;

const ALLOWED_EVENTS = new Set([
  "PageView",
  "ViewContent",
  "Lead",
  "Schedule",
  "Purchase",
  "CompleteRegistration",
  "Contact",
  "InitiateCheckout",
  "Subscribe",
]);

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);

  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405, cors.headers);

  // Graceful degradation — return 200 (not 500) so client never sees noise.
  if (!PIXEL_ID || !CAPI_TOKEN) {
    return json({ ok: false, error: "not-configured" }, 200, cors.headers);
  }

  const ip = ipFromRequest(req);
  const rl = rateLimit(`capi:${ip}`, { limit: 60, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return json({ ok: false, error: "rate-limited" }, 429, { ...cors.headers, ...rl.headers });

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too-large" }, 413, cors.headers);

  let body: Record<string, unknown>;
  try { body = JSON.parse(raw) as Record<string, unknown>; }
  catch { return json({ ok: false, error: "bad-json" }, 400, cors.headers); }

  const rawName = typeof body.event_name === "string" ? body.event_name : "";
  if (!ALLOWED_EVENTS.has(rawName)) {
    return json({ ok: false, error: "bad-event-name" }, 400, cors.headers);
  }

  const u = (body.user || {}) as Record<string, unknown>;
  const fwd = req.headers.get("x-forwarded-for") || "";
  const ipAddr = fwd.split(",")[0]?.trim() || ip;
  const ua = req.headers.get("user-agent") || "";

  const user_data: Record<string, unknown> = {
    em: typeof u.email === "string" && u.email ? [await sha256Lower(u.email)] : undefined,
    ph: typeof u.phone === "string" && u.phone
      ? [await sha256Lower(String(u.phone).replace(/[^\d]/g, ""))]
      : undefined,
    fn: typeof u.first_name === "string" && u.first_name ? [await sha256Lower(u.first_name)] : undefined,
    ln: typeof u.last_name === "string" && u.last_name ? [await sha256Lower(u.last_name)] : undefined,
    external_id: typeof u.external_id === "string" && u.external_id
      ? [await sha256Lower(u.external_id)]
      : undefined,
    fbp: typeof u.fbp === "string" ? u.fbp : undefined,
    fbc: typeof u.fbc === "string" ? u.fbc : undefined,
    client_ip_address: ipAddr || undefined,
    client_user_agent: ua || undefined,
  };
  Object.keys(user_data).forEach((k) => user_data[k] === undefined && delete user_data[k]);

  const event = {
    event_name: rawName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: typeof body.event_id === "string" ? body.event_id.slice(0, 128) : genEventId(),
    event_source_url: validUrl(body.event_source_url) || "https://trainyouragent.com",
    action_source: "website",
    user_data,
    custom_data: sanitizeCustomData(body.custom_data),
  };

  const payload: Record<string, unknown> = { data: [event] };
  if (TEST_CODE) payload.test_event_code = TEST_CODE;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`;
  let r: Response;
  try {
    r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch { return json({ ok: false, error: "capi-fetch-failed" }, 502, cors.headers); }

  let j: { events_received?: number; fbtrace_id?: string; error?: { code?: number } };
  try { j = await r.json() as typeof j; }
  catch { return json({ ok: false, error: "capi-bad-response" }, 502, cors.headers); }

  if (!r.ok) {
    console.error("[meta-capi-send] capi error", { status: r.status, code: j?.error?.code });
    return json({ ok: false, error: "capi-error" }, 502, cors.headers);
  }
  return json(
    { ok: true, events_received: j.events_received, fbtrace_id: j.fbtrace_id, event_id: event.event_id },
    200,
    { ...cors.headers, ...rl.headers },
  );
}

function validUrl(s: unknown): string | null {
  if (typeof s !== "string" || s.length > 2048) return null;
  try {
    const u = new URL(s);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.toString();
  } catch { return null; }
}

function sanitizeCustomData(d: unknown): Record<string, unknown> {
  if (!d || typeof d !== "object") return {};
  const out: Record<string, unknown> = {};
  let n = 0;
  for (const [k, v] of Object.entries(d as Record<string, unknown>)) {
    if (n++ > 30) break;
    const key = String(k).replace(/[^\w.-]/g, "").slice(0, 64);
    if (!key) continue;
    if (v == null) continue;
    if (typeof v === "string") out[key] = v.slice(0, 500);
    else if (typeof v === "number" || typeof v === "boolean") out[key] = v;
  }
  return out;
}

function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extra },
  });
}
