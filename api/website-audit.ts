// api/website-audit.ts — v59
// AI website audit lead-magnet endpoint.
//
// Flow: visitor POSTs {url} → server fetches URL (with SSRF guards, size cap,
// timeout) → extracts title/meta/headings/visible text + signals → composes
// prompt for the LLM router (Anthropic → Groq → Gemini) → returns a structured
// list of 5 AI-agent opportunities the visitor's business should consider.
//
// Hardening:
//   - 5 req / IP / hour  (heavy: each call burns LLM tokens + an outbound fetch)
//   - Strict CORS allowlist
//   - SSRF defense:   only http/https, no localhost / private-IP / cloud-metadata
//   - Body cap:       200 KB on the fetched site
//   - Timeout:        8s on the outbound fetch, 15s on each LLM provider
//   - JSON output:    model is instructed to return strict JSON; we strip code
//                     fences defensively and validate shape before responding

import { corsCheck, preflightResponse, forbiddenResponse } from "./_lib/cors.js";
import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";
import { chat as llmChat } from "./_lib/llm.js";

export const config = { runtime: "edge" };

const MAX_FETCH_BYTES = 200 * 1024;       // 200 KB cap on fetched HTML
const FETCH_TIMEOUT_MS = 8_000;
const UA = "TrainYourAgent-Audit/1.0 (+https://www.trainyouragent.com)";

type Opportunity = {
  title: string;
  problem: string;
  solution: string;
  outcome: string;
  stack: string;
  priority: "high" | "medium" | "low";
};

type AuditResult = {
  ok: true;
  url: string;
  company: string;
  summary: string;
  opportunities: Opportunity[];
  next_step: string;
  provider: string;
  signals: Record<string, unknown>;
};

export default async function handler(req: Request) {
  const cors = corsCheck(req);
  if (!cors.allowed) return forbiddenResponse();
  if (cors.isPreflight) return preflightResponse(cors.headers);
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405, cors.headers);

  const ip = ipFromRequest(req);
  const rl = rateLimit(`waudit:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return json({ ok: false, error: "rate-limited" }, 429, { ...cors.headers, ...rl.headers });

  let body: { url?: string };
  try {
    const raw = await req.text();
    if (raw.length > 4096) return json({ ok: false, error: "too-large" }, 413, cors.headers);
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "bad-json" }, 400, cors.headers);
  }

  let target = String(body.url || "").trim();
  if (!target) return json({ ok: false, error: "missing-url" }, 400, cors.headers);
  if (!/^https?:\/\//i.test(target)) target = "https://" + target;

  if (!isSafeUrl(target)) return json({ ok: false, error: "invalid-url" }, 400, cors.headers);

  // Fetch + extract
  let html = "";
  let finalUrl = target;
  try {
    const fetched = await fetchWithCap(target);
    html = fetched.body;
    finalUrl = fetched.url;
  } catch (e) {
    const msg = (e instanceof Error ? e.message : "fetch-failed").slice(0, 80);
    return json({ ok: false, error: "fetch-failed", detail: msg }, 502, cors.headers);
  }

  const signals = extractSignals(html, finalUrl);

  // Compose system + user prompts for the LLM router.
  const system =
    "You are a senior AI-operations consultant. Given a real business's website signals, " +
    "you identify FIVE specific AI-agent opportunities that would meaningfully change the " +
    "way they operate. Be concrete, specific to THIS business (use signals, niche, services), " +
    "never generic. Return STRICT JSON ONLY (no markdown fence, no prose around it) matching " +
    "this exact shape:\n" +
    `{"company":"<company or domain name>","summary":"<2-3 sentence summary of what this business does and where AI fits>",` +
    `"opportunities":[{"title":"<short title>","problem":"<the specific operational problem>",` +
    `"solution":"<the AI implementation in 2-3 sentences>","outcome":"<expected outcome with a measurable range>",` +
    `"stack":"<the tools/integrations: e.g. Twilio + Deepgram + Anthropic + HubSpot>","priority":"high|medium|low"}],` +
    `"next_step":"<one concrete first step they should take in the next 7 days>"}\n` +
    "Five opportunities. Always five. Prioritize highest-ROI plays first. Match priority to ROI: " +
    "high = pays back inside 30 days; medium = inside 90 days; low = strategic but slower payback.";

  const userPayload = formatSignalsForLLM(signals);
  const userMsg = `Here are the extracted signals from ${finalUrl}:\n\n${userPayload}\n\n` +
    `Now produce the strict-JSON audit per the system instructions. Use the company's actual ` +
    `name (from title or domain) and write opportunities specific to what they appear to sell. ` +
    `Do not invent customer names or testimonials. Do not include any text outside the JSON object.`;

  const llm = await llmChat(system, [{ role: "user", content: userMsg }], 1400);
  if (llm.provider === "none") {
    return json({ ok: false, error: "llm-offline" }, 503, cors.headers);
  }

  const parsed = safeParseAudit(llm.text);
  if (!parsed) {
    return json({ ok: false, error: "parse-failed", raw: llm.text.slice(0, 600) }, 502, cors.headers);
  }

  const out: AuditResult = {
    ok: true,
    url: finalUrl,
    company: parsed.company || signals.title || hostnameOf(finalUrl),
    summary: parsed.summary || "",
    opportunities: (parsed.opportunities || []).slice(0, 5).map(normalizeOpp),
    next_step: parsed.next_step || "",
    provider: llm.provider,
    signals: {
      title: signals.title,
      headings_count: signals.headings.length,
      links_count: signals.links,
      widgets: signals.widgets,
      bytes: signals.bytes,
    },
  };

  return json(out, 200, {
    ...cors.headers,
    ...rl.headers,
    "x-llm-provider": llm.provider,
    "cache-control": "no-store",
  });
}

/* ------------------------------------------------------------------ */
/* SSRF guard                                                          */
/* ------------------------------------------------------------------ */
function isSafeUrl(raw: string): boolean {
  let u: URL;
  try { u = new URL(raw); } catch { return false; }
  if (u.protocol !== "https:" && u.protocol !== "http:") return false;
  const host = u.hostname.toLowerCase();
  if (host === "localhost" || host === "0.0.0.0") return false;
  if (!host.includes(".")) return false; // no TLD-less hosts
  // IPv4 private ranges
  const v4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const a = Number(v4[1]), b = Number(v4[2]);
    if (a === 10) return false;
    if (a === 127) return false;
    if (a === 169 && b === 254) return false; // link-local + cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 0) return false;
  }
  // IPv6 loopback + link-local + cloud metadata
  if (host === "::1" || host === "[::1]") return false;
  if (host.startsWith("fe80:") || host.startsWith("[fe80")) return false;
  if (host === "169.254.169.254") return false;
  // .local mDNS
  if (host.endsWith(".local") || host.endsWith(".internal")) return false;
  return true;
}

/* ------------------------------------------------------------------ */
/* Fetch with timeout + body cap + redirect limit                      */
/* ------------------------------------------------------------------ */
async function fetchWithCap(url: string): Promise<{ url: string; body: string }> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": UA, "accept": "text/html,application/xhtml+xml" },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`http-${res.status}`);
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct && !ct.includes("html") && !ct.includes("text") && !ct.includes("xml")) {
      throw new Error("not-html");
    }
    // Re-validate the final URL after redirects.
    if (!isSafeUrl(res.url)) throw new Error("redirect-blocked");
    const reader = res.body?.getReader();
    if (!reader) throw new Error("no-body");
    const decoder = new TextDecoder("utf-8", { fatal: false });
    let total = 0;
    let buf = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_FETCH_BYTES) {
        buf += decoder.decode(value.subarray(0, Math.max(0, value.byteLength - (total - MAX_FETCH_BYTES))), { stream: true });
        break;
      }
      buf += decoder.decode(value, { stream: true });
    }
    buf += decoder.decode();
    return { url: res.url, body: buf };
  } finally {
    clearTimeout(t);
  }
}

/* ------------------------------------------------------------------ */
/* Signal extraction (no DOM available in edge runtime → regex pass)   */
/* ------------------------------------------------------------------ */
type Signals = {
  title: string;
  description: string;
  headings: string[];
  links: number;
  widgets: string[];
  visibleText: string;
  bytes: number;
};

function extractSignals(html: string, url: string): Signals {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "")
    .replace(/\s+/g, " ").trim().slice(0, 200);
  const description = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{0,400})["']/i)?.[1] || "")
    .replace(/\s+/g, " ").trim();
  const headings: string[] = [];
  const hRe = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = hRe.exec(cleaned)) && headings.length < 30) {
    const text = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (text && text.length > 1 && text.length < 200) headings.push(text);
  }
  const links = (cleaned.match(/<a\s[^>]*href=/gi) || []).length;
  const widgets = detectWidgets(html);
  const visibleText = cleaned
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 6000);
  void url;
  return {
    title,
    description,
    headings,
    links,
    widgets,
    visibleText,
    bytes: html.length,
  };
}

function detectWidgets(html: string): string[] {
  const lower = html.toLowerCase();
  const hits: string[] = [];
  const map: Record<string, string[]> = {
    "Cal.com":    ["cal.com/embed", "cal-com-embed", "data-cal-link"],
    "Calendly":   ["calendly.com/", "calendly-overlay"],
    "Stripe":     ["js.stripe.com", "stripe-checkout"],
    "HubSpot":    ["js.hsforms.net", "js.hs-scripts.com", "hubspot-form"],
    "Intercom":   ["widget.intercom.io", "intercom-frame"],
    "Drift":      ["js.driftt.com", "drift-frame-controller"],
    "Zendesk":    ["zdassets.com", "zendesk-chat"],
    "Shopify":    ["cdn.shopify.com", "shopify-section"],
    "WordPress":  ["wp-content/", "wp-includes/"],
    "Webflow":    ["webflow.com", "data-wf-page"],
    "Squarespace":["squarespace.com", "sqs-block"],
    "Wix":        ["wix.com", "static.wixstatic.com"],
    "Klaviyo":    ["klaviyo.com", "static.klaviyo.com"],
    "Mailchimp":  ["mailchimp.com", "mc.us"],
    "Google Analytics": ["googletagmanager.com", "google-analytics.com"],
    "Meta Pixel": ["connect.facebook.net", "fbq("],
    "Twilio":     ["sdk.twilio.com"],
    "Vapi":       ["vapi.ai", "vapi-sdk"],
    "ElevenLabs": ["elevenlabs.io"],
  };
  for (const [name, sigs] of Object.entries(map)) {
    if (sigs.some((s) => lower.includes(s))) hits.push(name);
  }
  return hits;
}

function formatSignalsForLLM(s: Signals): string {
  const parts: string[] = [];
  parts.push(`TITLE: ${s.title || "(none)"}`);
  if (s.description) parts.push(`META_DESCRIPTION: ${s.description}`);
  if (s.headings.length) parts.push(`HEADINGS:\n- ${s.headings.slice(0, 15).join("\n- ")}`);
  parts.push(`LINK_COUNT: ${s.links}`);
  parts.push(`DETECTED_WIDGETS: ${s.widgets.length ? s.widgets.join(", ") : "(none detected)"}`);
  parts.push(`VISIBLE_TEXT_EXCERPT:\n${s.visibleText.slice(0, 4500)}`);
  return parts.join("\n\n");
}

/* ------------------------------------------------------------------ */
/* LLM output parsing                                                  */
/* ------------------------------------------------------------------ */
type AuditPartial = {
  company?: string;
  summary?: string;
  opportunities?: Partial<Opportunity>[];
  next_step?: string;
};

function safeParseAudit(raw: string): AuditPartial | null {
  if (!raw) return null;
  let text = raw.trim();
  // Strip ``` fences defensively.
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  // Find the first { ... last } so leading/trailing prose doesn't break us.
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  const slice = text.slice(start, end + 1);
  try {
    const obj = JSON.parse(slice) as AuditPartial;
    if (!obj || typeof obj !== "object") return null;
    if (!Array.isArray(obj.opportunities)) return null;
    return obj;
  } catch {
    return null;
  }
}

function normalizeOpp(o: Partial<Opportunity>): Opportunity {
  const pri = (o.priority || "medium").toString().toLowerCase();
  const priority: Opportunity["priority"] =
    pri === "high" || pri === "low" ? pri : "medium";
  return {
    title: String(o.title || "Opportunity").slice(0, 140),
    problem: String(o.problem || "").slice(0, 600),
    solution: String(o.solution || "").slice(0, 800),
    outcome: String(o.outcome || "").slice(0, 400),
    stack: String(o.stack || "").slice(0, 300),
    priority,
  };
}

function hostnameOf(u: string): string {
  try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; }
}

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extra },
  });
}
