// src/pages/LocationPage.tsx
// Programmatic SEO: 14 verticals × 30 cities = 420 unique landing pages.
// Route: /:vertical/:city  (e.g. /hvac/tampa, /healthcare/austin)

import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";
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

export const VERTICALS: Record<string, { label: string; pain: string; outcome: string }> = {
  hvac:           { label: "HVAC",          pain: "after-hours emergency calls",            outcome: "every dispatch booked, even Sunday at 2am" },
  healthcare:     { label: "Healthcare",    pain: "patient intake + insurance verification",outcome: "BAA-protected scheduling, 24/7" },
  legal:          { label: "Legal",         pain: "intake + conflict checks",                outcome: "qualified leads only on your calendar" },
  "real-estate":  { label: "Real Estate",   pain: "Zillow leads going cold",                 outcome: "speed-to-lead under 30 seconds" },
  roofing:        { label: "Roofing",       pain: "storm-week call surge",                   outcome: "every inspection scheduled" },
  solar:          { label: "Solar",         pain: "Meta-ad lead callback",                   outcome: "site survey booked while lead is hot" },
  accounting:     { label: "Accounting",    pain: "tax-season phone meltdown",               outcome: "client triage + checklist sent before intake" },
  automotive:     { label: "Automotive",    pain: "service bay scheduling",                  outcome: "warranty checks + bay routing" },
  spas:           { label: "Spas",          pain: "treatment booking + waitlist",            outcome: "deposit-protected scheduling" },
  hotels:         { label: "Hotels",        pain: "front-desk overflow",                     outcome: "concierge handled in your brand voice" },
  "bars-nightclubs": { label: "Bars & Nightclubs", pain: "reservations while the bar is loud", outcome: "VIP holds + table-management" },
  logistics:      { label: "Logistics",     pain: "driver check-calls + exceptions",         outcome: "dispatchers freed for high-stakes calls" },
  gym:            { label: "Fitness",       pain: "trial bookings + cancellations",          outcome: "policy-enforced membership flow" },
  accounting2:    { label: "Bookkeeping",   pain: "client onboarding inbound",               outcome: "documents + scope captured before intake" },
};

export const CITIES = [
  "Tampa","Miami","Orlando","Jacksonville","Fort Lauderdale","Atlanta","Charlotte","Raleigh","Nashville","Austin",
  "Dallas","Houston","San Antonio","Phoenix","Las Vegas","Denver","Salt Lake City","Seattle","Portland","San Diego",
  "Los Angeles","San Francisco","Chicago","Indianapolis","Columbus","Cleveland","Detroit","Pittsburgh","Philadelphia","Boston",
];

const slugCity = (c: string) => c.toLowerCase().replace(/\s+/g, "-");
const titleCity = (s: string) => s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const LocationPage = () => {
  const { vertical = "", city = "" } = useParams<{ vertical: string; city: string }>();
  const nav = useNavigate();
  const v = VERTICALS[vertical];
  const cityTitle = titleCity(city);
  const cityValid = CITIES.some((c) => slugCity(c) === city.toLowerCase());
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    if (!v || !cityValid) { nav(`/${vertical || "solutions"}`, { replace: true }); }
  }, [v, cityValid, vertical, nav]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) { const l = document.createElement("link"); l.id = "tya-fonts"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap"; document.head.appendChild(l); }
    if (!v) return;
    const title = `${v.label} AI agent in ${cityTitle} — TrainYourAgent`;
    const desc = `AI voice + messaging agents for ${v.label.toLowerCase()} businesses in ${cityTitle}. Solves ${v.pain}. Result: ${v.outcome}.`;
    document.title = title;
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setMeta("description", desc);

    // LocalBusiness schema
    const id = "tya-schema-loc";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `${v.label} AI Agent — ${cityTitle}`,
      "provider": { "@type": "Organization", "name": "TrainYourAgent", "url": "https://trainyouragent.com" },
      "areaServed": { "@type": "City", "name": cityTitle },
      "serviceType": v.label,
      "description": desc,
    });
    document.head.appendChild(s);
  }, [v, cityTitle]);

  useEffect(() => { const f = () => setNavScrolled(window.scrollY > 20); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);

  if (!v || !cityValid) return null;

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
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">{v.label} · {cityTitle}, USA</div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            AI voice agents for {v.label.toLowerCase()} businesses in <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>{cityTitle}.</span>
          </h1>
          <p className="mt-6 text-[18px] text-slate-700 max-w-3xl leading-relaxed">
            We build agents that solve {v.pain} for {v.label.toLowerCase()} businesses across {cityTitle} and the surrounding metro. Outcome: {v.outcome}.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15">Book a build call →</a>
            <a href={`tel:${HERO_PHONE_TEL}`} className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] border-2 border-[#042C53]/15 hover:border-[#042C53]">Call us: {HERO_PHONE_DISPLAY}</a>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-6">
            How {v.label.toLowerCase()} agents in {cityTitle} <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>actually work.</span>
          </h2>
          <p className="text-[16px] text-slate-700 leading-relaxed mb-8">
            We start by listening to your existing calls (with permission), training the agent on your scripts and pricing, wiring it into the tools you already use, and going live in 7–14 business days. Same architecture for every {cityTitle} customer; tuned per business.
          </p>
          <Link to={`/${vertical}`} className="inline-flex items-center gap-2 text-[#185FA5] font-medium hover:text-[#042C53]">
            See full {v.label} playbook →
          </Link>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Other cities we serve</div>
          <div className="flex flex-wrap gap-2">
            {CITIES.filter((c) => slugCity(c) !== city.toLowerCase()).slice(0, 18).map((c) => (
              <Link key={c} to={`/${vertical}/${slugCity(c)}`} className="px-3 py-1.5 rounded-full bg-[#F6FAFE] border border-slate-200 text-[13px] text-[#042C53] hover:border-[#185FA5] hover:bg-white transition">
                {v.label} in {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span><span className="text-slate-400">— Tampa Bay, FL</span></div>
          <div className="flex items-center gap-6"><Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link><Link to="/terms" className="hover:text-[#042C53]">Terms</Link><Link to="/security" className="hover:text-[#042C53]">Security</Link></div>
        </div>
      </footer>
    </div>
  );
};

export default LocationPage;
