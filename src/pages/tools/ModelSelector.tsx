// src/pages/tools/ModelSelector.tsx
// v44 tool: 4-question quiz → deterministic LLM recommendation. Pure client-side.

import { useMemo, useState } from "react";
import ToolLayout, { NAVY, BLUE, TINT } from "./ToolLayout";
import ToolEmailGate from "./ToolEmailGate";

type Answer = string;
type QuestionId = "task" | "cost" | "latency" | "vision";

type Question = {
  id: QuestionId;
  prompt: string;
  options: { value: string; label: string; sub?: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: "task",
    prompt: "What's the primary task type?",
    options: [
      { value: "chat",       label: "Chat / Q&A",                sub: "Customer support, internal helpdesk" },
      { value: "reasoning",  label: "Complex reasoning",         sub: "Analysis, multi-step planning, code" },
      { value: "extraction", label: "High-volume extraction",     sub: "Forms, classification, tagging at scale" },
      { value: "creative",   label: "Creative / long-form",      sub: "Drafting, editing, brand-voice content" },
    ],
  },
  {
    id: "cost",
    prompt: "How important is per-token cost?",
    options: [
      { value: "critical", label: "Critical",  sub: "Millions of requests/month" },
      { value: "moderate", label: "Moderate",  sub: "Reasonable but not the deciding factor" },
      { value: "low",      label: "Not a concern", sub: "Quality wins" },
    ],
  },
  {
    id: "latency",
    prompt: "What's the latency requirement?",
    options: [
      { value: "realtime", label: "Real-time (<1s)", sub: "Voice agents, autocomplete" },
      { value: "fast",     label: "Fast (<3s)",       sub: "Interactive chat" },
      { value: "batch",    label: "Batch OK",         sub: "Background jobs, async" },
    ],
  },
  {
    id: "vision",
    prompt: "Do you need vision (image input)?",
    options: [
      { value: "yes", label: "Yes, regularly",  sub: "Documents, screenshots, photos" },
      { value: "occasional", label: "Occasionally", sub: "Nice to have" },
      { value: "no",  label: "Not needed",      sub: "Text only" },
    ],
  },
];

type Model = {
  id: string;
  name: string;
  vendor: string;
  strengths: string[];
};

const MODELS: Record<string, Model> = {
  haiku:    { id: "haiku",    name: "Claude Haiku 4.5",  vendor: "Anthropic", strengths: ["Cheap", "Fast", "Tool-use solid"] },
  sonnet:   { id: "sonnet",   name: "Claude Sonnet 4.5", vendor: "Anthropic", strengths: ["Best general reasoning", "Long context", "Vision"] },
  opus:     { id: "opus",     name: "Claude Opus 4.7",   vendor: "Anthropic", strengths: ["Deepest reasoning", "Hard coding", "Multi-step research"] },
  gpt4o:    { id: "gpt4o",    name: "GPT-4o",            vendor: "OpenAI",    strengths: ["Strong general", "Native vision + audio", "Ecosystem"] },
  gpt4omini:{ id: "gpt4omini",name: "GPT-4o-mini",       vendor: "OpenAI",    strengths: ["Cheap", "Fast", "Decent quality"] },
  flash:    { id: "flash",    name: "Gemini 2.5 Flash",  vendor: "Google",    strengths: ["Cheap", "Long context", "Vision"] },
};

// Deterministic decision tree → returns (winner, reasoning, alternates[])
function decide(a: Partial<Record<QuestionId, Answer>>): {
  winner: Model;
  reasoning: string;
  alternates: Model[];
} {
  const task = a.task;
  const cost = a.cost;
  const latency = a.latency;
  const vision = a.vision;

  // Voice / real-time
  if (latency === "realtime") {
    if (cost === "critical") {
      return {
        winner: MODELS.haiku,
        reasoning: "Real-time + cost-critical → Haiku 4.5 is the sweet spot. Sub-second first-token, single-digit cents per call.",
        alternates: [MODELS.flash, MODELS.gpt4omini],
      };
    }
    return {
      winner: MODELS.haiku,
      reasoning: "Real-time latency rules out the larger models. Haiku gives the best quality at sub-second latency.",
      alternates: [MODELS.flash, MODELS.gpt4omini],
    };
  }

  // Complex reasoning
  if (task === "reasoning") {
    if (cost === "low") {
      return {
        winner: MODELS.opus,
        reasoning: "Hard reasoning with no cost ceiling → Opus 4.7. Best multi-step thinking and code in the market today.",
        alternates: [MODELS.sonnet, MODELS.gpt4o],
      };
    }
    return {
      winner: MODELS.sonnet,
      reasoning: "Sonnet 4.5 hits the reasoning quality you want at 1/5th the cost of Opus.",
      alternates: [MODELS.opus, MODELS.gpt4o],
    };
  }

  // Extraction / classification at volume
  if (task === "extraction") {
    return {
      winner: cost === "critical" ? MODELS.haiku : MODELS.gpt4omini,
      reasoning:
        "Volume + structured output. Cost-critical → Haiku. Otherwise GPT-4o-mini is rock-solid for JSON-shaped extraction.",
      alternates: [MODELS.haiku, MODELS.flash, MODELS.gpt4omini],
    };
  }

  // Creative / long-form
  if (task === "creative") {
    if (cost === "critical") {
      return {
        winner: MODELS.haiku,
        reasoning: "Cost-critical creative work → Haiku for drafts, escalate to Sonnet only on final pass.",
        alternates: [MODELS.sonnet, MODELS.flash],
      };
    }
    return {
      winner: MODELS.sonnet,
      reasoning: "Sonnet has the best voice + brand fidelity for long-form. Use Opus only when the brief is genuinely hard.",
      alternates: [MODELS.opus, MODELS.gpt4o],
    };
  }

  // Chat / Q&A — vision branch
  if (vision === "yes") {
    return {
      winner: MODELS.gpt4o,
      reasoning: "Vision-heavy chat → GPT-4o native vision is the most battle-tested today, with Sonnet a strong runner-up.",
      alternates: [MODELS.sonnet, MODELS.flash],
    };
  }

  // Chat / Q&A — default
  if (cost === "critical") {
    return {
      winner: MODELS.haiku,
      reasoning: "Chat at scale + cost-critical → Haiku. Fast, cheap, smart enough for 90% of support flows.",
      alternates: [MODELS.gpt4omini, MODELS.flash],
    };
  }
  return {
    winner: MODELS.sonnet,
    reasoning: "General chat with quality bar → Sonnet 4.5. Best blend of accuracy, voice, and tool use right now.",
    alternates: [MODELS.haiku, MODELS.gpt4o],
  };
}

export default function ModelSelector() {
  const [answers, setAnswers] = useState<Partial<Record<QuestionId, Answer>>>({});
  const [step, setStep] = useState(0);

  const result = useMemo(() => {
    const allAnswered = QUESTIONS.every((q) => answers[q.id]);
    return allAnswered ? decide(answers) : null;
  }, [answers]);

  const current = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progress = Math.round((Object.keys(answers).length / total) * 100);

  return (
    <ToolLayout
      eyebrow="Tool · Model Selector"
      title="Pick the right LLM for your"
      italicTail="specific job."
      subtitle="Four questions, one recommendation. No marketing, no hand-waving — the same decision tree we use internally."
    >
      <div className="mt-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-[12px] text-slate-500 mb-2">
            <span>Question {Math.min(step + 1, total)} of {total}</span>
            <span>{progress}% complete</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all"
              style={{ width: `${progress}%`, background: BLUE }}
            />
          </div>
        </div>

        {/* Active question */}
        {!result && current && (
          <section aria-labelledby={`q-${current.id}`}>
            <h2 id={`q-${current.id}`} className="text-[22px] font-semibold mb-4" style={{ color: NAVY }}>
              {current.prompt}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {current.options.map((o) => {
                const selected = answers[current.id] === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => {
                      const next = { ...answers, [current.id]: o.value };
                      setAnswers(next);
                      setTimeout(() => setStep((s) => Math.min(s + 1, total - 1)), 120);
                    }}
                    className={`text-left rounded-xl border p-4 transition min-h-[44px] ${
                      selected
                        ? "border-[#042C53] bg-[#E6F1FB]"
                        : "border-slate-200 hover:border-[#185FA5] bg-white"
                    }`}
                  >
                    <div className="text-[15px] font-semibold" style={{ color: NAVY }}>{o.label}</div>
                    {o.sub && <div className="text-[12.5px] text-slate-600 mt-0.5">{o.sub}</div>}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 min-h-[36px]"
              >
                ← Back
              </button>
            </div>
          </section>
        )}

        {/* Result */}
        {result && (
          <section aria-live="polite" className="mt-2">
            <div className="rounded-2xl p-6 sm:p-8" style={{ background: TINT, border: `1px solid ${BLUE}33` }}>
              <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: BLUE }}>
                Recommendation
              </div>
              <h3 className="text-[28px] font-semibold" style={{ color: NAVY }}>
                {result.winner.name}
              </h3>
              <div className="text-[13px] text-slate-600 mb-3">{result.winner.vendor}</div>
              <p className="text-[15px] text-slate-700 leading-relaxed">{result.reasoning}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {result.winner.strengths.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-full bg-white text-[12px] font-medium text-[#042C53] border border-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[12px] uppercase tracking-[0.14em] font-semibold text-slate-500 mb-2">
                Strong alternates
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {result.alternates.map((m) => (
                  <div key={m.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                    <div className="text-[14.5px] font-semibold" style={{ color: NAVY }}>{m.name}</div>
                    <div className="text-[12px] text-slate-500">{m.vendor}</div>
                    <div className="text-[12px] text-slate-600 mt-2">{m.strengths.join(" · ")}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => { setAnswers({}); setStep(0); }}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-[13px] font-medium hover:border-[#185FA5] min-h-[44px]"
              >
                Start over
              </button>
            </div>

            <ToolEmailGate
              source="tool:model-selector"
              reportName="a custom model benchmark for your stack"
              payload={{ answers, winner: result.winner.id }}
            />
          </section>
        )}
      </div>
    </ToolLayout>
  );
}
