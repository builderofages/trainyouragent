// api/meta-event.ts — Vercel edge function. Forwards events to Meta's
// Conversions API (CAPI) for Facebook/Instagram ads. Mirrors the browser
// Meta Pixel so Apple ITP / iOS17 / ad-block losses are recovered server-side.
//
// REQUIRES env: META_PIXEL_ID, META_CAPI_TOKEN
// Optional env: META_TEST_EVENT_CODE  (set to a "TESTxxxxx" code from Events Manager
//                                       while debugging; remove for production)
//
// POST body:
// {
//   "event_name": "Lead" | "Purchase" | "Schedule" | "CompleteRegistration" | "ViewContent" | ...,
//   "event_id":   "<dedupe id matching the browser pixel call>",
//   "event_source_url": "https://trainyouragent.com/pricing",
//   "user": {
//     "email": "x@y.com",      // hashed automatically below
//     "phone": "+15551234",    // hashed automatically
//     "first_name": "Alex",    // hashed automatically
//     "last_name":  "Mills",   // hashed automatically
//     "fbp": "fb.1.16xxx.xxx", // _fbp cookie value (forward as-is)
//     "fbc": "fb.1.16xxx.xxx", // _fbc cookie value (forward as-is)
//     "external_id": "user_123"
//   },
//   "custom_data": { "value": 799, "currency": "USD", "content_name": "Operators plan" }
// }

export const config = { runtime: "edge" };

const PIXEL_ID = process.env.META_PIXEL_ID || "";
const CAPI_TOKEN = process.env.META_CAPI_TOKEN || "";
const TEST_CODE = process.env.META_TEST_EVENT_CODE || "";
const GRAPH_VERSION = "v19.0";

export default async function handler(req: Request) {
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
  if (!PIXEL_ID || !CAPI_TOKEN) return json({ ok: false, error: "meta-not-configured" }, 500);

  let body: any;
  try { body = await req.json(); } catch { return json({ ok: false, error: "bad-json" }, 400); }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  const ua = req.headers.get("user-agent") || "";
  const u = body.user || {};

  const user_data: Record<string, unknown> = {
    em: u.email ? [await sha256(normalizeEmail(u.email))] : undefined,
    ph: u.phone ? [await sha256(normalizePhone(u.phone))] : undefined,
    fn: u.first_name ? [await sha256(u.first_name.trim().toLowerCase())] : undefined,
    ln: u.last_name ? [await sha256(u.last_name.trim().toLowerCase())] : undefined,
    external_id: u.external_id ? [await sha256(String(u.external_id))] : undefined,
    fbp: u.fbp || undefined,
    fbc: u.fbc || undefined,
    client_ip_address: ip || undefined,
    client_user_agent: ua || undefined,
  };
  // strip undefined keys
  Object.keys(user_data).forEach(k => user_data[k] === undefined && delete user_data[k]);

  const event = {
    event_name: body.event_name || "Lead",
    event_time: Math.floor(Date.now() / 1000),
    event_id: body.event_id || crypto.randomUUID(),
    event_source_url: body.event_source_url || "https://trainyouragent.com",
    action_source: "website",
    user_data,
    custom_data: body.custom_data || {},
  };

  const payload: any = { data: [event] };
  if (TEST_CODE) payload.test_event_code = TEST_CODE;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const j = await r.json();
  if (!r.ok) return json({ ok: false, error: j.error?.message || "capi-error", meta: j }, 502);
  return json({ ok: true, events_received: j.events_received, fbtrace_id: j.fbtrace_id, event_id: event.event_id });
}

function normalizeEmail(s: string) { return s.trim().toLowerCase(); }
function normalizePhone(s: string) { return s.replace(/[^\d]/g, ""); }

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
  });
}
