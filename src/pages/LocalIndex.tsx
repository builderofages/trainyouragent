// src/pages/LocalIndex.tsx — v47B
// Hub at /local. Renders an SVG US map with city dots and a card grid linking
// into /local/{citySlug}/voice-agents by default. Also includes a
// "don't see your city?" CTA wired to api/lead with source local-city-request.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { CITIES } from "@/lib/cities";

const SITE_URL = "https://trainyouragent.com";

// Equirectangular projection over a 1000x500 viewBox, clipped to continental US.
// lng range ~ [-125, -66] -> x [40, 960]
// lat range ~ [25, 50]    -> y [460, 30]
function project(lat: number, lng: number) {
  const x = ((lng - -125) / (-66 - -125)) * 920 + 40;
  const y = 460 - ((lat - 25) / (50 - 25)) * 430;
  return { x, y };
}

export default function LocalIndex() {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const dots = useMemo(
    () => CITIES.map((c) => ({ ...c, ...project(c.lat, c.lng) })),
    []
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "AI agents for businesses in 30 cities — TrainYourAgent";
    const setMeta = (sel: string, attr: "name" | "property", key: string, val: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };
    const desc = "AI voice agents, chat agents, receptionist, and sales agents built for SMBs in 30 US cities. Tampa-built, deployed nationwide. Start a 15-min call.";
    setMeta(`meta[name='description']`, "name", "description", desc);
    setMeta(`meta[property='og:title']`, "property", "og:title", "AI agents in 30 US cities — TrainYourAgent");
    setMeta(`meta[property='og:description']`, "property", "og:description", desc);
    setMeta(`meta[property='og:url']`, "property", "og:url", `${SITE_URL}/local`);
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE_URL}/local`;
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "local-city-request",
          payload: { requestedCity: city },
          path: "/local",
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.ok === false) {
        setErr("Couldn't submit. Try again or email alexander@trainyouragent.com.");
      } else {
        setSent(true);
      }
    } catch {
      setErr("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#0B1B2B]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">
        Skip to main content
      </a>
      <SiteNav active="industries" />

      <main id="main">
        {/* HERO + MAP */}
        <section className="pt-32 pb-12 px-5 sm:px-8" aria-labelledby="local-heading">
          <div className="max-w-6xl mx-auto">
            <h1 id="local-heading" className="text-[36px] sm:text-[52px] leading-[1.05] font-semibold tracking-tight text-[#042C53]">
              AI agents for businesses in 30 cities
            </h1>
            <p className="mt-5 text-[18px] leading-[1.55] text-[#1B3A5C] max-w-3xl">
              Voice agents, chat agents, AI receptionist, and AI sales agents — built around how the local market actually runs.
              Tampa-built, deployed nationwide. Pick your city to see how it ships there.
            </p>

            <div className="mt-10 rounded-2xl bg-[#F7FAFD] border border-[#0B1B2B]/10 p-4 sm:p-6 overflow-hidden">
              <svg
                viewBox="0 0 1000 500"
                role="img"
                aria-label="US map showing the 30 cities TrainYourAgent serves"
                style={{ width: "100%", height: "auto", display: "block" }}
              >
                {/* Continental US outline (simplified silhouette). */}
                <path
                  d="M120 380 L130 320 L150 280 L160 230 L150 200 L170 170 L210 150 L240 130 L300 110 L360 100 L430 90 L500 95 L560 100 L620 105 L680 110 L740 110 L790 120 L830 130 L870 150 L900 180 L920 220 L920 260 L900 290 L880 320 L860 340 L830 360 L800 370 L760 380 L700 395 L640 410 L580 420 L520 425 L460 425 L400 420 L340 410 L280 395 L220 390 L170 390 Z"
                  fill="#E6F1FB"
                  stroke="#185FA5"
                  strokeWidth="1.2"
                  opacity="0.9"
                />
                {dots.map((d) => (
                  <g key={d.slug}>
                    <circle cx={d.x} cy={d.y} r="6" fill="#042C53" />
                    <circle cx={d.x} cy={d.y} r="11" fill="#042C53" opacity="0.18" />
                    <title>{d.displayName}, {d.statePostal}</title>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </section>

        {/* CITY GRID */}
        <section className="py-14 px-5 sm:px-8 bg-white" aria-labelledby="cities-heading">
          <div className="max-w-6xl mx-auto">
            <h2 id="cities-heading" className="text-[26px] sm:text-[32px] font-semibold text-[#042C53] mb-6">
              30 cities, four agent types each
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CITIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/local/${c.slug}/voice-agents`}
                    className="block rounded-xl border border-[#0B1B2B]/10 p-5 hover:border-[#185FA5] hover:bg-[#F7FAFD] transition-colors min-h-[120px]"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="text-[18px] font-semibold text-[#042C53]">{c.displayName}</div>
                      <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold">{c.statePostal}</div>
                    </div>
                    <p className="mt-2 text-[13.5px] leading-[1.5] text-[#1B3A5C]">
                      {c.localFlavor.split(/(?<=[.!?])\s/)[0]}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* DON'T SEE YOUR CITY */}
        <section className="py-14 px-5 sm:px-8 bg-[#F7FAFD]" aria-labelledby="missing-city-heading">
          <div className="max-w-3xl mx-auto">
            <h2 id="missing-city-heading" className="text-[24px] sm:text-[30px] font-semibold text-[#042C53] mb-3">
              Don't see your city?
            </h2>
            <p className="text-[15.5px] text-[#1B3A5C] mb-6">
              We're shipping to new markets every quarter. Tell us where, and we'll let you know when we have a build plan for your metro.
            </p>
            {sent ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-[15px] text-emerald-900">
                Got it. We'll reach out when we have a build plan for your city.
              </div>
            ) : (
              <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-[#0B1B2B]/15 text-[15px] min-h-[44px] focus:outline-none focus:border-[#185FA5]"
                  aria-label="Your city"
                />
                <input
                  type="email"
                  required
                  placeholder="you@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-[#0B1B2B]/15 text-[15px] min-h-[44px] focus:outline-none focus:border-[#185FA5]"
                  aria-label="Your email"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="px-5 py-3 rounded-xl bg-[#042C53] text-white font-semibold text-[15px] hover:bg-[#063e75] disabled:opacity-60 min-h-[44px]"
                >
                  {busy ? "Sending…" : "Request my city"}
                </button>
              </form>
            )}
            {err && <p className="mt-3 text-[13px] text-red-700">{err}</p>}
          </div>
        </section>
      </main>

      <FooterV44 />
    </div>
  );
}
