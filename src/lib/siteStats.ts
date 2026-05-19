// src/lib/siteStats.ts
// v69: SINGLE SOURCE OF TRUTH for every numeric claim on the marketing site.
// When a number changes, change it ONCE here. Every page reads from STATS.*
// so the site never contradicts itself.
//
// Numbers verified against /api/public-metrics, sitemap.xml, and the playbooks/
// blog/tools directories at the v69 commit.

export const STATS = {
  // Content surface
  blogPosts: 70,
  niches: 15,
  playbooks: 15,
  tools: 11,
  alternativesPages: 52,    // 50 generic + zapier + intercom
  localPages: 120,
  totalRoutes: 569,         // verified against /sitemap.xml count
  verticals: 8,             // top-level vertical landing pages
  solutionCategories: 8,    // v69: Everything-AI breadth (voice, chat, recep, sales, mktg, brand, infra, custom)

  // Operator / founder velocity
  yearsInAI: 4,
  publicCommits: 339,       // refreshed weekly via /api/public-metrics
  buildsPerQuarter: 12,

  // Product / runtime
  voiceAgentLatencyMs: 800,
  freeLlmProvider: "Groq Llama 3.3 70B",

  // Time-to-live by plan (CANONICAL — every page reads from here)
  daysToFirstAgent: {
    founder: 7,
    operator: 21,
    scale: 28,
  } as const,

  // Pricing
  pricing: {
    founderUpfront: 0,
    founderPerMinute: 0.18,
    operatorBuildFee: 4950,
    operatorMonthly: 799,
    operatorMinutesIncluded: 4000,
    operatorPerBooking: 15,
  } as const,

  // Offer stack value (sum of STACK_ITEMS in Pricing.tsx, kept in sync here)
  bundledValueUsd: 21500,

  // Coverage
  citiesCovered: 120,
  industriesCovered: 14,
} as const;

export type SiteStats = typeof STATS;

// Human-friendly formatters that read from STATS so display strings are
// consistent across the site (e.g. "339+" everywhere).
export const fmt = {
  commits: () => `${STATS.publicCommits}+`,
  routes: () => `${STATS.totalRoutes}`,
  niches: () => `${STATS.niches}`,
  playbooks: () => `${STATS.playbooks}`,
  tools: () => `${STATS.tools}`,
  blogPosts: () => `${STATS.blogPosts}`,
  yearsInAI: () => `${STATS.yearsInAI} years`,
  daysFounder: () => `${STATS.daysToFirstAgent.founder} days`,
  daysOperator: () => `${STATS.daysToFirstAgent.operator} days`,
  daysScale: () => `${STATS.daysToFirstAgent.scale} days`,
  bundleUsd: () => `$${STATS.bundledValueUsd.toLocaleString()}`,
};
