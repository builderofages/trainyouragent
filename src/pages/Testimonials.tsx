// src/pages/Testimonials.tsx — route /testimonials
// v38: Pinterest-style masonry of testimonial quote cards.
// Uses WALL_OF_LOVE_DATA so /testimonials and the embedded WallOfLove
// component never disagree about who said what.
//
// Layout: CSS columns (no library, no extra deps). 1 column on mobile,
// 2 on sm, 3 on lg. Each card breaks-inside-avoid so quotes never split.
// We render the 6 base entries twice so the masonry feels full, with the
// second pass marked as such for QA. When real quotes land, raise the
// pool size in WALL_OF_LOVE_DATA and remove the duplication.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import { WALL_OF_LOVE_DATA } from "@/components/WallOfLove";

const CAL_URL = "https://cal.com/trainyouragent/30min";

function BrainLogo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, color: "#042C53" }} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
        <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
        <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

const Testimonials = () => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Testimonials — TrainYourAgent";
    const setMeta = (n: string, c: string) => {
      let el = document.querySelector(`meta[name='${n}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    setMeta("description", "What customers say and why founders trust TrainYourAgent with their phone line.");
  }, []);

  // Render base then a second pass to give the masonry presence while real
  // testimonials are still rolling in. Marked with a different key prefix
  // so React doesn't warn and we can spot the dupes in DevTools.
  const cards = [
    ...WALL_OF_LOVE_DATA.map((t, i) => ({ ...t, _k: `a-${i}` })),
    ...WALL_OF_LOVE_DATA.map((t, i) => ({ ...t, _k: `b-${i}` })),
  ];

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <SiteNav active="resources" />
      <main className="pt-28">
        <section className="px-5 sm:px-8 pt-10 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-semibold mb-4">Testimonials</div>
            <h1 className="text-[clamp(36px,6vw,80px)] leading-[1.02] tracking-tight font-semibold text-[#042C53] mb-6">
              What customers say.
            </h1>
            <p className="text-[19px] text-slate-600 max-w-2xl leading-relaxed">
              Quotes from operators with TrainYourAgent on their real production phone line. No marketing rewrites.
            </p>
          </div>
        </section>

        <section className="px-5 sm:px-8 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#185FA5] font-semibold mb-3">Why founders trust us</div>
            <div
              className="gap-4"
              style={{
                columnCount: 1,
                columnGap: "1rem",
              }}
            >
              {/* Tailwind doesn't ship multi-column utilities by default in
                  the older config — explicit CSS variables make this responsive
                  without adding a dep. */}
              <style>{`
                @media (min-width: 640px) { .tya-masonry { column-count: 2 !important; } }
                @media (min-width: 1024px) { .tya-masonry { column-count: 3 !important; } }
              `}</style>
              <div className="tya-masonry" style={{ columnGap: "1rem" }}>
                {cards.map((t) => (
                  <article
                    key={t._k}
                    className="mb-4 break-inside-avoid rounded-2xl bg-white border border-slate-200 p-6 relative inline-block w-full"
                    style={{ breakInside: "avoid" }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-2 left-4 text-[#E6F1FB] leading-none select-none pointer-events-none"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: 72, fontStyle: "italic" }}
                    >
                      “
                    </span>
                    {t.metricCallout && (
                      <span className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.12em] font-semibold px-2 py-0.5 rounded-full bg-[#E6F1FB] text-[#042C53]">
                        {t.metricCallout}
                      </span>
                    )}
                    <blockquote className="relative z-10 text-[15px] leading-[1.65] text-[#042C53] mt-6 mb-5">
                      {t.quote}
                    </blockquote>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <span
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold tracking-wide flex-shrink-0"
                        style={{ background: "#042C53", color: "#E6F1FB" }}
                        aria-hidden="true"
                      >
                        {t.avatarInitials}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-[#042C53] truncate">{t.customerName}</div>
                        <div className="text-[12px] text-slate-500 truncate">{t.role} · {t.company}</div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 sm:px-8 py-20 bg-[#042C53] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-[32px] sm:text-[48px] leading-[1.05] tracking-tight font-semibold">
              Earn your own <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>spot up there.</span>
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a href={CAL_URL} target="_blank" rel="noopener" className="px-7 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15px] hover:bg-slate-100 shadow-lg">
                Book a 30-min build call →
              </a>
              <Link to="/trial" className="px-7 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-[15px] hover:bg-white/15">
                Start the 7-day trial
              </Link>
            </div>
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
          <div className="flex items-center gap-x-6 gap-y-2 flex-wrap justify-center">
            <Link to="/about" className="hover:text-[#042C53]">About</Link>
            <Link to="/pricing" className="hover:text-[#042C53]">Pricing</Link>
            <Link to="/customers" className="hover:text-[#042C53]">Customers</Link>
            <Link to="/trial" className="hover:text-[#042C53]">Trial</Link>
            <Link to="/contact" className="hover:text-[#042C53]">Contact</Link>
          </div>
          <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent LLC</div>
        </div>
      </footer>
    </div>
  );
};

export default Testimonials;
