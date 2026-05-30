// src/components/HomepageLoomEmbed.tsx — v240
//
// Renders a brand-Loom hero video on the homepage. Reads VITE_BRAND_LOOM_URL
// at build time. If env is unset, the component renders nothing (no empty
// card on production until founder records).
//
// Same Loom shows here, on every /template/[niche], and any place else we
// embed BRAND_LOOM_URL. One recording = video proof site-wide.

import { BRAND_LOOM_URL, loomEmbedFor } from "@/lib/brand";

const NAVY = "#042C53";
const ACCENT = "#185FA5";
const HAIRLINE = "rgba(4,44,83,0.08)";
const MONO: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.16em" };
const ITALIC: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 };

export default function HomepageLoomEmbed() {
  if (!BRAND_LOOM_URL) return null;
  const src = loomEmbedFor(BRAND_LOOM_URL);
  return (
    <section
      className="relative px-5 sm:px-8 py-14 sm:py-20 bg-white border-y border-slate-200/70"
      aria-labelledby="homepage-loom-heading"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-[11px] font-semibold tracking-[0.18em] uppercase font-mono mb-3" style={{ color: ACCENT }}>
            WATCH IT WORK — 90 SECONDS
          </div>
          <h2
            id="homepage-loom-heading"
            className="text-[28px] sm:text-[42px] md:text-[48px] leading-[1.05] font-semibold mb-3"
            style={{ color: NAVY }}
          >
            Don't take our word for it.{" "}
            <span style={ITALIC}>See it run.</span>
          </h2>
          <p className="text-[15px] sm:text-[16.5px] text-slate-700 max-w-2xl mx-auto leading-relaxed">
            A real walkthrough of the AI receptionist handling an after-hours emergency call, qualifying it, booking the job, and texting the customer the confirmation — start to finish, no edits.
          </p>
        </div>
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            background: "#fff",
            border: `1px solid ${HAIRLINE}`,
            boxShadow: "0 32px 64px -28px rgba(4,44,83,0.32)",
          }}
        >
          <div style={{ padding: "12px 18px", borderBottom: `1px solid ${HAIRLINE}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FF5F57" }} />
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FEBC2E" }} />
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#28C840" }} />
            </div>
            <div style={{ ...MONO, fontSize: 10.5, color: "#6B7B92", fontWeight: 700 }}>TRAINYOURAGENT.COM/DEMO</div>
            <div style={{ width: 50 }} />
          </div>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, background: "#000" }}>
            <iframe
              src={src}
              title="TrainYourAgent — 90-second walkthrough"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
              allow="fullscreen; clipboard-write"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
