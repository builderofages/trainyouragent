// src/components/CustomerReviewsCarousel.tsx — v238
//
// Pulls APPROVED customer reviews from /api/reviews/public and renders a
// horizontally-scrollable card carousel. Each card shows quote + name +
// business + niche. Cards with video_url get a "Watch video →" link badge.
//
// Empty state: shows a tasteful "Be one of the first" CTA pointing to
// /reviews/submit. Honest, on-brand, never lies.
//
// Auto-fetches on mount, no loading flash (skeleton while fetching).

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const TEXT = "#0B1B2B";
const MUTED = "#5C6B7F";
const HAIRLINE = "rgba(4,44,83,0.08)";
const ITALIC: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 };
const MONO: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.16em" };

type Review = {
  name: string;
  company: string;
  niche: string;
  video_url: string | null;
  quote: string | null;
  ts: string;
};

export type CustomerReviewsCarouselProps = {
  niche?: string;     // optional filter — defaults to "all"
  limit?: number;     // optional — defaults to 12
  title?: string;     // override section title
};

export default function CustomerReviewsCarousel({ niche, limit = 12, title }: CustomerReviewsCarouselProps) {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    const url = "/api/reviews-public?limit=" + limit + (niche ? `&niche=${encodeURIComponent(niche)}` : "");
    fetch(url)
      .then(async (r) => r.ok ? r.json() : null)
      .then((j) => setReviews(j?.reviews || []))
      .catch(() => setReviews([]));
  }, [niche, limit]);

  return (
    <section style={{ padding: "60px 20px", background: "#FFFFFF" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ ...MONO, fontSize: 11, fontWeight: 700, color: ACCENT, marginBottom: 8 }}>
            REAL OPERATORS. REAL RESULTS.
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4.5vw, 42px)", lineHeight: 1.1, fontWeight: 600, color: NAVY, margin: 0 }}>
            {title || (
              <>
                What customers are <span style={ITALIC}>saying.</span>
              </>
            )}
          </h2>
        </div>

        {reviews === null ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ height: 180, borderRadius: 16, background: "linear-gradient(90deg, rgba(4,44,83,0.04), rgba(4,44,83,0.08), rgba(4,44,83,0.04))", backgroundSize: "200% 100%", animation: "tyaSkel 1.5s linear infinite" }} />
            ))}
            <style>{`@keyframes tyaSkel { 0%{background-position:0% 0%} 100%{background-position:-200% 0%} }`}</style>
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {reviews.map((r, i) => (
              <ReviewCard key={i} r={r} />
            ))}
          </div>
        )}

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Link
            to="/reviews/submit"
            style={{ display: "inline-block", padding: "12px 22px", borderRadius: 12, background: NAVY, color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}
          >
            Share your story →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <article
      style={{
        padding: 22,
        borderRadius: 16,
        background: "#fff",
        border: `1px solid ${HAIRLINE}`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 12px 28px -16px rgba(4,44,83,0.10)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Stars n={5} />
        {r.video_url && (
          <a href={r.video_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: ACCENT, textDecoration: "none", padding: "3px 8px", borderRadius: 999, background: "rgba(24,95,165,0.08)", border: "1px solid rgba(24,95,165,0.18)" }}>
            ▶ Video
          </a>
        )}
      </div>
      <blockquote style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: TEXT, fontStyle: "italic", flex: 1 }}>
        “{r.quote || "Watch the video above."}”
      </blockquote>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, marginTop: 6 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{r.name}</div>
          <div style={{ fontSize: 11.5, color: MUTED, marginTop: 1 }}>{r.company}</div>
        </div>
        <span style={{ ...MONO, fontSize: 9.5, fontWeight: 700, color: MUTED, textTransform: "uppercase" }}>
          {r.niche}
        </span>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        padding: "44px 28px",
        borderRadius: 18,
        background: "linear-gradient(135deg, #FAF6EE 0%, #FFFFFF 100%)",
        border: `1px solid ${HAIRLINE}`,
        textAlign: "center",
      }}
    >
      <div style={{ ...MONO, fontSize: 11, fontWeight: 700, color: ACCENT, marginBottom: 10 }}>
        FOUNDING-CUSTOMER WINDOW OPEN
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 600, color: NAVY, margin: "0 0 12px", lineHeight: 1.2 }}>
        Be one of the first names <span style={ITALIC}>on this page.</span>
      </h3>
      <p style={{ fontSize: 14, lineHeight: 1.55, color: MUTED, maxWidth: 520, margin: "0 auto 22px" }}>
        We publish every approved testimonial here — video or written. Founding customers get permanent founding pricing, a co-authored case study at launch, and direct founder Slack access. Spots are limited.
      </p>
      <Link to="/reviews/submit" style={{ display: "inline-block", padding: "12px 22px", borderRadius: 12, background: NAVY, color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
        Submit your story →
      </Link>
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <div style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width={14} height={14} viewBox="0 0 16 16" aria-hidden>
          <path d="M8 1.5l1.95 3.95 4.36.63-3.16 3.08.75 4.34L8 11.5l-3.9 2 .75-4.34L1.69 6.08l4.36-.63z" fill="#FFB100" />
        </svg>
      ))}
    </div>
  );
}
