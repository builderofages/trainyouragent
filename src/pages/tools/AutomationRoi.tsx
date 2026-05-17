// src/pages/tools/AutomationRoi.tsx
// v44 tool: automation ROI calculator with hand-coded SVG bar chart + PDF gate.

import { useMemo, useState } from "react";
import ToolLayout, { NAVY, BLUE, TINT } from "./ToolLayout";
import ToolEmailGate from "./ToolEmailGate";

const TYA_PLAN_MONTHLY = 5000; // $5K/mo subscription assumption
const HOURS_PER_YEAR_FTE = 2080;

export default function AutomationRoi() {
  const [employees, setEmployees] = useState(8);
  const [salary, setSalary] = useState(72000);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [autoPct, setAutoPct] = useState(60);
  const [shown, setShown] = useState(false);

  const result = useMemo(() => {
    const safeEmp = Math.max(0, Number(employees) || 0);
    const safeSal = Math.max(0, Number(salary) || 0);
    const safeHrs = Math.max(0, Number(hoursPerWeek) || 0);
    const safePct = Math.min(100, Math.max(0, Number(autoPct) || 0));

    const hourlyRate = safeSal / HOURS_PER_YEAR_FTE;
    const weeklyHoursSaved = safeEmp * safeHrs * (safePct / 100);
    const monthlyHoursSaved = weeklyHoursSaved * 4.33;
    const monthlySavings = monthlyHoursSaved * hourlyRate;
    const annualSavings = monthlySavings * 12;
    const tyaAnnualCost = TYA_PLAN_MONTHLY * 12;
    const netAnnualYear1 = annualSavings - tyaAnnualCost;
    const threeYearNet = netAnnualYear1 * 3;
    const roiPct = tyaAnnualCost === 0 ? 0 : Math.round((netAnnualYear1 / tyaAnnualCost) * 100);

    // 12-month savings curve (ramp from 30% in month 1 to 100% by month 4)
    const series: { month: number; savings: number }[] = [];
    for (let i = 1; i <= 12; i++) {
      const rampPct = i === 1 ? 0.3 : i === 2 ? 0.6 : i === 3 ? 0.85 : 1;
      series.push({ month: i, savings: monthlySavings * rampPct });
    }

    return {
      hourlyRate,
      monthlyHoursSaved,
      monthlySavings,
      annualSavings,
      tyaAnnualCost,
      netAnnualYear1,
      threeYearNet,
      roiPct,
      series,
    };
  }, [employees, salary, hoursPerWeek, autoPct]);

  return (
    <ToolLayout
      eyebrow="Tool · Automation ROI"
      title="The dollar value of automating the work"
      italicTail="nobody wants to do."
      subtitle="Four inputs in. A year-1 ROI, a 3-year projection, and a month-by-month savings chart you can take to your CFO."
    >
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
        onSubmit={(e) => { e.preventDefault(); setShown(true); }}
        aria-label="Automation ROI inputs"
      >
        <Field label="Employees doing this work" id="emp" value={employees} setValue={setEmployees} suffix="people" />
        <Field label="Avg salary per employee" id="sal" value={salary} setValue={setSalary} prefix="$" suffix="/ yr" />
        <Field label="Hours / week per employee on this task" id="hrs" value={hoursPerWeek} setValue={setHoursPerWeek} suffix="hrs" />
        <Field label="Projected automation %" id="auto" value={autoPct} setValue={setAutoPct} suffix="%" />
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] min-h-[44px]"
          >
            Calculate ROI →
          </button>
        </div>
      </form>

      {shown && (
        <section className="mt-10" aria-live="polite">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultCard label="Monthly hours saved" value={fmtNum(result.monthlyHoursSaved)} sub="hrs / month" />
            <ResultCard label="Annual labor savings" value={`$${fmtNum(result.annualSavings)}`} sub="yr 1 at steady state" highlight />
            <ResultCard label="Year-1 net" value={`${result.netAnnualYear1 >= 0 ? "" : "−"}$${fmtNum(Math.abs(result.netAnnualYear1))}`} sub={`after $${fmtNum(result.tyaAnnualCost)} TYA cost`} />
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 p-5 bg-white">
            <div className="text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1">
              3-year ROI
            </div>
            <div className="text-[28px] font-semibold" style={{ color: NAVY }}>
              {result.roiPct}% · ${fmtNum(result.threeYearNet)} net
            </div>
            <div className="text-[12px] text-slate-500 mt-1">
              Assumes the {TYA_PLAN_MONTHLY.toLocaleString()}/mo TYA plan, sustained for three years, with month-1 ramp.
            </div>
          </div>

          {/* Chart */}
          <div className="mt-6 rounded-xl border border-slate-200 p-5 bg-white">
            <div className="text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-3">
              Monthly savings — first 12 months
            </div>
            <SavingsChart series={result.series} />
            <details className="mt-3">
              <summary className="text-[12.5px] text-slate-500 cursor-pointer hover:text-slate-700">
                View as table
              </summary>
              <table className="mt-2 text-[12.5px] w-full">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-1">Month</th>
                    <th className="py-1">Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {result.series.map((s) => (
                    <tr key={s.month}>
                      <td className="py-1">Month {s.month}</td>
                      <td className="py-1">${fmtNum(s.savings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </div>

          {/* PDF gate */}
          <div className="mt-8">
            <ToolEmailGate
              source="tool:automation-roi"
              reportName="your Automation ROI report (PDF)"
              payload={{
                employees, salary, hoursPerWeek, autoPct,
                roiPct: result.roiPct,
                annualSavings: Math.round(result.annualSavings),
              }}
            />
            <div className="mt-2 text-[12px] text-slate-500">
              We'll email a personalized PDF you can forward to your CFO.
              <a
                href={`/api/automation-roi-pdf?employees=${employees}&salary=${salary}&hours=${hoursPerWeek}&auto=${autoPct}`}
                className="ml-2 text-[#185FA5] font-medium hover:underline"
                target="_blank"
                rel="noopener"
              >
                Or download instantly →
              </a>
            </div>
          </div>
        </section>
      )}
    </ToolLayout>
  );
}

// ─────────────────────────── helpers ───────────────────────────

function fmtNum(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function Field({
  label, id, value, setValue, prefix, suffix,
}: {
  label: string; id: string;
  value: number; setValue: (n: number) => void;
  prefix?: string; suffix?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">
        {label}
      </label>
      <div className="flex items-center rounded-lg border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-[#185FA5]">
        {prefix && <span className="pl-3 text-[14px] text-slate-500">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          className="flex-1 px-3 py-3 bg-transparent text-[15px] min-h-[44px] focus:outline-none"
        />
        {suffix && <span className="pr-3 text-[13px] text-slate-500">{suffix}</span>}
      </div>
    </div>
  );
}

function ResultCard({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-5 ${highlight ? "text-white" : "border border-slate-200 bg-white"}`}
      style={highlight ? { background: NAVY } : undefined}>
      <div className={`text-[11px] uppercase tracking-[0.12em] font-semibold ${highlight ? "text-[#9BC3E8]" : "text-slate-500"}`}>
        {label}
      </div>
      <div className={`text-[24px] font-semibold mt-1 ${highlight ? "text-white" : ""}`} style={!highlight ? { color: NAVY } : undefined}>
        {value}
      </div>
      <div className={`text-[12px] mt-0.5 ${highlight ? "text-white/70" : "text-slate-500"}`}>{sub}</div>
    </div>
  );
}

function SavingsChart({ series }: { series: { month: number; savings: number }[] }) {
  const W = 600;
  const H = 200;
  const padL = 40;
  const padB = 28;
  const padT = 10;
  const padR = 10;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.max(1, ...series.map((s) => s.savings));
  const barW = innerW / series.length - 6;
  const totalMonthly = series[series.length - 1]?.savings ?? 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label={`Bar chart of 12 months of automation savings, peaking at $${fmtNum(totalMonthly)} per month`}
    >
      <title>12-month projected monthly savings</title>
      {/* y-axis label */}
      <text x="6" y={padT + 10} fontSize="10" fill="#5C6B82">$</text>
      <text x="6" y={padT + innerH} fontSize="10" fill="#5C6B82">0</text>
      <text x="6" y={padT + 10 + 14} fontSize="10" fill="#5C6B82">{fmtNum(max)}</text>

      {/* baseline */}
      <line x1={padL} y1={padT + innerH} x2={padL + innerW} y2={padT + innerH} stroke="#E2E8F0" strokeWidth="1" />

      {series.map((s, i) => {
        const h = (s.savings / max) * innerH;
        const x = padL + i * (innerW / series.length) + 3;
        const y = padT + innerH - h;
        return (
          <g key={s.month}>
            <rect x={x} y={y} width={barW} height={h} rx="3" fill={BLUE} opacity={0.85} />
            <text x={x + barW / 2} y={padT + innerH + 14} fontSize="10" fill="#5C6B82" textAnchor="middle">
              M{s.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
