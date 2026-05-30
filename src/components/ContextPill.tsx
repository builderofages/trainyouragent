// src/components/ContextPill.tsx — v61
// Persistent context pill that sits as a FIXED top strip above SiteNav on
// every page (except /start, /admin, /portal). Always full-width, never
// inline with the logo. Hidden on Home when the visitor has NOT yet set a
// niche (the pathway router in the Home hero is the personalization gate
// in that case — no need for a redundant prompt).
//
// Coordinates with SiteNav via the CSS variable `--tya-pill-h` set on the
// document root: SiteNav reads this and offsets its `top:` so the pill
// strip is never overlapped.

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useVisitor,
  laneDisplayName,
  nicheDisplayName,
  type VisitorLane,
} from "@/lib/visitorContext";
import { PLAYBOOKS } from "@/lib/playbooks";

// v256: /template/* are standalone demo sites that mimic a customer's
// actual website — they have their own sticky top rail. The global
// personalization pill leaks visually over the niche site header, so we
// hide it. Same logic for /reviews/submit (customer-facing form, not a
// TYA marketing page) and /architecture (editorial doc, its own masthead).
const HIDDEN_PATHS = ["/start", "/admin", "/portal", "/template", "/reviews/submit", "/architecture"];
const PILL_HEIGHT_PX = 36;

const LANES: { id: VisitorLane; label: string }[] = [
  { id: "smb",     label: "SMB" },
  { id: "startup", label: "Startup" },
  { id: "agency",  label: "Agency" },
];

export default function ContextPill() {
  const { lane, niche, setLane, setNiche, reset, isPersonalized } = useVisitor();
  const location = useLocation();
  const [editing, setEditing] = useState(false);

  // Close the editor whenever the route changes.
  useEffect(() => { setEditing(false); }, [location.pathname]);

  const hidden = useMemo(
    () => HIDDEN_PATHS.some((p) => location.pathname === p || location.pathname.startsWith(p + "/")),
    [location.pathname],
  );

  // v61: also hide on Home when no personalization is set — the hero's
  // PathwayRouter is already the prompt; an extra strip is just noise.
  const onHome = location.pathname === "/";
  const hideOnHomeUnpersonalized = onHome && !isPersonalized;

  const shouldRender = !hidden && !hideOnHomeUnpersonalized;

  // Publish pill height to the document root so SiteNav can offset itself.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (shouldRender) {
      root.style.setProperty("--tya-pill-h", `${PILL_HEIGHT_PX}px`);
    } else {
      root.style.setProperty("--tya-pill-h", "0px");
    }
    return () => { root.style.setProperty("--tya-pill-h", "0px"); };
  }, [shouldRender]);

  if (!shouldRender) return null;

  const display = isPersonalized
    ? `Operating as: ${nicheDisplayName(niche)} operator · ${laneDisplayName(lane)}`
    : null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] bg-[#042C53] text-white border-b border-[#185FA5]/40 shadow-sm"
      style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", height: PILL_HEIGHT_PX }}
      role="region"
      aria-label="Visitor context"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-full flex items-center justify-between gap-3 text-[12.5px]">
        {display ? (
          <div className="flex items-center gap-2 min-w-0">
            <span aria-hidden="true" className="text-[#9CC4EC]">{"\u{1F464}"}</span>
            <span className="font-semibold truncate">{display}</span>
          </div>
        ) : (
          <div className="text-white">
            What's your business?{" "}
            <Link to="/start" className="font-semibold underline decoration-[#9CC4EC]/60 hover:decoration-white">
              Tell us →
            </Link>
          </div>
        )}
        <div className="flex items-center gap-3 shrink-0">
          {isPersonalized && (
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="text-[#9CC4EC] font-semibold hover:text-white underline decoration-[#9CC4EC]/40 hover:decoration-white"
              aria-expanded={editing}
            >
              {editing ? "Close" : "change"}
            </button>
          )}
          {isPersonalized && (
            <button
              type="button"
              onClick={reset}
              className="text-white/70 hover:text-white"
              aria-label="Clear personalization"
            >
              clear
            </button>
          )}
        </div>
      </div>

      {editing && (
        <div className="absolute top-full left-0 right-0 border-t border-[#185FA5]/40 bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#185FA5] mb-2">Lane</div>
              <div className="flex flex-wrap gap-2">
                {LANES.map((l) => (
                  <button
                    key={l.id || "none"}
                    type="button"
                    onClick={() => setLane(l.id)}
                    className={`px-3 py-1.5 rounded-full border text-[12.5px] font-semibold ${
                      lane === l.id
                        ? "bg-[#042C53] text-white border-[#042C53]"
                        : "bg-white text-[#042C53] border-slate-300 hover:border-[#185FA5]"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#185FA5] mb-2">Industry</div>
              <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto">
                {PLAYBOOKS.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => setNiche(p.slug)}
                    className={`px-2.5 py-1 rounded-full border text-[12px] font-medium ${
                      niche === p.slug
                        ? "bg-[#185FA5] text-white border-[#185FA5]"
                        : "bg-white text-[#042C53] border-slate-300 hover:border-[#185FA5]"
                    }`}
                  >
                    {p.displayName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
