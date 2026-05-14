// src/pages/Changelog.tsx
// Public ship log. Add an entry every time you push something noteworthy.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="#E6F1FB" />
        <g fill="#0C447C"><circle cx="20" cy="27" r="7.5" /><circle cx="32" cy="21" r="8.5" /><circle cx="44" cy="27" r="7.5" /><circle cx="24" cy="40" r="7" /><circle cx="40" cy="40" r="7" /><rect x="29" y="44" width="6" height="11" rx="1.5" /></g>
        <circle cx="32" cy="32" r="30" fill="none" stroke="#185FA5" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

const ENTRIES: { date: string; tag: "Shipped" | "Improved" | "Fixed"; title: string; body: string }[] = [
  { date: "May 13, 2026", tag: "Shipped", title: "AI chat widget, agent simulator, programmatic SEO, vs pages, status + changelog",
    body: "Floating Claude-powered chat answers visitor questions in real time. Live agent simulator lets visitors type a customer scenario and watch the response stream in. 420 programmatic SEO pages (14 verticals × 30 cities). Five competitor comparison pages (Bland, Vapi, Synthflow, Air.ai, Retell). Status page with live probes. Public changelog (this page)." },
  { date: "May 13, 2026", tag: "Shipped", title: "Interactive layer — ROI calculator, ElevenLabs widget, Cal inline, exit-intent",
    body: "ROI calc with email-gated full report. ElevenLabs Convai voice widget on hero + Demos. Cal.com inline embed on Index + Pricing closer. Exit-intent lead magnet modal. Toast system for in-page notifications. Animated stat counters in proof strip." },
  { date: "May 13, 2026", tag: "Shipped", title: "Full v19 site rebuild — 27 pages, 5,397 lines, single brand system",
    body: "Index, About, Contact, Security, Pricing, Technology, Solutions (lane-routed), VerticalPage (lane-aware), SolutionConfigurator, CaseStudies, Integrations, Team, Comparisons, DemoRequest, Demos, Resources, ResourceArticle, ResearchPartners, NicheLanding, SalesToolkit, DemoVideo, Dashboard, Settings, Privacy, Terms, CookiePolicy, NotFound. Plus index.html, vercel.json, sitemap, og-image, brand tokens." },
  { date: "May 13, 2026", tag: "Improved", title: "VerticalPage now reads pathway lane",
    body: "When a visitor picks a lane (startup / SMB / agency / ops) on the homepage selector, every vertical page adapts hero copy + CTAs to match. Stored in localStorage." },
  { date: "May 13, 2026", tag: "Shipped", title: "Founders / Operators / Scale pricing — no SaaS theater",
    body: "Three honest lanes. Founders: $0 upfront, $0.18/min, $25/booking. Operators: $4,950 build, $799/mo with 4K min included. Scale: custom. Free 7-day live trial." },
  { date: "May 13, 2026", tag: "Shipped", title: "Multi-model routing on every agent",
    body: "Claude primary, GPT-4 fallback, Gemini for long-context, Llama/Mistral for cost-sensitive specialty routes. Deterministic last-resort fallback so calls never drop to a busy signal." },
  { date: "May 13, 2026", tag: "Improved", title: "SOC 2 in evaluation, BAA per healthcare customer",
    body: "Working with a Big 4 auditor and Vanta to complete SOC 2 Type II. BAA template available before any healthcare PHI flows. We are explicitly not a Covered Entity ourselves." },
  { date: "May 12, 2026", tag: "Shipped", title: "Brand system — white + #042C53 navy + brain logo + Inter Tight + Playfair italic",
    body: "Single visual language across every page. BrainLogo as inline SVG. Design tokens in src/lib/brand.ts." },
];

const TAG_COLOR: Record<string, string> = {
  Shipped:  "bg-[#22A36C]",
  Improved: "bg-[#185FA5]",
  Fixed:    "bg-amber-500",
};

const Changelog = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) { const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap"; document.head.appendChild(l); }
    document.title = "Changelog — TrainYourAgent";
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
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Changelog</div>
          <h1 className="text-[42px] sm:text-[60px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Everything we shipped, <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>in chronological order.</span>
          </h1>
          <p className="mt-5 text-[16px] text-slate-600">
            We update this every time we push something a customer would care about. Subscribe to <Link to="/status" className="text-[#185FA5] underline">Status</Link> for incident notices.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-3xl mx-auto space-y-6">
          {ENTRIES.map((e, i) => (
            <article key={i} className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 hover:border-[#185FA5] transition">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-white text-[11px] font-semibold tracking-[0.06em] ${TAG_COLOR[e.tag] || "bg-slate-400"}`}>{e.tag}</span>
                <span className="text-[12px] text-slate-500">{e.date}</span>
              </div>
              <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#042C53] leading-tight mb-2">{e.title}</h2>
              <p className="text-[14px] text-slate-700 leading-relaxed">{e.body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span></div>
          <div className="flex items-center gap-6"><Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link><Link to="/terms" className="hover:text-[#042C53]">Terms</Link><Link to="/status" className="hover:text-[#042C53]">Status</Link></div>
        </div>
      </footer>
    </div>
  );
};

export default Changelog;
