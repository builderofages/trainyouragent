// api/resend-webhook.ts — v199
//
// Receives Resend webhooks (bounces, complaints, delivery failures) and
// auto-stops the nurture sequence for the affected prospect. Critical for
// sender reputation: continuing to email hard-bounces gets the sending
// domain blacklisted by Gmail / MS / Yahoo.
//
// Resend webhook setup (manual, one-time, in Resend dashboard):
//   1. Resend → Webhooks → Create endpoint
//   2. URL:    https://www.trainyouragent.com/api/resend-webhook
//   3. Events: email.bounced, email.complained, email.delivery_delayed
//   4. (Optional) signing secret — set RESEND_WEBHOOK_SECRET; we verify HMAC.
//      If not set, we accept any request from a server-side caller (no
//      browser origin), which is a soft check but acceptable for v1.
//
// Required env: SUPABASE_URL, SUPABASE_SERVICE_KEY.
// Optional env: RESEND_WEBHOOK_SECRET.

import { getSupabase, supabaseConfigured } from "./_lib/supabase.js";

export const config = { runtime: "edge" };

const SECRET = process.env.RESEND_WEBHOOK_SECRET || "";

type ResendEvent = {
  type?: string;
  data?: {
    email_id?: string;
    to?: string[] | string;
    bounce?: { type?: string; subType?: string; message?: string };
    complaint?: { type?: string };
  };
};

function j(o: unknown, status = 200): Response {
  return new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });
}

async function verifyHmac(raw: string, sig: string): Promise<boolean> {
  if (!SECRET || !sig) return !SECRET; // when no secret, accept; when set, require
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const buf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw));
    const hex = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    // Resend sends sig as `t=...,v1=<hex>`; pull v1.
    const m = /v1=([a-f0-9]+)/i.exec(sig);
    const expected = m ? m[1] : sig.toLowerCase();
    if (expected.length !== hex.length) return false;
    let r = 0;
    for (let i = 0; i < hex.length; i++) r |= hex.charCodeAt(i) ^ expected.charCodeAt(i);
    return r === 0;
  } catch { return false; }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return j({ ok: false, error: "method" }, 405);
  // Reject browser-origin to prevent spray-and-pray opt-out attacks
  if (req.headers.get("origin")) return j({ ok: false, error: "no-browser" }, 403);

  const raw = await req.text();
  const sig = req.headers.get("svix-signature") || req.headers.get("resend-signature") || "";
  if (!(await verifyHmac(raw, sig))) return j({ ok: false, error: "bad-signature" }, 401);

  let event: ResendEvent = {};
  try { event = JSON.parse(raw); } catch { return j({ ok: false, error: "bad-json" }, 400); }

  const type = (event.type || "").toLowerCase();
  if (!type.includes("bounce") && !type.includes("complaint")) {
    return j({ ok: true, ignored: true, type });
  }

  const to = Array.isArray(event.data?.to) ? event.data?.to[0] : event.data?.to;
  const email = (to || "").toLowerCase().trim();
  if (!email) return j({ ok: true, ignored: true, reason: "no-recipient" });

  if (!supabaseConfigured()) return j({ ok: true, updated: false, reason: "supabase-not-configured" });
  const sb = getSupabase();
  if (!sb) return j({ ok: false, error: "supabase-init-failed" }, 500);

  // Bounces and complaints both stop the nurture sequence forever.
  const reason = type.includes("complaint") ? "complaint" : "bounced";
  const bounceType = event.data?.bounce?.type || "";
  // Only HARD bounces stop — soft bounces (mailbox full, rate-limited) are
  // transient and Resend will retry on its own.
  if (reason === "bounced" && bounceType && /soft|transient|temporary/i.test(bounceType)) {
    return j({ ok: true, ignored: true, reason: "soft-bounce" });
  }

  const { error, count } = await sb
    .from("template_sends")
    .update({ nurture_stopped_reason: reason }, { count: "exact" })
    .eq("prospect_email", email)
    .is("nurture_stopped_reason", null);

  if (error) return j({ ok: false, error: "update-failed", detail: error.message }, 500);
  return j({ ok: true, email, reason, stopped: count ?? 0 });
}
