// src/pages/tools/WebsiteAudit.tsx
// v59 — AI website audit tool. Paste a URL, get a personalized AI-opportunity
// report. Powered by /api/website-audit which fetches the site, extracts
// signals, and asks our LLM router for 5 specific opportunities.

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import ToolLayout, { NAVY, BLUE, TINT } from "./ToolLayout";
import ToolEmailGate from "./ToolEmailGate";

type Priority = "high" | "medium" | "low";
type Opportunity = {
  title: string;
  problem: string;
  solution: string;
  outcome: string;
  stack: string;
  priority: Priority;
};
type AuditResult = {
  ok: true;
  url: string;
  company: string;
  summary: string;
  opportunities: Opportunity[];
  next_step: string;
  provider: string;
  signals: Record<string, unknown>;
};

const LOADING_MESSAGES = [
  "Fetching your site…",
  "Parsing structure and signals…",
  "Analyzing what your business does…",
  "Identifying the highest-ROI AI plays…",
  "Drafting your audit report…",
];

function PriorityBadge({ p }: { p: Priority }) {
  const style =
    p === "high"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : p === "medium"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-slate-50 text-slate-700 border-slate-200";
  const label = p === "high" ? "High priority" : p === "medium" ? "Medium" : "Strategic";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-[0.08em] ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {label}
    </span>
  );
}

export default function WebsiteAudit() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const tickRef = useRef<number | null>(null);

  // Read ?url= from query for shareable links — auto-run if present.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const q = new URLSearchParams(window.location.search);
      const u = q.get("url");
      if (u) {
        setUrl(u);
        // small delay so React renders the input value first
        setTimeout(() => runAudit(u), 50);
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cycle loading messages every 1.6s while loading.
  useEffect(() => {
    if (state !== "loading") {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
      return;
    }
    setLoadingIdx(0);
    tickRef.current = window.setInterval(() => {
      setLoadingIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1600);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [state]);

  const runAudit = async (raw?: string) => {
    const target = (raw ?? url).trim();
    if (!target) { setErr("Enter a URL — e.g. stripe.com"); return; }
    setErr(null);
    setResult(null);
    setState("loading");
    setCopied(false);
    try {
      const r = await fetch("/api/website-audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const j = (await r.json()) as { ok?: boolean; error?: string } & Partial<AuditResult>;
      if (!r.ok || !j.ok) {
        const msg =
          j.error === "rate-limited" ? "You've hit the free hourly limit — try again in an hour, or book a call." :
          j.error === "invalid-url" ? "That URL looks invalid. Try a public business site." :
          j.error === "fetch-failed" ? "We couldn't reach that site. Is it publicly reachable?" :
          j.error === "llm-offline" ? "The audit engine is briefly offline. Try again in 60 seconds." :
          "Something went sideways. Try again or pick a different URL.";
        setErr(msg);
        setState("error");
        return;
      }
      setResult(j as AuditResult);
      setState("done");
      // Update query string for shareability — no full reload.
      try {
        const next = new URL(window.location.href);
        next.searchParams.set("url", target);
        window.history.replaceState(null, "", next.toString());
      } catch { /* ignore */ }
    } catch {
      setErr("Network blip. Try again in a moment.");
      setState("error");
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    runAudit();
  };

  const reset = () => {
    setUrl("");
    setResult(null);
    setState("idle");
    setErr(null);
    try {
      const next = new URL(window.location.href);
      next.searchParams.delete("url");
      window.history.replaceState(null, "", next.toString());
    } catch { /* ignore */ }
  };

  const shareLink = useMemo(() => {
    if (!result) return "";
    try {
      const u = new URL(typeof window !== "undefined" ? window.location.href : "https://www.trainyouragent.com/tools/website-audit");
      u.searchParams.set("url", result.url);
      return u.toString();
    } catch { return ""; }
  }, [result]);

  const copyShare = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  };

  return (
    <ToolLayout
      eyebrow="Free AI audit · 30 seconds"
      title="Paste your site —"
      italicTail="see where AI fits."
      subtitle="Drop your URL. Our system fetches it, reads it, and returns five concrete AI-agent opportunities — with priority, expected outcomes, and the exact integration stack we'd build."
    >
      <form onSubmit={submit} className="mt-8" aria-label="Website audit form">
        <label htmlFor="audit-url" className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">
          Your website URL
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="audit-url"
            type="url"
            inputMode="url"
            autoComplete="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourbusiness.com"
            disabled={state === "loading"}
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[48px]"
            aria-label="Website URL"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="px-6 py-3 rounded-lg bg-[#042C53] text-white text-[15px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[48px] whitespace-nowrap"
          >
            {state === "loading" ? "Auditing…" : "Run audit →"}
          </button>
        </div>
        <div className="mt-2 text-[12px] text-slate-500">
          Public URLs only. We don't log your audit. Rate-limited to 5 per hour per IP.
        </div>
        {err && (
          <div role="alert" className="mt-3 text-[13px] text-red-600">
            {err}
          </div>
        )}
      </form>

      {state === "loading" && (
        <div
          aria-live="polite"
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div className="flex items-center gap-3">
            <span className="relative inline-flex w-2.5 h-2.5" aria-hidden="true">
              <span className="absolute inset-0 rounded-full bg-[#185FA5] opacity-75 animate-ping" />
              <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-[#185FA5]" />
            </span>
            <div className="text-[15px] font-semibold" style={{ color: NAVY }}>
              {LOADING_MESSAGES[loadingIdx]}
            </div>
          </div>
          <div className="mt-4 h-1.5 rounded-full overflow-hidden bg-slate-100">
            <div
              className="h-full bg-[#185FA5] transition-all"
              style={{ width: `${20 + loadingIdx * 18}%` }}
            />
          </div>
          <div className="mt-3 text-[12px] text-slate-500">
            Typically 8–15 seconds. We're fetching your site, parsing it, and calling the model.
          </div>
        </div>
      )}

      {state === "done" && result && (
        <section className="mt-10" aria-live="polite">
          {/* Header card */}
          <div className="rounded-2xl border p-6" style={{ background: TINT, borderColor: BLUE }}>
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1.5">
              Audit complete · {result.provider}
            </div>
            <h2 className="text-[26px] sm:text-[30px] font-semibold leading-tight" style={{ color: NAVY }}>
              {result.company}
            </h2>
            <p className="mt-3 text-[15px] text-slate-700 leading-relaxed">
              {result.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={copyShare}
                className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-[12px] font-medium hover:border-[#185FA5]"
              >
                {copied ? "Link copied ✓" : "Copy shareable link"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-[12px] font-medium hover:border-[#185FA5]"
              >
                Try another site →
              </button>
            </div>
          </div>

          {/* Opportunities */}
          <div className="mt-6 space-y-3">
            {result.opportunities.map((o, i) => (
              <article
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="text-[12px] font-semibold tracking-[0.1em] uppercase"
                      style={{ color: BLUE }}
                    >
                      #{i + 1}
                    </span>
                    <h3 className="text-[18px] font-semibold leading-tight" style={{ color: NAVY }}>
                      {o.title}
                    </h3>
                  </div>
                  <PriorityBadge p={o.priority} />
                </div>
                <Field label="Problem"      text={o.problem} />
                <Field label="Solution"     text={o.solution} />
                <Field label="Expected outcome" text={o.outcome} />
                <Field label="Stack"        text={o.stack} mono />
              </article>
            ))}
          </div>

          {/* Next step */}
          {result.next_step && (
            <div className="mt-6 rounded-2xl bg-[#042C53] text-white p-6 sm:p-7">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#9CC4EC] font-semibold mb-2">
                Your next step
              </div>
              <p className="text-[16px] sm:text-[17px] leading-relaxed">
                {result.next_step}
              </p>
            </div>
          )}

          {/* Email gate — only after results are visible */}
          <ToolEmailGate
            source="tool:website-audit"
            reportName="this audit as a branded PDF + the AI Operations Playbook"
            payload={{
              url: result.url,
              company: result.company,
              opportunity_count: result.opportunities.length,
              top_priority: result.opportunities[0]?.title,
              provider: result.provider,
            }}
          />

          <p className="mt-6 text-[12px] text-slate-500">
            Audit generated by our multi-provider LLM router. Signals extracted from public HTML only —
            we don't crawl deeper than the page you submitted.
          </p>
        </section>
      )}
    </ToolLayout>
  );
}

function Field({ label, text, mono = false }: { label: string; text: string; mono?: boolean }) {
  if (!text) return null;
  return (
    <div className="mt-2.5">
      <div className="text-[10.5px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-0.5">
        {label}
      </div>
      <p
        className={
          "text-[14px] text-slate-700 leading-[1.6] " +
          (mono ? "font-mono text-[13px]" : "")
        }
      >
        {text}
      </p>
    </div>
  );
}
