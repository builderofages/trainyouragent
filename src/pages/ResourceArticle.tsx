import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="#E6F1FB" />
        <g fill="#0C447C"><circle cx="20" cy="27" r="7.5" /><circle cx="32" cy="21" r="8.5" /><circle cx="44" cy="27" r="7.5" /><circle cx="24" cy="40" r="7" /><circle cx="40" cy="40" r="7" /><rect x="29" y="44" width="6" height="11" rx="1.5" /></g>
        <circle cx="32" cy="32" r="30" fill="none" stroke="#185FA5" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

type Article = { title: string; topic: string; date: string; body: string[]; };

const ARTICLES: Record<string, Article> = {
  "what-to-look-for-in-a-voice-agent": {
    title: "What to look for in a voice-agent vendor (and what to refuse to pay for).",
    topic: "Buyer's guide",
    date: "May 2026",
    body: [
      "Most voice-agent pitches sound the same. A demo of a GPT wrapper that answers a soft-ball question. A slide with logos of LLMs you've already heard of. A price you can't quite predict.",
      "Here's the buyer's-side framework I'd use to pick a vendor — written from inside the build, not from a marketing brief.",
      "Refuse to pay for: prompt-only deployments (no real training on your business), per-seat dashboards (you don't need seats, you need calls handled), AI-grade markup on what's actually a thin wrapper, and any vendor that won't let you export your data and config on cancel day.",
      "Pay for: live retrieval against YOUR customer history during the call, native integrations into the tools you already use (not Zapier glue), weekly tuning by someone who can actually edit the agent's behavior, latency targets that beat your best receptionist, and a deterministic fallback for when LLMs are down.",
      "The biggest tell is the demo itself. Anyone can build a five-minute demo. The vendor you want is one who'll let you call their production line right now — not the curated demo line — and hear an agent handle a Saturday-morning surge.",
    ],
  },
  "ai-voice-economics-2026": {
    title: "AI voice economics in 2026 — cost per call, cost per booking, what's real.",
    topic: "Numbers",
    date: "May 2026",
    body: [
      "Per-minute on the major TTS engines runs $0.08–0.15 right now. STT under $0.02. LLM inference $0.01–0.05 per call for typical context. Telephony $0.0085/min. Add hosting and overhead — your raw cost per 4-minute call is somewhere between $0.50 and $1.20.",
      "We charge $0.18/min answered on the Operators plan, which works out to a gross margin around 60–70% on the average call. That margin pays for the engineering work that makes the agent actually work for your business: training, integrations, tuning.",
      "Cost per booked appointment is a better metric than cost per call. On a typical SMB voice flow, conversion from call-to-booking is 30–55% depending on industry. So a $0.72 call becomes a $1.40–2.40 effective cost per booking — vs. a human receptionist at $15–30/hr who handles roughly 4–6 calls per hour.",
      "The leverage is in the long-tail: the 2am call you'd otherwise miss, the storm-surge week your line melts, the Sunday-afternoon Zillow lead that'd ghost by Monday. Those are pure additions to your top line.",
    ],
  },
  "hvac-after-hours-playbook": {
    title: "The HVAC after-hours playbook — turning night calls into morning revenue.",
    topic: "Playbook",
    date: "May 2026",
    body: [
      "After-hours is the highest-value time slot for HVAC because the caller is committed. They're not shopping. They're hot. The agent's job is to qualify, price, and book — not sell.",
      "Three questions: Is it emergency or routine? Are they a current customer? Where are they located?",
      "Emergency + current customer + in-territory = dispatch tonight, trip fee applied to repair. The agent should commit to a 90-minute window and SMS the tech ETA.",
      "Routine + new customer + in-territory = book the next available slot, send the new-customer onboarding via SMS, no urgency markup.",
      "Out-of-territory = polite handoff, send a referral. Don't lose the goodwill.",
      "The 80/20 of the after-hours script is: greet, classify, pricing, book. Everything else is overflow. The agent escalates to the on-call human only when the caller mentions specific keywords (gas leak, water leak, no heat in <32°F, no AC in >90°F if a senior is in the home).",
    ],
  },
  "hipaa-voice-agents-plain-english": {
    title: "HIPAA and voice agents in plain English.",
    topic: "Compliance",
    date: "May 2026",
    body: [
      "HIPAA splits the world into Covered Entities (clinics, hospitals, doctors' offices) and Business Associates (everyone who handles PHI on their behalf). We are a Business Associate. We sign a BAA with every healthcare customer before any PHI flows through our system.",
      "What that means in practice: encrypted audio at rest and in transit, access logs on every byte of PHI, retention policies you control (we can default to zero retention if your compliance officer wants), and a documented chain of subprocessor BAAs (Twilio, AWS, every LLM provider we touch).",
      "What 'HIPAA-compliant' does NOT mean: a magic certification handed down by HHS. There is no HIPAA-compliant badge. There are practices and contracts that demonstrate compliance. Anyone claiming a badge is selling theater.",
      "Practical advice for healthcare buyers: get the BAA template before the build call. Read it. Have your compliance officer read it. Verify the subprocessor list. Confirm where data lives. Confirm retention and deletion timelines. Then build.",
    ],
  },
  "model-routing-anthropic-vs-openai": {
    title: "Model routing: when to use Claude, GPT-4, Gemini — and when to fall back.",
    topic: "Engineering",
    date: "May 2026",
    body: [
      "We don't bet on a single LLM. Every agent has a routing config that picks the right model per call type and falls back when one is down.",
      "Default primary: Claude. Best instruction-following, lowest hallucination rate on customer-history retrieval, the model we trust to handle the open-ended conversational steering most calls require.",
      "Fallback: GPT-4. Same context window we need, near-comparable quality, different provider — so an Anthropic outage doesn't take you down.",
      "Specialty routes: Gemini for ultra-long-context calls (legal intake with hours of doc history). Llama or Mistral on dedicated infrastructure when latency budgets get tight. Whisper as STT fallback when Deepgram is having a bad afternoon.",
      "Last fallback: a deterministic, hand-written script that handles the most common 80% of calls. If both LLM primaries are down, the agent doesn't fail to a busy signal — it falls through to the script and SMS-escalates the rest to your on-call.",
      "The architectural rule: every customer is one provider outage away from a bad day if you're single-sourced. Multi-model is table stakes in 2026, not a feature.",
    ],
  },
  "founder-loom-day-in-the-life": {
    title: "A day in the life of a TrainYourAgent build — from kickoff Monday to live Friday.",
    topic: "Founder",
    date: "May 2026",
    body: [
      "Monday morning: kickoff call. We pull your existing call recordings (or set up a forward to capture them for a week). We get your scripts, your pricing, your top-50 FAQ. We walk through your dispatch tool, your CRM, your calendar.",
      "Monday afternoon through Wednesday: build. Agent trained on your data. Voice tuned to your brand. Integrations wired into your stack. Internal stress test against the worst calls we found in your recording sample.",
      "Thursday: dry run. We point a test number at the agent and put 50 real-world simulated calls through it — angry callers, edge cases, multi-step bookings, weird industry-specific scenarios. We tune.",
      "Friday: cutover. Your forwarded line points at the agent. We're on Slack with you all day. By 5pm Friday the agent has handled real calls without escalation needed for the routine ones, and the escalations on edge cases reached your humans on policy.",
      "Week two onward: weekly review. Sampled calls, quality scores, tuning. The agent gets better every week it's live.",
    ],
  },
};

const ResourceArticle = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const [navScrolled, setNavScrolled] = useState(false);
  const article = ARTICLES[slug];

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) { const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap"; document.head.appendChild(l); }
    document.title = article ? `${article.title} — TrainYourAgent` : "Resource — TrainYourAgent";
  }, [article]);
  useEffect(() => { const f = () => setNavScrolled(window.scrollY > 20); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5">
        <div className="text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">404</div>
          <h1 className="text-[36px] font-semibold text-[#042C53] mb-4">Article not found.</h1>
          <Link to="/resources" className="text-[#185FA5] underline">Back to Resources →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5"><BrainLogo size={36} /><span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span></Link>
          <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] shadow-sm">Book a call</a>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-5 sm:px-8 pt-32 pb-20">
        <Link to="/resources" className="text-[13px] text-[#185FA5] hover:text-[#042C53] underline">← All resources</Link>
        <div className="mt-6 text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold">{article.topic} · {article.date}</div>
        <h1 className="mt-3 text-[36px] sm:text-[52px] leading-[1.08] tracking-tight font-semibold text-[#042C53]">{article.title}</h1>
        <div className="mt-8 text-[17px] text-slate-700 leading-[1.8] space-y-5">
          {article.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mt-12 pt-10 border-t border-slate-200">
          <div className="rounded-2xl bg-[#F6FAFE] border border-slate-200 p-7 sm:p-8">
            <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Want this applied to your business?</div>
            <h3 className="text-[22px] font-semibold text-[#042C53] mb-3">Book a 30-minute build call and we'll scope it live.</h3>
            <a href={CAL_URL} target="_blank" rel="noopener" className="inline-block px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] shadow">Book a build call →</a>
          </div>
        </div>
      </article>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span></div>
          <div className="flex items-center gap-6"><Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link><Link to="/terms" className="hover:text-[#042C53]">Terms</Link><Link to="/security" className="hover:text-[#042C53]">Security</Link><a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a></div>
        </div>
      </footer>
    </div>
  );
};

export default ResourceArticle;
