// src/lib/visitorContext.tsx — v53
// Pathway personalization — tracks the lane (smb/startup/agency) and niche
// (hvac/roofing/dental/...) a visitor has selected via /start so other pages
// can re-skin themselves accordingly.
//
// State is persisted to localStorage under `tya_visitor_context`. Pages that
// want to personalize just call useVisitor().

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PLAYBOOK_SLUGS, getPlaybook } from "@/lib/playbooks";

export type VisitorLane = "smb" | "startup" | "agency" | null;
export type VisitorNiche = string | null;

export type VisitorContextValue = {
  lane: VisitorLane;
  niche: VisitorNiche;
  setLane: (l: VisitorLane) => void;
  setNiche: (n: VisitorNiche) => void;
  reset: () => void;
  // Convenience — true if both lane + niche are set.
  isPersonalized: boolean;
};

const STORAGE_KEY = "tya_visitor_context";

const Ctx = createContext<VisitorContextValue>({
  lane: null,
  niche: null,
  setLane: () => {},
  setNiche: () => {},
  reset: () => {},
  isPersonalized: false,
});

type Persisted = { lane?: VisitorLane; niche?: VisitorNiche };

function load(): Persisted {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Persisted;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function save(v: Persisted) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

export function VisitorProvider({ children }: { children: React.ReactNode }) {
  const [lane, setLaneState] = useState<VisitorLane>(null);
  const [niche, setNicheState] = useState<VisitorNiche>(null);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const v = load();
    if (v.lane === "smb" || v.lane === "startup" || v.lane === "agency") {
      setLaneState(v.lane);
    }
    if (typeof v.niche === "string" && PLAYBOOK_SLUGS.includes(v.niche)) {
      setNicheState(v.niche);
    }
  }, []);

  const setLane = useCallback((l: VisitorLane) => {
    setLaneState(l);
    const cur = load();
    save({ ...cur, lane: l });
  }, []);

  const setNiche = useCallback((n: VisitorNiche) => {
    const valid = n && PLAYBOOK_SLUGS.includes(n) ? n : null;
    setNicheState(valid);
    const cur = load();
    save({ ...cur, niche: valid });
  }, []);

  const reset = useCallback(() => {
    setLaneState(null);
    setNicheState(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const value = useMemo<VisitorContextValue>(
    () => ({
      lane,
      niche,
      setLane,
      setNiche,
      reset,
      isPersonalized: Boolean(lane && niche),
    }),
    [lane, niche, setLane, setNiche, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVisitor() {
  return useContext(Ctx);
}

// Helper used by ContextPill + Index re-skin — translates a stored niche
// slug into a display name from the playbook registry. Falls back to the
// slug capitalized.
export function nicheDisplayName(slug: string | null | undefined): string {
  if (!slug) return "";
  const p = getPlaybook(slug);
  if (p) return p.displayName;
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function laneDisplayName(lane: VisitorLane): string {
  if (lane === "smb") return "SMB";
  if (lane === "startup") return "Startup";
  if (lane === "agency") return "Agency";
  return "";
}
