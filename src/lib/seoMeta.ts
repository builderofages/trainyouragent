// src/lib/seoMeta.ts — v166
// Single source of truth for per-route SEO metadata.
// Title + description + OG + Twitter + canonical, normalized.
//
// Usage:
//   import { applySeoMeta, SEO } from "@/lib/seoMeta";
//   useEffect(() => applySeoMeta(SEO.pricing), []);
//
// Adding a new route:
//   1. Add the route key to ROUTES below.
//   2. Add a meta object: { title, description, path, ogImage? }.
//   3. (Optional) call applySeoMeta() in the page's useEffect.
//
// Why this file exists: every page used to spin its own meta block
// inline, drift in tone/length, and skip canonical or Twitter card on
// half the routes. One place, one shape, no drift.

const SITE = "https://trainyouragent.com";
const DEFAULT_OG = `${SITE}/og-default.png`;
const TWITTER_HANDLE = "@builderofages";

export type SeoMeta = {
 title: string;
 description: string;
 path: string;
 ogImage?: string;
 ogType?: "website" | "article" | "product";
 twitterCard?: "summary" | "summary_large_image";
 keywords?: string[];
 noindex?: boolean;
};

export const SEO = {
 home: {
  title: "TrainYourAgent — Custom AI Voice + Chat Agents Built in 21 Days",
  description:
   "Production AI voice + chat agents for SMBs. Custom-built end-to-end by a senior operator network — not a no-code reseller. 21-day builds, $1,997/mo, no platform lock-in. United States.",
  path: "/",
  keywords: [
   "AI voice agent",
   "AI receptionist",
   "voice AI for SMB",
   "custom AI agent build",
   "Vapi alternative",
   "Bland alternative",
   "Synthflow alternative",
   "21-day AI agent build",
  ],
 } satisfies SeoMeta,
 pricing: {
  title: "Pricing — Founders, Operators, Scale, SaaS · TrainYourAgent",
  description:
   "Three honest lanes: Founders ($0.39/min pay-as-you-go), Operators ($1,997/mo + $4,950 build), Scale ($4,997/mo + $9,950 build). Plus $99/mo self-serve SaaS. 30-day money-back.",
  path: "/pricing",
  keywords: [
   "AI voice agent pricing",
   "AI receptionist cost",
   "voice AI pricing 2026",
   "custom AI agent cost",
  ],
 } satisfies SeoMeta,
 apply: {
  title: "Apply for a Build Slot — TrainYourAgent",
  description:
   "Apply for a 21-day custom AI voice agent build. We take 2 Operators clients per month and 1 Scale client per quarter. 4-minute application. Reply within 24 hours.",
  path: "/apply",
 } satisfies SeoMeta,
 about: {
  title: "About — Alexander Mills, Founder · TrainYourAgent",
  description:
   "Founder Alexander Mills was a head executive at a top-10 LA social media agency before going all-in on applied AI from the GPT-3 alpha. 4 years shipping production AI for SMBs from United States.",
  path: "/about",
  ogType: "website",
 } satisfies SeoMeta,
 contact: {
  title: "Contact — TrainYourAgent",
  description:
   "Founder Slack, founder email, founder LinkedIn — no SDR layer. 30-min Zoom on cal.com/trainyouragent/30min. Replies within 4 business hours.",
  path: "/contact",
 } satisfies SeoMeta,
 train: {
  title: "Train — The 5-Step AI Agent Training Pipeline · TrainYourAgent",
  description:
   "Our 5-step training pipeline: Discovery → Knowledge Base → Fine-tune → Eval → Production. Live in 21 business days. Real tools, real cost, real timelines.",
  path: "/train",
  keywords: [
   "how to train AI voice agent",
   "AI agent training method",
   "voice agent training",
   "RAG for voice agents",
   "voice agent eval",
  ],
 } satisfies SeoMeta,
 hire: {
  title: "Hire the Operator — Direct Line to the Founder · TrainYourAgent",
  description:
   "No SDR. No discovery-call gauntlet. 30-min Zoom directly with the founder. We scope your use case live, show a real build on the call, and you walk away with a written plan.",
  path: "/hire",
 } satisfies SeoMeta,
 saas: {
  title: "Self-Serve SaaS — $99/mo Agent Builder · TrainYourAgent",
  description:
   "Build your own AI agent — 1 agent, 5,000 conversations/mo, embed-anywhere, custom-branded, no watermark. $99/mo flat. 7-day free trial, no card required.",
  path: "/saas/agent-builder",
  ogType: "product",
 } satisfies SeoMeta,
 voiceDemo: {
  title: "Live Voice Agent Demo — Try It Free · TrainYourAgent",
  description:
   "Free live voice agent. Click to call. Answers in <2 seconds. Books a call, qualifies you, texts a summary. Running on our real production stack — not a video.",
  path: "/voice-demo",
 } satisfies SeoMeta,
 customers: {
  title: "Customers & Case Studies — TrainYourAgent",
  description:
   "Real math, not fake testimonials. HVAC operators recovering $16K/mo in missed calls. Dental practices closing $23K/mo of voicemail leak. The numbers, forward.",
  path: "/customers",
 } satisfies SeoMeta,
 proof: {
  title: "Proof — Public Commits, Live URLs, Deploys · TrainYourAgent",
  description:
   "344+ public commits, 569+ live URLs, 4 production AI providers in fallback, 15 production services. Every claim has a receipt. The repo is public.",
  path: "/proof",
 } satisfies SeoMeta,
 technology: {
  title: "Technology — The Production Stack · TrainYourAgent",
  description:
   "Anthropic Claude → Groq Llama → OpenAI fallback. ElevenLabs Flash 2.5 + Deepgram Nova-3. Twilio, Pinecone, Vercel, Supabase, LangSmith. The full stack, public.",
  path: "/technology",
 } satisfies SeoMeta,
 vs: {
  title: "vs Vapi, Bland, Synthflow, Air AI — Honest Comparison · TrainYourAgent",
  description:
   "Side-by-side comparison: TrainYourAgent vs Vapi vs Bland vs Synthflow vs Air AI vs hiring an Instagram agency. Real pricing, real latency, real trade-offs.",
  path: "/vs",
 } satisfies SeoMeta,
 blog: {
  title: "Blog — TrainYourAgent",
  description:
   "Operator-grade posts on voice AI, agent observability, RAG, evals, and the math of running a production AI agency. No fluff, no thought-leadership theater.",
  path: "/blog",
 } satisfies SeoMeta,
} as const;

export type SeoKey = keyof typeof SEO;

/** Apply a SeoMeta object to the document head. SSR-safe. */
export function applySeoMeta(meta: SeoMeta): void {
 if (typeof document === "undefined") return;

 const canonical = meta.path.startsWith("http") ? meta.path : `${SITE}${meta.path}`;
 const ogImage = meta.ogImage || DEFAULT_OG;
 const ogType = meta.ogType || "website";
 const twitterCard = meta.twitterCard || "summary_large_image";

 document.title = meta.title;

 const setMeta = (name: string, content: string) => {
  let el = document.querySelector(`meta[name='${name}']`) as HTMLMetaElement | null;
  if (!el) {
   el = document.createElement("meta");
   el.setAttribute("name", name);
   document.head.appendChild(el);
  }
  el.setAttribute("content", content);
 };

 const setMetaProp = (prop: string, content: string) => {
  let el = document.querySelector(`meta[property='${prop}']`) as HTMLMetaElement | null;
  if (!el) {
   el = document.createElement("meta");
   el.setAttribute("property", prop);
   document.head.appendChild(el);
  }
  el.setAttribute("content", content);
 };

 const setLink = (rel: string, href: string, extraAttrs: Record<string, string> = {}) => {
  const selector =
   Object.keys(extraAttrs).length > 0
    ? `link[rel='${rel}'][${Object.keys(extraAttrs)[0]}='${
       extraAttrs[Object.keys(extraAttrs)[0]]
      }']`
    : `link[rel='${rel}']`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
   el = document.createElement("link");
   el.setAttribute("rel", rel);
   document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  for (const [k, v] of Object.entries(extraAttrs)) el.setAttribute(k, v);
 };

 setMeta("description", meta.description);
 if (meta.keywords?.length) setMeta("keywords", meta.keywords.join(", "));
 if (meta.noindex) setMeta("robots", "noindex,nofollow");
 else setMeta("robots", "index,follow,max-image-preview:large,max-snippet:-1");

 setMetaProp("og:type", ogType);
 setMetaProp("og:title", meta.title);
 setMetaProp("og:description", meta.description);
 setMetaProp("og:url", canonical);
 setMetaProp("og:image", ogImage);
 setMetaProp("og:image:width", "1200");
 setMetaProp("og:image:height", "630");
 setMetaProp("og:site_name", "TrainYourAgent");
 setMetaProp("og:locale", "en_US");

 setMeta("twitter:card", twitterCard);
 setMeta("twitter:site", TWITTER_HANDLE);
 setMeta("twitter:creator", TWITTER_HANDLE);
 setMeta("twitter:title", meta.title);
 setMeta("twitter:description", meta.description);
 setMeta("twitter:image", ogImage);

 setLink("canonical", canonical);
 setLink("alternate", canonical, { hreflang: "x-default" });
 setLink("alternate", canonical, { hreflang: "en" });
 setLink("alternate", canonical, { hreflang: "en-us" });
}

/** Convenience: apply by key. */
export function applySeoByKey(key: SeoKey): void {
 applySeoMeta(SEO[key]);
}
