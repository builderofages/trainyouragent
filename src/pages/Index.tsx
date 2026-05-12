import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * TrainYourAgent — homepage v12
 * Brand: deep navy gradient + sky blue (#4A90E2) + cyan accents.
 * Logo: circular gradient orb with "Ai" mark. Inter body, serif italic accents on display.
 * Tagline: "AI That Thinks Like Your Business" — italic emphasis on "That Thinks".
 */

const NICHES = [
  { path: "/roofing",         label: "Roofing",        line: "Storm-surge call capture, insurance triage." },
  { path: "/hvac",            label: "HVAC",           line: "After-hours dispatch, service-call booking." },
  { path: "/solar",           label: "Solar",          line: "Consultation scheduling, qualification gate." },
  { path: "/gym",             label: "Gym & Fitness",  line: "Membership tours, cancellation save flows." },
  { path: "/healthcare",      label: "Healthcare",     line: "Patient intake, appointment routing." },
  { path: "/legal",           label: "Legal",          line: "Conflict check, consult scheduling." },
  { path: "/real-estate",     label: "Real Estate",    line: "Showing requests, qualification by budget." },
  { path: "/automotive",      label: "Automotive",     line: "Test-drive booking, parts inquiries." },
  { path: "/spas",            label: "Med Spa",        line: "Treatment consults, pre-screen forms." },
  { path: "/hotels",          label: "Hotels",         line: "Reservation taking, upsell on stay." },
  { path: "/bars-nightclubs", label: "Bars / Clubs",   line: "Table requests, guestlist sign-up." },
  { path: "/logistics",       label: "Logistics",      line: "Pickup quotes, dispatch routing." },
  { path: "/accounting",      label: "Accounting",     line: "Discovery intake, scope qualification." },
  { path: "/solutions",       label: "Agencies",       line: "Client-side intake at scale." },
];

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < (window.innerHeight || 0) && rect.bottom > 0) {
      setTimeout(() => setShown(true), delay);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setTimeout(() => setShown(true), delay); io.disconnect(); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    const safety = setTimeout(() => { setShown(true); io.disconnect(); }, 1400);
    return () => { io.disconnect(); clearTimeout(safety); };
  }, [delay]);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${className}`}>
      {children}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} className="border-t border-white/10 py-6 cursor-pointer group">
      <div className="flex justify-between items-center gap-6">
        <span className="text-[17px] font-medium tracking-tight group-hover:text-[#7DD3FC] transition">{q}</span>
        <span className={`w-7 h-7 grid place-items-center flex-shrink-0 text-sm font-mono transition-transform text-[#4A90E2] ${open ? "rotate-45" : ""}`}>+</span>
      </div>
      <div className="text-slate-300 text-[14.5px] leading-relaxed overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: open ? 500 : 0, marginTop: open ? 14 : 0 }}>
        {a}
      </div>
    </div>
  );
}

function Logo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="tya-orb" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#A5C8FF" />
            <stop offset="45%" stopColor="#4A90E2" />
            <stop offset="100%" stopColor="#1E3A6E" />
          </radialGradient>
          <radialGradient id="tya-highlight" cx="30%" cy="22%" r="40%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#tya-orb)" />
        <circle cx="32" cy="32" r="30" fill="url(#tya-highlight)" />
        <text x="32" y="42" textAnchor="middle" fontFamily="'Playfair Display', 'Times New Roman', serif" fontStyle="italic" fontSize="26" fontWeight="600" fill="white">Ai</text>
      </svg>
    </span>
  );
}

const Index = () => {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("tya-elevenlabs-script")) return;
    const s = document.createElement("script");
    s.id = "tya-elevenlabs-script";
    s.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    s.async = true;
    s.type = "text/javascript";
    document.head.appendChild(s);
    if (!document.querySelector("elevenlabs-convai")) {
      const w = document.createElement("elevenlabs-convai");
      w.setAttribute("agent-id", "agent_5801k8nhs68yfyb8m0px86cdp6fc");
      document.body.appendChild(w);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter+Tight:wght@400;500;600;700&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "TrainYourAgent — AI That Thinks Like Your Business";
    document.documentElement.lang = "en";
    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.head.querySelector(sel) as any;
      if (!el) {
        el = document.createElement(sel.includes("link") ? "link" : "meta");
        const m = sel.match(/\[(\w+)="([^"]+)"\]/);
        if (m) el.setAttribute(m[1], m[2]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };
    setMeta('meta[name="description"]', "content", "Custom AI agents for every industry. Deploy in days. Scale forever. Automate 80% of tasks and unlock exponential growth.");
    setMeta('meta[name="theme-color"]', "content", "#0a1628");
    setMeta('meta[property="og:title"]', "content", "TrainYourAgent — AI That Thinks Like Your Business");
    setMeta('meta[property="og:description"]', "content", "Custom AI agents for every industry. Deploy in days. Scale forever.");
    setMeta('meta[property="og:image"]', "content", "/og-image.jpg");
    setMeta('meta[name="twitter:title"]', "content", "TrainYourAgent — AI That Thinks Like Your Business");
    setMeta('meta[name="twitter:description"]', "content", "Custom AI agents for every industry. Deploy in days. Scale forever.");
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    if (!document.getElementById("tya-jsonld")) {
      const ld = document.createElement("script");
      ld.id = "tya-jsonld";
      ld.type = "application/ld+json";
      ld.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "TrainYourAgent",
        "url": "https://trainyouragent.com",
        "email": "hello@trainyouragent.com",
        "description": "AI That Thinks Like Your Business. Custom AI agents for every industry.",
        "founder": { "@type": "Person", "name": "Alexander Mills" }
      });
      document.head.appendChild(ld);
    }
  }, []);

  const heroBg = "radial-gradient(1200px 600px at 80% -10%, rgba(74,144,226,0.25), transparent 60%), radial-gradient(900px 500px at -10% 30%, rgba(125,211,252,0.12), transparent 60%), linear-gradient(180deg, #050d1c 0%, #0a1628 40%, #0f2440 100%)";

  return (
    <div className="min-h-screen text-white antialiased selection:bg-[#4A90E2] selection:text-white overflow-x-hidden"
      style={{ fontFamily: "'Inter Tight', 'Inter', system-ui, -apple-system, sans-serif", background: heroBg, backgroundAttachment: "fixed" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#4A90E2] focus:text-white focus:px-4 focus:py-2 focus:rounded">Skip to content</a>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${navScrolled ? "bg-[#050d1c]/85 backdrop-blur-xl border-b border-white/10" : "bg-transparent border-b border-transparent"}`}>
        <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-3 font-semibold text-[17px] tracking-tight">
            <Logo size={38} />
            <span>TrainYourAgent</span>
          </Link>
          <div className="hidden md:flex gap-7 items-center text-[14px]">
            <a href="#what" className="text-slate-300 hover:text-white transition">What we do</a>
            <a href="#how" className="text-slate-300 hover:text-white transition">Process</a>
            <a href="#niches" className="text-slate-300 hover:text-white transition">Verticals</a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition">Pricing</a>
            <a href="#faq" className="text-slate-300 hover:text-white transition">FAQ</a>
          </div>
          <a href="#book" className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold tracking-tight text-white transition rounded-full shadow-lg"
            style={{ background: "linear-gradient(180deg, #5BA3F5 0%, #4A90E2 100%)", boxShadow: "0 8px 24px -8px rgba(74,144,226,0.6), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
            Book a call
          </a>
        </div>
      </nav>

      <main id="main">

      <header className="pt-44 pb-32 relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 text-[11px] tracking-[0.2em] uppercase border border-white/15 text-slate-300 font-mono rounded-full bg-white/[0.03] backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] animate-pulse" />
              Custom AI Agents · Deploy in days
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="text-[clamp(48px,8vw,128px)] leading-[0.95] tracking-[-0.03em] mb-10 max-w-[1100px]"
              style={{ fontFamily: "'Playfair Display', 'Times New Roman', serif", fontWeight: 600 }}>
              AI <em className="italic font-normal" style={{ background: "linear-gradient(180deg, #A5C8FF 0%, #4A90E2 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>That Thinks</em><br />
              <span>Like Your Business.</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-[clamp(17px,1.6vw,22px)] text-slate-300 max-w-[660px] mb-12 leading-relaxed">
              Custom AI agents for every industry. Deploy in days. Scale forever.<br className="hidden md:block" />
              Automate 80% of tasks and unlock exponential growth.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="flex gap-4 flex-wrap items-center">
              <a href="#book" className="inline-flex items-center gap-2 px-7 py-4 text-[15px] font-semibold text-white transition rounded-full shadow-xl"
                style={{ background: "linear-gradient(180deg, #5BA3F5 0%, #4A90E2 100%)", boxShadow: "0 18px 50px -10px rgba(74,144,226,0.55), inset 0 1px 0 rgba(255,255,255,0.25)" }}>
                Book a discovery call →
              </a>
              <a href="#how" className="inline-flex items-center gap-2 px-7 py-4 text-[15px] font-semibold border border-white/15 hover:border-white/30 hover:bg-white/5 text-white transition rounded-full">
                See the process
              </a>
            </div>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
              {[
                { k: "3–7", v: "Day deployment" },
                { k: "80%", v: "Tasks automated" },
                { k: "24/7", v: "Always-on agent" },
                { k: "1", v: "Founder, no layers" },
              ].map((s, i) => (
                <div key={i} className="bg-[#0a1628]/80 backdrop-blur p-7">
                  <div className="text-[32px] tracking-tight font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: "#7DD3FC" }}>{s.k}</div>
                  <div className="text-slate-400 text-[12.5px] tracking-wide uppercase font-mono mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </header>

      <section id="what" className="py-28 border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[280px,1fr] gap-12">
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#4A90E2] font-mono mb-3">What we do</div>
            <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.025em]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
              Four things,<br /><em className="italic font-normal text-[#7DD3FC]">done well.</em>
            </h2>
          </div>
          <div className="space-y-10 pt-2">
            {[
              { t: "Voice agents", b: "Your phone line, answered by AI. Books appointments, qualifies leads, escalates the calls that need a human." },
              { t: "Web chat + SMS follow-up", b: "Same brain across channels. Picks up where a missed call left off, texts back, fills the calendar." },
              { t: "Custom fine-tunes", b: "Trained on your actual call recordings or scripts. Sounds like your business, not a chatbot template." },
              { t: "Integrations + ops", b: "Hooks into your CRM, calendar, telephony, and ticketing. We monitor, refresh, and patch. You don't see the wires." },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="grid grid-cols-[50px,1fr] gap-5 items-start">
                  <div className="text-[#4A90E2] font-mono text-[13px] tracking-wide pt-1">0{i + 1}</div>
                  <div>
                    <h3 className="text-[22px] tracking-tight mb-2 font-medium text-white">{c.t}</h3>
                    <p className="text-slate-300 text-[15.5px] leading-relaxed">{c.b}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-28 border-t border-white/10 relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#4A90E2] font-mono mb-3">How an engagement looks</div>
          <h2 className="text-[clamp(36px,4.5vw,64px)] leading-[1.05] tracking-[-0.025em] mb-3 max-w-3xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            From first call <em className="italic font-normal text-[#7DD3FC]">to live</em>, in order.
          </h2>
          <p className="text-slate-300 text-[16px] max-w-2xl mb-16 leading-relaxed">
            Timelines depend on integrations and how clean your existing call data is. The shape doesn't change.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            {[
              { t: "Discovery", b: "30 minutes on Zoom. We listen to recordings if you have them, look at your call flow, and write the scope back to you." },
              { t: "Build", b: "We script, configure, and wire integrations: CRM, calendar, telephony. You see drafts as they ship." },
              { t: "Stress test", b: "You and your team call in. We watch transcripts live and turn failure cases into permanent guardrails." },
              { t: "Cutover", b: "Number ports or SIP redirect. Agent goes live. You get a dashboard for calls, transcripts, and exports." },
              { t: "Run", b: "Weekly refreshes, monthly reviews. Same founder, same number — no account-management layer between us." },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 50} className="bg-[#0a1628]/80 backdrop-blur p-8">
                <div className="text-[#4A90E2] font-mono text-[12px] tracking-wide mb-4">STEP / {String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-[19px] tracking-tight mb-2 font-medium text-white">{s.t}</h3>
                <p className="text-slate-400 text-[14px] leading-relaxed">{s.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="py-28 border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[280px,1fr] gap-12">
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#4A90E2] font-mono mb-3">Live demo</div>
            <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.025em]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
              Talk to it.<br /><em className="italic font-normal text-[#7DD3FC]">Right now.</em>
            </h2>
          </div>
          <div className="pt-2">
            <p className="text-slate-200 text-[18px] leading-relaxed mb-6">
              The mic widget in the bottom-right corner is a real ElevenLabs conversational agent. Same voice, same tooling we deploy on customer phone lines.
            </p>
            <p className="text-slate-400 text-[14.5px] leading-relaxed mb-8">
              Click it. Ask it anything a real caller would. Configured for HVAC right now; we re-train it for your vertical during the build.
            </p>
            <div className="inline-flex items-center gap-3 text-[13px] text-slate-400 font-mono border border-white/15 px-4 py-2 rounded-full bg-white/[0.03]">
              <span className="text-[#7DD3FC]">↘</span> Widget loads in the bottom-right
            </div>
          </div>
        </div>
      </section>

      <section id="niches" className="py-28 border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#4A90E2] font-mono mb-3">Verticals</div>
          <h2 className="text-[clamp(36px,4.5vw,64px)] leading-[1.05] tracking-[-0.025em] mb-3 max-w-3xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            Where we've <em className="italic font-normal text-[#7DD3FC]">already done</em> the work.
          </h2>
          <p className="text-slate-300 text-[16px] max-w-2xl mb-14 leading-relaxed">
            Each page is a working scope: sample call script, integrations we wire, what the dashboard tracks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            {NICHES.map((n) => (
              <Link key={n.path} to={n.path}
                className="group bg-[#0a1628]/80 backdrop-blur p-6 hover:bg-[#0f2440] transition flex items-center justify-between gap-4">
                <div>
                  <div className="text-[17px] font-medium tracking-tight mb-1 text-white">{n.label}</div>
                  <div className="text-slate-400 text-[13px] leading-snug">{n.line}</div>
                </div>
                <span className="text-slate-500 group-hover:text-[#7DD3FC] group-hover:translate-x-1 transition-all text-xl flex-shrink-0">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-28 border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#4A90E2] font-mono mb-3">Pricing</div>
          <h2 className="text-[clamp(36px,4.5vw,64px)] leading-[1.05] tracking-[-0.025em] mb-3 max-w-3xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            Starting points. <em className="italic font-normal text-[#7DD3FC]">Scope drives the rest.</em>
          </h2>
          <p className="text-slate-300 text-[16px] max-w-2xl mb-14 leading-relaxed">
            Monthly retainer plus pass-through telephony and model usage. We quote firm after scoping — no surprise bills.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            {[
              { name: "Starter", sub: "Solo or single location.", price: "from $899", features: ["1 production agent, 1 vertical", "Single CRM + calendar integration", "Standard business-hours monitoring", "Setup included, no separate fee"] },
              { name: "Pro", sub: "Multi-location, scaling ops.", price: "from $2,400", featured: true, features: ["Multiple agents, multi-vertical", "Custom fine-tune on your data", "Full CRM + ticketing integration", "Weekly refreshes and reviews", "Dedicated engineer hours weekly"] },
              { name: "Platform", sub: "Custom models, embedded work.", price: "from $12,500", features: ["Unlimited agents", "Custom models, you keep the weights", "Embedded engineering", "Private VPC option", "Quarterly roadmap + exec sponsor"] },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 60} className={`p-10 ${p.featured ? "bg-gradient-to-b from-[#0f2847] to-[#0a1628]" : "bg-[#0a1628]/80 backdrop-blur"}`}>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-[20px] font-medium tracking-tight">{p.name}</h3>
                  {p.featured && <span className="text-[10px] tracking-[0.2em] uppercase text-[#7DD3FC] font-mono">Recommended</span>}
                </div>
                <p className="text-slate-400 text-[13px] mb-7">{p.sub}</p>
                <div className="text-[40px] tracking-tight mb-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "#7DD3FC" }}>{p.price}</div>
                <div className="text-slate-500 text-[13px] mb-8">per month</div>
                <ul className="space-y-3 mb-10">
                  {p.features.map((f, j) => (
                    <li key={j} className="text-slate-200 text-[14px] leading-relaxed flex gap-3 items-start">
                      <span className="text-[#4A90E2] mt-1 text-[10px]">●</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href={`mailto:hello@trainyouragent.com?subject=Pricing%20-%20${encodeURIComponent(p.name)}`} className={`inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold transition rounded-full w-full justify-center ${p.featured ? "text-white shadow-lg" : "border border-white/20 hover:border-white/40 text-white"}`}
                  style={p.featured ? { background: "linear-gradient(180deg, #5BA3F5 0%, #4A90E2 100%)", boxShadow: "0 12px 32px -8px rgba(74,144,226,0.55), inset 0 1px 0 rgba(255,255,255,0.25)" } : {}}>
                  Email for scope
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="border border-white/15 p-12 md:p-16 text-center rounded-2xl bg-white/[0.03] backdrop-blur">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#4A90E2] font-mono mb-4">Early customers</div>
            <h2 className="text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-[-0.025em] mb-5 max-w-2xl mx-auto" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
              Real names, real outcomes — <em className="italic font-normal text-[#7DD3FC]">published as customers approve.</em>
            </h2>
            <p className="text-slate-300 text-[16px] max-w-2xl mx-auto leading-relaxed mb-8">
              We're a young company. Instead of stock photos and made-up quotes, email and we'll connect you with a current operator in your vertical so you can hear it firsthand.
            </p>
            <a href="mailto:hello@trainyouragent.com?subject=Reference%20customer%20intro" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold border border-white/20 hover:border-[#7DD3FC] hover:text-[#7DD3FC] transition rounded-full">
              Request a reference call →
            </a>
          </div>
        </div>
      </section>

      <section id="founder" className="py-28 border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[280px,1fr] gap-12">
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#4A90E2] font-mono mb-3">Founder</div>
            <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.025em]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
              Alexander<br /><em className="italic font-normal text-[#7DD3FC]">Mills.</em>
            </h2>
          </div>
          <div className="pt-2">
            <p className="text-slate-200 text-[18px] leading-relaxed mb-6">
              I run TrainYourAgent. I do the discovery calls, I scope the work, I'm on the build week with you. When the agent ships, I'm still your point of contact — no account-manager layer.
            </p>
            <p className="text-slate-400 text-[15px] leading-relaxed mb-8">
              I started this because the gap between "AI demo" and "AI that's actually running your phones" is huge, and almost nobody is willing to cross it for a regional service business. We do.
            </p>
            <a href="mailto:hello@trainyouragent.com?subject=Founder%20intro" className="inline-flex items-center gap-2 text-[15px] text-[#7DD3FC] hover:text-white transition">
              hello@trainyouragent.com →
            </a>
          </div>
        </div>
      </section>

      <section id="book" className="py-32 border-t border-white/10">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#4A90E2] font-mono mb-4">Get started</div>
          <h2 className="text-[clamp(40px,5.5vw,84px)] leading-[1.02] tracking-[-0.03em] mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            One call. <em className="italic font-normal text-[#7DD3FC]">You'll know.</em>
          </h2>
          <p className="text-slate-300 text-[18px] max-w-xl mx-auto mb-10 leading-relaxed">
            30 minutes with me. We'll figure out what's worth automating, what isn't, and a real timeline — before you spend a dollar.
          </p>
          <a href="mailto:hello@trainyouragent.com?subject=Book%20a%20discovery%20call&body=Hi%20Alexander%2C%0A%0AI%27d%20like%20to%20book%20a%20discovery%20call.%20Quick%20context%3A%0A%0ABusiness%3A%0AVertical%3A%0AWhat%20I%27m%20trying%20to%20automate%3A%0APreferred%20time%3A%0A%0AThanks." className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold text-white transition rounded-full shadow-xl"
            style={{ background: "linear-gradient(180deg, #5BA3F5 0%, #4A90E2 100%)", boxShadow: "0 18px 50px -10px rgba(74,144,226,0.55), inset 0 1px 0 rgba(255,255,255,0.25)" }}>
            hello@trainyouragent.com →
          </a>
        </div>
      </section>

      <section id="faq" className="py-28 border-t border-white/10">
        <div className="max-w-[820px] mx-auto px-6">
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#4A90E2] font-mono mb-3">FAQ</div>
          <h2 className="text-[clamp(36px,4.5vw,60px)] leading-[1.05] tracking-[-0.025em] mb-12" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            Common <em className="italic font-normal text-[#7DD3FC]">questions.</em>
          </h2>
          {[
            { q: "What if the agent doesn't know an answer?", a: "It escalates with full call context to your team, captures the question for follow-up, or in regulated verticals refuses cleanly and books a human callback. Every \"I don't know\" enters our eval set and gets fixed in the next refresh." },
            { q: "Do we change phone numbers?", a: "No. We port your existing number or sit in front via SIP routing. Customers dial the number they always dialed." },
            { q: "How is this different from Retell, Vapi, or Voiceflow?", a: "Those are platforms — DIY toolkits you wire up yourself. We're the team. We build, train, deploy, monitor, and refine. Your ops team never opens a flow editor." },
            { q: "Who owns the model and data?", a: "You do. On Pro we license the fine-tune to you. On Platform we hand you the weights, training data export, and ops runbook. Your data is never used to train other customers' models." },
            { q: "What's the SLA?", a: "On Pro and above we offer a 99.9% uptime SLA with service credits when we miss. Actual uptime is published — we don't ask you to take our word for it." },
            { q: "What if we want to leave?", a: "Month-to-month after an initial 90-day commit. Full data export on request. No claw-backs, no destruction theater." },
          ].map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
        </div>
      </section>

      <section className="py-32 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(800px 400px at 50% 50%, rgba(74,144,226,0.2), transparent 60%)" }} />
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr,auto] gap-12 items-end relative">
          <h2 className="text-[clamp(40px,5.5vw,92px)] leading-[1] tracking-[-0.03em] max-w-3xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            Stop running on <em className="italic font-normal text-[#7DD3FC]">yesterday's</em> stack.
          </h2>
          <a href="mailto:hello@trainyouragent.com?subject=Book%20a%20discovery%20call" className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold text-white transition rounded-full shadow-xl whitespace-nowrap"
            style={{ background: "linear-gradient(180deg, #5BA3F5 0%, #4A90E2 100%)", boxShadow: "0 18px 50px -10px rgba(74,144,226,0.55), inset 0 1px 0 rgba(255,255,255,0.25)" }}>
            Email the founder →
          </a>
        </div>
      </section>

      </main>

      <footer className="py-16 border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Logo size={38} />
            <div>
              <div className="text-[15px] font-semibold tracking-tight">TrainYourAgent</div>
              <div className="text-slate-500 text-[12px]">AI That Thinks Like Your Business.</div>
            </div>
          </div>
          <div className="flex gap-6 text-[13px] text-slate-400 flex-wrap">
            <a href="#what" className="hover:text-white transition">What we do</a>
            <a href="#niches" className="hover:text-white transition">Verticals</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#book" className="hover:text-white transition">Book a call</a>
            <a href="mailto:hello@trainyouragent.com" className="hover:text-white transition">Email</a>
          </div>
          <div className="text-slate-600 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
