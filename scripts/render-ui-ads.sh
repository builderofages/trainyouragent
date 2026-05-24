#!/usr/bin/env bash
# render-ui-ads.sh — v145
#
# Renders UI-mockup ad templates (iMessage, lockscreen, calculator,
# before-after) to PNG at all 3 aspect ratios using headless Chrome.
#
# These are the Hormozi/Codie/Tai winning formats — they look like
# REAL iOS artifacts, not ads. Highest-converting paid social creative
# in 2026 because Meta's algorithm penalizes obvious ad-aesthetic.
#
# Setup once:
#   (Chrome already installed on macOS — uses Google Chrome.app)
#
# Run:
#   bash scripts/render-ui-ads.sh
#
# Output: ads/static/TYA_<niche>_ui-<format>_<aspect>.png
# Joins with the photo batch in same dir, picked up by upload-fb-creatives.sh.

set -uo pipefail

OUT_DIR="${OUT_DIR:-ads/static}"
TEMPLATE_DIR="$(dirname "$0")/ad-templates"
TMP_DIR=$(mktemp -d)
trap "rm -rf $TMP_DIR" EXIT

mkdir -p "$OUT_DIR"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [[ ! -x "$CHROME" ]]; then
  echo "ERROR: Chrome not found at $CHROME"; exit 1
fi

# Aspect → pixel dims
get_dims() {
  case "$1" in
    9x16) echo "1080 1920" ;;
    4x5)  echo "1080 1350" ;;
    1x1)  echo "1080 1080" ;;
    *)    echo "1080 1080" ;;
  esac
}

render_html_to_png() {
  local html_file="$1" out_png="$2" w="$3" h="$4"
  local file_url="file://$html_file"
  "$CHROME" --headless=new --disable-gpu --no-sandbox \
    --window-size=${w},${h} \
    --hide-scrollbars \
    --screenshot="$out_png" \
    --default-background-color=00000000 \
    "$file_url" 2>/dev/null
}

# ============================================================
# Format 1: iMessage thread between operator + AI agent
# ============================================================

render_imessage() {
  local niche="$1" framework="$2" aspect="$3"
  local dims; dims=$(get_dims "$aspect")
  local w=$(echo $dims | awk '{print $1}')
  local h=$(echo $dims | awk '{print $2}')
  local out="$OUT_DIR/TYA_${niche}_ui-imessage_${aspect}.png"

  # Per-niche thread
  local agent_name agent_init time date cta messages
  agent_name="TYA Agent"
  agent_init="◆"
  time="11:47 PM"
  date="Yesterday"
  cta="Agent picks up. You sleep."

  case "$niche" in
    hvac)
      messages='
        <div class="msg them">After-hours call coming in 📞<br>Caller: Tampa Bay, residential</div>
        <div class="msg them">Reported: AC died. Has elderly parent in home.</div>
        <div class="msg tya">On it. Qualifying urgency, checking on-call tech availability...</div>
        <div class="msg tya">Booked Mike for 7:02 AM. Customer confirmed via SMS. Job value est: $487-$1,200.<span class="sub">Logged in ServiceTitan · Slack notified</span></div>
        <div class="msg me">👏</div>
        <div class="msg me">First call I didn'\''t have to take in 14 years.</div>'
      cta="Agent picks up. You sleep."
      ;;
    legal)
      messages='
        <div class="msg them">New intake inquiry — 9:14 PM Tuesday</div>
        <div class="msg them">Personal injury, MVA, plaintiff side. Tampa.</div>
        <div class="msg tya">Running conflict check against Clio matter DB...</div>
        <div class="msg tya">Clean. Qualified ICP. Booked you for Thursday 2 PM. Initial deposit info sent.<span class="sub">Conflict-clear in 47 sec vs avg 72 hr</span></div>
        <div class="msg me">Margins doubled this quarter.</div>'
      cta="Partners do law. AI does intake."
      ;;
    restaurants)
      messages='
        <div class="msg them">Phone ringing during dinner rush — line 3</div>
        <div class="msg them">Caller asking about catering for 40, Dec 12</div>
        <div class="msg tya">Taking the call. Pricing range $2,800-$4,200.</div>
        <div class="msg tya">Quote sent. Booked Friday tasting for Maria. Catering manager notified via email.<span class="sub">OpenTable updated · catering@ inbox copied</span></div>
        <div class="msg me">Host stayed at the door. Cover count up 12%.</div>'
      cta="AI host. So yours can run service."
      ;;
    *)
      messages='
        <div class="msg them">After-hours call coming in</div>
        <div class="msg tya">Qualifying and booking now...</div>
        <div class="msg tya">Done. Customer confirmed for tomorrow 9 AM. Logged in your CRM.<span class="sub">You didn'\''t lift a finger.</span></div>
        <div class="msg me">This is wild.</div>'
      ;;
  esac

  local html="$TMP_DIR/imessage_${niche}_${aspect}.html"
  sed -e "s|\$W|$w|g" -e "s|\$H|$h|g" \
      -e "s|\$AGENT_NAME|$agent_name|g" \
      -e "s|\$AGENT_INITIAL|$agent_init|g" \
      -e "s|\$TIME|$time|g" \
      -e "s|\$DATE|$date|g" \
      -e "s|\$CTA|$cta|g" \
      "$TEMPLATE_DIR/imessage.html" > "$html"
  # Sed can't handle multiline easily — use python for messages substitution
  python3 -c "
import sys
with open('$html') as f: s = f.read()
s = s.replace('\$MESSAGES', '''$messages''')
with open('$html', 'w') as f: f.write(s)
"
  render_html_to_png "$html" "$out" "$w" "$h"
  if [[ -s "$out" ]]; then echo "  ✓ $out"; else echo "  ✗ FAILED $out"; fi
}

# ============================================================
# Format 2: iOS lockscreen with missed-call notification stack
# ============================================================

render_lockscreen() {
  local niche="$1" framework="$2" aspect="$3"
  local dims; dims=$(get_dims "$aspect")
  local w=$(echo $dims | awk '{print $1}')
  local h=$(echo $dims | awk '{print $2}')
  local out="$OUT_DIR/TYA_${niche}_ui-lockscreen_${aspect}.png"

  local time="11:47" date="Tuesday, June 11" badge_count="47" stack_summary
  local notifs

  case "$niche" in
    hvac)
      stack_summary="+ 41 more from your business · Cost of silence: ~\$22,800/mo"
      notifs='
        <div class="notif"><div class="icon miss">📞</div><div class="body"><div class="row"><span class="app">MISSED CALL</span><span class="when">11:47 PM</span></div><div class="title">Sarah Chen</div><div class="preview">Mobile · 14 sec ring · No voicemail</div></div></div>
        <div class="notif"><div class="icon miss">📞</div><div class="body"><div class="row"><span class="app">MISSED CALL</span><span class="when">11:14 PM</span></div><div class="title">Unknown — Tampa</div><div class="preview">Voicemail: "Furnace stopped, need someone tonight"</div></div></div>
        <div class="notif"><div class="icon miss">📞</div><div class="body"><div class="row"><span class="app">MISSED CALL</span><span class="when">10:32 PM</span></div><div class="title">Marcus R.</div><div class="preview">Voicemail: "Already called Smith HVAC — they answered"</div></div></div>'
      ;;
    legal)
      stack_summary="+ 38 more this week · Avg retainer lost: \$3,400"
      notifs='
        <div class="notif"><div class="icon miss">📞</div><div class="body"><div class="row"><span class="app">MISSED CALL</span><span class="when">11:47 PM</span></div><div class="title">Potential client — MVA</div><div class="preview">Mobile · No voicemail · First contact</div></div></div>
        <div class="notif"><div class="icon miss">📞</div><div class="body"><div class="row"><span class="app">MISSED CALL</span><span class="when">11:14 PM</span></div><div class="title">Insurance referral</div><div class="preview">Voicemail: "Need attorney by Friday for filing"</div></div></div>
        <div class="notif"><div class="icon miss">📞</div><div class="body"><div class="row"><span class="app">MISSED CALL</span><span class="when">10:32 PM</span></div><div class="title">Existing client urgent</div><div class="preview">Voicemail: "Going with Brown Law — they returned"</div></div></div>'
      ;;
    restaurants)
      stack_summary="+ 18 more during service · ~\$2,800 in lost covers"
      notifs='
        <div class="notif"><div class="icon miss">📞</div><div class="body"><div class="row"><span class="app">MISSED CALL</span><span class="when">8:47 PM</span></div><div class="title">Reservation inquiry</div><div class="preview">Mobile · Party of 8 · Saturday</div></div></div>
        <div class="notif"><div class="icon miss">📞</div><div class="body"><div class="row"><span class="app">MISSED CALL</span><span class="when">8:14 PM</span></div><div class="title">Corporate catering</div><div class="preview">Voicemail: "Need quote for 60-person event Dec 12"</div></div></div>
        <div class="notif"><div class="icon miss">📞</div><div class="body"><div class="row"><span class="app">MISSED CALL</span><span class="when">7:32 PM</span></div><div class="title">Walk-in checking wait</div><div class="preview">Voicemail: "Going to that new place down the street"</div></div></div>'
      ;;
    *)
      stack_summary="+ 28 more this week · Lost revenue: significant"
      notifs='
        <div class="notif"><div class="icon miss">📞</div><div class="body"><div class="row"><span class="app">MISSED CALL</span><span class="when">11:47 PM</span></div><div class="title">Sarah Chen</div><div class="preview">Mobile · 14 sec ring · No voicemail</div></div></div>
        <div class="notif"><div class="icon miss">📞</div><div class="body"><div class="row"><span class="app">MISSED CALL</span><span class="when">10:32 PM</span></div><div class="title">Unknown caller</div><div class="preview">Voicemail: "Already called the next one on Google"</div></div></div>'
      ;;
  esac

  local html="$TMP_DIR/lockscreen_${niche}_${aspect}.html"
  python3 <<PYEOF
data = {
  '\$W': '$w', '\$H': '$h',
  '\$TIME': '$time', '\$DATE': '$date',
  '\$BADGE_COUNT': '$badge_count',
  '\$STACK_SUMMARY': """$stack_summary""",
  '\$NOTIFS': """$notifs""",
}
with open('$TEMPLATE_DIR/lockscreen.html') as f: s = f.read()
for k, v in data.items(): s = s.replace(k, v)
with open('$html', 'w') as f: f.write(s)
PYEOF
  render_html_to_png "$html" "$out" "$w" "$h"
  if [[ -s "$out" ]]; then echo "  ✓ $out"; else echo "  ✗ FAILED $out"; fi
}

# ============================================================
# Format 3: Calculator showing dollar-leak math
# ============================================================

render_calculator() {
  local niche="$1" framework="$2" aspect="$3"
  local dims; dims=$(get_dims "$aspect")
  local w=$(echo $dims | awk '{print $1}')
  local h=$(echo $dims | awk '{print $2}')
  local out="$OUT_DIR/TYA_${niche}_ui-calculator_${aspect}.png"

  local niche_label calls ticket total
  case "$niche" in
    hvac)        niche_label="HVAC · Tampa Bay"; calls="47"; ticket="487"; total="22,889" ;;
    legal)       niche_label="Solo PI Practice"; calls="22"; ticket="3,400"; total="74,800" ;;
    restaurants) niche_label="Italian / 80 seats"; calls="68"; ticket="89"; total="6,052" ;;
    healthcare)  niche_label="Dental Practice"; calls="38"; ticket="612"; total="23,256" ;;
    plumbing)    niche_label="Plumbing · 24/7"; calls="52"; ticket="412"; total="21,424" ;;
    roofing)     niche_label="Roofing Contractor"; calls="29"; ticket="1,800"; total="52,200" ;;
    *)           niche_label="Service Business"; calls="34"; ticket="487"; total="16,558" ;;
  esac

  local html="$TMP_DIR/calc_${niche}_${aspect}.html"
  sed -e "s|\$W|$w|g" -e "s|\$H|$h|g" \
      -e "s|\$NICHE_LABEL|$niche_label|g" \
      -e "s|\$CALLS|$calls|g" \
      -e "s|\$TICKET|$ticket|g" \
      -e "s|\$TOTAL|$total|g" \
      "$TEMPLATE_DIR/calculator.html" > "$html"
  render_html_to_png "$html" "$out" "$w" "$h"
  if [[ -s "$out" ]]; then echo "  ✓ $out"; else echo "  ✗ FAILED $out"; fi
}

# ============================================================
# Format 4: Before / After dramatic split
# ============================================================

render_before_after() {
  local niche="$1" framework="$2" aspect="$3"
  local dims; dims=$(get_dims "$aspect")
  local w=$(echo $dims | awk '{print $1}')
  local h=$(echo $dims | awk '{print $2}')
  local out="$OUT_DIR/TYA_${niche}_ui-before-after_${aspect}.png"

  local before_label before_num before_suffix before_sub
  local after_label after_num after_suffix after_sub
  case "$niche" in
    hvac)
      before_label="Missed calls (last 30 days)"; before_num="22,889"; before_suffix=""
      before_sub="Avg HVAC ticket: \$487 · After-hours miss rate: 38%"
      after_label="Captured (next 30 days)"; after_num="38,400"; after_suffix=""
      after_sub="Same techs. Same trucks. Just stopped dropping calls."
      ;;
    legal)
      before_label="Walked-away retainers"; before_num="74,800"; before_suffix=""
      before_sub="22 inbound intakes / month went to voicemail"
      after_label="Booked consults"; after_num="156,200"; after_suffix=""
      after_sub="Conflict-check in 47 sec. Partners back to billing."
      ;;
    restaurants)
      before_label="Lost daily covers"; before_num="6,052"; before_suffix="/mo"
      before_sub="Phone rings 47x during dinner. Host picks up 6."
      after_label="Captured + private events"; after_num="22,400"; after_suffix="/mo"
      after_sub="AI took every call. Plus 4 private bookings."
      ;;
    healthcare)
      before_label="New patient calls lost"; before_num="23,256"; before_suffix="/mo"
      before_sub="30% of new patient inquiries dropped to voicemail"
      after_label="New patients booked"; after_num="75,400"; after_suffix="/mo"
      after_sub="Front desk freed up. Capture rate: 71%."
      ;;
    *)
      before_label="Monthly lost revenue"; before_num="22,889"; before_suffix=""
      before_sub="Industry: every after-hours call goes to competitor"
      after_label="Captured + booked"; after_num="38,400"; after_suffix=""
      after_sub="AI agent answers 24/7. You only see qualified leads."
      ;;
  esac

  local html="$TMP_DIR/ba_${niche}_${aspect}.html"
  sed -e "s|\$W|$w|g" -e "s|\$H|$h|g" \
      -e "s|\$BEFORE_LABEL|$before_label|g" \
      -e "s|\$BEFORE_NUM|$before_num|g" \
      -e "s|\$BEFORE_SUFFIX|$before_suffix|g" \
      -e "s|\$BEFORE_SUB|$before_sub|g" \
      -e "s|\$AFTER_LABEL|$after_label|g" \
      -e "s|\$AFTER_NUM|$after_num|g" \
      -e "s|\$AFTER_SUFFIX|$after_suffix|g" \
      -e "s|\$AFTER_SUB|$after_sub|g" \
      "$TEMPLATE_DIR/before-after.html" > "$html"
  render_html_to_png "$html" "$out" "$w" "$h"
  if [[ -s "$out" ]]; then echo "  ✓ $out"; else echo "  ✗ FAILED $out"; fi
}

# ============================================================
# MAIN
# ============================================================

NICHES="${NICHES:-hvac legal restaurants healthcare plumbing roofing}"
ASPECTS="${ASPECTS:-9x16 4x5 1x1}"

echo "==> Rendering UI-mockup ads"
echo "==> Niches: $NICHES"
echo "==> Aspects: $ASPECTS"
echo ""

count=0
for niche in $NICHES; do
  for aspect in $ASPECTS; do
    render_imessage "$niche" "pain" "$aspect"
    render_lockscreen "$niche" "pain" "$aspect"
    render_calculator "$niche" "pain" "$aspect"
    render_before_after "$niche" "outcome" "$aspect"
    count=$((count + 4))
  done
done

echo ""
echo "==> Done. $count UI-mockup ads in $OUT_DIR/"
echo "==> Rebuild contact sheet: bash scripts/build-ad-contact-sheet.sh"
