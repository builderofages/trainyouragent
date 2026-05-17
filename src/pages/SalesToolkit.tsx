import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/agentmills";

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

const SalesToolkit = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) { const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap"; document.head.appendChild(l); }
    document.title = "Sales Toolkit — TrainYourAgent";
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

      <section className="pt-32 pb-20 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Sales Toolkit</div>
          <h1 className="text-[42px] sm:text-[60px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Selling AI inside your company? <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Use ours.</span>
          </h1>
          <p className="mt-6 text-[17px] text-slate-700 leading-relaxed">
            Champion materials, security packs, ROI calculators, and internal-pitch decks for the buyer who has to convince their leadership. Email <a className="text-[#185FA5] underline" href="mailto:hello@trainyouragent.com">hello@trainyouragent.com</a> with your role and we'll send the version that lands for your stakeholders.
          </p>
          <div className="mt-10 grid md:grid-cols-2 gap-4">
            {[
              { h: "Champion one-pager",    b: "What to send to your CFO / COO / CIO. Three pages, plain English, no jargon." },
              { h: "Security questionnaire",b: "We've answered the standard SIG-Lite, CAIQ, and Vendor Risk Assessment Questionnaire. Send us yours and we'll auto-fill." },
              { h: "ROI model",              b: "Spreadsheet with your numbers, our numbers, and a payback calc. Customizable by vertical." },
              { h: "Internal-pitch deck",    b: "Ten slides you can re-skin and present to your leadership. Battle-tested against board pushback." },
            ].map((x, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#185FA5] transition">
                <div className="text-[16px] font-semibold text-[#042C53] mb-2">{x.h}</div>
                <div className="text-[14px] text-slate-600 leading-relaxed">{x.b}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl bg-[#F6FAFE] border border-slate-200 p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
            <div>
              <div className="text-[16px] font-semibold text-[#042C53] mb-1">Want all four delivered today?</div>
              <div className="text-[14px] text-slate-600">Email us your role + company. We'll send tailored versions within one business day.</div>
            </div>
            <a href="mailto:hello@trainyouragent.com" className="px-5 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] shadow whitespace-nowrap">Request the kit</a>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span></div>
          <div className="flex items-center gap-6"><Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link><Link to="/terms" className="hover:text-[#042C53]">Terms</Link><Link to="/security" className="hover:text-[#042C53]">Security</Link><a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a></div>
        </div>
      </footer>
    </div>
  );
};

export default SalesToolkit;
