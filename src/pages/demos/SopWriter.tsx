// src/pages/demos/SopWriter.tsx
// v42: live demo that hits /api/chat with mode="sop"

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import ToolEmailGate from "@/pages/tools/ToolEmailGate";
import ChatIllo from "@/components/illustrations/ChatIllo";

const NAVY = "#042C53";
const BLUE = "#185FA5";
const FONT = "'Inter Tight', system-ui, sans-serif";

const PRESET = "When a new patient calls our dental office for the first time, the receptionist takes their info, verifies their insurance, and books a 60-minute new-patient appointment.";

export default function SopWriter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    document.title = "SOP Writer — Live Demo · TrainYourAgent";
    {
      const ogImage = `https://trainyouragent.com/api/og?title=${encodeURIComponent("SOP Writer")}&subtitle=${encodeURIComponent("Live AI demo — process → SOP in 30s")}&type=tool&badge=DEMO`;
      const sM = (sel: string, a: "name"|"property", k: string, v: string) => { let el = document.querySelector(sel) as HTMLMetaElement | null; if (!el) { el = document.createElement("meta"); el.setAttribute(a, k); document.head.appendChild(el); } el.setAttribute("content", v); };
      sM("meta[property='og:image']", "property", "og:image", ogImage);
      sM("meta[name='twitter:image']", "name", "twitter:image", ogImage);
      sM("meta[name='twitter:card']", "name", "twitter:card", "summary_large_image");
    }
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  const runWith = async (process: string) => {
    if (!process) return;
    setStatus("loading"); setOutput("");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "sop",
          messages: [{ role: "user", content: process }],
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
          SOP writer
        </h1>
        <p className="text-[16px] text-slate-600 leading-relaxed mb-6 max-w-2xl">
          Describe a business process in one or two sentences. The agent returns a numbered SOP with roles, timing, tools, and the most common failure mode at every step.
        </p>
        <div className="mb-8 max-w-md opacity-90">
          <ChatIllo style={{ width: "100%", height: "auto" }} />
        </div>

        <form onSubmit={submit} className="mb-6">
          <label htmlFor="sop-input" className="sr-only">Process</label>
          <textarea
            id="sop-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. When a Meta lead form is submitted, our sales rep calls the lead within 5 minutes and books a 30-minute consultation."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] resize-y"
          />
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              disabled={status === "loading" || !input.trim()}
              className="px-5 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-medium hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
            >
              {status === "loading" ? "Writing…" : "Write the SOP"}
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
          <div role="status" aria-live="polite" className="text-[13px] text-slate-500">Drafting…</div>
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
            source="tool:scenario-generator"
            reportName="your SOP packet (PDF) + a 3-step rollout playbook"
            payload={{ tool: "sop", input: input.slice(0, 500) }}
          />
        )}

        <div className="mt-12 pt-8 border-t border-slate-200 text-[14px] text-slate-600">
          Want this SOP turned into a real agent that runs the process? <Link to="/contact" className="font-medium" style={{ color: BLUE }}>Book a 30-min build call</Link>.
        </div>
      </main>
    </div>
  );
}
