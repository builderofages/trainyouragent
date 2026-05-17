// src/components/SmartPriceReveal.tsx
// v42: tiny "calculate your custom price" widget — pure client-side, no API.
// 3 inputs (use case, volume, urgency) -> tailored price in our existing range.

import { useMemo, useState } from "react";

const NAVY = "#042C53";
const BLUE = "#185FA5";

type UseCase = "voice-inbound" | "speed-to-lead" | "support-chat" | "sales-followup" | "internal-kb";
type Volume = "lt100" | "100to500" | "500to2000" | "gt2000";
type Urgency = "this-month" | "this-quarter" | "exploring";

const USE_CASES: { id: UseCase; label: string; baseBuild: number; baseRetainer: number }[] = [
  { id: "voice-inbound",   label: "Voice agent for inbound calls",   baseBuild: 4950, baseRetainer: 1199 },
  { id: "speed-to-lead",   label: "Speed-to-lead outbound dialer",   baseBuild: 2950, baseRetainer: 699  },
  { id: "support-chat",    label: "Customer-support chatbot",        baseBuild: 3950, baseRetainer: 899  },
  { id: "sales-followup",  label: "Sales follow-up automation",      baseBuild: 1950, baseRetainer: 449  },
  { id: "internal-kb",     label: "Internal knowledge / Q&A bot",    baseBuild: 2950, baseRetainer: 599  },
];

const VOLUMES: { id: Volume; label: string; multiplier: number }[] = [
  { id: "lt100",     label: "Under 100 / mo",   multiplier: 0.85 },
  { id: "100to500",  label: "100-500 / mo",     multiplier: 1.00 },
  { id: "500to2000", label: "500-2,000 / mo",   multiplier: 1.35 },
  { id: "gt2000",    label: "2,000+ / mo",      multiplier: 1.80 },
];

const URGENCIES: { id: Urgency; label: string; multiplier: number }[] = [
  { id: "this-month",   label: "This month",   multiplier: 1.20 },
  { id: "this-quarter", label: "This quarter", multiplier: 1.00 },
  { id: "exploring",    label: "Just exploring", multiplier: 0.90 },
];

export default function SmartPriceReveal() {
  const [useCase, setUseCase] = useState<UseCase>("voice-inbound");
  const [volume, setVolume] = useState<Volume>("100to500");
  const [urgency, setUrgency] = useState<Urgency>("this-quarter");
  const [revealed, setRevealed] = useState(false);

  const price = useMemo(() => {
    const u = USE_CASES.find((x) => x.id === useCase)!;
    const v = VOLUMES.find((x) => x.id === volume)!;
    const r = URGENCIES.find((x) => x.id === urgency)!;
    const build = Math.round((u.baseBuild * v.multiplier) / 50) * 50;
    const retainer = Math.round((u.baseRetainer * v.multiplier * r.multiplier) / 50) * 50;
    return { build, retainer };
  }, [useCase, volume, urgency]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: BLUE }}>
        Calculate your custom price
      </div>
      <h3 className="text-[22px] sm:text-[28px] font-semibold mb-1" style={{ color: NAVY }}>
        Built for your situation.
      </h3>
      <p className="text-[14px] text-slate-600 mb-6">
        Three quick questions. Tailored quote in the same range we'd give on a call.
      </p>

      <div className="grid sm:grid-cols-3 gap-5 mb-6">
        <div>
          <label className="block text-[12px] font-semibold text-slate-700 mb-2">Primary use case</label>
          <select
            value={useCase}
            onChange={(e) => { setUseCase(e.target.value as UseCase); setRevealed(false); }}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] bg-white"
          >
            {USE_CASES.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-slate-700 mb-2">Volume</label>
          <select
            value={volume}
            onChange={(e) => { setVolume(e.target.value as Volume); setRevealed(false); }}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] bg-white"
          >
            {VOLUMES.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-slate-700 mb-2">Timeline</label>
          <select
            value={urgency}
            onChange={(e) => { setUrgency(e.target.value as Urgency); setRevealed(false); }}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] bg-white"
          >
            {URGENCIES.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
        </div>
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="px-5 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-medium hover:bg-[#0A3D6E] min-h-[44px]"
        >
          Reveal my tailored price
        </button>
      ) : (
        <div className="rounded-xl bg-[#F6FAFE] p-5 sm:p-6 border border-[#cfe1f3]" role="status" aria-live="polite">
          <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-3" style={{ color: BLUE }}>
            Your tailored quote
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-600 mb-1">Build fee (one time)</div>
              <div className="text-[28px] font-semibold" style={{ color: NAVY }}>${price.build.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-600 mb-1">Monthly retainer</div>
              <div className="text-[28px] font-semibold" style={{ color: NAVY }}>${price.retainer.toLocaleString()}<span className="text-[14px] font-normal text-slate-600">/mo</span></div>
            </div>
          </div>
          <div className="text-[13px] text-slate-600 leading-relaxed">
            Plus per-call inference + telephony run-cost (typically $0.30-$0.65 per call landed). Final scope confirmed on a 30-min call.
          </div>
          <div className="mt-4">
            <a href="/contact" className="inline-block px-4 py-2.5 rounded-lg bg-[#042C53] text-white text-[13px] font-medium hover:bg-[#0A3D6E]">
              Lock this quote on a call
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
