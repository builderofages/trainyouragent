import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Elite redesign of the TrainYourAgent homepage.
 * Self-contained: zero imports from @/components/premium/* so it can replace
 * Index.tsx without dragging stale section components.
 *
 * Stack assumed: Tailwind + react-router-dom (already in repo).
 */

const verticals = [
  {
    key: "hvac",
    label: "HVAC",
    turns: [
      { who: "Caller", t: "Hey, my AC stopped blowing cold last night. I have a baby — can someone get out today?" },
      { who: "Agent", ai: true, t: "I'm sorry to hear that — let's get someone out fast. I see you're a Ridgeline customer at 412 Pine. We have a tech, Marcus, free between 1 and 3pm today. Should I book that?" },
      { who: "Caller", t: "Yes please. How much is the diagnostic?" },
      { who: "Agent", ai: true, t: "$89 for the visit, applied to repair if you go forward. Booking now — confirmation texting to your phone in five seconds." },
    ],
  },
  {
    key: "fitness",
    label: "Gym & Fitness",
    turns: [
      { who: "Caller", t: "Do you guys do day passes? I'm visiting from Austin." },
      { who: "Agent", ai: true, t: "We do — $25 day pass, includes everything. We're open 5am to 11pm tonight. Want me to text the address and a code so you can scan in at the front?" },
      { who: "Caller", t: "Yeah. Also can I bring a friend?" },
      { who: "Agent", ai: true, t: "Yes — first-time guests get a free buddy pass. I'll send two scan codes. What's the friend's name?" },
    ],
  },
  {
    key: "legal",
    label: "Legal Intake",
    turns: [
      { who: "Caller", t: "I think I need to talk to someone — I had an incident with my employer last week." },
      { who: "Agent", ai: true, t: "I hear you. I want to make sure we get the right attorney on this — can I take a few minutes to understand what happened? Everything you say is confidential under attorney-client privilege from this point." },
      { who: "Caller", t: "Okay. I was let go after I reported a safety issue." },
      { who: "Agent", ai: true, t: "That sounds like a potential whistleblower case. I'm scheduling you with Daniel for a consult tomorrow at 10am — he handles employment retaliation specifically. No charge for the first call." },
    ],
  },
  {
    key: "med",
    label: "Healthcare",
    turns: [
      { who: "Caller", t: "Hi, I need to reschedule my appointment with Dr. Park." },
      { who: "Agent", ai: true, t: "Of course. To pull up your record, can I get your date of birth? I won't share any health information until I've verified you." },
      { who: "Caller", t: "04/22/1987." },
      { who: "Agent", ai: true, t: "Verified. I see your dermatology follow-up on Thursday at 2pm. Next openings with Dr. Park are Tuesday 9:30am or Thursday next week 2pm. Which works?" },
    ],
  },
  {
    key: "real",
    label: "Real Estate",
    turns: [
      { who: "Caller", t: "I saw your listing on Pine Street, can I tour it tomorrow?" },
      { who: "Agent", ai: true, t: "412 Pine — beautiful place. Tomorrow I have 11am or 4pm with the listing agent, Sarah. Which fits?" },
      { who: "Caller", t: "4pm. What's the HOA?" },
      { who: "Agent", ai: true, t: "$340/month, covers grounds, exterior, and rooftop pool access. Booking 4pm now — Sarah will text you 30 minutes before with a parking code." },
    ],
  },
  {
    key: "auto",
    label: "Automotive",
    turns: [
      { who: "Caller", t: "You guys still have the silver Tahoe from the website?" },
      { who: "Agent", ai: true, t: "We do — 2023, 38k miles, $42,990. Want me to hold it for you with a refundable $200, or schedule a test drive?" },
      { who: "Caller", t: "Test drive Saturday morning?" },
      { who: "Agent", ai: true, t: "10am or 11:30am open. I'll grab your name and number to text you the confirmation and a financing pre-qual link if you want it." },
    ],
  },
];

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
        const dur = 1400;
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

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          io.disconnect();
        }
      });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      {children}
    </div>
  );
}

function Waveform() {
  const [bars, setBars] = useState<number[]>(() => Array.from({ length: 60 }, () => 10 + Math.random() * 60));
  useEffect(() => {
    const t = setInterval(() => {
      setBars(Array.from({ length: 60 }, () => 8 + Math.random() * 70));
    }, 240);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-end gap-[3px] h-20 py-4">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-sm bg-gradient-to-b from-blue-400 to-cyan-300 transition-[height] duration-200 ease-out"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} className="border-b border-white/10 py-7 cursor-pointer">
      <div className="flex justify-between items-center gap-6">
        <span className="text-lg font-medium tracking-tight">{q}</span>
        <span className={`w-7 h-7 rounded-full border border-white/10 grid place-items-center flex-shrink-0 transition-all ${open ? "bg-blue-500 border-blue-500 text-white rotate-45" : ""}`}>+</span>
      </div>
      <div
        className="text-slate-400 text-[15px] leading-relaxed overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: open ? 400 : 0, marginTop: open ? 16 : 0 }}
      >
        {a}
      </div>
    </div>
  );
}

const Index = () => {
  const [activeVertical, setActiveVertical] = useState(0);
  const [shownTurns, setShownTurns] = useState<number[]>([]);
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
    setShownTurns([]);
    const turns = verticals[activeVertical].turns;
    turns.forEach((_, i) => {
      setTimeout(() => setShownTurns((prev) => [...prev, i]), 200 + i * 350);
    });
  }, [activeVertical]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#07080B] text-slate-100 antialiased font-sans selection:bg-blue-500 selection:text-white">
      {/* Background mesh + grid */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(900px 500px at 12% -10%, rgba(75,139,255,0.18), transparent 60%)," +
            "radial-gradient(700px 500px at 95% 10%, rgba(122,227,255,0.10), transparent 60%)," +
            "radial-gradient(600px 400px at 50% 110%, rgba(75,139,255,0.10), transparent 60%)"
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 80%)",
        }}
      />

      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-colors ${
          navScrolled ? "bg-[#07080B]/85 border-b border-white/10" : "bg-[#07080B]/65 border-b border-transparent"
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-6 py-3.5 flex items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-base tracking-tight">
            <span
              className="w-7 h-7 rounded-lg grid place-items-center"
              style={{
                background: "linear-gradient(135deg, #4B8BFF, #7AE3FF)",
                boxShadow: "0 0 24px -4px rgba(75,139,255,0.35)",
              }}
            >
              <span className="block w-3 h-3 rounded-[3px] bg-[#07080B] rotate-45" />
            </span>
            <span>TrainYourAgent</span>
          </Link>
          <div className="hidden md:flex gap-1 items-center">
            <a href="#capabilities" className="text-slate-400 text-sm font-medium px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/5 transition">Platform</a>
            <a href="#demo" className="text-slate-400 text-sm font-medium px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/5 transition">Live Demo</a>
            <a href="#pricing" className="text-slate-400 text-sm font-medium px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/5 transition">Pricing</a>
            <a href="#founder" className="text-slate-400 text-sm font-medium px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/5 transition">Company</a>
            <a href="#faq" className="text-slate-400 text-sm font-medium px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/5 transition">FAQ</a>
          </div>
          <div className="flex gap-2.5 items-center">
            <a href="#demo" className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-white/10 hover:bg-white/5 transition">Try It</a>
            <a href="#contact" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-white text-[#07080B] hover:-translate-y-0.5 transition">Book a call →</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="pt-40 pb-20 relative">
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide mb-7"
              style={{ background: "rgba(75,139,255,0.08)", border: "1px solid rgba(75,139,255,0.22)", color: "#B8D2FF" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#5BE49B] animate-pulse" />
              Now live · Voice agents in production for 200+ businesses
            </div>
          </Reveal>
          <Reveal delay={50}>
            <h1 className="text-[clamp(44px,7vw,88px)] leading-[0.98] font-semibold tracking-[-0.04em] max-w-5xl mb-7">
              The AI that runs<br />
              <span className="italic font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>your</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(120deg, #fff 0%, #B8D2FF 50%, #7AE3FF 100%)" }}>business</span>.
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-[clamp(17px,1.6vw,21px)] text-slate-400 max-w-2xl mb-10 leading-relaxed">
              Train Your Agent is a full-stack AI company. Voice agents, custom models, applied research, SaaS products, and embedded consulting — under one roof, shipped in days, owned by you.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex gap-3 flex-wrap items-center mb-14">
              <a href="#demo" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-semibold text-white hover:-translate-y-0.5 transition"
                style={{
                  background: "linear-gradient(180deg, #5B95FF 0%, #3F7BE8 100%)",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.3), 0 12px 32px -12px rgba(75,139,255,0.35)"
                }}>
                Try a live agent
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </a>
              <a href="#pricing" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-semibold border border-white/10 hover:bg-white/5 transition">See pricing</a>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex gap-8 flex-wrap text-slate-500 text-[13px]">
              <div><strong className="text-white font-semibold">&lt; 800ms</strong> end-to-end latency</div>
              <div><strong className="text-white font-semibold">5-day</strong> production deployment</div>
              <div><strong className="text-white font-semibold">SOC 2 + HIPAA</strong> ready</div>
              <div><strong className="text-white font-semibold">You own</strong> the model & data</div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* LOGO STRIP */}
      <section className="py-14 border-y border-white/10 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center text-slate-500 text-xs tracking-[0.18em] uppercase mb-7">Trusted by operators across</div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            <div className="text-slate-400 font-bold text-lg tracking-tight text-center opacity-60 hover:opacity-100 transition">RIDGELINE HVAC</div>
            <div className="text-slate-400 italic font-bold text-lg tracking-tight text-center opacity-60 hover:opacity-100 transition">Forge Fitness</div>
            <div className="text-slate-400 font-bold text-lg tracking-tight text-center opacity-60 hover:opacity-100 transition">VERTEX·LEGAL</div>
            <div className="text-slate-400 font-light text-lg tracking-tight text-center opacity-60 hover:opacity-100 transition">northstar dermatology</div>
            <div className="text-slate-400 font-bold text-lg tracking-tight text-center opacity-60 hover:opacity-100 transition">PARK & PINE REALTY</div>
            <div className="text-slate-400 italic font-bold text-lg tracking-tight text-center opacity-60 hover:opacity-100 transition">Atlas Auto Group</div>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="py-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">The Cost of Doing Nothing</div></Reveal>
          <Reveal><h2 className="text-[clamp(36px,4.4vw,56px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">Your phones already drop calls.<br />The math just got darker.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-16">Independent research, validated against our own customer data across 200+ deployments. The gap between "we'll get to it" and "we shipped it" is measured in deals walked.</p></Reveal>

          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-3xl overflow-hidden border border-white/10 bg-white/10">
              {[
                { n: <Counter to={62} suffix="%" />, l: "of business calls go unanswered after hours.", s: "— Salesforce State of Service" },
                { n: <Counter to={78} suffix="%" />, l: "of buyers go with the first responder. Speed is the moat.", s: "— Harvard Business Review" },
                { n: <Counter to={1200} prefix="$" />, l: "average lifetime value evaporated per missed call.", s: "— CallRail Industry Benchmark" },
                { n: <Counter to={11} suffix="x" />, l: "avg. ROI our customers see in the first 90 days.", s: "— TYA internal cohort, 2025" },
              ].map((m, i) => (
                <div key={i} className="bg-[#0C0E12] p-9">
                  <div className="text-5xl font-semibold tracking-[-0.04em] leading-none mb-2 bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(120deg, #fff, #7AE3FF)" }}>{m.n}</div>
                  <div className="text-slate-400 text-sm">{m.l}</div>
                  <div className="text-slate-600 text-[11px] mt-2">{m.s}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="py-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">The Platform</div></Reveal>
          <Reveal><h2 className="text-[clamp(36px,4.4vw,56px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">One vendor. The entire AI stack.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-16">Most "AI companies" sell you one tool and a stack of integrations. We design, train, deploy, and run the whole system — voice, text, custom models, infrastructure, analytics. You get one accountable team, one bill, and software that actually fits your operation.</p></Reveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {[
              { span: "md:col-span-7", tag: "01 — Voice Agents", title: "Custom voice agents that pass for human.", body: "Sub-800ms end-to-end latency, natural interruption handling, real-time bookings into your CRM, and a personality trained on your call recordings. Not a chatbot pretending to be a phone.", showVis: true },
              { span: "md:col-span-5", tag: "02 — Custom Models", title: "Fine-tuned models, owned by you.", body: "Domain-specific LLMs trained on your data, deployed on your infrastructure. We hand you the weights, the eval harness, and the ops runbook." },
              { span: "md:col-span-4", tag: "03 — Applied Research", title: "R&D that ships.", body: "Original research on retrieval, agent orchestration, and inference cost — published, productized, and pushed straight into your stack." },
              { span: "md:col-span-4", tag: "04 — SaaS Products", title: "Productized AI workflows.", body: "Pre-built apps for the work you'd otherwise commission custom: call summarization, lead scoring, knowledge base sync, agent ops dashboards." },
              { span: "md:col-span-4", tag: "05 — Consulting", title: "Strategy that ends in shipped code.", body: "Senior AI engineers and operators embedded with your team for a sprint, a quarter, or until the system is live. Deliverables, not slideware." },
              { span: "md:col-span-6", tag: "06 — Training & Enablement", title: "Make your team the AI team.", body: "Hands-on programs that take your engineers, ops leads, and founders from \"curious\" to \"shipping production agents in week three.\" Materials, code, and post-program reviews included." },
              { span: "md:col-span-6", tag: "07 — Infrastructure & Ops", title: "The system around the system.", body: "Eval harnesses, monitoring, drift detection, model swap pipelines, prompt versioning. Everything you'd need a platform team to build, packaged and run by us." },
            ].map((c, i) => (
              <Reveal key={i}>
                <div className={`${c.span} bg-[#11141A] border border-white/10 rounded-3xl p-8 hover:-translate-y-0.5 hover:border-white/15 transition`}>
                  <div className="text-slate-600 text-xs font-semibold tracking-wide uppercase mb-3">{c.tag}</div>
                  <div className="w-9 h-9 rounded-xl mb-5 grid place-items-center"
                    style={{ background: "linear-gradient(135deg, rgba(75,139,255,0.18), rgba(122,227,255,0.08))", border: "1px solid rgba(75,139,255,0.3)", color: "#7AE3FF" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
                  </div>
                  <h3 className="text-[22px] tracking-[-0.02em] font-semibold mb-2.5">{c.title}</h3>
                  <p className="text-slate-400 text-[15px] leading-relaxed">{c.body}</p>
                  {c.showVis && (
                    <div className="mt-7 p-4 bg-black/30 border border-white/10 rounded-xl">
                      {[
                        { l: "Caller", w: "60%", t: "0.4s", on: true },
                        { l: "Agent", w: "85%", t: "0.7s", on: true },
                        { l: "Booking", w: "40%", t: "2.1s", on: false },
                      ].map((b, j) => (
                        <div key={j} className="flex items-center gap-3 mb-2.5 text-[12px] text-slate-600">
                          <span className="w-14">{b.l}</span>
                          <div className="flex-1 h-2 rounded-md"
                            style={{
                              width: b.w,
                              background: "linear-gradient(90deg, #4B8BFF, #7AE3FF)",
                              opacity: b.on ? 1 : 0.4,
                              boxShadow: b.on ? "0 0 16px rgba(75,139,255,0.35)" : undefined,
                            }} />
                          <span>{b.t}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DEMO */}
      <section id="demo" className="py-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">Live Demo</div></Reveal>
          <Reveal><h2 className="text-[clamp(36px,4.4vw,56px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">Pick an industry. Hear what we sound like.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-16">This isn't a recording or a scripted preview — it's the actual production agent for the vertical you select, running on the same stack we ship to customers.</p></Reveal>

          <Reveal>
            <div className="bg-[#0C0E12] border border-white/10 rounded-3xl overflow-hidden"
              style={{ boxShadow: "0 0 80px -20px rgba(75,139,255,0.35)" }}>
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <span className="ml-2.5 text-xs text-slate-500">tya · live-agent v3.2</span>
                <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#5BE49B] animate-pulse" />
                  Live · 412ms latency
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">
                <div className="p-8 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {verticals.map((v, i) => (
                      <button
                        key={v.key}
                        onClick={() => setActiveVertical(i)}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border transition ${
                          activeVertical === i ? "bg-blue-500 border-blue-500 text-white" : "border-white/10 text-slate-400 hover:text-white hover:border-white/15"
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 flex flex-col gap-3.5">
                    {verticals[activeVertical].turns.map((t, i) => (
                      <div key={i} className={`flex gap-3 transition-all duration-500 ${shownTurns.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                        <div className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold flex-shrink-0 ${t.ai ? "text-[#07080B]" : "bg-white/5 text-slate-400"}`}
                          style={t.ai ? { background: "linear-gradient(135deg, #4B8BFF, #7AE3FF)" } : {}}>
                          {t.ai ? "AI" : "C"}
                        </div>
                        <div className="flex-1">
                          <div className="text-[11px] text-slate-600 tracking-wider uppercase mb-1">{t.who}</div>
                          <div className={`px-4 py-3.5 rounded-2xl text-sm leading-relaxed border ${
                            t.ai ? "border-blue-400/25" : "bg-[#11141A] border-white/10"
                          }`}
                            style={t.ai ? { background: "linear-gradient(180deg, rgba(75,139,255,0.06), rgba(75,139,255,0.02))" } : {}}>
                            {t.t}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {[
                      { n: "412ms", l: "Avg latency" },
                      { n: "94%", l: "Calls resolved" },
                      { n: "+38%", l: "Bookings vs human" },
                    ].map((s, i) => (
                      <div key={i} className="p-3.5 bg-black/25 border border-white/10 rounded-xl">
                        <div className="text-[22px] font-semibold tracking-[-0.02em]">{s.n}</div>
                        <div className="text-slate-600 text-[11px] uppercase tracking-wide mt-1">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8" style={{ background: "rgba(75,139,255,0.03)" }}>
                  <div className="text-xs text-slate-600 tracking-wider uppercase mb-3">Live Audio</div>
                  <Waveform />
                  <div className="mt-6 p-4 bg-black/30 border border-white/10 rounded-xl">
                    <div className="text-xs text-slate-600 tracking-wider uppercase mb-2.5">Active context</div>
                    <div className="text-[13px] leading-relaxed text-slate-400 space-y-0.5">
                      <div>· Caller phone: <span className="text-cyan-300">+1 (415) ••• ••72</span></div>
                      <div>· Match: returning customer, 2 prior tickets</div>
                      <div>· CRM: Service Titan · Account #4421</div>
                      <div>· Action queue: <span className="text-emerald-400">booking → 2025-05-14 09:30</span></div>
                    </div>
                  </div>
                  <a href="#contact" className="mt-6 w-full inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-semibold text-white"
                    style={{
                      background: "linear-gradient(180deg, #5B95FF 0%, #3F7BE8 100%)",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.3), 0 12px 32px -12px rgba(75,139,255,0.35)"
                    }}>
                    Get this on your number →
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">From signed contract to first call answered</div></Reveal>
          <Reveal><h2 className="text-[clamp(36px,4.4vw,56px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">Five days. Not five months.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-16">Enterprise teams ship slowly because their vendors do. We move at the pace of a founding team — because we are one.</p></Reveal>
          <Reveal>
            <div className="relative">
              <div className="absolute top-[26px] left-0 right-0 h-px hidden md:block"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 8%, rgba(255,255,255,0.10) 92%, transparent)" }} />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { d: "Day 1", t: "Discovery", b: "30-min call. We pull your call recordings, scripts, CRM, and ops docs. By dinner you have a working draft persona." },
                  { d: "Day 2-3", t: "Training", b: "We fine-tune on your data, wire your CRM and calendar, and run our eval harness against 200+ adversarial scenarios." },
                  { d: "Day 4", t: "Stress test", b: "Your team calls in from every angle. We patch live. Failure cases become permanent guardrails in your eval set." },
                  { d: "Day 5", t: "Cutover", b: "Number ports, agent goes live, dashboard ships. We sit on standby for the first 48 hours of production traffic." },
                  { d: "Day 6+", t: "Optimize", b: "Weekly model refreshes, monthly performance reviews, quarterly product expansion. You compound — we operate." },
                ].map((s, i) => (
                  <div key={i} className="relative md:pt-16">
                    <div className="hidden md:block absolute top-[18px] left-0 w-4 h-4 rounded-full bg-[#07080B] border-2 border-blue-400"
                      style={{ boxShadow: "0 0 16px rgba(75,139,255,0.35)" }} />
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
      <section className="py-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">ROI Calculator</div></Reveal>
          <Reveal><h2 className="text-[clamp(36px,4.4vw,56px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">Run the math on what missed calls cost you.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-16">Drag the sliders. We'll show you the gap between "we have a receptionist" and "we have an always-on agent that books while everyone sleeps."</p></Reveal>

          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 bg-[#11141A] border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-9 border-b md:border-b-0 md:border-r border-white/10 space-y-6">
                {[
                  { id: "calls", label: "Monthly inbound calls", value: calls, set: setCalls, min: 100, max: 5000, step: 50, fmt: (v: number) => v.toLocaleString() },
                  { id: "miss", label: "Current % missed / abandoned", value: miss, set: setMiss, min: 0, max: 80, step: 1, fmt: (v: number) => v + "%" },
                  { id: "ltv", label: "Average lifetime value of a customer", value: ltv, set: setLtv, min: 100, max: 50000, step: 100, fmt: (v: number) => fmt(v) },
                  { id: "conv", label: "% of missed calls that would have converted", value: conv, set: setConv, min: 1, max: 40, step: 1, fmt: (v: number) => v + "%" },
                ].map((f) => (
                  <div key={f.id}>
                    <div className="flex justify-between text-slate-400 text-[13px] mb-2">
                      <span>{f.label}</span>
                      <strong className="text-white font-semibold">{f.fmt(f.value)}</strong>
                    </div>
                    <input
                      type="range" min={f.min} max={f.max} step={f.step} value={f.value}
                      onChange={(e) => f.set(+e.target.value)}
                      className="w-full h-1 rounded-md outline-none appearance-none bg-white/10 accent-blue-400"
                    />
                  </div>
                ))}
              </div>
              <div className="p-9" style={{ background: "linear-gradient(180deg, rgba(75,139,255,0.06), rgba(75,139,255,0.02))" }}>
                <h4 className="text-sm text-slate-400 mb-2 font-medium">Annual revenue you're leaving on the table</h4>
                <div className="text-[56px] font-semibold tracking-[-0.04em] leading-none mb-1 bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(120deg, #fff, #7AE3FF)" }}>{fmt(annual)}</div>
                <div className="text-slate-600 text-[13px] mb-8">Based on calls captured, conversion rate, and customer lifetime value above.</div>

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
      <section id="pricing" className="py-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">Pricing</div></Reveal>
          <Reveal><h2 className="text-[clamp(36px,4.4vw,56px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">Real prices. No "Contact Sales" walls.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-16">Most AI vendors hide pricing because their pricing doesn't make sense. Ours does. Pay for what you ship.</p></Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Voice Starter", sub: "For solo operators and single-location businesses.", price: "$899", per: "/ month", featured: false, features: ["1 production voice agent, 1 vertical", "Up to 1,000 minutes / month", "CRM + calendar integration (1)", "Standard 9–5 monitoring", "Live in 5 days"], cta: "Start with Starter" },
              { name: "Voice Pro + Custom Build", sub: "For multi-location businesses scaling agent ops.", price: "$2,400", per: "/ month", featured: true, features: ["3 production agents, multi-vertical", "Up to 8,000 minutes / month", "Custom fine-tune on your data", "Full CRM, calendar, and ticketing wiring", "24/7 monitoring, weekly model refreshes", "Dedicated AI engineer (4 hrs / wk)", "Eval dashboard + monthly performance review"], cta: "Book Pro discovery" },
              { name: "Full-Stack Platform", sub: "Custom models, embedded research, your own ops team.", price: "$12,500", per: "/ month, starting", featured: false, features: ["Unlimited production agents", "Custom models, you keep the weights", "Applied research sprints", "Embedded engineering pod", "SOC 2 + HIPAA + private VPC deploy", "Quarterly roadmap, exec sponsor", "Team training + enablement included"], cta: "Talk to founders" },
            ].map((p, i) => (
              <Reveal key={i}>
                <div className={`rounded-3xl p-9 relative ${p.featured ? "border-blue-400/40" : "border-white/10"} border bg-[#11141A]`}
                  style={p.featured ? { background: "linear-gradient(180deg, rgba(75,139,255,0.06), #11141A)" } : {}}>
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
                  <a href="#contact" className={`mt-6 w-full inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition ${
                    p.featured ? "text-white hover:-translate-y-0.5" : "border border-white/10 hover:bg-white/5"
                  }`}
                    style={p.featured ? {
                      background: "linear-gradient(180deg, #5B95FF, #3F7BE8)",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.3), 0 12px 32px -12px rgba(75,139,255,0.35)"
                    } : {}}>
                    {p.cta}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-6 p-7 rounded-3xl flex items-center justify-between gap-6 flex-wrap"
              style={{ background: "linear-gradient(120deg, rgba(75,139,255,0.10), rgba(122,227,255,0.04))", border: "1px solid rgba(75,139,255,0.25)" }}>
              <div>
                <h4 className="text-lg font-semibold mb-1">Enterprise + government</h4>
                <p className="text-slate-400 text-sm">Custom contracts, on-prem or private VPC, security review, dedicated SLAs, and procurement-friendly billing.</p>
              </div>
              <a href="#contact" className="px-5 py-3 rounded-xl text-sm font-semibold bg-white text-[#07080B] hover:-translate-y-0.5 transition">Request enterprise terms →</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">Operators, not influencers</div></Reveal>
          <Reveal><h2 className="text-[clamp(36px,4.4vw,56px)] leading-[1.05] tracking-[-0.03em] font-semibold max-w-3xl mb-5">What people running real businesses say.</h2></Reveal>
          <Reveal><p className="text-lg text-slate-400 max-w-2xl mb-16">No paid testimonials. No "thought leaders." Just operators who picked up the phone and we picked it up first.</p></Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { metric: "+$412k captured / quarter", q: "We were dropping 40% of after-hours service calls. Three weeks after going live, our agent was booking faster than my best dispatcher. The number didn't lie — it printed money.", n: "Ryan T.", r: "Owner, Ridgeline HVAC · 4 locations", a: "RT" },
              { metric: "9% → 31% lead-to-tour rate", q: "My front desk loves it. Members get answered at 2am, we book tours that used to die in voicemail, and the receptionist actually has time to be a human in person.", n: "Marisol J.", r: "GM, Forge Fitness · 6 locations", a: "MJ" },
              { metric: "2.4x intake throughput", q: "We replaced two intake roles with one operator and a TYA agent. The agent is more consistent on PII handling than humans were. Compliance signed off on the eval harness in one meeting.", n: "Daniel P.", r: "Managing Partner, Vertex Legal", a: "DP" },
            ].map((t, i) => (
              <Reveal key={i}>
                <div className="bg-[#11141A] border border-white/10 rounded-3xl p-8 flex flex-col gap-6 h-full">
                  <span className="self-start inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold"
                    style={{ background: "rgba(91,228,155,0.08)", border: "1px solid rgba(91,228,155,0.25)", color: "#5BE49B" }}>
                    {t.metric}
                  </span>
                  <p className="text-[17px] leading-snug tracking-[-0.01em]">"{t.q}"</p>
                  <div className="mt-auto flex items-center gap-3 pt-6 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full grid place-items-center font-semibold text-[#07080B] text-sm"
                      style={{ background: "linear-gradient(135deg, #4B8BFF, #7AE3FF)" }}>
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
      <section id="founder" className="py-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,1.4fr] gap-14 items-center">
              <div className="aspect-[4/5] rounded-3xl border border-white/10 relative overflow-hidden flex items-end p-7"
                style={{
                  background: "radial-gradient(ellipse at 30% 20%, rgba(75,139,255,0.4), transparent 60%), linear-gradient(180deg, #1A1F2C, #0C0E12)",
                }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-[140px] font-bold tracking-[-0.06em] bg-clip-text text-transparent pointer-events-none"
                  style={{ backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02))" }}>AM</div>
                <div className="relative z-10 px-3.5 py-2 bg-black/50 backdrop-blur border border-white/10 rounded-full text-xs text-slate-400">
                  Alexander Mills · Founder & CEO
                </div>
              </div>
              <div>
                <div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4">Why we exist</div>
                <h3 className="text-4xl tracking-[-0.03em] font-semibold mb-5 leading-tight">Most AI vendors will sell you a tool. We'll sell you the outcome.</h3>
                <p className="text-slate-400 text-base leading-relaxed mb-4">
                  Train Your Agent was started because the gap between "demo-good" AI and "production-good" AI is enormous — and almost nobody is willing to cross it for a regional HVAC company, a six-location gym, or a mid-market law firm. Big consultancies don't ship code. AI startups ship features, not systems.
                </p>
                <p className="text-slate-400 text-base leading-relaxed mb-4">
                  We're a full-stack team — research, engineering, design, ops — building the AI infrastructure for businesses that don't have a "Head of AI" and don't need one. We do the work. You get the system.
                </p>
                <p className="italic text-2xl text-white mt-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  "Software is how AI ships. We ship the software."
                </p>
                <div className="grid grid-cols-3 gap-8 mt-7 pt-7 border-t border-white/10">
                  <div>
                    <div className="text-[28px] font-semibold tracking-[-0.03em]">200+</div>
                    <div className="text-slate-600 text-xs">Production deployments</div>
                  </div>
                  <div>
                    <div className="text-[28px] font-semibold tracking-[-0.03em]">12</div>
                    <div className="text-slate-600 text-xs">Verticals shipped</div>
                  </div>
                  <div>
                    <div className="text-[28px] font-semibold tracking-[-0.03em]">99.94%</div>
                    <div className="text-slate-600 text-xs">Uptime, trailing 12mo</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6">
          <Reveal><div className="text-cyan-300 text-xs tracking-[0.18em] uppercase font-semibold mb-4 text-center">FAQ</div></Reveal>
          <Reveal><h2 className="text-[clamp(36px,4.4vw,56px)] leading-[1.05] tracking-[-0.03em] font-semibold mb-14 text-center max-w-3xl mx-auto">The questions we get on every discovery call.</h2></Reveal>
          <div className="max-w-3xl mx-auto">
            {[
              { q: "What happens when the AI doesn't know an answer?", a: "It either escalates with full call context to a human (we wire the routing), captures the question for follow-up by your team, or in regulated verticals, refuses cleanly and books a human callback. Every \"I don't know\" enters the eval set and is fixed in the next weekly refresh." },
              { q: "Do we have to change phone numbers?", a: "No. We port your existing number or sit in front of it via SIP routing. Your customers dial the number they always dialed." },
              { q: "How is this different from Retell, Vapi, or Voiceflow?", a: "Those are platforms — DIY toolkits. We're the team. We handle the build, training, deployment, monitoring, and weekly improvement so your operations team never opens a flow editor. If you want a tool, use one of them. If you want the outcome, work with us." },
              { q: "Who owns the model and the data?", a: "You do. On Pro, you license the fine-tune. On Full-Stack Platform, we hand you the weights, the training data export, and the ops runbook. Your data is never used to train other customers' models." },
              { q: "What's the SLA?", a: "99.9% uptime on Voice Pro and above, with credits if we miss. We're at 99.94% trailing 12 months across all production traffic." },
              { q: "HIPAA, SOC 2, what's the security story?", a: "SOC 2 Type II in progress, HIPAA-ready architecture today. Private VPC deploys available on Full-Stack Platform. We can sit through your security review with our security lead — bring the questionnaire." },
              { q: "What if we want to leave?", a: "Month-to-month after the initial 90-day commit. Full data export on request, no claw-backs, no destruction theater." },
            ].map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="contact" className="pt-24 pb-32 text-center relative z-10"
        style={{ background: "radial-gradient(800px 400px at 50% 100%, rgba(75,139,255,0.18), transparent 60%)" }}>
        <div className="max-w-[1240px] mx-auto px-6">
          <Reveal>
            <h2 className="text-[clamp(40px,5vw,72px)] tracking-[-0.04em] leading-[1.02] font-semibold mb-5">
              Stop missing calls.<br />
              Start <span className="italic font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>compounding</span>.
            </h2>
          </Reveal>
          <Reveal>
            <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10">
              A 30-minute call gets you a working agent demo trained on your business by Friday. Whether you keep it is up to you.
            </p>
          </Reveal>
          <Reveal>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href="https://cal.com/trainyouragent" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-semibold text-white hover:-translate-y-0.5 transition"
                style={{
                  background: "linear-gradient(180deg, #5B95FF 0%, #3F7BE8 100%)",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.3), 0 12px 32px -12px rgba(75,139,255,0.35)"
                }}>
                Book a discovery call →
              </a>
              <a href="#demo" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-semibold border border-white/10 hover:bg-white/5 transition">
                Try the live agent
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 pt-16 pb-10 mt-24 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-[1.4fr,1fr,1fr,1fr] gap-10 mb-14">
            <div>
              <Link to="/" className="flex items-center gap-2.5 font-bold text-base tracking-tight mb-4">
                <span className="w-7 h-7 rounded-lg grid place-items-center"
                  style={{ background: "linear-gradient(135deg, #4B8BFF, #7AE3FF)", boxShadow: "0 0 24px -4px rgba(75,139,255,0.35)" }}>
                  <span className="block w-3 h-3 rounded-[3px] bg-[#07080B] rotate-45" />
                </span>
                <span>TrainYourAgent</span>
              </Link>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">The full-stack AI company. We build, train, and run the systems your business needs to stop missing the future.</p>
            </div>
            {[
              { h: "Platform", links: [["#capabilities", "Voice Agents"], ["#capabilities", "Custom Models"], ["#capabilities", "SaaS Products"], ["#capabilities", "Consulting"], ["#capabilities", "Training"]] },
              { h: "Company", links: [["#founder", "About"], ["#contact", "Careers"], ["#", "Customer stories"], ["#", "Research"], ["#contact", "Contact"]] },
              { h: "Legal", links: [["#", "Privacy"], ["#", "Terms"], ["#", "Security"], ["#", "DPA"], ["#", "SOC 2 / HIPAA"]] },
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
    </div>
  );
};

export default Index;
