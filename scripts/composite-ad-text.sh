#!/usr/bin/env bash
# composite-ad-text.sh — v141 Stage 2
#
# Takes every raw Higgsfield photo in ads/photo-raw/ and composites:
#   - Branded text overlay at top (framework-specific copy)
#   - TYA diamond watermark + wordmark at bottom-right
# Outputs to ads/static/ ready for scripts/upload-fb-creatives.sh.
#
# Setup once:
#   brew install imagemagick
#
# Run:
#   bash scripts/composite-ad-text.sh

set -uo pipefail

RAW_DIR="${RAW_DIR:-ads/photo-raw}"
OUT_DIR="${OUT_DIR:-ads/static}"

mkdir -p "$OUT_DIR"

if ! command -v magick >/dev/null 2>&1 && ! command -v convert >/dev/null 2>&1; then
  echo "ERROR: ImageMagick not installed. Run: brew install imagemagick"
  exit 1
fi

# Use 'magick' (IM7) if available, otherwise 'convert' (IM6)
IM=$(command -v magick || command -v convert)

# Headline copy keyed by niche|framework. Two lines max.
get_headline() {
  case "$1:$2" in
    hvac:pain)              echo "MISSED CALL AFTER 6PM:\n\$400-1,800 GONE.";;
    hvac:outcome)           echo "FIRST WEEK. AGENT ONLY.\nPAID FOR ITSELF.";;
    hvac:urgency)           echo "3 FOUNDING SPOTS LEFT.\nLOCK 50% OFF.";;
    hvac:contrarian)        echo "BUILT BY AN OPERATOR.\nNOT A SKOOL GRAD.";;
    plumbing:pain)          echo "IT'S 11:47 PM.\nWHO ANSWERS RIGHT NOW?";;
    plumbing:outcome)       echo "BOOKED AT 11:51 PM.\nON-SITE BY 12:14 AM.";;
    plumbing:urgency)       echo "HURRICANE SEASON:\n14 DAYS.";;
    plumbing:contrarian)    echo "AI THAT DISPATCHES.\nNOT JUST A MESSAGE.";;
    healthcare:pain)        echo "30% OF NEW PATIENT\nCALLS GO TO VOICEMAIL.";;
    healthcare:outcome)     echo "FRONT DESK RUNS ITSELF.\nYOU RUN DENTISTRY.";;
    healthcare:urgency)     echo "COMPETITOR OPENED.\nYOU HAVE 30 DAYS.";;
    healthcare:contrarian)  echo "STOP HIRING A THIRD\nRECEPTIONIST.";;
    legal:pain)             echo "PARTNER ON INTAKE:\n\$400/HR BILLED \$0.";;
    legal:outcome)          echo "PARTNERS DO LAW.\nAGENT DOES INTAKE.";;
    legal:urgency)          echo "COMPETITOR IS TAKING\nYOUR CALLS RIGHT NOW.";;
    legal:contrarian)       echo "YES, LAWYERS CAN\nUSE AI INTAKE.";;
    realestate:pain)        echo "5-MIN RESPONSE = 21X\nMORE LIKELY TO CLOSE.";;
    realestate:outcome)     echo "AI QUALIFIES.\nYOU JUST SHOW UP.";;
    realestate:urgency)     echo "SPRING MARKET IN\n6 WEEKS. 3 SPOTS.";;
    realestate:contrarian)  echo "STOP HIRING ISAs.\nAI WORKS 168 HOURS.";;
    roofing:pain)           echo "YOU JUST LOST\n\$40K IN INSPECTIONS.";;
    roofing:outcome)        echo "LAST HURRICANE:\n38 INSPECTIONS / 72 HRS.";;
    roofing:urgency)        echo "HURRICANE SEASON:\n18 DAYS.";;
    roofing:contrarian)     echo "ANSWERING SERVICE\nWILL LOSE EVERY CALL.";;
    solar:pain)             echo "70% OF DEMOS:\nWITH PEOPLE WHO CAN'T BUY.";;
    solar:outcome)          echo "AI RUNS 6 GATES.\nYOU SEE THE 9 WHO PASS.";;
    solar:urgency)          echo "ITC SUNSET:\n14 MONTHS LEFT.";;
    solar:contrarian)       echo "AI DOES IT FOR \$2K/MO.\nCALL CENTER: \$20K.";;
    accounting:pain)        echo "TAX SEASON.\nYOU'RE ON INTAKE CALLS.";;
    accounting:outcome)     echo "INTAKES HAPPEN.\nYOU DO RETURNS.";;
    accounting:urgency)     echo "JAN 1:\n31 DAYS AWAY.";;
    accounting:contrarian)  echo "WHY ARE PARTNERS\nON THE PHONES?";;
    automotive:pain)        echo "3-5 BOOKINGS LOST DAILY.\n\$600 EACH.";;
    automotive:outcome)     echo "SERVICE WRITER BACK TO\nWRITING SERVICE.";;
    automotive:urgency)     echo "TOMORROW YOUR COMPETITOR\nINSTALLS THEIRS.";;
    automotive:contrarian)  echo "STOP EXPECTING ONE\nWRITER TO BE THREE.";;
    restaurants:pain)       echo "PHONE RINGS 47 TIMES.\nHOST PICKS UP 6.";;
    restaurants:outcome)    echo "AI HOST. SO YOURS\nCAN RUN SERVICE.";;
    restaurants:urgency)    echo "YOUR HOST IS IN THE WEEDS.\nRIGHT NOW.";;
    restaurants:contrarian) echo "'CALL BACK LATER' =\nCLOSED RESTAURANT.";;
    gyms:pain)              echo "TRIAL SIGNUPS WALK OUT\nWHILE YOU TEACH.";;
    gyms:outcome)           echo "AI BOOKS TRIALS.\nYOU RUN CLASS.";;
    gyms:urgency)           echo "JAN 1 RUSH:\n14 DAYS TO INSTALL.";;
    gyms:contrarian)        echo "FRONT DESK CAN'T BE\nIN 3 PLACES. AI CAN.";;
    bars:pain)              echo "NOBODY ANSWERS TILL 4 PM.\nEVENTS DIE.";;
    bars:outcome)           echo "CLOSED AT 2 PM.\nBOOKING AT 2 PM.";;
    bars:urgency)           echo "PRIVATE EVENT SEASON:\n21 DAYS.";;
    bars:contrarian)        echo "'WE'LL GET BACK TO YOU' =\nLOST CORPORATE EVENT.";;
    propertymgmt:pain)      echo "YOUR PERSONAL PHONE IS\nTHE AFTER-HOURS LINE.";;
    propertymgmt:outcome)   echo "AI HANDLES 2 AM.\nYOU SLEEP.";;
    propertymgmt:urgency)   echo "32 NEW UNITS.\nYOUR WIFE NOTICES.";;
    propertymgmt:contrarian)echo "YOU DON'T NEED ANOTHER PM.\nYOU NEED AN AGENT.";;
    pestcontrol:pain)       echo "COMPETITOR'S NIGHT LINE\nJUST WON THAT CUSTOMER.";;
    pestcontrol:outcome)    echo "NIGHT CALLS.\nNEW CUSTOMERS. SAME DAY.";;
    pestcontrol:urgency)    echo "PEST SEASON:\n28 DAYS.";;
    pestcontrol:contrarian) echo "TECH IS IN A CRAWLSPACE.\nAI IS ON THE PHONE.";;
    saas:pain)              echo "76 OF 87 DEMOS:\nWEREN'T READY TO BUY.";;
    saas:outcome)           echo "23 DEMOS THIS QUARTER.\n14 CLOSED.";;
    saas:urgency)           echo "LAST HIRING WINDOW\nBEFORE YEAR-END QUOTA.";;
    saas:contrarian)        echo "STOP HIRING SDRs.\nAI QUALIFIES IN 8 SECONDS.";;
    startup:pain)           echo "YOU'RE THE SDR. THE AE.\nTHE CSM. STOP.";;
    startup:outcome)        echo "HIRE YOUR FIRST AE.\nMAKE IT AI.";;
    startup:urgency)        echo "14 MONTHS RUNWAY.\nQUALIFY EVERY LEAD.";;
    startup:contrarian)     echo "FIRST HIRE ISN'T HUMAN.\nIT'S AN AI AGENT.";;
    insurance:pain)         echo "QUOTES COOL IN 12 MIN.\nYOU'RE AT 47.";;
    insurance:outcome)      echo "AI RUNS INTAKE.\nYOU CLOSE THE POLICY.";;
    homeservices:pain)      echo "SUNDAY-NIGHT CALLS.\nYOU'RE AT DINNER.";;
    homeservices:outcome)   echo "YOUR WEEKEND JUST\nBOOKED ITSELF.";;
    coaches:pain)           echo "MID-SESSION =\nMISSED LEAD.";;
    coaches:outcome)        echo "TRAIN CLIENTS.\nAI BOOKS THE NEXT.";;
    cleaning:pain)          echo "RECURRING CONTRACT\nCALLED. GAVE UP.";;
    cleaning:outcome)       echo "JOB SITES STAY RUN.\nOFFICE CALLS ANSWERED.";;
    veterinary:pain)        echo "PICKED THE CAT OVER THE PHONE.\nLOST CALL.";;
    veterinary:outcome)     echo "THE CAT. THE PHONE.\nALL HANDLED.";;
    *)                      echo "AI THAT RUNS YOUR BUSINESS.\nLIVE IN 21 DAYS.";;
  esac
}

composite_one() {
  local raw="$1"
  local base
  base=$(basename "$raw" .png)
  # Parse: TYA_<niche>_<framework>_photo_<aspect>
  local stripped="${base#TYA_}"
  local niche="${stripped%%_*}"
  local rest="${stripped#${niche}_}"
  local framework="${rest%%_*}"

  local headline
  headline=$(get_headline "$niche" "$framework")

  local out="$OUT_DIR/${base}.png"
  if [[ -f "$out" && "$out" -nt "$raw" ]]; then
    return
  fi

  # Composite: headline top (with semi-transparent navy band behind for legibility)
  # + TYA diamond watermark bottom-right (white).
  # Dimensions adapt to image: read width via ImageMagick identify.
  local w h
  w=$($IM identify -format '%w' "$raw")
  h=$($IM identify -format '%h' "$raw")

  # Font size = 3.8% of image height (smaller to avoid edge clipping on
  # 9:16 narrow ads where canvas is only ~768px wide).
  local font_size=$((h * 38 / 1000))
  local band_height=$((h * 18 / 100))
  local watermark_size=$((w * 35 / 1000))

  $IM "$raw" \
    \( -size "${w}x${band_height}" gradient:"#042C53AA"-"#042C5300" \) \
      -gravity north -composite \
    -gravity north -fill white -font "/System/Library/Fonts/Supplemental/Arial Bold.ttf" -pointsize "$font_size" \
      -annotate +0+$((h * 4 / 100)) "$headline" \
    -gravity southeast -fill white -font "/System/Library/Fonts/Supplemental/Arial Bold.ttf" -pointsize "$watermark_size" \
      -annotate +$((w * 3 / 100))+$((h * 3 / 100)) "◆ TrainYourAgent" \
    "$out"

  if [[ -s "$out" ]]; then
    echo "  ✓ $out"
  else
    echo "  ✗ failed: $raw"
  fi
}

export -f composite_one get_headline
export IM OUT_DIR RAW_DIR

count=0
total=$(find "$RAW_DIR" -name "TYA_*.png" 2>/dev/null | wc -l | tr -d ' ')
echo "==> Compositing $total raw photos → $OUT_DIR/"

for raw in "$RAW_DIR"/TYA_*.png; do
  [[ -f "$raw" ]] || continue
  composite_one "$raw"
  count=$((count + 1))
done

done_count=$(find "$OUT_DIR" -name "TYA_*.png" 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "==> Stage 2 done. $done_count branded ads in $OUT_DIR/"
echo "==> Next: bash scripts/upload-fb-creatives.sh"
