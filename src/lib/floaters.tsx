// src/lib/floaters.tsx — v53
// Mutex coordinator for the floating bottom-screen widgets:
//   - AiChat   (bottom-right chat bubble)
//   - TalkToHumanButton (bottom-left human-contact pill)
//
// Only one can be OPEN at a time. They share state through this context so
// opening one auto-closes the other. Wrap the app in <FloatersProvider>.

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type FloaterKey = "chat" | "human" | null;

type Ctx = {
  open: FloaterKey;
  set: (next: FloaterKey) => void;
  toggle: (which: Exclude<FloaterKey, null>) => void;
};

const FloatersCtx = createContext<Ctx>({
  open: null,
  set: () => {},
  toggle: () => {},
});

export function FloatersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<FloaterKey>(null);

  const set = useCallback((next: FloaterKey) => setOpen(next), []);
  const toggle = useCallback((which: Exclude<FloaterKey, null>) => {
    setOpen((prev) => (prev === which ? null : which));
  }, []);

  const value = useMemo<Ctx>(() => ({ open, set, toggle }), [open, set, toggle]);
  return <FloatersCtx.Provider value={value}>{children}</FloatersCtx.Provider>;
}

export function useFloaters() {
  return useContext(FloatersCtx);
}
