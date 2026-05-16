// src/pages/tools/CostEstimator.tsx
// v41 tool (a): cost estimator — pure client math.

import { useMemo, useState } from "react";
import ToolLayout, { NAVY, BLUE, TINT } from "./ToolLayout";
import ToolEmailGate from "./ToolEmailGate";

const AGENT_COST_PER_MIN = 0.18; // our blended infra+margin per call-minute
const PLATFORM_FEE = 499;        // monthly platform on top of usage

export default function CostEstimator() {
  const [calls, setCalls] = useState(1200);
  const [minutes, setMinutes] = useState(4);
  const [costPerCall, setCostPerCall] = useState(7.5);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    const safeCalls = Math.max(0, Number(calls) || 0);
    const safeMin = Math.max(0, Number(minutes) || 0);
    const safeCost = Math.max(0, Number(costPerCall) || 0);
    const currentMonthly = safeCalls * safeCost;
    const agentUsage = safeCalls * safeMin * AGENT_COST_PER_MIN;
    const agentMonthly = agentUsage + PLATFORM_FEE;
    const savings = currentMonthly - agentMonthly;
    const savingsPct = currentMonthly === 0 ? 0 : (savings / currentMonthly) * 100;
    // payback: assume one-time setup of $4,000
    const SETUP = 4000;
    const payback = savings > 0 ? SETUP / savings : Infinity;
    return { currentMonthly, agentMonthly, savings, savingsPct, paybackMonths: payback };
  }, [calls, minutes, costPerCall]);

  return (
    <ToolLayout
      eyebrow="Tool 1 of 5"
      title="What would a 24/7 AI agent cost you"
      italicTail="vs. what you spend today?"
      subtitle="Three numbers in. A real comparison out. No fluff, no fake discount math."
    >
      <form
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
        onSubmit={(e) => { e.preventDefault(); setShowResult(true); }}
        aria-label="Cost estimator inputs"
      >
        <Field label="Monthly call volume" id="calls" value={calls} setValue={setCalls} suffix="calls" />
        <Field label="Avg minutes per call" id="minutes" value={minutes} setValue={setMinutes} suffix="min" />
        <Field label="Current cost per call" id="cpc" value={costPerCall} setValue={setCostPerCall} prefix="$" />
        <div className="sm:col-span-3">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] min-h-[44px]"
          >
            Calculate →
          </button>
        </div>
      </form>

      {showResult && (
        <section className="mt-10" aria-live="polite">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultCard label="Your current spend" value={`$${fmt(result.currentMonthly)}`} sub="per month" />
            <ResultCard label="With AI agent" value={`$${fmt(result.agentMonthly)}`} sub="per month" highlight />
            <ResultCard
              label={result.savings >= 0 ? "Monthly savings" : "Monthly delta"}
              value={`${result.savings >= 0 ? "$" : "−$"}${fmt(Math.abs(result.savings))}`}
              sub={`${result.savingsPct.toFixed(1)}%`}
            />
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 p-5 bg-white">
            <div className="text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1">
              Payback period
            </div>
            <div className="text-[24px] font-semibold" style={{ color: NAVY }}>
              {Number.isFinite(result.paybackMonths)
                ? `${result.paybackMonths.toFixed(1)} months`
                : "—"}
            </div>
            <div className="text-[12px] text-slate-500 mt-1">
              Assumes a one-time $4,000 setup and ${AGENT_COST_PER_MIN.toFixed(2)}/min variable cost plus ${PLATFORM_FEE}/mo platform.
            </div>
          </div>

          <ToolEmailGate
            source="tool:cost-estimator"
            reportName="your cost-comparison PDF"
            payload={{ calls, minutes, costPerCall, result }}
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
      <span className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">
        {label}
      </span>
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

function ResultCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean; }) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        background: highlight ? TINT : "white",
        borderColor: highlight ? BLUE : "#e2e8f0",
      }}
    >
      <div className="text-[11px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1">{label}</div>
      <div className="text-[26px] font-semibold leading-tight" style={{ color: NAVY }}>{value}</div>
      {sub && <div className="text-[12px] text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
