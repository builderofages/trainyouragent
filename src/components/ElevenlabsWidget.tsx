// src/components/ElevenlabsWidget.tsx
// Embeds the ElevenLabs Convai widget. Pass your agent_id.
// Default uses Alexander's existing agent: agent_5801k8nhs68yfyb8m0px86cdp6fc

import { useEffect } from "react";

type Props = {
  agentId?: string;
  variant?: "inline" | "floating";
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { "agent-id": string }, HTMLElement>;
    }
  }
}

export default function ElevenlabsWidget({
  agentId = "agent_5801k8nhs68yfyb8m0px86cdp6fc",
  variant = "inline",
}: Props) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("elevenlabs-convai-script")) return;
    // v33a perf: defer widget boot to idle time so it never blocks LCP/TBT.
    const inject = () => {
      if (document.getElementById("elevenlabs-convai-script")) return;
      const s = document.createElement("script");
      s.id = "elevenlabs-convai-script";
      s.src = "https://elevenlabs.io/convai-widget/index.js";
      s.async = true;
      s.defer = true;
      s.type = "text/javascript";
      document.body.appendChild(s);
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(inject, { timeout: 3000 });
    } else {
      w.setTimeout(inject, 1800);
    }
  }, []);

  if (variant === "floating") {
    // The widget itself docks bottom-right when placed at body level.
    return <elevenlabs-convai agent-id={agentId} />;
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#042C53] to-[#0A3D6E] text-white p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(4,44,83,0.35)]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <div className="flex items-center gap-3 mb-4">
        <span className="w-2 h-2 rounded-full bg-[#22A36C] animate-pulse" />
        <div className="text-[12px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold">Live · Talk to our agent</div>
      </div>
      <h3 className="text-[22px] sm:text-[28px] leading-tight font-semibold mb-2">
        Skip the demo video. <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Talk to one of ours right now.</span>
      </h3>
      <p className="text-[14px] text-white/80 leading-relaxed mb-5">
        Tap below to start a voice conversation with a TrainYourAgent agent. No download, no signup — runs right in your browser.
      </p>
      <div className="rounded-2xl bg-white/8 border border-white/15 p-4 min-h-[120px] flex items-center justify-center">
        <elevenlabs-convai agent-id={agentId} />
      </div>
      <div className="mt-4 text-[11px] text-white/55 leading-relaxed">Powered by ElevenLabs Convai. Audio stays in your browser until you confirm.</div>
    </div>
  );
}
