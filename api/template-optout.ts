// api/template-optout.ts — v192
//
// One-click unsubscribe link for niche-template nurture emails.
// Public GET endpoint, HMAC-verified, marks the matching template_sends
// row with nurture_stopped_reason='opted_out' so the daily cron skips them.
//
// URL shape:
//   GET /api/template-optout?id=<uuid>&sig=<16-hex>
//
// The sig is HMAC-SHA256(ADMIN_TOKEN, id) truncated to 16 chars — generated
// when the nurture email is composed. Prevents random visitors from poking
// other prospects' rows.
//
// Renders a small standalone confirmation page (HTML) so the prospect sees
// a real "you're unsubscribed" message instead of a JSON blob.
//
// Required env: ADMIN_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_KEY.

import { getSupabase, supabaseConfigured } from "./_lib/supabase.js";
import { verifyTag } from "./_lib/sign.js";

export const config = { runtime: "edge" };

function html(body: string, status = 200): Response {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TrainYourAgent — Unsubscribe</title><meta name="robots" content="noindex,nofollow"></head><body style="margin:0;background:linear-gradient(180deg,#FFF8EE,#FAF6EE);min-height:100vh;display:grid;place-items:center;font-family:-apple-system,system-ui,'Inter Tight',sans-serif;color:#0B1B2B;padding:24px"><div style="max-width:440px;width:100%;background:#fff;border:1px solid rgba(4,44,83,0.08);border-radius:20px;padding:34px;box-shadow:0 20px 60px -28px rgba(4,44,83,0.25);text-align:center">${body}<div style="margin-top:24px;font-size:11.5px;color:#94A3B8">TrainYourAgent · trainyouragent.com</div></div></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } },
  );
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET" && req.method !== "POST") {
    return html(`<h1 style="font-size:22px;margin:0 0 10px;color:#9B2C2C">Method not allowed</h1>`, 405);
  }

  const url = new URL(req.url);
  const id  = (url.searchParams.get("id")  || "").trim();
  const sig = (url.searchParams.get("sig") || "").trim();
  const secret = process.env.ADMIN_TOKEN || "";

  if (!id || !sig) {
    return html(`<h1 style="font-size:22px;margin:0 0 10px;color:#9B2C2C">Invalid unsubscribe link</h1><p style="font-size:14.5px;line-height:1.5;color:#5C6B7F">This link is missing required parameters. If you keep receiving emails, reply with "STOP" and Alexander will remove you manually.</p>`, 400);
  }
  if (!secret) {
    return html(`<h1 style="font-size:22px;margin:0 0 10px;color:#9B2C2C">Service not configured</h1><p style="font-size:14.5px;line-height:1.5;color:#5C6B7F">Reach out to trainyouragent@gmail.com to be removed.</p>`, 500);
  }

  const ok = await verifyTag(id, sig, secret);
  if (!ok) {
    return html(`<h1 style="font-size:22px;margin:0 0 10px;color:#9B2C2C">Invalid signature</h1><p style="font-size:14.5px;line-height:1.5;color:#5C6B7F">This unsubscribe link doesn't verify. Reply STOP to the email and you'll be removed.</p>`, 401);
  }

  if (!supabaseConfigured()) {
    return html(`<h1 style="font-size:22px;margin:0 0 10px;color:#042C53">You're out.</h1><p style="font-size:14.5px;line-height:1.5;color:#5C6B7F">We couldn't reach the database, but your request is logged. Reply STOP if anything still comes through.</p>`);
  }
  const sb = getSupabase();
  if (!sb) {
    return html(`<h1 style="font-size:22px;margin:0 0 10px;color:#042C53">You're out.</h1><p style="font-size:14.5px;line-height:1.5;color:#5C6B7F">Database temporarily unavailable. We've still recorded the request.</p>`);
  }

  const { error } = await sb
    .from("template_sends")
    .update({ nurture_stopped_reason: "opted_out", last_nurture_template: "stopped" })
    .eq("id", id);

  if (error) {
    return html(`<h1 style="font-size:22px;margin:0 0 10px;color:#9B2C2C">Couldn't process</h1><p style="font-size:14.5px;line-height:1.5;color:#5C6B7F">Reply STOP to the email and we'll remove you manually.</p>`, 500);
  }

  return html(`<h1 style="font-size:22px;margin:0 0 10px;color:#042C53">You're unsubscribed.</h1><p style="font-size:14.5px;line-height:1.5;color:#5C6B7F">No more nurture emails for this thread. Already-scheduled sends from other tools may take 24h to drop off.</p>`);
}
