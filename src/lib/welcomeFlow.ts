// src/lib/welcomeFlow.ts
// v76-c: 5-touch welcome email sequence for paid signups (subscription_status
// = 'active' in public.tya_customers). Templates here are pure data — they
// produce {subject, html, text} given a Customer + template id. The cron at
// api/cron/welcome-flow.ts decides who gets what and when.
//
// Tone: plain conversational, no marketing fluff. Sender is "Alexander at
// TrainYourAgent <hello@trainyouragent.com>" — falls back to
// "TrainYourAgent <onboarding@resend.dev>" if hello@ DNS isn't ready.
//
// Schedule (days since subscription_started_at):
//   day 0   → 'welcome'             — welcome + next steps
//   day 1   → 'discovery-reminder'  — discovery call reminder
//   day 3   → 'kb-nudge'            — knowledge base upload nudge if not done
//   day 7   → 'eval-schedule'       — eval session schedule
//   day 14  → 'launch-checklist'    — production launch checklist
//
// Plain-text fallbacks are derived from the HTML (handled by api/_lib/resend.ts).

export type WelcomeTemplate =
  | "welcome"
  | "discovery-reminder"
  | "kb-nudge"
  | "eval-schedule"
  | "launch-checklist";

export type WelcomeCustomer = {
  id?: string | number;
  email: string;
  first_name?: string | null;
  business_name?: string | null;
  /** ISO date when subscription went active. Used to compute "days since". */
  subscription_started_at?: string | null;
  /** Optional flag — when false, the day-3 KB nudge fires. */
  kb_uploaded?: boolean | null;
};

export type WelcomeEmail = {
  template: WelcomeTemplate;
  subject: string;
  html: string;
  fromHello: string;        // hello@trainyouragent.com
  fromFallback: string;     // onboarding@resend.dev
  replyTo: string;
};

const FROM_HELLO = "Alexander at TrainYourAgent <hello@trainyouragent.com>";
const FROM_FALLBACK = "Alexander at TrainYourAgent <onboarding@resend.dev>";
const REPLY_TO = "alexander@trainyouragent.com";

// Day → template lookup. The cron computes age-in-days for each active
// customer and only sends a template if (a) age == day AND (b) the
// (customer, template) tuple isn't already in tya_welcome_sent.
export const WELCOME_SCHEDULE: Array<{ day: number; template: WelcomeTemplate }> = [
  { day: 0,  template: "welcome" },
  { day: 1,  template: "discovery-reminder" },
  { day: 3,  template: "kb-nudge" },
  { day: 7,  template: "eval-schedule" },
  { day: 14, template: "launch-checklist" },
];

export const WELCOME_TEMPLATES: ReadonlyArray<WelcomeTemplate> = [
  "welcome",
  "discovery-reminder",
  "kb-nudge",
  "eval-schedule",
  "launch-checklist",
];

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export function renderWelcomeEmail(
  template: WelcomeTemplate,
  customer: WelcomeCustomer,
): WelcomeEmail {
  const name = firstName(customer);
  switch (template) {
    case "welcome":
      return wrap(template, ...tplWelcome(name, customer));
    case "discovery-reminder":
      return wrap(template, ...tplDiscoveryReminder(name, customer));
    case "kb-nudge":
      return wrap(template, ...tplKbNudge(name, customer));
    case "eval-schedule":
      return wrap(template, ...tplEvalSchedule(name, customer));
    case "launch-checklist":
      return wrap(template, ...tplLaunchChecklist(name, customer));
  }
}

/** Decide which template (if any) is due for a given customer right now. */
export function templateDueToday(
  customer: WelcomeCustomer,
  now: Date = new Date(),
): WelcomeTemplate | null {
  if (!customer.subscription_started_at) return null;
  const start = new Date(customer.subscription_started_at);
  if (isNaN(start.getTime())) return null;
  const ageDays = Math.floor(
    (now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
  );
  for (const slot of WELCOME_SCHEDULE) {
    if (slot.day !== ageDays) continue;
    if (slot.template === "kb-nudge" && customer.kb_uploaded) return null;
    return slot.template;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Templates — plain conversational copy. No CSS marketing flourishes.
// Each template returns [subject, htmlBody]
// ─────────────────────────────────────────────────────────────────────────────

function tplWelcome(name: string, c: WelcomeCustomer): [string, string] {
  const biz = c.business_name ? ` for ${esc(c.business_name)}` : "";
  const subject = `Welcome to TrainYourAgent${biz} — here's what happens next`;
  const html = body(`
<p>Hey ${esc(name)},</p>
<p>Thanks for signing up. Your account is active and I've been notified.</p>
<p>Here's exactly what happens over the next 21 days, in plain English:</p>
<ol>
  <li><strong>This week</strong> — we'll book a 60-minute discovery call. I'll send a calendar link in tomorrow's email. On that call we transcribe your real business: how you currently take calls, your top 100 questions, your service menu.</li>
  <li><strong>Week 2</strong> — we build your agent's knowledge base from your PDFs, transcripts, and Looms. I'll send you a secure upload link.</li>
  <li><strong>Week 2-3</strong> — we run 200 synthetic evals before any real caller touches the agent. You see the eval report before we go live.</li>
  <li><strong>Week 3+</strong> — production. Your agent is live on your real number. You get weekly performance reports and monthly retraining.</li>
</ol>
<p>Two things from me right now:</p>
<p><strong>(1) Reply to this email with your business name + the best phone number to reach you.</strong> Even if you already entered them in checkout — this kicks off the workflow on my side.</p>
<p><strong>(2) If you've got recordings of recent customer calls</strong>, start a folder. We'll use them in week 1 for tone-training. 2 hours of real calls is plenty.</p>
<p>Talk tomorrow.</p>
<p>— Alexander</p>
`);
  return [subject, html];
}

function tplDiscoveryReminder(name: string, _c: WelcomeCustomer): [string, string] {
  const subject = "Book your discovery call — link inside";
  const html = body(`
<p>Hey ${esc(name)},</p>
<p>Following up on yesterday's welcome — the next concrete step is the 60-minute discovery call.</p>
<p>This is where the agent actually gets built. We sit on Zoom with whoever currently fields your inbound calls and I transcribe everything. Without that hour, you get a chatbot. With it, you get an agent trained on your real business.</p>
<p>Grab any slot on my calendar here: <a href="https://cal.com/trainyouragent/30min">https://cal.com/trainyouragent/30min</a></p>
<p>If none of those slots work, just reply with two or three windows that do and I'll send a manual invite.</p>
<p>What to have ready for the call:</p>
<ul>
  <li>Whoever currently takes the calls (front-desk, dispatcher, you)</li>
  <li>A working microphone — phone audio works fine</li>
  <li>The top 5–10 questions you get asked most often (rough is fine)</li>
  <li>Your current pricing sheet, PDF or scribbled notes — both work</li>
</ul>
<p>No prep deck. No homework. Just talk to me like I'm a new hire.</p>
<p>— Alexander</p>
`);
  return [subject, html];
}

function tplKbNudge(name: string, _c: WelcomeCustomer): [string, string] {
  const subject = "Quick nudge — knowledge base files";
  const html = body(`
<p>Hey ${esc(name)},</p>
<p>Quick one — I'm starting to assemble your knowledge base and the upload folder is still empty.</p>
<p>What I'm looking for:</p>
<ul>
  <li>FAQ sheet — even a scribbled one</li>
  <li>Pricing or service menu — current PDF works fine</li>
  <li>SOPs or scripts — anything your team uses to onboard a new hire</li>
  <li>2 hours of recent call recordings if you have them (any format)</li>
  <li>Any Looms you've made for internal training</li>
</ul>
<p>Don't curate. Don't clean. Drop everything in raw — I do the indexing.</p>
<p>Upload here: I'll send a secure link in my next reply. Or just hit reply and attach what you have — Gmail handles up to 25 MB and I'll pull the rest from a Google Drive share if you've got a folder.</p>
<p>Without the KB the agent is guessing. With it, the agent quotes your real prices, your real hours, your real service area. That's the difference between a demo and a production system.</p>
<p>— Alexander</p>
`);
  return [subject, html];
}

function tplEvalSchedule(name: string, _c: WelcomeCustomer): [string, string] {
  const subject = "Eval session — 30 minutes, this week";
  const html = body(`
<p>Hey ${esc(name)},</p>
<p>Your agent has finished its first training pass. Before it ever talks to a real customer, we run 200 synthetic conversations against it and grade them on tone, accuracy, escalation, and booking rate.</p>
<p>I'd like to walk you through the eval report on a 30-minute call this week. The point of the call: you see exactly where the agent passes and exactly where it fails, and we decide together which failures matter enough to retrain on before launch.</p>
<p>Most common things we catch in eval:</p>
<ul>
  <li>The agent quotes a price that's 6 months out of date — fix is a KB update</li>
  <li>The agent doesn't recognize an emergency intent — fix is an explicit handler</li>
  <li>The agent's tone is 10% too formal — fix is a prompt tweak + 5 more transcript examples</li>
  <li>The agent escalates too eagerly — fix is to raise the escalation threshold</li>
</ul>
<p>Book 30 minutes here: <a href="https://cal.com/trainyouragent/30min">https://cal.com/trainyouragent/30min</a></p>
<p>If we don't catch these in eval, we catch them in production — which is more expensive. So this call matters more than it sounds.</p>
<p>— Alexander</p>
`);
  return [subject, html];
}

function tplLaunchChecklist(name: string, _c: WelcomeCustomer): [string, string] {
  const subject = "Production launch checklist — read before we flip the switch";
  const html = body(`
<p>Hey ${esc(name)},</p>
<p>You're at day 14 — production launch is in sight. Read this before we flip the live phone number over.</p>
<p><strong>Pre-launch checklist (we go through it together on a 15-minute call):</strong></p>
<ol>
  <li><strong>Number port or new line decision.</strong> Most clients keep the existing number and forward only after-hours / overflow. A few flip everything day one. Both work — say which you want.</li>
  <li><strong>Escalation phone(s).</strong> Where do calls go when the agent can't handle them? Your cell, the dispatcher, a queue? We hard-code this.</li>
  <li><strong>CRM disposition tags.</strong> Confirm the tag names you want pushed to HubSpot / GoHighLevel / Salesforce / Pipedrive on each call (e.g. "booked-job", "qualified-lead", "spam", "out-of-scope").</li>
  <li><strong>SMS confirmations.</strong> Toggle on/off, customize the wording.</li>
  <li><strong>Recording + retention policy.</strong> Default: 30-day rolling retention with redaction of card numbers. Override if you have specific compliance needs.</li>
  <li><strong>Owner-only escalation triggers.</strong> Keywords that immediately route to you — by default we include "manager", "complaint", "refund", "lawyer".</li>
  <li><strong>Weekly review cadence.</strong> Pick a day. I'll send a 1-page report every week + flag the calls that need a human eyeball.</li>
</ol>
<p>Book the 15-minute pre-launch sync here: <a href="https://cal.com/trainyouragent/30min">https://cal.com/trainyouragent/30min</a></p>
<p>Once we flip it, the agent gets better every week — every call that gets escalated becomes next week's training data. The system improves where chatbots decay.</p>
<p>Talk soon.</p>
<p>— Alexander</p>
`);
  return [subject, html];
}

// ─────────────────────────────────────────────────────────────────────────────
// shared helpers
// ─────────────────────────────────────────────────────────────────────────────

function wrap(
  template: WelcomeTemplate,
  subject: string,
  html: string,
): WelcomeEmail {
  return {
    template,
    subject,
    html,
    fromHello: FROM_HELLO,
    fromFallback: FROM_FALLBACK,
    replyTo: REPLY_TO,
  };
}

function firstName(c: WelcomeCustomer): string {
  const fn = c.first_name?.trim();
  if (fn) return fn;
  const guess = c.email.split("@")[0];
  if (!guess) return "there";
  const cleaned = guess.replace(/[^A-Za-z]/g, " ").trim().split(/\s+/)[0];
  if (!cleaned) return "there";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function body(inner: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#F6FAFE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Inter Tight',sans-serif;color:#0B1B2B;">
  <div style="max-width:620px;margin:0 auto;padding:30px 22px;background:#FFFFFF;line-height:1.55;font-size:15px;">
    <div style="font-size:12px;color:#185FA5;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;margin-bottom:18px;">TrainYourAgent</div>
    ${inner}
    <hr style="border:none;border-top:1px solid #E6F1FB;margin:28px 0 14px 0;"/>
    <p style="font-size:12px;color:#8A98A9;margin:0;">TrainYourAgent · United States · <a href="https://www.trainyouragent.com" style="color:#185FA5;text-decoration:none;">trainyouragent.com</a> · Reply to this email to reach Alexander directly.</p>
  </div>
</body></html>`;
}
