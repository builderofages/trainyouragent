// src/pages/portal/Analytics.tsx
// v76-a: 30-day Recharts line charts for calls, bookings, conversion, transfers.
// Pre-launch: shows the chart shell with an empty "no data yet" overlay so the
// page feels real without lying about numbers.

import { useOutletContext } from "react-router-dom";
import type { Customer } from "@/lib/portal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const NAVY = "#042C53";

type Ctx = { customer: Customer | null; email: string };

const CHARTS = [
  { key: "calls", title: "Calls answered", suffix: "" },
  { key: "bookings", title: "Appointments booked", suffix: "" },
  { key: "conversion", title: "Conversion rate", suffix: "%" },
  { key: "transfers", title: "Hot transfers", suffix: "" },
];

function emptySeries() {
  const out: { day: string; value: number }[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push({ day: `${d.getMonth() + 1}/${d.getDate()}`, value: 0 });
  }
  return out;
}

export default function PortalAnalytics() {
  const { customer } = useOutletContext<Ctx>();
  const isLive = customer?.agent_status === "production";
  const series = emptySeries();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[26px] leading-tight tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
          Analytics
        </h1>
        <p className="mt-2 text-[14px]" style={{ color: "rgba(4,44,83,0.65)" }}>
          Last 30 days. {isLive ? "Live data from your agent." : "Charts populate once your agent ships."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {CHARTS.map((c) => (
          <div key={c.key} className="rounded-xl border bg-white p-5 relative" style={{ borderColor: "rgba(4,44,83,0.1)" }}>
            <div className="text-[11.5px] uppercase tracking-[0.14em] mb-2" style={{ color: "rgba(4,44,83,0.55)" }}>
              {c.title}
            </div>
            <div className="text-[24px] tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
              {isLive ? "0" : "—"}<span className="text-[14px] opacity-60">{c.suffix}</span>
            </div>
            <div className="h-44 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 4, right: 6, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="rgba(4,44,83,0.06)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "rgba(4,44,83,0.45)" }} interval={5} />
                  <YAxis tick={{ fontSize: 10, fill: "rgba(4,44,83,0.45)" }} width={28} />
                  <Tooltip wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="value" stroke={NAVY} strokeWidth={1.6} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {!isLive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="px-3 py-1.5 rounded-md text-[12px]" style={{ background: "rgba(4,44,83,0.06)", color: "rgba(4,44,83,0.7)" }}>
                  No data yet
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
