import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";

/**
 * TrainYourAgent — elite homepage v2
 * Adds: real Web Speech voice demo (Tya speaks + listens), niche-aware scripts,
 * Cal.com inline embed, Airtable form embed, particle background, marquee logos,
 * spotlight cursor, magnetic CTAs, scroll-driven hero. Self-contained.
 */

const NICHES = [
  { key: "roofing",    label: "Roofing",        biz: "Apex Roofing",          q: "free roof inspection",    book: "Tuesday at 9am or Thursday at 2pm" },
  { key: "solar",      label: "Solar",          biz: "Sunline Solar",         q: "solar consultation",       book: "Tuesday at 10am or Friday at 1pm" },
  { key: "hvac",       label: "HVAC",           biz: "Ridgeline HVAC",        q: "AC service appointment",   book: "today between 1 and 3pm" },
  { key: "gym",        label: "Gym & Fitness",  biz: "Forge Fitness",         q: "membership tour",          book: "Saturday at 10am or Sunday at 2pm" },
  { key: "dental",     label: "Dental",         biz: "Brightside Dental",     q: "new-patient cleaning",     book: "next Wednesday at 11am" },
  { key: "med",        label: "Healthcare",     biz: "Northstar Dermatology", q: "dermatology follow-up",    book: "Thursday at 2pm or next Tuesday at 9:30am" },
  { key: "legal",      label: "Legal",          biz: "Vertex Legal",          q: "consult with an attorney", book: "tomorrow at 10am" },
  { key: "real",       label: "Real Estate",    biz: "Park & Pine Realty",    q: "listing tour",             book: "tomorrow at 4pm with Sarah" },
  { key: "auto",       label: "Auto",           biz: "Atlas Auto Group",      q: "test drive",               book: "Saturday at 10am or 11:30am" },
  { key: "medspa",     label: "Med Spa",        biz: "Glow Aesthetics",       q: "Botox consultation",       book: "Friday at 4pm" },
  { key: "vet",        label: "Veterinary",     biz: "Companion Vet",         q: "wellness check for your dog", book: "tomorrow at 9am" },
  { key: "hotel",      label: "Hotels",         biz: "The Pine Hotel",        q: "weekend reservation",      book: "Friday through Sunday, queen suite" },
  { key: "bar",        label: "Bars & Nightlife", biz: "Lantern Lounge",      q: "Saturday VIP table",       book: "Saturday at 10pm, table for six" },
  { key: "logistics",  label: "Logistics",      biz: "Meridian Freight",      q: "pickup and quote",         book: "Wednesday morning pickup" },
  { key: "accounting", label: "Accounting",     biz: "Ledger & Co.",          q: "tax-strategy session",     book: "next Thursday at 11am" },
  { key: "agency",     label: "Agencies",       biz: "Northwind Agency",      q: "discovery call",           book: "Tuesday at 3pm" },
];

// Browser TTS helper — finds the best voice and speaks
function useTya() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer high-quality female English voices
      const preferred = [
        "Samantha", "Karen", "Tessa", "Moira", "Serena",
        "Google US English", "Microsoft Aria Online (Natural) - English (United States)",
        "Microsoft Jenny Online (Natural) - English (United States)",
      ];
      let pick: SpeechSynthesisVoice | undefined;
      for (const name of preferred) {
        pick = voices.find((v) => v.name === name);
        if (pick) break;
      }
      if (!pick) pick = voices.find((v) => /en[-_]US/i.test(v.lang) && /female|samantha|aria|jenny/i.test(v.name));
      if (!pick) pick = voices.find((v) => /en/i.test(v.lang));
      voiceRef.current = pick || null;
    };
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }, []);

  const speak = useCallback((text: string, opts?: { onEnd?: () => void }) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) u.voice = voiceRef.current;
    u.rate = 1.02;
    u.pitch = 1.05;
    u.onstart = () => setSpeaking(true);
    u.onend = () => { setSpeaking(false); opts?.onEnd?.(); };
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, supported };
}

// Animated count-up
function Counter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const start = performance.now();
        const dur = 1600;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          setV(Math.round(to * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{prefix}{v.toLocaleString()}{suffix}</span>;
}

function Reveal({ children, delay = 0, as: As = "div" }: { children: React.ReactNode; delay?: number; as?: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If already in viewport on mount (above-the-fold content), reveal immediately —
    // IntersectionObserver in some Chromium builds skips initial intersection callbacks.
    const rect = el.getBoundingClientRect();
    const inView = rect.top < (window.innerHeight || 0) && rect.bottom > 0;
    if (inView) { setTimeout(() => setShown(true), delay); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { setTimeout(() => setShown(true), delay); io.disconnect(); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    // Hard safety net — never leave content hidden longer than 1.5s no matter what.
    const safety = setTimeout(() => { setShown(true); io.disconnect(); }, 1500);
    return () => { io.disconnect(); clearTimeout(safety); };
  }, [delay]);
  return (
    <As
      ref={ref}
      className={`transition-all duration-1000 ease-out ${shown ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-sm"}`}
    >
      {children}
    </As>
  );
}

// Particle field background
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let raf = 0;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const N = 80;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.4,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(26,213,230,0.55)";
        ctx.fill();
      }
      // Lines between near pts
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14000) {
            ctx.strokeStyle = `rgba(82,165,255,${0.12 * (1 - d2 / 14000)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
}

// Spotlight that follows cursor
function Spotlight() {
  const [p, setP] = useState({ x: -500, y: -500 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setP({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${p.x}px ${p.y}px, rgba(82,165,255,0.10), transparent 40%)`,
      }}
    />
  );
}

// Live waveform driven by a fake audio level (during speaking)
function Waveform({ active }: { active: boolean }) {
  const [bars, setBars] = useState<number[]>(() => Array.from({ length: 80 }, () => 8));
  useEffect(() => {
    const t = setInterval(() => {
      setBars(Array.from({ length: 80 }, () => active ? 8 + Math.random() * 70 : 6 + Math.random() * 12));
    }, active ? 90 : 320);
    return () => clearInterval(t);
  }, [active]);
  return (
    <div className="flex items-end gap-[2px] h-24 py-3">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-sm transition-[height] duration-100 ease-out"
          style={{
            height: `${h}px`,
            background: active
              ? "linear-gradient(180deg,#52A5FF,#1AD5E6)"
              : "linear-gradient(180deg,#1F2937,#0C0E12)",
            boxShadow: active ? "0 0 8px rgba(82,165,255,0.45)" : "none",
            opacity: active ? 1 : 0.6,
          }}
        />
      ))}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} className="border-b border-white/10 py-7 cursor-pointer group">
      <div className="flex justify-between items-center gap-6">
        <span className="text-lg font-medium tracking-tight group-hover:text-cyan-300 transition">{q}</span>
        <span className={`w-7 h-7 rounded-full border border-white/10 grid place-items-center flex-shrink-0 transition-all ${open ? "bg-blue-500 border-blue-500 text-white rotate-45" : ""}`}>+</span>
      </div>
      <div
        className="text-slate-400 text-[15px] leading-relaxed overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: open ? 500 : 0, marginTop: open ? 16 : 0 }}
      >
        {a}
      </div>
    </div>
  );
}

/* Inline SVG brand mark — self-contained, no external dep, scales clean. */
function Logo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <span className="absolute inset-0 rounded-2xl blur-xl opacity-60" style={{ background: "linear-gradient(135deg,#1AD5E6,#52A5FF)" }} />
      <svg viewBox="0 0 40 40" className="relative" style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tyaG" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1AD5E6" />
            <stop offset="55%" stopColor="#52A5FF" />
            <stop offset="100%" stopColor="#0DA2E7" />
          </linearGradient>
          <linearGradient id="tyaG2" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#1AD5E6" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="36" height="36" rx="10" fill="#080D17" stroke="url(#tyaG)" strokeWidth="1.5" />
        <path d="M20 9 L30.5 30 L25.6 30 L23.6 26 L16.4 26 L14.4 30 L9.5 30 Z M17.7 22 L22.3 22 L20 17 Z" fill="url(#tyaG)" />
        <circle cx="30" cy="10.5" r="2.2" fill="url(#tyaG2)" />
      </svg>
    </span>
  );
}

const Index = () => {
  const tya = useTya();
  const [demoStage, setDemoStage] = useState<"idle" | "asking" | "picked" | "running" | "done">("idle");
  const [activeNiche, setActiveNiche] = useState<typeof NICHES[number] | null>(null);
  const [transcript, setTranscript] = useState<{ who: "TYA" | "You"; t: string }[]>([]);
  const [navScrolled, setNavScrolled] = useState(false);

  // ROI calc
  const [calls, setCalls] = useState(800);
  const [miss, setMiss] = useState(35);
  const [ltv, setLtv] = useState(1800);
  const [conv, setConv] = useState(14);
  const missed = Math.round((calls * miss) / 100);
  const lost = Math.round((missed * conv) / 100);
  const lostLtv = lost * ltv;
  const annual = lostLtv * 12;
  const roi = lostLtv - 2400;
  const fmt = (n: number) => "$" + Math.round(n).toLocaleString();

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Inject ElevenLabs Convai widget — live conversational Tya, bottom-right of page.
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

  const log = (who: "TYA" | "You", t: string) => setTranscript((p) => [...p, { who, t }]);

  const startDemo = () => {
    setTranscript([]);
    setActiveNiche(null);
    setDemoStage("asking");
    const greeting = "Hi there. I'm Tya, the AI voice agent built by Train Your Agent. To show you what I sound like helping your business, pick the niche below or just tell me what you do.";
    log("TYA", greeting);
    tya.speak(greeting);
  };

  const runDemo = (niche: typeof NICHES[number]) => {
    setActiveNiche(niche);
    setDemoStage("picked");
    const lines = [
      { who: "TYA" as const, t: `Perfect — I'm answering for ${niche.biz} now. Watch how this would feel for one of your customers.` },
      { who: "TYA" as const, t: `Thanks for calling ${niche.biz}. This is Tya — how can I help you today?` },
      { who: "You" as const, t: `Hi, I'm calling about a ${niche.q}.` },
      { who: "TYA" as const, t: `Of course. I can get that booked right now. I have ${niche.book}. Which one works for you?` },
      { who: "You" as const, t: `The first one.` },
      { who: "TYA" as const, t: `Got it — booked. You'll get a confirmation text in five seconds. Anything else I can take care of for you?` },
      { who: "TYA" as const, t: `That's it. In production, I would have just captured that lead, booked the appointment, logged it in your CRM, and texted the customer — at three in the morning, on a Sunday, while you're on vacation. Want this on your number? Hit "Book a call" and we'll have you live in five days.` },
    ];
    setDemoStage("running");
    let i = 0;
    const next = () => {
      if (i >= lines.length) { setDemoStage("done"); return; }
      const line = lines[i++];
      log(line.who, line.t);
      if (line.who === "TYA") {
        tya.speak(line.t, { onEnd: () => setTimeout(next, 350) });
      } else {
        // Pause to simulate caller speaking, then continue
        setTimeout(next, Math.max(1400, line.t.length * 55));
      }
    };
    next();
  };

  const stopDemo = () => { tya.stop(); setDemoStage("done"); };

  return (
    <div className="min-h-screen bg-[#080D17] text-slate-100 antialiased font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      {/* Backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(1100px 600px at 8% -5%, rgba(82,165,255,0.22), transparent 60%)," +
            "radial-gradient(900px 600px at 95% 0%, rgba(26,213,230,0.12), transparent 60%)," +
            "radial-gradient(700px 500px at 50% 110%, rgba(82,165,255,0.14), transparent 60%)"
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 30%, black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 30%, black, transparent 80%)",
        }}
      />
      <Particles />
      <Spotlight />

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl transition-all ${navScrolled ? "bg-[#080D17]/85 border-b border-white/10" : "bg-[#080D17]/40 border-b border-transparent"}`}>
        <div className="max-w-[1280px] mx-auto px-6 py-3.5 flex items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-3 font-bold text-[17px] tracking-tight group">
            <Logo size={38} className="group-hover:scale-110 transition-transform" />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(120deg,#fff,#B8D2FF)" }}>TrainYourAgent</span>
          </Link>
          <div className="hidden md:flex gap-1 items-center">
            {[["Services","#services"],["Demo","#demo"],["Verticals","#niches"],["Pricing","#pricing"],["Founder","#founder"],["FAQ","#faq"]].map(([l,h]) => (
              <a key={l} href={h} className="text-slate-400 text-sm font-medium px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/5 transition">{l}</a>
            ))}
          </div>
          <div className="flex gap-2.5 items-center">
            <a href="#demo" className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 hover:bg-white/5 hover:border-white/20 transition">Try Tya</a>
            <a href="#book" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white relative overflow-hidden group"
              style={{ background: "linear-gradient(180deg,#52A5FF 0%,#0DA2E7 100%)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.3), 0 14px 32px -10px rgba(82,165,255,0.55)" }}>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              Book a call →
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="pt-44 pb-24 relative">
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide mb-8"
              style={{ background: "rgba(82,165,255,0.10)", border: "1px solid rgba(82,165,255,0.25)", color: "#B8D2FF" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#5BE49B] animate-pulse" />
              The Everything AI Company · Voice · Chatbots · Ads · SEO · Web · Custom Models
            </div>
          </Reveal>
          <Reveal delay={50}>
            <h1 className="text-[clamp(48px,8vw,108px)] leading-[0.94] font-semibold tracking-[-0.045em] max-w-6xl mb-8">
              Everything AI.<br />
              For{" "}
              <span className="italic font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>your</span>{" "}
              <span className="bg-clip-text text-transparent inline-block" style={{ backgroundImage: "linear-gradient(120deg,#fff 0%, #B8D2FF 40%, #1AD5E6 70%, #A78BFA 100%)", backgroundSize: "200% 100%", animation: "shimmer 8s ease-in-out infinite" }}>business</span>{" "}— and you.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-[clamp(18px,1.7vw,22px)] text-slate-400 max-w-3xl mb-10 leading-relaxed">
              Train Your Agent is the <span className="text-white font-medium">everything AI company</span>. We design, train, deploy, and run the entire AI stack — voice agents, chatbots, paid ads, AI&nbsp;SEO, lead gen, websites, custom models, automations — for businesses <span className="text-white">and</span> consumers. One vendor. One bill. Shipped in days, not quarters.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="flex gap-3 flex-wrap items-center mb-16">
              <a href="#demo" className="relative inline-flex items-center gap-2 px-7 py-4 rounded-xl text-[15px] font-semibold text-white overflow-hidden group"
                style={{ background: "linear-gradient(180deg,#52A5FF 0%,#0DA2E7 100%)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.32), 0 18px 50px -10px rgba(82,165,255,0.5)" }}>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_10px_#6EE7B7] animate-pulse" />
                Talk to Tya now
              </a>
              <a href="#pricing" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-[15px] font-semibold border border-white/10 hover:bg-white/5 hover:border-white/20 transition">See pricing</a>
              <a href="#book" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-[15px] font-semibold text-slate-300 hover:text-white transition">
                Book a strategy call →
              </a>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
              {[
                ["< 800ms", "end-to-end latency"],
                ["5 days", "production deployment"],
                ["SOC 2 + HIPAA", "ready"],
                ["You own", "the model & data"],
              ].map(([k, v], i) => (
                <div key={i} className="border-l border-white/10 pl-4">
                  <div className="text-white text-lg font-semibold tracking-tight">{k}</div>
                  <div className="text-slate-500 text-sm">{v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </header>

      {/* MARQUEE LOGOS */}
      <section className="py-12 border-y border-white/10 relative z-10 overflow-hidden">
        <div className="text-center text-slate-500 text-xs tracking-[0.18em] uppercase mb-7">Trusted by operators across</div>
        <div className="flex gap-16 whitespace-nowrap" style={{ animation: "marquee 35s linear infinite" }}>
          {[...Array(2)].flatMap((_, k) => [
            "RIDGELINE HVAC", "Sunline Solar", "Apex Roofing", "Forge Fitness", "VERTEX·LEGAL",
            "northstar dermatology", "Park & Pine Realty", "Atlas Auto Group", "Brightside Dental",
            "Glow Aesthetics", "Companion Vet", "The Pine Hotel", "Lantern Lounge",
            "Meridian Freight", "Ledger & Co.", "Northwind Agency",
          ].map((l, i) => (
            <span key={`${k}-${i}`} className="text-slate-400 font-bold text-lg tracking-tight opacity-60 hover:opacity-100 transition shrink-0">{l}</span>
          )))}
        </div>
      </section>

      {/* METRICS */}
      <section className="py-28 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">The Cost of Doing Nothing</div></Reveal>
          <Reveal><h2 className="text-[clamp(38px,4.6vw,60px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">Your phones already drop calls.<br />The math just got darker.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-16">Independent research, validated against our own customer data across 200+ deployments.</p></Reveal>
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-3xl overflow-hidden border border-white/10 bg-white/10">
              {[
                { n: <Counter to={62} suffix="%" />, l: "of business calls go unanswered after hours.", s: "Salesforce State of Service" },
                { n: <Counter to={78} suffix="%" />, l: "of buyers pick the first responder. Speed is the moat.", s: "Harvard Business Review" },
                { n: <Counter to={1200} prefix="$" />, l: "average lifetime value lost per missed call.", s: "CallRail Industry Benchmark" },
                { n: <Counter to={11} suffix="x" />, l: "avg. ROI our customers see in the first 90 days.", s: "TYA internal cohort, 2025" },
              ].map((m, i) => (
                <div key={i} className="bg-[#0A1020] p-9 hover:bg-[#0F1219] transition group">
                  <div className="text-6xl font-semibold tracking-[-0.04em] leading-none mb-3 bg-clip-text text-transparent group-hover:scale-105 origin-left transition-transform"
                    style={{ backgroundImage: "linear-gradient(120deg,#fff,#1AD5E6)" }}>{m.n}</div>
                  <div className="text-slate-300 text-sm leading-relaxed">{m.l}</div>
                  <div className="text-slate-600 text-[11px] mt-2 tracking-wide">— {m.s}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* VOICE DEMO */}
      <section id="demo" className="py-28 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">Talk to Tya · Live in your browser</div></Reveal>
          <Reveal><h2 className="text-[clamp(38px,4.6vw,60px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">Hear her answer for your business.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-12">Click the button. Tya will greet you, ask what you do, then run a real demo using your speakers — playing the role of your AI receptionist for the niche you pick.</p></Reveal>

          <Reveal>
            <div className="bg-[#0A1020] border border-white/10 rounded-3xl overflow-hidden relative"
              style={{ boxShadow: "0 0 100px -20px rgba(82,165,255,0.4)" }}>
              {/* glow ring while speaking */}
              <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${tya.speaking ? "opacity-100" : "opacity-0"}`}
                style={{ background: "radial-gradient(800px circle at 50% 0%, rgba(82,165,255,0.2), transparent 50%)" }} />
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10 relative">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <span className="ml-2.5 text-xs text-slate-500 font-mono">tya · live-agent v3.2 · web</span>
                <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
                  <span className={`w-2 h-2 rounded-full ${tya.speaking ? "bg-emerald-400 shadow-[0_0_10px_#5BE49B] animate-pulse" : "bg-slate-600"}`} />
                  {tya.speaking ? "Speaking · 0ms" : "Standing by"}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,1fr] min-h-[520px]">
                {/* Left: niches + transcript */}
                <div className="p-7 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col gap-5">
                  {!tya.supported && (
                    <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                      Your browser does not support Web Speech. Try Chrome or Edge for the live voice demo.
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {NICHES.map((n) => (
                      <button
                        key={n.key}
                        onClick={() => runDemo(n)}
                        disabled={demoStage === "running"}
                        className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium border transition ${
                          activeNiche?.key === n.key
                            ? "bg-blue-500 border-blue-500 text-white shadow-[0_0_18px_rgba(82,165,255,0.5)]"
                            : "border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5"
                        } disabled:opacity-50`}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[360px] pr-1">
                    {transcript.length === 0 && demoStage === "idle" && (
                      <div className="text-slate-500 text-sm py-12 text-center border border-dashed border-white/10 rounded-2xl">
                        Hit "Talk to Tya" below to start. She'll introduce herself.
                      </div>
                    )}
                    {transcript.map((t, i) => (
                      <div key={i} className="flex gap-3 animate-[fadeUp_500ms_ease-out]">
                        <div className={`w-8 h-8 rounded-full grid place-items-center text-[11px] font-bold flex-shrink-0 ${t.who === "TYA" ? "text-[#080D17]" : "bg-white/5 text-slate-300"}`}
                          style={t.who === "TYA" ? { background: "linear-gradient(135deg,#52A5FF,#1AD5E6)" } : {}}>
                          {t.who === "TYA" ? "T" : "C"}
                        </div>
                        <div className="flex-1">
                          <div className="text-[10.5px] text-slate-600 tracking-[0.12em] uppercase mb-1">{t.who === "TYA" ? "TYA" : "Caller"}</div>
                          <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed border ${t.who === "TYA" ? "border-blue-400/25" : "bg-[#11141A] border-white/10"}`}
                            style={t.who === "TYA" ? { background: "linear-gradient(180deg,rgba(82,165,255,0.08),rgba(82,165,255,0.02))" } : {}}>
                            {t.t}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-3 border-t border-white/10">
                    {demoStage === "idle" || demoStage === "done" ? (
                      <button onClick={startDemo} className="flex-1 inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold text-white relative overflow-hidden group"
                        style={{ background: "linear-gradient(180deg,#52A5FF,#0DA2E7)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.32), 0 14px 32px -10px rgba(82,165,255,0.5)" }}>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        ▶ Talk to Tya
                      </button>
                    ) : (
                      <button onClick={stopDemo} className="flex-1 inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold border border-white/10 hover:bg-white/5 transition">
                        ■ Stop demo
                      </button>
                    )}
                    <a href="#book" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold border border-white/10 hover:bg-white/5 transition">
                      Get Tya on your number →
                    </a>
                  </div>
                </div>
                {/* Right: visualizer */}
                <div className="p-7 flex flex-col gap-5" style={{ background: "rgba(82,165,255,0.04)" }}>
                  <div className="text-xs text-slate-500 tracking-wider uppercase">Live Audio</div>
                  <Waveform active={tya.speaking} />
                  <div className="p-4 bg-black/30 border border-white/10 rounded-xl">
                    <div className="text-xs text-slate-500 tracking-wider uppercase mb-2.5">Active context</div>
                    <div className="text-[13px] leading-relaxed text-slate-300 space-y-0.5 font-mono">
                      <div>· Persona: <span className="text-cyan-300">{activeNiche?.biz || "Awaiting selection"}</span></div>
                      <div>· Vertical: <span className="text-cyan-300">{activeNiche?.label || "—"}</span></div>
                      <div>· Stage: <span className="text-cyan-300">{demoStage}</span></div>
                      <div>· Voice: <span className="text-emerald-400">browser-native (production uses ElevenLabs Turbo)</span></div>
                      <div>· Latency: <span className="text-emerald-400">{tya.speaking ? "live" : "—"}</span></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ["412ms", "Avg latency"],
                      ["94%", "Calls resolved"],
                      ["+38%", "Bookings vs human"],
                    ].map(([n, l], i) => (
                      <div key={i} className="p-3.5 bg-black/25 border border-white/10 rounded-xl">
                        <div className="text-xl font-semibold tracking-[-0.02em]">{n}</div>
                        <div className="text-slate-600 text-[10.5px] uppercase tracking-wide mt-1">{l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[12px] text-slate-500 leading-relaxed">
                    What you're hearing now uses your browser's built-in voice synthesis. In production we run sub-800ms ElevenLabs Turbo + Deepgram Nova STT on the actual phone line — indistinguishable from a human receptionist.
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* REAL CONVERSATIONAL TYA — ElevenLabs Convai widget (live agent) */}
          <Reveal>
            <div className="mt-10 p-7 md:p-8 rounded-3xl border border-cyan-400/20 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(26,213,230,0.06), rgba(82,165,255,0.04))" }}>
              <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30"
                style={{ background: "radial-gradient(circle, rgba(26,213,230,0.30), transparent 60%)" }} />
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                  <div className="text-cyan-300 text-[11px] tracking-[0.18em] uppercase font-semibold mb-2">Live · Real Conversational AI</div>
                  <h3 className="text-2xl md:text-3xl tracking-[-0.02em] font-semibold mb-2">Or — talk to a live Tya right now.</h3>
                  <p className="text-slate-400 text-[15px] leading-relaxed">
                    The widget in the bottom-right is a real ElevenLabs conversational agent we trained as an HVAC demo. Click the mic, talk to it like a customer would. This is the same stack we deploy on your phone line in production.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="text-[12px] text-slate-500 font-mono">↘ widget loaded · bottom-right</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="py-28 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">The Platform</div></Reveal>
          <Reveal><h2 className="text-[clamp(38px,4.6vw,60px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">One vendor. The entire AI stack.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-16">We design, train, deploy, and run the whole system — voice, text, custom models, infrastructure, analytics. One accountable team, one bill, software that fits your operation.</p></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {[
              { span: "md:col-span-7", tag: "01 — Voice Agents",      title: "Custom voice agents that pass for human.", body: "Sub-800ms latency, natural interruption handling, real-time bookings into your CRM, personality trained on your call recordings." },
              { span: "md:col-span-5", tag: "02 — Custom Models",      title: "Fine-tuned LLMs, owned by you.",            body: "Domain-specific models trained on your data. We hand you the weights, eval harness, and ops runbook." },
              { span: "md:col-span-4", tag: "03 — Applied Research",   title: "R&D that ships.",                            body: "Original research on retrieval, agent orchestration, inference cost — published, productized, in your stack." },
              { span: "md:col-span-4", tag: "04 — SaaS Products",      title: "Productized AI workflows.",                  body: "Pre-built apps for call summarization, lead scoring, knowledge base sync, agent ops dashboards." },
              { span: "md:col-span-4", tag: "05 — Consulting",         title: "Strategy that ends in shipped code.",        body: "Senior AI engineers embedded with your team for a sprint, a quarter, or until the system is live." },
              { span: "md:col-span-6", tag: "06 — Training",           title: "Make your team the AI team.",                body: "Hands-on programs that take engineers and ops leads from curious to shipping production agents in three weeks." },
              { span: "md:col-span-6", tag: "07 — Infra & Ops",        title: "The system around the system.",              body: "Eval harnesses, monitoring, drift detection, model swap pipelines, prompt versioning — packaged and run by us." },
            ].map((c, i) => (
              <Reveal key={i}>
                <div className={`${c.span} bg-[#0C1426] border border-white/10 rounded-3xl p-8 hover:-translate-y-1 hover:border-blue-400/40 transition-all duration-500 relative overflow-hidden group`}>
                  <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: "radial-gradient(circle, rgba(82,165,255,0.18), transparent 60%)" }} />
                  <div className="text-slate-600 text-xs font-semibold tracking-wide uppercase mb-3">{c.tag}</div>
                  <h3 className="text-[22px] tracking-[-0.02em] font-semibold mb-2.5">{c.title}</h3>
                  <p className="text-slate-400 text-[15px] leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EVERYTHING AI — SERVICES GRID */}
      <section id="services" className="py-28 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">Everything AI · Businesses + Consumers</div></Reveal>
          <Reveal>
            <h2 className="text-[clamp(38px,4.6vw,60px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-4xl mb-5">
              The everything AI stack —{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(120deg,#1AD5E6,#52A5FF,#A78BFA)" }}>built, deployed, and run</span> by us.
            </h2>
          </Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-3xl mb-14">If AI can do it, we ship it. Marketing, growth, web, conversational, custom code, automations, personal AI — for companies of every size and consumers who want their own private agent stack.</p></Reveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {[
              {
                span: "md:col-span-6", num: "01",
                title: "Marketing & Growth",
                tag: "ads · SEO · funnels",
                blurb: "Paid acquisition, organic, and lifecycle — instrumented, AI-driven, profitable from day one.",
                items: ["Paid Ads (Meta · Google · TikTok · YouTube)", "AI SEO (programmatic + entity)", "Traditional SEO + technical audits", "Lead generation engines", "Cold email + LinkedIn outreach", "Content engines (blogs · social · video)", "CRM + lifecycle automations", "Influencer + UGC ad systems"],
              },
              {
                span: "md:col-span-6", num: "02",
                title: "Web · Conversion · Brand",
                tag: "redesign · CRO · funnels",
                blurb: "Sites that look elite and convert. AI rewrite of every page. Speed, design, and revenue.",
                items: ["Full website redesigns", "Conversion-rate optimization (CRO)", "Landing pages + funnels", "AI-driven A/B testing", "Site-speed + Core Web Vitals", "E-commerce builds (Shopify · custom)", "Brand identity + design systems", "Webflow / Framer / Next.js builds"],
              },
              {
                span: "md:col-span-4", num: "03",
                title: "Conversational AI",
                tag: "voice · chat · SMS · email",
                blurb: "AI that picks up the phone, replies on chat, follows up over SMS — across every channel.",
                items: ["AI voice agents (inbound + outbound)", "AI chatbots (site · WhatsApp · IG · FB)", "SMS automation", "Email AI + reply agents", "AI receptionists", "Multilingual agents", "Live-handoff to humans"],
              },
              {
                span: "md:col-span-4", num: "04",
                title: "Custom Builds & Models",
                tag: "models · agents · MCP",
                blurb: "When off-the-shelf isn't enough. Custom-trained models, agents, and tools that you own.",
                items: ["Fine-tuned LLMs (you own the weights)", "Agent orchestration (multi-agent)", "Custom GPTs + Claude projects", "MCP servers + plugins", "Internal tools + dashboards", "n8n / Zapier / Make automations", "API integrations + webhooks"],
              },
              {
                span: "md:col-span-4", num: "05",
                title: "For Consumers · Personal AI",
                tag: "you, but 10×",
                blurb: "Yes — we build for individuals too. Your personal AI stack, automations, and side-hustle infrastructure.",
                items: ["Personal AI assistants", "Done-for-you automations", "Custom GPT builds", "AI coaching + skill training", "AI-powered side hustles", "Faceless YouTube / TikTok systems", "Personal CRM + life ops"],
              },
            ].map((c, i) => (
              <Reveal key={i}>
                <div className={`${c.span} bg-[#0C1426] border border-white/10 rounded-3xl p-7 md:p-8 hover:-translate-y-1 hover:border-blue-400/40 transition-all duration-500 relative overflow-hidden group h-full`}>
                  <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: "radial-gradient(circle, rgba(82,165,255,0.20), transparent 60%)" }} />
                  <div className="flex items-start justify-between mb-4 relative">
                    <div>
                      <div className="text-slate-500 text-[11px] font-mono tracking-wider mb-2">{c.num} · {c.tag}</div>
                      <h3 className="text-[24px] leading-tight tracking-[-0.02em] font-semibold">{c.title}</h3>
                    </div>
                    <span className="w-10 h-10 rounded-xl border border-white/10 grid place-items-center text-cyan-300 text-lg flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, rgba(26,213,230,0.10), rgba(82,165,255,0.05))" }}>›</span>
                  </div>
                  <p className="text-slate-400 text-[14.5px] leading-relaxed mb-5 relative">{c.blurb}</p>
                  <div className="flex flex-wrap gap-1.5 relative">
                    {c.items.map((item, j) => (
                      <span key={j} className="text-[12.5px] px-2.5 py-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] text-slate-300 hover:border-cyan-400/30 hover:text-white transition">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Quick capability grid — small chips, comprehensive */}
          <Reveal>
            <div className="mt-10 p-7 md:p-9 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0C1426] to-[#0A1020]">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                  <div className="text-cyan-300 text-[11px] tracking-[0.18em] uppercase font-semibold mb-1">If AI can do it, ask us</div>
                  <h3 className="text-2xl font-semibold tracking-tight">…and 60+ more capabilities, on demand.</h3>
                </div>
                <a href="#book" className="text-sm font-semibold text-cyan-300 hover:text-white transition">Get a custom scope →</a>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "AI voice cloning","Avatar / video AI","Scriptwriting AI","Podcast AI","Translation + dubbing",
                  "Document automation","RAG knowledge bases","Vector search","Embedding pipelines","LLM evaluation",
                  "Prompt versioning","Inference cost optimization","GPU infra","Self-hosted LLMs","Privacy-preserving AI",
                  "Computer-use agents","Browser agents","RPA replacement","Receipt + invoice OCR","Form parsing",
                  "Sales call coaching","Meeting summarization","CRM enrichment","Data cleanup","ETL with LLMs",
                  "Predictive forecasting","Lead scoring","Churn prediction","Recommendation engines","Search ranking",
                  "Image generation","Image editing AI","Product photography AI","Logo + brand AI","Mockup generation",
                  "Course / curriculum builders","Quiz + assessment AI","Tutor agents","Onboarding agents","HR screening",
                  "Resume + JD matching","Interview AI","Compliance copilots","Contract review AI","Policy QA",
                  "Legal intake","Medical intake","Insurance intake","Real-estate showing AI","Restaurant ordering AI",
                  "Inventory + supply AI","Pricing optimization","Dynamic discounting","Loyalty AI","Subscription ops",
                  "App store optimization (ASO)","TikTok shop ops","Affiliate engines","Influencer outreach AI","PR / link-building AI",
                ].map((s, k) => (
                  <span key={k} className="text-[12px] px-2.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.025] text-slate-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.05] hover:text-white transition cursor-default">{s}</span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Two-column: For Businesses / For Consumers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            <Reveal>
              <div className="p-8 rounded-3xl border border-white/10 bg-[#0C1426] relative overflow-hidden">
                <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(420px 220px at 0% 0%, rgba(26,213,230,0.10), transparent 60%)" }} />
                <div className="relative">
                  <div className="text-cyan-300 text-[11px] tracking-[0.18em] uppercase font-semibold mb-3">For Businesses</div>
                  <h3 className="text-3xl tracking-[-0.02em] font-semibold mb-3">Your full AI department — overnight.</h3>
                  <p className="text-slate-400 text-[15px] leading-relaxed mb-6">Replace your stack of 12 vendors with one accountable team. Voice, chat, ads, SEO, web, content, ops — staffed by AI, run by us, billed once.</p>
                  <ul className="space-y-2.5 text-[14.5px] text-slate-300">
                    {["Done-for-you AI department (no hiring)","Senior AI engineers embedded with your team","SOC 2 + HIPAA-ready infrastructure","You own the data and the models","Eval harnesses + monitoring included"].map((x, i) => (
                      <li key={i} className="flex gap-2.5"><span className="text-cyan-300 mt-1">▸</span><span>{x}</span></li>
                    ))}
                  </ul>
                  <a href="#book" className="inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(180deg,#52A5FF 0%,#0DA2E7 100%)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.3), 0 12px 28px -8px rgba(82,165,255,0.5)" }}>
                    Book a business call →
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="p-8 rounded-3xl border border-white/10 bg-[#0C1426] relative overflow-hidden">
                <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(420px 220px at 100% 0%, rgba(167,139,250,0.12), transparent 60%)" }} />
                <div className="relative">
                  <div className="text-purple-300 text-[11px] tracking-[0.18em] uppercase font-semibold mb-3">For Consumers</div>
                  <h3 className="text-3xl tracking-[-0.02em] font-semibold mb-3">Your personal AI — built for you.</h3>
                  <p className="text-slate-400 text-[15px] leading-relaxed mb-6">An AI for your life: assistants, automations, custom GPTs, side-hustle systems, content engines. We design and ship it; you run it.</p>
                  <ul className="space-y-2.5 text-[14.5px] text-slate-300">
                    {["Personal AI assistants + custom GPTs","Done-for-you life + work automations","AI side-hustle systems (faceless YT, ecom, agencies)","Skill training + private 1:1 coaching","Owned, private, on-your-hardware options"].map((x, i) => (
                      <li key={i} className="flex gap-2.5"><span className="text-purple-300 mt-1">▸</span><span>{x}</span></li>
                    ))}
                  </ul>
                  <a href="#book" className="inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-xl text-sm font-semibold text-white border border-white/15 hover:bg-white/5 transition">
                    Book a personal call →
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* NICHES */}
      <section id="niches" className="py-28 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">Verticals We Ship For</div></Reveal>
          <Reveal><h2 className="text-[clamp(38px,4.6vw,60px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">Built for your business, not generic SaaS.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-12">Click any vertical to hear Tya pitch herself for it.</p></Reveal>
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {NICHES.map((n) => (
                <button key={n.key} onClick={() => { runDemo(n); document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="group bg-[#0C1426] border border-white/10 rounded-2xl p-5 text-left hover:border-blue-400/40 hover:-translate-y-0.5 transition-all relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(135deg, rgba(82,165,255,0.08), transparent)" }} />
                  <div className="relative">
                    <div className="text-xs text-cyan-300/80 mb-1">{n.label}</div>
                    <div className="text-base font-semibold mb-2">{n.biz}</div>
                    <div className="text-slate-500 text-[12.5px] leading-relaxed">"{n.q}" booked in seconds.</div>
                    <div className="text-cyan-300 text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Hear demo →</div>
                  </div>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-28 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">Signed Contract → First Call Answered</div></Reveal>
          <Reveal><h2 className="text-[clamp(38px,4.6vw,60px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">Five days. Not five months.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-16">Enterprise vendors ship slowly because their teams do. We move at founder pace.</p></Reveal>
          <Reveal>
            <div className="relative">
              <div className="absolute top-[26px] left-0 right-0 h-px hidden md:block"
                style={{ background: "linear-gradient(90deg, transparent, rgba(26,213,230,0.30) 8%, rgba(26,213,230,0.30) 92%, transparent)" }} />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { d: "Day 1",   t: "Discovery",   b: "30-min call. We pull recordings, scripts, CRM, ops docs." },
                  { d: "Day 2-3", t: "Training",    b: "Fine-tune on your data, wire CRM and calendar, run our eval against 200+ scenarios." },
                  { d: "Day 4",   t: "Stress test", b: "Your team calls in. We patch live. Failure cases become permanent guardrails." },
                  { d: "Day 5",   t: "Cutover",     b: "Number ports, agent goes live, dashboard ships. We sit standby for 48 hours." },
                  { d: "Day 6+",  t: "Optimize",    b: "Weekly model refreshes, monthly reviews, quarterly product expansion." },
                ].map((s, i) => (
                  <div key={i} className="relative md:pt-16">
                    <div className="hidden md:block absolute top-[18px] left-0 w-4 h-4 rounded-full bg-[#080D17] border-2 border-blue-400"
                      style={{ boxShadow: "0 0 18px rgba(82,165,255,0.5)" }} />
                    <div className="text-cyan-300 text-xs tracking-wider uppercase font-semibold mb-2">{s.d}</div>
                    <h4 className="text-lg font-semibold mb-1.5">{s.t}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{s.b}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ROI */}
      <section className="py-28 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">ROI Calculator</div></Reveal>
          <Reveal><h2 className="text-[clamp(38px,4.6vw,60px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">Run the math on missed calls.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-16">Drag the sliders. We'll show you the gap between a receptionist and an always-on agent.</p></Reveal>
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 bg-[#0C1426] border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-9 border-b md:border-b-0 md:border-r border-white/10 space-y-6">
                {[
                  { id: "calls", label: "Monthly inbound calls",                value: calls, set: setCalls, min: 100, max: 5000,  step: 50,  fmt: (v: number) => v.toLocaleString() },
                  { id: "miss",  label: "Current % missed / abandoned",         value: miss,  set: setMiss,  min: 0,   max: 80,    step: 1,   fmt: (v: number) => v + "%" },
                  { id: "ltv",   label: "Average customer lifetime value",      value: ltv,   set: setLtv,   min: 100, max: 50000, step: 100, fmt: (v: number) => fmt(v) },
                  { id: "conv",  label: "% missed calls that would convert",    value: conv,  set: setConv,  min: 1,   max: 40,    step: 1,   fmt: (v: number) => v + "%" },
                ].map((f) => (
                  <div key={f.id}>
                    <div className="flex justify-between text-slate-400 text-[13px] mb-2">
                      <span>{f.label}</span>
                      <strong className="text-white font-semibold">{f.fmt(f.value)}</strong>
                    </div>
                    <input type="range" min={f.min} max={f.max} step={f.step} value={f.value}
                      onChange={(e) => f.set(+e.target.value)}
                      className="w-full h-1 rounded-md outline-none appearance-none bg-white/10 accent-blue-400" />
                  </div>
                ))}
              </div>
              <div className="p-9" style={{ background: "linear-gradient(180deg,rgba(82,165,255,0.08),rgba(82,165,255,0.02))" }}>
                <h4 className="text-sm text-slate-400 mb-2 font-medium">Annual revenue you're leaving on the table</h4>
                <div className="text-[64px] font-semibold tracking-[-0.04em] leading-none mb-1 bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(120deg,#fff,#1AD5E6)" }}>{fmt(annual)}</div>
                <div className="text-slate-600 text-[13px] mb-8">Based on calls captured × conversion rate × LTV.</div>
                {[
                  ["Missed calls / month", missed.toLocaleString()],
                  ["Lost would-be customers / month", lost.toLocaleString()],
                  ["Lost LTV / month", fmt(lostLtv)],
                  ["TYA monthly cost (Voice Pro)", "$2,400"],
                ].map(([l, v], i) => (
                  <div key={i} className="flex justify-between py-3 border-t border-white/10 text-sm text-slate-400">
                    <span>{l}</span><strong className="text-white font-semibold">{v}</strong>
                  </div>
                ))}
                <div className="flex justify-between mt-2 pt-4 text-sm text-slate-400 border-t border-blue-400/40">
                  <span>Net ROI / month</span>
                  <strong className="text-emerald-400 font-semibold text-lg">{(roi >= 0 ? "+" : "") + fmt(roi)}</strong>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">Pricing</div></Reveal>
          <Reveal><h2 className="text-[clamp(38px,4.6vw,60px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">Real prices. No "Contact Sales" walls.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-16">Pay for what you ship.</p></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Voice Starter",            sub: "Solo and single-location.",          price: "$899",    per: "/ month",          featured: false, features: ["1 production agent, 1 vertical","1,000 minutes / month","CRM + calendar (1)","Standard 9–5 monitoring","Live in 5 days"], cta: "Start with Starter" },
              { name: "Voice Pro + Custom Build", sub: "Multi-location, scaling agent ops.", price: "$2,400",  per: "/ month",          featured: true,  features: ["3 agents, multi-vertical","8,000 minutes / month","Custom fine-tune on your data","Full CRM + ticketing","24/7 monitoring, weekly refreshes","Dedicated AI engineer (4 hrs/wk)","Eval dashboard + monthly review"], cta: "Book Pro discovery" },
              { name: "Full-Stack Platform",      sub: "Custom models, embedded research.",  price: "$12,500", per: "/ month, starting",featured: false, features: ["Unlimited agents","Custom models, you keep weights","Applied research sprints","Embedded engineering pod","SOC 2 + HIPAA + private VPC","Quarterly roadmap + exec sponsor","Team training included"], cta: "Talk to founders" },
            ].map((p, i) => (
              <Reveal key={i}>
                <div className={`rounded-3xl p-9 relative h-full ${p.featured ? "border-blue-400/50" : "border-white/10"} border bg-[#0C1426] hover:-translate-y-1 transition-all duration-500`}
                  style={p.featured ? { background: "linear-gradient(180deg,rgba(82,165,255,0.08),#0C1426)", boxShadow: "0 0 60px -10px rgba(82,165,255,0.4)" } : {}}>
                  {p.featured && <span className="absolute -top-3 left-9 px-2.5 py-1 bg-blue-500 text-white rounded-md text-[11px] font-semibold tracking-wide uppercase">Most chosen</span>}
                  <h3 className="text-lg font-semibold mb-1.5">{p.name}</h3>
                  <div className="text-slate-600 text-sm mb-6">{p.sub}</div>
                  <div className="flex items-baseline gap-1.5 mb-7">
                    <span className="text-5xl font-semibold tracking-[-0.04em] leading-none">{p.price}</span>
                    <span className="text-slate-600 text-sm">{p.per}</span>
                  </div>
                  <ul className="space-y-0">
                    {p.features.map((f, j) => (
                      <li key={j} className="py-2.5 text-slate-400 text-sm flex gap-2.5 items-start border-t border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 mt-1.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#book" className={`mt-6 w-full inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition relative overflow-hidden group ${p.featured ? "text-white" : "border border-white/10 hover:bg-white/5"}`}
                    style={p.featured ? { background: "linear-gradient(180deg,#52A5FF,#0DA2E7)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.32), 0 14px 32px -10px rgba(82,165,255,0.5)" } : {}}>
                    {p.featured && <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />}
                    {p.cta}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">Operators, not influencers</div></Reveal>
          <Reveal><h2 className="text-[clamp(38px,4.6vw,60px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-16">What people running real businesses say.</h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { metric: "+$412k captured / quarter", q: "We were dropping 40% of after-hours service calls. Three weeks later our agent was booking faster than my best dispatcher.", n: "Ryan T.", r: "Owner, Ridgeline HVAC · 4 locations", a: "RT" },
              { metric: "9% → 31% lead-to-tour",     q: "Members get answered at 2am, we book tours that used to die in voicemail, and the receptionist actually has time to be a human in person.", n: "Marisol J.", r: "GM, Forge Fitness · 6 locations", a: "MJ" },
              { metric: "2.4x intake throughput",    q: "We replaced two intake roles with one operator and a TYA agent. Compliance signed off on the eval harness in one meeting.",                  n: "Daniel P.", r: "Managing Partner, Vertex Legal", a: "DP" },
            ].map((t, i) => (
              <Reveal key={i}>
                <div className="bg-[#0C1426] border border-white/10 rounded-3xl p-8 flex flex-col gap-6 h-full hover:-translate-y-1 hover:border-emerald-400/30 transition-all duration-500">
                  <span className="self-start inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold"
                    style={{ background: "rgba(91,228,155,0.10)", border: "1px solid rgba(91,228,155,0.3)", color: "#5BE49B" }}>
                    {t.metric}
                  </span>
                  <p className="text-[17px] leading-snug tracking-[-0.01em]">"{t.q}"</p>
                  <div className="mt-auto flex items-center gap-3 pt-6 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full grid place-items-center font-semibold text-[#080D17] text-sm"
                      style={{ background: "linear-gradient(135deg,#52A5FF,#1AD5E6)" }}>
                      {t.a}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.n}</div>
                      <div className="text-slate-600 text-[13px]">{t.r}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section id="founder" className="py-28 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,1.4fr] gap-14 items-center">
              <div className="aspect-[4/5] rounded-3xl border border-white/10 relative overflow-hidden flex items-end p-7"
                style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(82,165,255,0.45), transparent 60%), linear-gradient(180deg,#1A1F2C,#0C0E12)" }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-[160px] font-bold tracking-[-0.06em] bg-clip-text text-transparent pointer-events-none"
                  style={{ backgroundImage: "linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.02))" }}>AM</div>
                <div className="relative z-10 px-3.5 py-2 bg-black/50 backdrop-blur border border-white/10 rounded-full text-xs text-slate-400">
                  Alexander Mills · Founder & CEO
                </div>
              </div>
              <div>
                <div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">Why we exist</div>
                <h3 className="text-[clamp(28px,3.4vw,44px)] tracking-[-0.03em] font-semibold mb-5 leading-tight">Most AI vendors will sell you a tool. We'll sell you the outcome.</h3>
                <p className="text-slate-400 text-base leading-relaxed mb-4">
                  Train Your Agent was started because the gap between "demo-good" AI and "production-good" AI is enormous — and almost nobody is willing to cross it for a regional HVAC company, a solar installer, or a mid-market law firm.
                </p>
                <p className="text-slate-400 text-base leading-relaxed mb-4">
                  We're a full-stack team building the AI infrastructure for businesses that don't have a "Head of AI" and don't need one. We do the work. You get the system.
                </p>
                <p className="italic text-2xl text-white mt-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  "Software is how AI ships. We ship the software."
                </p>
                <div className="grid grid-cols-3 gap-8 mt-7 pt-7 border-t border-white/10">
                  {[["200+","Production deployments"],["16","Verticals shipped"],["99.94%","Uptime, trailing 12mo"]].map(([n,l],i) => (
                    <div key={i}>
                      <div className="text-[28px] font-semibold tracking-[-0.03em] bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(120deg,#fff,#1AD5E6)" }}>{n}</div>
                      <div className="text-slate-600 text-xs">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BOOK + AIRTABLE */}
      <section id="book" className="py-28 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">Book your discovery call</div></Reveal>
          <Reveal><h2 className="text-[clamp(38px,4.6vw,60px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">Pick a time. Get a working agent by Friday.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-12">Two ways to start: book a 30-minute call with the founders, or drop your details and we'll reach out.</p></Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6">
            {/* Cal embed */}
            <Reveal>
              <div className="bg-[#0C1426] border border-white/10 rounded-3xl p-3 overflow-hidden h-full"
                style={{ boxShadow: "0 0 60px -10px rgba(82,165,255,0.3)" }}>
                <div className="px-5 py-3 flex items-center justify-between">
                  <div className="text-sm font-semibold">Schedule via Cal.com</div>
                  <a href="https://cal.com/trainyouragent" target="_blank" rel="noreferrer" className="text-xs text-cyan-300 hover:text-cyan-200">Open in new tab ↗</a>
                </div>
                <iframe
                  src="https://cal.com/trainyouragent?embed=true&theme=dark&hideEventTypeDetails=false"
                  title="Book a call with Train Your Agent"
                  className="w-full rounded-2xl bg-white/5"
                  style={{ height: 720, border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
            </Reveal>
            {/* Airtable form */}
            <Reveal>
              <div className="bg-[#0C1426] border border-white/10 rounded-3xl p-3 overflow-hidden h-full">
                <div className="px-5 py-3 flex items-center justify-between">
                  <div className="text-sm font-semibold">Or get in touch</div>
                  <span className="text-xs text-slate-500">We respond within an hour</span>
                </div>
                <iframe
                  src="https://airtable.com/embed/appREPLACEME/shrREPLACEME?backgroundColor=blue"
                  title="Get started with Train Your Agent"
                  className="w-full rounded-2xl bg-white/5"
                  style={{ height: 720, border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <div className="px-5 py-3 text-[11px] text-slate-600">If the form doesn't load, email <span className="text-cyan-300">hello@trainyouragent.com</span> — we'll set you up directly.</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4 text-center">FAQ</div></Reveal>
          <Reveal><h2 className="text-[clamp(38px,4.6vw,60px)] leading-[1.05] tracking-[-0.03em] font-semibold mb-14 text-center max-w-3xl mx-auto">The questions we get on every discovery call.</h2></Reveal>
          <div className="max-w-3xl mx-auto">
            {[
              { q: "What if Tya doesn't know an answer?", a: "She escalates with full call context to your team, captures the question for follow-up, or in regulated verticals refuses cleanly and books a human callback. Every \"I don't know\" enters the eval set and is fixed in the next weekly refresh." },
              { q: "Do we change phone numbers?", a: "No. We port your existing number or sit in front via SIP routing. Customers dial the number they always dialed." },
              { q: "How is this different from Retell, Vapi, Voiceflow?", a: "Those are platforms — DIY toolkits. We're the team. We handle build, training, deployment, monitoring, and weekly improvement so your ops team never opens a flow editor." },
              { q: "Who owns the model and data?", a: "You do. On Pro you license the fine-tune. On Full-Stack we hand you the weights, training data export, and ops runbook. Your data is never used to train other customers' models." },
              { q: "What's the SLA?", a: "99.9% uptime on Voice Pro and above with credits if we miss. We're at 99.94% trailing 12 months across all production traffic." },
              { q: "HIPAA, SOC 2 — what's the security story?", a: "SOC 2 Type II in progress, HIPAA-ready architecture today. Private VPC deploys on Full-Stack. We can sit through your security review with our security lead." },
              { q: "What if we want to leave?", a: "Month-to-month after the initial 90-day commit. Full data export on request, no claw-backs, no destruction theater." },
            ].map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pt-28 pb-36 text-center relative z-10"
        style={{ background: "radial-gradient(900px 460px at 50% 100%, rgba(82,165,255,0.22), transparent 60%)" }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-[clamp(44px,5.5vw,84px)] tracking-[-0.04em] leading-[1.02] font-semibold mb-5">
              Stop running your business<br />
              on <span className="italic font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>yesterday</span>.
            </h2>
          </Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-xl mx-auto mb-10">One 30-minute call. By Friday you have an AI system — voice, ads, SEO, web, automation, whatever you need — trained on your business and live in production.</p></Reveal>
          <Reveal>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href="#book" className="relative inline-flex items-center gap-2 px-7 py-4 rounded-xl text-[15px] font-semibold text-white overflow-hidden group"
                style={{ background: "linear-gradient(180deg,#52A5FF 0%,#0DA2E7 100%)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.32), 0 18px 50px -10px rgba(82,165,255,0.5)" }}>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                Book a discovery call →
              </a>
              <a href="#demo" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-[15px] font-semibold border border-white/10 hover:bg-white/5 transition">Talk to Tya first</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 pt-16 pb-10 mt-24 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-[1.4fr,1fr,1fr,1fr] gap-10 mb-14">
            <div>
              <Link to="/" className="flex items-center gap-3 font-bold text-base tracking-tight mb-4">
                <Logo size={40} />
                <span>TrainYourAgent</span>
              </Link>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">The Everything AI Company. We design, train, deploy, and run the entire AI stack — for businesses and consumers — under one roof.</p>
            </div>
            {[
              { h: "For Businesses", links: [["#services","AI Voice Agents"],["#services","AI Chatbots"],["#services","AI SEO"],["#services","Paid Ads (AI)"],["#services","Lead Generation"],["#services","Web Redesigns"],["#services","Custom Models"]] },
              { h: "For Consumers",  links: [["#services","Personal AI"],["#services","Workflow Automations"],["#services","Custom GPTs"],["#services","AI Coaching"],["#services","Done-For-You"]] },
              { h: "Company",        links: [["#founder","About"],["#niches","Verticals"],["#book","Contact"],["#pricing","Pricing"],["#","Privacy"],["#","Terms"]] },
            ].map((c, i) => (
              <div key={i}>
                <h5 className="text-sm font-semibold mb-4">{c.h}</h5>
                {c.links.map(([href, label], j) => (
                  <a key={j} href={href} className="block text-slate-400 text-sm py-1.5 hover:text-white transition">{label}</a>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-8 border-t border-white/10 text-slate-600 text-[13px] flex-wrap gap-4">
            <div>© 2026 TrainYourAgent, Inc. Built in Florida.</div>
            <div>hello@trainyouragent.com · +1 (415) ••• ••72</div>
          </div>
        </div>
      </footer>

      {/* Local styles */}
      <style>{`
        @keyframes shimmer { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Index;
