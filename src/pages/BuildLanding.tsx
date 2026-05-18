// src/pages/BuildLanding.tsx — v67A
// Route: /build/:niche
// Per-niche conversion landing page reading from the playbooks registry.
// All 15 niches share the same template; the playbook supplies the content.

import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import EmbeddedDemo from "@/components/EmbeddedDemo";
import { getPlaybook } from "@/lib/playbooks";

const SITE_URL = "https://trainyouragent.com";
const CAL_URL = "https://cal.com/trainyouragent/30min";
const NAVY = "#042C53";
const BLUE = "#185FA5";
const TINT = "#E6F1FB";

export default function BuildLanding() {
  const { niche = "" } = useParams<{ niche: string }>();
  const navigate = useNavigate();
  const pb = useMemo(() => getPlaybook(niche), [niche]);

  useEffect(() => {
    if (!pb) {
      navigate("/playbooks", { replace: true });
      return;
    }
    document.title = `Live ${pb.displayName} voice + chat agent in ${pb.timeline.week4 ? "21" : "30"} days | TrainYourAgent`;

    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = `${SITE_URL}/build/${pb.slug}`;

    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content = `Custom AI voice + chat agent for ${pb.plural.toLowerCase()}. ${pb.subhead}`;
  }, [pb, navigate]);

  if (!pb) return null;

  const calUrl = `${CAL_URL}?utm_source=build&utm_campaign=${pb.slug}&utm_content=primary`;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav />
      <main className="pt-[var(--nav-height,72px)]">
        {/* HERO */}
        <section className="px-5 sm:px-8 pt-14 pb-12" style={{ background: `linear-gradient(180deg, ${TINT} 0%, #FFFFFF 100%)` }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-[12px] tracking-[0.2em] uppercase font-semibold" style={{ color: BLUE }}>
              For {pb.plural}
            </div>
            <h1
              className="mt-4 text-[34px] sm:text-[46px] md:text-[58px] leading-[1.04] font-semibold tracking-[-0.01em]"
              style={{ color: NAVY }}
            >
              Live {pb.displayName} voice + chat agent{" "}
              <span
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", color: BLUE, fontWeight: 600 }}
              >
                in 21 days.
              </span>
            </h1>
            <p className="mt-5 text-[18px] sm:text-[20px] leading-[1.55] text-[#1B3A5C] max-w-3xl">
              {pb.subhead}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={calUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full text-[15px] font-semibold"
                style={{ background: NAVY, color: "#FFFFFF" }}
              >
                Book a 30-min Zoom →
              </a>
              <Link
                to={`/playbooks/${pb.slug}`}
                className="px-6 py-3 rounded-full text-[15px] font-semibold border-2"
                style={{ borderColor: NAVY, color: NAVY }}
              >
                Read the full playbook
              </Link>
            </div>
          </div>
        </section>

        {/* STAT STRIP */}
        <section className="px-5 sm:px-8 py-10 bg-slate-50">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-4">
            {pb.heroPills.map((p, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                <div className="text-[18px] font-semibold leading-snug" style={{ color: NAVY }}>
                  {p}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EMBEDDED DEMO */}
        <section className="px-5 sm:px-8 py-14">
          <div className="max-w-3xl mx-auto">
            <div className="text-[12px] tracking-[0.18em] uppercase font-semibold mb-3" style={{ color: BLUE }}>
              Live demo
            </div>
            <h2 className="text-[26px] sm:text-[32px] font-semibold leading-tight mb-2" style={{ color: NAVY }}>
              Try the {pb.displayName} agent right now.
            </h2>
            <p className="text-[15px] text-slate-700 mb-6 leading-relaxed">
              Configured for your industry — no signup, no email gate. Type
              what a real customer would say.
            </p>
            <EmbeddedDemo
              mode="simulator"
              nicheLabel={pb.demoLabel}
              openingMessage={pb.demoOpener}
            />
          </div>
        </section>

        {/* INDUSTRY DATA */}
        <section className="px-5 sm:px-8 py-14 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[26px] sm:text-[32px] font-semibold mb-2" style={{ color: NAVY }}>
              Real industry data
            </h2>
            <p className="text-[14.5px] text-slate-600 mb-6">
              We don't invent numbers. Every figure cites a public source.
            </p>
            <ul className="space-y-4">
              {pb.stats.slice(0, 4).map((s, i) => (
                <li key={i} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="text-[14.5px] leading-[1.6] text-slate-800">{s.label}</div>
                  <div className="mt-2 text-[12px] text-slate-500 italic">— {s.source}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="px-5 sm:px-8 py-14">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-[26px] sm:text-[32px] font-semibold mb-6" style={{ color: NAVY }}>
              What's included in your build
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {pb.useCases.slice(0, 3).map((u, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="text-[11px] uppercase tracking-[0.16em] font-semibold mb-2" style={{ color: BLUE }}>
                    Use case {i + 1}
                  </div>
                  <div className="text-[17px] font-semibold leading-snug mb-3" style={{ color: NAVY }}>
                    {u.title}
                  </div>
                  <div className="text-[13.5px] text-slate-700 leading-relaxed mb-3">
                    {u.howAi}
                  </div>
                  <div className="text-[12px] text-slate-500">
                    <span className="font-semibold">Stack:</span> {u.stack}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LEAD FORM + CTA */}
        <section className="px-5 sm:px-8 py-16 text-center" style={{ background: NAVY, color: "#FFFFFF" }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-[28px] sm:text-[36px] font-semibold leading-tight">
              Ready to ship a live {pb.displayName} agent in 21 days?
            </h2>
            <p className="mt-3 text-[16px] opacity-90">
              30-min Zoom. We diagnose your #1 lever, scope the build, and
              you walk away with the timeline either way.
            </p>
            <a
              href={calUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center mt-7 px-7 py-3 rounded-full text-[15px] font-semibold"
              style={{ background: "#FFFFFF", color: NAVY }}
            >
              Book your 30-min Zoom →
            </a>
            <div className="mt-4 text-[12px] opacity-80">
              Or email{" "}
              <a href="mailto:hello@trainyouragent.com" className="underline">hello@trainyouragent.com</a>
            </div>
          </div>
        </section>
      </main>
      <FooterV44 />
    </div>
  );
}
