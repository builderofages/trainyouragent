#!/usr/bin/env bash
# render-hormozi-ads.sh — v147
#
# Renders the 2030-grade Hormozi-style ads. Headless Chrome → PNG.
# Pure typography + neon spot color + live BREAKING badge + receipt bar.
# No photos. No corporate gradients. Scroll-stop or die.

set -uo pipefail

OUT_DIR="${OUT_DIR:-ads/static}"
TEMPLATE="$(dirname "$0")/ad-templates/hormozi-2030.html"
TMP=$(mktemp -d); trap "rm -rf $TMP" EXIT
mkdir -p "$OUT_DIR"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[[ -x "$CHROME" ]] || { echo "Chrome not found"; exit 1; }

get_dims() {
  case "$1" in
    9x16) echo "1080 1920" ;;
    4x5)  echo "1080 1350" ;;
    1x1)  echo "1080 1080" ;;
  esac
}

render() {
  local niche="$1" aspect="$2"
  local d; d=$(get_dims "$aspect"); local w=${d% *}; local h=${d##* }
  local out="$OUT_DIR/TYA_${niche}_hormozi-2030_${aspect}.png"

  # Per-niche data — keys: BG_COLOR, ACCENT_COLOR, BADGE, NICHE_TAG, EYEBROW,
  # HEADLINE (with <span class=hl> highlights, <span class=strike> strikethroughs),
  # LABEL_1/VAL_1/CLASS, LABEL_2/VAL_2/CLASS, RECEIPT_1/2/3
  local BG ACCENT BADGE TAG EYEBROW HEADLINE L1 V1 V1C L2 V2 V2C R1 R2 R3

  case "$niche" in
    hvac)
      BG="#0a0a0a"; ACCENT="#FFD60A"; BADGE="LIVE · TAMPA BAY"
      TAG="HVAC OPERATORS"
      EYEBROW="psst, you in this stat?"
      HEADLINE='YOU’RE LOSING <span class="hl">\$22,889</span><br>EVERY MONTH.'
      L1="MISSED CALLS (LAST 30 DAYS)"; V1="47"; V1C="neg"
      L2="REVENUE WALKED"; V2="\$22,889"; V2C="neg"
      R1="Same techs"; R2="Same trucks"; R3="Stop dropping calls"
      ;;
    legal)
      BG="#0a0a0a"; ACCENT="#FFD60A"; BADGE="LIVE · INTAKE QUEUE"
      TAG="SOLO + SMALL FIRM"
      EYEBROW="for partners only"
      HEADLINE='STOP <span class="strike">DOING INTAKE</span><br>AT <span class="hl">\$400/HR.</span>'
      L1="PARTNER HOURS ON PHONES"; V1="48 / WEEK"; V1C="neg"
      L2="BILLABLE \$ LOST"; V2="\$76,800"; V2C="neg"
      R1="Conflict check in 47 sec"; R2="Bar-compliant"; R3="Margins doubled"
      ;;
    restaurants)
      BG="#0a0a0a"; ACCENT="#FF003C"; BADGE="LIVE · DINNER RUSH"
      TAG="INDEPENDENT F+B"
      EYEBROW="every. single. night."
      HEADLINE='PHONE RINGS <span class="hl">47×</span><br>HOST PICKS UP <span class="strike">6.</span>'
      L1="DROPPED INBOUND CALLS"; V1="41 / NIGHT"; V1C="neg"
      L2="LOST COVERS PER MONTH"; V2="\$6,052"; V2C="neg"
      R1="OpenTable native"; R2="Catering captured"; R3="Host runs service"
      ;;
    healthcare)
      BG="#0a0a0a"; ACCENT="#5EE18A"; BADGE="LIVE · PATIENT QUEUE"
      TAG="DENTAL + MEDICAL"
      EYEBROW="empty chair = \$487"
      HEADLINE='30% OF NEW PATIENT<br>CALLS GO TO <span class="hl">VOICEMAIL.</span>'
      L1="NEW PATIENT CALLS LOST"; V1="38 / MONTH"; V1C="neg"
      L2="REVENUE OPPORTUNITY"; V2="\$23,256"; V2C="neg"
      R1="HIPAA-aligned"; R2="BAA per customer"; R3="Insurance verified"
      ;;
    plumbing)
      BG="#0a0a0a"; ACCENT="#FFD60A"; BADGE="LIVE · 11:47 PM"
      TAG="EMERGENCY DISPATCH"
      EYEBROW="burst pipe doesn’t care it’s late"
      HEADLINE='WHO ANSWERS<br>AT <span class="hl">11:47 PM?</span>'
      L1="AFTER-HOURS EMERGENCIES"; V1="52 / MO"; V1C="neg"
      L2="LOST TO COMPETITORS"; V2="\$21,424"; V2C="neg"
      R1="Real dispatch"; R2="Not just voicemail"; R3="On-site in 24 min"
      ;;
    roofing)
      BG="#0a0a0a"; ACCENT="#FF003C"; BADGE="LIVE · STORM SURGE"
      TAG="ROOFING CONTRACTORS"
      EYEBROW="next hurricane is 18 days out"
      HEADLINE='YOU JUST LOST<br><span class="hl">\$40K</span> IN INSPECTIONS.'
      L1="CALLS DROPPED DURING SURGE"; V1="73%"; V1C="neg"
      L2="MONTHLY OPPORTUNITY"; V2="\$52,200"; V2C="neg"
      R1="38 inspections / 72 hrs"; R2="Last hurricane proof"; R3="Capture rate 95%"
      ;;
  esac

  local html="$TMP/hz_${niche}_${aspect}.html"
  python3 - <<PYEOF
import sys
data = {
  '\$BG_COLOR': '$BG', '\$ACCENT_COLOR': '$ACCENT',
  '\$VAL_1_CLASS': """$V1C""", '\$VAL_2_CLASS': """$V2C""",
  '\$NICHE_TAG': """$TAG""", '\$RECEIPT_1': """$R1""",
  '\$RECEIPT_2': """$R2""", '\$RECEIPT_3': """$R3""",
  '\$HEADLINE': """$HEADLINE""", '\$EYEBROW': """$EYEBROW""",
  '\$LABEL_1': """$L1""", '\$LABEL_2': """$L2""",
  '\$VAL_1': """$V1""", '\$VAL_2': """$V2""",
  '\$BADGE': """$BADGE""",
  '\$W': '$w', '\$H': '$h',
}
# Sort by key length descending so longer placeholders substitute first
# (prevents \$W matching inside \$WIDTH or \$HEADLINE etc).
with open('$TEMPLATE') as f: s = f.read()
for k in sorted(data.keys(), key=len, reverse=True):
  s = s.replace(k, data[k])
with open('$html', 'w') as f: f.write(s)
PYEOF

  "$CHROME" --headless=new --disable-gpu --no-sandbox \
    --window-size=${w},${h} --hide-scrollbars \
    --screenshot="$out" \
    --default-background-color=00000000 \
    "file://$html" 2>/dev/null

  if [[ -s "$out" ]]; then echo "  ✓ $out"; else echo "  ✗ $out"; fi
}

NICHES="${NICHES:-hvac legal restaurants healthcare plumbing roofing}"
ASPECTS="${ASPECTS:-9x16 4x5 1x1}"

echo "==> v147: rendering 2030 Hormozi ads"
for n in $NICHES; do
  for a in $ASPECTS; do
    render "$n" "$a"
  done
done
echo "==> done"
