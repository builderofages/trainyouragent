import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";

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

export const RESOURCES = [
  { slug: "what-to-look-for-in-a-voice-agent", title: "What to look for in a voice-agent vendor (and what to refuse to pay for).", excerpt: "A buyer's checklist written by the people who get pitched the bad version every week.", topic: "Buyer's guide" },
  { slug: "ai-voice-economics-2026",            title: "AI voice economics in 2026 — cost per call, cost per booking, what's real.",                 excerpt: "Real numbers on TTS, STT, LLM inference, telephony, and what it actually takes per call.",     topic: "Numbers" },
  { slug: "hvac-after-hours-playbook",          title: "The HVAC after-hours playbook — turning night calls into morning revenue.",                  excerpt: "What goes in the script, what stays out, and how to price emergency vs routine.",            topic: "Playbook" },
  { slug: "hipaa-voice-agents-plain-english",   title: "HIPAA and voice agents in plain English.",                                                    excerpt: "BAAs, Covered Entity vs Business Associate, what 'HIPAA-compliant' actually means in voice AI.", topic: "Compliance" },
  { slug: "model-routing-anthropic-vs-openai",  title: "Model routing: when to use Claude, GPT-4, Gemini — and when to fall back.",                  excerpt: "We use them all. Here's the actual logic for which model handles which call type.",          topic: "Engineering" },
  { slug: "founder-loom-day-in-the-life",       title: "A day in the life of a TrainYourAgent build — from kickoff Monday to live Friday.",         excerpt: "What actually happens in those seven business days. Not a sales pitch.",                     topic: "Founder" },
];

const Resources = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) { const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap"; document.head.appendChild(l); }
    document.title = "Resources — TrainYourAgent";
  }, []);
  useEffect(() => { const f = () => setNavScrolled(window.scrollY > 20); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5"><BrainLogo size={36} /><span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span></Link>
          <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] shadow-sm">Book a call</a>
        </div>
      </nav>

      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Resources</div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Real builds, real numbers, <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>zero thought-leadership.</span>
          </h1>
          <p className="mt-6 text-[17px] text-slate-700 max-w-2xl leading-relaxed">
            Buyer's guides, playbooks, and engineering write-ups from inside the work. New posts as we ship — same cadence as the builds themselves.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
          {RESOURCES.map((r, i) => (
            <Link key={i} to={`/resources/${r.slug}`} className="group rounded-2xl bg-white border border-slate-200 p-7 hover:border-[#185FA5] hover:shadow-[0_4px_24px_-10px_rgba(4,44,83,0.18)] transition flex flex-col">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-3">{r.topic}</div>
              <div className="text-[19px] font-semibold text-[#042C53] mb-3 leading-tight">{r.title}</div>
              <div className="text-[14px] text-slate-700 leading-relaxed mb-5">{r.excerpt}</div>
              <div className="mt-auto text-[13px] text-[#185FA5] font-medium inline-flex items-center gap-1.5">Read <span className="transition-transform group-hover:translate-x-0.5">→</span></div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span><span className="text-slate-400">— Tampa Bay, FL</span></div>
          <div className="flex items-center gap-6"><Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link><Link to="/terms" className="hover:text-[#042C53]">Terms</Link><Link to="/security" className="hover:text-[#042C53]">Security</Link><a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a></div>
        </div>
      </footer>
    </div>
  );
};

export default Resources;
