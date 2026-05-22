import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import { VERTICAL_SLUGS, CITY_SLUGS, VERTICALS, getVerticalBySlug, getCityBySlug } from "@/content/locations";

const CAL_URL = "https://cal.com/trainyouragent/30min";

function BrainLogo({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, color: "#042C53" }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
        aria-hidden="true"
        focusable="false"
      >
        <g strokeWidth="4">
          <path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" />
        </g>
        <g strokeWidth="2.4">
          <path d="M 32 6 L 32 58" />
          <path d="M 6 32 L 58 32" />
        </g>
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

/* All known top-level routes (kept in sync with App.tsx). */
const KNOWN_ROUTES: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/solutions", label: "Solutions" },
  { path: "/solutions/configurator", label: "Solution Configurator" },
  { path: "/pricing", label: "Pricing" },
  { path: "/about", label: "About" },
  { path: "/team", label: "Team" },
  { path: "/security", label: "Security" },
  { path: "/technology", label: "Technology" },
  { path: "/research", label: "Research Partners" },
  { path: "/integrations", label: "Integrations" },
  { path: "/case-studies", label: "Case Studies" },
  { path: "/comparisons", label: "Comparisons" },
  { path: "/contact", label: "Contact" },
  { path: "/demos", label: "Demos" },
  { path: "/calculators", label: "Calculators" },
  { path: "/demo-request", label: "Demo Request" },
  { path: "/demo-video", label: "Demo Video" },
  { path: "/sales-toolkit", label: "Sales Toolkit" },
  { path: "/resources", label: "Resources" },
  { path: "/blog", label: "Blog" },
  { path: "/newsletter", label: "Newsletter" },
  { path: "/start", label: "Start" },
  { path: "/privacy", label: "Privacy Policy" },
  { path: "/terms", label: "Terms" },
  { path: "/cookie-policy", label: "Cookie Policy" },
  // Vertical hubs
  { path: "/hvac", label: "HVAC" },
  { path: "/healthcare", label: "Healthcare" },
  { path: "/real-estate", label: "Real Estate" },
  { path: "/legal", label: "Legal" },
  { path: "/roofing", label: "Roofing" },
  { path: "/solar", label: "Solar" },
  { path: "/accounting", label: "Accounting" },
  { path: "/automotive", label: "Automotive" },
  { path: "/spas", label: "Spas" },
  { path: "/hotels", label: "Hotels" },
  { path: "/bars-nightclubs", label: "Bars & Nightclubs" },
  { path: "/logistics", label: "Logistics" },
  { path: "/gym", label: "Gym & Fitness" },
  { path: "/ecommerce", label: "E-commerce" },
  { path: "/hospitality", label: "Hospitality" },
];

/* Levenshtein distance (small enough to stay inline). */
function lev(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp: number[] = new Array(b.length + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(
        dp[j] + 1,
        dp[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      prev = tmp;
    }
  }
  return dp[b.length];
}

/** Score a route against a path. Lower is better. */
function scoreRoute(route: string, path: string): number {
  const r = route.toLowerCase();
  const p = path.toLowerCase();
  // Exact substring match wins.
  if (r.includes(p) || p.includes(r)) return 0;
  // Otherwise normalized Levenshtein.
  return lev(r, p);
}

/** Try to interpret the slug as a /vertical/city pair and salvage it. */
function smartLocationGuess(path: string): { suggested?: string; verticalGuess?: string; cityGuess?: string } {
  const segs = path.split("/").filter(Boolean);
  if (segs.length !== 2) return {};
  const [a, b] = segs.map((s) => s.toLowerCase());

  // Direct match?
  if (getVerticalBySlug(a) && getCityBySlug(b)) {
    return { suggested: `/${a}/${b}` };
  }

  // Find nearest vertical + nearest city.
  const verticalGuess = [...VERTICAL_SLUGS].sort((x, y) => lev(a, x) - lev(a, y))[0];
  const cityGuess = [...CITY_SLUGS].sort((x, y) => lev(b, x) - lev(b, y))[0];
  if (verticalGuess && cityGuess && (lev(a, verticalGuess) <= 3 || lev(b, cityGuess) <= 3)) {
    return { suggested: `/${verticalGuess}/${cityGuess}`, verticalGuess, cityGuess };
  }
  return {};
}

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("tya-fonts")) {
      const l = document.createElement("link");
      l.id = "tya-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap";
      document.head.appendChild(l);
    }
    document.title = "404 — TrainYourAgent";
    // Tell crawlers this isn't indexable.
    let robots = document.querySelector("meta[name='robots']") as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, nofollow");
    // eslint-disable-next-line no-console
    console.warn("404:", location.pathname);
    return () => {
      // restore index/follow on next page
      robots?.setAttribute("content", "index, follow");
    };
  }, [location.pathname]);

  /** Top-3 fuzzy matches across known routes. */
  const suggestions = useMemo(() => {
    const path = location.pathname || "/";
    return KNOWN_ROUTES
      .map((r) => ({ ...r, score: scoreRoute(r.path, path) }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  }, [location.pathname]);

  /** If the URL looks like /:vertical/:city, suggest a corrected pair. */
  const locationGuess = useMemo(() => smartLocationGuess(location.pathname), [location.pathname]);

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B] flex flex-col"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>

      <SiteNav />

      <main id="main" className="flex-1 flex items-center justify-center px-5 py-20 pt-32">
        <div className="max-w-2xl text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">404</div>
          <h1 className="text-[56px] sm:text-[80px] leading-[1.02] tracking-tight font-semibold text-[#042C53]">
            This page{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              wandered off.
            </span>
          </h1>
          <p className="mt-6 text-[18px] text-slate-600 leading-relaxed">
            We couldn&apos;t find{" "}
            <code className="px-1.5 py-0.5 rounded bg-[#E6F1FB] text-[#042C53] text-[15px]">
              {location.pathname}
            </code>
            . It either moved, never existed, or got eaten by an agent in training.
          </p>

          {/* Did-you-mean: programmatic LP guess takes priority */}
          {locationGuess.suggested && (
            <div className="mt-10 p-5 rounded-2xl border border-[#185FA5]/30 bg-[#F6FAFE] text-left">
              <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-2">
                Did you mean
              </div>
              <Link
                to={locationGuess.suggested}
                className="text-[18px] font-semibold text-[#042C53] hover:underline focus:outline-none focus:ring-2 focus:ring-[#185FA5] rounded"
              >
                {locationGuess.verticalGuess && getVerticalBySlug(locationGuess.verticalGuess)?.label} in{" "}
                {locationGuess.cityGuess && getCityBySlug(locationGuess.cityGuess)?.name}
                <span className="text-slate-500 font-normal text-[14px] ml-2">{locationGuess.suggested}</span>
              </Link>
            </div>
          )}

          {/* Top 3 fuzzy matches */}
          <div className="mt-8">
            <div className="text-[12px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-3">
              Or one of these
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {suggestions.map((s) => (
                <Link
                  key={s.path}
                  to={s.path}
                  className="px-4 py-2 rounded-full bg-white border border-slate-300 text-[14px] text-[#042C53] hover:border-[#185FA5] hover:bg-[#F6FAFE] transition focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Industries pivot */}
          <div className="mt-10">
            <div className="text-[12px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-3">
              Pick an industry
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {Object.values(VERTICALS).slice(0, 6).map((v) => (
                <Link
                  key={v.slug}
                  to={`/${v.slug}`}
                  className="px-3 py-1.5 rounded-full bg-[#F6FAFE] border border-slate-200 text-[13px] text-[#042C53] hover:border-[#185FA5] hover:bg-white transition focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
                >
                  {v.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12 text-[14px] text-slate-500">
            Still stuck? Email{" "}
            <a href="mailto:hello@trainyouragent.com" className="text-[#185FA5] underline">
              hello@trainyouragent.com
            </a>{" "}
            or{" "}
            <a href={CAL_URL} target="_blank" rel="noopener" className="text-[#185FA5] underline">
              book a call
            </a>
            .
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex items-center justify-between text-[12px] text-slate-500">
          <div className="flex items-center gap-2">
            <BrainLogo size={20} />
            <span>© 2026 TrainYourAgent LLC</span>
          </div>
          <span>Tampa Bay, FL</span>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
