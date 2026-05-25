// api/stripe-webhook.ts — Vercel edge function. Stripe webhook receiver.
// v161 rewrite: extends event handling beyond the original 2-event scope
// (checkout.session.completed + invoice.payment_succeeded) to cover the full
// post-purchase lifecycle that an SMB AI agency actually needs:
//
//   checkout.session.completed        →  Welcome email (product purchased +
//                                        Calendly kickoff + Stripe receipt
//                                        link) + Meta CAPI Purchase mirror
//                                        + Slack ping + beehiiv "customers" tag
//   invoice.payment_succeeded         →  Renewal silently — no email noise
//                                        (still records purchase + Slack)
//   customer.subscription.deleted     →  Churn-save email ("what did we miss?"
//                                        1-question survey + offer to talk)
//   invoice.payment_failed            →  Dunning email — 3-tier escalation
//                                        based on attempt_count (gentle/firm/
//                                        final). All driven by Stripe's own
//                                        attempt counter so no extra state.
//
// All four customer-facing emails styled with the same Hormozi-tone brand
// voice the v161 nurture-drip uses (renderEmail() helper inlined here).
//
// REQUIRES env: STRIPE_WEBHOOK_SECRET, RESEND_API_KEY
// Optional env: META_PIXEL_ID, META_CAPI_TOKEN, SLACK_WEBHOOK_URL,
//               BEEHIIV_API_KEY, BEEHIIV_PUB_ID, LEAD_NOTIFY_FROM,
//               STRIPE_CHURN_SURVEY_URL
//
// In Stripe:
//   Developers -> Webhooks -> Add endpoint
//   URL:     https://trainyouragent.com/api/stripe-webhook
//   Events:  checkout.session.completed, invoice.payment_succeeded,
//            invoice.payment_failed, customer.subscription.deleted
//   Copy "Signing secret" -> STRIPE_WEBHOOK_SECRET (whsec_...)
//
// Hardening (v33c, retained):
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
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM || process.env.RESEND_FROM_EMAIL || "TrainYourAgent <onboarding@resend.dev>";
const REPLY_TO = process.env.RESEND_REPLY_TO || "alexander@trainyouragent.com";
// v161: optional Typeform/Tally for the churn-save survey. Falls back to a
// mailto: reply if not set so the loop still closes.
const CHURN_SURVEY_URL = process.env.STRIPE_CHURN_SURVEY_URL || `mailto:${REPLY_TO}?subject=Why%20I%20cancelled%20TrainYourAgent`;
const SITE = "https://trainyouragent.com";
const KICKOFF_LINK = "https://cal.com/trainyouragent/30min";

const MAX_BODY_BYTES = 256 * 1024;
const GRAPH_VERSION = "v19.0";

// v161: expanded event set
const HANDLED_EVENTS = new Set([
  "checkout.session.completed",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "customer.subscription.deleted",
]);

export default async function handler(req: Request) {
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
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
    return json({ ok: true, ignored: type }, 200, rl.headers);
  }

  const obj = event?.data?.object || {};
  const customer = extractCustomer(type, obj);
  if (!customer.email) {
    return json({ ok: true, skipped: "no-email" }, 200, rl.headers);
  }

  const purchaseEventId = `purchase_${obj.id || event.id}`;
  const tasks: Promise<unknown>[] = [];

  // Route per event-type
  if (type === "checkout.session.completed") {
    try {
      recordEvent("purchase_completed", {
        source: "stripe",
        amount: typeof customer.amount === "number" ? customer.amount : 0,
        data: { plan: customer.plan ?? null, currency: customer.currency ?? null },
      });
    } catch { /* never block webhook on logging */ }

    if (PIXEL_ID && CAPI_TOKEN) tasks.push(sendMetaPurchase(purchaseEventId, customer));
    if (SLACK_URL) tasks.push(slackNew(customer));
    if (BEEHIIV_KEY && BEEHIIV_PUB) tasks.push(addBeehiivCustomer(customer));
    if (RESEND_KEY) tasks.push(sendWelcomeEmail(customer));
  } else if (type === "invoice.payment_succeeded") {
    // Renewal — no email noise, just record + Slack ping.
    try {
      recordEvent("purchase_completed", {
        source: "stripe-renewal",
        amount: typeof customer.amount === "number" ? customer.amount : 0,
        data: { plan: customer.plan ?? null, currency: customer.currency ?? null },
      });
    } catch {}
    if (SLACK_URL) tasks.push(slackRenewal(customer));
  } else if (type === "customer.subscription.deleted") {
    try {
      recordEvent("purchase_completed", {
        source: "stripe-cancel",
        amount: 0,
        data: { plan: customer.plan ?? null, status: "cancelled" },
      });
    } catch {}
    if (SLACK_URL) tasks.push(slackChurn(customer));
    if (RESEND_KEY) tasks.push(sendChurnSaveEmail(customer));
  } else if (type === "invoice.payment_failed") {
    const attempt = typeof obj.attempt_count === "number" ? obj.attempt_count : 1;
    const nextAttempt = typeof obj.next_payment_attempt === "number" ? obj.next_payment_attempt : null;
    if (SLACK_URL) tasks.push(slackDunning(customer, attempt));
    if (RESEND_KEY) tasks.push(sendDunningEmail(customer, attempt, nextAttempt));
  }

  await Promise.allSettled(tasks);
  return json({ ok: true, type, event_id: purchaseEventId }, 200, rl.headers);
}

// --- Types ---------------------------------------------------------------

type Customer = {
  email: string;
  name?: string;
  plan?: string;
  amount?: number;       // minor units (cents)
  currency?: string;
  dashboardLink: string;
  customerId?: string;
  invoiceUrl?: string;   // hosted_invoice_url when present
  receiptUrl?: string;   // payment receipt link when available
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
      receiptUrl: obj.receipt_url,
    };
  }
  if (type === "customer.subscription.deleted") {
    const item = obj.items?.data?.[0];
    return {
      email: (obj.customer_email || obj.metadata?.email || "").toLowerCase(),
      name: obj.metadata?.name,
      plan: item?.price?.nickname || item?.price?.product || obj.metadata?.plan,
      amount: undefined,
      currency: obj.currency,
      customerId: obj.customer,
      dashboardLink: `https://dashboard.stripe.com/subscriptions/${obj.id}`,
    };
  }
  // invoice.* — payment_succeeded and payment_failed share the same object shape.
  return {
    email: (obj.customer_email || "").toLowerCase(),
    name: obj.customer_name,
    plan: obj.lines?.data?.[0]?.price?.nickname || obj.lines?.data?.[0]?.description,
    amount: typeof obj.amount_paid === "number" && obj.amount_paid > 0 ? obj.amount_paid : (typeof obj.amount_due === "number" ? obj.amount_due : undefined),
    currency: obj.currency,
    customerId: obj.customer,
    dashboardLink: `https://dashboard.stripe.com/invoices/${obj.id}`,
    invoiceUrl: obj.hosted_invoice_url,
  };
}

// --- Meta CAPI -----------------------------------------------------------

async function sendMetaPurchase(eventId: string, c: Customer): Promise<unknown> {
  const value = typeof c.amount === "number" ? c.amount / 100 : undefined;
  const user_data: Record<string, unknown> = { em: [await sha256(c.email)] };
  if (c.name) {
    const [first, ...rest] = c.name.trim().split(/\s+/);
    if (first) user_data.fn = [await sha256(first.toLowerCase())];
    if (rest.length) user_data.ln = [await sha256(rest.join(" ").toLowerCase())];
  }
  const event = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: `${SITE}/onboarding`,
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

// --- Beehiiv -------------------------------------------------------------

async function addBeehiivCustomer(c: Customer): Promise<unknown> {
  const url = `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB}/subscriptions`;
  return fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${BEEHIIV_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: c.email,
      reactivate_existing: true,
      send_welcome_email: false,
      tags: ["customers"],
      custom_fields: c.name ? [{ name: "name", value: c.name }] : undefined,
    }),
  });
}

// --- Slack -------------------------------------------------------------

function slackNew(c: Customer): Promise<unknown> {
  return fetch(SLACK_URL, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text:
      `:moneybag: *NEW CUSTOMER* — ${c.name || c.email}\n` +
      `Plan: ${c.plan || "—"} · ${formatAmount(c.amount, c.currency)}\n` +
      `Stripe: ${c.dashboardLink}` }),
  });
}
function slackRenewal(c: Customer): Promise<unknown> {
  return fetch(SLACK_URL, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text:
      `:repeat: *Renewal* — ${c.name || c.email}\n` +
      `Plan: ${c.plan || "—"} · ${formatAmount(c.amount, c.currency)}\n` +
      `Stripe: ${c.dashboardLink}` }),
  });
}
function slackChurn(c: Customer): Promise<unknown> {
  return fetch(SLACK_URL, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text:
      `:wave: *Churn* — ${c.name || c.email}\n` +
      `Plan: ${c.plan || "—"} cancelled\n` +
      `Save-email sent. Stripe: ${c.dashboardLink}` }),
  });
}
function slackDunning(c: Customer, attempt: number): Promise<unknown> {
  return fetch(SLACK_URL, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text:
      `:warning: *Payment failed* (attempt ${attempt}) — ${c.name || c.email}\n` +
      `Plan: ${c.plan || "—"} · ${formatAmount(c.amount, c.currency)}\n` +
      `Stripe: ${c.dashboardLink}` }),
  });
}

// --- Resend transactional emails ----------------------------------------

async function sendWelcomeEmail(c: Customer): Promise<unknown> {
  const greet = c.name ? `Hey ${c.name.split(/\s+/)[0]},` : "Hey,";
  const planLabel = friendlyPlanLabel(c.plan);
  const subject = `Welcome aboard — your ${planLabel} is live`;
  const body = [
    `${greet}`,
    `You're in. <strong>${escapeHtml(planLabel)}</strong> · ${formatAmount(c.amount, c.currency)} confirmed by Stripe. Here's what happens next:`,
    `<strong>Step 1 (today).</strong> <a href="${KICKOFF_LINK}">Book your kickoff call</a> — 30 min on Zoom with me, no SDR layer. Pick any slot in the next 7 days.`,
    `<strong>Step 2 (within 24h).</strong> I record a personal Loom walking you through the next 14 days and email it. No automation; you'll hear my voice.`,
    `<strong>Step 3 (kickoff).</strong> We listen to 3 of your existing calls + scope the agent. You leave with a written SOW the same day.`,
    `<strong>Step 4 (days 4–10).</strong> I build, train, and stress-test the agent on a test number. You stress-test it before any real traffic.`,
    `<strong>Step 5 (day 14 or earlier).</strong> Cutover. The agent goes live on your real line.`,
    c.receiptUrl
      ? `Your Stripe receipt: <a href="${c.receiptUrl}">view receipt</a>.`
      : `Stripe will email you a receipt within a few minutes. If it doesn't land, reply here and I'll resend.`,
    `Reply to this email with the call type we should build FIRST (e.g. "inbound new-patient intake" or "after-hours emergency dispatch"). Whichever lands here in the next 24h becomes the priority for the kickoff.`,
    `— Alexander Mills, founder, TrainYourAgent · Tampa Bay, FL`,
  ];
  return resendSend({
    to: c.email,
    subject,
    title: `Welcome — your ${planLabel} is live`,
    body,
    cta: { label: "Book your kickoff call →", href: KICKOFF_LINK },
    tag: "stripe-welcome",
  });
}

async function sendChurnSaveEmail(c: Customer): Promise<unknown> {
  const greet = c.name ? `Hey ${c.name.split(/\s+/)[0]},` : "Hey,";
  const subject = "Sorry to see you go — one question";
  const body = [
    `${greet}`,
    `Stripe just told me your subscription cancelled. No hard feelings — but I'd genuinely appreciate one minute of your time so I can stop the next operator hitting whatever wall you hit.`,
    `<strong>What did we miss?</strong>`,
    `If it was the agent itself (script tone, integrations, accuracy), I want to know specifically — that's the kind of feedback that changes the product. If it was business (priorities shifted, cash got tight, you found something cheaper), I want to know that too.`,
    `<a href="${CHURN_SURVEY_URL}">Hit reply, or take the 60-second survey here.</a>`,
    `One more thing: if money was the reason, the $497 Done-WITH-You tier might bridge it for you. Same agent, lighter ongoing cost. Just hit reply and I'll send a $200-off code, no pitch.`,
    `Thanks for trying us. Door's open whenever you're ready to come back.`,
    `— Alexander`,
  ];
  return resendSend({
    to: c.email,
    subject,
    title: "Sorry to see you go — one question",
    body,
    cta: { label: "60-sec survey: what did we miss? →", href: CHURN_SURVEY_URL },
    tag: "stripe-churn-save",
  });
}

async function sendDunningEmail(c: Customer, attempt: number, nextAttemptUnix: number | null): Promise<unknown> {
  const greet = c.name ? `Hey ${c.name.split(/\s+/)[0]},` : "Hey,";
  const updateCardLink = c.invoiceUrl || "https://billing.stripe.com/p/login/test_4gw6ow7nfaXh0xqdQQ"; // hosted_invoice_url has "Update payment method" inside it
  const nextAttempt = nextAttemptUnix
    ? new Date(nextAttemptUnix * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : null;

  let subject: string;
  let title: string;
  let body: string[];

  if (attempt <= 1) {
    // Tier 1 — gentle
    subject = "Quick heads-up — card declined";
    title = "Card declined — quick fix";
    body = [
      `${greet}`,
      `Just a heads-up: Stripe tried to charge your card and it bounced. Could be an expired card, a fraud-protection block, or a balance dip — happens to everyone.`,
      nextAttempt
        ? `Stripe will retry automatically on <strong>${nextAttempt}</strong>. If you'd rather update the card now: <a href="${updateCardLink}">update payment method here</a>.`
        : `<a href="${updateCardLink}">Update your payment method here</a> and we're back in business.`,
      `Your agent is still live — nothing's been paused. Just wanted you to know before it became a problem.`,
      `— Alexander`,
    ];
  } else if (attempt === 2) {
    // Tier 2 — firm
    subject = "Second decline — let's get this fixed today";
    title = "Second decline on your card";
    body = [
      `${greet}`,
      `Second decline. Stripe will try one more time, but at this point it's faster to just <a href="${updateCardLink}">update the payment method directly</a>.`,
      `Your agent is still answering calls. To keep it that way past this billing cycle, we need the card updated in the next 48 hours.`,
      `If something's going on (cash flow, switching cards, account closed), <a href="mailto:${REPLY_TO}">hit reply</a> — I can pause billing for 7 days to give you breathing room, but I need to know.`,
      `— Alexander`,
    ];
  } else {
    // Tier 3 — final
    subject = "Final notice — your agent will pause";
    title = "Final notice — agent will pause";
    body = [
      `${greet}`,
      `Final attempt. Stripe has tried three times and the card keeps declining.`,
      `If we don't get a working payment method in the next 24 hours, your agent will pause (it won't answer calls until billing's current). Your data, scripts, and integrations all stay intact — nothing is deleted.`,
      `<a href="${updateCardLink}">Update payment method now →</a>`,
      `If you want out, <a href="mailto:${REPLY_TO}">just reply CANCEL</a> and I'll close the account cleanly, no clawback fight.`,
      `Either way, I want to make this easy for you. Just reply.`,
      `— Alexander`,
    ];
  }

  return resendSend({
    to: c.email,
    subject,
    title,
    body,
    cta: { label: "Update payment method →", href: updateCardLink },
    tag: `stripe-dunning-${attempt}`,
  });
}

// --- Helpers -------------------------------------------------------------

async function resendSend(opts: {
  to: string;
  subject: string;
  title: string;
  body: string[];
  cta?: { label: string; href: string };
  tag: string;
}): Promise<unknown> {
  const { html, text } = renderEmail({ title: opts.title, body: opts.body, cta: opts.cta });
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [opts.to],
      reply_to: REPLY_TO,
      subject: opts.subject,
      html,
      text,
      tags: [{ name: "category", value: opts.tag }],
      headers: {
        "List-Unsubscribe": `<mailto:${REPLY_TO}?subject=unsubscribe>, <${SITE}/unsubscribe?email=${encodeURIComponent(opts.to)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
  });
}

function renderEmail(opts: {
  title: string;
  body: string[];
  cta?: { label: string; href: string };
}): { html: string; text: string } {
  const paragraphs = opts.body
    .map((p) => `<p style="margin:0 0 14px 0;font-size:15.5px;line-height:1.7;color:#0B1B2B;">${p}</p>`)
    .join("\n");
  const cta = opts.cta
    ? `<p style="margin:24px 0 12px 0;"><a href="${opts.cta.href}" style="display:inline-block;background:#042C53;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:600;font-size:14.5px;font-family:-apple-system,BlinkMacSystemFont,'Inter Tight',sans-serif;">${escapeHtml(opts.cta.label)}</a></p>`
    : "";
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><title>${escapeHtml(opts.title)}</title></head>
<body style="margin:0;padding:0;background:#F6FAFE;font-family:-apple-system,BlinkMacSystemFont,'Inter Tight','Segoe UI',Roboto,sans-serif;color:#0B1B2B;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;background:#ffffff;">
    <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#185FA5;font-weight:600;margin-bottom:8px;font-family:ui-monospace,SFMono-Regular,monospace;">TrainYourAgent · Founder note</div>
    <h1 style="margin:0 0 18px 0;font-size:24px;line-height:1.2;color:#042C53;font-weight:600;letter-spacing:-0.01em;">${escapeHtml(opts.title)}</h1>
    ${paragraphs}
    ${cta}
    <hr style="border:0;border-top:1px solid #E2E8F0;margin:32px 0 16px 0;"/>
    <div style="font-size:11.5px;color:#64748B;line-height:1.6;">
      You're getting this because you're a TrainYourAgent customer.<br/>
      Questions? Reply to this email — it goes straight to my inbox.<br/>
      TrainYourAgent LLC · Tampa Bay, Florida · <a href="${SITE}" style="color:#185FA5;">trainyouragent.com</a>
    </div>
  </div>
</body></html>`;
  const text = [
    `TrainYourAgent · ${opts.title}`,
    "",
    ...opts.body.map(stripHtml),
    "",
    opts.cta ? `→ ${opts.cta.label}: ${opts.cta.href}` : "",
    "",
    "—",
    "TrainYourAgent LLC · Tampa Bay, Florida",
  ].filter(Boolean).join("\n");
  return { html, text };
}

function friendlyPlanLabel(plan?: string): string {
  if (!plan) return "TrainYourAgent build";
  const map: Record<string, string> = {
    operators: "Operators tier ($1,997/mo)",
    scale: "Scale tier ($4,997/mo)",
    founders: "Founders lane (pay-as-you-go)",
    starter: "Starter ($99/mo)",
    "saas-agent-builder": "Agent Builder ($99/mo)",
    "saas-agent-builder-pro": "Agent Builder Pro ($299/mo)",
    "done-with-you-497": "Agent in a Day ($497)",
    subscription: "subscription",
    payment: "one-time build",
  };
  return map[plan] || plan;
}

function formatAmount(amt: number | undefined, cur: string | undefined): string {
  if (typeof amt !== "number") return "—";
  return `${(amt / 100).toFixed(2)} ${(cur || "usd").toUpperCase()}`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]!));
}

function stripHtml(s: string): string {
  return s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
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
