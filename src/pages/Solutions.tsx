import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";
const HERO_PHONE_DISPLAY = "(813) 555-0142";
const HERO_PHONE_TEL = "+18135550142";

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

type LaneId = "startup" | "smb" | "agency" | "ops";

const LANES: Record<LaneId, {
  label: string;
  eyebrow: string;
  h1Pre: string;
  h1Em: string;
  sub: string;
  outcomes: { h: string; b: string }[];
  package: { h: string; b: string }[];
  ctaPrimary: string;
  ctaSecondary: string;
}> = {
  startup: {
    label: "Startups",
    eyebrow: "For founders building from zero",
    h1Pre: "You should not be",
    h1Em: "answering phones.",
    sub: "Founders sell, ship, and recruit. They don't qualify inbound. We build the agent and the GTM infrastructure that lets you stay in the codebase.",
    outcomes: [
      { h: "First customer-facing agent live in 7 days", b: "From kickoff to first answered call. Inbound, outbound, support — whichever you need first." },
      { h: "GTM infrastructure that scales without you", b: "Lead enrichment, qualification, sequences, CRM wiring. The same stack we'd use for our own next venture." },
      { h: "Brand systems that look funded", b: "Logo, type, voice, landing site. Founder-tier taste, ten-day cycle. So you don't ship a Lovable template." },
      { h: "Equity-friendly when it fits", b: "Right founder, right product, right cap table — we'll defer cash for a small piece. Mention it on the call." },
    ],
    package: [
      { h: "1 production agent",         b: "Voice, chat, or both. Trained on your docs and tone." },
      { h: "GTM infra (lite)",            b: "Apollo + sequences + CRM + booking." },
      { h: "Brand starter",                b: "Logo, type system, marketing site." },
      { h: "Founder support",              b: "Direct Slack to Alexander for 90 days." },
    ],
    ctaPrimary: "Apply for the founder lane",
    ctaSecondary: "Book a build call",
  },
  smb: {
    label: "SMBs",
    eyebrow: "For operators tired of missing calls",
    h1Pre: "Stop missing the calls that",
    h1Em: "actually pay you.",
    sub: "Every call after 5pm is a competitor's appointment. Every voicemail is a sale you'll have to re-earn. Your agent picks up in two rings, qualifies, books, and dispatches — even on Sunday at midnight.",
    outcomes: [
      { h: "Answer every call, every time", b: "Inbound voice agent, 24/7, your area code, your scripts. Caller experience is closer to your best receptionist than your worst day." },
      { h: "Book straight into your calendar", b: "ServiceTitan, Housecall Pro, Cal.com, Google, Salesforce — we wire to whatever you use today." },
      { h: "Surge-proof your busy season", b: "Storm week for roofing, allergy season for clinics, tax-season for accounting — the agent doesn't crack." },
      { h: "Weekly review with a real engineer", b: "Not a CSM. The person who can change the agent's behavior is the person on your call." },
    ],
    package: [
      { h: "Multi-channel agent",         b: "Voice + SMS + email + chat in one config." },
      { h: "Native CRM integration",      b: "Real bidirectional sync, not webhooks duct-taped together." },
      { h: "4,000 minutes / month",        b: "Standard pool, transparent overage at $0.18/min." },
      { h: "Weekly tuning",                b: "Performance review, call sampling, prompt updates." },
    ],
    ctaPrimary: "Start the build",
    ctaSecondary: "Or call us live",
  },
  agency: {
    label: "Agencies",
    eyebrow: "For agencies who want to white-label voice + automation",
    h1Pre: "Resell our agent stack.",
    h1Em: "Keep your margin.",
    sub: "You sell marketing, websites, or ads. Your clients are asking for AI now and you don't have a build team. We're the build team. White-label the agents, keep the relationship, keep the margin.",
    outcomes: [
      { h: "White-label voice + chat agents", b: "Your brand on the dashboard. Your invoice. We're invisible." },
      { h: "Fast turnaround per client", b: "We deliver a configured agent in 7-10 business days. Your clients see speed they can't get internally." },
      { h: "Co-pilot for sales calls", b: "We'll join your discovery calls with new clients to scope correctly. You don't need to learn voice agents to sell them." },
      { h: "Volume pricing that protects margin", b: "Tiered cost per agent after the third client live. Your sales team finally has something with healthy gross." },
    ],
    package: [
      { h: "White-label dashboard",        b: "Your logo, your domain, your support channel." },
      { h: "Per-agent volume pricing",     b: "Discounts kick in at 3, 10, and 25 active agents." },
      { h: "Partner success channel",      b: "Shared Slack with our build team, weekly office hours." },
      { h: "Co-selling support",            b: "We'll join sales calls when you need a technical voice." },
    ],
    ctaPrimary: "Become a partner",
    ctaSecondary: "Book a partnership call",
  },
  ops: {
    label: "Ops at scale",
    eyebrow: "For multi-location and multi-brand operators",
    h1Pre: "One agent per brand.",
    h1Em: "One ops layer for all of them.",
    sub: "Fifteen clinics, eight hotels, a national franchise. Each one needs its own voice, scripts, integrations — and you need one place to manage them, one bill, one security review, one report.",
    outcomes: [
      { h: "Unified ops dashboard", b: "Every location, every agent, every metric — in one place. Drill down to a single call if you need to." },
      { h: "Per-location personalization", b: "Same brand, different scripts. Different hours. Different escalation rules. Same dashboard." },
      { h: "Enterprise security pack", b: "BAA, DPA, SOC 2 evidence binder, custom data residency, dedicated incident response." },
      { h: "Dedicated engineering", b: "Named engineer on your account. Monthly architecture review. SLA-backed uptime." },
    ],
    package: [
      { h: "Unlimited agents",             b: "Across brands, locations, or sub-tenants." },
      { h: "Custom integrations",          b: "Your data warehouse, your dispatch system, your custom CRM." },
      { h: "Dedicated engineer",            b: "Named, on your roster, weekly sync." },
      { h: "Enterprise SLA",                b: "Uptime guarantee, incident SLA, escalation path to founder." },
    ],
    ctaPrimary: "Get a custom quote",
    ctaSecondary: "Book an architecture call",
  },
};

const LANE_IDS: LaneId[] = ["startup", "smb", "agency", "ops"];

function useQueryLane(): LaneId | null {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const lane = params.get("lane");
  if (lane && LANE_IDS.includes(lane as LaneId)) return lane as LaneId;
  return null;
}

const Solutions = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const queryLane = useQueryLane();
  const [activeLane, setActiveLane] = useState<LaneId>(queryLane || "smb");

  useEffect(() => {
    if (queryLane) setActiveLane(queryLane);
  }, [queryLane]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem("tya:pathway");
      if (!queryLane && saved && LANE_IDS.includes(saved as LaneId)) setActiveLane(saved as LaneId);
    } catch {}
  }, [queryLane]);

  useEffect(() => {
    try { window.localStorage.setItem("tya:pathway", activeLane); } catch {}
  }, [activeLane]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = `Solutions for ${LANES[activeLane].label} — TrainYourAgent`;
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setMeta("description", LANES[activeLane].sub);
  }, [activeLane]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const lane = LANES[activeLane];

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <BrainLogo size={36} />
            <span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-[14px] text-slate-700">
            <Link to="/solutions" className="text-[#042C53] font-medium">Solutions</Link>
            <Link to="/technology" className="hover:text-[#042C53]">Technology</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <Link to="/pricing" className="hover:text-[#042C53]">Pricing</Link>
            <Link to="/about" className="hover:text-[#042C53]">About</Link>
            <a href={`tel:${HERO_PHONE_TEL}`} className="text-[#185FA5] hover:text-[#042C53] font-medium">{HERO_PHONE_DISPLAY}</a>
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] shadow-sm">Book a call</a>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span className="block w-4 h-px bg-[#042C53] relative" style={{ boxShadow: mobileOpen ? "none" : "0 -5px 0 #042C53, 0 5px 0 #042C53", transform: mobileOpen ? "rotate(45deg)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Lane switcher */}
      <section className="pt-28 pb-6 px-5 sm:px-8 bg-[#F6FAFE] border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold whitespace-nowrap">You're seeing</div>
          <div className="flex flex-wrap gap-2">
            {LANE_IDS.map((id) => (
              <button key={id} onClick={() => setActiveLane(id)}
                      className={`px-4 py-2 rounded-full text-[13px] font-medium transition border ${activeLane === id ? "bg-[#042C53] text-white border-[#042C53]" : "bg-white text-[#042C53] border-slate-200 hover:border-[#185FA5]"}`}>
                {LANES[id].label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hero (lane-adaptive) */}
      <section className="px-5 sm:px-8 pt-16 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">{lane.eyebrow}</div>
          <h1 className="text-[42px] sm:text-[68px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            {lane.h1Pre} <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>{lane.h1Em}</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">{lane.sub}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15">{lane.ctaPrimary} →</a>
            <a href={`tel:${HERO_PHONE_TEL}`} className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] border-2 border-[#042C53]/15 hover:border-[#042C53]">{lane.ctaSecondary}</a>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">What changes</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-10">
            What you can expect <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>in the first 90 days.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {lane.outcomes.map((o, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-200 p-7 hover:border-[#185FA5] transition">
                <div className="text-[18px] font-semibold text-[#042C53] mb-2">{o.h}</div>
                <div className="text-[14px] text-slate-700 leading-relaxed">{o.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Package */}
      <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold mb-3">In the package</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold mb-10">
            What's actually <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>in the box.</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lane.package.map((p, i) => (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <div className="text-[16px] font-semibold mb-2">{p.h}</div>
                <div className="text-[13px] text-white/75 leading-relaxed">{p.b}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg">{lane.ctaPrimary} →</a>
            <Link to="/pricing" className="px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15">See pricing</Link>
          </div>
        </div>
      </section>

      {/* Verticals strip */}
      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Industry-specific</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-8">
            Built for your industry. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Not the average of all of them.</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              ["/healthcare","Healthcare"],["/legal","Legal"],["/real-estate","Real Estate"],["/hvac","HVAC"],
              ["/roofing","Roofing"],["/solar","Solar"],["/accounting","Accounting"],["/automotive","Automotive"],
              ["/spas","Spas"],["/hotels","Hotels"],["/bars-nightclubs","Bars & Clubs"],["/logistics","Logistics"],
              ["/gym","Fitness"],
            ].map(([slug, label]) => (
              <Link key={slug} to={slug} className="px-4 py-2 rounded-full bg-white border border-slate-200 text-[13px] text-[#042C53] hover:border-[#185FA5] hover:bg-[#F6FAFE] transition">{label} →</Link>
            ))}
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

export default Solutions;
