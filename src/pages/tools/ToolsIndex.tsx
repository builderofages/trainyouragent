// src/pages/tools/ToolsIndex.tsx
// v41: /tools — index of 5 free tools (lead magnets).

import { Link } from "react-router-dom";
import ToolLayout, { NAVY, BLUE } from "./ToolLayout";

const TOOLS = [
  {
    slug: "cost-estimator",
    title: "AI Agent Cost Estimator",
    blurb: "Plug in your call volume — see what a 24/7 AI agent costs vs. your current setup, and how fast it pays back.",
    minutes: "1 min",
  },
  {
    slug: "roi-calculator",
    title: "Lead-Qualification ROI Calculator",
    blurb: "How many leads, hours, and dollars an AI agent reclaims from your sales pipeline every month.",
    minutes: "2 min",
  },
  {
    slug: "prompt-critic",
    title: "Prompt Critic",
    blurb: "Paste a prompt — get scored on clarity, specificity, structure, safety. Get back a tightened rewrite.",
    minutes: "30 sec",
  },
  {
    slug: "scenario-generator",
    title: "Automation Scenario Generator",
    blurb: "Tell us your industry and use-case — get 5 specific AI automation scenarios with ROI estimates.",
    minutes: "1 min",
  },
  {
    slug: "latency-simulator",
    title: "Voice Latency Simulator",
    blurb: "Watch the side-by-side: 800ms (us) vs 3.5s (every competitor). Visceral demo of why latency wins deals.",
    minutes: "30 sec",
  },
];

export default function ToolsIndex() {
  return (
    <ToolLayout
      eyebrow="Free tools"
      title="Five tools you can use"
      italicTail="right now."
      subtitle="No signup. Each one solves something specific — and if you like how they work, the agents we build are the same brain underneath."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {TOOLS.map((t) => (
          <Link
            key={t.slug}
            to={`/tools/${t.slug}`}
            className="block rounded-2xl border border-slate-200 hover:border-[#185FA5] p-5 sm:p-6 transition-colors min-h-[44px]"
            aria-label={`Open ${t.title}`}
          >
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="text-[17px] font-semibold" style={{ color: NAVY }}>
                {t.title}
              </h2>
              <span className="text-[11px] uppercase tracking-[0.15em] text-slate-500">{t.minutes}</span>
            </div>
            <p className="text-[14px] text-slate-600 leading-snug">{t.blurb}</p>
            <div className="mt-4 text-[13px] font-medium" style={{ color: BLUE }}>
              Open →
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-[#042C53] text-white p-6 sm:p-8">
        <div className="text-[12px] uppercase tracking-[0.18em] text-[#9BC3E8] font-semibold mb-2">
          Ready to ship?
        </div>
        <h3 className="text-[22px] font-semibold mb-2">Stop calculating. Start shipping.</h3>
        <p className="text-[14px] text-white/80 mb-4 max-w-xl">
          These tools tell you what to do. Our team actually does it — voice agent live in 7 days, $5k/mo.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center px-5 py-3 rounded-lg bg-white text-[#042C53] text-[14px] font-semibold min-h-[44px]"
        >
          Book an intro call →
        </Link>
      </div>
    </ToolLayout>
  );
}
