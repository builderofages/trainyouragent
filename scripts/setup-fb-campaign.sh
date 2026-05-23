#!/usr/bin/env bash
# scripts/setup-fb-campaign.sh — v114
#
# Creates the full TrainYourAgent paid-acquisition Meta campaign as DRAFT
# via the Marketing API. One command, three Meta API objects (Campaign +
# Ad Set + Ad), correctly named, correctly owned by the TYA Page, all
# pointing at /apply.
#
# Usage:
#   export FB_ACCESS_TOKEN="EAA..."        # System User or User token w/ ads_management + business_management
#   export FB_AD_ACCOUNT_ID="1011542367743702"  # without "act_" prefix
#   export FB_PAGE_ID="..."                # the TrainYourAgent FB Page ID
#   export FB_INSTAGRAM_ID="..."           # optional — @trainyouragent IG actor
#   export FB_PIXEL_ID="..."               # the TYA pixel
#   bash scripts/setup-fb-campaign.sh
#
# What it creates (all PAUSED so nothing goes live without you reviewing):
#   1. Campaign:  TYA_LEAD_APPLY_COLD_2026-Q2  (Leads, CBO $100/day)
#   2. Ad Set:    TYA_AS_TampaBay-50mi_SMB-Owner_28-58_Broad
#                 (Tampa 50mi, age 28-58, SMB-owner targeting, optimizes for Lead)
#   3. One starter Ad pointing at /apply
#      (creatives still need to be uploaded to Meta Media Library + attached
#       via the Ads Manager UI — the API call below creates the ad shell
#       with copy already filled in.)
#
# How to get FB_ACCESS_TOKEN:
#   1. https://business.facebook.com → Business Settings → Users → System Users
#   2. Add a System User → name it "TYA-Marketing-API" → System User role
#   3. Click "Generate New Token" → permissions: ads_management, business_management
#   4. Copy the token (only shown once).
#
# How to get FB_PAGE_ID:
#   1. https://business.facebook.com → Business Settings → Accounts → Pages
#   2. Click the TrainYourAgent Page → the ID is in the URL or "Page details"
#
# How to get FB_PIXEL_ID:
#   Events Manager → your TYA Pixel → Pixel ID (15-16 digits)
#
# Safety:
#   - Every object is created with status=PAUSED. Nothing spends until you
#     unpause from Ads Manager.
#   - Special_ad_categories left empty (not a special category audience).
#   - Page ID is REQUIRED — script fails loudly if not set, preventing
#     accidental creation under the wrong Page (e.g. Citrusburn).

set -euo pipefail

API="https://graph.facebook.com/v19.0"

# -------- pre-flight ----------------------------------------------------

require() {
  local var="$1"
  if [ -z "${!var:-}" ]; then
    echo "❌  Missing required env var: $var" >&2
    echo "    See header of this script for setup steps." >&2
    exit 1
  fi
}

require FB_ACCESS_TOKEN
require FB_AD_ACCOUNT_ID
require FB_PAGE_ID
require FB_PIXEL_ID

ACT="act_${FB_AD_ACCOUNT_ID}"
NOW=$(date +%Y%m%d)
TODAY_PLUS_1=$(date -u -v+1d +"%Y-%m-%dT11:00:00+0000" 2>/dev/null || date -u -d '+1 day 11:00' +"%Y-%m-%dT11:00:00+0000")

echo "🔧  Pre-flight"
echo "    Ad account:        $ACT"
echo "    Page:              $FB_PAGE_ID"
echo "    Instagram:         ${FB_INSTAGRAM_ID:-(not set, ad will show Page only)}"
echo "    Pixel:             $FB_PIXEL_ID"
echo "    Campaign launch:   $TODAY_PLUS_1 (tomorrow 11:00 UTC, paused)"
echo

# Sanity-check the token + account binding.
echo "🔐  Verifying token has access to ad account..."
verify=$(curl -sS "$API/$ACT?fields=name,account_status&access_token=$FB_ACCESS_TOKEN")
if echo "$verify" | grep -q '"error"'; then
  echo "❌  Token verification failed:" >&2
  echo "$verify" >&2
  exit 1
fi
echo "    OK — account: $(echo "$verify" | python3 -c 'import sys,json;d=json.load(sys.stdin);print(d.get("name","?"))')"
echo

# -------- 1. Campaign ---------------------------------------------------

CAMPAIGN_NAME="TYA_LEAD_APPLY_COLD_2026-Q2"
echo "📣  Creating Campaign: $CAMPAIGN_NAME"

campaign_resp=$(curl -sS -X POST "$API/$ACT/campaigns" \
  -d "name=$CAMPAIGN_NAME" \
  -d "objective=OUTCOME_LEADS" \
  -d "buying_type=AUCTION" \
  -d "status=PAUSED" \
  -d "special_ad_categories=[]" \
  -d "daily_budget=10000" \
  -d "bid_strategy=LOWEST_COST_WITHOUT_CAP" \
  -d "access_token=$FB_ACCESS_TOKEN")

if echo "$campaign_resp" | grep -q '"error"'; then
  echo "❌  Campaign create failed:" >&2
  echo "$campaign_resp" >&2
  exit 1
fi
CAMPAIGN_ID=$(echo "$campaign_resp" | python3 -c 'import sys,json;print(json.load(sys.stdin)["id"])')
echo "    ✅  Campaign ID: $CAMPAIGN_ID"
echo "    (Daily budget: \$100.00 USD. CBO ON. Status: PAUSED.)"
echo

# -------- 2. Ad Set -----------------------------------------------------

ADSET_NAME="TYA_AS_TampaBay-50mi_SMB-Owner_28-58_Broad"
echo "🎯  Creating Ad Set: $ADSET_NAME"

# Tampa Bay 50mi radius + age 28-58 + SMB owner detailed targeting.
# Detailed targeting: well-known Meta interest IDs for SMB owners + local services.
TARGETING=$(cat <<'JSON'
{
  "geo_locations": {
    "custom_locations": [{
      "name": "Tampa, FL",
      "latitude": 27.9506,
      "longitude": -82.4572,
      "radius": 50,
      "distance_unit": "mile"
    }]
  },
  "age_min": 28,
  "age_max": 58,
  "genders": [0],
  "locales": [6, 23],
  "flexible_spec": [{
    "behaviors": [{"id":"6002714895372","name":"Small business owners"}],
    "interests": [
      {"id":"6003391211538","name":"Small business"},
      {"id":"6003277229371","name":"Local service business"},
      {"id":"6003251803722","name":"HVAC"},
      {"id":"6003297143040","name":"Plumbing"},
      {"id":"6003263791114","name":"Electrician"},
      {"id":"6003244295567","name":"Roofing"}
    ]
  }],
  "publisher_platforms": ["facebook","instagram","audience_network","messenger"],
  "facebook_positions": ["feed","right_hand_column","instant_article","marketplace","video_feeds","story","search","instream_video","facebook_reels"],
  "instagram_positions": ["stream","story","explore","reels","explore_home","profile_feed"]
}
JSON
)

adset_resp=$(curl -sS -X POST "$API/$ACT/adsets" \
  --data-urlencode "name=$ADSET_NAME" \
  --data-urlencode "campaign_id=$CAMPAIGN_ID" \
  --data-urlencode "optimization_goal=LEAD_GENERATION" \
  --data-urlencode "billing_event=IMPRESSIONS" \
  --data-urlencode "destination_type=WEBSITE" \
  --data-urlencode "promoted_object={\"pixel_id\":\"$FB_PIXEL_ID\",\"custom_event_type\":\"LEAD\"}" \
  --data-urlencode "targeting=$TARGETING" \
  --data-urlencode "start_time=$TODAY_PLUS_1" \
  --data-urlencode "status=PAUSED" \
  --data-urlencode "access_token=$FB_ACCESS_TOKEN")

if echo "$adset_resp" | grep -q '"error"'; then
  echo "❌  Ad Set create failed:" >&2
  echo "$adset_resp" >&2
  exit 1
fi
ADSET_ID=$(echo "$adset_resp" | python3 -c 'import sys,json;print(json.load(sys.stdin)["id"])')
echo "    ✅  Ad Set ID: $ADSET_ID"
echo "    (Tampa 50mi · age 28-58 · SMB owner interests · all placements)"
echo

# -------- 3. Starter Ad (link ad pointing at /apply) -------------------
#
# Real creatives (the 14 from your Higgsfield/GPT-Image library) need to be
# uploaded to Meta Media Library first. This script creates one starter Ad
# Creative + one Ad using a Link Ad format. The remaining 13 ads can be
# duplicated from this one inside Ads Manager (faster than 14 more API
# calls + media-library uploads in shell).

AD_NAME="01_StarterLinkAd_StopMissingMoney_2026-Q2"
echo "🎬  Creating starter Ad: $AD_NAME"
echo "    (After running this, upload the 14 creatives in Ads Manager"
echo "     Media Library, then duplicate this Ad 13 times and swap the"
echo "     creative on each. Or call this script per ad.)"

LANDING_URL="https://trainyouragent.com/apply?utm_source=meta&utm_medium=paid&utm_campaign=$CAMPAIGN_NAME&utm_content=$AD_NAME"

# Build the Ad Creative (link ad without a video/image bound — Meta will
# show this in the Ads Manager UI as "needs creative" so you can attach
# your existing assets from the Media Library with one click).
PRIMARY_TEXT="You're losing 1 in 4 inbound calls. Each missed call is worth \$400 to \$2,400. Your competitor picked up the one you dropped. We build a custom AI voice agent that answers every single call. 21 days flat. \$4,950 build + \$1,997/mo. 30-day money-back."
HEADLINE="Phone answered in 21 days."
DESCRIPTION="\$4,950 + \$1,997/mo. Refund."

INSTAGRAM_ARG=""
if [ -n "${FB_INSTAGRAM_ID:-}" ]; then
  INSTAGRAM_ARG="--data-urlencode instagram_actor_id=$FB_INSTAGRAM_ID"
fi

OBJECT_STORY_SPEC=$(cat <<JSON
{
  "page_id": "$FB_PAGE_ID",
  $( [ -n "${FB_INSTAGRAM_ID:-}" ] && echo "\"instagram_actor_id\": \"$FB_INSTAGRAM_ID\"," )
  "link_data": {
    "link": "$LANDING_URL",
    "message": "$PRIMARY_TEXT",
    "name": "$HEADLINE",
    "description": "$DESCRIPTION",
    "call_to_action": {
      "type": "APPLY_NOW",
      "value": {"link": "$LANDING_URL"}
    }
  }
}
JSON
)

creative_resp=$(curl -sS -X POST "$API/$ACT/adcreatives" \
  --data-urlencode "name=AdCreative_$AD_NAME" \
  --data-urlencode "object_story_spec=$OBJECT_STORY_SPEC" \
  --data-urlencode "access_token=$FB_ACCESS_TOKEN")

if echo "$creative_resp" | grep -q '"error"'; then
  echo "❌  Ad Creative create failed:" >&2
  echo "$creative_resp" >&2
  exit 1
fi
CREATIVE_ID=$(echo "$creative_resp" | python3 -c 'import sys,json;print(json.load(sys.stdin)["id"])')
echo "    ✅  Ad Creative ID: $CREATIVE_ID"

ad_resp=$(curl -sS -X POST "$API/$ACT/ads" \
  --data-urlencode "name=$AD_NAME" \
  --data-urlencode "adset_id=$ADSET_ID" \
  --data-urlencode "creative={\"creative_id\":\"$CREATIVE_ID\"}" \
  --data-urlencode "status=PAUSED" \
  --data-urlencode "access_token=$FB_ACCESS_TOKEN")

if echo "$ad_resp" | grep -q '"error"'; then
  echo "❌  Ad create failed:" >&2
  echo "$ad_resp" >&2
  exit 1
fi
AD_ID=$(echo "$ad_resp" | python3 -c 'import sys,json;print(json.load(sys.stdin)["id"])')
echo "    ✅  Ad ID: $AD_ID"
echo

# -------- summary --------------------------------------------------------

echo "🎉  Done."
echo
echo "Created (all PAUSED):"
echo "  Campaign:  $CAMPAIGN_NAME       ($CAMPAIGN_ID)"
echo "  Ad Set:    $ADSET_NAME          ($ADSET_ID)"
echo "  Ad:        $AD_NAME             ($AD_ID)"
echo
echo "Next steps in Ads Manager:"
echo "  1. https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=$FB_AD_ACCOUNT_ID"
echo "  2. Open the new campaign → verify Page identity = TrainYourAgent (not Citrusburn)"
echo "  3. Upload the 14 creatives to Media Library (drag-drop from your folder)"
echo "  4. Duplicate the starter ad 13 times, swap creative on each"
echo "  5. Preview every ad — confirm Page shows TrainYourAgent"
echo "  6. Unpause campaign + ad set + all 14 ads"
echo
echo "Pixel verification:"
echo "  Events Manager → Test Events → load /apply in incognito → submit form"
echo "  You should see PageView + Lead from browser + Lead from server (deduplicated)"
