// src/components/CinematicHero.tsx — v242
//
// On-brand cinematic hero. Cream canvas, navy ink, Playfair italic drop,
// soft gold accent. Editorial magazine-cover feel — not tech-bro dark mode.
// Replaces v241 which was correctly cinematic but wrong-key.
//
// Brand DNA being expressed here:
//   • Cream/bone surface (#FAF6EE) with subtle pearl gradient
//   • Navy (#042C53) for ink and quiet authority
//   • Royal blue (#185FA5) for eyebrows + energy
//   • Soft gold #F4C84C as a single accent — appears once, on the underline
//   • Playfair Display 500 italic for the drop — the "elegant sexyness"
//   • Inter Tight 600 for hard force
//   • Micro mono for trust strips
//
// All motion is restrained: no neon, no glow rings, no animated mesh that
// looks like a Stripe ad. The luxury feel comes from typography + space.

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fireEvent } from "@/lib/event";

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const INK = "#0B1B2B";
const MUTED = "#5C6B7F";
const CREAM = "#FAF6EE";
const PEARL = "#F4EFE4";
const GOLD = "#C99A28";
const HAIRLINE = "rgba(4,44,83,0.10)";

const ITALIC: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontStyle: "italic",
  fontWeight: 500,
};
const MONO: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  letterSpacing: "0.18em",
};

export default function CinematicHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [secs, setSecs] = useState(0);

  // Soft cursor parallax on the three floating tiles
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
        setTilt({ x: nx, y: ny });
      });
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    return () => { el.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  // Live $-leak counter, anchored per-browser
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = "tya.hero.firstSeen";
    let t0 = 0;
    try {
      const stored = parseInt(window.localStorage.getItem(key) || "0", 10);
      if (stored && Date.now() - stored < 30 * 86400_000) t0 = stored;
      if (!t0) { t0 = Date.now(); window.localStorage.setItem(key, String(t0)); }
    } catch { t0 = Date.now(); }
    setSecs(Math.floor((Date.now() - t0) / 1000));
    const id = setInterval(() => setSecs(Math.floor((Date.now() - t0) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const dollarsLost = ((secs / 60) * 4.62).toFixed(2);

  return (
    <section
      ref={rootRef}
      data-tya-hero
      style={{
        position: "relative",
        overflow: "hidden",
        color: INK,
        background: `
          radial-gradient(900px 600px at 12% 18%, rgba(24,95,165,0.10), transparent 60%),
          radial-gradient(720px 500px at 88% 22%, rgba(244,200,76,0.10), transparent 60%),
          radial-gradient(800px 540px at 52% 110%, rgba(4,44,83,0.08), transparent 60%),
          linear-gradient(180deg, ${CREAM} 0%, ${PEARL} 100%)
        `,
        minHeight: "min(820px, 94vh)",
      }}
      aria-labelledby="cinematic-hero-heading"
    >
      {/* Editorial column rule — quiet luxury */}
      <div aria-hidden style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "linear-gradient(180deg, transparent, rgba(4,44,83,0.08), transparent)", transform: "translateX(-50%)", opacity: 0.7 }} />

      {/* Subtle warm grain — premium tactile depth */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
        mixBlendMode: "multiply",
        opacity: 0.06,
      }} />

      {/* Floating ornaments — soft, never compete */}
      {[
        { left: "6%",  top: "16%", size: 380, color: "rgba(24,95,165,0.08)" },
        { left: "78%", top: "10%", size: 320, color: "rgba(201,154,40,0.07)" },
        { left: "66%", top: "66%", size: 440, color: "rgba(4,44,83,0.07)" },
      ].map((o, i) => (
        <div key={i} aria-hidden style={{
          position: "absolute", left: o.left, top: o.top,
          width: o.size, height: o.size, borderRadius: "50%",
          background: `radial-gradient(circle at 40% 40%, ${o.color}, transparent 60%)`,
          filter: "blur(0.5px)",
          transform: `translate(${tilt.x * (i === 1 ? -10 : 12)}px, ${tilt.y * 8}px)`,
          transition: "transform .4s ease-out",
          pointerEvents: "none",
        }} />
      ))}

      <style>{`
        @keyframes tyaUnderline { from { transform: scaleX(0); transform-origin: left center; } to { transform: scaleX(1); transform-origin: left center; } }
        @keyframes tyaPulseDot { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: .4; } }
        @keyframes tyaFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          [data-tya-hero] * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Content shell — editorial magazine cover lockup */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1180, margin: "0 auto",
        padding: "92px 28px 76px",
        textAlign: "center",
      }}>

        {/* Pre-headline label — masthead style */}
        <div style={{ ...MONO, fontSize: 11, fontWeight: 700, color: ACCENT, marginBottom: 28, opacity: 0, animation: "tyaFadeUp .9s .05s ease-out forwards" }}>
          <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: 999, background: "#1FA567", marginRight: 8, animation: "tyaPulseDot 1.8s ease-in-out infinite", verticalAlign: "middle" }} />
          TRAINYOURAGENT · ISSUE Nº 1 · LIVE
        </div>

        {/* The drop — magazine cover headline */}
        <h1
          id="cinematic-hero-heading"
          style={{
            fontSize: "clamp(46px, 7.4vw, 112px)",
            lineHeight: 0.94,
            letterSpacing: "-0.024em",
            fontWeight: 600,
            color: NAVY,
            margin: 0,
            maxWidth: 1100,
            opacity: 0,
            animation: "tyaFadeUp 1s .15s ease-out forwards",
          }}
        >
          Your phone will be answered.
          <span style={{ display: "block", marginTop: 8 }}>
            <span style={{ ...ITALIC, color: NAVY }}>By an </span>
            <span style={{ ...ITALIC, position: "relative", display: "inline-block", color: NAVY }}>
              agent
              <span
                aria-hidden
                style={{
                  position: "absolute", left: 0, right: 0, bottom: "0.08em", height: "0.18em",
                  background: GOLD,
                  display: "block",
                  borderRadius: 99,
                  animation: "tyaUnderline 1s .9s cubic-bezier(.7,0,.3,1) forwards",
                  transform: "scaleX(0)",
                  zIndex: -1,
                }}
              />
            </span>
            <span style={{ ...ITALIC, color: NAVY }}> you trained.</span>
          </span>
        </h1>

        {/* Subhead — quiet, certain */}
        <p style={{
          marginTop: 28, maxWidth: 700, marginLeft: "auto", marginRight: "auto",
          fontSize: "clamp(17px, 1.4vw, 20px)", lineHeight: 1.55,
          color: MUTED, fontWeight: 400,
          opacity: 0, animation: "tyaFadeUp 1s .35s ease-out forwards",
        }}>
          A voice + chat receptionist that sounds like your best front-of-house, books on your calendar, and never sleeps. Train it once. It runs forever.
        </p>

        {/* CTA pair — editorial primary + hairline secondary */}
        <div style={{ marginTop: 38, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", alignItems: "center", opacity: 0, animation: "tyaFadeUp 1s .5s ease-out forwards" }}>
          <Link
            to="/apply"
            onClick={() => void fireEvent("hero_cta_apply_click", {})}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 30px",
              borderRadius: 999,
              background: NAVY,
              color: "#fff", fontWeight: 700, fontSize: 15.5,
              textDecoration: "none",
              boxShadow: "0 22px 44px -18px rgba(4,44,83,0.45)",
              transition: "transform .2s ease, box-shadow .2s ease",
              border: `1px solid ${NAVY}`,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            Build your agent in 21 days →
          </Link>
          <a
            href="/voice-demo"
            onClick={(e) => { e.preventDefault(); window.location.href = "/voice-demo"; void fireEvent("hero_cta_demo_click", {}); }}
            style={{
              padding: "15px 24px",
              borderRadius: 999,
              background: "transparent",
              color: NAVY, fontWeight: 700, fontSize: 14.5,
              textDecoration: "none",
              border: `1px solid ${HAIRLINE}`,
            }}
          >
            ▶ Hear the AI line
          </a>
        </div>

        {/* Live $-leak — quiet pill, brand-tonal */}
        <div style={{
          marginTop: 22,
          display: "inline-flex", alignItems: "center", gap: 12,
          padding: "8px 16px",
          borderRadius: 999,
          background: "rgba(155,44,44,0.06)",
          border: "1px solid rgba(220,38,38,0.18)",
          opacity: 0, animation: "tyaFadeUp 1s .65s ease-out forwards",
        }}>
          <span style={{ position: "relative", width: 7, height: 7 }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: "#C73642" }} />
            <span style={{ position: "absolute", inset: -3, borderRadius: 999, background: "#C73642", opacity: 0.45, animation: "tyaPulseDot 1.4s infinite" }} />
          </span>
          <span style={{ ...MONO, fontSize: 11.5, fontWeight: 700, color: "#7A1E25" }}>
            $ LEAKING THIS SESSION · ${dollarsLost}
          </span>
        </div>

        {/* Editorial cream-tile spec sheet — like a magazine pull-out */}
        <div style={{
          marginTop: 64,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          width: "100%",
          maxWidth: 940, marginLeft: "auto", marginRight: "auto",
          perspective: 1200,
          opacity: 0, animation: "tyaFadeUp 1s .8s ease-out forwards",
        }}>
          {[
            { kpi: "21",        unit: "DAYS",     label: "Voice + chat in production." },
            { kpi: "24 / 7",    unit: "PICKUP",   label: "Every call, every hour." },
            { kpi: "$4.62",     unit: "PER MIN",  label: "Salesforce missed-call cost." },
          ].map((t, i) => (
            <article
              key={i}
              style={{
                padding: "24px 22px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.78)",
                border: `1px solid ${HAIRLINE}`,
                backdropFilter: "blur(8px)",
                textAlign: "left",
                transform: `translateY(${tilt.y * (i === 1 ? 5 : 3)}px) rotateX(${-tilt.y * 1.4}deg) rotateY(${tilt.x * 1.4}deg)`,
                transition: "transform .35s ease-out",
                boxShadow: "0 18px 36px -22px rgba(4,44,83,0.18)",
              }}
            >
              <div style={{ ...MONO, fontSize: 9.5, fontWeight: 700, color: ACCENT, marginBottom: 6 }}>
                {t.unit}
              </div>
              <div style={{ fontSize: 38, fontWeight: 700, color: NAVY, lineHeight: 1, letterSpacing: "-0.02em" }}>{t.kpi}</div>
              <div style={{ marginTop: 10, fontSize: 13, color: MUTED, lineHeight: 1.5, ...ITALIC }}>{t.label}</div>
            </article>
          ))}
        </div>

        {/* Footer masthead strip */}
        <div style={{
          marginTop: 56, display: "flex", flexWrap: "wrap", gap: 26, justifyContent: "center",
          color: "rgba(11,27,43,0.52)", fontSize: 10.5, ...MONO, fontWeight: 700,
          opacity: 0, animation: "tyaFadeUp 1s .95s ease-out forwards",
        }}>
          <span>SOC2 PATH</span>
          <span style={{ color: "rgba(11,27,43,0.22)" }}>·</span>
          <span>HIPAA-READY PER CUSTOMER</span>
          <span style={{ color: "rgba(11,27,43,0.22)" }}>·</span>
          <span>STRIPE LIVE</span>
          <span style={{ color: "rgba(11,27,43,0.22)" }}>·</span>
          <span>90-DAY GUARANTEE</span>
        </div>

      </div>
    </section>
  );
}
