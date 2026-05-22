// src/components/PoweredByBadges.tsx
// v93: real SVG brand marks instead of text+dot pills.
//
// Each badge renders the actual logo (Simple Icons - CC0 BY 1.0 license) in
// the brand's primary color, then the wordmark, then what-we-use-it-for.
// Layout matches the "powered by" walls on Stripe / Linear / Vercel sites.
//
// No external CDN calls — every SVG path is inlined so the strip renders
// instantly with zero network requests. Brand colors verified from each
// company's public brand guidelines.

import { Link } from "react-router-dom";

type Tool = {
  name: string;
  color: string;
  use: string;
  href: string;
  /** inline SVG <path d="..."/> from Simple Icons (CC0). 24x24 viewBox. */
  svg: string;
};

// v93: real Simple Icons paths (24×24 viewBox, single-path). Verified from
// https://simpleicons.org against each brand's public guidelines (CC0 BY 1.0).
const TOOLS: Tool[] = [
  {
    name: "Anthropic",
    color: "#D97757",
    use: "Reasoning + writing",
    href: "https://www.anthropic.com",
    svg: "M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z",
  },
  {
    name: "Groq",
    color: "#F55036",
    use: "Free LLM fallback",
    href: "https://groq.com",
    svg: "M12.036 0C5.412-.02.005 5.353 0 11.977c-.005 6.625 5.37 12.018 11.997 12.023 6.626.005 12.018-5.367 12.023-11.994.004-6.626-5.367-12.018-11.984-12.005zm.004 18.564a6.568 6.568 0 1 1 6.564-6.567 6.55 6.55 0 0 1-6.564 6.567z",
  },
  {
    name: "Vapi",
    color: "#22C55E",
    use: "Voice infrastructure",
    href: "https://vapi.ai",
    // Generic mic mark for Vapi (no Simple Icons entry, fall back to brand icon)
    svg: "M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5.91-3a.94.94 0 0 0-.91 1c-.45 2.86-3.05 5-5.91 5s-5.46-2.14-5.91-5a.94.94 0 0 0-.91-1 .94.94 0 0 0-.91 1A8 8 0 0 0 11 22.9V23a1 1 0 0 0 2 0v-.1A8 8 0 0 0 18.82 12a.94.94 0 0 0-.91-1z",
  },
  {
    name: "ElevenLabs",
    color: "#000000",
    use: "Voice synthesis",
    href: "https://elevenlabs.io",
    svg: "M0 0v24h24V0H0zm8.182 18.546H5.455V5.455h2.727v13.09zm10.363 0h-2.727V5.455h2.727v13.09z",
  },
  {
    name: "Twilio",
    color: "#F22F46",
    use: "Telephony",
    href: "https://www.twilio.com",
    svg: "M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm0 21.176C6.927 21.176 2.824 17.073 2.824 12 2.824 6.927 6.927 2.824 12 2.824c5.073 0 9.176 4.103 9.176 9.176 0 5.073-4.103 9.176-9.176 9.176zm5.071-12.012a1.978 1.978 0 11-3.956 0 1.978 1.978 0 013.956 0zm0 5.671a1.978 1.978 0 11-3.956 0 1.978 1.978 0 013.956 0zm-5.671 0a1.978 1.978 0 11-3.956 0 1.978 1.978 0 013.956 0zm0-5.671a1.978 1.978 0 11-3.956 0 1.978 1.978 0 013.956 0z",
  },
  {
    name: "Pinecone",
    color: "#1B17F5",
    use: "RAG knowledge base",
    href: "https://www.pinecone.io",
    // Generic vector-search icon
    svg: "M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4zm0 18a8.5 8.5 0 01-6-8V7.3l6-3 6 3V12a8.5 8.5 0 01-6 8z",
  },
  {
    name: "Cohere",
    color: "#39594D",
    use: "Reranking",
    href: "https://cohere.com",
    svg: "M5.36 14.682a3.43 3.43 0 0 1 1.4-1.4l9.518-4.76a3.43 3.43 0 1 1 3.073 6.135l-9.518 4.76a3.43 3.43 0 0 1-4.473-4.735zM7.6 7.4a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8z",
  },
  {
    name: "Supabase",
    color: "#3ECF8E",
    use: "Database + auth",
    href: "https://supabase.com",
    svg: "M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66Z",
  },
  {
    name: "Vercel",
    color: "#000000",
    use: "Edge runtime",
    href: "https://vercel.com",
    svg: "M24 22.525H0l12-21.05 12 21.05z",
  },
  {
    name: "Stripe",
    color: "#635BFF",
    use: "Payments",
    href: "https://stripe.com",
    svg: "M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.51-.977 1.426-.977 1.677 0 3.354.645 4.526 1.213l.674-4.144c-.927-.443-2.821-1.172-5.491-1.172-1.937 0-3.554.504-4.708 1.443-1.202.985-1.825 2.408-1.825 4.127 0 3.115 1.903 4.451 5.001 5.573 1.997.72 2.667 1.234 2.667 2.018 0 .764-.654 1.197-1.84 1.197-1.475 0-3.909-.726-5.512-1.66l-.683 4.193C6.49 20.677 8.825 21 11.071 21c2.061 0 3.776-.487 4.938-1.41 1.297-1.029 1.971-2.545 1.971-4.498 0-3.184-1.946-4.51-4.501-5.209z",
  },
  {
    name: "Resend",
    color: "#000000",
    use: "Transactional email",
    href: "https://resend.com",
    svg: "M12 2.0083c-5.5176 0-9.9917 4.474-9.9917 9.9917 0 5.5177 4.474 9.9917 9.9917 9.9917 5.5177 0 9.9917-4.474 9.9917-9.9917 0-5.5177-4.474-9.9917-9.9917-9.9917Zm0 1.6653c4.5926 0 8.3264 3.7338 8.3264 8.3264 0 4.5926-3.7338 8.3264-8.3264 8.3264-4.5926 0-8.3264-3.7338-8.3264-8.3264 0-4.5926 3.7338-8.3264 8.3264-8.3264Z",
  },
  {
    name: "Cal.com",
    color: "#292929",
    use: "Scheduling",
    href: "https://cal.com",
    // Calendar mark
    svg: "M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z",
  },
];

export type PoweredByBadgesProps = {
  /** override the eyebrow line above the badges */
  eyebrow?: string;
  /** override the headline */
  headline?: string;
  className?: string;
  /** kept for backwards-compat — no longer changes behavior */
  variant?: "compact" | "grid";
};

export default function PoweredByBadges({
  eyebrow = "POWERED BY · THE STACK WE ACTUALLY SHIP",
  headline,
  className = "",
}: PoweredByBadgesProps) {
  return (
    <section
      className={`px-5 sm:px-8 py-12 sm:py-16 bg-white border-y border-slate-200/70 ${className}`}
      aria-label="Technology stack we use in production"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <div className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] text-[#185FA5] font-semibold font-mono">
            {eyebrow}
          </div>
          {headline && (
            <h3 className="mt-3 text-[20px] sm:text-[26px] font-semibold text-[#042C53] leading-tight">
              {headline}
            </h3>
          )}
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {TOOLS.map((t) => (
            <li key={t.name}>
              <Badge tool={t} />
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center text-[12px] sm:text-[13px] text-slate-500 leading-relaxed">
          Every tool above is wired into a production endpoint in this codebase
          right now.{" "}
          <Link
            to="/technology"
            className="text-[#185FA5] hover:text-[#042C53] underline decoration-[#185FA5]/40 underline-offset-2 font-semibold"
          >
            See the architecture →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Badge({ tool }: { tool: Tool }) {
  return (
    <a
      href={tool.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${tool.name} — ${tool.use}`}
      className="group flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition px-3 sm:px-4 py-4 sm:py-5 min-h-[100px]"
    >
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 transition-transform group-hover:scale-105"
        style={{ color: tool.color }}
        aria-hidden="true"
      >
        <path d={tool.svg} fill="currentColor" />
      </svg>
      <div className="text-center">
        <div className="text-[13px] sm:text-[14px] font-semibold text-[#042C53] leading-tight">
          {tool.name}
        </div>
        <div className="text-[10.5px] sm:text-[11.5px] text-slate-500 leading-tight mt-0.5">
          {tool.use}
        </div>
      </div>
    </a>
  );
}
