// api/cron/daily-digest.ts — v202
//
// 8am ET morning ops email to the operator. Pulls yesterday's metrics from
// Supabase and sends one clean scannable email so the operator opens their
// inbox and knows exactly what TYA did overnight without checking the dash.
//
// Sends nothing on zero-activity days — no inbox noise.
//
// Scheduled in vercel.json at "0 12 * * *" (12:00 UTC ≈ 8am ET avg).
// Auth: ADMIN_TOKEN or x-vercel-cron header.
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY,
//      OPS_DIGEST_TO (default: trainyouragent@gmail.com),
//      LEAD_NOTIFY_FROM (default: Alexander <alexander@trainyouragent.com>).

import { getSupabase, supabaseConfigured } from "../_lib/supabase.js";
import { sendEmail } from "../_lib/resend.js";
import { checkAdmin } from "../_lib/admin-auth.js";

export const config = { runtime: "edge" };

const OPS_TO   = process.env.OPS_DIGEST_TO   || "trainyouragent@gmail.com";
const OPS_FROM = process.env.LEAD_NOTIFY_FROM || "Alexander <alexander@trainyouragent.com>";

function j(o: unknown, status = 200): Response {
  return new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });
}
function fmtPct(n: number, d: number): string {
  if (!d) return "—";
  const p = (n / d) * 100;
  return p < 10 ? `${p.toFixed(1)}%` : `${Math.round(p)}%`;
}

export default async function handler(req: Request): Promise<Response> {
  if (!checkAdmin(req)) return j({ ok: false, error: "unauthorized" }, 401);
  if (!supabaseConfigured()) return j({ ok: true, sent: false, reason: "supabase-not-configured" });
  const sb = getSupabase();
  if (!sb) return j({ ok: false, error: "supabase-init-failed" }, 500);

  const now = new Date();
  const yesterdayStart = new Date(now.getTime() - 24 * 3600_000).toISOString();
  const sevenDaysAgo   = new Date(now.getTime() - 7  * 86400_000).toISOString();

  // ── Yesterday ──────────────────────────────────────────────────────
  const [sourced, sent, opens, books, optouts, bounces, rules] = await Promise.all([
    sb.from("sourced_prospects").select("id", { count: "exact", head: true }).gte("created_at", yesterdayStart),
    sb.from("template_sends").select("id", { count: "exact", head: true }).gte("last_nurture_at", yesterdayStart),
    sb.from("template_sends").select("id", { count: "exact", head: true }).gte("opened_at", yesterdayStart),
    sb.from("template_sends").select("id", { count: "exact", head: true }).gte("booked_at", yesterdayStart),
    sb.from("template_sends").select("id", { count: "exact", head: true }).eq("nurture_stopped_reason", "opted_out").gte("last_nurture_at", yesterdayStart),
    sb.from("template_sends").select("id", { count: "exact", head: true }).eq("nurture_stopped_reason", "bounced").gte("last_nurture_at", yesterdayStart),
    sb.from("sourcing_rules").select("id, niche_label, niche, city, last_run_at, last_run_added, last_run_error, total_added, enabled"),
  ]);

  const ySourced = sourced.count ?? 0;
  const ySent    = sent.count    ?? 0;
  const yOpens   = opens.count   ?? 0;
  const yBooks   = books.count   ?? 0;
  const yOpts    = optouts.count ?? 0;
  const yBnc     = bounces.count ?? 0;
  const totalActivity = ySourced + ySent + yOpens + yBooks;

  // Skip silent days
  if (totalActivity === 0) {
    return j({ ok: true, sent: false, reason: "no-activity", ts: now.toISOString() });
  }

  // ── 7-day funnel for context ───────────────────────────────────────
  const [wSent, wOpens, wBooks] = await Promise.all([
    sb.from("template_sends").select("id", { count: "exact", head: true }).gte("last_nurture_at", sevenDaysAgo),
    sb.from("template_sends").select("id", { count: "exact", head: true }).gte("opened_at", sevenDaysAgo),
    sb.from("template_sends").select("id", { count: "exact", head: true }).gte("booked_at", sevenDaysAgo),
  ]);

  // ── Top-3 most-recent autopilot rules + any errors ─────────────────
  const ruleRows = (rules.data || []) as Array<{ id: string; niche_label: string | null; niche: string; city: string; last_run_at: string | null; last_run_added: number | null; last_run_error: string | null; total_added: number | null; enabled: boolean }>;
  const enabledRules = ruleRows.filter((r) => r.enabled);
  const errorRules   = ruleRows.filter((r) => r.last_run_error);
  const topRules     = enabledRules.sort((a, b) => (b.total_added || 0) - (a.total_added || 0)).slice(0, 3);

  // ── Compose email ──────────────────────────────────────────────────
  const dateStr = new Date(now.getTime() - 12 * 3600_000).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  const subject = `[TYA] ${dateStr}: ${yBooks} booking${yBooks === 1 ? "" : "s"} · ${ySent} sent · ${ySourced} sourced`;

  const html = `<div style="font-family: -apple-system, system-ui, sans-serif; max-width: 580px; color: #0B1B2B;">
<p style="font-size:13px;color:#6B7B92;margin:0 0 4px;letter-spacing:.05em;text-transform:uppercase;font-weight:700">TYA · MORNING OPS DIGEST</p>
<h1 style="font-size:22px;font-weight:600;color:#042C53;margin:0 0 22px;letter-spacing:-0.01em">${dateStr}</h1>

<div style="background:#FAFBFC;border:1px solid rgba(4,44,83,0.08);border-radius:14px;padding:18px 20px;margin-bottom:18px">
  <div style="font-size:10.5px;font-weight:700;color:#185FA5;letter-spacing:.18em;margin-bottom:10px">YESTERDAY</div>
  <table style="width:100%;border-collapse:collapse;font-size:15px">
    <tr><td style="padding:5px 0;color:#5C6B7F">Prospects auto-sourced</td><td style="padding:5px 0;text-align:right;color:#042C53;font-weight:600">${ySourced}</td></tr>
    <tr><td style="padding:5px 0;color:#5C6B7F">Emails fired (Day-0 / 3 / 7)</td><td style="padding:5px 0;text-align:right;color:#042C53;font-weight:600">${ySent}</td></tr>
    <tr><td style="padding:5px 0;color:#5C6B7F">Prospects opened their link</td><td style="padding:5px 0;text-align:right;color:#042C53;font-weight:600">${yOpens}${ySent ? ` <span style="color:#94A3B8;font-weight:400;font-size:13px">(${fmtPct(yOpens, ySent)})</span>` : ""}</td></tr>
    <tr><td style="padding:5px 0;color:#5C6B7F">Bookings 🎯</td><td style="padding:5px 0;text-align:right;color:${yBooks > 0 ? "#15724D" : "#042C53"};font-weight:700">${yBooks}</td></tr>
    ${yBnc  > 0 ? `<tr><td style="padding:5px 0;color:#5C6B7F">Hard bounces (auto-stopped)</td><td style="padding:5px 0;text-align:right;color:#9B2C2C">${yBnc}</td></tr>` : ""}
    ${yOpts > 0 ? `<tr><td style="padding:5px 0;color:#5C6B7F">Opt-outs</td><td style="padding:5px 0;text-align:right;color:#9B2C2C">${yOpts}</td></tr>` : ""}
  </table>
</div>

<div style="background:#FFF8EE;border:1px solid rgba(245,158,11,0.18);border-radius:14px;padding:18px 20px;margin-bottom:18px">
  <div style="font-size:10.5px;font-weight:700;color:#92400E;letter-spacing:.18em;margin-bottom:10px">7-DAY FUNNEL</div>
  <div style="font-size:14px;color:#42526E;line-height:1.5">
    <strong style="color:#042C53">${wSent.count ?? 0}</strong> sent → <strong style="color:#042C53">${wOpens.count ?? 0}</strong> opened (<span style="color:#94A3B8">${fmtPct(wOpens.count ?? 0, wSent.count ?? 0)}</span>) → <strong style="color:${(wBooks.count ?? 0) > 0 ? "#15724D" : "#042C53"}">${wBooks.count ?? 0}</strong> booked (<span style="color:#94A3B8">${fmtPct(wBooks.count ?? 0, wSent.count ?? 0)}</span>)
  </div>
</div>

${topRules.length > 0 ? `<div style="background:#fff;border:1px solid rgba(4,44,83,0.1);border-radius:14px;padding:18px 20px;margin-bottom:18px">
  <div style="font-size:10.5px;font-weight:700;color:#185FA5;letter-spacing:.18em;margin-bottom:10px">TOP AUTOPILOT RULES (BY TOTAL SOURCED)</div>
  ${topRules.map((r) => `<div style="font-size:14px;color:#42526E;margin-bottom:6px">
    <strong style="color:#042C53">${r.niche_label || r.niche}</strong>
    <span style="color:#94A3B8"> · ${r.city}</span>
    <span style="float:right;color:#042C53;font-weight:600">${r.total_added || 0}</span>
  </div>`).join("")}
</div>` : `<div style="background:#fff;border:1px dashed rgba(4,44,83,0.16);border-radius:14px;padding:14px 18px;margin-bottom:18px;font-size:13.5px;color:#5C6B7F">
  No autopilot rules active yet. Open <a href="https://www.trainyouragent.com/admin/templates" style="color:#185FA5">/admin/templates</a> → Autopilot panel to create one.
</div>`}

${errorRules.length > 0 ? `<div style="background:#FFF7F4;border:1px solid rgba(155,44,44,0.18);border-radius:14px;padding:18px 20px;margin-bottom:18px">
  <div style="font-size:10.5px;font-weight:700;color:#9B2C2C;letter-spacing:.18em;margin-bottom:10px">RULES WITH ERRORS</div>
  ${errorRules.slice(0, 5).map((r) => `<div style="font-size:13px;color:#42526E;margin-bottom:4px">
    <strong style="color:#042C53">${r.niche_label || r.niche} · ${r.city}</strong>: ${r.last_run_error}
  </div>`).join("")}
</div>` : ""}

<div style="display:flex;gap:8px;margin-top:20px">
  <a href="https://www.trainyouragent.com/admin/templates" style="display:inline-block;padding:11px 22px;border-radius:10px;background:#042C53;color:#fff;text-decoration:none;font-weight:600;font-size:14px">Open dashboard →</a>
</div>

<p style="font-size:11.5px;color:#94A3B8;margin-top:32px;line-height:1.6;border-top:1px solid #E5E9EE;padding-top:12px">
TYA Autopilot · daily ops digest. Sent only on days with activity. Set <code>OPS_DIGEST_TO</code> in Vercel env to change the recipient.
</p>
</div>`;

  const res = await sendEmail({
    to: OPS_TO,
    from: OPS_FROM,
    subject,
    html,
    tag: "ops-daily-digest",
  });

  return j({
    ok: true,
    sent: res.ok,
    error: res.ok ? null : res.error,
    ts: now.toISOString(),
    metrics: { ySourced, ySent, yOpens, yBooks, yOpts, yBnc, wSent: wSent.count ?? 0, wOpens: wOpens.count ?? 0, wBooks: wBooks.count ?? 0 },
  });
}
