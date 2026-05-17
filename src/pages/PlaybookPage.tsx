// src/pages/PlaybookPage.tsx — v51B
// THE NICHE PLAYBOOK SYSTEM
// Route: /playbooks/:slug
//
// Renders any niche from the playbooks registry. Each page is ~2,000+ words
// of niche-specific operator content: industry stats, 10 AI use cases, tool
// stack table, without/with comparison, 30/60/90 timeline, scenarios, FAQs,
// embedded chat demo, related-playbook strip.

import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import EmbeddedDemo from "@/components/EmbeddedDemo";
import { getPlaybook, getRelatedPlaybooks } from "@/lib/playbooks";

const SITE_URL = "https://trainyouragent.com";
const CAL_URL = "https://cal.com/trainyouragent/30min";

export default function PlaybookPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const pb = getPlaybook(slug);
  const related = getRelatedPlaybooks(slug);

  useEffect(() => {
    if (!pb) {
      navigate("/playbooks", { replace: true });
      return;
    }
    document.title = `AI for ${pb.plural} — The Operator's Playbook | TrainYourAgent`;

    // Canonical
    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = `${SITE_URL}/playbooks/${pb.slug}`;

    // Description
    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content = `${pb.plural}: 10 AI use cases with real implementation specifics, tool stack, ${pb.timeline.week4 ? "21-day timeline" : ""}, industry data, and a live embedded demo. The operator's playbook for AI in ${pb.displayName.toLowerCase()}.`;

    // JSON-LD
    const ld = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `AI for ${pb.plural} — The Operator's Playbook`,
      description: desc.content,
      author: { "@type": "Organization", name: "TrainYourAgent" },
      publisher: {
        "@type": "Organization",
        name: "TrainYourAgent",
        url: SITE_URL,
      },
      mainEntityOfPage: `${SITE_URL}/playbooks/${pb.slug}`,
      datePublished: "2026-05-17",
      keywords: [
        `AI for ${pb.displayName.toLowerCase()}`,
        `${pb.displayName.toLowerCase()} automation`,
        `voice agent ${pb.displayName.toLowerCase()}`,
        ...pb.useCases.map((u) => u.title.toLowerCase()),
      ].join(", "),
    };
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Playbooks", item: `${SITE_URL}/playbooks` },
        { "@type": "ListItem", position: 3, name: pb.displayName, item: `${SITE_URL}/playbooks/${pb.slug}` },
      ],
    };
    // v51c: HowTo schema — playbooks are operator workflows
    const howTo = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `Deploy AI for ${pb.plural} in 21 days`,
      description: `Operator playbook for installing AI voice and chat agents in a ${pb.displayName.toLowerCase()} business.`,
      totalTime: "P21D",
      step: pb.useCases.slice(0, 6).map((u, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: u.title,
        text: u.problem || u.howAi || u.title,
      })),
    };
    let s1 = document.getElementById("playbook-ld") as HTMLScriptElement | null;
    let s2 = document.getElementById("playbook-bc") as HTMLScriptElement | null;
    let s3 = document.getElementById("playbook-howto") as HTMLScriptElement | null;
    if (!s1) {
      s1 = document.createElement("script");
      s1.id = "playbook-ld";
      s1.type = "application/ld+json";
      document.head.appendChild(s1);
    }
    if (!s2) {
      s2 = document.createElement("script");
      s2.id = "playbook-bc";
      s2.type = "application/ld+json";
      document.head.appendChild(s2);
    }
    if (!s3) {
      s3 = document.createElement("script");
      s3.id = "playbook-howto";
      s3.type = "application/ld+json";
      document.head.appendChild(s3);
    }
    s1.text = JSON.stringify(ld);
    s2.text = JSON.stringify(breadcrumb);
    s3.text = JSON.stringify(howTo);
  }, [pb, navigate]);

  if (!pb) return null;

  const calLink = `${CAL_URL}?utm_source=playbook&utm_campaign=${pb.slug}`;

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <main className="pt-[var(--nav-height,72px)]">
        {/* HERO */}
        <section className="relative px-5 sm:px-8 pt-16 pb-12 bg-gradient-to-b from-[#F7FAFD] to-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-[12px] tracking-[0.2em] uppercase text-[#185FA5] font-semibold mb-4">
              The Operator's Playbook · {pb.industrySize}
            </div>
            <h1 className="text-[36px] sm:text-[52px] leading-[1.05] font-semibold text-[#042C53] tracking-[-0.01em] mb-5">
              AI for {pb.plural}
            </h1>
            <p className="text-[18px] sm:text-[20px] leading-[1.55] text-[#1B3A5C] max-w-3xl mb-8">
              {pb.subhead}
            </p>
            <div className="flex flex-wrap gap-3">
              {pb.heroPills.map((pill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3.5 py-2 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[13px] font-semibold"
                >
                  {pill}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={calLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-[#042C53] text-white text-[15px] font-semibold hover:bg-[#0A3D6E]"
              >
                Talk to a builder
              </a>
              <a
                href="#demo"
                className="inline-flex items-center px-6 py-3 rounded-xl border border-[#042C53]/15 text-[#042C53] text-[15px] font-semibold hover:bg-[#F7FAFD]"
              >
                Try the live demo
              </a>
            </div>
          </div>
        </section>

        {/* INTRO CONTEXT */}
        <section className="px-5 sm:px-8 py-12 border-t border-[#0B1B2B]/5">
          <div className="max-w-3xl mx-auto">
            <p className="text-[18px] leading-[1.7] text-[#1B3A5C]">
              {pb.introContext}
            </p>
          </div>
        </section>

        {/* STATS */}
        <section className="px-5 sm:px-8 py-14 bg-[#F7FAFD]" aria-labelledby="stats-heading">
          <div className="max-w-4xl mx-auto">
            <div className="text-[12px] tracking-[0.2em] uppercase text-[#185FA5] font-semibold mb-3">
              The numbers
            </div>
            <h2 id="stats-heading" className="text-[28px] sm:text-[34px] font-semibold text-[#042C53] mb-8">
              Industry context, with real sources
            </h2>
            <div className="space-y-5">
              {pb.stats.map((s, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 border border-[#0B1B2B]/8"
                >
                  <p className="text-[15.5px] leading-[1.65] text-[#1B3A5C] mb-2">
                    {s.label}
                  </p>
                  <p className="text-[12.5px] text-[#185FA5] font-medium">
                    Source: {s.source}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEN USE CASES */}
        <section className="px-5 sm:px-8 py-16" aria-labelledby="usecases-heading">
          <div className="max-w-5xl mx-auto">
            <div className="text-[12px] tracking-[0.2em] uppercase text-[#185FA5] font-semibold mb-3">
              The playbook
            </div>
            <h2 id="usecases-heading" className="text-[28px] sm:text-[34px] font-semibold text-[#042C53] mb-3">
              Ten AI use cases for {pb.displayName.toLowerCase()}
            </h2>
            <p className="text-[16px] text-[#1B3A5C] mb-10 max-w-3xl">
              Each one is a concrete operational unit — the problem, how AI handles
              it, the stack you wire it to, and the outcome you should expect.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pb.useCases.map((u, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-[#0B1B2B]/10"
                >
                  <div className="text-[11px] tracking-[0.18em] uppercase text-[#185FA5] font-semibold mb-2">
                    Use case {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-[19px] font-semibold text-[#042C53] mb-3 leading-[1.3]">
                    {u.title}
                  </h3>
                  <div className="space-y-3 text-[14.5px] leading-[1.6] text-[#1B3A5C]">
                    <div>
                      <span className="text-[#042C53] font-semibold">The problem: </span>
                      {u.problem}
                    </div>
                    <div>
                      <span className="text-[#042C53] font-semibold">How AI handles it: </span>
                      {u.howAi}
                    </div>
                    <div>
                      <span className="text-[#042C53] font-semibold">What you wire it to: </span>
                      <span className="font-mono text-[13px]">{u.stack}</span>
                    </div>
                    <div>
                      <span className="text-[#042C53] font-semibold">Expected outcome: </span>
                      {u.outcome}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TOOL STACK */}
        <section className="px-5 sm:px-8 py-14 bg-[#F7FAFD]" aria-labelledby="stack-heading">
          <div className="max-w-5xl mx-auto">
            <div className="text-[12px] tracking-[0.2em] uppercase text-[#185FA5] font-semibold mb-3">
              The recommended stack
            </div>
            <h2 id="stack-heading" className="text-[28px] sm:text-[34px] font-semibold text-[#042C53] mb-8">
              What to wire it into
            </h2>
            <div className="bg-white rounded-2xl border border-[#0B1B2B]/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-[#F7FAFD] text-[#042C53]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Tool</th>
                      <th className="px-4 py-3 font-semibold">Why it fits</th>
                      <th className="px-4 py-3 font-semibold">Monthly cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pb.toolStack.map((row, i) => (
                      <tr key={i} className="border-t border-[#0B1B2B]/8">
                        <td className="px-4 py-3 text-[#185FA5] font-semibold">
                          {row.category}
                        </td>
                        <td className="px-4 py-3 text-[#042C53] font-semibold">
                          {row.tool}
                        </td>
                        <td className="px-4 py-3 text-[#1B3A5C]">{row.why}</td>
                        <td className="px-4 py-3 text-[#1B3A5C] whitespace-nowrap">
                          {row.cost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="px-5 sm:px-8 py-14" aria-labelledby="compare-heading">
          <div className="max-w-5xl mx-auto">
            <div className="text-[12px] tracking-[0.2em] uppercase text-[#185FA5] font-semibold mb-3">
              Without AI vs With TYA Agent
            </div>
            <h2 id="compare-heading" className="text-[28px] sm:text-[34px] font-semibold text-[#042C53] mb-8">
              Five places the difference shows up immediately
            </h2>
            <div className="bg-white rounded-2xl border border-[#0B1B2B]/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14.5px]">
                  <thead className="bg-[#F7FAFD] text-[#042C53]">
                    <tr>
                      <th className="px-4 py-3 font-semibold w-1/4">Lever</th>
                      <th className="px-4 py-3 font-semibold">Without AI</th>
                      <th className="px-4 py-3 font-semibold">With TYA Agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pb.comparison.map((row, i) => (
                      <tr key={i} className="border-t border-[#0B1B2B]/8">
                        <td className="px-4 py-3 text-[#042C53] font-semibold align-top">
                          {row.row}
                        </td>
                        <td className="px-4 py-3 text-[#1B3A5C] align-top">
                          {row.without}
                        </td>
                        <td className="px-4 py-3 text-[#042C53] align-top">
                          {row.withTya}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="px-5 sm:px-8 py-14 bg-[#042C53] text-white" aria-labelledby="timeline-heading">
          <div className="max-w-4xl mx-auto">
            <div className="text-[12px] tracking-[0.2em] uppercase text-[#9CC4E8] font-semibold mb-3">
              30/60/90 implementation
            </div>
            <h2 id="timeline-heading" className="text-[28px] sm:text-[34px] font-semibold mb-8">
              From kickoff to a live agent your team trusts
            </h2>
            <div className="space-y-6">
              <TimelinePhase phase="Week 1" body={pb.timeline.week1} />
              <TimelinePhase phase="Weeks 2–3" body={pb.timeline.week2to3} />
              <TimelinePhase phase="Week 4" body={pb.timeline.week4} />
              <TimelinePhase phase="Months 2–3" body={pb.timeline.month2to3} />
            </div>
          </div>
        </section>

        {/* DEMO */}
        <section id="demo" className="px-5 sm:px-8 py-16" aria-labelledby="demo-heading">
          <div className="max-w-3xl mx-auto">
            <div className="text-[12px] tracking-[0.2em] uppercase text-[#185FA5] font-semibold mb-3">
              Live embedded demo
            </div>
            <h2 id="demo-heading" className="text-[28px] sm:text-[34px] font-semibold text-[#042C53] mb-3">
              Talk to the {pb.demoLabel}
            </h2>
            <p className="text-[16px] text-[#1B3A5C] mb-8">
              This is the actual agent we ship to clients, calling the same
              <code className="mx-1 px-1.5 py-0.5 bg-[#F7FAFD] rounded text-[13px]">/api/chat</code>
              endpoint. Try the opener or type your own.
            </p>
            <EmbeddedDemo
              mode="simulator"
              nicheLabel={pb.demoLabel}
              openingMessage={pb.demoOpener}
            />
          </div>
        </section>

        {/* SCENARIOS */}
        <section className="px-5 sm:px-8 py-14 bg-[#F7FAFD]" aria-labelledby="scenarios-heading">
          <div className="max-w-4xl mx-auto">
            <div className="text-[12px] tracking-[0.2em] uppercase text-[#185FA5] font-semibold mb-3">
              How it actually runs
            </div>
            <h2 id="scenarios-heading" className="text-[28px] sm:text-[34px] font-semibold text-[#042C53] mb-8">
              Three end-to-end operational scenarios
            </h2>
            <div className="space-y-7">
              {pb.scenarios.map((s, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-[#0B1B2B]/10"
                >
                  <h3 className="text-[20px] font-semibold text-[#042C53] mb-3">
                    {s.title}
                  </h3>
                  <p className="text-[15.5px] leading-[1.7] text-[#1B3A5C]">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="px-5 sm:px-8 py-14" aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto">
            <h2 id="faq-heading" className="text-[28px] sm:text-[34px] font-semibold text-[#042C53] mb-8">
              Questions {pb.plural.toLowerCase()} actually ask
            </h2>
            <div className="space-y-4">
              {pb.faqs.map((f, i) => (
                <details
                  key={i}
                  className="rounded-xl border border-[#0B1B2B]/10 p-5 group"
                >
                  <summary className="cursor-pointer text-[16px] font-semibold text-[#042C53]">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-[15px] leading-[1.65] text-[#1B3A5C]">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING + CTA */}
        <section className="px-5 sm:px-8 py-16 bg-[#F7FAFD]" aria-labelledby="cta-heading">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-[12px] tracking-[0.2em] uppercase text-[#185FA5] font-semibold mb-3">
              Pricing
            </div>
            <h2 id="cta-heading" className="text-[28px] sm:text-[34px] font-semibold text-[#042C53] mb-4">
              Setup from $4,500. Monthly ops from $1,500.
            </h2>
            <p className="text-[16px] text-[#1B3A5C] mb-7">
              Full implementation in 21 days. No platform lock-in. Yours forever
              if you want to take it in-house.
            </p>
            <a
              href={calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-7 py-3.5 rounded-xl bg-[#042C53] text-white text-[15px] font-semibold hover:bg-[#0A3D6E]"
            >
              Talk to a builder
            </a>
          </div>
        </section>

        {/* RELATED PLAYBOOKS */}
        <section className="px-5 sm:px-8 py-14" aria-labelledby="related-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="related-heading" className="text-[22px] font-semibold text-[#042C53] mb-6">
              Related playbooks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/playbooks/${r.slug}`}
                  className="block rounded-2xl border border-[#0B1B2B]/10 p-5 hover:border-[#185FA5]/40 hover:shadow-sm transition"
                >
                  <div className="text-[11px] tracking-[0.18em] uppercase text-[#185FA5] font-semibold mb-2">
                    Playbook
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#042C53] mb-1.5">
                    AI for {r.plural}
                  </h3>
                  <p className="text-[13.5px] text-[#1B3A5C]/80 mb-3">
                    {r.industrySize}
                  </p>
                  <span className="text-[13px] text-[#185FA5] font-semibold">
                    10 use cases mapped →
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/playbooks"
                className="text-[14px] text-[#185FA5] hover:text-[#042C53] underline decoration-[#185FA5]/20 font-semibold"
              >
                See all 15 playbooks →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <FooterV44 />
    </div>
  );
}

function TimelinePhase({ phase, body }: { phase: string; body: string }) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 w-24 text-[13px] tracking-[0.15em] uppercase font-semibold text-[#9CC4E8] pt-1">
        {phase}
      </div>
      <p className="text-[15.5px] leading-[1.65] text-white/90">{body}</p>
    </div>
  );
}
