import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";

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

const ROWS: { feature: string; tya: string; offshelf: string; bpo: string }[] = [
  { feature: "Trained on YOUR docs, scripts, and tone", tya: "Yes — that's the build", offshelf: "Generic prompt-only", bpo: "Human trained, slow ramp" },
  { feature: "Pulls customer history during the call", tya: "Yes — live CRM lookup", offshelf: "No", bpo: "Sometimes (script-dependent)" },
  { feature: "24/7 coverage including holidays", tya: "Yes", offshelf: "Yes", bpo: "Premium add-on" },
  { feature: "Sub-500ms response latency", tya: "Yes (target)", offshelf: "Varies", bpo: "Human pace (3–5s)" },
  { feature: "Booking + ticket + CRM write on outcome", tya: "Yes — closes the loop", offshelf: "Webhook to fill yourself", bpo: "Manual" },
  { feature: "Quality + cost per call visible weekly", tya: "Built into dashboard", offshelf: "Limited", bpo: "Per-minute opaque billing" },
  { feature: "Time to go live", tya: "7–14 business days", offshelf: "Days (no integrations)", bpo: "30–90 days" },
  { feature: "Cost per call (mid-range)", tya: "$0.30–0.90", offshelf: "$0.05–0.20", bpo: "$3–8" },
  { feature: "Escalates correctly to a human on policy", tya: "Yes — rules you control", offshelf: "Limited", bpo: "Yes (that IS the human)" },
  { feature: "Owns your data + zero training on it", tya: "Yes — zero-retention APIs", offshelf: "Often trains on call data", bpo: "Yes" },
];

const Comparisons = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Comparisons — TrainYourAgent vs. off-the-shelf vs. BPO";
  }, []);
  useEffect(() => { const f = () => setNavScrolled(window.scrollY > 20); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5"><BrainLogo size={36} /><span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span></Link>
          <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] shadow-sm">Book a call</a>
        </div>
      </nav>

      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Comparisons</div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            TrainYourAgent vs. off-the-shelf <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>vs. BPO call centers.</span>
          </h1>
          <p className="mt-6 text-[18px] text-slate-700 max-w-3xl leading-relaxed">
            No marketing comparison chart bias — we lose on cost-per-call to off-the-shelf bots, and we lose on edge-case empathy to humans. Where we win: the long middle of every business that needs trained, accountable, integrated agents.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-6xl mx-auto rounded-3xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-4 bg-[#042C53] text-white text-[13px] font-semibold">
            <div className="px-5 py-4">Feature</div>
            <div className="px-5 py-4 border-l border-white/15">TrainYourAgent</div>
            <div className="px-5 py-4 border-l border-white/15">Off-the-shelf AI</div>
            <div className="px-5 py-4 border-l border-white/15">BPO call center</div>
          </div>
          {ROWS.map((r, i) => (
            <div key={i} className={`grid grid-cols-4 text-[13px] sm:text-[14px] ${i % 2 === 0 ? "bg-white" : "bg-[#F6FAFE]"} border-t border-slate-100`}>
              <div className="px-5 py-4 font-medium text-[#042C53]">{r.feature}</div>
              <div className="px-5 py-4 text-slate-700 border-l border-slate-100">{r.tya}</div>
              <div className="px-5 py-4 text-slate-700 border-l border-slate-100">{r.offshelf}</div>
              <div className="px-5 py-4 text-slate-700 border-l border-slate-100">{r.bpo}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[32px] sm:text-[48px] leading-[1.04] tracking-tight font-semibold">
            Where we win: <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>the long middle of every business.</span>
          </h2>
          <p className="mt-5 text-[16px] text-white/85 max-w-2xl mx-auto leading-relaxed">
            If you can answer your phones with a $5/mo bot, do that. If you'd rather pay $7/call for a human in another time zone, do that. If you need an agent trained on your business that closes the loop in your tools — that's us.
          </p>
          <a href={CAL_URL} target="_blank" rel="noopener" className="mt-7 inline-block px-7 py-3.5 rounded-full bg-white text-[#042C53] font-semibold text-[14px] hover:bg-slate-100 shadow">Book a build call →</a>
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

export default Comparisons;
