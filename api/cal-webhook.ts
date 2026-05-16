// api/cal-webhook.ts — Vercel edge function. Cal.com webhook receiver.
//
// REQUIRES env: CAL_WEBHOOK_SECRET
// Optional env: SLACK_WEBHOOK_URL, RESEND_API_KEY, LEAD_NOTIFY_TO,
//               LEAD_NOTIFY_FROM, META_PIXEL_ID, META_CAPI_TOKEN
//
// In Cal.com:
//   Settings -> Developer -> Webhooks -> New
//   URL:     https://trainyouragent.com/api/cal-webhook
//   Secret:  <same value as CAL_WEBHOOK_SECRET>
//   Events:  BOOKING_CREATED, BOOKING_RESCHEDULED, BOOKING_CANCELLED
//
// Cal signs each request with HMAC-SHA256(secret, raw_body) in
// the `X-Cal-Signature-256` header. We verify before doing anything.
//
// Hardening (v30):
//   - Reject browser-origin requests (webhooks must come from Cal, no Origin)
//   - Body size cap
//   - Signature still required and verified in constant time
//   - Per-IP rate limit as defense-in-depth in case secret leaks

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";

export const config = { runtime: "edge" };

const SECRET = process.env.CAL_WEBHOOK_SECRET || "";
const SLACK_URL = process.env.SLACK_WEBHOOK_URL || "";
const RESEND_KEY = process.env.RESEND_API_KEY || "";
const NOTIFY_TO = process.env.LEAD_NOTIFY_TO || "hello@trainyouragent.com";
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM || "leads@trainyouragent.com";
const SITE = "https://trainyouragent.com";
const MAX_BODY_BYTES = 64 * 1024;

export default async function handler(req: Request) {
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);

  // Webhooks from Cal.com server-to-server have no `Origin` header. If a
  // browser is hitting this endpoint, refuse before we touch the secret.
  const origin = req.headers.get("origin");
  if (origin) return json({ ok: false, error: "no-browser" }, 403);

  if (!SECRET) return json({ ok: false, error: "cal-not-configured" }, 500);

  const ip = ipFromRequest(req);
  const rl = rateLimit(`cal:${ip}`, { limit: 120, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return json({ ok: false, error: "rate-limited" }, 429, rl.headers);

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too-large" }, 413);

  // Signature verification. Cal headers: x-cal-signature-256 (preferred) or
  // x-cal-signature (legacy). Both are HMAC-SHA256 hex of the raw body.
  const sig = req.headers.get("x-cal-signature-256") || req.headers.get("x-cal-signature") || "";
  const ok = await verify(raw, sig, SECRET);
  if (!ok) return json({ ok: false, error: "bad-signature" }, 401);

  let event: any;
  try { event = JSON.parse(raw); } catch { return json({ ok: false, error: "bad-json" }, 400); }

  const triggerEvent: string = event.triggerEvent || "BOOKING_CREATED";
  const p = event.payload || {};
  const attendee = (p.attendees && p.attendees[0]) || {};
  const summary = {
    when:        p.startTime || "",
    type:        p.type || p.eventType?.title || "Call",
    name:        attendee.name || "",
    email:       attendee.email || "",
    company:     p.responses?.company?.value || "",
    notes:       p.responses?.notes?.value || p.additionalNotes || "",
    meetingUrl:  p.metadata?.videoCallUrl || p.location || "",
    triggerEvent,
  };

  const tasks: Promise<unknown>[] = [];

  if (SLACK_URL) {
    const emoji = triggerEvent === "BOOKING_CANCELLED" ? ":x:" : ":calendar:";
    tasks.push(fetch(SLACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `${emoji} *${triggerEvent}* — ${summary.name} (${summary.email})\n` +
              `When: ${summary.when}\nType: ${summary.type}\nCompany: ${summary.company || "—"}\n` +
              `Notes: ${summary.notes || "—"}\nLink: ${summary.meetingUrl || "—"}`,
      }),
    }));
  }

  if (RESEND_KEY) {
    tasks.push(fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: NOTIFY_TO,
        subject: `[Cal · ${triggerEvent}] ${summary.name || summary.email}`,
        text: JSON.stringify(summary, null, 2),
      }),
    }));
  }

  if (triggerEvent === "BOOKING_CREATED" && process.env.META_PIXEL_ID && process.env.META_CAPI_TOKEN) {
    // Stable booking-scoped ID. Used as the base for both Lead and Schedule
    // events so the browser-side fire (if any) can dedupe against the same
    // event_id Meta receives server-side.
    const baseId = `cal_${p.uid || p.id || Date.now()}`;
    const userBlock = {
      email: summary.email,
      first_name: (summary.name || "").split(" ")[0],
      last_name:  (summary.name || "").split(" ").slice(1).join(" "),
    };
    const customBlock = { content_name: summary.type, lead_event_source: "cal.com" };

    // 1) Schedule — the booking is the actual scheduled event.
    tasks.push(fetch(`${SITE}/api/meta-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "Schedule",
        event_id: `${baseId}_schedule`,
        event_source_url: `${SITE}/contact`,
        user: userBlock,
        custom_data: customBlock,
      }),
    }));

    // 2) Lead — every booking is also a sales-qualified lead. Mirror this so
    //    Meta optimizes for Lead conversions on the ad set even when the
    //    site-side Lead pixel didn't fire (DM-driven bookings, direct cal.com
    //    links shared in outbound, etc).
    tasks.push(fetch(`${SITE}/api/meta-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "Lead",
        event_id: `${baseId}_lead`,
        event_source_url: `${SITE}/contact`,
        user: userBlock,
        custom_data: customBlock,
      }),
    }));
  }

  await Promise.allSettled(tasks);
  return json({ ok: true, triggerEvent }, 200, rl.headers);
}

async function verify(raw: string, signature: string, secret: string): Promise<boolean> {
  if (!signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw));
  const hex = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, "0")).join("");
  return timingSafeEqual(hex, signature.replace(/^sha256=/, ""));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extra },
  });
}
