// src/pages/Onboarding.tsx — route /onboarding
// v38: Post-purchase onboarding flow. Stripe checkout success URL points
// here with ?session_id={CHECKOUT_SESSION_ID} appended.
//
// 5 steps with progress indicator + per-step localStorage completion.
// Each step's "Mark complete" persists so a refresh restores the state.
//
// Steps:
//   1. Welcome video + intro to Alexander
//   2. Schedule the kickoff call (Cal.com inline embed)
//   3. Connect CRM / calendar / dispatch / payments
//   4. Approve agent voice + scripts (link out to draft review)
//   5. Go live (deterministic timeline)

import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const CAL_URL_BOOK = "https://cal.com/trainyouragent/30min";
const STORAGE_KEY = "tya:onboarding:complete:v1";

type StepId = "welcome" | "kickoff" | "connect" | "approve" | "golive";

const STEPS: { id: StepId; title: string; eyebrow: string }[] = [
  { id: "welcome", eyebrow: "Step 1", title: "Welcome — meet your build team" },
  { id: "kickoff", eyebrow: "Step 2", title: "Schedule the kickoff call" },
  { id: "connect", eyebrow: "Step 3", title: "Connect CRM, calendar, dispatch" },
  { id: "approve", eyebrow: "Step 4", title: "Approve your agent's voice + scripts" },
  { id: "golive",  eyebrow: "Step 5", title: "Go live" },
];

const INTEGRATIONS = [
  { label: "Cal.com",        href: "https://cal.com",                       blurb: "Calendar + booking. We embed your own Cal team." },
  { label: "HubSpot",        href: "https://hubspot.com",                   blurb: "Lead + contact sync. Bidirectional updates." },
  { label: "ServiceTitan",   href: "https://servicetitan.com",              blurb: "Service-business dispatch + tickets." },
  { label: "Stripe",         href: "https://stripe.com",                    blurb: "Payments + subscription handoff." },
  { label: "GoHighLevel",    href: "https://gohighlevel.com",               blurb: "Agency-side CRM + pipelines." },
  { label: "Twilio",         href: "https://twilio.com",                    blurb: "Number provisioning + SIP routing." },
];

function BrainLogo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, color: "#042C53" }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
        <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
        <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

function loadComplete(): Record<StepId, boolean> {
  if (typeof window === "undefined") return {} as any;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {} as any;
    return JSON.parse(raw);
  } catch { return {} as any; }
}
function saveComplete(state: Record<StepId, boolean>) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

const Onboarding = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id") || "";
  const [complete, setComplete] = useState<Record<StepId, boolean>>(() => loadComplete());

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Welcome — Onboarding — TrainYourAgent";
  }, []);

  // Re-save whenever complete changes.
  useEffect(() => { saveComplete(complete); }, [complete]);

  const totalDone = useMemo(
    () => STEPS.reduce((n, s) => n + (complete[s.id] ? 1 : 0), 0),
    [complete]
  );
  const pct = Math.round((totalDone / STEPS.length) * 100);

  const mark = (id: StepId, v: boolean) => setComplete((c) => ({ ...c, [id]: v }));

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav />
      <main className="pt-28">
        {/* Header */}
        <section className="px-5 sm:px-8 pt-10 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E5F4EC] text-[#1F7E55] text-[12px] font-semibold tracking-[0.12em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C]" /> Purchase confirmed
            </div>
            <h1 className="text-[clamp(34px,5vw,64px)] leading-[1.05] tracking-tight font-semibold text-[#042C53] mb-4">
              Welcome. Let's get you live.
            </h1>
            <p className="text-[17px] text-slate-700 max-w-2xl leading-relaxed">
              Five steps. Most builds finish step 5 in seven business days. Mark each one complete as you go — your progress saves automatically.
            </p>
            {sessionId && (
              <div className="mt-4 text-[12px] text-slate-400 font-mono">
                Stripe session: {sessionId.slice(0, 32)}…
              </div>
            )}

            {/* Progress bar */}
            <div className="mt-8">
              <div className="flex items-center justify-between text-[12px] uppercase tracking-[0.14em] text-slate-500 font-semibold mb-2">
                <span>Progress</span>
                <span>{totalDone}/{STEPS.length} · {pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#185FA5] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="px-5 sm:px-8 pb-16">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Step 1 — Welcome video */}
            <StepCard
              step={STEPS[0]}
              done={!!complete.welcome}
              onToggle={(v) => mark("welcome", v)}
            >
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#E6F1FB] to-[#DCEBFA] border border-slate-200 flex items-center justify-center text-[#185FA5] text-[14px]">
                [TBD — embed welcome video Loom URL]
              </div>
              <p className="text-[14px] text-slate-600 mt-4 leading-relaxed">
                Three-minute intro from Alexander on how the next week works and who you'll be talking to.
              </p>
            </StepCard>

            {/* Step 2 — Kickoff call */}
            <StepCard
              step={STEPS[1]}
              done={!!complete.kickoff}
              onToggle={(v) => mark("kickoff", v)}
            >
              <div className="rounded-2xl bg-[#F6FAFE] border border-slate-200 p-5">
                <div className="text-[14px] text-[#042C53] mb-4">
                  Pick the first slot that works. We aim to do the kickoff within 48 hours of purchase.
                </div>
                <a
                  href={CAL_URL_BOOK}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex px-6 py-3 rounded-xl bg-[#042C53] text-white font-semibold text-[14px] hover:bg-[#0A3D6E] shadow-sm"
                >
                  Book kickoff on Cal.com →
                </a>
              </div>
            </StepCard>

            {/* Step 3 — Connect */}
            <StepCard
              step={STEPS[2]}
              done={!!complete.connect}
              onToggle={(v) => mark("connect", v)}
            >
              <p className="text-[14px] text-slate-600 mb-5 leading-relaxed">
                Click into each tool you use so we can request scoped tokens during kickoff. You don't have to set anything up yourself — we drive it.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {INTEGRATIONS.map((i) => (
                  <a
                    key={i.label}
                    href={i.href}
                    target="_blank"
                    rel="noopener"
                    className="block rounded-xl bg-white border border-slate-200 p-4 hover:border-[#185FA5]/60 transition"
                  >
                    <div className="text-[15px] font-semibold text-[#042C53]">{i.label}</div>
                    <div className="text-[12px] text-slate-500 mt-1">{i.blurb}</div>
                  </a>
                ))}
              </div>
            </StepCard>

            {/* Step 4 — Approve */}
            <StepCard
              step={STEPS[3]}
              done={!!complete.approve}
              onToggle={(v) => mark("approve", v)}
            >
              <p className="text-[14px] text-slate-600 mb-4 leading-relaxed">
                We send a draft voice + script package within 72 hours of kickoff. You'll review the agent's name, prosody, opener, qualification questions, and the escalation script.
              </p>
              <ul className="space-y-2 text-[14px] text-[#042C53]">
                <li>· Voice sample — 3 options to pick from.</li>
                <li>· Opening line — exactly what callers hear in the first 4 seconds.</li>
                <li>· Qualification script — your questions, your order.</li>
                <li>· Escalation routing — when the agent hands off and to whom.</li>
              </ul>
            </StepCard>

            {/* Step 5 — Go live */}
            <StepCard
              step={STEPS[4]}
              done={!!complete.golive}
              onToggle={(v) => mark("golive", v)}
            >
              <p className="text-[14px] text-slate-600 mb-3 leading-relaxed">
                Cutover happens at 9am ET on day 7. You'll get a Loom from Alexander confirming the agent is live and a dashboard link with every call as it comes in.
              </p>
              <div className="rounded-2xl bg-[#042C53] text-white p-5">
                <div className="text-[12px] uppercase tracking-[0.14em] text-white/70 font-semibold mb-1">After go-live</div>
                <div className="text-[14px] leading-relaxed">
                  Weekly model refresh, monthly call with Alexander, no account-manager layer between you and the build.
                </div>
              </div>
            </StepCard>
          </div>
        </section>

        {/* Done CTA */}
        {pct === 100 && (
          <section className="px-5 sm:px-8 py-16 bg-[#042C53] text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-[32px] sm:text-[44px] leading-tight font-semibold">
                You're <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>fully onboarded.</span>
              </h2>
              <p className="mt-5 text-[16px] text-white/85 leading-relaxed">
                We've got it from here. Watch your inbox for the day-1, day-3, and day-7 emails.
              </p>
              <Link to="/dashboard" className="mt-7 inline-flex px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg">
                Open the dashboard →
              </Link>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-x-6 gap-y-2 flex-wrap justify-center">
            <Link to="/dashboard" className="hover:text-[#042C53]">Dashboard</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
            <Link to="/status" className="hover:text-[#042C53]">Status</Link>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent, Inc.</div>
        </div>
      </footer>
    </div>
  );
};

function StepCard({
  step, done, onToggle, children,
}: {
  step: { id: StepId; title: string; eyebrow: string };
  done: boolean;
  onToggle: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <article className={`rounded-3xl border bg-white p-6 sm:p-8 transition ${done ? "border-[#22A36C]/60 bg-[#F4FBF7]" : "border-slate-200"}`}>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-1">{step.eyebrow}</div>
          <h3 className="text-[22px] sm:text-[26px] font-semibold text-[#042C53] leading-tight">{step.title}</h3>
        </div>
        <button
          type="button"
          onClick={() => onToggle(!done)}
          aria-pressed={done}
          className={`flex-shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-full text-[12px] font-semibold transition ${
            done
              ? "bg-[#22A36C] text-white hover:bg-[#1F7E55]"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {done ? <><Check /> Done</> : <>Mark complete</>}
        </button>
      </div>
      <div>{children}</div>
    </article>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default Onboarding;
