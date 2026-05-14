// src/components/ExitIntent.tsx
// Fires once per session when mouse leaves the top of the viewport (desktop)
// or after 30s + scroll-depth (mobile fallback). Renders nothing itself —
// wrap it with whatever modal you want shown.

import { useEffect, useState } from "react";

type Props = { children: (props: { open: boolean; close: () => void }) => React.ReactNode };

const SESSION_KEY = "tya:exitintent:shown";

export default function ExitIntent({ children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(SESSION_KEY)) return;

    const trigger = () => {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setOpen(true);
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };
    document.addEventListener("mouseout", onMouseOut);

    // Mobile fallback: 30s + at least 40% scroll depth
    let scrolled40 = false;
    const onScroll = () => {
      const depth = (window.scrollY + window.innerHeight) / Math.max(1, document.body.scrollHeight);
      if (depth > 0.4) scrolled40 = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = window.setTimeout(() => { if (scrolled40) trigger(); }, 30000);

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(t);
    };
  }, []);

  return <>{children({ open, close: () => setOpen(false) })}</>;
}
