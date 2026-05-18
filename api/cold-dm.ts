// api/cold-dm.ts — v67A
// Dedicated endpoint for the cold-dm-generator tool.
// Generates a 3-message LinkedIn cold DM sequence.

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";
import { chat as llmChat } from "./_lib/llm.js";

export const config = { runtime: "edge" };

const SYSTEM =
  "You write LinkedIn cold DMs for B2B founders selling services. Given a target role + offer description, output exactly 3 messages: (1) opener — personalized hook, no pitch, 1-2 sentences. (2) value drop — specific concrete value/insight relevant to the target, 2-3 sentences, no ask. (3) CTA — soft ask for a 15-min call, with the specific outcome they'll get. No 'hope you're doing well'. No 'circling back'. No corporate speak. Conversational, operator-to-operator, every word earns its spot.";

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (req.method !== "POST") return text("method", 405, cors.headers);

  const ip = ipFromRequest(req);
  const rl = rateLimit(`cold-dm:${ip}`, { limit: 12, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return text("rate-limited", 429, { ...cors.headers, ...rl.headers });

  let body: { targetRole?: string; offer?: string; company?: string };
  try { body = await req.json(); } catch { return text("bad-json", 400, cors.headers); }

  const targetRole = sanitize(body.targetRole, 250);
  const offer = sanitize(body.offer, 250);
  const company = sanitize(body.company, 80);
  if (!targetRole || !offer) return text("missing-fields", 400, cors.headers);

  const userPrompt = [
    `Target role: ${targetRole}`,
    `Offer: ${offer}`,
    company ? `My company: ${company}` : "My company: (omit)",
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
