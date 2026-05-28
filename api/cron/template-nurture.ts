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
};

type Template = "day3" | "day7";

function renderEmail(co: string, template: Template, niche_label: string, link: string, opened: boolean): { subject: string; html: string } {
  if (template === "day3") {
    return {
      subject: `${co} — quick follow-up on your ${niche_label.toLowerCase()} site`,
      html: `<div style="font-family: -apple-system, system-ui, sans-serif; font-size: 15px; line-height: 1.55; color: #0B1B2B; max-width: 540px;">
<p>Hi — Alexander here.</p>
<p>${opened ? `Saw you opened the preview I built for ${co}` : `Sent over a free preview site for ${co} a few days ago`} — wanted to make sure you didn't miss it.</p>
<p>The short version: it's a real ${niche_label.toLowerCase()} site with an AI phone line that answers 24/7 and books work automatically. Most operators in your space lose 30-50% of their inbound to voicemail — this is the line that catches it.</p>
<p><a href="${link}" style="display:inline-block;padding:11px 22px;border-radius:10px;background:#042C53;color:#fff;text-decoration:none;font-weight:600;">Take another look →</a></p>
<p>If it's not for you, no worries — reply STOP and I'll remove you.</p>
<p>— Alexander<br/>TrainYourAgent</p>
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

  // Window: pull all unbooked, non-stopped sends from 2-9 days ago that
  // have an email address. We then bucket per-template in-memory.
  const nineDaysAgo  = new Date(Date.now() - 9 * 86400_000).toISOString();
  const twoDaysAgo   = new Date(Date.now() - 2 * 86400_000).toISOString();

  const { data, error } = await sb
    .from("template_sends")
    .select("id, prospect_company, prospect_email, prospect_name, prospect_city, niche, niche_label, channel, sent_at, opened_at, booked_at, last_nurture_template")
    .is("booked_at", null)
    .is("nurture_stopped_reason", null)
    .gte("sent_at", nineDaysAgo)
    .lte("sent_at", twoDaysAgo)
    .not("prospect_email", "is", null);

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: "select-failed", detail: error.message }), {
      status: 500, headers: { "content-type": "application/json" },
    });
  }

  const rows = (data || []) as SendRow[];
  const out: Array<{ id: string; template: Template; result: "sent" | "skipped" | "error"; reason?: string }> = [];
  let sentCount = 0;

  for (const r of rows) {
    if (!r.prospect_email) { out.push({ id: r.id, template: "day3", result: "skipped", reason: "no-email" }); continue; }
    const ageDays = (Date.now() - new Date(r.sent_at).getTime()) / 86400_000;
    let template: Template | null = null;
    if (ageDays >= 7 && r.last_nurture_template !== "day7") template = "day7";
    else if (ageDays >= 3 && ageDays < 7 && r.last_nurture_template !== "day3" && r.last_nurture_template !== "day7") template = "day3";
    if (!template) { out.push({ id: r.id, template: "day3", result: "skipped", reason: "no-template-due" }); continue; }

    const link  = buildLink(r.prospect_company, r.prospect_city, r.niche);
    const co    = r.prospect_company;
    const label = r.niche_label || r.niche;
    const { subject, html } = renderEmail(co, template, label, link, !!r.opened_at);

    try {
      const res = await sendEmail({
        to: r.prospect_email,
        from: process.env.LEAD_NOTIFY_FROM || "Alexander <alexander@trainyouragent.com>",
        subject,
        html,
        replyTo: "trainyouragent@gmail.com",
      });
      if (!res.ok) {
        out.push({ id: r.id, template, result: "error", reason: res.error || "resend-failed" });
        continue;
      }
      await sb.from("template_sends").update({
        last_nurture_template: template,
        last_nurture_at: new Date().toISOString(),
      }).eq("id", r.id);
      sentCount++;
      out.push({ id: r.id, template, result: "sent" });
    } catch (e) {
      out.push({ id: r.id, template, result: "error", reason: (e as Error).message });
    }
  }

  return new Response(JSON.stringify({ ok: true, ts: startedAt, considered: rows.length, sent: sentCount, details: out }), {
    status: 200, headers: { "content-type": "application/json" },
  });
}
