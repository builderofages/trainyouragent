// src/pages/tools/ColdDmGenerator.tsx — v67A
// Free tool. Inputs: target role, offer one-liner, optional company name.
// Output: 3-message LinkedIn cold DM sequence via /api/chat mode="cold-dm".

import { useState, type FormEvent } from "react";
import ToolLayout, { NAVY, BLUE, TINT } from "./ToolLayout";
import ToolEmailGate from "./ToolEmailGate";

export default function ColdDmGenerator() {
  const [targetRole, setTargetRole] = useState("");
  const [offer, setOffer] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const run = async (e: FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim() || !offer.trim()) {
      setState("error");
      return;
    }
    setState("loading");
    setOutput("");
    setCopied(false);
    const userPrompt = [
      `Target role: ${targetRole.trim().slice(0, 250)}`,
      `Offer: ${offer.trim().slice(0, 250)}`,
      company.trim() ? `My company: ${company.trim().slice(0, 80)}` : "My company: (omit)",
    ].join("\n");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "cold-dm",
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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <ToolLayout
      eyebrow="Free tool"
      title="LinkedIn cold DM —"
      italicTail="3-message sequence."
      subtitle="Give it your target and your offer. Get back a 3-message sequence (opener, value drop, soft CTA) that sounds like a human wrote it on purpose."
    >
      <form onSubmit={run} className="mt-8 space-y-4">
        <div>
          <label htmlFor="target-in" className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">
            Target role
          </label>
          <input
            id="target-in"
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            maxLength={250}
            placeholder="e.g. HVAC owner-operator, 5–25 employees, US Southeast"
            className="w-full p-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
          />
        </div>
        <div>
          <label htmlFor="offer-in" className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">
            Your offer (one-liner)
          </label>
          <input
            id="offer-in"
            type="text"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            maxLength={250}
            placeholder="e.g. Custom AI voice agent that captures after-hours calls"
            className="w-full p-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
          />
        </div>
        <div>
          <label htmlFor="co-in" className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">
            Your company (optional)
          </label>
          <input
            id="co-in"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            maxLength={80}
            placeholder="e.g. TrainYourAgent"
            className="w-full p-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
          />
        </div>
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={state === "loading"}
            className="px-5 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
          >
            {state === "loading" ? "Writing…" : "Generate my sequence →"}
          </button>
        </div>
        {state === "error" && (
          <div role="alert" className="text-[12px] text-red-600">
            Fill in target role and offer, then try again.
          </div>
        )}
      </form>

      {state === "done" && output && (
        <section className="mt-10" aria-live="polite">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[12px] uppercase tracking-[0.14em] font-semibold" style={{ color: BLUE }}>
              Your 3-message sequence
            </div>
            <button
              onClick={copy}
              className="text-[12px] font-semibold underline"
              style={{ color: NAVY }}
            >
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
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
            source="tool:cold-dm-generator"
            reportName="this sequence + a 7-touch follow-up playbook"
            payload={{ targetRole, offer, company }}
          />
        </section>
      )}
    </ToolLayout>
  );
}
