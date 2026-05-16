// api/stripe-webhook.ts — Vercel edge function. Stripe webhook receiver.
//
// Handles `checkout.session.completed` and `invoice.payment_succeeded`. On
// success: fires a server-side Purchase to Meta CAPI (event_id = the same one
// the browser-side fire uses so Meta dedupes), pings Slack, tags the customer
// in beehiiv with the "customers" tag, and sends a Resend welcome email
// containing the kickoff scheduling link.
//
// REQUIRES env: STRIPE_WEBHOOK_SECRET, META_PIXEL_ID, META_CAPI_TOKEN,
//               SLACK_WEBHOOK_URL, BEEHIIV_API_KEY, BEEHIIV_PUB_ID,
//               RESEND_API_KEY
// Optional env: LEAD_NOTIFY_FROM (default leads@trainyouragent.com)
//
// In Stripe:
//   Developers -> Webhooks -> Add endpoint
//   URL:     https://trainyouragent.com/api/stripe-webhook
//   Events:  checkout.session.completed, invoice.payment_succeeded
//   Copy "Signing secret" -> STRIPE_WEBHOOK_SECRET (whsec_...)
//
// Hardening (v33c):
//   - Reject any request that has an Origin header (webhooks are server-to-
//     server; browsers must never reach this endpoint)
//   - Verify Stripe signature in constant time before parsing body
//   - Per-IP rate limit as defense-in-depth
//   - Body size cap
//   - Stripe events processed at-least-once — caller must be idempotent.
//     Stripe's event.id is used as the Meta event_id seed so duplicate
//     deliveries collapse on Meta's side.

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { verifyStripeSignature } from "./checkout.js";
import { recordEvent } from "./_lib/lead-store.js";

export const config = { runtime: "edge" };

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const PIXEL_ID = process.env.META_PIXEL_ID || "";
const CAPI_TOKEN = process.env.META_CAPI_TOKEN || "";
const SLACK_URL = process.env.SLACK_WEBHOOK_URL || "";
const BEEHIIV_KEY = process.env.BEEHIIV_API_KEY || "";
const BEEHIIV_PUB = process.env.BEEHIIV_PUB_ID || "";
const RESEND_KEY = process.env.RESEND_API_KEY || "";
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM || "leads@trainyouragent.com";
const SITE = "https://trainyouragent.com";
const KICKOFF_LINK = "https://cal.com/trainyouragent/30min";

const MAX_BODY_BYTES = 256 * 1024; // Stripe payloads can be chunky
const GRAPH_VERSION = "v19.0";

const HANDLED_EVENTS = new Set([
  "checkout.session.completed",
  "invoice.payment_succeeded",
]);

export default async function handler(req: Request) {
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);

  // Webhooks are server-to-server. A browser hitting this endpoint is suspect.
  const origin = req.headers.get("origin");
  if (origin) return json({ ok: false, error: "no-browser" }, 403);

  if (!WEBHOOK_SECRET) return json({ ok: false, error: "stripe-webhook-not-configured" }, 500);

  const ip = ipFromRequest(req);
  const rl = rateLimit(`stripe-wh:${ip}`, { limit: 240, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return json({ ok: false, error: "rate-limited" }, 429, rl.headers);

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too-large" }, 413);

  const sigHeader = req.headers.get("stripe-signature");
  const ok = await verifyStripeSignature(raw, sigHeader, WEBHOOK_SECRET);
  if (!ok) return json({ ok: false, error: "bad-signature" }, 401);

  let event: any;
  try { event = JSON.parse(raw); } catch { return json({ ok: false, error: "bad-json" }, 400); }

  const type: string = event?.type || "";
  if (!HANDLED_EVENTS.has(type)) {
    // Acknowledge to stop Stripe retrying — we just don't act on it.
    return json({ ok: true, ignored: type }, 200, rl.headers);
  }

  const obj = event?.data?.object || {};
  const customer = extractCustomer(type, obj);
  if (!customer.email) {
    // Nothing to do without an email — still ack so Stripe stops retrying.
    return json({ ok: true, skipped: "no-email" }, 200, rl.headers);
  }

  // event_id seed = Stripe's event.id. Browser-side Purchase fire on the
  // success page should use the same scheme (`purchase_${session.id}`) so
  // Meta dedupes. We expose both forms just in case the client used either.
  const purchaseEventId = `purchase_${obj.id || event.id}`;

  // v42: persistent funnel event so /admin/metrics sees real revenue.
  try {
    recordEvent("purchase_completed", {
      source: "stripe",
      amount: typeof customer.amount === "number" ? customer.amount : 0,
      data: { plan: customer.plan ?? null, currency: customer.currency ?? null },
    });
  } catch { /* never block webhook on logging */ }

  const tasks: Promise<unknown>[] = [];

  // 1) Meta CAPI Purchase (server-side mirror of the browser Purchase)
  if (PIXEL_ID && CAPI_TOKEN) {
    tasks.push(sendMetaPurchase(purchaseEventId, customer));
  }

  // 2) Slack ping
  if (SLACK_URL) {
    tasks.push(fetch(SLACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `:moneybag: *customer.created* — ${customer.name || customer.email}\n` +
              `Plan: ${customer.plan || "—"}\n` +
              `Amount: ${formatAmount(customer.amount, customer.currency)}\n` +
              `Stripe: ${customer.dashboardLink}`,
      }),
    }));
  }

  // 3) beehiiv tag with "customers"
  if (BEEHIIV_KEY && BEEHIIV_PUB) {
    tasks.push(addBeehiivCustomer(customer));
  }

  // 4) Resend welcome email with the kickoff scheduling link
  if (RESEND_KEY) {
    tasks.push(sendWelcomeEmail(customer));
  }

  await Promise.allSettled(tasks);
  return json({ ok: true, type, event_id: purchaseEventId }, 200, rl.headers);
}

type Customer = {
  email: string;
  name?: string;
  plan?: string;
  amount?: number;       // minor units (cents)
  currency?: string;
  dashboardLink: string;
  customerId?: string;
};

function extractCustomer(type: string, obj: any): Customer {
  if (type === "checkout.session.completed") {
    return {
      email: (obj.customer_details?.email || obj.customer_email || "").toLowerCase(),
      name: obj.customer_details?.name,
      plan: obj.metadata?.plan || obj.mode,
      amount: typeof obj.amount_total === "number" ? obj.amount_total : undefined,
      currency: obj.currency,
      customerId: obj.customer,
      dashboardLink: `https://dashboard.stripe.com/payments/${obj.payment_intent || obj.id}`,
    };
  }
  // invoice.payment_succeeded
  return {
    email: (obj.customer_email || "").toLowerCase(),
    name: obj.customer_name,
    plan: obj.lines?.data?.[0]?.price?.nickname || obj.lines?.data?.[0]?.description,
    amount: typeof obj.amount_paid === "number" ? obj.amount_paid : undefined,
    currency: obj.currency,
    customerId: obj.customer,
    dashboardLink: `https://dashboard.stripe.com/invoices/${obj.id}`,
  };
}

async function sendMetaPurchase(eventId: string, c: Customer): Promise<unknown> {
  const value = typeof c.amount === "number" ? c.amount / 100 : undefined;
  const user_data: Record<string, unknown> = {
    em: [await sha256(c.email)],
  };
  if (c.name) {
    const [first, ...rest] = c.name.trim().split(/\s+/);
    if (first) user_data.fn = [await sha256(first.toLowerCase())];
    if (rest.length) user_data.ln = [await sha256(rest.join(" ").toLowerCase())];
  }
  const event = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: `${SITE}/dashboard?checkout=ok`,
    action_source: "website",
    user_data,
    custom_data: {
      currency: (c.currency || "usd").toUpperCase(),
      value: typeof value === "number" ? value : undefined,
      content_name: c.plan || "purchase",
    },
  };
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [event] }),
  });
}

async function addBeehiivCustomer(c: Customer): Promise<unknown> {
  const url = `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB}/subscriptions`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BEEHIIV_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: c.email,
      reactivate_existing: true,
      send_welcome_email: false, // we send our own from Resend below
      tags: ["customers"],
      custom_fields: c.name ? [{ name: "name", value: c.name }] : undefined,
    }),
  });
}

async function sendWelcomeEmail(c: Customer): Promise<unknown> {
  const subject = "Welcome aboard — let's pick a kickoff time";
  const greet = c.name ? `Hey ${c.name.split(/\s+/)[0]}` : "Hey";
  const text = [
    `${greet},`,
    "",
    "Thanks for buying TrainYourAgent. Two things to do today:",
    "",
    `1. Book your kickoff (30 min): ${KICKOFF_LINK}`,
    "2. Reply to this email with a one-line description of the call type",
    "   we'll be building first (e.g. 'inbound new-patient intake').",
    "",
    "I'll have your build kicked off within 24 hours of the kickoff.",
    "",
    "— Alexander Mills",
    "  Founder, TrainYourAgent",
    "  Tampa Bay, FL",
  ].join("\n");

  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: c.email,
      subject,
      text,
    }),
  });
}

function formatAmount(amt: number | undefined, cur: string | undefined): string {
  if (typeof amt !== "number") return "—";
  return `${(amt / 100).toFixed(2)} ${(cur || "usd").toUpperCase()}`;
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
