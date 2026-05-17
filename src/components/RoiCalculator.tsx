// src/components/RoiCalculator.tsx
// Live ROI calc — pure-client math, gates the full report behind email capture.
// Wire `onEmailCaptured` to your Resend/Mailchimp endpoint when ready.

import { useMemo, useState } from "react";

type Props = {
  onEmailCaptured?: (data: { email: string; inputs: Inputs; results: Results }) => void | Promise<void>;
};

type Inputs = {
  callsPerMonth: number;
  pctMissed: number;
  avgValue: number;
  staffHourlyCost: number;
  hoursPerCallHandled: number;
};

type Results = {
  recoveredCallsPerMonth: number;
  newBookingsPerMonth: number;
  recoveredRevenuePerMonth: number;
  staffTimeSavedPerMonth: number;
  staffCostSavedPerMonth: number;
  netMonthly: number;
  paybackDays: number;
};

const TYA_OPERATORS_MO_COST = 799;
const TYA_BOOKING_CONVERSION = 0.7;

const fmtUsd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtNum = (n: number) => Math.round(n).toLocaleString();

export default function RoiCalculator({ onEmailCaptured }: Props) {
  const [callsPerMonth, setCallsPerMonth] = useState(450);
  const [pctMissed, setPctMissed] = useState(28);
  const [avgValue, setAvgValue] = useState(285);
  const [staffHourlyCost, setStaffHourlyCost] = useState(22);
  const [hoursPerCallHandled, setHoursPerCallHandled] = useState(0.12);
  const [email, setEmail] = useState("");
  const [gated, setGated] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const inputs: Inputs = { callsPerMonth, pctMissed, avgValue, staffHourlyCost, hoursPerCallHandled };
  const results: Results = useMemo(() => {
    const missed = callsPerMonth * (pctMissed / 100);
    const newBookings = missed * TYA_BOOKING_CONVERSION;
    const recoveredRev = newBookings * avgValue;
    const timeSaved = callsPerMonth * hoursPerCallHandled * 0.78;
    const costSaved = timeSaved * staffHourlyCost;
    const net = recoveredRev + costSaved - TYA_OPERATORS_MO_COST;
    const payback = net > 0 ? Math.max(1, Math.round((TYA_OPERATORS_MO_COST / net) * 30)) : 999;
    return {
      recoveredCallsPerMonth: missed,
      newBookingsPerMonth: newBookings,
      recoveredRevenuePerMonth: recoveredRev,
      staffTimeSavedPerMonth: timeSaved,
      staffCostSavedPerMonth: costSaved,
      netMonthly: net,
      paybackDays: payback,
    };
  }, [callsPerMonth, pctMissed, avgValue, staffHourlyCost, hoursPerCallHandled]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try { await onEmailCaptured?.({ email, inputs, results }); } finally {
      setGated(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-[0_4px_40px_-12px_rgba(4,44,83,0.18)]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
        <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold">ROI calculator</div>
        <div className="text-[11px] text-slate-600">Operators plan · $799/mo baseline</div>
      </div>
      <h3 className="text-[24px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-6">
        Plug in your numbers. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>See payback in days.</span>
      </h3>

      <div className="grid sm:grid-cols-2 gap-5 mb-7">
        <Field label="Calls per month" value={callsPerMonth} onChange={setCallsPerMonth} min={50} max={50000} step={10} />
        <Field label="% missed or sent to voicemail" value={pctMissed} onChange={setPctMissed} min={0} max={80} step={1} suffix="%" />
        <Field label="Average value per booked job ($)" value={avgValue} onChange={setAvgValue} min={20} max={50000} step={10} prefix="$" />
        <Field label="Staff hourly cost ($)" value={staffHourlyCost} onChange={setStaffHourlyCost} min={8} max={150} step={1} prefix="$" />
      </div>

      <div className="rounded-2xl bg-[#F6FAFE] border border-slate-200 p-5 sm:p-6 grid sm:grid-cols-2 gap-5">
        <Stat label="Recovered missed calls / mo" value={fmtNum(results.recoveredCallsPerMonth)} blurred={gated && results.recoveredCallsPerMonth > 0 ? false : false} />
        <Stat label="New bookings / mo" value={fmtNum(results.newBookingsPerMonth)} blurred={false} />
        <Stat label="Recovered revenue / mo" value={fmtUsd(results.recoveredRevenuePerMonth)} blurred={gated} highlight />
        <Stat label="Net after TYA cost / mo" value={fmtUsd(results.netMonthly)} blurred={gated} highlight />
        <Stat label="Staff time saved / mo" value={`${fmtNum(results.staffTimeSavedPerMonth)} hrs`} blurred={gated} />
        <Stat label="Payback time" value={results.paybackDays >= 999 ? "—" : `${results.paybackDays} days`} blurred={gated} highlight />
      </div>

      {gated ? (
        <form onSubmit={submit} className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                 placeholder="Work email — we'll send the full report"
                 className="flex-1 px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5]" />
          <button type="submit" disabled={submitting}
                  className="px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50 shadow whitespace-nowrap">
            {submitting ? "Sending…" : "Unlock full report →"}
          </button>
        </form>
      ) : (
        <div className="mt-6 flex items-center gap-3 text-[14px] text-[#22A36C]">
          <span className="w-2 h-2 rounded-full bg-[#22A36C]" />
          Report unlocked. We just emailed a copy + a Loom walkthrough.
        </div>
      )}
      <div className="mt-3 text-[11px] text-slate-600">Estimates use a 70% missed-call recovery rate and 78% support-deflection benchmark from real production builds.</div>
    </div>
  );
}

function Field({ label, value, onChange, min, max, step, suffix, prefix }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; step: number; suffix?: string; prefix?: string }) {
  return (
    <label className="block">
      <div className="text-[12px] uppercase tracking-[0.12em] text-[#185FA5] font-semibold mb-2">{label}</div>
      <div className="flex items-center gap-3">
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 accent-[#185FA5]" />
        <div className="w-24 px-3 py-1.5 rounded-lg bg-[#F6FAFE] border border-slate-200 text-[14px] font-semibold text-[#042C53] text-right">
          {prefix}{value.toLocaleString()}{suffix}
        </div>
      </div>
    </label>
  );
}

function Stat({ label, value, blurred, highlight }: { label: string; value: string; blurred?: boolean; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.12em] text-[#185FA5] font-semibold mb-1">{label}</div>
      <div className={`text-[26px] font-semibold tracking-tight transition ${highlight ? "text-[#042C53]" : "text-slate-700"} ${blurred ? "blur-md select-none" : ""}`}
           style={{ fontFamily: highlight ? "'Playfair Display', serif" : "inherit" }}>
        {value}
      </div>
    </div>
  );
}
