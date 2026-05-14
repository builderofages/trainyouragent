import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

const Settings = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) { const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap"; document.head.appendChild(l); }
    document.title = "Settings — TrainYourAgent";
    try { setPath(window.localStorage.getItem("tya:pathway")); } catch {}
  }, []);
  useEffect(() => { const f = () => setNavScrolled(window.scrollY > 20); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);

  const reset = () => { try { window.localStorage.removeItem("tya:pathway"); setPath(null); } catch {} };

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5"><BrainLogo size={36} /><span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span></Link>
          <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] shadow-sm">Book a call</a>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Settings</div>
          <h1 className="text-[36px] sm:text-[48px] leading-[1.06] tracking-tight font-semibold text-[#042C53]">
            Your <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>preferences.</span>
          </h1>
          <p className="mt-5 text-[16px] text-slate-700 leading-relaxed">
            Customer account settings live behind sign-in (coming with v1 dashboard). Below is the lightweight stuff we store in your browser only.
          </p>

          <div className="mt-10 space-y-4">
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Pathway personalization</div>
              <div className="text-[15px] text-[#042C53] mb-2">{path ? `Current: ${path}` : "Not set — visit any vertical or use the configurator to choose a lane."}</div>
              <div className="text-[13px] text-slate-600 mb-4 leading-relaxed">We remember whether you're a startup, SMB, agency, or ops at scale so vertical pages adapt their hero and CTAs to you. Stored locally in your browser. Reset any time.</div>
              {path && (
                <button onClick={reset} className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-semibold hover:bg-[#0A3D6E]">Reset pathway</button>
              )}
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Cookies</div>
              <div className="text-[14px] text-slate-700 leading-relaxed mb-3">We keep cookies to a minimum: session, preference, billing (on Stripe pages only), and privacy-friendly analytics. Full breakdown on the <Link to="/cookie-policy" className="text-[#185FA5] underline">Cookie Policy</Link>.</div>
            </div>

            <div className="rounded-2xl bg-[#F6FAFE] border border-slate-200 p-6">
              <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Customer account?</div>
              <div className="text-[14px] text-slate-700 leading-relaxed mb-4">If you're an active customer and need to update billing, integrations, or escalation rules — email <a className="text-[#185FA5] underline" href="mailto:hello@trainyouragent.com">hello@trainyouragent.com</a> and we'll route you to your engineer.</div>
            </div>
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

export default Settings;
