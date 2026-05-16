// src/components/LeadMagnetModal.tsx
// Email-gated download — "The AI Voice Buyer's Guide" PDF.
// Drop the PDF at /public/buyers-guide.pdf and the form unlocks the link after capture.

import { useEffect, useState } from "react";

const FORM_ENDPOINT = "/api/lead"; // wired to api/lead.ts

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  /** Source enum sent to /api/lead — must be in the ALLOWED_SOURCES set */
  source?: string;
  /** Backend that serves the PDF after capture. Email is appended as ?email= */
  pdfEndpoint?: string;
  /** Button copy after capture */
  downloadCta?: string;
};

export default function LeadMagnetModal({
  open, onClose,
  // v42: default to the State of AI Ops 2026 report (richer lead magnet)
  title = "State of AI Operations 2026",
  subtitle = "30 pages on AI agent adoption, ROI benchmarks, the 7 reasons pilots fail, and the 2026-2027 vendor landscape. Free.",
  source = "report-state-of-ai-ops-2026",
  pdfEndpoint = "/api/state-of-ai-ops-pdf",
  downloadCta = "Download the report →",
}: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [name, setName] = useState("");

  // v42: prefill email if we have it from a prior pathway-router session.
  useEffect(() => {
    if (!open) return;
    try {
      const raw = window.localStorage.getItem("tya:pathway");
      if (raw) {
        const obj = JSON.parse(raw) as { email?: string };
        if (obj?.email && !email) setEmail(obj.email);
      }
    } catch { /* ignore */ }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      // v33c: lead capture first, then we hand the user a personalized PDF
      // download URL (server-generated PDF lives at /api/buyers-guide-pdf).
      const r = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, name, source, path: location.pathname }),
      });
      if (!r.ok) throw new Error("Submit failed");
      setState("ok");
    } catch {
      setState("err");
    }
  };

  // build the PDF link. The email is just for tracking; the PDF body is
  // identical for everyone.
  const pdfHref = `${pdfEndpoint}?email=${encodeURIComponent(email)}`;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#042C53]/60 backdrop-blur-sm" onClick={onClose} style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <div className="relative max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-[0_30px_80px_-20px_rgba(4,44,83,0.55)] p-8 sm:p-10" onClick={(e) => e.stopPropagation()}>
        <button aria-label="Close" onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-[18px] leading-none">×</button>
        <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Free download</div>
        <h3 className="text-[26px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-3">{title}</h3>
        <p className="text-[14px] text-slate-700 leading-relaxed mb-6">{subtitle}</p>

        {state !== "ok" ? (
          <form onSubmit={submit} className="grid gap-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5]" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" className="px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5]" />
            <button type="submit" disabled={state === "sending"} className="mt-1 px-5 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50">
              {state === "sending" ? "Sending…" : "Get the guide →"}
            </button>
            <div className="text-[11px] text-slate-500 leading-relaxed">By submitting you join our newsletter (one email a week, no fluff). Unsubscribe any time.</div>
            {state === "err" && <div className="text-[12px] text-[#B23] italic">Couldn't send. Try again or email hello@trainyouragent.com.</div>}
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#22A36C] font-semibold mb-3">Unlocked</div>
            <h4 className="text-[22px] font-semibold text-[#042C53] mb-3">Your download is ready.</h4>
            <a href={pdfHref} target="_blank" rel="noopener" className="inline-block px-6 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E]">
              {downloadCta}
            </a>
            <div className="mt-4 text-[13px] text-slate-600">We've also emailed a copy to {email}.</div>
          </div>
        )}
      </div>
    </div>
  );
}
