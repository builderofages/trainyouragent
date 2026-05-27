// src/pages/ResearchPartners.tsx
// /research — Operator partner to AI labs.
// We're not a lab. We deploy lab models in production for SMBs and feed
// signal back. Open problems we're working on: latency, voice fidelity,
// multi-agent orchestration, vertical evals.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const FORM_ENDPOINT = "/api/lead";

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

const LABS: { name: string; role: string; usage: string }[] = [
  { name: "Anthropic",  role: "Primary reasoning",          usage: "Claude Sonnet 4 + Opus 4 across voice + chat. Production traffic, zero-retention API tier." },
  { name: "OpenAI",     role: "Tool-use + fallback",        usage: "GPT-4o for function calling, GPT-4o-mini for high-volume chat. Sora for media." },
  { name: "Mistral",    role: "Cost-sensitive routing",     usage: "Mistral Large for batch transcript summarization at 1/10 the cost of frontier models." },
  { name: "ElevenLabs", role: "Voice synthesis (primary)",  usage: "Flash + Convai for sub-400ms TTS. Voice cloning for branded agents. Beta-testing v3 latency improvements." },
  { name: "Cartesia",   role: "Voice synthesis (low-latency)", usage: "Sonic for ultra-low-latency interruption handling. Used on the highest-volume HVAC + dispatch agents." },
  { name: "Deepgram",   role: "Speech-to-text",             usage: "Nova-3 streaming with custom vocab per vertical. Sub-200ms first-word latency." },
  { name: "Google",     role: "Long-context + tools",       usage: "Gemini 2.0 Flash for long-context calls (500K+ token transcripts). Maps + Calendar deep integration." },
  { name: "Meta",       role: "Open-weight specialization", usage: "Llama 3.3 fine-tuned on per-vertical evals when proprietary data + cost matter more than frontier reasoning." },
];

const PROBLEMS: { title: string; body: string; status: string }[] = [
  {
    title: "Sub-300ms voice latency on commodity infrastructure",
    body: "Current production floor is ~400ms first-token on a tuned Twilio + ElevenLabs Flash + Claude pipeline. Opening problem: get to 250ms without sacrificing turn-detection accuracy. We're testing Cartesia Sonic + Deepgram Nova-3 streaming + speculative decoding through a Cloudflare Worker proxy.",
    status: "Active research",
  },
  {
    title: "Voice fidelity under packet loss",
    body: "VoIP networks lose 1–8% of packets in the wild. Standard TTS regenerates broken audio. We're prototyping a forward-error-correction scheme that lets the agent gracefully degrade instead of hard-cutting — important for healthcare and legal calls where dropping audio mid-sentence is a liability event.",
    status: "Prototyping",
  },
  {
    title: "Multi-agent orchestration without a leader",
    body: "Most multi-agent systems pick a leader (planner) and delegate. That breaks when the leader hallucinates. We're testing a peer-to-peer voting orchestrator (3 specialized agents, majority decision) for high-stakes flows like medical intake and legal conflict-checks.",
    status: "Internal eval",
  },
  {
    title: "Vertical-specific evals at scale",
    body: "Public benchmarks don't measure 'did the HVAC agent dispatch correctly'. We're building open-source eval suites per vertical — HVAC, healthcare, legal, real estate, automotive — released as we ship them so other operators can compare apples-to-apples.",
    status: "Releasing Q3",
  },
  {
    title: "Cost-routing across model providers",
    body: "Token pricing moves weekly. We've built a router that classifies intent first (cheap LLM), then routes to the cost-optimal model that meets the latency + accuracy constraint. Real production usage shows a 38% cost reduction vs. always-Claude with no measurable quality drop.",
    status: "Shipped, iterating",
  },
];

const ResearchPartners = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", org: "", interest: "" });

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
    document.title = "Research & Labs — TrainYourAgent";
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
      "TrainYourAgent is the operator partner to AI labs. We deploy frontier models — Anthropic, OpenAI, Mistral, ElevenLabs — in production for SMBs and feed signal back.",
    );
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          source: "research-partners",
          meta: { org: form.org, interest: form.interest },
        }),
      }).catch(() => {});
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <SiteNav />

      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto glass-panel p-8 sm:p-10 holo-cyan">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4 title-mono flex items-center gap-2">
            <span className="trinity-orb" aria-hidden="true" /> Research & Labs
          </div>
          <h1 className="text-[42px] sm:text-[68px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            The operator partner to{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              the labs defining AI.
            </span>
          </h1>
          <p className="mt-6 text-[18px] text-slate-700 max-w-3xl leading-relaxed">
            We're not a research lab. We deploy frontier models in production
            for thousands of customer interactions per day, then feed the
            signal — what worked, what broke, where latency lives — back to
            the labs that built them.
          </p>
          <div className="brand-note mt-3">100% PRODUCTION SIGNAL • NO LAB THEATER • TRINITY PROTOCOL</div>
        </div>
      </section>

      {/* LABS WE DEPLOY */}
      <section className="px-5 sm:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            Labs we deploy in production for
          </div>
          <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-8">
            Frontier models, wired into{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              SMB workflows.
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {LABS.map((l) => (
              <div key={l.name} className="glass-panel p-6 holo-cyan">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="text-[20px] font-semibold text-[#042C53] flex items-center gap-2">
                      <span className="trinity-orb" aria-hidden="true" />{l.name}
                    </div>
                    <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold title-mono">
                      {l.role}
                    </div>
                  </div>
                </div>
                <p className="text-[14px] text-slate-700 leading-relaxed">{l.usage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN PROBLEMS */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            Open problems
          </div>
          <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-3">
            What we're working on{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              right now.
            </span>
          </h2>
          <p className="text-[16px] text-slate-700 max-w-3xl leading-relaxed mb-8">
            Practical engineering problems we hit in production. We publish
            what we learn — sometimes as code, sometimes as posts, sometimes
            as direct PRs to model providers' SDKs.
          </p>
          <div className="space-y-4">
            {PROBLEMS.map((p, i) => (
              <article
                key={i}
                className="rounded-3xl bg-white border border-slate-200 p-7 hover:border-[#185FA5] transition"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-[20px] sm:text-[24px] font-semibold text-[#042C53] leading-tight">
                    {p.title}
                  </h3>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#E6F1FB] text-[#185FA5] font-semibold whitespace-nowrap">
                    {p.status}
                  </span>
                </div>
                <p className="text-[15px] text-slate-700 leading-relaxed">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT POSTS */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            Recent posts
          </div>
          <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-8">
            Engineering writing{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              from production.
            </span>
          </h2>
          <div className="rounded-3xl bg-[#F6FAFE] border border-slate-200 p-8 text-center">
            <p className="text-[15px] text-slate-700 leading-relaxed mb-5">
              Latency benchmarks, cost-routing teardowns, post-mortems on
              real outages. Filed under engineering on the blog.
            </p>
            <Link
              to="/blog"
              className="inline-block px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] shadow"
            >
              Read the engineering posts →
            </Link>
          </div>
        </div>
      </section>

      {/* PARTNER FORM */}
      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE] border-t border-slate-200/70">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            Want to partner?
          </div>
          <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-4">
            For labs, researchers, and infrastructure providers.{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              Tell us what you're shipping.
            </span>
          </h2>
          <p className="text-[16px] text-slate-700 leading-relaxed mb-8">
            We run production traffic on whatever stack works. If you're a lab
            shipping a new model, an infra provider with better unit
            economics, or a researcher with a deployment partner shaped hole
            in your project — get in touch.
          </p>

          {submitted ? (
            <div className="rounded-2xl bg-white border border-[#185FA5]/30 p-6 text-[#042C53]">
              <div className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#185FA5] mb-2">
                Got it
              </div>
              <div className="text-[18px] font-semibold mb-2">
                Thanks — we'll respond within one business day.
              </div>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-[0_8px_40px_-15px_rgba(4,44,83,0.18)] space-y-5"
            >
              <div>
                <label className="block text-[12px] uppercase tracking-[0.14em] text-slate-500 font-semibold mb-2">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@yourlab.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[15px] focus:border-[#185FA5] focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20"
                />
              </div>
              <div>
                <label className="block text-[12px] uppercase tracking-[0.14em] text-slate-500 font-semibold mb-2">
                  Lab / org
                </label>
                <input
                  required
                  type="text"
                  value={form.org}
                  onChange={(e) => setForm({ ...form, org: e.target.value })}
                  placeholder="Anthropic, OpenAI, Mistral, ElevenLabs, your-lab.ai…"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[15px] focus:border-[#185FA5] focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20"
                />
              </div>
              <div>
                <label className="block text-[12px] uppercase tracking-[0.14em] text-slate-500 font-semibold mb-2">
                  Why partner
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                  placeholder="What you're shipping, what kind of production signal would help, what you'd want from a deployment partner…"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[15px] focus:border-[#185FA5] focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send →"}
              </button>
              <p className="text-[12px] text-slate-500 text-center">
                Or email{" "}
                <a href="mailto:research@trainyouragent.com" className="underline font-semibold">
                  research@trainyouragent.com
                </a>{" "}
                directly.
              </p>
            </form>
          )}
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
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

export default ResearchPartners;
