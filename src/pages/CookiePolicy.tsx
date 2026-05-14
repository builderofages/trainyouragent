import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="#E6F1FB" />
        <g fill="#0C447C">
          <circle cx="20" cy="27" r="7.5" />
          <circle cx="32" cy="21" r="8.5" />
          <circle cx="44" cy="27" r="7.5" />
          <circle cx="24" cy="40" r="7" />
          <circle cx="40" cy="40" r="7" />
          <rect x="29" y="44" width="6" height="11" rx="1.5" />
        </g>
        <circle cx="32" cy="32" r="30" fill="none" stroke="#185FA5" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

const COOKIES = [
  { name: "Session / auth", purpose: "Keeps you signed in to the dashboard.", duration: "Session only", required: true },
  { name: "Plausible analytics", purpose: "Page-view counts. No cross-site tracking, no fingerprinting, no personal identifiers stored.", duration: "24 hours (anonymous)", required: false },
  { name: "Stripe Checkout", purpose: "Loaded only on billing pages to process payments securely.", duration: "Per Stripe's policy", required: true },
  { name: "Preference", purpose: "Remembers UI choices like collapsed sidebars or theme.", duration: "1 year", required: false },
];

const CookiePolicy = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <BrainLogo size={36} />
            <span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-[14px] text-slate-700">
            <Link to="/solutions" className="hover:text-[#042C53]">Solutions</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <Link to="/pricing" className="hover:text-[#042C53]">Pricing</Link>
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E]">Book a call</a>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span className="block w-4 h-px bg-[#042C53] relative" style={{ boxShadow: mobileOpen ? "none" : "0 -5px 0 #042C53, 0 5px 0 #042C53", transform: mobileOpen ? "rotate(45deg)" : "none" }} />
          </button>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Legal</div>
        <h1 className="text-[42px] sm:text-[56px] leading-[1.05] tracking-tight font-semibold text-[#042C53] mb-3">Cookie Policy</h1>
        <div className="text-[14px] text-slate-500 mb-10">Last updated: May 13, 2026</div>

        <div className="space-y-8 text-[16px] leading-[1.75] text-slate-700">
          <p>
            We keep cookies to a minimum. No advertising trackers, no Google Analytics, no third-party data brokers, no cross-site fingerprinting. The full list below is what actually runs on trainyouragent.com.
          </p>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-4">Cookies we use</h2>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-[14px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2 font-semibold text-[#042C53]">Cookie</th>
                    <th className="text-left py-3 px-2 font-semibold text-[#042C53]">Purpose</th>
                    <th className="text-left py-3 px-2 font-semibold text-[#042C53]">Duration</th>
                    <th className="text-left py-3 px-2 font-semibold text-[#042C53]">Required</th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map((c, i) => (
                    <tr key={i} className="border-b border-slate-100 align-top">
                      <td className="py-3 px-2 font-medium text-[#042C53]">{c.name}</td>
                      <td className="py-3 px-2 text-slate-700">{c.purpose}</td>
                      <td className="py-3 px-2 text-slate-700">{c.duration}</td>
                      <td className="py-3 px-2 text-slate-700">{c.required ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">Your choices</h2>
            <p>You can disable non-required cookies in your browser settings or via any consent banner we show. Disabling required cookies will break sign-in and checkout. We do not use cookies to retarget you on other sites.</p>
          </div>

          <div>
            <h2 className="text-[22px] font-semibold text-[#042C53] mb-3">Questions</h2>
            <p>Email <a className="text-[#185FA5] underline" href="mailto:privacy@trainyouragent.com">privacy@trainyouragent.com</a>.</p>
          </div>

          <div className="pt-4">
            <Link to="/privacy" className="text-[#185FA5] underline text-[15px]">Read the full privacy policy &rarr;</Link>
          </div>
        </div>
      </article>

      <footer className="border-t border-slate-200 bg-white mt-10">
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
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default CookiePolicy;
