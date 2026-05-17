import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";
const HERO_PHONE_DISPLAY = "Book a 15-min Zoom";
const HERO_PHONE_TEL = "https://cal.com/trainyouragent/30min";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, color: "#042C53" }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
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

const LAYERS = [
  {
    label: "Telephony",
    components: ["Twilio Programmable Voice", "Twilio SMS", "SIP trunk fallback"],
    body: "Calls arrive through Twilio's PCI-DSS Level 1 and HIPAA-eligible network. We forward your existing business number, you keep your area code, callers see no change.",
  },
  {
    label: "Speech",
    components: ["Deepgram (transcription)", "ElevenLabs (synthesis)", "Cartesia (alt synthesis)", "Whisper (fallback)"],
    body: "Real-time transcription under 200ms. Voice cloned from a 10-minute sample if you want a specific voice. Prosody tuned per vertical — a doctor's intake doesn't sound like a nightclub reservation.",
  },
  {
    label: "Reasoning",
    components: ["Claude (primary)", "GPT-4 (fallback)", "Gemini, Llama, Mistral (specialized)"],
    body: "Claude handles the core conversation. GPT-4 takes over if Claude is down. For specific tasks (long-context retrieval, code-grade reasoning) we route to whatever model wins that benchmark today.",
  },
  {
    label: "Knowledge",
    components: ["Vector store (per-tenant)", "Structured retrieval", "Live CRM lookups"],
    body: "Your agent answers from YOUR docs, scripts, pricing, ticket history. Not the open internet. Customer history is pulled live during the call, not pre-loaded.",
  },
  {
    label: "Tools",
    components: ["Cal.com / calendars", "ServiceTitan / dispatch", "HubSpot / Salesforce", "Stripe", "Zapier / Make / n8n"],
    body: "The agent doesn't just talk. It books appointments, creates tickets, sends invoices, escalates to humans. Every tool call is logged and reversible.",
  },
  {
    label: "Safety",
    components: ["Deterministic fallback", "Human-in-the-loop", "PII redaction", "Audit log"],
    body: "If both Claude and GPT-4 fail, the agent falls back to a deterministic script that handles the most common 80% of calls and texts a human for the rest. Nothing drops to a busy signal.",
  },
];

const PRINCIPLES = [
  { h: "Multi-model by design", b: "We don't bet on one provider. If Anthropic, OpenAI, or Google has an outage, your agent stays up." },
  { h: "Zero data training",     b: "Every LLM call uses the zero-retention endpoint. Your data trains nothing — ours or theirs." },
  { h: "Latency first",          b: "Target first-response under 500ms. We measure and tune weekly. Callers don't feel they're waiting." },
  { h: "Production over demos",  b: "Anyone can build a demo. We build the version that handles a Saturday-morning surge and the version that escalates the one weird call to your on-call human." },
  { h: "Yours, not ours",        b: "You own your training data, your agent config, your call history. On termination we export everything to you and delete our copy within 30 days." },
  { h: "Observability built-in", b: "Every call has a transcript, an audit log, a cost breakdown, and a quality score. No black boxes." },
];

const METRICS = [
  { n: "<500ms", l: "First-response latency target" },
  { n: "99.9%",  l: "Telephony uptime SLA on Operators+" },
  { n: "0",      l: "Bytes of your data used for training" },
  { n: "30 days",l: "Default audio retention (configurable to 0)" },
];

const Technology = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Technology — TrainYourAgent";
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setMeta("description", "How TrainYourAgent's voice agents actually work — multi-model routing, sub-500ms latency, production-grade telephony, zero data training. Built for security reviews.");
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      {/* NAV — canonical service nav */}
      <SiteNav />

      <section className="pt-32 pb-16 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Technology</div>
          <h1 className="text-[44px] sm:text-[72px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            How the agent <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>actually works.</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">
            No magic, no jargon, no "AI-powered" hand-waving. Below is the real architecture — every layer, every vendor, every fallback — written for engineers who'll actually have to live with it.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-16">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {METRICS.map((m, i) => (
            <div key={i} className="rounded-2xl bg-[#F6FAFE] border border-slate-200/70 p-6">
              <div className="text-[40px] font-semibold tracking-tight text-[#042C53] leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>{m.n}</div>
              <div className="mt-3 text-[13px] text-slate-600 leading-snug">{m.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Architecture</div>
          <h2 className="text-[32px] sm:text-[48px] leading-tight font-semibold text-[#042C53] mb-12">
            Six layers. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>One agent.</span>
          </h2>
          <div className="space-y-4">
            {LAYERS.map((l, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 grid md:grid-cols-[200px_1fr] gap-6 hover:border-[#185FA5] transition">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">Layer {String(i + 1).padStart(2, "0")}</div>
                  <div className="text-[22px] font-semibold text-[#042C53]">{l.label}</div>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {l.components.map((c, j) => (
                      <span key={j} className="px-3 py-1 rounded-full bg-[#E6F1FB] text-[#042C53] text-[12px] font-medium">{c}</span>
                    ))}
                  </div>
                  <div className="text-[15px] text-slate-700 leading-relaxed">{l.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Principles</div>
          <h2 className="text-[32px] sm:text-[48px] leading-tight font-semibold text-[#042C53] mb-10">
            How we make architectural calls — <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>and what we refuse to do.</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#185FA5] hover:shadow-[0_4px_24px_-10px_rgba(4,44,83,0.18)] transition">
                <div className="text-[17px] font-semibold text-[#042C53] mb-2">{p.h}</div>
                <div className="text-[14px] text-slate-600 leading-relaxed">{p.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Where it runs</div>
            <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-5">
              AWS us-east-1, multi-AZ. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>EU region on request.</span>
            </h2>
            <p className="text-[15px] text-slate-700 leading-relaxed">
              Customer audio and transcripts are encrypted at rest with AES-256 and in transit with TLS 1.2+. Keys are managed by AWS KMS, rotated automatically. No data leaves North America unless you explicitly enable it.
            </p>
            <Link to="/security" className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-[#185FA5] hover:text-[#042C53]">
              Full security posture <span>→</span>
            </Link>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-6">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Subprocessors</div>
            <div className="text-[14px] text-slate-700 leading-relaxed space-y-2">
              <div><span className="font-semibold text-[#042C53]">Infra:</span> AWS, Vercel, Supabase</div>
              <div><span className="font-semibold text-[#042C53]">Telephony:</span> Twilio</div>
              <div><span className="font-semibold text-[#042C53]">LLM:</span> Anthropic, OpenAI, Google, Meta, Mistral</div>
              <div><span className="font-semibold text-[#042C53]">Speech:</span> Deepgram, ElevenLabs, Cartesia, OpenAI Whisper</div>
              <div><span className="font-semibold text-[#042C53]">Ops:</span> Stripe, Vanta, PagerDuty</div>
            </div>
            <div className="mt-5 pt-5 border-t border-slate-100 text-[12px] text-slate-500">Each signs a DPA with us. Reviewed annually. List updated when a vendor changes.</div>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-[36px] sm:text-[56px] leading-[1.04] tracking-tight font-semibold">
            Want our architecture deck <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>for your security review?</span>
          </h2>
          <p className="mt-5 text-[17px] text-white/85 max-w-2xl mx-auto leading-relaxed">
            Send it to your CISO before the call. We'll have the answers ready when you join.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:security@trainyouragent.com" className="px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg">Request the security pack →</a>
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15">Book a build call</a>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#042C53]">Terms</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default Technology;
