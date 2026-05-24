#!/usr/bin/env bash
# build-ad-contact-sheet.sh — v143
#
# Generates ads/REVIEW.html — single-file scrollable contact sheet of every
# ad in ads/static/. Grouped by niche, sub-grouped by framework, with all
# 3 aspect ratios side-by-side for direct comparison.
#
# Click any thumbnail to open the full-resolution PNG in a new tab.
# Click the niche header to jump to that section.
#
# Run:
#   bash scripts/build-ad-contact-sheet.sh && open ads/REVIEW.html

set -eo pipefail

STATIC_DIR="${STATIC_DIR:-ads/static}"
OUT="${OUT:-ads/REVIEW.html}"

cd "$(dirname "$0")/.."

# Collect ads — macOS bash 3.2 compatible (no mapfile, no associative arrays)
FILES=$(find "$STATIC_DIR" -name 'TYA_*_photo_*.png' | sort)
TOTAL=$(echo "$FILES" | grep -c . || echo 0)

# Extract unique niches in original order
NICHES=$(echo "$FILES" | sed -E 's|.*/TYA_([^_]+)_.*|\1|' | awk '!seen[$0]++')
NICHE_COUNT=$(echo "$NICHES" | grep -c . || echo 0)
TS=$(date '+%Y-%m-%d %H:%M')

cat > "$OUT" <<HTML
<!doctype html>
<meta charset="utf-8">
<title>TYA Ad Contact Sheet — $TOTAL ads</title>
<style>
  :root { color-scheme: dark; --navy:#042C53; --bone:#FAFAFA; --slate:#0B1B2B; --accent:#185FA5; --pain:#D9404B; --good:#22A36C; }
  * { box-sizing: border-box; }
  body { margin:0; font:14px/1.5 -apple-system,BlinkMacSystemFont,'Inter Tight',system-ui,sans-serif; background:#0a0d12; color:var(--bone); }
  header { position:sticky; top:0; z-index:10; background:rgba(10,13,18,0.94); backdrop-filter:blur(12px); padding:18px 28px; border-bottom:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
  header h1 { margin:0; font-size:18px; font-weight:600; letter-spacing:-0.01em; }
  header .meta { color:#8a93a4; font-size:13px; }
  header .toc { margin-left:auto; display:flex; flex-wrap:wrap; gap:6px; max-width:62%; }
  header .toc a { padding:4px 10px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); border-radius:999px; color:var(--bone); text-decoration:none; font-size:11px; text-transform:uppercase; letter-spacing:.08em; transition:all .15s; }
  header .toc a:hover { background:var(--accent); border-color:var(--accent); }
  section.niche { padding:36px 28px 20px; border-bottom:1px solid rgba(255,255,255,0.06); }
  section.niche h2 { margin:0 0 6px; font-size:28px; font-weight:600; letter-spacing:-0.02em; text-transform:capitalize; }
  section.niche .niche-sub { color:#8a93a4; font-size:12px; text-transform:uppercase; letter-spacing:.16em; margin-bottom:24px; }
  .framework-row { display:grid; grid-template-columns: 100px repeat(3, minmax(0,1fr)); gap:14px; margin-bottom:22px; align-items:start; }
  .framework-label { padding-top:6px; }
  .framework-label .fw { display:inline-block; padding:4px 10px; border-radius:6px; font-size:11px; text-transform:uppercase; letter-spacing:.12em; font-weight:600; }
  .fw.pain { background:rgba(217,64,75,0.16); color:#ff7a85; border:1px solid rgba(217,64,75,0.3); }
  .fw.outcome { background:rgba(34,163,108,0.16); color:#5bd49a; border:1px solid rgba(34,163,108,0.3); }
  .fw.urgency { background:rgba(245,158,11,0.16); color:#fbbf24; border:1px solid rgba(245,158,11,0.3); }
  .fw.contrarian { background:rgba(99,102,241,0.16); color:#a5b4fc; border:1px solid rgba(99,102,241,0.3); }
  .ad-cell { background:#12161e; border:1px solid rgba(255,255,255,0.08); border-radius:10px; overflow:hidden; position:relative; transition:transform .12s, border-color .12s; }
  .ad-cell:hover { transform:translateY(-2px); border-color:var(--accent); }
  .ad-cell img { width:100%; height:auto; display:block; }
  .ad-cell .aspect-tag { position:absolute; top:8px; left:8px; background:rgba(0,0,0,0.7); color:#fff; font-size:10px; padding:3px 7px; border-radius:4px; font-family:ui-monospace,Menlo,monospace; letter-spacing:.04em; }
  .ad-cell a { text-decoration:none; display:block; }
  footer { padding:32px 28px; color:#8a93a4; font-size:12px; border-top:1px solid rgba(255,255,255,0.06); }
  footer code { background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px; font-size:11px; }
</style>
<header>
  <h1>◆ TrainYourAgent · Ad Contact Sheet</h1>
  <span class="meta">$TOTAL ads · $NICHE_COUNT niches · 4 frameworks · 3 aspects · generated $TS</span>
  <nav class="toc">
HTML

echo "$NICHES" | while read n; do
  [[ -z "$n" ]] && continue
  echo "    <a href='#$n'>$n</a>" >> "$OUT"
done

cat >> "$OUT" <<HTML
  </nav>
</header>
HTML

# Group by niche → framework → aspect
echo "$NICHES" | while read niche; do
  [[ -z "$niche" ]] && continue
  cat >> "$OUT" <<HTML
<section class="niche" id="$niche">
  <h2>$niche</h2>
  <div class="niche-sub">4 hook frameworks · 3 aspect ratios each = 12 ads</div>
HTML

  for fw in pain outcome urgency contrarian; do
    # Check if this niche has this framework
    has_any=false
    for asp in 9x16 4x5 1x1; do
      if [[ -f "$STATIC_DIR/TYA_${niche}_${fw}_photo_${asp}.png" ]]; then
        has_any=true; break
      fi
    done
    [[ "$has_any" != "true" ]] && continue

    cat >> "$OUT" <<HTML
  <div class="framework-row">
    <div class="framework-label"><span class="fw $fw">$fw</span></div>
HTML
    for asp in 9x16 4x5 1x1; do
      f="$STATIC_DIR/TYA_${niche}_${fw}_photo_${asp}.png"
      if [[ -f "$f" ]]; then
        # Relative path from REVIEW.html location to img
        rel="static/$(basename "$f")"
        asp_disp=$(echo "$asp" | tr x :)
        cat >> "$OUT" <<HTML
    <div class="ad-cell"><a href="$rel" target="_blank"><img src="$rel" alt="$niche $fw $asp"><span class="aspect-tag">$asp_disp</span></a></div>
HTML
      else
        cat >> "$OUT" <<HTML
    <div class="ad-cell" style="opacity:0.3; min-height:120px;"></div>
HTML
      fi
    done
    echo "  </div>" >> "$OUT"
  done

  echo "</section>" >> "$OUT"
done

cat >> "$OUT" <<HTML
<footer>
  Click any ad to open full resolution. Regenerate this sheet:
  <code>bash scripts/build-ad-contact-sheet.sh</code> · Add ad to Meta as PAUSED draft:
  <code>bash scripts/upload-fb-creatives.sh</code> · Re-render all photos:
  <code>bash scripts/higgsfield-bulk-render.sh</code>
</footer>
HTML

echo "==> $OUT  ($TOTAL ads, ${#NICHES[@]} niches)"
echo "==> open: open $OUT"
