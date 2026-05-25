#!/usr/bin/env bash
# scripts/build-editorial-ads.sh — v166
# Renders the editorial-2030 ad template via headless Chrome.
# Mirrors scripts/render-hormozi-batch2.sh + hormozi-ads-data.py pattern.
#
# Usage:
#   bash scripts/build-editorial-ads.sh                # all 6 niches × 3 aspects = 18 ads
#   NICHES="hvac legal" bash scripts/build-editorial-ads.sh
#   ASPECTS="9x16" bash scripts/build-editorial-ads.sh
#
# Output: ads/static/editorial-2030/TYA_<niche>_editorial-2030_<aspect>.png
#
# Requires:
#   - Python 3
#   - Google Chrome at /Applications/Google Chrome.app/... or $CHROME_BIN
#     (if missing, falls back to HTML-only mode for manual review)

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

OUT_DIR="${OUT_DIR:-ads/static/editorial-2030}"
mkdir -p "$OUT_DIR"

echo "==> v166 editorial-2030 batch render"
echo "    repo: $REPO_ROOT"
echo "    out:  $OUT_DIR"
echo "    template: scripts/ad-templates/editorial-2030.html"
echo ""

OUT_DIR="$OUT_DIR" python3 scripts/editorial-2030-data.py

echo ""
echo "==> done. Files in $OUT_DIR/"
ls -1 "$OUT_DIR/" 2>/dev/null | head -30
