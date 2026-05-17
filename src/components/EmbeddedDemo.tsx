// src/components/EmbeddedDemo.tsx — v51B
// Embedded chat-card that calls the existing /api/chat endpoint in "simulator"
// mode so each /playbooks/{niche} page has a live, niche-tailored AI demo.
//
// Shows the user a pre-filled opener message ("Try this") and surfaces the
// LLM provider via the x-llm-provider response header in a tiny pill.

import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

type Props = {
  mode?: "simulator" | "assistant";
  nicheLabel: string;
  openingMessage: string;
};

export default function EmbeddedDemo({ mode = "simulator", nicheLabel, openingMessage }: Props) {
  const [thread, setThread] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [provider, setProvider] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>("");

  async function send(content: string) {
    if (!content.trim() || sending) return;
    setError("");
    const userMsg: Msg = { role: "user", content: content.trim() };
    const nextThread = [...thread, userMsg];
    setThread(nextThread);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, messages: nextThread }),
      });
      const text = await res.text();
      const llmProvider = res.headers.get("x-llm-provider") || "";
      if (llmProvider) setProvider(llmProvider);
      if (!res.ok) {
        setError("The demo is briefly unavailable. Try again in a few seconds.");
      } else {
        setThread([...nextThread, { role: "assistant", content: text }]);
      }
    } catch {
      setError("Network hiccup — try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#0B1B2B]/10 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-[#F7FAFD] border-b border-[#0B1B2B]/10">
        <div className="flex items-center gap-2.5">
          <span className="relative inline-flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-70 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[13px] font-semibold text-[#042C53]">
            Live: {nicheLabel}
          </span>
        </div>
        {provider && (
          <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-[#185FA5] bg-[#E6F1FB] px-2 py-1 rounded-full">
            Powered by {provider}
          </span>
        )}
      </div>

      <div className="px-5 py-5 min-h-[200px] max-h-[420px] overflow-y-auto space-y-3 text-[14px] leading-[1.55]">
        {thread.length === 0 && (
          <div className="text-[#1B3A5C]/70 italic">
            Try the opening message below — or type your own. This is the same
            agent we ship to clients, calling the same /api/chat endpoint.
          </div>
        )}
        {thread.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-xl ${
                m.role === "user"
                  ? "bg-[#185FA5] text-white"
                  : "bg-[#F7FAFD] text-[#1B3A5C] border border-[#0B1B2B]/10"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-xl bg-[#F7FAFD] text-[#1B3A5C]/70 border border-[#0B1B2B]/10">
              Thinking…
            </div>
          </div>
        )}
        {error && (
          <div className="text-[12px] text-rose-600">{error}</div>
        )}
      </div>

      <div className="border-t border-[#0B1B2B]/10 px-4 py-3 space-y-2">
        {thread.length === 0 && (
          <button
            type="button"
            onClick={() => send(openingMessage)}
            disabled={sending}
            className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#E6F1FB] hover:bg-[#D4E6F5] text-[#042C53] text-[13.5px] transition"
          >
            <span className="font-semibold mr-2">Try this:</span>
            <span className="italic">"{openingMessage}"</span>
          </button>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your own message…"
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#0B1B2B]/15 text-[14px] focus:outline-none focus:border-[#185FA5]"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#042C53] text-white text-[13.5px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-50 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
