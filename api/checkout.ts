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
};

function resolvePriceId(plan: string): string {
  switch (plan) {
    case "operators": return PRICE_OPERATORS;
    case "founders":  return PRICE_FOUNDERS;
    case "starter":   return PRICE_STARTER;
    case "operator":  return PRICE_OPERATOR;
    case "scale":     return PRICE_SCALE;
    default: return "";
  }
}

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

  let body: { plan?: string; email?: string };
  try { body = await req.json(); } catch { return json({ error: "bad-json" }, 400, cors.headers); }

  const planMeta = body.plan ? PLANS[body.plan] : undefined;
  if (!planMeta) return json({ error: "unknown-plan" }, 400, cors.headers);

  const priceId = resolvePriceId(body.plan || "");
  if (!priceId) {
    return json({
      ok: false,
      error: "plan-not-configured",
      hint: "Run POST /api/stripe-setup?init_token=$STRIPE_SETUP_INIT_TOKEN to seed Stripe products, then set the returned price IDs as Vercel env vars.",
    }, 200, cors.headers);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email && (!EMAIL_RE.test(email) || email.length > 254)) {
    return json({ error: "bad-email" }, 400, cors.headers);
  }

  const form = new URLSearchParams();
  form.set("mode", planMeta.mode);
  form.set("success_url", SUCCESS_URL);
  form.set("cancel_url", CANCEL_URL);
  form.set("line_items[0][price]", priceId);
  form.set("line_items[0][quantity]", "1");
  if (email) form.set("customer_email", email);
  form.set("allow_promotion_codes", "true");
  form.set("billing_address_collection", "required");

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
