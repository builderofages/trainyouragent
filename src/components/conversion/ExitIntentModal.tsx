// src/components/conversion/ExitIntentModal.tsx
// v165: Exit-intent modal — catches the "moving cursor toward back button /
// tab close" signal on desktop and the "scroll up fast after time-on-page"
// signal on mobile, and shows a final-shot offer: the $497 Done-WITH-You
// session at a $200 discount. Hormozi rule: capture the no-trader before
// they leave the funnel.
//
// Behavior:
//   - Fires ONCE per visitor (localStorage flag)
//   - Triggers on desktop: mouseleave at top of viewport (y < 10)
//   - Triggers on mobile: scroll-up velocity > 800px/sec after 25s on page
//   - Dismissable; offer button → /api/checkout with discount-coded plan
//   - Tracks impression + dismiss + click via fireEvent for downstream attr

import { useEffect, useState } from "react";

const STORAGE_KEY = "tya:exit-intent-fired-v1";

export default function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY)) return;

    let lastY = 0;
    let lastT = 0;
    let pageStart = Date.now();

    const fire = (trigger: string) => {
      if (open) return;
      try { window.localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch {}
      setOpen(true);
      void fetch("/api/event", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          event_type: "exit_intent_shown",
          source: "exit-intent-modal",
          meta: { trigger, time_on_page_s: Math.round((Date.now() - pageStart) / 1000), path: window.location.pathname },
        }),
        keepalive: true,
      }).catch(() => {});
    };

    const onMouseLeave = (e: MouseEvent) => {
      // Desktop: cursor exits via top of viewport
      if (e.clientY <= 10 && Date.now() - pageStart > 5000) fire("desktop-top-exit");
    };

    const onScroll = () => {
      // Mobile: fast scroll-up after 25s
      const y = window.scrollY;
      const t = Date.now();
      if (lastT && t - lastT < 200) {
        const dy = lastY - y; // positive = scrolling up
        const dt = (t - lastT) / 1000;
        const vel = dy / dt;
        if (vel > 800 && t - pageStart > 25000) fire("mobile-fast-scroll-up");
      }
      lastY = y;
      lastT = t;
    };

    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  const dismiss = () => {
    setOpen(false);
    void fetch("/api/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event_type: "exit_intent_dismissed",
        source: "exit-intent-modal",
        meta: { path: window.location.pathname },
      }),
      keepalive: true,
    }).catch(() => {});
  };

  async function claimOffer() {
    setLoading(true);
    void fetch("/api/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event_type: "exit_intent_cta_click",
        source: "exit-intent-modal",
        meta: { offer: "done-with-you-497-discount", path: window.location.pathname },
      }),
      keepalive: true,
    }).catch(() => {});
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: "done-with-you-497", coupon: "EXIT200" }),
      });
      const j = (await r.json().catch(() => ({}))) as { url?: string };
      if (j?.url) { window.location.href = j.url; return; }
    } catch {}
    setLoading(false);
    // Graceful fallback: send to /apply (the cold-traffic conversion page)
    window.location.href = "/apply?utm_source=exit_intent";
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      style={{
        position: "fixed", inset: 0, zIndex: 9998,
        background: "rgba(2,12,24,0.75)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        animation: "tya-exit-fade-in 200ms ease-out",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 18, maxWidth: 480, width: "100%",
        padding: "30px 28px 28px", position: "relative", boxShadow: "0 30px 70px -10px rgba(4,44,83,0.4)",
        fontFamily: "'Inter Tight', system-ui, sans-serif",
        animation: "tya-exit-slide-in 250ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: "absolute", top: 12, right: 12, width: 32, height: 32,
            border: "none", borderRadius: 999, background: "rgba(4,44,83,0.06)",
            color: "#042C53", fontSize: 18, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          ×
        </button>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "4px 10px", borderRadius: 999, background: "#FFFBEA",
          border: "1px solid #FFD60A", marginBottom: 14,
          fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
          color: "#042C53",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "#D9404B" }} />
          Before you go
        </div>

        <h2
          id="exit-intent-title"
          style={{
            fontSize: 26, lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 600,
            color: "#042C53", marginBottom: 10,
          }}
        >
          Take{" "}
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
            $200 off
          </span>{" "}
          the Agent-in-a-Day session.
        </h2>

        <p style={{ fontSize: 14, lineHeight: 1.55, color: "#0B1B2B", marginBottom: 18 }}>
          Pay <strong>$297</strong> (instead of $497), book a 4-hour Zoom build with the founder, walk away with a deployed voice agent on your phone number today. Full refund if we don&rsquo;t ship in the session.
        </p>

        <div style={{
          padding: 12, borderRadius: 10, background: "#F6FAFE",
          border: "1px solid #E6F1FB", marginBottom: 18,
          fontSize: 12.5, lineHeight: 1.45, color: "#185FA5",
        }}>
          Coupon <strong>EXIT200</strong> auto-applies. One-time. Expires when you close this tab.
        </div>

        <button
          onClick={claimOffer}
          disabled={loading}
          style={{
            width: "100%", padding: "14px 22px", borderRadius: 999,
            background: "#042C53", color: "#fff", fontSize: 15, fontWeight: 600,
            border: "none", cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Loading checkout…" : "Claim $200 off — book my build day →"}
        </button>

        <button
          onClick={dismiss}
          style={{
            display: "block", margin: "10px auto 0", padding: 6,
            background: "none", border: "none", color: "#6B7B8F",
            fontSize: 12, cursor: "pointer", textDecoration: "underline",
          }}
        >
          No thanks, I&rsquo;ll pay full price later
        </button>

        <style>{`
          @keyframes tya-exit-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes tya-exit-slide-in {
            from { opacity: 0; transform: translateY(20px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}
