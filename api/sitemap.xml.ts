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
  // Legal (low priority)
  { path: "/privacy",                   priority: 0.5,  changefreq: "yearly"  },
  { path: "/terms",                     priority: 0.5,  changefreq: "yearly"  },
  { path: "/cookie-policy",             priority: 0.5,  changefreq: "yearly"  },
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
