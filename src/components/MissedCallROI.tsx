// src/components/MissedCallROI.tsx
// v89: interactive "how much are you losing to missed calls?" calculator.
// Highest-converting asset for HVAC / dental / legal / roofing vertical
// landing pages. Visitor moves sliders → real-time dollar number → CTA.
//
// All math runs client-side, no API. Inputs persisted in component state
// only — no PII captured unless they click the CTA.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export type MissedCallROIProps = {
  /** Vertical-specific defaults so HVAC sees HVAC math, dental sees dental math. */
  vertical?: "hvac" | "roofing" | "dental" | "legal" | "real-estate" | "plumbing" | "default";
  className?: string;
};

type Defaults = {
  label: string;
  avgTicket: number;        // average $ value of a customer who books
  closeRate: number;        // % of inbound calls that become customers if answered
  weeklyMissedCalls: number;
};

const PRESETS: Record<NonNullable<MissedCallROIProps["vertical"]>, Defaults> = {
  hvac:         { label: "HVAC",            avgTicket: 850,  closeRate: 0.45, weeklyMissedCalls: 18 },
  roofing:      { label: "Roofing",         avgTicket: 9500, closeRate: 0.20, weeklyMissedCalls: 12 },
  dental:       { label: "Dental",          avgTicket: 1200, closeRate: 0.65, weeklyMissedCalls: 14 },
  legal:        { label: "Law Firm",        avgTicket: 4500, closeRate: 0.30, weeklyMissedCalls: 9  },
  "real-estate":{ label: "Real Estate",     avgTicket: 8500, closeRate: 0.15, weeklyMissedCalls: 22 },
  plumbing:     { label: "Plumbing",        avgTicket: 650,  closeRate: 0.50, weeklyMissedCalls: 16 },
  default:      { label: "Service Business",avgTicket: 1500, closeRate: 0.35, weeklyMissedCalls: 15 },
};

const TYA_CAPTURE_RATE = 0.75;  // realistic capture rate of an AI agent on previously-missed calls
const TYA_MONTHLY_COST = 1997;  // Operators tier post-v87

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000)    return `$${Math.round(n / 1000).toLocaleString()}K`;
  if (n >= 1000)      return `$${(n / 1000).toFixed(1)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

export default function MissedCallROI({ vertical = "default", className = "" }: MissedCallROIProps) {
  const preset = PRESETS[vertical];
  const [missedPerWeek, setMissedPerWeek] = useState(preset.weeklyMissedCalls);
  const [avgTicket, setAvgTicket]         = useState(preset.avgTicket);
  const [closeRate, setCloseRate]         = useState(Math.round(preset.closeRate * 100));

  // The math, exposed.
  const calc = useMemo(() => {
    const annualMissed   = missedPerWeek * 52;
    const captured       = Math.round(annualMissed * TYA_CAPTURE_RATE);
    const convertedJobs  = Math.round(captured * (closeRate / 100));
    const revenueRecovered = convertedJobs * avgTicket;
    const tyaCost        = TYA_MONTHLY_COST * 12;
    const netGain        = revenueRecovered - tyaCost;
    const roiX           = tyaCost > 0 ? (revenueRecovered / tyaCost) : 0;
    return { annualMissed, captured, convertedJobs, revenueRecovered, tyaCost, netGain, roiX };
  }, [missedPerWeek, avgTicket, closeRate]);

  return (
    <section
      className={`px-5 sm:px-8 py-14 sm:py-16 bg-[#F6FAFE] border-y border-slate-200/70 ${className}`}
      aria-label="Missed call ROI calculator"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold font-mono mb-3">
          Run the math · 30 seconds
        </div>
        <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#042C53] leading-tight mb-3">
          How much is your{" "}
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
            {/* v94: don't append "business" when label already contains it
                (e.g. "Service Business business" duplication, or wrong-vertical
                "Service Business" on /healthcare). Use vertical-specific noun. */}
            {preset.label.toLowerCase().includes("business")
              ? preset.label.toLowerCase()
              : preset.label.toLowerCase() === "law firm"
                ? "law firm"
                : preset.label.toLowerCase() === "real estate"
                  ? "real estate business"
                  : `${preset.label.toLowerCase()} business`}
          </span>{" "}
          losing to missed calls?
        </h2>
        <p className="text-[15px] text-slate-700 mb-9 max-w-2xl leading-relaxed">
          Drag the sliders to match your business. The numbers update live. No signup, no email — just the math.
        </p>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10">
          {/* SLIDERS */}
          <div className="space-y-7 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8">
            <Slider
              label="Calls you miss per week"
              hint="After hours, weekends, peak service times. Most operators miss 10-30."
              min={1} max={60} step={1}
              value={missedPerWeek}
              onChange={setMissedPerWeek}
              format={(v) => `${v} calls`}
            />
            <Slider
              label="Average ticket size when one closes"
              hint="What does the average customer who books pay you?"
              min={50} max={20000} step={50}
              value={avgTicket}
              onChange={setAvgTicket}
              format={(v) => `$${v.toLocaleString()}`}
            />
            <Slider
              label="Close rate when a call IS answered"
              hint="Of calls your team answers, what % become paying customers?"
              min={5} max={95} step={5}
              value={closeRate}
              onChange={setCloseRate}
              format={(v) => `${v}%`}
            />
          </div>

          {/* RESULTS */}
          <div className="rounded-2xl bg-[#042C53] text-white p-6 sm:p-8 flex flex-col">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#9CC4EC] font-mono font-semibold mb-2">
              Annual revenue you're leaving on the table
            </div>
            <div className="text-[44px] sm:text-[56px] font-semibold leading-none tabular-nums tracking-tight mb-1">
              {fmtMoney(calc.revenueRecovered)}
            </div>
            <div className="text-[13px] text-[#DCEBFA] mb-6">
              recovered if an AI agent caught {Math.round(TYA_CAPTURE_RATE * 100)}% of your missed calls
            </div>

            <div className="grid grid-cols-2 gap-3 text-[12px] mb-6">
              <Stat n={calc.annualMissed.toLocaleString()}    label="missed calls / yr"      />
              <Stat n={calc.captured.toLocaleString()}        label="captured by agent"      />
              <Stat n={calc.convertedJobs.toLocaleString()}   label="new closed jobs"        />
              <Stat n={fmtMoney(calc.tyaCost)}                label="TrainYourAgent / yr"    />
            </div>

            <div className="mt-auto pt-5 border-t border-white/15">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#9CC4EC] mb-1">Net annual gain</div>
              <div className="text-[28px] sm:text-[32px] font-semibold tabular-nums leading-tight mb-3">
                {fmtMoney(Math.max(0, calc.netGain))}
                <span className="ml-2 text-[14px] font-normal text-[#9CC4EC]">
                  ({calc.roiX.toFixed(1)}× ROI)
                </span>
              </div>
              <Link
                to="/train/intake"
                className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#042C53] font-semibold text-[14px] hover:bg-[#DCEBFA]"
              >
                Capture this revenue → start intake
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-[12px] text-slate-500 leading-relaxed max-w-3xl">
          Math: weekly missed calls × 52 weeks × 75% agent capture rate × your close rate × average ticket = annual revenue recovered. TrainYourAgent cost = Operators tier $1,997/mo × 12. Net gain = recovered − cost. Conservative. Most operators see closer to 85% capture once the agent is tuned to their specific business.
        </p>
      </div>
    </section>
  );
}

function Slider({
  label, hint, min, max, step, value, onChange, format,
}: {
  label: string; hint: string; min: number; max: number; step: number;
  value: number; onChange: (n: number) => void; format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <label className="text-[13px] font-semibold text-[#042C53]">{label}</label>
        <span className="text-[16px] font-semibold text-[#185FA5] tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#185FA5] cursor-pointer"
        aria-label={label}
      />
      <div className="text-[11.5px] text-slate-500 mt-1">{hint}</div>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-lg bg-white/8 px-3 py-2">
      <div className="text-[18px] font-semibold tabular-nums leading-tight">{n}</div>
      <div className="text-[10.5px] text-[#9CC4EC] uppercase tracking-[0.1em] mt-0.5">{label}</div>
    </div>
  );
}
