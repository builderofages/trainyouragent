// src/components/CalEmbed.tsx
// Inline Cal.com embed using the official cal-embed.js script.
// No new-tab handoff — visitor books from the page.
//
// v33c: also fires an abandoned-booking signal to /api/booking-abandoned when
// the visitor opened the embed and progressed past the "select a time" step
// but never confirmed. Two firing paths:
//   1. Cal.com postMessage events — when we see __cal-event-type-view (opened),
//      __cal-booking-form-view (picked time), and we DON'T see
//      __cal-booking-successful before unmount/unload, fire abandon.
//   2. beforeunload / pagehide / visibilitychange fallback — for browsers
//      that throttle postMessage on tab switch.

import { useEffect, useRef } from "react";

const CAL_LINK = "trainyouragent/30min";
const ABANDON_ENDPOINT = "/api/booking-abandoned";

type Props = {
  height?: number;
  // Vertical key — used to scope the beehiiv abandon tag (e.g. "healthcare").
  // Defaults to "general" for the global cal page.
  vertical?: string;
  // Optional pre-known email (e.g. captured in a prior step on the funnel).
  // Without it we can't fire the abandon signal — the email IS the lead.
  email?: string;
};

export default function CalEmbed({ height = 680, vertical = "general", email }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!document.getElementById("cal-embed-script")) {
      const s = document.createElement("script");
      s.id = "cal-embed-script";
      s.innerHTML = `(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init"); Cal("init", "30min", {origin:"https://cal.com"}); Cal.ns["30min"]("inline", { elementOrSelector: "#cal-inline-30min", calLink: "${CAL_LINK}", layout: "month_view" }); Cal.ns["30min"]("ui", { theme: "light", cssVarsPerTheme: {"light":{"cal-brand":"#042C53"}}, hideEventTypeDetails: false });`;
      document.head.appendChild(s);
    }
  }, []);

  // v33c — abandoned booking detection.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!email) return; // can't recover without an address

    let opened = false;       // saw the embed at all
    let pickedTime = false;   // got past the date/time picker
    let confirmed = false;    // booking successful — do not fire abandon
    let alreadyFired = false; // one-shot

    const dropoffStep = () =>
      pickedTime ? "picked-time" : opened ? "opened" : "unknown";

    const fire = () => {
      if (alreadyFired || confirmed || !opened) return;
      alreadyFired = true;
      const payload = JSON.stringify({ email, vertical, dropoffStep: dropoffStep() });
      try {
        // sendBeacon survives unload; fetch keepalive is the fallback.
        const blob = new Blob([payload], { type: "application/json" });
        if (!(navigator.sendBeacon && navigator.sendBeacon(ABANDON_ENDPOINT, blob))) {
          fetch(ABANDON_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch { /* swallow — best effort */ }
    };

    const onMessage = (e: MessageEvent) => {
      const data = e?.data;
      if (!data) return;
      const name = typeof data === "string"
        ? data
        : (data.type || data.action || data.name || "");
      if (typeof name !== "string") return;

      if (/event-type-view|view:eventType|book(ing)?_view|embed.*ready/i.test(name)) {
        opened = true;
      }
      if (/booking-form-view|booking:form|date_selected|time_selected/i.test(name)) {
        pickedTime = true;
      }
      if (/booking[-_:]?success|bookingSuccessful|booking_completed|confirmed/i.test(name)) {
        confirmed = true;
      }
    };

    const onPageHide = () => fire();
    const onVisibility = () => { if (document.visibilityState === "hidden") fire(); };

    window.addEventListener("message", onMessage);
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibility);
      // Component unmount before page unload also counts as a drop.
      fire();
    };
  }, [email, vertical]);

  return (
    <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-[0_4px_40px_-12px_rgba(4,44,83,0.18)]">
      <div id="cal-inline-30min" ref={ref} style={{ width: "100%", height, overflow: "scroll" }} />
    </div>
  );
}
