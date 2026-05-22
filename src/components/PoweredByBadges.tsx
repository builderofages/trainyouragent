// src/components/PoweredByBadges.tsx
// v88: clean, brand-matched "tech stack" badge strip.
// Shows the real infrastructure we run on so prospects know we're not
// vibe-coding on a Wix template — these are the same primitives that
// power production AI products at Anthropic, Cursor, Linear, etc.
//
// Restrained design — no logos (avoids missing-asset breakage), no
// motion (no fade-flash), text-only pills colored to match each
// brand's primary so it reads as a real partner wall.

import { Link } from "react-router-dom";

type Tool = {
  name: string;
  /** brand tint (matches each company's primary). */
  color: string;
  /** what we use them for, in 2-3 words. */
  use: string;
  /** optional outbound link to the product. opens in new tab. */
  href?: string;
};

// v88: every tool is something we actually run in production today.
// Stack reflects honest current build — no aspirational logos.
const TOOLS: Tool[] = [
  { name: "Anthropic Claude",  color: "#D97757", use: "Reasoning + writing",   href: "https://www.anthropic.com" },
  { name: "Groq Llama 3.3",    color: "#F55036", use: "Free LLM fallback",    href: "https://groq.com" },
  { name: "Vapi",              color: "#5BFF59", use: "Voice infrastructure", href: "https://vapi.ai" },
  { name: "ElevenLabs",        color: "#7C3AED", use: "Voice synthesis",      href: "https://elevenlabs.io" },
  { name: "Twilio",            color: "#F22F46", use: "Telephony",            href: "https://twilio.com" },
  { name: "Pinecone",          color: "#1B17F5", use: "RAG knowledge base",   href: "https://pinecone.io" },
  { name: "Cohere",            color: "#39594D", use: "Reranking",            href: "https://cohere.com" },
  { name: "Supabase",          color: "#3ECF8E", use: "Database + auth",      href: "https://supabase.com" },
  { name: "Vercel",            color: "#000000", use: "Edge runtime",         href: "https://vercel.com" },
  { name: "Stripe",            color: "#635BFF", use: "Payments",             href: "https://stripe.com" },
  { name: "Resend",            color: "#000000", use: "Transactional email",  href: "https://resend.com" },
  { name: "Cal.com",           color: "#292929", use: "Scheduling",           href: "https://cal.com" },
];

export type PoweredByBadgesProps = {
  /** "compact" = single-line scrollable strip · "grid" = wrapped multi-row */
  variant?: "compact" | "grid";
  /** override the eyebrow line above the badges */
  eyebrow?: string;
  /** override the headline */
  headline?: string;
  className?: string;
};

export default function PoweredByBadges({
  variant = "grid",
  eyebrow = "POWERED BY · THE STACK WE ACTUALLY SHIP",
  headline,
  className = "",
}: PoweredByBadgesProps) {
  return (
    <section
      className={`px-5 sm:px-8 py-10 sm:py-14 bg-white border-y border-slate-200/70 ${className}`}
      aria-label="Technology stack we use in production"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold font-mono">
            {eyebrow}
          </div>
          {headline && (
            <h3 className="mt-3 text-[20px] sm:text-[24px] font-semibold text-[#042C53] leading-tight">
              {headline}
            </h3>
          )}
        </div>

        {variant === "grid" ? (
          <ul className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {TOOLS.map((t) => (
              <li key={t.name}>
                <Badge tool={t} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
            <ul className="flex justify-start sm:justify-center gap-2 sm:gap-2.5 whitespace-nowrap">
              {TOOLS.map((t) => (
                <li key={t.name} className="flex-shrink-0">
                  <Badge tool={t} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 text-center text-[12px] sm:text-[13px] text-slate-500 leading-relaxed">
          Honest stack list. No aspirational logos. Every tool above is wired into a production
          endpoint in this codebase right now.{" "}
          <Link to="/technology" className="text-[#185FA5] hover:text-[#042C53] underline decoration-[#185FA5]/40 underline-offset-2 font-semibold">
            See the architecture →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Badge({ tool }: { tool: Tool }) {
  const inner = (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white text-[12px] sm:text-[13px] font-medium text-[#0B1B2B] hover:shadow-sm transition"
      style={{ borderColor: `${tool.color}33` }}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: tool.color }}
        aria-hidden="true"
      />
      <span className="font-semibold text-[#042C53]">{tool.name}</span>
      <span className="text-slate-500 hidden sm:inline">· {tool.use}</span>
    </span>
  );

  if (tool.href) {
    return (
      <a
        href={tool.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${tool.name} — ${tool.use}`}
      >
        {inner}
      </a>
    );
  }
  return inner;
}
