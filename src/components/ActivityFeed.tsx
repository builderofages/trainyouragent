// src/components/ActivityFeed.tsx
// "Live activity" rolling ticker. Shows anonymized recent actions to create motion + social proof.
// Replace seed data with a real /api/activity feed when you have one.

import { useEffect, useState } from "react";

type Event = { v: string; action: string; loc: string; mins: number };

const SEED: Event[] = [
  { v: "HVAC",        action: "booked an after-hours dispatch", loc: "United States",        mins: 2 },
  { v: "Healthcare",  action: "scheduled a new-patient intake",  loc: "Austin, TX",       mins: 5 },
  { v: "Real Estate", action: "qualified a buyer lead",           loc: "Charlotte, NC",   mins: 7 },
  { v: "Roofing",     action: "captured an insurance claim",      loc: "Dallas, TX",       mins: 11 },
  { v: "Legal",       action: "ran a conflict check + booked",    loc: "Miami, FL",        mins: 14 },
  { v: "Spas",        action: "filled a waitlist cancellation",   loc: "Nashville, TN",    mins: 18 },
  { v: "Solar",       action: "booked a site survey",             loc: "Phoenix, AZ",      mins: 22 },
  { v: "Logistics",   action: "logged a driver detention",        loc: "Atlanta, GA",      mins: 27 },
  { v: "Hotels",      action: "answered concierge overflow",      loc: "Las Vegas, NV",    mins: 33 },
  { v: "Accounting",  action: "ran tax-season intake",            loc: "Denver, CO",       mins: 41 },
];

const fmt = (m: number) => m < 60 ? `${m}m ago` : `${Math.round(m/60)}h ago`;

export default function ActivityFeed({ rotateMs = 3500, max = 5 }: { rotateMs?: number; max?: number }) {
  const [items, setItems] = useState(SEED.slice(0, max));

  useEffect(() => {
    const id = setInterval(() => {
      setItems((curr) => {
        const next = [...curr];
        const e = SEED[Math.floor(Math.random() * SEED.length)];
        next.unshift({ ...e, mins: Math.max(1, Math.floor(Math.random() * 3)) });
        return next.slice(0, max);
      });
    }, rotateMs);
    return () => clearInterval(id);
  }, [rotateMs, max]);

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-[0_4px_24px_-10px_rgba(4,44,83,0.18)]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22A36C] animate-pulse" />
          <div className="text-[12px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold">Live activity</div>
        </div>
        <div className="text-[11px] text-slate-500">Anonymized · Last hour</div>
      </div>
      <div className="space-y-2.5">
        {items.map((e, i) => (
          <div key={`${e.v}-${e.mins}-${i}`}
               className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#F6FAFE] border border-slate-200/70 animate-[fadeup_0.4s_ease-out]">
            <div className="flex items-center gap-3 min-w-0">
              <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-[#185FA5] whitespace-nowrap">{e.v}</span>
              <span className="text-[13px] text-slate-700 truncate">{e.action}</span>
            </div>
            <div className="text-[11px] text-slate-500 whitespace-nowrap">{e.loc} · {fmt(e.mins)}</div>
          </div>
        ))}
      </div>
      <style>{`@keyframes fadeup { from { opacity: 0; transform: translateY(-6px);} to { opacity: 1; transform: translateY(0);} }`}</style>
    </div>
  );
}
