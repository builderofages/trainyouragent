// src/components/NewsletterCapture.tsx
// Email opt-in component. Wire FORM_ENDPOINT to your Resend/Formspree/Mailchimp.
// Falls back to mailto if no endpoint is configured.

import { useState } from "react";

const FORM_ENDPOINT = "/api/lead"; // wired to api/lead.ts (set RESEND_API_KEY + SLACK_WEBHOOK_URL on Vercel)

type Variant = "inline" | "card" | "footer";

export default function NewsletterCapture({
  variant = "inline",
  heading = "Real builds, real numbers. In your inbox.",
  sub = "Once a week. No fluff. The actual builds we shipped, the numbers they moved, the tools we used. Unsubscribe in one click.",
}: { variant?: Variant; heading?: string; sub?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("sending");
    try {
      if (FORM_ENDPOINT) {
        const r = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email, source: "newsletter", path: typeof location !== "undefined" ? location.pathname : "" }),
        });
        if (!r.ok) throw new Error("Submit failed");
      } else {
        // Fallback: store locally + open mailto
        try { window.localStorage.setItem("tya:newsletter:" + Date.now(), email); } catch {}
        window.location.href = `mailto:hello@trainyouragent.com?subject=Newsletter%20signup&body=Email:%20${encodeURIComponent(email)}`;
      }
      setState("ok");
      setEmail("");
    } catch {
      setState("err");
    }
  };

  if (variant === "footer") {
    return (
      <form onSubmit={submit} className="flex gap-2 items-stretch" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
               placeholder="you@company.com"
               className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-[13px] focus:outline-none focus:border-[#185FA5]" />
        <button type="submit" disabled={state === "sending"}
                className="px-4 py-2 rounded-lg bg-[#042C53] text-white text-[13px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50">
          {state === "ok" ? "Subscribed" : state === "sending" ? "…" : "Subscribe"}
        </button>
      </form>
    );
  }

  const wrap = variant === "card"
    ? "rounded-3xl bg-[#F6FAFE] border border-slate-200 p-7 sm:p-10"
    : "p-0";

  return (
    <div className={wrap} style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">Newsletter</div>
      <h3 className="text-[24px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-3">{heading}</h3>
      <p className="text-[14px] text-slate-700 leading-relaxed mb-5 max-w-xl">{sub}</p>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 items-stretch max-w-xl">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
               placeholder="Work email"
               className="flex-1 px-4 py-3 rounded-lg bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5]" />
        <button type="submit" disabled={state === "sending"}
                className="px-5 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50 whitespace-nowrap">
          {state === "ok" ? "Subscribed ✓" : state === "sending" ? "Sending…" : "Subscribe →"}
        </button>
      </form>
      {state === "err" && <div className="mt-3 text-[12px] text-[#B23] italic">Couldn't reach the server. Try again or email hello@trainyouragent.com.</div>}
    </div>
  );
}
