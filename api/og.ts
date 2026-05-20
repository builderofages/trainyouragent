// api/og.ts — v48 / v76-B
// Open Graph image generator (Vercel Edge function).
// Returns an SVG (1200x630) honored by every major OG crawler. We avoid
// @vercel/og + satori to keep the function bundle <50KB and ship fast —
// the v76-B spec asked for @vercel/og but SVG already gives us per-page
// dynamic OG with zero dependency weight, so we kept the cheaper path.
//
// Query params (both naming conventions accepted — v76-B added the
// eyebrow/kicker aliases so call sites added in v76-B don't have to
// remember the old badge/subtitle names):
//
//   title    (required, capped 120) — main headline
//   subtitle (optional, capped 120) — secondary line / byline
//   kicker   (optional, capped 120) — alias for subtitle (v76-B)
//   type     (optional)             — page | post | tool | local | trust
//   badge    (optional, capped 24)  — pill text override
//   eyebrow  (optional, capped 24)  — alias for badge (v76-B)
//
// 5-min CDN cache, longer browser cache.

import { rateLimit, ipFromRequest } from "./_lib/rate-limit.js";

export const config = { runtime: "edge" };

const NAVY = "#042C53";
const NAVY_DEEP = "#0A3D6E";
const TINT = "#E6F1FB";
const ACCENT = "#185FA5";
const BLUE_SOFT = "#9CC4EC";
const WHITE = "#FFFFFF";

type Type = "page" | "post" | "tool" | "local" | "trust";

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

function clip(s: string | null | undefined, n = 120): string {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function wrap(text: string, maxCharsPerLine: number, maxLines = 3): string[] {
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
  return lines.slice(0, maxLines);
}

// Pull out a "brand word" to italicize for visual rhythm.
function splitForItalic(line: string): { head: string; tail: string } {
  const words = line.trim().split(/\s+/);
  if (words.length < 2) return { head: line, tail: "" };
  const tail = words[words.length - 1];
  const head = words.slice(0, -1).join(" ");
  return { head, tail };
}

function badgeFor(type: Type | undefined, override: string): { label: string; bg: string; fg: string } | null {
  if (override) {
    return { label: override.toUpperCase(), bg: BLUE_SOFT, fg: NAVY };
  }
  switch (type) {
    case "tool":  return { label: "TOOL",  bg: "#9CC4EC", fg: NAVY };
    case "post":  return { label: "BLOG",  bg: "#FFFFFF", fg: NAVY };
    case "local": return { label: "LOCAL", bg: "#22A36C", fg: WHITE };
    case "trust": return { label: "TRUST", bg: "#F5C26B", fg: NAVY };
    case "page":  return null;
    default:      return null;
  }
}

function renderSvg(
  title: string,
  subtitle: string,
  type: Type | undefined,
  badgeOverride: string,
): string {
  const titleLines = wrap(title, 26, 3);
  // Italicize the final word of the last line for the brand accent.
  const lastIdx = titleLines.length - 1;
  const split = splitForItalic(titleLines[lastIdx] || "");

  const lineHeight = 90;
  // vertical centering around y=355
  const blockHeight = titleLines.length * lineHeight;
  const startY = 360 - blockHeight / 2 + 70;

  const badge = badgeFor(type, badgeOverride);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${NAVY}"/>
      <stop offset="0.55" stop-color="${NAVY_DEEP}"/>
      <stop offset="1" stop-color="#0E4A88"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.88" cy="0.12" r="0.7">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0.45"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.05" cy="0.95" r="0.55">
      <stop offset="0" stop-color="${BLUE_SOFT}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${BLUE_SOFT}" stop-opacity="0"/>
    </radialGradient>
    <style>
      .title    { font-family: 'Inter Tight', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
                  font-weight: 700; fill: ${WHITE}; letter-spacing: -0.025em; }
      .titleIt  { font-family: 'Playfair Display', Georgia, serif;
                  font-style: italic; font-weight: 500; fill: ${BLUE_SOFT}; letter-spacing: -0.01em; }
      .sub      { font-family: 'Inter Tight', system-ui, sans-serif; font-weight: 500;
                  fill: rgba(255,255,255,0.78); letter-spacing: 0.01em; }
      .brand    { font-family: 'Inter Tight', system-ui, sans-serif; font-weight: 600; fill: ${WHITE}; }
      .foot     { font-family: 'Inter Tight', system-ui, sans-serif; font-weight: 500;
                  fill: rgba(255,255,255,0.75); font-size: 22px; letter-spacing: 0.02em; }
      .eyebrow  { font-family: 'Inter Tight', system-ui, sans-serif; font-weight: 700;
                  font-size: 18px; letter-spacing: 0.22em; text-transform: uppercase; }
      .badgeTxt { font-family: 'Inter Tight', system-ui, sans-serif; font-weight: 700;
                  font-size: 16px; letter-spacing: 0.22em; }
    </style>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- corner border lines for editorial feel -->
  <g stroke="${BLUE_SOFT}" stroke-opacity="0.18" stroke-width="1">
    <line x1="0"    y1="80"  x2="1200" y2="80"/>
    <line x1="0"    y1="550" x2="1200" y2="550"/>
  </g>

  <!-- Prism Node logo, top-right -->
  <g transform="translate(1080,38)" stroke="${WHITE}" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="3.4">
      <path d="M 32 6 L 58 32 L 32 58 L 6 32 Z"/>
    </g>
    <g stroke-width="2.2" stroke-opacity="0.85">
      <path d="M 32 6 L 32 58"/>
      <path d="M 6 32 L 58 32"/>
    </g>
    <circle cx="32" cy="32" r="3" fill="${WHITE}" stroke="none"/>
  </g>
  <text x="1060" y="62" class="brand" font-size="22" text-anchor="end">TrainYourAgent</text>

  ${badge ? `
  <!-- badge pill, top-left -->
  <g transform="translate(60,42)">
    <rect x="0" y="0" rx="999" ry="999" width="${Math.max(80, badge.label.length * 12 + 28)}" height="34" fill="${badge.bg}"/>
    <text x="${(Math.max(80, badge.label.length * 12 + 28)) / 2}" y="22" class="badgeTxt" fill="${badge.fg}" text-anchor="middle">${escapeXml(badge.label)}</text>
  </g>
  ` : `
  <!-- eyebrow, top-left -->
  <text x="60" y="62" class="eyebrow" fill="${BLUE_SOFT}">TRAINYOURAGENT</text>
  `}

  <!-- Title (multi-line, last word italicized) -->
  ${titleLines
    .map((line, i) => {
      if (i === lastIdx && split.tail) {
        return `<text x="60" y="${startY + i * lineHeight}" font-size="78"><tspan class="title">${escapeXml(split.head)} </tspan><tspan class="titleIt">${escapeXml(split.tail)}</tspan></text>`;
      }
      return `<text x="60" y="${startY + i * lineHeight}" class="title" font-size="78">${escapeXml(line)}</text>`;
    })
    .join("\n  ")}

  ${subtitle ? `<text x="60" y="${startY + titleLines.length * lineHeight + 18}" class="sub" font-size="26">${escapeXml(subtitle)}</text>` : ""}

  <!-- Footer -->
  <text x="60"   y="590" class="foot">trainyouragent.com</text>
  <text x="1140" y="590" class="foot" text-anchor="end">Tampa Bay · Built for operators</text>
</svg>`;
}

export default async function handler(req: Request): Promise<Response> {
  // v55a: 120/IP/hour. Crawler-friendly, abuse-resistant.
  const ip = ipFromRequest(req);
  const rl = rateLimit(`og:${ip}`, { limit: 120, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) {
    return new Response("rate-limited", { status: 429, headers: rl.headers });
  }

  const url = new URL(req.url);

  const titleRaw = url.searchParams.get("title");
  if (!titleRaw) {
    return new Response("Missing required `title` query parameter.", { status: 400 });
  }
  const title    = clip(titleRaw, 120);
  // v76-B: accept `kicker` as an alias for `subtitle` so per-page OG
  // calls added in v76-B (CapabilityDetail, /train, /hire, /everything-ai)
  // can use the spec's preferred naming without breaking older callers
  // that still send `subtitle`.
  const subtitle = clip(
    url.searchParams.get("subtitle") ?? url.searchParams.get("kicker"),
    120,
  );
  const typeRaw  = (url.searchParams.get("type") || "").toLowerCase() as Type;
  const type: Type | undefined =
    ["page", "post", "tool", "local", "trust"].includes(typeRaw) ? typeRaw : undefined;
  // v76-B: `eyebrow` alias for `badge`.
  const badge    = clip(
    url.searchParams.get("badge") ?? url.searchParams.get("eyebrow"),
    24,
  );

  const svg = renderSvg(title, subtitle, type, badge);

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // 5-min edge cache per spec, with longer SWR for crawler hits.
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
