// src/pages/tools/RoiCalculator.tsx
// v41 tool (b): lead-qualification ROI calculator.

import { useMemo, useState } from "react";
import ToolLayout, { NAVY, BLUE, TINT } from "./ToolLayout";
import ToolEmailGate from "./ToolEmailGate";

const TYA_MONTHLY = 5000; // anchor on our $5k/mo plan
const QUAL_LIFT = 0.35;   // assumed extra conversion from instant follow-up

export default function RoiCalculator() {
  const [leads, setLeads] = useState(400);
  const [convPct, setConvPct] = useState(8);
  const [dealSize, setDealSize] = useState(2500);
  const [hours, setHours] = useState(15);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    const monthlyLeads = Math.max(0, leads);
    const baseConv = Math.max(0, convPct) / 100;
    const baseRevenue = monthlyLeads * baseConv * dealSize;
    const liftedRevenue = monthlyLeads * baseConv * (1 + QUAL_LIFT) * dealSize;
    const extra = liftedRevenue - baseRevenue;
    const hoursPerMonth = Math.max(0, hours) * 4.33;
    const HOURLY = 45; // rep cost loaded
    const timeSaved = hoursPerMonth * HOURLY;
    const totalGain = extra + timeSaved;
    const roiMultiple = totalGain / TYA_MONTHLY;
    return { baseRevenue, liftedRevenue, extra, hoursPerMonth, timeSaved, totalGain, roiMultiple };
  }, [leads, convPct, dealSize, hours]);

  return (
    <ToolLayout
      eyebrow="Tool 2 of 5"
      title="What's an AI agent worth"
      italicTail="to your pipeline?"
      subtitle="Four inputs. We model the time you reclaim, the conversion lift from instant follow-up, and the ROI on a $5k/mo plan."
    >
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
        onSubmit={(e) => { e.preventDefault(); setShowResult(true); }}
        aria-label="ROI inputs"
      >
        <Field id="leads"     label="Monthly inbound leads"   value={leads}    setValue={setLeads} />
        <Field id="conv"      label="Current conversion %"    value={convPct}  setValue={setConvPct} suffix="%" />
        <Field id="deal"      label="Avg deal size"           value={dealSize} setValue={setDealSize} prefix="$" />
        <Field id="hours"     label="Hours/week on qualifying" value={hours}   setValue={setHours} suffix="hrs" />
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] min-h-[44px]"
          >
            Run the numbers →
          </button>
        </div>
      </form>

      {showResult && (
        <section className="mt-10" aria-live="polite">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card label="Extra revenue captured" value={`$${fmt(result.extra)}/mo`} sub={`from ${Math.round(QUAL_LIFT * 100)}% conversion lift`} highlight />
            <Card label="Time reclaimed" value={`$${fmt(result.timeSaved)}/mo`} sub={`${Math.round(result.hoursPerMonth)} hrs · $45/hr loaded`} />
            <Card label="Total monthly gain" value={`$${fmt(result.totalGain)}`} />
          </div>
          <div className="mt-4 rounded-xl border p-5" style={{ background: TINT, borderColor: BLUE }}>
            <div className="text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1">
              ROI on $5k/mo plan
            </div>
            <div className="text-[32px] font-semibold leading-tight" style={{ color: NAVY }}>
              {Number.isFinite(result.roiMultiple) ? `${result.roiMultiple.toFixed(1)}×` : "—"}
            </div>
            <div className="text-[12.5px] text-slate-600 mt-1">
              For every $1 spent on the agent, you'd recover roughly ${Number.isFinite(result.roiMultiple) ? result.roiMultiple.toFixed(2) : "—"} in pipeline + time.
            </div>
          </div>

          <ToolEmailGate
            source="tool:roi-calculator"
            reportName="your ROI breakdown PDF"
            payload={{ leads, convPct, dealSize, hours, result }}
          />
        </section>
      )}
    </ToolLayout>
  );
}

function Field({
  label, id, value, setValue, prefix, suffix,
}: {
  label: string; id: string; value: number;
  setValue: (n: number) => void; prefix?: string; suffix?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">{label}</span>
      <div className="flex items-center rounded-lg border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-[#185FA5]">
        {prefix && <span className="pl-3 text-slate-500 text-[14px]">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          aria-label={label}
          className="flex-1 px-3 py-3 bg-transparent outline-none text-[15px] min-h-[44px]"
        />
        {suffix && <span className="pr-3 text-slate-500 text-[13px]">{suffix}</span>}
      </div>
    </label>
  );
}

function Card({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: highlight ? TINT : "white", borderColor: highlight ? BLUE : "#e2e8f0" }}
    >
      <div className="text-[11px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1">{label}</div>
      <div className="text-[22px] font-semibold" style={{ color: NAVY }}>{value}</div>
      {sub && <div className="text-[12px] text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
