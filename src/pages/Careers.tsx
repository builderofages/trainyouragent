// src/pages/Careers.tsx — v34
// Hiring page. Signals scale + attracts builders. Roles are placeholder until
// Alexander confirms titles/comp; structure is final.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";
const CAREERS_EMAIL = "careers@trainyouragent.com";

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

type Role = {
  id: string;
  title: string;
  team: string;
  location: string;
  comp: string;
  description: string;
  doing: string[];
  looking: string[];
};

const ROLES: Role[] = [
  {
    id: "senior-ai-eng-voice",
    title: "Senior AI Engineer (Voice)",
    team: "Engineering",
    location: "Tampa or remote (US)",
    comp: "$170K–$220K + equity",
    description: "Own the voice agent stack end-to-end — STT, TTS, telephony, prompt orchestration, latency budget. Ship real customer agents that take real calls.",
    doing: [
      "Design and ship production voice pipelines (Twilio + Deepgram + Anthropic + ElevenLabs) at sub-500ms TTFB",
      "Run evals on every prompt change before it hits a customer line",
      "Move our internal tooling from \"works\" to \"obvious\" — observability, replay, eval harness",
    ],
    looking: [
      "5+ years backend or ML engineering, ideally with realtime audio or low-latency systems",
      "You've shipped something that takes phone calls in production, not just prototyped one",
      "You write English well — prompts, runbooks, and customer-visible artifacts are part of the job",
    ],
  },
  {
    id: "ai-solutions-engineer",
    title: "AI Solutions Engineer (Founder-Facing)",
    team: "GTM Engineering",
    location: "Tampa or remote (US)",
    comp: "$130K–$170K + equity + variable",
    description: "Sit between Alexander and the customer. Scope agents on calls, build proofs in 48 hours, hand off to delivery. The customer should feel like they're working with the founder when they're working with you.",
    doing: [
      "Run discovery + scoping calls; turn a fuzzy ask into a one-page agent spec by end of day",
      "Build sandbox demos in 48 hours using our internal templates",
      "Own the handoff doc when a deal closes — delivery should never have a question about what was sold",
    ],
    looking: [
      "You've sold or scoped technical work before (SE, FDE, founding AE, agency lead)",
      "You can build in our stack (TypeScript, prompts, light backend) without engineering babysitting you",
      "High agency, low ego, calm on a customer call when something on screen breaks",
    ],
  },
  {
    id: "marketing-engineer",
    title: "Marketing Engineer (Technical Content)",
    team: "Growth",
    location: "Tampa or remote (US)",
    comp: "$110K–$150K + equity",
    description: "Turn what we ship into what the market sees. Build interactive demos, programmatic SEO machines, and the kind of technical content that makes operators DM the founder.",
    doing: [
      "Ship the weekly long-form post (with code, screenshots, and one runnable demo) on the blog",
      "Build the programmatic SEO engine for the next 1,000 city/vertical landing pages",
      "Own the dev-rel-ish surface — demos, sandboxes, the GitHub examples repo",
    ],
    looking: [
      "You can write a 1,500-word technical post that doesn't put the reader to sleep",
      "You can ship a Vite/React/Next page from idea to live in a week",
      "You actually use the AI tools you're writing about — no editorialized hot takes",
    ],
  },
  {
    id: "founding-designer",
    title: "Founding Designer (Brand + Product)",
    team: "Design",
    location: "Tampa or remote (US)",
    comp: "$140K–$190K + meaningful equity",
    description: "Own the visual and interaction language — marketing site, product UI, customer-facing dashboards, deck templates. Make this brand feel as crafted as the agents under it.",
    doing: [
      "Drive the brand system end-to-end (you'll own the Prism Node identity and where it can stretch)",
      "Design product surfaces (dashboard, configurator, customer agent control plane)",
      "Set up the rituals — design crits, motion guidelines, content templates — so the next 3 hires inherit a system",
    ],
    looking: [
      "Portfolio with both brand work AND shipped product UI (not one or the other)",
      "Strong opinions on type, motion, and density. Loose grip on those opinions when data shows up",
      "Comfortable in Figma + at least readable in code (HTML/CSS, ideally Tailwind/React)",
    ],
  },
];

const VALUES: { title: string; body: string }[] = [
  { title: "We ship daily.",                          body: "If you went a week without a measurable change in production, that week was a planning week — and we don't have many of those." },
  { title: "We answer calls ourselves.",              body: "Every founder answers a customer call every week. The day we can't is the day the company drifts." },
  { title: "We never train models on customer data.", body: "Not opt-out, not aggregated, not \"with permission.\" Never. It's the line that separates us from the demo crowd." },
  { title: "We pay above market for the top 1%.",     body: "We don't try to staff with B-players cheaply. We hire fewer, better, and pay them what they're worth — including upside." },
  { title: "We work with you, not above you.",        body: "Customers are operators. So are we. No \"strategic partnership\" theater — we sit on your calls, we ship in your stack, we get judged on your number." },
];

const Careers = () => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Careers — TrainYourAgent";
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setMeta("description", "We're hiring builders who want to ship the agency layer of AI. Open roles: AI engineering, solutions, marketing, design.");
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="about" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      {/* HERO */}
      <section className="px-5 sm:px-8 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Careers</div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            We're hiring builders who want to ship the <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>agency layer of AI.</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            Tampa-based, remote-friendly, profitable from day one. We sell agents to real businesses and we deliver them end-to-end — no demo lab, no roadmap theater. If you'd rather ship one real thing than pitch ten, read on.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#roles" className="px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15">See open roles →</a>
            <a href={`mailto:${CAREERS_EMAIL}`} className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] border-2 border-[#042C53]/15 hover:border-[#042C53]">Email careers@</a>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">How we work</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">
            Five real values. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>None of them are "passion."</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((v, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-200 p-6">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">{String(i + 1).padStart(2, "0")}</div>
                <div className="text-[18px] font-semibold text-[#042C53] mb-2">{v.title}</div>
                <div className="text-[14px] text-slate-700 leading-relaxed">{v.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN ROLES */}
      <section id="roles" className="px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Open roles</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">
            Four ways in. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>All of them ship.</span>
          </h2>

          <div className="space-y-5">
            {ROLES.map((r) => (
              <article key={r.id} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_4px_40px_-12px_rgba(4,44,83,0.08)]">
                <div className="flex flex-wrap items-baseline justify-between gap-4 mb-2">
                  <h3 className="text-[24px] font-semibold text-[#042C53]">{r.title}</h3>
                  <a
                    href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent("Application — " + r.title)}`}
                    className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[12px] font-semibold hover:bg-[#0A3D6E]"
                  >
                    Apply →
                  </a>
                </div>
                <div className="flex flex-wrap gap-3 text-[12px] text-slate-500 mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#F6FAFE] border border-slate-200">{r.team}</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F6FAFE] border border-slate-200">{r.location}</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F6FAFE] border border-slate-200">{r.comp}</span>
                </div>
                <p className="text-[14px] text-slate-700 leading-relaxed mb-5">{r.description}</p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">What you'll do</div>
                    <ul className="space-y-2">
                      {r.doing.map((d, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-700 leading-relaxed">
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 bg-[#185FA5]" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">What we look for</div>
                    <ul className="space-y-2">
                      {r.looking.map((l, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-700 leading-relaxed">
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 bg-[#185FA5]" />
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DON'T SEE YOUR ROLE */}
      <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold mb-4">
            Don't see your role? <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Email anyway.</span>
          </h2>
          <p className="text-[16px] text-white/85 leading-relaxed mb-7">
            We've made room for the right person more than once. Send what you've shipped — not your resume — to <a href={`mailto:${CAREERS_EMAIL}`} className="underline">{CAREERS_EMAIL}</a>.
          </p>
          <a href={`mailto:${CAREERS_EMAIL}`} className="inline-block px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-[#E6F1FB]">Email careers@trainyouragent.com →</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link to="/about" className="hover:text-[#042C53]">About</Link>
            <Link to="/learn" className="hover:text-[#042C53]">Learn</Link>
            <Link to="/status" className="hover:text-[#042C53]">Status</Link>
            <Link to="/press" className="hover:text-[#042C53]">Press</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default Careers;
