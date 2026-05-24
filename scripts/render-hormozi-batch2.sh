#!/usr/bin/env bash
# v149 — render second batch of Hormozi ads (10 new niches)
set -uo pipefail
cd "$(dirname "$0")/.."
export NICHES="realestate solar accounting automotive gyms bars property-mgmt pest-control saas insurance"
export OUT_DIR="ads/static"
/usr/bin/python3 scripts/hormozi-ads-data.py
