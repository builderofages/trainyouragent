// src/pages/LocationPage.tsx
// Programmatic SEO landing page: /:vertical/:city
// 10 verticals x 20 metros = 200 unique LPs. All copy comes from the content
// map at src/content/locations.ts. Schema.org LocalBusiness + Service +
// FAQPage emitted to <head>. SiteNav for consistent nav + a11y. Skip-to-
// content link at the top, semantic landmarks, focus rings preserved.

import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import {
  CITIES,
  VERTICALS,
  getCityBySlug,
  getVerticalBySlug,
  operatorCountFor,
} from "@/content/locations";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const HERO_PHONE_DISPLAY = "(813) 555-0142";
const HERO_PHONE_TEL = "+18135550142";
const SITE_URL = "https://trainyouragent.com";

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
        focusable="false"
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

const LocationPage = () => {
  const { vertical = "", city = "" } = useParams<{ vertical: string; city: string }>();
  const nav = useNavigate();
  const v = getVerticalBySlug(vertical);
  const c = getCityBySlug(city);

  // If either segment is invalid, fall back to the vertical hub or solutions.
  useEffect(() => {
    if (!v || !c) {
      nav(v ? `/${vertical}` : "/solutions", { replace: true });
    }
  }, [v, c, vertical, nav]);

  const proofCount = useMemo(
    () => (v && c ? operatorCountFor(v.slug, c.slug) : 0),
    [v, c]
  );

  useEffect(() => {
    if (typeof document === "undefined" || !v || !c) return;

    const title = `AI voice agents for ${v.nounPlural} in ${c.name}, ${c.state} | TrainYourAgent`;
    const desc = `${v.label} AI agents built for ${c.name} ${v.nounPlural}. ${v.outcome} Trusted by ${proofCount}+ ${v.serviceWord} across the ${c.region}.`;
    const url = `${SITE_URL}/${v.slug}/${c.slug}`;
    const og = `${SITE_URL}/api/og?title=${encodeURIComponent(`${v.label} AI agents · ${c.name}, ${c.state}`)}`;

    document.title = title;

    const setMeta = (selector: string, attr: "name" | "property", key: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setMeta(`meta[name='description']`, "name", "description", desc);
    setMeta(`meta[property='og:title']`, "property", "og:title", title);
    setMeta(`meta[property='og:description']`, "property", "og:description", desc);
    setMeta(`meta[property='og:url']`, "property", "og:url", url);
    setMeta(`meta[property='og:image']`, "property", "og:image", og);
    setMeta(`meta[property='og:type']`, "property", "og:type", "website");
    setMeta(`meta[name='twitter:card']`, "name", "twitter:card", "summary_large_image");
    setMeta(`meta[name='twitter:title']`, "name", "twitter:title", title);
    setMeta(`meta[name='twitter:description']`, "name", "twitter:description", desc);
    setMeta(`meta[name='twitter:image']`, "name", "twitter:image", og);

    // Canonical
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // JSON-LD: LocalBusiness + Service + FAQPage + BreadcrumbList
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "@id": `${url}#localbusiness`,
          name: `TrainYourAgent — ${v.label} AI Agents in ${c.name}`,
          url,
          telephone: HERO_PHONE_TEL,
          image: og,
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            addressLocality: c.name,
            addressRegion: c.state,
            addressCountry: "US",
          },
          areaServed: { "@type": "City", name: c.name },
        },
        {
          "@type": "Service",
          "@id": `${url}#service`,
          serviceType: `${v.label} AI Voice Agent`,
          name: `${v.label} AI voice agent in ${c.name}`,
          description: desc,
          provider: {
            "@type": "Organization",
            name: "TrainYourAgent",
            url: SITE_URL,
          },
          areaServed: { "@type": "City", name: c.name },
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}/pricing`,
            priceCurrency: "USD",
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "USD",
              price: "799",
              description: "Operators plan, monthly base",
            },
          },
        },
        {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: v.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: v.label, item: `${SITE_URL}/${v.slug}` },
            { "@type": "ListItem", position: 3, name: c.name, item: url },
          ],
        },
      ],
    };

    const id = "tya-schema-loc";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(s);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [v, c, proofCount]);

  if (!v || !c) return null;

  const otherCitiesForVertical = CITIES.filter((other) => other.slug !== c.slug).slice(0, 18);
  const otherVerticalsForCity = Object.values(VERTICALS).filter((other) => other.slug !== v.slug);

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      {/* Skip-to-content for keyboard + screen reader users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg"
      >
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
                <li><Link to={`/${v.slug}`} className="hover:text-[#042C53]">{v.label}</Link></li>
                <li aria-hidden="true">·</li>
                <li className="text-[#042C53]">{c.name}, {c.state}</li>
              </ol>
            </nav>
            <h1
              id="hero-heading"
              className="text-[42px] sm:text-[64px] leading-[1.04] tracking-tight font-semibold text-[#042C53]"
            >
              AI voice agents for {v.nounPlural} in{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                {c.name}.
              </span>
            </h1>
            <p className="mt-6 text-[18px] text-slate-700 max-w-3xl leading-relaxed">
              {v.outcome} Built for {c.name} {v.nounPlural} that need to stop missing calls and start booking work — without hiring more humans.
            </p>
            <p className="mt-4 text-[14px] text-slate-500">
              Trusted by {proofCount}+ {v.serviceWord} across the {c.region}.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener"
                className="px-6 py-4 rounded-2xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#0A3D6E] shadow-lg shadow-[#042C53]/15 focus:outline-none focus:ring-2 focus:ring-[#185FA5] focus:ring-offset-2"
              >
                {v.offer} →
              </a>
              <a
                href={`tel:${HERO_PHONE_TEL}`}
                className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] border-2 border-[#042C53]/15 hover:border-[#042C53] focus:outline-none focus:ring-2 focus:ring-[#185FA5] focus:ring-offset-2"
                aria-label={`Call us at ${HERO_PHONE_DISPLAY}`}
              >
                Call us: {HERO_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        {/* THREE PAINS */}
        <section
          className="px-5 sm:px-8 py-16 bg-[#F6FAFE] border-y border-slate-200/70"
          aria-labelledby="pains-heading"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
              What {c.name} {v.nounPlural} keep telling us
            </div>
            <h2
              id="pains-heading"
              className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-10"
            >
              Three problems we{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                solve permanently.
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {v.pains.map((p, i) => (
                <article
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl p-6"
                >
                  <div className="text-[13px] uppercase tracking-[0.16em] text-[#185FA5] font-semibold mb-2">
                    Problem {i + 1}
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#042C53] mb-3 leading-snug">{p}</h3>
                  <p className="text-[14px] text-slate-700 leading-relaxed">{v.painsLong[i]}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-5 sm:px-8 py-16" aria-labelledby="how-heading">
          <div className="max-w-5xl mx-auto">
            <h2
              id="how-heading"
              className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-6"
            >
              How {v.label.toLowerCase()} agents in {c.name}{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                actually work.
              </span>
            </h2>
            <p className="text-[16px] text-slate-700 leading-relaxed mb-8 max-w-3xl">
              We listen to your existing calls (with permission), train the agent on your scripts and pricing, wire it into the tools you already use, and go live in 7&ndash;14 business days. Same architecture for every {c.name} customer; tuned per business.
            </p>
            <Link
              to={`/${v.slug}`}
              className="inline-flex items-center gap-2 text-[#185FA5] font-medium hover:text-[#042C53] focus:outline-none focus:ring-2 focus:ring-[#185FA5] rounded"
            >
              See full {v.label} playbook →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 sm:px-8 py-16 bg-[#F6FAFE]" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
              Questions {c.name} {v.nounPlural} ask
            </div>
            <h2
              id="faq-heading"
              className="text-[28px] sm:text-[40px] leading-tight font-semibold text-[#042C53] mb-8"
            >
              FAQ
            </h2>
            <div className="space-y-3">
              {v.faq.map((f, i) => (
                <details
                  key={i}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 open:border-[#185FA5]/60 open:shadow-sm"
                >
                  <summary className="cursor-pointer flex items-start justify-between gap-4 text-[17px] font-medium text-[#042C53] focus:outline-none focus:ring-2 focus:ring-[#185FA5] rounded">
                    <span>{f.q}</span>
                    <span aria-hidden="true" className="text-[#185FA5] flex-shrink-0 text-[20px] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-4 text-[15px] text-slate-700 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              id="cta-heading"
              className="text-[32px] sm:text-[52px] leading-[1.04] tracking-tight font-semibold"
            >
              Ready to put a {v.label.toLowerCase()} agent on your{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                {c.name} phone line?
              </span>
            </h2>
            <p className="mt-5 text-[17px] text-white/85 max-w-2xl mx-auto leading-relaxed">
              Thirty-minute build call. You leave with a written plan and a real cost estimate. No deck, no upsell.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener"
                className="px-6 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#042C53]"
              >
                {v.offer} →
              </a>
              <a
                href={`tel:${HERO_PHONE_TEL}`}
                className="px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#042C53]"
              >
                Or call us: {HERO_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        {/* INTERLINKING — other cities for this vertical */}
        <section className="px-5 sm:px-8 py-16" aria-labelledby="other-cities-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="other-cities-heading" className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
              {v.label} agents in other cities
            </h2>
            <ul className="flex flex-wrap gap-2 list-none p-0">
              {otherCitiesForVertical.map((other) => (
                <li key={other.slug}>
                  <Link
                    to={`/${v.slug}/${other.slug}`}
                    className="inline-block px-3 py-1.5 rounded-full bg-[#F6FAFE] border border-slate-200 text-[13px] text-[#042C53] hover:border-[#185FA5] hover:bg-white transition focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
                  >
                    {v.label} in {other.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* INTERLINKING — other verticals in this city */}
        <section className="px-5 sm:px-8 pb-20" aria-labelledby="other-verticals-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="other-verticals-heading" className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
              Other industries we serve in {c.name}
            </h2>
            <ul className="flex flex-wrap gap-2 list-none p-0">
              {otherVerticalsForCity.map((other) => (
                <li key={other.slug}>
                  <Link
                    to={`/${other.slug}/${c.slug}`}
                    className="inline-block px-3 py-1.5 rounded-full bg-[#F6FAFE] border border-slate-200 text-[13px] text-[#042C53] hover:border-[#185FA5] hover:bg-white transition focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
                  >
                    {other.label} in {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrainLogo size={28} />
            <span className="font-semibold text-[#042C53]">TrainYourAgent</span>
            <span className="text-slate-400">— Tampa Bay, FL</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#042C53]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#042C53]">Terms</Link>
            <Link to="/security" className="hover:text-[#042C53]">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LocationPage;
