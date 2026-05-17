// src/content/docs.ts — v49
// Content map for /docs. Each doc has section, title, slug, body.
// Body is a lightweight markdown-ish string. DocsPage renders headings (##),
// paragraphs, ordered/unordered lists, and `<pre>` blocks marked with ```.
// Word counts target the spec — keep them within ±10%.

export type DocSection = "Getting started" | "Voice agents" | "Chat agents" | "Integrations";

export type Doc = {
  slug: string;
  title: string;
  section: DocSection;
  summary: string;
  targetWords: number;
  body: string;
};

export const SECTIONS: { key: DocSection; description: string }[] = [
  { key: "Getting started", description: "What TrainYourAgent is, how billing works, what your first 7 days look like." },
  { key: "Voice agents",    description: "Architecture, best practices, and troubleshooting for production voice agents." },
  { key: "Chat agents",     description: "When chat beats voice, how to wire your knowledge base, what to measure." },
  { key: "Integrations",    description: "Step-by-step setups for HubSpot, Calendly / Cal.com, and Stripe." },
];

// ──────────────────────────────────────────────────────────────────────────────
// Doc bodies are imported from per-doc files to keep this file readable.
// ──────────────────────────────────────────────────────────────────────────────
import { docWhatWeDo } from "./docs/getting-started/what-trainyouragent-does";
import { docPricing } from "./docs/getting-started/pricing-and-billing";
import { docFirstSevenDays } from "./docs/getting-started/your-first-seven-days";
import { docHowVoiceWorks } from "./docs/voice-agents/how-ai-voice-agents-work";
import { docVoiceBestPractices } from "./docs/voice-agents/voice-agent-best-practices";
import { docVoiceTroubleshooting } from "./docs/voice-agents/voice-agent-troubleshooting";
import { docChatVsVoice } from "./docs/chat-agents/choosing-chat-vs-voice";
import { docKnowledgeBase } from "./docs/chat-agents/connecting-knowledge-base";
import { docChatMetrics } from "./docs/chat-agents/chat-agent-metrics";
import { docIntegrationHubspot } from "./docs/integrations/hubspot";
import { docIntegrationCalendly } from "./docs/integrations/calendly-cal-com";
import { docIntegrationStripe } from "./docs/integrations/stripe";

export const DOCS: Doc[] = [
  docWhatWeDo,
  docPricing,
  docFirstSevenDays,
  docHowVoiceWorks,
  docVoiceBestPractices,
  docVoiceTroubleshooting,
  docChatVsVoice,
  docKnowledgeBase,
  docChatMetrics,
  docIntegrationHubspot,
  docIntegrationCalendly,
  docIntegrationStripe,
];

export const DOCS_BY_SLUG: Record<string, Doc> = Object.fromEntries(
  DOCS.map((d) => [d.slug, d]),
);

export function docsBySection(): Record<DocSection, Doc[]> {
  const out = { "Getting started": [], "Voice agents": [], "Chat agents": [], "Integrations": [] } as Record<DocSection, Doc[]>;
  for (const d of DOCS) out[d.section].push(d);
  return out;
}
