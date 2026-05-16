// src/pages/demos/SalesObjectionHandler.tsx
// v42: live demo that hits /api/chat with mode="objections"

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import ToolEmailGate from "@/pages/tools/ToolEmailGate";

const NAVY = "#042C53";
const BLUE = "#185FA5";
const FONT = "'Inter Tight', system-ui, sans-serif";

const PRESET = "Your price is way too high. We can get the same thing for half the cost from your competitor.";

export default function SalesObjectionHandler() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    document.title = "Sales Objection Handler — Live Demo · TrainYourAgent";
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  const runWith = async (objection: string) => {
    if (!objection) return;
    setStatus("loading"); setOutput("");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "objections",
          messages: [{ role: "user", content: objection }],
        }),
      });
      if (!r.ok || !r.body) { setStatus("error"); return; }
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setOutput(acc);
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    runWith(input.trim());
  };

  const tryPreset = () => { setInput(PRESET); runWith(PRESET); };

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: FONT }}>
      <nav className="border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="text-[15px] font-semibold" style={{ color: NAVY }}>TrainYourAgent</Link>
          <Link to="/demos" className="text-[13px] text-slate-600 hover:text-[#185FA5]">All demos</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-3" style={{ color: BLUE }}>Live demo</div>
        <h1 className="text-[34px] sm:text-[44px] font-semibold leading-tight mb-3" style={{ color: NAVY }}>
          Sales objection handler
        </h1>
        <p className="text-[16px] text-slate-600 leading-relaxed mb-8 max-w-2xl">
          Paste a real sales objection your prospect raised. The agent returns three reframes with the underlying psychology behind each — the same playbook our highest-converting customers use on discovery calls.
        </p>

        <form onSubmit={submit} className="mb-6">
          <label htmlFor="objection-input" className="sr-only">Objection text</label>
          <textarea
            id="objection-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Your price is too high. We can get this cheaper somewhere else."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] resize-y"
          />
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              disabled={status === "loading" || !input.trim()}
              className="px-5 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-medium hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
            >
              {status === "loading" ? "Generating…" : "Get 3 reframes"}
            </button>
            <button
              type="button"
              onClick={tryPreset}
              disabled={status === "loading"}
              className="px-5 py-3 rounded-lg border border-slate-300 text-[14px] font-medium hover:bg-slate-50 min-h-[44px]"
            >
              Try a real one
            </button>
          </div>
        </form>

        {status === "loading" && !output && (
          <div role="status" aria-live="polite" className="text-[13px] text-slate-500">Coaching…</div>
        )}

        {output && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 whitespace-pre-wrap text-[14.5px] leading-relaxed text-[#0B1B2B]">
            {output}
          </div>
        )}

        {status === "error" && (
          <div role="alert" className="mt-4 text-[13px] text-red-600">Something broke — try again or email hello@trainyouragent.com.</div>
        )}

        {status === "done" && (
          <ToolEmailGate
            source="tool:prompt-critic"
            reportName="your full reframe playbook"
            payload={{ tool: "objections", input: input.slice(0, 500) }}
          />
        )}

        <div className="mt-12 pt-8 border-t border-slate-200 text-[14px] text-slate-600">
          Want this kind of coaching wired into every call your team takes? <Link to="/contact" className="font-medium" style={{ color: BLUE }}>Book a 30-min build call</Link>.
        </div>
      </main>
    </div>
  );
}
