// src/pages/tools/AgentBuilder.tsx
// v60 — Personalized Agent Builder lead-magnet.
// Flow: business name + industry (+ optional context) → custom system prompt
// is constructed server-side in /api/chat. We render a chat widget pre-loaded
// with the agent's intro and 3 industry-specific sample questions. Email
// gate appears after the visitor has chatted with their custom agent.

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import ToolLayout, { NAVY, BLUE, TINT } from "./ToolLayout";
import ToolEmailGate from "./ToolEmailGate";

type ChatMsg = { role: "user" | "assistant"; content: string };

// Mirrors the NICHE_ALLOWLIST in api/chat.ts. Order is the dropdown order.
const NICHE_OPTIONS: Array<{ slug: string; label: string; samples: string[] }> = [
  { slug: "hvac", label: "HVAC contractor", samples: ["My furnace just died, can someone come tonight?", "How much for a tune-up?", "Do you work with my home warranty?"] },
  { slug: "roofing", label: "Roofing contractor", samples: ["I have a leak — how soon can you inspect?", "Do you handle insurance claims?", "How long does a full re-roof take?"] },
  { slug: "plumbing", label: "Plumbing contractor", samples: ["My water heater is leaking", "Is your weekend emergency rate higher?", "Can you snake a main drain line?"] },
  { slug: "electrical", label: "Electrical contractor", samples: ["My breaker keeps tripping", "Do you install EV chargers?", "Are you licensed in my county?"] },
  { slug: "landscaping", label: "Landscaping company", samples: ["What's a monthly maintenance contract run?", "Do you do irrigation repairs?", "Can you come out to estimate this week?"] },
  { slug: "dental", label: "Dental practice", samples: ["Do you take my insurance?", "I think I chipped a tooth", "What's the soonest cleaning appointment?"] },
  { slug: "med-spa", label: "Med spa", samples: ["How much is a botox touch-up?", "Do you offer financing?", "Can I see before-and-after results?"] },
  { slug: "law-firm", label: "Law firm", samples: ["I was in a car accident yesterday", "Do you offer free consultations?", "How long does a case like this usually take?"] },
  { slug: "real-estate", label: "Real estate brokerage", samples: ["I want to list my home — what's the process?", "Are you working with buyers in my zip code?", "What's a typical commission?"] },
  { slug: "property-management", label: "Property management company", samples: ["My AC stopped working — I'm a tenant", "Do you manage short-term rentals?", "How much do you charge owners?"] },
  { slug: "restaurant", label: "Restaurant", samples: ["Can I book a table for 8 tonight?", "Do you have gluten-free options?", "What time do you stop serving?"] },
  { slug: "auto-repair", label: "Auto repair shop", samples: ["My check engine light is on", "Can you do an oil change today?", "Do you do brake jobs on Tesla?"] },
  { slug: "insurance", label: "Insurance agency", samples: ["I need a quote on home insurance", "Can I add my teenager to my auto policy?", "Do you carry business liability?"] },
  { slug: "fitness", label: "Gym or fitness studio", samples: ["Do you offer a free trial?", "What's the monthly membership?", "Do you have personal trainers?"] },
  { slug: "pest-control", label: "Pest control company", samples: ["I have ants in my kitchen", "How much for quarterly service?", "Are your treatments pet-safe?"] },
  { slug: "other", label: "Something else", samples: ["What are your hours?", "How do I get a quote?", "Can someone call me back today?"] },
];

function findNiche(slug: string) {
  return NICHE_OPTIONS.find((n) => n.slug === slug) || NICHE_OPTIONS[0];
}

export default function AgentBuilder() {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("hvac");
  const [context, setContext] = useState("");
  const [built, setBuilt] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  const niche = useMemo(() => findNiche(industry), [industry]);

  useEffect(() => {
    if (!transcriptRef.current) return;
    transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [messages, sending]);

  const buildAgent = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = businessName.trim();
    if (!trimmed) { setErr("Enter your business name."); return; }
    if (trimmed.length > 50) { setErr("Business name max 50 characters."); return; }
    setErr(null);
    const intro =
      `Hi, thanks for reaching out to ${trimmed}. I'm here to help — ` +
      `what brought you in today?`;
    setMessages([{ role: "assistant", content: intro }]);
    setBuilt(true);
  };

  const reset = () => {
    setBuilt(false);
    setMessages([]);
    setInput("");
    setErr(null);
  };

  const send = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || sending) return;
    setInput("");
    setErr(null);
    const nextMsgs: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMsgs);
    setSending(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          custom_system: {
            business_name: businessName.trim().slice(0, 50),
            industry,
            context: context.trim().slice(0, 600),
          },
          // The conversation history we want the model to respond to.
          messages: nextMsgs,
        }),
      });
      if (!r.ok) {
        if (r.status === 429) {
          setErr("You've hit the free hourly limit on the AI — try again in an hour, or book a call.");
        } else {
          setErr("The AI hiccupped. Try again or send a different message.");
        }
        setSending(false);
        return;
      }
      const reply = await r.text();
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setErr("Network blip. Try again.");
    } finally {
      setSending(false);
    }
  };

  const onInputSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send();
  };

  return (
    <ToolLayout
      eyebrow="Free personalized demo · 30 seconds"
      title="Build your own AI agent"
      italicTail="in 30 seconds."
      subtitle="Type your business name. Pick your industry. We spin up a customer-facing AI agent that knows who you are and what you do. Then you chat with it like a real customer would."
    >
      {!built ? (
        <form onSubmit={buildAgent} className="mt-8 space-y-5" aria-label="Build your agent">
          <div>
            <label htmlFor="biz-name" className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">
              Your business name <span className="text-red-600">*</span>
            </label>
            <input
              id="biz-name"
              type="text"
              required
              maxLength={50}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Joe's HVAC, Bright Smile Dental, Main St Roofing"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[48px]"
              aria-label="Business name"
            />
            <div className="mt-1 text-[11.5px] text-slate-500">{businessName.length}/50</div>
          </div>

          <div>
            <label htmlFor="biz-industry" className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">
              Industry <span className="text-red-600">*</span>
            </label>
            <select
              id="biz-industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[48px] bg-white"
              aria-label="Industry"
            >
              {NICHE_OPTIONS.map((n) => (
                <option key={n.slug} value={n.slug}>{n.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="biz-context" className="block text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">
              Extra context <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="biz-context"
              rows={3}
              maxLength={600}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Located in the United States. Open 7 days. We don't service mobile homes. Emergency rate is 1.5x after 7pm."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
              aria-label="Extra context"
            />
            <div className="mt-1 text-[11.5px] text-slate-500">{context.length}/600</div>
          </div>

          {err && <div role="alert" className="text-[13px] text-red-600">{err}</div>}

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#042C53] text-white text-[15px] font-semibold hover:bg-[#0A3D6E] min-h-[48px]"
          >
            Build my agent &rarr;
          </button>
          <div className="text-[12px] text-slate-500">
            Nothing is saved unless you opt in. Free, no signup. Rate-limited to 30 messages/hour per IP.
          </div>
        </form>
      ) : (
        <div className="mt-8">
          {/* Header showing what we built */}
          <div className="rounded-2xl border p-5 sm:p-6" style={{ background: TINT, borderColor: BLUE }}>
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1.5">
              Live agent &middot; powered by /api/chat
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-semibold leading-tight" style={{ color: NAVY }}>
              {businessName.trim()}
            </h2>
            <p className="mt-1.5 text-[14px] text-slate-700">
              {niche.label} &middot; configured in your browser
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-3 text-[12px] text-[#185FA5] font-medium hover:underline"
            >
              &larr; Edit configuration
            </button>
          </div>

          {/* Sample questions */}
          <div className="mt-5">
            <div className="text-[12px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-2">
              Try a customer question
            </div>
            <div className="flex flex-wrap gap-2">
              {niche.samples.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  disabled={sending}
                  className="px-3.5 py-2 rounded-full border border-slate-300 bg-white text-[13px] hover:border-[#185FA5] hover:text-[#042C53] disabled:opacity-60 min-h-[36px]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Chat transcript */}
          <div
            ref={transcriptRef}
            className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 max-h-[420px] overflow-y-auto"
            aria-live="polite"
            aria-label="Chat transcript"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={"mb-3 flex " + (m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={
                    "max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[14px] leading-snug " +
                    (m.role === "user"
                      ? "bg-[#042C53] text-white rounded-br-sm"
                      : "bg-slate-100 text-[#042C53] rounded-bl-sm")
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start mb-2">
                <div className="px-3.5 py-2.5 rounded-2xl bg-slate-100 text-slate-500 text-[14px]">
                  Typing&hellip;
                </div>
              </div>
            )}
            {err && (
              <div role="alert" className="mt-2 text-[12px] text-red-600">{err}</div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={onInputSubmit} className="mt-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${businessName.trim() || "the agent"}…`}
              maxLength={500}
              disabled={sending}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#185FA5] min-h-[44px]"
              aria-label="Type a message"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="px-5 py-3 rounded-lg bg-[#042C53] text-white text-[14px] font-semibold hover:bg-[#0A3D6E] disabled:opacity-60 min-h-[44px]"
            >
              Send
            </button>
          </form>

          {/* CTA */}
          <div className="mt-8 rounded-2xl bg-[#042C53] text-white p-6 sm:p-7">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#9CC4EC] font-semibold mb-2">
              This is your agent in 30 seconds
            </div>
            <p className="text-[16px] sm:text-[17px] leading-relaxed">
              Imagine 5 weeks of tuning &mdash; real call history, your dispatch rules, your booking rules, your priced services. That's what the real builds look like.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <a
                href="/book"
                className="inline-flex items-center px-5 py-3 rounded-lg bg-white text-[#042C53] text-[14px] font-semibold min-h-[44px]"
              >
                Book a real build &rarr;
              </a>
              <a
                href="/playbooks"
                className="inline-flex items-center px-5 py-3 rounded-lg border border-white/30 text-white text-[14px] font-semibold min-h-[44px] hover:bg-white/10"
              >
                See your industry playbook
              </a>
            </div>
          </div>

          {/* Email gate */}
          <ToolEmailGate
            source="tool:agent-builder"
            reportName="this agent config + the AI Operations Playbook PDF"
            payload={{
              business_name: businessName.trim().slice(0, 50),
              industry,
              context: context.trim().slice(0, 600),
              message_count: messages.length,
            }}
          />

          <p className="mt-6 text-[12px] text-slate-500">
            Powered by our multi-provider LLM router (Anthropic &rarr; Groq &rarr; Gemini). Your business name + industry are wrapped in a hardened server-side system prompt &mdash; the agent stays on-task for your business.
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
