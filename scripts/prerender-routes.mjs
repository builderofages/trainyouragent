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

  console.log(`[prerender] wrote ${count} per-route index.html files under dist/`);
}

main().catch((e) => {
  console.error("[prerender] failed:", e);
  process.exit(1);
});
