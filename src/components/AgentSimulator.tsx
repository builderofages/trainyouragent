// src/components/AgentSimulator.tsx
// Live "type a customer scenario, watch the agent respond" tool.
// v34: vertical-aware. Pass `vertical="hvac"` etc. to pre-load 3 industry-specific
// scenarios; falls back to a generic mixed set when no vertical is given.

import { useEffect, useMemo, useRef, useState } from "react";

type Scenario = { v: string; text: string };

/* ------------------------------------------------------------------ */
/*  VERTICAL_SCENARIOS — 3 realistic prompts per supported industry    */
/* ------------------------------------------------------------------ */
export const VERTICAL_SCENARIOS: Record<string, Scenario[]> = {
  hvac: [
    { v: "HVAC", text: "AC stopped working, 95° in the house — can someone come today?" },
    { v: "HVAC", text: "Need annual tune-up booked for Saturday morning — do you have availability?" },
    { v: "HVAC", text: "Got a $2,500 quote from another company for a new condenser — does that sound right for a 3-ton unit?" },
  ],
  healthcare: [
    { v: "Healthcare", text: "I'm a new patient, need to schedule a physical, do you take Aetna?" },
    { v: "Healthcare", text: "I need to refill my prescription, who do I talk to?" },
    { v: "Healthcare", text: "My kid has 102 fever — can I bring him in this afternoon or do I go to urgent care?" },
  ],
  "real-estate": [
    { v: "Real Estate", text: "I saw your Maple Street listing, still available?" },
    { v: "Real Estate", text: "Looking to sell — what's my house at 1234 Oak Ave probably worth?" },
    { v: "Real Estate", text: "I'm an out-of-state buyer, can we do a virtual showing this weekend?" },
  ],
  legal: [
    { v: "Legal", text: "I think I have a slip-and-fall case from a grocery store last week. Can someone help?" },
    { v: "Legal", text: "I just got served papers for a divorce, what do I do first?" },
    { v: "Legal", text: "My LLC needs an operating agreement — do you do flat-fee business law?" },
  ],
  ecommerce: [
    { v: "E-commerce", text: "I ordered the running shoes a week ago and they haven't shipped — order #44712." },
    { v: "E-commerce", text: "The boots I got are too small — can I swap for a 10.5 instead of returning?" },
    { v: "E-commerce", text: "Do you ship to Canada and what's the duty situation?" },
  ],
  hospitality: [
    { v: "Hospitality", text: "Table for four on Saturday at 7 — patio if you have it?" },
    { v: "Hospitality", text: "What time is check-in and can I get a late checkout?" },
    { v: "Hospitality", text: "Looking to book a room block for a wedding in October — 25 rooms, two nights." },
  ],
  roofing: [
    { v: "Roofing", text: "We had hail Sunday and the ceiling is leaking. Insurance claim — when can someone come?" },
    { v: "Roofing", text: "Need a quote for a full re-roof on a 2,400 sq ft ranch, asphalt shingle." },
    { v: "Roofing", text: "Got a $14k bid from another contractor — can you come look and second-quote?" },
  ],
  solar: [
    { v: "Solar", text: "I saw your ad about solar — average bill is $280, am I a good fit?" },
    { v: "Solar", text: "South-facing roof, no shade, what's a 10kW system run me after rebates?" },
    { v: "Solar", text: "How long does install take and do I lose power during it?" },
  ],
};

/* Generic fallback when no vertical prop is supplied (legacy callers). */
const DEFAULT_SCENARIOS: Scenario[] = [
  { v: "HVAC",        text: "My AC just stopped working and it's 95 degrees in the house. Can someone come today?" },
  { v: "Healthcare",  text: "Hi, I'm a new patient and need to schedule a physical. Do you take Aetna?" },
  { v: "Real Estate", text: "I saw your listing on Maple Street. Is it still available and can I see it Saturday?" },
  { v: "Legal",       text: "I think I have a slip-and-fall case from a grocery store last week. Can someone help?" },
  { v: "Roofing",     text: "We had hail Sunday and the ceiling is leaking. Insurance claim — when can someone come?" },
];

type Props = {
  defaultScenario?: string;
  /** Slug like "hvac" | "healthcare" | "real-estate" | "legal" | "ecommerce" | "hospitality" | "roofing" | "solar" */
  vertical?: string;
};

export default function AgentSimulator({ defaultScenario, vertical }: Props) {
  const scenarios = useMemo<Scenario[]>(() => {
    if (vertical && VERTICAL_SCENARIOS[vertical]) return VERTICAL_SCENARIOS[vertical];
    return DEFAULT_SCENARIOS;
  }, [vertical]);

  const initial = defaultScenario ?? scenarios[0].text;
  const [input, setInput] = useState(initial);
  const [reply, setReply] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const stopRef = useRef(false);

  useEffect(() => () => { stopRef.current = true; }, []);

  // If vertical changes (e.g. user clicks a different page that mounts a new simulator),
  // reset the input to the new vertical's first scenario.
  useEffect(() => {
    setInput(scenarios[0].text);
    setActiveIdx(0);
    setReply("");
  }, [vertical]); // eslint-disable-line react-hooks/exhaustive-deps

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
          messages: [{ role: "user", content: `[Industry: ${scenarios[activeIdx].v}]\n${input}` }],
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
        {scenarios.map((s, i) => (
          <button
            key={i}
            onClick={() => { setActiveIdx(i); setInput(s.text); }}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition border text-left ${activeIdx === i ? "bg-[#042C53] text-white border-[#042C53]" : "bg-[#F6FAFE] text-[#042C53] border-slate-200 hover:border-[#185FA5]"}`}
          >
            Scenario {i + 1}
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
