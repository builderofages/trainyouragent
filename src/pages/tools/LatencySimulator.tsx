// src/pages/tools/LatencySimulator.tsx
// v41 tool (e): pure-CSS visual demo, 800ms vs 3,500ms.

import { useState } from "react";
import ToolLayout, { NAVY, BLUE, TINT } from "./ToolLayout";
import ToolEmailGate from "./ToolEmailGate";

const SCRIPT = [
  { caller: "Hi, I need an HVAC repair — is anyone there?", agent: "Yes, I'm here. What's going on with the unit?" },
  { caller: "It's making a clicking sound and not cooling.", agent: "Got it. Sounds like a relay. When can I send a tech — today or tomorrow?" },
  { caller: "Today if possible.", agent: "Done. I have a 3pm slot. Confirming the address on file?" },
];

const FAST_MS = 800;
const SLOW_MS = 3500;

export default function LatencySimulator() {
  const [run, setRun] = useState(0);

  return (
    <ToolLayout
      eyebrow="Tool 5 of 5"
      title="800ms vs 3.5s. Watch the difference"
      italicTail="customers actually feel."
      subtitle="Same script. Two agents. One sounds human. One sounds like a chatbot lagging on hotel Wi-Fi."
    >
      <div className="mt-8 flex flex-wrap gap-3 items-center">
        <button
          onClick={() => setRun((n) => n + 1)}
          className="px-5 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] min-h-[44px]"
          aria-label="Replay simulation"
        >
          {run === 0 ? "▶ Play simulation" : "↻ Replay"}
        </button>
        <span className="text-[12px] text-slate-500">Both agents say the same thing. Only response time differs.</span>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FakeChat key={`fast-${run}`} label="TrainYourAgent" sublabel="~800 ms response" delayMs={FAST_MS} good />
        <FakeChat key={`slow-${run}`} label="Competitor"     sublabel="~3.5 s response"   delayMs={SLOW_MS} />
      </div>

      <div className="mt-8 rounded-xl border p-5" style={{ background: TINT, borderColor: BLUE }}>
        <div className="text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1">Why it matters</div>
        <div className="text-[14px] text-slate-700 leading-relaxed">
          Calls with &gt;2s response time show a <strong>54% drop</strong> in booking completion vs. sub-1s. Your customer
          assumed the line died and hung up. Latency is the deal.
        </div>
      </div>

      <ToolEmailGate
        source="tool:latency-simulator"
        reportName="our latency playbook PDF"
        payload={{ fastMs: FAST_MS, slowMs: SLOW_MS }}
      />
    </ToolLayout>
  );
}

function FakeChat({
  label, sublabel, delayMs, good,
}: { label: string; sublabel: string; delayMs: number; good?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between"
        style={{ background: good ? TINT : "#FEF2F2" }}>
        <div>
          <div className="text-[13px] font-semibold" style={{ color: good ? NAVY : "#991B1B" }}>{label}</div>
          <div className="text-[11px] text-slate-500">{sublabel}</div>
        </div>
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: good ? "#10b981" : "#ef4444" }}
          aria-hidden="true"
        />
      </div>
      <div className="p-4 space-y-3 min-h-[360px]">
        {SCRIPT.map((turn, i) => (
          <ChatPair
            key={i}
            caller={turn.caller}
            agent={turn.agent}
            agentDelay={i * (delayMs + 1200) + 600}
            agentRespondMs={delayMs}
          />
        ))}
      </div>
    </div>
  );
}

function ChatPair({ caller, agent, agentDelay, agentRespondMs }: {
  caller: string; agent: string; agentDelay: number; agentRespondMs: number;
}) {
  return (
    <>
      <Bubble who="caller" text={caller} delay={agentDelay - 600} />
      <Bubble who="agent" text={agent} delay={agentDelay + agentRespondMs} />
    </>
  );
}

function Bubble({ who, text, delay }: { who: "caller" | "agent"; text: string; delay: number; }) {
  const isAgent = who === "agent";
  return (
    <div
      className={`max-w-[85%] text-[13px] leading-snug px-3 py-2 rounded-2xl opacity-0`}
      style={{
        animation: `tya-bubble-in 240ms ease-out ${Math.max(0, delay)}ms forwards`,
        background: isAgent ? "#042C53" : "#F1F5F9",
        color: isAgent ? "white" : "#0B1B2B",
        marginLeft: isAgent ? "auto" : 0,
        borderTopLeftRadius: isAgent ? 16 : 4,
        borderTopRightRadius: isAgent ? 4 : 16,
      }}
    >
      {text}
      <style>{`
        @keyframes tya-bubble-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
