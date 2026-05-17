// api/meta-event.ts — Vercel edge function. Forwards events to Meta's
// Conversions API (CAPI). Mirrors browser pixel for ITP/iOS17/ad-block recovery.
//
// REQUIRES env: META_PIXEL_ID, META_CAPI_TOKEN
// Optional env: META_TEST_EVENT_CODE
//
// Hardening (v30):
//   - CORS allowlist (replaces previous wildcard `*` — was leaking the
//     endpoint's existence to any origin)
//   - Rate limit (60 / IP / hour — pixel events fire often)
//   - Body size cap
//   - Event name allowlist
//   - SHA-256 hashing of email/phone/first_name/last_name/external_id (Meta
//     requires PII be hashed before transmission per CAPI spec)
//   - Meta error responses scrubbed before returning to caller

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";

export const config = { runtime: "edge" };

const PIXEL_ID = process.env.META_PIXEL_ID || "";
const CAPI_TOKEN = process.env.META_CAPI_TOKEN || "";
const TEST_CODE = process.env.META_TEST_EVENT_CODE || "";
const GRAPH_VERSION = "v19.0";
const MAX_BODY_BYTES = 8 * 1024;

const ALLOWED_EVENTS = new Set([
  "Lead",
  "Purchase",
  "Schedule",
  "CompleteRegistration",
  "ViewContent",
  "Contact",
  "InitiateCheckout",
  "Subscribe",
]);

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);

  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405, cors.headers);
  // v46b: when Meta CAPI isn't configured, treat as a no-op (200) so the
  // client-side pixel can still fire without a noisy 500 in DevTools.
  if (!PIXEL_ID || !CAPI_TOKEN) return json({ ok: true, skipped: "meta-not-configured" }, 200, cors.headers);

  const ip = ipFromRequest(req);
  const rl = rateLimit(`meta:${ip}`, { limit: 60, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return json({ ok: false, error: "rate-limited" }, 429, { ...cors.headers, ...rl.headers });

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too-large" }, 413, cors.headers);

  let body: any;
  try { body = JSON.parse(raw); } catch { return json({ ok: false, error: "bad-json" }, 400, cors.headers); }

  const eventName = typeof body.event_name === "string" && ALLOWED_EVENTS.has(body.event_name)
    ? body.event_name
    : "Lead";

  const ipAddr = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || ip;
  const ua = req.headers.get("user-agent") || "";
  const u = body.user || {};

  // Per Meta CAPI: every PII field listed in their "Customer Information
  // Parameters" doc must be SHA-256 hashed (lowercase, trimmed).
  // _fbp, _fbc, client_ip, client_user_agent are sent in the clear by spec.
  const user_data: Record<string, unknown> = {
    em: u.email ? [await sha256(normalizeEmail(u.email))] : undefined,
    ph: u.phone ? [await sha256(normalizePhone(u.phone))] : undefined,
    fn: u.first_name ? [await sha256(String(u.first_name).trim().toLowerCase())] : undefined,
    ln: u.last_name ? [await sha256(String(u.last_name).trim().toLowerCase())] : undefined,
    external_id: u.external_id ? [await sha256(String(u.external_id))] : undefined,
    fbp: typeof u.fbp === "string" ? u.fbp : undefined,
    fbc: typeof u.fbc === "string" ? u.fbc : undefined,
    client_ip_address: ipAddr || undefined,
    client_user_agent: ua || undefined,
  };
  Object.keys(user_data).forEach(k => user_data[k] === undefined && delete user_data[k]);

  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: typeof body.event_id === "string" ? body.event_id.slice(0, 128) : crypto.randomUUID(),
    event_source_url: validUrl(body.event_source_url) || "https://trainyouragent.com",
    action_source: "website",
    user_data,
    custom_data: sanitizeCustomData(body.custom_data),
  };

  const payload: any = { data: [event] };
  if (TEST_CODE) payload.test_event_code = TEST_CODE;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`;
  let r: Response;
  try {
    r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return json({ ok: false, error: "capi-fetch-failed" }, 502, cors.headers);
  }
  let j: any;
  try { j = await r.json(); } catch { return json({ ok: false, error: "capi-bad-response" }, 502, cors.headers); }

  if (!r.ok) {
    console.error("[meta-event] capi error", { status: r.status, code: j?.error?.code });
    return json({ ok: false, error: "capi-error" }, 502, cors.headers);
  }
  return json(
    { ok: true, events_received: j.events_received, fbtrace_id: j.fbtrace_id, event_id: event.event_id },
    200,
    { ...cors.headers, ...rl.headers },
  );
}

function normalizeEmail(s: string) { return String(s).trim().toLowerCase(); }
function normalizePhone(s: string) { return String(s).replace(/[^\d]/g, ""); }

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

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extra },
  });
}
