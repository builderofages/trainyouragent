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

const Team = () => {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Team — TrainYourAgent";
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Team</div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Lean by design. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>The builder you hire is the builder who ships.</span>
          </h1>
          <p className="mt-6 text-[17px] text-slate-700 max-w-2xl leading-relaxed">
            No sales engineers handing you off to delivery. No account-management theater. The person who scopes your agent is the person who builds it. The person who builds it is the person who tunes it weekly.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#F6FAFE] border border-slate-200 p-8 sm:p-10 grid md:grid-cols-[200px_1fr] gap-8 items-start">
          <div className="flex flex-col gap-3">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#E6F1FB] to-[#DCEBFA] border border-slate-200 flex items-center justify-center">
              <BrainLogo size={120} />
            </div>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="text-[13px] text-[#042C53] underline decoration-[#185FA5]/40 hover:decoration-[#185FA5]">LinkedIn →</a>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1">Founder</div>
            <div className="text-[28px] font-semibold text-[#042C53]">Alexander Mills</div>
            <div className="text-[14px] text-slate-600 mb-5">Tampa Bay, FL · 4 years deep in AI · 300+ builds shipped</div>
            <div className="text-[15px] text-slate-700 leading-[1.75] space-y-3">
              <p>Started building at fifteen — operations to industrial welding to robotic engineering to running a trading community to LA SMMA work with celebrities to founding EndCreations in gaming infrastructure.</p>
              <p>Now: TrainYourAgent and a portfolio of ventures running in parallel — Telegram clients with CNNCT, content engines, token launches, gamified products. Same operating philosophy across all of them: ship the thing, watch what works, double down.</p>
              <p>Four years deep in AI — through every major model shift since 2022. Builds the things he wants to exist, ships them faster than anyone you've met.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Hiring</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-4">
            Want to build the AI <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>that runs every business?</span>
          </h2>
          <p className="text-[15px] text-slate-700 max-w-xl mx-auto leading-relaxed mb-6">
            We hire builders who ship. Heavy engineering bias, light meeting calendar, full ownership of customer outcomes. Email us with what you've shipped — not your resume.
          </p>
          <a href="mailto:careers@trainyouragent.com" className="inline-block px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] shadow">careers@trainyouragent.com</a>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span><span className="text-slate-400">— Tampa Bay, FL</span></div>
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
