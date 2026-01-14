import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

export const AnimatedCounter = ({
  end,
  prefix = "",
  suffix = "",
  duration = 2,
  delay = 0,
  className = "",
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      
      const timeout = setTimeout(() => {
        const startTime = Date.now();
        const endTime = startTime + duration * 1000;

        const animate = () => {
          const now = Date.now();
          const progress = Math.min((now - startTime) / (duration * 1000), 1);
          
          // Easing function for smooth deceleration
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          
          setCount(Math.floor(easeOutQuart * end));

          if (now < endTime) {
            requestAnimationFrame(animate);
          } else {
            setCount(end);
          }
        };

        requestAnimationFrame(animate);
      }, delay * 1000);

      return () => clearTimeout(timeout);
    }
  }, [isInView, end, duration, delay]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </motion.span>
  );
};
