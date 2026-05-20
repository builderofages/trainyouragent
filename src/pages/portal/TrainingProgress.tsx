// src/pages/portal/TrainingProgress.tsx
// v76-a: 5-step pipeline visualization. Current step pulled from
// customer.agent_status. Pending/In Progress/Complete derived from stage order.

import { useOutletContext } from "react-router-dom";
import { AGENT_STAGES, type AgentStatus, type Customer } from "@/lib/portal";
import { Check, Clock, Circle } from "lucide-react";

const NAVY = "#042C53";

type Ctx = { customer: Customer | null; email: string };

function statusFor(stageKey: AgentStatus, current: AgentStatus): "complete" | "in-progress" | "pending" {
  const order: AgentStatus[] = ["intake", "discovery", "knowledge-base", "fine-tune", "eval", "production"];
  const ci = order.indexOf(current);
  const si = order.indexOf(stageKey);
  if (current === "production" && stageKey === "production") return "complete";
  if (si < ci) return "complete";
  if (si === ci) return "in-progress";
  return "pending";
}

const STATUS_META = {
  complete: { label: "Complete", bg: "rgba(34,197,94,0.12)", color: "#16a34a", Icon: Check },
  "in-progress": { label: "In Progress", bg: "rgba(4,44,83,0.08)", color: NAVY, Icon: Clock },
  pending: { label: "Pending", bg: "rgba(4,44,83,0.04)", color: "rgba(4,44,83,0.5)", Icon: Circle },
} as const;

export default function PortalTrainingProgress() {
  const { customer } = useOutletContext<Ctx>();
  const current: AgentStatus = customer?.agent_status || "intake";
  const updatedAt = customer?.updated_at ? new Date(customer.updated_at).toLocaleString() : "—";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[26px] leading-tight tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
          Training <em className="not-italic" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: "italic" }}>progress</em>
        </h1>
        <p className="mt-2 text-[14px]" style={{ color: "rgba(4,44,83,0.65)" }}>
          The 5 stages every agent moves through. Last update: {updatedAt}.
        </p>
      </div>

      <ol className="space-y-3">
        {AGENT_STAGES.map((stage, i) => {
          const s = statusFor(stage.key, current);
          const meta = STATUS_META[s];
          const Icon = meta.Icon;
          return (
            <li
              key={stage.key}
              className="rounded-xl border bg-white p-5 flex gap-4"
              style={{ borderColor: s === "in-progress" ? NAVY : "rgba(4,44,83,0.1)" }}
            >
              <div
                className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
                style={{ background: meta.bg, color: meta.color }}
              >
                <Icon size={16} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-[15px] font-medium tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
                    {i + 1}. {stage.label}
                  </div>
                  <span
                    className="text-[11px] uppercase tracking-[0.12em] px-2 py-0.5 rounded"
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    {meta.label}
                  </span>
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: "rgba(4,44,83,0.7)" }}>
                  {stage.blurb}
                </p>
                {s === "in-progress" && (
                  <div className="mt-2 text-[12px]" style={{ color: NAVY }}>
                    Active now. We'll email you when this step closes.
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
