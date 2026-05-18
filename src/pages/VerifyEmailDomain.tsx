// src/pages/VerifyEmailDomain.tsx
// v57a: internal helper for verifying trainyouragent.com with Resend.
// Shows the DNS records you need to add to your DNS host, pulls live
// verification status from /api/admin/resend-domains, and lets you copy
// each record with one click.
//
// Marked noindex via <meta> below — this is an internal tool, not for SEO.

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

type DnsRecord = {
  type: "TXT" | "MX" | "CNAME";
  name: string;
  value: string;
  ttl?: string;
  purpose: string;
};

type DomainStatus = "pending" | "verified" | "failed" | "unknown";

// Default DNS records for trainyouragent.com Resend setup.
// These are the records Resend generates for any new domain — your dashboard
// will show the EXACT values; these are placeholders to copy/paste structure.
const DEFAULT_RECORDS: DnsRecord[] = [
  {
    type: "MX",
    name: "send",
    value: "feedback-smtp.us-east-1.amazonses.com (priority 10)",
    ttl: "Auto",
    purpose: "Bounce + complaint feedback from SES (Resend's upstream)",
  },
  {
    type: "TXT",
    name: "send",
    value: 'v=spf1 include:amazonses.com ~all',
    ttl: "Auto",
    purpose: "SPF — authorizes Amazon SES (Resend) to send as your domain",
  },
  {
    type: "TXT",
    name: "resend._domainkey",
    value: "p=MIGfMA0GCSq...(from Resend dashboard)",
    ttl: "Auto",
    purpose: "DKIM — cryptographic proof Resend can sign mail for you",
  },
  {
    type: "TXT",
    name: "_dmarc",
    value: "v=DMARC1; p=none; rua=mailto:dmarc@trainyouragent.com",
    ttl: "Auto",
    purpose: "DMARC — policy for receivers when SPF/DKIM disagree",
  },
];

export default function VerifyEmailDomain(): JSX.Element {
  const [status, setStatus] = useState<DomainStatus>("unknown");
  const [records, setRecords] = useState<DnsRecord[]>(DEFAULT_RECORDS);
  const [domain, setDomain] = useState<string>("trainyouragent.com");
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/admin/resend-domains");
      if (r.status === 401) {
        setError("This page requires the admin token. Append ?token=YOUR_ADMIN_TOKEN to the URL, or call /api/admin/resend-domains with x-admin-token header.");
        setStatus("unknown");
        return;
      }
      if (!r.ok) {
        setError(`Status ${r.status} from /api/admin/resend-domains`);
        return;
      }
      const data = await r.json() as {
        domains?: Array<{ name: string; status: string; records?: DnsRecord[] }>;
      };
      const target = (data.domains || []).find((d) => d.name === domain) || (data.domains || [])[0];
      if (target) {
        setDomain(target.name);
        setStatus(normalizeStatus(target.status));
        if (target.records?.length) setRecords(target.records);
      } else {
        setStatus("pending");
      }
      setLastCheckedAt(new Date().toLocaleString());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  return (
    <div style={{ fontFamily: "'Inter Tight',system-ui,sans-serif", background: "#FFFFFF", color: "#0B1B2B", minHeight: "100vh" }}>
      <Helmet>
        <title>Email domain verification — TrainYourAgent (internal)</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "48px 24px 96px" }}>
        <div style={{ fontSize: 12, color: "#7A8B9C", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 12 }}>
          Internal tool
        </div>
        <h1 style={{ fontSize: 34, lineHeight: 1.15, color: "#042C53", margin: "0 0 12px", fontWeight: 700 }}>
          Email domain verification helper
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: "#3C4858", maxWidth: 640, margin: "0 0 32px" }}>
          One-page worksheet for verifying <code style={codeInline}>{domain}</code> with Resend. Add the
          DNS records below to your DNS host (GoDaddy, Cloudflare, Route 53 — wherever
          your nameservers point). Once verified, switch <code style={codeInline}>RESEND_FROM_EMAIL</code> in
          Vercel from the <code style={codeInline}>onboarding@resend.dev</code> sandbox to{" "}
          <code style={codeInline}>noreply@{domain}</code>.
        </p>

        <StatusPill status={status} loading={loading} />
        {lastCheckedAt && (
          <div style={{ fontSize: 12, color: "#7A8B9C", marginTop: 8 }}>
            Last checked: {lastCheckedAt}
          </div>
        )}
        {error && (
          <div style={{ background: "#FEF3F2", border: "1px solid #FECDCA", padding: 12, borderRadius: 8, marginTop: 16, fontSize: 13, color: "#912018" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button onClick={refresh} disabled={loading} style={btnPrimary}>
            {loading ? "Checking…" : "Re-check verification"}
          </button>
          <a
            href="https://resend.com/domains"
            target="_blank"
            rel="noreferrer noopener"
            style={btnSecondary}
          >
            Open Resend dashboard
          </a>
        </div>

        <h2 style={{ fontSize: 20, color: "#042C53", marginTop: 48, marginBottom: 8 }}>Steps</h2>
        <ol style={{ fontSize: 14.5, lineHeight: 1.7, color: "#3C4858", paddingLeft: 22, margin: "0 0 32px" }}>
          <li>Add the {records.length} DNS records below to your DNS host for <code style={codeInline}>{domain}</code></li>
          <li>Wait 5–30 minutes for DNS propagation (some hosts take longer — check whatsmydns.net)</li>
          <li>Click <em>Re-check verification</em> above. Status should flip to <strong style={{ color: "#0E7C66" }}>verified</strong></li>
          <li>Once verified, set <code style={codeInline}>RESEND_FROM_EMAIL=TrainYourAgent &lt;noreply@{domain}&gt;</code> in Vercel and redeploy</li>
        </ol>

        <h2 style={{ fontSize: 20, color: "#042C53", marginTop: 40, marginBottom: 12 }}>DNS records ({records.length})</h2>
        <RecordsTable records={records} />

        <h2 style={{ fontSize: 20, color: "#042C53", marginTop: 48, marginBottom: 8 }}>Troubleshooting</h2>
        <ul style={{ fontSize: 14, lineHeight: 1.7, color: "#3C4858", paddingLeft: 22, margin: 0 }}>
          <li>If the record name shows as <code style={codeInline}>send.{domain}</code> after saving, your DNS host appended the apex automatically — that's fine.</li>
          <li>If status stays pending after 1 hour, run <code style={codeInline}>dig TXT resend._domainkey.{domain}</code> and confirm the value matches the Resend dashboard exactly.</li>
          <li>SPF: only one <code style={codeInline}>v=spf1</code> record per subdomain. If you already have SPF for SES, merge them.</li>
          <li>DMARC: this template uses <code style={codeInline}>p=none</code> (monitor only). Once SPF + DKIM are clean, tighten to <code style={codeInline}>p=quarantine</code>.</li>
        </ul>
      </div>
    </div>
  );
}

function normalizeStatus(s: string): DomainStatus {
  const v = (s || "").toLowerCase();
  if (v.includes("verif")) return "verified";
  if (v.includes("pend")) return "pending";
  if (v.includes("fail")) return "failed";
  return "unknown";
}

function StatusPill({ status, loading }: { status: DomainStatus; loading: boolean }): JSX.Element {
  const color =
    status === "verified" ? "#0E7C66" :
    status === "pending"  ? "#B54708" :
    status === "failed"   ? "#912018" : "#475467";
  const bg =
    status === "verified" ? "#ECFDF3" :
    status === "pending"  ? "#FFFAEB" :
    status === "failed"   ? "#FEF3F2" : "#F2F4F7";
  const label =
    loading ? "Checking…" :
    status === "verified" ? "Verified" :
    status === "pending"  ? "Pending (DNS not yet propagated or records mismatch)" :
    status === "failed"   ? "Failed (records mismatch — re-add)" : "Status unknown (admin token required to check)";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: bg, color, padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: color, display: "inline-block" }} />
      {label}
    </div>
  );
}

function RecordsTable({ records }: { records: DnsRecord[] }): JSX.Element {
  return (
    <div style={{ border: "1px solid #E4E7EC", borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead style={{ background: "#F9FAFB", textAlign: "left" }}>
          <tr>
            <th style={th}>Type</th>
            <th style={th}>Name</th>
            <th style={th}>Value</th>
            <th style={th}>TTL</th>
            <th style={th} aria-label="Copy" />
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={`${r.type}-${r.name}-${i}`} style={{ borderTop: "1px solid #E4E7EC" }}>
              <td style={td}>
                <code style={codeInline}>{r.type}</code>
              </td>
              <td style={td}>
                <CopyableCode value={r.name} />
                <div style={{ fontSize: 11, color: "#7A8B9C", marginTop: 4 }}>{r.purpose}</div>
              </td>
              <td style={{ ...td, maxWidth: 340 }}>
                <CopyableCode value={r.value} wrap />
              </td>
              <td style={td}><code style={codeInline}>{r.ttl || "Auto"}</code></td>
              <td style={td}>
                <CopyButton text={`${r.name}\t${r.type}\t${r.value}`} label="Copy row" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CopyableCode({ value, wrap }: { value: string; wrap?: boolean }): JSX.Element {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <code style={{ ...codeInline, wordBreak: wrap ? "break-all" : "normal", fontSize: 12 }}>{value}</code>
      <CopyButton text={value} label="Copy" small />
    </div>
  );
}

function CopyButton({ text, label, small }: { text: string; label: string; small?: boolean }): JSX.Element {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }
        catch { /* clipboard blocked */ }
      }}
      style={{
        fontSize: small ? 11 : 12,
        padding: small ? "2px 6px" : "4px 10px",
        background: copied ? "#ECFDF3" : "#F2F4F7",
        color: copied ? "#0E7C66" : "#344054",
        border: "1px solid " + (copied ? "#A7E8C5" : "#D0D5DD"),
        borderRadius: 4,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}

const codeInline: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', SFMono-Regular, Menlo, monospace",
  fontSize: 12,
  background: "#F2F4F7",
  padding: "2px 6px",
  borderRadius: 4,
  color: "#101828",
};

const th: React.CSSProperties = { padding: "10px 12px", fontWeight: 600, color: "#475467", fontSize: 12 };
const td: React.CSSProperties = { padding: "12px", verticalAlign: "top" };

const btnPrimary: React.CSSProperties = {
  background: "#042C53",
  color: "#FFFFFF",
  border: "none",
  padding: "10px 18px",
  borderRadius: 6,
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};
const btnSecondary: React.CSSProperties = {
  background: "#FFFFFF",
  color: "#042C53",
  border: "1px solid #D0D5DD",
  padding: "10px 18px",
  borderRadius: 6,
  fontWeight: 600,
  fontSize: 14,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};
