// api/checkout.ts — Vercel serverless function. Stripe Checkout session creator.
// REQUIRES env: STRIPE_SECRET_KEY, STRIPE_PRICE_OPERATORS, STRIPE_PRICE_FOUNDERS_BUILD (optional)

export const config = { runtime: "edge" };

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const PRICE_OPERATORS = process.env.STRIPE_PRICE_OPERATORS || "";
const PRICE_FOUNDERS  = process.env.STRIPE_PRICE_FOUNDERS_BUILD || "";

const SUCCESS_URL = "https://trainyouragent.com/dashboard?checkout=ok";
const CANCEL_URL  = "https://trainyouragent.com/pricing?checkout=cancelled";

export default async function handler(req: Request) {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  if (!STRIPE_KEY) return json({ error: "stripe-not-configured" }, 500);

  const { plan, email } = await req.json();
  let priceId = "";
  let mode: "subscription" | "payment" = "subscription";
  if (plan === "operators") { priceId = PRICE_OPERATORS; mode = "subscription"; }
  else if (plan === "founders") { priceId = PRICE_FOUNDERS; mode = "payment"; }
  if (!priceId) return json({ error: "unknown-plan" }, 400);

  // Stripe expects application/x-www-form-urlencoded
  const form = new URLSearchParams();
  form.set("mode", mode);
  form.set("success_url", SUCCESS_URL);
  form.set("cancel_url", CANCEL_URL);
  form.set("line_items[0][price]", priceId);
  form.set("line_items[0][quantity]", "1");
  if (email) form.set("customer_email", email);
  form.set("allow_promotion_codes", "true");
  form.set("billing_address_collection", "required");

  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });
  const j = await r.json();
  if (!r.ok) return json({ error: j.error?.message || "stripe-error" }, 502);
  return json({ url: j.url });
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
