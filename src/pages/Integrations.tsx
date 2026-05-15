// src/pages/Integrations.tsx
// Real integrations directory. Grouped by category with per-integration
// status badges: Production / Beta / Coming soon.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/trainyouragent/30min";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, color: "#042C53" }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
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

type Status = "Production" | "Beta" | "Coming soon";

type Integration = { name: string; status: Status };
type Category = { label: string; sub: string; items: Integration[] };

const P = (n: string): Integration => ({ name: n, status: "Production" });
const B = (n: string): Integration => ({ name: n, status: "Beta" });
const C = (n: string): Integration => ({ name: n, status: "Coming soon" });

const CATEGORIES: Category[] = [
  {
    label: "CRM",
    sub: "Bidirectional sync of contacts, opportunities, call outcomes.",
    items: [P("HubSpot"), P("Salesforce"), P("Pipedrive"), P("Close"), P("GoHighLevel"), B("Zoho"), B("Copper"), C("Keap")],
  },
  {
    label: "Calendar",
    sub: "Live availability, conflict resolution, confirmations.",
    items: [P("Cal.com"), P("Calendly"), P("Google Calendar"), P("Outlook 365"), B("Acuity"), C("SimplyBook.me")],
  },
  {
    label: "Telephony",
    sub: "Inbound, outbound, SMS, conference, SIP fallback.",
    items: [P("Twilio"), P("RingCentral"), P("Zoom Phone"), B("Telnyx"), B("Plivo"), B("SignalWire"), C("Vonage")],
  },
  {
    label: "Voice / STT / TTS",
    sub: "The actual model layer underneath every voice agent.",
    items: [P("ElevenLabs"), P("Deepgram"), P("Cartesia"), P("OpenAI (Realtime)"), B("Azure Speech"), C("AssemblyAI")],
  },
  {
    label: "Booking & Dispatch",
    sub: "Real-time field-service, salon, and clinical dispatch.",
    items: [P("ServiceTitan"), P("Jobber"), P("Housecall Pro"), P("Mindbody"), B("Boulevard"), B("FieldEdge"), B("Vagaro"), C("FieldPulse")],
  },
  {
    label: "Payment",
    sub: "Deposits, recurring billing, refunds.",
    items: [P("Stripe"), B("Square"), B("Braintree"), C("Authorize.net")],
  },
  {
    label: "Comms",
    sub: "Where humans actually see what the agent did.",
    items: [P("Slack"), P("Discord"), P("MS Teams"), P("SMS via Twilio"), B("Telegram"), C("WhatsApp Cloud API")],
  },
  {
    label: "Storage",
    sub: "Where transcripts, embeddings, and structured outputs land.",
    items: [P("Supabase"), P("AWS S3"), P("Notion"), P("Google Drive"), B("Pinecone"), B("pgvector"), C("Dropbox")],
  },
  {
    label: "Marketing",
    sub: "Email, newsletter, lifecycle, transactional.",
    items: [P("Klaviyo"), P("beehiiv"), P("Mailchimp"), P("ConvertKit"), P("Resend"), B("Customer.io"), C("Postmark")],
  },
  {
    label: "Healthcare",
    sub: "BAA-ready integrations with clinical systems.",
    items: [B("Athena"), B("DrChrono"), B("eClinicalWorks"), C("Epic open API"), C("NextGen"), C("Practice Fusion")],
  },
  {
    label: "Real Estate",
    sub: "Speed-to-lead, MLS lookups, showings.",
    items: [P("Follow Up Boss"), B("KvCORE"), B("Sierra Interactive"), C("Boomtown"), C("Lofty")],
  },
  {
    label: "Legal",
    sub: "Conflict checks, intake, matter routing.",
    items: [P("Clio"), B("MyCase"), B("PracticePanther"), C("Lawmatics"), C("Filevine")],
  },
  {
    label: "Logistics",
    sub: "Driver check-calls, exceptions, ELD.",
    items: [B("Samsara"), B("McLeod"), C("TMW"), C("Trucker Tools"), C("DAT")],
  },
  {
    label: "Automation",
    sub: "Connect to anything else with one of these.",
    items: [P("Zapier"), P("Make"), P("n8n"), P("Webhooks"), P("REST API"), B("Inngest"), B("Workato"), C("Temporal")],
  },
];

function StatusBadge({ status }: { status: Status }) {
  const styles =
    status === "Production"
      ? "bg-[#E6F4EC] text-[#1F7A4F] border-[#22A36C]/20"
      : status === "Beta"
      ? "bg-[#FEF3C7] text-[#92400E] border-amber-300/40"
      : "bg-slate-100 text-slate-500 border-slate-200";
  return (
    <span
      className={`inline-block text-[10px] uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-full border font-semibold ${styles}`}
    >
      {status === "Coming soon" ? "Soon" : status}
    </span>
  );
}

const Integrations = () => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "Integrations — TrainYourAgent";
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", n);
        document.head.appendChild(el);
      }
      el.setAttribute("content", c);
    };
    setMeta(
      "description",
      "Native integrations across CRM, calendar, telephony, voice, dispatch, payment, comms, storage, and marketing. Production, Beta, or Coming Soon — labeled honestly.",
    );
  }, []);

  const totalProd = CATEGORIES.reduce(
    (n, c) => n + c.items.filter((i) => i.status === "Production").length,
    0,
  );
  const totalBeta = CATEGORIES.reduce(
    (n, c) => n + c.items.filter((i) => i.status === "Beta").length,
    0,
  );
  const totalSoon = CATEGORIES.reduce(
    (n, c) => n + c.items.filter((i) => i.status === "Coming soon").length,
    0,
  );

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <SiteNav />

      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
            Integrations
          </div>
          <h1 className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]">
            Wired into the tools{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              you already run on.
            </span>
          </h1>
          <p className="mt-6 text-[17px] text-slate-700 max-w-3xl leading-relaxed">
            Production-grade integrations across the SMB stack. We label them
            honestly: <span className="font-semibold text-[#1F7A4F]">Production</span> means
            we ship it with paying customers. <span className="font-semibold text-amber-700">Beta</span> means
            it works but has rough edges. <span className="font-semibold text-slate-500">Coming soon</span>{" "}
            means we'll build it for the customer who needs it first.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <div className="rounded-2xl bg-[#E6F4EC] border border-[#22A36C]/20 px-4 py-2.5">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#1F7A4F] font-semibold">
                Production
              </div>
              <div className="text-[20px] font-semibold text-[#1F7A4F]">{totalProd}</div>
            </div>
            <div className="rounded-2xl bg-[#FEF3C7] border border-amber-300/40 px-4 py-2.5">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#92400E] font-semibold">
                Beta
              </div>
              <div className="text-[20px] font-semibold text-[#92400E]">{totalBeta}</div>
            </div>
            <div className="rounded-2xl bg-slate-100 border border-slate-200 px-4 py-2.5">
              <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
                Coming soon
              </div>
              <div className="text-[20px] font-semibold text-slate-500">{totalSoon}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-7xl mx-auto space-y-6">
          {CATEGORIES.map((cat) => (
            <article
              key={cat.label}
              className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                <div>
                  <h2 className="text-[22px] sm:text-[26px] font-semibold text-[#042C53] leading-tight">
                    {cat.label}
                  </h2>
                  <p className="text-[14px] text-slate-600 mt-1">{cat.sub}</p>
                </div>
                <BrainLogo size={28} />
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((it) => (
                  <div
                    key={it.name}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F6FAFE] border border-slate-200 hover:border-[#185FA5] transition"
                  >
                    <span className="text-[13px] text-[#042C53] font-medium">
                      {it.name}
                    </span>
                    <StatusBadge status={it.status} />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            Don't see yours?
          </div>
          <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-4">
            We build the missing one{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              inside the sprint.
            </span>
          </h2>
          <p className="text-[15px] text-slate-700 max-w-xl mx-auto leading-relaxed mb-6">
            Most of our Production integrations started as a customer ask.
            Tell us what you run on — odds are it lands in our build queue
            within the same project.
          </p>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener"
            className="inline-block px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] shadow"
          >
            Book a 30-min call →
          </a>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#042C53]">Terms</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Integrations;
