// src/components/motion/StaggerChildren.tsx
// v69: wrap a list — children animate in sequentially. Respects reduced motion.
//
// Usage:
//   <StaggerChildren className="grid grid-cols-3 gap-3" delay={0.08}>
//     {items.map((i) => <Item key={i.id} {...i} />)}
//   </StaggerChildren>
//
// Each direct child gets wrapped in a motion item via Children.map.

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type StaggerChildrenProps = {
  children: ReactNode;
  /** seconds between each child reveal (default 0.05) */
  delay?: number;
  /** initial vertical offset per child (default 16) */
  y?: number;
  amount?: number;
  className?: string;
  as?: "div" | "section" | "ul" | "ol";
};

export default function StaggerChildren({
  children,
  delay = 0.05,
  y = 16,
  amount = 0.1,
  className,
  as = "div",
}: StaggerChildrenProps) {
  const reduce = useReducedMotion();
  const Container = motion[as] as typeof motion.div;
  const items = Children.toArray(children);

  if (reduce) {
    const Plain = as as keyof JSX.IntrinsicElements;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Container
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: delay } },
      }}
    >
      {items.map((child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </Container>
  );
}
