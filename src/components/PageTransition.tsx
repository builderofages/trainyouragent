// src/components/PageTransition.tsx
// v44: wraps a route page in a framer-motion fade/slide transition.
// Respects prefers-reduced-motion (framer-motion auto-disables when set).

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
