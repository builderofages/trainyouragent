// src/components/PricingThreeLanes.tsx — v258 (Grok #2 fix)
//
// Grok Heavy: "Collapse to 3 clear recommended paths. Kill the per-min
// complexity for entry tiers; make Operators the default 'most popular'
// with one-click Start Build that pre-fills ROI."
//
// This component is a 3-card summary that sits at the top of /pricing
// BEFORE the existing 5-tier wall. It gives the visitor an immediate
// "you probably want this" recommendation. The existing 5 tiers stay
// (founder explicitly built them) but become "see all options" below.
//
// Brand-pure cream/navy/Playfair. Operators is visually 1.06x scale +
// gold ribbon to anchor the eye.

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const INK = "#0B1B2B";
const MUTED = "#5C6B7F";
const GOLD = "#C99A28";
const HAIRLINE = "rgba(4,44,83,0.10)";
const ITALIC: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 };
const MONO: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.14em" };

type Lane = {
  eyebrow: string;
  name: string;
  italicTail: string;
  price: string;
  priceSub: string;
  bullets: string[];
  cta: { label: string; href: string };
  popular?: boolean;
};

const LANES: Lane[] = [
  {
    eyebrow: "START SMALL",
    name: "Self-Serve",
    italicTail: "you build it.",
    price: "$99",
    priceSub: "per month · no setup fee",
    bullets: [
      "Chat agent only (web + WhatsApp)",
      "Drag-drop builder · ship in a weekend",
      "Cancel anytime · 30-day MBG",
    ],
    cta: { label: "Start the builder →", href: "/saas-agent-builder" },
  },
  {
    eyebrow: "MOST POPULAR",
    name: "Operators",
    italicTail: "we build it for you.",
    price: "$4,950",
    priceSub: "one-time build + $1,997/mo · most pick this",
    bullets: [
      "Full voice + chat agent, your branding",
      "Cal/ServiceTitan/GHL/HubSpot wired",
      "Monthly tuning + ops report",
      "Refund if not shipped on time",
    ],
    cta: { label: "Book the build kickoff →", href: "/apply?tier=operators" },
    popular: true,
  },
  {
    eyebrow: "SCALE / MULTI-SITE",
    name: "Scale",
    italicTail: "we run it.",
    price: "$9,950",
    priceSub: "build + $4,997/mo · multi-location",
    bullets: [
      "Dedicated infra, custom workflows",
      "Multi-line + multi-location routing",
      "Quarterly business review",
      "Private SLA · named on-call engineer",
    ],
    cta: { label: "Talk to a builder →", href: "/apply?tier=scale" },
  },
];

export default function PricingThreeLanes() {
  return (
    <section
      style={{
        padding: "56px 24px",
        background: "linear-gradient(180deg, #FFFFFF 0%, rgba(244,200,76,0.04) 100%)",
        borderBottom: `1px solid ${HAIRLINE}`,
        fontFamily: "'Inter Tight', system-ui, sans-serif",
        color: INK,
      }}
      aria-labelledby="three-lanes-heading"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ ...MONO, fontSize: 11, fontWeight: 700, color: GOLD, marginBottom: 10 }}>
            THREE PATHS · PICK ONE
          </div>
          <h2
            id="three-lanes-heading"
            style={{ fontSize: "clamp(28px, 4vw, 46px)", lineHeight: 1.05, letterSpacing: "-0.018em", fontWeight: 600, color: NAVY, margin: 0 }}
          >
            Which lane{" "}
            <span style={ITALIC}>fits you?</span>
          </h2>
          <p style={{ fontSize: 15, color: MUTED, marginTop: 12, maxWidth: 640, marginLeft: "auto", marginRight: "auto", lineHeight: 1.55 }}>
            Most operators land on the middle lane. The other two are real options — not upsells. Full 5-tier breakdown lives below.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: 18,
            alignItems: "stretch",
          }}
        >
          {LANES.map((lane) => (
            <LaneCard key={lane.name} lane={lane} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <a
            href="#all-tiers"
            style={{
              fontSize: 13.5,
              color: ACCENT,
              fontWeight: 600,
              textDecoration: "none",
              borderBottom: `1px dotted ${ACCENT}`,
              paddingBottom: 2,
            }}
          >
            See all 5 tiers including Founders pay-as-you-go ($0 upfront · $0.39/min) →
          </a>
        </div>
      </div>
    </section>
  );
}

function LaneCard({ lane }: { lane: Lane }) {
  const popular = !!lane.popular;
  return (
    <div
      style={{
        position: "relative",
        padding: "28px 26px 26px",
        borderRadius: 20,
        background: popular ? "linear-gradient(180deg, #FFFFFF 0%, rgba(244,200,76,0.06) 100%)" : "rgba(255,255,255,0.96)",
        border: popular ? `1.5px solid ${GOLD}` : `1px solid ${HAIRLINE}`,
        boxShadow: popular
          ? "0 22px 50px -28px rgba(201,154,40,0.40), 0 12px 28px -22px rgba(4,44,83,0.20)"
          : "0 12px 28px -22px rgba(4,44,83,0.18)",
        transform: popular ? "scale(1.03)" : "scale(1)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minHeight: 380,
      }}
    >
      {popular && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "5px 14px",
            borderRadius: 999,
            background: GOLD,
            color: "#1A1206",
            ...MONO,
            fontSize: 10.5,
            fontWeight: 800,
          }}
        >
          ★ MOST POPULAR
        </div>
      )}

      <div style={{ ...MONO, fontSize: 10.5, fontWeight: 700, color: popular ? GOLD : ACCENT }}>
        {lane.eyebrow}
      </div>

      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1.1 }}>
          {lane.name}{" "}
          <span style={{ ...ITALIC, fontWeight: 500 }}>· {lane.italicTail}</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 38, fontWeight: 800, color: INK, letterSpacing: "-0.025em", lineHeight: 1 }}>
          {lane.price}
        </div>
        <div style={{ marginTop: 6, fontSize: 12.5, color: MUTED, fontWeight: 500 }}>{lane.priceSub}</div>
      </div>

      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {lane.bullets.map((b) => (
          <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.5, color: INK, lineHeight: 1.45 }}>
            <span aria-hidden="true" style={{ color: popular ? GOLD : ACCENT, fontWeight: 800, lineHeight: 1.45 }}>+</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <a
        href={lane.cta.href}
        style={{
          marginTop: 4,
          padding: "13px 18px",
          borderRadius: 999,
          background: popular ? NAVY : "transparent",
          color: popular ? "#FFFFFF" : NAVY,
          border: popular ? "none" : `1.5px solid ${NAVY}`,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
          textAlign: "center",
        }}
      >
        {lane.cta.label}
      </a>
    </div>
  );
}
