// src/components/LeadMagnetForm.tsx
// v52a: Inline email opt-in for lead magnets. Drop in anywhere — Home, Report,
// per-niche playbook pages. On success, /api/lead auto-sends the PDF via Resend
// (api/_lib/resend.ts) so the user gets a real email in ~30 seconds.
//
// Differs from LeadMagnetModal:
//   - Inline (no modal), composes into a section, supports compact/wide layouts
//   - Source defaults to "lead-magnet-buyers-guide" but is overridable per page
//   - Has an opt-in checkbox for "ship notes" (sent to beehiiv via subscribeToNewsletter)

import { useEffect, useState } from "react";

type Props = {
  /** Lead source — must match an entry in api/lead.ts ALLOWED_SOURCES. */
  source?: string;
  /** Headline above the form. */
  title?: string;
  /** Sub-headline / value prop. */
  subtitle?: string;
  /** Button label before submit. */
  cta?: string;
  /** What the user gets, shown as bullet list (optional). */
  bullets?: string[];
  /** Inline newsletter opt-in checkbox copy. */
  newsletterOptInCopy?: string;
  /** Compact = no card chrome, just the form. */
  compact?: boolean;
  /** Hide the newsletter opt-in entirely (default: shown, defaults checked). */
  hideNewsletterOptIn?: boolean;
  /** Optional preset name to skip the name field. */
  hideNameField?: boolean;
  /** Style: light card on tinted bg (default) or dark card on navy hero. */
  variant?: "light" | "dark";
};

const ENDPOINT = "/api/lead";

export default function LeadMagnetForm({
  source = "lead-magnet-buyers-guide",
  title = "Get the AI Operations Playbook",
  subtitle = "30 pages on what's working in AI agents in 2026 — voice, chat, ROI benchmarks, the 7 reasons most pilots die. Free PDF, emailed to you in ~30 seconds.",
  cta = "Email me the playbook →",
  bullets,
  newsletterOptInCopy = "Send me one ship-notes email a week (no fluff, unsubscribe any time).",
  compact = false,
  hideNewsletterOptIn = false,
  hideNameField = false,
  variant = "light",
}: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscribe, setSubscribe] = useState(true);
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Pre-fill from any prior pathway capture.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tya:pathway");
      if (!raw) return;
      const obj = JSON.parse(raw) as { email?: string; name?: string };
      if (obj?.email && !email) setEmail(obj.email);
      if (obj?.name && !name) setName(obj.name);
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!email || !/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/.test(email)) {
      setErrorMsg("That email looks off — double check?");
      return;
    }
    setErrorMsg("");
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          source,
          path: typeof location !== "undefined" ? location.pathname : undefined,
          subscribeToNewsletter: subscribe,
          website: hp, // honeypot — must be empty
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("ok");
    } catch (e) {
      setStatus("err");
      setErrorMsg((e as Error).message || "Something went wrong. Try again.");
    }
  };

  const isDark = variant === "dark";
  const wrapperCls = compact
    ? ""
    : isDark
    ? "p-6 sm:p-8 rounded-2xl bg-[#042C53] text-white border border-white/10"
    : "p-6 sm:p-8 rounded-2xl bg-white border border-[#E6F1FB] shadow-sm";

  if (status === "ok") {
    return (
      <div className={wrapperCls} style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isDark ? "bg-white/15" : "bg-[#E6F1FB]"
          }`}>
            <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? "#FFFFFF" : "#042C53"} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h3 className={`text-[20px] font-semibold mb-1 ${isDark ? "text-white" : "text-[#042C53]"}`}>
              Check your inbox in ~30 seconds.
            </h3>
            <p className={`text-[14px] leading-relaxed ${isDark ? "text-[#E6F1FB]" : "text-slate-600"}`}>
              We just sent <strong>{email}</strong> the playbook PDF + a short note from Alexander.
              If it doesn't show up, peek in spam — and feel free to reply to that email with any
              question. It goes to a real inbox.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={wrapperCls}
      style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}
      noValidate
    >
      {!compact && (
        <div className="mb-5">
          <h3 className={`text-[22px] sm:text-[26px] font-semibold leading-tight ${
            isDark ? "text-white" : "text-[#042C53]"
          }`}>
            {title}
          </h3>
          <p className={`mt-2 text-[14px] leading-relaxed ${
            isDark ? "text-[#E6F1FB]/90" : "text-slate-600"
          }`}>
            {subtitle}
          </p>
          {bullets && bullets.length > 0 && (
            <ul className={`mt-4 space-y-1.5 text-[13px] ${isDark ? "text-[#E6F1FB]" : "text-slate-700"}`}>
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className={`mt-1 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    isDark ? "bg-white/70" : "bg-[#185FA5]"
                  }`} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Honeypot — kept off-screen */}
      <label className="sr-only" aria-hidden>
        Leave this field empty
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          name="website"
        />
      </label>

      <div className={`flex flex-col ${hideNameField ? "" : "sm:flex-row"} gap-2`}>
        {!hideNameField && (
          <input
            type="text"
            placeholder="Your first name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="given-name"
            className={`flex-1 px-4 py-3 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] ${
              isDark
                ? "bg-white/10 border border-white/20 text-white placeholder-white/60"
                : "border border-slate-300 bg-white text-[#042C53] placeholder-slate-400"
            }`}
          />
        )}
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className={`flex-1 px-4 py-3 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] ${
            isDark
              ? "bg-white/10 border border-white/20 text-white placeholder-white/60"
              : "border border-slate-300 bg-white text-[#042C53] placeholder-slate-400"
          }`}
        />
      </div>

      {!hideNewsletterOptIn && (
        <label className={`mt-3 flex items-start gap-2 text-[13px] cursor-pointer select-none ${
          isDark ? "text-[#E6F1FB]" : "text-slate-600"
        }`}>
          <input
            type="checkbox"
            checked={subscribe}
            onChange={(e) => setSubscribe(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#185FA5]"
          />
          <span>{newsletterOptInCopy}</span>
        </label>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className={`mt-4 w-full sm:w-auto px-6 py-3 rounded-full font-semibold text-[14px] transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#185FA5]/30 disabled:opacity-60 disabled:cursor-wait ${
          isDark
            ? "bg-white text-[#042C53] hover:bg-[#E6F1FB]"
            : "bg-[#042C53] text-white hover:bg-[#0A3E73]"
        }`}
      >
        {status === "sending" ? "Sending…" : cta}
      </button>

      {(status === "err" || errorMsg) && (
        <p className={`mt-3 text-[13px] ${isDark ? "text-rose-200" : "text-rose-700"}`}>
          {errorMsg || "Something went wrong — try again or email hello@trainyouragent.com."}
        </p>
      )}

      <p className={`mt-4 text-[11px] leading-relaxed ${isDark ? "text-white/55" : "text-slate-400"}`}>
        No spam. Unsubscribe in one click. We never share your email.
      </p>
    </form>
  );
}
