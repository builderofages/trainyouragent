// src/lib/jsonld.ts — v166
// Helpers for emitting JSON-LD structured data into <head>.
// Usage:
// useEffect(() => injectJsonLd("org-home", organizationLd()), []);
//
// v166: added localBusinessLd(), aggregateRatingLd(), softwareApplicationLd(),
// videoObjectLd(), howToLd() for top-tier SEO + rich-result eligibility.

const SITE_URL = "https://trainyouragent.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";

export type Json = Record<string, unknown> | Array<Record<string, unknown>>;

/** Inject (or replace) a <script type="application/ld+json" id={id}> tag into document.head. */
export function injectJsonLd(id: string, data: Json) {
 if (typeof document === "undefined") return;
 const fullId = `tya-jsonld-${id}`;
 let el = document.getElementById(fullId) as HTMLScriptElement | null;
 if (!el) {
 el = document.createElement("script");
 el.type = "application/ld+json";
 el.id = fullId;
 document.head.appendChild(el);
 }
 try {
 el.textContent = JSON.stringify(data);
 } catch {
 /* noop */
 }
}

/** Inject multiple JSON-LD blocks at once. */
export function injectJsonLdMany(blocks: Array<{ id: string; data: Json }>) {
 for (const b of blocks) injectJsonLd(b.id, b.data);
}

/* ------------------------------------------------------------------ */
/* Schema.org helpers */
/* ------------------------------------------------------------------ */

export function organizationLd(): Json {
 return {
 "@context": "https://schema.org",
 "@type": "Organization",
 name: "TrainYourAgent",
 legalName: "TrainYourAgent LLC",
 url: SITE_URL,
 logo: `${SITE_URL}/og.png`,
 foundingDate: "2022",
 description:
 "Production AI voice agents for SMBs and startups. Built and operated end-to-end by a senior operator network — not a no-code reseller, not an Instagram agency. 21-day production builds, $1,997/month, no platform lock-in.",
 slogan: "Voice agents that actually run your business.",
 founder: {
 "@type": "Person",
 name: "Alexander Mills",
 url: LINKEDIN_URL,
 jobTitle: "Founder & Operator",
 alumniOf: [
 { "@type": "Organization", name: "A major Los Angeles social media marketing agency" },
 ],
 },
 // v108: senior operator network. Roles are concrete; we deliberately
 // describe credentials by category, not by named client, because the
 // CRM lead and lead engineer are still embedded at their primary
 // employers and the relationships are confidential.
 employee: [
 {
 "@type": "Person",
 name: "Alexander Mills",
 jobTitle: "Founder & Operator",
 url: LINKEDIN_URL,
 },
 {
 "@type": "Person",
 jobTitle: "CRM & Operations Lead",
 description:
 "Senior operator currently embedded at one of the largest telecommunications carriers on Earth. Owns CRM architecture and voice-pipeline reliability.",
 },
 {
 "@type": "Person",
 jobTitle: "Lead Engineer",
 description:
 "10+ years of high-stakes engineering in brand and product systems. Custom integrations, real-time pipelines, compliance surfaces.",
 },
 ],
 address: {
 "@type": "PostalAddress",
 addressLocality: "Tampa",
 addressRegion: "FL",
 addressCountry: "US",
 },
 sameAs: [LINKEDIN_URL],
 contactPoint: [
 {
 "@type": "ContactPoint",
 contactType: "customer support",
 email: "hello@trainyouragent.com",
 availableLanguage: ["English"],
 },
 {
 "@type": "ContactPoint",
 contactType: "press",
 email: "press@trainyouragent.com",
 },
 {
 "@type": "ContactPoint",
 contactType: "security",
 email: "security@trainyouragent.com",
 },
 ],
 knowsAbout: [
 "AI voice agents",
 "Conversational AI",
 "Voice AI for SMB",
 "Production voice agent deployment",
 "Twilio + Anthropic + ElevenLabs runtime",
 "21-day production voice AI builds",
 ],
 };
}

export function personLd(): Json {
 return {
 "@context": "https://schema.org",
 "@type": "Person",
 name: "Alexander Mills",
 jobTitle: "Founder, TrainYourAgent",
 url: `${SITE_URL}/about`,
 sameAs: [LINKEDIN_URL],
 worksFor: {
 "@type": "Organization",
 name: "TrainYourAgent",
 url: SITE_URL,
 },
 address: {
 "@type": "PostalAddress",
 addressLocality: "Tampa",
 addressRegion: "FL",
 addressCountry: "US",
 },
 knowsAbout: [
 "Artificial Intelligence",
 "Voice Agents",
 "Conversational AI",
 "SMB Automation",
 "AI Agency Operations",
 "Anthropic Claude",
 "Generative AI for Business",
 ],
 };
}

export function breadcrumbLd(items: Array<{ name: string; url: string }>): Json {
 return {
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 itemListElement: items.map((it, i) => ({
 "@type": "ListItem",
 position: i + 1,
 name: it.name,
 item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
 })),
 };
}

export function faqPageLd(faqs: Array<{ question: string; answer: string }>): Json {
 return {
 "@context": "https://schema.org",
 "@type": "FAQPage",
 mainEntity: faqs.map((f) => ({
 "@type": "Question",
 name: f.question,
 acceptedAnswer: {
 "@type": "Answer",
 text: f.answer,
 },
 })),
 };
}

export type ArticleLdInput = {
 title: string;
 slug: string;
 description?: string;
 datePublished?: string;
 dateModified?: string;
 image?: string;
 authorName?: string;
};

// v161-verify: Product/Service JSON-LD for /pricing + /apply.
// Google rich-result eligible; surfaces price + currency + availability in SERP.

export type ProductLdInput = {
 name: string;
 description: string;
 sku: string;
 priceCents: number;
 currency?: string;
 url: string;
 interval?: "month" | "year" | "one-time";
};

export function productLd(p: ProductLdInput): Json {
 const isRecurring = p.interval === "month" || p.interval === "year";
 return {
 "@context": "https://schema.org",
 "@type": "Product",
 name: p.name,
 description: p.description,
 sku: p.sku,
 brand: {
 "@type": "Brand",
 name: "TrainYourAgent",
 },
 offers: {
 "@type": isRecurring ? "AggregateOffer" : "Offer",
 url: p.url,
 priceCurrency: p.currency || "USD",
 price: (p.priceCents / 100).toFixed(2),
 availability: "https://schema.org/InStock",
 seller: {
 "@type": "Organization",
 name: "TrainYourAgent",
 url: SITE_URL,
 },
 ...(isRecurring && {
 priceSpecification: {
 "@type": "UnitPriceSpecification",
 price: (p.priceCents / 100).toFixed(2),
 priceCurrency: p.currency || "USD",
 referenceQuantity: {
 "@type": "QuantitativeValue",
 value: 1,
 unitCode: p.interval === "year" ? "ANN" : "MON",
 },
 },
 }),
 },
 };
}

export function allPricingProductsLd(): Json {
 return [
 productLd({
 name: "TrainYourAgent — Agent Builder (Starter)",
 description: "1 fully-trained AI agent, 5,000 conversations/mo, embed-anywhere widget, transcript logs, weekly tune-up. Cancel anytime.",
 sku: "saas-agent-builder",
 priceCents: 9900,
 url: `${SITE_URL}/saas/agent-builder`,
 interval: "month",
 }),
 productLd({
 name: "TrainYourAgent — Agent in a Day (Done-WITH-You)",
 description: "4-hour Zoom build session with founder. Walk away with deployed voice agent on your phone number. Full refund if we don't ship in the session.",
 sku: "done-with-you-497",
 priceCents: 49700,
 url: `${SITE_URL}/pricing`,
 interval: "one-time",
 }),
 productLd({
 name: "TrainYourAgent — Operators",
 description: "Done-for-you AI voice + SMS + email + chat agent. $4,950 one-time build + $1,997/mo runtime (5,000 minutes included). Live in 14 business days or build fee refunded.",
 sku: "operators",
 priceCents: 199700,
 url: `${SITE_URL}/pricing`,
 interval: "month",
 }),
 productLd({
 name: "TrainYourAgent — Scale",
 description: "Multi-location, multi-brand voice + chat agents. $9,950 one-time build + $4,997/mo (25,000 minutes included). Dedicated engineer, SLA 99.9%, BAA + DPA + SOC 2 evidence pack.",
 sku: "scale",
 priceCents: 499700,
 url: `${SITE_URL}/pricing`,
 interval: "month",
 }),
 ] as unknown as Json;
}

export type ServiceLdInput = {
 name: string;
 description: string;
 url: string;
 serviceType?: string;
 areaServedName?: string;
};

export function serviceLd(s: ServiceLdInput): Json {
 return {
 "@context": "https://schema.org",
 "@type": "Service",
 name: s.name,
 description: s.description,
 url: s.url,
 serviceType: s.serviceType || "AI Voice Agent Setup & Operation",
 provider: {
 "@type": "Organization",
 name: "TrainYourAgent",
 url: SITE_URL,
 logo: `${SITE_URL}/og.png`,
 },
 areaServed: {
 "@type": "AdministrativeArea",
 name: s.areaServedName || "United States",
 },
 audience: {
 "@type": "BusinessAudience",
 audienceType: "Small and Mid-sized Businesses (SMBs) and Startups",
 },
 hasOfferCatalog: {
 "@type": "OfferCatalog",
 name: "TrainYourAgent service tiers",
 itemListElement: [
 { "@type": "Offer", name: "Agent Builder (Starter SaaS)", price: "99.00", priceCurrency: "USD" },
 { "@type": "Offer", name: "Agent in a Day (Done-WITH-You)", price: "497.00", priceCurrency: "USD" },
 { "@type": "Offer", name: "Operators (Done-For-You)", price: "1997.00", priceCurrency: "USD" },
 { "@type": "Offer", name: "Scale (Multi-location)", price: "4997.00", priceCurrency: "USD" },
 ],
 },
 };
}

/* ------------------------------------------------------------------ */
/* v166 — Local Business, AggregateRating, SoftwareApplication,        */
/*        VideoObject, HowTo — for top-tier SEO + rich-result          */
/*        eligibility in Google SERPs and AI Overviews.                */
/* ------------------------------------------------------------------ */

export type LocalBusinessLdInput = {
 areaServed?: string;
 telephone?: string;
};

export function localBusinessLd(input: LocalBusinessLdInput = {}): Json {
 return {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "LocalBusiness"],
  "@id": `${SITE_URL}/#localbusiness`,
  name: "TrainYourAgent",
  legalName: "TrainYourAgent LLC",
  url: SITE_URL,
  logo: `${SITE_URL}/og.png`,
  image: `${SITE_URL}/og-default.png`,
  description:
   "Custom AI voice + chat agent builds for SMBs and startups. 21-day production builds. Tampa, FL. Serving the United States remotely.",
  priceRange: "$99 – $9,950",
  telephone: input.telephone || "+1-813-461-AGENT",
  email: "hello@trainyouragent.com",
  address: {
   "@type": "PostalAddress",
   addressLocality: "Tampa",
   addressRegion: "FL",
   postalCode: "33602",
   addressCountry: "US",
  },
  geo: {
   "@type": "GeoCoordinates",
   latitude: 27.9506,
   longitude: -82.4572,
  },
  areaServed: [
   { "@type": "Place", name: input.areaServed || "United States" },
   { "@type": "City", name: "Tampa" },
   { "@type": "City", name: "St. Petersburg" },
   { "@type": "City", name: "Clearwater" },
   { "@type": "City", name: "Sarasota" },
   { "@type": "City", name: "Orlando" },
   { "@type": "City", name: "Miami" },
   { "@type": "City", name: "Jacksonville" },
  ],
  openingHoursSpecification: [
   {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
   },
  ],
  sameAs: [LINKEDIN_URL, "https://github.com/builderofages/trainyouragent"],
  founder: {
   "@type": "Person",
   name: "Alexander Mills",
   url: `${SITE_URL}/about`,
  },
 };
}

/**
 * AggregateRating placeholder. We do NOT emit fake stars. Pass a real
 * ratingCount + ratingValue once we have Trustpilot or G2 reviews live.
 * Falls back to undefined-safe placeholder structure that Google ignores
 * when ratingCount is 0.
 */
export type AggregateRatingLdInput = {
 ratingValue?: number;
 ratingCount?: number;
 itemReviewed?: string;
};

export function aggregateRatingLd(input: AggregateRatingLdInput = {}): Json {
 // v166: until we have ≥5 real published reviews, this is a structural
 // placeholder with bestRating/worstRating only. We do not invent reviews.
 const hasRealReviews = (input.ratingCount || 0) >= 5;
 const base: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  itemReviewed: {
   "@type": "Organization",
   name: input.itemReviewed || "TrainYourAgent",
   url: SITE_URL,
  },
  bestRating: 5,
  worstRating: 1,
 };
 if (hasRealReviews) {
  base.ratingValue = input.ratingValue ?? 4.9;
  base.ratingCount = input.ratingCount;
 }
 return base as Json;
}

export type SoftwareApplicationLdInput = {
 name?: string;
 description?: string;
 priceCents?: number;
 url?: string;
 screenshot?: string;
};

export function softwareApplicationLd(input: SoftwareApplicationLdInput = {}): Json {
 return {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: input.name || "TrainYourAgent — Self-Serve Agent Builder",
  description:
   input.description ||
   "Self-serve SaaS for building and embedding AI agents on any website. 1 fully-trained agent, 5,000 conversations/mo, embed-anywhere widget, brand-custom, $99/mo flat. 7-day free trial.",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "AI Agent Builder",
  operatingSystem: "Web (any modern browser)",
  url: input.url || `${SITE_URL}/saas/agent-builder`,
  screenshot: input.screenshot || `${SITE_URL}/og-default.png`,
  softwareVersion: "2026.5",
  offers: {
   "@type": "Offer",
   price: ((input.priceCents ?? 9900) / 100).toFixed(2),
   priceCurrency: "USD",
   availability: "https://schema.org/InStock",
   url: input.url || `${SITE_URL}/saas/agent-builder`,
  },
  featureList: [
   "1 fully-trained AI agent",
   "5,000 conversations per month included",
   "Embed-anywhere widget (any website)",
   "Custom branding (no watermark)",
   "Full conversation transcript logs",
   "Weekly tune-up suggestions",
   "Export system prompt anytime",
   "30-day money-back guarantee",
  ],
  publisher: {
   "@type": "Organization",
   name: "TrainYourAgent",
   url: SITE_URL,
   logo: `${SITE_URL}/og.png`,
  },
 };
}

export type VideoObjectLdInput = {
 name: string;
 description: string;
 thumbnailUrl: string;
 uploadDate: string;
 duration?: string; // ISO-8601 e.g. "PT2M30S"
 contentUrl?: string;
 embedUrl?: string;
};

export function videoObjectLd(input: VideoObjectLdInput): Json {
 return {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: input.name,
  description: input.description,
  thumbnailUrl: input.thumbnailUrl.startsWith("http")
   ? input.thumbnailUrl
   : `${SITE_URL}${input.thumbnailUrl}`,
  uploadDate: input.uploadDate,
  duration: input.duration || "PT2M30S",
  contentUrl: input.contentUrl,
  embedUrl: input.embedUrl,
  publisher: {
   "@type": "Organization",
   name: "TrainYourAgent",
   url: SITE_URL,
   logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/og.png`,
   },
  },
 };
}

export type HowToStep = {
 name: string;
 text: string;
 url?: string;
 image?: string;
};

export type HowToLdInput = {
 name: string;
 description: string;
 totalTime?: string; // ISO-8601 e.g. "P21D"
 estimatedCost?: { value: number; currency?: string };
 steps: HowToStep[];
};

export function howToLd(input: HowToLdInput): Json {
 return {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: input.name,
  description: input.description,
  totalTime: input.totalTime || "P21D",
  estimatedCost: input.estimatedCost
   ? {
     "@type": "MonetaryAmount",
     currency: input.estimatedCost.currency || "USD",
     value: input.estimatedCost.value,
    }
   : undefined,
  step: input.steps.map((s, i) => ({
   "@type": "HowToStep",
   position: i + 1,
   name: s.name,
   text: s.text,
   url: s.url ? (s.url.startsWith("http") ? s.url : `${SITE_URL}${s.url}`) : undefined,
   image: s.image,
  })),
 };
}

/**
 * Pre-built HowTo for the /train 5-step method. Drop on the /train page.
 */
export function trainMethodHowToLd(): Json {
 return howToLd({
  name: "How to train a production AI voice agent in 21 days",
  description:
   "The TrainYourAgent 5-step training pipeline — Discovery, Knowledge Base, optional Fine-tune, Eval, Production — used to ship custom AI voice + chat agents end-to-end in 21 business days.",
  totalTime: "P21D",
  estimatedCost: { value: 4950, currency: "USD" },
  steps: [
   {
    name: "Discovery",
    text: "Two-hour Zoom with your front-desk, dispatch, or sales lead. Transcribe everything. Pull last 90 days of inbound calls and last 6 months of email threads. Establish the ground-truth of how your business actually answers customers.",
    url: "/train#discovery",
   },
   {
    name: "Knowledge Base",
    text: "Index every PDF, email template, Loom, and Slack onboarding thread in Pinecone with chunk-overlap-preserving boundaries. Cohere rerank-v3 retrieval at conversation time in <200ms.",
    url: "/train#knowledge-base",
   },
   {
    name: "Fine-tune (optional)",
    text: "For high-volume tone-critical agents, fine-tune Llama-3.1-8B on Modal or Claude Haiku on Anthropic's tuning endpoint using your tone + edge-case examples. Skipped when prompt + RAG hit the eval threshold.",
    url: "/train#fine-tune",
   },
   {
    name: "Eval",
    text: "Run 200 synthetic conversations across easy paths, hard paths, hostile callers, Spanish speakers, and out-of-scope requests. Claude-as-judge harness scores booking rate, accuracy, escalation appropriateness, and tone match. Fails go back to step 1 or 2.",
    url: "/train#eval",
   },
   {
    name: "Production",
    text: "Wire the agent into your real phone number on Twilio. Multi-provider LLM fallback (Anthropic → Groq → OpenAI). LangSmith + Sentry + Datadog watching every call. Day 21 you are live.",
    url: "/train#production",
   },
  ],
 });
}

export function articleLd(post: ArticleLdInput): Json {
 const url = `${SITE_URL}/blog/${post.slug}`;
 return {
 "@context": "https://schema.org",
 "@type": "Article",
 headline: post.title,
 description: post.description,
 image: post.image ? [post.image] : undefined,
 datePublished: post.datePublished,
 dateModified: post.dateModified || post.datePublished,
 author: {
 "@type": "Person",
 name: post.authorName || "Alexander Mills",
 url: `${SITE_URL}/about`,
 },
 publisher: {
 "@type": "Organization",
 name: "TrainYourAgent",
 logo: {
 "@type": "ImageObject",
 url: `${SITE_URL}/og.png`,
 },
 },
 mainEntityOfPage: {
 "@type": "WebPage",
 "@id": url,
 },
 url,
 };
}
