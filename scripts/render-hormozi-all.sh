#!/usr/bin/env bash
# v152 — re-render ALL Hormozi-2030 ads with new aspect-aware template
set -uo pipefail
cd "$(dirname "$0")/.."
export OUT_DIR="ads/static"
# unset NICHES + ASPECTS → uses every key from the Python dict
unset NICHES ASPECTS
/usr/bin/python3 scripts/hormozi-ads-data.py
