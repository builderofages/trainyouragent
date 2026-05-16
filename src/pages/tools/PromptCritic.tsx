// src/pages/tools/PromptCritic.tsx
// v41 tool (c): paste a prompt, get scored critique + rewrite via /api/chat (mode=critic).

import { useState } from "react";
import ToolLayout, { NAVY, BLUE, TINT } from "./ToolLayout";
import ToolEmailGate from "./ToolEmailGate";

type Critique = {
  scores: { clarity: number; specificity: number; structure: number; safety: number };
  overall: number;
  critique: string;
  rewritten: string;
};

export default function PromptCritic() {
  const [prompt, setPrompt] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<Critique | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const run = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) { setErr("Paste a prompt first."); return; }
    if (trimmed.length > 3500) { setErr("Keep it under 3,500 characters."); return; }
    setErr(null);
    setState("loading");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "critic",
          messages: [{ role: "user", content: trimmed }],
        }),
      });
      if (!r.ok || !r.body) { setState("error"); return; }
      // Streamed text — accumulate then parse JSON at the end.
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
      }
      try {
        // Model may wrap in ```json fence — strip it defensively.
        const cleaned = buf.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
        const parsed = JSON.parse(cleaned) as Critique;
        setResult(parsed);
        setState("done");
      } catch {
        // Fallback — still show the raw output so the user sees something.
        setResult({
          scores: { clarity: 0, specificity: 0, structure: 0, safety: 0 },
          overall: 0,
          critique: buf.slice(0, 1000),
          rewritten: "",
        });
        setState("done");
      }
    } catch {
      setState("error");
    }
  };

  return (
    <ToolLayout
      eyebrow="Tool 3 of 5"
      title="Paste a prompt — find out"
      italicTail="if it's any good."
      subtitle="Scored on clarity, specificity, structure, and safety. You also get a tightened rewrite."
    >
      <div className="mt-8">
        <label htmlFor="prompt-in" className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">
          Your prompt
        </label>
        <textarea
          id="prompt-in"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={8}
          maxLength={3600}
          placeholder="e.g. 'You are a helpful assistant. Help me write marketing copy.'"
          aria-label="Prompt to critique"
          className="w-full p-4 rounded-lg border border-slate-300 text-[14px] font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[12px] text-slate-500">{prompt.length} / 3,500</span>
          <button
            onClick={run}
            disabled={state === "loading"}
            className="px-5 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
          >
            {state === "loading" ? "Grading…" : "Critique my prompt →"}
          </button>
        </div>
        {err && <div role="alert" className="mt-2 text-[12px] text-red-600">{err}</div>}
        {state === "error" && (
          <div role="alert" className="mt-2 text-[12px] text-red-600">
            Couldn't reach the critic. Try again in a sec.
          </div>
        )}
      </div>

      {state === "done" && result && (
        <section className="mt-10" aria-live="polite">
          <div className="rounded-xl border p-5" style={{ background: TINT, borderColor: BLUE }}>
            <div className="text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1">Overall</div>
            <div className="text-[40px] font-semibold leading-none" style={{ color: NAVY }}>
              {Math.round(result.overall)}<span className="text-[18px] text-slate-500">/10</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            {(["clarity","specificity","structure","safety"] as const).map((k) => (
              <div key={k} className="rounded-xl border border-slate-200 p-4 bg-white">
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1 capitalize">{k}</div>
                <div className="text-[22px] font-semibold" style={{ color: NAVY }}>
                  {result.scores?.[k] ?? 0}<span className="text-[12px] text-slate-500">/10</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-slate-200 p-5 bg-white">
            <div className="text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">Critique</div>
            <p className="text-[14px] text-slate-700 leading-relaxed">{result.critique}</p>
          </div>
          {result.rewritten && (
            <div className="mt-3 rounded-xl border border-slate-200 p-5 bg-slate-50">
              <div className="text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">Rewritten</div>
              <pre className="text-[13px] text-slate-800 leading-relaxed whitespace-pre-wrap font-mono">{result.rewritten}</pre>
            </div>
          )}

          <ToolEmailGate
            source="tool:prompt-critic"
            reportName="this critique as a PDF"
            payload={{ promptLength: prompt.length, overall: result.overall }}
          />
        </section>
      )}
    </ToolLayout>
  );
}
