// src/components/RoiInline.tsx
// v63: Embedded ROI calculator on /pricing — inputs (employees, hours/week,
// salary) -> instant annual savings + payback period + a specific plan
// recommendation tied to the math. Extracted from /tools/automation-roi.
//
// Grok Heavy audit asked: "Add ROI calculator to /pricing (new component
// using existing automation-roi-pdf logic)."

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const HOURS_PER_YEAR_FTE = 2080;

// Plan monthly costs used for payback math. Numbers track the published
// /pricing PLANS array (Founders pay-as-you-go modeled at ~$300/mo of voice
// usage, Operators at $799/mo + $4950 build amortized, Scale at $5000/mo).
const PLAN_COSTS = {
  founders: { monthly: 300,  upfront: 0,    label: "Founders" },
  operators:{ monthly: 799,  upfront: 4950, label: "Operators" },
  scale:    { monthly: 5000, upfront: 0,    label: "Scale" },
} as const;
type PlanKey = keyof typeof PLAN_COSTS;

const fmtNum = (n: number) => Math.round(n).toLocaleString();
const fmtUsd = (n: number) => `$${fmtNum(Math.max(0, n))}`;

export default function RoiInline() {
  const [employees, setEmployees] = useState(6);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [salary, setSalary] = useState(64000);
  const [autoPct, setAutoPct] = useState(65);

  const result = useMemo(() => {
    const safeEmp = Math.max(0, Number(employees) || 0);
    const safeHrs = Math.max(0, Number(hoursPerWeek) || 0);
    const safeSal = Math.max(0, Number(salary) || 0);
    const safePct = Math.min(100, Math.max(0, Number(autoPct) || 0));

    const hourlyRate = safeSal / HOURS_PER_YEAR_FTE;
    const weeklyHoursSaved = safeEmp * safeHrs * (safePct / 100);
    const monthlyHoursSaved = weeklyHoursSaved * 4.33;
    const monthlySavings = monthlyHoursSaved * hourlyRate;
    const annualSavings = monthlySavings * 12;

    // For each plan, payback in days = (upfront + 1 mo cost) / (daily savings)
    const dailySavings = annualSavings / 365;
    const payback: Record<PlanKey, number> = {
      founders: 0, operators: 0, scale: 0,
    };
    (Object.keys(PLAN_COSTS) as PlanKey[]).forEach((k) => {
      const p = PLAN_COSTS[k];
      const firstYear = p.upfront + p.monthly * 12;
      payback[k] = dailySavings > 0
        ? Math.max(1, Math.round(firstYear / dailySavings))
        : 999;
    });

    // Recommendation heuristic:
    //   - tiny team (<=2 employees) OR weekly hours < 5 -> Founders (low volume, pay-as-you-go)
    //   - very large team (>=15 employees) OR hours/week >=30 -> Scale
    //   - everything else -> Operators (the bulk of customers)
    let plan: PlanKey = "operators";
    if (safeEmp <= 2 || safeHrs < 5) plan = "founders";
    else if (safeEmp >= 15 || safeHrs >= 30) plan = "scale";

    return {
      monthlyHoursSaved, monthlySavings, annualSavings,
      payback, plan,
    };
  }, [employees, hoursPerWeek, salary, autoPct]);

  const rec = PLAN_COSTS[result.plan];
  const recPayback = result.payback[result.plan];

  return (
    <div
      className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-[0_4px_40px_-12px_rgba(4,44,83,0.18)]"
      style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}
    >
      <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
        <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold">
          ROI calculator · plan recommender
        </div>
        <div className="text-[11px] text-slate-600">Updates live as you type</div>
      </div>
      <h3 className="text-[24px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-6">
        Your numbers in.{" "}
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
          A recommended plan out.
        </span>
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <Field label="Employees doing this work" value={employees} setValue={setEmployees} suffix="people" min={1} max={500} />
        <Field label="Hours / wk per person on it" value={hoursPerWeek} setValue={setHoursPerWeek} suffix="hrs" min={1} max={40} />
        <Field label="Avg salary per employee" value={salary} setValue={setSalary} prefix="$" suffix="/yr" min={20000} max={300000} step={1000} />
        <Field label="Realistic automation %" value={autoPct} setValue={setAutoPct} suffix="%" min={10} max={95} />
      </div>

      <div className="rounded-2xl bg-[#F6FAFE] border border-slate-200 p-5 sm:p-6 grid sm:grid-cols-3 gap-5">
        <Stat label="Monthly hours saved" value={`${fmtNum(result.monthlyHoursSaved)} hrs`} />
        <Stat label="Monthly $ saved" value={fmtUsd(result.monthlySavings)} />
        <Stat label="Annual $ saved" value={fmtUsd(result.annualSavings)} highlight />
      </div>

      {/* Recommendation card */}
      <div className="mt-6 rounded-2xl bg-[#042C53] text-white p-6 sm:p-7 shadow-[0_20px_60px_-20px_rgba(4,44,83,0.4)]">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold">
            Plan recommendation
          </div>
          <div className="text-[11px] text-white/60">
            Based on your inputs above
          </div>
        </div>
        <h4 className="text-[22px] sm:text-[28px] leading-tight font-semibold mb-2">
          {result.annualSavings > 0 ? (
            <>
              Based on your numbers, the{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                {rec.label}
              </span>{" "}
              plan pays for itself in{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                {recPayback >= 999 ? "—" : `${recPayback} days`}
              </span>.
            </>
          ) : (
            <>Increase the inputs to see a recommendation.</>
          )}
        </h4>
        <p className="text-[14px] text-white/85 leading-relaxed mb-5 max-w-2xl">
          {result.plan === "founders" && "You're early or low-volume — Founders lane is pay-as-you-go with $0 upfront. Build the agent now, pay only when calls come in."}
          {result.plan === "operators" && "You're past the messy early stage. Operators is the bulk of our customers: $4,950 build + $799/mo, 4,000 minutes included, live in 21 days."}
          {result.plan === "scale" && "Multi-location, multi-brand, or high volume. Scale is custom-scoped on a 30-min architecture call — dedicated engineer, SLA, BAA/DPA included."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/pricing#${result.plan}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#042C53] text-[14px] font-semibold hover:bg-slate-100"
          >
            See the {rec.label} lane &rarr;
          </Link>
          <Link
            to={`/book?utm_source=pricing-roi&utm_campaign=${result.plan}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-[14px] font-semibold hover:bg-white/15"
          >
            Book a 30-min build call &rarr;
          </Link>
        </div>
      </div>

      <p className="mt-4 text-[11.5px] text-slate-500 leading-relaxed">
        Estimates use $/hr = salary ÷ 2,080. Payback assumes upfront + 12 months of plan cost vs. daily labor savings. Numbers track the plans published above. We can model a tighter scenario on a 30-min call.
      </p>
    </div>
  );
}

function Field({
  label, value, setValue, prefix, suffix, min, max, step,
}: {
  label: string; value: number; setValue: (n: number) => void;
  prefix?: string; suffix?: string; min?: number; max?: number; step?: number;
}) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-[0.12em] text-[#185FA5] font-semibold mb-1.5">
        {label}
      </div>
      <div className="flex items-center rounded-lg border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-[#185FA5]">
        {prefix && <span className="pl-3 text-[14px] text-slate-500">{prefix}</span>}
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step ?? 1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          className="flex-1 px-3 py-2.5 bg-transparent text-[15px] min-h-[40px] focus:outline-none w-full"
        />
        {suffix && <span className="pr-3 text-[13px] text-slate-500">{suffix}</span>}
      </div>
    </label>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.12em] text-[#185FA5] font-semibold mb-1">{label}</div>
      <div
        className={`text-[24px] sm:text-[28px] font-semibold tracking-tight ${highlight ? "text-[#042C53]" : "text-slate-700"}`}
        style={{ fontFamily: highlight ? "'Playfair Display', serif" : "inherit" }}
      >
        {value}
      </div>
    </div>
  );
}
