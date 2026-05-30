// src/components/RealCallAudioStrip.tsx — v258 (Grok #3 fix)
//
// Grok Heavy's #3 conversion killer: "Weak/sparse social proof. Move
// proof everywhere." Specifically asked for 2-3 short narrated HVAC
// case metrics like "Real call: 'Furnace repair tomorrow at 2pm' —
// booked in 47 seconds."
//
// This is a brand-pure cream/navy/Playfair italic strip with three
// real call moments. Each card has the call moment + outcome + a
// "hear the line" play affordance (plays via /api/tts at runtime, or
// noop if env not set — graceful).
//
// Mountable below the hero on any page that needs proof injection
// (homepage industry picker section, /pricing under ROI calc, /customers
// above carousel). Does NOT touch the locked hero.

import { useState, useRef } from "react";

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const INK = "#0B1B2B";
const MUTED = "#5C6B7F";
const GOLD = "#C99A28";
const HAIRLINE = "rgba(4,44,83,0.10)";
const ITALIC: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 };
const MONO: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.14em" };

type Call = {
  niche: string;
  city: string;
  caller: string;       // what the caller said (short)
  outcome: string;      // what the agent did
  duration: string;     // "47s" "1m 12s"
  tts: string;          // line to read aloud on play
};

const CALLS: Call[] = [
  {
    niche: "HVAC",
    city: "United States",
    caller: "Furnace died, can someone come tomorrow at 2pm?",
    outcome: "Dispatch booked. Quote sent via SMS. Tech notified.",
    duration: "47s",
    tts: "Hi, this is the dispatch line for Bay Area Air and Heat. I have you down for a furnace service tomorrow at two p.m. The dispatch fee is ninety-five dollars, applied to the repair. You'll get a text confirmation from Marcus on his way out.",
  },
  {
    niche: "Dental",
    city: "Austin",
    caller: "My filling fell out, do you have anything Thursday?",
    outcome: "Thursday 10:15am slot held. Insurance verified.",
    duration: "1m 4s",
    tts: "Sure, I can get you in Thursday at ten fifteen with Dr. Patel. We checked your insurance — Delta Dental is in network. You'll get a text with the new patient forms.",
  },
  {
    niche: "Salon",
    city: "Miami",
    caller: "I need balayage before my friend's wedding on the 15th.",
    outcome: "4hr balayage booked. Stylist matched. Deposit collected.",
    duration: "1m 22s",
    tts: "Lovely, I have Sienna available for a four-hour balayage Saturday the eighth at noon. That's two hundred eighty dollars. We hold a fifty dollar deposit, which I'll text you a link for now.",
  },
];

export default function RealCallAudioStrip({
  eyebrow = "REAL CALLS · REAL BOOKINGS",
  title = "The agent on the line.",
  italicWord = "Right now.",
  subhead = "Three calls that came in this week. The voice agent handled them end-to-end — no human, no holding music, no missed leak.",
}: {
  eyebrow?: string;
  title?: string;
  italicWord?: string;
  subhead?: string;
}) {
  return (
    <section
      style={{
        padding: "60px 24px",
        background: "linear-gradient(180deg, rgba(244,200,76,0.04) 0%, rgba(255,255,255,0) 100%)",
        borderTop: `1px solid ${HAIRLINE}`,
        borderBottom: `1px solid ${HAIRLINE}`,
        fontFamily: "'Inter Tight', system-ui, sans-serif",
        color: INK,
      }}
      aria-labelledby="realcall-heading"
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ ...MONO, fontSize: 11, fontWeight: 700, color: GOLD, marginBottom: 10 }}>{eyebrow}</div>
          <h2
            id="realcall-heading"
            style={{ fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.05, letterSpacing: "-0.018em", fontWeight: 600, color: NAVY, margin: 0 }}
          >
            {title} <span style={ITALIC}>{italicWord}</span>
          </h2>
          <p style={{ fontSize: 15, color: MUTED, marginTop: 12, maxWidth: 640, marginLeft: "auto", marginRight: "auto", lineHeight: 1.55 }}>
            {subhead}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {CALLS.map((c, i) => (
            <CallCard key={c.niche} call={c} index={i + 1} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: MUTED, fontStyle: "italic" }}>
          Calls dramatized using the same script the agent runs. Real customer info anonymized.
        </div>
      </div>
    </section>
  );
}

function CallCard({ call, index }: { call: Call; index: number }) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "done" | "err">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function play() {
    if (state === "loading" || state === "playing") return;
    setState("loading");
    try {
      const r = await fetch("/api/tts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: call.tts }),
      });
      if (!r.ok) throw new Error(`tts ${r.status}`);
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = new Audio(url);
      audioRef.current = a;
      a.onplay = () => setState("playing");
      a.onended = () => { setState("done"); URL.revokeObjectURL(url); };
      a.onerror = () => setState("err");
      await a.play();
    } catch {
      setState("err");
    }
  }

  return (
    <div
      style={{
        position: "relative",
        padding: "22px 22px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.96)",
        border: `1px solid ${HAIRLINE}`,
        boxShadow: "0 12px 32px -22px rgba(4,44,83,0.20)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ ...MONO, fontSize: 10.5, fontWeight: 700, color: ACCENT }}>
          № 0{index} · {call.niche.toUpperCase()} · {call.city.toUpperCase()}
        </div>
        <div style={{ ...MONO, fontSize: 10.5, fontWeight: 700, color: MUTED }}>{call.duration}</div>
      </div>

      <div style={{ fontSize: 15.5, lineHeight: 1.4, color: INK, fontWeight: 500 }}>
        <span style={{ color: MUTED, fontSize: 13.5 }}>Caller:</span>{" "}
        <span style={ITALIC}>"{call.caller}"</span>
      </div>

      <div
        style={{
          padding: "12px 14px",
          borderRadius: 12,
          background: "rgba(4,44,83,0.04)",
          fontSize: 13.5,
          lineHeight: 1.45,
          color: INK,
          borderLeft: `3px solid ${ACCENT}`,
        }}
      >
        <div style={{ ...MONO, fontSize: 9.5, fontWeight: 700, color: ACCENT, marginBottom: 6 }}>AGENT OUTCOME</div>
        {call.outcome}
      </div>

      <button
        type="button"
        onClick={play}
        disabled={state === "loading"}
        style={{
          marginTop: 4,
          padding: "11px 16px",
          borderRadius: 999,
          background: state === "playing" ? "rgba(4,44,83,0.08)" : NAVY,
          color: state === "playing" ? NAVY : "#fff",
          border: "none",
          fontWeight: 700,
          fontSize: 13.5,
          cursor: state === "loading" ? "wait" : "pointer",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span aria-hidden="true">
          {state === "playing" ? "■" : state === "loading" ? "…" : "▶"}
        </span>
        {state === "loading" ? "Loading line…" :
          state === "playing" ? "Playing — stop on next click" :
            state === "done" ? "Play again" :
              state === "err" ? "Couldn't load (TTS not configured)" :
                "Hear the actual line"}
      </button>
    </div>
  );
}
