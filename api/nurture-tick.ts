// api/nurture-tick.ts
// v52a: Cron-friendly endpoint that drips the 5-touch nurture sequence to
// leads captured via /api/lead. Each lead receives one email at days
// {1, 3, 5, 7, 14} after their first capture, drawn from the markdown
// templates in /emails/. Idempotent — uses public.tya_nurture_sent to
// dedupe sends per (lead, touch_day).
//
// Auth: ?token=<ADMIN_TOKEN>. The endpoint is not crawled (header set in
// vercel.json) and rate-limited the same way other admin endpoints are.
//
// Vercel Cron suggestion (add to vercel.json crons):
//   {
//     "path": "/api/nurture-tick?token=$ADMIN_TOKEN",
//     "schedule": "0 14 * * *"   // 14:00 UTC = 9am ET daily
//   }
//
// Required env: ADMIN_TOKEN, RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY.

import { getSupabase, supabaseConfigured } from "./_lib/supabase.js";
import { sendEmail } from "./_lib/resend.js";

export const config = { runtime: "edge" };

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const NURTURE_TOUCH_DAYS = [1, 3, 5, 7, 14] as const;

type TouchDay = (typeof NURTURE_TOUCH_DAYS)[number];

type LeadRow = {
  id: number;
  email: string;
  source: string;
  payload: Record<string, unknown> | null;
  created_at: string;
};

type SentRow = { lead_id: number; touch_day: number };

type TickResult = {
  ok: boolean;
  ts: string;
  tick_days: number[];
  sent: number;
  skipped: number;
  errors: string[];
  details: Array<{ lead_id: number; email: string; touch_day: number; result: "sent" | "skipped" | "error"; reason?: string }>;
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  if (!supabaseConfigured()) {
    return json({ ok: false, error: "supabase not configured" }, 503);
  }

  const sb = getSupabase();
  if (!sb) return json({ ok: false, error: "supabase client unavailable" }, 503);

  const now = new Date();
  const result: TickResult = {
    ok: true,
    ts: now.toISOString(),
    tick_days: [...NURTURE_TOUCH_DAYS],
    sent: 0,
    skipped: 0,
    errors: [],
    details: [],
  };

  for (const day of NURTURE_TOUCH_DAYS) {
    // Window: leads created exactly `day` days ago, within a 1-hour bucket.
    // Wider window = more catch-up; tighter = stricter cadence. 1 hour matches
    // a daily-at-14:00-UTC cron run.
    const winEndMs = now.getTime() - day * 24 * 60 * 60 * 1000;
    const winStartMs = winEndMs - 60 * 60 * 1000;
    const winStart = new Date(winStartMs).toISOString();
    const winEnd = new Date(winEndMs).toISOString();

    const { data: leads, error } = await sb
      .from("tya_leads")
      .select("id,email,source,payload,created_at")
      .gte("created_at", winStart)
      .lte("created_at", winEnd)
      .limit(500);

    if (error) {
      result.errors.push(`day=${day} fetch leads: ${error.message}`);
      continue;
    }
    if (!leads || leads.length === 0) continue;

    // Look up which of these (lead_id, day) pairs already got the touch.
    const leadIds = leads.map((l) => (l as LeadRow).id);
    const { data: sent, error: sentErr } = await sb
      .from("tya_nurture_sent")
      .select("lead_id,touch_day")
      .in("lead_id", leadIds)
      .eq("touch_day", day);
    if (sentErr) {
      result.errors.push(`day=${day} fetch sent: ${sentErr.message}`);
      continue;
    }
    const sentSet = new Set((sent as SentRow[] | null)?.map((s) => `${s.lead_id}:${s.touch_day}`) || []);

    for (const row of leads as LeadRow[]) {
      const key = `${row.id}:${day}`;
      if (sentSet.has(key)) {
        result.skipped++;
        result.details.push({ lead_id: row.id, email: row.email, touch_day: day, result: "skipped", reason: "already-sent" });
        continue;
      }
      // tya_leads stores masked emails ("ab***@domain.com") — useless for delivery.
      // For real nurture we need the raw email. We persist it inside payload.email
      // when the lead came in (or pull it from a separate raw_email column if
      // present). Be resilient: if no raw email, skip and log.
      const rawEmail = pickRawEmail(row);
      if (!rawEmail) {
        result.skipped++;
        result.details.push({ lead_id: row.id, email: row.email, touch_day: day, result: "skipped", reason: "no-raw-email" });
        continue;
      }

      const tpl = NURTURE_TEMPLATES[day];
      const html = renderTemplate(tpl, { firstName: extractFirstName(row) });
      const send = await sendEmail({
        to: rawEmail,
        subject: tpl.subject,
        html,
        tag: `nurture-day-${day}`,
      });

      if (!send.ok) {
        result.errors.push(`day=${day} lead=${row.id} send: ${send.error || "unknown"}`);
        result.details.push({ lead_id: row.id, email: row.email, touch_day: day, result: "error", reason: send.error });
        continue;
      }

      const { error: insErr } = await sb
        .from("tya_nurture_sent")
        .insert({ lead_id: row.id, email: row.email, touch_day: day });
      if (insErr) {
        // Don't double-count as sent if we couldn't dedupe-mark.
        result.errors.push(`day=${day} lead=${row.id} mark-sent: ${insErr.message}`);
        result.details.push({ lead_id: row.id, email: row.email, touch_day: day, result: "error", reason: "mark-sent-failed" });
        continue;
      }
      result.sent++;
      result.details.push({ lead_id: row.id, email: row.email, touch_day: day, result: "sent" });
    }
  }

  return json(result, 200);
}

// --- helpers ---------------------------------------------------------------

function pickRawEmail(row: LeadRow): string | undefined {
  const p = row.payload as Record<string, unknown> | null;
  if (p && typeof p === "object") {
    if (typeof p.raw_email === "string") return p.raw_email;
    if (typeof p.email === "string") return p.email;
    const att = p.attribution as Record<string, unknown> | undefined;
    if (att && typeof att === "object" && typeof att.raw_email === "string") return att.raw_email;
  }
  // Last resort: if row.email is NOT masked (no "***"), it's deliverable.
  if (row.email && !row.email.includes("***")) return row.email;
  return undefined;
}

function extractFirstName(row: LeadRow): string {
  const p = row.payload as Record<string, unknown> | null;
  if (p && typeof p === "object") {
    if (typeof p.first_name === "string" && p.first_name.trim()) return p.first_name.trim();
    if (typeof p.name === "string" && p.name.trim()) return p.name.trim().split(/\s+/)[0];
  }
  return "there";
}

function renderTemplate(t: { subject: string; html: string }, vars: { firstName: string }): string {
  return t.html.replace(/\{\{first_name\}\}/g, escapeHtml(vars.firstName));
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

// --- Nurture templates (inlined; kept in sync with /emails/nurture-*.md) ----
// We inline minimal HTML rather than parsing the markdown so the edge runtime
// stays dependency-free. Wording mirrors the markdown files; tweak there for
// the canonical version and copy paste any edits in here.

const NURTURE_TEMPLATES: Record<TouchDay, { subject: string; html: string }> = {
  1: {
    subject: "Day 1: did you actually open the playbook?",
    html: wrap(`
      <p>Hey {{first_name}} — Alexander.</p>
      <p>Just checking the playbook landed. If the PDF didn't show up, here it is again:
      <a href="https://www.trainyouragent.com/api/buyers-guide-pdf">trainyouragent.com/api/buyers-guide-pdf</a></p>
      <p>Page 7 (the "why pilots die" list) is the section most people screenshot. Let me know if it lands.</p>
      <p>— Alexander</p>
    `),
  },
  3: {
    subject: "The one number that decides if AI voice works for you",
    html: wrap(`
      <p>{{first_name}} — quick one.</p>
      <p>If your team handles fewer than ~80 inbound calls per week, voice agents are usually overkill. North of that, the math gets aggressive fast.</p>
      <p>I built a 90-second ROI calculator that does the math for your specific volume:
      <a href="https://www.trainyouragent.com/tools/roi-calculator">trainyouragent.com/tools/roi-calculator</a></p>
      <p>Reply with your monthly call volume and I'll send back the back-of-envelope.</p>
      <p>— Alexander</p>
    `),
  },
  5: {
    subject: "How a roofing op killed their answering service",
    html: wrap(`
      <p>{{first_name}} —</p>
      <p>Quick teardown of a real deploy: a 40-rep roofing company in Florida switched their after-hours answering service for an agent we built.
      Inbound volume held. Bookings went up 23%. Cost dropped 71%.</p>
      <p>Full breakdown (numbers, prompts, integration list, where it broke):
      <a href="https://www.trainyouragent.com/playbooks/roofing">trainyouragent.com/playbooks/roofing</a></p>
      <p>— Alexander</p>
    `),
  },
  7: {
    subject: "Worth a 20-minute call?",
    html: wrap(`
      <p>{{first_name}} —</p>
      <p>A week in. Two options now:</p>
      <p>1) Stay on the list — I send one ship-notes email a week. No pressure.</p>
      <p>2) Book 20 minutes with me to scope what an agent could realistically do for your business:
      <a href="https://cal.com/trainyouragent/30min">cal.com/trainyouragent/30min</a></p>
      <p>If now isn't right, just hit reply with "later" and I'll back off.</p>
      <p>— Alexander</p>
    `),
  },
  14: {
    subject: "Last note from me",
    html: wrap(`
      <p>{{first_name}} —</p>
      <p>This is my last touch on the kickoff sequence. You'll still get the weekly ship notes (unsubscribe link is at the bottom of every one — no hard feelings).</p>
      <p>If you ever want to come back to this:
      <a href="https://www.trainyouragent.com/book">trainyouragent.com/book</a> stays open.</p>
      <p>Thanks for reading.</p>
      <p>— Alexander</p>
    `),
  },
};

function wrap(inner: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#F6FAFE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0B1B2B;">
  <div style="max-width:620px;margin:0 auto;padding:32px 24px;background:#FFFFFF;">
    <div style="font-size:13px;color:#185FA5;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;margin-bottom:18px;">TrainYourAgent</div>
    <div style="font-size:16px;line-height:1.65;">${inner}</div>
    <hr style="border:none;border-top:1px solid #E6F1FB;margin:28px 0 14px 0;"/>
    <p style="font-size:12px;color:#8A98A9;margin:0;">TrainYourAgent · Tampa Bay, FL · <a href="https://www.trainyouragent.com" style="color:#185FA5;text-decoration:none;">trainyouragent.com</a></p>
  </div>
</body></html>`;
}
