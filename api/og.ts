// api/og.ts
// Open Graph image generator (Vercel Edge function).
// Returns a 1200x630 PNG-equivalent image for any page.
//
// Usage:
//   /api/og?title=My%20Page%20Title
//   /api/og?title=...&subtitle=...&theme=navy
//
// Implementation note: We return SVG (Content-Type: image/svg+xml) instead
// of pulling in @vercel/og + the satori/wasm payload. SVG is honored by
// every major OG crawler (Facebook, X, LinkedIn, Slack, Discord). It also
// keeps the function bundle <50KB and avoids adding heavy deps.
//
// If a downstream platform demands raw PNG (rare in 2026), wrap this with
// a single-call rasterizer behind a CDN cache; the SVG payload is the same.

export const config = { runtime: "edge" };

const NAVY = "#042C53";
const PAPER = "#F7F5F0";
const ACCENT = "#185FA5";
const TEXT_LIGHT = "#FFFFFF";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (ch) => {
    switch (ch) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return ch;
    }
  });
}

/** Naive line-wrap so titles don't run off the canvas. */
function wrap(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxCharsPerLine) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (cur ? cur + " " : "") + w;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 4); // never more than 4 lines
}

function renderSvg(title: string, subtitle: string, theme: "navy" | "paper") {
  const isNavy = theme === "navy";
  const bg = isNavy ? NAVY : PAPER;
  const fg = isNavy ? TEXT_LIGHT : NAVY;
  const muted = isNavy ? "rgba(255,255,255,0.7)" : "rgba(4,44,83,0.65)";
  const accentRing = isNavy ? "rgba(156,196,236,0.5)" : "rgba(24,95,165,0.45)";

  const lines = wrap(title, 28);
  const lineHeight = 88;
  const startY = 280 - ((lines.length - 1) * lineHeight) / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="1" stop-color="${isNavy ? "#0A3D6E" : "#FFFFFF"}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.8">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="${isNavy ? 0.35 : 0.18}"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <style>
      .title { font-family: 'Inter Tight', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
               font-weight: 700; fill: ${fg}; letter-spacing: -0.025em; }
      .sub   { font-family: 'Inter Tight', system-ui, sans-serif; font-weight: 500;
               fill: ${muted}; letter-spacing: 0.01em; }
      .brand { font-family: 'Inter Tight', system-ui, sans-serif; font-weight: 600; fill: ${fg}; }
      .foot  { font-family: 'Inter Tight', system-ui, sans-serif; font-weight: 500; fill: ${muted};
               font-size: 22px; letter-spacing: 0.02em; }
      .eyebrow { font-family: 'Inter Tight', system-ui, sans-serif; font-weight: 600; fill: ${accentRing};
                 font-size: 18px; letter-spacing: 0.18em; text-transform: uppercase; }
    </style>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Prism Node logo, top-left -->
  <g transform="translate(60,60)" stroke="${fg}" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="4">
      <path d="M 32 6 L 58 32 L 32 58 L 6 32 Z"/>
    </g>
    <g stroke-width="2.4">
      <path d="M 32 6 L 32 58"/>
      <path d="M 6 32 L 58 32"/>
    </g>
    <circle cx="32" cy="32" r="3" fill="${fg}" stroke="none"/>
  </g>
  <text x="140" y="100" class="brand" font-size="28">TrainYourAgent</text>

  <!-- Eyebrow -->
  <text x="60" y="190" class="eyebrow">${escapeXml(subtitle || "AI Voice Agents · Built for Operators")}</text>

  <!-- Title (multi-line) -->
  ${lines
    .map(
      (line, i) =>
        `<text x="60" y="${startY + i * lineHeight}" class="title" font-size="76">${escapeXml(line)}</text>`
    )
    .join("\n  ")}

  <!-- Footer -->
  <line x1="60" y1="540" x2="1140" y2="540" stroke="${fg}" stroke-opacity="0.18" stroke-width="1"/>
  <text x="60" y="585" class="foot">trainyouragent.com  ·  Tampa Bay, FL</text>
  <text x="1140" y="585" class="foot" text-anchor="end">Live agents in production</text>
</svg>`;
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const titleRaw = url.searchParams.get("title") || "AI agents that actually run your business by morning.";
  const subtitle = url.searchParams.get("subtitle") || "AI Voice Agents · Built for Operators";
  const theme = (url.searchParams.get("theme") || "navy").toLowerCase() === "paper" ? "paper" : "navy";

  // Cap title length to keep SVG bounded.
  const title = titleRaw.slice(0, 140);

  const svg = renderSvg(title, subtitle, theme);

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // Cache aggressively at the CDN — OG content rarely changes per URL.
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
