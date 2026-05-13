import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * TrainYourAgent — homepage v16
 * Cal.com booking, LinkedIn-linked founder, LLM partner badges, mobile nav, legal-tight HIPAA copy.
 */

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";

const NICHES = [
  { path: "/roofing",         label: "Roofing",        line: "Storm-surge call capture, insurance triage." },
  { path: "/hvac",            label: "HVAC",           line: "After-hours dispatch, service-call booking." },
  { path: "/solar",           label: "Solar",          line: "Consultation scheduling, qualification gate." },
  { path: "/gym",             label: "Gym & Fitness",  line: "Membership tours, cancellation save flows." },
  { path: "/healthcare",      label: "Healthcare",     line: "Patient intake (BAA per customer)." },
  { path: "/legal",           label: "Legal",          line: "Conflict check, consult scheduling." },
  { path: "/real-estate",     label: "Real Estate",    line: "Showing requests, qualification by budget." },
  { path: "/automotive",      label: "Automotive",     line: "Test-drive booking, parts inquiries." },
  { path: "/spas",            label: "Med Spa",        line: "Treatment consults, pre-screen forms." },
  { path: "/hotels",          label: "Hotels",         line: "Reservation taking, upsell on stay." },
  { path: "/bars-nightclubs", label: "Bars / Clubs",   line: "Table requests, guestlist sign-up." },
  { path: "/logistics",       label: "Logistics",      line: "Pickup quotes, dispatch routing." },
  { path: "/accounting",      label: "Accounting",     line: "Discovery intake, scope qualification." },
  { path: "/solutions",       label: "Agencies",       line: "White-label client intake at scale." },
];

const LLM_PARTNERS = [
  "Anthropic Claude", "OpenAI GPT-4", "Google Gemini", "Meta Llama", "Mistral",
  "ElevenLabs", "Deepgram", "Cartesia", "Whisper",
];
const STACK_PARTNERS = [
  "Twilio", "Cal.com", "ServiceTitan", "HubSpot", "Salesforce", "Stripe",
  "Google Calendar", "Zapier", "Make", "n8n", "Apollo", "Slack", "Notion", "Vercel", "Supabase",
];

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
    <div onClick={() => setOpen(!open)} className="border-t border-slate-200 py-6 cursor-pointer group">
      <div className="flex justify-between items-center gap-6">
        <span className="text-[17px] font-medium tracking-tight text-[#042C53] group-hover:text-[#185FA5] transition">{q}</span>
        <span className={`w-7 h-7 grid place-items-center flex-shrink-0 text-base font-mono text-[#185FA5] transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </div>
      <div className="text-slate-600 text-[14.5px] leading-relaxed overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: open ? 600 : 0, marginTop: open ? 14 : 0 }}>
        {a}
      </div>
    </div>
  );
}

function RoiCalculator() {
  const [calls, setCalls] = useState(140);
  const [missedRate, setMissedRate] = useState(35);
  const [avgValue, setAvgValue] = useState(180);
  const missed = useMemo(() => Math.round(calls * (missedRate / 100)), [calls, missedRate]);
  const capturedPerMonth = useMemo(() => Math.round(missed * 30 * 0.7), [missed]);
  const monthlyValue = useMemo(() => capturedPerMonth * avgValue, [capturedPerMonth, avgValue]);
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-7 md:p-9">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[#185FA5]" />
        <span className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono">ROI calculator</span>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <label className="block">
            <span className="text-[13px] text-slate-600 flex justify-between mb-2">Inbound calls / day <span className="font-mono text-[#042C53] font-medium">{calls}</span></span>
            <input type="range" min="20" max="500" value={calls} onChange={(e) => setCalls(+e.target.value)} className="w-full accent-[#185FA5]" />
          </label>
          <label className="block">
            <span className="text-[13px] text-slate-600 flex justify-between mb-2">% currently missed <span className="font-mono text-[#042C53] font-medium">{missedRate}%</span></span>
            <input type="range" min="5" max="80" value={missedRate} onChange={(e) => setMissedRate(+e.target.value)} className="w-full accent-[#185FA5]" />
          </label>
          <label className="block">
            <span className="text-[13px] text-slate-600 flex justify-between mb-2">Avg ticket value <span className="font-mono text-[#042C53] font-medium">${avgValue}</span></span>
            <input type="range" min="40" max="2000" step="10" value={avgValue} onChange={(e) => setAvgValue(+e.target.value)} className="w-full accent-[#185FA5]" />
          </label>
        </div>
        <div className="bg-[#F4F7FB] rounded-2xl p-6 flex flex-col justify-center">
          <div className="text-[11px] tracking-[0.2em] uppercase text-slate-500 font-mono mb-2">Estimated capture / month</div>
          <div className="text-[44px] leading-none tracking-tight text-[#185FA5] mb-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            ${monthlyValue.toLocaleString()}
          </div>
          <div className="text-[12.5px] text-slate-600">{capturedPerMonth.toLocaleString()} captured calls × ${avgValue} avg</div>
          <div className="mt-4 pt-4 border-t border-slate-200 text-[12px] text-slate-500 leading-relaxed">
            Estimate assumes the agent recovers 70% of currently-missed calls into a qualified booking. Real recovery rate varies by vertical — we publish your actual rate weekly once live.
          </div>
        </div>
      </div>
    </div>
  );
}

const TRANSCRIPT: { who: "caller" | "agent" | "system"; text: string }[] = [
  { who: "caller", text: "Hey, my AC stopped overnight — house is at 84." },
  { who: "agent",  text: "Sorry about that. I can get a tech to you today. What's the zip?" },
  { who: "caller", text: "33602, Tampa." },
  { who: "agent",  text: "Got it. Earliest window is 1–3pm. Should I book it?" },
  { who: "caller", text: "Yes please." },
  { who: "system", text: "→ Booked · ServiceTitan · Tech: M. Alvarez · Confirmation sent" },
];

function LiveTranscript() {
  const [visible, setVisible] = useState(1);
  useEffect(() => {
    if (visible >= TRANSCRIPT.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 1400);
    return () => clearTimeout(t);
  }, [visible]);
  return (
    <div className="bg-[#042C53] text-white rounded-3xl p-7 md:p-9 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 20% 0%, white 0%, transparent 50%)" }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#378ADD] animate-pulse" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#85B7EB] font-mono">Live transcript · sample call</span>
          </div>
          <button onClick={() => setVisible(1)} className="text-[11px] text-[#85B7EB] hover:text-white transition font-mono uppercase tracking-wider">Replay</button>
        </div>
        <div className="space-y-3 font-mono text-[13.5px] leading-relaxed min-h-[230px]">
          {TRANSCRIPT.slice(0, visible).map((row, i) => (
            <div key={i} className="flex gap-3 animate-fade-in">
              <span className={`flex-shrink-0 w-16 ${row.who === "caller" ? "text-[#85B7EB]" : row.who === "agent" ? "text-[#9FE1CB]" : "text-slate-400"}`}>{row.who}:</span>
              <span className={row.who === "system" ? "text-slate-400 text-[12.5px]" : "text-white"}>{row.text}</span>
            </div>
          ))}
          {visible < TRANSCRIPT.length && (
            <div className="flex gap-3 opacity-60">
              <span className="w-16 text-slate-400">···</span>
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#378ADD] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#378ADD] animate-bounce" style={{ animationDelay: "120ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#378ADD] animate-bounce" style={{ animationDelay: "240ms" }} />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter+Tight:wght@400;500;600;700&display=swap";
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
    setMeta('meta[name="description"]', "content", "Custom AI voice + chat agents for service businesses. Built, trained, deployed and run by us. Powered by Claude, GPT-4, Gemini, ElevenLabs.");
    setMeta('meta[name="theme-color"]', "content", "#FAFBFC");
    setMeta('meta[property="og:title"]', "content", "TrainYourAgent — AI That Thinks Like Your Business");
    setMeta('meta[property="og:description"]', "content", "Custom AI agents for every industry. Deploy in days. Built by Alexander Mills out of Tampa Bay.");
    setMeta('meta[property="og:image"]', "content", "/og-image.jpg");
    setMeta('meta[property="og:url"]', "content", "https://trainyouragent.com");
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", "TrainYourAgent — AI That Thinks Like Your Business");
    setMeta('meta[name="twitter:description"]', "content", "Custom AI agents for service businesses. Deploy in days.");
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
        "description": "Custom AI voice and chat agents for service businesses.",
        "founder": { "@type": "Person", "name": "Alexander Mills", "sameAs": LINKEDIN_URL },
        "areaServed": "United States",
        "address": { "@type": "PostalAddress", "addressRegion": "FL", "addressLocality": "Tampa Bay", "addressCountry": "US" }
      });
      document.head.appendChild(ld);
    }
    if (!document.getElementById("tya-faq-jsonld")) {
      const faqLd = document.createElement("script");
      faqLd.id = "tya-faq-jsonld";
      faqLd.type = "application/ld+json";
      faqLd.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "How is this different from Vapi, Retell, or Voiceflow?", "acceptedAnswer": { "@type": "Answer", "text": "Those are DIY toolkits. We're the team. We build, train, deploy, monitor, and refresh." } },
          { "@type": "Question", "name": "What models do you use?", "acceptedAnswer": { "@type": "Answer", "text": "Anthropic Claude, OpenAI GPT-4, Google Gemini, Meta Llama, Mistral, with ElevenLabs and Deepgram for voice. Model choice per customer." } },
          { "@type": "Question", "name": "How fast can we deploy?", "acceptedAnswer": { "@type": "Answer", "text": "3 to 7 days from discovery call to live phone line." } }
        ]
      });
      document.head.appendChild(faqLd);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-[#042C53] antialiased selection:bg-[#185FA5] selection:text-white overflow-x-hidden"
      style={{ fontFamily: "'Inter Tight', 'Inter', system-ui, -apple-system, sans-serif" }}>
      <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } } .animate-fade-in { animation: fade-in 0.35s ease-out both }`}</style>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#185FA5] focus:text-white focus:px-4 focus:py-2 focus:rounded">Skip to content</a>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${navScrolled ? "bg-white/85 backdrop-blur-xl border-b border-slate-200/80" : "bg-transparent border-b border-transparent"}`}>
        <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-2.5 font-semibold text-[17px] tracking-tight text-[#042C53]">
            <BrainLogo size={36} />
            <span>TrainYourAgent</span>
          </Link>
          <div className="hidden md:flex gap-7 items-center text-[14px]">
            <a href="#what" className="text-slate-600 hover:text-[#042C53] transition">What we do</a>
            <a href="#demo" className="text-slate-600 hover:text-[#042C53] transition">Demo</a>
            <a href="#niches" className="text-slate-600 hover:text-[#042C53] transition">Verticals</a>
            <a href="#pricing" className="text-slate-600 hover:text-[#042C53] transition">Pricing</a>
            <a href="#faq" className="text-slate-600 hover:text-[#042C53] transition">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <a href={CAL_URL} target="_blank" rel="noopener" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold tracking-tight text-white bg-[#185FA5] hover:bg-[#0C447C] transition rounded-full shadow-[0_8px_20px_-6px_rgba(24,95,165,0.45)]">
              Book a call
            </a>
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" className="md:hidden w-10 h-10 grid place-items-center rounded-full border border-slate-200 bg-white">
              <span className="block w-4 h-px bg-[#042C53] relative" style={{ boxShadow: mobileOpen ? "none" : "0 -5px 0 #042C53, 0 5px 0 #042C53", transform: mobileOpen ? "rotate(45deg)" : "none" }} />
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4">
            <div className="flex flex-col gap-4 text-[15px]">
              <a href="#what" onClick={() => setMobileOpen(false)} className="text-slate-700 hover:text-[#042C53]">What we do</a>
              <a href="#demo" onClick={() => setMobileOpen(false)} className="text-slate-700 hover:text-[#042C53]">Demo</a>
              <a href="#niches" onClick={() => setMobileOpen(false)} className="text-slate-700 hover:text-[#042C53]">Verticals</a>
              <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-slate-700 hover:text-[#042C53]">Pricing</a>
              <a href="#faq" onClick={() => setMobileOpen(false)} className="text-slate-700 hover:text-[#042C53]">FAQ</a>
              <a href={CAL_URL} target="_blank" rel="noopener" className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 text-[14px] font-semibold text-white bg-[#185FA5] rounded-full">Book a call →</a>
            </div>
          </div>
        )}
      </nav>

      <main id="main">

      {/* HERO */}
      <header className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(900px 500px at 80% -10%, rgba(133,183,235,0.25), transparent 60%), radial-gradient(700px 400px at 10% 0%, rgba(230,241,251,0.6), transparent 60%)" }} />
        <div className="max-w-[1240px] mx-auto px-6 relative">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-9 text-[11px] tracking-[0.18em] uppercase border border-slate-200 bg-white text-slate-600 font-mono rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#185FA5] animate-pulse" />
              Custom AI agents · deploy in days · Tampa Bay
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="text-[clamp(46px,7.5vw,112px)] leading-[0.98] tracking-[-0.025em] mb-8 max-w-[1100px]"
              style={{ fontFamily: "'Playfair Display', 'Times New Roman', serif", fontWeight: 500, color: "#042C53" }}>
              AI <em className="italic font-normal" style={{ color: "#185FA5" }}>that thinks</em><br />
              like your business.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-[clamp(17px,1.45vw,21px)] text-slate-600 max-w-[640px] mb-10 leading-relaxed">
              Custom voice + chat AI agents for service businesses. Built, trained, deployed and run by one team. Powered by Claude, GPT-4, Gemini, ElevenLabs — whichever model fits your call.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="flex gap-3 flex-wrap items-center">
              <a href={CAL_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white bg-[#185FA5] hover:bg-[#0C447C] transition rounded-full shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_14px_36px_-10px_rgba(24,95,165,0.5)]">
                Book a 30-min discovery call →
              </a>
              <a href="#demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-[#042C53] bg-white hover:bg-slate-50 border border-slate-200 transition rounded-full">
                Hear the agent live
              </a>
            </div>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 rounded-3xl overflow-hidden border border-slate-200">
              {[
                { k: "3–7", v: "Day deployment" },
                { k: "24/7", v: "Always-on agent" },
                { k: "<1.2s", v: "Avg response" },
                { k: "1", v: "Founder, no layers" },
              ].map((s, i) => (
                <div key={i} className="bg-white p-6 md:p-7">
                  <div className="text-[32px] leading-none tracking-tight" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "#185FA5" }}>{s.k}</div>
                  <div className="text-slate-500 text-[12px] tracking-wide uppercase font-mono mt-2">{s.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </header>

      {/* POWERED BY — LLM + tech partners */}
      <section className="py-14 border-t border-slate-200 bg-white">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-2">Powered by the best</div>
            <p className="text-slate-600 text-[14px]">Model-agnostic. We pick the right LLM and voice stack for your use-case — and swap when something better ships.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {LLM_PARTNERS.map((b) => (
              <span key={b} className="text-[12.5px] font-mono text-[#042C53] bg-[#E6F1FB] border border-[#B5D4F4] px-3 py-1.5 rounded-full">{b}</span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {STACK_PARTNERS.map((b) => (
              <span key={b} className="text-[12px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO — bento grid */}
      <section id="what" className="py-24">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex items-baseline justify-between flex-wrap gap-6 mb-10">
            <div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-3">What we do</div>
              <h2 className="text-[clamp(34px,4.2vw,56px)] leading-[1.02] tracking-[-0.02em] max-w-2xl"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#042C53" }}>
                Four products, <em className="italic font-normal" style={{ color: "#185FA5" }}>one team</em>, end-to-end.
              </h2>
            </div>
            <p className="text-slate-600 max-w-md text-[15px] leading-relaxed">We don't sell software. We design, train and operate the system. You stay focused on running the business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            <div className="md:col-span-4 bg-white border border-slate-200 rounded-3xl p-8 md:p-10 hover:border-[#85B7EB] transition relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-30 group-hover:opacity-50 transition" style={{ background: "radial-gradient(circle, #B5D4F4 0%, transparent 70%)" }} />
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#185FA5]" />
                <span className="text-[11px] tracking-[0.2em] uppercase text-slate-500 font-mono">01 · voice agents</span>
              </div>
              <h3 className="text-[26px] tracking-tight mb-3 font-medium" style={{ color: "#042C53" }}>Your phone line, answered by AI.</h3>
              <p className="text-slate-600 text-[15.5px] leading-relaxed max-w-md mb-6">Books appointments, qualifies leads, escalates the calls that need a human. Trained on your actual recordings — sounds like your business, not a chatbot.</p>
              <div className="inline-flex items-center gap-2 text-[12px] text-[#185FA5] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#185FA5] animate-pulse" />
                Live demo loaded on this page →
              </div>
            </div>
            <div className="md:col-span-2 bg-[#042C53] text-white rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 80% 100%, white 0%, transparent 50%)" }} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#85B7EB]" />
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#85B7EB] font-mono">02 · chat + sms</span>
                </div>
                <h3 className="text-[22px] tracking-tight mb-3 font-medium">Same brain, every channel.</h3>
                <p className="text-[#B5D4F4] text-[14.5px] leading-relaxed">Picks up where a missed call left off. Texts back. Fills the calendar.</p>
              </div>
            </div>
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#185FA5]" />
                <span className="text-[11px] tracking-[0.2em] uppercase text-slate-500 font-mono">03 · custom fine-tunes</span>
              </div>
              <h3 className="text-[22px] tracking-tight mb-3 font-medium" style={{ color: "#042C53" }}>Trained on your calls.</h3>
              <p className="text-slate-600 text-[14.5px] leading-relaxed">We use your real recordings or scripts. You keep the model and the weights.</p>
            </div>
            <div className="md:col-span-4 bg-white border border-slate-200 rounded-3xl p-8 md:p-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#185FA5]" />
                <span className="text-[11px] tracking-[0.2em] uppercase text-slate-500 font-mono">04 · integrations + ops</span>
              </div>
              <h3 className="text-[22px] tracking-tight mb-3 font-medium" style={{ color: "#042C53" }}>Hooks into your stack. We run it.</h3>
              <p className="text-slate-600 text-[14.5px] leading-relaxed max-w-md mb-5">CRM, calendar, telephony, ticketing. We monitor, refresh, patch. You don't see the wires.</p>
              <div className="flex flex-wrap gap-2">
                {["ServiceTitan","HubSpot","Salesforce","Twilio","Zapier","Google Cal","Stripe","Cal.com","Slack","Notion"].map((b) => (
                  <span key={b} className="text-[12px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO + ROI */}
      <section id="demo" className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-3">Try it on the page</div>
            <h2 className="text-[clamp(36px,4.5vw,64px)] leading-[1.02] tracking-[-0.025em] max-w-3xl mx-auto" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#042C53" }}>
              See the agent <em className="italic font-normal" style={{ color: "#185FA5" }}>actually run</em>.
            </h2>
            <p className="text-slate-600 text-[16px] max-w-xl mx-auto mt-4 leading-relaxed">A real conversational agent. Click the mic in the bottom-right or watch a sample call below.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <LiveTranscript />
            <RoiCalculator />
          </div>
        </div>
      </section>

      {/* VERTICALS */}
      <section id="niches" className="py-24">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-3">Verticals</div>
          <h2 className="text-[clamp(36px,4.5vw,64px)] leading-[1.02] tracking-[-0.025em] mb-4 max-w-3xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#042C53" }}>
            Where we've <em className="italic font-normal" style={{ color: "#185FA5" }}>already done</em> the work.
          </h2>
          <p className="text-slate-600 text-[16px] max-w-2xl mb-12 leading-relaxed">
            Each page is a real scope: sample call script, integrations we wire, what the dashboard tracks. Healthcare deploys under a signed Business Associate Agreement per customer.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {NICHES.map((n) => (
              <Link key={n.path} to={n.path} className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#185FA5] hover:shadow-[0_8px_24px_-12px_rgba(24,95,165,0.25)] transition flex items-center justify-between gap-4">
                <div>
                  <div className="text-[16px] font-medium tracking-tight mb-1 text-[#042C53]">{n.label}</div>
                  <div className="text-slate-500 text-[13px] leading-snug">{n.line}</div>
                </div>
                <span className="text-slate-400 group-hover:text-[#185FA5] group-hover:translate-x-1 transition-all text-xl flex-shrink-0">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-3">Pricing</div>
            <h2 className="text-[clamp(36px,4.5vw,60px)] leading-[1.02] tracking-[-0.025em] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#042C53" }}>
              Starting points. <em className="italic font-normal" style={{ color: "#185FA5" }}>Scope drives the rest.</em>
            </h2>
            <p className="text-slate-600 text-[16px] max-w-xl mx-auto leading-relaxed">Monthly retainer + pass-through telephony and model usage. Firm quote after scoping.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Starter", sub: "Solo or single location.", price: "from $899", features: ["1 production agent, 1 vertical", "Single CRM + calendar integration", "Standard business-hours monitoring", "Setup included, no separate fee"] },
              { name: "Pro", sub: "Multi-location, scaling ops.", price: "from $2,400", featured: true, features: ["Multiple agents, multi-vertical", "Custom fine-tune on your data", "Full CRM + ticketing integration", "Weekly refreshes & reviews", "Dedicated engineer hours weekly"] },
              { name: "Platform", sub: "Custom models, embedded work.", price: "from $12,500", features: ["Unlimited agents", "Custom model selection per use-case", "Embedded engineering", "Healthcare BAA + HIPAA-aware build available", "Quarterly roadmap with founder"] },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 60} className={`rounded-3xl p-8 md:p-9 transition ${p.featured ? "bg-[#042C53] text-white border-2 border-[#185FA5] shadow-[0_20px_60px_-20px_rgba(24,95,165,0.5)]" : "bg-white border border-slate-200 text-[#042C53]"}`}>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-[19px] font-medium tracking-tight">{p.name}</h3>
                  {p.featured && <span className="text-[10px] tracking-[0.2em] uppercase text-[#85B7EB] font-mono">Recommended</span>}
                </div>
                <p className={`text-[13px] mb-7 ${p.featured ? "text-[#85B7EB]" : "text-slate-500"}`}>{p.sub}</p>
                <div className="text-[40px] leading-none tracking-tight mb-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: p.featured ? "#85B7EB" : "#185FA5" }}>{p.price}</div>
                <div className={`text-[13px] mb-8 ${p.featured ? "text-[#B5D4F4]" : "text-slate-500"}`}>per month</div>
                <ul className="space-y-3 mb-9">
                  {p.features.map((f, j) => (
                    <li key={j} className={`text-[14px] leading-relaxed flex gap-3 items-start ${p.featured ? "text-white" : "text-[#042C53]"}`}>
                      <span className={`mt-1.5 text-[8px] ${p.featured ? "text-[#85B7EB]" : "text-[#185FA5]"}`}>●</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href={CAL_URL} target="_blank" rel="noopener"
                  className={`inline-flex items-center justify-center gap-2 w-full px-5 py-3 text-[14px] font-semibold transition rounded-full ${p.featured ? "bg-white text-[#042C53] hover:bg-slate-100" : "bg-[#042C53] text-white hover:bg-[#0C447C]"}`}>
                  Book a scoping call →
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — skeleton, hidden until populated */}
      <section className="py-20">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-3">Customer voices</div>
            <h2 className="text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-[-0.02em] max-w-2xl mx-auto" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#042C53" }}>
              Operators who've <em className="italic font-normal" style={{ color: "#185FA5" }}>shipped with us</em>.
            </h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-10 md:p-14 max-w-3xl mx-auto text-center">
            <p className="text-slate-600 text-[15.5px] leading-relaxed mb-8">
              Customer quotes get added here as operators give us permission to publish. Want to verify with a real reference? Book a call and we'll connect you with a current operator in your vertical.
            </p>
            <a href={CAL_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold border border-slate-300 text-[#042C53] hover:border-[#185FA5] hover:text-[#185FA5] transition rounded-full">
              Request a reference call →
            </a>
          </div>
        </div>
      </section>

      {/* FOUNDER — with LinkedIn + Tampa Bay */}
      <section id="founder" className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-[1240px] mx-auto px-6 grid md:grid-cols-[300px,1fr] gap-12">
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-3">Founder</div>
            <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.02] tracking-[-0.02em] mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#042C53" }}>
              Alexander<br /><em className="italic font-normal" style={{ color: "#185FA5" }}>Mills.</em>
            </h2>
            <div className="text-[13px] text-slate-500 font-mono space-y-1">
              <div>Tampa Bay, FL</div>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="block text-[#185FA5] hover:text-[#042C53] transition">LinkedIn ↗</a>
            </div>
          </div>
          <div className="pt-2 max-w-2xl">
            <p className="text-[#042C53] text-[18px] leading-relaxed mb-5">
              I run TrainYourAgent out of Tampa Bay. AI founder building voice agents and autonomous AI that generate leads and cut ops costs for service businesses. I do the discovery calls myself, I scope the work, I'm on the build week with you.
            </p>
            <p className="text-slate-600 text-[15px] leading-relaxed mb-7">
              When the agent ships, I'm still your point of contact — no account-manager layer. I started this because the gap between "AI demo" and "AI that's actually running your phones" is huge, and almost nobody is willing to cross it for a regional service business. We do.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href={CAL_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-[#185FA5] hover:bg-[#0C447C] transition rounded-full">
                Book 30 min with me →
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-[#042C53] bg-white hover:bg-slate-50 border border-slate-200 transition rounded-full">
                Connect on LinkedIn →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BOOK CTA */}
      <section id="book" className="py-28">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-4">Get started</div>
          <h2 className="text-[clamp(40px,5.5vw,84px)] leading-[1] tracking-[-0.03em] mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#042C53" }}>
            One call. <em className="italic font-normal" style={{ color: "#185FA5" }}>You'll know.</em>
          </h2>
          <p className="text-slate-600 text-[18px] max-w-xl mx-auto mb-10 leading-relaxed">30 minutes with me. We'll figure out what's worth automating, what isn't, and a real timeline — before you spend a dollar.</p>
          <a href={CAL_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold text-white bg-[#185FA5] hover:bg-[#0C447C] transition rounded-full shadow-[0_18px_50px_-12px_rgba(24,95,165,0.55)]">
            Book on Cal.com →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-[820px] mx-auto px-6">
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-3">FAQ</div>
          <h2 className="text-[clamp(36px,4.5vw,60px)] leading-[1.02] tracking-[-0.025em] mb-10" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#042C53" }}>
            Common <em className="italic font-normal" style={{ color: "#185FA5" }}>questions.</em>
          </h2>
          {[
            { q: "What models do you use?", a: "Model-agnostic. Anthropic Claude, OpenAI GPT-4, Google Gemini, Meta Llama, and Mistral on the language side. ElevenLabs, Deepgram, and Cartesia on voice. We pick what fits your call profile and swap when something better ships." },
            { q: "What if the AI hallucinates or goes off-script?", a: "It only answers within the script and knowledge base we author with you. Out-of-domain questions trigger a clean refusal plus a human callback. Every \"I don't know\" enters our eval set and gets a permanent guardrail in the next refresh. The refusal log is in your dashboard." },
            { q: "Do we change phone numbers?", a: "No. We port your existing number or sit in front via SIP routing. Customers dial the number they always dialed." },
            { q: "How is this different from Retell, Vapi, or Voiceflow?", a: "Those are DIY platforms. We're the team. We build the script, train the model, wire the integrations, monitor the calls, fix the failures, and refresh weekly. Your ops team never opens a flow editor — the labor is the product." },
            { q: "Who owns the model and data?", a: "You do. On Pro we license the fine-tune to you. On Platform we hand you the training data export and ops runbook. Your data is never used to train other customers' models." },
            { q: "Where does my data live and is this HIPAA-compliant for healthcare?", a: "Call recordings and transcripts live in our SOC 2-aligned infrastructure (or your own S3 bucket on Platform tier). For healthcare customers, we sign a Business Associate Agreement (BAA) per customer and deploy in a HIPAA-aware configuration — encrypted storage, audit logs, access controls, documented retention. We're not a Covered Entity ourselves; HIPAA compliance depends on the BAA and your covered-entity policies being in place." },
            { q: "Security posture in plain English?", a: "Encryption at rest and in transit, audit logs on every call, least-privilege access, region-locked deployments on request. SOC 2 program in evaluation. Send your security questionnaire and we'll fill it on the call." },
            { q: "What if we want to leave?", a: "Month-to-month after a 90-day commit. Full data export on request. You keep the phone number and recordings. No claw-back, no destruction theater." },
          ].map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(800px 400px at 50% 50%, rgba(133,183,235,0.4), transparent 65%)" }} />
        <div className="max-w-[1240px] mx-auto px-6 grid md:grid-cols-[1fr,auto] gap-10 items-end relative">
          <h2 className="text-[clamp(36px,5vw,80px)] leading-[1.02] tracking-[-0.025em] max-w-3xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#042C53" }}>
            Stop running on <em className="italic font-normal" style={{ color: "#185FA5" }}>yesterday's</em> stack.
          </h2>
          <a href={CAL_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold text-white bg-[#185FA5] hover:bg-[#0C447C] transition rounded-full shadow-[0_18px_50px_-12px_rgba(24,95,165,0.55)] whitespace-nowrap">
            Book a call →
          </a>
        </div>
      </section>

      </main>

      <footer className="py-14 bg-[#FAFBFC] border-t border-slate-200">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <BrainLogo size={36} />
            <div>
              <div className="text-[15px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</div>
              <div className="text-slate-500 text-[12px]">AI that thinks like your business. Tampa Bay, FL.</div>
            </div>
          </div>
          <div className="flex gap-6 text-[13px] text-slate-600 flex-wrap">
            <a href="#what" className="hover:text-[#042C53] transition">What we do</a>
            <a href="#niches" className="hover:text-[#042C53] transition">Verticals</a>
            <a href="#pricing" className="hover:text-[#042C53] transition">Pricing</a>
            <a href={CAL_URL} target="_blank" rel="noopener" className="hover:text-[#042C53] transition">Book a call</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53] transition">LinkedIn</a>
            <a href="mailto:hello@trainyouragent.com" className="hover:text-[#042C53] transition">Email</a>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
