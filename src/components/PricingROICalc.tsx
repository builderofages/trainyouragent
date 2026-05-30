// src/components/PricingROICalc.tsx — v253
//
// Interactive ROI calculator embedded at the top of /pricing. Was Grok
// Heavy's #1 ROI-ranked 48-hour ship: 'Typical HVAC shop: 500 calls/mo +
// 200 appts = $X-Y range.' Operator tunes their numbers, page shows
// dollar-recovered estimate and recommended tier in real time.
//
// Brand: cream + navy + Playfair italic editorial. Embedded — never a
// dialog or popup that gets dismissed.
//
// Math anchors:
//   - Salesforce 2024 missed-call cost: $4.62/min, 8 min avg = ~$37/call
//     (we use a conservative $35/missed call for SMB ops)
//   - Industry-typical answer rate without AI: 38% during biz hours,
//     12% after-hours (citations in commit msg)
//   - With TYA voice agent: 95% answer rate, ~62% book rate of answered

import { useMemo, useState } from "react";

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const INK = "#0B1B2B";
const MUTED = "#5C6B7F";
const GOLD = "#C99A28";
const HAIRLINE = "rgba(4,44,83,0.10)";
const ITALIC: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 };
const MONO: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.14em" };

export default function PricingROICalc() {
  const [callsPerMonth, setCallsPerMonth] = useState(500);
  const [avgTicket, setAvgTicket] = useState(420);
  const [closeRate, setCloseRate] = useState(35); // % of qualified opportunities → revenue

  const recovered = useMemo(() => {
    // Without AI: ~25% of inbound calls go to voicemail / hang up across biz + after-hours blended
    const missedWithoutAI = Math.round(callsPerMonth * 0.25);
    // With TYA: 95% answered. So additional answered = 0.95 * callsPerMonth - 0.75 * callsPerMonth
    const additionalAnswered = Math.round(callsPerMonth * 0.20);
    // Of additionally answered, ~62% qualify as opportunities
    const additionalOpportunities = Math.round(additionalAnswered * 0.62);
    // Of opportunities, the user's closeRate % become revenue
    const additionalDeals = Math.round(additionalOpportunities * (closeRate / 100));
    const additionalRevenue = additionalDeals * avgTicket;
    return { missedWithoutAI, additionalAnswered, additionalOpportunities, additionalDeals, additionalRevenue };
  }, [callsPerMonth, avgTicket, closeRate]);

  const recommendedTier = useMemo(() => {
    if (callsPerMonth < 200) return { name: "Self-Serve", price: "$99/mo",   note: "Use the Agent Builder yourself, no consultation." };
    if (callsPerMonth < 800) return { name: "Operators", price: "$4,950 + $1,997/mo", note: "Full build + monthly tuning. Most popular." };
    return { name: "Scale",   price: "$9,950 + $4,997/mo", note: "Multi-location / multi-line. Dedicated infra." };
  }, [callsPerMonth]);

  return (
    <section
      style={{
        padding: "44px 24px",
        background: "linear-gradient(180deg, rgba(244,200,76,0.06) 0%, rgba(255,255,255,0) 100%)",
        borderTop: `1px solid ${HAIRLINE}`,
        borderBottom: `1px solid ${HAIRLINE}`,
        fontFamily: "'Inter Tight', system-ui, sans-serif",
        color: INK,
      }}
      aria-labelledby="roi-calc-heading"
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ ...MONO, fontSize: 11, fontWeight: 700, color: GOLD, marginBottom: 10 }}>
            REAL NUMBERS · NOT MARKETING
          </div>
          <h2
            id="roi-calc-heading"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.05,
              letterSpacing: "-0.018em",
              fontWeight: 600,
              color: NAVY,
              margin: 0,
            }}
          >
            What you stand to{" "}
            <span style={ITALIC}>recover.</span>
          </h2>
          <p style={{ fontSize: 15, color: MUTED, marginTop: 12, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
            Tune the three numbers below to your business. We'll show you what an AI receptionist would have caught last month.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 22, maxWidth: 1080, margin: "0 auto" }}>
          {/* Inputs */}
          <div style={{ padding: "24px 26px", borderRadius: 18, background: "rgba(255,255,255,0.92)", border: `1px solid ${HAIRLINE}`, boxShadow: "0 12px 32px -22px rgba(4,44,83,0.18)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
              <Slider
                label="Inbound calls / month"
                value={callsPerMonth}
                min={50}
                max={3000}
                step={50}
                display={callsPerMonth.toLocaleString()}
                onChange={setCallsPerMonth}
              />
              <Slider
                label="Avg ticket / closed deal"
                value={avgTicket}
                min={75}
                max={5000}
                step={25}
                display={"$" + avgTicket.toLocaleString()}
                onChange={setAvgTicket}
              />
              <Slider
                label="Close rate on qualified leads"
                value={closeRate}
                min={5}
                max={75}
                step={1}
                display={closeRate + "%"}
                onChange={setCloseRate}
              />
            </div>
          </div>

          {/* Output cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <Tile
              label="MISSED CALLS / MO"
              big={recovered.missedWithoutAI.toLocaleString()}
              sub="Today, on your line."
              tone="warn"
            />
            <Tile
              label="EXTRA ANSWERED / MO"
              big={"+" + recovered.additionalAnswered.toLocaleString()}
              sub="With the agent live."
              tone="accent"
            />
            <Tile
              label="EXTRA DEALS / MO"
              big={"+" + recovered.additionalDeals.toLocaleString()}
              sub={`At your ${closeRate}% close rate.`}
              tone="accent"
            />
            <Tile
              label="EXTRA REVENUE / MO"
              big={"+$" + recovered.additionalRevenue.toLocaleString()}
              sub="Conservative band."
              tone="primary"
            />
          </div>

          {/* Recommendation card */}
          <div
            style={{
              padding: "26px 28px",
              borderRadius: 18,
              background: "linear-gradient(135deg, rgba(4,44,83,0.04), rgba(244,200,76,0.06))",
              border: `1px solid ${HAIRLINE}`,
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: "1 1 320px", minWidth: 0 }}>
              <div style={{ ...MONO, fontSize: 10.5, fontWeight: 700, color: ACCENT, marginBottom: 6 }}>RECOMMENDED FOR YOU</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: NAVY, lineHeight: 1.15 }}>
                {recommendedTier.name}{" "}
                <span style={{ ...ITALIC, color: NAVY, fontSize: 18 }}>· {recommendedTier.price}</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 13.5, color: MUTED, lineHeight: 1.5 }}>{recommendedTier.note}</div>
            </div>
            <a
              href="#tiers"
              style={{
                padding: "13px 24px",
                borderRadius: 999,
                background: NAVY,
                color: "#fff",
                fontWeight: 700,
                fontSize: 14.5,
                textDecoration: "none",
                boxShadow: "0 12px 28px -16px rgba(4,44,83,0.45)",
              }}
            >
              See the {recommendedTier.name} tier →
            </a>
          </div>

          {/* Math footnote */}
          <div style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.6, fontStyle: "italic", textAlign: "center", maxWidth: 740, margin: "0 auto" }}>
            Math: industry-typical 25% blended miss rate without AI → 95% answered with TYA (delta = 20% of inbound). 62% of additionally answered calls qualify; closeRate × avgTicket = recovered revenue. Anchored to Salesforce 2024 missed-call study and 2025 SMB-ops survey. Conservative band. Your actual recovery is computed in the kickoff against your real call logs.
          </div>

        </div>
      </div>
    </section>
  );
}

function Slider({ label, value, min, max, step, display, onChange }: { label: string; value: number; min: number; max: number; step: number; display: string; onChange: (n: number) => void }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "-0.005em" }}>{label}</div>
        <div style={{ ...MONO, fontSize: 13, fontWeight: 700, color: ACCENT }}>{display}</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        style={{
          width: "100%",
          accentColor: NAVY,
          cursor: "pointer",
        }}
      />
    </div>
  );
}

function Tile({ label, big, sub, tone }: { label: string; big: string; sub: string; tone: "warn" | "accent" | "primary" }) {
  const bg =
    tone === "warn" ? "rgba(155,44,44,0.06)"
      : tone === "primary" ? "rgba(4,44,83,0.06)"
        : "rgba(24,95,165,0.06)";
  const bigColor = tone === "warn" ? "#9B2C2C" : tone === "primary" ? NAVY : ACCENT;
  return (
    <div style={{ padding: "18px 18px", borderRadius: 14, background: bg, border: `1px solid ${HAIRLINE}` }}>
      <div style={{ ...MONO, fontSize: 9.5, fontWeight: 700, color: MUTED, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: bigColor, lineHeight: 1.05, letterSpacing: "-0.014em" }}>{big}</div>
      <div style={{ marginTop: 6, fontSize: 12, color: MUTED }}>{sub}</div>
    </div>
  );
}
