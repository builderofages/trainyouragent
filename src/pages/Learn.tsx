// src/pages/Learn.tsx — v34
// The TrainYourAgent AI Academy hub. Free mini-courses + a paid Operator Cohort.
// Alexander's pillar: "I preach and teach AI." This is where that lives.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const COHORT_CHECKOUT = "/api/checkout?plan=cohort";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";

function BrainLogo({ size = 40 }: { size?: number }) {
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

type Course = {
  slug: string;
  eyebrow: string;
  title: string;
  blurb: string;
  modules: string[];
  length: string;
};

const FREE_COURSES: Course[] = [
  {
    slug: "voice-agents-101",
    eyebrow: "Free · 45 min",
    title: "AI Voice Agents 101",
    blurb: "What they actually are, what they cost, and when they make sense. No hype, no Twitter demo theater — the operator-grade explanation.",
    length: "5 modules · 45 min total",
    modules: [
      "What's actually under the hood (LLM + STT + TTS + telephony, in plain English)",
      "Real cost math: per-minute, per-call, per-resolution — and where vendors hide markup",
      "When a voice agent beats a human, when it loses, when it shouldn't be tried at all",
      "The 7 questions every voice-AI vendor dodges (and why)",
      "Your 30-day pilot plan: pick one use case, measure one number, ship",
    ],
  },
  {
    slug: "build-in-public-agency",
    eyebrow: "Free · 90 min",
    title: "Build an AI Agency in Public — the First 90 Days Honestly",
    blurb: "The exact playbook I'd use if I started over with $0 and a laptop. Niche selection, offer design, pricing, the first 5 closes, and how to deliver without burning out. Numbers in this course are based on industry rates and observed agency metrics — not a claim about my own MRR.",
    length: "8 modules · 90 min total",
    modules: [
      "Niche selection: the 3 industries with the fastest yes (and 3 to never touch)",
      "Productized offer design — what to charge, what to refuse to do",
      "The 5-touch outbound system that books your first 10 calls",
      "How to run the discovery call so they ask YOU for the proposal",
      "Pricing without flinching: $2k–$10k setup, $799–$2,997 retainer math",
      "The minimum tech stack that actually delivers (no, you don't need a CRM yet)",
      "First-90 delivery: shipping the agent, the handoff, the case study",
      "Scaling honestly: when to hire, when to raise prices, when to fire a client",
    ],
  },
  {
    slug: "production-prompting",
    eyebrow: "Free · 60 min",
    title: "Prompt Engineering for Real Production",
    blurb: "Not Twitter prompt threads. The actual patterns we use when an agent has to handle 5,000 calls a month without going off the rails. Eval-driven, regression-tested, and boring on purpose.",
    length: "6 modules · 60 min total",
    modules: [
      "System prompts vs few-shot vs tool use — pick the right hammer",
      "Writing prompts that survive 6 months of edits and 3 model upgrades",
      "Building eval sets before you ship (the part everyone skips)",
      "Guardrails that don't lobotomize the model",
      "Cost control: caching, routing, model selection, when to use the cheap one",
      "Production debugging: logs, traces, and the 3 failure modes you'll hit first",
    ],
  },
];

const COHORT_WEEKS: { week: string; title: string; outcome: string }[] = [
  { week: "Week 1", title: "Pick your niche, lock your offer", outcome: "A productized offer with a real price you can quote without flinching." },
  { week: "Week 2", title: "Ship your first agent (live build)", outcome: "A working voice or chat agent in your ICP's stack — built with you on the call." },
  { week: "Week 3", title: "Outbound system + first 10 booked calls", outcome: "A repeatable booking machine. We script, send, and iterate together." },
  { week: "Week 4", title: "Run the discovery + close the deal", outcome: "Roleplay live discovery calls. Get torn apart in private so prospects don't tear you apart in public." },
  { week: "Week 5", title: "Delivery without drama", outcome: "Project plan, milestones, customer comms, and the SOPs we use internally." },
  { week: "Week 6", title: "Scale: pricing, hiring, second offer", outcome: "Honest path from your first paying customer to a repeatable book of work — and what the next hire actually does." },
];

const Learn = () => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Learn AI — TrainYourAgent Academy";
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setMeta("description", "Learn AI from someone shipping it daily. Free mini-courses on voice agents, agency building, and production prompting — plus the $497 Operator Cohort.");
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
      <SiteNav active="resources" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      {/* HERO */}
      <section className="px-5 sm:px-8 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">TrainYourAgent Academy</div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            Learn AI from someone <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>shipping it daily.</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            No theory podcasts, no $5,000 mastermind. Three free mini-courses on what actually works, and one paid cohort where you build alongside me for six weeks. Nothing in here that I haven't done with my own money on the line.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#cohort" className="px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15">Join the Operator Cohort →</a>
            <a href="#free" className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] border-2 border-[#042C53]/15 hover:border-[#042C53]">Start free</a>
          </div>
        </div>
      </section>

      {/* FREE MINI-COURSES */}
      <section id="free" className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Free mini-courses</div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">
            Three short courses. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Real production knowledge.</span>
          </h2>

          <div className="grid lg:grid-cols-3 gap-5">
            {FREE_COURSES.map((c) => (
              <div key={c.slug} className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-[0_4px_40px_-12px_rgba(4,44,83,0.18)] flex flex-col">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-2">{c.eyebrow}</div>
                <h3 className="text-[22px] leading-tight font-semibold text-[#042C53] mb-3">{c.title}</h3>
                <p className="text-[14px] text-slate-700 leading-relaxed mb-5">{c.blurb}</p>
                <div className="text-[11px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-2">What's inside</div>
                <ul className="space-y-2 mb-6">
                  {c.modules.map((m, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-700 leading-relaxed">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[11px] font-semibold flex items-center justify-center mt-0.5">{i + 1}</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500">{c.length}</span>
                  <Link
                    to="/newsletter?notify=learn"
                    className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[12px] font-semibold hover:bg-[#185FA5] transition shadow-sm"
                    title="Drop your email — I'll send the modules the day they ship."
                  >
                    Notify me →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[13px] text-slate-500 max-w-3xl">
            Videos are recording now — slot in your email on the <Link to="/newsletter" className="underline text-[#185FA5]">newsletter</Link> and you'll be the first to get the modules as they ship.
          </p>
        </div>
      </section>

      {/* OPERATOR COHORT — paid */}
      <section id="cohort" className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-10">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold mb-3">Premium track</div>
            <h2 className="text-[32px] sm:text-[52px] leading-[1.05] tracking-tight font-semibold mb-5">
              The TrainYourAgent <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Operator Cohort.</span>
            </h2>
            <p className="text-[16px] sm:text-[18px] text-white/85 leading-relaxed mb-7 max-w-xl">
              Six weeks. Weekly live builds with me. Small group, no recordings sold separately, no upsell ladder. You leave with a working agent in production and a real customer paying you for it.
            </p>
            <div className="flex flex-wrap items-baseline gap-3 mb-8">
              <span className="text-[44px] sm:text-[56px] font-semibold tracking-tight">$497</span>
              <span className="text-[14px] text-white/70">one-time · 6 weeks · cohort capped at 12</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={COHORT_CHECKOUT} className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-[#E6F1FB] shadow-lg shadow-black/20">Reserve your seat →</a>
              <a href={CAL_URL} target="_blank" rel="noopener" className="px-6 py-4 rounded-2xl bg-transparent text-white font-semibold text-[15px] border-2 border-white/30 hover:border-white">Talk to me first</a>
            </div>
            <p className="text-[12px] text-white/60 mt-4">Refund policy: full refund through Week 2 if it isn't useful. Just email me.</p>
          </div>

          <div className="rounded-3xl bg-white/5 border border-white/15 p-6 sm:p-8">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#9CC4EC] font-semibold mb-4">The 6-week plan</div>
            <ol className="space-y-4">
              {COHORT_WEEKS.map((w, i) => (
                <li key={i} className="border-l-2 border-[#9CC4EC]/40 pl-4">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-[#9CC4EC] font-semibold mb-1">{w.week}</div>
                  <div className="text-[15px] font-semibold mb-1">{w.title}</div>
                  <div className="text-[13px] text-white/75 leading-relaxed">{w.outcome}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* RESOURCES STRIP */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">More to read & watch</div>
          <h2 className="text-[24px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-8">
            Free resources <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>before you spend a dollar.</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog" className="group rounded-2xl border border-slate-200 p-5 hover:border-[#185FA5] transition bg-white">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Blog</div>
              <div className="text-[16px] font-semibold text-[#042C53] group-hover:underline">Operator playbooks →</div>
              <div className="text-[12px] text-slate-500 mt-2">Weekly long-form, mostly under 8 min read.</div>
            </Link>
            <Link to="/resources" className="group rounded-2xl border border-slate-200 p-5 hover:border-[#185FA5] transition bg-white">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Buyer's Guide</div>
              <div className="text-[16px] font-semibold text-[#042C53] group-hover:underline">The AI Voice Buyer's Guide →</div>
              <div className="text-[12px] text-slate-500 mt-2">7 questions every vendor dodges. PDF.</div>
            </Link>
            <Link to="/demo-video" className="group rounded-2xl border border-slate-200 p-5 hover:border-[#185FA5] transition bg-white">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Demos</div>
              <div className="text-[16px] font-semibold text-[#042C53] group-hover:underline">Watch the agents work →</div>
              <div className="text-[12px] text-slate-500 mt-2">6 short demos by industry.</div>
            </Link>
            <Link to="/newsletter" className="group rounded-2xl border border-slate-200 p-5 hover:border-[#185FA5] transition bg-white">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Newsletter</div>
              <div className="text-[16px] font-semibold text-[#042C53] group-hover:underline">Operators only. No fluff. →</div>
              <div className="text-[12px] text-slate-500 mt-2">Weekly. About 4 minutes.</div>
            </Link>
          </div>
        </div>
      </section>

      {/* CUSTOM CORPORATE TRAINING CTA */}
      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE] border-t border-slate-200/70">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-4">
            Want a custom AI training <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>for your company?</span>
          </h2>
          <p className="text-[16px] text-slate-700 leading-relaxed mb-7 max-w-2xl mx-auto">
            On-site or remote. Half-day primer through full week intensive. We've trained sales teams, ops teams, and leadership groups on what AI actually does, what it costs, and where to start. Real builds, not slideware.
          </p>
          <a href={CAL_URL} target="_blank" rel="noopener" className="inline-block px-7 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15">Book a call →</a>
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
            <a href="/pricing" className="hover:text-[#042C53]">Pricing</a>
            <Link to="/learn" className="hover:text-[#042C53]">Learn</Link>
            <Link to="/careers" className="hover:text-[#042C53]">Careers</Link>
            <Link to="/status" className="hover:text-[#042C53]">Status</Link>
            <Link to="/press" className="hover:text-[#042C53]">Press</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent LLC</div>
        </div>
      </footer>
    </div>
  );
};

export default Learn;
