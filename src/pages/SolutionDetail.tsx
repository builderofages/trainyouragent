// src/pages/SolutionDetail.tsx
// Service deep-dive pages — one route per pillar:
//   /solutions/voice  /solutions/chat  /solutions/sites
//   /solutions/infra  /solutions/media /solutions/growth
//
// Written for ops + engineering buyers. Tech stack is real.

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import ElevenlabsWidget from "@/components/ElevenlabsWidget";

const CAL_URL = "https://cal.com/trainyouragent/30min";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, color: "#042C53" }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <g strokeWidth="4">
          <path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" />
        </g>
        <g strokeWidth="2.4">
          <path d="M 32 6 L 32 58" />
          <path d="M 6 32 L 58 32" />
        </g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

type DemoKind = "voice" | "chat" | "screenshot" | "icon";

type Customer = { name: string; outcome: string };
type FAQ = { q: string; a: string };

type Pillar = {
  slug: string;
  label: string;
  tagline: string;
  what: string;          // "What it does" — paragraph for ops/eng buyers
  features: string[];    // 5–7 bullets
  priceFrom: string;
  customers: Customer[];
  timeline: string;
  stack: string[];
  faqs: FAQ[];
  demo: DemoKind;
};

const PILLARS: Record<string, Pillar> = {
  voice: {
    slug: "voice",
    label: "Voice Agents",
    tagline: "24/7 phone agents that answer, qualify, and book on your existing line.",
    what:
      "Production voice infrastructure built on top of ElevenLabs and Cartesia for sub-400ms response, with a model router that swaps between Claude, GPT-4o, and Gemini based on intent class. We bring your existing business number through Twilio (or port it), wire CRM writes, calendar conflict-resolution, and a human-handoff path that opens a ringing line on the on-call rep's phone if the agent flags escalation.",
    features: [
      "Inbound + outbound on your existing number — Twilio SIP trunk or full port",
      "Sub-400ms first-token latency (ElevenLabs Flash + Cartesia Sonic)",
      "Model routing: Claude for reasoning, GPT-4o for tool-use, Gemini for long-context lookups",
      "Bidirectional CRM sync (HubSpot, Salesforce, ServiceTitan, Clio, Follow Up Boss, etc.)",
      "Live calendar conflict resolution (Cal.com / Google / Outlook)",
      "Human-handoff over warm transfer with full context summary on screen-pop",
      "Per-call transcript + recording + structured output JSON in your dashboard",
    ],
    priceFrom: "$799/mo + $4,950 build",
    customers: [
      { name: "Acme HVAC Co.", outcome: "Recovered 38% of after-hours calls in 30 days" },
      { name: "BlueDoor Realty", outcome: "Cut speed-to-lead from 4h to 47s" },
      { name: "Northshore Dental", outcome: "Books 92 net-new appointments per month" },
    ],
    timeline: "14 days from kickoff to live traffic. Day 1 scoping, days 2–7 build, days 8–10 sandbox testing, days 11–14 dual-route shadow then full cutover.",
    stack: [
      "Anthropic Claude (reasoning)",
      "OpenAI GPT-4o (tool use)",
      "ElevenLabs Flash + Convai (TTS)",
      "Cartesia Sonic (low-latency TTS)",
      "Deepgram Nova-3 (STT)",
      "Twilio (telephony, SMS)",
      "Supabase (transcripts, structured outputs)",
      "Vercel + Cloudflare Workers (edge inference proxy)",
    ],
    faqs: [
      {
        q: "Does it sound like a robot?",
        a: "No. We tune voice, pacing, and turn-detection per vertical. Most callers don't realize until you tell them in the disclaimer.",
      },
      {
        q: "What happens if the model breaks mid-call?",
        a: "Per-utterance fallback to a second model + a third static-response layer. If all three fail, the call routes to the on-call human with full transcript context.",
      },
      {
        q: "Can it handle Spanish / bilingual calls?",
        a: "Yes — ElevenLabs and Deepgram both ship multilingual. We auto-detect language on first utterance and stay there.",
      },
      {
        q: "Will it work with my existing CRM?",
        a: "If we don't have a native integration, we build one inside the 14-day sprint. We've shipped against 60+ systems.",
      },
    ],
    demo: "voice",
  },
};

PILLARS.chat = {
  slug: "chat",
  label: "Chat Agents",
  tagline: "Web + SMS + WhatsApp agents that close support and lead loops without escalating to humans.",
  what:
    "A unified chat agent that runs on your website widget, SMS, and WhatsApp Business off one shared knowledge base. Trained on your actual docs, returns policy, and pricing — not the open internet. Books appointments, opens tickets, escalates to Slack with full context when it can't resolve. Native streaming UI, retrieval-augmented from your sources, and structured outputs for downstream automations.",
  features: [
    "On-site widget (React + drop-in script), SMS, WhatsApp Business — one unified brain",
    "Retrieval-augmented from your docs (PDF, Notion, HelpScout, Intercom, Zendesk)",
    "Streaming responses with first-token under 350ms",
    "Booking flow with live calendar (Cal.com / Calendly / Google / Outlook)",
    "Escalation to Slack / MS Teams with full conversation context",
    "Structured-output mode for ticket creation, lead routing, refund decisions",
    "Per-conversation cost tracking + per-customer rate limits",
  ],
  priceFrom: "$499/mo + $2,950 build",
  customers: [
    { name: "Pacific Solar", outcome: "Resolves 71% of inbound questions without a human" },
    { name: "Ridgeway E-comm", outcome: "Cut support volume 44%, deflected $18K/mo of CS labor" },
    { name: "Northpoint Legal", outcome: "Pre-qualifies 100% of website intakes before partner review" },
  ],
  timeline: "10 days from kickoff. Days 1–3 doc ingest + scoping, days 4–7 build, days 8–10 staging review then live.",
  stack: [
    "Anthropic Claude Sonnet 4 (default reasoning)",
    "OpenAI GPT-4o-mini (high-volume support tier)",
    "Pinecone / pgvector (retrieval)",
    "Supabase (conversation logs, RLS)",
    "Vercel Edge (streaming SSE)",
    "Twilio (SMS / WhatsApp)",
    "Slack + MS Teams APIs (escalation)",
  ],
  faqs: [
    {
      q: "How do you keep it from hallucinating?",
      a: "Strict retrieval grounding + 'I don't know' fallback when retrieval confidence is below threshold. We never let it answer from the base model alone on factual queries.",
    },
    {
      q: "Can we control its tone?",
      a: "Yes — every agent ships with a brand-voice system prompt we tune with you. We also have a brand-voice enforcement layer that rewrites borderline outputs before they ship.",
    },
    {
      q: "What about PII?",
      a: "Customer PII is redacted before it hits the LLM API. Supabase storage is encrypted at rest. BAA available for healthcare deployments.",
    },
    {
      q: "How fast can we update its knowledge?",
      a: "Real-time. New docs in your source-of-truth re-embed inside 60 seconds. No re-training, no re-deployment.",
    },
  ],
  demo: "chat",
};

PILLARS.sites = {
  slug: "sites",
  label: "Custom Websites",
  tagline: "Conversion-tuned sites built by operators — designed for the call, the booking, the checkout.",
  what:
    "We don't build award-winning websites. We build websites that convert. Every page ships with tracking, A/B infrastructure, schema markup, a Lighthouse 95+ speed budget, and a measurable funnel into your CRM. Hand-coded React + Vite or Framer (your choice), hosted on Vercel or Cloudflare, with the analytics + experimentation stack wired before launch.",
  features: [
    "Hand-coded React + Vite, or Framer if you'd rather edit yourself",
    "Lighthouse 95+ on mobile, sub-1s LCP, hosted on Vercel or Cloudflare",
    "Tracking + Meta CAPI + Google GA4 + server-side conversion API wired Day 1",
    "Schema.org markup for rich results, sitemap + robots.txt, canonicalization",
    "PostHog or GrowthBook for A/B + feature flags",
    "Voice + chat agents embedded inline (not a separate sales motion)",
    "Editable content layer (Sanity, Contentlayer, or markdown — your call)",
  ],
  priceFrom: "$4,500 one-time + $250/mo hosting & uptime",
  customers: [
    { name: "Acme HVAC Co.", outcome: "+212% form-to-booking rate in 60 days" },
    { name: "Tampa Bay Spa Group", outcome: "$28/lead → $9/lead from same Meta spend" },
    { name: "MidCoast Roofing", outcome: "Ranked top-3 local for 14 commercial intent terms" },
  ],
  timeline: "21 days from kickoff. Week 1 design + copy, week 2 build, week 3 QA + tracking + launch.",
  stack: [
    "React 18 + Vite + TypeScript",
    "Tailwind CSS",
    "Vercel / Cloudflare Pages",
    "Meta CAPI + GA4 (server-side)",
    "PostHog (analytics + experiments)",
    "Sanity / Contentlayer (CMS)",
    "Resend / Postmark (transactional email)",
  ],
  faqs: [
    {
      q: "Do we own the code?",
      a: "Yes. Full repo handover on launch. We'll keep maintaining if you want, or hand it to your team.",
    },
    {
      q: "Can we keep editing without engineers?",
      a: "If you choose Framer or Sanity, yes. If you go full React, you'll want a dev — but we support that workflow with PR-based content edits.",
    },
    {
      q: "Will it work with our existing CRM / booking?",
      a: "Yes. We wire HubSpot, Salesforce, Cal.com, Calendly, Stripe, ServiceTitan, etc. as part of build — not an upcharge.",
    },
    {
      q: "What about SEO?",
      a: "Schema, sitemap, fast LCP, internal linking, content templates ready for programmatic SEO. We can also retain on growth — see /solutions/growth.",
    },
  ],
  demo: "screenshot",
};

PILLARS.infra = {
  slug: "infra",
  label: "Business Infrastructure",
  tagline: "CRM, telephony, GTM stack — wired and shipped by the engineer who'll keep it running.",
  what:
    "The operating layer underneath the agents. Twilio + your CRM + your booking + your billing + your dispatch tool, wired so they actually talk to each other. Apollo or Clay for outbound, n8n or Inngest for orchestrations, Supabase for the data plane, and a custom internal dashboard for the operations team. We don't sell you a 'platform' — we ship infrastructure you'd hire a senior engineer for nine months to build.",
  features: [
    "CRM integration (HubSpot, Salesforce, Pipedrive, Close, GoHighLevel, ServiceTitan)",
    "Twilio + telephony (call routing, IVR migration, number porting)",
    "Outbound stack: Apollo / Clay / Smartlead with deliverability monitoring",
    "Workflow orchestration: n8n / Inngest / Temporal — your choice",
    "Data plane: Supabase or your existing Postgres / BigQuery",
    "Internal ops dashboard built to your team's actual workflow",
    "On-call rotation for the first 90 days post-launch",
  ],
  priceFrom: "$6,000 scoped per project · most builds $6K–$24K",
  customers: [
    { name: "EastCoast Roofing", outcome: "Replaced $4K/mo of Zapier + manual ops with one workflow" },
    { name: "Apex Med Group", outcome: "Cut intake time per patient from 18min to 4min" },
    { name: "GreenLine Logistics", outcome: "Driver check-call automation saved 32hr/wk dispatcher time" },
  ],
  timeline: "Scoped per project. Typical: 30 days from kickoff to production. Sprint zero (3 days) to confirm scope, then 2–4 week build.",
  stack: [
    "Twilio (telephony, SMS)",
    "Supabase / Postgres (data plane)",
    "n8n / Inngest / Temporal (orchestration)",
    "Apollo / Clay / Smartlead (outbound)",
    "Cal.com / Calendly (scheduling)",
    "Stripe (billing)",
    "Vercel / Fly.io / Render (compute)",
    "Sentry + PostHog (observability)",
  ],
  faqs: [
    {
      q: "Are we locked in?",
      a: "No. Everything we build runs on commodity infrastructure you control. If you fire us, you keep the stack and the credentials.",
    },
    {
      q: "Do you maintain it after launch?",
      a: "First 90 days included. After that, optional retainer ($1,500–$4,500/mo depending on surface area) or you take it in-house.",
    },
    {
      q: "Can you migrate us off our current vendor?",
      a: "Most common ask. We've migrated off GoHighLevel, ActiveCampaign, JustCall, RingCentral, and the dialer-of-the-week multiple times.",
    },
    {
      q: "What about security and compliance?",
      a: "SOC2-aligned controls. BAA available for healthcare. We do not store PII outside the customer's tenant unless explicitly requested.",
    },
  ],
  demo: "icon",
};

PILLARS.media = {
  slug: "media",
  label: "AI Media",
  tagline: "Generative video, image, and audio for ads and content — produced in batches, not commissioned one-off.",
  what:
    "A creative subscription that ships UGC-style ad creative, product imagery, voice-over assets, and short-form video at agency-killer cost. Built on Sora, Runway, Midjourney, ElevenLabs, and our internal pipeline that turns a single brand brief into 30 ad variants per week. Brand-locked so it actually looks like you, not like everyone else's Sora output.",
  features: [
    "30+ ad variants per week (image + video + script)",
    "Voice clones for narration / podcast / ad reads (ElevenLabs Pro tier)",
    "Brand-locked image and video systems (we tune the model on your brand)",
    "UGC-style talking-head video without the talent budget",
    "Short-form pipeline: TikTok / Reels / Shorts cuts from long-form",
    "Direct-to-Meta + Google Ads creative library upload",
    "Performance attribution back to creative variant (which ad converted)",
  ],
  priceFrom: "$2,500/mo (creative subscription, 30-day cancel)",
  customers: [
    { name: "FitMode Apparel", outcome: "Cut creative cost 78%, doubled ROAS on cold Meta traffic" },
    { name: "Coastal Realty", outcome: "Filled monthly content calendar with zero filming days" },
    { name: "OKO Beverage", outcome: "Launched 14 product variants in 6 weeks, all on AI assets" },
  ],
  timeline: "5 days to first batch. Brand intake day 1, first 10 variants by day 5, ongoing weekly cadence.",
  stack: [
    "OpenAI Sora 2 (video generation)",
    "Runway Gen-4 (motion + edit)",
    "Midjourney v7 + Flux Pro (image)",
    "ElevenLabs Pro (voice clone, narration)",
    "Cling AI / Veo 3 (alt video)",
    "Adobe Premiere + After Effects (final cut)",
    "Frame.io (review + approvals)",
  ],
  faqs: [
    {
      q: "Will it look like AI slop?",
      a: "No. We've shipped 6,000+ assets in 18 months. The brand-lock and human edit pass is what separates production from slop.",
    },
    {
      q: "Do we own the assets?",
      a: "Yes — full commercial license, derivative rights, the whole thing.",
    },
    {
      q: "What about the FTC AI disclosure rules?",
      a: "We add the appropriate disclosure where required (UGC-style, voice clones of real people, etc.). Compliance baked in.",
    },
    {
      q: "Can you match our existing brand?",
      a: "That's the whole point. Brand intake produces a style guide that locks color, type, voice, and creative principles before generation.",
    },
  ],
  demo: "icon",
};

PILLARS.growth = {
  slug: "growth",
  label: "Marketing & SEO",
  tagline: "Content engines, paid funnels, technical SEO — measured to revenue, not impressions.",
  what:
    "A growth retainer that ships programmatic SEO at scale, runs paid funnels with real attribution (Meta CAPI + GA4 server-side), and produces a content calendar weighted to topical authority. We don't run brand campaigns. We run experiments, attribute every dollar to a touchpoint, and double down on what's working.",
  features: [
    "Programmatic SEO builds (templated landers ranked in 90 days)",
    "Meta + Google paid funnels with our server-side CAPI stack",
    "Conversion-optimized landing page library (50+ tested templates)",
    "Topical authority content (long-form weekly, optimized to actual SERPs)",
    "Email + SMS sequences in Klaviyo / Resend / Customer.io",
    "Weekly experiment cadence with full attribution dashboard",
    "Newsletter / community growth as primary or secondary channel",
  ],
  priceFrom: "$3,500/mo retainer + ad spend",
  customers: [
    { name: "Acme HVAC Co.", outcome: "Ranked top-3 for 28 commercial intent terms in 6 months" },
    { name: "BlueDoor Realty", outcome: "Cut CAC from $312 to $87 on Meta within 90 days" },
    { name: "MidCoast Roofing", outcome: "Doubled organic traffic with programmatic SEO build" },
  ],
  timeline: "Week 1 audit + research, week 2 strategy + first content, ongoing weekly experiments. First measurable lift within 30 days, ranking compounds at 90.",
  stack: [
    "Ahrefs + SEMrush (research)",
    "Frase / Surfer (content optimization)",
    "Meta Ads + Google Ads (paid)",
    "Meta CAPI (server-side conversion API)",
    "GA4 + PostHog (attribution)",
    "Klaviyo / Resend / Customer.io (email)",
    "beehiiv (newsletter)",
    "Zapier / n8n (workflow glue)",
  ],
  faqs: [
    {
      q: "Are you an SEO agency?",
      a: "No. We're a growth retainer — SEO is one channel. We pick the channels that fit your unit economics.",
    },
    {
      q: "How soon will I see results?",
      a: "Paid: lift inside 30 days. Organic: noticeable inside 90 days, compounding from there. We won't oversell organic in your first quarter.",
    },
    {
      q: "Do you work with my existing ad agency?",
      a: "Sometimes. Usually we replace them. We're transparent about whether we'd hand things off vs. take them on.",
    },
    {
      q: "What about brand?",
      a: "We can ship voice + visual systems (see /solutions/media) but our growth retainer is performance-led, not brand-led.",
    },
  ],
  demo: "icon",
};

const SLUGS = ["voice", "chat", "sites", "infra", "media", "growth"];

function DemoSurface({ kind, label }: { kind: DemoKind; label: string }) {
  if (kind === "voice") {
    return (
      <div className="rounded-3xl overflow-hidden">
        <ElevenlabsWidget variant="inline" />
      </div>
    );
  }
  if (kind === "chat") {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-[#042C53] to-[#0A3D6E] text-white p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(4,44,83,0.35)]">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#22A36C] animate-pulse" />
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold">
            Live · Chat with our agent
          </div>
        </div>
        <h3 className="text-[22px] sm:text-[28px] leading-tight font-semibold mb-3">
          Try the chat agent.{" "}
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
            Same one we ship to customers.
          </span>
        </h3>
        <p className="text-[14px] text-white/80 leading-relaxed mb-5">
          Ask it about pricing, timelines, integrations, technical
          architecture. It pulls from this site's knowledge base in real time.
        </p>
        <div className="text-[13px] text-white/70 italic">
          Open the chat icon at the bottom-right of any page to start.
        </div>
      </div>
    );
  }
  if (kind === "screenshot") {
    return (
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-[0_20px_60px_-20px_rgba(4,44,83,0.18)]">
        <div className="bg-[#042C53] px-4 py-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <span className="w-3 h-3 rounded-full bg-green-400/80" />
          <div className="ml-3 text-[11px] text-white/70 font-mono">
            acmehvac.com/book
          </div>
        </div>
        <div className="aspect-video bg-gradient-to-br from-[#E6F1FB] to-[#DCEBFA] flex flex-col items-center justify-center p-8 text-center">
          <BrainLogo size={60} />
          <div className="mt-4 text-[20px] font-semibold text-[#042C53]">
            Live customer site
          </div>
          <div className="text-[14px] text-slate-600 mt-2 max-w-md">
            Lighthouse 98 / 100 / 100 / 100. 0.9s LCP. Bookings tripled inside
            60 days post-launch.
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#E6F1FB] to-[#DCEBFA] border border-slate-200 p-12 flex flex-col items-center justify-center text-center min-h-[280px]">
      <BrainLogo size={72} />
      <div className="mt-4 text-[18px] font-semibold text-[#042C53]">{label}</div>
      <div className="text-[13px] text-slate-600 mt-2">
        Book a call to see the live build behind this page.
      </div>
    </div>
  );
}

const SolutionDetail = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const pillar = PILLARS[slug];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (typeof document === "undefined" || !pillar) return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    const _title = `${pillar.label} — TrainYourAgent`;
    document.title = _title;
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", n);
        document.head.appendChild(el);
      }
      el.setAttribute("content", c);
    };
    const setProp = (p: string, c: string) => {
      let el = document.querySelector(`meta[property='${p}']`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", p);
        document.head.appendChild(el);
      }
      el.setAttribute("content", c);
    };
    setMeta("description", pillar.tagline);
    // v79: full OG + Twitter card so /solutions/:pillar shares render
    // pillar-specific preview cards instead of homepage fallback.
    const _solUrl = `https://trainyouragent.com/solutions/${pillar.slug}`;
    const _solOg = `https://trainyouragent.com/api/og?title=${encodeURIComponent(pillar.label)}&eyebrow=${encodeURIComponent("SOLUTION · TRAINYOURAGENT")}&kicker=${encodeURIComponent(pillar.tagline.slice(0, 120))}&type=solution`;
    setProp("og:title", _title);
    setProp("og:description", pillar.tagline);
    setProp("og:url", _solUrl);
    setProp("og:type", "website");
    setProp("og:image", _solOg);
    setProp("og:image:width", "1200");
    setProp("og:image:height", "630");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", _title);
    setMeta("twitter:description", pillar.tagline);
    setMeta("twitter:image", _solOg);

    // v40a: Service + FAQPage + BreadcrumbList JSON-LD per pillar
    const schemaId = "tya-schema-pillar";
    document.getElementById(schemaId)?.remove();
    const url = `https://trainyouragent.com/solutions/${pillar.slug}`;
    const s = document.createElement("script");
    s.id = schemaId;
    s.type = "application/ld+json";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "@id": `${url}#service`,
          serviceType: pillar.label,
          name: `${pillar.label} — TrainYourAgent`,
          description: pillar.tagline,
          provider: { "@id": "https://trainyouragent.com/#org" },
          areaServed: { "@type": "Country", name: "United States" },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://trainyouragent.com" },
            { "@type": "ListItem", position: 2, name: "Solutions", item: "https://trainyouragent.com/solutions" },
            { "@type": "ListItem", position: 3, name: pillar.label, item: url },
          ],
        },
        {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: pillar.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
      ],
    });
    document.head.appendChild(s);
    return () => { document.getElementById(schemaId)?.remove(); };
  }, [pillar]);

  if (!pillar) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            Service not found
          </div>
          <h1 className="text-[28px] font-semibold text-[#042C53] mb-4">
            That solution page doesn't exist.
          </h1>
          <Link to="/solutions" className="text-[#185FA5] underline">
            Back to all solutions →
          </Link>
        </div>
      </div>
    );
  }

  const otherPillars = SLUGS.filter((s) => s !== slug).map((s) => PILLARS[s]);

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <SiteNav active="solutions" />

      {/* HERO + LIVE DEMO */}
      <section className="relative pt-32 pb-12 px-5 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(closest-side, #DCEBFA 0%, rgba(220,235,250,0) 70%)",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
              Solutions / {pillar.label}
            </div>
            <h1 className="text-[40px] sm:text-[58px] lg:text-[68px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
              {pillar.label}.{" "}
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                Production-grade.
              </span>
            </h1>
            <p className="mt-5 text-[18px] text-slate-700 max-w-xl leading-relaxed">
              {pillar.tagline}
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener"
                className="px-6 py-3.5 rounded-2xl bg-[#042C53] text-white font-semibold text-[14px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15"
              >
                Book a 30-min call →
              </a>
              <a
                href="#demo"
                className="px-6 py-3.5 rounded-2xl bg-white text-[#042C53] font-semibold text-[14px] border-2 border-[#042C53]/15 hover:border-[#042C53]"
              >
                See it live ↓
              </a>
            </div>
          </div>
          <div id="demo">
            <DemoSurface kind={pillar.demo} label={pillar.label} />
          </div>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
              What it does
            </div>
            <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-4">
              In{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                human language.
              </span>
            </h2>
            <p className="text-[16px] text-slate-700 leading-relaxed">{pillar.what}</p>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
              What's in it
            </div>
            <ul className="space-y-3 text-[15px] text-slate-700">
              {pillar.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#185FA5]/10 text-[#185FA5] text-[11px] font-semibold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PRICE + TIMELINE + STACK */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
          <div className="rounded-3xl bg-white border border-slate-200 p-7">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">
              Pricing
            </div>
            <div className="text-[20px] font-semibold text-[#042C53] mb-3 leading-tight">
              {pillar.priceFrom}
            </div>
            <Link
              to="/pricing"
              className="text-[13px] font-semibold text-[#185FA5] hover:text-[#042C53] inline-flex items-center gap-1"
            >
              See full pricing →
            </Link>
          </div>
          <div className="rounded-3xl bg-white border border-slate-200 p-7">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">
              How long to build
            </div>
            <p className="text-[15px] text-slate-700 leading-relaxed">{pillar.timeline}</p>
          </div>
          <div className="rounded-3xl bg-white border border-slate-200 p-7">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">
              Tech stack
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pillar.stack.map((s) => (
                <span
                  key={s}
                  className="text-[12px] px-2.5 py-1 rounded-full bg-[#F6FAFE] border border-slate-200 text-[#042C53]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE CUSTOMERS */}
      <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            Live customers
          </div>
          <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-8">
            Already running this in{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              production.
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {pillar.customers.map((c) => (
              <div
                key={c.name}
                className="rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#185FA5] transition"
              >
                <div className="h-14 mb-4 flex items-center justify-center bg-[#F6FAFE] rounded-xl">
                  <span className="text-[14px] uppercase tracking-[0.14em] text-[#042C53] font-semibold">
                    {c.name}
                  </span>
                </div>
                <p className="text-[14px] text-slate-700 leading-relaxed">{c.outcome}</p>
              </div>
            ))}
          </div>
          <div className="text-[12px] text-slate-500 mt-6 italic">
            Customer outcomes representative — full case studies on request under NDA.
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            FAQ — {pillar.label}
          </div>
          <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-8">
            What buyers actually{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              ask us.
            </span>
          </h2>
          <div className="space-y-2">
            {pillar.faqs.map((f, i) => (
              <button
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left rounded-2xl bg-white border border-slate-200 px-5 py-4 hover:border-[#185FA5] transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-[15px] font-semibold text-[#042C53]">{f.q}</div>
                  <span
                    className={`text-[#185FA5] text-[18px] flex-shrink-0 transition-transform ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </div>
                {openFaq === i && (
                  <div className="text-[14px] text-slate-700 leading-relaxed mt-3">{f.a}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold mb-3">
            Ready
          </div>
          <h2
            className="text-[28px] sm:text-[44px] leading-tight font-medium mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
          >
            "Stop scoping. Start shipping."
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="px-7 py-3.5 rounded-full bg-white text-[#042C53] font-semibold text-[14px] hover:bg-slate-100 shadow"
            >
              Book a 30-min call →
            </a>
            <a
              href="#demo"
              className="px-7 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-medium text-[14px] hover:bg-white/15"
            >
              See it live
            </a>
          </div>
        </div>
      </section>

      {/* OTHER PILLARS */}
      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            Other pillars
          </div>
          <div className="flex flex-wrap gap-2">
            {otherPillars.map((p) => (
              <Link
                key={p.slug}
                to={`/solutions/${p.slug}`}
                className="px-4 py-2 rounded-full bg-[#F6FAFE] border border-slate-200 text-[13px] text-[#042C53] hover:border-[#185FA5] hover:bg-white transition"
              >
                {p.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-[#042C53]">
              Terms
            </Link>
            <Link to="/security" className="hover:text-[#042C53]">
              Security
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SolutionDetail;
