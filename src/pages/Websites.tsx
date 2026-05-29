// src/pages/Websites.tsx — v209
//
// Public, indexable directory of every niche template. SEO surface for queries
// like "free AI receptionist website for cleaners / HVAC / dental / …".
// Each card links to /template/<id> where prospects see a fully working voice
// + chat agent in their brand-able demo. This page itself is canonical and
// crawlable; the per-prospect personalized URLs (?company=) stay noindex.

import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ACTIVE_NICHE_SITES } from "@/lib/nicheSiteTemplates";
import { nicheImageUrl } from "@/lib/nicheImages";

const ITALIC: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 };
const MONO: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.2em" };
const NAVY = "#042C53";
const TEXT = "#0B1B2B";
const MUTED = "#5C6B7F";
const HAIRLINE = "rgba(4,44,83,0.08)";

export default function Websites() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return ACTIVE_NICHE_SITES;
    return ACTIVE_NICHE_SITES.filter((n) =>
      n.niche.toLowerCase().includes(needle) ||
      n.id.toLowerCase().includes(needle) ||
      n.chips.some((c) => c.toLowerCase().includes(needle)),
    );
  }, [q]);

  // load the brand fonts once
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("tya-fonts")) return;
    const l = document.createElement("link");
    l.id = "tya-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap";
    document.head.appendChild(l);
  }, []);

  // JSON-LD ItemList so Google understands this is a directory
  const itemList = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": ACTIVE_NICHE_SITES.map((n, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://www.trainyouragent.com/template/${n.id}`,
      "name": `${n.niche} — AI receptionist website`,
    })),
  }), []);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: TEXT, fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
      <Helmet>
        <title>Free AI receptionist websites for {ACTIVE_NICHE_SITES.length} industries · TrainYourAgent</title>
        <meta name="description" content={`Pre-built, fully-working AI receptionist + chatbot websites for ${ACTIVE_NICHE_SITES.length} industries. Swap your business name in and see a live voice + chat demo in 5 seconds. Free.`} />
        <link rel="canonical" href="https://www.trainyouragent.com/websites" />
        <meta property="og:title" content="Free AI receptionist websites — pick your industry" />
        <meta property="og:description" content={`${ACTIVE_NICHE_SITES.length} industries · live voice + chat demo · your brand in 5 seconds.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.trainyouragent.com/websites" />
        <meta property="og:image" content="https://www.trainyouragent.com/api/og?title=Free%20AI%20receptionist%20websites&subtitle=Pick%20your%20industry%20%E2%80%94%20live%20voice%20%2B%20chat%20demo&badge=DIRECTORY&type=page" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(itemList)}</script>
      </Helmet>

      {/* Top rail */}
      <div style={{ borderBottom: `1px solid ${HAIRLINE}`, padding: "0 20px", background: "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" aria-label="TrainYourAgent home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 2 L30 16 L16 30 L2 16 Z" fill="none" stroke={NAVY} strokeWidth="2.5" />
              <path d="M16 8 L24 16 L16 24 L8 16 Z" fill={NAVY} />
            </svg>
            <span style={{ fontSize: 16, fontWeight: 700, color: NAVY, letterSpacing: "-0.01em" }}>TrainYourAgent</span>
          </Link>
          <div style={{ display: "flex", gap: 18, alignItems: "center", fontSize: 13.5 }}>
            <Link to="/pricing" style={{ color: MUTED, textDecoration: "none" }}>Pricing</Link>
            <Link to="/apply" style={{ padding: "8px 14px", borderRadius: 999, background: NAVY, color: "#fff", fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}>Book a build call →</Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <header style={{ padding: "76px 20px 48px", background: `radial-gradient(900px 480px at 50% 0%, rgba(4,44,83,0.06), transparent 60%), #FAF6EE` }}>
        <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: "rgba(4,44,83,0.08)", color: NAVY, fontSize: 11, fontWeight: 700, marginBottom: 26, ...MONO }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: NAVY }} />
            {ACTIVE_NICHE_SITES.length} INDUSTRIES · LIVE DEMOS
          </div>
          <h1 style={{ fontSize: "clamp(40px, 7vw, 78px)", lineHeight: 1.04, letterSpacing: "-0.025em", fontWeight: 600, color: NAVY, margin: 0 }}>
            Free AI-receptionist websites,{" "}
            <span style={{ ...ITALIC, color: "#185FA5" }}>built for your industry.</span>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.55, color: "#42526E", maxWidth: 660, margin: "26px auto 30px" }}>
            Pick your business below. We hand you a fully-working site — live voice agent on the phone, live chatbot on the page, instant quote calculator, pricing tiers, booking — branded to you in 5 seconds. Yours to keep.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 14, padding: "8px 14px", boxShadow: "0 8px 28px -16px rgba(4,44,83,0.18)", maxWidth: 460, width: "100%" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke={NAVY} strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke={NAVY} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search industries — try ‘cleaning’, ‘dental’, ‘plumbing’" aria-label="Search industries"
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14.5, color: NAVY, padding: "6px 0" }} />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear search" style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
            )}
          </div>
        </div>
      </header>

      {/* Grid */}
      <section style={{ padding: "44px 20px 80px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: MUTED }}>
              No match for <strong>{q}</strong> — try a broader term, or <Link to="/contact" style={{ color: "#185FA5" }}>ask us to add your industry</Link>.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {filtered.map((n) => (
                <Link key={n.id} to={`/template/${n.id}`}
                  style={{ display: "block", textDecoration: "none", color: "inherit", background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 6px 22px -16px rgba(4,44,83,0.15)", transition: "transform .2s ease, box-shadow .2s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 22px 50px -22px ${hexA(n.accent, 0.35)}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 22px -16px rgba(4,44,83,0.15)"; }}
                >
                  {/* HD niche image banner — replaces the old emoji */}
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: `linear-gradient(135deg, ${hexA(n.accent, 0.18)}, ${hexA(n.accent, 0.06)})`, overflow: "hidden" }}>
                    <img
                      src={nicheImageUrl(n.id, 640, 360)}
                      alt={`${n.niche} business`}
                      loading="lazy"
                      decoding="async"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, rgba(4,44,83,0.55) 100%)` }} />
                    <span style={{ position: "absolute", top: 12, left: 12, padding: "5px 10px", borderRadius: 999, background: "rgba(255,255,255,0.92)", color: n.accent, fontSize: 10.5, fontWeight: 700, ...MONO }}>{n.niche.toUpperCase()}</span>
                    <span style={{ position: "absolute", bottom: 12, right: 12, fontSize: 10.5, fontWeight: 700, color: "#fff", ...MONO }}>LIVE DEMO →</span>
                  </div>
                  <div style={{ padding: "20px 22px" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, letterSpacing: "-0.01em", marginBottom: 6, lineHeight: 1.2 }}>
                      {n.niche}
                    </div>
                    <p style={{ fontSize: 13.5, lineHeight: 1.5, color: MUTED, margin: "0 0 14px", minHeight: 40 }}>
                      {n.subhead.length > 120 ? n.subhead.slice(0, 117) + "…" : n.subhead}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {n.chips.slice(0, 3).map((c) => (
                        <span key={c} style={{ fontSize: 11, fontWeight: 600, color: NAVY, background: "rgba(4,44,83,0.04)", padding: "3px 9px", borderRadius: 999 }}>{c}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section style={{ padding: "60px 20px", borderTop: `1px solid ${HAIRLINE}`, background: "#FAFBFC" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px, 4.2vw, 38px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600, color: NAVY, margin: "0 0 14px" }}>
            Don't see your industry?{" "}
            <span style={{ ...ITALIC, color: "#185FA5" }}>We build it on the call.</span>
          </h2>
          <p style={{ fontSize: 16, color: MUTED, marginBottom: 24 }}>15-minute build call. You leave with a working voice agent on your number, same day.</p>
          <Link to="/apply" style={{ display: "inline-block", padding: "16px 30px", borderRadius: 14, background: NAVY, color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none", boxShadow: "0 22px 46px -22px rgba(4,44,83,0.5)" }}>
            Book your build call →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "26px 20px", borderTop: `1px solid ${HAIRLINE}`, fontSize: 12, color: "#94A3B8" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "space-between" }}>
          <span>© {new Date().getFullYear()} TrainYourAgent</span>
          <span><Link to="/" style={{ color: "#94A3B8" }}>Home</Link> · <Link to="/pricing" style={{ color: "#94A3B8" }}>Pricing</Link> · <Link to="/apply" style={{ color: "#94A3B8" }}>Book</Link></span>
        </div>
      </footer>
    </div>
  );
}

function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16); const g = parseInt(h.slice(2, 4), 16); const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
