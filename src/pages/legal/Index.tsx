// src/pages/legal/Index.tsx
// v76-D: /legal index — lists all 11 legal documents.

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import FooterV44 from "@/components/FooterV44";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LAST_REVIEWED = "May 20, 2026";

const DOCS = [
  { slug: "terms", title: "Terms of Service", blurb: "The master contract. Acceptance, services, accounts, payment, IP, prohibited uses, warranty disclaimer, liability cap, indemnity, termination, Florida law." },
  { slug: "privacy", title: "Privacy Policy", blurb: "What we collect, how we use it, who we share with, retention, your rights, international transfers, security." },
  { slug: "cookies", title: "Cookie Policy", blurb: "Full inventory of cookies on trainyouragent.com, by category, with opt-out links and GPC honoring." },
  { slug: "dpa", title: "Data Processing Agreement", blurb: "GDPR Art. 28 / CCPA service-provider terms. Sub-processor governance, breach notice, audit rights, SCCs." },
  { slug: "aup", title: "Acceptable Use Policy", blurb: "What you can and can't do with TYA-trained agents. Voice / messaging / weights / benchmarks rules." },
  { slug: "refund", title: "Refund Policy", blurb: "Refund terms by product line: Self-Serve SaaS, custom builds, hire-the-operator." },
  { slug: "ai-use", title: "AI Use Policy", blurb: "What AI we use, what we don't do, EU AI Act categorization, right to human review." },
  { slug: "sla", title: "Service Level Agreement", blurb: "99.5% uptime + P1 4h response targets + service credits for custom builds and hire-the-operator." },
  { slug: "sub-processors", title: "Sub-processor list", blurb: "Live, named list of vendors that process customer data, with locations and certifications." },
  { slug: "gdpr", title: "GDPR Notice", blurb: "Plain-English summary of EU / UK / Swiss rights and how to exercise them." },
  { slug: "ccpa", title: "CCPA / CPRA Notice", blurb: "Plain-English summary of California rights and Do Not Sell or Share." },
];

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, color: "#042C53" }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <g strokeWidth="4">
          <path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" />
        </g>
        <g strokeWidth="2.4">
          <path d="M 32 6 L 32 58" />
          <path d="M 6 32 L 58 32" />
        </g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

export default function LegalIndex() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <Helmet>
        <title>Legal | TrainYourAgent</title>
        <meta name="description" content="All TrainYourAgent legal documents — Terms, Privacy, Cookies, DPA, AUP, Refund, AI Use, SLA, Sub-processors, GDPR, CCPA." />
        <link rel="canonical" href="https://trainyouragent.com/legal" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <BrainLogo size={36} />
            <span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-[14px] text-slate-700">
            <Link to="/solutions" className="hover:text-[#042C53]">Solutions</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <Link to="/pricing" className="hover:text-[#042C53]">Pricing</Link>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E]"
            >
              Book a call
            </a>
          </div>
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span
              className="block w-4 h-px bg-[#042C53] relative"
              style={{
                boxShadow: mobileOpen
                  ? "none"
                  : "0 -5px 0 #042C53, 0 5px 0 #042C53",
                transform: mobileOpen ? "rotate(45deg)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      <header className="bg-[#042C53] text-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="text-[11px] sm:text-[12px] uppercase tracking-[0.22em] font-semibold text-[#9BC3E8] mb-4">
            LEGAL · INDEX
          </div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold mb-5">
            All legal documents
          </h1>
          <p className="text-[18px] sm:text-[20px] leading-relaxed text-white/85 max-w-2xl">
            Eleven documents covering the full surface: commercial terms, data handling, EU and California rights, vendor list, and the AI-specific policy that 2026 enterprise procurement now asks for.
          </p>
          <div className="mt-6 text-[13.5px] text-white/70">
            Last reviewed: <span className="text-white font-medium">{LAST_REVIEWED}</span>
            &nbsp;·&nbsp; Updates posted here at least 30 days before they take effect.
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
        <ul className="grid sm:grid-cols-2 gap-5">
          {DOCS.map((d, i) => (
            <li key={d.slug}>
              <Link
                to={`/legal/${d.slug}`}
                className="block rounded-2xl border border-slate-200 bg-white hover:border-[#185FA5] hover:shadow-sm transition p-6 h-full"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">/legal/{d.slug}</div>
                </div>
                <div className="text-[20px] font-semibold text-[#042C53] mb-2">{d.title}</div>
                <p className="text-[14.5px] text-slate-600 leading-relaxed">{d.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-16 rounded-2xl bg-slate-50 border border-slate-200 p-7">
          <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-3">
            Need something signed?
          </div>
          <h2 className="text-[24px] font-semibold text-[#042C53] mb-2">
            Custom paper, redlines, MNDAs, security questionnaires
          </h2>
          <p className="text-[15.5px] text-slate-700 leading-relaxed mb-5">
            For enterprise procurement we&apos;re happy to execute on your paper, accept reasonable redlines on the DPA and Terms, complete a SIG Lite / CAIQ Lite security questionnaire, or sign an MNDA. Email{" "}
            <a href="mailto:legal@trainyouragent.com" className="text-[#185FA5] hover:underline">legal@trainyouragent.com</a>{" "}
            with what you need.
          </p>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#042C53] text-white text-[14px] font-medium hover:bg-[#0A3D6E]"
          >
            Book a procurement call
          </a>
        </section>

        <div className="mt-12 text-[13px] text-slate-500">
          Document last reviewed {LAST_REVIEWED}. Each individual document carries its own last-updated date. Recommend running by your own counsel for your jurisdiction before relying on any clause for a binding obligation.
        </div>
      </main>

      <FooterV44 />
    </div>
  );
}
