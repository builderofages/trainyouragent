// api/_lib/llm.ts — Multi-provider LLM fallback chain.
//
// v50A: Demos must never go dark. Try Anthropic → Groq → Gemini.
// Any provider failure (4xx/5xx, timeout, credit-too-low) → fall through.
// Returns the answering text + which provider produced it.
//
// Env keys consulted (each optional):
//   ANTHROPIC_API_KEY  — Anthropic claude-haiku-4-5
//   GROQ_API_KEY       — Groq llama-3.3-70b-versatile (OpenAI-compatible)
//   GEMINI_API_KEY     — Google gemini-2.5-flash
//
// All calls are non-streaming (matches existing chat.ts pattern).
// Per-provider timeout: 15s.

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type ChatResult  = { text: string; provider: "anthropic" | "groq" | "gemini" | "none" };

const TIMEOUT_MS = 15_000;
// v275: model bumped from short alias to the dated build string. Anthropic API
// was returning 404 on the short "claude-haiku-4-5" alias on some accounts,
// silently dropping us to the Groq fallback. The dated suffix is the canonical
// stable ID per Anthropic docs and works on every account tier.
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
const GROQ_MODEL      = process.env.GROQ_MODEL      || "llama-3.3-70b-versatile";
const GEMINI_MODEL    = process.env.GEMINI_MODEL    || "gemini-2.5-flash";

// v275: stripped the last founder name from the offline fallback message.
// Was the only remaining "Alexander" mention in user-facing copy after the
// v267 / v270 founder-overdose sweeps.
const OFFLINE_MSG =
  "AI demos are temporarily offline — the TrainYourAgent team has been pinged. Try again in 5 minutes.";

export async function chat(
  system: string,
  messages: ChatMessage[],
  maxTokens = 800,
): Promise<ChatResult> {
  // 1) Anthropic
  if (process.env.ANTHROPIC_API_KEY) {
    const r = await tryAnthropic(system, messages, maxTokens);
    if (r.ok) return { text: r.text, provider: "anthropic" };
  }

  // 2) Groq
  if (process.env.GROQ_API_KEY) {
    const r = await tryGroq(system, messages, maxTokens);
    if (r.ok) return { text: r.text, provider: "groq" };
  }

  // 3) Gemini
  if (process.env.GEMINI_API_KEY) {
    const r = await tryGemini(system, messages, maxTokens);
    if (r.ok) return { text: r.text, provider: "gemini" };
  }

  // 4) None worked — friendly offline message.
  return { text: OFFLINE_MSG, provider: "none" };
}

type TryResult = { ok: true; text: string } | { ok: false };

function withTimeout(p: Promise<Response>): Promise<Response> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS);
    p.then((r) => { clearTimeout(t); resolve(r); }).catch((e) => { clearTimeout(t); reject(e); });
  });
}

async function tryAnthropic(
  system: string,
  messages: ChatMessage[],
  maxTokens: number,
): Promise<TryResult> {
  try {
    const r = await withTimeout(fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY as string,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: maxTokens,
        system,
        messages,
      }),
    }));
    if (!r.ok) {
      // Try to detect "credit balance is too low" → fall through.
      try {
        const body = await r.text();
        if (body.toLowerCase().includes("credit balance")) return { ok: false };
      } catch { /* ignore */ }
      return { ok: false };
    }
    const j = (await r.json()) as { content?: { type: string; text?: string }[] };
    const text = (j.content || [])
      .filter((c) => c && c.type === "text" && typeof c.text === "string")
      .map((c) => c.text as string)
      .join("");
    if (!text) return { ok: false };
    // Belt-and-suspenders: also check the body for "credit balance".
    if (text.toLowerCase().includes("credit balance is too low")) return { ok: false };
    return { ok: true, text };
  } catch {
    return { ok: false };
  }
}

async function tryGroq(
  system: string,
  messages: ChatMessage[],
  maxTokens: number,
): Promise<TryResult> {
  try {
    const openaiMessages: { role: string; content: string }[] = [
      { role: "system", content: system },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];
    const r = await withTimeout(fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY as string}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: maxTokens,
        messages: openaiMessages,
      }),
    }));
    if (!r.ok) return { ok: false };
    const j = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const text = j.choices?.[0]?.message?.content || "";
    if (!text) return { ok: false };
    return { ok: true, text };
  } catch {
    return { ok: false };
  }
}

async function tryGemini(
  system: string,
  messages: ChatMessage[],
  maxTokens: number,
): Promise<TryResult> {
  try {
    // Gemini wants {systemInstruction:{parts:[{text}]}, contents:[{role,parts:[{text}]}]}
    // Roles must be "user" or "model" (assistant → model).
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY as string)}`;
    const r = await withTimeout(fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: { maxOutputTokens: maxTokens },
      }),
    }));
    if (!r.ok) return { ok: false };
    const j = (await r.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = (j.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || "")
      .join("");
    if (!text) return { ok: false };
    return { ok: true, text };
  } catch {
    return { ok: false };
  }
}
