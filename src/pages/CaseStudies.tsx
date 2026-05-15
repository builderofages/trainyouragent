import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";
const HERO_PHONE_DISPLAY = "(813) 555-0142";
const HERO_PHONE_TEL = "+18135550142";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, color: "#042C53" }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
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

// Real anonymized case from Alexander's public LinkedIn post (Day 90 78% autonomous resolution)
const PUBLIC_CASES = [
  {
    industry: "Professional Services",
    teamSize: "12-person team",
    problem: "Customer support eating 2.5 hours per rep per day on repeat questions",
    build: "Support AI trained on full product docs, pricing, policies, and 2 years of support ticket history. Deployed on website and email.",
    metrics: [
      { n: "Day 1",  l: "34% autonomous resolution" },
      { n: "Day 30", l: "61% autonomous resolution" },
      { n: "Day 90", l: "78% autonomous resolution" },
    ],
    outcome: "Time saved per rep: ~2 hrs/day. Customer satisfaction up (24/7 vs next-day reply). Reps now handle only complex/high-value issues.",
    cost: "Total build cost less than 2 weeks of one rep's salary. Total monthly ops cost a fraction of that.",
    source: "Posted publicly on LinkedIn — anonymized by client request.",
  },
];

const CaseStudies = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Case Studies — TrainYourAgent";

    // v33a: CollectionPage + BreadcrumbList for /case-studies
    const id = "tya-schema-cases";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": "https://trainyouragent.com/case-studies#page",
          url: "https://trainyouragent.com/case-studies",
          name: "Case Studies — TrainYourAgent",
          isPartOf: { "@id": "https://trainyouragent.com/#website" },
          description: "Real wins from TrainYourAgent customers running production AI voice agents.",
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://trainyouragent.com" },
            { "@type": "ListItem", position: 2, name: "Case Studies", item: "https://trainyouragent.com/case-studies" },
          ],
        },
      ],
    });
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <BrainLogo size={36} />
            <span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-[14px] text-slate-700">
            <Link to="/solutions" className="hover:text-[#042C53]">Solutions</Link>
            <Link to="/technology" className="hover:text-[#042C53]">Technology</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <Link to="/pricing" className="hover:text-[#042C53]">Pricing</Link>
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] shadow-sm">Book a call</a>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Case Studies</div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Real builds. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Real numbers.</span>
          </h1>
          <p className="mt-6 text-[18px] text-slate-700 max-w-2xl leading-relaxed">
            Honest disclosure: most of our customers prefer their builds stay private. The cases below are the ones we've been cleared to share. More land here as customers sign release.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          {PUBLIC_CASES.map((c, i) => (
            <div key={i} className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-[0_4px_40px_-12px_rgba(4,44,83,0.12)]">
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[#E6F1FB] text-[#042C53] text-[12px] font-semibold tracking-[0.1em] uppercase">{c.industry}</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[12px] font-medium">{c.teamSize}</span>
              </div>
              <div className="space-y-5">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1">Problem</div>
                  <div className="text-[16px] text-[#042C53] leading-relaxed">{c.problem}</div>
                </div>
                <div>
                  <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1">What we built</div>
                  <div className="text-[15px] text-slate-700 leading-relaxed">{c.build}</div>
                </div>
                <div>
                  <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-3">Metrics</div>
                  <div className="grid grid-cols-3 gap-3">
                    {c.metrics.map((m, k) => (
                      <div key={k} className="rounded-2xl bg-[#F6FAFE] border border-slate-200 p-4 text-center">
                        <div className="text-[24px] font-semibold text-[#042C53]" style={{ fontFamily: "'Playfair Display', serif" }}>{m.n}</div>
                        <div className="text-[12px] text-slate-600 mt-1">{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1">Outcome</div>
                  <div className="text-[15px] text-slate-700 leading-relaxed">{c.outcome}</div>
                </div>
                <div>
                  <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1">Cost</div>
                  <div className="text-[15px] text-slate-700 leading-relaxed">{c.cost}</div>
                </div>
                <div className="pt-4 border-t border-slate-100 text-[12px] text-slate-500 italic">{c.source}</div>
              </div>
            </div>
          ))}

          <div className="rounded-3xl bg-[#F6FAFE] border border-slate-200 border-dashed p-10 text-center">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">More coming</div>
            <h3 className="text-[24px] sm:text-[30px] font-semibold text-[#042C53] leading-tight mb-3">
              We'd rather have <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>three honest cases</span> than thirty staged ones.
            </h3>
            <p className="text-[15px] text-slate-700 max-w-lg mx-auto leading-relaxed mb-5">
              The fastest way to see what we'd build for you isn't reading more cases — it's a thirty-minute call where we show you a live build for your exact use case.
            </p>
            <a href={CAL_URL} target="_blank" rel="noopener" className="inline-block px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] shadow">Book a live build call →</a>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span><span className="text-slate-400">— Tampa Bay, FL</span></div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#042C53]">Terms</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CaseStudies;
