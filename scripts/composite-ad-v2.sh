#!/usr/bin/env bash
# composite-ad-v2.sh — v144
#
# CONVERSION-OPTIMIZED ad composite. v141's clean editorial banner looked
# like a corporate stock-photo template (0.5% CTR territory). This builds
# the UGC/native-phone aesthetic that actually wins on Meta 2026:
#
#   - Big yellow caption sticker (TikTok/Reels style), black text, drop shadow
#   - Slight 2-3 degree tilt — looks human-placed not template-stamped
#   - Heavy bold sans-serif, 6-8% of canvas height (huge, scroll-stop sized)
#   - White outline + dark shadow for legibility on ANY background
#   - Bottom: native iOS-style notification card with TYA branding
#   - No more gradient banner across the top (too corporate)
#
# Reads ads/photo-raw/, writes ads/static/ replacing v141 composites.
#
# Run:
#   bash scripts/composite-ad-v2.sh

set -eo pipefail

RAW_DIR="${RAW_DIR:-ads/photo-raw}"
OUT_DIR="${OUT_DIR:-ads/static}"

mkdir -p "$OUT_DIR"

if ! command -v magick >/dev/null 2>&1; then
  echo "ERROR: ImageMagick not installed. brew install imagemagick"; exit 1
fi
IM=magick

# Font paths (verified on macOS):
FONT_HEADLINE="/System/Library/Fonts/Supplemental/Impact.ttf"
[[ -f "$FONT_HEADLINE" ]] || FONT_HEADLINE="/System/Library/Fonts/Supplemental/Arial Black.ttf"
FONT_BODY="/System/Library/Fonts/Supplemental/Arial Bold.ttf"

# Hormozi/Cardone-style headlines with specific numbers + caption-sticker
# format. Two short bursts max — one big shock number, one quick framing.
# Format: HEADLINE_LINE_1 || HEADLINE_LINE_2 || HOOK_BOTTOM
get_copy() {
  case "$1:$2" in
    hvac:pain)              echo "POV: It's 11:47PM||You just lost \$1,800||Agent picks up. You sleep.";;
    hvac:outcome)           echo "First week:||\$2,700 recovered||Pay only when it earns.";;
    hvac:urgency)           echo "3 spots left||50% off forever||Apply at trainyouragent.com/apply";;
    hvac:contrarian)        echo "Your AI receptionist||is a chatbot.||Mine's an operator.";;
    plumbing:pain)          echo "It's 11:47 PM||Pipe just burst||Whose number does she call?";;
    plumbing:outcome)       echo "Booked: 11:51 PM||On-site: 12:14 AM||That's the AI agent.";;
    plumbing:urgency)       echo "Hurricane season||in 14 days||3 plumbing spots left.";;
    plumbing:contrarian)    echo "Voicemail-to-text||isn't dispatch.||Yours should book the job.";;
    healthcare:pain)        echo "30% of new patient||calls = voicemail||That's \$487/empty chair.";;
    healthcare:outcome)     echo "+\$75K in new patients||Booked overnight||We used to miss these.";;
    healthcare:urgency)     echo "Competitor opened.||You have 30 days||before they capture them.";;
    healthcare:contrarian)  echo "Stop hiring a||3rd receptionist.||AI works 168 hrs/wk.";;
    legal:pain)             echo "Partner on intake:||\$400/hr billed||\$0.";;
    legal:outcome)          echo "Partners do law.||AI does intake.||Margins doubled.";;
    legal:urgency)          echo "Right now||a competitor is taking||your intake calls.";;
    legal:contrarian)       echo "Yes, lawyers||CAN use AI for intake.||Florida + CA bar OK'd it.";;
    realestate:pain)        echo "5-min lead response||= 21X more likely||You're at 47 min.";;
    realestate:outcome)     echo "AI qualifies||in 8 seconds.||You just show up.";;
    realestate:urgency)     echo "Spring market||in 6 weeks.||3 RE spots left.";;
    realestate:contrarian)  echo "ISA costs \$4K/mo||AI costs \$2K/mo||and works 168 hrs.";;
    roofing:pain)           echo "You just lost||\$40K in inspections||to whoever picked up first.";;
    roofing:outcome)        echo "Last hurricane:||38 inspections||in 72 hours.";;
    roofing:urgency)        echo "Hurricane season||in 18 days.||Install before chaos.";;
    roofing:contrarian)     echo "Answering service||takes a message.||AI dispatches the truck.";;
    solar:pain)             echo "70% of demos||with people who||can't actually buy.";;
    solar:outcome)          echo "AI qualifies 6 gates.||You only demo||the 9 who pass.";;
    solar:urgency)          echo "ITC sunset:||14 months left.||Capture every lead now.";;
    solar:contrarian)       echo "Your call center:||\$20K/month.||AI: \$2K.";;
    accounting:pain)        echo "Tax season.||You're billable.||You're on intake calls.";;
    accounting:outcome)     echo "Intakes happen.||You do returns.||+44 clients this season.";;
    accounting:urgency)     echo "Jan 1||is 31 days away.||Install now.";;
    accounting:contrarian)  echo "Why are partners||on the phones?||\$400/hr does intake.";;
    automotive:pain)        echo "3-5 service bookings||lost daily.||\$600 each.";;
    automotive:outcome)     echo "+19% bay utilization||+\$42 avg ticket.||Same techs.";;
    automotive:urgency)     echo "Tomorrow your||competitor installs theirs.||Then you're behind.";;
    automotive:contrarian)  echo "Stop expecting||one writer||to be three people.";;
    restaurants:pain)       echo "Phone rings 47x||during dinner.||Host picks up 6.";;
    restaurants:outcome)    echo "AI takes reservations.||Host runs the room.||Capture every call.";;
    restaurants:urgency)    echo "Your host||is in the weeds.||Right now.";;
    restaurants:contrarian) echo "'Call back later'||is a closed restaurant||policy.";;
    gyms:pain)              echo "Trial signups||walk out the door||while you teach.";;
    gyms:outcome)           echo "AI books trials.||You run class.||+81 trials/month.";;
    gyms:urgency)           echo "New Year's rush||in 14 days.||Install before.";;
    gyms:contrarian)        echo "Front desk can't||be in 3 places.||AI can.";;
    bars:pain)              echo "Nobody picks up||till 4 PM.||Daytime events die.";;
    bars:outcome)           echo "Closed at 2 PM.||Booking at 2 PM.||AI never sleeps.";;
    bars:urgency)           echo "Holiday event season||in 21 days.||Bars: 3 spots.";;
    bars:contrarian)        echo "'We'll get back to you'||= lost corporate||holiday booking.";;
    propertymgmt:pain)      echo "Your personal phone||is the after-hours line.||Until your wife leaves.";;
    propertymgmt:outcome)   echo "AI handles 2 AM.||You sleep.||+89 tickets auto-filed.";;
    propertymgmt:urgency)   echo "32 new units.||Your wife noticed||the 2 AM calls.";;
    propertymgmt:contrarian)echo "You don't need||another PM.||You need an AI.";;
    pestcontrol:pain)       echo "Sees roach at 9 PM||Calls 3 companies.||All 3 voicemails.";;
    pestcontrol:outcome)    echo "Night call captured.||Same-day booked.||That's the agent.";;
    pestcontrol:urgency)    echo "Pest season||in 28 days.||Install now.";;
    pestcontrol:contrarian) echo "Tech's in a crawlspace.||AI's on the phone.||Both make money.";;
    saas:pain)              echo "76 of 87 demos||last quarter||weren't ready to buy.";;
    saas:outcome)           echo "23 demos this quarter.||14 closed.||61% close rate.";;
    saas:urgency)           echo "Last hiring window||before year-end quota.||Stop hiring SDRs.";;
    saas:contrarian)        echo "AI qualifies||in 8 seconds.||SDR took 8 days.";;
    startup:pain)           echo "You're the SDR.||The AE. The CSM.||Stop.";;
    startup:outcome)        echo "Hire your first AE.||Make it AI.||\$0 base, no equity.";;
    startup:urgency)        echo "14 months runway.||Qualify every lead.||You can't afford not to.";;
    startup:contrarian)     echo "First hire isn't||a recruiter.||It's an AI agent.";;
    insurance:pain)         echo "Quotes cool in 12 min.||You're at 47.||Lost to GEICO.";;
    insurance:outcome)      echo "AI runs intake.||You close policies.||Specialist work only.";;
    homeservices:pain)      echo "Sunday-night calls.||You're at dinner.||Lost forever.";;
    homeservices:outcome)   echo "Your weekend||just booked itself.||AI took the calls.";;
    coaches:pain)           echo "Mid-session||= missed lead.||Trainer can't multitask.";;
    coaches:outcome)        echo "Train clients.||AI books the next.||+6 trials this week.";;
    cleaning:pain)          echo "Recurring contract||called. Called.||Gave up.";;
    cleaning:outcome)       echo "Job sites stay run.||Office calls answered.||AI is your front desk.";;
    veterinary:pain)        echo "Picked the cat||over the phone.||Right call. Lost call.";;
    veterinary:outcome)     echo "Cat. Phone. New patient.||All handled.||That's the AI.";;
    *)                      echo "AI that runs your business.||Live in 21 days.||Pay only when it earns.";;
  esac
}

composite_one() {
  local raw="$1"
  local base
  base=$(basename "$raw" .png)
  local stripped="${base#TYA_}"
  local niche="${stripped%%_*}"
  local rest="${stripped#${niche}_}"
  local framework="${rest%%_*}"
  local out="$OUT_DIR/${base}.png"

  # Always regen — v144 overwrites v141 design
  local copy_raw
  copy_raw=$(get_copy "$niche" "$framework")
  local line1 line2 line3
  line1=$(echo "$copy_raw" | awk -F'\\|\\|' '{print $1}')
  line2=$(echo "$copy_raw" | awk -F'\\|\\|' '{print $2}')
  line3=$(echo "$copy_raw" | awk -F'\\|\\|' '{print $3}')

  local w h
  w=$($IM identify -format '%w' "$raw")
  h=$($IM identify -format '%h' "$raw")

  # Caption sticker top — yellow background, black text, drop shadow
  local sticker_font=$((h * 65 / 1000))    # 6.5% — big bold scroll-stop
  local body_font=$((h * 32 / 1000))       # 3.2% — secondary
  local cta_font=$((h * 30 / 1000))        # 3.0% — bottom CTA
  local pad=$((h * 25 / 1000))             # internal padding

  # Bottom card height + width
  local card_w=$((w * 92 / 100))
  local card_h=$((h * 12 / 100))
  local card_x=$(((w - card_w) / 2))
  local card_y=$((h - card_h - h * 4 / 100))

  # Build the composite in one magick call:
  # 1. Source photo as base
  # 2. Top: yellow rotated sticker with big black headline
  # 3. Middle accent: smaller white-shadow secondary line
  # 4. Bottom: dark glassmorphism card with diamond + brand + CTA
  # Yellow sticker: render label first, then add border + tilt + shadow
  $IM \
    -background "#FFD60A" -fill "#0a0a0a" -font "$FONT_HEADLINE" \
    -pointsize "$sticker_font" -interline-spacing $((sticker_font / 8)) \
    -size $((w * 78 / 100))x -gravity center \
    caption:"$line1" \
    -bordercolor "#FFD60A" -border $((pad * 2))x$((pad * 3 / 2)) \
    -rotate -2.5 \
    \( +clone -background "#000000B0" -shadow 70x8+0+10 \) \
    +swap -background none -layers merge +repage \
    /tmp/sticker1_$$.png

  # Secondary line: smaller yellow text on dark pill — concat line2 + line3
  # for tighter punch-line cadence.
  local sub_text="$line2"
  [[ -n "$line3" ]] && sub_text="$line2 · $line3"
  $IM \
    -background "#0a0a0a" -fill "#FFD60A" -font "$FONT_BODY" \
    -pointsize "$body_font" \
    -size $((w * 78 / 100))x -gravity center \
    caption:"$sub_text" \
    -bordercolor "#0a0a0a" -border $((pad * 3 / 2))x$pad \
    -rotate 1.5 \
    \( +clone -background "#000000A0" -shadow 60x6+0+6 \) \
    +swap -background none -layers merge +repage \
    /tmp/sticker2_$$.png

  # Bottom brand card — solid navy. ONE LINE only: brand + URL.
  # The hook text $line3 moves into the secondary sticker so nothing overlaps.
  $IM -size ${card_w}x${card_h} xc:"#042C53F2" \
    -gravity center -fill white -font "$FONT_BODY" -pointsize $((cta_font * 95 / 100)) \
    -annotate +0+0 "◆ TrainYourAgent  ·  trainyouragent.com/apply" \
    /tmp/card_$$.png

  # Layer everything onto the photo
  $IM "$raw" \
    /tmp/sticker1_$$.png -gravity north -geometry +0+$((h * 4 / 100)) -composite \
    /tmp/sticker2_$$.png -gravity center -geometry +0-$((h * 4 / 100)) -composite \
    /tmp/card_$$.png -gravity north -geometry +0+${card_y} -composite \
    "$out" 2>/dev/null

  rm -f /tmp/sticker1_$$.png /tmp/sticker2_$$.png /tmp/card_$$.png

  if [[ -s "$out" ]]; then
    echo "  ✓ $niche/$framework $(basename $out | awk -F_ '{print $5}' | sed 's/.png//')"
  else
    echo "  ✗ FAILED $raw"
  fi
}

export -f composite_one get_copy
export IM FONT_HEADLINE FONT_BODY OUT_DIR RAW_DIR

count=0
total=$(find "$RAW_DIR" -name 'TYA_*.png' 2>/dev/null | wc -l | tr -d ' ')
echo "==> Compositing $total raw photos with conversion-optimized v144 design"

for raw in "$RAW_DIR"/TYA_*.png; do
  [[ -f "$raw" ]] || continue
  composite_one "$raw"
  count=$((count + 1))
done

done_count=$(find "$OUT_DIR" -name 'TYA_*.png' 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "==> v144 done. $done_count ads in $OUT_DIR/"
echo "==> Review: bash scripts/build-ad-contact-sheet.sh && open ads/REVIEW.html"
