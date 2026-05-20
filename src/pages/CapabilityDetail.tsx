// src/pages/CapabilityDetail.tsx
// v73-FINAL — renders any /capabilities/:slug cornerstone playbook page.
//
// One of 10 deep cornerstone pages. Each is 600–900 words of real,
// specific, tool-naming, ROI-grounded content (no AI marketing fluff).
// Data sourced from src/lib/cornerstones.ts.

import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { getCornerstone, CORNERSTONES, type Cornerstone } from "@/lib/cornerstones";

const CAL_URL = "https://cal.com/trainyouragent/30min";

function ServiceSchema({ c }: { c: Cornerstone }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: c.name,
    serviceType: c.schema.serviceType,
    description: c.shortPitch,
    provider: {
      "@type": "Organization",
      name: "TrainYourAgent",
      url: "https://www.trainyouragent.com",
    },
    areaServed: c.schema.areaServed,
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: c.startsAt,
        priceCurrency: "USD",
      },
    },
    url: `https://www.trainyouragent.com/capabilities/${c.slug}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // v76-B: per-page dynamic OG image. Hits /api/og with this cornerstone's
  // name + category so every /capabilities/* page shares a distinct preview
  // card on LinkedIn / Twitter / Slack, instead of all 10 falling back to
  // the static site-wide /og-fallback.png.
  const ogImage =
    `https://www.trainyouragent.com/api/og` +
    `?title=${encodeURIComponent(c.name)}` +
    `&eyebrow=${encodeURIComponent(c.category)}` +
    `&kicker=${encodeURIComponent(c.shortPitch)}` +
    `&type=page`;

  return (
    <Helmet>
      <title>{c.name} — TrainYourAgent</title>
      <meta name="description" content={c.shortPitch} />
      <link rel="canonical" href={`https://www.trainyouragent.com/capabilities/${c.slug}`} />
      <meta property="og:title" content={`${c.name} — TrainYourAgent`} />
      <meta property="og:description" content={c.shortPitch} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://www.trainyouragent.com/capabilities/${c.slug}`} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${c.name} — TrainYourAgent`} />
      <meta name="twitter:description" content={c.shortPitch} />
      <meta name="twitter:image" content={ogImage} />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
  );
}

export default function CapabilityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const c = slug ? getCornerstone(slug) : undefined;

  useEffect(() => {
    if (c) window.scrollTo(0, 0);
  }, [c]);

  if (!c) {
    // Show a soft 404 inside the site shell — bounce to /everything-ai which lists all 10.
    return <Navigate to="/everything-ai" replace />;
  }

  const related = c.relatedSlugs
    .map((s) => CORNERSTONES.find((x) => x.slug === s))
    .filter(Boolean) as Cornerstone[];

  return (
    <div className="min-h-screen bg-white text-[#0B1F33] font-['Inter_Tight',_system-ui,_sans-serif]">
      <ServiceSchema c={c} />
      <SiteNav active="solutions" />

      <main id="main">
        {/* HERO */}
        <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 px-5 sm:px-8 overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-50" style={{ background: "radial-gradient(closest-side, #DCEBFA 0%, rgba(220,235,250,0) 70%)" }} />
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] font-mono mb-4">
              {c.hero.eyebrow}
            </div>
            <h1 className="text-[34px] sm:text-[52px] md:text-[60px] leading-[1.04] tracking-tight font-semibold text-[#042C53] mb-5">
              {c.hero.h1}
            </h1>
            <p className="text-[17px] sm:text-[20px] leading-[1.5] text-slate-700 max-w-3xl mb-8">
              {c.hero.subhead}
            </p>

            {/* Trust strip — ships in / starts at / ongoing */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[13px] sm:text-[14px] text-slate-700 mb-8">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C]" />
                <span><strong className="text-[#042C53]">Ships in:</strong> {c.shipsIn}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C]" />
                <span><strong className="text-[#042C53]">Starts at:</strong> {c.startsAt}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22A36C]" />
                <span><strong className="text-[#042C53]">Ongoing:</strong> {c.ongoingCost}</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#042C53] text-white font-semibold hover:bg-[#0B3A6B]"
              >
                Talk to the operator — book 30 min
                <span aria-hidden>→</span>
              </a>
              <Link
                to="/train"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#042C53]/15 text-[#042C53] hover:bg-[#F6FAFE]"
              >
                <span>See the </span>
                <span className="font-serif italic">5-step training method</span>
              </Link>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="px-5 sm:px-8 py-16 sm:py-20 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] font-mono mb-3">
              The problem
            </div>
            <h2 className="text-[26px] sm:text-[34px] leading-tight font-semibold text-[#042C53] mb-6">
              What this actually solves
            </h2>
            <p className="text-[16px] sm:text-[17px] leading-[1.7] text-slate-800 whitespace-pre-line">
              {c.problem}
            </p>
          </div>
        </section>

        {/* SOLUTION */}
        <section className="px-5 sm:px-8 py-16 sm:py-20 bg-[#F6FAFE] border-y border-slate-200/70">
          <div className="max-w-3xl mx-auto">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] font-mono mb-3">
              How we build it
            </div>
            <h2 className="text-[26px] sm:text-[34px] leading-tight font-semibold text-[#042C53] mb-6">
              The actual stack, the actual flow
            </h2>
            <p className="text-[16px] sm:text-[17px] leading-[1.7] text-slate-800 whitespace-pre-line">
              {c.solution}
            </p>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="px-5 sm:px-8 py-16 sm:py-20 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] font-mono mb-3">
              Deliverables
            </div>
            <h2 className="text-[26px] sm:text-[34px] leading-tight font-semibold text-[#042C53] mb-8">
              What you get
            </h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {c.whatYouGet.map((item, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <span aria-hidden className="mt-0.5 inline-flex w-6 h-6 shrink-0 items-center justify-center rounded-full bg-[#22A36C] text-white text-[12px] font-bold">✓</span>
                  <span className="text-[15px] leading-snug text-slate-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ROI */}
        <section className="px-5 sm:px-8 py-16 sm:py-20 bg-[#042C53] text-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#A8C7E8] font-mono mb-3">
              ROI math
            </div>
            <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold mb-6 font-serif italic">
              {c.roi.headline}
            </h2>
            <ul className="space-y-3 mb-8">
              {c.roi.math.map((m, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] sm:text-[16px] text-[#DCEBFA]">
                  <span aria-hidden className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#A8C7E8] shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-xl border border-white/15 bg-white/5 p-5">
              <div className="text-[11px] uppercase tracking-[0.18em] font-mono text-[#A8C7E8] mb-2">Real example</div>
              <p className="text-[16px] leading-[1.6] text-white">{c.roi.example}</p>
            </div>
          </div>
        </section>

        {/* PRICING + CTA */}
        <section className="px-5 sm:px-8 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] font-mono mb-3">
              Pricing
            </div>
            <h2 className="text-[26px] sm:text-[34px] leading-tight font-semibold text-[#042C53] mb-6">
              <span className="font-serif italic">Starts at</span> {c.startsAt}. Ongoing {c.ongoingCost}. Ships in {c.shipsIn}.
            </h2>
            <p className="text-[15px] text-slate-700 max-w-2xl mx-auto mb-8">
              Custom-trained on your business — your tone, your offer, your edge cases.
              Every build comes with a 30-day money-back if it doesn't deliver.
            </p>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#042C53] text-white font-semibold hover:bg-[#0B3A6B]"
            >
              Talk to the operator — book 30 min
              <span aria-hidden>→</span>
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 sm:px-8 py-16 sm:py-20 bg-[#F6FAFE] border-y border-slate-200/70">
          <div className="max-w-3xl mx-auto">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] font-mono mb-3">
              FAQ
            </div>
            <h2 className="text-[26px] sm:text-[34px] leading-tight font-semibold text-[#042C53] mb-8">
              What people ask
            </h2>
            <div className="space-y-4">
              {c.faqs.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-slate-200 bg-white p-5 open:shadow-sm"
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-3 font-semibold text-[15px] sm:text-[16px] text-[#042C53]">
                    <span>{f.q}</span>
                    <span className="text-[#185FA5] group-open:rotate-45 transition-transform shrink-0" aria-hidden>+</span>
                  </summary>
                  <p className="mt-3 text-[14px] sm:text-[15px] leading-[1.65] text-slate-700">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="px-5 sm:px-8 py-16 sm:py-20 bg-white">
            <div className="max-w-5xl mx-auto">
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] font-mono mb-3">
                Related cornerstones
              </div>
              <h2 className="text-[26px] sm:text-[32px] leading-tight font-semibold text-[#042C53] mb-8">
                What pairs well with this
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/capabilities/${r.slug}`}
                    className="block rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#042C53]/30 hover:shadow-sm transition group"
                  >
                    <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#185FA5] mb-2">
                      {r.category}
                    </div>
                    <div className="text-[16px] font-semibold text-[#042C53] group-hover:text-[#185FA5] mb-2">
                      {r.name}
                    </div>
                    <div className="text-[13px] text-slate-600 leading-snug">
                      {r.shortPitch}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-10 text-center">
                <Link
                  to="/everything-ai"
                  className="inline-flex items-center gap-2 text-[#042C53] hover:text-[#185FA5] text-[15px] sm:text-[16px]"
                >
                  See all 10 cornerstone playbooks
                  <span aria-hidden className="text-[#185FA5]">→</span>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <FooterV44 />
    </div>
  );
}
