#!/bin/bash
# v168 — export TrainYourAgent diamond mark + wordmark as PNG variants
# This time: NO text in SVG (avoids ImageMagick font-resolution issues on macOS).
# We render mark-only SVGs, then composite text via ImageMagick's -annotate
# with explicit font file path (/System/Library/Fonts/Supplemental/Arial Bold.ttf).
set -e
cd "$(dirname "$0")/.."
OUT="public/brand"
mkdir -p "$OUT"
M="/opt/homebrew/bin/magick"
FONT="/System/Library/Fonts/Supplemental/Arial Bold.ttf"
ITALIC_FONT="/System/Library/Fonts/Supplemental/Georgia Italic.ttf"
[[ -x "$M" ]] || { echo "ImageMagick required"; exit 1; }
[[ -f "$FONT" ]] || FONT="/System/Library/Fonts/HelveticaNeue.ttc"

# Diamond mark — navy on transparent
cat > /tmp/tya-mark-navy.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <g fill="none" stroke="#042C53" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
    <g stroke-width="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
    <circle cx="32" cy="32" r="3" fill="#042C53" stroke="none" />
  </g>
</svg>
SVG

# Diamond mark — white on transparent
cat > /tmp/tya-mark-white.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
    <g stroke-width="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
    <circle cx="32" cy="32" r="3" fill="#FFFFFF" stroke="none" />
  </g>
</svg>
SVG

# Favicon — rounded square, white mark on navy
cat > /tmp/tya-favicon.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#042C53"/>
  <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="3.4"><path d="M 32 12 L 52 32 L 32 52 L 12 32 Z" /></g>
    <g stroke-width="2"><path d="M 32 12 L 32 52" /><path d="M 12 32 L 52 32" /></g>
    <circle cx="32" cy="32" r="2.6" fill="#FFFFFF" stroke="none" />
  </g>
</svg>
SVG

# Wordmark base — diamond mark only on the left, leave space for text we composite
cat > /tmp/tya-wm-base-light.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 200">
  <rect width="720" height="200" fill="#FAF6EE"/>
  <g transform="translate(60,52)" fill="none" stroke="#042C53" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="6.4"><path d="M 51.2 9.6 L 92.8 51.2 L 51.2 92.8 L 9.6 51.2 Z" /></g>
    <g stroke-width="3.84"><path d="M 51.2 9.6 L 51.2 92.8" /><path d="M 9.6 51.2 L 92.8 51.2" /></g>
    <circle cx="51.2" cy="51.2" r="4.8" fill="#042C53" stroke="none" />
  </g>
</svg>
SVG

cat > /tmp/tya-wm-base-dark.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 200">
  <rect width="720" height="200" fill="#042C53"/>
  <g transform="translate(60,52)" fill="none" stroke="#FAF6EE" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="6.4"><path d="M 51.2 9.6 L 92.8 51.2 L 51.2 92.8 L 9.6 51.2 Z" /></g>
    <g stroke-width="3.84"><path d="M 51.2 9.6 L 51.2 92.8" /><path d="M 9.6 51.2 L 92.8 51.2" /></g>
    <circle cx="51.2" cy="51.2" r="4.8" fill="#FAF6EE" stroke="none" />
  </g>
</svg>
SVG

cat > /tmp/tya-og-base.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#042C53"/>
      <stop offset="100%" stop-color="#0A3D6E"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g transform="translate(120,180)" fill="none" stroke="#FFD60A" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="10"><path d="M 80 15 L 145 80 L 80 145 L 15 80 Z" /></g>
    <g stroke-width="6"><path d="M 80 15 L 80 145" /><path d="M 15 80 L 145 80" /></g>
    <circle cx="80" cy="80" r="7.5" fill="#FFD60A" stroke="none" />
  </g>
</svg>
SVG

echo "==> rendering PNGs..."

# Mark only — transparent — multiple sizes
for sz in 64 128 192 256 512 1024; do
  "$M" -background none -density 800 /tmp/tya-mark-navy.svg  -resize ${sz}x${sz} "$OUT/tya-mark-navy-${sz}.png"
  "$M" -background none -density 800 /tmp/tya-mark-white.svg -resize ${sz}x${sz} "$OUT/tya-mark-white-${sz}.png"
done

# Favicons
for sz in 16 32 64 128 192 512; do
  "$M" -background none -density 800 /tmp/tya-favicon.svg -resize ${sz}x${sz} "$OUT/tya-favicon-${sz}.png"
done

# Wordmark light — render base SVG then annotate "TrainYourAgent" with explicit font path
"$M" -background none -density 400 /tmp/tya-wm-base-light.svg -resize 1440x400 \
  -font "$FONT" -fill "#042C53" -pointsize 110 \
  -gravity NorthWest -annotate +360+135 "TrainYourAgent" \
  "$OUT/tya-wordmark-light-1440.png"

"$M" -background none -density 400 /tmp/tya-wm-base-light.svg -resize 720x200 \
  -font "$FONT" -fill "#042C53" -pointsize 56 \
  -gravity NorthWest -annotate +180+68 "TrainYourAgent" \
  "$OUT/tya-wordmark-light-720.png"

# Wordmark dark
"$M" -background none -density 400 /tmp/tya-wm-base-dark.svg -resize 1440x400 \
  -font "$FONT" -fill "#FAF6EE" -pointsize 110 \
  -gravity NorthWest -annotate +360+135 "TrainYourAgent" \
  "$OUT/tya-wordmark-dark-1440.png"

"$M" -background none -density 400 /tmp/tya-wm-base-dark.svg -resize 720x200 \
  -font "$FONT" -fill "#FAF6EE" -pointsize 56 \
  -gravity NorthWest -annotate +180+68 "TrainYourAgent" \
  "$OUT/tya-wordmark-dark-720.png"

# Social OG card (1200×630) with text
"$M" -background none -density 400 /tmp/tya-og-base.svg -resize 1200x630 \
  -font "$FONT" -fill "#FFFFFF" -pointsize 84 \
  -gravity NorthWest -annotate +320+170 "TrainYourAgent" \
  -font "$FONT" -fill "#9CC4EC" -pointsize 32 \
  -annotate +320+260 "Your phone answered in 21 days." \
  -font "$FONT" -fill "#FFD60A" -pointsize 32 \
  -annotate +320+304 "If it doesn't book one real appointment, you pay nothing." \
  -font "$FONT" -fill "#9CC4EC" -pointsize 22 \
  -annotate +120+560 "TRAINYOURAGENT.COM" \
  "$OUT/tya-og-1200x630.png"

# Keep SVG sources too
cp /tmp/tya-mark-navy.svg "$OUT/tya-mark-navy.svg"
cp /tmp/tya-mark-white.svg "$OUT/tya-mark-white.svg"
cp /tmp/tya-favicon.svg "$OUT/tya-favicon.svg"

echo "==> done. files:"
ls -1 "$OUT" | head -30
