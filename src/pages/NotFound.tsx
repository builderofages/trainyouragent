import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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

const SUGGESTED = [
  { to: "/", label: "Home" },
  { to: "/solutions", label: "Solutions" },
  { to: "/pricing", label: "Pricing" },
  { to: "/security", label: "Security" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    // Log to console for debugging
    // eslint-disable-next-line no-console
    console.warn("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B] flex flex-col" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <BrainLogo size={36} />
            <span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span>
          </Link>
          <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] transition shadow-sm">Book a call</a>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-5 py-20">
        <div className="max-w-2xl text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">404</div>
          <h1 className="text-[56px] sm:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            This page <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>wandered off.</span>
          </h1>
          <p className="mt-6 text-[18px] text-slate-600 leading-relaxed">
            We couldn't find <code className="px-1.5 py-0.5 rounded bg-[#E6F1FB] text-[#042C53] text-[15px]">{location.pathname}</code>. It either moved, never existed, or got eaten by an agent in training.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {SUGGESTED.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="px-4 py-2 rounded-full bg-white border border-slate-300 text-[14px] text-[#042C53] hover:border-[#185FA5] hover:bg-[#F6FAFE] transition"
              >
                {s.label}
              </Link>
            ))}
          </div>

          <div className="mt-10 text-[14px] text-slate-500">
            Still stuck? Email <a href="mailto:hello@trainyouragent.com" className="text-[#185FA5] underline">hello@trainyouragent.com</a>.
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex items-center justify-between text-[12px] text-slate-500">
          <span>© 2026 TrainYourAgent, Inc.</span>
          <span>Tampa Bay, FL</span>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
