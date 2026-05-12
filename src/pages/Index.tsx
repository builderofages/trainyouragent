import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * TrainYourAgent — homepage
 * Palette: pure black + bone + single deep-red accent. Serif display headlines.
 * No gradients, no mesh blobs, no glassmorphism. Honest copy only.
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
    <div ref={ref} className={`transition-opacity duration-700 ease-out ${shown ? "opacity-100" : "opacity-0"} ${className}`}>
      {children}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} className="border-t border-stone-200/15 py-6 cursor-pointer group">
      <div className="flex justify-between items-center gap-6">
        <span className="text-[17px] font-medium tracking-tight group-hover:text-red-400 transition">{q}</span>
        <span className={`w-7 h-7 grid place-items-center flex-shrink-0 text-sm font-mono transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </div>
      <div className="text-stone-400 text-[14.5px] leading-relaxed overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: open ? 500 : 0, marginTop: open ? 14 : 0 }}>
        {a}
      </div>
    </div>
  );
}

/* Single-color brand mark — letterform T with serif stroke. */
function Logo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 40 40" style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
        <rect x="1.5" y="1.5" width="37" height="37" rx="2" fill="none" stroke="#C41E3A" strokeWidth="2" />
        <path d="M9 13 L31 13 L31 17 L22 17 L22 31 L18 31 L18 17 L9 17 Z" fill="#F5F0E1" />
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

  // ElevenLabs Convai widget — real conversational agent, bottom-right.
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

  // SEO + branding.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Train Your Agent — done-for-you AI for service businesses";
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
    setMeta('meta[name="description"]', "content", "Done-for-you AI agents for service businesses. We design, train, deploy and run the system. You talk to the founder, not a sales team.");
    setMeta('meta[name="theme-color"]', "content", "#000000");
    setMeta('meta[property="og:title"]', "content", "Train Your Agent");
    setMeta('meta[property="og:description"]', "content", "Done-for-you AI agents for service businesses. Built, deployed and run by us.");
    setMeta('meta[name="twitter:title"]', "content", "Train Your Agent");
    setMeta('meta[name="twitter:description"]', "content", "Done-for-you AI agents for service businesses. Built, deployed and run by us.");
    const favSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect x='1.5' y='1.5' width='37' height='37' rx='2' fill='black' stroke='%23C41E3A' stroke-width='3'/><path d='M9 13 L31 13 L31 17 L22 17 L22 31 L18 31 L18 17 L9 17 Z' fill='%23F5F0E1'/></svg>`;
    let fav = document.head.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (!fav) { fav = document.createElement("link"); fav.rel = "icon"; document.head.appendChild(fav); }
    fav.type = "image/svg+xml";
    fav.href = `data:image/svg+xml,${favSvg}`;
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
        "description": "Done-for-you AI agents for service businesses.",
        "founder": { "@type": "Person", "name": "Alexander Mills" }
      });
      document.head.appendChild(ld);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#F5F0E1] antialiased selection:bg-[#C41E3A] selection:text-white overflow-x-hidden" style={{ fontFamily: '"Geist", system-ui, -apple-system, sans-serif' }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#C41E3A] focus:text-white focus:px-4 focus:py-2 focus:rounded">Skip to content</a>

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${navScrolled ? "bg-black/90 backdrop-blur-xl border-b border-stone-200/10" : "bg-transparent border-b border-transparent"}`}>
        <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-3 font-semibold text-[17px] tracking-tight">
            <Logo size={36} />
            <span>TrainYourAgent</span>
          </Link>
          <div className="hidden md:flex gap-7 items-center text-[14px]">
            <a href="#what" className="text-stone-300 hover:text-[#F5F0E1] transition">What we do</a>
            <a href="#how" className="text-stone-300 hover:text-[#F5F0E1] transition">Process</a>
            <a href="#niches" className="text-stone-300 hover:text-[#F5F0E1] transition">Verticals</a>
            <a href="#pricing" className="text-stone-300 hover:text-[#F5F0E1] transition">Pricing</a>
            <a href="#faq" className="text-stone-300 hover:text-[#F5F0E1] transition">FAQ</a>
          </div>
          <a href="#book" className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold tracking-tight bg-[#C41E3A] hover:bg-[#A01828] text-white transition rounded-sm">Book a call</a>
        </div>
      </nav>

      <main id="main">

      {/* HERO */}
      <header className="pt-40 pb-28 relative border-b border-stone-200/10">
        <div className="max-w-[1240px] mx-auto px-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-10 text-[11px] tracking-[0.2em] uppercase border border-stone-200/15 text-stone-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A]" />
              Done-for-you · One founder, one team
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="text-[clamp(56px,9vw,148px)] leading-[0.92] tracking-[-0.04em] mb-12 max-w-[1100px]"
              style={{ fontFamily: "'Instrument Serif', 'Times New Roman', serif", fontWeight: 400 }}>
              AI that answers<br />
              the phone.<br />
              Built and run<br />
              <span className="text-[#C41E3A]">by us</span>.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-[clamp(17px,1.5vw,22px)] text-stone-400 max-w-[640px] mb-12 leading-relaxed">
              We design, train, deploy and run AI agents for your business. Voice on the phone. Chat on the site. Follow-up over SMS and email. We do the work; you stay focused on running the business.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="flex gap-4 flex-wrap items-center">
              <a href="#book" className="inline-flex items-center gap-2 px-7 py-4 text-[15px] font-semibold bg-[#C41E3A] hover:bg-[#A01828] text-white transition rounded-sm">
                Talk to the founder →
              </a>
              <a href="#how" className="inline-flex items-center gap-2 px-7 py-4 text-[15px] font-semibold border border-stone-200/20 hover:border-stone-200/40 text-stone-200 transition rounded-sm">
                See the process
              </a>
            </div>
          </Reveal>
        </div>
      </header>

      {/* WHAT WE DO — text-led, no cards */}
      <section id="what" className="py-28 border-b border-stone-200/10">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[260px,1fr] gap-12">
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-stone-500 font-mono mb-3">What we do</div>
            <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.025em]" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
              Four things,<br />done well.
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
                <div className="grid grid-cols-[40px,1fr] gap-5 items-start">
                  <div className="text-stone-600 font-mono text-[13px] tracking-wide pt-1">0{i + 1}</div>
                  <div>
                    <h3 className="text-[22px] tracking-tight mb-2 font-medium">{c.t}</h3>
                    <p className="text-stone-400 text-[15.5px] leading-relaxed">{c.b}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="how" className="py-28 border-b border-stone-200/10 bg-[#0a0a0a]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-[11px] tracking-[0.2em] uppercase text-stone-500 font-mono mb-3">How an engagement looks</div>
          <h2 className="text-[clamp(36px,4.5vw,64px)] leading-[1.05] tracking-[-0.025em] mb-3 max-w-3xl" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
            From first call to live, in order.
          </h2>
          <p className="text-stone-400 text-[16px] max-w-2xl mb-16 leading-relaxed">
            Timelines depend on integrations and how clean your existing call data is. The shape doesn't change.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-stone-200/10">
            {[
              { t: "Discovery", b: "30 minutes on Zoom. We listen to recordings if you have them, look at your call flow, and write the scope back to you." },
              { t: "Build", b: "We script, configure, and wire integrations: CRM, calendar, telephony. You see drafts as they ship." },
              { t: "Stress test", b: "You and your team call in. We watch transcripts live and turn failure cases into permanent guardrails." },
              { t: "Cutover", b: "Number ports or SIP redirect. Agent goes live. You get a dashboard for calls, transcripts, and exports." },
              { t: "Run", b: "Weekly refreshes, monthly reviews. Same founder, same number — no account-management layer between us." },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 50} className="bg-black p-8">
                <div className="text-stone-600 font-mono text-[12px] tracking-wide mb-4">STEP / {String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-[19px] tracking-tight mb-2 font-medium">{s.t}</h3>
                <p className="text-stone-400 text-[14px] leading-relaxed">{s.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO — point at the real widget */}
      <section id="demo" className="py-28 border-b border-stone-200/10">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[260px,1fr] gap-12">
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-stone-500 font-mono mb-3">Live demo</div>
            <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.025em]" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
              Talk to it.<br />Right now.
            </h2>
          </div>
          <div className="pt-2">
            <p className="text-stone-300 text-[18px] leading-relaxed mb-6">
              The mic widget in the bottom-right corner is a real ElevenLabs conversational agent. Same voice, same tooling we deploy on customer phone lines.
            </p>
            <p className="text-stone-500 text-[14px] leading-relaxed mb-8">
              Click it. Ask it anything a real caller would. Configured for HVAC right now; we re-train it for your vertical during the build.
            </p>
            <div className="inline-flex items-center gap-3 text-[13px] text-stone-500 font-mono border border-stone-200/15 px-4 py-2 rounded-sm">
              <span className="text-[#C41E3A]">↘</span> Widget loads in the bottom-right
            </div>
          </div>
        </div>
      </section>

      {/* VERTICALS */}
      <section id="niches" className="py-28 border-b border-stone-200/10">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-[11px] tracking-[0.2em] uppercase text-stone-500 font-mono mb-3">Verticals</div>
          <h2 className="text-[clamp(36px,4.5vw,64px)] leading-[1.05] tracking-[-0.025em] mb-3 max-w-3xl" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
            Where we've already done the work.
          </h2>
          <p className="text-stone-400 text-[16px] max-w-2xl mb-14 leading-relaxed">
            Each page is a working scope: sample call script, integrations we wire, what the dashboard tracks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200/10">
            {NICHES.map((n) => (
              <Link key={n.path} to={n.path}
                className="group bg-black p-6 hover:bg-[#0a0a0a] transition flex items-center justify-between gap-4">
                <div>
                  <div className="text-[17px] font-medium tracking-tight mb-1">{n.label}</div>
                  <div className="text-stone-500 text-[13px] leading-snug">{n.line}</div>
                </div>
                <span className="text-stone-600 group-hover:text-[#C41E3A] transition text-xl flex-shrink-0">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28 border-b border-stone-200/10 bg-[#0a0a0a]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-[11px] tracking-[0.2em] uppercase text-stone-500 font-mono mb-3">Pricing</div>
          <h2 className="text-[clamp(36px,4.5vw,64px)] leading-[1.05] tracking-[-0.025em] mb-3 max-w-3xl" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
            Starting points. Scope drives the rest.
          </h2>
          <p className="text-stone-400 text-[16px] max-w-2xl mb-14 leading-relaxed">
            Monthly retainer plus pass-through telephony and model usage. We quote firm after scoping — no surprise bills.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-200/10">
            {[
              { name: "Starter", sub: "Solo or single location.", price: "from $899", features: ["1 production agent, 1 vertical", "Single CRM + calendar integration", "Standard business-hours monitoring", "Setup included, no separate fee"] },
              { name: "Pro", sub: "Multi-location, scaling ops.", price: "from $2,400", featured: true, features: ["Multiple agents, multi-vertical", "Custom fine-tune on your data", "Full CRM + ticketing integration", "Weekly refreshes and reviews", "Dedicated engineer hours weekly"] },
              { name: "Platform", sub: "Custom models, embedded work.", price: "from $12,500", features: ["Unlimited agents", "Custom models, you keep the weights", "Embedded engineering", "Private VPC option", "Quarterly roadmap + exec sponsor"] },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 60} className="bg-black p-10">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-[20px] font-medium tracking-tight">{p.name}</h3>
                  {p.featured && <span className="text-[10px] tracking-[0.2em] uppercase text-[#C41E3A] font-mono">Recommended</span>}
                </div>
                <p className="text-stone-500 text-[13px] mb-7">{p.sub}</p>
                <div className="text-[40px] tracking-tight mb-1" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>{p.price}</div>
                <div className="text-stone-500 text-[13px] mb-8">per month</div>
                <ul className="space-y-3 mb-10">
                  {p.features.map((f, j) => (
                    <li key={j} className="text-stone-300 text-[14px] leading-relaxed flex gap-3 items-start">
                      <span className="text-[#C41E3A] mt-1 text-[10px]">●</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="mailto:hello@trainyouragent.com?subject=Pricing%20-%20{p.name}" className={`inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold transition rounded-sm w-full justify-center ${p.featured ? "bg-[#C41E3A] hover:bg-[#A01828] text-white" : "border border-stone-200/20 hover:border-stone-200/40 text-stone-200"}`}>
                  Email for scope
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EARLY CUSTOMERS — honest panel */}
      <section className="py-24 border-b border-stone-200/10">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="border border-stone-200/15 p-12 md:p-16 text-center">
            <div className="text-[11px] tracking-[0.2em] uppercase text-stone-500 font-mono mb-4">Early customers</div>
            <h2 className="text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-[-0.025em] mb-5 max-w-2xl mx-auto" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
              Real names, real outcomes — published as customers approve.
            </h2>
            <p className="text-stone-400 text-[16px] max-w-2xl mx-auto leading-relaxed mb-8">
              We're a young company. Instead of stock photos and made-up quotes, email and we'll connect you with a current operator in your vertical so you can hear it firsthand.
            </p>
            <a href="mailto:hello@trainyouragent.com?subject=Reference%20customer%20intro" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold border border-stone-200/20 hover:border-[#C41E3A] hover:text-[#C41E3A] transition rounded-sm">
              Request a reference call →
            </a>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section id="founder" className="py-28 border-b border-stone-200/10 bg-[#0a0a0a]">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[260px,1fr] gap-12">
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-stone-500 font-mono mb-3">Founder</div>
            <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.025em]" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
              Alexander<br />Mills.
            </h2>
          </div>
          <div className="pt-2">
            <p className="text-stone-300 text-[18px] leading-relaxed mb-6">
              I run TrainYourAgent. I do the discovery calls, I scope the work, I'm on the build week with you. When the agent ships, I'm still your point of contact — no account-manager layer.
            </p>
            <p className="text-stone-500 text-[15px] leading-relaxed mb-8">
              I started this because the gap between "AI demo" and "AI that's actually running your phones" is huge, and almost nobody is willing to cross it for a regional service business. We do.
            </p>
            <a href="mailto:hello@trainyouragent.com?subject=Founder%20intro" className="inline-flex items-center gap-2 text-[15px] text-[#C41E3A] hover:text-[#F5F0E1] transition">
              hello@trainyouragent.com →
            </a>
          </div>
        </div>
      </section>

      {/* BOOK */}
      <section id="book" className="py-32 border-b border-stone-200/10">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <div className="text-[11px] tracking-[0.2em] uppercase text-stone-500 font-mono mb-4">Get started</div>
          <h2 className="text-[clamp(40px,5.5vw,80px)] leading-[1.02] tracking-[-0.03em] mb-6" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
            One call. You'll know.
          </h2>
          <p className="text-stone-400 text-[18px] max-w-xl mx-auto mb-10 leading-relaxed">
            30 minutes with me. We'll figure out what's worth automating, what isn't, and a real timeline — before you spend a dollar.
          </p>
          <a href="mailto:hello@trainyouragent.com?subject=Book%20a%20discovery%20call&body=Hi%20Alexander%2C%0A%0AI%27d%20like%20to%20book%20a%20discovery%20call.%20Quick%20context%3A%0A%0ABusiness%3A%0AVertical%3A%0AWhat%20I%27m%20trying%20to%20automate%3A%0APreferred%20time%3A%0A%0AThanks." className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold bg-[#C41E3A] hover:bg-[#A01828] text-white transition rounded-sm">
            hello@trainyouragent.com →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 border-b border-stone-200/10">
        <div className="max-w-[820px] mx-auto px-6">
          <div className="text-[11px] tracking-[0.2em] uppercase text-stone-500 font-mono mb-3">FAQ</div>
          <h2 className="text-[clamp(36px,4.5vw,60px)] leading-[1.05] tracking-[-0.025em] mb-12" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
            Common questions.
          </h2>
          {[
            { q: "What if the agent doesn't know an answer?", a: "It escalates with full call context to your team, captures the question for follow-up, or in regulated verticals refuses cleanly and books a human callback. Every \"I don't know\" enters our eval set and gets fixed in the next refresh." },
            { q: "Do we change phone numbers?", a: "No. We port your existing number or sit in front via SIP routing. Customers dial the number they always dialed." },
            { q: "How is this different from Retell, Vapi, or Voiceflow?", a: "Those are platforms — DIY toolkits you wire up yourself. We're the team. We build, train, deploy, monitor, and refine. Your ops team never opens a flow editor." },
            { q: "Who owns the model and data?", a: "You do. On Pro we license the fine-tune to you. On Platform we hand you the weights, training data export, and ops runbook. Your data is never used to train other customers' models." },
            { q: "What's the SLA?", a: "On Pro and above we offer a 99.9% uptime SLA with service credits when we miss. Actual uptime is published — we don't ask you to take our word for it." },
            { q: "HIPAA, SOC 2 — what's the security story?", a: "SOC 2 Type II is in progress. HIPAA-ready architecture today. Private VPC deploys on Platform. We can sit through your security review with our security lead — email us for the current SIG-Lite." },
            { q: "What if we want to leave?", a: "Month-to-month after an initial 90-day commit. Full data export on request. No claw-backs, no destruction theater." },
          ].map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* FINAL CTA — full bleed red */}
      <section className="py-28 bg-[#C41E3A] text-white">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr,auto] gap-12 items-end">
          <h2 className="text-[clamp(40px,5.5vw,84px)] leading-[1] tracking-[-0.03em] max-w-3xl" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
            Stop running on yesterday's stack.
          </h2>
          <a href="mailto:hello@trainyouragent.com?subject=Book%20a%20discovery%20call" className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold bg-black hover:bg-[#0a0a0a] text-white transition rounded-sm whitespace-nowrap">
            Email the founder →
          </a>
        </div>
      </section>

      </main>

      {/* FOOTER */}
      <footer className="py-16 bg-black">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <div className="text-[15px] font-semibold tracking-tight">TrainYourAgent</div>
              <div className="text-stone-500 text-[12px]">Built in Florida, USA.</div>
            </div>
          </div>
          <div className="flex gap-8 text-[13px] text-stone-400">
            <a href="#what" className="hover:text-[#F5F0E1] transition">What we do</a>
            <a href="#niches" className="hover:text-[#F5F0E1] transition">Verticals</a>
            <a href="#pricing" className="hover:text-[#F5F0E1] transition">Pricing</a>
            <a href="#book" className="hover:text-[#F5F0E1] transition">Book a call</a>
            <a href="mailto:hello@trainyouragent.com" className="hover:text-[#F5F0E1] transition">Email</a>
          </div>
          <div className="text-stone-600 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
