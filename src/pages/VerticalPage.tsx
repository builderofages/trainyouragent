import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * VerticalPage v1 — unified template for every /vertical route.
 * White surface, brand blue, brain-cloud logo, AI objections section.
 * One component handles all 14 verticals via VERTICAL_CONFIG lookup.
 */

type Transcript = { who: "caller" | "agent" | "system"; text: string };
type VerticalConfig = {
  label: string;
  eyebrow: string;
  headline1: string;
  headline2: string;
  sub: string;
  bullets: string[];
  transcript: Transcript[];
  integrations: string[];
};

const VERTICAL_CONFIG: Record<string, VerticalConfig> = {
  "/roofing": {
    label: "Roofing", eyebrow: "AI for roofing",
    headline1: "Storm calls", headline2: "captured at 2am.",
    sub: "When a hail event hits, your phone explodes. We answer every call, triage by insurance status, and book inspections — even at 2am while you sleep.",
    bullets: ["Insurance-first qualification flow", "Storm-surge call burst handling", "Inspection booking into your CRM", "Adjuster coordination handoff"],
    transcript: [
      { who: "caller", text: "Just got hit by hail in Brandon — need an inspection." },
      { who: "agent",  text: "Got it. Is your roof currently leaking?" },
      { who: "caller", text: "Not yet. State Farm policy." },
      { who: "agent",  text: "Booking an inspection tomorrow morning. Address?" },
      { who: "system", text: "→ Booked · JobNimbus · Insp: D. Chen · Confirmation sent" },
    ],
    integrations: ["JobNimbus","AccuLynx","CompanyCam","ServiceTitan","HubSpot","Twilio"],
  },
  "/hvac": {
    label: "HVAC", eyebrow: "AI for HVAC",
    headline1: "Emergency calls", headline2: "answered, dispatched.",
    sub: "After-hours, weekend, holiday — every call gets answered. Triage by urgency, dispatch by zone, book by tech availability.",
    bullets: ["After-hours emergency dispatch", "Service-call booking into ServiceTitan", "Membership renewals and saves", "Tech-routing by zip + skill"],
    transcript: [
      { who: "caller", text: "AC stopped overnight, house is at 84." },
      { who: "agent",  text: "Sorry about that. Earliest tech in 33602 is 1–3pm. Book it?" },
      { who: "caller", text: "Yes please." },
      { who: "system", text: "→ Booked · ServiceTitan · Tech: M. Alvarez · ETA texted" },
    ],
    integrations: ["ServiceTitan","Housecall Pro","Jobber","FieldEdge","Twilio","HubSpot"],
  },
  "/solar": {
    label: "Solar", eyebrow: "AI for solar",
    headline1: "Consultation booking,", headline2: "with a qualification gate.",
    sub: "Filter tire-kickers before your closer's calendar fills. The agent qualifies homeowner, roof type, average bill, and only books people who fit.",
    bullets: ["Homeowner + utility qualification", "Roof type + shading screening", "Bill range gate before booking", "Closer-calendar protection"],
    transcript: [
      { who: "caller", text: "Saw your ad — want to know about solar." },
      { who: "agent",  text: "Happy to help. Do you own the home and what's your average power bill?" },
      { who: "caller", text: "Own it, around $280/mo." },
      { who: "agent",  text: "You're a fit. Booking a 20-min design consult Thursday at 4pm." },
      { who: "system", text: "→ Booked · Salesforce · Closer: R. Park · Materials sent" },
    ],
    integrations: ["Salesforce","HubSpot","Aurora","SolarApp","Twilio","DocuSign"],
  },
  "/gym": {
    label: "Gym & Fitness", eyebrow: "AI for gyms",
    headline1: "Tour bookings.", headline2: "Cancellation saves.",
    sub: "Two flows: capture interested leads into a tour the same day, and intercept cancellations with a save offer before they hit your CRM.",
    bullets: ["Same-day tour booking", "Membership cancellation save flow", "Class waitlist + reschedule", "Renewal reminders"],
    transcript: [
      { who: "caller", text: "Want to cancel my membership." },
      { who: "agent",  text: "Sorry to hear that. Mind sharing why?" },
      { who: "caller", text: "Just not coming enough." },
      { who: "agent",  text: "I can pause for 60 days at no charge — keep your rate. Want that?" },
      { who: "system", text: "→ Saved · Mindbody · Pause 60d · Renewal scheduled" },
    ],
    integrations: ["Mindbody","Mariana Tek","Glofox","Stripe","Twilio","HubSpot"],
  },
  "/healthcare": {
    label: "Healthcare", eyebrow: "AI for clinics",
    headline1: "Patient intake,", headline2: "routed to the right room.",
    sub: "HIPAA-ready intake. The agent screens symptoms, captures insurance, books to the right provider, and only escalates clinical questions to staff.",
    bullets: ["HIPAA-ready data flow", "Insurance verification at booking", "Symptom triage to provider type", "Clinical-question escalation"],
    transcript: [
      { who: "caller", text: "Need to see someone for a sinus infection." },
      { who: "agent",  text: "Are you a current patient?" },
      { who: "caller", text: "Yes." },
      { who: "agent",  text: "Earliest opening with Dr. Patel is tomorrow at 10:15. Book it?" },
      { who: "system", text: "→ Booked · Athenahealth · Insurance verified · Reminder sent" },
    ],
    integrations: ["Athenahealth","Epic","DrChrono","Twilio","Calendly Health","Stripe"],
  },
  "/legal": {
    label: "Legal", eyebrow: "AI for law firms",
    headline1: "Conflict checks first,", headline2: "then a consult.",
    sub: "Every inbound goes through conflict screening before booking. Captures the matter type, opposing party, and jurisdiction — refuses cleanly when there's a hit.",
    bullets: ["Automatic conflict-of-interest screening", "Matter-type routing to right attorney", "Intake forms triggered post-call", "Refusal + referral on conflicts"],
    transcript: [
      { who: "caller", text: "Need a personal injury lawyer — auto accident last week." },
      { who: "agent",  text: "Sorry to hear. Have you spoken to insurance yet, and was a police report filed?" },
      { who: "caller", text: "Yes to both." },
      { who: "agent",  text: "Booking a 30-min consult with Ms. Reyes Friday at 2pm." },
      { who: "system", text: "→ Booked · Clio · Conflict cleared · Intake form sent" },
    ],
    integrations: ["Clio","MyCase","PracticePanther","DocuSign","Twilio","HubSpot"],
  },
  "/real-estate": {
    label: "Real Estate", eyebrow: "AI for real estate",
    headline1: "Showing requests,", headline2: "qualified by budget.",
    sub: "Captures buyer pre-approval status, target price band, and timeline before booking a showing — your agents only meet ready buyers.",
    bullets: ["Pre-approval qualification", "Price-band + timeline gate", "Showing booking into MLS calendar", "Listing-alert opt-in"],
    transcript: [
      { who: "caller", text: "Want to see the house on Magnolia." },
      { who: "agent",  text: "Got it. Are you pre-approved and what's your target range?" },
      { who: "caller", text: "Pre-approved, up to $620k." },
      { who: "agent",  text: "It's at $599. Booking a showing Saturday at 11am with Marcus." },
      { who: "system", text: "→ Booked · Follow Up Boss · Pre-qual confirmed" },
    ],
    integrations: ["Follow Up Boss","Sierra","kvCORE","DocuSign","Twilio","HubSpot"],
  },
  "/automotive": {
    label: "Automotive", eyebrow: "AI for dealerships",
    headline1: "Test-drive booking,", headline2: "parts inquiries handled.",
    sub: "Captures buyer intent, current vehicle, financing status, and books test drives. Routes parts and service inquiries to the right department.",
    bullets: ["Test-drive booking with trade-in info", "Parts + service routing", "Financing pre-screen capture", "Inventory-question handling"],
    transcript: [
      { who: "caller", text: "Want to test drive the F-150 Lariat." },
      { who: "agent",  text: "Got it. Do you have a trade-in and are you financing or paying cash?" },
      { who: "caller", text: "Trading a 2019 Ram, financing." },
      { who: "agent",  text: "Booking Saturday at 10am with Jen. Bringing payoff info?" },
      { who: "system", text: "→ Booked · CDK Drive · Trade-in noted · Finance pre-app sent" },
    ],
    integrations: ["CDK Drive","DealerSocket","VinSolutions","Twilio","HubSpot","DocuSign"],
  },
  "/spas": {
    label: "Med Spa", eyebrow: "AI for med spas",
    headline1: "Consults booked,", headline2: "pre-screen forms sent.",
    sub: "Captures treatment interest, contraindications screening, and books consults. Pre-screen forms go out automatically before appointment.",
    bullets: ["Treatment-specific qualification", "Contraindication pre-screen", "Consult booking + intake forms", "Package + add-on upsell"],
    transcript: [
      { who: "caller", text: "Interested in Botox — first time." },
      { who: "agent",  text: "Welcome. Any history of allergies or current medications?" },
      { who: "caller", text: "None." },
      { who: "agent",  text: "Booking a 30-min consult Thursday at 5pm with Dr. Chen." },
      { who: "system", text: "→ Booked · Boulevard · Pre-screen form sent" },
    ],
    integrations: ["Boulevard","Mindbody","Vagaro","Stripe","Twilio","Mailchimp"],
  },
  "/hotels": {
    label: "Hotels", eyebrow: "AI for hotels",
    headline1: "Reservations taken,", headline2: "upsells offered on stay.",
    sub: "Direct bookings without paying OTA commissions. The agent confirms availability, captures preferences, and offers upgrades on call.",
    bullets: ["Direct booking (skip OTA fees)", "Room-preference capture", "Upsell offers on confirmation", "Group + corporate inquiry routing"],
    transcript: [
      { who: "caller", text: "Looking for a king room next Friday-Sunday." },
      { who: "agent",  text: "We have availability at $189/night. Want to upgrade to a suite for $40 more?" },
      { who: "caller", text: "Yes, the suite." },
      { who: "system", text: "→ Booked · Cloudbeds · 2 nights suite · Confirmation #4827" },
    ],
    integrations: ["Cloudbeds","Mews","Opera","Stripe","Twilio","Mailchimp"],
  },
  "/bars-nightclubs": {
    label: "Bars / Clubs", eyebrow: "AI for bars + nightclubs",
    headline1: "Table requests,", headline2: "guestlist sign-up.",
    sub: "Handles bottle-service inquiries, table reservations, guestlist, and event RSVPs without your host staff drowning in calls.",
    bullets: ["Bottle-service inquiry routing", "Table reservation booking", "Guestlist + RSVP capture", "Event-night load handling"],
    transcript: [
      { who: "caller", text: "Need a table for 6 Saturday — bottle service." },
      { who: "agent",  text: "Got it. Bottle minimum is $750 for that section. Confirm?" },
      { who: "caller", text: "Yes, confirmed." },
      { who: "system", text: "→ Booked · SevenRooms · Bottle min confirmed · Deposit charged" },
    ],
    integrations: ["SevenRooms","OpenTable","Resy","Stripe","Twilio","Mailchimp"],
  },
  "/logistics": {
    label: "Logistics", eyebrow: "AI for logistics",
    headline1: "Pickup quotes,", headline2: "dispatch routing.",
    sub: "Captures shipment specs, generates quotes from your rate matrix, and routes to dispatch. Handles tracking inquiries without tying up dispatchers.",
    bullets: ["Quote generation from rate matrix", "Pickup booking + dispatch routing", "Tracking inquiry self-service", "Carrier coordination handoff"],
    transcript: [
      { who: "caller", text: "Need to ship 12 pallets from Tampa to Atlanta." },
      { who: "agent",  text: "Standard or expedited? And dimensions per pallet?" },
      { who: "caller", text: "Standard, 48x40 each." },
      { who: "agent",  text: "Quote is $1,840. Pickup tomorrow afternoon. Confirm?" },
      { who: "system", text: "→ Booked · McLeod · Dispatch alerted · Driver assigned" },
    ],
    integrations: ["McLeod","Samsara","Trimble","DAT","Twilio","HubSpot"],
  },
  "/accounting": {
    label: "Accounting", eyebrow: "AI for accountants + CPAs",
    headline1: "Discovery intake,", headline2: "scope qualification.",
    sub: "Filters every inbound by entity type, revenue, current bookkeeping setup, and timeline. Books only the prospects worth your scoping time.",
    bullets: ["Entity type + revenue qualification", "Current-stack discovery", "Tax-season urgency routing", "Document collection automation"],
    transcript: [
      { who: "caller", text: "Looking for a CPA — small ecom business." },
      { who: "agent",  text: "What's last year's revenue and are you on QBO or Xero?" },
      { who: "caller", text: "$680k, QBO." },
      { who: "agent",  text: "You're a fit. Booking a 30-min discovery with Sarah Tuesday at 2pm." },
      { who: "system", text: "→ Booked · Karbon · Doc-request sent · Intake started" },
    ],
    integrations: ["Karbon","QuickBooks","Xero","Drake","Stripe","HubSpot"],
  },
  "/solutions": {
    label: "Agencies", eyebrow: "AI for agencies",
    headline1: "Client-side intake,", headline2: "at scale.",
    sub: "White-label voice + chat agents for your clients. We build, you brand. Per-client dashboards, per-client billing, per-client analytics.",
    bullets: ["White-label deployment per client", "Per-client dashboards + billing", "Multi-tenant management console", "Reseller margin built in"],
    transcript: [
      { who: "caller", text: "Calling about your roofing pilot — want to renew." },
      { who: "agent",  text: "Great. Adding next quarter onto your existing contract?" },
      { who: "caller", text: "Yes, plus add HVAC line." },
      { who: "system", text: "→ Booked · HubSpot · Renewal logged · CSM notified" },
    ],
    integrations: ["HubSpot","Salesforce","Stripe Connect","Twilio","Slack","Notion"],
  },
};

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

function LiveTranscript({ lines }: { lines: Transcript[] }) {
  const [visible, setVisible] = useState(1);
  useEffect(() => {
    if (visible >= lines.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 1400);
    return () => clearTimeout(t);
  }, [visible, lines.length]);
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
          {lines.slice(0, visible).map((row, i) => (
            <div key={i} className="flex gap-3 animate-fade-in">
              <span className={`flex-shrink-0 w-16 ${row.who === "caller" ? "text-[#85B7EB]" : row.who === "agent" ? "text-[#9FE1CB]" : "text-slate-400"}`}>{row.who}:</span>
              <span className={row.who === "system" ? "text-slate-400 text-[12.5px]" : "text-white"}>{row.text}</span>
            </div>
          ))}
          {visible < lines.length && (
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

const OBJECTIONS = [
  { q: "What if the AI hallucinates or goes off-script?", a: "It can't say things outside the script we author with you. Out-of-domain questions trigger a clean refusal + human callback. Every \"I don't know\" enters our eval set and gets a permanent guardrail in the next refresh. We publish the refusal log to your dashboard." },
  { q: "Where does my customer data live?", a: "On infrastructure you can audit. Call recordings + transcripts in your S3 bucket if you want, or our SOC 2 Type II–targeted environment if you don't. Zero data is used to train other customers' models. HIPAA-ready architecture available on request." },
  { q: "Isn't this just a ChatGPT wrapper?", a: "No. We custom fine-tune a model on your real call recordings or scripts so it sounds like your business. On Pro and Platform tiers you keep the model weights — if we vanish tomorrow, you walk away with the trained model. Try doing that with a wrapper." },
  { q: "What if I get locked in?", a: "Month-to-month after a 90-day commit. Full data export on request, no destruction theater, no claw-back. You own the phone number, the recordings, and on Platform tier the model itself." },
  { q: "Why not just use Vapi, Retell, or Voiceflow myself?", a: "Those are platforms — DIY toolkits. We're the team. We build the script, train the model, wire the integrations, monitor the calls, fix the failures, refresh weekly. Your ops team never opens a flow editor. The labor IS the product." },
  { q: "How do I know it's actually working?", a: "Live dashboard with every call, every transcript, every booking, every escalation. Public uptime number. Weekly metrics email. We'll set up a 14-day pilot on a small call volume before you commit — measurable before you scale." },
];

const Vertical = () => {
  const location = useLocation();
  const config = VERTICAL_CONFIG[location.pathname] || VERTICAL_CONFIG["/hvac"];
  const [navScrolled, setNavScrolled] = useState(false);
  const [calls, setCalls] = useState(140);
  const [missedRate, setMissedRate] = useState(35);
  const [avgValue, setAvgValue] = useState(180);
  const monthlyValue = useMemo(() => Math.round(calls * (missedRate / 100) * 30 * 0.7) * avgValue, [calls, missedRate, avgValue]);

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
      l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter+Tight:wght@400;500;600;700&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = `TrainYourAgent — ${config.label} AI Agents`;
    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.head.querySelector(sel) as any;
      if (!el) { el = document.createElement("meta"); const m = sel.match(/\[(\w+)="([^"]+)"\]/); if (m) el.setAttribute(m[1], m[2]); document.head.appendChild(el); }
      el.setAttribute(attr, val);
    };
    setMeta('meta[name="description"]', "content", config.sub);
    setMeta('meta[name="theme-color"]', "content", "#FAFBFC");
  }, [config]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("tya-elevenlabs-script")) return;
    const s = document.createElement("script");
    s.id = "tya-elevenlabs-script";
    s.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    s.async = true; s.type = "text/javascript";
    document.head.appendChild(s);
    if (!document.querySelector("elevenlabs-convai")) {
      const w = document.createElement("elevenlabs-convai");
      w.setAttribute("agent-id", "agent_5801k8nhs68yfyb8m0px86cdp6fc");
      document.body.appendChild(w);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-[#042C53] antialiased selection:bg-[#185FA5] selection:text-white overflow-x-hidden"
      style={{ fontFamily: "'Inter Tight', 'Inter', system-ui, -apple-system, sans-serif" }}>
      <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } } .animate-fade-in { animation: fade-in 0.35s ease-out both }`}</style>

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
            <Link to="/#faq" className="text-slate-600 hover:text-[#042C53] transition">FAQ</Link>
          </div>
          <a href="mailto:hello@trainyouragent.com?subject=Book%20a%20discovery%20call" className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold tracking-tight text-white bg-[#185FA5] hover:bg-[#0C447C] transition rounded-full shadow-[0_8px_20px_-6px_rgba(24,95,165,0.45)]">
            Book a call
          </a>
        </div>
      </nav>

      <main>

      <header className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(900px 500px at 80% -10%, rgba(133,183,235,0.25), transparent 60%), radial-gradient(700px 400px at 10% 0%, rgba(230,241,251,0.6), transparent 60%)" }} />
        <div className="max-w-[1240px] mx-auto px-6 relative">
          <Link to="/#niches" className="inline-flex items-center gap-2 text-[12px] font-mono tracking-wider uppercase text-[#185FA5] hover:text-[#042C53] transition mb-6">← All verticals</Link>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-9 text-[11px] tracking-[0.18em] uppercase border border-slate-200 bg-white text-slate-600 font-mono rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#185FA5] animate-pulse" />
            {config.eyebrow}
          </div>
          <h1 className="text-[clamp(46px,7vw,104px)] leading-[0.98] tracking-[-0.025em] mb-8 max-w-[1100px]"
            style={{ fontFamily: "'Playfair Display', 'Times New Roman', serif", fontWeight: 500 }}>
            {config.headline1}<br />
            <em className="italic font-normal" style={{ color: "#185FA5" }}>{config.headline2}</em>
          </h1>
          <p className="text-[clamp(17px,1.45vw,21px)] text-slate-600 max-w-[640px] mb-10 leading-relaxed">{config.sub}</p>
          <div className="flex gap-3 flex-wrap items-center">
            <a href="mailto:hello@trainyouragent.com?subject=Discovery%20call%20-%20{config.label}" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white bg-[#185FA5] hover:bg-[#0C447C] transition rounded-full shadow-[0_14px_36px_-10px_rgba(24,95,165,0.5)]">
              Book a discovery call →
            </a>
            <Link to="/#demo" className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-[#042C53] bg-white hover:bg-slate-50 border border-slate-200 transition rounded-full">
              Hear the agent live
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20">
        <div className="max-w-[1240px] mx-auto px-6 grid lg:grid-cols-[1fr,1.2fr] gap-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-3">Scope</div>
            <h2 className="text-[28px] tracking-tight mb-5 font-medium">What this agent handles for {config.label.toLowerCase()}.</h2>
            <ul className="space-y-3">
              {config.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 items-start text-[15px] text-[#042C53] leading-relaxed">
                  <span className="text-[#185FA5] mt-1.5 text-[8px]">●</span><span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-[11px] tracking-[0.2em] uppercase text-slate-500 font-mono mb-3">Integrations we wire</div>
              <div className="flex flex-wrap gap-2">
                {config.integrations.map((i) => (
                  <span key={i} className="text-[12px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">{i}</span>
                ))}
              </div>
            </div>
          </div>
          <LiveTranscript lines={config.transcript} />
        </div>
      </section>

      {/* ROI */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-3">ROI for {config.label.toLowerCase()}</div>
            <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.025em]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
              What you'd <em className="italic font-normal" style={{ color: "#185FA5" }}>recover</em> per month.
            </h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 grid md:grid-cols-2 gap-8">
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
            <div className="bg-[#F4F7FB] rounded-2xl p-7 flex flex-col justify-center">
              <div className="text-[11px] tracking-[0.2em] uppercase text-slate-500 font-mono mb-2">Estimated capture / month</div>
              <div className="text-[44px] leading-none tracking-tight text-[#185FA5]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>${monthlyValue.toLocaleString()}</div>
              <div className="text-[12px] text-slate-500 mt-3 leading-relaxed">Assumes the agent recovers 70% of currently-missed calls into a qualified booking. Real recovery rate published weekly.</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI OBJECTIONS — for the doubters */}
      <section className="py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-3">Why trust an AI agent</div>
            <h2 className="text-[clamp(34px,4.5vw,56px)] leading-[1.05] tracking-[-0.025em] max-w-2xl mx-auto" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
              The hard <em className="italic font-normal" style={{ color: "#185FA5" }}>questions</em>, answered.
            </h2>
            <p className="text-slate-600 text-[15px] max-w-xl mx-auto mt-4 leading-relaxed">If you've been burned by AI hype, read these first. Same answers we give buyers on the discovery call.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {OBJECTIONS.map((o, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-7">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-mono text-[#185FA5]">0{i + 1}</span>
                </div>
                <h3 className="text-[16px] tracking-tight mb-3 font-medium text-[#042C53]">{o.q}</h3>
                <p className="text-slate-600 text-[14px] leading-relaxed">{o.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white border-t border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(800px 400px at 50% 50%, rgba(133,183,235,0.4), transparent 65%)" }} />
        <div className="max-w-[900px] mx-auto px-6 text-center relative">
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-4">Get started</div>
          <h2 className="text-[clamp(36px,5vw,72px)] leading-[1.02] tracking-[-0.03em] mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
            Built for {config.label.toLowerCase()}, <em className="italic font-normal" style={{ color: "#185FA5" }}>shipped in days.</em>
          </h2>
          <p className="text-slate-600 text-[18px] max-w-xl mx-auto mb-10 leading-relaxed">30 minutes with the founder. We'll write the actual scope on the call. No deck.</p>
          <a href={`mailto:hello@trainyouragent.com?subject=${encodeURIComponent(config.label)}%20discovery%20call`}
            className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold text-white bg-[#185FA5] hover:bg-[#0C447C] transition rounded-full shadow-[0_18px_50px_-12px_rgba(24,95,165,0.55)]">
            hello@trainyouragent.com →
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
              <div className="text-slate-500 text-[12px]">AI that thinks like your business.</div>
            </div>
          </Link>
          <div className="flex gap-6 text-[13px] text-slate-600 flex-wrap">
            <Link to="/" className="hover:text-[#042C53] transition">Home</Link>
            <Link to="/#niches" className="hover:text-[#042C53] transition">Verticals</Link>
            <Link to="/#pricing" className="hover:text-[#042C53] transition">Pricing</Link>
            <a href="mailto:hello@trainyouragent.com" className="hover:text-[#042C53] transition">Email</a>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

export default Vertical;
