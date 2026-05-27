// src/components/PageTransition.tsx
// v178b: NEUTRALIZED — this was THE white-screen-of-death wrapper.
//
// It wrapped <Routes> in App.tsx with a framer-motion motion.div:
//   initial={{ opacity: 0, y: 8 }}  animate={{ opacity: 1, y: 0 }}
//
// On the FIRST page load the enter animation ran (opacity 0 → 1) and the page
// appeared. But on CLIENT-SIDE navigation the <PageTransition> instance does
// NOT remount (it sits above <Routes>, only the routed child swaps), so
// framer-motion never re-fires initial→animate — yet the children changing
// caused the motion.div to fall back to its `initial` state (opacity:0,
// translateY(8px)) and stay there. Result: every in-app link rendered the new
// page fully in the DOM but at opacity:0 = blank white screen. This is the
// true root cause of "every link/pathway goes to a white page." (DOM audit
// confirmed: page content present at 4462px tall, opacity:1 on all sections,
// but an unclassed motion.div ancestor stuck at opacity:0.)
//
// A page-level fade is not worth a site-wide blank-screen risk, and the site
// already animates individual sections in via RevealUp/Reveal on scroll. So
// PageTransition is now a pure pass-through: children render at full opacity,
// always, with nothing that can get stuck at opacity:0.

import type { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
