// src/pages/PlaybooksIndex.tsx — v51B
// /playbooks hub. Lists all 15 niche operator playbooks.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { PLAYBOOKS } from "@/lib/playbooks";

const SITE_URL = "https://trainyouragent.com";

type SortMode = "alpha" | "size";

export default function PlaybooksIndex() {
  const [sort, setSort] = useState<SortMode>("alpha");

  useEffect(() => {
    document.title = "AI Playbooks — 15 Niche Implementation Guides | TrainYourAgent";

    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = `${SITE_URL}/playbooks`;

    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content =
      "15 deep operator playbooks for AI in the trades, healthcare, professional services, and local SMBs. Real implementation specifics, real tool stacks, real industry data.";
  }, []);

  const sorted = useMemo(() => {
    const arr = [...PLAYBOOKS];
    if (sort === "alpha") {
      arr.sort((a, b) => a.displayName.localeCompare(b.displayName));
    } else {
      // size — extract leading dollar amount, fallback to alpha
      arr.sort((a, b) => parseSize(b.industrySize) - parseSize(a.industrySize));
    }
    return arr;
  }, [sort]);

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <main className="pt-[var(--nav-height,72px)]">
        {/* HERO */}
        <section className="px-5 sm:px-8 pt-16 pb-12 bg-gradient-to-b from-[#F7FAFD] to-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-[12px] tracking-[0.2em] uppercase text-[#185FA5] font-semibold mb-4">
              The operator's library
            </div>
            <h1 className="text-[40px] sm:text-[58px] leading-[1.05] font-semibold text-[#042C53] tracking-[-0.01em] mb-5">
              AI playbooks for 15 SMB niches
            </h1>
            <p className="text-[19px] sm:text-[21px] leading-[1.55] text-[#1B3A5C] max-w-3xl">
              Each one is a deep operator's manual: ten concrete AI use cases,
              the real tool stack underneath them, the industry data behind
              them, and a live embedded demo you can actually try.
            </p>
            <div className="mt-8 flex items-center gap-3 text-[13px]">
              <span className="text-[#1B3A5C]/70">Sort by:</span>
              <button
                onClick={() => setSort("alpha")}
                className={`px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition ${
                  sort === "alpha"
                    ? "bg-[#042C53] text-white"
                    : "bg-[#F7FAFD] text-[#1B3A5C] hover:bg-[#E6F1FB]"
                }`}
              >
                A → Z
              </button>
              <button
                onClick={() => setSort("size")}
                className={`px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition ${
                  sort === "size"
                    ? "bg-[#042C53] text-white"
                    : "bg-[#F7FAFD] text-[#1B3A5C] hover:bg-[#E6F1FB]"
                }`}
              >
                Industry size
              </button>
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className="px-5 sm:px-8 py-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((p) => (
              <Link
                key={p.slug}
                to={`/playbooks/${p.slug}`}
                className="block rounded-2xl border border-[#0B1B2B]/10 p-6 hover:border-[#185FA5]/40 hover:shadow-md transition group bg-white"
              >
                <div className="text-[11px] tracking-[0.18em] uppercase text-[#185FA5] font-semibold mb-3">
                  Playbook
                </div>
                <h2 className="text-[22px] font-semibold text-[#042C53] mb-2 leading-[1.25] group-hover:text-[#185FA5] transition">
                  AI for {p.displayName}
                </h2>
                <p className="text-[14px] text-[#1B3A5C] leading-[1.55] mb-5 line-clamp-3">
                  {p.subhead}
                </p>
                <div className="pt-4 border-t border-[#0B1B2B]/8 flex items-center justify-between text-[12.5px]">
                  <span className="text-[#185FA5] font-semibold">
                    10 use cases
                  </span>
                  <span className="text-[#1B3A5C]/70">{p.industrySize}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="px-5 sm:px-8 py-14 bg-[#F7FAFD]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-[26px] sm:text-[32px] font-semibold text-[#042C53] mb-4">
              Don't see your niche?
            </h2>
            <p className="text-[16px] text-[#1B3A5C] mb-6">
              The architecture is the same across SMB types — phone-and-paperwork
              processes that AI handles consistently. Tell us your operational
              shape and we'll show you the parallel.
            </p>
            <a
              href="https://cal.com/trainyouragent/30min?utm_source=playbooks-index"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-7 py-3.5 rounded-xl bg-[#042C53] text-white text-[15px] font-semibold hover:bg-[#0A3D6E]"
            >
              Talk to a builder
            </a>
          </div>
        </section>
      </main>
      <FooterV44 />
    </div>
  );
}

function parseSize(s: string): number {
  // pulls leading number like "$1.4T+", "$130B+", "$22B+"
  const m = s.match(/\$([0-9.]+)\s*([TBM])/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const unit = m[2].toUpperCase();
  if (unit === "T") return n * 1000;
  if (unit === "B") return n;
  if (unit === "M") return n / 1000;
  return n;
}
