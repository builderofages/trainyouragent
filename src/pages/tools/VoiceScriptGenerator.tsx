// src/pages/tools/VoiceScriptGenerator.tsx — v67A
// Free tool. Visitor picks a niche + optional business name, gets a complete
// ~600-word voice agent dialogue script via /api/chat mode="voice-script".

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

export default function VoiceScriptGenerator() {
  const [niche, setNiche] = useState("hvac");
  const [businessName, setBusinessName] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const run = async (e: FormEvent) => {
    e.preventDefault();
    setState("loading");
    setOutput("");
    setCopied(false);
    const userPrompt = [
      `Niche: ${niche}`,
      businessName ? `Business name: ${businessName.trim().slice(0, 60)}` : `Business name: (not provided — use generic placeholder)`,
    ].join("\n");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "voice-script",
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
      title="Voice agent script —"
      italicTail="written for your niche."
      subtitle="Pick your industry, drop your business name (optional), and get a complete 2-page voice agent script with opening, qualifying questions, objection handling, booking flow, and escalation triggers."
    >
      <form onSubmit={run} className="mt-8 space-y-4">
        <div>
          <label htmlFor="niche-in" className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">
            Niche
          </label>
          <select
            id="niche-in"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
          >
            {NICHE_OPTIONS.map((n) => (
              <option key={n.slug} value={n.slug}>{n.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="biz-in" className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">
            Business name (optional)
          </label>
          <input
            id="biz-in"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            maxLength={60}
            placeholder="e.g. Acme HVAC"
            className="w-full p-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
          />
        </div>
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={state === "loading"}
            className="px-5 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
          >
            {state === "loading" ? "Writing script…" : "Generate my script →"}
          </button>
        </div>
        {state === "error" && (
          <div role="alert" className="text-[12px] text-red-600">
            Couldn't reach the generator. Try again in a few seconds.
          </div>
        )}
      </form>

      {state === "done" && output && (
        <section className="mt-10" aria-live="polite">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[12px] uppercase tracking-[0.14em] font-semibold" style={{ color: BLUE }}>
              Your script
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
            source="tool:voice-script-generator"
            reportName="this voice script as a branded PDF"
            payload={{ niche, businessName }}
          />
        </section>
      )}
    </ToolLayout>
  );
}
