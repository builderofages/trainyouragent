// api/_lib/resend.ts
// v52a: Tiny Resend transactional-email helper. Used by /api/lead (to send
// the lead-magnet PDF immediately after opt-in) and /api/nurture-tick (to
// drip the 5-touch nurture sequence). If RESEND_API_KEY isn't configured,
// every call no-ops and returns {ok:false, provider:"none"} so the site
// degrades gracefully — we still record the lead in Supabase + ping Slack.

const RESEND_KEY = process.env.RESEND_API_KEY || "";
const FROM = process.env.RESEND_FROM_EMAIL || "TrainYourAgent <onboarding@resend.dev>";
const REPLY_TO = process.env.RESEND_REPLY_TO || "alexander@trainyouragent.com";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tag?: string;
  /** Custom RFC 5322 headers. Use for List-Unsubscribe so Gmail/Outlook
   *  surface the native one-click "Unsubscribe" button. */
  headers?: Record<string, string>;
};

export type SendEmailResult = {
  ok: boolean;
  provider: "resend" | "none";
  id?: string;
  error?: string;
};

/**
 * Fire-and-forget transactional email via Resend. Never throws — always
 * resolves with a SendEmailResult so callers can log without try/catch.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (!RESEND_KEY) {
    return { ok: false, provider: "none", error: "RESEND_API_KEY not configured" };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: input.from || FROM,
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text || stripHtml(input.html),
        reply_to: input.replyTo || REPLY_TO,
        tags: input.tag ? [{ name: "category", value: input.tag }] : undefined,
        headers: input.headers,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, provider: "resend", error: `${res.status} ${body.slice(0, 200)}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, provider: "resend", id: data.id };
  } catch (e) {
    return { ok: false, provider: "resend", error: (e as Error).message };
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// --- Lead-magnet email body ----------------------------------------------

export function leadMagnetEmailHtml(opts: {
  firstName?: string;
  pdfUrl?: string;
  source: string;
}): { subject: string; html: string } {
  const name = (opts.firstName && opts.firstName.trim()) || "there";
  const pdf =
    opts.pdfUrl ||
    "https://www.trainyouragent.com/api/buyers-guide-pdf";

  const subject =
    "Your AI Operations Playbook (and a few honest notes from Alexander)";

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><title>${escape(subject)}</title></head>
<body style="margin:0;padding:0;background:#F6FAFE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Inter Tight',sans-serif;color:#0B1B2B;">
  <div style="max-width:620px;margin:0 auto;padding:32px 24px;background:#FFFFFF;">
    <div style="font-size:13px;color:#185FA5;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;margin-bottom:18px;">TrainYourAgent</div>
    <h1 style="font-size:24px;line-height:1.25;margin:0 0 18px 0;color:#042C53;font-weight:600;">Here's your AI Operations Playbook, ${escape(name)}.</h1>

    <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;">Hey ${escape(name)} — Alexander here. Thanks for grabbing the playbook.</p>

    <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;">The PDF link is below. It's 30 pages of what's actually working in 2026 — voice agents, chat agents, the seven reasons most AI pilots quietly die, and the vendor landscape if you want a shortcut to comparing the realistic options.</p>

    <p style="margin:28px 0;">
      <a href="${escape(pdf)}" style="display:inline-block;background:#042C53;color:#FFFFFF;text-decoration:none;padding:14px 22px;border-radius:10px;font-weight:600;font-size:15px;">Download the playbook (PDF) &rarr;</a>
    </p>

    <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;">Two things to know about me, since you'll hear from me a few more times:</p>

    <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;">1) I run an AI voice + chat agency out of Tampa Bay. I don't sell courses. I build agents that take real calls and book real jobs. If that's not what you need, just unsubscribe — no hard feelings.</p>

    <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;">2) I read every reply. So if you've got a weird use case, a stuck rollout, or a "would this even work for ___?" question — hit reply. Goes to my actual inbox.</p>

    <p style="font-size:16px;line-height:1.6;margin:0 0 24px 0;">Talk soon,<br/>Alexander</p>

    <hr style="border:none;border-top:1px solid #E6F1FB;margin:32px 0 18px 0;"/>
    <p style="font-size:13px;color:#5A6A7C;line-height:1.55;margin:0 0 10px 0;">
      You're getting this because you requested the playbook from <a href="https://www.trainyouragent.com" style="color:#185FA5;text-decoration:none;">trainyouragent.com</a>${opts.source ? ` (source: ${escape(opts.source)})` : ""}.
    </p>
    <p style="font-size:12px;color:#8A98A9;margin:0;">TrainYourAgent · Tampa Bay, FL · <a href="https://www.trainyouragent.com" style="color:#185FA5;text-decoration:none;">trainyouragent.com</a></p>
  </div>
</body></html>`;

  return { subject, html };
}

function escape(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
