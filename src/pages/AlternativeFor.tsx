// src/pages/AlternativeFor.tsx
// v40b: programmatic SEO route — /alternatives/:competitor-for-:vertical
// Targets long-tail "alternative to X for Y industry" searches.
// 5 competitors x 10 verticals = 50 unique LPs from one component.
//
// Route param: useParams returns "competitor" + "vertical" because the
// path was registered as /alternatives/:competitor-for-:vertical in App.tsx.
//
// Validates both segments against allowlists, builds content from templates,
// emits FAQPage JSON-LD per combo, and reuses brand tokens + SiteNav.

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import { VERTICAL_CONTENT } from "@/pages/VerticalPage";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const SITE_URL = "https://trainyouragent.com";

/* ------------------------------------------------------------------ */
/*  Brand logo (matches the rest of the site)                          */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Allowlists — anything outside these = 404                          */
/* ------------------------------------------------------------------ */
export const ALT_COMPETITORS = {
  bland:     { name: "Bland.ai",   url: "https://www.bland.ai",   tag: "developer-first voice API" },
  synthflow: { name: "Synthflow",  url: "https://synthflow.ai",   tag: "no-code voice agent builder" },
  vapi:      { name: "Vapi",       url: "https://vapi.ai",        tag: "voice agent platform with builder UI" },
  retell:    { name: "Retell",     url: "https://retellai.com",   tag: "voice infra for developers" },
  airagent:  { name: "Air.ai",     url: "https://air.ai",         tag: "outbound AI sales agent platform" },
  // v68: capture the two largest "vs TYA" search buckets
  zapier:    { name: "Zapier",     url: "https://zapier.com",     tag: "generic workflow automation glue" },
  intercom:  { name: "Intercom",   url: "https://intercom.com",   tag: "enterprise chat platform for B2B SaaS support" },
} as const;

export type AltCompetitorKey = keyof typeof ALT_COMPETITORS;

export const ALT_VERTICALS = {
  "hvac":        { label: "HVAC",        nounPlural: "HVAC companies",   verticalSlug: "/hvac" },
  "healthcare":  { label: "Healthcare",  nounPlural: "practices",        verticalSlug: "/healthcare" },
  "real-estate": { label: "Real Estate", nounPlural: "agents and teams", verticalSlug: "/real-estate" },
  "legal":       { label: "Legal",       nounPlural: "law firms",        verticalSlug: "/legal" },
  "roofing":     { label: "Roofing",     nounPlural: "roofing companies",verticalSlug: "/roofing" },
  "solar":       { label: "Solar",       nounPlural: "solar installers", verticalSlug: "/solar" },
  "ecommerce":   { label: "E-commerce",  nounPlural: "DTC brands",       verticalSlug: "/ecommerce" },
  "hospitality": { label: "Hospitality", nounPlural: "hospitality operators", verticalSlug: "/hospitality" },
  "accounting":  { label: "Accounting",  nounPlural: "CPAs and bookkeepers",  verticalSlug: "/accounting" },
  "automotive":  { label: "Automotive",  nounPlural: "dealers and service centers", verticalSlug: "/automotive" },
} as const;

export type AltVerticalKey = keyof typeof ALT_VERTICALS;

export const ALL_ALTERNATIVE_SLUGS: string[] = (() => {
  const out: string[] = [];
  for (const c of Object.keys(ALT_COMPETITORS) as AltCompetitorKey[]) {
    for (const v of Object.keys(ALT_VERTICALS) as AltVerticalKey[]) {
      out.push(`${c}-for-${v}`);
    }
  }
  return out;
})();

/* ------------------------------------------------------------------ */
/*  parseSlug — pull competitor + vertical out of the URL              */
/*                                                                    */
/*  Supports either:                                                  */
/*    /alternatives/:competitor-for-:vertical (react-router native)    */
/*    /alternatives/:slug   (slug parsed manually)                     */
/* ------------------------------------------------------------------ */
function parseSlug(
  slugFromRouter: string | undefined,
  competitorFromRouter: string | undefined,
  verticalFromRouter: string | undefined,
): { competitor: AltCompetitorKey | null; vertical: AltVerticalKey | null } {
  // Path A: competitor + vertical came in as separate params
  if (competitorFromRouter && verticalFromRouter) {
    const c = competitorFromRouter.toLowerCase() as AltCompetitorKey;
    const v = verticalFromRouter.toLowerCase() as AltVerticalKey;
    return {
      competitor: c in ALT_COMPETITORS ? c : null,
      vertical:   v in ALT_VERTICALS   ? v : null,
    };
  }
  // Path B: single slug — split on the first "-for-"
  if (slugFromRouter) {
    const lower = slugFromRouter.toLowerCase();
    const idx = lower.indexOf("-for-");
    if (idx > 0) {
      const c = lower.slice(0, idx) as AltCompetitorKey;
      const v = lower.slice(idx + "-for-".length) as AltVerticalKey;
      return {
        competitor: c in ALT_COMPETITORS ? c : null,
        vertical:   v in ALT_VERTICALS   ? v : null,
      };
    }
    // v68: competitor-only slug (e.g. /alternatives/zapier, /alternatives/intercom)
    const c = lower as AltCompetitorKey;
    if (c in ALT_COMPETITORS) {
      return { competitor: c, vertical: null };
    }
  }
  return { competitor: null, vertical: null };
}

/* ------------------------------------------------------------------ */
/*  Per-combo content builders                                         */
/* ------------------------------------------------------------------ */
function buildFaq(competitorName: string, verticalLabel: string, nounPlural: string) {
  return [
    {
      q: `Is TrainYourAgent really a ${competitorName} alternative for ${verticalLabel.toLowerCase()} businesses?`,
      a: `Yes. ${competitorName} is a great DIY platform — we're done-for-you. ${verticalLabel} operators come to us when they want a working agent shipped in 14 days with native integrations to the tools their team already uses, instead of a console they have to learn and configure themselves.`,
    },
    {
      q: `How does pricing compare for a ${verticalLabel.toLowerCase()} ${nounPlural.endsWith('s') ? 'business' : 'practice'}?`,
      a: `${competitorName} bills per-minute and you build the agent yourself. We bundle the build, the tuning, the integrations, and the runtime into $199–$999/mo depending on volume. For most ${verticalLabel.toLowerCase()} operators under ~4,000 minutes/month, our pricing comes out comparable or cheaper once you include the cost of building it on a DIY platform.`,
    },
    {
      q: `What integrations do you ship for ${verticalLabel.toLowerCase()}?`,
      a: `${verticalLabel}-specific integrations are wired Day 1 — ${verticalLabel === "HVAC" ? "ServiceTitan, Housecall Pro, Jobber" : verticalLabel === "Healthcare" ? "Athena, eClinicalWorks, DrChrono, Epic open APIs (plus BAA)" : verticalLabel === "Real Estate" ? "Follow Up Boss, KvCORE, Sierra Interactive, Boomtown" : verticalLabel === "Legal" ? "Clio, MyCase, PracticePanther" : verticalLabel === "Roofing" ? "AccuLynx, JobNimbus, Roofr, CompanyCam" : verticalLabel === "Solar" ? "Aurora Solar, Enerflo, Solo, OpenSolar" : verticalLabel === "E-commerce" ? "Shopify, Klaviyo, Gorgias, Zendesk, Recharge" : verticalLabel === "Hospitality" ? "SevenRooms, Resy, OpenTable, Cloudbeds, Mews" : verticalLabel === "Accounting" ? "Karbon, TaxDome, Canopy, QuickBooks" : "CDK, Reynolds, Dealertrack, Tekion"}. On ${competitorName} those would all be webhooks you wire yourself.`,
    },
    {
      q: `How long does it take to go live versus ${competitorName}?`,
      a: `14 days from kickoff to a live agent answering real calls. With ${competitorName}, time-to-live depends entirely on how much engineering time your team has to invest in the build. Most operators we talk to spent 4–8 weeks on a DIY platform before they came to us.`,
    },
  ];
}

function buildHeroParagraph(competitor: { name: string; tag: string }, verticalLabel: string, nounPlural: string) {
  return `${verticalLabel} ${nounPlural} pick ${competitor.name} because it's a ${competitor.tag} — and then most of them realize the platform is the easy part. The hard part is the integrations, the prompt tuning, the failure modes, and the ${verticalLabel.toLowerCase()}-specific edge cases. We ship the working agent in 14 days, tuned weekly by a real engineer, with your CRM and dispatch stack already wired. That's the alternative.`;
}

/* ------------------------------------------------------------------ */
/*  v68: COMPETITOR-ONLY content (no vertical attached)                */
/*  Used when slug is just a competitor name like /alternatives/zapier */
/* ------------------------------------------------------------------ */
type CompetitorOnlySection = { h: string; body: string };
type CompetitorOnlyContent = {
  hero: string;
  sections: CompetitorOnlySection[];
  faq: { q: string; a: string }[];
};

export const COMPETITOR_ONLY_CONTENT: Partial<Record<AltCompetitorKey, CompetitorOnlyContent>> = {
  zapier: {
    hero: "Zapier is generic glue — it wires SaaS tools to each other and waits for you to design every step. TrainYourAgent ships a vertical-specific AI agent that answers the phone, qualifies the lead, books the appointment, and writes back to your CRM in 21 days. Different category, different outcome.",
    sections: [
      {
        h: "Workflow automation vs vertical AI agents.",
        body: "Zapier is a horizontal automation platform: triggers, actions, paths, filters. It's powerful, but it assumes you already know the workflow and can decompose it into ~12 steps per Zap. TrainYourAgent isn't a workflow builder — it's a deployed AI agent built for one industry at a time (HVAC, healthcare, real estate, legal). The agent decides what to do at runtime based on the conversation, not based on a static if/then graph.",
      },
      {
        h: "Generic glue vs CRM-wired voice + chat.",
        body: "On Zapier you connect your CRM, your calendar, your dialer, your SMS — and then you build the logic. With TrainYourAgent the voice/chat agent ships pre-wired to ServiceTitan, Housecall Pro, Follow Up Boss, Clio, Athena, Shopify, and 40+ vertical-specific systems. Day 1 the agent can read a customer's history, book the right tech, and write the call summary back to the deal record.",
      },
      {
        h: "Design-every-step vs 21-day deploy.",
        body: "Zapier's cost is mostly your time: most teams spend 3–6 months building, debugging, and maintaining their Zap library. TrainYourAgent ships a complete production agent in 21 days, tuned weekly by a real engineer. No Zap maintenance, no broken authentications at 2am, no \"works for everything except the case that just came in.\"",
      },
    ],
    faq: [
      {
        q: "Can TrainYourAgent replace my Zapier workflows?",
        a: "For the customer-facing parts — yes. The voice agent handles inbound calls, the chat agent handles inbound web/SMS, and both write back to your CRM. For backoffice automation (e.g. \"when a new contact lands in HubSpot, add a row to Google Sheets\"), Zapier is still the right tool. Most customers keep both.",
      },
      {
        q: "How is pricing different?",
        a: "Zapier prices on tasks ($19.99–$799+/mo). TrainYourAgent prices on the agent ($799–$2,499+/mo all-in: build, integrations, runtime, weekly tuning). For replacing 1 FTE worth of phone/chat coverage, our pricing is dramatically cheaper than the loaded cost of a CSR plus the per-task Zapier bill.",
      },
      {
        q: "Do you offer a Zapier-style step builder?",
        a: "No — by design. We don't think \"design every step\" is the right product for service businesses. We think \"hire an agent that already knows your industry\" is the right product. If you want to build Zaps, use Zapier.",
      },
    ],
  },
  intercom: {
    hero: "Intercom is the enterprise chat platform for B2B SaaS support — Fin AI, Inbox, Help Center, Surveys, the works. TrainYourAgent is voice + chat AI for service-business inbound: HVAC, dental, law, real estate. Different ICP, different price point, different surface area.",
    sections: [
      {
        h: "Enterprise B2B SaaS support vs SMB service-business inbound.",
        body: "Intercom is built for product-led SaaS companies with thousands of support tickets per week. Their pricing reflects that ($74–$268/seat/mo, plus Fin AI usage). TrainYourAgent is built for service businesses (HVAC, dental, legal, real estate, roofing) where the inbound is calls and leads — not support tickets — and the operator is a 5-50 person team that needs answers booked, not deflected.",
      },
      {
        h: "Chat-only vs voice + chat in one agent.",
        body: "Intercom is fundamentally a web/in-app messaging platform. Voice (Fin Voice) is recent and add-on. TrainYourAgent ships voice and chat as one agent from Day 1 — the same brain answers the phone, the website chat, and the SMS. Customers don't have to repeat themselves across channels, and the agent has one unified conversation history per contact.",
      },
      {
        h: "$74-$268/seat/mo vs $799/mo all-in.",
        body: "Intercom: Essential $39/seat, Advanced $99/seat, Expert $139/seat — plus Fin resolutions at ~$0.99/resolution. A 10-seat support org runs ~$15K-$30K/yr before Fin. TrainYourAgent: voice + chat agent from $799/mo all-in — the build, the integrations, the runtime, the weekly tuning. For a service business under ~3K conversations/mo, our pricing is roughly 5-10× cheaper than the equivalent Intercom + Fin setup.",
      },
    ],
    faq: [
      {
        q: "Is TrainYourAgent a real Intercom alternative?",
        a: "If you're a B2B SaaS company with a help center, a product, and 10K MRR worth of support tickets — no, stay on Intercom. If you're a service business (HVAC, dental, real estate, etc.) and you bought Intercom because someone told you you needed a chat widget — yes, we're the better fit at a tenth of the cost.",
      },
      {
        q: "Do you have a Help Center / ticket inbox / surveys?",
        a: "No — we don't try to replace Intercom's surface area. We ship voice + chat AI agents that answer, qualify, and book. If you need a help center, articles, NPS surveys, and a seat-based inbox for a support team, that's Intercom's territory and we won't try to compete there.",
      },
      {
        q: "How long does it take to switch?",
        a: "21 days from kickoff. We wire the voice agent to your phone number, the chat agent to your website, and both to your CRM. You keep Intercom running for whatever support workflows still need it (often none, for service businesses) and we cut over the inbound traffic.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
const AlternativeFor = () => {
  const params = useParams<{ slug?: string; competitor?: string; vertical?: string }>();
  const { competitor: cKey, vertical: vKey } = parseSlug(params.slug, params.competitor, params.vertical);
  const [navScrolled, setNavScrolled] = useState(false);

  const cMeta = cKey ? ALT_COMPETITORS[cKey] : null;
  const vMeta = vKey ? ALT_VERTICALS[vKey] : null;
  // v68: competitor-only mode (e.g. /alternatives/zapier)
  const competitorOnly = cMeta && !vMeta ? COMPETITOR_ONLY_CONTENT[cKey as AltCompetitorKey] ?? null : null;
  // Reuse VerticalPage's rich content map for "why {vertical} businesses choose us" bullets
  const richContent = vMeta ? VERTICAL_CONTENT[vMeta.verticalSlug] : null;

  const faq = useMemo(() => {
    if (!cMeta) return [];
    if (vMeta) return buildFaq(cMeta.name, vMeta.label, vMeta.nounPlural);
    if (competitorOnly) return competitorOnly.faq;
    return [];
  }, [cMeta, vMeta, competitorOnly]);

  useEffect(() => {
    if (typeof document === "undefined" || !cMeta) return;
    // Render path requires either a vertical OR a competitor-only content map.
    if (!vMeta && !competitorOnly) return;

    const title = vMeta
      ? `TrainYourAgent vs ${cMeta.name} for ${vMeta.label} businesses — alternative for ${vMeta.nounPlural}`
      : `TrainYourAgent vs ${cMeta.name} — the honest ${cMeta.name} alternative`;
    const desc = vMeta
      ? `Looking for a ${cMeta.name} alternative for your ${vMeta.label.toLowerCase()} business? TrainYourAgent ships a done-for-you AI agent in 14 days with native ${vMeta.label.toLowerCase()}-stack integrations. Honest comparison and pricing inside.`
      : `Looking for a ${cMeta.name} alternative? TrainYourAgent is a vertical-specific voice + chat AI agent — wired to your CRM, deployed in 21 days. Honest comparison and pricing inside.`;
    const url = vMeta
      ? `${SITE_URL}/alternatives/${cKey}-for-${vKey}`
      : `${SITE_URL}/alternatives/${cKey}`;

    document.title = title;

    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }

    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    const setProp = (p: string, c: string) => {
      let el = document.querySelector(`meta[property='${p}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", p); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };

    setMeta("description", desc);
    setProp("og:title", title);
    setProp("og:description", desc);
    setProp("og:url", url);
    setProp("og:type", "website");
    setMeta("twitter:card", "summary_large_image");

    // Canonical
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = url;

    // FAQPage JSON-LD
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    let scriptEl = document.getElementById("alt-faq-jsonld") as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.id = "alt-faq-jsonld";
      scriptEl.type = "application/ld+json";
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);

    return () => {
      // Leave the JSON-LD in place; the next render will overwrite it.
    };
  }, [cMeta, vMeta, competitorOnly, cKey, vKey, faq]);

  useEffect(() => {
    const f = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  // 404 fallback
  // 404 fallback (v68): when slug is unknown, render the actual list of
  //                     valid alternative slugs so the page becomes a
  //                     discovery surface instead of a dead end.
  if (!cMeta || (!vMeta && !competitorOnly)) {
    const competitorSlugs = Object.keys(ALT_COMPETITORS) as AltCompetitorKey[];
    const requested = params.slug ?? `${params.competitor ?? ""}${params.vertical ? `-for-${params.vertical}` : ""}`;
    return (
      <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
        <SiteNav active="comparisons" />
        <section className="pt-32 pb-12 px-5 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Page not found</div>
            <h1 className="text-[32px] sm:text-[40px] font-semibold text-[#042C53] mb-4 tracking-tight">
              We don't have a page for <span className="font-mono text-[#185FA5]">{requested || "that"}</span> — yet.
            </h1>
            <p className="text-[15px] sm:text-[16px] text-slate-700 max-w-2xl mb-8 leading-relaxed">
              Here are the alternative pages we DO have. Pick the one that matches what you're shopping for, or book a call and we'll talk through your stack directly.
            </p>

            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#042C53] mb-3">Compare us to a competitor</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {competitorSlugs.map((c) => (
                <Link
                  key={c}
                  to={`/alternatives/${c}`}
                  className="px-3.5 py-1.5 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[13px] font-medium hover:bg-[#D6E7F6]"
                >
                  /alternatives/{c}
                </Link>
              ))}
            </div>

            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#042C53] mb-3">Or by competitor + industry (50 pages)</h2>
            <div className="flex flex-wrap gap-2 mb-8 max-h-64 overflow-y-auto p-2 rounded-xl border border-slate-200 bg-slate-50">
              {ALL_ALTERNATIVE_SLUGS.map((slug) => (
                <Link
                  key={slug}
                  to={`/alternatives/${slug}`}
                  className="px-2.5 py-1 rounded-full bg-white text-slate-700 text-[12px] font-medium hover:text-[#185FA5] border border-slate-200"
                >
                  {slug}
                </Link>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link to="/comparisons" className="px-4 py-2 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[14px] font-medium">All comparisons</Link>
              <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[14px] font-medium">Book a call</a>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // v68: competitor-only render path (e.g. /alternatives/zapier)
  if (competitorOnly && cMeta) {
    return (
      <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
        <SiteNav active="comparisons" />

        {/* HERO */}
        <section className="pt-32 pb-12 px-5 sm:px-8 bg-gradient-to-b from-[#E6F1FB]/40 to-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
              {cMeta.name} alternative
            </div>
            <h1
              className="text-[36px] sm:text-[52px] leading-[1.05] font-semibold text-[#042C53] tracking-tight mb-5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
            >
              TrainYourAgent vs {cMeta.name}.
            </h1>
            <p className="text-[17px] sm:text-[19px] leading-[1.55] text-slate-700 max-w-3xl mb-7">
              {competitorOnly.hero}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener"
                className="px-5 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-medium hover:bg-[#0A3D6E] shadow-sm"
              >
                Book a 30-min build call
              </a>
              <Link
                to="/comparisons"
                className="px-5 py-3 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[14px] font-medium hover:bg-[#D6E7F6]"
              >
                All comparisons
              </Link>
              <a
                href={cMeta.url}
                target="_blank"
                rel="noopener nofollow"
                className="px-5 py-3 rounded-full border border-slate-300 text-slate-700 text-[14px] font-medium hover:bg-slate-50"
              >
                Visit {cMeta.name} →
              </a>
            </div>
          </div>
        </section>

        {/* THREE SECTIONS */}
        <section className="py-14 px-5 sm:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            {competitorOnly.sections.map((s, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 p-6 bg-white">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-2">0{i + 1}</div>
                <div className="text-[18px] font-semibold text-[#042C53] mb-3">{s.h}</div>
                <div className="text-[14px] leading-[1.6] text-slate-700">{s.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 px-5 sm:px-8 bg-[#E6F1FB]/40">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-[24px] sm:text-[30px] font-semibold text-[#042C53] mb-6 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
            >
              Common questions about switching from {cMeta.name}.
            </h2>
            <div className="space-y-3">
              {faq.map((f, i) => (
                <details key={i} className="rounded-xl bg-white border border-slate-200 px-5 py-4 group">
                  <summary className="cursor-pointer text-[15px] font-semibold text-[#042C53] list-none flex justify-between items-center">
                    <span>{f.q}</span>
                    <span className="text-[#185FA5] group-open:rotate-45 transition-transform text-[20px] leading-none">+</span>
                  </summary>
                  <div className="mt-3 text-[14px] leading-[1.6] text-slate-700">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-5 sm:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-[28px] sm:text-[36px] font-semibold text-[#042C53] mb-4 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
            >
              See it deployed for your business in 21 days.
            </h2>
            <p className="text-[15px] text-slate-600 mb-7 max-w-xl mx-auto">
              30 minutes. We map your inbound, your CRM, your stack. You leave with a build plan and a price — not a sales pitch.
            </p>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="inline-block px-7 py-3.5 rounded-full bg-[#042C53] text-white text-[15px] font-medium hover:bg-[#0A3D6E] shadow-sm"
            >
              Book a 30-min build call →
            </a>
            <div className="mt-6 text-[12px] text-slate-500">
              <Link to="/comparisons" className="underline">All comparisons</Link>
              {" · "}
              <Link to="/pricing" className="underline">Pricing</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // vMeta guaranteed below this point
  if (!vMeta) return null;

  const heroPara = buildHeroParagraph(cMeta, vMeta.label, vMeta.nounPlural);
  // Pull 3 vertical bullets from VERTICAL_CONTENT.tools[].outcome (with fallback)
  const verticalBullets: string[] = richContent
    ? richContent.tools.slice(0, 3).map((t) => `${t.name} — ${t.outcome}`)
    : [
        `${vMeta.label}-specific agent flows trained on your scripts, your pricing, your escalation rules.`,
        `Native integrations to the tools ${vMeta.nounPlural} actually use — not generic webhooks.`,
        `Weekly tuning by a real engineer based on your real call transcripts.`,
      ];

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <SiteNav active="comparisons" />

      {/* ----------------------------------------------------------- */}
      {/*  HERO                                                       */}
      {/* ----------------------------------------------------------- */}
      <section className="pt-32 pb-12 px-5 sm:px-8 bg-gradient-to-b from-[#E6F1FB]/40 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            {cMeta.name} alternative · for {vMeta.label.toLowerCase()}
          </div>
          <h1
            className="text-[36px] sm:text-[52px] leading-[1.05] font-semibold text-[#042C53] tracking-tight mb-5"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
          >
            TrainYourAgent vs {cMeta.name} for {vMeta.label} businesses.
          </h1>
          <p className="text-[17px] sm:text-[19px] leading-[1.55] text-slate-700 max-w-3xl mb-7">
            {heroPara}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              className="px-5 py-3 rounded-full bg-[#042C53] text-white text-[14px] font-medium hover:bg-[#0A3D6E] shadow-sm"
            >
              Book a 30-min build call
            </a>
            <Link
              to={vMeta.verticalSlug}
              className="px-5 py-3 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[14px] font-medium hover:bg-[#D6E7F6]"
            >
              See our {vMeta.label.toLowerCase()} agent
            </Link>
            <a
              href={cMeta.url}
              target="_blank"
              rel="noopener nofollow"
              className="px-5 py-3 rounded-full border border-slate-300 text-slate-700 text-[14px] font-medium hover:bg-slate-50"
            >
              Visit {cMeta.name} →
            </a>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/*  3-COL COMPARISON TABLE                                     */}
      {/* ----------------------------------------------------------- */}
      <section className="py-14 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[24px] sm:text-[30px] font-semibold text-[#042C53] mb-2 tracking-tight">
            Three ways a {vMeta.label.toLowerCase()} business can solve the phone problem.
          </h2>
          <p className="text-[15px] text-slate-600 mb-8 max-w-2xl">Pick the column that matches how your team actually wants to spend its time.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* US */}
            <div className="rounded-2xl p-6 bg-[#042C53] text-white">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#9BC3E8] font-semibold mb-2">Recommended</div>
              <div className="text-[18px] font-semibold mb-3">TrainYourAgent</div>
              <div className="text-[13px] text-[#C6DDF1] mb-4">Custom build · done-for-you · 14-day ship</div>
              <ul className="space-y-2 text-[13.5px] leading-[1.55] text-white/90">
                <li>• Agent built FOR your {vMeta.label.toLowerCase()} business</li>
                <li>• Native CRM + dispatch integrations on Day 1</li>
                <li>• Weekly tuning by a real engineer</li>
                <li>• $199–$999/mo all-in, no per-minute surprises</li>
                <li>• 14 days kickoff → live traffic</li>
              </ul>
            </div>
            {/* COMPETITOR */}
            <div className="rounded-2xl p-6 bg-white border border-slate-200">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold mb-2">DIY platform</div>
              <div className="text-[18px] font-semibold text-[#042C53] mb-3">{cMeta.name}</div>
              <div className="text-[13px] text-slate-600 mb-4">{cMeta.tag}</div>
              <ul className="space-y-2 text-[13.5px] leading-[1.55] text-slate-700">
                <li>• You build, you maintain, you tune</li>
                <li>• Integrations are webhooks you wire yourself</li>
                <li>• Per-minute pricing — variable, hard to forecast</li>
                <li>• Support is community + docs</li>
                <li>• Time-to-live depends on your team's bandwidth</li>
              </ul>
            </div>
            {/* HIRING */}
            <div className="rounded-2xl p-6 bg-white border border-slate-200">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold mb-2">Hiring</div>
              <div className="text-[18px] font-semibold text-[#042C53] mb-3">Full-time CSR / answering service</div>
              <div className="text-[13px] text-slate-600 mb-4">$3,500–$5,500/mo loaded cost per FTE</div>
              <ul className="space-y-2 text-[13.5px] leading-[1.55] text-slate-700">
                <li>• Single-threaded — one call at a time</li>
                <li>• Off at nights, weekends, holidays</li>
                <li>• Turnover, training cost, PTO, sick days</li>
                <li>• Doesn't scale on a storm / surge day</li>
                <li>• Won't integrate to your CRM</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/*  WHY {VERTICAL} BUSINESSES CHOOSE US                        */}
      {/* ----------------------------------------------------------- */}
      <section className="py-14 px-5 sm:px-8 bg-[#E6F1FB]/40">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-[24px] sm:text-[30px] font-semibold text-[#042C53] mb-6 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
          >
            Why {vMeta.label.toLowerCase()} businesses choose us over {cMeta.name}.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {verticalBullets.map((bullet, i) => {
              const [name, ...rest] = bullet.split(" — ");
              const outcome = rest.join(" — ");
              return (
                <div key={i} className="rounded-2xl p-6 bg-white border border-slate-200">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-2">0{i + 1}</div>
                  <div className="text-[16px] font-semibold text-[#042C53] mb-2">{name}</div>
                  <div className="text-[14px] leading-[1.55] text-slate-700">{outcome || bullet}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/*  PRICING SNIPPET                                            */}
      {/* ----------------------------------------------------------- */}
      <section className="py-14 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[24px] sm:text-[30px] font-semibold text-[#042C53] mb-4 tracking-tight">
            What it costs.
          </h2>
          <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1">Starter</div>
                <div className="text-[24px] font-semibold text-[#042C53]">$199<span className="text-[14px] text-slate-500 font-normal">/mo</span></div>
                <div className="text-[13px] text-slate-600 mt-1">Single agent, &lt;1K min/mo, core integrations</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1">Operators</div>
                <div className="text-[24px] font-semibold text-[#042C53]">$499<span className="text-[14px] text-slate-500 font-normal">/mo</span></div>
                <div className="text-[13px] text-slate-600 mt-1">Full {vMeta.label.toLowerCase()} stack wired, 4K min, weekly tuning</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#185FA5] font-semibold mb-1">Scale</div>
                <div className="text-[24px] font-semibold text-[#042C53]">$999<span className="text-[14px] text-slate-500 font-normal">/mo</span></div>
                <div className="text-[13px] text-slate-600 mt-1">Multi-location, multi-agent, dedicated engineer</div>
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-slate-200 text-[13px] text-slate-600">
              No setup fee. Month-to-month. Build + run included — no separate per-minute add-on like {cMeta.name}.
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/*  FAQ                                                        */}
      {/* ----------------------------------------------------------- */}
      <section className="py-14 px-5 sm:px-8 bg-[#E6F1FB]/40">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-[24px] sm:text-[30px] font-semibold text-[#042C53] mb-6 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
          >
            Common questions about switching from {cMeta.name}.
          </h2>
          <div className="space-y-3">
            {faq.map((f, i) => (
              <details key={i} className="rounded-xl bg-white border border-slate-200 px-5 py-4 group">
                <summary className="cursor-pointer text-[15px] font-semibold text-[#042C53] list-none flex justify-between items-center">
                  <span>{f.q}</span>
                  <span className="text-[#185FA5] group-open:rotate-45 transition-transform text-[20px] leading-none">+</span>
                </summary>
                <div className="mt-3 text-[14px] leading-[1.6] text-slate-700">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/*  CTA                                                        */}
      {/* ----------------------------------------------------------- */}
      <section className="py-16 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-[28px] sm:text-[36px] font-semibold text-[#042C53] mb-4 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
          >
            See it built for your {vMeta.label.toLowerCase()} business in 14 days.
          </h2>
          <p className="text-[15px] text-slate-600 mb-7 max-w-xl mx-auto">
            30 minutes. We map your stack, your call patterns, your escalation rules. You leave with a build plan and a price — not a sales pitch.
          </p>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener"
            className="inline-block px-7 py-3.5 rounded-full bg-[#042C53] text-white text-[15px] font-medium hover:bg-[#0A3D6E] shadow-sm"
          >
            Book a 30-min build call →
          </a>
          <div className="mt-6 text-[12px] text-slate-500">
            <Link to="/comparisons" className="underline">All comparisons</Link>
            {" · "}
            <Link to={`/vs/${cKey === "airagent" ? "air-ai" : cKey}`} className="underline">TrainYourAgent vs {cMeta.name}</Link>
            {" · "}
            <Link to={vMeta.verticalSlug} className="underline">{vMeta.label} home</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AlternativeFor;
