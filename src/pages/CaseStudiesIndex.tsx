// src/pages/CaseStudiesIndex.tsx — v67A
// Route: /case-studies (the new JSON-driven index — replaces the old hand-coded
// CaseStudies.tsx page in App routing).
//
// Empty state today: "First case study lands when our first customer agrees
// to be named." Once entries are added to src/lib/caseStudies.ts they render
// here automatically.

import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { listPublishedCaseStudies } from "@/lib/caseStudies";

const SITE_URL = "https://trainyouragent.com";
const NAVY = "#042C53";
const BLUE = "#185FA5";
const TINT = "#E6F1FB";

export default function CaseStudiesIndex() {
  const published = useMemo(() => listPublishedCaseStudies(), []);

  useEffect(() => {
    document.title = "Case studies — TrainYourAgent";

    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = `${SITE_URL}/case-studies`;

    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content =
      "Named-customer case studies for TrainYourAgent's custom AI agent builds. Each one is a real customer with verified numbers — no anonymous placeholders.";
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav />
      <main className="pt-[var(--nav-height,72px)]">
        <section className="px-5 sm:px-8 pt-14 pb-10" style={{ background: `linear-gradient(180deg, ${TINT} 0%, #FFFFFF 100%)` }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-[12px] tracking-[0.2em] uppercase font-semibold" style={{ color: BLUE }}>
              Named-customer case studies
            </div>
            <h1
              className="mt-4 text-[32px] sm:text-[44px] md:text-[56px] leading-[1.05] font-semibold tracking-[-0.01em]"
              style={{ color: NAVY }}
            >
              Real builds. Real numbers. Real names.
            </h1>
            <p className="mt-5 text-[18px] sm:text-[20px] leading-[1.55] text-[#1B3A5C] max-w-3xl">
              We publish a case study only when the customer signs off on being
              named. No anonymous &ldquo;Fortune 500 client&rdquo; placeholders. No fake
              testimonials.
            </p>
          </div>
        </section>

        <section className="px-5 sm:px-8 py-12">
          <div className="max-w-5xl mx-auto">
            {published.length === 0 ? (
              <div
                className="rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center"
                style={{ borderColor: BLUE, background: TINT }}
              >
                <h2 className="text-[24px] sm:text-[30px] font-semibold leading-tight" style={{ color: NAVY }}>
                  First case study lands when our first customer agrees to be named.
                </h2>
                <p className="mt-4 text-[15.5px] leading-[1.6] text-slate-700 max-w-2xl mx-auto">
                  We're early. The next 3 customers get our founding-customer slot:
                  half-price first 6 months, weekly direct line to Alexander, and
                  the case-study slot when results land.
                </p>
                <div className="mt-6">
                  <Link
                    to="/proof#founding-customer"
                    className="inline-flex items-center px-6 py-3 rounded-full text-[14px] font-semibold"
                    style={{ background: NAVY, color: "#FFFFFF" }}
                  >
                    Apply to be that customer →
                  </Link>
                </div>
                <div className="mt-5 text-[12.5px] text-slate-600">
                  Already a customer?{" "}
                  <a href="mailto:hello@trainyouragent.com" className="underline" style={{ color: NAVY }}>
                    Email us
                  </a>{" "}
                  and we'll write yours up.
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {published.map((cs) => (
                  <Link
                    key={cs.slug}
                    to={`/case-study/${cs.slug}`}
                    className="block rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500">
                      {cs.companyName} · {cs.city}, {cs.state}
                    </div>
                    <div className="mt-3 text-[18px] font-semibold leading-snug" style={{ color: NAVY }}>
                      {cs.oneLineOutcome}
                    </div>
                    <div className="mt-4 text-[12.5px] font-semibold" style={{ color: BLUE }}>
                      {cs.buildLengthDays}-day build · {cs.agentType}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <FooterV44 />
    </div>
  );
}
