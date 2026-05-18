// src/pages/Team.tsx
// Team page — Founder bio, engineering team placeholder, first-principles beliefs.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/agentmills/";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, color: "#042C53" }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
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

const BELIEFS: { h: string; b: string }[] = [
  {
    h: "AI agents should reduce headcount, not augment it.",
    b: "If we ship a voice agent and the customer also has to keep their receptionist, we failed. The point is the seat goes away — and the customer keeps the salary.",
  },
  {
    h: "If we won't run it ourselves, we won't ship it.",
    b: "Every agent we sell is one we'd put on our own business line. We dogfood the stack — voice, chat, dashboards, billing — before any customer touches it.",
  },
  {
    h: "Voice is the most underrated channel in 2026.",
    b: "Everyone's chasing chat. Phones still drive the majority of high-intent revenue in HVAC, real estate, healthcare, legal, automotive. Whoever wins voice wins the SMB layer.",
  },
  {
    h: "The builder you hire is the builder who ships.",
    b: "No SDR-to-AE-to-CSM hand-off. The engineer on your scoping call is the engineer who'll ship your agent and tune it weekly. We will never grow into a sales-engineering org.",
  },
  {
    h: "Operators beat researchers at deployment.",
    b: "Labs make the breakthroughs. We turn them into businesses. The job isn't a better paper — it's a working agent on Friday with a P&L attached on Monday.",
  },
];

const Team = () => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Team — TrainYourAgent";
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", n);
        document.head.appendChild(el);
      }
      el.setAttribute("content", c);
    };
    setMeta(
      "description",
      "Founded by Alexander Mills — operator, founder, 4 years deep in applied AI. TrainYourAgent is a Tampa-based AI company building voice and chat agents for service businesses.",
    );
  }, []);

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <SiteNav active="about" />

      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
            Team
          </div>
          <h1 className="text-[32px] sm:text-[48px] md:text-[64px] leading-[1.06] sm:leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Lean by design.{" "}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              The builder you hire is the builder who ships.
            </span>
          </h1>
          <p className="mt-6 text-[17px] text-slate-700 max-w-2xl leading-relaxed">
            No sales engineers handing you off to delivery. No account-management
            theater. The person who scopes your agent is the person who builds
            it. The person who builds it is the person who tunes it weekly.
          </p>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="px-5 sm:px-8 pb-16">
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#F6FAFE] border border-slate-200 p-6 sm:p-8 md:p-10 grid md:grid-cols-[200px_1fr] gap-6 sm:gap-8 items-start">
          <div className="flex flex-col gap-3">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#E6F1FB] to-[#DCEBFA] border border-slate-200 flex items-center justify-center">
              <BrainLogo size={120} />
            </div>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener"
              className="text-[13px] text-[#042C53] underline decoration-[#185FA5]/40 hover:decoration-[#185FA5]"
            >
              LinkedIn →
            </a>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1">
              Founder & CEO
            </div>
            <div className="text-[28px] font-semibold text-[#042C53]">
              Alexander Mills
            </div>
            <div className="text-[14px] text-slate-600 mb-5">
              Tampa Bay, FL · 4 years deep in applied AI · 336 public commits · 564 live URLs · open-source repo
            </div>
            <div className="text-[15px] text-slate-700 leading-[1.75] space-y-3">
              <p>
                Founder of TrainYourAgent — a Tampa-based AI company building
                the voice and chat agents that actually run service businesses.
              </p>
              <p>
                Before AI, Alexander built across categories most founders
                never touch: shipping social campaigns for global brands and
                household-name talent at one of the world's largest social
                media marketing agencies in Los Angeles, then founding
                EndCreations to build infrastructure for the gaming industry.
                The pattern: walk into industries the polished operators
                ignore, learn how the work actually gets done, and rebuild it.
              </p>
              <p>
                He's now four years deep in applied AI — through every model
                release, every tool shift, every capability jump — and runs
                TrainYourAgent — building the product in public, with the
                full commit history readable on GitHub — alongside a portfolio
                of related ventures from Tampa Bay. He ships the same way he
                always has: faster than anyone you've met, with a thesis you
                can argue with.
              </p>
              <p className="text-[#042C53] font-medium border-l-2 border-[#185FA5] pl-4 italic">
                "AI isn't a feature. It's the evolutionary step that takes
                humans out of cubicles. The next decade of business gets won
                by the operators who wire it into the work first."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ENGINEERING TEAM */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            Engineering team
          </div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-4">
            Hiring{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              the next 4 builders.
            </span>
          </h2>
          <p className="text-[16px] text-slate-700 max-w-3xl leading-relaxed mb-8">
            Voice infra engineer · Full-stack agent builder · Growth /
            performance engineer · DevRel for the agency partner program. We
            hire by what you've shipped, not your resume.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { role: "Voice Infrastructure Engineer", loc: "Remote · US/EU", stack: "Twilio · ElevenLabs · Cartesia · Deepgram" },
              { role: "Full-Stack Agent Builder", loc: "Remote · US/EU", stack: "TS · React · Supabase · Anthropic SDK" },
              { role: "Growth Engineer", loc: "Remote · US", stack: "Meta CAPI · GA4 · PostHog · n8n" },
              { role: "Partner DevRel", loc: "Remote · US", stack: "Agency-side experience required" },
            ].map((j) => (
              <div
                key={j.role}
                className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#185FA5] transition"
              >
                <div className="text-[16px] font-semibold text-[#042C53] mb-1">
                  {j.role}
                </div>
                <div className="text-[12px] uppercase tracking-[0.14em] text-slate-600 font-semibold mb-2">
                  {j.loc}
                </div>
                <div className="text-[13px] text-slate-700">{j.stack}</div>
              </div>
            ))}
          </div>
          <a
            href="mailto:careers@trainyouragent.com"
            className="mt-6 inline-block px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] shadow"
          >
            careers@trainyouragent.com
          </a>
        </div>
      </section>

      {/* BELIEFS */}
      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            Our beliefs
          </div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">
            First-principles statements{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              we'd defend in a knife fight.
            </span>
          </h2>
          <div className="space-y-4">
            {BELIEFS.map((b, i) => (
              <div
                key={i}
                className="rounded-3xl bg-white border border-slate-200 p-7 hover:border-[#185FA5] transition"
              >
                <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">
                  Belief {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-[20px] sm:text-[24px] font-semibold text-[#042C53] mb-3 leading-tight">
                  {b.h}
                </h3>
                <p className="text-[15px] text-slate-700 leading-relaxed">{b.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-600">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#042C53]">Terms</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Team;
