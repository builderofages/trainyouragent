// api/cron/welcome-flow.ts — v76-c
// Daily 9am ET cron that drips the 5-touch paid-customer welcome flow.
// Reads public.tya_customers WHERE subscription_status='active', computes
// age-in-days since subscription_started_at, and for each customer whose
// age matches a template trigger AND who isn't already in
// public.tya_welcome_sent for that template, sends the email via Resend.
//
// Vercel cron config (added to vercel.json):
//   { "path": "/api/cron/welcome-flow?token=$ADMIN_TOKEN", "schedule": "0 13 * * *" }
//   (13:00 UTC ≈ 9am ET year-round once DST is averaged out; close enough for
//    a welcome email.)
//
// Auth: ?token=$ADMIN_TOKEN.
//
// Required env: ADMIN_TOKEN, RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY.
// Optional env: RESEND_FROM_HELLO_OVERRIDE (default uses hello@trainyouragent.com,
//               falls back to onboarding@resend.dev when the hello@ domain is
//               unverified — Resend returns 422 in that case, which we detect.)

import { getSupabase } from "../_lib/supabase.js";
import { sendEmail } from "../_lib/resend.js";
import { rateLimit, ipFromRequest } from "../_lib/rate-limit.js";
import {
  WELCOME_SCHEDULE,
  WELCOME_TEMPLATES,
  renderWelcomeEmail,
  templateDueToday,
  type WelcomeCustomer,
  type WelcomeTemplate,
} from "../../src/lib/welcomeFlow.js";

export const config = { runtime: "edge" };

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

type SentRow = { customer_id: string; template: string };

type TickResult = {
  ok: boolean;
  ts: string;
  considered: number;
  sent: number;
  skipped: number;
  errors: string[];
  details: Array<{
    customer_id: string | number | null;
    email: string;
    template: WelcomeTemplate;
    result: "sent" | "skipped" | "error";
    reason?: string;
  }>;
};

export default async function handler(req: Request): Promise<Response> {
  // Token brute-force guard FIRST, then secret check.
  const ip = ipFromRequest(req);
  const rl = rateLimit(`welcome-flow:${ip}`, { limit: 30, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return json({ ok: false, error: "rate-limited" }, 429);

  const url = new URL(req.url);
  const token = url.searchParams.get("token") || req.headers.get("x-admin-token") || "";
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  const dryRun = url.searchParams.get("dry") === "1";
  const overrideEmail = url.searchParams.get("email") || ""; // testing: force-target one address

  const sb = getSupabase();
  if (!sb) {
    return json({
      ok: false,
      error: "supabase-not-configured",
      hint: "set SUPABASE_URL + SUPABASE_SERVICE_KEY",
    });
  }

  const result: TickResult = {
    ok: true,
    ts: new Date().toISOString(),
    considered: 0,
    sent: 0,
    skipped: 0,
    errors: [],
    details: [],
  };

  // 1) Fetch active customers. We intentionally pull only the columns we
  //    need. Table is expected to exist (created by stripe-webhook flow);
  //    if it doesn't, surface a clear error rather than crashing.
  let customers: WelcomeCustomer[] = [];
  try {
    const { data, error } = await sb
      .from("tya_customers")
      .select(
        "id,email,first_name,business_name,subscription_started_at,kb_uploaded,subscription_status",
      )
      .eq("subscription_status", "active")
      .limit(500);
    if (error) {
      // tya_customers may not exist yet. Return a friendly degraded response.
      return json({
        ok: false,
        error: "customers-query-failed",
        detail: error.message,
        hint: "ensure public.tya_customers exists; see stripe-webhook.ts",
      });
    }
    customers = (data || []) as WelcomeCustomer[];
  } catch (e) {
    return json({ ok: false, error: "customers-fetch-threw", detail: (e as Error).message });
  }

  if (overrideEmail) {
    customers = customers.filter((c) => c.email?.toLowerCase() === overrideEmail.toLowerCase());
  }

  // 2) Fetch the dedupe ledger in one shot so we don't N+1 the DB.
  const customerIds = customers.map((c) => c.id).filter(Boolean) as Array<string | number>;
  let sentLedger: SentRow[] = [];
  if (customerIds.length) {
    try {
      const { data, error } = await sb
        .from("tya_welcome_sent")
        .select("customer_id,template")
        .in("customer_id", customerIds as never[]);
      if (error) {
        // Ledger missing? Likely migration not run. Don't send blindly.
        return json({
          ok: false,
          error: "ledger-query-failed",
          detail: error.message,
          hint: "run supabase/migrations/v76_welcome.sql",
        });
      }
      sentLedger = (data || []) as SentRow[];
    } catch (e) {
      return json({ ok: false, error: "ledger-fetch-threw", detail: (e as Error).message });
    }
  }
  const sentSet = new Set(sentLedger.map((r) => `${r.customer_id}::${r.template}`));

  // 3) For each customer, compute the template due today and send if not
  //    already in the ledger.
  for (const c of customers) {
    result.considered++;
    if (!c.email) {
      result.skipped++;
      continue;
    }
    const template = templateDueToday(c, new Date());
    if (!template) {
      result.skipped++;
      continue;
    }
    const key = `${c.id}::${template}`;
    if (sentSet.has(key)) {
      result.skipped++;
      result.details.push({
        customer_id: c.id ?? null,
        email: c.email,
        template,
        result: "skipped",
        reason: "already-sent",
      });
      continue;
    }

    if (dryRun) {
      result.details.push({
        customer_id: c.id ?? null,
        email: c.email,
        template,
        result: "skipped",
        reason: "dry-run",
      });
      continue;
    }

    const email = renderWelcomeEmail(template, c);
    // Try hello@ first; on Resend 422 (unverified domain) retry with fallback.
    let send = await sendEmail({
      to: c.email,
      subject: email.subject,
      html: email.html,
      from: email.fromHello,
      replyTo: email.replyTo,
      tag: `welcome-${template}`,
    });
    if (!send.ok && /422|domain|verif/i.test(send.error || "")) {
      send = await sendEmail({
        to: c.email,
        subject: email.subject,
        html: email.html,
        from: email.fromFallback,
        replyTo: email.replyTo,
        tag: `welcome-${template}-fallback`,
      });
    }

    if (!send.ok) {
      result.errors.push(`${c.email}/${template}: ${send.error || "unknown"}`);
      result.details.push({
        customer_id: c.id ?? null,
        email: c.email,
        template,
        result: "error",
        reason: send.error,
      });
      continue;
    }

    // Log to ledger BEFORE incrementing counters. If insert fails (e.g.
    // unique-violation from a parallel run), we still count it as sent
    // since the recipient got the email — but we surface the conflict.
    try {
      const { error: insErr } = await sb.from("tya_welcome_sent").insert({
        customer_id: c.id,
        email: c.email,
        template,
      });
      if (insErr) {
        result.errors.push(`ledger-insert ${c.email}/${template}: ${insErr.message}`);
      }
    } catch (e) {
      result.errors.push(`ledger-insert-threw ${c.email}/${template}: ${(e as Error).message}`);
    }

    result.sent++;
    result.details.push({
      customer_id: c.id ?? null,
      email: c.email,
      template,
      result: "sent",
    });
  }

  return json(result);
}

// Re-exported for tests / dry-runs.
export { WELCOME_SCHEDULE, WELCOME_TEMPLATES };

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
