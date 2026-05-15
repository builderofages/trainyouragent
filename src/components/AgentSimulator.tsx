// src/components/AgentSimulator.tsx
// Live "type a customer scenario, watch the agent respond" tool.
// Streams Claude responses via /api/simulate (or falls back to /api/chat with sim system).

import { useEffect, useRef, useState } from "react";

const SCENARIOS = [
  { v: "HVAC",       text: "My AC just stopped working and it's 95 degrees in the house. Can someone come today?" },
  { v: "Healthcare", text: "Hi, I'm a new patient and need to schedule a physical. Do you take Aetna?" },
  { v: "Real Estate",text: "I saw your listing on Maple Street. Is it still available and can I see it Saturday?" },
  { v: "Legal",      text: "I think I have a slip-and-fall case from a grocery store last week. Can someone help?" },
  { v: "Roofing",    text: "We had hail Sunday and the ceiling is leaking. Insurance claim — when can someone come?" },
];

const SIM_SYSTEM = `You ARE a TrainYourAgent voice agent. The user message is what a real customer would say to a business that hired you. Respond as the agent would — short, warm, professional, asking the right qualifying questions and proposing a booking. 1-3 sentences max. No marketing tone. Sound human.`;

export default function AgentSimulator({ defaultScenario = SCENARIOS[0].text }: { defaultScenario?: string }) {
  const [input, setInput] = useState(defaultScenario);
  const [reply, setReply] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [vertical, setVertical] = useState(SCENARIOS[0].v);
  const stopRef = useRef(false);

  useEffect(() => () => { stopRef.current = true; }, []);

  const run = async () => {
    if (streaming || !input.trim()) return;
    setReply("");
    setStreaming(true);
    stopRef.current = false;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "simulator",
          messages: [{ role: "user", content: `[Industry: ${vertical}]\n${input}` }],
        }),
      });
      if (!res.ok || !res.body) throw new Error("sim down");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        if (stopRef.current) break;
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setReply(acc);
      }
    } catch {
      setReply("Agent simulator is offline. Try the live ElevenLabs widget on this page, or call us — (813) 555-0142.");
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-[0_4px_40px_-12px_rgba(4,44,83,0.18)]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
        <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold">Live agent simulator</div>
        <div className="text-[11px] text-slate-500">Powered by Claude · Real model, real response</div>
      </div>
      <h3 className="text-[24px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-5">
        Type what a customer would say. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Watch your agent answer.</span>
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {SCENARIOS.map((s) => (
          <button key={s.v} onClick={() => { setVertical(s.v); setInput(s.text); }}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition border ${vertical === s.v ? "bg-[#042C53] text-white border-[#042C53]" : "bg-[#F6FAFE] text-[#042C53] border-slate-200 hover:border-[#185FA5]"}`}>
            {s.v}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-[#185FA5] font-semibold mb-2">Customer says</div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FAFE] border border-slate-200 text-[14px] focus:outline-none focus:border-[#185FA5] resize-none" />
          <button onClick={run} disabled={streaming || !input.trim()}
                  className="mt-3 px-5 py-2.5 rounded-full bg-[#042C53] text-white text-[13px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50">
            {streaming ? "Agent speaking…" : "Run the agent →"}
          </button>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-[#185FA5] font-semibold mb-2 flex items-center gap-2">
            Agent responds {streaming && <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C] animate-pulse" />}
          </div>
          <div className="min-h-[150px] px-4 py-3 rounded-xl bg-gradient-to-br from-[#042C53] to-[#0A3D6E] text-white text-[14px] leading-relaxed whitespace-pre-wrap">
            {reply || <span className="text-white/50 italic">Hit "Run the agent" to see the response stream in.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
