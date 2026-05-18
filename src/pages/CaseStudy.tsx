// src/pages/CaseStudy.tsx — v67A
// Route: /case-study/:slug
// Renders a single CaseStudy from the registry. If the slug isn't found, we
// redirect to the /case-studies index — there are no fake 404s for cases
// that simply don't exist yet.

import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import LoomEmbed from "@/components/LoomEmbed";
import { getCaseStudy } from "@/lib/caseStudies";

const SITE_URL = "https://trainyouragent.com";
const CAL_URL = "https://cal.com/trainyouragent/30min";
const NAVY = "#042C53";
const BLUE = "#185FA5";
const TINT = "#E6F1FB";

export default function CaseStudy() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const cs = useMemo(() => getCaseStudy(slug), [slug]);

  useEffect(() => {
    if (!cs) {
      navigate("/case-studies", { replace: true });
      return;
    }
    const title = `${cs.companyName} — ${cs.oneLineOutcome} | TrainYourAgent`;
    document.title = title;

    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = `${SITE_URL}/case-study/${cs.slug}`;

    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content = `${cs.companyName} (${cs.city}, ${cs.state}) — ${cs.oneLineOutcome}. ${cs.buildLengthDays}-day build, ${cs.agentType}.`;

    // Article + Review JSON-LD for SERP rich results.
    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${cs.companyName}: ${cs.oneLineOutcome}`,
      description: desc.content,
      author: { "@type": "Organization", name: "TrainYourAgent" },
      publisher: {
        "@type": "Organization",
        name: "TrainYourAgent",
        url: SITE_URL,
      },
      mainEntityOfPage: `${SITE_URL}/case-study/${cs.slug}`,
      datePublished: cs.closedDate,
      image: cs.photoUrl || cs.logoUrl || `${SITE_URL}/api/og?title=${encodeURIComponent(cs.companyName)}&subtitle=${encodeURIComponent(cs.oneLineOutcome)}&type=case-study`,
    };
    const reviewLd = {
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: {
        "@type": "Service",
        name: "TrainYourAgent custom AI agent build",
        provider: { "@type": "Organization", name: "TrainYourAgent", url: SITE_URL },
      },
      reviewBody: cs.quote,
      author: { "@type": "Person", name: cs.customerName, jobTitle: cs.customerTitle },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      datePublished: cs.closedDate,
    };

    let s1 = document.getElementById("ld-case-article") as HTMLScriptElement | null;
    if (!s1) {
      s1 = document.createElement("script");
      s1.type = "application/ld+json";
      s1.id = "ld-case-article";
      document.head.appendChild(s1);
    }
    s1.textContent = JSON.stringify(articleLd);

    let s2 = document.getElementById("ld-case-review") as HTMLScriptElement | null;
    if (!s2) {
      s2 = document.createElement("script");
      s2.type = "application/ld+json";
      s2.id = "ld-case-review";
      document.head.appendChild(s2);
    }
    s2.textContent = JSON.stringify(reviewLd);
  }, [cs, navigate]);

  if (!cs) return null;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav />
      <main className="pt-[var(--nav-height,72px)]">
        {/* HERO */}
        <section className="px-5 sm:px-8 pt-14 pb-10" style={{ background: `linear-gradient(180deg, ${TINT} 0%, #FFFFFF 100%)` }}>
          <div className="max-w-4xl mx-auto">
            <Link to="/case-studies" className="text-[12px] tracking-[0.18em] uppercase font-semibold" style={{ color: BLUE }}>
              ← Case studies
            </Link>
            <div className="mt-5 flex items-center gap-4 flex-wrap">
              {cs.logoUrl && (
                <img src={cs.logoUrl} alt={`${cs.companyName} logo`} className="h-10 w-auto object-contain" loading="lazy" />
              )}
              <div className="text-[14px] uppercase tracking-[0.14em] font-semibold" style={{ color: NAVY }}>
                {cs.companyName} · {cs.city}, {cs.state}
              </div>
            </div>
            <h1
              className="mt-4 text-[32px] sm:text-[44px] md:text-[54px] leading-[1.05] font-semibold tracking-[-0.01em]"
              style={{ color: NAVY }}
            >
              {cs.oneLineOutcome}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[13px] text-slate-600">
              <span className="px-3 py-1 rounded-full font-semibold" style={{ background: "#FFFFFF", border: `1px solid ${BLUE}`, color: NAVY }}>
                {cs.buildLengthDays}-day build
              </span>
              <span className="px-3 py-1 rounded-full font-semibold" style={{ background: "#FFFFFF", border: `1px solid ${BLUE}`, color: NAVY }}>
                {cs.agentType}
              </span>
              <span className="px-3 py-1 rounded-full font-semibold" style={{ background: "#FFFFFF", border: `1px solid ${BLUE}`, color: NAVY }}>
                Closed {new Date(cs.closedDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        </section>

        {/* QUOTE + PHOTO */}
        <section className="px-5 sm:px-8 py-12">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-[160px_1fr] gap-6 items-start">
            <div className="flex-shrink-0">
              {cs.photoUrl ? (
                <img src={cs.photoUrl} alt={cs.customerName} className="w-40 h-40 rounded-full object-cover ring-4" style={{ ringColor: TINT } as React.CSSProperties} loading="lazy" />
              ) : (
                <div className="w-40 h-40 rounded-full flex items-center justify-center text-[40px] font-semibold" style={{ background: TINT, color: NAVY }}>
                  {(cs.customerName || "?").split(/\s+/).map((s) => s[0]).slice(0, 2).join("")}
                </div>
              )}
            </div>
            <div>
              <blockquote
                className="text-[20px] sm:text-[24px] leading-[1.4] font-medium"
                style={{ color: NAVY, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
              >
                &ldquo;{cs.quote}&rdquo;
              </blockquote>
              <div className="mt-4 text-[14px] font-semibold" style={{ color: NAVY }}>
                {cs.customerName}
              </div>
              <div className="text-[13px] text-slate-600">
                {cs.customerTitle}, {cs.companyName}
              </div>
            </div>
          </div>
        </section>

        {/* BEFORE / AFTER TABLE */}
        <section className="px-5 sm:px-8 py-12 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[24px] sm:text-[30px] font-semibold mb-6" style={{ color: NAVY }}>
              Before vs after
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="text-left" style={{ background: TINT, color: NAVY }}>
                    <th className="p-3 font-semibold">Metric</th>
                    <th className="p-3 font-semibold">Before</th>
                    <th className="p-3 font-semibold">After</th>
                    <th className="p-3 font-semibold">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {cs.metrics.map((m, i) => (
                    <tr key={i} className="border-t border-slate-200">
                      <td className="p-3 text-slate-700">{m.label}</td>
                      <td className="p-3 text-slate-700">{m.before}</td>
                      <td className="p-3 font-semibold" style={{ color: NAVY }}>{m.after}</td>
                      <td className="p-3 font-semibold" style={{ color: BLUE }}>{m.delta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* TECH STACK */}
        <section className="px-5 sm:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[24px] sm:text-[30px] font-semibold mb-5" style={{ color: NAVY }}>
              Technical stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {cs.technicalStack.map((t) => (
                <span
                  key={t}
                  className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold border"
                  style={{ borderColor: BLUE, color: NAVY, background: "#FFFFFF" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT WE BUILT */}
        {(cs.narrativeIntro || cs.narrativeBody) && (
          <section className="px-5 sm:px-8 py-12 bg-slate-50">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-[24px] sm:text-[30px] font-semibold mb-5" style={{ color: NAVY }}>
                What we built
              </h2>
              {cs.narrativeIntro && (
                <p className="text-[16.5px] leading-[1.65] text-slate-800 mb-5">
                  {cs.narrativeIntro}
                </p>
              )}
              {cs.narrativeBody && (
                <p className="text-[16.5px] leading-[1.65] text-slate-800">
                  {cs.narrativeBody}
                </p>
              )}
            </div>
          </section>
        )}

        {/* LOOM */}
        {cs.loomUrl !== undefined && (
          <section className="px-5 sm:px-8 py-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-[24px] sm:text-[30px] font-semibold mb-3" style={{ color: NAVY }}>
                Walk-through
              </h2>
              <LoomEmbed url={cs.loomUrl || ""} title={`${cs.companyName} build walkthrough`} />
            </div>
          </section>
        )}

        {/* RESULTS BIG-NUMBER CARDS */}
        <section className="px-5 sm:px-8 py-12 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[24px] sm:text-[30px] font-semibold mb-6" style={{ color: NAVY }}>
              Results
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {cs.metrics.map((m, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500 mb-2">
                    {m.label}
                  </div>
                  <div className="text-[34px] font-semibold leading-none" style={{ color: NAVY }}>
                    {m.after}
                  </div>
                  <div className="mt-2 text-[13px] font-semibold" style={{ color: BLUE }}>
                    {m.delta} vs {m.before}
                  </div>
                </div>
              ))}
            </div>
            {cs.honestNote && (
              <div className="mt-6 text-[12.5px] text-slate-600 leading-relaxed">
                <span className="font-semibold" style={{ color: NAVY }}>Disclosure:</span> {cs.honestNote}
              </div>
            )}
          </div>
        </section>

        {/* CTA FOOTER */}
        <section className="px-5 sm:px-8 py-14 text-center" style={{ background: NAVY, color: "#FFFFFF" }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[26px] sm:text-[34px] font-semibold leading-tight">
              Want a build like this for your business?
            </h2>
            <p className="mt-3 text-[16px] opacity-90">
              30-min Zoom — we'll diagnose the #1 AI lever for your operation.
            </p>
            <a
              href={`${CAL_URL}?utm_source=case-study&utm_campaign=${cs.slug}&utm_content=footer`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center mt-6 px-6 py-3 rounded-full text-[15px] font-semibold"
              style={{ background: "#FFFFFF", color: NAVY }}
            >
              Book a 30-min Zoom →
            </a>
          </div>
        </section>
      </main>
      <FooterV44 />
    </div>
  );
}
