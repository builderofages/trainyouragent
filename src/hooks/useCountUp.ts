// src/hooks/useCountUp.ts
// v44: tiny dependency-free count-up. Animates from `from` -> `to` over `duration` ms
// once the element using it becomes visible. Respects prefers-reduced-motion.
//
// v104: kill the 0/0/0/0 ghost on first paint. Above-the-fold counters had a
// race where the first few frames showed `from` (0) before the IntersectionObserver
// callback ran. Now we synchronously check getBoundingClientRect() on mount; if
// the element is already in view, animation fires immediately. Off-screen
// elements still use IO to lazy-fire when scrolled into view.

import { useEffect, useRef, useState } from "react";

export function useCountUp<T extends Element = HTMLElement>(to: number, durationMs = 1500, from = 0) {
  const [value, setValue] = useState<number>(from);
  const elRef = useRef<T | null>(null);
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

    // v104: synchronous viewport check — kills the 0/0/0/0 ghost on
    // above-the-fold counters by firing immediately when already in view.
    const rect = node.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth  || document.documentElement.clientWidth;
    const alreadyVisible =
      rect.bottom > 0 && rect.right > 0 && rect.top < vh && rect.left < vw;
    if (alreadyVisible) {
      startedRef.current = true;
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
