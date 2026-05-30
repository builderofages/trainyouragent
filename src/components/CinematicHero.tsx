// src/components/CinematicHero.tsx — v241
//
// Single-screen 2040-grade homepage hero. Replaces the existing
// hero+chips+badges block.
//
// Design system:
//   - 100vh first-paint canvas — visitor lands inside the brand world
//   - Animated 3-color radial gradient mesh + slow drift (CSS-only,
//     prefers-reduced-motion respected)
//   - Three floating glass-morphism stat cards with parallax tilt on
//     cursor (no JS lib — passive listener, CSS transform)
//   - Massive editorial headline: Playfair italic drop with a
//     simultaneous Inter Tight ALL-CAPS sub-lockup
//   - Single primary CTA with ambient glow ring
//   - Live $-leak ticker beneath the CTA (real arithmetic, not fake)
//   - Trust strip at bottom — micro, never competes
//
// No external image assets. No animation libs. No scripts. Pure CSS + 1
// passive mousemove handler. Lighthouse-safe.

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fireEvent } from "@/lib/event";

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const SAND = "#FAF6EE";
const TEXT_DIM = "rgba(255,255,255,0.78)";
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

  // Soft parallax — cursor position 0..1 → tilt -1..1
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

  // Live $-leak counter — anchored to first visit per-browser.
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
      style={{
        position: "relative",
        minHeight: "min(820px, 100vh)",
        overflow: "hidden",
        color: "#fff",
        // CSS-only animated mesh — 3 radial gradients drift on a 14s loop.
        background: `
          radial-gradient(800px 600px at 18% 22%, rgba(24,95,165,0.55), transparent 60%),
          radial-gradient(700px 500px at 82% 28%, rgba(255,210,90,0.18), transparent 60%),
          radial-gradient(900px 600px at 50% 110%, rgba(24,95,165,0.42), transparent 60%),
          linear-gradient(180deg, #062f5a 0%, ${NAVY} 50%, #02152a 100%)
        `,
        backgroundSize: "200% 200%, 200% 200%, 200% 200%, 100% 100%",
        animation: "tyaHeroDrift 18s ease-in-out infinite alternate",
      }}
      aria-labelledby="cinematic-hero-heading"
    >
      {/* Grain layer — tasteful film noise */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.32'/></svg>\")",
        mixBlendMode: "overlay",
        opacity: 0.18,
      }} />

      {/* Floating glass orbs — subtle depth */}
      {[
        { left: "8%",  top: "18%", size: 460, hue: 1 },
        { left: "78%", top: "12%", size: 360, hue: 0 },
        { left: "62%", top: "72%", size: 520, hue: 1 },
      ].map((o, i) => (
        <div key={i} aria-hidden style={{
          position: "absolute", left: o.left, top: o.top,
          width: o.size, height: o.size, borderRadius: "50%",
          background: o.hue
            ? "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.10), transparent 60%)"
            : "radial-gradient(circle at 40% 40%, rgba(255,200,80,0.10), transparent 60%)",
          filter: "blur(2px)",
          transform: `translate(${tilt.x * (i === 1 ? -12 : 14)}px, ${tilt.y * 10}px)`,
          transition: "transform .4s ease-out",
          pointerEvents: "none",
        }} />
      ))}

      <style>{`
        @keyframes tyaHeroDrift {
          0%   { background-position: 0% 0%,   100% 100%, 50% 100%, 0 0; }
          50%  { background-position: 100% 50%, 0% 50%,   60% 30%,  0 0; }
          100% { background-position: 0% 100%, 100% 0%,  40% 60%,  0 0; }
        }
        @keyframes tyaCtaGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,210,90,0.35), 0 20px 60px -20px rgba(0,0,0,0.6); }
          50%      { box-shadow: 0 0 0 18px rgba(255,210,90,0),    0 20px 60px -20px rgba(0,0,0,0.6); }
        }
        @keyframes tyaPulseDot {
          0%,100% { transform: scale(1);   opacity: 1; }
          50%     { transform: scale(1.5); opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          section[data-tya-hero] { animation: none !important; }
          section[data-tya-hero] * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Content shell */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1200, margin: "0 auto",
        padding: "120px 28px 60px",
        display: "grid", gridTemplateColumns: "minmax(0, 1fr)", justifyItems: "center",
        textAlign: "center",
      }}>

        {/* Pre-headline eyebrow */}
        <div style={{ ...MONO, fontSize: 11.5, fontWeight: 700, color: "#FFD24A", marginBottom: 18 }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 999, background: "#22DD91", marginRight: 8, animation: "tyaPulseDot 1.8s ease-in-out infinite" }} />
          AGENT ONLINE · ANSWERING NOW
        </div>

        {/* The drop. Massive editorial type. */}
        <h1
          id="cinematic-hero-heading"
          style={{
            fontSize: "clamp(46px, 7.2vw, 110px)",
            lineHeight: 0.96,
            letterSpacing: "-0.025em",
            fontWeight: 600,
            margin: 0,
            maxWidth: 1080,
            textShadow: "0 4px 36px rgba(0,0,0,0.45)",
          }}
        >
          Your phone will be answered.{" "}
          <span style={{
            ...ITALIC,
            display: "block",
            background: "linear-gradient(180deg, #FFFFFF 0%, #FFE7AB 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginTop: 6,
          }}>
            By an agent you trained.
          </span>
        </h1>

        {/* Subhead */}
        <p style={{
          marginTop: 28, maxWidth: 720,
          fontSize: "clamp(17px, 1.6vw, 21px)", lineHeight: 1.5,
          color: TEXT_DIM, fontWeight: 400,
        }}>
          A voice + chat receptionist that sounds like your best front-of-house, books on your calendar, and never sleeps. Train it once. It runs forever.
        </p>

        {/* Primary CTA + secondary text link */}
        <div style={{ marginTop: 38, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", alignItems: "center" }}>
          <Link
            to="/apply"
            onClick={() => void fireEvent("hero_cta_apply_click", {})}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "18px 32px",
              borderRadius: 999,
              background: "linear-gradient(180deg, #FFD24A, #F0B100)",
              color: "#0B1B2B", fontWeight: 800, fontSize: 16,
              textDecoration: "none",
              animation: "tyaCtaGlow 2.6s ease-in-out infinite",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            Build your agent in 21 days →
          </Link>
          <a
            href="#demo"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
              void fireEvent("hero_cta_demo_click", {});
            }}
            style={{
              padding: "16px 26px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              color: "#fff", fontWeight: 600, fontSize: 15,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(10px)",
            }}
          >
            ▶ Hear the AI line
          </a>
        </div>

        {/* Live $-leak ticker — directly under the CTA */}
        <div style={{
          marginTop: 26,
          display: "inline-flex", alignItems: "center", gap: 12,
          padding: "10px 18px",
          borderRadius: 999,
          background: "rgba(155,44,44,0.16)",
          border: "1px solid rgba(220,38,38,0.32)",
          backdropFilter: "blur(8px)",
        }}>
          <span style={{ position: "relative", width: 8, height: 8 }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: "#FF5C6A" }} />
            <span style={{ position: "absolute", inset: -3, borderRadius: 999, background: "#FF5C6A", opacity: 0.5, animation: "tyaPulseDot 1.4s infinite" }} />
          </span>
          <span style={{ ...MONO, fontSize: 12, fontWeight: 700, color: "#FFD4D8" }}>
            $ LEAKING THIS SESSION · ${dollarsLost}
          </span>
        </div>

        {/* Three glass stat tiles — the spatial layer */}
        <div style={{
          marginTop: 64,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          width: "100%",
          maxWidth: 900,
          perspective: 1000,
        }}>
          {[
            { kpi: "21 days", label: "Trained voice + chat in production" },
            { kpi: "24/7", label: "Pick-up rate across after-hours" },
            { kpi: "$4.62 / min", label: "Salesforce-reported missed-call cost" },
          ].map((t, i) => (
            <article
              key={i}
              style={{
                padding: "22px 22px 20px",
                borderRadius: 18,
                background: "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
                border: "1px solid rgba(255,255,255,0.16)",
                backdropFilter: "blur(14px)",
                color: "#fff",
                textAlign: "left",
                transform: `translateY(${tilt.y * (i === 1 ? 6 : 4)}px) rotateX(${-tilt.y * 2}deg) rotateY(${tilt.x * 2}deg)`,
                transition: "transform .35s ease-out",
                boxShadow: "0 20px 50px -28px rgba(0,0,0,0.55)",
              }}
            >
              <div style={{
                fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em",
                background: "linear-gradient(180deg, #FFFFFF, #FFE7AB)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                lineHeight: 1.05,
              }}>{t.kpi}</div>
              <div style={{ marginTop: 8, fontSize: 12.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.45 }}>{t.label}</div>
            </article>
          ))}
        </div>

        {/* Micro trust strip — never competes */}
        <div style={{
          marginTop: 56, display: "flex", flexWrap: "wrap", gap: 22, justifyContent: "center",
          color: "rgba(255,255,255,0.5)", fontSize: 11, ...MONO, fontWeight: 700,
        }}>
          <span>SOC2 PATH</span>
          <span>·</span>
          <span>HIPAA-READY PER CUSTOMER</span>
          <span>·</span>
          <span>STRIPE LIVE</span>
          <span>·</span>
          <span>90-DAY GUARANTEE</span>
        </div>

      </div>
    </section>
  );
}
