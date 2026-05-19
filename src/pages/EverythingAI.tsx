// src/pages/EverythingAI.tsx
// v73-FINAL — category map (not a 50-page hub).
//
// Captures broad "everything AI" / "AI consulting" / "AI agency" search intent
// and funnels to /train or /capabilities/* or /hire. 8 category bands.
// Honest framing: lists the 10 cornerstones + an explicit "we've built 50+
// AI workflows, tell us what you need" call to action.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { CORNERSTONES, getCornerstonesByCategory } from "@/lib/cornerstones";

const CAL_URL = "https://cal.com/trainyouragent/30min";

type Band = {
  key: string;
  name: string;
  oneLine: string;
  custom?: { label: string; href: string };
};

// Display order for the 8 category bands. We list every category we've shipped,
// in priority order. If a category has no cornerstone, we still surface it
// with the "custom build" CTA — honesty about what we offer vs what we've
// productized.
const BANDS: Band[] = [
  { key: "Agents",       name: "Agents",                 oneLine: "Voice, chat, booking, qualification, follow-up — the trained agent stack." },
  { key: "Marketing",    name: "Marketing",              oneLine: "Local SEO, review generation, retargeting, content engines, paid ad ops." },
  { key: "Training",     name: "Training",               oneLine: "Workshops, cohorts, in-house enablement. Train your team to build agents.", custom: { label: "See training programs →", href: "/train#programs" } },
  { key: "Tooling",      name: "Tooling",                oneLine: "Internal ops copilots, compliance RAG agents, knowledge-base systems." },
  { key: "Build",        name: "Build",                  oneLine: "Custom one-off AI builds — your specific business problem, scoped and shipped.", custom: { label: "Hire the operator →", href: "/hire" } },
  { key: "Computer-use", name: "Computer-use",           oneLine: "Browser automation agents for legacy systems and internal portals without APIs." },
  { key: "Consulting",   name: "Consulting",             oneLine: "AI strategy, vendor selection, roadmap, stack audits — operator-led, no SDRs.", custom: { label: "Book a strategy call →", href: CAL_URL } },
  { key: "Education",    name: "Education",              oneLine: "Long-form playbooks, deep-dive blog posts, free tools, working demos.", custom: { label: "Browse the library →", href: "/blog" } },
];

export default function EverythingAI() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const byCat = getCornerstonesByCategory();

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Everything-AI for service businesses",
    description: "The full category map of AI capabilities we ship — 10 cornerstone playbooks + custom builds.",
    url: "https://www.trainyouragent.com/everything-ai",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: CORNERSTONES.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        url: `https://www.trainyouragent.com/capabilities/${c.slug}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1F33] font-['Inter_Tight',_system-ui,_sans-serif]">
      <Helmet>
        <title>Everything-AI for service businesses — TrainYourAgent</title>
        <meta name="description" content="The full category map of AI capabilities we ship for service businesses — 10 cornerstone playbooks (voice, booking, compliance, computer-use, more) plus custom builds. Operator-led, no agency markup." />
        <link rel="canonical" href="https://www.trainyouragent.com/everything-ai" />
        <meta property="og:title" content="Everything-AI for service businesses" />
        <meta property="og:description" content="10 cornerstone playbooks + custom builds. Done by one operator who actually ships." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.trainyouragent.com/everything-ai" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <SiteNav active="solutions" />

      <main id="main">
        {/* HERO */}
        <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-5 sm:px-8 overflow-hidden border-b border-slate-100 bg-gradient-to-b from-white to-[#F6FAFE]">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-50" style={{ background: "radial-gradient(closest-side, #DCEBFA 0%, rgba(220,235,250,0) 70%)" }} />
          </div>
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F1FB] text-[#042C53] text-[11px] font-semibold tracking-[0.18em] uppercase font-mono mb-6">
              The category map
            </div>
            <h1 className="text-[40px] sm:text-[64px] md:text-[76px] leading-[1.0] tracking-tight font-semibold text-[#042C53] mb-6">
              <span className="font-serif italic">Everything-AI</span> for service businesses.
            </h1>
            <p className="text-[18px] sm:text-[22px] leading-[1.45] text-slate-700 max-w-3xl mx-auto mb-8">
              Done by one operator who actually ships. Ten cornerstone playbooks below.
              For anything you don't see — we've built 50+ AI workflows. Tell us what you need.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/train"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#042C53] text-white font-semibold hover:bg-[#0B3A6B]"
              >
                <span>See the </span>
                <span className="font-serif italic">5-step training method</span>
                <span aria-hidden>→</span>
              </Link>
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#042C53]/15 text-[#042C53] hover:bg-white"
              >
                Tell us what you need — 30 min
              </a>
            </div>
          </div>
        </section>

        {/* CATEGORY BANDS */}
        <section className="px-5 sm:px-8 py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
            {BANDS.map((b) => {
              const items = byCat[b.key] || [];
              return (
                <article key={b.key} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
                    <div>
                      <div className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#185FA5] font-mono mb-1">
                        Category
                      </div>
                      <h2 className="text-[26px] sm:text-[32px] font-semibold text-[#042C53] leading-tight">
                        {b.name}
                      </h2>
                      <p className="text-[14.5px] text-slate-700 mt-2 max-w-2xl">
                        {b.oneLine}
                      </p>
                    </div>
                    {b.custom && (
                      <a
                        href={b.custom.href}
                        {...(b.custom.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-[13.5px] text-[#042C53] hover:text-[#185FA5] font-semibold whitespace-nowrap"
                      >
                        {b.custom.label}
                      </a>
                    )}
                  </div>

                  {items.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {items.map((c) => (
                        <Link
                          key={c.slug}
                          to={`/capabilities/${c.slug}`}
                          className="block rounded-xl border border-slate-200 bg-[#F6FAFE]/50 p-4 hover:border-[#042C53]/30 hover:bg-white transition group"
                        >
                          <div className="text-[15px] font-semibold text-[#042C53] group-hover:text-[#185FA5] mb-1.5 leading-snug">
                            {c.name}
                          </div>
                          <div className="text-[12.5px] text-slate-600 leading-snug mb-2">
                            {c.shortPitch}
                          </div>
                          <div className="text-[11px] text-[#185FA5] font-semibold">
                            {c.startsAt} · ships in {c.shipsIn}
                          </div>
                        </Link>
                      ))}
                      <Link
                        to="/hire"
                        className="block rounded-xl border border-dashed border-slate-300 bg-white p-4 hover:border-[#042C53]/40 hover:bg-[#F6FAFE]/40 transition"
                      >
                        <div className="text-[14px] font-semibold text-[#042C53] mb-1">
                          More custom builds available
                        </div>
                        <div className="text-[12.5px] text-slate-600 leading-snug">
                          Hire the operator for anything not in the catalog →
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-[#F6FAFE]/30 p-5">
                      <p className="text-[14px] text-slate-700">
                        No productized playbook here yet — we ship this category as custom builds.{" "}
                        <Link to="/hire" className="text-[#042C53] font-semibold hover:text-[#185FA5]">
                          Hire the operator →
                        </Link>
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* HONEST FRAMING — bottom CTA */}
        <section className="px-5 sm:px-8 py-16 sm:py-20 bg-[#042C53] text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-[28px] sm:text-[40px] leading-tight font-semibold mb-5">
              Don't see what you need?
            </h2>
            <p className="text-[16px] sm:text-[18px] text-[#DCEBFA] mb-3">
              We've built 50+ AI workflows for clients — only the most-repeatable 10 have their own
              playbook page. Everything else is a custom build.
            </p>
            <p className="text-[15px] text-[#A8C7E8] mb-9">
              Tell us what you're trying to solve. 30-min call. Operator-direct, no SDR loop.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#042C53] font-semibold hover:bg-[#DCEBFA]"
              >
                Book a 30-min call
                <span aria-hidden>→</span>
              </a>
              <Link
                to="/train"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/30 text-white hover:bg-white/10"
              >
                See the 5-step training method
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterV44 />
    </div>
  );
}
