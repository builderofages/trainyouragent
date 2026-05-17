// api/sitemap.xml.ts — v40b
// Dynamic sitemap. Vercel edge function. Returns application/xml.
//
// Why dynamic: every time we add a programmatic LP (alternatives, locations,
// blog posts) the sitemap needs to update. Hardcoding public/sitemap.xml means
// we forget. This generates the URL list from the same arrays that drive the
// routes, so the sitemap is correct by construction.
//
// Routed via vercel.json:
//   "rewrites": [{ "source": "/sitemap.xml", "destination": "/api/sitemap.xml" }, ...]
//
// Edge runtime can't import from src/ (different bundle), so the URL lists
// are inlined here. When you add a new vertical, city, blog post, or
// alternative combo, add it to the constants below.

export const config = { runtime: "edge" };

const SITE = "https://trainyouragent.com";

// ---- STATIC PAGES ----------------------------------------------------------
const STATIC_PAGES: { path: string; priority: number; changefreq: string }[] = [
  { path: "/",                          priority: 1.0,  changefreq: "weekly"  },
  { path: "/pricing",                   priority: 0.9,  changefreq: "weekly"  },
  { path: "/solutions",                 priority: 0.9,  changefreq: "weekly"  },
  { path: "/solutions/configurator",    priority: 0.8,  changefreq: "monthly" },
  { path: "/about",                     priority: 0.75, changefreq: "monthly" },
  { path: "/team",                      priority: 0.7,  changefreq: "monthly" },
  { path: "/security",                  priority: 0.8,  changefreq: "monthly" },
  { path: "/technology",                priority: 0.8,  changefreq: "monthly" },
  { path: "/research",                  priority: 0.65, changefreq: "monthly" },
  { path: "/integrations",              priority: 0.75, changefreq: "monthly" },
  { path: "/case-studies",              priority: 0.75, changefreq: "monthly" },
  { path: "/comparisons",               priority: 0.85, changefreq: "monthly" },
  { path: "/contact",                   priority: 0.75, changefreq: "monthly" },
  { path: "/demos",                     priority: 0.7,  changefreq: "monthly" },
  { path: "/calculators",               priority: 0.7,  changefreq: "monthly" },
  { path: "/demo-request",              priority: 0.65, changefreq: "monthly" },
  { path: "/demo-video",                priority: 0.6,  changefreq: "monthly" },
  { path: "/sales-toolkit",             priority: 0.55, changefreq: "monthly" },
  { path: "/resources",                 priority: 0.7,  changefreq: "weekly"  },
  { path: "/blog",                      priority: 0.9,  changefreq: "daily"   },
  { path: "/newsletter",                priority: 0.6,  changefreq: "monthly" },
  { path: "/start",                     priority: 0.6,  changefreq: "monthly" },
  { path: "/trial",                     priority: 0.85, changefreq: "monthly" },
  { path: "/testimonials",              priority: 0.7,  changefreq: "monthly" },
  { path: "/customers",                 priority: 0.8,  changefreq: "monthly" },
  { path: "/onboarding",                priority: 0.6,  changefreq: "monthly" },
  { path: "/learn",                     priority: 0.7,  changefreq: "weekly"  },
  { path: "/status",                    priority: 0.5,  changefreq: "weekly"  },
  { path: "/careers",                   priority: 0.55, changefreq: "monthly" },
  { path: "/press",                     priority: 0.55, changefreq: "monthly" },
  { path: "/agency-partner",            priority: 0.7,  changefreq: "monthly" },
  // v47A: trust + authority
  { path: "/speaking",                  priority: 0.65, changefreq: "monthly" },
  { path: "/podcast-guest",             priority: 0.6,  changefreq: "monthly" },
  { path: "/compliance",                priority: 0.8,  changefreq: "monthly" },
  { path: "/accessibility",             priority: 0.6,  changefreq: "monthly" },
  { path: "/trust-center",              priority: 0.85, changefreq: "monthly" },
  { path: "/uptime",                    priority: 0.55, changefreq: "weekly"  },
  { path: "/media-kit",                 priority: 0.55, changefreq: "monthly" },
  // v41/v44: community + partners + tools + metrics
  { path: "/community",                 priority: 0.65, changefreq: "weekly"  },
  { path: "/partners",                  priority: 0.65, changefreq: "monthly" },
  { path: "/metrics",                   priority: 0.7,  changefreq: "weekly"  },
  { path: "/tools",                     priority: 0.75, changefreq: "monthly" },
  { path: "/tools/cost-estimator",      priority: 0.6,  changefreq: "monthly" },
  { path: "/tools/roi-calculator",      priority: 0.6,  changefreq: "monthly" },
  { path: "/tools/prompt-critic",       priority: 0.6,  changefreq: "monthly" },
  { path: "/tools/scenario-generator",  priority: 0.6,  changefreq: "monthly" },
  { path: "/tools/latency-simulator",   priority: 0.6,  changefreq: "monthly" },
  { path: "/tools/prompt-library",      priority: 0.6,  changefreq: "monthly" },
  { path: "/tools/model-selector",      priority: 0.6,  changefreq: "monthly" },
  { path: "/tools/automation-roi",      priority: 0.6,  changefreq: "monthly" },
  // v49: docs, api-docs, mission, invest, affiliate
  { path: "/docs",                      priority: 0.85, changefreq: "weekly"  },
  { path: "/api-docs",                  priority: 0.8,  changefreq: "monthly" },
  { path: "/mission",                   priority: 0.85, changefreq: "monthly" },
  { path: "/invest",                    priority: 0.7,  changefreq: "monthly" },
  { path: "/affiliate-program",         priority: 0.7,  changefreq: "monthly" },
  // v49: existing pages that were never in the sitemap — add them now
  { path: "/book",                      priority: 0.85, changefreq: "monthly" },
  { path: "/dashboard",                 priority: 0.4,  changefreq: "weekly"  },
  // Legal (low priority)
  { path: "/privacy",                   priority: 0.5,  changefreq: "yearly"  },
  { path: "/terms",                     priority: 0.5,  changefreq: "yearly"  },
  { path: "/cookie-policy",             priority: 0.5,  changefreq: "yearly"  },
];

// v49: DOCS — 12 articles
const DOC_SLUGS = [
  "what-trainyouragent-does",
  "pricing-and-billing",
  "your-first-seven-days",
  "how-ai-voice-agents-work",
  "voice-agent-best-practices",
  "voice-agent-troubleshooting",
  "choosing-chat-vs-voice",
  "connecting-knowledge-base",
  "chat-agent-metrics",
  "integrating-with-hubspot",
  "integrating-with-calendly-or-cal-com",
  "integrating-with-stripe",
];

// ---- VERTICAL HUB PAGES (15) ----------------------------------------------
const VERTICAL_SLUGS = [
  "hvac","healthcare","real-estate","legal","roofing","solar",
  "accounting","automotive","spas","hotels","bars-nightclubs",
  "logistics","gym","ecommerce","hospitality",
];

// ---- SOLUTIONS PILLAR PAGES (6) -------------------------------------------
const SOLUTIONS_PILLARS = ["voice","chat","sites","infra","media","growth"];

// ---- COMPETITOR /vs/* (5) -------------------------------------------------
const VS_COMPETITORS = ["bland","synthflow","vapi","retell","air-ai","airagent"];

// ---- BLOG POSTS (mirrors src/content/blog/*.mdx) --------------------------
const BLOG_SLUGS = [
  // pre-v50c
  "bland-vs-synthflow-vs-vapi-the-honest-comparison",
  "hipaa-voice-agents-the-plain-english-guide",
  "how-we-shipped-200-seo-landing-pages-in-a-weekend",
  "hvac-after-hours-playbook",
  "pathway-routing-the-secret-to-3x-conversion",
  "real-cost-ai-voice-agent-2026",
  "reverse-engineering-bland-ai-pricing",
  "the-ai-agency-pricing-playbook-2026",
  "the-founder-loom-day-in-the-life-of-trainyouragent",
  "the-real-cost-of-ai-voice-agents-in-2026",
  "5-ai-automations-every-smb-should-have",
  "ai-receptionist-roi-calculator-walkthrough",
  "from-cubicle-to-agent-the-future-of-work-thesis",
  "how-i-built-a-20k-mrr-ai-agency-in-12-months",
  "prompts-that-actually-work-for-sales-emails",
  "the-real-cost-of-a-custom-ai-agent",
  "voice-agents-vs-human-receptionists-2026",
  "why-most-ai-pilots-fail-and-how-to-avoid-it",
  // v50c: 50 new long-form posts
  "voice-agent-script-template-for-hvac-companies",
  "how-to-evaluate-voice-agent-vendors-2026-buyers-guide",
  "voice-agent-latency-deep-dive-what-actually-matters",
  "the-cost-of-missed-calls-real-numbers-from-100-smbs",
  "voice-agent-vs-virtual-receptionist-the-honest-tradeoff",
  "building-a-voice-agent-prompt-that-passes-the-handoff-test",
  "5-voice-agent-failure-modes-and-how-to-engineer-around-them",
  "multi-language-voice-agents-spanish-first-deployment",
  "voice-agent-compliance-for-healthcare-the-hipaa-checklist",
  "outbound-voice-agents-the-3-use-cases-that-actually-pay-back",
  "chat-agent-deflection-rate-the-only-metric-that-matters",
  "connecting-your-knowledge-base-to-a-chat-agent-step-by-step",
  "chat-agent-vs-decision-tree-bot-when-each-wins",
  "how-to-train-a-chat-agent-on-your-companys-voice",
  "the-multi-channel-chat-stack-web-sms-whatsapp-instagram",
  "chat-agent-handoff-to-human-the-7-triggers-you-should-set",
  "chat-agent-analytics-the-dashboard-every-operator-needs",
  "building-a-chat-agent-for-ecommerce-cart-recovery-playbook",
  "chat-agent-pricing-models-per-message-vs-per-resolution",
  "the-saas-onboarding-chat-agent-that-boosted-activation-32-percent",
  "the-smb-ai-readiness-scorecard",
  "ai-budget-allocation-for-a-2m-revenue-business",
  "how-to-pilot-ai-without-getting-burned",
  "the-7-ai-projects-every-service-business-should-fund-this-year",
  "ai-rollout-for-multi-location-businesses-the-franchise-playbook",
  "change-management-when-introducing-ai-to-a-blue-collar-team",
  "the-true-cost-of-an-ai-pilot-from-discovery-to-production",
  "ai-vendor-due-diligence-the-12-questions-to-ask",
  "building-an-internal-ai-champion-the-role-most-smbs-skip",
  "measuring-ai-roi-the-3-frameworks-that-actually-work",
  "ai-for-hvac-companies-the-complete-stack",
  "ai-for-law-firms-intake-research-and-billing",
  "ai-for-dental-practices-recall-rebook-and-treatment-coordination",
  "ai-for-roofing-companies-lead-qualification-to-job-scheduling",
  "ai-for-property-management-tenant-comms-at-scale",
  "ai-for-real-estate-teams-from-lead-to-closing",
  "ai-for-mortgage-brokers-pre-qualification-to-funded",
  "ai-for-insurance-agents-quote-bind-and-renewal",
  "ai-for-medical-spas-booking-no-show-recovery-and-reactivation",
  "ai-for-home-services-the-call-text-and-quote-loop",
  "the-rag-pipeline-architecture-most-vendors-get-wrong",
  "agent-orchestration-when-you-need-langgraph-vs-when-you-dont",
  "prompt-injection-defense-for-customer-facing-agents",
  "agent-eval-harnesses-the-3-tests-every-build-needs",
  "the-llm-cost-optimization-checklist",
  "building-a-multi-tenant-agent-platform-the-architecture",
  "agent-observability-the-tracing-stack-we-actually-use",
  "claude-vs-gpt-vs-llama-vs-gemini-when-each-wins-2026",
  "the-voice-agent-tech-stack-twilio-deepgram-cartesia-anthropic",
  "agent-deployment-zero-to-prod-in-72-hours-the-runbook",
];

// ---- LOCATION /:vertical/:city (200 LPs) ----------------------------------
const LOCATION_VERTICALS = [
  "hvac","healthcare","real-estate","legal","roofing",
  "solar","accounting","automotive","hospitality","ecommerce",
];
const LOCATION_CITIES = [
  "tampa","miami","orlando","jacksonville","atlanta",
  "charlotte","nashville","austin","dallas","houston",
  "phoenix","las-vegas","denver","chicago","nyc",
  "los-angeles","san-diego","seattle","boston","philadelphia",
];

// ---- ALTERNATIVES /alternatives/:competitor-for-:vertical (50 LPs) --------
const ALT_COMPETITORS = ["bland","synthflow","vapi","retell","airagent"];
const ALT_VERTICALS = [
  "hvac","healthcare","real-estate","legal","roofing",
  "solar","ecommerce","hospitality","accounting","automotive",
];

// ---- v47B: LOCAL /local/{citySlug}/{verticalSlug} (120 LPs + /local hub) --
const LOCAL_CITIES = [
  "tampa","orlando","miami","jacksonville","atlanta","charlotte","raleigh",
  "nashville","austin","dallas","houston","san-antonio","phoenix","las-vegas",
  "denver","salt-lake-city","boise","portland","seattle","san-diego","sacramento",
  "minneapolis","indianapolis","columbus","cleveland","pittsburgh","philadelphia",
  "boston","new-york","chicago",
];
const LOCAL_VERTICALS = ["voice-agents","chat-agents","ai-receptionist","ai-sales-agent"];


function urlNode(loc: string, priority: number, changefreq: string, lastmod: string): string {
  return `  <url><loc>${SITE}${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority.toFixed(2)}</priority></url>`;
}

export default async function handler(_req: Request): Promise<Response> {
  const today = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];

  // Static pages
  for (const p of STATIC_PAGES) {
    lines.push(urlNode(p.path, p.priority, p.changefreq, today));
  }

  // Vertical hubs (15)
  for (const v of VERTICAL_SLUGS) {
    lines.push(urlNode(`/${v}`, 0.85, "monthly", today));
  }

  // Solutions pillars (6) — anchor links; emitted as full pages so search picks them up
  for (const s of SOLUTIONS_PILLARS) {
    lines.push(urlNode(`/solutions/${s}`, 0.8, "monthly", today));
  }

  // Competitor /vs/* (deduped — air-ai + airagent both route to same page)
  for (const c of VS_COMPETITORS) {
    lines.push(urlNode(`/vs/${c}`, 0.75, "monthly", today));
  }

  // Blog posts
  for (const slug of BLOG_SLUGS) {
    lines.push(urlNode(`/blog/${slug}`, 0.7, "monthly", today));
  }

  // 200 location LPs
  for (const v of LOCATION_VERTICALS) {
    for (const city of LOCATION_CITIES) {
      lines.push(urlNode(`/${v}/${city}`, 0.6, "monthly", today));
    }
  }

  // 50 alternatives LPs
  for (const c of ALT_COMPETITORS) {
    for (const v of ALT_VERTICALS) {
      lines.push(urlNode(`/alternatives/${c}-for-${v}`, 0.7, "monthly", today));
    }
  }

  // v47B: /local hub + 120 city x vertical LPs
  lines.push(urlNode(`/local`, 0.85, "weekly", today));
  for (const city of LOCAL_CITIES) {
    for (const v of LOCAL_VERTICALS) {
      lines.push(urlNode(`/local/${city}/${v}`, 0.65, "monthly", today));
    }
  }

  // v49: 12 docs
  for (const slug of DOC_SLUGS) {
    lines.push(urlNode(`/docs/${slug}`, 0.7, "monthly", today));
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    lines.join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      // Sitemap MUST be indexable — override the global /api X-Robots-Tag header
      "X-Robots-Tag": "all",
    },
  });
}
