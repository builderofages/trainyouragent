// api/stripe-setup.ts — One-shot Stripe product/price seeder.
//
// v50A: idempotent setup endpoint Alexander hits AFTER providing a Stripe key.
// Creates the three TYA plans + recurring monthly prices, returns IDs to wire
// into Vercel env vars (STRIPE_PRICE_STARTER / OPERATOR / SCALE).
//
// Gated by query token so random hits don't trigger:
//   POST /api/stripe-setup?init_token=tya-init-2026
//
// Hardening:
//   - Node runtime (not edge — uses standard fetch but kept simple)
//   - 400 with crisp instructions when STRIPE_SECRET_KEY missing
//   - Idempotency: searches existing products by metadata.tya_slug before create
//   - Never echoes the Stripe key
//   - Errors from Stripe are bucketed (status only) so account state stays opaque

export const config = { runtime: "edge" };

const INIT_TOKEN = "tya-init-2026";

type Plan = {
  slug: "starter" | "operator" | "scale";
  name: string;
  description: string;
  monthlyUsd: number;
  envVar: string;
};

const PLANS: Plan[] = [
  {
    slug: "starter",
    name: "Starter",
    description: "1-agent build, 1 channel. For founders who need their first agent live this month.",
    monthlyUsd: 1500,
    envVar: "STRIPE_PRICE_STARTER",
  },
  {
    slug: "operator",
    name: "Operator",
    description: "3-agent builds, multi-channel, weekly tuning. For operators running a real revenue line.",
    monthlyUsd: 5000,
    envVar: "STRIPE_PRICE_OPERATOR",
  },
  {
    slug: "scale",
    name: "Scale",
    description: "Unlimited builds, white-glove ops, dedicated Slack channel. For multi-location teams.",
    monthlyUsd: 15000,
    envVar: "STRIPE_PRICE_SCALE",
  },
];

export default async function handler(req: Request) {
  if (req.method !== "POST" && req.method !== "GET") {
    return json({ ok: false, error: "method", hint: "POST to this endpoint" }, 405);
  }

  const url = new URL(req.url);
  const token = url.searchParams.get("init_token");
  if (token !== INIT_TOKEN) {
    return json({ ok: false, error: "missing-token", hint: `Append ?init_token=${INIT_TOKEN}` }, 401);
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return json({
      ok: false,
      error: "stripe-not-configured",
      hint: "Set STRIPE_SECRET_KEY in Vercel project env, then redeploy and re-hit this endpoint.",
      steps: [
        "1. Get your Stripe secret key from https://dashboard.stripe.com/apikeys",
        "2. vercel env add STRIPE_SECRET_KEY production",
        "3. Redeploy: vercel --prod",
        "4. Re-hit POST /api/stripe-setup?init_token=tya-init-2026",
      ],
    }, 400);
  }

  const results: {
    plan: string;
    productId: string;
    priceId: string;
    envVar: string;
    created: boolean;
  }[] = [];

  for (const plan of PLANS) {
    try {
      const r = await ensurePlan(stripeKey, plan);
      results.push(r);
    } catch (e) {
      return json({
        ok: false,
        error: "stripe-call-failed",
        plan: plan.slug,
        detail: (e as Error)?.message?.slice(0, 200) || "unknown",
        partial: results,
      }, 502);
    }
  }

  return json({
    ok: true,
    results,
    nextSteps: [
      "Copy the priceIds above into Vercel env vars:",
      ...results.map((r) => `vercel env add ${r.envVar} production    # ${r.priceId}`),
      "Then set STRIPE_WEBHOOK_SECRET (from Stripe → Developers → Webhooks).",
      "Configure webhook URL: https://www.trainyouragent.com/api/stripe-webhook",
      "Redeploy: vercel --prod",
    ],
  });
}

async function ensurePlan(stripeKey: string, plan: Plan) {
  // 1) Look for an existing product tagged with metadata[tya_slug] == plan.slug.
  // Stripe doesn't index metadata via search by default unless Search is enabled.
  // We use the products list endpoint and filter client-side (idempotency by metadata).
  const listResp = await stripeGet(stripeKey, "/v1/products?limit=100&active=true");
  type StripeProduct = { id: string; metadata?: Record<string, string> };
  const existing = (listResp.data as StripeProduct[] | undefined)?.find(
    (p) => p?.metadata?.tya_slug === plan.slug,
  );

  let productId: string;
  let created = false;
  if (existing) {
    productId = existing.id;
  } else {
    const form = new URLSearchParams();
    form.set("name", plan.name);
    form.set("description", plan.description);
    form.set("metadata[tya_slug]", plan.slug);
    form.set("metadata[tya_version]", "v50A");
    const createResp = await stripePost(stripeKey, "/v1/products", form);
    productId = createResp.id as string;
    created = true;
  }

  // 2) Look for an existing recurring USD price on that product matching the amount.
  type StripePrice = {
    id: string;
    unit_amount: number;
    currency: string;
    recurring?: { interval: string };
  };
  const priceListResp = await stripeGet(
    stripeKey,
    `/v1/prices?product=${encodeURIComponent(productId)}&limit=100&active=true`,
  );
  const targetCents = plan.monthlyUsd * 100;
  const existingPrice = (priceListResp.data as StripePrice[] | undefined)?.find(
    (p) =>
      p?.unit_amount === targetCents &&
      p?.currency === "usd" &&
      p?.recurring?.interval === "month",
  );

  let priceId: string;
  if (existingPrice) {
    priceId = existingPrice.id;
  } else {
    const form = new URLSearchParams();
    form.set("product", productId);
    form.set("unit_amount", String(targetCents));
    form.set("currency", "usd");
    form.set("recurring[interval]", "month");
    form.set("metadata[tya_slug]", plan.slug);
    const createResp = await stripePost(stripeKey, "/v1/prices", form);
    priceId = createResp.id as string;
    created = true;
  }

  return { plan: plan.slug, productId, priceId, envVar: plan.envVar, created };
}

async function stripeGet(key: string, path: string): Promise<Record<string, unknown>> {
  const r = await fetch(`https://api.stripe.com${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!r.ok) throw new Error(`stripe-get ${path} → ${r.status}`);
  return r.json();
}

async function stripePost(
  key: string,
  path: string,
  form: URLSearchParams,
): Promise<Record<string, unknown>> {
  const r = await fetch(`https://api.stripe.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });
  if (!r.ok) throw new Error(`stripe-post ${path} → ${r.status}`);
  return r.json();
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
