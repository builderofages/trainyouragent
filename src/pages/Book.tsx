// src/pages/Book.tsx — v48
// Polished booking page wrapping the Cal.com embed.
// - Hero above the embed with trust pills.
// - Side rail (desktop) with a mini Wall-of-Promises.
// - "What happens after you book" 3-step strip below.
// - Dynamic OG image.

import { useEffect } from "react";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import CalEmbed from "@/components/CalEmbed";
import { ogUrl, injectOgMeta } from "@/lib/og";
// v53: niche-aware booking copy
import { useVisitor } from "@/lib/visitorContext";
import { getPlaybook } from "@/lib/playbooks";
// v54: Hormozi-style risk reversal (4 promises)
import RiskReversalBlock from "@/components/RiskReversalBlock";

const SITE_URL = "https://trainyouragent.com";

const TRUST_PILLS = [
  "No card required",
  "No obligation",
  "4-hour response if you miss it",
];

const AFTER_BOOK = [
  {
    n: "01",
    h: "Calendar invite + Zoom link",
    b: "You get a confirmed invite in your inbox in under 30 seconds. Add it to your calendar, done.",
  },
  {
    n: "02",
    h: "Short prep doc the night before",
    b: "Two pages, max. The five questions we'll cover, plus a one-pager on how the build phase actually runs.",
  },
  {
    n: "03",
    h: "The call",
    b: "30 minutes with our team — no SDR layer. We listen to three of your existing calls and write the scope back to you the same day.",
  },
];

const PROMISES = [
  "We answer every voicemail within 4 business hours, every weekday.",
  "We send a written scope after every discovery call — even if we don't end up working together.",
  "We don't run an SDR layer. The first call is with a real builder.",
];

export default function Book() {
  const { niche } = useVisitor();
  const playbook = niche ? getPlaybook(niche) : undefined;
  const nicheName = playbook?.displayName || "";
  // 3 niche-specific Day-1 promises pulled from the playbook comparison rows.
  const nichePromises = playbook
    ? playbook.comparison.slice(0, 3).map((c) => `${c.row}: ${c.withTya}`)
    : null;

  useEffect(() => {
    const url = `${SITE_URL}/book`;
    injectOgMeta({
      title: "Book a 30-min build call — TrainYourAgent",
      description:
        "Pick a 30-min slot — Tampa Bay or Zoom. No card, no obligation. You walk through your call patterns with a real builder, not an SDR.",
      url,
      ogImage: ogUrl({
        title: "Book a 30-min build call",
        subtitle: "Real builder, no SDR layer. Tampa Bay or Zoom.",
        type: "page",
        badge: "BOOK",
      }),
      ogType: "website",
    });

    // load brand fonts if not present
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>
      <SiteNav active="pricing" />

      <main id="main" className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          {/* HERO */}
          <section className="text-center mb-10">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
              {playbook ? `Book a ${nicheName} build call` : "Book a call"}
            </div>
            <h1 className="text-[32px] sm:text-[48px] md:text-[60px] leading-[1.06] sm:leading-[1.04] tracking-tight font-semibold text-[#042C53] max-w-4xl mx-auto">
              {playbook ? (
                <>
                  30 minutes that turn into{" "}
                  <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                    your next 12 months of {nicheName.toLowerCase()} revenue captured.
                  </span>
                </>
              ) : (
                <>
                  30 minutes that turn into{" "}
                  <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                    your next 12 months of revenue captured.
                  </span>
                </>
              )}
            </h1>
            <p className="mt-5 text-[17px] sm:text-[19px] text-slate-700 max-w-2xl mx-auto leading-relaxed">
              {playbook
                ? `Walk through the missed calls, after-hours leads, and unfollowed-up contacts costing you ${nicheName.toLowerCase()} revenue today. Leave with a written scope, a real number, and a 21-day delivery date — in your inbox the same day.`
                : "Walk through the missed calls, after-hours leads, and unfollowed-up contacts costing you revenue today. Leave with a written scope, a real number, and a 21-day delivery date — in your inbox the same day."}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              {TRUST_PILLS.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#E6F1FB] border border-[#185FA5]/15 text-[#042C53] text-[13px] font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
            {/* v54: real scarcity — quarterly build cap, honest about why */}
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[12.5px] text-amber-900">
              <span aria-hidden="true">•</span>
              Limited to 12 new builds per quarter — our team personally scopes every one.
            </div>
          </section>

          {/* EMBED + SIDE RAIL */}
          <section className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-6 items-start">
            <div>
              <CalEmbed height={780} />
            </div>
            <aside
              className="rounded-3xl bg-[#042C53] text-white p-6 sm:p-7 lg:sticky lg:top-28"
              aria-label="Day-1 promises"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#9CC4EC] font-semibold mb-2">
                Day-1 promises
              </div>
              <h2 className="text-[22px] font-semibold leading-snug mb-5">
                What you can hold us to from the first call.
              </h2>
              <ul className="space-y-4">
                {(nichePromises || PROMISES).map((p, i) => (
                  <li key={i} className="flex gap-3 text-[14.5px] leading-snug text-white/90">
                    <span
                      aria-hidden="true"
                      className="flex-shrink-0 w-6 h-6 rounded-full bg-[#22A36C] text-white flex items-center justify-center text-[12px] font-bold"
                    >
                      ✓
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-white/15 text-[13px] text-white/70 leading-snug">
                If you miss the call, no penalty — you can re-book any open slot.
                We don't hold a no-show against you.
              </div>
            </aside>
          </section>

          {/* v54: RISK REVERSAL — four promises in plain English */}
          <section className="mt-12">
            <RiskReversalBlock variant="light" />
          </section>

          {/* AFTER BOOK */}
          <section className="mt-16">
            <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
              What happens after you book
            </div>
            <h2 className="text-[24px] sm:text-[30px] md:text-[34px] leading-tight font-semibold text-[#042C53] mb-7 max-w-3xl">
              Three concrete steps.{" "}
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                No surprises.
              </span>
            </h2>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AFTER_BOOK.map((s) => (
                <li
                  key={s.n}
                  className="rounded-2xl bg-white border border-slate-200 p-6"
                >
                  <div className="text-[11px] font-mono tracking-wide text-[#185FA5] mb-1">
                    {s.n}
                  </div>
                  <div className="text-[17px] font-semibold text-[#042C53] mb-1.5 leading-snug">
                    {s.h}
                  </div>
                  <div className="text-[14px] text-slate-700 leading-relaxed">{s.b}</div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>

      <FooterV44 />
    </div>
  );
}
