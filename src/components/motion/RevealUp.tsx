// src/components/motion/RevealUp.tsx
// v69: scroll-triggered slide-up + fade-in primitive built on framer-motion.
// Respects prefers-reduced-motion (returns children unanimated).
//
// Usage:
//   <RevealUp delay={0.1}>      <Card />           </RevealUp>
//   <RevealUp y={32} duration={0.7}> <h2>...</h2>  </RevealUp>

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type RevealUpProps = {
  children: ReactNode;
  /** initial vertical offset in px (default 24) */
  y?: number;
  /** delay before animating (in seconds, default 0) */
  delay?: number;
  /** animation duration (in seconds, default 0.6) */
  duration?: number;
  /** intersection ratio before firing (default 0.15) */
  amount?: number;
  className?: string;
  /** element tag — defaults to div */
  as?: "div" | "section" | "li" | "article" | "header";
};

export default function RevealUp({
  children,
  y = 24,
  delay = 0,
  duration = 0.6,
  amount = 0.15,
  className,
  as = "div",
}: RevealUpProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  if (reduce) {
    // Render plain element — no transform, no opacity transition.
    const Plain = as as keyof JSX.IntrinsicElements;
    return <Plain className={className}>{children}</Plain>;
  }

  // v78: starts at opacity 0.55 (not 0) and y/2 (not y) so content is
  // legible from first paint even before the intersection observer fires
  // or framer-motion hydrates. Was making hero h1 + CTA look washed-out
  // gray for 3-4 seconds on every page load — first-impression killer.
  // Duration also clamped lower so the polish-flash is brief.
  return (
    <Tag
      className={className}
      initial={{ opacity: 0.55, y: y / 2 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: Math.min(duration, 0.4),
        delay,
        ease: [0.2, 0.7, 0.2, 1],
      }}
    >
      {children}
    </Tag>
  );
}
