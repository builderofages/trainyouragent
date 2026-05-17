// src/pages/tools/PromptLibrary.tsx
// v44 tool: 60 production prompts. Client-side search + filter. Copy gate after 3 copies.

import { useMemo, useState, useEffect } from "react";
import ToolLayout, { NAVY, BLUE } from "./ToolLayout";
import ToolEmailGate from "./ToolEmailGate";
import { PROMPTS, type Prompt } from "./promptLibraryData";

const CATEGORIES: Prompt["category"][] = ["Sales", "Ops", "Marketing", "Support"];
const STORAGE_KEY = "tya_pl_copy_count";

export default function PromptLibrary() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<"All" | Prompt["category"]>("All");
  const [copies, setCopies] = useState<number>(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [gateDismissed, setGateDismissed] = useState(false);

  // Read existing copy count from sessionStorage (resets per tab session)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const v = parseInt(sessionStorage.getItem(STORAGE_KEY) || "0", 10);
      if (!Number.isNaN(v)) setCopies(v);
    } catch { /* ignore */ }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROMPTS.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.useCase.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [query, cat]);

  const copy = async (p: Prompt) => {
    try {
      await navigator.clipboard.writeText(p.body);
      setCopied(p.id);
      setTimeout(() => setCopied((c) => (c === p.id ? null : c)), 1500);
      const next = copies + 1;
      setCopies(next);
      try { sessionStorage.setItem(STORAGE_KEY, String(next)); } catch { /* ignore */ }
      if (next >= 3 && !gateDismissed) setGateOpen(true);
    } catch {
      // Fallback: select the text
      const ta = document.createElement("textarea");
      ta.value = p.body;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      document.body.removeChild(ta);
      setCopied(p.id);
    }
  };

  return (
    <ToolLayout
      eyebrow="Tool · Prompt Library"
      title="60 production prompts you can"
      italicTail="copy and ship today."
      subtitle="Curated by category. Real prompts we use in production for sales, ops, marketing, and support. No fluff, no placeholders."
    >
      {/* Filter bar */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <label className="sr-only" htmlFor="pl-search">Search prompts</label>
        <input
          id="pl-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, use case, or keyword…"
          className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-[14px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
        />
        <div role="tablist" aria-label="Category filter" className="flex flex-wrap gap-2">
          {(["All", ...CATEGORIES] as const).map((c) => {
            const active = cat === c;
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCat(c as typeof cat)}
                className={`px-3.5 py-2 rounded-full text-[13px] font-medium border min-h-[36px] transition ${
                  active
                    ? "bg-[#042C53] text-white border-[#042C53]"
                    : "bg-white text-[#042C53] border-slate-300 hover:border-[#185FA5]"
                }`}
              >
                {c}
                <span className="ml-1.5 text-[11px] opacity-70">
                  {c === "All" ? PROMPTS.length : PROMPTS.filter((p) => p.category === c).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Result count */}
      <div className="mt-4 text-[12px] text-slate-500">
        Showing <strong>{filtered.length}</strong> of {PROMPTS.length} · Copied {copies} so far this session
      </div>

      {/* Cards */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <article
            key={p.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] font-semibold mb-1" style={{ color: BLUE }}>
                  {p.category}
                </div>
                <h2 className="text-[16px] font-semibold leading-snug" style={{ color: NAVY }}>
                  {p.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => copy(p)}
                aria-label={`Copy prompt: ${p.title}`}
                className="shrink-0 px-3 py-2 rounded-lg bg-[#042C53] text-white text-[12px] font-semibold hover:bg-[#0A3D6E] min-h-[36px]"
              >
                {copied === p.id ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="text-[13px] text-slate-600 mb-3">{p.useCase}</div>
            <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[12.5px] text-slate-800 whitespace-pre-wrap break-words font-mono leading-relaxed max-h-64 overflow-y-auto">
{p.body}
            </pre>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-10 text-center text-[14px] text-slate-500">
            No prompts match. Try a broader search or switch category.
          </div>
        )}
      </div>

      {/* Modal email gate after 3 copies */}
      {gateOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pl-gate-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
          onClick={() => { setGateOpen(false); setGateDismissed(true); }}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: BLUE }}>
              You're using these
            </div>
            <h3 id="pl-gate-title" className="text-[20px] font-semibold mb-2" style={{ color: NAVY }}>
              Want the full library + monthly drops?
            </h3>
            <p className="text-[14px] text-slate-600 mb-4">
              Drop your email and we'll send the editable Notion version plus a new batch every month.
            </p>
            <ToolEmailGate
              source="tool:prompt-library"
              reportName="the Prompt Library Notion + monthly drops"
              payload={{ copies, lastCategory: cat }}
            />
            <button
              type="button"
              onClick={() => { setGateOpen(false); setGateDismissed(true); }}
              className="mt-3 text-[12.5px] text-slate-500 hover:text-slate-700 underline"
            >
              No thanks, keep copying
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
