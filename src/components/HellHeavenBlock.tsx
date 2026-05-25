// src/components/HellHeavenBlock.tsx
// v69: GENERIC Hell -> Heaven block that renders ABOVE THE FOLD for every
// visitor — not gated behind niche selection. The niche-personalized version
// in Index.tsx still renders below this when a visitor picks a niche.
//
// Customer-outcome reframe: lead with the pain THEY feel today, then the
// outcome we deliver. No founder / operator / "4 years deep" copy here.

import { Link } from "react-router-dom";
import { RevealUp, StaggerChildren, HoverLift } from "@/components/motion";

const HELL = [
  "Missed calls turn into lost revenue you'll never get back",
  "Your phone rings while your team is already on a call",
  "After-hours leads go to whoever answers first (not you)",
  "Your CRM is a graveyard of contacts you never followed up with",
  "You spend Sunday writing the email sequence you've meant to write for a year",
  "Your weekend gets eaten by \"just one quick thing\"",
];

const HEAVEN = [
  "Every call answered, every lead qualified, every appointment booked",
  "Your phone is covered 24/7 — your team works on what matters",
  "After-hours leads get booked into your calendar before you wake up",
  "Every lead followed up within 60 seconds with a personalized response",
  "Email sequences write themselves from your existing customer transcripts",
  "You take the weekend back",
];

export default function HellHeavenBlock() {
  return (
    <section
      className="px-5 sm:px-8 py-14 sm:py-20 bg-white border-b border-slate-200/70"
      aria-label="Today vs with TrainYourAgent"
    >
      <div className="max-w-6xl mx-auto">
        <RevealUp>
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            Today vs With TrainYourAgent
          </div>
          <h2 className="text-[28px] sm:text-[42px] md:text-[52px] leading-[1.04] tracking-tight font-semibold text-[#042C53] mb-10 max-w-4xl">
            From the hell that's eating your week{" "}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              to the heaven of a business that runs itself.
            </span>
          </h2>
        </RevealUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* HELL — gray bg */}
          <RevealUp delay={0.05}>
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-8 h-full">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold mb-5">
                Today (the hell)
              </div>
              <StaggerChildren as="ul" className="space-y-4" delay={0.06}>
                {HELL.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 text-[14.5px] sm:text-[15px] text-slate-700 leading-relaxed"
                  >
                    <span
                      aria-hidden="true"
                      className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </StaggerChildren>
            </div>
          </RevealUp>

          {/* HEAVEN — navy bg, white text */}
          <RevealUp delay={0.15}>
            <div className="rounded-3xl bg-[#042C53] text-white p-6 sm:p-8 h-full shadow-[0_30px_80px_-20px_rgba(4,44,83,0.45)]">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#9CC4EC] font-semibold mb-5">
                With TrainYourAgent (the heaven)
              </div>
              <StaggerChildren as="ul" className="space-y-4" delay={0.06}>
                {HEAVEN.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 text-[14.5px] sm:text-[15px] leading-relaxed text-white/95"
                  >
                    <span
                      aria-hidden="true"
                      className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-[#22A36C] text-white text-[11px] font-bold flex items-center justify-center"
                    >
                      ✓
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </StaggerChildren>
              <div className="mt-7 pt-5 border-t border-white/15 flex flex-col sm:flex-row gap-3">
                <HoverLift>
                  {/* v170: <a href> not <Link> — full-page nav to /book so a
                      stale lazy chunk never produces a white screen mid-CTA. */}
                  <a
                    href="/book"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#042C53] text-[13px] font-semibold hover:bg-slate-100"
                  >
                    Book the 30-min build call →
                  </a>
                </HoverLift>
                <HoverLift>
                  <Link
                    to="/voice-demo"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-[13px] font-semibold hover:bg-white/15"
                  >
                    Hear a live agent → 60 sec
                  </Link>
                </HoverLift>
              </div>
            </div>
          </RevealUp>
        </div>
      </div>
    </section>
  );
}
