// src/pages/tools/DiagnoseWizard.tsx — v67A
// Free tool. 4-step wizard → personalized AI-deployment diagnosis via
// /api/chat mode="diagnose".

import { useState, type FormEvent } from "react";
import ToolLayout, { NAVY, BLUE, TINT } from "./ToolLayout";
import ToolEmailGate from "./ToolEmailGate";

const NICHE_OPTIONS: { slug: string; label: string }[] = [
  { slug: "hvac", label: "HVAC contractor" },
  { slug: "roofing", label: "Roofing contractor" },
  { slug: "plumbing", label: "Plumbing contractor" },
  { slug: "electrical", label: "Electrical contractor" },
  { slug: "landscaping", label: "Landscaping company" },
  { slug: "dental", label: "Dental practice" },
  { slug: "med-spa", label: "Med spa" },
  { slug: "law-firm", label: "Law firm" },
  { slug: "real-estate", label: "Real estate brokerage" },
  { slug: "property-management", label: "Property management" },
  { slug: "restaurant", label: "Restaurant" },
  { slug: "auto-repair", label: "Auto repair shop" },
  { slug: "insurance", label: "Insurance agency" },
  { slug: "fitness", label: "Gym or fitness studio" },
  { slug: "pest-control", label: "Pest control" },
];

export default function DiagnoseWizard() {
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState("hvac");
  const [headache, setHeadache] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [tried, setTried] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [output, setOutput] = useState("");

  const canNext = () => {
    if (step === 1) return !!niche;
    if (step === 2) return headache.trim().length > 4;
    if (step === 3) return hoursPerWeek >= 0;
    if (step === 4) return tried.trim().length > 1;
    return false;
  };

  const run = async (e: FormEvent) => {
    e.preventDefault();
    if (!canNext()) return;
    setState("loading");
    setOutput("");
    const userPrompt = [
      `Business type: ${niche}`,
      `#1 operational headache: ${headache.trim().slice(0, 220)}`,
      `Hours/week spent on it: ${hoursPerWeek}`,
      `What they've tried: ${tried.trim().slice(0, 220)}`,
    ].join("\n");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "diagnose",
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
      if (!r.ok) {
        setState("error");
        return;
      }
      const text = await r.text();
      setOutput(text);
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <ToolLayout
      eyebrow="Free tool"
      title="Diagnose your business —"
      italicTail="find your #1 AI lever."
      subtitle="Four short questions. We tell you the single highest-leverage AI build for your operation, the timeline, the cost range, and the honest disclaimer about what AI can't fix."
    >
      {state !== "done" && (
        <form onSubmit={run} className="mt-8">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className="h-1.5 flex-1 rounded-full"
                style={{ background: s <= step ? BLUE : "#E2E8F0" }}
              />
            ))}
          </div>
          <div className="text-[12px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: BLUE }}>
            Step {step} of 4
          </div>

          {step === 1 && (
            <div>
              <label htmlFor="d-niche" className="block text-[18px] font-semibold mb-3" style={{ color: NAVY }}>
                What's your business type?
              </label>
              <select
                id="d-niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
              >
                {NICHE_OPTIONS.map((n) => (
                  <option key={n.slug} value={n.slug}>{n.label}</option>
                ))}
              </select>
            </div>
          )}

          {step === 2 && (
            <div>
              <label htmlFor="d-headache" className="block text-[18px] font-semibold mb-3" style={{ color: NAVY }}>
                What's your #1 operational headache?
              </label>
              <input
                id="d-headache"
                type="text"
                value={headache}
                onChange={(e) => setHeadache(e.target.value)}
                maxLength={200}
                placeholder="e.g. We miss 40% of after-hours service calls"
                className="w-full p-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
              />
              <div className="mt-1 text-[12px] text-slate-500">{headache.length} / 200</div>
            </div>
          )}

          {step === 3 && (
            <div>
              <label htmlFor="d-hrs" className="block text-[18px] font-semibold mb-3" style={{ color: NAVY }}>
                Hours your team spends on it weekly?
              </label>
              <input
                id="d-hrs"
                type="range"
                min={0}
                max={40}
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full"
              />
              <div className="mt-2 text-[28px] font-semibold" style={{ color: NAVY }}>
                {hoursPerWeek} hrs<span className="text-[14px] text-slate-500 font-normal">/week</span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <label htmlFor="d-tried" className="block text-[18px] font-semibold mb-3" style={{ color: NAVY }}>
                What have you already tried?
              </label>
              <input
                id="d-tried"
                type="text"
                value={tried}
                onChange={(e) => setTried(e.target.value)}
                maxLength={200}
                placeholder="e.g. Hired an answering service, tried Bland AI, ignored it"
                className="w-full p-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
              />
              <div className="mt-1 text-[12px] text-slate-500">{tried.length} / 200</div>
            </div>
          )}

          <div className="mt-7 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="px-4 py-2 rounded-lg text-[13px] font-semibold text-slate-600 disabled:opacity-40"
            >
              ← Back
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={() => canNext() && setStep((s) => Math.min(4, s + 1))}
                disabled={!canNext()}
                className="px-5 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canNext() || state === "loading"}
                className="px-5 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
              >
                {state === "loading" ? "Diagnosing…" : "Get my diagnosis →"}
              </button>
            )}
          </div>
          {state === "error" && (
            <div role="alert" className="mt-2 text-[12px] text-red-600">
              The diagnosis service hiccupped. Try again.
            </div>
          )}
        </form>
      )}

      {state === "done" && output && (
        <section className="mt-10" aria-live="polite">
          <div className="text-[12px] uppercase tracking-[0.14em] font-semibold mb-3" style={{ color: BLUE }}>
            Your diagnosis
          </div>
          <div
            className="rounded-xl border p-5 bg-white"
            style={{ borderColor: BLUE, background: TINT }}
          >
            <pre className="text-[13.5px] leading-[1.6] whitespace-pre-wrap font-sans" style={{ color: NAVY }}>
              {output}
            </pre>
          </div>

          <ToolEmailGate
            source="tool:diagnose"
            reportName="this diagnosis as a branded PDF with the implementation steps"
            payload={{ niche, hoursPerWeek }}
          />

          <div className="mt-6 text-center">
            <button
              onClick={() => { setStep(1); setHeadache(""); setTried(""); setOutput(""); setState("idle"); }}
              className="text-[13px] font-semibold underline"
              style={{ color: NAVY }}
            >
              Start over with a different scenario
            </button>
          </div>
        </section>
      )}
    </ToolLayout>
  );
}
