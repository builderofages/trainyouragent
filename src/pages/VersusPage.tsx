// src/pages/VersusPage.tsx
// Competitor comparison pages — /vs/:competitor for SEO + buyer self-service.

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";
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

type FeatureRow = { feature: string; them: string; us: string };

type Vs = {
  name: string;
  url?: string;
  positioning: string;
  bestFor: string;
  whereTheyWin: string[];
  whereWeWin: string[];
  pricingNote: string;
  verdict: string;
  featureRows?: FeatureRow[];
};

// Default feature rows applied when a competitor doesn't override them.
const DEFAULT_ROWS: FeatureRow[] = [
  { feature: "Voice quality", them: "Good — top-tier TTS", us: "Same top-tier (ElevenLabs Flash + Cartesia Sonic)" },
  { feature: "Cost per minute", them: "$0.06–$0.12 typical", us: "Bundled into per-call pricing — no per-minute surprises" },
  { feature: "Custom agent training", them: "Self-serve in their console", us: "Done-for-you with weekly tuning by an engineer" },
  { feature: "Vertical specialization", them: "Generic templates", us: "HVAC, healthcare, legal, real estate, automotive playbooks" },
  { feature: "White-label option", them: "Limited / paid add-on", us: "Yes — full white-label for agency partners" },
  { feature: "SLA", them: "Best-effort / community support", us: "99.9% uptime + on-call rotation in first 90 days" },
  { feature: "Build timeline", them: "DIY — depends on your team", us: "14 days from kickoff to live traffic" },
  { feature: "Lead-to-deploy speed", them: "Self-serve onboarding", us: "Founder on the call same week" },
];

export const COMPETITORS: Record<string, Vs> = {
  bland: {
    name: "Bland.ai",
    url: "https://www.bland.ai",
    positioning: "Developer-first AI voice infrastructure. API-led, build-your-own logic.",
    bestFor: "Engineering teams that want low-level voice infra and will write their own conversational logic.",
    whereTheyWin: ["Lowest per-minute pricing at scale", "Strong API for engineers", "Vibrant developer community"],
    whereWeWin: ["We deliver a finished agent — not a phone-call API", "Built-in CRM/calendar/dispatch integrations, not webhooks you wire yourself", "Weekly tuning by a real engineer, not a Slack support channel", "Vertical-specific playbooks (HVAC, healthcare, legal, etc.) shipped on day one"],
    pricingNote: "Bland is cheaper per minute. We include the work that makes per-minute pricing irrelevant — integrations, training, tuning.",
    verdict: "Pick Bland if you have engineers and want infra. Pick us if you want a working agent for your business by Friday.",
  },
  vapi: {
    name: "Vapi.ai",
    url: "https://vapi.ai",
    positioning: "Voice AI platform with hosted infra and a builder UI.",
    bestFor: "Mid-stage startups building their own voice product on top of a platform.",
    whereTheyWin: ["Strong builder UI for agent design", "Good developer tooling", "Marketplace of pre-built tools"],
    whereWeWin: ["We're done-for-you, not DIY-with-builder", "Real engineer on weekly tuning calls, not platform docs", "Shipped vertical playbooks, not a blank canvas", "Native integration with the SMB tools (ServiceTitan, Clio, Mindbody) — not just generic webhooks"],
    pricingNote: "Vapi charges platform fees; we charge per-minute + per-booking. Comparable for high-volume; cheaper for startups under 4K min/mo.",
    verdict: "Pick Vapi if you're building a voice product. Pick us if you want voice for your existing business.",
  },
  synthflow: {
    name: "Synthflow",
    url: "https://synthflow.ai",
    positioning: "No-code voice agent builder for SMBs.",
    bestFor: "Operators who want to drag-and-drop their own simple agent.",
    whereTheyWin: ["No-code visual builder", "Self-serve setup", "Lower upfront cost"],
    whereWeWin: ["Real customer support — direct Slack to founder, not ticketed CS", "Custom integrations to YOUR CRM/dispatch tool, not just the top 5", "Vertical-specific scripts written by us, not template you tune yourself", "Multi-model routing with fallbacks — not single LLM dependency"],
    pricingNote: "Synthflow is cheaper for self-serve. We're worth the premium when you'd rather have it built right than build it yourself.",
    verdict: "Pick Synthflow if you have time and want to self-build. Pick us if you'd rather pay for the work to be done.",
  },
  "air-ai": {
    name: "Air.ai",
    url: "https://air.ai",
    positioning: "AI sales agent for outbound calling, often pitched as 'replaces sales reps'.",
    bestFor: "Companies running heavy outbound that want a 'set it and forget it' AI SDR.",
    whereTheyWin: ["Big marketing presence", "Pre-built outbound flows"],
    whereWeWin: ["We build inbound + outbound, not just outbound", "We integrate to your real stack, not a closed walled garden", "We're transparent about what works and what doesn't — Air.ai's marketing has been criticized for overpromising", "We charge for what you use, not 5-figure annual contracts"],
    pricingNote: "Air.ai is annual contract + setup; we're month-to-month + per-call. Wildly different commitment profile.",
    verdict: "Pick Air.ai if you're locked into outbound and want a single vendor. Pick us for everything else.",
  },
  retell: {
    name: "Retell.ai",
    url: "https://retellai.com",
    positioning: "Voice AI infrastructure for developers building voice products.",
    bestFor: "Engineering teams building voice features inside their own product.",
    whereTheyWin: ["Clean API + SDKs", "Good docs", "Reasonable pricing for infra"],
    whereWeWin: ["We're the agent + the integrations + the tuning, not just the voice layer", "Vertical-specific playbooks shipped Day 1", "Real engineer on weekly review", "Done-for-you delivery, not DIY"],
    pricingNote: "Retell is voice infra pricing (per-minute). We're full-service pricing. Use Retell if you have a team to build on top.",
    verdict: "Pick Retell if you're building voice into your product. Pick us if you want a finished agent for your business.",
  },
};

// /vs/airagent alias → same record as air-ai (the URL the spec asked for).
COMPETITORS.airagent = COMPETITORS["air-ai"];

const VersusPage = () => {
  const { competitor = "" } = useParams<{ competitor: string }>();
  const vs = COMPETITORS[competitor.toLowerCase()];
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined" || !vs) return;
    if (!document.getElementById("tya-fonts")) { const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap"; document.head.appendChild(l); }
    document.title = `TrainYourAgent vs ${vs.name} — honest comparison`;
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setMeta("description", `${vs.name} vs TrainYourAgent — where each one wins, what each one costs, when to pick which. Written by an operator who runs both stacks.`);
  }, [vs]);
  useEffect(() => { const f = () => setNavScrolled(window.scrollY > 20); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);

  if (!vs) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5">
        <div className="text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Comparison not found</div>
          <h1 className="text-[28px] font-semibold text-[#042C53] mb-4">No comparison page for that competitor — yet.</h1>
          <Link to="/comparisons" className="text-[#185FA5] underline">See our general comparison →</Link>
        </div>
      </div>
    );
  }

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
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Honest comparison</div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            TrainYourAgent vs <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>{vs.name}</span>
          </h1>
          <p className="mt-6 text-[18px] text-slate-700 max-w-3xl leading-relaxed">{vs.positioning}</p>
          <p className="mt-3 text-[15px] text-slate-600 leading-relaxed"><span className="font-semibold text-[#042C53]">Best for:</span> {vs.bestFor}</p>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-white border border-slate-200 p-7">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-3">Where {vs.name} wins</div>
            <ul className="space-y-2.5 text-[15px] text-slate-700">
              {vs.whereTheyWin.map((x, i) => (
                <li key={i} className="flex items-start gap-2.5"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" /><span>{x}</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-[#042C53] text-white p-7">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#9CC4EC] font-semibold mb-3">Where TrainYourAgent wins</div>
            <ul className="space-y-2.5 text-[15px] text-white/90">
              {vs.whereWeWin.map((x, i) => (
                <li key={i} className="flex items-start gap-2.5"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#22A36C] flex-shrink-0" /><span>{x}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">Side-by-side</div>
          <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-6">
            Feature <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>comparison.</span>
          </h2>
          <div className="rounded-3xl border border-slate-200 overflow-hidden bg-white">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-0 text-[12px] uppercase tracking-[0.14em] font-semibold bg-[#F6FAFE] text-slate-500">
              <div className="px-4 py-3">Feature</div>
              <div className="px-4 py-3 border-l border-slate-200">{vs.name}</div>
              <div className="px-4 py-3 border-l border-slate-200 text-[#042C53]">TrainYourAgent</div>
            </div>
            {(vs.featureRows ?? DEFAULT_ROWS).map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-[1.1fr_1fr_1fr] gap-0 text-[14px] border-t border-slate-100 items-stretch"
              >
                <div className="px-4 py-3 font-semibold text-[#042C53] bg-white">{row.feature}</div>
                <div className="px-4 py-3 border-l border-slate-100 text-slate-700 bg-white">{row.them}</div>
                <div className="px-4 py-3 border-l border-slate-100 text-slate-800 bg-[#F6FAFE]">{row.us}</div>
              </div>
            ))}
          </div>
          <div className="text-[12px] text-slate-500 mt-3 italic">
            Comparison reflects publicly documented features as of last review. Tell us if anything's out of date.
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">Pricing reality</div>
          <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-4">
            What it actually <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>costs.</span>
          </h2>
          <p className="text-[16px] text-slate-700 leading-relaxed mb-6">{vs.pricingNote}</p>
          <Link to="/pricing" className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#185FA5] hover:text-[#042C53]">
            See our full pricing →
          </Link>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-5xl mx-auto rounded-3xl bg-white border border-slate-200 p-7 sm:p-10 grid md:grid-cols-2 gap-8">
          <div>
            <div className="text-[12px] uppercase tracking-[0.14em] text-slate-500 font-semibold mb-2">When to pick {vs.name}</div>
            <p className="text-[15px] text-slate-700 leading-relaxed">{vs.bestFor}</p>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">When to pick TrainYourAgent</div>
            <p className="text-[15px] text-[#042C53] leading-relaxed font-medium">
              You want a finished, working agent inside two weeks — built by an engineer who'll be on the call, not a vendor SDR. You'd rather pay a premium than spend three months wiring it yourself.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-[#042C53] to-[#0A3D6E] text-white p-8 sm:p-10 shadow-[0_20px_60px_-20px_rgba(4,44,83,0.4)] text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold mb-3">Switch from {vs.name}</div>
          <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold mb-3">
            Already on {vs.name}?{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              We migrate you for free.
            </span>
          </h2>
          <p className="text-[15px] text-white/85 max-w-2xl mx-auto leading-relaxed mb-6">
            Number porting, transcript export, calendar + CRM rewiring, and parallel-running both stacks for a week before cutover. Zero downtime, zero re-training.
          </p>
          <a href={CAL_URL} target="_blank" rel="noopener" className="inline-block px-7 py-3.5 rounded-full bg-white text-[#042C53] font-semibold text-[14px] hover:bg-slate-100 shadow">
            Book a switch-from-{vs.name} call →
          </a>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 bg-[#042C53] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold mb-3">Verdict</div>
          <h2 className="text-[28px] sm:text-[40px] leading-[1.06] tracking-tight font-medium" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
            "{vs.verdict}"
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-7 py-3.5 rounded-full bg-white text-[#042C53] font-semibold text-[14px] hover:bg-slate-100 shadow">Book a build call →</a>
            <a href={`tel:${HERO_PHONE_TEL}`} className="px-7 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-medium text-[14px] hover:bg-white/15">Or call us: {HERO_PHONE_DISPLAY}</a>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Other comparisons</div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(COMPETITORS).filter((k) => k !== competitor.toLowerCase()).map((k) => (
              <Link key={k} to={`/vs/${k}`} className="px-4 py-2 rounded-full bg-[#F6FAFE] border border-slate-200 text-[13px] text-[#042C53] hover:border-[#185FA5] hover:bg-white transition">vs {COMPETITORS[k].name}</Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span></div>
          <div className="flex items-center gap-6"><Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link><Link to="/terms" className="hover:text-[#042C53]">Terms</Link><Link to="/security" className="hover:text-[#042C53]">Security</Link></div>
        </div>
      </footer>
    </div>
  );
};

export default VersusPage;
