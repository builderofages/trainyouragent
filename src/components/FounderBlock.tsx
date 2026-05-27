// src/components/FounderBlock.tsx
// v161: shared founder bio block. Mounted on /about (replacing the older
// inline founder section) AND on Index.tsx homepage right below the hero,
// so the "one person + their AI" promise has a face attached above the fold.
//
// Why this exists:
//   Hormozi/Cuban audit flagged that the original site had a strong product
//   narrative but the founder identity surfaced only after 5+ scrolls on /about.
//   On a sub-$5k offer for SMB owners, the buyer is buying the operator more
//   than the platform. The face + credentials need to load with the hero.
//
// Inputs: variant — "hero" (compact, homepage under hero) or "page"
// (long-form, used on /about).
//
// Avatar: /og/avatar-alexander.svg (navy square w/ "AM" monogram). Swap
// for /alexander-mills.jpg once a real headshot lands — the <img> below
// already handles either path via the `avatarSrc` prop default.

import { Link } from "react-router-dom";

const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai/";
// v161: founder Slack — replace with real invite link when the
// trainyouragent-founders workspace launches.
const SLACK_INVITE_URL = "https://join.slack.com/t/trainyouragent/shared_invite/placeholder";
const TWITTER_URL = "https://twitter.com/agentmills";
const CAL_URL = "https://cal.com/trainyouragent/30min";

type Variant = "hero" | "page";

const CREDENTIALS = [
  "343 GitHub commits in 90 days",
  "564 live URLs in production",
  "Multi-provider LLM fallback architecture deployed in prod",
] as const;

export default function FounderBlock({
  variant = "hero",
  avatarSrc = "/og/avatar-alexander.svg",
  className = "",
}: {
  variant?: Variant;
  avatarSrc?: string;
  className?: string;
}) {
  if (variant === "hero") {
    // Compact — fits between the hero and the next conversion block on Home.
    return (
      <section
        aria-labelledby="founder-hero-h"
        className={`relative px-5 sm:px-8 py-10 sm:py-14 bg-white border-y border-slate-200/70 ${className}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-[120px_1fr] md:grid-cols-[140px_1fr_auto] gap-5 sm:gap-7 items-center">
            <img
              src={avatarSrc}
              alt="Alexander Mills, founder of TrainYourAgent"
              width={140}
              height={140}
              className="w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] rounded-2xl shadow-md ring-1 ring-slate-200"
              loading="lazy"
            />
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold font-mono mb-1.5">
                Founder · the only operator who touches your account
              </div>
              <h2 id="founder-hero-h" className="text-[22px] sm:text-[28px] font-semibold text-[#042C53] leading-[1.1] tracking-tight mb-2">
                Alexander Mills. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Tampa.</span> 4 years deep in applied AI.
              </h2>
              <p className="text-[14.5px] sm:text-[15.5px] text-slate-700 leading-relaxed max-w-2xl">
                Built and ran a 7-figure social media agency in LA. Closed it to build TrainYourAgent because the future of small business is one person + their AI agents — and the gap between that future and what exists today is a labor problem, not a model problem.
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-600">
                {CREDENTIALS.map((c) => (
                  <li key={c} className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#22A36C]" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex sm:flex-col gap-2 sm:items-stretch col-span-2 md:col-span-1 mt-3 md:mt-0">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#042C53] text-white text-[12.5px] font-semibold hover:bg-[#0A3D6E] transition"
              >
                Connect on LinkedIn →
              </a>
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white border border-slate-300 text-[#042C53] text-[12.5px] font-semibold hover:border-[#185FA5] transition"
              >
                Book 30 min →
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Page variant — long-form bio for /about. Replaces the old inline block.
  return (
    <section
      aria-labelledby="founder-page-h"
      className={`relative py-16 sm:py-24 bg-white border-y border-slate-200 ${className}`}
    >
      <div className="max-w-[1080px] mx-auto px-6 grid md:grid-cols-[260px_1fr] gap-10 items-start">
        <div className="flex flex-col gap-4">
          <img
            src={avatarSrc}
            alt="Alexander Mills, founder of TrainYourAgent"
            width={260}
            height={260}
            className="aspect-square rounded-3xl ring-1 ring-slate-200 shadow-lg w-full h-auto"
            loading="lazy"
          />
          <div className="text-[13px] text-slate-700 leading-relaxed">
            <div><strong className="font-semibold text-[#042C53]">Alexander Mills</strong></div>
            <div>Founder, TrainYourAgent</div>
            <div>Tampa Bay, Florida</div>
            <div className="mt-2 space-y-1">
              <div>
                <a href="mailto:alexander@trainyouragent.com" className="text-[#185FA5] underline decoration-[#185FA5]/40 hover:decoration-[#185FA5]">
                  alexander@trainyouragent.com
                </a>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12.5px]">
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-[#185FA5] hover:text-[#042C53] underline-offset-2 underline decoration-[#185FA5]/40">LinkedIn</a>
                <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="text-[#185FA5] hover:text-[#042C53] underline-offset-2 underline decoration-[#185FA5]/40">Twitter</a>
                <a href={SLACK_INVITE_URL} target="_blank" rel="noopener noreferrer" className="text-[#185FA5] hover:text-[#042C53] underline-offset-2 underline decoration-[#185FA5]/40">Founder Slack</a>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-4">Founder</div>
          <h2 id="founder-page-h" className="text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.025em] mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
            Alexander <em className="italic font-normal" style={{ color: "#185FA5" }}>Mills.</em>
          </h2>
          <div className="text-[#0B1B2B] text-[16.5px] leading-[1.7] space-y-4 mb-7">
            <p>
              Alexander Mills, founder, Tampa. Four years building AI — every model release, every tool shift, every capability jump.
            </p>
            <p>
              Before TrainYourAgent, ran a 7-figure social media agency in Los Angeles. Closed it on purpose. The reason: <em>"the future of small business is one person + their AI agents,"</em> and the work of building that future doesn't get done by another agency churning out content. It gets done by engineers wiring real agents onto real phone lines.
            </p>
            <p>
              That's TrainYourAgent. One operator, your line, your CRM, your call flow. No SDR. No account manager. No delivery pod. The number of humans between you and the build is one — and that human is me, all the way through discovery, scoping, training, cutover, and every monthly check-in after.
            </p>
            <p className="text-[15px] text-slate-700">
              <span className="text-[11px] uppercase tracking-[0.18em] font-mono text-[#185FA5] mr-2">Quote</span>
              <em>"The next decade of small business gets won by the operators who wire AI into the work first. I'm building the agency that wires it for them."</em>
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mb-7">
            {CREDENTIALS.map((c) => (
              <div key={c} className="rounded-2xl border border-slate-200 bg-[#F6FAFE] p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[#22A36C]" />
                  <div className="text-[10.5px] uppercase tracking-[0.16em] font-mono font-semibold text-[#185FA5]">Receipt</div>
                </div>
                <div className="text-[14px] text-[#042C53] font-medium leading-snug">{c}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] text-[15px] font-semibold text-white bg-[#185FA5] hover:bg-[#0C447C] transition rounded-full"
            >
              Book 30 min with me →
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] text-[15px] font-semibold text-[#042C53] bg-white hover:bg-slate-50 border border-slate-200 transition rounded-full"
            >
              LinkedIn →
            </a>
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] text-[15px] font-semibold text-[#042C53] bg-white hover:bg-slate-50 border border-slate-200 transition rounded-full"
            >
              Twitter →
            </a>
            <a
              href={SLACK_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] text-[15px] font-semibold text-[#042C53] bg-white hover:bg-slate-50 border border-slate-200 transition rounded-full"
            >
              Founder Slack →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
