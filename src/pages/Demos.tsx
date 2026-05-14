import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ElevenlabsWidget from "@/components/ElevenlabsWidget";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";
const HERO_PHONE_DISPLAY = "(813) 555-0142";
const HERO_PHONE_TEL = "+18135550142";

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

const DEMOS = [
  { vertical: "HVAC", scenario: "After-hours emergency dispatch booking", outcome: "Books $189 trip fee, dispatches nearest tech, confirms via SMS." },
  { vertical: "Healthcare", scenario: "New patient intake with insurance verification", outcome: "Verifies insurance, gathers history, books appointment, sends intake forms." },
  { vertical: "Real Estate", scenario: "Zillow lead callback in <30 seconds", outcome: "Qualifies buyer/seller intent, pre-approval status, books showing." },
  { vertical: "Legal", scenario: "Intake with automatic conflict check", outcome: "Asks the right qualifying questions, runs conflict check, routes to attorney." },
  { vertical: "Solar", scenario: "Meta ad lead callback and qualification", outcome: "Verifies utility, monthly bill, roof orientation. Books site survey." },
  { vertical: "Accounting", scenario: "Tax-season intake at 11pm Sunday", outcome: "Classifies client type, sends document checklist, books intake call." },
];

const Demos = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) { const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap"; document.head.appendChild(l); }
    document.title = "Demos — TrainYourAgent";
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
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Demos</div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Hear an agent run. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Live, on the phone.</span>
          </h1>
          <p className="mt-6 text-[18px] text-slate-700 max-w-3xl leading-relaxed">
            We don't ship pre-recorded videos. Call the number below — you'll talk to a real agent running a real scenario. Or pick a scenario and we'll build a custom demo for your use case in 48 hours.
          </p>
          <div className="mt-7 flex items-center gap-3 text-[16px] text-slate-700">
            <span className="w-2 h-2 rounded-full bg-[#22A36C] animate-pulse" />
            <span>Call our live demo agent:</span>
            <a href={`tel:${HERO_PHONE_TEL}`} className="text-[#042C53] font-semibold underline">{HERO_PHONE_DISPLAY}</a>
          </div>
        </div>
      </section>

      {/* Live ElevenLabs widget — talk to an agent right in the page */}
      <section className="px-5 sm:px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <ElevenlabsWidget variant="inline" />
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Scenarios we'll build for you</div>
          <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-8">
            Pick one and we'll <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>demo it on your call.</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEMOS.map((d, i) => (
              <Link key={i} to="/demo-request" className="group rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#185FA5] hover:shadow-[0_4px_24px_-10px_rgba(4,44,83,0.18)] transition">
                <div className="text-[12px] uppercase tracking-[0.12em] text-[#185FA5] font-semibold mb-2">{d.vertical}</div>
                <div className="text-[16px] font-semibold text-[#042C53] mb-2">{d.scenario}</div>
                <div className="text-[13px] text-slate-600 leading-relaxed mb-4">{d.outcome}</div>
                <div className="text-[13px] text-[#185FA5] font-medium inline-flex items-center gap-1.5">Request this demo <span className="transition-transform group-hover:translate-x-0.5">→</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[32px] sm:text-[48px] leading-[1.04] tracking-tight font-semibold">
            Skip the demo, <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>build the real thing.</span>
          </h2>
          <p className="mt-5 text-[16px] text-white/85 max-w-2xl mx-auto leading-relaxed">Thirty-minute build call. We scope, you decide, we ship in days.</p>
          <a href={CAL_URL} target="_blank" rel="noopener" className="mt-7 inline-block px-7 py-3.5 rounded-full bg-white text-[#042C53] font-semibold text-[14px] hover:bg-slate-100 shadow">Book a build call →</a>
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

export default Demos;
