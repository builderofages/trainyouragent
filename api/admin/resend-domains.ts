// api/admin/resend-domains.ts — v57a
// Token-gated read-only proxy for Resend's GET /domains. Powers the
// /verify-email-domain helper page so we can show live verification status
// without ever putting the Resend API key in the browser.
//
// Auth: ?token=<ADMIN_TOKEN> or x-admin-token header.
// Graceful: returns 200 with {ok:false, error:"resend-not-configured"} when
// RESEND_API_KEY is unset so the helper page can render placeholder rows.

import { checkAdmin, unauthorized } from "../_lib/admin-auth.js";
import { rateLimit, ipFromRequest } from "../_lib/rate-limit.js";

export const config = { runtime: "edge" };

const RESEND_KEY = process.env.RESEND_API_KEY || "";

type ResendDnsRecord = {
  record: string;
  name: string;
  type: string;
  value: string;
  ttl?: string | number;
  status?: string;
  priority?: number;
};

type ResendDomain = {
  id: string;
  name: string;
  status: string;
  region?: string;
  created_at?: string;
  records?: ResendDnsRecord[];
};

export default async function handler(req: Request): Promise<Response> {
  const ip = ipFromRequest(req);
  const rl = rateLimit(`adm-resend-domains:${ip}`, { limit: 60, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return unauthorized({ "retry-after": String(Math.ceil((rl.reset - Date.now()) / 1000)) });
  if (!checkAdmin(req)) return unauthorized();
  if (req.method !== "GET") return json({ ok: false, error: "method" }, 405);

  if (!RESEND_KEY) {
    return json({ ok: false, error: "resend-not-configured", domains: [] }, 200);
  }

  try {
    const r = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${RESEND_KEY}` },
    });
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return json({ ok: false, error: `resend ${r.status}`, details: t.slice(0, 300) }, 200);
    }
    const data = await r.json() as { data?: ResendDomain[] };
    const list = (data.data || []) as ResendDomain[];

    // For each domain, also try to fetch the per-domain detail (which has the
    // DNS records). We only fetch the records for the first 3 to limit fanout.
    const detailed = await Promise.all(list.slice(0, 3).map(async (d) => {
      try {
        const r2 = await fetch(`https://api.resend.com/domains/${d.id}`, {
          headers: { Authorization: `Bearer ${RESEND_KEY}` },
        });
        if (!r2.ok) return d;
        const detail = await r2.json() as ResendDomain;
        return { ...d, ...detail };
      } catch { return d; }
    }));

    const projected = detailed.map((d) => ({
      name: d.name,
      status: d.status,
      records: (d.records || []).map((rec) => ({
        type: (rec.type || "TXT").toUpperCase() as "TXT" | "MX" | "CNAME",
        name: rec.name || "@",
        value: rec.value || "",
        ttl: rec.ttl ? String(rec.ttl) : "Auto",
        purpose: explain(rec),
      })),
    }));

    return json({ ok: true, domains: projected }, 200);
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 200);
  }
}

function explain(rec: ResendDnsRecord): string {
  const t = (rec.type || "").toUpperCase();
  const n = (rec.name || "").toLowerCase();
  if (t === "MX") return "Bounce + complaint feedback from SES";
  if (n.includes("dmarc")) return "DMARC — policy for receivers when SPF/DKIM disagree";
  if (n.includes("domainkey")) return "DKIM — cryptographic signing key";
  if ((rec.value || "").includes("v=spf1")) return "SPF — authorize Resend/SES to send";
  return "Required by Resend";
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status, headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
