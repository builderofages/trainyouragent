// src/hooks/useCountUp.ts
// v44: tiny dependency-free count-up. Animates from `from` -> `to` over `duration` ms
// once the element using it becomes visible. Respects prefers-reduced-motion.

import { useEffect, useRef, useState } from "react";

export function useCountUp(to: number, durationMs = 1500, from = 0) {
  const [value, setValue] = useState<number>(from);
  const elRef = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setValue(to); return; }

    if (typeof window === "undefined") return;
    const node = elRef.current;
    if (!node) {
      // No ref — just animate on mount
      runAnimation();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            runAnimation();
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(node);
    return () => io.disconnect();

    function runAnimation() {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(from + (to - from) * eased);
        if (t < 1) requestAnimationFrame(tick);
        else setValue(to);
      };
      requestAnimationFrame(tick);
    }
  }, [to, durationMs, from]);

  return { value, ref: elRef };
}
