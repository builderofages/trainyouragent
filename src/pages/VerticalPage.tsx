import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

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

type LaneId = "startup" | "smb" | "agency" | "ops";

type VerticalConfig = {
  label: string; eyebrow: string; headline1: string; headline2: string; sub: string;
  bullets: string[]; transcript: string[]; integrations: string[]; pricePoint: string;
};

const V: Record<string, VerticalConfig> = {
  "/healthcare": {
    label: "Healthcare",
    eyebrow: "For practices, clinics, and multi-location groups",
    headline1: "Patient intake that doesn't",
    headline2: "send people to voicemail.",
    sub: "Your agent answers in two rings, verifies insurance, schedules the visit, and routes urgent symptoms to a human. BAA per customer. HIPAA-aware architecture. We are not a Covered Entity ourselves.",
    bullets: ["After-hours triage with human escalation rules you control","Insurance verification + intake forms before the visit","Native integration with athena, eClinicalWorks, DrChrono, Epic open APIs","BAA signed before any PHI flows"],
    transcript: ["Caller: Hi, I'm trying to schedule for next week.","Agent: Of course — can I get your full name and date of birth?","Caller: Sarah Lee, March 12, 1989.","Agent: Found you, Sarah. I see your Aetna PPO is still on file. Returning patient?","Caller: Yes, I had a visit last year.","Agent: We have Tuesday at 9:40 with Dr. Patel or Thursday at 2:15 with Dr. Kim. Which works?"],
    integrations: ["Athena","eClinicalWorks","Epic open API","DrChrono","Twilio HIPAA","Cal.com"],
    pricePoint: "Operators plan + BAA add-on",
  },
  "/legal": {
    label: "Legal", eyebrow: "For solo and multi-attorney firms",
    headline1: "Intake that filters", headline2: "before you spend a minute.",
    sub: "Conflict checks, jurisdiction filters, matter classification, and triage to the right attorney. Your agent runs the qualifying questions so you don't burn billable time on a no-fit lead.",
    bullets: ["Automatic conflict check against your CMS","Jurisdiction + practice-area routing","Engagement letter triggered on qualified leads","Native integration with Clio, MyCase, PracticePanther"],
    transcript: ["Caller: I think I have a slip-and-fall case.","Agent: Where did it happen?","Caller: Grocery store in Florida, last Tuesday.","Agent: Did you see a doctor for any injuries?","Caller: Yes, the same day.","Agent: That helps. Let me book you with Sarah Reyes, our senior PI attorney — Tuesday at 10 work?"],
    integrations: ["Clio","MyCase","PracticePanther","Lawmatics","DocuSign","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/real-estate": {
    label: "Real Estate", eyebrow: "For agents, teams, and brokerages",
    headline1: "Every lead answered,", headline2: "every showing booked.",
    sub: "Speed-to-lead in seconds, not hours. Your agent qualifies buyer/seller intent, verifies pre-approval, and books showings — even from Zillow leads at 11pm Sunday.",
    bullets: ["Speed-to-lead under 30 seconds, 24/7","Buyer vs seller intent classification","Pre-approval qualification questions","Native integration with Follow Up Boss, KvCORE, Sierra Interactive"],
    transcript: ["Agent: Hi, this is Lex calling from Coastal Realty. You looked at the listing on Maple Street?","Caller: Yeah, is it still available?","Agent: It is. Working with an agent currently?","Caller: No.","Agent: Pre-approval in place, or still early?","Caller: I'm pre-approved up to 450.","Agent: Saturday 10am or Sunday 1pm showing. Which works?"],
    integrations: ["Follow Up Boss","KvCORE","Sierra Interactive","Boomtown","MLS APIs","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/hvac": {
    label: "HVAC", eyebrow: "For service companies, multi-tech teams, and franchises",
    headline1: "Every after-hours call", headline2: "becomes a booked job.",
    sub: "Storm Monday at 6am. AC dies on a Sunday at 2pm. Your agent picks up, qualifies emergency vs routine, prices the dispatch, and books the tech truck.",
    bullets: ["Emergency vs routine classification with your pricing logic","Real-time tech availability lookup","Native integration with ServiceTitan, Housecall Pro, Jobber","Surge-proof for storm season"],
    transcript: ["Caller: AC stopped working and it's 95 degrees in the house.","Agent: That's miserable. Current customer?","Caller: Yes, you did our install two years ago.","Agent: I see your unit on file. Emergency same-day dispatch trip fee is $189, applied to any repair. Tech 12 minutes from you — 3:45 work?","Caller: Yes, please."],
    integrations: ["ServiceTitan","Housecall Pro","Jobber","FieldEdge","Twilio","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/roofing": {
    label: "Roofing", eyebrow: "For storm-chasers, residential, and commercial",
    headline1: "Storm week without", headline2: "missing a single call.",
    sub: "Hail hits, phones melt. Your agent qualifies insurance vs cash, books the inspection, captures damage description, and triages emergencies.",
    bullets: ["Insurance vs cash classification at intake","Storm-surge capacity that doesn't crack","Native integration with AccuLynx, JobNimbus, Roofr","Inspection scheduling with photos and damage description capture"],
    transcript: ["Caller: We had hail Sunday and I think we have damage.","Agent: Insurance claim or cash repair?","Caller: Probably insurance.","Agent: Filed yet?","Caller: Not yet.","Agent: We'll come document the damage first. Tuesday 9am or Wednesday 11am?"],
    integrations: ["AccuLynx","JobNimbus","Roofr","CompanyCam","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/solar": {
    label: "Solar", eyebrow: "For installers, EPC, and consumer brands",
    headline1: "Lead qual before", headline2: "your closer's coffee.",
    sub: "Inbound from a meta ad doesn't deserve six hours of voicemail tag. Your agent qualifies roof orientation, utility, current bill, and books the site survey while the lead is still hot.",
    bullets: ["Utility + bill + orientation qual at intake","Site survey booking with installer availability","Native integration with Aurora, Enerflo, Solo","SMS follow-up sequence if the call drops"],
    transcript: ["Caller: I saw your ad about solar.","Agent: Awesome. Average monthly electric bill?","Caller: Around $280.","Agent: South-facing roof?","Caller: South, mostly.","Agent: Site survey Thursday 4pm or Saturday 10am?"],
    integrations: ["Aurora Solar","Enerflo","Solo","OpenSolar","HubSpot","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/accounting": {
    label: "Accounting", eyebrow: "For CPAs, bookkeepers, and tax-season surges",
    headline1: "Tax season without", headline2: "burning out your bench.",
    sub: "Every January through April your phones explode. Your agent runs intake, classifies client type, schedules the appointment, and triages emergencies.",
    bullets: ["Client type classification (individual, S-corp, LLC, sole prop)","Document checklist sent over SMS before appointment","Native integration with Karbon, TaxDome, Canopy","Returning vs new client routing"],
    transcript: ["Caller: I need someone to do my taxes this year.","Agent: Personal or business?","Caller: Both — S-corp and personal.","Agent: $850 combined. Send our checklist and book intake?","Caller: That works."],
    integrations: ["Karbon","TaxDome","Canopy","QuickBooks","Stripe","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/automotive": {
    label: "Automotive", eyebrow: "For dealers, service centers, and multi-location",
    headline1: "Service-bay scheduling", headline2: "that doesn't lose the work.",
    sub: "Every inbound about a service appointment gets answered, qualified for warranty, and booked into the right bay — without your service writer pausing the customer in front of them.",
    bullets: ["Warranty vs out-of-pocket triage","Loaner / shuttle / waiting-room options at booking","Native integration with CDK, Reynolds, Dealertrack","Make/model/VIN capture"],
    transcript: ["Caller: I need an oil change and my check engine light is on.","Agent: Year, make, model?","Caller: 2019 Camry.","Agent: Powertrain warranty?","Caller: I think so.","Agent: Tuesday 8am with loaner, or Thursday 7:30am waiting?"],
    integrations: ["CDK","Reynolds & Reynolds","Dealertrack","Tekion","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/spas": {
    label: "Spas", eyebrow: "For day spas, med spas, and wellness studios",
    headline1: "Booking + waitlist", headline2: "without losing the vibe.",
    sub: "Your agent answers in your tone, books treatments, manages waitlists, and protects revenue from no-shows with deposit logic — at the calm pace your clients expect.",
    bullets: ["Treatment + provider preference matching","Deposit + cancellation policy enforcement","Native integration with Mindbody, Boulevard, Vagaro","Waitlist with auto-fill on cancellations"],
    transcript: ["Caller: I'd like to book a 90-minute massage this weekend.","Agent: Saturday or Sunday?","Caller: Saturday.","Agent: 11am with Maya or 4pm with Devon. We hold with a $40 deposit — text you a payment link?"],
    integrations: ["Mindbody","Boulevard","Vagaro","Square","Stripe","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/hotels": {
    label: "Hotels", eyebrow: "For boutique, mid-scale, and multi-property",
    headline1: "Front-desk overflow", headline2: "answered by your brand.",
    sub: "Every call routed off the front desk gets your tone, your information, your booking link — not a generic IVR that ages your brand badly.",
    bullets: ["Concierge questions (parking, breakfast, check-in, amenities)","Direct-booking handoff to your PMS","Native integration with Cloudbeds, Mews, Opera","Multi-language (EN/ES/FR baseline)"],
    transcript: ["Caller: What time is check-in?","Agent: 4pm. Early sometimes available — put a request on your reservation?","Caller: Yes please, name's Carla Rivera.","Agent: Got you, Carla. Anything else — parking, breakfast, gym hours?"],
    integrations: ["Cloudbeds","Mews","Opera Cloud","RoomRaccoon","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/bars-nightclubs": {
    label: "Bars & Nightclubs", eyebrow: "For venues, lounges, and event nightlife",
    headline1: "Reservations + tables", headline2: "while the bar is loud.",
    sub: "Your agent picks up when the host can't — books tables, holds VIP requests, manages the waitlist, and texts guests when they're up.",
    bullets: ["Reservation + waitlist + table-hold logic","VIP / minimum-spend handling","Native integration with SevenRooms, Resy, OpenTable","SMS-first guest comms"],
    transcript: ["Caller: Table for six at 9pm Friday?","Agent: VIP table with $750 minimum, or general at 10pm. Which?","Caller: VIP.","Agent: Done — texting deposit link. Bottle picked out?"],
    integrations: ["SevenRooms","Resy","OpenTable","Tock","Toast","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/logistics": {
    label: "Logistics", eyebrow: "For carriers, brokers, and last-mile",
    headline1: "Driver comms + dispatch", headline2: "at the speed of the load.",
    sub: "Your agent answers driver check-calls, runs status updates, and handles standard exceptions — freeing dispatchers to make the calls that actually need a human.",
    bullets: ["Driver check-call automation","Standard exception triage (delays, detention, late loads)","Native integration with McLeod, TMW, Trucker Tools","Multilingual driver support (EN/ES)"],
    transcript: ["Driver: BOL 4471 — at the receiver, 30-minute wait.","Agent: 30-minute detention starting now. Logging and notifying broker. Anything else?","Driver: That's it."],
    integrations: ["McLeod","TMW","Trucker Tools","Truckstop","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/gym": {
    label: "Fitness", eyebrow: "For studios, gyms, and multi-location chains",
    headline1: "Memberships + classes", headline2: "answered in your brand.",
    sub: "From the front desk you can't always staff to the inbound class question at 9pm — your agent runs intake, books trials, and handles cancellations on policy.",
    bullets: ["Membership inquiry + trial booking","Class waitlist + reschedule logic","Native integration with Mindbody, Wellness Living, Glofox","Cancellation policy enforcement"],
    transcript: ["Caller: Do you have a free trial?","Agent: 7-day pass is free for new members. Saturday 8am Yoga or Sunday 9am HIIT?","Caller: Saturday Yoga.","Agent: Booked. Texting check-in details."],
    integrations: ["Mindbody","Wellness Living","Glofox","Zen Planner","Cal.com"],
    pricePoint: "Operators plan",
  },
  "/solutions": {
    label: "Custom", eyebrow: "Don't see your industry?",
    headline1: "Custom agents for", headline2: "anything humans answer.",
    sub: "If your team is currently answering something repetitive, we can build an agent for it. Gaming, content, SaaS, ecommerce, advisory, moderation — anything.",
    bullets: ["Custom training data + scripts","Custom integrations (REST, webhook, or direct DB)","Custom voice + tone","Custom escalation rules"],
    transcript: ["Agent: Thanks for calling. How can I help today?"],
    integrations: ["Anything you use","Custom build","REST + webhook"],
    pricePoint: "Custom — Scale plan",
  },
};

type LaneOverlay = { tag: string; ctaPrimary: string; ctaSecondary: string };
const LANE_OVERLAY: Record<LaneId, LaneOverlay> = {
  startup: { tag: "Founder lane", ctaPrimary: "Apply for the founder lane", ctaSecondary: "Book a 30-min build call" },
  smb:     { tag: "Operator lane", ctaPrimary: "Start the build",            ctaSecondary: "Call us live" },
  agency:  { tag: "Partner lane",  ctaPrimary: "Become a partner",           ctaSecondary: "Book a partnership call" },
  ops:     { tag: "Scale lane",    ctaPrimary: "Get a custom quote",         ctaSecondary: "Book an architecture call" },
};
const LANE_IDS: LaneId[] = ["startup","smb","agency","ops"];

const VerticalPage = () => {
  const location = useLocation();
  const config = V[location.pathname] || V["/solutions"];
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lane, setLane] = useState<LaneId | null>(null);
  const [trIdx, setTrIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem("tya:pathway");
      if (saved && LANE_IDS.includes(saved as LaneId)) setLane(saved as LaneId);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = `${config.label} — AI agents that work — TrainYourAgent`;
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setMeta("description", config.sub);
  }, [config]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setTrIdx(0);
    const id = setInterval(() => setTrIdx((i) => (i + 1) % (config.transcript.length + 4)), 2200);
    return () => clearInterval(id);
  }, [config]);

  const overlay = lane ? LANE_OVERLAY[lane] : null;
  const visibleTranscript = useMemo(() => config.transcript.slice(0, Math.min(trIdx, config.transcript.length)), [config, trIdx]);

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

      {overlay && (
        <div className="bg-[#042C53] text-white text-center text-[12px] sm:text-[13px] py-2 px-4 fixed top-[60px] left-0 right-0 z-40">
          You're viewing this through the <span className="font-semibold text-[#9CC4EC]">{overlay.tag}</span>. Copy and CTAs adapted.
          <button onClick={() => { setLane(null); try { window.localStorage.removeItem("tya:pathway"); } catch {} }} className="ml-3 underline text-white/70 hover:text-white">Reset</button>
        </div>
      )}

      <section className={`px-5 sm:px-8 pb-16 ${overlay ? "pt-36" : "pt-32"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">{config.eyebrow}</div>
          <h1 className="text-[42px] sm:text-[68px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            {config.headline1} <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>{config.headline2}</span>
          </h1>
          <p className="mt-6 text-[18px] sm:text-[20px] text-slate-700 max-w-3xl leading-relaxed">{config.sub}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15">{overlay ? overlay.ctaPrimary : "Book a build call"} →</a>
            <a href={`tel:${HERO_PHONE_TEL}`} className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] border-2 border-[#042C53]/15 hover:border-[#042C53]">{overlay ? overlay.ctaSecondary : `Call us: ${HERO_PHONE_DISPLAY}`}</a>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-10">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">What we build for {config.label}</div>
            <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-8">
              The version that <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>actually ships.</span>
            </h2>
            <ul className="space-y-3 text-[15px] text-slate-700">
              {config.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2.5 bg-[#185FA5]" />
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[12px] text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C]" /> {config.pricePoint}
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-[0_4px_40px_-12px_rgba(4,44,83,0.18)]">
            <div className="flex items-center justify-between mb-5">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold">Live sample · {config.label}</div>
              <div className="flex items-center gap-2 text-[11px] text-[#22A36C]"><span className="w-1.5 h-1.5 rounded-full bg-[#22A36C] animate-pulse" /> Streaming</div>
            </div>
            <div className="space-y-3 min-h-[260px]">
              {visibleTranscript.map((line, i) => (
                <div key={i} className="text-[14px] leading-relaxed text-slate-800 animate-[fadein_0.4s_ease-out]">
                  <span className={`font-semibold ${line.startsWith("Agent") || line.startsWith("Driver") ? "text-[#185FA5]" : "text-[#042C53]"}`}>
                    {line.split(":")[0]}:
                  </span>{" "}{line.split(":").slice(1).join(":")}
                </div>
              ))}
              {visibleTranscript.length < config.transcript.length && (
                <div className="text-[13px] text-slate-400 italic flex items-center gap-2">
                  <span className="inline-block w-1 h-3 bg-slate-300 animate-pulse" /> Agent typing...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Integrations</div>
          <h2 className="text-[24px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-6">
            Wires into the stack <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>you already pay for.</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {config.integrations.map((i, k) => (
              <span key={k} className="px-4 py-2 rounded-full bg-[#F6FAFE] border border-slate-200 text-[13px] text-[#042C53] font-medium">{i}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">What we hear most</div>
          <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-8">
            The doubts <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>we answer on every call.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { h: "AI sounds robotic and customers hate it.", b: "Not in 2026. Top-tier voice models with prosody tuning sound human. Most callers don't realize." },
              { h: "It can't handle our edge cases.",          b: "The agent handles the 80% confidently and escalates the 20% to a named human — your senior staff, your on-call line." },
              { h: "I don't want to be locked in.",            b: "Month-to-month after the build. Your data, your agent config, your call history — you own all of it. Export with one click." },
              { h: "What about a bad call going viral?",       b: "Every call has a transcript and a quality score. Outlier behavior gets flagged before it gets repeated. Plus a deterministic fallback for the worst case." },
            ].map((o, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-200 p-6">
                <div className="text-[15px] font-semibold text-[#042C53] mb-2">"{o.h}"</div>
                <div className="text-[14px] text-slate-700 leading-relaxed">{o.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[36px] sm:text-[56px] leading-[1.04] tracking-tight font-semibold">
            Ready for a {config.label} agent <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>that actually ships?</span>
          </h2>
          <p className="mt-5 text-[17px] text-white/85 max-w-2xl mx-auto leading-relaxed">Thirty-minute build call. You leave with a written plan and a price.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg">{overlay ? overlay.ctaPrimary : "Book a build call"} →</a>
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

      <style>{`@keyframes fadein { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default VerticalPage;
