// src/lib/jsonld.ts — v47A
// Helpers for emitting JSON-LD structured data into <head>.
// Usage:
// useEffect(() => injectJsonLd("org-home", organizationLd()), []);

const SITE_URL = "https://trainyouragent.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/agentmills";

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
