// src/pages/Compliance.tsx — v47A

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import SectionDivider from "@/components/SectionDivider";
import { injectJsonLdMany, organizationLd, breadcrumbLd } from "@/lib/jsonld";

const LEGAL_EMAIL = "legal@trainyouragent.com";

const GDPR = [
  "TrainYourAgent is the controller of the personal data submitted directly through our marketing site (lead forms, newsletter, account registration) and a processor of the data customers route through our hosted agents. We act under standard EU GDPR principles: lawful basis, data minimization, purpose limitation, transparency, and the rights enumerated below.",
  "Data subject rights — access, rectification, deletion, restriction, portability, and objection — are honored within 30 days of a verified request. EU customers and residents can email privacy@trainyouragent.com to invoke any of these rights. We verify identity using the email address on file plus a second-factor confirmation; no identity documents are required.",
  "International transfers from the EU/EEA to the United States are governed by the EU Commission's Standard Contractual Clauses (SCCs) and the supplementary measures described in our Data Processing Addendum. Where customers require EU-only data residency, we can deploy an EU-resident database instance under a custom DPA.",
  "Data Protection Impact Assessments (DPIAs) are conducted before launching any feature that processes new categories of personal data or applies automated decisioning. We do not perform automated decisioning that has legal effects on data subjects.",
];

const CCPA = [
  "California residents have the right to know what personal information we collect, the right to delete it, the right to opt out of any sale or sharing for cross-context behavioral advertising, and the right to non-discrimination for exercising any of these rights. We do not sell personal information. We do not share personal information for cross-context behavioral advertising.",
  "To submit a CCPA request, email privacy@trainyouragent.com with the subject line 'CCPA Request' and specify which right you are exercising. We verify identity using the email address on file plus, for deletion requests, a second confirmation step. We respond within 45 days; this can be extended once by 45 additional days where reasonably necessary.",
  "If you have an authorized agent acting on your behalf, we will require a signed permission from you confirming the agent's authority, and we may also confirm your identity directly. We do not discriminate against any consumer for exercising any of these rights — your service, pricing, and product access are unchanged.",
];

const HIPAA = "Not currently a Business Associate. We do not knowingly process Protected Health Information (PHI) on standard deployments. For healthcare customers requiring a Business Associate Agreement (BAA), we can offer a BAA-eligible deployment that routes inference exclusively through Anthropic's Healthcare tier (which itself provides a BAA). Email legal@trainyouragent.com to start the BAA conversation; we typically can have a signed BAA in place within two weeks.";

const RETENTION = [
  { label: "Marketing lead data (forms, newsletter signups)", value: "24 months from last engagement" },
  { label: "Customer account records", value: "Life of contract + 36 months" },
  { label: "Conversation transcripts (chat + voice)", value: "30 days, unless customer opts into extended retention" },
  { label: "Application + infrastructure logs", value: "90 days for security; 13 months aggregated for trends" },
  { label: "Usage analytics", value: "13 months" },
  { label: "Billing records", value: "7 years (US tax and audit retention)" },
];

function DeletionForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending"); setErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      source: "gdpr-deletion-request",
      payload: {
        jurisdiction: String(fd.get("jurisdiction") || ""),
        scope: String(fd.get("scope") || ""),
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
      <input name="name" required placeholder="Your full name"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="email" type="email" required placeholder="Email on file"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <select name="jurisdiction" required defaultValue=""
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] bg-white">
        <option value="" disabled>Your jurisdiction</option>
        <option>EU / EEA (GDPR)</option>
        <option>United Kingdom (UK GDPR)</option>
        <option>California (CCPA / CPRA)</option>
        <option>Other US state</option>
        <option>Other</option>
      </select>
      <select name="scope" required defaultValue=""
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px] bg-white">
        <option value="" disabled>Request type</option>
        <option>Delete all my data</option>
        <option>Access — send me a copy of my data</option>
        <option>Rectification — correct my data</option>
        <option>Portability — export my data</option>
        <option>Restrict processing</option>
      </select>
      <textarea name="notes" rows={3} placeholder="Any additional context"
        className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <button disabled={state === "sending"}
          className="px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50">
          {state === "sending" ? "Sending…" : "Submit request"}
        </button>
        {state === "sent" && <span className="text-[13px] text-emerald-600 font-medium">Got it — we'll confirm within 72 hours, complete within 30 days.</span>}
        {state === "error" && <span className="text-[13px] text-rose-600">Couldn't send ({err}). Email privacy@trainyouragent.com.</span>}
        <span className="text-[12px] text-slate-500">Verified, processed, and confirmed within 30 days.</span>
      </div>
    </form>
  );
}

export default function Compliance() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Compliance · TrainYourAgent";
    {
      const ogImage = `https://trainyouragent.com/api/og?title=${encodeURIComponent("Compliance — built for regulated buyers")}&subtitle=${encodeURIComponent("SOC 2 · HIPAA · GDPR · TCPA posture")}&type=trust&badge=COMPLIANCE`;
      const sM = (sel: string, a: "name"|"property", k: string, v: string) => { let el = document.querySelector(sel) as HTMLMetaElement | null; if (!el) { el = document.createElement("meta"); el.setAttribute(a, k); document.head.appendChild(el); } el.setAttribute("content", v); };
      sM("meta[property='og:image']", "property", "og:image", ogImage);
      sM("meta[name='twitter:image']", "name", "twitter:image", ogImage);
      sM("meta[name='twitter:card']", "name", "twitter:card", "summary_large_image");
    }
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    injectJsonLdMany([
      { id: "comp-org", data: organizationLd() },
      { id: "comp-bc", data: breadcrumbLd([
        { name: "Home", url: "/" }, { name: "Trust Center", url: "/trust-center" }, { name: "Compliance", url: "/compliance" },
      ]) },
    ]);
  }, []);
  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="about" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      <section className="px-5 sm:px-8 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Compliance</div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            GDPR, CCPA, HIPAA — <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>what we do.</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            How TrainYourAgent handles the regulations that matter to international, healthcare, and California-resident customers. If your privacy team needs something in writing — a custom DPA, BAA, signed SCCs, or a deletion confirmation — email <a href={`mailto:${LEGAL_EMAIL}`} className="underline text-[#185FA5]">{LEGAL_EMAIL}</a>.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">GDPR (EU / EEA / UK)</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-6">Data subject rights.</h2>
          <div className="space-y-5 text-[15px] text-slate-700 leading-relaxed">
            {GDPR.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">CCPA / CPRA (California)</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-6">California consumer privacy.</h2>
          <div className="space-y-5 text-[15px] text-slate-700 leading-relaxed">
            {CCPA.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">HIPAA (healthcare)</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-6">Business Associate stance.</h2>
          <p className="text-[15px] text-slate-700 leading-relaxed">{HIPAA}</p>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Documents</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-4">DPA, NDA, SCCs, BAA.</h2>
          <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
            Standard Data Processing Addendum available on request — typically signed within 5 business days. Mutual NDA template available, also on request. EU Standard Contractual Clauses and UK International Data Transfer Addendum are pre-signed by our team and ready to counter-sign. Email <a href={`mailto:${LEGAL_EMAIL}`} className="underline text-[#185FA5]">{LEGAL_EMAIL}</a> for any of the above.
          </p>
          <p className="text-[13px] text-slate-600">
            Sub-processor list and detailed data flows — see <Link to="/security" className="underline text-[#185FA5]">our Security page</Link>.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Data retention</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-6">How long we keep what.</h2>
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <table className="min-w-full text-[14px]">
              <tbody>
                {RETENTION.map((r) => (
                  <tr key={r.label} className="border-t first:border-t-0 border-slate-200">
                    <td className="px-4 py-3 text-slate-700">{r.label}</td>
                    <td className="px-4 py-3 text-[#042C53] font-semibold">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Right to be forgotten</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-3">
            Request deletion of your data.
          </h2>
          <p className="text-[14px] text-slate-600 mb-8">
            What happens next: we acknowledge the request within 72 hours, verify identity via the email on file, and complete the deletion within 30 days (GDPR Article 12) or 45 days (CCPA §1798.130) — whichever applies to your jurisdiction.
          </p>
          <DeletionForm />
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
