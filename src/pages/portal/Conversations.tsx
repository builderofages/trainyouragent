// src/pages/portal/Conversations.tsx
// v76-a: Paginated list of agent transcripts. Pre-launch: shows honest empty
// state. When the agent is live, conversation rows render with click-to-expand.

import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { Customer } from "@/lib/portal";
import { ChevronDown, ChevronRight } from "lucide-react";

const NAVY = "#042C53";

type Ctx = { customer: Customer | null; email: string };

type Convo = {
  id: string;
  timestamp: string;
  caller: string;
  duration_sec: number;
  outcome: "booked" | "escalated" | "info" | "no-answer";
  transcript: string;
};

const OUTCOME_META: Record<Convo["outcome"], { label: string; color: string; bg: string }> = {
  booked: { label: "Booked", color: "#16a34a", bg: "rgba(34,197,94,0.12)" },
  escalated: { label: "Escalated", color: "#b45309", bg: "rgba(245,158,11,0.12)" },
  info: { label: "Info", color: "#0369a1", bg: "rgba(2,132,199,0.12)" },
  "no-answer": { label: "No answer", color: "rgba(4,44,83,0.55)", bg: "rgba(4,44,83,0.06)" },
};

function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

function maskPhone(p: string) {
  const digits = p.replace(/\D/g, "");
  if (digits.length < 4) return p;
  return `(•••) •••-${digits.slice(-4)}`;
}

export default function PortalConversations() {
  const { customer } = useOutletContext<Ctx>();
  const isLive = customer?.agent_status === "production";
  // Always empty pre-launch — no fake data per spec.
  const convos: Convo[] = [];
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[26px] leading-tight tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
          Conversations
        </h1>
        <p className="mt-2 text-[14px]" style={{ color: "rgba(4,44,83,0.65)" }}>
          Every call your agent handled. Click a row to expand the full transcript.
        </p>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "rgba(4,44,83,0.1)" }}>
        {convos.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-[14.5px]" style={{ fontFamily: "Inter Tight, system-ui, sans-serif", color: NAVY }}>
              {isLive ? "No conversations in the selected period." : "Conversations appear here when your agent goes live."}
            </div>
            {!isLive && (
              <p className="mt-2 text-[12.5px]" style={{ color: "rgba(4,44,83,0.55)" }}>
                We don't fabricate sample calls — this page stays empty until your Twilio number is provisioned.
              </p>
            )}
          </div>
        ) : (
          <ul>
            {convos.map((c) => {
              const meta = OUTCOME_META[c.outcome];
              const open = openId === c.id;
              return (
                <li key={c.id} className="border-b last:border-b-0" style={{ borderColor: "rgba(4,44,83,0.08)" }}>
                  <button
                    onClick={() => setOpenId(open ? null : c.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-black/[0.02]"
                  >
                    {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <div className="flex-1 grid grid-cols-12 gap-3 items-center text-[13px]">
                      <div className="col-span-3" style={{ color: "rgba(4,44,83,0.7)" }}>{c.timestamp}</div>
                      <div className="col-span-3 font-mono" style={{ color: NAVY }}>{maskPhone(c.caller)}</div>
                      <div className="col-span-2" style={{ color: "rgba(4,44,83,0.6)" }}>{fmtDuration(c.duration_sec)}</div>
                      <div className="col-span-4">
                        <span className="text-[11px] uppercase tracking-[0.12em] px-2 py-0.5 rounded" style={{ background: meta.bg, color: meta.color }}>
                          {meta.label}
                        </span>
                      </div>
                    </div>
                  </button>
                  {open && (
                    <div className="px-4 pb-4 -mt-1">
                      <pre className="text-[12.5px] whitespace-pre-wrap leading-relaxed bg-black/[0.02] p-3 rounded" style={{ color: NAVY, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                        {c.transcript}
                      </pre>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
