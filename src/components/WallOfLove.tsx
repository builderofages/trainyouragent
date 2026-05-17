// src/components/WallOfLove.tsx
// v46a: HONEST EARLY-STAGE TRUST SECTION.
//
// We do not have a wall of customer quotes yet. Instead of fake testimonials
// with [TBD] placeholders that an experienced buyer instantly clocks as
// fabricated, we ship an honest "Why operators are giving us a chance"
// section that surfaces the actual proof we have: founder track record,
// transparency, and the things we commit to do.
//
// Replace this with real testimonials when they exist. Keep the schema
// the same so VerticalPage doesn't break.

export type Testimonial = {
  quote: string;
  customerName: string;
  role: string;
  company: string;
  vertical: string;
  avatarInitials: string;
  metricCallout?: string;
  videoUrl?: string;
};

// Empty by default — we'd rather show nothing than something fake.
export const WALL_OF_LOVE_DATA: Testimonial[] = [];

type Props = {
  vertical?: string;
  limit?: number;
  title?: string;
  eyebrow?: string;
  className?: string;
  background?: "white" | "tint";
};

const COMMITMENTS = [
  {
    h: "First agent in 14 days or you don't pay.",
    b: "We scope on a 30-min call, ship a working voice or chat agent in two weeks, and only invoice once it's answering real traffic.",
  },
  {
    h: "Founder is your point of contact.",
    b: "No SDR, no account manager. Alexander runs discovery and stays on your account through go-live and beyond.",
  },
  {
    h: "We don't hide our numbers.",
    b: "Every metric on /metrics is real — pulled live from our lead store. If it's small, we say so. We're early on purpose.",
  },
  {
    h: "30-day money-back on the build.",
    b: "If the first agent doesn't ship to spec, we refund the build fee. Pay-as-you-go usage is non-refundable once incurred.",
  },
  {
    h: "Your data, your agent.",
    b: "TLS in transit, AES-256 at rest, US hosting, zero training on your data, HIPAA BAA available. You own the prompts, scripts, and recordings.",
  },
  {
    h: "Honest about what we don't do.",
    b: "We don't claim SOC 2 we don't have. We don't claim 'thousands of customers' we don't have. We'll tell you on the call whether we're the right fit.",
  },
];

export default function WallOfLove({
  title = "We're early. Here's what we promise instead.",
  eyebrow = "Why operators give us a shot",
  className = "",
  background = "tint",
}: Props) {
  const bgClass = background === "tint"
    ? "bg-[#F6FAFE] border-y border-slate-200/70"
    : "bg-white";

  return (
    <section className={`px-5 sm:px-8 py-16 sm:py-24 ${bgClass} ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-10">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">
            {eyebrow}
          </div>
          <h2 className="text-[28px] sm:text-[40px] leading-[1.08] tracking-tight font-semibold text-[#042C53]">
            {title}
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] text-slate-700 leading-relaxed max-w-2xl">
            We won't post fake testimonials. Real customer quotes will land here as builds go live and customers agree to be named. Until then, here's what we put in writing on day one of every engagement.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMITMENTS.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 hover:border-[#185FA5]/40 hover:shadow-[0_4px_24px_-8px_rgba(4,44,83,0.12)] transition"
            >
              <div className="text-[16px] font-semibold text-[#042C53] mb-2 leading-snug">
                {c.h}
              </div>
              <div className="text-[14px] text-slate-700 leading-relaxed">
                {c.b}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
