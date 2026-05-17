// src/components/TalkToHumanButton.tsx
// v46a: Persistent "Talk to a human" floating button.
// NOT a chatbot. Links to Cal.com (and a mailto fallback).
// Bottom-right on every page, mounted via App.tsx.

import { useEffect, useState } from "react";

const CAL_URL = "https://cal.com/trainyouragent/30min";

export default function TalkToHumanButton() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed z-[60] bottom-5 right-5 sm:bottom-6 sm:right-6"
      style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Talk to a human"
          className="mb-3 rounded-2xl bg-white shadow-[0_24px_60px_-20px_rgba(4,44,83,0.45)] border border-slate-200 w-[280px] sm:w-[320px] overflow-hidden"
        >
          <div className="px-5 pt-5 pb-4 border-b border-slate-100">
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-1">
              Talk to a human
            </div>
            <div className="text-[15px] font-semibold text-[#042C53] leading-snug">
              No bots. You'll get Alexander or the engineer who'd build your agent.
            </div>
            <div className="text-[12.5px] text-slate-600 mt-1.5">
              Usually replies within 4 business hours.
            </div>
          </div>
          <div className="p-3 grid gap-2">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] min-h-[44px]"
            >
              <span>Book a 30-min Zoom</span>
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="mailto:alexander@trainyouragent.com?subject=Question%20from%20trainyouragent.com"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-slate-300 text-[#042C53] text-[14px] font-semibold hover:border-[#185FA5] min-h-[44px]"
            >
              <span>Email Alexander direct</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="px-5 pb-4 text-[11px] text-slate-500 leading-relaxed">
            Phone line ports Q3 2026. Zoom is faster than waiting for a callback anyway.
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close talk-to-human menu" : "Talk to a human"}
        aria-expanded={open}
        className="flex items-center gap-2 px-4 sm:px-5 h-12 rounded-full bg-[#042C53] text-white text-[14px] font-semibold shadow-[0_18px_40px_-12px_rgba(4,44,83,0.55)] hover:bg-[#0A3D6E] focus:outline-none focus:ring-2 focus:ring-[#185FA5] focus:ring-offset-2 min-h-[44px]"
      >
        <span
          className="relative inline-flex w-2.5 h-2.5"
          aria-hidden="true"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-70 animate-ping" />
          <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </span>
        <span className="hidden sm:inline">Talk to a human</span>
        <span className="sm:hidden">Talk to us</span>
      </button>
    </div>
  );
}
