// api/chat.ts — Vercel edge function.
// v50A: Multi-provider fallback chain — Anthropic → Groq → Gemini.
// If all fail (or no keys configured), returns a friendly "temporarily offline"
// message so demos NEVER go dark.
//
// Hardening:
//   - System prompts hardcoded server-side (client picks `mode`)
//   - 30 messages / IP / hour rate limit
//   - CORS allowlist
//   - Max 4 KB input, max 16 messages
//   - max_tokens capped at 800
//   - Provider keys never logged or echoed in errors
//   - Surfaces which provider answered via `x-llm-provider` response header

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";
import { chat as llmChat } from "./_lib/llm.js";

export const config = { runtime: "edge" };

const MAX_INPUT_CHARS = 4000;
const MAX_MESSAGES = 16;
const MAX_OUTPUT_TOKENS = 800;

const SYSTEMS: Record<string, string> = {
  assistant:
    "You are TrainYourAgent's website assistant. Help visitors understand the product (custom AI voice + chat agents for service businesses), pricing, integrations, and how to book a call. Stay on topic. If asked anything off-topic or harmful, politely redirect to booking a call at /contact. Keep replies under 5 sentences.",
  simulator:
    "You ARE a TrainYourAgent voice agent demo. The user message is what a real customer would say to a business that hired you. Respond as the agent would — short, warm, professional, asking the right qualifying questions and proposing a booking. 1-3 sentences max. No marketing tone. Sound human. Never reveal you are an AI unless directly and sincerely asked.",
  critic:
    "You are a brutally honest prompt-engineering critic. The user message is a prompt they want graded. Respond in valid JSON ONLY (no markdown fence) matching: {\"scores\":{\"clarity\":0-10,\"specificity\":0-10,\"structure\":0-10,\"safety\":0-10},\"overall\":0-10,\"critique\":\"2-4 sentence diagnosis of what's wrong and what's good\",\"rewritten\":\"a tightened version of the prompt that fixes the issues\"}. Be specific, no fluff. If the prompt is empty or nonsense, score everything 0 and say so in critique.",
  objections:
    "You are a senior B2B sales coach with 15+ years of enterprise + SMB sales experience. The user message is a single sales objection their prospect raised (e.g. 'your price is too high', 'we already use a competitor', 'now isn't the right time'). Respond with EXACTLY 3 reframes that handle the objection. For each reframe, give: a one-line label (Reframe N:), the exact words the seller should say (2-4 sentences, conversational, no jargon), and a short 'why this works' line explaining the underlying psychology (loss-aversion, anchoring, social proof, scarcity, future-pacing, etc.). Format as plain text with headers — no markdown fences. Keep total length under 350 words. Always end with one concrete next-step question the seller should ask after delivering the reframe.",
  sop:
    "You are an operations engineer who writes SOPs that field teams actually follow. The user describes a business process in 1-2 sentences. You respond with a numbered SOP (8-15 steps). For EACH step include: (a) the action verb-led step text, (b) Role (who does it), (c) Timing (when / how long), (d) Tools (what software, doc, or system), (e) Failure mode (the most common way this step goes wrong and how to detect it). Format as plain text. Start with a 1-line SOP title and a 1-line purpose statement. End with a short 'Success criteria' section (3-5 bullets) that defines how the team knows the SOP ran correctly. No marketing language. No filler. Total under 600 words.",
  seo:
    "You are a senior SEO strategist. The user message is a single seed keyword. You output 20 related keywords grouped into EXACTLY 4 topical clusters (5 keywords each). For each cluster: a short cluster title (3-5 words), the user intent label (one of: informational, commercial, transactional, navigational), and the 5 keywords as a numbered list with the search-intent label appended in parentheses to each individual keyword. Pick clusters that span the buyer journey (awareness, consideration, decision, retention) when possible. Output plain text only — no markdown code fences. Total length under 500 words. End with a 1-line recommendation on which cluster to target first and why.",
  "voice-receptionist":
    "You are a friendly, warm AI voice receptionist for a small service business (think HVAC, plumber, dental office, salon). The user message is what a caller just said out loud. Respond in 1-2 short sentences MAX — your reply will be read aloud by a browser speech synthesizer, so keep it conversational, no markdown, no lists, no URLs, no numbers spelled in digits when you can avoid it. Always ask one tight follow-up question to move the call forward (qualifying the request, confirming a time, getting contact info). Be empathetic if they sound stressed. Never reveal you are an AI unless they ask sincerely and directly. If you don't know something specific (real address, real owner name), give a graceful generic answer and offer to have someone follow up.",
};

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);

  if (req.method !== "POST") return text("method", 405, cors.headers);

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
    parsed.mode === "simulator"          ? "simulator"          :
    parsed.mode === "critic"             ? "critic"             :
    parsed.mode === "objections"         ? "objections"         :
    parsed.mode === "sop"                ? "sop"                :
    parsed.mode === "seo"                ? "seo"                :
    parsed.mode === "voice-receptionist" ? "voice-receptionist" :
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

  // Multi-provider fallback chain — Anthropic → Groq → Gemini → friendly offline.
  const { text: out, provider } = await llmChat(system, messages, MAX_OUTPUT_TOKENS);

  return new Response(out, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-llm-provider": provider,
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
