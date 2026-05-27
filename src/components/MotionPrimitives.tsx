// src/components/MotionPrimitives.tsx
// Pure-CSS motion primitives — no framer-motion dependency required.
// If/when you install framer-motion, swap implementations; the API stays the same.

import { useEffect, useRef, useState, type ReactNode } from "react";

/* RevealOnScroll: fades + slides element in when it enters viewport. */
export function Reveal({ children, delay = 0, y = 16, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setSeen(true)), { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}
         style={{
           opacity: seen ? 1 : 0,
           transform: seen ? "translateY(0)" : `translateY(${y}px)`,
           transition: `opacity 720ms cubic-bezier(.2,.7,.2,1) ${delay}ms, transform 720ms cubic-bezier(.2,.7,.2,1) ${delay}ms`,
           willChange: "opacity, transform",
         }}>
      {children}
    </div>
  );
}

/* TiltCard: 3D perspective tilt on hover. */
export function TiltCard({ children, className = "", max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) translateZ(0)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)"; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
         className={className}
         style={{ transition: "transform 220ms cubic-bezier(.2,.7,.2,1)", willChange: "transform" }}>
      {children}
    </div>
  );
}

/* PageFade — v178: NEUTRALIZED. This component was THE white-screen-of-death.
 *
 * The old implementation gated the ENTIRE routed page behind:
 *   const [show, setShow] = useState(false);
 *   useEffect(() => { setShow(false); setTimeout(() => setShow(true), 10); return clearTimeout }, [children]);
 *   <div style={{ opacity: show ? 1 : 0 }}>
 *
 * Bug: the effect depends on [children], and `children` is a fresh element
 * reference on every App re-render. The homepage's LiveLeakTicker re-renders
 * every second; lazy-chunk resolution and context updates re-render too. Each
 * re-render fired the cleanup, which cleared the pending 10ms setShow(true)
 * timer BEFORE it could run — so `show` stayed false forever and the page
 * rendered at opacity:0 = blank white. It bit every client-side navigation
 * (direct page loads escaped only because nothing was re-rendering during the
 * 10ms window). This is what made "every link goes to a white page."
 *
 * A page-level cross-fade is not worth a site-wide blank-screen risk, and the
 * site already has per-section RevealUp entrance animations. So PageFade is now
 * a pass-through: it renders its children at full opacity, always, with no JS
 * gating that can ever get stuck. */
export function PageFade({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/* GradientMesh: subtle animated mesh background. Drop into hero. */
export function GradientMesh({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-60 animate-[mesh1_22s_ease-in-out_infinite]"
           style={{ background: "radial-gradient(closest-side, #DCEBFA 0%, rgba(220,235,250,0) 70%)" }} />
      <div className="absolute -bottom-[20%] -right-[10%] w-[55%] h-[55%] rounded-full opacity-50 animate-[mesh2_28s_ease-in-out_infinite]"
           style={{ background: "radial-gradient(closest-side, #BDDAF4 0%, rgba(189,218,244,0) 70%)" }} />
      <div className="absolute top-[30%] left-[40%] w-[35%] h-[35%] rounded-full opacity-40 animate-[mesh3_18s_ease-in-out_infinite]"
           style={{ background: "radial-gradient(closest-side, #E6F1FB 0%, rgba(230,241,251,0) 70%)" }} />
      <style>{`
        @keyframes mesh1 { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(60px,40px) scale(1.08);} }
        @keyframes mesh2 { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(-50px,-30px) scale(1.05);} }
        @keyframes mesh3 { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(40px,-50px) scale(1.06);} }
      `}</style>
    </div>
  );
}

/* GrainOverlay: subtle noise overlay for depth. */
export function GrainOverlay({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-multiply"
         style={{
           opacity,
           backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='1'/></svg>\")",
         }} />
  );
}
