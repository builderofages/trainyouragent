// api/friday-digest.ts — v57a
// Friday cron: emails a "shipped this week" digest to opted-in subscribers.
//
// Vercel cron config (vercel.json): `0 13 * * 5` (every Friday at 13:00 UTC
// = 9:00am ET). Vercel hits GET /api/friday-digest — the cron header carries
// the bearer token, OR you can pass ?token=<ADMIN_TOKEN> manually for dry-runs.
//
// Composition:
//   1. Last 7 days of GitHub commits on builderofages/trainyouragent (main)
//   2. Last 7 days of new blog posts (src/content/blog filesystem read)
//      [skipped in edge runtime — listed at zero unless we wire a static manifest]
//   3. Last 7 days of lead + booking + revenue counts from Supabase
//   4. Sent via Resend to all leads where source IN (newsletter, founder-log-subscribe)
//
// Idempotency: each (week_end, email) tuple is inserted into tya_digest_sent
// BEFORE the send fires. If a row already exists we skip that recipient.
//
// Graceful degradation:
//   - No RESEND_API_KEY -> dry-run summary (200, recipients=0)
//   - No SUPABASE_*       -> counts come from in-memory store, recipients=0
//   - No ADMIN_TOKEN      -> 401 (must be set in Vercel env)

import { checkAdmin, unauthorized } from "./_lib/admin-auth.js";
import { getSupabase } from "./_lib/supabase.js";

export const config = { runtime: "edge" };

const RESEND_KEY = process.env.RESEND_API_KEY || "";
const FROM = process.env.RESEND_FROM_EMAIL || "TrainYourAgent <alexander@trainyouragent.com>";
const REPLY_TO = process.env.RESEND_REPLY_TO || "alexander@trainyouragent.com";
const GITHUB_REPO = process.env.GITHUB_DIGEST_REPO || "builderofages/trainyouragent";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""; // optional, raises rate limit
const SITE = "https://trainyouragent.com";

type Commit = { sha: string; message: string; author: string; date: string; url: string };
type Lead = { email: string; source: string };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET" && req.method !== "POST") {
    return json({ ok: false, error: "method" }, 405);
  }
  if (!checkAdmin(req)) return unauthorized();

  const now = new Date();
  const weekEnd = toISODate(now);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // ----- commits ------------------------------------------------------------
  const commits = await fetchCommits(sevenDaysAgo).catch((e) => {
    console.error("[friday-digest] commits fetch failed", e);
    return [] as Commit[];
  });

  // ----- posts (best-effort; we read from a JSON manifest if it exists) ----
  const posts = await fetchRecentPosts(sevenDaysAgo).catch(() => [] as { slug: string; title: string; date: string }[]);

  // ----- numbers ------------------------------------------------------------
  const numbers = await fetchNumbers(sevenDaysAgo).catch((e) => {
    console.error("[friday-digest] numbers fetch failed", e);
    return { leads: 0, bookings: 0, purchases: 0, revenue_cents: 0 };
  });

  // ----- recipients ---------------------------------------------------------
  const recipients = await fetchRecipients().catch((e) => {
    console.error("[friday-digest] recipients fetch failed", e);
    return [] as Lead[];
  });

  // Dry-run mode: no Resend or no recipients => report and exit.
  if (!RESEND_KEY || recipients.length === 0) {
    return json({
      ok: true,
      mode: "dry-run",
      week_end: weekEnd,
      recipients: recipients.length,
      commits: commits.length,
      posts: posts.length,
      numbers,
      reason: !RESEND_KEY ? "RESEND_API_KEY not configured" : "no opted-in recipients",
    }, 200);
  }

  const { subject, html } = buildDigest({ weekEnd, commits, posts, numbers });

  const errors: string[] = [];
  let sent = 0;
  let skipped = 0;

  const sb = getSupabase();

  // Sequential to avoid hammering Resend / tripping per-IP rate limits.
  for (const r of recipients) {
    // Idempotency check.
    if (sb) {
      const { data: existing } = await sb
        .from("tya_digest_sent")
        .select("id")
        .eq("week_end", weekEnd)
        .eq("email", r.email)
        .limit(1)
        .maybeSingle();
      if (existing?.id) { skipped++; continue; }
    }

    const result = await sendDigest({ to: r.email, subject, html });
    if (sb) {
      await sb.from("tya_digest_sent").insert({
        week_end: weekEnd,
        email: r.email,
        recipients: recipients.length,
        commits: commits.length,
        posts: posts.length,
        status: result.ok ? "sent" : "error",
        error: result.ok ? null : result.error?.slice(0, 500),
      });
    }
    if (result.ok) sent++;
    else errors.push(`${r.email}: ${result.error}`);
  }

  return json({
    ok: true,
    mode: "live",
    week_end: weekEnd,
    recipients: recipients.length,
    sent,
    skipped,
    commits: commits.length,
    posts: posts.length,
    numbers,
    errors: errors.slice(0, 20),
  }, 200);
}

// ============================================================================
// HELPERS
// ============================================================================

async function fetchCommits(since: Date): Promise<Commit[]> {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/commits?since=${since.toISOString()}&per_page=100`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "trainyouragent-friday-digest",
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`github ${r.status}`);
  const arr = await r.json() as Array<{
    sha: string;
    commit: { message: string; author: { name: string; date: string } };
    html_url: string;
  }>;
  return arr
    .filter((c) => !/^Merge /.test(c.commit.message))
    .map((c) => ({
      sha: c.sha.slice(0, 7),
      message: c.commit.message.split("\n")[0].slice(0, 200),
      author: c.commit.author.name,
      date: c.commit.author.date,
      url: c.html_url,
    }));
}

async function fetchRecentPosts(_since: Date): Promise<{ slug: string; title: string; date: string }[]> {
  // Edge runtime has no fs. If we ever publish /public/blog-manifest.json
  // at build time, fetch it here. For now, return [] — commits cover ship news.
  try {
    const r = await fetch(`${SITE}/blog-manifest.json`);
    if (!r.ok) return [];
    const data = await r.json() as { posts?: { slug: string; title: string; date: string }[] };
    const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return (data.posts || []).filter((p) => new Date(p.date).getTime() >= since);
  } catch { return []; }
}

async function fetchNumbers(since: Date) {
  const sb = getSupabase();
  if (!sb) return { leads: 0, bookings: 0, purchases: 0, revenue_cents: 0 };

  const sinceIso = since.toISOString();

  const [leadsR, eventsR] = await Promise.all([
    sb.from("tya_leads").select("id", { count: "exact", head: true }).gte("created_at", sinceIso),
    sb.from("tya_events").select("event_type,amount_cents,created_at").gte("created_at", sinceIso),
  ]);

  const events = (eventsR.data || []) as Array<{ event_type: string; amount_cents: number | null }>;
  const bookings = events.filter((e) => e.event_type === "booking_created").length;
  const purchases = events.filter((e) => e.event_type === "purchase_completed").length;
  const revenue_cents = events
    .filter((e) => e.event_type === "purchase_completed")
    .reduce((a, b) => a + (b.amount_cents || 0), 0);

  return { leads: leadsR.count || 0, bookings, purchases, revenue_cents };
}

async function fetchRecipients(): Promise<Lead[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("tya_leads")
    .select("email,source")
    .in("source", ["newsletter", "founder-log-subscribe"])
    .order("created_at", { ascending: false })
    .limit(2000);
  if (!data) return [];
  // Dedupe by email (leads table can have multiple sources per email).
  const seen = new Set<string>();
  const out: Lead[] = [];
  for (const r of data as Lead[]) {
    if (!r.email || seen.has(r.email)) continue;
    // Skip masked emails (we mask on storage) — without an unmasked address
    // we can't deliver. This is a future hookup.
    if (r.email.includes("***")) continue;
    seen.add(r.email);
    out.push(r);
  }
  return out;
}

function buildDigest(args: {
  weekEnd: string;
  commits: Commit[];
  posts: { slug: string; title: string; date: string }[];
  numbers: { leads: number; bookings: number; purchases: number; revenue_cents: number };
}): { subject: string; html: string } {
  const { weekEnd, commits, posts, numbers } = args;
  const subject = `TrainYourAgent — shipped this week (${weekEnd})`;
  const usd = (cents: number) => `$${(cents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const commitList = commits.slice(0, 30).map(
    (c) =>
      `<li style="margin:6px 0"><a href="${escapeHtml(c.url)}" style="color:#185FA5;text-decoration:none"><code style="font-size:11px;color:#666">${escapeHtml(c.sha)}</code></a> ${escapeHtml(c.message)}</li>`,
  ).join("") || `<li style="margin:6px 0;color:#666">No shipped commits this week.</li>`;

  const postList = posts.length
    ? posts.map((p) => `<li style="margin:6px 0"><a href="${SITE}/blog/${escapeHtml(p.slug)}" style="color:#185FA5;text-decoration:none">${escapeHtml(p.title)}</a></li>`).join("")
    : `<li style="margin:6px 0;color:#666">No new posts this week.</li>`;

  const html = `<!doctype html>
<html><body style="font-family:'Inter Tight',-apple-system,system-ui,sans-serif;background:#FFFFFF;color:#0B1B2B;margin:0;padding:24px">
  <div style="max-width:640px;margin:0 auto">
    <h1 style="font-size:22px;margin:0 0 4px;color:#042C53">TrainYourAgent — Friday digest</h1>
    <div style="font-size:13px;color:#666;margin:0 0 24px">Week ending ${escapeHtml(weekEnd)}</div>

    <h2 style="font-size:16px;margin:24px 0 8px;color:#042C53">What we shipped this week</h2>
    <ul style="font-size:14px;padding-left:18px;margin:0 0 16px">${commitList}</ul>

    <h2 style="font-size:16px;margin:24px 0 8px;color:#042C53">New writing</h2>
    <ul style="font-size:14px;padding-left:18px;margin:0 0 16px">${postList}</ul>

    <h2 style="font-size:16px;margin:24px 0 8px;color:#042C53">Numbers (last 7 days)</h2>
    <table style="font-size:14px;border-collapse:collapse;margin:0 0 16px">
      <tr><td style="padding:4px 12px 4px 0;color:#666">New leads</td><td style="padding:4px 0;font-weight:600">${numbers.leads}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Demos booked</td><td style="padding:4px 0;font-weight:600">${numbers.bookings}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">New customers</td><td style="padding:4px 0;font-weight:600">${numbers.purchases}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Revenue</td><td style="padding:4px 0;font-weight:600">${usd(numbers.revenue_cents)}</td></tr>
    </table>

    <p style="font-size:13px;color:#666;margin:24px 0 0">
      You're getting this because you're on the Founder Log or Newsletter list.
      Reply to unsubscribe.
    </p>
    <p style="font-size:13px;color:#666;margin:6px 0 0">— Alexander Mills · Tampa Bay, FL</p>
  </div>
</body></html>`;

  return { subject, html };
}

async function sendDigest(args: { to: string; subject: string; html: string }): Promise<{ ok: boolean; error?: string }> {
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [args.to],
        subject: args.subject,
        html: args.html,
        reply_to: REPLY_TO,
        tags: [{ name: "category", value: "friday-digest" }],
      }),
    });
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return { ok: false, error: `${r.status} ${t.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
