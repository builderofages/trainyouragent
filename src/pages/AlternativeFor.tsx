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
    const idx = slugFromRouter.toLowerCase().indexOf("-for-");
    if (idx > 0) {
      const c = slugFromRouter.slice(0, idx).toLowerCase() as AltCompetitorKey;
      const v = slugFromRouter.slice(idx + "-for-".length).toLowerCase() as AltVerticalKey;
      return {
        competitor: c in ALT_COMPETITORS ? c : null,
        vertical:   v in ALT_VERTICALS   ? v : null,
      };
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
/*  Page                                                              */
/* ------------------------------------------------------------------ */
const AlternativeFor = () => {
  const params = useParams<{ slug?: string; competitor?: string; vertical?: string }>();
  const { competitor: cKey, vertical: vKey } = parseSlug(params.slug, params.competitor, params.vertical);
  const [navScrolled, setNavScrolled] = useState(false);

  const cMeta = cKey ? ALT_COMPETITORS[cKey] : null;
  const vMeta = vKey ? ALT_VERTICALS[vKey] : null;
  // Reuse VerticalPage's rich content map for "why {vertical} businesses choose us" bullets
  const richContent = vMeta ? VERTICAL_CONTENT[vMeta.verticalSlug] : null;

  const faq = useMemo(() => {
    if (!cMeta || !vMeta) return [];
    return buildFaq(cMeta.name, vMeta.label, vMeta.nounPlural);
  }, [cMeta, vMeta]);

  useEffect(() => {
    if (typeof document === "undefined" || !cMeta || !vMeta) return;

    const title = `TrainYourAgent vs ${cMeta.name} for ${vMeta.label} businesses — alternative for ${vMeta.nounPlural}`;
    const desc = `Looking for a ${cMeta.name} alternative for your ${vMeta.label.toLowerCase()} business? TrainYourAgent ships a done-for-you AI agent in 14 days with native ${vMeta.label.toLowerCase()}-stack integrations. Honest comparison and pricing inside.`;
    const url = `${SITE_URL}/alternatives/${cKey}-for-${vKey}`;

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
  }, [cMeta, vMeta, cKey, vKey, faq]);

  useEffect(() => {
    const f = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  // 404 fallback
  if (!cMeta || !vMeta) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
        <div className="text-center max-w-md">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">Page not found</div>
          <h1 className="text-[28px] font-semibold text-[#042C53] mb-4">We don't have a page for that combo — yet.</h1>
          <p className="text-[15px] text-slate-600 mb-6">Try our general comparison page, or book a call and we'll talk through your stack.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/comparisons" className="px-4 py-2 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[13px] font-medium">See comparisons</Link>
            <a href={CAL_URL} target="_blank" rel="noopener" className="px-4 py-2 rounded-full bg-[#042C53] text-white text-[13px] font-medium">Book a call</a>
          </div>
        </div>
      </div>
    );
  }

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
