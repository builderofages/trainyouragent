import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fireEvent } from "@/lib/event";

/**
 * LiveLeakTicker (v131)
 *
 * Floating bottom-right pill that counts dollars-leaked-since-page-load,
 * pegged to the $4.62/min industry stat (Salesforce 2024 missed-call cost
 * study) that we already cite on /apply. Hormozi-style "pain visible in
 * real time" lever — the visitor literally watches their counter rise.
 *
 * Conversion path: visible → impression GA event → click CTA → /apply
 * where the lead form already lives. Now that GA4_MEASUREMENT_ID is
 * wired (v126), every step is measurable in the Echo Chain property's
 * TrainYourAgent Site stream (G-H6V6YEXE37).
 *
 * Mount on Index.tsx only — don't put on /apply itself (would be
 * redundant + the live counter is already in the hero there).
 *
 * Dismissable. Sticks dismissed state in localStorage for 24h.
 */

const LS_KEY = "tya_leak_ticker_dismissed_at";
const SHOW_AFTER_MS = 6_000; // give the visitor time to scan the hero first
const HIDE_FOR_HOURS = 24;
const DOLLARS_PER_SECOND = 4.62 / 60; // $4.62/min industry stat

function shouldShow(): boolean {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return true;
    const dismissedAt = parseInt(raw, 10);
    if (Number.isNaN(dismissedAt)) return true;
    const elapsed = Date.now() - dismissedAt;
    return elapsed > HIDE_FOR_HOURS * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

function fmt(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function LiveLeakTicker() {
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const startedAt = useRef<number>(Date.now());
  const firedImpression = useRef(false);

  useEffect(() => {
    if (!shouldShow()) return;
    const t = window.setTimeout(() => {
      startedAt.current = Date.now();
      setVisible(true);
    }, SHOW_AFTER_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    // Fire impression event exactly once when first shown.
    if (!firedImpression.current) {
      firedImpression.current = true;
      fireEvent("leak_ticker_impression", {
        delay_ms: SHOW_AFTER_MS,
      });
    }
    const id = window.setInterval(() => {
      const seconds = (Date.now() - startedAt.current) / 1000;
      setAmount(seconds * DOLLARS_PER_SECOND);
    }, 250);
    return () => window.clearInterval(id);
  }, [visible]);

  function dismiss() {
    try {
      localStorage.setItem(LS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    fireEvent("leak_ticker_dismissed", {
      amount_shown: Number(amount.toFixed(2)),
    });
    setVisible(false);
  }

  function onCtaClick() {
    fireEvent("leak_ticker_cta_click", {
      amount_shown: Number(amount.toFixed(2)),
    });
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Live revenue leak counter"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 60,
        maxWidth: 320,
        pointerEvents: "auto",
      }}
      className="rounded-2xl shadow-2xl ring-1 ring-black/10 backdrop-blur-md bg-white/95 px-4 py-3 text-[#042C53] animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss live leak counter"
        className="absolute top-1.5 right-2 text-xs text-[#042C53]/40 hover:text-[#042C53] leading-none"
      >
        ×
      </button>

      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-red-600/90">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"
          style={{ animation: "pulse 1.4s ease-in-out infinite" }}
        />
        Leaking right now
      </div>

      <div className="mt-1.5 font-mono text-2xl font-bold tabular-nums tracking-tight">
        {fmt(amount)}
      </div>

      <p className="mt-1 text-[11px] leading-snug text-[#042C53]/70">
        Industry avg: missed-call cost runs <strong>$4.62/min</strong> for local
        SMBs. Counter started when you opened the page.
      </p>

      <Link
        to="/apply"
        onClick={onCtaClick}
        className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold underline decoration-2 underline-offset-2 hover:text-red-600 transition-colors"
      >
        Stop the leak <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
