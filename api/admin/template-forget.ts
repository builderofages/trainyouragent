// api/admin/template-forget.ts — v201
//
// GDPR Art. 17 / CCPA § 1798.105 right-to-be-forgotten endpoint.
// Hard-deletes all template_sends + sourced_prospects rows matching a
// prospect identifier (email OR company name). The privacy policy
// (/legal/privacy § 4.5) promises action within 30 days of an email
// request; this is the mechanism.
//
// Auth: ADMIN_TOKEN.
//
// POST { email?: string, company?: string, dry_run?: boolean }
//   • At least one of email/company required
//   • If dry_run=true, returns counts without deleting

import { getSupabase, supabaseConfigured } from "../_lib/supabase.js";
import { checkAdmin } from "../_lib/admin-auth.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "../_lib/cors.js";

export const config = { runtime: "edge" };

function j(o: unknown, status = 200, cors: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", ...cors } });
}
function s(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, max);
}

export default async function handler(req: Request): Promise<Response> {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (req.method !== "POST") return j({ ok: false, error: "method" }, 405, cors.headers);
  if (!checkAdmin(req)) return j({ ok: false, error: "unauthorized" }, 401, cors.headers);
  if (!supabaseConfigured()) return j({ ok: false, error: "supabase-not-configured" }, 500, cors.headers);
  const sb = getSupabase();
  if (!sb) return j({ ok: false, error: "supabase-init-failed" }, 500, cors.headers);

  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const email   = s(body.email, 200).toLowerCase();
  const company = s(body.company, 120);
  const dry     = body.dry_run === true;
  if (!email && !company) return j({ ok: false, error: "missing-identifier", hint: "supply email and/or company" }, 400, cors.headers);

  const out: Record<string, number | string | null> = { dry_run: dry ? "yes" : "no" };

  // ── template_sends ────────────────────────────────────────────────
  let sendsQ = sb.from("template_sends");
  if (email && company) {
    // OR filter via supabase-js: split into two passes for clarity
  }
  if (email) {
    const r = dry
      ? await sb.from("template_sends").select("id", { count: "exact", head: true }).eq("prospect_email", email)
      : await sb.from("template_sends").delete({ count: "exact" }).eq("prospect_email", email);
    out.template_sends_by_email = r.count ?? 0;
    if (r.error) out.template_sends_by_email_error = r.error.message;
  }
  if (company) {
    const r = dry
      ? await sb.from("template_sends").select("id", { count: "exact", head: true }).eq("prospect_company_norm", company.toLowerCase())
      : await sb.from("template_sends").delete({ count: "exact" }).eq("prospect_company_norm", company.toLowerCase());
    out.template_sends_by_company = r.count ?? 0;
    if (r.error) out.template_sends_by_company_error = r.error.message;
  }
  // suppress unused var
  void sendsQ;

  // ── sourced_prospects ─────────────────────────────────────────────
  if (email) {
    const r = dry
      ? await sb.from("sourced_prospects").select("id", { count: "exact", head: true }).eq("email", email)
      : await sb.from("sourced_prospects").delete({ count: "exact" }).eq("email", email);
    out.sourced_prospects_by_email = r.count ?? 0;
    if (r.error) out.sourced_prospects_by_email_error = r.error.message;
  }
  if (company) {
    const r = dry
      ? await sb.from("sourced_prospects").select("id", { count: "exact", head: true }).eq("prospect_company_norm", company.toLowerCase())
      : await sb.from("sourced_prospects").delete({ count: "exact" }).eq("prospect_company_norm", company.toLowerCase());
    out.sourced_prospects_by_company = r.count ?? 0;
    if (r.error) out.sourced_prospects_by_company_error = r.error.message;
  }

  return j({ ok: true, identifiers: { email: email || null, company: company || null }, ...out, ts: new Date().toISOString() }, 200, cors.headers);
}
