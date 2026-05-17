// src/pages/Security.tsx — v47A (full rewrite for enterprise posture)

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import SectionDivider from "@/components/SectionDivider";
import { injectJsonLdMany, organizationLd, breadcrumbLd } from "@/lib/jsonld";

const SECURITY_EMAIL = "security@trainyouragent.com";

const SUBS: Array<{ name: string; purpose: string; data: string; dpa: string }> = [
  { name: "Vercel", purpose: "Web hosting and global edge delivery", data: "Page requests, IP, user-agent — no PII at the platform layer", dpa: "https://vercel.com/legal/dpa" },
  { name: "Supabase", purpose: "Database, auth, file storage", data: "Lead form submissions, account records, configuration", dpa: "https://supabase.com/legal/dpa" },
  { name: "Anthropic", purpose: "Claude inference for chat + agent reasoning", data: "Conversation transcripts (zero-retention via API enterprise terms)", dpa: "https://www.anthropic.com/legal/dpa" },
  { name: "Cal.com", purpose: "Meeting scheduling for sales calls", data: "Name, email, calendar slot", dpa: "https://cal.com/legal" },
  { name: "Stripe", purpose: "Payment processing", data: "Billing details — full PCI scope handled by Stripe", dpa: "https://stripe.com/legal/dpa" },
  { name: "Resend", purpose: "Transactional email delivery", data: "Email address, send metadata", dpa: "https://resend.com/legal/dpa" },
  { name: "beehiiv", purpose: "Newsletter delivery", data: "Email, optional name, open/click telemetry", dpa: "https://www.beehiiv.com/tou" },
];

const PILLARS = [
  {
    h: "Encryption",
    p: "TLS 1.3 in transit, managed end-to-end by Cloudflare and Vercel's edge. AES-256 at rest on all data we store — handled at the storage layer by Supabase. All client-to-API traffic is HTTPS-only with HSTS preload. No plaintext data leaves your browser.",
  },
  {
    h: "Data residency",
    p: "Primary database is hosted on Supabase, US-East-2 (Ohio). Static assets are served from Vercel's global edge network with North America and Europe as primary regions. If your jurisdiction requires EU-only residency, we can deploy an EU-resident instance under a custom DPA — email security@ to discuss.",
  },
  {
    h: "Access control",
    p: "All employee access to production infrastructure is MFA-enforced via SSO. Database access is gated by short-lived credentials and audited; long-lived service tokens are rotated quarterly. No customer data is accessible from local developer machines.",
  },
  {
    h: "Logging and monitoring",
    p: "Application and infrastructure logs are retained 90 days for security investigation and capped at 13 months for trend analysis. We monitor for anomalous request patterns, authentication failures, and unusual data egress, with on-call rotation alerting for high-severity events.",
  },
];

function QuestionnaireForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending"); setErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      company: String(fd.get("company") || ""),
      source: "security-questionnaire-request",
      payload: {
        format: String(fd.get("format") || ""),
        notes: String(fd.get("notes") || ""),
      },
    };
    try {
      const r = await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setState("sent"); (e.currentTarget as HTMLFormElement).reset();
    } catch (e: any) { setState("error"); setErr(e?.message || "Network error"); }
  }
  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
      <input name="name" required placeholder="Your name"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="email" type="email" required placeholder="Work email"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="company" required placeholder="Company"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <select name="format" required defaultValue=""
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] bg-white">
        <option value="" disabled>Preferred format</option>
        <option>CAIQ (Cloud Security Alliance)</option>
        <option>SIG Lite / SIG Core</option>
        <option>Custom questionnaire (upload)</option>
        <option>Generic security overview PDF</option>
      </select>
      <textarea name="notes" rows={4} placeholder="Anything specific you need answered? Compliance deadline?"
        className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <button disabled={state === "sending"}
          className="px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50">
          {state === "sending" ? "Sending…" : "Request questionnaire"}
        </button>
        {state === "sent" && <span className="text-[13px] text-emerald-600 font-medium">Got it — security team will reply within 1 business day.</span>}
        {state === "error" && <span className="text-[13px] text-rose-600">Couldn't send ({err}). Email {SECURITY_EMAIL} directly.</span>}
        <span className="text-[12px] text-slate-500">Response within 1 business day. NDA available on request.</span>
      </div>
    </form>
  );
}

export default function Security() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Security · TrainYourAgent";
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    injectJsonLdMany([
      { id: "sec-org", data: organizationLd() },
      { id: "sec-bc", data: breadcrumbLd([
        { name: "Home", url: "/" }, { name: "Trust Center", url: "/trust-center" }, { name: "Security", url: "/security" },
      ]) },
    ]);
  }, []);
  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="about" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      {/* HERO */}
      <section className="px-5 sm:px-8 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Security</div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            Our security posture, <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>in plain English.</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            Here's what we do, what we use, and what we promise. No jargon, no certifications we don't have, no hand-waving. If something matters to your security team and isn't listed here, email <a href={`mailto:${SECURITY_EMAIL}`} className="underline text-[#185FA5]">{SECURITY_EMAIL}</a> — we'll either answer the question or explain why we can't.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* PILLARS */}
      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Core posture</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">
            The four things <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>that matter.</span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-5">
            {PILLARS.map((p) => (
              <article key={p.h} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-[18px] font-semibold text-[#042C53]">{p.h}</h3>
                <p className="mt-3 text-[14px] text-slate-700 leading-relaxed">{p.p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* SUB-PROCESSORS */}
      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Sub-processors</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-3">
            Every vendor that touches your data.
          </h2>
          <p className="text-[14px] text-slate-600 max-w-3xl mb-8">
            We don't subcontract operations to anyone outside this list. New sub-processors are announced 30 days in advance to enterprise customers under DPA.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-[13.5px]">
              <thead className="bg-[#F6FAFE]">
                <tr className="text-left text-[#042C53]">
                  <th className="px-4 py-3 font-semibold">Sub-processor</th>
                  <th className="px-4 py-3 font-semibold">Purpose</th>
                  <th className="px-4 py-3 font-semibold">Data touched</th>
                  <th className="px-4 py-3 font-semibold">DPA</th>
                </tr>
              </thead>
              <tbody>
                {SUBS.map((s) => (
                  <tr key={s.name} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-3 font-semibold text-[#042C53]">{s.name}</td>
                    <td className="px-4 py-3 text-slate-700">{s.purpose}</td>
                    <td className="px-4 py-3 text-slate-700">{s.data}</td>
                    <td className="px-4 py-3"><a href={s.dpa} target="_blank" rel="noopener" className="underline text-[#185FA5]">DPA →</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* CERTS + DISCLOSURE */}
      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Certifications</div>
            <h3 className="text-[24px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-4">SOC 2 status</h3>
            <p className="text-[14.5px] text-slate-700 leading-relaxed">
              Pre-Type-1. Targeting SOC 2 Type-1 by Q3 2026 and Type-2 attestation by Q1 2027 via a Big-4 audit firm. In the meantime, we can provide on request: our security questionnaire response (CAIQ or SIG Lite), a custom DPA, a mutual NDA, and our internal control narrative. Email <a href={`mailto:${SECURITY_EMAIL}`} className="underline text-[#185FA5]">{SECURITY_EMAIL}</a> for any of the above.
            </p>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Vulnerability disclosure</div>
            <h3 className="text-[24px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-4">Report a finding</h3>
            <p className="text-[14.5px] text-slate-700 leading-relaxed mb-3">
              If you've found a vulnerability, email <a href={`mailto:${SECURITY_EMAIL}`} className="underline text-[#185FA5]">{SECURITY_EMAIL}</a> with a PoC. We acknowledge within 24 hours and ship a fix within the timelines defined in our internal SLA (critical: 72h, high: 7d, medium: 30d).
            </p>
            <p className="text-[14.5px] text-slate-700 leading-relaxed">
              <strong className="text-[#042C53]">Bug bounty:</strong> confidential program. Email <a href={`mailto:${SECURITY_EMAIL}`} className="underline text-[#185FA5]">{SECURITY_EMAIL}</a> to enroll. Payouts range from $100 to $5,000 per validated finding depending on severity, exploitability, and quality of report.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* QUESTIONNAIRE FORM */}
      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">For procurement teams</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-3">
            Get our security questionnaire.
          </h2>
          <p className="text-[14px] text-slate-600 mb-8">
            What happens next: our security lead receives the request, drafts the response against your specific format, and sends back within 1 business day. Custom DPAs and mutual NDAs are bundled on request.
          </p>
          <QuestionnaireForm />
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE]">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-4">
          <Link to="/compliance" className="block rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#185FA5]">
            <div className="text-[14px] font-semibold text-[#042C53]">Compliance →</div>
            <div className="text-[12px] text-slate-600 mt-1">GDPR, CCPA, HIPAA, DPA</div>
          </Link>
          <Link to="/uptime" className="block rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#185FA5]">
            <div className="text-[14px] font-semibold text-[#042C53]">Uptime →</div>
            <div className="text-[12px] text-slate-600 mt-1">Live status & incident history</div>
          </Link>
          <Link to="/trust-center" className="block rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#185FA5]">
            <div className="text-[14px] font-semibold text-[#042C53]">Trust Center →</div>
            <div className="text-[12px] text-slate-600 mt-1">All trust resources, one page</div>
          </Link>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
