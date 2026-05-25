// src/components/motion/HoverLift.tsx
// v69: subtle hover lift wrapper. Wrap any clickable thing for a -2px / +2%
// scale on hover and a press on tap. Respects reduced motion.
//
// Usage:
//   <HoverLift>
//     <a href="/book" className="btn">Book a call</a>
//   </HoverLift>

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type HoverLiftProps = {
  children: ReactNode;
  className?: string;
  /** disable scale (just translate) */
  noScale?: boolean;
};

export default function HoverLift({ children, className, noScale }: HoverLiftProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      whileHover={{ y: -2, scale: noScale ? 1 : 1.02 }}
      whileTap={{ y: 0, scale: 0.99 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}
