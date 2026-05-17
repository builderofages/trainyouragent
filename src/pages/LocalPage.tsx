// src/pages/LocalPage.tsx — v47B
// Programmatic local SEO: /local/{citySlug}/{verticalSlug}
// 30 cities x 4 verticals = 120 unique pages. Content is composed from a
// phrase bank that rotates per deterministic hash(citySlug + verticalSlug),
// so no two combos look identical and each page hits 400+ unique rendered
// words. JSON-LD: BreadcrumbList + LocalBusiness. Canonical link injected.

import { useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { CITIES, getCity, citiesInRegion } from "@/lib/cities";
import { VERTICALS, getVertical, FAQ_POOL } from "@/lib/verticals";

const SITE_URL = "https://trainyouragent.com";
const CAL_URL = "https://cal.com/trainyouragent/30min";

// Deterministic non-crypto hash so each page picks the same bank entry
// across navigations and SSR-like passes.
function hash(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h >>> 0;
}

function pick<T>(bank: T[], seed: string, salt = ""): T {
  return bank[hash(seed + "|" + salt) % bank.length];
}

function pickN<T>(bank: T[], seed: string, n: number): T[] {
  const out: T[] = [];
  const used = new Set<number>();
  let i = 0;
  while (out.length < n && i < bank.length * 4) {
    const idx = hash(seed + ":" + i) % bank.length;
    if (!used.has(idx)) {
      used.add(idx);
      out.push(bank[idx]);
    }
    i++;
  }
  return out;
}

// --- Phrase bank ----------------------------------------------------------

const INTRO_OPENINGS = [
  "Built for {city} the way the local market actually runs.",
  "Designed around how {city} operators staff their front office today.",
  "Tuned for {city} call patterns, not a generic national average.",
  "Shaped by what {city} SMBs told us they were missing.",
  "Engineered against the {city} workday, not a 9-to-5 from a brochure.",
];

const HOW_DESCRIPTORS = [
  "Three weeks from kickoff to a live agent your team trusts.",
  "Discovery, build, and launch run lean so you don't pay for a slow process.",
  "Each phase has a fixed deliverable, so you know exactly what ships and when.",
  "We over-rehearse before launch, because the front desk is your first impression.",
];

const CTA_VARIANTS = [
  "Talk to a {city} AI builder",
  "Book a {city}-specific working session",
  "See it work for a {city} business like yours",
  "Get a {city} pilot scoped this week",
  "Start a 15-min {city} call",
  "Walk through a {city} build plan",
];

const BUILT_FOR_OPENERS = [
  "{city} businesses don't have a phone problem, they have a coverage problem.",
  "The front desk in {city} doesn't break because of bad people, it breaks because of math.",
  "Operators in {city} are stuck choosing between answering every call and running the rest of the business.",
  "{city} owners we talk to are tired of paying for missed-call insurance and getting nothing back.",
  "The realistic option in {city} isn't to hire faster, it's to stop leaking calls in the first place.",
];

const INDUSTRY_PARAGRAPH_TEMPLATES = [
  "We focus on the kinds of {city} businesses where the phone is the first impression: {ind1} and {ind2}. The metro pushes about {pop}k people through the day, which means call volume spikes are unpredictable, and the front office has to absorb them without dropping anybody on the floor.",
  "Most of our work in {city} is with {ind1} and {ind2} operators. With roughly {pop}k residents in the metro and constant in-migration, the calendar fills faster than the team can scale, and a smart front-desk layer is the only thing that keeps the calendar honest.",
  "{city} sits on top of a {ind1}-heavy and {ind2}-heavy SMB base. With population around {pop}k, the inbound load is real, the receptionist seat is hard to keep filled, and most owners we meet have already burned through one or two replacements this year.",
  "We see the heaviest fit in {city} with {ind1} groups and {ind2} operators. A metro of about {pop}k people generates the kind of call volume where dropping 5% of inbound costs you a six-figure year, and most teams are dropping more than that today.",
  "Pretty much every {city} {ind1} or {ind2} business we talk to has the same complaint: the phones won't sit still. With a population near {pop}k, the metro reliably out-runs its front-desk capacity, and after-hours coverage stops being a nice-to-have.",
];

const STEP_LABELS = [
  { name: "Discovery", body: "One call. We learn how your front office actually runs in {city}, what callers ask, and where the team is bleeding time today." },
  { name: "Build",     body: "We script, train, and rehearse the agent against real {city} call patterns. You hear it before it ever takes a real call." },
  { name: "Launch",    body: "Soft launch with humans in the loop. We tune transfer rules until the {city} ops lead trusts it on a Monday morning." },
];

// Per-vertical color sentences — pulled into the Built-For section so every
// {city x vertical} combo gets at least one vertical-specific paragraph on top
// of the city-specific paragraph above. Pick 2 of these per page by hash.
const VERTICAL_COLOR: Record<string, string[]> = {
  "voice-agents": [
    "In {city}, the voice agent does the work nobody on staff wants — overflow calls during lunch, after-hours intake, and the same 14 questions every caller asks before they will book.",
    "{city} operators tell us the phone is where they leak the most money, and a voice agent is the only honest fix that doesn't require hiring two more humans.",
    "Voice handles the part of the {city} workday that breaks human attention: long pauses between calls, then six at once during a 30-minute window.",
    "We tune the {city} voice agent to sound local, not corporate. That alone is worth the build for a lot of operators here.",
    "Every {city} voice deployment we ship starts with the same exercise: list the five calls you wish you never had to take, and let the agent take those first.",
  ],
  "chat-agents": [
    "The {city} chat agent shows up on your site for the buyer who would rather type than call, which is most of them under 40 now.",
    "Chat in {city} is where speed-to-lead is won or lost — the agent answers in under two seconds, every time, including 2am on a Sunday.",
    "We design the {city} chat agent to qualify before booking, so your team only sees leads that are actually a fit.",
    "Most {city} sites we audit have a contact form and nothing else. Chat takes that 12% form-fill rate and turns it into real conversations.",
    "The chat agent in {city} becomes a feedback loop — every transcript shows the marketing team what buyers really want to know before they will buy.",
  ],
  "ai-receptionist": [
    "The {city} AI receptionist is the seat you can't keep filled, sitting in a server. It picks up by ring two, every time, no exceptions.",
    "Most {city} receptionists we replace had been working understaffed for months. The agent doesn't get sick, doesn't quit, and doesn't take a smoke break at 11.",
    "An AI receptionist in {city} lets the human team focus on the customers in front of them, not the customer on hold.",
    "We design the {city} receptionist to escalate gracefully — when a caller needs a human, the transfer is warm, with context, every time.",
    "The {city} receptionist holds the same standard as a Ritz front desk: greet, listen, route, confirm. It just does it across thousands of calls a month.",
  ],
  "ai-sales-agent": [
    "The {city} AI sales agent is the SDR seat you keep filling and refilling — except it shows up every day, follows the script, and never has a bad week.",
    "Outbound in {city} is brutal on humans. The AI sales agent dials, listens, handles objections, and books — the SDR you have moves up to closing.",
    "We pair the {city} AI sales agent with a real sales leader so it sounds like a teammate, not a cold-call factory.",
    "The {city} sales agent does the unglamorous part of pipeline well — inbound follow-up under 60 seconds, no-show rebooks, lapsed-lead reactivation.",
    "Every {city} outbound campaign starts with a consented list and a tight ICP. We do not call cold-purchased data, ever.",
  ],
};

// --- SEO/meta helper ------------------------------------------------------

function setMeta(selector: string, attr: "name" | "property", key: string, value: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setCanonical(url: string) {
  let el = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

// --- Component ------------------------------------------------------------

export default function LocalPage() {
  const { citySlug, verticalSlug } = useParams<{ citySlug: string; verticalSlug: string }>();
  const navigate = useNavigate();
  const city = getCity(citySlug);
  const vertical = getVertical(verticalSlug);

  // Stable seed for this combo.
  const seed = (citySlug || "") + ":" + (verticalSlug || "");

  useEffect(() => {
    if (!city || !vertical) {
      navigate("/local", { replace: true });
    }
  }, [city, vertical, navigate]);

  const url = useMemo(
    () => `${SITE_URL}/local/${citySlug}/${verticalSlug}`,
    [citySlug, verticalSlug]
  );

  useEffect(() => {
    if (!city || !vertical || typeof document === "undefined") return;

    const title = `${vertical.displayName} in ${city.displayName}, ${city.statePostal} — TrainYourAgent`;
    const desc = `AI ${vertical.displayName.toLowerCase()} built for ${city.displayName} ${city.industries[0]} and ${city.industries[1]} businesses. ${vertical.outcomeMetric.charAt(0).toUpperCase() + vertical.outcomeMetric.slice(1)} starts at ${vertical.pricingAnchor}. Tampa-built, deployed nationwide.`;

    document.title = title;
    setMeta(`meta[name='description']`, "name", "description", desc);
    setMeta(`meta[property='og:title']`, "property", "og:title", title);
    setMeta(`meta[property='og:description']`, "property", "og:description", desc);
    setMeta(`meta[property='og:url']`, "property", "og:url", url);
    setMeta(`meta[property='og:type']`, "property", "og:type", "website");
    setMeta(`meta[name='twitter:card']`, "name", "twitter:card", "summary_large_image");
    setMeta(`meta[name='twitter:title']`, "name", "twitter:title", title);
    setMeta(`meta[name='twitter:description']`, "name", "twitter:description", desc);
    setCanonical(url);

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home",    item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Local",   item: `${SITE_URL}/local` },
            { "@type": "ListItem", position: 3, name: city.displayName, item: `${SITE_URL}/local/${city.slug}/${vertical.slug}` },
            { "@type": "ListItem", position: 4, name: vertical.displayName, item: url },
          ],
        },
        {
          "@type": "LocalBusiness",
          "@id": `${url}#localbusiness`,
          name: `TrainYourAgent — ${vertical.displayName} in ${city.displayName}`,
          url,
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            addressLocality: city.displayName,
            addressRegion: city.statePostal,
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: city.lat,
            longitude: city.lng,
          },
          areaServed: { "@type": "City", name: city.displayName },
        },
      ],
    };

    const id = "tya-schema-local";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(s);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [city, vertical, url]);

  if (!city || !vertical) return null;

  // Compose deterministically-varied copy.
  const intro       = pick(INTRO_OPENINGS, seed, "intro").replace("{city}", city.displayName);
  const howDesc     = pick(HOW_DESCRIPTORS, seed, "how");
  const ctaCopy     = pick(CTA_VARIANTS, seed, "cta").replace("{city}", city.displayName);
  const builtOpener = pick(BUILT_FOR_OPENERS, seed, "builtOpener").replace("{city}", city.displayName);
  const industryP   = pick(INDUSTRY_PARAGRAPH_TEMPLATES, seed, "industryP")
    .replace("{city}", city.displayName)
    .replace("{ind1}", city.industries[0])
    .replace("{ind2}", city.industries[1])
    .replace("{pop}", String(city.population));
  const colorBank = VERTICAL_COLOR[vertical.slug] || [];
  const verticalColors = pickN(colorBank, seed + ":vcolor", 2);
  const verticalColorA = (verticalColors[0] || "").replace("{city}", city.displayName);
  const verticalColorB = (verticalColors[1] || "").replace("{city}", city.displayName);

  const faqPool = FAQ_POOL[vertical.slug] || [];
  const faqs = pickN(faqPool, seed + ":faq", 3);

  const calLink = `${CAL_URL}?utm_source=local&utm_campaign=${citySlug}-${verticalSlug}`;

  const siblingVerticals = VERTICALS.filter((x) => x.slug !== vertical.slug);
  const sameRegion = citiesInRegion(city.region, city.slug).slice(0, 4);
  const siblingCities = sameRegion.length >= 4
    ? sameRegion
    : [...sameRegion, ...CITIES.filter((x) => x.slug !== city.slug && !sameRegion.find((r) => r.slug === x.slug)).slice(0, 4 - sameRegion.length)];

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">
        Skip to main content
      </a>
      <SiteNav active="industries" />

      <main id="main">
        {/* HERO */}
        <section className="pt-32 pb-12 px-5 sm:px-8" aria-labelledby="hero-heading">
          <div className="max-w-5xl mx-auto">
            <nav aria-label="Breadcrumb" className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link to="/" className="hover:text-[#042C53]">Home</Link></li>
                <li aria-hidden="true">·</li>
                <li><Link to="/local" className="hover:text-[#042C53]">Local</Link></li>
                <li aria-hidden="true">·</li>
                <li><Link to={`/local/${city.slug}/voice-agents`} className="hover:text-[#042C53]">{city.displayName}</Link></li>
                <li aria-hidden="true">·</li>
                <li className="text-[#042C53]">{vertical.displayName}</li>
              </ol>
            </nav>

            <h1 id="hero-heading" className="text-[36px] sm:text-[48px] leading-[1.05] font-semibold tracking-tight text-[#042C53]">
              {vertical.displayName} for {city.displayName} businesses
            </h1>

            <p className="mt-5 text-[18px] leading-[1.55] text-[#1B3A5C] max-w-3xl">
              {city.localFlavor} {vertical.oneLine} Built around {vertical.painPoint}.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 items-center">
              <a
                href={calLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#063e75] min-h-[48px]"
              >
                {ctaCopy}
              </a>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-[#0B1B2B]/15 text-[#042C53] font-semibold text-[15px] hover:bg-[#F5F8FB] min-h-[48px]"
              >
                See pricing from {vertical.pricingAnchor}
              </Link>
            </div>
          </div>
        </section>

        {/* BUILT FOR CITY */}
        <section className="py-14 px-5 sm:px-8 bg-[#F7FAFD]" aria-labelledby="built-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="built-heading" className="text-[26px] sm:text-[32px] font-semibold text-[#042C53] mb-5">
              Built for {city.displayName}
            </h2>
            <p className="text-[16.5px] leading-[1.65] text-[#1B3A5C] mb-4">{intro}</p>
            <p className="text-[16.5px] leading-[1.65] text-[#1B3A5C] mb-4">{builtOpener}</p>
            <p className="text-[16.5px] leading-[1.65] text-[#1B3A5C] mb-4">{industryP}</p>
            <p className="text-[16.5px] leading-[1.65] text-[#1B3A5C] mb-4">{verticalColorA}</p>
            <p className="text-[16.5px] leading-[1.65] text-[#1B3A5C]">{verticalColorB}</p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-14 px-5 sm:px-8" aria-labelledby="how-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="how-heading" className="text-[26px] sm:text-[32px] font-semibold text-[#042C53] mb-3">
              How a {city.displayName} build runs
            </h2>
            <p className="text-[15.5px] text-[#1B3A5C] mb-8 max-w-3xl">{howDesc}</p>
            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {STEP_LABELS.map((step, idx) => (
                <li key={step.name} className="rounded-xl border border-[#0B1B2B]/10 p-5 bg-white">
                  <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">Step {idx + 1}</div>
                  <div className="text-[18px] font-semibold text-[#042C53] mb-1.5">{step.name}</div>
                  <p className="text-[14.5px] leading-[1.55] text-[#1B3A5C]">
                    {step.body.replace("{city}", city.displayName)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PRICING ANCHOR */}
        <section className="py-14 px-5 sm:px-8 bg-[#042C53] text-white" aria-labelledby="pricing-heading">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 items-center">
              <div>
                <h2 id="pricing-heading" className="text-[26px] sm:text-[32px] font-semibold mb-3">
                  {vertical.displayName} pricing for {city.displayName}
                </h2>
                <p className="text-[15.5px] leading-[1.6] text-white/85 mb-5">
                  Flat monthly base for {vertical.buyerPersona}. Usage is metered at cost-plus and published in your contract — no surprise invoices.
                </p>
                <ul className="space-y-2">
                  {vertical.whatsIncluded.map((b) => (
                    <li key={b} className="text-[14.5px] text-white/90 flex gap-2">
                      <span aria-hidden="true">✓</span><span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-white text-[#042C53] p-7 border border-white/10">
                <div className="text-[12px] uppercase tracking-[0.2em] font-semibold text-[#185FA5]">Starting at</div>
                <div className="text-[44px] font-semibold leading-none mt-1">{vertical.pricingAnchor}</div>
                <div className="text-[13.5px] text-[#1B3A5C] mt-1">per month, flat base</div>
                <a
                  href={calLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-[#042C53] text-white font-semibold text-[14.5px] hover:bg-[#063e75] min-h-[44px]"
                >
                  {ctaCopy}
                </a>
                <Link
                  to="/pricing"
                  className="mt-2 inline-flex items-center justify-center w-full px-5 py-3 rounded-xl border border-[#042C53]/15 text-[#042C53] font-semibold text-[14.5px] hover:bg-[#F5F8FB] min-h-[44px]"
                >
                  Full pricing page
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 px-5 sm:px-8" aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto">
            <h2 id="faq-heading" className="text-[26px] sm:text-[32px] font-semibold text-[#042C53] mb-6">
              Common questions from {city.displayName} buyers
            </h2>
            <div className="space-y-5">
              {faqs.map((f, idx) => (
                <details key={idx} className="rounded-xl border border-[#0B1B2B]/10 p-5">
                  <summary className="cursor-pointer text-[16px] font-semibold text-[#042C53]">{f.q}</summary>
                  <p className="mt-3 text-[15px] leading-[1.6] text-[#1B3A5C]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="py-14 px-5 sm:px-8 bg-[#F7FAFD]" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="cta-heading" className="text-[26px] sm:text-[32px] font-semibold text-[#042C53] mb-4">
              {ctaCopy}
            </h2>
            <p className="text-[15.5px] text-[#1B3A5C] mb-6 max-w-2xl mx-auto">
              15 minutes, no slide deck. We walk through how a {vertical.displayName.toLowerCase()} would actually run inside your {city.displayName} business, then you decide.
            </p>
            <a
              href={calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#063e75] min-h-[48px]"
            >
              {ctaCopy}
            </a>
          </div>
        </section>

        {/* INTERNAL LINKS */}
        <section className="py-14 px-5 sm:px-8" aria-labelledby="related-heading">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 id="related-heading" className="text-[18px] font-semibold text-[#042C53] mb-3">
                Other verticals in {city.displayName}
              </h3>
              <ul className="space-y-2">
                {siblingVerticals.map((sv) => (
                  <li key={sv.slug}>
                    <Link className="text-[15px] text-[#185FA5] hover:text-[#042C53] underline decoration-[#185FA5]/20" to={`/local/${city.slug}/${sv.slug}`}>
                      {sv.displayName} in {city.displayName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#042C53] mb-3">
                Other cities for {vertical.displayName}
              </h3>
              <ul className="space-y-2">
                {siblingCities.map((sc) => (
                  <li key={sc.slug}>
                    <Link className="text-[15px] text-[#185FA5] hover:text-[#042C53] underline decoration-[#185FA5]/20" to={`/local/${sc.slug}/${vertical.slug}`}>
                      {vertical.displayName} in {sc.displayName}, {sc.statePostal}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <FooterV44 />
    </div>
  );
}
