// src/pages/tools/ScenarioGenerator.tsx
// v41 tool (d): industry + use case → 5 automation scenarios via /api/chat (mode=assistant).

import { useState } from "react";
import ToolLayout, { NAVY, BLUE } from "./ToolLayout";
import ToolEmailGate from "./ToolEmailGate";

const INDUSTRIES = [
  "HVAC", "Plumbing", "Roofing", "Real Estate", "Legal",
  "Healthcare clinic", "Restaurant", "Auto dealership", "Solar", "Logistics",
  "Spa", "Gym", "Hotel", "Bar / nightclub", "Accounting firm",
];

export default function ScenarioGenerator() {
  const [industry, setIndustry] = useState("HVAC");
  const [useCase, setUseCase] = useState("Capture after-hours calls and book appointments");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [output, setOutput] = useState("");

  const run = async () => {
    setState("loading"); setOutput("");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "assistant",
          messages: [{
            role: "user",
            content:
              `Industry: ${industry}\nUse case: ${useCase}\n\n` +
              `Give me exactly 5 specific AI automation scenarios for this business. ` +
              `Format each as: numbered, bold title, one-line description, then "Estimated ROI: $X/mo" on its own line. ` +
              `Use realistic SMB numbers. No preamble. No closing summary.`,
          }],
        }),
      });
      if (!r.ok || !r.body) { setState("error"); return; }
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        setOutput(buf);
      }
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <ToolLayout
      eyebrow="Tool 4 of 5"
      title="Five automation ideas for"
      italicTail="your business, on the house."
      subtitle="Pick your industry and what you want solved. We'll generate 5 specific, ROI-tagged scenarios."
    >
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label htmlFor="industry" className="block">
          <span className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">Industry</span>
          <select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            aria-label="Industry"
            className="w-full px-3 py-3 rounded-lg border border-slate-300 text-[15px] bg-white min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
          >
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
        <label htmlFor="usecase" className="block">
          <span className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">Use case</span>
          <input
            id="usecase"
            type="text"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            maxLength={140}
            aria-label="Use case"
            className="w-full px-3 py-3 rounded-lg border border-slate-300 text-[15px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
          />
        </label>
      </div>
      <button
        onClick={run}
        disabled={state === "loading"}
        className="mt-4 px-6 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
      >
        {state === "loading" ? "Generating…" : "Generate 5 scenarios →"}
      </button>

      {(state === "loading" || state === "done") && (
        <section className="mt-8" aria-live="polite">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-3">
              Scenarios for {industry}
            </div>
            <pre className="text-[14px] text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
{output || "…thinking"}
            </pre>
          </div>

          {state === "done" && (
            <ToolEmailGate
              source="tool:scenario-generator"
              reportName="these scenarios as a PDF"
              payload={{ industry, useCase, length: output.length }}
            />
          )}
        </section>
      )}

      {state === "error" && (
        <div role="alert" className="mt-4 text-[13px] text-red-600">
          Generator failed — try again in a few seconds.
        </div>
      )}
    </ToolLayout>
  );
}
