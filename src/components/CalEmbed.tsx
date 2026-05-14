// src/components/CalEmbed.tsx
// Inline Cal.com embed using the official cal-embed.js script.
// No new-tab handoff — visitor books from the page.

import { useEffect, useRef } from "react";

const CAL_LINK = "trainyouragent/30min";

export default function CalEmbed({ height = 680 }: { height?: number }) {
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

  return (
    <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-[0_4px_40px_-12px_rgba(4,44,83,0.18)]">
      <div id="cal-inline-30min" ref={ref} style={{ width: "100%", height, overflow: "scroll" }} />
    </div>
  );
}
