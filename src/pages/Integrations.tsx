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
          <circle cx="20" cy="27" r="7.5" /><circle cx="32" cy="21" r="8.5" /><circle cx="44" cy="27" r="7.5" />
          <circle cx="24" cy="40" r="7" /><circle cx="40" cy="40" r="7" /><rect x="29" y="44" width="6" height="11" rx="1.5" />
        </g>
        <circle cx="32" cy="32" r="30" fill="none" stroke="#185FA5" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

const CATEGORIES: { label: string; sub: string; items: string[] }[] = [
  { label: "CRM", sub: "Bidirectional sync of contacts, opportunities, and call outcomes.", items: ["HubSpot","Salesforce","Pipedrive","Close","Zoho","Copper","Keap","Monday CRM"] },
  { label: "Calendars + Booking", sub: "Live availability, conflict resolution, and confirmation flows.", items: ["Cal.com","Calendly","Google Calendar","Outlook 365","Acuity","SimplyBook.me"] },
  { label: "Telephony", sub: "Inbound, outbound, SMS, conference, and SIP fallback.", items: ["Twilio","Telnyx","Plivo","SignalWire","RingCentral","Vonage"] },
  { label: "Healthcare", sub: "BAA-compliant integrations with clinical systems.", items: ["Athena","eClinicalWorks","DrChrono","Epic open API","NextGen","Practice Fusion"] },
  { label: "Field Service", sub: "Real-time dispatch, tech availability, and job costing.", items: ["ServiceTitan","Housecall Pro","Jobber","FieldEdge","FieldPulse","Workiz"] },
  { label: "Real Estate", sub: "Speed-to-lead, MLS lookups, and showing schedules.", items: ["Follow Up Boss","KvCORE","Sierra Interactive","Boomtown","Lofty","Wise Agent"] },
  { label: "Legal", sub: "Conflict checks, intake, and matter routing.", items: ["Clio","MyCase","PracticePanther","Lawmatics","Filevine","Smokeball"] },
  { label: "Hospitality + Bookings", sub: "Reservations, waitlists, and PMS sync.", items: ["SevenRooms","Resy","OpenTable","Tock","Mindbody","Boulevard","Vagaro","Cloudbeds","Mews"] },
  { label: "Logistics", sub: "Driver check-calls, exceptions, and ELD integration.", items: ["McLeod","TMW","Trucker Tools","Truckstop","DAT","Samsara"] },
  { label: "Payments + Billing", sub: "Deposits, recurring billing, and refunds.", items: ["Stripe","Square","Braintree","QuickBooks Payments","Authorize.net"] },
  { label: "Comms + Productivity", sub: "Where humans actually see what the agent did.", items: ["Slack","Microsoft Teams","Discord","Telegram","Notion","ClickUp","Asana","Linear"] },
  { label: "Automation Layer", sub: "Connect to anything else with one of these.", items: ["Zapier","Make","n8n","Workato","Webhooks","REST API"] },
];

const Integrations = () => {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Integrations — TrainYourAgent";
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
            <Link to="/pricing" className="hover:text-[#042C53]">Pricing</Link>
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E] shadow-sm">Book a call</a>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">Integrations</div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Plugs into the stack <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>you already pay for.</span>
          </h1>
          <p className="mt-6 text-[18px] text-slate-700 max-w-3xl leading-relaxed">
            We wire your agent into the systems your team already uses — your CRM, your calendar, your dispatch tool, your phones. Bidirectional sync where it matters, not duct-taped Zaps.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((c, i) => (
            <div key={i} className="rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#185FA5] hover:shadow-[0_4px_24px_-10px_rgba(4,44,83,0.18)] transition">
              <div className="text-[16px] font-semibold text-[#042C53] mb-1">{c.label}</div>
              <div className="text-[12px] text-slate-600 mb-4 leading-relaxed">{c.sub}</div>
              <div className="flex flex-wrap gap-1.5">
                {c.items.map((it, k) => (
                  <span key={k} className="px-2.5 py-1 rounded-full bg-[#F6FAFE] text-[#042C53] text-[11px] font-medium">{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 py-20 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Don't see yours?</div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-4">
            If it has an API, <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>we wire it.</span>
          </h2>
          <p className="text-[15px] text-slate-700 max-w-xl mx-auto leading-relaxed mb-6">
            Custom integrations are a routine part of every build. REST, webhook, direct database — whatever the system supports. Email us with what you use and we'll quote the wire-up on the call.
          </p>
          <a href={CAL_URL} target="_blank" rel="noopener" className="inline-block px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] shadow">Scope an integration →</a>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5"><BrainLogo size={28} /><span className="font-semibold text-[#042C53]">TrainYourAgent</span><span className="text-slate-400">— Tampa Bay, FL</span></div>
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

export default Integrations;
