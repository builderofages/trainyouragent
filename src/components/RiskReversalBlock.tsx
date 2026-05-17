// src/components/RiskReversalBlock.tsx
// v54: Hormozi-style risk reversal. Plain-English guarantees, hard numbers,
// no marketing fluff. Reused on /pricing, /book, and the Home closer.
//
// Hormozi: the higher the perceived risk, the lower the conversion. Stack
// reversal until "saying no feels stupid." Every promise here is one the
// founder can actually keep.

type Variant = "light" | "dark";

type Props = {
  /** "dark" renders on a navy section; "light" renders on white/tint. */
  variant?: Variant;
  /** Hide the eyebrow if it would duplicate a parent section header. */
  showEyebrow?: boolean;
  className?: string;
};

const PROMISES = [
  {
    h: "Your first agent ships within 21 days.",
    b: "If it doesn't, every day late = $200 off your bill, capped at a full month free.",
  },
  {
    h: "A measurable result inside 30 days of launch.",
    b: "Booked appointments, qualified leads, time saved, deflection rate — pick the metric. If we can't show it, we work free until we can.",
  },
  {
    h: "Full refund inside the first 30 days.",
    b: "Cancel for any reason in month one and you get every dollar back. No clawback fight, no exit interview.",
  },
  {
    h: "Month-to-month after that.",
    b: "No multi-year contract. No early-termination fee. Cancel any time with 14 days notice — we'll even port your number out.",
  },
];

export default function RiskReversalBlock({
  variant = "light",
  showEyebrow = true,
  className = "",
}: Props) {
  const isDark = variant === "dark";

  return (
    <div
      className={`rounded-3xl border p-7 sm:p-9 ${
        isDark
          ? "bg-white/5 border-white/15 text-white"
          : "bg-[#E6F1FB] border-[#185FA5]/15 text-[#0B1B2B]"
      } ${className}`}
      role="region"
      aria-label="Our guarantee in plain English"
    >
      {showEyebrow && (
        <div
          className={`text-[11px] uppercase tracking-[0.18em] font-semibold mb-3 ${
            isDark ? "text-[#9CC4EC]" : "text-[#185FA5]"
          }`}
        >
          Our guarantee, in plain English
        </div>
      )}

      <h3
        className={`text-[22px] sm:text-[28px] leading-snug font-semibold mb-2 ${
          isDark ? "text-white" : "text-[#042C53]"
        }`}
      >
        Four promises you can hold us to.
      </h3>

      <p
        className={`text-[14px] sm:text-[15px] leading-relaxed max-w-3xl mb-6 ${
          isDark ? "text-white/80" : "text-slate-700"
        }`}
      >
        No legalese, no escape clauses. If we miss any of these, the
        consequence is on us — written into the SOW.
      </p>

      <ul className="grid sm:grid-cols-2 gap-4 sm:gap-5">
        {PROMISES.map((p) => (
          <li key={p.h} className="flex gap-3">
            <span
              aria-hidden="true"
              className={`flex-shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold ${
                isDark
                  ? "bg-[#22A36C] text-white"
                  : "bg-[#22A36C] text-white"
              }`}
            >
              ✓
            </span>
            <div>
              <div
                className={`text-[15px] font-semibold leading-snug mb-1 ${
                  isDark ? "text-white" : "text-[#042C53]"
                }`}
              >
                {p.h}
              </div>
              <div
                className={`text-[13.5px] leading-relaxed ${
                  isDark ? "text-white/75" : "text-slate-700"
                }`}
              >
                {p.b}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div
        className={`mt-7 pt-5 border-t text-[13px] leading-relaxed ${
          isDark
            ? "border-white/15 text-white/70"
            : "border-[#185FA5]/15 text-slate-600"
        }`}
      >
        Direct line for the founder:{" "}
        <a
          href="mailto:alexander@trainyouragent.com"
          className={`font-semibold underline ${
            isDark
              ? "text-white decoration-white/40 hover:decoration-white"
              : "text-[#042C53] decoration-[#185FA5]/40 hover:decoration-[#185FA5]"
          }`}
        >
          alexander@trainyouragent.com
        </a>
        {" "}— 4-hour reply, real human, weekdays.
      </div>
    </div>
  );
}
