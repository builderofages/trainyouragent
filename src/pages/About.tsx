import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";

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

const About = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter+Tight:wght@400;500;600;700&display=swap";
      document.head.appendChild(l);
    }
    document.title = "About — TrainYourAgent";
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-[#042C53] antialiased selection:bg-[#185FA5] selection:text-white overflow-x-hidden"
      style={{ fontFamily: "'Inter Tight', 'Inter', system-ui, -apple-system, sans-serif" }}>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${navScrolled ? "bg-white/85 backdrop-blur-xl border-b border-slate-200/80" : "bg-transparent border-b border-transparent"}`}>
        <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-2.5 font-semibold text-[17px] tracking-tight text-[#042C53]">
            <BrainLogo size={36} />
            <span>TrainYourAgent</span>
          </Link>
          <div className="hidden md:flex gap-7 items-center text-[14px]">
            <Link to="/#what" className="text-slate-600 hover:text-[#042C53] transition">What we do</Link>
            <Link to="/#niches" className="text-slate-600 hover:text-[#042C53] transition">Verticals</Link>
            <Link to="/#pricing" className="text-slate-600 hover:text-[#042C53] transition">Pricing</Link>
            <Link to="/about" className="text-[#042C53] font-medium">About</Link>
            <Link to="/contact" className="text-slate-600 hover:text-[#042C53] transition">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <a href={CAL_URL} target="_blank" rel="noopener" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold text-white bg-[#185FA5] hover:bg-[#0C447C] transition rounded-full">
              Book a call
            </a>
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" className="md:hidden w-10 h-10 grid place-items-center rounded-full border border-slate-200 bg-white">
              <span className="block w-4 h-px bg-[#042C53] relative" style={{ boxShadow: mobileOpen ? "none" : "0 -5px 0 #042C53, 0 5px 0 #042C53", transform: mobileOpen ? "rotate(45deg)" : "none" }} />
            </button>
          </div>
        </div>
      </nav>

      <main>
        <header className="pt-40 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(900px 500px at 80% -10%, rgba(133,183,235,0.25), transparent 60%)" }} />
          <div className="max-w-[900px] mx-auto px-6 relative">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-4">About</div>
            <h1 className="text-[clamp(42px,6.5vw,96px)] leading-[1] tracking-[-0.025em] mb-8" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
              We build AI <em className="italic font-normal" style={{ color: "#185FA5" }}>that actually runs</em> your phones.
            </h1>
            <p className="text-slate-600 text-[19px] leading-relaxed max-w-2xl">
              Not another demo. Not another platform you have to wire up yourself. A real team that designs, trains, deploys and operates voice and chat agents on your live phone line — in days, not quarters.
            </p>
          </div>
        </header>

        <section className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-[900px] mx-auto px-6">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-4">Why this exists</div>
            <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.025em] mb-8" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
              The gap between <em className="italic font-normal" style={{ color: "#185FA5" }}>AI demo</em> and AI that runs your business.
            </h2>
            <div className="text-[#042C53] text-[17px] leading-[1.7] space-y-5">
              <p>I watched the same pattern play out a hundred times. A roofing company, an HVAC outfit, a clinic, a law firm sees a voice-AI demo at a conference. The demo is beautiful. They sign up. They open the platform. They see a flow editor with 200 nodes, settings tabs, webhooks, prompt engineering, a documentation site, and a Slack support channel. Six months later the agent never went live.</p>
              <p>The product gap isn't capability. The models are good enough. The product gap is <em>labor.</em> Building, training, monitoring and refreshing a production voice agent is a real engineering job, not a no-code project. Regional service businesses don't have an AI team. They have a phone line that rings.</p>
              <p>TrainYourAgent exists to close that gap. We are the team you'd hire if hiring one was actually possible — except we charge a monthly retainer instead of an FTE salary, and the engagement starts shipping in week one.</p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-[900px] mx-auto px-6">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-4">How we work</div>
            <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.025em] mb-10" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
              Five steps. <em className="italic font-normal" style={{ color: "#185FA5" }}>One team. No layers.</em>
            </h2>
            <div className="space-y-8">
              {[
                { k: "01", t: "Discovery", b: "30 minutes with the founder. We listen to call recordings if you have them, look at your call flow, and write the scope back to you in writing the same day." },
                { k: "02", t: "Build", b: "We script the agent, configure the model, wire CRM and calendar integrations, and stand up monitoring. You see drafts the same week." },
                { k: "03", t: "Stress test", b: "You and your team call in. We watch transcripts in real time and turn every failure case into a permanent guardrail." },
                { k: "04", t: "Cutover", b: "Number port or SIP redirect. The agent goes live on your real phone line. You get a dashboard for every call, transcript, and booking." },
                { k: "05", t: "Run", b: "Weekly model refresh, monthly review with the founder, no account-manager layer. The number of people between you and the build is one." },
              ].map((s) => (
                <div key={s.k} className="grid grid-cols-[60px,1fr] gap-6 items-start">
                  <div className="text-[#185FA5] font-mono text-[13px] tracking-wide pt-1">{s.k}</div>
                  <div>
                    <h3 className="text-[22px] tracking-tight mb-2 font-medium">{s.t}</h3>
                    <p className="text-slate-600 text-[16px] leading-relaxed">{s.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-[900px] mx-auto px-6">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-4">Founder</div>
            <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.025em] mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
              Alexander <em className="italic font-normal" style={{ color: "#185FA5" }}>Mills.</em>
            </h2>
            <div className="text-[#042C53] text-[17px] leading-[1.7] space-y-5 mb-8">
              <p>I started TrainYourAgent out of Tampa Bay. Background: voice agents and autonomous AI that generate leads and cut ops costs for service businesses. The work happens in public on LinkedIn — DM <code className="font-mono text-[15px] bg-slate-100 px-2 py-0.5 rounded">AGENT</code> for a live build walkthrough.</p>
              <p>I run discovery, scoping and engagement design myself. When the agent ships, I'm still your point of contact. No account-manager layer, no offshore handoff, no DocuSigned onboarding flow you'll never speak to a human through.</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <a href={CAL_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-[#185FA5] hover:bg-[#0C447C] transition rounded-full">Book 30 min with me →</a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-[#042C53] bg-white hover:bg-slate-50 border border-slate-200 transition rounded-full">Connect on LinkedIn →</a>
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(800px 400px at 50% 50%, rgba(133,183,235,0.4), transparent 65%)" }} />
          <div className="max-w-[900px] mx-auto px-6 text-center relative">
            <h2 className="text-[clamp(36px,5vw,72px)] leading-[1.02] tracking-[-0.025em] mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
              Want to <em className="italic font-normal" style={{ color: "#185FA5" }}>see it?</em>
            </h2>
            <p className="text-slate-600 text-[18px] max-w-xl mx-auto mb-10 leading-relaxed">30-minute discovery call. We figure out what's worth automating, what isn't, and a real timeline — before you spend a dollar.</p>
            <a href={CAL_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold text-white bg-[#185FA5] hover:bg-[#0C447C] transition rounded-full shadow-[0_18px_50px_-12px_rgba(24,95,165,0.55)]">
              Book on Cal.com →
            </a>
          </div>
        </section>
      </main>

      <footer className="py-14 bg-[#FAFBFC] border-t border-slate-200">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-3">
            <BrainLogo size={36} />
            <div>
              <div className="text-[15px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</div>
              <div className="text-slate-500 text-[12px]">AI that thinks like your business. Tampa Bay, FL.</div>
            </div>
          </Link>
          <div className="flex gap-6 text-[13px] text-slate-600 flex-wrap">
            <Link to="/" className="hover:text-[#042C53] transition">Home</Link>
            <Link to="/#niches" className="hover:text-[#042C53] transition">Verticals</Link>
            <Link to="/#pricing" className="hover:text-[#042C53] transition">Pricing</Link>
            <Link to="/security" className="hover:text-[#042C53] transition">Security</Link>
            <Link to="/contact" className="hover:text-[#042C53] transition">Contact</Link>
            <a href={CAL_URL} target="_blank" rel="noopener" className="hover:text-[#042C53] transition">Book a call</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53] transition">LinkedIn</a>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default About;
