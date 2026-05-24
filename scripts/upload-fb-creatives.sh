#!/usr/bin/env bash
# upload-fb-creatives.sh — v134
#
# Bulk-creates Meta ad creatives + draft ads under the TYA campaign via the
# Graph API v19. Bypasses Ads Manager UI entirely so Chrome MCP's read-only
# Facebook permission isn't a blocker.
#
# This script is the partner to scripts/setup-fb-campaign.sh (v114, which
# creates the Campaign + Ad Set scaffolding). Run this AFTER that script
# succeeds and you have a CAMPAIGN_ID + AD_SET_ID to reference.
#
# What it does:
#   1. Uploads every image in ads/static/ + every video in ads/video/ to
#      the ad account's library via /act_<id>/adimages and /advideos.
#   2. Creates an AdCreative for each upload with the standard TYA primary
#      text + headline + description + /apply CTA.
#   3. Creates an Ad in the named ad set, status = PAUSED (so nothing
#      spends a cent without your explicit unpause in Ads Manager).
#
# Required env vars (export before running, or put in .env):
#   FB_ACCESS_TOKEN     System User token w/ ads_management scope
#   FB_AD_ACCOUNT_ID    Numeric (no act_ prefix) — 1011542367743702 for TYA
#   FB_PAGE_ID          TYA Facebook Page numeric ID
#   FB_PIXEL_ID         (Optional) Pixel ID to attach for Lead optimization
#   FB_CAMPAIGN_ID      From setup-fb-campaign.sh output
#   FB_AD_SET_ID        From setup-fb-campaign.sh output
#
# How to get FB_ACCESS_TOKEN (one-time, 60 seconds):
#   1. business.facebook.com → Business Settings → System Users
#   2. Add → "TYA Automation" → admin
#   3. Add Asset → Ad Accounts → pick TYA → check ads_management
#   4. Generate New Token → 60 day → ads_management,pages_show_list,business_management
#   5. Copy + export FB_ACCESS_TOKEN
#
# Usage:
#   FB_ACCESS_TOKEN=xxx FB_AD_ACCOUNT_ID=1011542367743702 \
#     FB_PAGE_ID=xxx FB_CAMPAIGN_ID=xxx FB_AD_SET_ID=xxx \
#     bash scripts/upload-fb-creatives.sh

set -euo pipefail

GRAPH="https://graph.facebook.com/v19.0"

err() { echo "ERROR: $*" >&2; exit 1; }

[[ -n "${FB_ACCESS_TOKEN:-}" ]]   || err "FB_ACCESS_TOKEN unset. See header for how to generate."
[[ -n "${FB_AD_ACCOUNT_ID:-}" ]]  || err "FB_AD_ACCOUNT_ID unset. TYA ad account = 1011542367743702."
[[ -n "${FB_PAGE_ID:-}" ]]        || err "FB_PAGE_ID unset. Find via: curl $GRAPH/me/accounts?access_token=\$FB_ACCESS_TOKEN"
[[ -n "${FB_CAMPAIGN_ID:-}" ]]    || err "FB_CAMPAIGN_ID unset. Run scripts/setup-fb-campaign.sh first."
[[ -n "${FB_AD_SET_ID:-}" ]]      || err "FB_AD_SET_ID unset. Run scripts/setup-fb-campaign.sh first."

ACT="act_${FB_AD_ACCOUNT_ID}"
ADS_DIR="${ADS_DIR:-ads}"
STATIC_DIR="$ADS_DIR/static"
VIDEO_DIR="$ADS_DIR/video"

PRIMARY_TEXT="${PRIMARY_TEXT:-You're losing \$4.62/min in missed calls. Voice agent picks up 24/7, qualifies the lead, books on your calendar. 21 days from kickoff to live. Pay only when it earns.}"
HEADLINE="${HEADLINE:-Stop the leak. Agent picks up.}"
DESCRIPTION="${DESCRIPTION:-AI voice receptionist for local service businesses.}"
LANDING_URL="${LANDING_URL:-https://www.trainyouragent.com/apply}"
CTA_TYPE="${CTA_TYPE:-APPLY_NOW}"

echo "==> Account:    $ACT"
echo "==> Page:       $FB_PAGE_ID"
echo "==> Campaign:   $FB_CAMPAIGN_ID"
echo "==> Ad Set:     $FB_AD_SET_ID"
echo "==> Static dir: $STATIC_DIR"
echo "==> Video dir:  $VIDEO_DIR"
echo ""

upload_image() {
  local file="$1"
  echo "  → Uploading image: $(basename "$file")"
  local resp
  resp=$(curl -sS -X POST "$GRAPH/$ACT/adimages" \
    -F "access_token=$FB_ACCESS_TOKEN" \
    -F "source=@$file")
  echo "$resp" | python3 -c "import sys,json; d=json.load(sys.stdin); k=list(d['images'].keys())[0]; print(d['images'][k]['hash'])"
}

create_image_creative() {
  local image_hash="$1" name="$2"
  echo "  → AdCreative for $name"
  local link_data
  link_data=$(python3 -c "
import json
print(json.dumps({
  'link': '$LANDING_URL',
  'message': '$PRIMARY_TEXT'.replace(chr(39), chr(8217)),
  'name': '$HEADLINE',
  'description': '$DESCRIPTION',
  'image_hash': '$image_hash',
  'call_to_action': {'type': '$CTA_TYPE', 'value': {'link': '$LANDING_URL'}}
}))")
  local payload
  payload=$(python3 -c "
import json,os
print(json.dumps({
  'name': 'TYA_CR_' + '$name',
  'object_story_spec': {'page_id': '$FB_PAGE_ID', 'link_data': $link_data}
}))")
  local resp
  resp=$(curl -sS -X POST "$GRAPH/$ACT/adcreatives" \
    -H "Content-Type: application/json" \
    -d "{\"access_token\":\"$FB_ACCESS_TOKEN\",\"name\":\"TYA_CR_$name\",\"object_story_spec\":{\"page_id\":\"$FB_PAGE_ID\",\"link_data\":$link_data}}")
  echo "$resp" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id','ERR:'+str(d)))"
}

upload_video() {
  local file="$1"
  echo "  → Uploading video: $(basename "$file")"
  local resp
  resp=$(curl -sS -X POST "$GRAPH/$ACT/advideos" \
    -F "access_token=$FB_ACCESS_TOKEN" \
    -F "source=@$file")
  echo "$resp" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id','ERR:'+str(d)))"
}

create_video_creative() {
  local video_id="$1" name="$2"
  echo "  → AdCreative for video $name"
  # Video creative shape — uses video_data inside object_story_spec
  local resp
  resp=$(curl -sS -X POST "$GRAPH/$ACT/adcreatives" \
    -H "Content-Type: application/json" \
    -d "{
      \"access_token\":\"$FB_ACCESS_TOKEN\",
      \"name\":\"TYA_CR_VID_$name\",
      \"object_story_spec\":{
        \"page_id\":\"$FB_PAGE_ID\",
        \"video_data\":{
          \"video_id\":\"$video_id\",
          \"message\":\"$PRIMARY_TEXT\",
          \"title\":\"$HEADLINE\",
          \"call_to_action\":{
            \"type\":\"$CTA_TYPE\",
            \"value\":{\"link\":\"$LANDING_URL\"}
          }
        }
      }
    }")
  echo "$resp" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id','ERR:'+str(d)))"
}

create_ad() {
  local creative_id="$1" name="$2"
  echo "  → Creating Ad: $name (PAUSED)"
  local resp
  resp=$(curl -sS -X POST "$GRAPH/$ACT/ads" \
    -d "access_token=$FB_ACCESS_TOKEN" \
    -d "name=TYA_AD_$name" \
    -d "adset_id=$FB_AD_SET_ID" \
    -d "creative={\"creative_id\":\"$creative_id\"}" \
    -d "status=PAUSED")
  echo "$resp" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id','ERR:'+str(d)))"
}

# === STATIC IMAGE ADS ===
if [[ -d "$STATIC_DIR" ]]; then
  echo "==> Processing static images in $STATIC_DIR"
  for f in "$STATIC_DIR"/*.{jpg,jpeg,png}; do
    [[ -f "$f" ]] || continue
    base=$(basename "$f" | sed 's/\.[^.]*$//' | tr ' ' '_' | tr -cd '[:alnum:]_-')
    hash=$(upload_image "$f")
    creative_id=$(create_image_creative "$hash" "$base")
    ad_id=$(create_ad "$creative_id" "$base")
    echo "  ✓ Ad $ad_id created (PAUSED) for $base"
    echo ""
  done
else
  echo "==> Skipping static images — $STATIC_DIR not found"
fi

# === VIDEO ADS ===
if [[ -d "$VIDEO_DIR" ]]; then
  echo "==> Processing videos in $VIDEO_DIR"
  for f in "$VIDEO_DIR"/*.{mp4,mov}; do
    [[ -f "$f" ]] || continue
    base=$(basename "$f" | sed 's/\.[^.]*$//' | tr ' ' '_' | tr -cd '[:alnum:]_-')
    video_id=$(upload_video "$f")
    echo "  → Waiting 60s for Facebook to process video $video_id..."
    sleep 60
    creative_id=$(create_video_creative "$video_id" "$base")
    ad_id=$(create_ad "$creative_id" "$base")
    echo "  ✓ Ad $ad_id created (PAUSED) for $base"
    echo ""
  done
else
  echo "==> Skipping videos — $VIDEO_DIR not found"
fi

echo ""
echo "==> Done. All ads created as PAUSED drafts in ad set $FB_AD_SET_ID."
echo "==> Review in Ads Manager → Ads tab → filter by 'TYA_AD_' → unpause when ready."
