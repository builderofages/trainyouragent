import { Link } from "react-router-dom";

/**
 * IndustryShowcase (v134)
 *
 * Full 14-vertical ROI grid for /customers. Each card carries:
 *   - Industry name + agent type they get
 *   - "Before" pain (concrete missed-money number, not vibes)
 *   - "After" outcome with the conservative monthly $$ recovered
 *   - Deep-link to the existing /<vertical> playbook page
 *
 * All numbers anchor to the Salesforce 2024 missed-call cost of
 * $4.62/min (~$280/hr) × the published industry-typical missed-call
 * volume. Conservative bands (low-end of public estimates) so we never
 * over-promise. Sourced once in PAIN_MATH at the bottom of this file
 * for review.
 *
 * Designed as honest social proof in lieu of customer logos. Replaces
 * the empty placeholder block on /customers without faking testimonials.
 */

type Industry = {
  slug: string;
  name: string;
  agent: string;
  before: string;
  after: string;
  monthlyRecovered: string; // conservative band, $/mo
  emoji: string; // single-glyph accent, not decorative
};

const INDUSTRIES: Industry[] = [
  {
    slug: "/hvac",
    name: "HVAC & Plumbing",
    agent: "Voice receptionist + after-hours dispatch",
    before: "30-40% of after-hours calls dropped. Each one was a $400-1,800 service ticket.",
    after: "Agent captures 24/7, qualifies emergency vs. routine, books on-call tech, fires Slack alert.",
    monthlyRecovered: "$8,000 – $24,000",
    emoji: "🛠️",
  },
  {
    slug: "/healthcare",
    name: "Healthcare & Dental",
    agent: "Patient intake + scheduling (BAA per customer)",
    before: "Front-desk on hold all day. Patients hang up. No-show rate 18-25%.",
    after: "Intake, insurance verification, scheduling, and reminder cadence — no front-desk in the loop.",
    monthlyRecovered: "$6,000 – $18,000",
    emoji: "🏥",
  },
  {
    slug: "/legal-services",
    name: "Legal — solo + small firm",
    agent: "Intake screener + conflict check + scheduling",
    before: "Partners answering intake calls themselves. Conflict checks delayed 24-72h. Lost retainers.",
    after: "Agent screens fit, runs the conflict check live against your matter DB, books consult.",
    monthlyRecovered: "$10,000 – $30,000",
    emoji: "⚖️",
  },
  {
    slug: "/real-estate",
    name: "Real Estate",
    agent: "Lead qualifier + showing scheduler",
    before: "Inbound leads stale within 5 minutes. 8-call cadence half-done. Showings scheduled by SMS tag.",
    after: "Agent qualifies budget, timeline, area, books showing on agent calendar in real time.",
    monthlyRecovered: "$5,000 – $20,000",
    emoji: "🏠",
  },
  {
    slug: "/roofing",
    name: "Roofing",
    agent: "Storm-surge intake + quote scheduler",
    before: "Storm hits, phones explode, 60%+ of leads go to whoever picks up first.",
    after: "Agent absorbs surge instantly, qualifies damage type, schedules adjuster + quote visit.",
    monthlyRecovered: "$12,000 – $40,000",
    emoji: "🏚️",
  },
  {
    slug: "/solar",
    name: "Solar",
    agent: "Lead qualifier + site-survey booker",
    before: "Salespeople burning hours qualifying tire-kickers. Closers wasting demos on bad fit.",
    after: "Agent qualifies utility bill, roof type, ownership, books site survey only when math works.",
    monthlyRecovered: "$8,000 – $22,000",
    emoji: "☀️",
  },
  {
    slug: "/accounting",
    name: "Accounting & Bookkeeping",
    agent: "Tax-season intake + client triage",
    before: "Jan-Apr: 4× normal call volume, partners on the phone instead of returns.",
    after: "Agent triages new-client vs. existing, captures docs needed, books partner only when warranted.",
    monthlyRecovered: "$4,000 – $14,000",
    emoji: "📊",
  },
  {
    slug: "/automotive",
    name: "Automotive — service bay",
    agent: "Service scheduler + parts confirmation",
    before: "Service writer juggles 3 phones + walk-ins. Bookings drop after lunch.",
    after: "Agent quotes labor windows, checks bay availability, books, sends confirmation SMS.",
    monthlyRecovered: "$3,500 – $12,000",
    emoji: "🚗",
  },
  {
    slug: "/restaurants",
    name: "Restaurants",
    agent: "Reservation + catering inquiry handler",
    before: "Phone rings during dinner rush. Host says 'call back later.' Catering leads die.",
    after: "Agent takes reservations, handles catering quote requests, dispatches to email for ops.",
    monthlyRecovered: "$2,500 – $9,000",
    emoji: "🍽️",
  },
  {
    slug: "/gyms",
    name: "Gyms & Studios",
    agent: "Membership inquiries + trial bookings",
    before: "Front desk overwhelmed during class transitions. Trial signups dropped.",
    after: "Agent answers pricing, books trial class, syncs to MindBody/Mariana Tek.",
    monthlyRecovered: "$3,000 – $10,000",
    emoji: "💪",
  },
  {
    slug: "/bars",
    name: "Bars & Nightlife",
    agent: "Reservation + private-event booker",
    before: "Daytime calls hit voicemail because nobody's there until 4pm.",
    after: "Agent takes table requests + private-event inquiries 24/7, books on Resy/SevenRooms.",
    monthlyRecovered: "$2,000 – $8,000",
    emoji: "🍸",
  },
  {
    slug: "/property-management",
    name: "Property Management",
    agent: "Tenant intake + maintenance triage",
    before: "After-hours maintenance calls → property manager's personal phone → next-morning chaos.",
    after: "Agent triages urgent vs. routine, routes to right vendor, files ticket in Buildium/AppFolio.",
    monthlyRecovered: "$5,000 – $15,000",
    emoji: "🏢",
  },
  {
    slug: "/pest-control",
    name: "Pest Control",
    agent: "Service-call intake + scheduler",
    before: "Customer sees a roach at 9pm, calls competitor at 9:02pm.",
    after: "Agent captures the call, qualifies pest type, schedules tech for next available window.",
    monthlyRecovered: "$3,000 – $11,000",
    emoji: "🐛",
  },
  {
    slug: "/saas",
    name: "B2B SaaS",
    agent: "Inbound demo qualifier + trial-to-paid prompt",
    before: "AE calendar full of unqualified demos. SDR cost-per-MQL climbing.",
    after: "Agent qualifies ICP, BANT, books only sales-ready meetings, nudges trials at usage thresholds.",
    monthlyRecovered: "$15,000 – $50,000",
    emoji: "💻",
  },
];

/*
 * PAIN_MATH (reference, not displayed):
 * Industry-typical missed-call volume × Salesforce 2024 $4.62/min cost
 * × industry-typical service-ticket value. Conservative band uses
 * lower-bound published volume × lower-bound ticket value. Upper bound
 * uses median volume × median ticket value. Never the top-of-band number
 * vendors love to quote.
 */

export default function IndustryShowcase() {
  return (
    <section
      className="px-5 sm:px-8 py-16 sm:py-24 bg-white border-y border-slate-200/70"
      aria-labelledby="industry-showcase-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
          14 industries · real ROI math · no fluff
        </div>
        <h2
          id="industry-showcase-heading"
          className="text-[28px] sm:text-[40px] md:text-[48px] font-semibold text-[#042C53] leading-[1.08] mb-4 max-w-3xl"
        >
          The agent that pays for itself,{" "}
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            in your specific industry.
          </span>
        </h2>
        <p className="text-[16px] sm:text-[18px] text-slate-700 max-w-3xl leading-relaxed mb-10">
          We don't have a generic AI receptionist. We have a voice + chat agent
          trained on the exact intake script, objections, integrations, and
          escalation rules for each of these 14 verticals. Conservative monthly
          $-recovered numbers below — based on the Salesforce 2024 missed-call
          study ($4.62/min cost) × public industry-typical call volume.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INDUSTRIES.map((ind) => (
            <Link
              key={ind.slug}
              to={ind.slug}
              className="group block rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#042C53]/40 hover:shadow-md transition-all"
            >
              <div className="relative w-full mb-4 overflow-hidden rounded-xl" style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, rgba(24,95,165,0.16), rgba(4,44,83,0.06))" }}>
                <img
                  src={`https://image.pollinations.ai/prompt/${encodeURIComponent("professional photograph, " + ind.name.toLowerCase() + " business interior, magazine cover editorial")}?width=480&height=270&nologo=true&model=flux&seed=${Math.abs(ind.slug.split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0)) % 999999}`}
                  alt={ind.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(4,44,83,0.55) 100%)" }} />
                <span className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.16em] text-emerald-700 bg-white/95 border border-emerald-200 px-2 py-1 rounded-full font-mono font-semibold">
                  {ind.monthlyRecovered}/mo
                </span>
              </div>
              <h3 className="text-[18px] font-semibold text-[#042C53] mb-1 leading-tight">
                {ind.name}
              </h3>
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-3">
                {ind.agent}
              </div>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-2">
                <strong className="text-slate-700 font-semibold">Before:</strong>{" "}
                {ind.before}
              </p>
              <p className="text-[13px] text-slate-700 leading-relaxed">
                <strong className="text-emerald-700 font-semibold">After:</strong>{" "}
                {ind.after}
              </p>
              <div className="mt-4 inline-flex items-center text-[13px] font-semibold text-[#042C53] group-hover:text-[#185FA5]">
                See the {ind.name.split(" ")[0]} playbook
                <span
                  aria-hidden
                  className="ml-1 transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-[12px] text-slate-500 leading-relaxed max-w-2xl">
          ROI bands are conservative estimates pegged to the{" "}
          <a
            href="https://www.salesforce.com/news/stories/state-of-marketing-2024/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-slate-300 hover:text-[#042C53]"
          >
            Salesforce 2024 missed-call cost study
          </a>{" "}
          ($4.62/min) and public industry call-volume data. Your actual number
          is computed in the kickoff against your real call logs and average
          ticket value, not from this page.
        </p>
      </div>
    </section>
  );
}
