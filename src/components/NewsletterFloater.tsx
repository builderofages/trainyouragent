// src/components/NewsletterFloater.tsx
// Slides in from bottom-right after 30s on a blog post page.
// One-time per session via sessionStorage.

import { useEffect, useState } from "react";

const SESSION_KEY = "tya:newsletter-floater-shown";
const DELAY_MS = 30000;

export default function NewsletterFloater() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // ignore — storage might be disabled
    }
    const t = window.setTimeout(() => {
      setOpen(true);
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore
      }
    }, DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "newsletter-floater",
          path: typeof location !== "undefined" ? location.pathname : "",
          subscribeToNewsletter: true,
        }),
      });
      if (!r.ok) throw new Error("fail");
      setState("ok");
      setEmail("");
      window.setTimeout(() => setOpen(false), 1800);
    } catch {
      setState("err");
    }
  };

  return (
    <div
      className="fixed bottom-5 right-5 z-50 max-w-sm animate-[slideInUp_.45s_ease-out]"
      style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}
    >
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px) translateX(20px); }
          to   { opacity: 1; transform: translateY(0) translateX(0); }
        }
      `}</style>
      <div className="rounded-2xl bg-white border border-slate-200 shadow-2xl p-5 relative">
        <button
          onClick={() => setOpen(false)}
          aria-label="Dismiss"
          className="absolute top-2 right-2 w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-lg"
        >
          ×
        </button>
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-1">
          Newsletter
        </div>
        <div className="text-[16px] font-semibold text-[#042C53] leading-snug mb-2">
          Get the next post in your inbox.
        </div>
        <div className="text-[12px] text-slate-600 mb-3 leading-relaxed">
          Once a week. Real builds, real numbers.
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-[13px] focus:outline-none focus:border-[#185FA5]"
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="px-3 py-2 rounded-lg bg-[#042C53] text-white text-[13px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50"
          >
            {state === "ok" ? "✓" : state === "sending" ? "…" : "Join"}
          </button>
        </form>
        {state === "err" && (
          <div className="mt-2 text-[11px] text-[#B23]">
            Try again or email hello@trainyouragent.com.
          </div>
        )}
      </div>
    </div>
  );
}
