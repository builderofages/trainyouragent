#!/usr/bin/env node
// scripts/prerender-routes.mjs — v260 (Grok killer #1, full-site)
//
// Postbuild: write per-route dist/[route]/index.html files with route-specific
// <title>, <meta description>, OG, Twitter, and <noscript> hero baked into
// the static HTML. Crawlers, LinkedIn/Twitter previews, and JS-disabled
// visitors now see correct per-route metadata BEFORE React hydrates.
//
// React Helmet still controls the runtime title at navigation time — these
// per-route files are only for the FIRST request (server response) on each
// route. Once the SPA hydrates, Helmet takes over.
//
// Why not Vite SSR / vite-plugin-prerender? Both pull in puppeteer-class
// deps that break Vercel builds intermittently. This script uses only Node
// fs + string replace. Bulletproof.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "..", "dist");
const TEMPLATE_PATH = resolve(DIST, "index.html");

/**
 * Per-route metadata. Each entry rewrites the SHELL — not the React app.
 * h1/subhead populate the <noscript> static hero. title/desc/og populate
 * the head. Keep titles under 60 chars + descriptions 140-160 chars for
 * Google snippet width.
 */
const ROUTES = [
  {
    path: "/pricing",
    title: "Pricing — three lanes, zero theater · TrainYourAgent",
    desc: "AI receptionist pricing: Self-Serve $99/mo, Operators $4,950 + $1,997/mo (most popular), Scale $9,950 + $4,997/mo. ROI calculator. Refund if not shipped.",
    h1: "Three lanes. Zero theater.",
    italic: "Pick yours.",
    sub: "Self-Serve $99/mo for chat-only. Operators $4,950 build + $1,997/mo for the full voice + chat agent we run. Scale $9,950 + $4,997/mo for multi-location. ROI calculator computes your dollar-recovered live.",
  },
  {
    path: "/architecture",
    title: "Architecture — how the AI receptionist actually runs · TrainYourAgent",
    desc: "Production stack: multi-LLM fallback (Anthropic → Groq → Gemini → OpenAI), p50/p95 latency targets, eval harness, observability, security posture, escape hatches. No marketing.",
    h1: "How it actually runs in production.",
    italic: "No marketing.",
    sub: "Multi-provider fallback chain so the line is never silent. p50/p95 latency targets we actually hit. Eval suite. Observability. Security posture. The doc a Principal Engineer would write after a diligence call.",
  },
  {
    path: "/apply",
    title: "Apply for the AI receptionist build · TrainYourAgent",
    desc: "Apply for the AI receptionist build. Live in 7 days for Founders lane, 10-14 days for Operators. Refund if we slip past day 14 on Operators. No contracts.",
    h1: "Apply for the build.",
    italic: "Live in 7-14 days.",
    sub: "Tell us your business, your call volume, and your CRM. We build the voice + chat agent end-to-end and ship inside two weeks. Refund the build fee if we slip past day 14.",
  },
  {
    path: "/customers",
    title: "Founding Customer Program — 50% off forever · TrainYourAgent",
    desc: "First 10 founding customers get 50% off Operators tier ($997/mo) for life, direct founder Slack, co-authored case study, 90-day money-back guarantee. Service businesses only.",
    h1: "Be one of our first ten.",
    italic: "Pay half-price forever.",
    sub: "We're picking 10 service-business operators to be the founding cohort. You get the same agent we'd ship anyone, plus permanent founding pricing, direct founder Slack, weekly co-build sessions, and 90-day MBG.",
  },
  {
    path: "/integrations",
    title: "AI receptionist integrations — 80+ across 14 categories · TrainYourAgent",
    desc: "Cal.com, ServiceTitan, GHL, HubSpot, Twilio, Stripe, Salesforce, Zapier, Make, Slack — 80+ integrations across CRM, telephony, booking, payment, comms, marketing. Production-ready.",
    h1: "Integrations that already work.",
    italic: "Not a roadmap.",
    sub: "Cal, ServiceTitan, GHL, HubSpot, Twilio, Stripe, Salesforce, Zapier, Make, Slack — 80+ across CRM, telephony, booking, payment, comms, marketing, healthcare, logistics. Production / Beta / Coming-soon badged.",
  },
  {
    path: "/reviews/submit",
    title: "Submit testimonial — $200 Stripe credit · TrainYourAgent",
    desc: "Share your TrainYourAgent results. 30-second Loom or written quote. We publish on /customers + your industry template page. $200 Stripe credit + backlink + LinkedIn tag.",
    h1: "Tell the next operator what the agent did for your shop.",
    italic: "Get $200 back.",
    sub: "Your call volume, your numbers, your before/after. We publish on the customers page plus your industry's template page. You get a $200 Stripe credit on the next invoice plus a backlink to your business.",
  },
  {
    path: "/websites",
    title: "Industry-ready AI receptionist sites · TrainYourAgent",
    desc: "Industry-ready site previews for 25 verticals — HVAC, dental, salon, real estate, gym, hotels, more. Drop your business name, see the site in 5 seconds. Yours to keep.",
    h1: "See your business as an AI-powered website.",
    italic: "In 5 seconds.",
    sub: "Pick your industry. Drop your business name. Watch the AI receptionist plus full site appear with your brand on it. 25 industries pre-built. No signup. Free preview.",
  },
  {
    path: "/about",
    title: "About — founder-led AI receptionist agency · TrainYourAgent",
    desc: "Founder-led AI receptionist agency in Tampa Bay. Alexander Mills, 4+ years deep in AI. Building the platform we wish every SMB had — voice + chat agents that actually run the business.",
    h1: "Founder-led from Tampa Bay.",
    italic: "Four years deep in AI.",
    sub: "Alexander Mills built TrainYourAgent because every SMB phone line is a $22K/month leak waiting to be plugged. The agency runs lean, ships fast, and refunds the build fee if it slips.",
  },
  {
    path: "/proof",
    title: "Proof — real GitHub velocity + product demos · TrainYourAgent",
    desc: "Public GitHub commit history, live product demos, real shipping cadence. No fake testimonials, no stock logos. The proof a buyer would actually verify.",
    h1: "The proof a buyer would actually check.",
    italic: "Receipts only.",
    sub: "Public GitHub commit velocity. Live voice + chat demos that work in your browser. Real shipping cadence. The receipts most agency sites hide behind 'enterprise privacy.'",
  },
];

// All 25 niche template routes share a structure — generate them programmatically.
const NICHES = [
  { id: "cleaning",         label: "Cleaning Service" },
  { id: "laundromat",       label: "Laundromat / Wash & Fold" },
  { id: "hvac",             label: "HVAC" },
  { id: "dental",           label: "Dental Practice" },
  { id: "salon",            label: "Salon & Spa" },
  { id: "auto",             label: "Auto Repair" },
  { id: "landscaping",      label: "Landscaping & Lawn" },
  { id: "plumbing",         label: "Plumbing" },
  { id: "restaurant",       label: "Restaurant" },
  { id: "fitness",          label: "Gym & Fitness Studio" },
  { id: "real-estate",      label: "Real Estate" },
  { id: "law-firm",         label: "Law Firm" },
  { id: "roofing",          label: "Roofing" },
  { id: "med-spa",          label: "Med Spa" },
  { id: "chiropractor",     label: "Chiropractor" },
  { id: "pest-control",     label: "Pest Control" },
  { id: "electrician",      label: "Electrician" },
  { id: "moving",           label: "Moving Company" },
  { id: "veterinary",       label: "Veterinary" },
  { id: "insurance",        label: "Insurance Agency" },
  { id: "mortgage",         label: "Mortgage Broker" },
  { id: "accounting",       label: "Accounting / CPA" },
  { id: "catering",         label: "Catering" },
  { id: "barbershop",       label: "Barbershop" },
  { id: "physical-therapy", label: "Physical Therapy" },
];

for (const n of NICHES) {
  ROUTES.push({
    path: `/template/${n.id}`,
    title: `${n.label} AI receptionist demo — see it with your brand · TrainYourAgent`,
    desc: `Live AI receptionist demo for ${n.label.toLowerCase()} businesses. Drop your business name, hear the voice agent answer, see the full site appear with your brand. Live in 7 days.`,
    h1: `An AI receptionist for ${n.label.toLowerCase()}.`,
    italic: "See it with your brand.",
    sub: `Hear the voice agent answer a real ${n.label.toLowerCase()} call. Watch the full booking site appear with your business name on it. We build it live in 7 days. Refund if we slip.`,
  });
}

// v263: vertical SEO landing pages — these existed before /template/* and
// rank for the broader "AI receptionist for X" queries. Each gets its own
// crawler-readable shell now too.
const VERTICALS = [
  { slug: "hvac",            label: "HVAC",                 niche: "HVAC contractors" },
  { slug: "dental",          label: "Dental",               niche: "dental practices" },
  { slug: "salon",           label: "Salon",                niche: "salons and barbershops" },
  { slug: "real-estate",     label: "Real Estate",          niche: "real estate brokerages" },
  { slug: "gym",             label: "Gym & Fitness",        niche: "gyms and fitness studios" },
  { slug: "roofing",         label: "Roofing",              niche: "roofing contractors" },
  { slug: "solar",           label: "Solar",                niche: "solar installers" },
  { slug: "accounting",      label: "Accounting",           niche: "accounting and CPA firms" },
  { slug: "automotive",      label: "Automotive",           niche: "auto repair shops" },
  { slug: "spas",            label: "Spas",                 niche: "spas and wellness centers" },
  { slug: "hotels",          label: "Hotels",               niche: "boutique hotels" },
  { slug: "bars-nightclubs", label: "Bars & Nightclubs",    niche: "bars and nightclubs" },
  { slug: "logistics",       label: "Logistics",            niche: "logistics and freight" },
  { slug: "legal",           label: "Legal",                niche: "law firms and legal services" },
  { slug: "healthcare",      label: "Healthcare",           niche: "healthcare practices" },
];
for (const v of VERTICALS) {
  ROUTES.push({
    path: `/${v.slug}`,
    title: `AI Receptionist for ${v.label} — Answers Calls, Books Jobs · TrainYourAgent`,
    desc: `Custom AI receptionist for ${v.niche}. Answers calls 24/7, qualifies leads, books appointments, integrates with the tools you already use. Live in 7 days. Refund if we slip.`,
    h1: `An AI receptionist built for ${v.label.toLowerCase()}.`,
    italic: "Live in 7 days.",
    sub: `We build the voice + chat agent end-to-end for ${v.niche} — your scripts, your CRM, your booking flow. Multi-LLM fallback so the line is never silent. Refund if we don't ship.`,
  });
}

// Strategic non-page routes
ROUTES.push({
  path: "/blog",
  title: "Blog — AI receptionist playbooks for SMBs · TrainYourAgent",
  desc: "Real playbooks from the field: how HVAC shops, dental offices, salons, and other service SMBs deploy AI receptionists, what works, what doesn't, and the numbers behind it.",
  h1: "Field reports from operators running the agent.",
  italic: "No hot takes.",
  sub: "Long-form playbooks from real customers: HVAC dispatch, dental scheduling, salon balayage bookings, the ops mistakes that cost $22K/mo, and how to fix them.",
});

ROUTES.push({
  path: "/changelog",
  title: "Changelog — every ship since launch · TrainYourAgent",
  desc: "Every meaningful ship in the TrainYourAgent platform since launch. Customer-facing changes, infrastructure upgrades, agent improvements, integration adds. Updated weekly.",
  h1: "Every ship, in public.",
  italic: "Weekly cadence.",
  sub: "Customer-facing changes, infrastructure upgrades, agent improvements, integration adds. Updated weekly. The receipt that the platform is actually moving.",
});

ROUTES.push({
  path: "/contact",
  title: "Contact — talk to the founder · TrainYourAgent",
  desc: "Talk to Alexander Mills directly. AI receptionist questions, build kickoffs, partnership inquiries, press. No SDR layer, no AE handoff, no scheduling-link-of-doom.",
  h1: "Talk to the founder.",
  italic: "Directly.",
  sub: "AI receptionist questions, build kickoffs, partnership inquiries, press. Alexander reads every inbound message. No SDR layer, no AE handoff, no scheduling-link-of-doom.",
});

ROUTES.push({
  path: "/security",
  title: "Security posture — what we lock down · TrainYourAgent",
  desc: "Honest security and compliance posture: what's locked down today, what isn't, where customer data lives, who has access, and how we'd respond to a breach. No SOC 2 theater.",
  h1: "What we lock down.",
  italic: "And what we don't.",
  sub: "Honest security posture: locked-down items, current gaps, where data lives, who has access, breach response. No SOC 2 theater — the real picture an enterprise diligence call would surface.",
});

ROUTES.push({
  path: "/legal/privacy",
  title: "Privacy Policy — TrainYourAgent",
  desc: "Privacy policy for TrainYourAgent. What we collect, why, where it lives, retention, your rights, GDPR/CCPA notices. Dated and version-controlled.",
  h1: "Privacy policy.",
  italic: "Plain language.",
  sub: "What we collect, why, where it lives, how long we keep it, your rights, GDPR and CCPA notices. Last updated 2026-05-29 — every revision tracked in git.",
});

ROUTES.push({
  path: "/legal/terms",
  title: "Terms of Service — TrainYourAgent",
  desc: "Terms of service for TrainYourAgent — the agreement governing your use of the platform, voice + chat agents, integrations, and the build engagement.",
  h1: "Terms of service.",
  italic: "Plain language.",
  sub: "The agreement governing your use of TrainYourAgent. Plain language. Last updated 2026-05-29. Every revision tracked in git.",
});

// ── helpers ────────────────────────────────────────────────────────────────
function htmlEscape(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function rewriteShell(template, route) {
  const url = `https://www.trainyouragent.com${route.path}`;
  const t = htmlEscape(route.title);
  const d = htmlEscape(route.desc);
  const h1 = htmlEscape(route.h1);
  const italic = htmlEscape(route.italic);
  const sub = htmlEscape(route.sub);

  // v265: per-route JSON-LD WebPage schema. Google parses this for
  // rich-snippet eligibility per route (breadcrumbs, headline, description).
  // Wired alongside the sitewide Organization + WebSite graph that lives in
  // the base index.html.
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    "url": url,
    "name": route.title,
    "description": route.desc,
    "isPartOf": { "@id": "https://trainyouragent.com/#website" },
    "about": { "@id": "https://trainyouragent.com/#org" },
    "primaryImageOfPage": "https://trainyouragent.com/og-default.png",
    "inLanguage": "en-US",
    "potentialAction": {
      "@type": "ReadAction",
      "target": [url],
    },
  };
  const pageJsonLdScript = `<script type="application/ld+json">${JSON.stringify(pageJsonLd)}</script>`;

  let out = template;

  // <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`);

  // <meta name="description">
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${d}" />`,
  );

  // canonical
  out = out.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`,
  );

  // og:title, og:description, og:url
  out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${t}" />`);
  out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${d}" />`);
  out = out.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`);

  // twitter:title, twitter:description
  out = out.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${t}" />`);
  out = out.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${d}" />`);

  // Replace noscript hero h1 + subhead + eyebrow. We replace the specific
  // strings the v259 shell uses so the per-route file shows per-route copy.
  out = out.replace(
    /An AI receptionist that books the job before <span class="italic">your competitor calls back\.<\/span>/,
    `${h1} <span class="italic">${italic}</span>`,
  );
  out = out.replace(
    /Answers calls 24\/7\. Qualifies leads\. Books appointments\. Stops the \$22K\/month leak from missed calls\. Live in 7 days\. If we don't ship on time, we refund the build fee — no quibbling\./,
    sub,
  );

  // v265: inject per-route JSON-LD just before </head>. The sitewide
  // Organization + WebSite graph stays in the base template too.
  out = out.replace("</head>", `    ${pageJsonLdScript}\n  </head>`);

  // v266 (Grok re-audit killer #1 fix): Grok's web tool treats <noscript>
  // as "static fallback" and reports the page as near-empty. The fix is
  // putting real positioning content INSIDE the React mount div so crawlers
  // see it as primary DOM, not fallback. React hydrates over this on mount
  // because react-dom 18 honors the existing children of #root.
  //
  // We render a styled-inline shell with the same h1/subhead/CTAs/bullets
  // as the noscript hero. Inline styles avoid the FOUC during hydration.
  // The shell uses aria-hidden="true" only AFTER hydration — at parse time
  // it's the real content the crawler indexes.
  const rootShell = `<div id="prerender-shell" style="padding:64px 24px;max-width:880px;margin:0 auto;font-family:'Inter Tight',system-ui,sans-serif;color:#0B1B2B;background:linear-gradient(180deg,#FAF6EE 0%,#F4EFE4 100%);min-height:100vh"><div style="font-family:ui-monospace,Menlo,monospace;letter-spacing:0.18em;font-size:11px;font-weight:700;color:#C99A28;text-transform:uppercase;margin-bottom:14px">AI RECEPTIONIST · BUILT FOR SERVICE SMBs</div><h1 style="font-size:clamp(36px,6vw,64px);line-height:1.05;letter-spacing:-0.02em;font-weight:600;color:#042C53;margin:0 0 18px">${h1} <span style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:500">${italic}</span></h1><p style="font-size:18px;line-height:1.55;color:#5C6B7F;margin:0 0 28px;max-width:640px">${sub}</p><div style="display:flex;flex-wrap:wrap;gap:12px"><a href="/apply" style="padding:14px 22px;border-radius:999px;background:#042C53;color:#fff;text-decoration:none;font-weight:700">Book a discovery call →</a><a href="/pricing" style="padding:14px 22px;border-radius:999px;background:transparent;color:#042C53;text-decoration:none;font-weight:700;border:1.5px solid #042C53">See the three lanes →</a></div><ul style="margin:32px 0 0;padding:0;list-style:none;display:grid;gap:10px;font-size:15px"><li><span style="color:#C99A28;font-weight:800">+ </span>Voice + chat agent, your brand voice, your scripts</li><li><span style="color:#C99A28;font-weight:800">+ </span>Plugs into Cal.com / ServiceTitan / GHL / HubSpot</li><li><span style="color:#C99A28;font-weight:800">+ </span>HVAC, dental, salon, real estate, gym, hotels, more</li><li><span style="color:#C99A28;font-weight:800">+ </span>Multi-LLM fallback so the line never goes silent</li><li><span style="color:#C99A28;font-weight:800">+ </span>Founder-led from Tampa Bay · no offshore SDR sweatshop</li></ul></div>`;
  out = out.replace('<div id="root"></div>', `<div id="root">${rootShell}</div>`);

  return out;
}

// ── main ───────────────────────────────────────────────────────────────────
async function main() {
  if (!existsSync(TEMPLATE_PATH)) {
    console.error(`[prerender] dist/index.html not found at ${TEMPLATE_PATH} — run vite build first`);
    process.exit(1);
  }

  const template = await readFile(TEMPLATE_PATH, "utf8");
  let count = 0;

  for (const route of ROUTES) {
    const outDir = resolve(DIST, route.path.replace(/^\//, ""));
    await mkdir(outDir, { recursive: true });
    const outPath = resolve(outDir, "index.html");
    await writeFile(outPath, rewriteShell(template, route), "utf8");
    count++;
  }

  // v266: also rewrite the HOMEPAGE shell (dist/index.html) so the / route
  // gets the receptionist-specific h1/subhead/CTAs inside #root, not just
  // in noscript. Without this, crawlers hitting / still see an empty React
  // mount and report 'near-empty HTML' (which is exactly what Grok flagged).
  const homepageRoute = {
    path: "/",
    title: "AI Receptionist for HVAC, Dental, Salon — Answers Calls, Books Jobs · TrainYourAgent",
    desc: "An AI receptionist that answers calls 24/7, qualifies leads, books appointments, and stops the $22K/mo leak from missed calls. Built for HVAC, dental, salon, and service SMBs. Live in 7 days. Refund if not shipped.",
    h1: "An AI receptionist that books the job before",
    italic: "your competitor calls back.",
    sub: "Answers calls 24/7. Qualifies leads. Books appointments. Stops the $22K/month leak from missed calls. Live in 7 days. If we don't ship on time, we refund the build fee — no quibbling.",
  };
  await writeFile(TEMPLATE_PATH, rewriteShell(template, homepageRoute), "utf8");
  count++;

  console.log(`[prerender] wrote ${count} per-route index.html files under dist/ (incl. homepage)`);
}

main().catch((e) => {
  console.error("[prerender] failed:", e);
  process.exit(1);
});
