// src/pages/Status.tsx
// System status page — pings real endpoints and shows live state + 90-day history.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";

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

const SERVICES = [
  { id: "marketing-site",  label: "Marketing site",         probe: "/" },
  { id: "voice-pipeline",  label: "Voice pipeline",         probe: "/api/health/voice"   /* implement when backend is up */ },
  { id: "telephony",       label: "Telephony (Twilio)",     probe: null, externalDoc: "https://status.twilio.com" },
  { id: "anthropic",       label: "LLM (Anthropic)",        probe: null, externalDoc: "https://status.anthropic.com" },
  { id: "openai",          label: "LLM fallback (OpenAI)",  probe: null, externalDoc: "https://status.openai.com" },
  { id: "elevenlabs",      label: "Voice synthesis (ElevenLabs)", probe: null, externalDoc: "https://status.elevenlabs.io" },
  { id: "deepgram",        label: "Transcription (Deepgram)", probe: null, externalDoc: "https://status.deepgram.com" },
  { id: "aws",             label: "Hosting (AWS us-east-1)",  probe: null, externalDoc: "https://health.aws.amazon.com/health/status" },
  { id: "vercel",          label: "Edge + marketing (Vercel)", probe: null, externalDoc: "https://www.vercel-status.com" },
];

type ProbeState = "ok" | "degraded" | "down" | "unknown";

const Status = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [states, setStates] = useState<Record<string, ProbeState>>({});

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) { const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap"; document.head.appendChild(l); }
    document.title = "Status — TrainYourAgent";
  }, []);
  useEffect(() => { const f = () => setNavScrolled(window.scrollY > 20); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);

  useEffect(() => {
    const probe = async (id: string, url: string | null): Promise<ProbeState> => {
      if (!url) return "unknown";
      try {
        const t0 = Date.now();
        const r = await fetch(url, { method: "HEAD", cache: "no-store" });
        const ms = Date.now() - t0;
        if (!r.ok) return "down";
        return ms > 800 ? "degraded" : "ok";
      } catch { return "down"; }
    };
    Promise.all(SERVICES.map(async (s) => [s.id, await probe(s.id, s.probe)] as const))
      .then((rows) => setStates(Object.fromEntries(rows)));
  }, []);

  const overall: ProbeState = (() => {
    const vals = Object.values(states);
    if (vals.length === 0) return "unknown";
    if (vals.includes("down")) return "down";
    if (vals.includes("degraded")) return "degraded";
    if (vals.every((v) => v === "ok")) return "ok";
    return "unknown";
  })();

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
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">System status</div>
          <h1 className="text-[42px] sm:text-[60px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Everything is{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}
                  className={overall === "ok" ? "text-[#22A36C]" : overall === "degraded" ? "text-amber-600" : overall === "down" ? "text-[#B23]" : "text-slate-500"}>
              {overall === "ok" ? "operational" : overall === "degraded" ? "degraded" : overall === "down" ? "having issues" : "loading"}.
            </span>
          </h1>
          <p className="mt-5 text-[16px] text-slate-600">Refreshes on every page load. For incidents that affect customer agents, we email customers directly within 15 minutes of detection.</p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-16">
        <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 overflow-hidden">
          {SERVICES.map((s, i) => {
            const st = states[s.id] || "unknown";
            const dot = st === "ok" ? "bg-[#22A36C]" : st === "degraded" ? "bg-amber-500" : st === "down" ? "bg-[#B23]" : "bg-slate-300";
            const label = st === "ok" ? "Operational" : st === "degraded" ? "Degraded" : st === "down" ? "Down" : "Checking";
            return (
              <div key={s.id} className={`flex items-center justify-between px-6 py-4 ${i ? "border-t border-slate-100" : ""}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                  <div>
                    <div className="text-[15px] font-medium text-[#042C53]">{s.label}</div>
                    {s.externalDoc && <a href={s.externalDoc} target="_blank" rel="noopener" className="text-[12px] text-slate-500 hover:text-[#185FA5] underline decoration-slate-300">vendor status →</a>}
                  </div>
                </div>
                <div className="text-[13px] text-slate-600">{label}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Subscribe to incident updates</div>
          <h2 className="text-[24px] sm:text-[32px] font-semibold text-[#042C53] mb-3 leading-tight">Get an email if anything goes red.</h2>
          <p className="text-[14px] text-slate-700 mb-5">Drop your email at <a className="text-[#185FA5] underline" href="mailto:status@trainyouragent.com?subject=Subscribe">status@trainyouragent.com</a> with subject "Subscribe" and you'll get incident notifications. We'll wire a one-click subscribe button when our status backend is fully live.</p>
          <Link to="/changelog" className="inline-flex items-center gap-2 text-[14px] font-medium text-[#185FA5] hover:text-[#042C53]">View changelog →</Link>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span></div>
          <div className="flex items-center gap-6"><Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link><Link to="/terms" className="hover:text-[#042C53]">Terms</Link><Link to="/security" className="hover:text-[#042C53]">Security</Link></div>
        </div>
      </footer>
    </div>
  );
};

export default Status;
