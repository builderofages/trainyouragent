// api/portal/magic-link.ts
// v76-a: Customer-portal passwordless login. POST { email } → Supabase OTP.
// Returns 200 regardless of whether the email exists (prevent enumeration).

import { rateLimit, ipFromRequest } from "../_lib/rate-limit.js";

export const config = { runtime: "edge" };

const SUPA_URL = process.env.SUPABASE_URL || "";
const SUPA_ANON = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
const SITE_URL = process.env.PUBLIC_SITE_URL || "https://trainyouragent.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "method_not_allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  // Per-IP rate limit: 6/hour
  const ip = ipFromRequest(req);
  const rl = await rateLimit(`portal-magic:${ip}`, 6, 60 * 60 * 1000);
  if (!rl.ok) {
    return new Response(JSON.stringify({ ok: false, error: "rate_limited" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "bad_json" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: "invalid_email" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  if (!SUPA_URL || !SUPA_ANON) {
    // Degrade gracefully — surface a useful error to the user.
    return new Response(
      JSON.stringify({ ok: false, error: "auth_not_configured" }),
      { status: 503, headers: { "content-type": "application/json" } }
    );
  }

  // Supabase Auth OTP. shouldCreateUser=false so prospects can't self-onboard.
  // Customers are pre-created in `tya_customers` when their contract is signed.
  const res = await fetch(`${SUPA_URL}/auth/v1/otp`, {
    method: "POST",
    headers: {
      apikey: SUPA_ANON,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      create_user: false,
      options: {
        email_redirect_to: `${SITE_URL}/portal/auth-callback`,
        should_create_user: false,
      },
    }),
  });

  // Always return 200 to prevent email-enumeration. Log server-side only.
  if (!res.ok) {
    // Surface non-422 errors for debugging while still hiding from end users.
    console.warn("[portal/magic-link] supabase non-ok", res.status, await res.text().catch(() => ""));
  }

  return new Response(
    JSON.stringify({ ok: true, message: "If that email is a customer account, we sent a sign-in link." }),
    { status: 200, headers: { "content-type": "application/json" } }
  );
}
