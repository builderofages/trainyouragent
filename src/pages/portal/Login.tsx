// src/pages/portal/Login.tsx
// v76-a: Email-only magic-link sign-in. Honest copy — this is for customers
// only; prospects are sent to /cal.

import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const NAVY = "#042C53";
const CREAM = "#FAF6EE";
const CAL_URL = "https://cal.com/trainyouragent/30min";

export default function PortalLogin() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/portal/magic-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && j.ok) {
        setSent(true);
      } else if (res.status === 429) {
        setError("Too many sign-in requests. Try again in an hour.");
      } else {
        setError("We couldn't send the sign-in email. Email alexander@trainyouragent.com.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: CREAM, color: NAVY }}>
      <Helmet>
        <title>Customer Portal Sign In · TrainYourAgent</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 mb-8" style={{ color: NAVY }}>
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
            <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
            <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
          </svg>
          <span className="text-[15px] font-medium tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
            TrainYourAgent
          </span>
        </Link>

        <h1 className="text-[28px] leading-[1.15] tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
          Sign in to the <em className="not-italic" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: "italic" }}>customer portal</em>
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: "rgba(4,44,83,0.7)" }}>
          We'll email you a one-tap sign-in link. No password to remember.
        </p>

        {sent ? (
          <div
            className="mt-8 rounded-xl border p-6"
            style={{ background: "white", borderColor: "rgba(4,44,83,0.12)" }}
          >
            <div className="text-[15px] font-medium" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
              Check your email
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: "rgba(4,44,83,0.7)" }}>
              If <strong>{email}</strong> is a TrainYourAgent customer account, a sign-in link is on its way.
              The link expires in 1 hour. Check spam if it doesn't arrive within 2 minutes.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="mt-4 text-[12.5px] underline"
              style={{ color: NAVY }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-3">
            <label className="block text-[12.5px] uppercase tracking-[0.14em]" style={{ color: "rgba(4,44,83,0.55)" }}>
              Email
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourcompany.com"
              className="w-full px-4 py-3 rounded-md border bg-white text-[15px]"
              style={{ borderColor: "rgba(4,44,83,0.18)", color: NAVY, fontFamily: "Inter Tight, system-ui, sans-serif" }}
            />
            {error && (
              <div className="text-[13px]" style={{ color: "#b91c1c" }}>{error}</div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-md text-[14.5px] font-medium transition-opacity disabled:opacity-60"
              style={{ background: NAVY, color: CREAM, fontFamily: "Inter Tight, system-ui, sans-serif" }}
            >
              {submitting ? "Sending…" : "Email me a sign-in link"}
            </button>
          </form>
        )}

        <div className="mt-10 pt-6 border-t text-[12.5px] leading-relaxed" style={{ borderColor: "rgba(4,44,83,0.08)", color: "rgba(4,44,83,0.6)" }}>
          Customer portal access only. If you're not a TrainYourAgent customer yet,{" "}
          <a href={CAL_URL} className="underline" style={{ color: NAVY }} rel="noreferrer">book a call</a>.
        </div>
      </div>
    </div>
  );
}
