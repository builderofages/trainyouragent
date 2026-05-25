#!/bin/bash
# push-prod-keys.sh — v162
#
# One-shot Vercel env-var swap for the two keys that take TYA to 10/10
# on Money Flow + Voice Quality dimensions.
#
# Usage:
#   bash scripts/push-prod-keys.sh sk_live_xxxxxx elevenlabs_xxxxxx [whsec_xxxx]
#
# What this does:
#   1. Validates you're logged in to the right Vercel account (builderofages)
#   2. Links this repo to the trainyouragent project on Vercel
#   3. Updates STRIPE_SECRET_KEY -> sk_live_xxx (Production scope)
#   4. Updates ELEVENLABS_API_KEY -> xxx (Production + Preview + Development)
#   5. Updates STRIPE_WEBHOOK_SECRET if provided
#   6. Triggers a Production redeploy
#   7. Tail-pings /api/checkout to verify cs_live_ response
#
# Takes ~90 seconds total.

set -e

STRIPE_KEY="$1"
ELEVEN_KEY="$2"
STRIPE_WH="${3:-}"

if [ -z "$STRIPE_KEY" ] || [ -z "$ELEVEN_KEY" ]; then
  echo "Usage: bash scripts/push-prod-keys.sh sk_live_xxx elevenlabs_xxx [whsec_xxx]"
  exit 1
fi

if [[ "$STRIPE_KEY" != sk_live_* ]] && [[ "$STRIPE_KEY" != rk_live_* ]]; then
  echo "ERROR: STRIPE key must start with sk_live_ or rk_live_, got: ${STRIPE_KEY:0:10}..."
  exit 1
fi

cd "$(dirname "$0")/.."

export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH

echo "==> v162: pushing live keys to Vercel"
echo "==> Stripe: ${STRIPE_KEY:0:12}...${STRIPE_KEY: -6}"
echo "==> ElevenLabs: ${ELEVEN_KEY:0:8}...${ELEVEN_KEY: -6}"

# 1. Verify Vercel CLI auth + correct team
echo ""
echo "==> 1/6 Checking Vercel auth..."
WHOAMI=$(npx -y vercel@latest whoami 2>&1 | tail -1)
echo "    Logged in as: $WHOAMI"

if [[ "$WHOAMI" != *"builderofages"* ]]; then
  echo ""
  echo "❌ Wrong Vercel account. You're logged in as: $WHOAMI"
  echo "   The trainyouragent project lives under 'builderofages'."
  echo "   Run this first:  npx vercel switch builderofages"
  echo "   Or:              npx vercel login alexander@trainyouragent.com"
  exit 1
fi

# 2. Link repo to project
echo ""
echo "==> 2/6 Linking project..."
if [ ! -f .vercel/project.json ]; then
  npx -y vercel@latest link --yes --project trainyouragent --scope builderofages
fi

# 3. Stripe Secret Key (Production only — never wire live keys to preview/dev)
echo ""
echo "==> 3/6 STRIPE_SECRET_KEY -> live mode..."
npx -y vercel@latest env rm STRIPE_SECRET_KEY production --yes 2>/dev/null || true
echo "$STRIPE_KEY" | npx -y vercel@latest env add STRIPE_SECRET_KEY production

# 4. ElevenLabs API key (all environments — same key works for preview/dev voice testing)
echo ""
echo "==> 4/6 ELEVENLABS_API_KEY -> all environments..."
for env in production preview development; do
  npx -y vercel@latest env rm ELEVENLABS_API_KEY $env --yes 2>/dev/null || true
  echo "$ELEVEN_KEY" | npx -y vercel@latest env add ELEVENLABS_API_KEY $env
done

# 5. Stripe webhook secret (optional)
if [ -n "$STRIPE_WH" ]; then
  echo ""
  echo "==> 5/6 STRIPE_WEBHOOK_SECRET -> live..."
  npx -y vercel@latest env rm STRIPE_WEBHOOK_SECRET production --yes 2>/dev/null || true
  echo "$STRIPE_WH" | npx -y vercel@latest env add STRIPE_WEBHOOK_SECRET production
else
  echo ""
  echo "==> 5/6 Skipping STRIPE_WEBHOOK_SECRET (no value provided)"
fi

# 6. Trigger production redeploy
echo ""
echo "==> 6/6 Triggering production redeploy..."
npx -y vercel@latest --prod --yes 2>&1 | tail -8

echo ""
echo "==> Waiting 90 seconds for redeploy..."
sleep 90

# Verify
echo ""
echo "==> Verifying /api/checkout returns cs_live_..."
RESPONSE=$(curl -s -m 10 -X POST -H 'content-type: application/json' \
  -d '{"plan":"saas-agent-builder"}' \
  https://www.trainyouragent.com/api/checkout)

if echo "$RESPONSE" | grep -q 'cs_live_'; then
  echo "✓ SUCCESS — Stripe is now in LIVE mode."
  echo "  Checkout URL: $(echo "$RESPONSE" | head -c 100)..."
elif echo "$RESPONSE" | grep -q 'cs_test_'; then
  echo "✗ Still returning cs_test_ — redeploy may not be done. Check Vercel dashboard."
  echo "  Response: $RESPONSE"
else
  echo "? Unexpected response: $RESPONSE"
fi

# Verify TTS
echo ""
echo "==> Verifying /api/tts returns audio..."
TTS_HTTP=$(curl -s -m 15 -o /tmp/tts_verify.bin -w '%{http_code}' \
  -X POST -H 'content-type: application/json' \
  -d '{"text":"hello world","voice":"jessica"}' \
  https://www.trainyouragent.com/api/tts)

if [ "$TTS_HTTP" = "200" ]; then
  SIZE=$(stat -f%z /tmp/tts_verify.bin 2>/dev/null || stat -c%s /tmp/tts_verify.bin)
  echo "✓ SUCCESS — TTS returns $SIZE bytes of audio."
else
  echo "✗ TTS returned HTTP $TTS_HTTP"
  cat /tmp/tts_verify.bin
fi

echo ""
echo "==> Done. Money flow + voice quality should now be 10/10."
