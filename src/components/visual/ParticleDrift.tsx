// src/components/visual/ParticleDrift.tsx
// v73-B — 2040 visual layer.
//
// Subtle floating dots over the hero. ~20 small dots in #185FA5 with
// varying size, position, animation class, and delay. Pure CSS animation
// (no canvas, no rAF). Respects prefers-reduced-motion via .v73-particle-*
// rules in index.css that freeze position and pin opacity.
//
// Z-index: sits above MeshGradientBackdrop (-z-10) but below hero content.

import { memo, useMemo } from "react";

const ANIM_CLASSES = ["v73-particle-a", "v73-particle-b", "v73-particle-c"] as const;

type Particle = {
  id: number;
  top: number;     // % from top
  left: number;    // % from left
  size: number;    // px (2-6)
  cls: typeof ANIM_CLASSES[number];
  delay: number;   // s (0-10)
  opacity: number; // 0.25-0.55
};

// Deterministic-ish seed so dots don't reshuffle every render but
// also don't require a stateful RNG.
function genParticles(count: number): Particle[] {
  const out: Particle[] = [];
  // Simple LCG so we don't depend on Math.random() on first render
  let seed = 1729;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i++) {
    out.push({
      id: i,
      top: 10 + rnd() * 80,
      left: 5 + rnd() * 90,
      size: 2 + Math.floor(rnd() * 5),
      cls: ANIM_CLASSES[Math.floor(rnd() * ANIM_CLASSES.length)],
      delay: Math.round(rnd() * 100) / 10,
      opacity: 0.25 + rnd() * 0.3,
    });
  }
  return out;
}

function ParticleDriftImpl({ count = 20 }: { count?: number }) {
  const particles = useMemo(() => genParticles(count), [count]);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-[5] overflow-hidden pointer-events-none"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={`absolute rounded-full ${p.cls}`}
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: "#185FA5",
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            boxShadow: p.size >= 4 ? "0 0 8px rgba(24,95,165,0.35)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

export const ParticleDrift = memo(ParticleDriftImpl);
export default ParticleDrift;
