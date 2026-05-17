// scripts/gen-favicons.mjs
// v52a: Generate PNG favicons (16, 32, 180, og-default 1200x630) from
// public/favicon.svg + public/og-default.svg. Run via `node scripts/gen-favicons.mjs`.
//
// This is best-effort — if sharp isn't installed we no-op gracefully so the
// build doesn't fail in environments where favicon assets are pre-generated
// and checked in.

import { readFile, writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("[gen-favicons] sharp not installed — skipping PNG generation");
  process.exit(0);
}

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function svgToPng(svgPath, outPath, size, opts = {}) {
  const svg = await readFile(svgPath);
  let pipeline = sharp(svg, { density: opts.density || 384 });
  if (size) pipeline = pipeline.resize(size, size, { fit: "contain", background: opts.bg || { r: 255, g: 255, b: 255, alpha: 0 } });
  if (opts.flatten) pipeline = pipeline.flatten({ background: opts.bg || { r: 255, g: 255, b: 255 } });
  await pipeline.png({ compressionLevel: 9 }).toFile(outPath);
  console.log(`[gen-favicons] wrote ${outPath}`);
}

async function svgToPngWH(svgPath, outPath, width, height, opts = {}) {
  const svg = await readFile(svgPath);
  await sharp(svg, { density: opts.density || 256 })
    .resize(width, height, { fit: "fill" })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`[gen-favicons] wrote ${outPath}`);
}

const faviconSvg = join(PUBLIC, "favicon.svg");
const ogSvg = join(PUBLIC, "og-default.svg");

if (!(await exists(faviconSvg))) {
  console.error("[gen-favicons] missing public/favicon.svg");
  process.exit(1);
}

// 16x16 + 32x32 — transparent background (browsers handle dark mode well with the navy stroke)
await svgToPng(faviconSvg, join(PUBLIC, "favicon-16.png"), 16);
await svgToPng(faviconSvg, join(PUBLIC, "favicon-32.png"), 32);

// 180x180 apple-touch-icon: white background, mark centered at ~80% size.
{
  const svg = await readFile(faviconSvg);
  const mark = await sharp(svg, { density: 512 })
    .resize(Math.round(180 * 0.74), Math.round(180 * 0.74), { fit: "contain" })
    .png()
    .toBuffer();
  const bg = sharp({
    create: { width: 180, height: 180, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  });
  await bg
    .composite([{ input: mark, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(join(PUBLIC, "apple-touch-icon.png"));
  console.log("[gen-favicons] wrote apple-touch-icon.png (180x180, white bg)");
}

// 1200x630 og-default.png from og-default.svg
if (await exists(ogSvg)) {
  await svgToPngWH(ogSvg, join(PUBLIC, "og-default.png"), 1200, 630, { density: 256 });
}

console.log("[gen-favicons] done");
