// src/components/CaseStudyTemplate.tsx
// v38: Per-customer case-study template. Renders an empty scaffold with
// [TBD] markers so Alexander can paste real customer content per slug.
//
// Route: /customers/:slug — App.tsx wires this up via Customers.tsx.
// The slug → content mapping lives in CASE_STUDIES below. Add a new entry
// per real customer; until one exists the page renders the empty scaffold
// with a 200 + clear empty-state.

import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/trainyouragent/30min";

export type CaseStudy = {
  slug: string;
  customer: string;
  vertical: string;
  oneLiner: string;
  metricA: { label: string; value: string };
  metricB: { label: string; value: string };
  metricC: { label: string; value: string };
  problem: string;
  solution: string;
  result: string;
  quote: string;
  quoteAttribution: string;
};

// v46a HONESTY: We do not ship fake [TBD] case studies. Entries land here
// as real customers sign release forms. Until then any /customers/:slug
// URL renders the honest empty-state below.
//
// To add a real case study, add an entry keyed by lowercase-dash slug
// matching the URL, e.g.:
//   "northbay-hvac-tampa": { slug: "northbay-hvac-tampa", customer: "Northbay HVAC", ... }
export const CASE_STUDIES: Record<string, CaseStudy> = {};

function BrainLogo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, color: "#042C53" }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
        <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
        <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

const CaseStudyTemplate = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const cs = CASE_STUDIES[slug.toLowerCase()];

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = cs
      ? `${cs.customer} — Case study — TrainYourAgent`
      : `Case study — TrainYourAgent`;
  }, [cs]);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav active="resources" />
      <main className="pt-28">
        {!cs ? (
          <section className="px-5 sm:px-8 py-16 sm:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-semibold mb-4">Case study</div>
              <h1 className="text-[34px] sm:text-[48px] leading-tight font-semibold text-[#042C53] mb-4">
                We're early — no public case studies yet.
              </h1>
              <p className="text-[16px] text-slate-700 mb-8 leading-relaxed">
                We won't publish fake case studies with stock photos and made-up metrics.
                Real customer stories will land here as builds go live and operators agree
                to be named. Until then, book a 30-min Zoom and we'll walk you through
                unredacted production transcripts and dashboards on screen-share.
              </p>
              <a href={CAL_URL} target="_blank" rel="noopener" className="inline-flex px-7 py-4 min-h-[44px] rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15">
                Book a 30-min build call →
              </a>
              <div className="mt-8">
                <Link to="/customers" className="text-[#185FA5] hover:text-[#042C53] underline decoration-[#185FA5]/30 inline-block min-h-[24px]">
                  ← Back to all customers
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="px-5 sm:px-8 pt-12 pb-10">
              <div className="max-w-4xl mx-auto">
                <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-semibold mb-4">
                  Case study · {cs.vertical}
                </div>
                <h1 className="text-[clamp(34px,5vw,68px)] leading-[1.05] tracking-tight font-semibold text-[#042C53] mb-6">
                  {cs.customer}
                </h1>
                <p className="text-[20px] text-slate-700 max-w-2xl leading-relaxed">{cs.oneLiner}</p>
              </div>
            </section>

            <section className="px-5 sm:px-8 py-10 bg-[#F6FAFE] border-y border-slate-200/70">
              <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
                {[cs.metricA, cs.metricB, cs.metricC].map((m, i) => (
                  <div key={i} className="rounded-2xl bg-white border border-slate-200 p-5 text-center">
                    <div className="text-[32px] sm:text-[44px] leading-none font-semibold text-[#042C53] tabular-nums" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {m.value}
                    </div>
                    <div className="text-[12px] uppercase tracking-[0.14em] text-slate-500 mt-2">{m.label}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="px-5 sm:px-8 py-16">
              <div className="max-w-3xl mx-auto space-y-10">
                <Block title="Problem"  body={cs.problem} />
                <Block title="Solution" body={cs.solution} />
                <Block title="Result"   body={cs.result} />

                <figure className="rounded-2xl bg-[#042C53] text-white p-7 sm:p-9 relative">
                  <span aria-hidden="true" className="absolute top-3 left-5 text-white/15 leading-none" style={{ fontFamily: "'Playfair Display', serif", fontSize: 80, fontStyle: "italic" }}>“</span>
                  <blockquote className="relative text-[18px] sm:text-[22px] leading-[1.5]" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
                    {cs.quote}
                  </blockquote>
                  <figcaption className="mt-5 text-[12px] uppercase tracking-[0.14em] text-white/70">{cs.quoteAttribution}</figcaption>
                </figure>

                <div className="text-center pt-4">
                  <a href={CAL_URL} target="_blank" rel="noopener" className="inline-flex px-7 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15">
                    Get a build like this →
                  </a>
                  <div className="mt-4">
                    <Link to="/customers" className="text-[13px] text-[#185FA5] hover:text-[#042C53] underline decoration-[#185FA5]/30">
                      ← All customers
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-x-6 gap-y-2 flex-wrap justify-center">
            <Link to="/customers" className="hover:text-[#042C53]">Customers</Link>
            <Link to="/testimonials" className="hover:text-[#042C53]">Testimonials</Link>
            <Link to="/pricing" className="hover:text-[#042C53]">Pricing</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-[#185FA5] font-semibold mb-3">{title}</div>
      <p className="text-[17px] leading-[1.75] text-[#042C53]">{body}</p>
    </div>
  );
}

export default CaseStudyTemplate;
