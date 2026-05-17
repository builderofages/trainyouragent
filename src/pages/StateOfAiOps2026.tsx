// src/pages/StateOfAiOps2026.tsx
// v42: lead-magnet report page with email gate -> PDF download.
// v52B: swapped manual form for the unified <LeadMagnetForm>.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import LeadMagnetForm from "@/components/LeadMagnetForm";

const NAVY = "#042C53";
const BLUE = "#185FA5";
const FONT = "'Inter Tight', system-ui, sans-serif";

const KEY_FINDINGS = [
  "62% of SMBs piloted an AI agent in 2024-25 — only 19% reached production.",
  "Voice-agent installs reach payback in a median 47 days; real-estate verticals hit it in 19.",
  "The top failure mode (41% of dead pilots): no named metric owner on the customer side.",
  "Vendor landscape consolidated from 7 categories to 3 — horizontal platforms, vertical-specialist agencies, and incumbent CRMs adding AI.",
  "Median model spend per resolved support ticket dropped from $0.31 to $0.04 in 18 months.",
];

const TOC = [
  "Executive summary",
  "Section 1 — Adoption by vertical (8 categories)",
  "Section 2 — ROI benchmarks across 5 deployment types",
  "Section 3 — The 7 reasons pilots fail",
  "Section 4 — 15-point readiness scorecard",
  "Section 5 — Vendor landscape (three-category framework)",
  "Section 6 — 2026-2027 predictions (10)",
  "Methodology + bias disclosures",
];

const SAMPLE_CHARTS = [
  { title: "Adoption by vertical", desc: "Horizontal bar chart — Real Estate 41%, Healthcare admin 38%, Legal 34%, HVAC 31%, Auto 28%, Hospitality 22%, Restaurants 14%, Construction 11%." },
  { title: "Median payback days", desc: "Vertical bars — Speed-to-lead outbound 18d, Voice agent inbound 31d, Customer-support chatbot 64d, Sales follow-up 75d, KB / internal Q&A 110d." },
  { title: "Pilot survival funnel", desc: "Funnel — 100% pilots started → 76% reached week-4 evaluation → 41% reached week-8 → 19% reached production." },
  { title: "Failure-mode attribution", desc: "Horizontal bars — No named owner 41%, No success metric 27%, Over-scoped 19%, No escalation 17%, Stale KB 14%, No iteration 13%, Political opposition 11%." },
  { title: "Cost-per-resolved-ticket trend", desc: "Line chart — Jan 2024 $0.31, Jul 2024 $0.18, Jan 2025 $0.09, Jul 2025 $0.06, Jan 2026 $0.04." },
];

export default function StateOfAiOps2026() {
  useEffect(() => {
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: FONT }}>
      <Helmet>
        <title>State of AI Operations 2026 — Free Report · TrainYourAgent</title>
        <meta name="description" content="30-page report on AI agent adoption, ROI benchmarks, pilot failure modes, and the 2026-2027 vendor landscape. Free download." />
      </Helmet>

      <nav className="border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="text-[15px] font-semibold" style={{ color: NAVY }}>TrainYourAgent</Link>
          <Link to="/blog" className="text-[13px] text-slate-600 hover:text-[#185FA5]">All blog posts</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-3" style={{ color: BLUE }}>Q2 2026 · Free report</div>
        <h1 className="text-[36px] sm:text-[52px] font-semibold leading-[1.05] mb-4" style={{ color: NAVY }}>
          State of AI Operations 2026
        </h1>
        <p className="text-[17px] sm:text-[19px] text-slate-700 leading-relaxed mb-10 max-w-2xl">
          30 pages. 200+ public sources. Data from 50+ TrainYourAgent client engagements and structured input from a dozen vendor partners. Free PDF, single-field email gate.
        </p>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 mb-10">
          <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-4" style={{ color: BLUE }}>Five key findings</div>
          <ul className="space-y-3">
            {KEY_FINDINGS.map((f, i) => (
              <li key={i} className="text-[15px] leading-relaxed text-[#0B1B2B] flex gap-3">
                <span className="font-semibold flex-shrink-0" style={{ color: NAVY }}>{i + 1}.</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-[22px] sm:text-[26px] font-semibold mb-4" style={{ color: NAVY }}>What's inside</h2>
          <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6">
            {TOC.map((t, i) => (
              <li key={i} className="text-[14.5px] text-slate-700 flex gap-2">
                <span className="text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-[22px] sm:text-[26px] font-semibold mb-5" style={{ color: NAVY }}>5 sample charts (described)</h2>
          <ol className="space-y-4">
            {SAMPLE_CHARTS.map((c, i) => (
              <li key={i} className="rounded-xl border border-slate-200 p-4">
                <div className="text-[13.5px] font-semibold mb-1" style={{ color: NAVY }}>
                  Chart {i + 1}: {c.title}
                </div>
                <div className="text-[13px] text-slate-600 leading-relaxed">{c.desc}</div>
              </li>
            ))}
          </ol>
        </section>

        <section id="download" className="mb-8">
          <LeadMagnetForm
            source="lead-magnet-state-of-ai-ops-2026"
            title="Download the full 30-page PDF"
            subtitle="Emailed in ~30 seconds. We'll add you to the once-a-quarter benchmark update — unsubscribe in one click."
            cta="Send me the PDF →"
          />
        </section>

        <div className="text-[13px] text-slate-500 leading-relaxed">
          Methodology note: this report synthesizes 200+ public sources, vendor pricing disclosures, and the anonymized operating metrics from TrainYourAgent client engagements. We disclose our own role in the market (vertical-specialist agency) and try to compensate, but read with that in mind.
        </div>
      </main>
    </div>
  );
}
