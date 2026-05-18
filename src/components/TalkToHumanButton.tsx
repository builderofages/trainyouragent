// src/components/TalkToHumanButton.tsx
// v64: NO LONGER a persistent floating pill. Renders ONLY as a centered
// modal-style panel when FloatersProvider state is "human". Triggered from
// inside the chat bubble tray (AiChat.tsx) — there is now ONE persistent
// floating widget (the chat bubble bottom-right), and "Talk to a human" is
// a link inside it that opens this modal.
//
// No bottom-left floating button anymore — that was overlapping hero content
// on Home and every other page.

import { useEffect } from "react";
import { useFloaters } from "@/lib/floaters";

const CAL_URL = "https://cal.com/trainyouragent/30min";

export default function TalkToHumanButton() {
  const { open: floaterOpen, set } = useFloaters();
  const open = floaterOpen === "human";

  // Lock body scroll while open; restore on close/unmount.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") set(null); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, set]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}
      role="presentation"
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={() => set(null)}
        className="absolute inset-0 bg-[#042C53]/45 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Talk to a human"
        className="relative rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgba(4,44,83,0.55)] border border-slate-200 w-full max-w-[420px] overflow-hidden"
      >
        <div className="px-6 pt-6 pb-5 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] mb-1.5">
              Talk to a human
            </div>
            <div className="text-[17px] font-semibold text-[#042C53] leading-snug">
              No bots. You'll get Alexander or the engineer who'd build your agent.
            </div>
            <div className="text-[13px] text-slate-600 mt-2">
              Usually replies within 4 business hours.
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => set(null)}
            className="text-slate-400 hover:text-[#042C53] text-[22px] leading-none -mt-1 -mr-1 px-2 py-1"
          >
            ×
          </button>
        </div>
        <div className="p-4 grid gap-2.5">
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] min-h-[48px]"
          >
            <span>Book a 30-min Zoom</span>
            <span aria-hidden="true">→</span>
          </a>
          <a
            href="mailto:alexander@trainyouragent.com?subject=Question%20from%20trainyouragent.com"
            className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-white border border-slate-300 text-[#042C53] text-[14px] font-semibold hover:border-[#185FA5] min-h-[48px]"
          >
            <span>Email Alexander direct</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="px-6 pb-5 text-[12px] text-slate-500 leading-relaxed">
          Phone line ports Q3 2026. Zoom is faster than waiting for a callback anyway.
        </div>
      </div>
    </div>
  );
}
