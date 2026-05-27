// src/pages/Proof.tsx — route /proof
// v97: complete rewrite. Founder: "I don't want the github being the /proof
// I need it to be something better."
//
// Old version: GitHub commit graph, /api/github-velocity counters, "days
// building in public" framing. Read as dev journal.
//
// New version: PROOF IS WHAT WORKS RIGHT NOW IN THE BROWSER.
//   - Live Charlotte voice demo (ElevenLabs)
//   - Live chat demo (Groq Llama 3.3 70B)
//   - Real free tools the buyer can use today
//   - Production architecture (the actual stack)
//   - 4-way risk reversal
// No commits. No "we shipped X." Just things that work.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import PoweredByBadges from "@/components/PoweredByBadges";
// v161: technically verifiable artifacts block (GitHub count, LLM
// fallback chain diagram, voice latency benchmark, code snippet, honesty block).
import VerifiableProofBlock from "@/components/proof/VerifiableProofBlock";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai/";

const LIVE_PROOFS = [
  {
    n: "01",
    label: "VOICE",
    title: "Talk to a real AI voice agent right now",
    body: "Tap the mic, ask anything. ElevenLabs Jessica voice + Groq Llama 3.3 + browser-native STT. Free, no signup, no waitlist. Same agent class we deploy on production phone lines.",
    cta: { label: "Open the voice demo →", to: "/voice-demo" },
    tag: "60 sec · no card",
  },
  {
    n: "02",
    label: "CHAT",
    title: "Or chat with the same brain",
    body: "Free-tier chat assistant running on Groq Llama 3.3 70B (free LLM fallback chain). No login. No data retention. The bot bottom-right on every page on this site is the production demo.",
    cta: { label: "Bottom-right chat bubble →", to: "/" },
    tag: "Live · always on",
  },
  {
    n: "03",
    label: "TOOLS",
    title: "Free working tools — actually use them today",
    body: "Not 'sign up to access' bait. These run client-side or hit the production API and give you a real output in under 60 seconds.",
    cta: { label: "Browse the tool catalog →", to: "/tools" },
    tag: "Build something now",
  },
  {
    n: "04",
    label: "ARCHITECTURE",
    title: "The actual production stack",
    body: "Real infrastructure powering this site and the agents we ship: Anthropic Claude + Groq + ElevenLabs + Vapi + Twilio + Pinecone + Cohere + Supabase + Vercel + Stripe + Resend + Cal.com. Every one wired into a live endpoint right now.",
    cta: { label: "See the architecture →", to: "/technology" },
    tag: "Same stack as Cursor / Linear",
  },
];

const WORKING_TOOLS = [
  { name: "Agent Builder",       sub: "Spec your own AI agent in 30 seconds. Live prompt + system instructions output.", to: "/tools/agent-builder" },
  { name: "Missed-call ROI calc", sub: "Drag sliders. See annual revenue you're losing to missed calls.",                 to: "/hvac" },
  { name: "Diagnose your biz",   sub: "4-step wizard → personalized agent recommendation + payback math.",                to: "/tools/diagnose" },
  { name: "Cold DM generator",   sub: "Drop a target persona + offer. Get 3 personalized LinkedIn DMs.",                  to: "/tools/cold-dm" },
  { name: "Voice script writer", sub: "Niche + business name → 2-page voice agent dialogue.",                              to: "/tools/voice-script" },
  { name: "Prompt critic",       sub: "Paste a prompt. Get scores + a rewritten version.",                                 to: "/tools/prompt-critic" },
];

const GUARANTEE = [
  { title: "30-day money-back on the build fee", body: "If your first agent doesn't ship to the spec we agreed on kickoff, we refund the build fee, you keep the artifacts, no clawback fight." },
  { title: "Founder lane = $0 upfront",         body: "You don't pay a cent until calls land. If we can't build something that books revenue, you don't pay." },
  { title: "Cancel anytime, no contract trap",  body: "Month-to-month. You can leave any time. Your number ports out within 5 business days. Data export available for 90 days." },
  { title: "90-day pay-for-itself guarantee",   body: "Founding-cohort customers get a stricter version: we beat your missed-call baseline in 90 days or we refund every dollar." },
];

export default function Proof() {
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <Helmet>
        <title>Proof — talk to the agent right now · TrainYourAgent</title>
        <meta
          name="description"
          content="Proof is what works in your browser right now. Talk to a real AI voice agent, chat with the production assistant, run the free tools, see the architecture. No screenshots. No 'as featured in.' Just things that work."
        />
        <link rel="canonical" href="https://www.trainyouragent.com/proof" />
        <meta property="og:title" content="Proof — talk to the agent right now · TrainYourAgent" />
        <meta property="og:description" content="Live voice + chat + tools + architecture. Free, no signup. The proof is the product." />
        <meta property="og:url" content="https://www.trainyouragent.com/proof" />
      </Helmet>

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">
        Skip to main content
      </a>
      <SiteNav active="resources" />
      <span id="main" tabIndex={-1} aria-hidden="true" />

      {/* HERO */}
      <section className="pt-32 pb-14 px-5 sm:px-8 bg-gradient-to-b from-[#E6F1FB]/60 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#042C53] text-white text-[11px] font-semibold tracking-[0.16em] uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C] animate-pulse" />
            Proof · everything below is live right now
          </div>
          <h1 className="text-[34px] sm:text-[54px] md:text-[66px] leading-[1.05] tracking-tight font-semibold text-[#042C53] h1-balance break-words">
            The proof is{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>the product.</span>
          </h1>
          <p className="mt-6 text-[17px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            Most agencies show you screenshots, logos, and "as featured in." We show you the actual working agent. Talk to it. Chat with it. Use the tools. See the stack. If anything below doesn't work the way we say it does, you'll find out in the next 30 seconds — not after you sign.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/voice-demo"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15"
            >
              <span className="relative inline-flex w-2 h-2" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
              </span>
              Talk to the live agent → 60 sec
            </Link>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-4 rounded-2xl border-2 border-[#042C53]/15 text-[#042C53] font-semibold text-[15px] hover:border-[#042C53]"
            >
              Book a 30-min build call
            </a>
          </div>
        </div>
      </section>

      {/* 4 LIVE PROOFS */}
      <section className="px-5 sm:px-8 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-3">Four kinds of proof, all live right now</div>
          <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#042C53] leading-tight mb-9">
            No screenshots. No "trust us." Just{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>real working software.</span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-5">
            {LIVE_PROOFS.map((p) => (
              <article key={p.n} className="group rounded-3xl border border-slate-200 bg-white p-7 hover:border-[#042C53]/30 hover:shadow-lg transition">
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-baseline gap-3">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-mono font-semibold">{p.n}</div>
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#22A36C] font-mono font-semibold">{p.label}</div>
                  </div>
                  <div className="text-[10.5px] uppercase tracking-[0.12em] text-slate-500 font-mono">{p.tag}</div>
                </div>
                <h3 className="text-[20px] sm:text-[22px] font-semibold text-[#042C53] mb-3 leading-tight">{p.title}</h3>
                <p className="text-[14.5px] text-slate-700 leading-relaxed mb-5">{p.body}</p>
                {p.cta.to.startsWith("http") ? (
                  <a href={p.cta.to} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#185FA5] group-hover:text-[#042C53]">
                    {p.cta.label}
                  </a>
                ) : (
                  <Link to={p.cta.to} className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#185FA5] group-hover:text-[#042C53]">
                    {p.cta.label}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* v161: technically verifiable receipts (GitHub commit count via
          /api/github-velocity, LLM fallback chain SVG, 487ms voice
          latency, integration badges, inline code snippet, honesty block). */}
      <VerifiableProofBlock />

      {/* WORKING TOOLS GRID */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-3">Free working tools</div>
          <h2 className="text-[26px] sm:text-[36px] font-semibold text-[#042C53] leading-tight mb-3">
            Use them right now.{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>No email gate.</span>
          </h2>
          <p className="text-[15px] text-slate-600 mb-9 max-w-2xl">
            Every one of these runs live on this site. They use the same production endpoints we ship to paying customers.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {WORKING_TOOLS.map((t) => (
              <Link
                key={t.name}
                to={t.to}
                className="block rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#042C53]/30 hover:shadow-sm hover:bg-[#F6FAFE]/40 transition group"
              >
                <div className="flex items-baseline justify-between mb-1.5">
                  <div className="text-[15px] font-semibold text-[#042C53] group-hover:text-[#185FA5] leading-tight">{t.name}</div>
                  <div className="text-[11px] text-[#22A36C] font-mono font-semibold">LIVE</div>
                </div>
                <div className="text-[12.5px] text-slate-600 leading-snug">{t.sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STACK BADGES — uses the new sick floating marquee */}
      <PoweredByBadges
        eyebrow="THE STACK · ALL WIRED INTO LIVE ENDPOINTS RIGHT NOW"
        headline="Real infrastructure. Not a marketectecture diagram."
      />

      {/* GUARANTEE */}
      <section className="px-5 sm:px-8 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-3">The risk-reversal stack</div>
          <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#042C53] leading-tight mb-9">
            Four ways{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>you don't lose.</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {GUARANTEE.map((g, i) => (
              <article key={i} className="rounded-2xl border border-[#185FA5]/20 bg-[#E6F1FB]/40 p-6">
                <h3 className="text-[16px] font-semibold text-[#042C53] mb-2 leading-tight">{g.title}</h3>
                <p className="text-[13.5px] text-slate-700 leading-relaxed">{g.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 sm:px-8 py-16 sm:py-20 bg-[#042C53] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold mb-5">
            The fastest path is also{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>the proof.</span>
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#DCEBFA] mb-3">
            30-min discovery call. We listen to 3 of your existing calls. You leave with a written scope and a price — not a sales pitch.
          </p>
          <p className="text-[14px] text-[#A8C7E8] mb-8">No card. No obligation. Most of these end with a "no" from one side or the other. That's the point.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-[#042C53] font-semibold hover:bg-[#DCEBFA]">
              Book a 30-min build call <span aria-hidden>→</span>
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-white/30 text-white hover:bg-white/10">
              Or DM the founder on LinkedIn
            </a>
          </div>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
