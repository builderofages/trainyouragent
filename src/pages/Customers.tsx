// src/pages/Customers.tsx — route /customers
// v38: Top half is an 18-cell logo grid (6×3). Each cell renders a navy
// circle with company initials as a placeholder, structured so we can swap
// in real SVG logos later without re-laying out the grid.
//
// Bottom half is 4 featured case-study cards. Each links to /customers/:slug.
// CaseStudyTemplate renders an empty scaffold with a clear empty-state until
// Alexander populates a real case study under that slug.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/trainyouragent/30min";

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

// [TBD] Logo grid — 18 placeholder slots. Replace `logoUrl` with a public
// asset path (e.g. /logos/acme.svg) when each company signs a logo release.
type LogoSlot = { initials: string; name: string; logoUrl?: string };
const LOGOS: LogoSlot[] = [
  { initials: "AC", name: "[TBD]" }, { initials: "BR", name: "[TBD]" }, { initials: "CN", name: "[TBD]" },
  { initials: "DV", name: "[TBD]" }, { initials: "EL", name: "[TBD]" }, { initials: "FK", name: "[TBD]" },
  { initials: "GM", name: "[TBD]" }, { initials: "HV", name: "[TBD]" }, { initials: "IL", name: "[TBD]" },
  { initials: "JP", name: "[TBD]" }, { initials: "KS", name: "[TBD]" }, { initials: "LO", name: "[TBD]" },
  { initials: "MR", name: "[TBD]" }, { initials: "NQ", name: "[TBD]" }, { initials: "OA", name: "[TBD]" },
  { initials: "PT", name: "[TBD]" }, { initials: "QY", name: "[TBD]" }, { initials: "RZ", name: "[TBD]" },
];

// [TBD] Featured case-study cards. Slug must match an entry in CASE_STUDIES
// inside CaseStudyTemplate.tsx. Until then, /customers/:slug renders the
// "coming soon" empty state.
type CaseCard = { slug: string; vertical: string; customer: string; headline: string; metric: string };
const FEATURED: CaseCard[] = [
  { slug: "tbd-hvac-case-study",       vertical: "HVAC",        customer: "[TBD HVAC Co.]",       headline: "[TBD — doubled after-hours bookings without new headcount.]",          metric: "[TBD]" },
  { slug: "tbd-healthcare-case-study", vertical: "Healthcare",  customer: "[TBD Clinic]",         headline: "[TBD — cut patient-intake voicemails to zero in 30 days.]",            metric: "[TBD]" },
  { slug: "tbd-realestate-case-study", vertical: "Real Estate", customer: "[TBD Brokerage]",      headline: "[TBD — every Zillow inbound captured in under 60 seconds.]",           metric: "[TBD]" },
  { slug: "tbd-legal-case-study",      vertical: "Legal",       customer: "[TBD Firm]",           headline: "[TBD — qualified intake without paralegal time on the phone.]",        metric: "[TBD]" },
];

const Customers = () => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Customers — TrainYourAgent";
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setMeta("description", "Operators across HVAC, healthcare, real estate, legal and startups running TrainYourAgent in production.");
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav active="resources" />
      <main className="pt-28">
        {/* Header */}
        <section className="px-5 sm:px-8 pt-10 pb-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-semibold mb-4">Customers</div>
            <h1 className="text-[clamp(36px,6vw,80px)] leading-[1.02] tracking-tight font-semibold text-[#042C53] mb-6">
              The operators trusting us with their phone line.
            </h1>
            <p className="text-[19px] text-slate-600 max-w-2xl leading-relaxed">
              Service businesses, clinics, brokerages, law firms, and startups running TrainYourAgent on their real production traffic.
            </p>
          </div>
        </section>

        {/* Logo grid */}
        <section className="px-5 sm:px-8 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-semibold mb-4">Currently shipping with</div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {LOGOS.map((l, i) => (
                <div
                  key={i}
                  className="aspect-[2/1] rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:border-[#185FA5]/40 transition"
                  aria-label={l.name}
                >
                  {l.logoUrl ? (
                    <img src={l.logoUrl} alt={l.name} className="max-h-8 max-w-[80%] object-contain opacity-80 hover:opacity-100 transition" />
                  ) : (
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold tracking-wide"
                      style={{ background: "#042C53", color: "#E6F1FB" }}
                      aria-hidden="true"
                    >
                      {l.initials}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-[12px] text-slate-400">
              [TBD] Real customer logos drop in as release forms come back. Placeholders preserved for layout.
            </div>
          </div>
        </section>

        {/* Featured case studies */}
        <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
          <div className="max-w-5xl mx-auto">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Featured case studies</div>
            <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-10">
              Four production builds. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Real numbers.</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {FEATURED.map((c) => (
                <Link
                  key={c.slug}
                  to={`/customers/${c.slug}`}
                  className="group rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#042C53] hover:shadow-[0_4px_24px_-10px_rgba(4,44,83,0.2)] transition flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold">{c.vertical}</span>
                    {c.metric !== "[TBD]" && (
                      <span className="text-[11px] uppercase tracking-[0.12em] font-semibold px-2 py-0.5 rounded-full bg-[#E6F1FB] text-[#042C53]">
                        {c.metric}
                      </span>
                    )}
                  </div>
                  <div className="text-[18px] font-semibold text-[#042C53] mb-2">{c.customer}</div>
                  <p className="text-[14px] text-slate-600 leading-relaxed mb-4">{c.headline}</p>
                  <span className="mt-auto text-[13px] text-[#185FA5] group-hover:text-[#042C53]">Read the case study →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-[32px] sm:text-[48px] leading-[1.05] tracking-tight font-semibold">
              Want to be the <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>next case study?</span>
            </h2>
            <p className="mt-5 text-[17px] text-white/85 max-w-2xl mx-auto leading-relaxed">
              Thirty-minute build call. You leave with a written plan. We leave with the green light or an honest no.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a href={CAL_URL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg">
                Book a 30-min build call →
              </a>
              <Link to="/trial" className="px-7 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15">
                Start the 7-day trial
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-x-6 gap-y-2 flex-wrap justify-center">
            <Link to="/about" className="hover:text-[#042C53]">About</Link>
            <Link to="/pricing" className="hover:text-[#042C53]">Pricing</Link>
            <Link to="/testimonials" className="hover:text-[#042C53]">Testimonials</Link>
            <Link to="/trial" className="hover:text-[#042C53]">Trial</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default Customers;
