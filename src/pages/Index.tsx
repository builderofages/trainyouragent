import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="brainGlow" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#DCEBFA" />
            <stop offset="100%" stopColor="#E6F1FB" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#brainGlow)" />
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

const VERTICALS = [
  { slug: "/healthcare",    label: "Healthcare",   note: "Patient intake. BAA per customer." },
  { slug: "/legal",         label: "Legal",        note: "Intake, conflict checks, scheduling." },
  { slug: "/real-estate",   label: "Real Estate",  note: "Lead capture. Showing schedules." },
  { slug: "/hvac",          label: "HVAC",         note: "After-hours dispatch. Booking." },
  { slug: "/roofing",       label: "Roofing",      note: "Storm-season surge. Quotes." },
  { slug: "/solar",         label: "Solar",        note: "Lead qual. Site survey booking." },
  { slug: "/accounting",    label: "Accounting",   note: "Tax-season intake. Client triage." },
  { slug: "/automotive",    label: "Automotive",   note: "Service bay scheduling." },
];

const CAPABILITIES = [
  { h: "Marketing",       b: "Campaigns, content engines, conversion funnels — operated by agents." },
  { h: "Lead Gen",        b: "Outbound at agency scale, inbound qualified before your rep picks up." },
  { h: "Creative",        b: "Brand systems, landing pages, founder-grade copy." },
  { h: "Infrastructure",  b: "Agent stacks, model routing, fallback logic, telephony." },
  { h: "Research",        b: "Markets, competitors, ICPs. Synthesized into action." },
  { h: "Building",        b: "Voice agents, chat agents, internal tools, dashboards." },
  { h: "Scaling",         b: "From first ten customers to thousand-customer ops layer." },
  { h: "Optimizing",      b: "Conversion lifts, cost-per-call, agent accuracy — measured weekly." },
];

const FAQ_ITEMS = [
  { q: "Is this an off-the-shelf chatbot?", a: "No. Off-the-shelf bots say 'I can help with that' and stop. Our agents pull customer history, follow your exact qualification script, and close the loop — booking, ticket, CRM update, all of it." },
  { q: "How fast can a startup get live?",  a: "Days, not quarters. Most startups we work with are answering live calls within seven business days of kickoff." },
  { q: "Will my agent sound like a robot?", a: "No. We use top-tier voice models with prosody tuning. Most callers don't realize. We disclose 'AI assistant' on the open when your industry requires it." },
  { q: "What about data + security?",       a: "TLS in transit, AES-256 at rest, US hosting, zero training on your data, HIPAA BAA available, SOC 2 in evaluation." },
];

const Index = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "TrainYourAgent — Everything-AI for SMBs & Startups";
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B] overflow-x-hidden" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <BrainLogo size={36} />
            <span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-[14px] text-slate-700">
            <Link to="/about" className="hover:text-[#042C53]">About</Link>
            <Link to="/pricing" className="hover:text-[#042C53]">Pricing</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] shadow-sm">Book a call</a>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span className="block w-4 h-px bg-[#042C53] relative" style={{ boxShadow: mobileOpen ? "none" : "0 -5px 0 #042C53, 0 5px 0 #042C53", transform: mobileOpen ? "rotate(45deg)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-5 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-60" style={{ background: "radial-gradient(closest-side, #DCEBFA 0%, rgba(220,235,250,0) 70%)" }} />
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] text-[12px] font-semibold tracking-[0.12em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C] animate-pulse" /> Live · Agents in production
            </div>
            <h1 className="text-[44px] sm:text-[68px] lg:text-[80px] leading-[0.98] tracking-tight font-semibold text-[#042C53]">
              The AI that's <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>actually running</span> your business by morning.
            </h1>
            <p className="mt-7 text-[18px] sm:text-[20px] text-slate-700 leading-relaxed max-w-2xl">
              Voice agents, lead gen, creative, infrastructure — built by operators who've shipped 300+ projects across four years in AI. <span className="text-[#042C53] font-medium">$20K+/mo recurring</span> from SMBs and startups already running on us.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link to="/contact?lane=startup" className="px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] transition shadow-lg shadow-[#042C53]/15 flex items-center justify-between gap-3 min-w-[260px]">
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CC4EC] font-semibold mb-1">For Startups</span>
                  <span>Build me an agent →</span>
                </span>
              </Link>
              <Link to="/contact?lane=smb" className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] border-2 border-[#042C53]/15 hover:border-[#042C53] transition flex items-center justify-between gap-3 min-w-[260px]">
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-1">For SMBs</span>
                  <span>Stop missing calls →</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Brain orb */}
          <div className="relative h-[420px] lg:h-[480px] flex items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-square">
              <div className="absolute inset-0 rounded-full blur-2xl opacity-70" style={{ background: "radial-gradient(closest-side, #BDDAF4 0%, rgba(189,218,244,0) 70%)" }} />
              <div className="relative w-full h-full flex items-center justify-center">
                <BrainLogo size={300} />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/85 backdrop-blur border border-slate-200 text-[12px] text-slate-600 whitespace-nowrap">
                Four years deep in AI · Every major model
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF STRIP */}
      <section className="px-5 sm:px-8 py-14 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { n: "4 yrs",  l: "In AI, through every major model shift" },
            { n: "300+",   l: "Projects shipped" },
            { n: "$20K+",  l: "Monthly recurring" },
            { n: "14",     l: "Verticals supported" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-[40px] sm:text-[56px] leading-none tracking-tight font-semibold text-[#042C53]" style={{ fontFamily: "'Playfair Display', serif" }}>{s.n}</div>
              <div className="mt-2 text-[13px] text-slate-600 leading-snug">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="px-5 sm:px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Everything AI</div>
            <h2 className="text-[34px] sm:text-[48px] leading-[1.05] tracking-tight font-semibold text-[#042C53]">
              Not a chatbot company. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>The operating layer</span> for everything AI in your business.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CAPABILITIES.map((c, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#185FA5] hover:shadow-[0_4px_24px_-8px_rgba(4,44,83,0.18)] transition">
                <div className="text-[15px] font-semibold text-[#042C53] mb-2">{c.h}</div>
                <div className="text-[13px] text-slate-600 leading-relaxed">{c.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STARTUP SPOTLIGHT */}
      <section className="px-5 sm:px-8 py-24 bg-[#042C53] text-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.3fr_1fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-[#BDDAF4] text-[12px] font-semibold tracking-[0.12em] uppercase mb-6 border border-white/15">For Founders</div>
            <h2 className="text-[36px] sm:text-[56px] leading-[1.02] tracking-tight font-semibold">
              Building a startup? <br /><span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>You should not be answering phones.</span>
            </h2>
            <p className="mt-6 text-[18px] text-white/85 leading-relaxed max-w-xl">
              Voice agents, GTM infrastructure, brand systems, internal tooling — we build the layer that lets you go heads-down on the product.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/contact?lane=startup" className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg">Get the Startup Package →</Link>
              <a href={CAL_URL} target="_blank" rel="noopener" className="px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15">Book a 30-min build call</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { h: "Voice + chat agents", b: "Inbound, outbound, support. Live in days." },
              { h: "GTM infra",           b: "Lead enrichment, sequences, CRM wiring." },
              { h: "Brand systems",        b: "Logo, type, voice, site." },
              { h: "Internal tooling",    b: "Dashboards, ops scripts, AI co-pilots." },
            ].map((x, i) => (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="text-[14px] font-semibold mb-1.5">{x.h}</div>
                <div className="text-[12px] text-white/70 leading-relaxed">{x.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERTICALS */}
      <section className="px-5 sm:px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-10">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Currently live in</div>
            <h2 className="text-[32px] sm:text-[44px] leading-tight font-semibold text-[#042C53]">
              Built for your industry. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Not the average of all of them.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {VERTICALS.map((v, i) => (
              <Link key={i} to={v.slug} className="group rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#042C53] hover:shadow-[0_4px_24px_-10px_rgba(4,44,83,0.2)] transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[16px] font-semibold text-[#042C53] mb-1">{v.label}</div>
                    <div className="text-[12px] text-slate-600 leading-relaxed">{v.note}</div>
                  </div>
                  <span className="text-[#185FA5] text-[18px] transition-transform group-hover:translate-x-0.5">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="px-5 sm:px-8 py-24 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_2fr] gap-10 items-start">
          <div className="flex flex-col gap-4">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#E6F1FB] to-[#DCEBFA] border border-slate-200 flex items-center justify-center">
              <BrainLogo size={140} />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-[15px] font-semibold text-[#042C53]">Alexander Mills</div>
              <div className="text-[13px] text-slate-600">Founder · TrainYourAgent</div>
              <div className="text-[13px] text-slate-600">Tampa Bay, Florida</div>
              <div className="flex flex-wrap gap-2 mt-3">
                <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="text-[13px] text-[#042C53] underline decoration-[#185FA5]/40 hover:decoration-[#185FA5]">LinkedIn</a>
                <span className="text-slate-300">·</span>
                <a href={CAL_URL} target="_blank" rel="noopener" className="text-[13px] text-[#042C53] underline decoration-[#185FA5]/40 hover:decoration-[#185FA5]">Book a call</a>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Founder-led</div>
            <h2 className="text-[32px] sm:text-[44px] leading-[1.08] tracking-tight font-semibold text-[#042C53] mb-6">
              Built by someone who's <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>been shipping for a decade.</span>
            </h2>
            <div className="text-[16px] text-slate-700 leading-[1.75] space-y-4">
              <p>Alexander Mills has been building since he was fifteen.</p>
              <p>He started in operations — restaurant management on a GM track, then industrial welding on Ford-parts undercarriages, picking up robotic engineering on weekends. From there into markets: running a trading community and learning options, crypto, and ops the way he learns everything — by shipping and watching what worked.</p>
              <p>Los Angeles came next, running social for one of the largest SMMAs in the world, working with celebrities and household names. Then EndCreations, his gaming infrastructure company. Now: TrainYourAgent, plus a portfolio of ventures he runs in parallel.</p>
              <p>Four years deep in AI — through every major model shift, every tool, every release. He builds the things he wants to exist, and ships them faster than anyone you've met.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="px-5 sm:px-8 py-28">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[12px] uppercase tracking-[0.22em] text-[#185FA5] font-semibold mb-6">Why we're building this</div>
          <blockquote className="text-[28px] sm:text-[42px] leading-[1.18] tracking-tight font-medium text-[#042C53]" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
            "AI isn't a feature. It's the evolutionary step humans have been waiting for — the one that takes us out of cubicles and away from paperwork, back into the work we were built for: building, dreaming, evolving. The companies that get this right won't just be more efficient. They'll write the next chapter of what business looks like. We're here to make sure every founder, every operator, every business is first in line."
          </blockquote>
          <div className="mt-8 text-[14px] text-slate-500 tracking-[0.12em] uppercase">Alexander Mills · Founder</div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 sm:px-8 py-24 bg-[#F6FAFE]">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Questions buyers actually ask</div>
          <h2 className="text-[32px] sm:text-[44px] leading-tight font-semibold text-[#042C53] mb-10">FAQ</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((f, i) => (
              <details key={i} className="group bg-white border border-slate-200 rounded-2xl p-6 open:border-[#185FA5]/60 open:shadow-sm">
                <summary className="cursor-pointer flex items-start justify-between gap-4 text-[17px] font-medium text-[#042C53]">
                  <span>{f.q}</span>
                  <span className="text-[#185FA5] flex-shrink-0 text-[20px] transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-4 text-[15px] text-slate-700 leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSER */}
      <section className="px-5 sm:px-8 py-24 bg-[#042C53] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-[40px] sm:text-[64px] leading-[1.02] tracking-tight font-semibold">
            Ready to put AI <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>actually to work?</span>
          </h2>
          <p className="mt-6 text-[18px] text-white/85 max-w-2xl mx-auto leading-relaxed">
            Thirty-minute build call. You leave with a written plan. We leave with the green light or an honest no.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 transition shadow-lg">Book a 30-min build call →</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15 transition">Or DM AGENT on LinkedIn</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-[#042C53]">About</Link>
            <Link to="/pricing" className="hover:text-[#042C53]">Pricing</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
            <a href={CAL_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">Book a call</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
