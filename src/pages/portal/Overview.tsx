// src/pages/portal/Overview.tsx
// v76-a: Hero greeting + 4 stat cards + recent activity feed + next action.
// All empty states are honest: pre-launch, the dashboard is the operational
// console, not a fake metrics demo.

import { useOutletContext, Link } from "react-router-dom";
import type { Customer } from "@/lib/portal";
import { AGENT_STAGES } from "@/lib/portal";
import { Phone, Calendar, ArrowRightLeft, Sparkles } from "lucide-react";

const NAVY = "#042C53";

type Ctx = { customer: Customer | null; email: string };

function StatCard({ label, value, sub, icon: Icon }: {
  label: string; value: string; sub?: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}) {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between">
        <div className="text-[11.5px] uppercase tracking-[0.14em] title-mono" style={{ color: "rgba(4,44,83,0.55)" }}>
          {label}
        </div>
        <Icon size={16} strokeWidth={1.6} />
      </div>
      <div className="mt-3 text-[28px] leading-none tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
        {value}
      </div>
      {sub && (
        <div className="mt-1.5 text-[12px]" style={{ color: "rgba(4,44,83,0.55)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function PortalOverview() {
  const { customer, email } = useOutletContext<Ctx>();
  const name = customer?.business_name || email.split("@")[0] || "there";
  const stage = customer?.agent_status || "intake";
  const inProd = stage === "production";
  const currentStage = AGENT_STAGES.find((s) => s.key === stage);
  const nextAction = inProd
    ? "Your agent is live. Review yesterday's transcripts."
    : currentStage
    ? `Next: ${currentStage.label} — ${currentStage.blurb}`
    : "Your discovery call is the next step. We'll email you to book it.";

  return (
    <div className="glass-panel p-6 sm:p-8 holo-cyan">
      <div className="mb-8">
        <h1 className="text-[28px] leading-tight tracking-tight flex items-center gap-2" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
          <span className="trinity-orb" aria-hidden="true" />
          Welcome, <em className="not-italic" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: "italic" }}>{name}</em>
        </h1>
        <p className="mt-2 text-[14px]" style={{ color: "rgba(4,44,83,0.65)" }}>
          {inProd
            ? "Your agent is live. This is your operational console."
            : "Your agent ships in 14–21 days. Until then this dashboard is your operational console."}
        </p>
        <div className="brand-note mt-1">100% REAL • NO SYNTHETIC • HEALTH 72H</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Calls answered" value={inProd ? "—" : "0"} sub={inProd ? "This month" : "Agent not live yet"} icon={Phone} />
        <StatCard label="Appointments booked" value={inProd ? "—" : "0"} sub={inProd ? "This month" : "Agent not live yet"} icon={Calendar} />
        <StatCard label="Hot transfers" value={inProd ? "—" : "0"} sub={inProd ? "This month" : "Agent not live yet"} icon={ArrowRightLeft} />
        <StatCard label="Agent status" value={stage.replace("-", " ")} sub={currentStage?.label || "Intake"} icon={Sparkles} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="text-[11.5px] uppercase tracking-[0.14em] mb-3 title-mono" style={{ color: "rgba(4,44,83,0.55)" }}>
            Recent activity
          </div>
          {inProd ? (
            <div className="text-[13.5px]" style={{ color: "rgba(4,44,83,0.6)" }}>
              No activity in the last 24 hours. Check <Link to="/portal/conversations" className="underline">Conversations</Link> for full history.
            </div>
          ) : (
            <ul className="space-y-3 text-[13.5px]" style={{ color: "rgba(4,44,83,0.78)" }}>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: NAVY }} />
                <span>Account created. Welcome to TrainYourAgent.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "rgba(4,44,83,0.35)" }} />
                <span>Discovery call link coming to your inbox within 24h.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "rgba(4,44,83,0.2)" }} />
                <span>Knowledge-base upload opens after discovery.</span>
              </li>
            </ul>
          )}
        </div>

        <div className="glass-panel p-6" style={{ background: NAVY, color: "#FAF6EE", borderColor: NAVY }}>
          <div className="text-[11.5px] uppercase tracking-[0.14em] opacity-70 mb-3 title-mono">
            Next action
          </div>
          <p className="text-[14.5px] leading-relaxed">{nextAction}</p>
          <Link
            to="/portal/training"
            className="inline-block mt-5 text-[12.5px] underline opacity-90 hover:opacity-100 btn-glass"
            style={{ color: '#FAF6EE', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            View training progress →
          </Link>
        </div>
      </div>
    </div>
  );
}
