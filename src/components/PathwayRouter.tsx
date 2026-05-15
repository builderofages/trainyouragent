// src/components/PathwayRouter.tsx
// Compact, embeddable version of the Pathway Router for the homepage hero
// (right column). Same data + routing logic as src/pages/Start.tsx — narrower
// shell, no big page chrome.
//
// Drop-in usage in the hero:
//   import PathwayRouter from "@/components/PathwayRouter";
//   <PathwayRouter />
//
// State is shared with the full-page version via localStorage `tya:pathway`,
// so a visitor who starts on the hero and finishes on /start (or vice versa)
// keeps their answers.

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pixelEvents } from "@/lib/metaPixel";

const FORM_ENDPOINT = "/api/lead";

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */
type Lane = "startup" | "smb" | "agency" | "solo";

const LANES: { id: Lane; label: string }[] = [
  { id: "startup", label: "Startup" },
  { id: "smb",     label: "SMB" },
  { id: "agency",  label: "Agency" },
  { id: "solo",    label: "Solo" },
];

const STARTUP_STAGES = ["Pre-launch", "0–10 customers", "10+ customers", "Scaling"] as const;
const AGENCY_SIZES   = ["1–5 clients", "5–20 clients", "20+ clients", "Building a network"] as const;
const SOLO_KINDS     = ["Coach", "Creator", "Consultant", "Other"] as const;

type Niche = { slug: string; label: string };
const NICHES: Niche[] = [
  { slug: "/hvac",            label: "HVAC" },
  { slug: "/roofing",         label: "Roofing" },
  { slug: "/real-estate",     label: "Real Estate" },
  { slug: "/healthcare",      label: "Healthcare" },
  { slug: "/healthcare",      label: "Dental" },
  { slug: "/legal",           label: "Legal" },
  { slug: "/solutions",       label: "Ecom" },
  { slug: "/hotels",          label: "Hospitality" },
  { slug: "/restaurants",     label: "Restaurants" },
  { slug: "/accounting",      label: "Accounting" },
  { slug: "/agency-partner",  label: "Agencies" },
  { slug: "/spas",            label: "Salons / Spas" },
  { slug: "/hotels",          label: "Hotels" },
  { slug: "/automotive",      label: "Automotive" },
  { slug: "/solar",           label: "Solar" },
  { slug: "/gym",             label: "Gym" },
  { slug: "/logistics",       label: "Logistics" },
  { slug: "/bars-nightclubs", label: "Bars" },
];

const BOTTLENECKS_BASE = [
  "Missed calls",
  "Lead qualification",
  "Content production",
  "Scaling without hiring",
  "Building infrastructure",
  "Other",
] as const;

const BOTTLENECKS_STARTUP = [
  "Building infrastructure",
  "Lead qualification",
  "Scaling without hiring",
  "Content production",
  "Missed calls",
  "Other",
] as const;

const BOTTLENECKS_AGENCY = [
  "Scaling without hiring",
  "Lead qualification",
  "Content production",
  "Building infrastructure",
  "Missed calls",
  "Other",
] as const;

/* ------------------------------------------------------------------ */
/*  State                                                             */
/* ------------------------------------------------------------------ */
type Pathway = {
  lane?: Lane;
  branch?: string;
  branchSlug?: string;
  bottleneck?: string;
  email?: string;
  completedAt?: string;
};

const STORAGE_KEY = "tya:pathway";

function loadPathway(): Pathway {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    return raw ? (JSON.parse(raw) as Pathway) : {};
  } catch {
    return {};
  }
}
function savePathway(p: Pathway) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

function routeFor(p: Pathway): string {
  if (p.lane === "smb" && p.branchSlug) return p.branchSlug;
  if (p.lane === "startup") return "/solutions/configurator";
  if (p.lane === "agency") return "/agency-partner";
  return "/solutions";
}

/* ------------------------------------------------------------------ */
/*  Prism Node Logo (small)                                           */
/* ------------------------------------------------------------------ */
function PrismNode({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, color: "#185FA5" }}
      aria-hidden="true"
    >
      <g strokeWidth="5">
        <path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" />
      </g>
      <g strokeWidth="3">
        <path d="M 32 6 L 32 58" />
        <path d="M 6 32 L 58 32" />
      </g>
      <circle cx="32" cy="32" r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ================================================================== */
/*  Component                                                         */
/* ================================================================== */
export default function PathwayRouter({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [pathway, setPathway] = useState<Pathway>({});
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  useEffect(() => {
    const existing = loadPathway();
    if (existing.lane) setPathway(existing);
    if (existing.email) setEmail(existing.email);
  }, []);

  const pickLane = (lane: Lane) => {
    const next = { ...pathway, lane, branch: undefined, branchSlug: undefined };
    setPathway(next);
    savePathway(next);
    setStep(2);
  };
  const pickBranch = (branch: string, branchSlug?: string) => {
    const next = { ...pathway, branch, branchSlug };
    setPathway(next);
    savePathway(next);
    setStep(3);
  };
  const pickBottleneck = (bottleneck: string) => {
    const next = { ...pathway, bottleneck };
    setPathway(next);
    savePathway(next);
    setStep(4);
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitState("sending");
    const final: Pathway = { ...pathway, email, completedAt: new Date().toISOString() };
    savePathway(final);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          source: "pathway-router",
          path: typeof location !== "undefined" ? location.pathname : "/",
          payload: {
            lane: final.lane,
            branch: final.branch,
            branchSlug: final.branchSlug,
            bottleneck: final.bottleneck,
          },
        }),
      });
      // Fire Meta Pixel `Lead` (browser + server CAPI mirror) when the lead
      // endpoint accepts the submission. Both fires share the same event_id
      // so Meta dedupes correctly across pixel and CAPI.
      if (res.ok) {
        pixelEvents.lead(
          { email },
          {
            content_name: "pathway-router",
            lane: final.lane,
            branch: final.branch,
            bottleneck: final.bottleneck,
          },
        ).catch(() => { /* non-fatal */ });
      }
      setSubmitState("ok");
      setTimeout(() => navigate(routeFor(final)), 700);
    } catch {
      setSubmitState("err");
      setTimeout(() => navigate(routeFor(final)), 1200);
    }
  };

  const goBack = () => {
    if (step === 1) return;
    setStep((s) => (s - 1) as 1 | 2 | 3 | 4);
  };

  const branchOptions = useMemo(() => {
    if (pathway.lane === "startup") return STARTUP_STAGES.map((s) => ({ label: s, slug: undefined as string | undefined }));
    if (pathway.lane === "agency")  return AGENCY_SIZES.map((s)   => ({ label: s, slug: undefined as string | undefined }));
    if (pathway.lane === "solo")    return SOLO_KINDS.map((s)     => ({ label: s, slug: undefined as string | undefined }));
    return [];
  }, [pathway.lane]);

  const bottleneckOptions: readonly string[] = useMemo(() => {
    if (pathway.lane === "startup") return BOTTLENECKS_STARTUP;
    if (pathway.lane === "agency")  return BOTTLENECKS_AGENCY;
    return BOTTLENECKS_BASE;
  }, [pathway.lane]);

  const progress = step === 1 ? 0.15 : step === 2 ? 0.4 : step === 3 ? 0.7 : 0.95;

  return (
    <div
      className={`relative w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-[0_20px_50px_-15px_rgba(4,44,83,0.25)] overflow-hidden ${className}`}
      style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", color: "#042C53" }}
    >
      {/* Progress bar */}
      <div className="h-1 w-full bg-[#E6F1FB]">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${progress * 100}%`, background: "#185FA5" }}
        />
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold">
            <PrismNode size={14} />
            Pathway · {step}/4
          </div>
          {step > 1 && step < 4 ? (
            <button
              onClick={goBack}
              className="text-[10px] uppercase tracking-[0.18em] text-slate-500 hover:text-[#042C53]"
            >
              ← Back
            </button>
          ) : (
            <Link
              to="/start"
              className="text-[10px] uppercase tracking-[0.18em] text-slate-500 hover:text-[#042C53]"
            >
              Open full →
            </Link>
          )}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <Fade>
            <h3 className="text-[20px] sm:text-[22px] font-bold leading-tight mb-1.5">
              What kind of business are you?
            </h3>
            <p className="text-[12px] text-slate-600 mb-4">Pick one. We'll route the rest.</p>
            <div className="grid grid-cols-2 gap-2">
              {LANES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => pickLane(l.id)}
                  className="text-left rounded-lg border border-slate-200 hover:border-[#185FA5] hover:bg-[#E6F1FB] transition-all px-3 py-2.5 text-[13px] font-semibold text-[#042C53]"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </Fade>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Fade>
            <h3 className="text-[20px] font-bold leading-tight mb-1.5">
              {pathway.lane === "startup" && "What stage?"}
              {pathway.lane === "smb"     && "Your industry?"}
              {pathway.lane === "agency"  && "How many clients?"}
              {pathway.lane === "solo"    && "What do you do?"}
            </h3>
            <p className="text-[12px] text-slate-600 mb-4">Closest match works.</p>

            {pathway.lane === "smb" ? (
              <div className="grid grid-cols-3 gap-1.5 max-h-[260px] overflow-y-auto pr-1">
                {NICHES.map((n) => (
                  <button
                    key={n.label}
                    onClick={() => pickBranch(n.label, n.slug)}
                    className="rounded-md border border-slate-200 hover:border-[#185FA5] hover:bg-[#E6F1FB] transition-all py-2 px-2 text-[11px] font-semibold text-[#042C53] text-center leading-tight"
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {branchOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => pickBranch(opt.label, opt.slug)}
                    className="text-left rounded-lg border border-slate-200 hover:border-[#185FA5] hover:bg-[#E6F1FB] transition-all px-3 py-2.5 text-[12px] font-semibold text-[#042C53]"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </Fade>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <Fade>
            <h3 className="text-[20px] font-bold leading-tight mb-1.5">
              Biggest bottleneck right now?
            </h3>
            <p className="text-[12px] text-slate-600 mb-4">Be honest — we'll match the build.</p>
            <div className="grid grid-cols-1 gap-1.5">
              {bottleneckOptions.map((b) => (
                <button
                  key={b}
                  onClick={() => pickBottleneck(b)}
                  className="text-left rounded-lg border border-slate-200 hover:border-[#185FA5] hover:bg-[#E6F1FB] transition-all px-3 py-2.5 text-[13px] font-semibold text-[#042C53]"
                >
                  {b}
                </button>
              ))}
            </div>
          </Fade>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <Fade>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-1.5">
              Almost there
            </div>
            <h3 className="text-[20px] font-bold leading-tight mb-1.5">
              Get your custom AI plan
            </h3>
            <p className="text-[12px] text-slate-600 mb-3">
              We'll route you to your tailored playbook.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {pathway.lane && <Chip>{labelForLane(pathway.lane)}</Chip>}
              {pathway.branch && <Chip>{pathway.branch}</Chip>}
              {pathway.bottleneck && <Chip>{pathway.bottleneck}</Chip>}
            </div>
            <form onSubmit={submitEmail} className="flex flex-col gap-2">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="px-3 py-2.5 rounded-lg bg-white border border-slate-300 text-[13px] focus:outline-none focus:border-[#185FA5] focus:ring-4 focus:ring-[#E6F1FB]"
              />
              <button
                type="submit"
                disabled={submitState === "sending" || submitState === "ok"}
                className="px-4 py-2.5 rounded-lg bg-[#042C53] text-white text-[13px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60"
              >
                {submitState === "ok"
                  ? "Routing you →"
                  : submitState === "sending"
                  ? "Sending…"
                  : "Get my plan →"}
              </button>
            </form>
            {submitState === "err" && (
              <div className="mt-2 text-[11px] text-[#B23] italic">
                Couldn't reach the server — sending you to your plan anyway.
              </div>
            )}
            <div className="mt-2 text-[10px] text-slate-500">
              No spam. One-click unsubscribe.
            </div>
          </Fade>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function labelForLane(l: Lane) {
  switch (l) {
    case "startup":
      return "Startup";
    case "smb":
      return "SMB";
    case "agency":
      return "Agency";
    case "solo":
      return "Solo";
  }
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[10px] font-semibold uppercase tracking-[0.12em]">
      {children}
    </span>
  );
}

function Fade({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ animation: "tya-fade-sm 320ms ease-out both" }}>
      <style>{`
        @keyframes tya-fade-sm {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {children}
    </div>
  );
}
