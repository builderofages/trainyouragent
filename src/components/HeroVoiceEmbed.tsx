// src/components/HeroVoiceEmbed.tsx
// v63: Live voice demo embedded directly in the Home hero — the 10x conversion
// lever called out in the Grok Heavy audit. Visitor lands → sees a working AI
// voice agent in 5 seconds → can talk to it without signing up.
//
// This is intentionally a compact, hero-sized wrapper around the existing
// VoiceAgent component (lazy-loaded so it doesn't bloat the entry chunk and
// doesn't request microphone permissions until the user clicks).

import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";

const VoiceAgent = lazy(() => import("./VoiceAgent"));

export default function HeroVoiceEmbed() {
  const [active, setActive] = useState(false);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Soft halo */}
      <div
        className="absolute -inset-6 rounded-[32px] blur-2xl opacity-70 pointer-events-none -z-10"
        style={{ background: "radial-gradient(closest-side, #BDDAF4 0%, rgba(189,218,244,0) 70%)" }}
        aria-hidden="true"
      />

      <div className="relative rounded-3xl bg-white border border-slate-200 shadow-[0_30px_80px_-20px_rgba(4,44,83,0.25)] p-5 sm:p-6">
        {/* Status header */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-semibold tracking-[0.12em] uppercase">
            <span className="relative inline-flex w-1.5 h-1.5" aria-hidden="true">
              <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
            Live · Free
          </div>
          <span className="text-[10.5px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold">
            Voice receptionist
          </span>
        </div>

        {!active ? (
          <div className="text-center py-4">
            <h3 className="text-[20px] sm:text-[22px] leading-tight font-semibold text-[#042C53] mb-2">
              Talk to your AI{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                receptionist right now.
              </span>
            </h3>
            <p className="text-[13.5px] text-slate-600 leading-relaxed mb-5 max-w-xs mx-auto">
              Tell it you need an HVAC tech tomorrow at 2pm. Or ask about hours. Or insurance. Real AI, in your browser, no signup.
            </p>
            <button
              type="button"
              onClick={() => setActive(true)}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full text-white shadow-xl transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-[#185FA5]/40 hover:scale-105"
              style={{ background: "linear-gradient(135deg,#185FA5,#042C53)" }}
              aria-label="Start voice demo"
            >
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
            <div className="mt-4 text-[12px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold">
              Tap to talk
            </div>

            {/* Suggested prompts (visible upfront so visitor knows what to say) */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <div className="text-[10.5px] uppercase tracking-[0.16em] text-slate-500 font-semibold mb-2.5">
                Try saying
              </div>
              <ul className="space-y-1.5 text-[12.5px] text-slate-700">
                <li>&ldquo;My furnace just died &mdash; can someone come tonight?&rdquo;</li>
                <li>&ldquo;What are your hours?&rdquo;</li>
                <li>&ldquo;Do you take insurance?&rdquo;</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="-mx-2">
            <Suspense
              fallback={
                <div className="py-12 text-center text-[13px] text-slate-500">
                  Loading voice agent&hellip;
                </div>
              }
            >
              <VoiceAgent />
            </Suspense>
          </div>
        )}

        {/* Powered-by + secondary CTA */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 leading-tight">
            Groq Llama 3.3 + OpenAI TTS<br />
            <span className="text-slate-400">Same stack as ChatGPT voice mode</span>
          </div>
          <Link
            to="/voice-demo"
            className="text-[11.5px] font-semibold text-[#185FA5] hover:text-[#042C53] whitespace-nowrap"
          >
            Full demo &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
