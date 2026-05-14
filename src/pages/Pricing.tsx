import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RoiCalculator from "@/components/RoiCalculator";
import NewsletterCapture from "@/components/NewsletterCapture";
import CalEmbed from "@/components/CalEmbed";
import ToastHost, { toast } from "@/components/Toast";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";
const HERO_PHONE_DISPLAY = "(813) 555-0142";
const HERO_PHONE_TEL = "+18135550142";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="#E6F1FB" />
        <g fill="#0C447C">
          <circle cx="20" cy="27" r="7.5" /><circle cx="32" cy="21" r="8.5" /><circle cx="44" cy="27" r="7.5" />
          <circle cx="24" cy="40" r="7" /><circle cx="40" cy="40" r="7" /><rect x="29" y="44" width="6" height="11" rx="1.5" />
        </g>
        <circle cx="32" cy="32" r="30" fill="none" stroke="#185FA5" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

const PLANS = [
  {
    id: "founders",
    label: "Founders",
    forWho: "Pre-revenue or early-revenue startups. Build now, pay as you grow.",
    upfront: "$0",
    upfrontNote: "build fee deferred",
    monthly: "$0.18",
    monthlyUnit: "per minute answered",
    booking: "$25",
    bookingNote: "per booked appointment (optional add-on)",
    cta: "Apply for the founder lane",
    accent: false,
    perks: [
      "One agent, fully built and trained on your docs",
      "Live in 7 business days",
      "Founder Slack channel direct to Alexander",
      "Weekly tune-up for the first 90 days",
      "Pay only when calls come in",
    ],
  },
  {
    id: "operators",
    label: "Operators",
    forWho: "SMBs already paying humans to answer phones, qualify leads, or run support.",
    upfront: "$4,950",
    upfrontNote: "one-time build + integration",
    monthly: "$799",
    monthlyUnit: "per month, includes 4,000 minutes",
    booking: "$15",
    bookingNote: "per booked appointment after the included pool",
    cta: "Start the build",
    accent: true,
    perks: [
      "Multi-channel: voice + SMS + email + chat",
      "Live in 10–14 business days",
      "Native integration with your CRM, calendar, dispatch tool",
      "Weekly performance review with a real engineer",
      "Cancel any time — no contracts",
    ],
  },
  {
    id: "scale",
    label: "Scale",
    forWho: "Multi-location, multi-brand, or agency-scale operations.",
    upfront: "Custom",
    upfrontNote: "scoped from a 30-min call",
    monthly: "Custom",
    monthlyUnit: "volume-tiered",
    booking: "Custom",
    bookingNote: "tied to your conversion model",
    cta: "Get a custom quote",
    accent: false,
    perks: [
      "Unlimited agents across brands or locations",
      "Dedicated engineer + monthly architecture review",
      "Custom integrations, custom training data",
      "SLA-backed uptime, priority incident response",
      "BAA, DPA, SOC 2 evidence pack included",
    ],
  },
];

const FAQ = [
  { q: "Why no fake five-tier feature checklist?", a: "Because AI voice agents aren't a SaaS product where every tier unlocks one more dropdown. The work is: build it once, tune it weekly, charge for what runs through it. That's three honest lanes — Founders, Operators, Scale — not eleven boxes." },
  { q: "What does the build fee actually cover?", a: "Discovery (we listen to your existing calls), agent training on YOUR docs/scripts/pricing/tone, voice tuning, telephony provisioning, integrations to your CRM and calendar, stress testing, cutover, and the first 30 days of tuning. Not 'a chatbot deployment.'" },
  { q: "What if I want to start, then scale up?", a: "Founders → Operators → Scale is the same agent, growing. You don't rebuild. We add capacity and channels as your volume justifies them." },
  { q: "Free trial?", a: "Yes. Seven business days of live calls handled by your agent before the first invoice. If it doesn't perform, you walk and we keep nothing." },
  { q: "What about overage?", a: "Operators plan includes 4,000 minutes/mo. Overage is $0.18/min answered. Booked-appointment fee only applies on top of the included pool. No surprise invoices — your dashboard shows usage in real time." },
  { q: "Do you take equity?", a: "Sometimes, for the right startup. Defer cash, take a small piece, build the agent, ride the growth. Mention it on the call." },
];

const Pricing = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Pricing — TrainYourAgent";
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setMeta("description", "Three honest lanes: Founders, Operators, Scale. Pay for what runs through your agent, not for tier-feature theater. Free 7-day live trial.");
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <BrainLogo size={36} />
            <span className="text-[17px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-[14px] text-slate-700">
            <Link to="/solutions" className="hover:text-[#042C53]">Solutions</Link>
            <Link to="/technology" className="hover:text-[#042C53]">Technology</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
            <Link to="/pricing" className="text-[#042C53] font-medium">Pricing</Link>
            <Link to="/about" className="hover:text-[#042C53]">About</Link>
            <a href={`tel:${HERO_PHONE_TEL}`} className="text-[#185FA5] hover:text-[#042C53] font-medium">{HERO_PHONE_DISPLAY}</a>
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] shadow-sm">Book a call</a>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span className="block w-4 h-px bg-[#042C53] relative" style={{ boxShadow: mobileOpen ? "none" : "0 -5px 0 #042C53, 0 5px 0 #042C53", transform: mobileOpen ? "rotate(45deg)" : "none" }} />
          </button>
        </div>
      </nav>

      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Pricing</div>
          <h1 className="text-[44px] sm:text-[72px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            Three lanes. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Zero theater.</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl mx-auto leading-relaxed">
            We charge for what your agent actually does — calls answered, appointments booked, problems solved. Not tier-feature checkboxes you'll never use.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-5">
          {PLANS.map((p) => (
            <div key={p.id} className={`relative rounded-3xl p-8 border transition ${p.accent ? "bg-[#042C53] text-white border-[#042C53] shadow-2xl shadow-[#042C53]/15 lg:scale-[1.02]" : "bg-white text-[#0B1B2B] border-slate-200 hover:border-[#185FA5]"}`}>
              {p.accent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#22A36C] text-white text-[11px] font-semibold tracking-[0.12em] uppercase">Most chosen</div>
              )}
              <div className={`text-[12px] uppercase tracking-[0.18em] font-semibold mb-2 ${p.accent ? "text-[#9CC4EC]" : "text-[#185FA5]"}`}>{p.label}</div>
              <div className={`text-[15px] leading-relaxed mb-6 ${p.accent ? "text-white/85" : "text-slate-700"}`}>{p.forWho}</div>

              <div className={`grid grid-cols-3 gap-3 mb-8 pb-6 border-b ${p.accent ? "border-white/15" : "border-slate-200"}`}>
                <div>
                  <div className={`text-[24px] font-semibold tracking-tight ${p.accent ? "text-white" : "text-[#042C53]"}`}>{p.upfront}</div>
                  <div className={`text-[11px] mt-1 ${p.accent ? "text-white/65" : "text-slate-500"}`}>{p.upfrontNote}</div>
                </div>
                <div>
                  <div className={`text-[24px] font-semibold tracking-tight ${p.accent ? "text-white" : "text-[#042C53]"}`}>{p.monthly}</div>
                  <div className={`text-[11px] mt-1 ${p.accent ? "text-white/65" : "text-slate-500"}`}>{p.monthlyUnit}</div>
                </div>
                <div>
                  <div className={`text-[24px] font-semibold tracking-tight ${p.accent ? "text-white" : "text-[#042C53]"}`}>{p.booking}</div>
                  <div className={`text-[11px] mt-1 ${p.accent ? "text-white/65" : "text-slate-500"}`}>{p.bookingNote}</div>
                </div>
              </div>

              <ul className={`space-y-2.5 text-[14px] mb-8 ${p.accent ? "text-white/90" : "text-slate-700"}`}>
                {p.perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${p.accent ? "bg-[#9CC4EC]" : "bg-[#185FA5]"}`} />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <a href={CAL_URL} target="_blank" rel="noopener"
                 className={`block w-full text-center px-5 py-3.5 rounded-full font-semibold text-[14px] transition ${p.accent ? "bg-white text-[#042C53] hover:bg-slate-100" : "bg-[#042C53] text-white hover:bg-[#0A3D6E]"}`}>
                {p.cta} →
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Free 7-day live trial</div>
            <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53]">
              Real calls. Real outcomes. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Before the first invoice.</span>
            </h2>
          </div>
          <div className="text-[16px] text-slate-700 leading-relaxed">
            We build your agent, point your forwarded line at it, and let it run live for seven business days. You see exactly what it handled, what it routed to humans, and what it booked. If you don't like what you see, you walk. We keep nothing. We've never had a free-trial customer not convert.
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section className="px-5 sm:px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">ROI calculator</div>
            <h2 className="text-[28px] sm:text-[44px] leading-tight font-semibold text-[#042C53]">
              Run your own numbers. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>See payback in days.</span>
            </h2>
          </div>
          <RoiCalculator onEmailCaptured={async (d) => { toast(`Report sent to ${d.email}`, "ok"); }} />
        </div>
      </section>

      {/* INLINE CAL */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Book direct</div>
            <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53]">
              Pick a time. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Talk to a builder.</span>
            </h2>
          </div>
          <CalEmbed height={680} />
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <NewsletterCapture variant="card" />
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">FAQ</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-10">Questions we get on every call.</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
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

      <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[36px] sm:text-[56px] leading-[1.04] tracking-tight font-semibold">
            Stop pricing. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Start shipping.</span>
          </h2>
          <p className="mt-5 text-[17px] text-white/85 max-w-2xl mx-auto leading-relaxed">
            Thirty-minute build call. We scope your use case, give you a real number on the spot, and you decide.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg">Book a build call →</a>
            <a href={`tel:${HERO_PHONE_TEL}`} className="px-7 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15">Or call us: {HERO_PHONE_DISPLAY}</a>
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
      <ToastHost />
    </div>
  );
};

export default Pricing;
