// api/portal/billing-portal.ts
// v76-a: Create a Stripe Billing Portal session for the current customer and
// return the URL. The portal page redirects the browser to it.
//
// Looks up the customer's `stripe_customer_id` from `tya_customers` via the
// service key (we trust the JWT email claim — RLS still gates the lookup).

export const config = { runtime: "edge" };

const SUPA_URL = process.env.SUPABASE_URL || "";
const SUPA_SERVICE = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "";
const SITE_URL = process.env.PUBLIC_SITE_URL || "https://trainyouragent.com";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function emailFromJwt(token: string): string {
  try {
    const payloadSeg = token.split(".")[1] || "";
    const b64 = payloadSeg.replace(/-/g, "+").replace(/_/g, "/");
    const j = JSON.parse(atob(b64));
    return String(j.email || "").toLowerCase();
  } catch {
    return "";
  }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json(405, { ok: false, error: "method_not_allowed" });
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return json(401, { ok: false, error: "missing_auth" });

  const token = auth.slice("Bearer ".length);
  const email = emailFromJwt(token);
  if (!email) return json(401, { ok: false, error: "no_email_in_jwt" });

  if (!SUPA_URL || !SUPA_SERVICE) return json(503, { ok: false, error: "db_not_configured" });
  if (!STRIPE_KEY) return json(503, { ok: false, error: "stripe_not_configured" });

  // Look up stripe_customer_id
  const lookup = await fetch(
    `${SUPA_URL}/rest/v1/tya_customers?email=eq.${encodeURIComponent(email)}&select=stripe_customer_id&limit=1`,
    {
      headers: { apikey: SUPA_SERVICE, authorization: `Bearer ${SUPA_SERVICE}` },
    }
  );
  if (!lookup.ok) return json(500, { ok: false, error: "customer_lookup_failed" });
  const rows = (await lookup.json()) as Array<{ stripe_customer_id?: string }>;
  const stripeId = rows[0]?.stripe_customer_id;
  if (!stripeId) {
    return json(404, {
      ok: false,
      error: "no_stripe_customer",
      message: "Billing isn't connected yet for this account. Contact alexander@trainyouragent.com.",
    });
  }

  // Create the billing portal session.
  const form = new URLSearchParams();
  form.set("customer", stripeId);
  form.set("return_url", `${SITE_URL}/portal/billing`);

  const session = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${STRIPE_KEY}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  if (!session.ok) {
    const text = await session.text().catch(() => "");
    return json(session.status, { ok: false, error: "stripe_error", detail: text.slice(0, 200) });
  }

  const data = (await session.json()) as { url?: string };
  if (!data.url) return json(500, { ok: false, error: "no_url_returned" });
  return json(200, { ok: true, url: data.url });
}
