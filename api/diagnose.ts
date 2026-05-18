// api/diagnose.ts — v67A
// Dedicated endpoint for the diagnose-wizard tool.
// Generates a personalized AI-deployment diagnosis.

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";
import { chat as llmChat } from "./_lib/llm.js";

export const config = { runtime: "edge" };

const SYSTEM =
  "You are a senior operator advising small businesses on AI deployment. Given a business type, headache, weekly time spent, and what they've tried, output: 1) Diagnosis (2-3 sentences on root cause). 2) The #1 AI opportunity to fix it (specific solution, named tool stack). 3) Timeline + cost range to deploy (honest, niche-appropriate). 4) Expected outcome with measurable metric. 5) Honest disclaimer about what AI can't fix. Conversational, no fluff, ~400 words.";

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (req.method !== "POST") return text("method", 405, cors.headers);

  const ip = ipFromRequest(req);
  const rl = rateLimit(`diagnose:${ip}`, { limit: 12, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return text("rate-limited", 429, { ...cors.headers, ...rl.headers });

  let body: { niche?: string; headache?: string; hoursPerWeek?: number; tried?: string };
  try { body = await req.json(); } catch { return text("bad-json", 400, cors.headers); }

  const niche = sanitize(body.niche, 60) || "service business";
  const headache = sanitize(body.headache, 220);
  const hoursPerWeek = clampInt(body.hoursPerWeek, 0, 40, 0);
  const tried = sanitize(body.tried, 220);
  if (!headache) return text("missing-headache", 400, cors.headers);

  const userPrompt = [
    `Business type: ${niche}`,
    `#1 operational headache: ${headache}`,
    `Hours/week spent on it: ${hoursPerWeek}`,
    `What they've tried: ${tried || "(nothing notable)"}`,
  ].join("\n");

  const { text: out, provider } = await llmChat(SYSTEM, [{ role: "user", content: userPrompt }], 600);
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
function clampInt(v: unknown, lo: number, hi: number, fallback: number): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(hi, Math.max(lo, Math.floor(n)));
}
