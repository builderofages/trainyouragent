// api/voice-script.ts — v67A
// Thin dedicated endpoint for the voice-script-generator tool.
// Internally routes to api/chat with mode="voice-script". Exists so external
// callers can hit a stable, purpose-named URL without knowing about the mode
// switch in /api/chat.

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";
import { chat as llmChat } from "./_lib/llm.js";

export const config = { runtime: "edge" };

const SYSTEM =
  "You write voice-agent dialogue scripts for service businesses. Given a niche + optional business name, output a complete 2-page script with these sections numbered: 1) Opening greeting (warm, brand-aware), 2) 4 qualifying questions (industry-appropriate), 3) Common objection handling (3 scenarios with verbatim responses), 4) Booking flow (handoff to calendar with confirmation), 5) Escalation triggers (when to transfer to human, with verbatim handoff line). Use markdown headers. Real, specific dialogue — not templates. ~600 words total.";

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (req.method !== "POST") return text("method", 405, cors.headers);

  const ip = ipFromRequest(req);
  const rl = rateLimit(`voice-script:${ip}`, { limit: 12, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return text("rate-limited", 429, { ...cors.headers, ...rl.headers });

  let body: { niche?: string; businessName?: string };
  try { body = await req.json(); } catch { return text("bad-json", 400, cors.headers); }

  const niche = sanitize(body.niche, 60) || "service business";
  const businessName = sanitize(body.businessName, 60) || "(not provided — use a generic placeholder)";
  const userPrompt = `Niche: ${niche}\nBusiness name: ${businessName}`;

  const { text: out, provider } = await llmChat(SYSTEM, [{ role: "user", content: userPrompt }], 800);
  return new Response(out, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-llm-provider": provider,
      ...cors.headers,
      ...rl.headers,
    },
  });
}

function text(msg: string, status: number, extra: Record<string, string> = {}) {
  return new Response(msg, { status, headers: { "content-type": "text/plain; charset=utf-8", ...extra } });
}
function sanitize(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/<[^>]*>/g, "").replace(/[\r\n\t]+/g, " ").replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, max);
}
