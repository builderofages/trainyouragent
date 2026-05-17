// src/components/ContextPill.tsx — v53
// Persistent context pill that sits under SiteNav on every page (except
// /start, /admin, /portal). Shows the visitor's current operating context
// (lane + niche) and lets them swap it without going back to /start.

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useVisitor,
  laneDisplayName,
  nicheDisplayName,
  type VisitorLane,
} from "@/lib/visitorContext";
import { PLAYBOOKS } from "@/lib/playbooks";

const HIDDEN_PATHS = ["/start", "/admin", "/portal"];

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
  if (hidden) return null;

  const display = isPersonalized
    ? `Operating as: ${nicheDisplayName(niche)} operator · ${laneDisplayName(lane)}`
    : null;

  return (
    <div
      className="w-full bg-[#E6F1FB] border-b border-[#185FA5]/15"
      style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-2 flex items-center justify-between gap-3 text-[12.5px]">
        {display ? (
          <div className="flex items-center gap-2 text-[#042C53]">
            <span aria-hidden="true">{"\u{1F464}"}</span>
            <span className="font-semibold truncate">{display}</span>
          </div>
        ) : (
          <div className="text-[#042C53]">
            What’s your business?{" "}
            <Link to="/start" className="font-semibold underline decoration-[#185FA5]/40 hover:decoration-[#185FA5]">
              Tell us →
            </Link>
          </div>
        )}
        <div className="flex items-center gap-3 shrink-0">
          {isPersonalized && (
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="text-[#185FA5] font-semibold hover:text-[#042C53] underline decoration-[#185FA5]/30 hover:decoration-[#042C53]"
              aria-expanded={editing}
            >
              {editing ? "Close" : "change"}
            </button>
          )}
          {isPersonalized && (
            <button
              type="button"
              onClick={reset}
              className="text-slate-500 hover:text-[#042C53]"
              aria-label="Clear personalization"
            >
              clear
            </button>
          )}
        </div>
      </div>

      {editing && (
        <div className="border-t border-[#185FA5]/15 bg-white">
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
