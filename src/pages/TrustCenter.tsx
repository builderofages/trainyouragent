// src/pages/TrustCenter.tsx — v47A

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import SectionDivider from "@/components/SectionDivider";
import { injectJsonLdMany, organizationLd, breadcrumbLd } from "@/lib/jsonld";
import TrustShieldIllo from "@/components/illustrations/TrustShieldIllo";

const SECURITY_EMAIL = "security@trainyouragent.com";

const CARDS = [
  { to: "/security", label: "Security", desc: "Encryption, access control, sub-processors, SOC 2 status." },
  { to: "/compliance", label: "Compliance", desc: "GDPR, CCPA, HIPAA stance and data subject rights." },
  { to: "/accessibility", label: "Accessibility", desc: "WCAG 2.1 AA — current state, known gaps, contact." },
  { to: "/uptime", label: "Uptime", desc: "Real status, 90-day uptime, incident history." },
  { to: "/privacy", label: "Privacy", desc: "How we collect, use, and share personal data." },
  { to: "/terms", label: "Terms", desc: "Terms of service, acceptable use, SLA, governing law." },
];

const DOCS = [
  { name: "SOC 2 Type-1 report", status: "Pre-attestation — targeting Q3 2026" },
  { name: "Data Processing Addendum (DPA)", status: "Available on request — typical countersign 5 days" },
  { name: "Master Services Agreement (MSA) template", status: "Available on request" },
  { name: "Business Associate Agreement (BAA)", status: "Available for healthcare deployments — BAA-eligible tier" },
  { name: "Security questionnaire response (CAIQ / SIG Lite)", status: "Available on request — turnaround 1 business day" },
  { name: "Insurance certificate (E&O + cyber)", status: "Available on request — current through Dec 2026" },
  { name: "Mutual NDA template", status: "Available on request" },
  { name: "EU Standard Contractual Clauses + UK IDTA", status: "Pre-signed, ready to counter-sign" },
];

function CallForm() {
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
      source: "enterprise-security-call",
      payload: {
        role: String(fd.get("role") || ""),
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
      <input name="name" required placeholder="Your name"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="email" type="email" required placeholder="Work email"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="company" required placeholder="Company"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="role" placeholder="Your role (e.g. CISO, IT, Procurement)"
        className="rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <input name="scope" placeholder="Anticipated scope or deal size (optional)"
        className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <textarea name="notes" rows={3} placeholder="What do you most need answered?"
        className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-[14px]" />
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <button disabled={state === "sending"}
          className="px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50">
          {state === "sending" ? "Sending…" : "Talk to security"}
        </button>
        {state === "sent" && <span className="text-[13px] text-emerald-600 font-medium">Got it — security lead will reach out within 1 business day.</span>}
        {state === "error" && <span className="text-[13px] text-rose-600">Couldn't send ({err}). Email {SECURITY_EMAIL}.</span>}
        <span className="text-[12px] text-slate-500">Reply within 1 business day from our security lead.</span>
      </div>
    </form>
  );
}

export default function TrustCenter() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Trust Center · TrainYourAgent";
    {
      const ogImage = `https://trainyouragent.com/api/og?title=${encodeURIComponent("Trust Center — security, uptime, audits")}&subtitle=${encodeURIComponent("Everything procurement asks for, in one place")}&type=trust&badge=TRUST`;
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
      { id: "tc-org", data: organizationLd() },
      { id: "tc-bc", data: breadcrumbLd([
        { name: "Home", url: "/" }, { name: "Trust Center", url: "/trust-center" },
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 items-center">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Trust Center</div>
            <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
              One place for security, compliance, <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>privacy, accessibility, and uptime.</span>
            </h1>
            <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
              Everything procurement, security, legal, and IT teams need to evaluate TrainYourAgent — in one place, with honest answers, and a real person on the other end of every email.
            </p>
          </div>
          <div className="hidden lg:block">
            <TrustShieldIllo style={{ width: "100%", maxWidth: 320, height: "auto", margin: "0 auto" }} />
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Resources</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">Six places to start.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CARDS.map((c) => (
              <Link key={c.to} to={c.to}
                className="block rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#185FA5] transition">
                <div className="text-[18px] font-semibold text-[#042C53]">{c.label} →</div>
                <p className="mt-2 text-[14px] text-slate-700 leading-snug">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Documents on request</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-6">
            What we can send you.
          </h2>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            {DOCS.map((d, i) => (
              <div key={d.name} className={`flex flex-wrap items-baseline justify-between gap-3 px-5 py-4 ${i === 0 ? "" : "border-t border-slate-200"}`}>
                <div className="text-[14px] font-semibold text-[#042C53]">{d.name}</div>
                <div className="text-[12.5px] text-slate-600">{d.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE]">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Talk to security</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-3">
            Get on a call with our security lead.
          </h2>
          <p className="text-[14px] text-slate-600 mb-8">
            What happens next: a 30-minute call within 1 business day. Your CISO/IT lead drives the agenda — we'll bring the documents, the answers, and the willingness to say "we don't have that yet" when we don't.
          </p>
          <CallForm />
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
