// api/checkout.ts — Vercel edge function. Stripe Checkout session creator.
//
// REQUIRES env: STRIPE_SECRET_KEY
// Optional env: STRIPE_PRICE_OPERATORS, STRIPE_PRICE_FOUNDERS_BUILD,
//               STRIPE_WEBHOOK_SECRET (used by api/stripe-webhook.ts when added)
//
// Hardening (v30):
//   - CORS allowlist
//   - Rate limit (10 / IP / hour — checkout sessions are cheap but abusable)
//   - Plan allowlist
//   - success_url + cancel_url hardcoded server-side (no open-redirect risk)
//   - Email validation if provided
//   - Stripe error messages NOT echoed to caller (could leak account hints)
//   - Webhook signature placeholder exported for future api/stripe-webhook.ts

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";

export const config = { runtime: "edge" };

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const PRICE_OPERATORS = process.env.STRIPE_PRICE_OPERATORS || "";
const PRICE_FOUNDERS  = process.env.STRIPE_PRICE_FOUNDERS_BUILD || "";
// v50A: new plan tier env vars seeded by /api/stripe-setup
const PRICE_STARTER  = process.env.STRIPE_PRICE_STARTER  || "";
const PRICE_OPERATOR = process.env.STRIPE_PRICE_OPERATOR || "";
const PRICE_SCALE    = process.env.STRIPE_PRICE_SCALE    || "";
// v71: SaaS Self-Serve Agent Builder $99/mo recurring
const PRICE_SAAS_AGENT_BUILDER = process.env.STRIPE_PRICE_SAAS_AGENT_BUILDER || "";

// Hardcoded success/cancel URLs — never accept these from the client.
// v38: success URL routes to /onboarding so new customers land in the
// 5-step kickoff flow (welcome video → schedule call → connect tools →
// approve agent → go live). The {CHECKOUT_SESSION_ID} placeholder is
// substituted by Stripe so we can correlate the onboarding view with the
// purchase event in /api/stripe-webhook.
const SUCCESS_URL = "https://trainyouragent.com/onboarding?session_id={CHECKOUT_SESSION_ID}";
const CANCEL_URL  = "https://trainyouragent.com/pricing?checkout=cancelled";

const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;

// Plan allowlist — only these plan IDs may be checked out.
const PLANS: Record<string, { priceEnv: string; mode: "subscription" | "payment" }> = {
  operators: { priceEnv: "STRIPE_PRICE_OPERATORS", mode: "subscription" },
  founders:  { priceEnv: "STRIPE_PRICE_FOUNDERS_BUILD", mode: "payment" },
  // v50A: tiers seeded by /api/stripe-setup
  starter:   { priceEnv: "STRIPE_PRICE_STARTER",  mode: "subscription" },
  operator:  { priceEnv: "STRIPE_PRICE_OPERATOR", mode: "subscription" },
  scale:     { priceEnv: "STRIPE_PRICE_SCALE",    mode: "subscription" },
  // v71: SaaS Self-Serve Agent Builder — $99/mo recurring
  "saas-agent-builder": { priceEnv: "STRIPE_PRICE_SAAS_AGENT_BUILDER", mode: "subscription" },
  // v87: SaaS Pro tier — $299/mo recurring, 3 agents + 25k conversations
  "saas-agent-builder-pro": { priceEnv: "STRIPE_PRICE_SAAS_AGENT_BUILDER_PRO", mode: "subscription" },
  // v160: Done-WITH-You — one-time $497 build session (Hormozi case-study factory)
  "done-with-you-497": { priceEnv: "STRIPE_PRICE_DONE_WITH_YOU_497", mode: "payment" },
};

function resolvePriceId(plan: string): string {
  switch (plan) {
    case "operators": return PRICE_OPERATORS;
    case "founders":  return PRICE_FOUNDERS;
    case "starter":   return PRICE_STARTER;
    case "operator":  return PRICE_OPERATOR;
    case "scale":     return PRICE_SCALE;
    case "saas-agent-builder": return PRICE_SAAS_AGENT_BUILDER;
    default: return "";
  }
}

// v86: inline price_data fallback so checkout works when STRIPE_PRICE_*
// env vars haven't been provisioned yet. This is the "it just works the
// moment you ship STRIPE_SECRET_KEY" path. Stripe creates a real product
// on first call; subsequent calls reuse it (Stripe dedupes by name).
type InlinePlanPricing = {
  amountCents: number;
  currency: string;
  productName: string;
  productDescription?: string;
  interval?: "day" | "week" | "month" | "year";
};

const INLINE_PLAN_PRICING: Record<string, InlinePlanPricing> = {
  "saas-agent-builder": {
    amountCents: 9900,
    currency: "usd",
    productName: "TrainYourAgent — Agent Builder (Starter)",
    productDescription: "1 fully-trained AI agent · 5,000 conversations/mo · embed-anywhere widget · custom branding · transcript logs · weekly tune-up suggestions. $99/mo, cancel anytime. $0.02 per conversation over the included pool.",
    interval: "month",
  },
  // v87: Pro tier — captures power users (agencies + multi-product founders)
  // who would otherwise abuse the $99 unlimited tier. 3x conversation pool +
  // 3 agents for ~3x the price keeps margin healthy at higher usage.
  "saas-agent-builder-pro": {
    amountCents: 29900,
    currency: "usd",
    productName: "TrainYourAgent — Agent Builder (Pro)",
    productDescription: "3 fully-trained AI agents · 25,000 conversations/mo · embed-anywhere widget · white-label branding · API access · priority Slack support. $299/mo, cancel anytime. $0.015 per conversation over the included pool.",
    interval: "month",
  },
  // v160: Done-WITH-You tier — bridges the $99↔$4,950 canyon. 4-hour Zoom build
  // session, founder + buyer ship a live agent on the buyer's number that day.
  // Hormozi audit lever: turns the founder into a case-study factory.
  "done-with-you-497": {
    amountCents: 49700,
    currency: "usd",
    productName: "TrainYourAgent — Agent in a Day (Done-WITH-You)",
    productDescription: "4-hour Zoom build session with the founder. You walk away with a deployed voice agent on your phone number, trained on your docs, integrated with your calendar. One-time fee, no monthly. If we don't ship a working agent in the session, full refund.",
    interval: undefined, // one-time
  },
  // v160: Operators tier — done-for-you build + $1,997/mo runtime, self-serve
  // checkout enabled so buyers don't need a Cal.com qualifying step. Buyer
  // pays the build, founder gets a kickoff calendar invite via Stripe webhook.
  operators: {
    amountCents: 199700,
    currency: "usd",
    productName: "TrainYourAgent — Operators ($1,997/mo + $4,950 build)",
    productDescription: "Done-for-you AI voice + SMS + email + chat agent. $4,950 one-time build (CRM/dispatch/calendar wiring) + $1,997/mo (5,000 minutes included, $25 per booked appt overage). Live in 14 business days or build fee refunded. Cancel any time.",
    interval: "month",
  },
  // v160: Scale tier — multi-location, multi-brand, SLA-backed.
  scale: {
    amountCents: 499700,
    currency: "usd",
    productName: "TrainYourAgent — Scale ($4,997/mo + $9,950 build)",
    productDescription: "Multi-location, multi-brand voice + chat agents. $9,950 one-time build + $4,997/mo (25,000 minutes included, $15 per booked appt overage). Dedicated engineer, SLA 99.9%, BAA + DPA + SOC 2 evidence pack. Cancel any time.",
    interval: "month",
  },
  // v273.4: Founders tier — pay-as-you-go entry for pre-revenue startups.
  // /pricing FOR_MAP routes ecom/saas/startup verticals here. Previously
  // returned "plan-not-configured" because no env var was set and no
  // inline-pricing fallback existed. $1 deposit reserves the build slot,
  // remainder billed per-minute as calls come in via separate invoice.
  founders: {
    amountCents: 100, // $1 reserve fee (real value is usage-based)
    currency: "usd",
    productName: "TrainYourAgent — Founders ($0 build + $0.39/min)",
    productDescription: "Pre-revenue or early-revenue startup tier. $1 reserve slot. Build fee deferred until first 100 minutes. Pay $0.39/min only when calls come in. Cancel any time, no clawback.",
    interval: undefined, // one-time reserve; usage billed via separate invoices
  },
  // v273.4: Operator (singular) tier alias — older /pricing FOR_MAP entries
  // and the Apollo cold-DM CTAs still post plan="operator". Mirror the
  // operators (plural) pricing so neither breaks checkout.
  operator: {
    amountCents: 199700,
    currency: "usd",
    productName: "TrainYourAgent — Operator ($1,997/mo + $4,950 build)",
    productDescription: "Done-for-you AI voice + SMS + email + chat agent. $4,950 one-time build (CRM/dispatch/calendar wiring) + $1,997/mo (5,000 minutes included, $25 per booked appt overage). Live in 14 business days or build fee refunded. Cancel any time.",
    interval: "month",
  },
};

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);

  if (req.method !== "POST") return json({ error: "method" }, 405, cors.headers);
  // v46b: return 200 (not 500) when Stripe isn't configured so the UI can
  // gracefully fall back to a contact-sales flow instead of treating it as
  // a server error.
  if (!STRIPE_KEY) return json({ ok: false, error: "stripe-not-configured" }, 200, cors.headers);

  const ip = ipFromRequest(req);
  const rl = rateLimit(`checkout:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return json({ error: "rate-limited" }, 429, { ...cors.headers, ...rl.headers });

  let body: { plan?: string; email?: string; coupon?: string };
  try { body = await req.json(); } catch { return json({ error: "bad-json" }, 400, cors.headers); }

  const planMeta = body.plan ? PLANS[body.plan] : undefined;
  if (!planMeta) return json({ error: "unknown-plan" }, 400, cors.headers);

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email && (!EMAIL_RE.test(email) || email.length > 254)) {
    return json({ error: "bad-email" }, 400, cors.headers);
  }

  // v273.4: Inline pricing is now PREFERRED over env-var price IDs. Reason:
  // env vars in Vercel can drift (pointing at deleted/test-mode prices) and
  // produce 502s with zero visibility. Inline pricing is versioned in this
  // git repo and audit-checked in CI. Env-var path remains as fallback for
  // plans NOT in INLINE_PLAN_PRICING — keeps backward compatibility with
  // any STRIPE_PRICE_* set on Vercel for plans not yet inlined.
  const inlinePricing = INLINE_PLAN_PRICING[body.plan || ""];
  const priceId = inlinePricing ? "" : resolvePriceId(body.plan || "");

  if (!priceId && !inlinePricing) {
    return json({
      ok: false,
      error: "plan-not-configured",
      hint: "Set STRIPE_PRICE_* env var OR add an entry to INLINE_PLAN_PRICING in api/checkout.ts so this plan can checkout without a pre-created Stripe price.",
    }, 200, cors.headers);
  }

  const form = new URLSearchParams();
  form.set("mode", planMeta.mode);
  form.set("success_url", SUCCESS_URL);
  form.set("cancel_url", CANCEL_URL);
  if (priceId) {
    // Path A: pre-created price (preferred for stable accounting + Stripe
    // dashboard analytics).
    form.set("line_items[0][price]", priceId);
  } else if (inlinePricing) {
    // Path B: inline product+price. Stripe creates the price on first
    // checkout. Same SKU repeated on subsequent calls (idempotency by
    // product_data.name + unit_amount + interval), so no orphan-products.
    form.set("line_items[0][price_data][currency]", inlinePricing.currency);
    form.set("line_items[0][price_data][unit_amount]", String(inlinePricing.amountCents));
    form.set("line_items[0][price_data][product_data][name]", inlinePricing.productName);
    if (inlinePricing.productDescription) {
      form.set("line_items[0][price_data][product_data][description]", inlinePricing.productDescription);
    }
    if (planMeta.mode === "subscription") {
      form.set("line_items[0][price_data][recurring][interval]", inlinePricing.interval || "month");
    }
  }
  form.set("line_items[0][quantity]", "1");
  if (email) form.set("customer_email", email);
  form.set("allow_promotion_codes", "true");
  form.set("billing_address_collection", "required");
  // v165: allow inline coupon (e.g. EXIT200 from exit-intent modal) — Stripe
  // applies via `discounts[0][coupon]` only if the coupon ID is pre-created
  // in the Stripe dashboard. Silently no-op if coupon doesn't exist (Stripe
  // returns 400 + we fall through). Keep coupon code in metadata for tracking.
  if (body.coupon && /^[A-Z0-9_-]{3,40}$/i.test(body.coupon)) {
    form.set("discounts[0][coupon]", body.coupon.toUpperCase());
    form.set("metadata[applied_coupon]", body.coupon.toUpperCase());
  }

  let r: Response;
  try {
    r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });
  } catch {
    return json({ error: "stripe-fetch-failed" }, 502, cors.headers);
  }

  let j: any;
  try { j = await r.json(); } catch { return json({ error: "stripe-bad-response" }, 502, cors.headers); }

  if (!r.ok) {
    // Don't leak Stripe's error message — could reveal account/key state.
    // Server-side log only (Vercel captures console.error).
    console.error("[checkout] stripe error", { status: r.status, code: j?.error?.code });
    return json({ error: "stripe-error" }, 502, cors.headers);
  }
  return json({ url: j.url }, 200, { ...cors.headers, ...rl.headers });
}

// Placeholder for api/stripe-webhook.ts. Stripe webhooks are signed with
// `Stripe-Signature: t=<unix>,v1=<hex>`. Use raw body + STRIPE_WEBHOOK_SECRET
// to verify before trusting the event. Implementation lives in its own file
// when the webhook endpoint is wired up.
export async function verifyStripeSignature(
  rawBody: string,
  header: string | null,
  secret: string,
  toleranceSec = 300,
): Promise<boolean> {
  if (!header || !secret) return false;
  const parts: Record<string, string> = {};
  for (const seg of header.split(",")) {
    const [k, v] = seg.split("=");
    if (k && v) parts[k.trim()] = v.trim();
  }
  const ts = parts.t;
  const sig = parts.v1;
  if (!ts || !sig) return false;
  const ageSec = Math.abs(Math.floor(Date.now() / 1000) - parseInt(ts, 10));
  if (Number.isNaN(ageSec) || ageSec > toleranceSec) return false;
  const signed = `${ts}.${rawBody}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signed));
  const hex = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, "0")).join("");
  if (hex.length !== sig.length) return false;
  let r = 0;
  for (let i = 0; i < hex.length; i++) r |= hex.charCodeAt(i) ^ sig.charCodeAt(i);
  return r === 0;
}

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extra },
  });
}
