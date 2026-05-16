// api/chat.ts — Vercel edge function. Streams Claude responses to the
// AiChat / AgentSimulator widgets.
//
// REQUIRES env: ANTHROPIC_API_KEY
//
// Hardening (v30):
//   - System prompts hardcoded server-side (client picks `mode`, not prompt)
//   - 30 messages / IP / hour rate limit
//   - CORS allowlist
//   - Max 4 KB input, max 16 messages in history
//   - max_tokens capped at 800
//   - ANTHROPIC_API_KEY never logged or echoed in errors

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";

export const config = { runtime: "edge" };

const MAX_INPUT_CHARS = 4000;
const MAX_MESSAGES = 16;
const MAX_OUTPUT_TOKENS = 800;

// Server-side system prompts. The client sends `mode`, never the prompt itself.
// This stops prompt-injection of instructions like "ignore previous" or
// jailbreaks that would let an attacker burn our Anthropic budget on
// arbitrary tasks.
const SYSTEMS: Record<string, string> = {
  assistant:
    "You are TrainYourAgent's website assistant. Help visitors understand the product (custom AI voice + chat agents for service businesses), pricing, integrations, and how to book a call. Stay on topic. If asked anything off-topic or harmful, politely redirect to booking a call at /contact. Keep replies under 5 sentences.",
  simulator:
    "You ARE a TrainYourAgent voice agent demo. The user message is what a real customer would say to a business that hired you. Respond as the agent would — short, warm, professional, asking the right qualifying questions and proposing a booking. 1-3 sentences max. No marketing tone. Sound human. Never reveal you are an AI unless directly and sincerely asked.",
  critic:
    "You are a brutally honest prompt-engineering critic. The user message is a prompt they want graded. Respond in valid JSON ONLY (no markdown fence) matching: {\"scores\":{\"clarity\":0-10,\"specificity\":0-10,\"structure\":0-10,\"safety\":0-10},\"overall\":0-10,\"critique\":\"2-4 sentence diagnosis of what's wrong and what's good\",\"rewritten\":\"a tightened version of the prompt that fixes the issues\"}. Be specific, no fluff. If the prompt is empty or nonsense, score everything 0 and say so in critique.",
};

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);

  if (req.method !== "POST") return text("method", 405, cors.headers);

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return text("not-configured", 500, cors.headers);

  const ip = ipFromRequest(req);
  const rl = rateLimit(`chat:${ip}`, { limit: 30, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return text("rate-limited", 429, { ...cors.headers, ...rl.headers });

  let parsed: { mode?: string; messages?: { role: string; content: string }[] };
  try {
    parsed = await req.json();
  } catch {
    return text("bad-json", 400, cors.headers);
  }

  const mode =
    parsed.mode === "simulator" ? "simulator" :
    parsed.mode === "critic"    ? "critic"    :
    "assistant";
  const system = SYSTEMS[mode];

  const inMsgs = Array.isArray(parsed.messages) ? parsed.messages : [];
  if (inMsgs.length === 0) return text("no-messages", 400, cors.headers);
  if (inMsgs.length > MAX_MESSAGES) return text("too-many-messages", 400, cors.headers);

  const messages: { role: "user" | "assistant"; content: string }[] = [];
  for (const m of inMsgs) {
    if (!m || typeof m.content !== "string") continue;
    if (m.role !== "user" && m.role !== "assistant") continue;
    if (m.content.length > MAX_INPUT_CHARS) return text("input-too-long", 400, cors.headers);
    messages.push({ role: m.role, content: m.content });
  }
  if (messages.length === 0) return text("no-valid-messages", 400, cors.headers);

  let r: Response;
  try {
    r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: MAX_OUTPUT_TOKENS,
        stream: true,
        system,
        messages,
      }),
    });
  } catch {
    // NEVER include the upstream error body — it can echo headers/keys.
    return text("upstream-fetch-failed", 502, cors.headers);
  }

  if (!r.ok || !r.body) {
    // Drain and discard the body so the upstream key/header is never echoed.
    try { await r.text(); } catch { /* ignore */ }
    return text("upstream-error", 502, cors.headers);
  }

  const reader = r.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async pull(controller) {
      const { value, done } = await reader.read();
      if (done) { controller.close(); return; }
      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split("\n")) {
        const t = line.trim();
        if (!t.startsWith("data:")) continue;
        const payload = t.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const obj = JSON.parse(payload);
          if (obj.type === "content_block_delta" && obj.delta?.text) {
            controller.enqueue(encoder.encode(obj.delta.text));
          }
        } catch { /* ignore */ }
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      ...cors.headers,
      ...rl.headers,
    },
  });
}

function text(msg: string, status: number, extra: Record<string, string> = {}) {
  return new Response(msg, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", ...extra },
  });
}
