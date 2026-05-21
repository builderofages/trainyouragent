// src/pages/Train.tsx
// v73-FINAL — FLAGSHIP page. The center of gravity for the entire brand.
//
// "Train Your Agent" is literally the brand name. This page is the method
// page that proves we actually train agents — vs everyone else bolting LLMs
// onto a phone line. Layout:
//   - Hero (full-bleed, navy + italic serif, mesh + particles)
//   - Vertical 5-step training pipeline SVG (Discovery → KB → Fine-tune → Eval → Production)
//   - The 5-step method in detail (real tools, real time, real cost)
//   - "What you can train an agent to do" — 6 capability cards
//   - "Training programs for your team" — workshop / cohort / in-house
//   - Pricing summary
//   - 5 FAQs + CTA strip

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
// v76-B: MeshGradientBackdrop + ParticleDrift removed from /train.
// Per v73-FINAL spec the 2040 visual layer (mesh + particles + LiveStatTicker)
// is HOME-ONLY — /train has its own hero treatment and the leak was muddling
// brand. Static gradient remains on the section background.

const CAL_URL = "https://cal.com/trainyouragent/30min";

type Step = {
  n: number;
  name: string;
  window: string;
  oneLine: string;
  detail: string;
  tools: string[];
  time: string;
  cost: string;
};

const STEPS: Step[] = [
  {
    n: 1,
    name: "Discovery",
    window: "Week 1",
    oneLine: "We sit with you for 2 hours and transcribe everything.",
    detail:
      "We extract the 100 questions your business actually gets asked, and the 100 ways you currently answer them. We sit on a Zoom call (or in your office) with whoever runs the front-desk, the dispatch, the sales conversations — and transcribe. We pull the last 90 days of inbound calls (recorded via your existing phone system or new Twilio capture), the last 6 months of email threads, every Loom you've ever recorded for onboarding a new hire. This is the ground truth. Without this step, you get a chatbot. With this step, you get an agent trained on what your business actually does.",
    tools: ["Zoom + recording", "Otter / Fathom transcripts", "Twilio call capture", "Gmail / Outlook export"],
    time: "5–7 business days",
    cost: "Included in build",
  },
  {
    n: 2,
    name: "Knowledge Base",
    window: "Week 1–2",
    oneLine: "Every PDF, every template, every Loom — indexed and retrievable.",
    detail:
      "Every PDF, every email template, every Loom you've recorded, every Slack message your team uses to onboard new hires. Indexed in Pinecone with chunk-overlap-preserving boundaries and structural metadata. Retrieved at conversation-time with Cohere rerank-v3 (because the cheap dense-only retrieval misses too many edge cases). Served to the agent on every call in <200ms. The KB is the single biggest reason a trained agent doesn't sound like a chatbot — it can actually quote your service menu, your pricing, your service area, your warranty terms, your refund policy.",
    tools: ["Pinecone (vector store)", "Cohere embed-v3 + rerank-v3", "OpenAI Whisper / AssemblyAI (transcribe Looms)", "LangChain / LlamaIndex (chunking)"],
    time: "5–10 business days",
    cost: "$0.04 per 1M tokens stored",
  },
  {
    n: 3,
    name: "Fine-tune",
    window: "Week 2",
    oneLine: "Optional. For high-volume tone-critical agents.",
    detail:
      "Optional. For high-volume use cases ($5K+/mo agent traffic) we fine-tune a Llama-3.1-8B on Modal or Claude Haiku on Anthropic's tuning endpoint, using your tone + edge-case examples. For lower volume we skip this step and use prompt engineering + RAG — which gets you 90% of the way there at 10% of the cost. The fine-tune decision is made in the eval phase: if the off-the-shelf model + RAG doesn't pass our tone-match threshold, we tune. If it does, we don't.",
    tools: ["Modal (Llama-3.1-8B host)", "Anthropic Haiku fine-tune endpoint", "Weights & Biases (training runs)", "Together AI (alternative host)"],
    time: "3–5 business days (when applied)",
    cost: "$1,500–$3,000 if applied; $0 otherwise",
  },
  {
    n: 4,
    name: "Eval",
    window: "Week 2–3",
    oneLine: "200 synthetic conversations before any real customer sees it.",
    detail:
      "We run 200 synthetic conversations against your agent before it ever sees a real customer. Synthetic personas are generated to cover: easy paths, hard paths, hostile callers, Spanish-speakers, out-of-scope requests, callers with unclear intent. We measure: booking conversion rate, accuracy on your top-50 questions, escalation appropriateness, tone match (graded against your real transcripts using a Claude-as-judge harness). If any threshold fails, we go back to step 1 or 2 — usually the KB needs a missing doc, or a tone-critical edge case needs an explicit handler. Eval is the difference between 'shipped' and 'shipped well.'",
    tools: ["Anthropic Claude (synthetic persona gen)", "Claude-as-judge harness", "LangSmith / Braintrust (eval logs)", "Custom rubric per business"],
    time: "5–7 business days",
    cost: "Included in build",
  },
  {
    n: 5,
    name: "Production",
    window: "Week 3+",
    oneLine: "Live on your real number / chat / website. Weekly retraining.",
    detail:
      "Live on your real phone number, chat widget, or website. Every conversation is transcribed and summarized. Weekly transcripts hit your inbox. Monthly retraining cycle on the conversations that needed escalation — those become next month's KB updates, eval cases, and (if applicable) fine-tune examples. The agent gets better every month. This is the difference between a deployed chatbot (decays) and a trained agent (improves).",
    tools: ["Twilio (phone)", "Crisp / Intercom widget (chat)", "Anthropic API (reasoning)", "Datadog / Sentry (observability)", "Modal (cron retraining jobs)"],
    time: "Ongoing",
    cost: "$299–$1,499/mo depending on volume",
  },
];

const CAPABILITIES = [
  { slug: "voice-receptionist", name: "Voice receptionist", line: "24/7 phone coverage that books, qualifies, escalates." },
  { slug: "intelligent-booking-agent", name: "Intelligent booking agent", line: "Calendar-aware. Never double-books. Respects travel time." },
  { slug: "lead-qualification-agent", name: "Lead qualification + routing", line: "60-second triage on every inbound lead." },
  { slug: "objection-handling-system", name: "Objection handling sequences", line: "12 most-common objections, trained on your closed-won calls." },
  { slug: "ops-copilot", name: "SOP automation (ops copilot)", line: "Internal Slack copilot wired to every tool your team uses." },
  { slug: "compliance-rag-agent", name: "Compliance RAG agent", line: "Regulation answers in 4 seconds. With citations." },
];

const PROGRAMS = [
  {
    name: "1-day workshop",
    price: "$2,500",
    seats: "Up to 12 people",
    line: "Half-day live + half-day hands-on. Your team builds their first agent.",
    delivers: ["Live agent build in Anthropic console", "Prompt engineering deep dive", "RAG architecture walkthrough", "Take-home: deployed prototype"],
  },
  {
    name: "4-week cohort",
    price: "$5,000",
    seats: "1-on-1 or small team",
    line: "Weekly 90-min sessions. By week 4 your team has shipped a production agent.",
    delivers: ["4 × 90-min live sessions", "Async Slack support", "Production agent in your stack", "Eval harness for ongoing improvements"],
  },
  {
    name: "In-house enablement",
    price: "$15,000+",
    seats: "Your entire team",
    line: "We come in for 2 weeks, build with your team, leave them production-ready.",
    delivers: ["On-site (or fully remote) embedded", "Custom curriculum for your stack", "2 production agents shipped together", "90-day async retainer included"],
  },
];

const FAQS = [
  {
    q: "How is 'training' different from 'prompting' or 'using RAG'?",
    a: "Prompting is what everyone does. RAG is the table-stakes upgrade. Training is the full stack — discovery, KB build, optional fine-tune, formal eval, weekly retraining loop. The output is an agent that improves over time, not a static prompt that decays as your business changes.",
  },
  {
    q: "Do I have to choose a vertical or can you train any agent?",
    a: "Any. We've trained voice agents for HVAC, dental, legal, mortgage, fitness; chat agents for SaaS and e-commerce; internal ops copilots for franchise operations and title research; compliance RAG agents for clinics and brokerages. The method is vertical-agnostic — the work is in the discovery phase.",
  },
  {
    q: "What if I already have a chatbot or off-the-shelf voice AI in production?",
    a: "We migrate. Most clients arrive with something half-working (Goodcall, RingCentral AI receptionist, Drift bot, a GPT-4 wrapper a consultant built). We extract the parts of your KB that exist, fold them into our pipeline, train properly, and cut over. Migration is usually 2 weeks faster than a build-from-scratch.",
  },
  {
    q: "How much does the full training method cost, end to end?",
    a: "Custom builds start at $4,000 for a single tightly-scoped agent (one channel, one workflow). Most production deployments land at $7,500–$15,000 build + $499–$1,499/mo ongoing depending on volume and the complexity of the integrations. Computer-use agents and compliance-grade RAG sit higher ($8,500–$15,000 build). Detailed pricing per cornerstone is on each /capabilities/* page.",
  },
  {
    q: "Can I just hire you to train one specific thing and own the IP?",
    a: "Yes. Default engagement: code lives in your repo (or ours, your call), trained models are yours, KB is yours, every credential is in your accounts. No vendor lock. If you cancel, you keep everything and it keeps running.",
  },
];

export default function Train() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Train Your Agent — the 5-step method",
    serviceType: "AI Agent Training & Development",
    description: "5-step method for training custom AI agents on your business: Discovery, Knowledge Base, Fine-tune, Eval, Production.",
    provider: { "@type": "Organization", name: "TrainYourAgent", url: "https://www.trainyouragent.com" },
    areaServed: "Global",
    url: "https://www.trainyouragent.com/train",
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1F33] font-['Inter_Tight',_system-ui,_sans-serif]">
      <Helmet>
        <title>Train Your Agent — the method. We train AI agents on your business.</title>
        <meta name="description" content="The 5-step method we use to train AI agents on your business — Discovery, Knowledge Base, Fine-tune, Eval, Production. Built right, agents sound like your best employee, not a chatbot." />
        <link rel="canonical" href="https://www.trainyouragent.com/train" />
        <meta property="og:title" content="Train Your Agent — the 5-step training method" />
        <meta property="og:description" content="We train your agent. Then it runs your business. Discovery → KB → Fine-tune → Eval → Production. 21 days." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.trainyouragent.com/train" />
        {/* v76-B: per-page dynamic OG image (PrismNode-branded SVG). */}
        <meta property="og:image" content="https://www.trainyouragent.com/api/og?title=Train+Your+Agent&eyebrow=THE+METHOD&kicker=Discovery+%E2%86%92+KB+%E2%86%92+Fine-tune+%E2%86%92+Eval+%E2%86%92+Production&type=page" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.trainyouragent.com/api/og?title=Train+Your+Agent&eyebrow=THE+METHOD&kicker=Discovery+%E2%86%92+KB+%E2%86%92+Fine-tune+%E2%86%92+Eval+%E2%86%92+Production&type=page" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <SiteNav active="solutions" />

      <main id="main">
        {/* HERO */}
        <section className="relative pt-24 sm:pt-32 pb-20 sm:pb-28 px-5 sm:px-8 overflow-hidden bg-gradient-to-b from-white to-[#F6FAFE]">
          {/* v76-B: home-only visual layer (mesh + particles) removed
              from /train per v73-FINAL spec. */}
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.25fr_1fr] gap-14 items-center relative">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#042C53] text-white text-[11px] font-semibold tracking-[0.18em] uppercase font-mono mb-6">
                The Train-Your-Agent Method
              </div>
              <h1 className="text-[34px] sm:text-[54px] md:text-[68px] lg:text-[78px] leading-[1.04] sm:leading-[1.0] lg:leading-[0.98] tracking-tight font-semibold text-[#042C53] mb-6 h1-balance break-words">
                We <span className="font-serif italic">train</span> your agent.<br />
                Then it runs your business.
              </h1>
              <p className="text-[18px] sm:text-[22px] leading-[1.45] text-slate-700 max-w-2xl mb-9">
                Anyone can wire an LLM to your phone line. We <span className="font-serif italic text-[#042C53]">train it on your business</span> —
                your tone, your offer, your edge cases, your booking flow, your compliance rules —
                so it doesn't sound like a chatbot. It sounds like your best employee.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#method"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#042C53] text-white font-semibold hover:bg-[#0B3A6B]"
                >
                  See how we train agents
                  <span aria-hidden>→</span>
                </a>
                <a
                  href={CAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#042C53]/15 text-[#042C53] hover:bg-white"
                >
                  Book a 30-min call
                </a>
              </div>
              <div className="mt-8 text-[12px] sm:text-[13px] text-slate-500 font-mono">
                21-day median ship · 10 cornerstone playbooks · 569 live URLs
              </div>
            </div>

            {/* v76-E: mobile/tablet compact pipeline (<lg). The desktop SVG below
                was hidden on <1024px so mobile users got NO visual preview of the
                5-step method. This compact horizontal timeline gives them one. */}
            <div className="lg:hidden mt-8">
              <ol className="relative grid grid-cols-5 gap-1 sm:gap-2">
                {STEPS.map((s, i) => (
                  <li key={s.n} className="relative flex flex-col items-center text-center">
                    {/* Connecting line (drawn between dots, not under last one) */}
                    {i < STEPS.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute top-[18px] left-1/2 w-full h-px bg-[#042C53]/15"
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border-2 border-[#042C53] text-[#042C53] text-[13px] font-bold shadow-sm">
                      {s.n}
                    </span>
                    <span className="mt-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.1em] uppercase text-[#185FA5] font-mono leading-tight">
                      {s.window.replace("Week ", "W")}
                    </span>
                    <span className="mt-1 text-[12px] sm:text-[13px] font-semibold text-[#042C53] leading-tight">
                      {s.name}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-center text-[12px] text-slate-500">
                Discovery → Knowledge base → Fine-tune → Eval → Production
              </p>
            </div>

            {/* Vertical 5-step training pipeline SVG (desktop) */}
            <div className="hidden lg:block">
              <svg viewBox="0 0 360 620" className="w-full max-w-[380px] mx-auto" aria-label="5-step training pipeline">
                <defs>
                  <linearGradient id="trainLine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#042C53" stopOpacity="0.15" />
                    <stop offset="1" stopColor="#042C53" stopOpacity="0.6" />
                  </linearGradient>
                  <filter id="trainShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#042C53" floodOpacity="0.12" />
                  </filter>
                </defs>
                {/* Connecting line */}
                <line x1="60" y1="40" x2="60" y2="580" stroke="url(#trainLine)" strokeWidth="2.5" strokeLinecap="round" />
                {STEPS.map((s, i) => {
                  const y = 40 + i * 130;
                  return (
                    <g key={s.n} transform={`translate(0, ${y})`}>
                      <circle cx="60" cy="0" r="22" fill="#FFFFFF" stroke="#042C53" strokeWidth="2.5" filter="url(#trainShadow)" />
                      <text x="60" y="6" textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontSize="17" fontWeight="700" fill="#042C53">{s.n}</text>
                      <g transform="translate(100, -12)">
                        <text fontFamily="Inter Tight, sans-serif" fontSize="9" fontWeight="700" letterSpacing="1.5" fill="#185FA5">{s.window.toUpperCase()}</text>
                        <text y="20" fontFamily="Inter Tight, sans-serif" fontSize="20" fontWeight="600" fill="#042C53">{s.name}</text>
                        <text y="40" fontFamily="Inter Tight, sans-serif" fontSize="11.5" fill="#475569">
                          <tspan x="0">{s.oneLine}</tspan>
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </section>

        {/* METHOD — 5 steps in detail */}
        <section id="method" className="px-5 sm:px-8 py-20 sm:py-28 bg-white border-y border-slate-200/70">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] font-mono mb-3">
                The method
              </div>
              <h2 className="text-[32px] sm:text-[48px] leading-tight font-semibold text-[#042C53]">
                Five steps. <span className="font-serif italic">Three weeks.</span> Real tools, real costs.
              </h2>
            </div>

            <div className="space-y-10">
              {STEPS.map((s) => (
                <article key={s.n} className="grid md:grid-cols-[80px_1fr] gap-6 md:gap-8 items-start">
                  <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#042C53] text-white text-[22px] font-bold shrink-0">
                      {s.n}
                    </div>
                    <div className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] font-mono">
                      {s.window}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
                    <h3 className="text-[22px] sm:text-[26px] font-semibold text-[#042C53] mb-1">
                      {s.name} — <span className="font-serif italic text-slate-700 text-[18px] sm:text-[20px]">{s.oneLine}</span>
                    </h3>
                    <p className="text-[15px] sm:text-[16px] leading-[1.65] text-slate-700 mt-3">
                      {s.detail}
                    </p>
                    <div className="mt-5 grid sm:grid-cols-3 gap-3 text-[13px]">
                      <div>
                        <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500 mb-1 font-mono">Tools</div>
                        <div className="text-slate-700">{s.tools.join(" · ")}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500 mb-1 font-mono">Time</div>
                        <div className="text-slate-700">{s.time}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500 mb-1 font-mono">Cost</div>
                        <div className="text-slate-700">{s.cost}</div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* v76-c: INTAKE CTA — slot between the 5-step method and the capability cards */}
        <section className="px-5 sm:px-8 py-14 sm:py-16 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-3xl border border-[#185FA5]/25 bg-gradient-to-br from-[#E6F1FB]/70 to-white p-7 sm:p-10 shadow-sm">
              <div className="grid sm:grid-cols-3 gap-6 items-center">
                <div className="sm:col-span-2">
                  <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#185FA5] font-mono mb-2">
                    Step 1 — Discovery
                  </div>
                  <h3 className="text-[24px] sm:text-[30px] font-semibold text-[#042C53] leading-snug">
                    Ready to start? <span className="font-serif italic">Fill the 8-minute intake.</span>
                  </h3>
                  <p className="mt-3 text-[15px] text-slate-700 leading-relaxed">
                    Tell us about your business — industry, call volume, top questions, your offer. We respond within 24 hours with a discovery-call invite. No waitlist, no qualification call before the call.
                  </p>
                </div>
                <div className="flex sm:justify-end">
                  <Link
                    to="/train/intake"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#042C53] text-white text-[15px] font-semibold hover:bg-[#0A3D6E] whitespace-nowrap"
                  >
                    Start your intake →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CAPABILITIES — what you can train an agent to do */}
        <section className="px-5 sm:px-8 py-20 sm:py-24 bg-[#F6FAFE]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] font-mono mb-3">
                What you can train an agent to do
              </div>
              <h2 className="text-[30px] sm:text-[42px] leading-tight font-semibold text-[#042C53]">
                Ten cornerstone playbooks. <span className="font-serif italic">All productionized.</span>
              </h2>
              <p className="text-[15px] sm:text-[16px] text-slate-700 max-w-2xl mx-auto mt-3">
                These are the agents we ship most often. Each has its own playbook with real tools, real ROI math, real time-to-live.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CAPABILITIES.map((c) => (
                <Link
                  key={c.slug}
                  to={`/capabilities/${c.slug}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#042C53]/30 hover:shadow-sm transition group"
                >
                  <div className="text-[17px] font-semibold text-[#042C53] group-hover:text-[#185FA5] mb-2">
                    {c.name}
                  </div>
                  <p className="text-[14px] text-slate-600 leading-snug mb-4">{c.line}</p>
                  <div className="text-[12px] text-[#185FA5] font-semibold inline-flex items-center gap-1">
                    See the playbook
                    <span aria-hidden>→</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/everything-ai"
                className="inline-flex items-center gap-2 text-[#042C53] hover:text-[#185FA5] text-[16px]"
              >
                See all 10 cornerstones + the full category map
                <span aria-hidden className="text-[#185FA5]">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* TRAINING PROGRAMS — for clients who want to learn */}
        <section className="px-5 sm:px-8 py-20 sm:py-24 bg-white border-y border-slate-200/70">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] font-mono mb-3">
                Training programs for your team
              </div>
              <h2 className="text-[30px] sm:text-[42px] leading-tight font-semibold text-[#042C53]">
                Want to <span className="font-serif italic">train your own team</span> instead?
              </h2>
              <p className="text-[15px] sm:text-[16px] text-slate-700 max-w-2xl mx-auto mt-3">
                Three formats. From a 1-day workshop to a 2-week embedded engagement that leaves your team production-ready.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {PROGRAMS.map((p) => (
                <div key={p.name} className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col">
                  <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] font-mono mb-2">{p.seats}</div>
                  <div className="text-[22px] font-semibold text-[#042C53] mb-1">{p.name}</div>
                  <div className="text-[26px] font-semibold text-[#042C53] mb-4">
                    <span className="font-serif italic">{p.price}</span>
                  </div>
                  <p className="text-[14px] text-slate-700 leading-snug mb-5">{p.line}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {p.delivers.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13.5px] text-slate-700">
                        <span aria-hidden className="mt-0.5 inline-flex w-4 h-4 items-center justify-center rounded-full bg-[#22A36C] text-white text-[10px] font-bold shrink-0">✓</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={CAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0B3A6B]"
                  >
                    Talk about this program →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SUMMARY */}
        <section className="px-5 sm:px-8 py-20 sm:py-24 bg-[#042C53] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#A8C7E8] font-mono mb-3">
              Pricing
            </div>
            <h2 className="text-[32px] sm:text-[48px] leading-tight font-semibold mb-6">
              Custom training builds start at <span className="font-serif italic">$4,000</span>.<br />
              Ongoing operations <span className="font-serif italic">$499/mo</span>.
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#DCEBFA] max-w-2xl mx-auto mb-9">
              Most agents pay for themselves in under 30 days.
              Every build comes with a 30-day money-back guarantee.
            </p>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#042C53] font-semibold hover:bg-[#DCEBFA]"
            >
              Book a 30-min call with the operator
              <span aria-hidden>→</span>
            </a>
          </div>
        </section>

        {/* FAQS */}
        <section className="px-5 sm:px-8 py-20 sm:py-24 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] font-mono mb-3 text-center">
              FAQ
            </div>
            <h2 className="text-[30px] sm:text-[42px] leading-tight font-semibold text-[#042C53] mb-10 text-center">
              What people ask
            </h2>
            <div className="space-y-3">
              {FAQS.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-slate-200 bg-white p-5 open:shadow-sm"
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-3 font-semibold text-[16px] text-[#042C53]">
                    <span>{f.q}</span>
                    <span className="text-[#185FA5] group-open:rotate-45 transition-transform shrink-0" aria-hidden>+</span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-[1.65] text-slate-700">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="px-5 sm:px-8 py-16 sm:py-20 bg-[#F6FAFE] border-t border-slate-200/70">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-5">
              Ready to <span className="font-serif italic">train your agent</span>?
            </h2>
            <p className="text-[15px] sm:text-[16px] text-slate-700 mb-7">
              30-minute call. We scope the agent, the training data, the timeline, and the budget. No deck. No SDR.
            </p>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#042C53] text-white font-semibold hover:bg-[#0B3A6B]"
            >
              Book the call
              <span aria-hidden>→</span>
            </a>
          </div>
        </section>
      </main>

      <FooterV44 />
    </div>
  );
}
