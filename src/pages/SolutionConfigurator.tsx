import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";
const HERO_PHONE_DISPLAY = "Book a 15-min Zoom";
const HERO_PHONE_TEL = "https://cal.com/trainyouragent/30min";

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

type Lane = "startup" | "smb" | "agency" | "ops";
type Industry = "healthcare" | "legal" | "real-estate" | "hvac" | "roofing" | "solar" | "accounting" | "automotive" | "spas" | "hotels" | "bars-nightclubs" | "logistics" | "fitness" | "startup-saas" | "ecommerce" | "other";
type Problem = "inbound-voice" | "outbound" | "support" | "lead-qual" | "ops-automation" | "everything";
type Volume = "lt-200" | "200-1000" | "1000-5000" | "gt-5000";

type Answers = {
  lane: Lane | null;
  industry: Industry | null;
  problem: Problem | null;
  volume: Volume | null;
  stack: string[];
  email: string;
  name: string;
  company: string;
};

const STEPS = ["Lane", "Industry", "Problem", "Volume", "Stack", "Send"];

const LANE_OPT: { id: Lane; label: string; sub: string }[] = [
  { id: "startup", label: "I'm building a startup", sub: "Pre-revenue or early-revenue, founder-led." },
  { id: "smb",     label: "I run an SMB",            sub: "Established business, real customers, real phones." },
  { id: "agency",  label: "I run an agency",         sub: "Marketing, web, or consulting — reselling to clients." },
  { id: "ops",     label: "I lead ops at scale",     sub: "Multi-location, multi-brand, or franchise." },
];

const INDUSTRIES: { id: Industry; label: string }[] = [
  { id: "healthcare",     label: "Healthcare" },
  { id: "legal",          label: "Legal" },
  { id: "real-estate",    label: "Real Estate" },
  { id: "hvac",           label: "HVAC" },
  { id: "roofing",        label: "Roofing" },
  { id: "solar",          label: "Solar" },
  { id: "accounting",     label: "Accounting" },
  { id: "automotive",     label: "Automotive" },
  { id: "spas",           label: "Spas / Med Spas" },
  { id: "hotels",         label: "Hotels / Hospitality" },
  { id: "bars-nightclubs",label: "Bars / Nightclubs" },
  { id: "logistics",      label: "Logistics" },
  { id: "fitness",        label: "Fitness / Studios" },
  { id: "startup-saas",   label: "SaaS / Startup" },
  { id: "ecommerce",      label: "Ecommerce" },
  { id: "other",          label: "Other" },
];

const PROBLEMS: { id: Problem; label: string; sub: string }[] = [
  { id: "inbound-voice",  label: "Inbound voice", sub: "Answer every call, book, qualify, route." },
  { id: "outbound",       label: "Outbound",       sub: "Cold or warm calling, qualification, follow-up." },
  { id: "support",        label: "Customer support", sub: "Tier-1 deflection, FAQ handling, ticket triage." },
  { id: "lead-qual",      label: "Lead qualification", sub: "Inbound web/ad leads, qualified before your rep." },
  { id: "ops-automation", label: "Ops automation", sub: "Internal workflows, document triage, reminders." },
  { id: "everything",     label: "Everything", sub: "Full stack — voice, chat, ops, GTM, brand. We'll prioritize." },
];

const VOLUMES: { id: Volume; label: string }[] = [
  { id: "lt-200",    label: "<200 calls / month" },
  { id: "200-1000",  label: "200–1,000" },
  { id: "1000-5000", label: "1,000–5,000" },
  { id: "gt-5000",   label: "5,000+" },
];

const STACK_OPTIONS = ["HubSpot", "Salesforce", "Pipedrive", "Close", "ServiceTitan", "Housecall Pro", "Jobber", "Clio", "MyCase", "Athena", "Epic", "Cal.com", "Calendly", "Google Calendar", "Stripe", "Zapier", "Make", "n8n", "Slack", "Twilio", "Other"];

const recommendPlan = (a: Answers): { plan: string; price: string; eta: string } => {
  if (a.lane === "ops") return { plan: "Scale", price: "Custom (typically $5–25K/mo)", eta: "3–6 weeks to production" };
  if (a.lane === "agency") return { plan: "Partner", price: "Volume-tiered per agent", eta: "First agent in 7 days" };
  if (a.lane === "startup") return { plan: "Founders", price: "$0 upfront · $0.18/min · $25/booking", eta: "Live in 7 business days" };
  // smb default
  if (a.volume === "gt-5000") return { plan: "Operators+", price: "$1,495/mo + overage", eta: "10–14 business days" };
  return { plan: "Operators", price: "$4,950 build · $799/mo · 4,000 min included", eta: "10–14 business days" };
};

const SolutionConfigurator = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({ lane: null, industry: null, problem: null, volume: null, stack: [], email: "", name: "", company: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Configure your agent — TrainYourAgent";
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Persist lane to localStorage as visitor progresses
  useEffect(() => {
    if (a.lane) {
      try { window.localStorage.setItem("tya:pathway", a.lane); } catch {}
    }
  }, [a.lane]);

  const rec = useMemo(() => recommendPlan(a), [a]);

  const canAdvance = () => {
    if (step === 0) return !!a.lane;
    if (step === 1) return !!a.industry;
    if (step === 2) return !!a.problem;
    if (step === 3) return !!a.volume;
    if (step === 4) return true;
    if (step === 5) return !!a.email && !!a.name;
    return false;
  };

  const submit = () => {
    const body = `Lane: ${a.lane}%0D%0AIndustry: ${a.industry}%0D%0AProblem: ${a.problem}%0D%0AVolume: ${a.volume}%0D%0AStack: ${a.stack.join(", ")}%0D%0AName: ${a.name}%0D%0ACompany: ${a.company}%0D%0AEmail: ${a.email}%0D%0ARecommended: ${rec.plan} — ${rec.price} — ${rec.eta}`;
    window.location.href = `mailto:hello@trainyouragent.com?subject=Configurator%20build%20request%20from%20${encodeURIComponent(a.name)}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <BrainLogo size={36} />
            <span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span>
          </Link>
          <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] shadow-sm">Book a call instead</a>
        </div>
      </nav>

      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Configurator</div>
          <h1 className="text-[40px] sm:text-[60px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Get a real quote in <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>about ninety seconds.</span>
          </h1>
          <p className="mt-5 text-[17px] text-slate-700 max-w-xl mx-auto leading-relaxed">
            Six quick questions. We come back with a written plan, a ballpark price, and a build-call invite — sent to your inbox, not your spam folder.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-[#185FA5] transition-all" style={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }} />
              </div>
            ))}
          </div>
          <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">Step {step + 1} of {STEPS.length}</div>

          {!sent && step === 0 && (
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-semibold text-[#042C53] mb-6 leading-tight">Which lane are you in?</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {LANE_OPT.map((l) => (
                  <button key={l.id} onClick={() => setA({ ...a, lane: l.id })}
                          className={`text-left rounded-2xl border p-5 transition ${a.lane === l.id ? "bg-[#042C53] text-white border-[#042C53]" : "bg-white border-slate-200 hover:border-[#185FA5]"}`}>
                    <div className={`text-[16px] font-semibold mb-1 ${a.lane === l.id ? "text-white" : "text-[#042C53]"}`}>{l.label}</div>
                    <div className={`text-[13px] leading-relaxed ${a.lane === l.id ? "text-white/85" : "text-slate-600"}`}>{l.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!sent && step === 1 && (
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-semibold text-[#042C53] mb-6 leading-tight">What industry?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INDUSTRIES.map((i) => (
                  <button key={i.id} onClick={() => setA({ ...a, industry: i.id })}
                          className={`text-left rounded-xl border p-4 text-[14px] transition ${a.industry === i.id ? "bg-[#042C53] text-white border-[#042C53]" : "bg-white border-slate-200 hover:border-[#185FA5] text-[#042C53]"}`}>
                    {i.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!sent && step === 2 && (
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-semibold text-[#042C53] mb-6 leading-tight">What are we solving first?</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {PROBLEMS.map((p) => (
                  <button key={p.id} onClick={() => setA({ ...a, problem: p.id })}
                          className={`text-left rounded-2xl border p-5 transition ${a.problem === p.id ? "bg-[#042C53] text-white border-[#042C53]" : "bg-white border-slate-200 hover:border-[#185FA5]"}`}>
                    <div className={`text-[16px] font-semibold mb-1 ${a.problem === p.id ? "text-white" : "text-[#042C53]"}`}>{p.label}</div>
                    <div className={`text-[13px] leading-relaxed ${a.problem === p.id ? "text-white/85" : "text-slate-600"}`}>{p.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!sent && step === 3 && (
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-semibold text-[#042C53] mb-6 leading-tight">Roughly what volume?</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {VOLUMES.map((v) => (
                  <button key={v.id} onClick={() => setA({ ...a, volume: v.id })}
                          className={`text-left rounded-2xl border p-5 text-[16px] font-semibold transition ${a.volume === v.id ? "bg-[#042C53] text-white border-[#042C53]" : "bg-white border-slate-200 hover:border-[#185FA5] text-[#042C53]"}`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!sent && step === 4 && (
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-semibold text-[#042C53] mb-2 leading-tight">What's in your stack?</h2>
              <p className="text-[14px] text-slate-600 mb-6">Pick whatever applies. We'll wire the agent into these.</p>
              <div className="flex flex-wrap gap-2">
                {STACK_OPTIONS.map((s) => {
                  const active = a.stack.includes(s);
                  return (
                    <button key={s} onClick={() => setA({ ...a, stack: active ? a.stack.filter((x) => x !== s) : [...a.stack, s] })}
                            className={`px-4 py-2 rounded-full text-[13px] font-medium transition border ${active ? "bg-[#042C53] text-white border-[#042C53]" : "bg-white text-[#042C53] border-slate-200 hover:border-[#185FA5]"}`}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!sent && step === 5 && (
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-semibold text-[#042C53] mb-2 leading-tight">Where do we send it?</h2>
              <p className="text-[14px] text-slate-600 mb-6">Your plan + price + Loom walkthrough — into your inbox within one business day.</p>

              <div className="rounded-2xl bg-[#F6FAFE] border border-slate-200 p-6 mb-6">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-3">Based on your answers</div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-[12px] text-slate-500 mb-1">Recommended plan</div>
                    <div className="text-[18px] font-semibold text-[#042C53]">{rec.plan}</div>
                  </div>
                  <div>
                    <div className="text-[12px] text-slate-500 mb-1">Ballpark</div>
                    <div className="text-[15px] font-semibold text-[#042C53] leading-tight">{rec.price}</div>
                  </div>
                  <div>
                    <div className="text-[12px] text-slate-500 mb-1">Time to live</div>
                    <div className="text-[15px] font-semibold text-[#042C53] leading-tight">{rec.eta}</div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <input value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} placeholder="Your name" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5]" />
                <input value={a.company} onChange={(e) => setA({ ...a, company: e.target.value })} placeholder="Company (optional)" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5]" />
                <input value={a.email} type="email" onChange={(e) => setA({ ...a, email: e.target.value })} placeholder="Work email" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5] sm:col-span-2" />
              </div>
            </div>
          )}

          {sent && (
            <div className="rounded-3xl bg-[#F6FAFE] border border-slate-200 p-10 text-center">
              <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Submitted</div>
              <h2 className="text-[28px] sm:text-[36px] font-semibold text-[#042C53] leading-tight mb-3">
                Got it. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>We'll be back within one business day.</span>
              </h2>
              <p className="text-[15px] text-slate-700 max-w-md mx-auto leading-relaxed mb-7">
                Want to skip the wait? Book a 30-minute build call right now and we'll walk through your config live.
              </p>
              <a href={CAL_URL} target="_blank" rel="noopener" className="inline-block px-7 py-3.5 rounded-full bg-[#042C53] text-white font-semibold text-[14px] hover:bg-[#0A3D6E] shadow-lg">
                Book a build call →
              </a>
            </div>
          )}

          {!sent && (
            <div className="mt-8 flex items-center justify-between">
              <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                      className="px-5 py-3 rounded-full text-[14px] text-slate-600 hover:text-[#042C53] disabled:opacity-30">
                ← Back
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={() => setStep(step + 1)} disabled={!canAdvance()}
                        className="px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-30 shadow-lg">
                  Continue →
                </button>
              ) : (
                <button onClick={submit} disabled={!canAdvance()}
                        className="px-6 py-3 rounded-full bg-[#22A36C] text-white text-[14px] font-semibold hover:bg-[#1E8E5E] disabled:opacity-30 shadow-lg">
                  Send my config →
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span><span className="text-slate-400">— United States</span></div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#042C53]">Terms</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53]">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SolutionConfigurator;
