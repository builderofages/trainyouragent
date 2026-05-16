// src/pages/Start.tsx
// Pathway Router — full-page, single-card, 3-question profiler that routes
// visitors to a vertical-specific destination and captures email along the way.
//
// State is persisted to localStorage as `tya:pathway` so we can personalize
// other surfaces of the site for return visitors.
//
// Routes outbound to:
//   - /<niche>            (SMB lane → vertical landing page)
//   - /solutions/configurator (Startup lane)
//   - /agency-partner     (Agency lane)
//   - /solutions          (Solo / fallback)
//
// Brand tokens: navy #042C53, blue #185FA5, tint #E6F1FB, white.

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fireEvent } from "@/lib/event";

const FORM_ENDPOINT = "/api/lead";

/* ------------------------------------------------------------------ */
/*  Prism Node Logo                                                   */
/* ------------------------------------------------------------------ */
function PrismNode({ size = 44 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, color: "#042C53" }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <g strokeWidth="4">
          <path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" />
        </g>
        <g strokeWidth="2.4">
          <path d="M 32 6 L 32 58" />
          <path d="M 6 32 L 58 32" />
        </g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Data — buyer lanes, niches, bottlenecks                           */
/* ------------------------------------------------------------------ */
type Lane = "startup" | "smb" | "agency" | "solo";

const LANES: { id: Lane; label: string; sub: string }[] = [
  { id: "startup", label: "Startup",       sub: "Building a product, finding customers." },
  { id: "smb",     label: "SMB",           sub: "An established local or service business." },
  { id: "agency",  label: "Agency",        sub: "I sell services to other businesses." },
  { id: "solo",    label: "Solo operator", sub: "It's just me — coach, creator, consultant." },
];

const STARTUP_STAGES = ["Pre-launch", "0–10 customers", "10+ customers", "Scaling"] as const;

const AGENCY_SIZES = ["1–5 clients", "5–20 clients", "20+ clients", "Building a network"] as const;

const SOLO_KINDS = ["Coach", "Creator", "Consultant", "Other"] as const;

type Niche = {
  slug: string;          // outbound route
  label: string;
  emoji: string;
};

const NICHES: Niche[] = [
  { slug: "/hvac",            label: "HVAC",           emoji: "🔧" },
  { slug: "/roofing",         label: "Roofing",        emoji: "🏠" },
  { slug: "/real-estate",     label: "Real Estate",    emoji: "🏘️" },
  { slug: "/healthcare",      label: "Healthcare",     emoji: "🩺" },
  { slug: "/healthcare",      label: "Dental",         emoji: "🦷" },
  { slug: "/legal",           label: "Legal",          emoji: "⚖️" },
  { slug: "/solutions",       label: "Ecom",           emoji: "🛒" },
  { slug: "/hotels",          label: "Hospitality",    emoji: "🛎️" },
  { slug: "/restaurants",     label: "Restaurants",    emoji: "🍴" },
  { slug: "/accounting",      label: "Accounting",     emoji: "📊" },
  { slug: "/agency-partner",  label: "Agencies",       emoji: "🤝" },
  { slug: "/spas",            label: "Salons / Spas",  emoji: "💆" },
  { slug: "/hotels",          label: "Hotels",         emoji: "🏨" },
  { slug: "/automotive",      label: "Automotive",     emoji: "🚗" },
  { slug: "/solar",           label: "Solar",          emoji: "☀️" },
  { slug: "/gym",             label: "Gym / Fitness",  emoji: "🏋️" },
  { slug: "/logistics",       label: "Logistics",      emoji: "📦" },
  { slug: "/bars-nightclubs", label: "Bars / Nightclubs", emoji: "🍸" },
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
/*  Pathway state                                                     */
/* ------------------------------------------------------------------ */
type Pathway = {
  lane?: Lane;
  branch?: string; // stage | niche label | agency size | solo kind
  branchSlug?: string; // niche slug, if SMB
  bottleneck?: string;
  email?: string;
  completedAt?: string;
};

const STORAGE_KEY = "tya:pathway";

function loadPathway(): Pathway {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Pathway) : {};
  } catch {
    return {};
  }
}
function savePathway(p: Pathway) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/*  Routing logic                                                     */
/* ------------------------------------------------------------------ */
function routeFor(p: Pathway): string {
  if (p.lane === "smb" && p.branchSlug) return p.branchSlug;
  if (p.lane === "startup") return "/solutions/configurator";
  if (p.lane === "agency") return "/agency-partner";
  return "/solutions";
}

/* ================================================================== */
/*  Component                                                         */
/* ================================================================== */
export default function Start() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [pathway, setPathway] = useState<Pathway>({});
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  // Load any pre-existing pathway on mount + fire router_view once.
  useEffect(() => {
    const existing = loadPathway();
    if (existing.lane) setPathway(existing);
    if (existing.email) setEmail(existing.email);
    void fireEvent("router_view", { resumed: existing.lane ? 1 : 0 });
  }, []);

  // Inject Inter Tight font once (matches the rest of the site).
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  /* ----- handlers ----- */
  const pickLane = (lane: Lane) => {
    const next = { ...pathway, lane, branch: undefined, branchSlug: undefined };
    setPathway(next);
    savePathway(next);
    setStep(2);
    void fireEvent("router_lane_chosen", { lane });
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
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          source: "pathway-router",
          path: typeof location !== "undefined" ? location.pathname : "/start",
          payload: {
            lane: final.lane,
            branch: final.branch,
            branchSlug: final.branchSlug,
            bottleneck: final.bottleneck,
          },
        }),
      });
      setSubmitState("ok");
      void fireEvent("router_email_gate", { email_provided: true });
      setTimeout(() => navigate(routeFor(final)), 700);
    } catch {
      // Still route them — we have their answers in localStorage.
      setSubmitState("err");
      void fireEvent("router_email_gate", { email_provided: false });
      setTimeout(() => navigate(routeFor(final)), 1200);
    }
  };

  const goBack = () => {
    if (step === 1) return;
    setStep((s) => (s - 1) as 1 | 2 | 3 | 4);
  };

  /* ----- step 2 options ----- */
  const branchOptions = useMemo(() => {
    if (pathway.lane === "startup")
      return STARTUP_STAGES.map((s) => ({ label: s, slug: undefined as string | undefined }));
    if (pathway.lane === "agency")
      return AGENCY_SIZES.map((s) => ({ label: s, slug: undefined as string | undefined }));
    if (pathway.lane === "solo")
      return SOLO_KINDS.map((s) => ({ label: s, slug: undefined as string | undefined }));
    return [];
  }, [pathway.lane]);

  /* ----- step 3 bottlenecks ----- */
  const bottleneckOptions: readonly string[] = useMemo(() => {
    if (pathway.lane === "startup") return BOTTLENECKS_STARTUP;
    if (pathway.lane === "agency") return BOTTLENECKS_AGENCY;
    return BOTTLENECKS_BASE;
  }, [pathway.lane]);

  /* ----- progress meter ----- */
  const progress = step === 1 ? 0.15 : step === 2 ? 0.4 : step === 3 ? 0.7 : 0.95;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        background: "linear-gradient(160deg, #E6F1FB 0%, #FFFFFF 55%, #E6F1FB 100%)",
        fontFamily: "'Inter Tight', system-ui, sans-serif",
        color: "#042C53",
      }}
    >
      {/* Skip → home */}
      <Link
        to="/"
        className="absolute top-5 right-6 text-[13px] uppercase tracking-[0.18em] font-semibold text-[#185FA5] hover:text-[#042C53] transition-colors"
        aria-label="Skip pathway and go home"
      >
        Skip →
      </Link>

      {/* Logo / brand mark */}
      <Link to="/" className="absolute top-5 left-6 inline-flex items-center gap-2">
        <PrismNode size={32} />
        <span className="text-[14px] font-bold tracking-tight">TrainYourAgent</span>
      </Link>

      <main className="w-full max-w-3xl px-6 py-16">
        {/* Card */}
        <section
          className="relative rounded-[28px] bg-white border border-slate-200 shadow-[0_30px_80px_-20px_rgba(4,44,83,0.25)] overflow-hidden"
          style={{ minHeight: 520 }}
        >
          {/* Progress */}
          <div className="h-1.5 w-full bg-[#E6F1FB]">
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{ width: `${progress * 100}%`, background: "#185FA5" }}
            />
          </div>

          <div className="px-7 sm:px-12 py-10 sm:py-14">
            {/* Header */}
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold">
                <PrismNode size={20} />
                Pathway · Step {step} of 4
              </div>
              {step > 1 && step < 4 && (
                <button
                  onClick={goBack}
                  className="text-[12px] uppercase tracking-[0.18em] text-slate-500 hover:text-[#042C53]"
                >
                  ← Back
                </button>
              )}
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <StepFade key="step1">
                <h1 className="text-[34px] sm:text-[44px] leading-[1.05] font-bold text-[#042C53] mb-3">
                  What kind of business are you?
                </h1>
                <p className="text-[15px] sm:text-[17px] text-slate-600 mb-8 max-w-xl">
                  We use this once. It tells us which playbook to put in front of you.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LANES.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => pickLane(l.id)}
                      className="text-left rounded-2xl border border-slate-200 hover:border-[#185FA5] hover:bg-[#E6F1FB] transition-all p-5 group"
                    >
                      <div className="text-[18px] font-semibold text-[#042C53] mb-1 group-hover:text-[#042C53]">
                        {l.label}
                      </div>
                      <div className="text-[13px] text-slate-600">{l.sub}</div>
                    </button>
                  ))}
                </div>
              </StepFade>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <StepFade key="step2">
                <h1 className="text-[30px] sm:text-[40px] leading-[1.07] font-bold text-[#042C53] mb-3">
                  {pathway.lane === "startup" && "What stage are you at?"}
                  {pathway.lane === "smb" && "What's your industry?"}
                  {pathway.lane === "agency" && "How many clients do you have?"}
                  {pathway.lane === "solo" && "What do you do?"}
                </h1>
                <p className="text-[15px] text-slate-600 mb-7 max-w-xl">
                  Pick the closest match. We'll route the rest.
                </p>

                {pathway.lane === "smb" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {NICHES.map((n) => (
                      <button
                        key={n.label}
                        onClick={() => pickBranch(n.label, n.slug)}
                        className="rounded-xl border border-slate-200 hover:border-[#185FA5] hover:bg-[#E6F1FB] transition-all py-4 px-3 text-left"
                      >
                        <div className="text-[20px] mb-1" aria-hidden="true">
                          {n.emoji}
                        </div>
                        <div className="text-[13px] font-semibold text-[#042C53] leading-tight">
                          {n.label}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {branchOptions.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => pickBranch(opt.label, opt.slug)}
                        className="text-left rounded-2xl border border-slate-200 hover:border-[#185FA5] hover:bg-[#E6F1FB] transition-all p-5"
                      >
                        <div className="text-[16px] font-semibold text-[#042C53]">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                )}
              </StepFade>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <StepFade key="step3">
                <h1 className="text-[30px] sm:text-[40px] leading-[1.07] font-bold text-[#042C53] mb-3">
                  What's your biggest bottleneck right now?
                </h1>
                <p className="text-[15px] text-slate-600 mb-7 max-w-xl">
                  Be honest — we'll match the build to where it'll move the needle.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bottleneckOptions.map((b) => (
                    <button
                      key={b}
                      onClick={() => pickBottleneck(b)}
                      className="text-left rounded-2xl border border-slate-200 hover:border-[#185FA5] hover:bg-[#E6F1FB] transition-all p-5"
                    >
                      <div className="text-[16px] font-semibold text-[#042C53]">{b}</div>
                    </button>
                  ))}
                </div>
              </StepFade>
            )}

            {/* Step 4 — email gate */}
            {step === 4 && (
              <StepFade key="step4">
                <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">
                  Almost there
                </div>
                <h1 className="text-[32px] sm:text-[42px] leading-[1.07] font-bold text-[#042C53] mb-3">
                  Get your custom AI plan
                </h1>
                <p className="text-[15px] text-slate-600 mb-7 max-w-xl">
                  We'll route you to your tailored playbook and email a copy you can share with
                  your team.
                </p>

                {/* Recap chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {pathway.lane && <Chip>{labelForLane(pathway.lane)}</Chip>}
                  {pathway.branch && <Chip>{pathway.branch}</Chip>}
                  {pathway.bottleneck && <Chip>{pathway.bottleneck}</Chip>}
                </div>

                <form onSubmit={submitEmail} className="flex flex-col sm:flex-row gap-2 max-w-xl">
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="flex-1 px-4 py-3.5 rounded-xl bg-white border border-slate-300 text-[15px] focus:outline-none focus:border-[#185FA5] focus:ring-4 focus:ring-[#E6F1FB]"
                  />
                  <button
                    type="submit"
                    disabled={submitState === "sending" || submitState === "ok"}
                    className="px-6 py-3.5 rounded-xl bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 whitespace-nowrap"
                  >
                    {submitState === "ok"
                      ? "Routing you →"
                      : submitState === "sending"
                      ? "Sending…"
                      : "Get my plan →"}
                  </button>
                </form>
                {submitState === "err" && (
                  <div className="mt-3 text-[12px] text-[#B23] italic">
                    Couldn't reach the server — sending you to your plan anyway.
                  </div>
                )}
                <div className="mt-5 text-[12px] text-slate-500">
                  No spam. Unsubscribe in one click. By submitting you agree to our{" "}
                  <Link to="/privacy" className="underline">
                    privacy policy
                  </Link>
                  .
                </div>
              </StepFade>
            )}
          </div>
        </section>

        {/* Footer note */}
        <div className="mt-6 text-center text-[12px] text-slate-500">
          Built by Alexander Mills · Tampa Bay · The Everything-AI company.
        </div>
      </main>
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
      return "Solo operator";
  }
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[12px] font-semibold uppercase tracking-[0.12em]">
      {children}
    </span>
  );
}

/* Lightweight fade-in wrapper — no extra deps, uses CSS only. */
function StepFade({ children, ...rest }: { children: React.ReactNode; key?: string }) {
  return (
    <div
      {...rest}
      style={{
        animation: "tya-fade 360ms ease-out both",
      }}
    >
      <style>{`
        @keyframes tya-fade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {children}
    </div>
  );
}
