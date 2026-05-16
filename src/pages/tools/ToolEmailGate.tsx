// src/pages/tools/ToolEmailGate.tsx
// v41: post-result email capture that wires to /api/lead.
// Pattern: show ONLY after the user already sees the result above.

import { useState, type FormEvent } from "react";

type Props = {
  source: string; // e.g. "tool:cost-estimator"
  reportName?: string; // displayed in copy
  payload?: unknown;   // attached so admin can see what they computed
};

export default function ToolEmailGate({ source, reportName = "your custom report", payload }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setErr("Please enter a valid email.");
      return;
    }
    setStatus("sending");
    setErr(null);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          path: typeof window !== "undefined" ? window.location.pathname : undefined,
          payload,
          website: "", hp: "", // honeypots empty
        }),
      });
      if (r.ok) setStatus("done");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6"
      >
        <div className="text-[15px] font-semibold text-emerald-800 mb-1">
          Thanks — {reportName} is on the way.
        </div>
        <div className="text-[13px] text-emerald-700">
          Check your inbox in the next few minutes. We'll also send a 3-step playbook
          for actually putting this savings to work.
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
      aria-label="Email gate"
    >
      <div className="text-[15px] font-semibold mb-1 text-[#042C53]">
        Want this as a PDF you can send to your CFO?
      </div>
      <div className="text-[13px] text-slate-600 mb-4">
        Drop your email — we'll send {reportName} plus a short playbook for next steps.
        No spam, unsub any time.
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <label className="sr-only" htmlFor={`email-${source}`}>Email</label>
        <input
          id={`email-${source}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-label="Email address"
          className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-[14px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
        />
        {/* honeypots */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <button
          type="submit"
          disabled={status === "sending"}
          className="px-5 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-medium hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
        >
          {status === "sending" ? "Sending…" : "Send me the PDF"}
        </button>
      </div>
      {err && <div role="alert" className="mt-2 text-[12px] text-red-600">{err}</div>}
      {status === "error" && (
        <div role="alert" className="mt-2 text-[12px] text-red-600">
          Something broke. Try again or email hello@trainyouragent.com.
        </div>
      )}
    </form>
  );
}
