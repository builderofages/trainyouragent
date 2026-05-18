// src/components/AiChat.tsx
// Floating AI chat widget powered by your Claude/GPT instance via /api/chat.
// Drops bottom-right on every page. Streams responses.
// v53: clean UTF-8 source (kills mojibake), uses FloatersProvider mutex,
//      passes visitor niche to /api/chat for personalized answers.

import { useEffect, useRef, useState } from "react";
import { useFloaters } from "@/lib/floaters";
import { useVisitor } from "@/lib/visitorContext";

type Msg = { role: "user" | "assistant"; content: string };

const INTRO = "Hey \u{1F44B} I'm TrainYourAgent's AI. Ask me anything about how this works, what we build, what it costs. I'll be direct.";

export default function AiChat() {
  const { open: floaterOpen, set: setFloater, toggle } = useFloaters();
  const open = floaterOpen === "chat";
  const { niche } = useVisitor();

  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: INTRO }]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [msgs, streaming]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    const next: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "assistant", messages: next, niche: niche || undefined }),
      });
      if (!res.ok || !res.body) throw new Error("Chat unavailable");
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let acc = "";
      setMsgs((m) => [...m, { role: "assistant", content: "" }]);
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMsgs((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "I'm offline right now. Easiest path: book 30 min at cal.com/trainyouragent/30min — Alexander will answer directly." }]);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      {!open && (
        <button onClick={() => toggle("chat")} aria-label="Chat with our AI"
                className="fixed right-4 sm:right-5 z-[90] w-14 h-14 rounded-full bg-[#042C53] text-white shadow-[0_10px_30px_-8px_rgba(4,44,83,0.5)] hover:bg-[#0A3D6E] transition flex items-center justify-center group"
                style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", bottom: "calc(1rem + env(safe-area-inset-bottom) + 4rem)" }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#22A36C] border-2 border-white animate-pulse" />
        </button>
      )}
      {open && (
        <div className="fixed right-4 sm:right-5 z-[95] w-[min(380px,calc(100vw-2rem))] h-[min(580px,calc(100dvh-6rem))] rounded-3xl bg-white border border-slate-200 shadow-[0_30px_80px_-20px_rgba(4,44,83,0.55)] flex flex-col overflow-hidden"
             style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", bottom: "calc(1rem + env(safe-area-inset-bottom) + 4rem)" }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-[#042C53] text-white">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#22A36C] animate-pulse" />
              <div>
                <div className="text-[14px] font-semibold leading-tight">TrainYourAgent AI</div>
                <div className="text-[11px] text-white/70 leading-tight">Direct answers · No marketing</div>
              </div>
            </div>
            <button aria-label="Close" onClick={() => setFloater(null)} className="text-white/70 hover:text-white text-[20px] leading-none">×</button>
          </div>

          {/* v64: prominent "Or talk to a human" link at the top of the chat tray.
              Replaces the bottom-left floating pill which was overlapping hero content. */}
          <button
            type="button"
            onClick={() => setFloater("human")}
            className="flex items-center justify-between gap-3 px-5 py-3 border-b border-slate-200 bg-[#F6FAFE] hover:bg-[#EAF3FB] text-left transition"
            aria-label="Talk to a human instead"
          >
            <span className="flex items-center gap-2.5">
              <span className="relative inline-flex w-2.5 h-2.5" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-70 animate-ping" />
                <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[13px] font-semibold text-[#042C53]">Or talk to a human</span>
                <span className="text-[11px] text-slate-600">Reply &lt; 4 business hours</span>
              </span>
            </span>
            <span className="text-[#185FA5] text-[14px] font-semibold" aria-hidden="true">→</span>
          </button>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-[#042C53] text-white rounded-br-md" : "bg-[#F6FAFE] text-[#0B1B2B] border border-slate-200 rounded-bl-md"}`}>
                  {m.content || (streaming && i === msgs.length - 1 ? "…" : "")}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 p-3">
            <div className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                     onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                     placeholder="Ask about pricing, builds…"
                     className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-[16px] sm:text-[14px] min-h-[44px] focus:outline-none focus:border-[#185FA5]" />
              <button onClick={send} disabled={streaming || !input.trim()}
                      className="px-4 py-2.5 rounded-xl bg-[#042C53] text-white text-[13px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-40 min-h-[44px] flex-shrink-0">
                {streaming ? "…" : "Send"}
              </button>
            </div>
            <div className="mt-2 text-[10px] text-slate-500 text-center">
              Powered by Claude · Answers based on TrainYourAgent docs
            </div>
          </div>
        </div>
      )}
    </>
  );
}
