// api/cron/template-nurture.ts — v192
//
// Daily cron. Sends Day-3 + Day-7 follow-up emails to prospects whose
// /template/[niche] link was sent but who haven't booked. Each prospect
// only gets one Day-3 and one Day-7 nurture, ever. Booked or opted-out
// prospects are skipped.
//
// Vercel cron entry (in vercel.json):
//   { "path": "/api/cron/template-nurture?token=$ADMIN_TOKEN",
//     "schedule": "0 15 * * *" }
//   — 15:00 UTC ≈ 10am ET, before most US prospects open inboxes.
//
// Auth: ?token=$ADMIN_TOKEN.
//
// Required env: ADMIN_TOKEN, RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY.

import { getSupabase, supabaseConfigured } from "../_lib/supabase.js";
import { sendEmail } from "../_lib/resend.js";
import { checkAdmin } from "../_lib/admin-auth.js";
import { signTag } from "../_lib/sign.js";

export const config = { runtime: "edge" };

const SITE_ORIGIN = "https://www.trainyouragent.com";

type SendRow = {
  id: string;
  prospect_company: string;
  prospect_email: string | null;
  prospect_name: string | null;
  prospect_city: string | null;
  niche: string;
  niche_label: string | null;
  channel: string;
  sent_at: string;
  opened_at: string | null;
  booked_at: string | null;
  last_nurture_template: string | null;
  first_touch_sent_at: string | null;
  meta: { email_source?: string } | null;
};

type Template = "day0" | "day3" | "day7";

// v199 — CAN-SPAM § 5(a)(5): every commercial email MUST include a valid
// physical postal address of the sender. Read from env so it can be moved
// without redeploying every email template change.
const SENDER_NAME    = process.env.SENDER_LEGAL_NAME    || "TrainYourAgent LLC";
const SENDER_ADDRESS = process.env.SENDER_POSTAL_ADDRESS || "Tampa Bay, FL · USA";

function renderEmail(co: string, template: Template, niche_label: string, link: string, opened: boolean, unsubLink: string): { subject: string; html: string } {
  // CAN-SPAM compliant footer — physical address + clear opt-out + sender ID
  const unsubFoot = `
<p style="margin-top:28px;font-size:12px;color:#94A3B8;line-height:1.5">
Not interested? <a href="${unsubLink}" style="color:#94A3B8;text-decoration:underline">One-click unsubscribe</a> — or reply STOP and I'll remove you manually.
</p>
<p style="margin-top:10px;font-size:11px;color:#B5C0D0;line-height:1.5;border-top:1px solid #E5E9EE;padding-top:10px">
${SENDER_NAME} · ${SENDER_ADDRESS}<br/>
You're receiving this because we identified ${co} as a ${niche_label.toLowerCase()} business that may benefit from a free AI-receptionist preview. We sourced your public business listing; no personal data was used. <a href="${unsubLink}" style="color:#B5C0D0;text-decoration:underline">Stop these emails forever</a>.
</p>`;
  if (template === "day0") {
    return {
      subject: `${co} — built you a free ${niche_label.toLowerCase()} site preview`,
      html: `<div style="font-family: -apple-system, system-ui, sans-serif; font-size: 15px; line-height: 1.55; color: #0B1B2B; max-width: 540px;">
<p>Hi — Alexander here, founder of TrainYourAgent.</p>
<p>Built you a free, fully-branded preview of what a 2026 ${niche_label.toLowerCase()} site could look like for ${co} — with an AI phone line that answers 24/7 and books work automatically. Most operators in your space lose 30-50% of their inbound to voicemail; this is the line that catches it.</p>
<p>It's already live and personalized — no signup, no form:</p>
<p><a href="${link}" style="display:inline-block;padding:12px 24px;border-radius:10px;background:#042C53;color:#fff;text-decoration:none;font-weight:600;">See ${co}'s preview →</a></p>
<p>Tap the mic on the page and the AI receptionist will greet you by name. The chat below it actually responds in character.</p>
<p>If it lands, hit reply and I'll spec out what it'd take to get a real one on your phone line in 10 days. If not, no follow-up needed — but I'll send one short note in a few days in case it got buried.</p>
<p>— Alexander<br/>TrainYourAgent</p>
${unsubFoot}
</div>`,
    };
  }
  if (template === "day3") {
    return {
      subject: `${co} — quick follow-up on your ${niche_label.toLowerCase()} site`,
      html: `<div style="font-family: -apple-system, system-ui, sans-serif; font-size: 15px; line-height: 1.55; color: #0B1B2B; max-width: 540px;">
<p>Hi — Alexander here.</p>
<p>${opened ? `Saw you opened the preview I built for ${co}` : `Sent over a free preview site for ${co} a few days ago`} — wanted to make sure you didn't miss it.</p>
<p>The short version: it's a real ${niche_label.toLowerCase()} site with an AI phone line that answers 24/7 and books work automatically. Most operators in your space lose 30-50% of their inbound to voicemail — this is the line that catches it.</p>
<p><a href="${link}" style="display:inline-block;padding:11px 22px;border-radius:10px;background:#042C53;color:#fff;text-decoration:none;font-weight:600;">Take another look →</a></p>
<p>— Alexander<br/>TrainYourAgent</p>
${unsubFoot}
</div>`,
    };
  }
  // day7
  return {
    subject: `${co} — last note (then I'll stop)`,
    html: `<div style="font-family: -apple-system, system-ui, sans-serif; font-size: 15px; line-height: 1.55; color: #0B1B2B; max-width: 540px;">
<p>Hi — last touch from me on the ${co} preview.</p>
<p>If the timing's off, totally fine — I'll move on. If it's interesting and you just haven't had 15 minutes, here's the link one more time:</p>
<p><a href="${link}" style="display:inline-block;padding:11px 22px;border-radius:10px;background:#042C53;color:#fff;text-decoration:none;font-weight:600;">${co}'s preview →</a></p>
<p>${opened ? `(You opened it on day 0 — figured I'd resurface in case it got buried.)` : `(Quick 60-second look. No deck, no spam.)`}</p>
<p>— Alexander<br/>TrainYourAgent</p>
${unsubFoot}
</div>`,
  };
}

function buildLink(company: string, city: string | null, niche: string): string {
  const p = new URLSearchParams();
  p.set("company", company);
  if (city) p.set("city", city);
  return `${SITE_ORIGIN}/template/${niche}?${p.toString()}`;
}

export default async function handler(req: Request): Promise<Response> {
  if (!checkAdmin(req)) {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
      status: 401, headers: { "content-type": "application/json" },
    });
  }

  const startedAt = new Date().toISOString();
  if (!supabaseConfigured()) {
    return new Response(JSON.stringify({ ok: true, ts: startedAt, considered: 0, sent: 0, reason: "supabase-not-configured" }), {
      status: 200, headers: { "content-type": "application/json" },
    });
  }
  const sb = getSupabase();
  if (!sb) {
    return new Response(JSON.stringify({ ok: false, error: "supabase-init-failed" }), {
      status: 500, headers: { "content-type": "application/json" },
    });
  }

  // Two pulls:
  //   1. autosourced rows that have NEVER had a first touch — these get
  //      the Day-0 introduction email immediately (or within the next cron
  //      tick, max ~24h after sourcing).
  //   2. All unbooked, non-stopped sends from 2-9 days ago that have an
  //      email — for Day-3 / Day-7 follow-ups (manual + autosourced both).
  const nineDaysAgo  = new Date(Date.now() - 9 * 86400_000).toISOString();
  const twoDaysAgo   = new Date(Date.now() - 2 * 86400_000).toISOString();

  const day0Q = sb
    .from("template_sends")
    .select("id, prospect_company, prospect_email, prospect_name, prospect_city, niche, niche_label, channel, sent_at, opened_at, booked_at, last_nurture_template, first_touch_sent_at, meta")
    .eq("channel", "autosourced")
    .is("first_touch_sent_at", null)
    .is("booked_at", null)
    .is("nurture_stopped_reason", null)
    .not("prospect_email", "is", null)
    .limit(50);

  const followUpQ = sb
    .from("template_sends")
    .select("id, prospect_company, prospect_email, prospect_name, prospect_city, niche, niche_label, channel, sent_at, opened_at, booked_at, last_nurture_template, first_touch_sent_at, meta")
    .is("booked_at", null)
    .is("nurture_stopped_reason", null)
    .gte("sent_at", nineDaysAgo)
    .lte("sent_at", twoDaysAgo)
    .not("prospect_email", "is", null);

  const [day0R, followUpR] = await Promise.all([day0Q, followUpQ]);

  const data = [...((day0R.data || []) as SendRow[]), ...((followUpR.data || []) as SendRow[])];
  const seen = new Set<string>();
  const dedup = data.filter((r) => seen.has(r.id) ? false : (seen.add(r.id), true));
  const error = day0R.error || followUpR.error;

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: "select-failed", detail: error.message }), {
      status: 500, headers: { "content-type": "application/json" },
    });
  }

  const rows = dedup;
  const out: Array<{ id: string; template: Template; result: "sent" | "skipped" | "error"; reason?: string }> = [];
  let sentCount = 0;

  // v199 — Resend domain-reputation guard. Pattern-guessed emails
  // (info@domain — we never verified) bounce 2-5x more than discovered
  // addresses. Sending Day-0 to them at scale tanks sender reputation,
  // which then nukes deliverability for REAL prospects.
  // Default: gate them. Operator can opt in per env (acknowledging the
  // reputation cost) once their domain has volume + a good baseline.
  const ALLOW_GUESS = process.env.SEND_TO_PATTERN_GUESSES === "1";
  // Global per-day send cap — even with a good reputation, bursting hundreds
  // in one day to brand-new addresses triggers Gmail/MS spam filters. Tune
  // up over time as the domain ages.
  const MAX_SENDS_PER_RUN = parseInt(process.env.NURTURE_MAX_PER_RUN || "40", 10) || 40;
  let sendsThisRun = 0;

  for (const r of rows) {
    if (!r.prospect_email) { out.push({ id: r.id, template: "day3", result: "skipped", reason: "no-email" }); continue; }
    if (sendsThisRun >= MAX_SENDS_PER_RUN) { out.push({ id: r.id, template: "day3", result: "skipped", reason: "global-cap-hit" }); continue; }
    const ageDays = (Date.now() - new Date(r.sent_at).getTime()) / 86400_000;
    const isGuess = (r.meta?.email_source || "") === "pattern-guess";
    let template: Template | null = null;
    // Day-0 fires once, for autosourced rows that haven't had a first touch.
    if (r.channel === "autosourced" && !r.first_touch_sent_at) template = "day0";
    else if (ageDays >= 7 && r.last_nurture_template !== "day7") template = "day7";
    else if (ageDays >= 3 && ageDays < 7 && r.last_nurture_template !== "day3" && r.last_nurture_template !== "day7") template = "day3";
    if (!template) { out.push({ id: r.id, template: "day3", result: "skipped", reason: "no-template-due" }); continue; }
    // Pattern-guess gate: don't send unless explicit opt-in OR the prospect
    // has actually opened our link (proof the address is real).
    if (isGuess && !ALLOW_GUESS && !r.opened_at) {
      // Mark as stopped so we never reconsider this row.
      await sb.from("template_sends").update({ nurture_stopped_reason: "skipped-guess" }).eq("id", r.id);
      out.push({ id: r.id, template, result: "skipped", reason: "pattern-guess-no-opt-in" });
      continue;
    }

    const link  = buildLink(r.prospect_company, r.prospect_city, r.niche);
    const co    = r.prospect_company;
    const label = r.niche_label || r.niche;
    const sig   = await signTag(r.id, process.env.ADMIN_TOKEN || "");
    const unsub = `${SITE_ORIGIN}/api/template-optout?id=${encodeURIComponent(r.id)}&sig=${sig}`;
    const { subject, html } = renderEmail(co, template, label, link, !!r.opened_at, unsub);

    try {
      const res = await sendEmail({
        to: r.prospect_email,
        from: process.env.LEAD_NOTIFY_FROM || "Alexander <alexander@trainyouragent.com>",
        subject,
        html,
        replyTo: "trainyouragent@gmail.com",
        tag: `template-nurture-${template}`,
        // RFC 8058: one-click unsubscribe — Gmail/Outlook surface a native
        // "Unsubscribe" button next to the sender name. POST handler at
        // /api/template-optout accepts both GET (in-body click) and POST
        // (the List-Unsubscribe-Post one-click flow).
        headers: {
          "List-Unsubscribe": `<${unsub}>, <mailto:trainyouragent@gmail.com?subject=unsubscribe>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
      if (!res.ok) {
        out.push({ id: r.id, template, result: "error", reason: res.error || "resend-failed" });
        continue;
      }
      const patch: Record<string, unknown> = {
        last_nurture_template: template,
        last_nurture_at: new Date().toISOString(),
      };
      if (template === "day0") patch.first_touch_sent_at = new Date().toISOString();
      await sb.from("template_sends").update(patch).eq("id", r.id);
      sentCount++;
      sendsThisRun++;
      out.push({ id: r.id, template, result: "sent" });
    } catch (e) {
      out.push({ id: r.id, template, result: "error", reason: (e as Error).message });
    }
  }

  return new Response(JSON.stringify({ ok: true, ts: startedAt, considered: rows.length, sent: sentCount, details: out }), {
    status: 200, headers: { "content-type": "application/json" },
  });
}
