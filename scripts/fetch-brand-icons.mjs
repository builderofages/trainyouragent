#!/usr/bin/env node
// scripts/fetch-brand-icons.mjs — v272b
//
// Build-time fetch of simple-icons SVGs to public/icons/{slug}.svg so the
// runtime never depends on a third-party CDN. cdn.simpleicons.org has been
// intermittently 404'ing for our 12 brands. unpkg/jsdelivr mirror of the
// simple-icons npm package is rock-solid. Fetched at build time, cached in
// the repo so we never block deploys.

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "..", "public", "icons");

// Same brand list as PoweredByBadges
const BRANDS = [
  { slug: "anthropic",  color: "D4754C" },
  { slug: "vercel",     color: "000000" },
  { slug: "elevenlabs", color: "111111" },
  { slug: "twilio",     color: "F22F46" },
  { slug: "stripe",     color: "635BFF" },
  { slug: "openai",     color: "10A37F" },
  { slug: "supabase",   color: "3FCF8E" },
  { slug: "cloudflare", color: "F38020" },
  { slug: "github",     color: "1B1F23" },
  { slug: "groq",       color: "F55036" },
  { slug: "resend",     color: "000000" },
  { slug: "linear",     color: "5E6AD2" },
];

const MIRRORS = (slug) => [
  `https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${slug}.svg`,
  `https://unpkg.com/simple-icons@v13/icons/${slug}.svg`,
  `https://cdn.simpleicons.org/${slug}`,
];

async function fetchOne(slug) {
  for (const url of MIRRORS(slug)) {
    try {
      const r = await fetch(url, { headers: { "user-agent": "tya-build/1.0" } });
      if (r.ok) {
        const txt = await r.text();
        if (txt && txt.includes("<svg")) return txt;
      }
    } catch {}
  }
  return null;
}

function colorize(svg, hex) {
  // Force fill to brand color so the icon renders in color, not black
  if (svg.includes("fill=")) {
    return svg.replace(/fill="[^"]*"/, `fill="#${hex}"`);
  }
  return svg.replace("<svg", `<svg fill="#${hex}"`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  let ok = 0;
  let fail = 0;
  for (const b of BRANDS) {
    const svg = await fetchOne(b.slug);
    if (!svg) {
      console.warn(`[icons] FAILED ${b.slug}`);
      fail++;
      continue;
    }
    const colored = colorize(svg, b.color);
    await writeFile(resolve(OUT_DIR, `${b.slug}.svg`), colored, "utf8");
    ok++;
  }
  console.log(`[icons] wrote ${ok} brand SVGs to public/icons/ (${fail} failed)`);
  // NEVER fail the build. If fetch fails, the runtime falls back to the
  // letter-mark badge gracefully via the img onError handler. Better to
  // ship with letter marks than to block the deploy.
}

main().catch((e) => {
  console.error("[icons] crashed:", e);
  process.exit(1);
});
