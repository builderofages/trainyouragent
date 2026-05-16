// src/components/WallOfLove.tsx
// v38: Trust-signal "Wall of Love" — 6 (or N) testimonial cards.
//
// Cards use [TBD] placeholders so Alexander can drop real quotes in.
// Cards are filterable by vertical via the `vertical` prop (used by
// VerticalPage to surface only relevant industry quotes).
//
// Design:
//   - Warm white card, navy quote text, big serif quotation mark accent
//   - Navy initials circle (no avatars yet, so we use circle + monogram)
//   - Role + company under name
//   - Optional metric pill at top-right (e.g. "+38% booked calls")
//   - Optional videoUrl turns the quote into a play-button card
//
// Usage:
//   <WallOfLove />                            // all 6 quotes
//   <WallOfLove vertical="HVAC" />            // filtered
//   <WallOfLove vertical="HVAC" limit={2} />  // capped
//   <WallOfLove title="Why founders trust us" eyebrow="Wall of love" />

export type Testimonial = {
  quote: string;
  customerName: string;
  role: string;
  company: string;
  vertical: string;        // canonical vertical label (matches VerticalPage)
  avatarInitials: string;  // 1–3 chars
  metricCallout?: string;  // e.g. "+38% booked calls"
  videoUrl?: string;       // optional embedded testimonial
};

// [TBD] — Alexander, replace each entry with a real customer quote.
// Keep schema fields populated even for placeholders so downstream
// pages render without nulls.
export const WALL_OF_LOVE_DATA: Testimonial[] = [
  {
    quote: "[TBD — drop a real 2–3 sentence quote from a customer here. Lead with the result, end with the surprise.]",
    customerName: "[TBD First Last]",
    role: "Owner",
    company: "[TBD Company Name]",
    vertical: "HVAC",
    avatarInitials: "TB",
    metricCallout: "[TBD metric]",
  },
  {
    quote: "[TBD — clinic owner quote about not missing patient calls after hours. Should mention the dollar impact.]",
    customerName: "[TBD First Last]",
    role: "Practice Manager",
    company: "[TBD Clinic Name]",
    vertical: "Healthcare",
    avatarInitials: "TB",
    metricCallout: "[TBD metric]",
  },
  {
    quote: "[TBD — real-estate broker quote about lead capture in the first 60 seconds. Mention closed deals.]",
    customerName: "[TBD First Last]",
    role: "Broker",
    company: "[TBD Brokerage]",
    vertical: "Real Estate",
    avatarInitials: "TB",
    metricCallout: "[TBD metric]",
  },
  {
    quote: "[TBD — law-firm intake quote. Mention the conflict-check accuracy or after-hours booking lift.]",
    customerName: "[TBD First Last]",
    role: "Managing Partner",
    company: "[TBD Firm]",
    vertical: "Legal",
    avatarInitials: "TB",
    metricCallout: "[TBD metric]",
  },
  {
    quote: "[TBD — roofing or solar founder quote about storm-season surge handling. Mention answer rate.]",
    customerName: "[TBD First Last]",
    role: "Founder",
    company: "[TBD Roofing Co]",
    vertical: "Roofing",
    avatarInitials: "TB",
    metricCallout: "[TBD metric]",
  },
  {
    quote: "[TBD — startup founder quote about getting an agent live in days. Mention the build-call experience.]",
    customerName: "[TBD First Last]",
    role: "CEO",
    company: "[TBD Startup, Inc.]",
    vertical: "Startup",
    avatarInitials: "TB",
    metricCallout: "[TBD metric]",
  },
];

type Props = {
  vertical?: string;        // filter to a single vertical
  limit?: number;           // cap the number of cards
  title?: string;
  eyebrow?: string;
  className?: string;
  background?: "white" | "tint";
};

export default function WallOfLove({
  vertical,
  limit,
  title = "Operators don't recommend things lightly.",
  eyebrow = "Wall of love",
  className = "",
  background = "tint",
}: Props) {
  const pool = vertical
    ? WALL_OF_LOVE_DATA.filter((t) => t.vertical.toLowerCase() === vertical.toLowerCase())
    : WALL_OF_LOVE_DATA;
  // Fall back to the full set if a vertical filter returns nothing yet
  // (so VerticalPage never renders an empty section while quotes are TBD).
  const raw = pool.length === 0 ? WALL_OF_LOVE_DATA : pool;
  const items = typeof limit === "number" ? raw.slice(0, limit) : raw;

  const bgClass = background === "tint" ? "bg-[#F6FAFE] border-y border-slate-200/70" : "bg-white";

  return (
    <section className={`px-5 sm:px-8 py-20 ${bgClass} ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-10">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            {eyebrow}
          </div>
          <h2 className="text-[28px] sm:text-[40px] leading-[1.08] tracking-tight font-semibold text-[#042C53]">
            {title}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="relative rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 hover:border-[#185FA5]/40 hover:shadow-[0_4px_24px_-8px_rgba(4,44,83,0.18)] transition flex flex-col">
      {/* Big quotation accent */}
      <span
        aria-hidden="true"
        className="absolute top-3 left-5 text-[#E6F1FB] leading-none select-none pointer-events-none"
        style={{ fontFamily: "'Playfair Display', serif", fontSize: 72, fontStyle: "italic" }}
      >
        “
      </span>

      {/* Metric pill — top-right */}
      {t.metricCallout && (
        <span className="absolute top-4 right-4 text-[11px] uppercase tracking-[0.12em] font-semibold px-2 py-0.5 rounded-full bg-[#E6F1FB] text-[#042C53]">
          {t.metricCallout}
        </span>
      )}

      {/* Quote */}
      <blockquote className="relative z-10 text-[15px] sm:text-[16px] leading-[1.65] text-[#042C53] mt-6 mb-5">
        {t.quote}
      </blockquote>

      {/* Spacer pushes attribution to bottom */}
      <div className="mt-auto flex items-center gap-3 pt-4 border-t border-slate-100">
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-semibold tracking-wide flex-shrink-0"
          style={{ background: "#042C53", color: "#E6F1FB" }}
          aria-hidden="true"
        >
          {t.avatarInitials}
        </span>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-[#042C53] truncate">{t.customerName}</div>
          <div className="text-[12px] text-slate-500 truncate">
            {t.role} · {t.company}
          </div>
        </div>
        {t.videoUrl && (
          <a
            href={t.videoUrl}
            target="_blank"
            rel="noopener"
            className="ml-auto text-[11px] uppercase tracking-[0.12em] font-semibold text-[#185FA5] hover:text-[#042C53] flex-shrink-0"
          >
            Watch →
          </a>
        )}
      </div>
    </article>
  );
}
