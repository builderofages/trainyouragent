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

  // v79: opacity fade KILLED entirely — only the y-translate animates now.
  // v78 still showed a visible "wash-in" because opacity 0.55→1 over 0.4s
  // is a discernible flash for hero text. Verified live: audit reported
  // gray-flash still present. Now content paints at full opacity from
  // frame 0 with a subtle 12px slide-up that doesn't read as "loading".
  return (
    <Tag
      className={className}
      initial={{ opacity: 1, y: y / 2 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: Math.min(duration, 0.45),
        delay,
        ease: [0.2, 0.7, 0.2, 1],
      }}
    >
      {children}
    </Tag>
  );
}
