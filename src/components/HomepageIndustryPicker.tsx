// src/components/HomepageIndustryPicker.tsx — v227
//
// Surfaces the 25 /template/[niche] money pages directly on the homepage.
// Without this, the entire close-tool gallery is invisible to anyone who
// lands on trainyouragent.com from organic/paid and never digs into
// Resources > Industry websites. This is the 10x conversion lever.
//
// UX:
//   - 25-niche bento grid w/ HD per-niche hero image
//   - Hover: lift + glow + "Open preview" overlay
//   - Click: jumps straight to /template/<niche>
//   - Also a "personalize in 5 sec" input field for any niche
//
// The component is brand-pure: navy + cream + Playfair italic accents.

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ACTIVE_NICHE_SITES } from "@/lib/nicheSiteTemplates";
import { nicheImageUrl } from "@/lib/nicheImages";
import { fireEvent } from "@/lib/event";

const NAVY = "#042C53";
const TEXT = "#0B1B2B";
const ACCENT = "#185FA5";

export default function HomepageIndustryPicker() {
  const nav = useNavigate();
  const [biz, setBiz] = useState("");
  const [pickedNiche, setPickedNiche] = useState<string>("hvac");

  const sites = useMemo(() => ACTIVE_NICHE_SITES, []);
  const featured = useMemo(() => sites.slice(0, 12), [sites]);
  const rest = useMemo(() => sites.slice(12), [sites]);

  function go(nicheId: string, withCompany?: string) {
    const co = (withCompany ?? biz).trim();
    const qs = co ? `?company=${encodeURIComponent(co)}` : "";
    void fireEvent("homepage_industry_picker_click", { niche: nicheId, hasCompany: !!co });
    nav(`/template/${nicheId}${qs}`);
  }

  return (
    <section
      className="relative px-5 sm:px-8 py-16 sm:py-24 bg-white border-y border-slate-200/70"
      aria-labelledby="industry-picker-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase font-mono mb-3" style={{ color: ACCENT }}>
            25 industry-ready websites · live in 5 seconds
          </div>
          <h2
            id="industry-picker-heading"
            className="text-[30px] sm:text-[44px] md:text-[54px] leading-[1.04] tracking-tight font-semibold mb-4"
            style={{ color: NAVY }}
          >
            See your business as an{" "}
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 }}>
              AI-powered website.
            </span>
          </h2>
          <p className="text-[16px] sm:text-[18px] text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Pick your industry. Drop your business name. Watch the AI receptionist + chat agent + full site appear with <em>your</em> brand on it. No signup. Free preview.
          </p>
        </div>

        {/* Personalize bar — works for ANY niche */}
        <form
          onSubmit={(e) => { e.preventDefault(); go(pickedNiche); }}
          className="max-w-3xl mx-auto mb-10 sm:mb-12 p-3 sm:p-4 rounded-2xl bg-white border-2"
          style={{ borderColor: "rgba(24,95,165,0.18)", boxShadow: "0 18px 44px -22px rgba(4,44,83,0.18)" }}
        >
          <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
            <input
              value={biz}
              onChange={(e) => setBiz(e.target.value)}
              placeholder="Your business name"
              className="flex-1 px-4 py-3.5 rounded-xl border outline-none text-[15px] font-semibold"
              style={{ borderColor: "rgba(4,44,83,0.14)", color: NAVY, background: "#FAFBFC" }}
            />
            <select
              value={pickedNiche}
              onChange={(e) => setPickedNiche(e.target.value)}
              className="px-4 py-3.5 rounded-xl border outline-none text-[14.5px] font-semibold cursor-pointer"
              style={{ borderColor: "rgba(4,44,83,0.14)", color: NAVY, background: "#FAFBFC", minWidth: 200 }}
            >
              {sites.map((s) => (
                <option key={s.id} value={s.id}>{s.niche}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl text-white text-[15px] font-bold whitespace-nowrap transition-transform"
              style={{ background: NAVY, boxShadow: "0 14px 30px -10px rgba(4,44,83,0.45)" }}
            >
              See my site →
            </button>
          </div>
          <div className="text-[11.5px] text-slate-500 mt-2.5 px-1">
            Loads instantly. Your name + city show on a fully working AI receptionist + chat demo.
          </div>
        </form>

        {/* 12-card featured grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {featured.map((s) => (
            <Link
              key={s.id}
              to={`/template/${s.id}`}
              onClick={() => void fireEvent("homepage_industry_card_click", { niche: s.id })}
              className="group relative block rounded-xl overflow-hidden border border-slate-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ aspectRatio: "4/5", background: `linear-gradient(160deg, ${s.accent} 0%, ${s.accent}CC 60%, #042C53 100%)` }}
            >
              {/* v248: editorial Playfair italic banner ALWAYS rendered behind the
                  photo — when pollinations 404s, the card still shows a
                  premium magazine-cover layout instead of an empty white box. */}
              <div className="absolute inset-0 flex items-center justify-center px-3 text-center pointer-events-none">
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500, color: "#fff", fontSize: "clamp(22px, 3.2vw, 32px)", lineHeight: 0.98, letterSpacing: "-0.012em", textShadow: "0 2px 18px rgba(0,0,0,0.35)" }}>
                  {s.niche}
                </div>
              </div>
              <img
                src={nicheImageUrl(s.id, 360, 450)}
                alt={`${s.niche} AI receptionist website preview`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                style={{ zIndex: 1 }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              {/* gradient overlay so text is always readable */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(4,44,83,0.05) 0%, rgba(4,44,83,0.15) 45%, rgba(4,44,83,0.78) 100%)", zIndex: 2 }}
              />
              {/* labels — always render above all layers */}
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-white" style={{ zIndex: 3 }}>
                <div className="text-[10px] font-bold tracking-[0.14em] uppercase opacity-90 mb-1 font-mono">
                  {s.id.toUpperCase()}
                </div>
                <div className="text-[14px] sm:text-[15px] font-semibold leading-tight">
                  {s.niche}
                </div>
              </div>
              {/* "Open" badge on hover */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.12em] opacity-0 group-hover:opacity-100 transition-opacity font-mono" style={{ color: NAVY, zIndex: 3 }}>
                Open →
              </div>
            </Link>
          ))}
        </div>

        {/* Remaining 13 as compact pills */}
        {rest.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <div className="text-[11px] uppercase tracking-[0.16em] font-semibold mb-4 text-center font-mono" style={{ color: "#6B7B92" }}>
              + {rest.length} more industries
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 max-w-5xl mx-auto">
              {rest.map((s) => (
                <Link
                  key={s.id}
                  to={`/template/${s.id}`}
                  onClick={() => void fireEvent("homepage_industry_pill_click", { niche: s.id })}
                  className="px-4 py-2 rounded-full text-[13.5px] font-semibold border bg-white hover:border-[#042C53] hover:text-[#042C53] transition-colors"
                  style={{ color: TEXT, borderColor: "rgba(4,44,83,0.16)" }}
                >
                  {s.niche}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/websites"
            onClick={() => void fireEvent("homepage_industry_seeall_click", {})}
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#042C53] hover:text-[#185FA5] transition-colors"
          >
            See the full gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}
