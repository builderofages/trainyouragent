// src/pages/tools/VendorMatrix.tsx — v52B
// /tools/vendor-matrix — 10×12 AI vendor comparison matrix.
// Sortable, filterable, with a recommendation lead-capture at the bottom.

import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import ToolLayout, { NAVY, BLUE } from "./ToolLayout";

const ENDPOINT = "/api/lead";

type Row = {
  vendor: string;
  category: string;
  quality: number; // 1-5
  speedMs: number; // approximate first-token latency (ms)
  cost: string; // per 1M tokens or other unit
  voice: "Yes" | "No" | "Partial";
  streaming: "Yes" | "No";
  tools: "Yes" | "No" | "Partial";
  json: "Yes" | "No" | "Partial";
  vision: "Yes" | "No";
  context: string; // long context
  fineTune: "Yes" | "No" | "Limited";
  soc2: "Yes" | "No" | "In progress";
  bestFor: string;
};

const ROWS: Row[] = [
  {
    vendor: "OpenAI / ChatGPT",
    category: "LLM",
    quality: 5,
    speedMs: 700,
    cost: "$2.50 / $10.00",
    voice: "Yes",
    streaming: "Yes",
    tools: "Yes",
    json: "Yes",
    vision: "Yes",
    context: "128K",
    fineTune: "Yes",
    soc2: "Yes",
    bestFor: "General-purpose coding + product agents.",
  },
  {
    vendor: "Anthropic / Claude",
    category: "LLM",
    quality: 5,
    speedMs: 800,
    cost: "$3.00 / $15.00",
    voice: "No",
    streaming: "Yes",
    tools: "Yes",
    json: "Yes",
    vision: "Yes",
    context: "200K",
    fineTune: "No",
    soc2: "Yes",
    bestFor: "Long-context reasoning and coding agents.",
  },
  {
    vendor: "Google / Gemini",
    category: "LLM",
    quality: 5,
    speedMs: 900,
    cost: "$1.25 / $5.00",
    voice: "Yes",
    streaming: "Yes",
    tools: "Yes",
    json: "Yes",
    vision: "Yes",
    context: "1M+",
    fineTune: "Yes",
    soc2: "Yes",
    bestFor: "Million-token context, video, multi-modal.",
  },
  {
    vendor: "Meta / Llama (via Groq)",
    category: "LLM",
    quality: 4,
    speedMs: 200,
    cost: "$0.59 / $0.79",
    voice: "No",
    streaming: "Yes",
    tools: "Yes",
    json: "Yes",
    vision: "Partial",
    context: "131K",
    fineTune: "Yes",
    soc2: "Yes",
    bestFor: "Ultra-low latency + open-weights flexibility.",
  },
  {
    vendor: "Mistral",
    category: "LLM",
    quality: 4,
    speedMs: 600,
    cost: "$2.00 / $6.00",
    voice: "No",
    streaming: "Yes",
    tools: "Yes",
    json: "Yes",
    vision: "Partial",
    context: "128K",
    fineTune: "Yes",
    soc2: "Yes",
    bestFor: "EU data residency + open-weights.",
  },
  {
    vendor: "Perplexity",
    category: "LLM + Search",
    quality: 4,
    speedMs: 1500,
    cost: "$1.00 / $1.00",
    voice: "No",
    streaming: "Yes",
    tools: "Partial",
    json: "Partial",
    vision: "No",
    context: "127K",
    fineTune: "No",
    soc2: "Yes",
    bestFor: "Search-grounded answers with citations.",
  },
  {
    vendor: "Vapi",
    category: "Voice infra",
    quality: 4,
    speedMs: 750,
    cost: "$0.05/min",
    voice: "Yes",
    streaming: "Yes",
    tools: "Yes",
    json: "Yes",
    vision: "No",
    context: "Model-dep.",
    fineTune: "No",
    soc2: "In progress",
    bestFor: "Production phone agents with telephony built-in.",
  },
  {
    vendor: "ElevenLabs",
    category: "Voice TTS",
    quality: 5,
    speedMs: 400,
    cost: "$0.30/min",
    voice: "Yes",
    streaming: "Yes",
    tools: "Partial",
    json: "No",
    vision: "No",
    context: "n/a",
    fineTune: "Yes",
    soc2: "Yes",
    bestFor: "Most natural-sounding voice cloning + TTS.",
  },
  {
    vendor: "Cartesia",
    category: "Voice TTS",
    quality: 5,
    speedMs: 90,
    cost: "$0.05/min",
    voice: "Yes",
    streaming: "Yes",
    tools: "No",
    json: "No",
    vision: "No",
    context: "n/a",
    fineTune: "Yes",
    soc2: "In progress",
    bestFor: "Sub-100ms voice latency for live agents.",
  },
  {
    vendor: "Custom (TrainYourAgent)",
    category: "Multi-vendor",
    quality: 5,
    speedMs: 500,
    cost: "Project-based",
    voice: "Yes",
    streaming: "Yes",
    tools: "Yes",
    json: "Yes",
    vision: "Yes",
    context: "1M+",
    fineTune: "Yes",
    soc2: "Yes",
    bestFor: "End-to-end SMB voice + chat with fallback chain.",
  },
];

type Col = {
  key: keyof Row;
  label: string;
  sort: "num" | "str";
  width?: string;
};

const COLS: Col[] = [
  { key: "vendor", label: "Vendor", sort: "str", width: "180px" },
  { key: "quality", label: "Quality", sort: "num" },
  { key: "speedMs", label: "Latency", sort: "num" },
  { key: "cost", label: "Cost", sort: "str" },
  { key: "voice", label: "Voice", sort: "str" },
  { key: "streaming", label: "Streaming", sort: "str" },
  { key: "tools", label: "Tools", sort: "str" },
  { key: "json", label: "JSON", sort: "str" },
  { key: "vision", label: "Vision", sort: "str" },
  { key: "context", label: "Context", sort: "str" },
  { key: "fineTune", label: "Fine-tune", sort: "str" },
  { key: "soc2", label: "SOC 2 / HIPAA", sort: "str" },
  { key: "bestFor", label: "Best fit", sort: "str", width: "260px" },
];

function Stars({ n }: { n: number }) {
  return (
    <span
      aria-label={`${n} of 5`}
      title={`${n} of 5`}
      className="inline-flex tracking-widest text-[#185FA5] font-semibold"
    >
      {"★".repeat(n)}
      <span className="text-slate-200">{"★".repeat(5 - n)}</span>
    </span>
  );
}

function CapCell({ v }: { v: string }) {
  const tone =
    v === "Yes"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : v === "No"
      ? "text-rose-700 bg-rose-50 border-rose-200"
      : "text-amber-700 bg-amber-50 border-amber-200";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border ${tone}`}>
      {v}
    </span>
  );
}

export default function VendorMatrix() {
  const [sortKey, setSortKey] = useState<keyof Row>("quality");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [needVoice, setNeedVoice] = useState(false);
  const [needVision, setNeedVision] = useState(false);
  const [needHipaa, setNeedHipaa] = useState(false);

  const rows = useMemo(() => {
    let r = ROWS.filter((row) => {
      if (needVoice && row.voice === "No") return false;
      if (needVision && row.vision === "No") return false;
      if (needHipaa && row.soc2 !== "Yes") return false;
      return true;
    });
    const col = COLS.find((c) => c.key === sortKey);
    r = r.slice().sort((a, b) => {
      const va = a[sortKey] as unknown;
      const vb = b[sortKey] as unknown;
      let cmp = 0;
      if (col?.sort === "num") cmp = (Number(va) || 0) - (Number(vb) || 0);
      else cmp = String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return r;
  }, [sortKey, sortDir, needVoice, needVision, needHipaa]);

  const onSort = (key: keyof Row) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  // Recommendation form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [useCase, setUseCase] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [hp, setHp] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return;
    setState("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          source: "vendor-matrix-recommendation",
          path: location.pathname,
          payload: {
            useCase: useCase.slice(0, 800),
            needVoice,
            needVision,
            needHipaa,
          },
          website: hp,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState("ok");
    } catch {
      setState("err");
    }
  };

  return (
    <ToolLayout
      eyebrow="Free tool"
      title="Pick the right AI vendor"
      italicTail="in 3 minutes."
      subtitle="Ten leading AI vendors compared across twelve evaluation criteria. Sort any column, filter by what you actually need, and pull in a custom recommendation if it's not obvious."
    >
      {/* Filters */}
      <div className="mt-6 mb-4 flex flex-wrap gap-3 items-center text-[13px]">
        <span className="text-slate-600 font-medium">Filter:</span>
        {[
          { k: "voice", l: "I need voice", v: needVoice, set: setNeedVoice },
          { k: "vision", l: "I need vision", v: needVision, set: setNeedVision },
          { k: "hipaa", l: "I need SOC 2 / HIPAA", v: needHipaa, set: setNeedHipaa },
        ].map((f) => (
          <label
            key={f.k}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer min-h-[36px] ${
              f.v ? "bg-[#042C53] text-white border-[#042C53]" : "bg-white border-slate-300 text-slate-700"
            }`}
          >
            <input
              type="checkbox"
              checked={f.v}
              onChange={(e) => f.set(e.target.checked)}
              className="sr-only"
            />
            {f.l}
          </label>
        ))}
        <span className="ml-auto text-[12px] text-slate-500">
          Showing {rows.length} of {ROWS.length}
        </span>
      </div>

      {/* Matrix table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead className="bg-[#F7FAFD]" style={{ color: NAVY }}>
              <tr>
                {COLS.map((c) => {
                  const active = c.key === sortKey;
                  const arrow = active ? (sortDir === "asc" ? " ↑" : " ↓") : "";
                  return (
                    <th
                      key={c.key as string}
                      onClick={() => onSort(c.key)}
                      style={{ width: c.width }}
                      className="px-3 py-3 text-left font-semibold cursor-pointer hover:text-[#185FA5] select-none whitespace-nowrap"
                    >
                      {c.label}{arrow}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.vendor} className={i % 2 ? "bg-slate-50" : "bg-white"}>
                  <td className="px-3 py-3 font-semibold align-top" style={{ color: NAVY }}>
                    {r.vendor}
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">{r.category}</div>
                  </td>
                  <td className="px-3 py-3 align-top"><Stars n={r.quality} /></td>
                  <td className="px-3 py-3 align-top text-slate-700 tabular-nums">{r.speedMs}ms</td>
                  <td className="px-3 py-3 align-top text-slate-700 whitespace-nowrap">{r.cost}</td>
                  <td className="px-3 py-3 align-top"><CapCell v={r.voice} /></td>
                  <td className="px-3 py-3 align-top"><CapCell v={r.streaming} /></td>
                  <td className="px-3 py-3 align-top"><CapCell v={r.tools} /></td>
                  <td className="px-3 py-3 align-top"><CapCell v={r.json} /></td>
                  <td className="px-3 py-3 align-top"><CapCell v={r.vision} /></td>
                  <td className="px-3 py-3 align-top text-slate-700 whitespace-nowrap">{r.context}</td>
                  <td className="px-3 py-3 align-top"><CapCell v={r.fineTune} /></td>
                  <td className="px-3 py-3 align-top"><CapCell v={r.soc2} /></td>
                  <td className="px-3 py-3 align-top text-slate-700">{r.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendation lead capture */}
      <section className="mt-10 rounded-2xl bg-[#E6F1FB] p-6 sm:p-8">
        {state === "ok" ? (
          <div>
            <h3 className="text-[20px] font-semibold mb-1.5" style={{ color: NAVY }}>
              On it — we'll reply within 4 business hours.
            </h3>
            <p className="text-[14px] text-slate-700">
              We log requests as they come in. Expect a real, named recommendation
              with the stack we'd actually ship for you.
            </p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: BLUE }}>
              Want a custom recommendation?
            </div>
            <h3 className="text-[22px] sm:text-[26px] font-semibold mb-3" style={{ color: NAVY }}>
              Tell us what you're building.
            </h3>
            <p className="text-[14px] text-slate-700 mb-5 max-w-2xl">
              We'll reply with a named recommendation — the exact vendor combo
              we'd actually ship for your use case, not generic advice.
            </p>
            <label className="sr-only" aria-hidden>
              Leave blank
              <input type="text" tabIndex={-1} value={hp} onChange={(e) => setHp(e.target.value)} />
            </label>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
              />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
              />
            </div>
            <textarea
              placeholder="What are you building? Voice, chat, RAG, agent platform, something else?"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value.slice(0, 800))}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="mt-4 px-6 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
            >
              {state === "sending" ? "Sending…" : "Get my custom recommendation →"}
            </button>
            {state === "err" && (
              <p className="mt-3 text-[12.5px] text-red-700">
                Hit a snag — try again or email hello@trainyouragent.com.
              </p>
            )}
          </form>
        )}
      </section>

      {/* Sources */}
      <p className="mt-8 text-[12px] text-slate-500 leading-relaxed">
        Pricing from vendor pricing pages as of May 2026. Capability claims from
        vendor product pages. Latency figures are approximate first-token
        latency from independent benchmarks at{" "}
        <a
          href="https://artificialanalysis.ai"
          target="_blank"
          rel="noopener"
          className="text-[#185FA5] underline decoration-[#185FA5]/30 hover:decoration-[#185FA5]"
        >
          artificialanalysis.ai
        </a>{" "}
        and our own internal measurements. Capabilities change rapidly — confirm
        before you commit to a vendor. SOC 2 / HIPAA status reflects publicly
        disclosed availability of a signed BAA or active SOC 2 report; in
        progress means the vendor has publicly stated the audit is underway.
      </p>

      <div className="mt-6 text-[13px]">
        <Link to="/tools" className="text-[#185FA5] font-medium hover:underline">
          ← All free tools
        </Link>
      </div>
    </ToolLayout>
  );
}
