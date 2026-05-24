#!/usr/bin/env bash
# higgsfield-bulk-render.sh — v138
#
# Fires every TYA image-ad prompt through Higgsfield Nano Banana Pro
# via the official CLI. Runs on YOUR Mac (the sandbox can't reach the
# Higgsfield binary host). Unlimited image plan = burn freely.
#
# ============================================================
# ONE-TIME SETUP (60 seconds — only do this once, ever)
# ============================================================
#
#   npm install -g @higgsfield/cli
#   higgsfield auth login            # opens browser, you click Allow
#
# Confirm it works:
#   higgsfield --version
#
# ============================================================
# USAGE
# ============================================================
#
# From the repo root:
#   bash scripts/higgsfield-bulk-render.sh
#
# Or for a single niche only:
#   NICHE=hvac bash scripts/higgsfield-bulk-render.sh
#
# Outputs land in ads/static/ as PNG, named:
#   TYA_<niche>_<framework>_<treatment>_<aspect>.png
#
# After it finishes:
#   bash scripts/upload-fb-creatives.sh
#       (turns every PNG into a PAUSED Meta draft ad — needs FB_ACCESS_TOKEN)
#
# ============================================================
# CONFIG
# ============================================================

set -euo pipefail

OUT_DIR="${OUT_DIR:-ads/static}"
MODEL="${MODEL:-nano-banana-pro}"
NICHE_FILTER="${NICHE:-}"
PARALLEL="${PARALLEL:-4}"          # how many in-flight renders at once
ASPECTS="${ASPECTS:-9:16,4:5,1:1}" # render each prompt at all three

mkdir -p "$OUT_DIR"

# ============================================================
# UNIVERSAL PROMPT PREFIX (from HIGGSFIELD_BRAND_SPEC.md)
# ============================================================
PREFIX="Documentary-realism photography, natural light, Roger Deakins cinematography references, shallow depth of field, 50mm equivalent, real human texture including pores and hairline imperfection, asymmetric facial expression, candid moment captured mid-action, industry-accurate wardrobe, environmental specificity, TYA Navy #042C53 and Bone White #FAFAFA palette, on-brand TrainYourAgent diamond watermark bottom-right at 80% opacity. SCENE: "

NEGATIVE="no plastic skin, no glossy AI face, no bilateral facial symmetry, no six fingers, no extra fingers, no warped hands, no floating logos, no neon, no cyber grid, no holographic overlays, no flat studio softbox lighting, no symmetrical composition, no generic chart-pointing pose, no thumbs-up cliche, no perfect-teeth smile, no plastic hair, no Uncanny Valley face, no AI watermark, no gibberish text, no duplicate limbs, no oversaturated HDR, no rainbow gradient, no laser eyes, no clean-shaven baby-face appearance, no white background unless explicitly requested, no editorial poster layout unless treatment=editorial."

# ============================================================
# PROMPT LIBRARY — niche::framework::treatment :: scene
# Mirrors HIGGSFIELD_100_IMAGE_ADS.md (120 prompts).
# Each line: niche|framework|treatment|scene
# ============================================================
read -r -d '' PROMPTS <<'EOF' || true
hvac|pain|photo|Tight handheld shot inside the cab of an HVAC service pickup truck at 9:47 PM. Weathered 45 year old white male HVAC tech in the driver seat, grey beard, dirty hands, embroidered blue work shirt with patch "MIKE LEAD TECH" visible, sweat damp on his temples, cab dome light on. Through windshield: empty dark parking lot, single sodium-yellow streetlight, breath visibly fogging. Right hand holds iPhone with incoming call "UNKNOWN", thumb hovering Decline. His face exhausted not angry. White text overlay top: EVERY MISSED CALL AFTER 6PM = $400-1,800 GONE
hvac|outcome|photo|Worn leather wallet on a kitchen table, weathered Latino hand counting out twenty-seven $100 bills onto the table. Modest suburban kitchen, warm evening tungsten, shallow DOF. White text overlay bottom-left: FIRST WEEK. AI AGENT. AFTER HOURS ONLY.
hvac|urgency|photo|Wide-angle HVAC service van parked beside a homeowner's driveway at twilight, tech with toolbag walking to front door. White text overlay top: FOUNDING-COHORT SPOTS: 3 OF 10 LEFT. Bottom: LOCK 50% OFF FOREVER.
hvac|contrarian|photo|Same Mike at desk after long day, looking directly at camera, slight skeptical smirk, single key light. White text overlay: YOUR "AI RECEPTIONIST" FROM SKOOL IS A CHATBOT. THIS IS AN OPERATOR.
plumbing|pain|photo|Tight close-up of water gushing from burst pipe under a kitchen sink, cabinet soaked, water spreading across tile floor. Bare feet in bottom of frame. White text overlay top: IT'S 11:47 PM. WHO ANSWERS YOUR PHONE RIGHT NOW?
plumbing|outcome|photo|Plumber Tom 50yo white man mustache, navy uniform shirt "TOM", sliding out from under a sink with a wrench, relieved homeowner visible behind him. Late evening tungsten. White text overlay: BOOKED AT 11:51 PM. ON-SITE BY 12:14 AM.
plumbing|urgency|photo|Plumber truck door swinging open at night, tech stepping out with toolbag, homeowner headlights visible. White text overlay top: HURRICANE SEASON STARTS IN 14 DAYS. 3 PLUMBING SPOTS LEFT.
plumbing|contrarian|photo|Plumber leaning against his truck at sunset holding phone looking at camera. White text overlay: THE "AI RECEPTIONIST" APPS DON'T DISPATCH. THEY TAKE A MESSAGE. YOURS SHOULD DO BOTH.
healthcare|pain|photo|Overhead handheld shot of dental front desk at 9:32 AM, three phone lines lit, 28yo Asian female receptionist in scrubs glasses cradling one phone on shoulder typing into computer signaling one minute to patient at counter. White text overlay top: YOUR FRONT DESK IS DROPPING 30% OF NEW-PATIENT CALLS.
healthcare|outcome|photo|42yo Latina dentist in scrubs surgical loupes pushed onto forehead braided hair leaning over patient focused calm. Background out of focus front desk empty no chaos. White text overlay: FRONT DESK RUNS ITSELF. SO YOU CAN RUN DENTISTRY.
healthcare|urgency|photo|Dental hygienist looking at tablet showing next 4 weeks fully booked calendar. White text overlay top: YOUR COMPETITOR JUST OPENED. YOU HAVE 30 DAYS.
healthcare|contrarian|photo|Dentist looking directly at camera arms crossed scrubs. White text overlay: STOP HIRING A THIRD RECEPTIONIST. AI ANSWERS 24/7 FOR LESS THAN $1K/MO.
legal|pain|photo|Solo-practitioner law office 7:43 PM on desk clock. 55yo white male partner rolled sleeves loosened tie reading glasses exhausted on phone, case files stacked, secondary line ringing unanswered. White text overlay top: PARTNER BILLING TIME: $400/HR. TIME SPENT ON INTAKE: 22 MIN. YOU BILLED $0.
legal|outcome|photo|28yo Black female associate suit at her desk looking at iPad showing AI running overnight intakes. Calm office. White text overlay: PARTNERS STOPPED ANSWERING INTAKE. MARGINS DOUBLED.
legal|urgency|photo|Wide shot of small firm reception area empty after-hours. White text overlay top: YOUR COMPETITOR IS TAKING YOUR INTAKE CALLS RIGHT NOW.
legal|contrarian|photo|Same partner looking at camera half-smile. White text overlay: YES, LAWYERS CAN USE AI FOR INTAKE. NO, IT DOESN'T GIVE LEGAL ADVICE. STOP ASSUMING IT DOES.
realestate|pain|photo|35yo Black male agent in polo with brokerage logo sitting in car in traffic looking at phone with inbound Zillow lead notification. Can't pick up. White text overlay top: LEAD CONTACTED IN 5 MIN: 21X MORE LIKELY TO QUALIFY. YOU'RE AT 47.
realestate|outcome|photo|Showing scheduled on Zillow-style phone screen, agent's calendar updating in real time, agent in driver seat smiling at phone. White text overlay: AI QUALIFIED, AI SCHEDULED. YOU JUST SHOW UP.
realestate|urgency|photo|Agent walking into "Coming Soon" listing at sunset taking photos. White text overlay top: SPRING MARKET OPENS IN 6 WEEKS. 3 REAL-ESTATE SPOTS LEFT.
realestate|contrarian|photo|Agent leaning against his car looking at camera. White text overlay: YOUR ISA COSTS $4K/MO AND WORKS 40HRS. AI WORKS 168HRS FOR LESS THAN HALF.
roofing|pain|photo|Storm-battered residential street lightning flash rain hammering. Foreground iPhone in roofer's hand showing 8 missed calls in last 30 minutes. White text overlay top: YOU JUST LOST $40K IN INSPECTIONS.
roofing|outcome|photo|50yo white female owner in fleece vest with company logo at desk watching iPad show AI handling 8 phone lines at once. Calm. White text overlay: LAST HURRICANE: 38 INSPECTIONS IN 72 HOURS.
roofing|urgency|photo|Calendar showing hurricane season start date highlighted with red marker. White text overlay top: YOU HAVE 18 DAYS.
roofing|contrarian|photo|Roofer on ladder looking down at camera hammer in hand. White text overlay: YOUR COMPETITOR JUST HIRED AN ANSWERING SERVICE. YOURS IS ABOUT TO LOSE EVERY STORM CALL TO AI.
solar|pain|photo|38yo white male solar salesman polo headset open call-center desk hanging up phone hard visibly frustrated. White text overlay top: YOUR AE JUST DEMOED A RENTER. AGAIN.
solar|outcome|photo|Solar salesman on call with real qualified buyer pricing on screen buyer engaged calm energy. White text overlay: AI QUALIFIED 6 GATES. YOU ONLY SEE THE 9 WHO PASSED.
solar|urgency|photo|Federal tax credit deadline calendar with red circle. White text overlay top: ITC SUNSET IS 14 MONTHS AWAY. CAPTURE EVERY LEAD NOW.
solar|contrarian|photo|Solar salesman looking at camera slight smirk. White text overlay: YOUR CALL CENTER IS A $20K/MO QUALIFIER. AI DOES IT FOR $2K AND NEVER ASKS FOR A RAISE.
accounting|pain|photo|52yo Korean-American female accounting partner glasses pushed up cardigan mug of cold coffee on phone unread pile of 40 client packets next to her Feb 14 visible on calendar. White text overlay top: TAX SEASON. YOU'RE BILLABLE. YOU'RE ON INTAKE CALLS INSTEAD.
accounting|outcome|photo|Same partner calmer mug of coffee actually hot doing actual tax work iPad shows AI running intakes. White text overlay: INTAKES HAPPEN. YOU DO RETURNS.
accounting|urgency|photo|Tax-season countdown timer. White text overlay top: JAN 1 IS IN 31 DAYS.
accounting|contrarian|photo|Partner looking at camera glasses on deadpan. White text overlay: YOUR ADMIN IS QUALIFIED TO DO PARTNER WORK? THEN WHY ARE PARTNERS ON THE PHONES?
automotive|pain|photo|50yo white male service writer Mike grey beard blue uniform shirt embroidered MIKE patch glasses up on forehead with 3 phones lit walk-in customer at counter looking impatient. White text overlay top: 3-5 SERVICE APPOINTMENTS LOST DAILY TO VOICEMAIL. EACH ONE = $600.
automotive|outcome|photo|Mike in the service bay actually looking under hood of customer car, phones quiet on counter visible in background. White text overlay: SERVICE WRITER BACK TO WRITING SERVICE.
automotive|urgency|photo|Service bay at sunset last car driving out. White text overlay top: TOMORROW YOUR COMPETITOR INSTALLS THEIRS.
automotive|contrarian|photo|Mike looking at camera wrench in hand. White text overlay: YOUR SERVICE WRITER IS THE BOTTLENECK. STOP EXPECTING THEM TO BE THREE PEOPLE.
restaurants|pain|photo|Italian restaurant dinner-rush host stand foreground. 45yo Latino male host white button-down dark vest salt-pepper hair harried glancing at ringing phone he can't answer. White text overlay top: PHONE RINGS 47 TIMES DURING DINNER SERVICE. HOST PICKS UP 6.
restaurants|outcome|photo|Same host iPad next to him showing AI booking reservations making eye contact with guest at counter. White text overlay: YOUR AI HOST. SO YOURS CAN RUN SERVICE.
restaurants|urgency|photo|Restaurant exterior at dusk OPEN sign lit. White text overlay top: YOUR HOST IS IN THE WEEDS. RIGHT NOW.
restaurants|contrarian|photo|Host looking at camera smile. White text overlay: "JUST CALL BACK LATER" IS A CLOSED-RESTAURANT POLICY.
gyms|pain|photo|Pilates studio class-end chaos. 28yo Black female instructor sweaty ponytail at front desk with prospect walking in unnoticed. White text overlay top: TRIAL SIGNUPS WALKING OUT THE DOOR WHILE YOU TEACH.
gyms|outcome|photo|Same instructor calm prospect at counter being properly greeted iPad behind her shows AI booking trials. White text overlay: AI BOOKS TRIALS. YOU RUN CLASS.
gyms|urgency|photo|New-Year's-resolution calendar. White text overlay top: 14 DAYS TO INSTALL BEFORE JAN 1.
gyms|contrarian|photo|Instructor looking at camera slight smile. White text overlay: YOUR FRONT DESK CAN'T BE IN 3 PLACES AT ONCE. AI CAN.
bars|pain|photo|Empty cocktail bar at 2 PM sunlight stripes across dark wood floor phone unanswered on counter. White text overlay top: NOBODY PICKS UP UNTIL 4 PM. YOUR PRIVATE-EVENT LEADS DIE.
bars|outcome|photo|30yo white female bartender platinum hair sleeve tattoos black apron restocking bottles iPad lit up with AI taking booking behind her. White text overlay: CLOSED AT 2 PM. BOOKING AT 2 PM.
bars|urgency|photo|Holiday season calendar. White text overlay top: PRIVATE EVENT SEASON STARTS IN 21 DAYS.
bars|contrarian|photo|Bartender looking at camera deadpan. White text overlay: YOUR "WE'LL GET BACK TO YOU" POLICY LOST THE CORPORATE HOLIDAY BOOKING.
propertymgmt|pain|photo|42yo South Asian male property manager t-shirt in bed lit only by phone screen. 2:14 AM visible. Phone rings TENANT UNIT 4B. White text overlay top: YOUR PERSONAL PHONE IS THE AFTER-HOURS LINE. UNTIL YOUR PARTNER LEAVES YOU.
propertymgmt|outcome|photo|Same manager sleeping peacefully phone face-down on nightstand glowing notification visible. White text overlay: AI HANDLES 2 AM. YOU SLEEP.
propertymgmt|urgency|photo|Property portfolio map with new building circled in red. White text overlay top: YOU JUST ADDED 32 UNITS. YOUR WIFE NOTICES THE 2 AM CALLS.
propertymgmt|contrarian|photo|Manager looking at camera. White text overlay: YOU DON'T NEED ANOTHER PROPERTY MANAGER. YOU NEED AN AI THAT PICKS UP AT 2 AM.
pestcontrol|pain|photo|Quiet suburban kitchen at night pendant light 38yo white female in pajamas staring frozen at a thumb-size roach on counter. White text overlay top: YOUR COMPETITOR'S AFTER-HOURS LINE JUST WON THAT CUSTOMER.
pestcontrol|outcome|photo|Same woman phone to ear relief on face. On phone screen we see her booking confirmed for 8 AM next morning. White text overlay: NIGHT CALLS. NEW CUSTOMERS. SAME DAY.
pestcontrol|urgency|photo|Spring-season calendar. White text overlay top: PEST SEASON STARTS IN 28 DAYS.
pestcontrol|contrarian|photo|Pest tech leaning on his truck smiling. White text overlay: YOUR TECH IS IN A CRAWLSPACE. AI IS ON THE PHONE.
saas|pain|photo|Tired 29yo Black female AE hoodie dual monitors can of LaCroix coworking desk looking at Outlook calendar 14 meetings 10 flagged NO SHOW WRONG ICP TOO EARLY. White text overlay top: 76 OF YOUR 87 DEMOS LAST QUARTER WEREN'T READY TO BUY.
saas|outcome|photo|Same AE calm closing a deal on screen Stripe success animation smile. White text overlay: 23 DEMOS THIS QUARTER. 14 CLOSED.
saas|urgency|photo|Q4 calendar. White text overlay top: YOUR LAST HIRING WINDOW BEFORE YEAR-END QUOTA.
saas|contrarian|photo|AE looking at camera slight smirk. White text overlay: STOP HIRING SDRS. AI QUALIFIES IN 8 SECONDS. SDR TOOK 8 DAYS.
startup|pain|photo|Founder solo at desk at midnight laptop multiple browser tabs. White text overlay top: YOU'RE THE SDR. THE AE. THE CSM. STOP.
startup|outcome|photo|Same founder lighter, getting notification "first qualified demo booked by AI". White text overlay: HIRE YOUR FIRST AE. MAKE IT AI.
startup|urgency|photo|Runway calendar 14 months to default-alive. White text overlay top: YOU CAN'T AFFORD TO HIRE. YOU ALSO CAN'T AFFORD NOT TO QUALIFY LEADS.
startup|contrarian|photo|Founder looking at camera. White text overlay: THE FIRST HIRE ISN'T A RECRUITER. IT'S AN AI AGENT.
insurance|pain|photo|Insurance agent desk multi-line phone ringing quote requests piling up unhandled. White text overlay top: QUOTE REQUESTS COOL IN 12 MINUTES. YOU'RE AT 47.
insurance|outcome|photo|Agent calmly on call with closing customer AI dashboard shows qualified-quote requests in his queue. White text overlay: AI RUNS THE INTAKE. YOU CLOSE THE POLICY.
homeservices|pain|photo|Handyman in his truck missed-call list on his phone sun setting. White text overlay top: SUNDAY-NIGHT CALLS. YOU'RE AT DINNER.
homeservices|outcome|photo|Same handyman calendar pinging with confirmed bookings for the week. White text overlay: YOUR WEEKEND JUST BOOKED ITSELF.
coaches|pain|photo|Personal trainer mid-session with client can't answer phone. White text overlay top: MID-SESSION = MISSED LEAD.
coaches|outcome|photo|Trainer wrapping up session AI has booked his next 6 trial-session inquiries while he was working. White text overlay: TRAIN CLIENTS. AI BOOKS THE NEXT ONES.
cleaning|pain|photo|Owner of cleaning company on a job site can't pick up office phone. White text overlay top: RECURRING CONTRACT JUST CALLED. AND CALLED. AND GAVE UP.
cleaning|outcome|photo|Same owner on-site calm getting "new contract booked" notification. White text overlay: JOB SITES STAY RUN. OFFICE CALLS GET ANSWERED.
veterinary|pain|photo|Vet office front desk in chaos phones ringing sick pet visible in waiting room. White text overlay top: YOU PICKED THE CAT OVER THE PHONE. RIGHT CALL. LOST CALL.
veterinary|outcome|photo|Vet tech calm at front desk AI handling 3 incoming calls pet getting proper attention. White text overlay: THE CAT. THE PHONE. THE NEW PATIENT. ALL HANDLED.
EOF

# ============================================================
# RENDER LOOP
# ============================================================

count=0
total=$(echo "$PROMPTS" | wc -l | tr -d ' ')
echo "==> Bulk-rendering up to $total TYA ad prompts via Higgsfield CLI"
echo "==> Model: $MODEL  |  Aspects: $ASPECTS  |  Parallel: $PARALLEL"
echo "==> Output: $OUT_DIR/"
echo ""

# Confirm CLI is auth'd
if ! command -v higgsfield >/dev/null 2>&1; then
  echo "ERROR: 'higgsfield' CLI not found. Run: npm install -g @higgsfield/cli"
  echo "       Then: higgsfield auth login"
  exit 1
fi

if ! higgsfield auth status >/dev/null 2>&1; then
  echo "ERROR: Higgsfield CLI not authenticated. Run: higgsfield auth login"
  exit 1
fi

# Iterate prompts × aspects
while IFS='|' read -r niche framework treatment scene; do
  [[ -z "${niche:-}" ]] && continue
  [[ "${niche:0:1}" == "#" ]] && continue

  # Optional niche filter
  if [[ -n "$NICHE_FILTER" && "$niche" != "$NICHE_FILTER" ]]; then
    continue
  fi

  for aspect in ${ASPECTS//,/ }; do
    aspect_safe=$(echo "$aspect" | tr ':' 'x')
    out_file="$OUT_DIR/TYA_${niche}_${framework}_${treatment}_${aspect_safe}.png"

    if [[ -f "$out_file" ]]; then
      echo "  ✓ Already exists, skipping: $out_file"
      continue
    fi

    full_prompt="${PREFIX}${scene}. NEGATIVE: ${NEGATIVE}"

    count=$((count + 1))
    echo "[$count] Rendering $niche/$framework/$treatment @ $aspect → $out_file"

    # Fire async; wait if too many in flight
    (
      higgsfield image generate \
        --model "$MODEL" \
        --aspect "$aspect" \
        --output "$out_file" \
        --prompt "$full_prompt" \
        2>&1 | sed "s/^/    [$niche] /"
    ) &

    # Throttle parallelism
    while [[ $(jobs -p | wc -l) -ge $PARALLEL ]]; do
      sleep 1
    done
  done
done <<< "$PROMPTS"

# Wait for stragglers
echo ""
echo "==> Waiting for in-flight renders to finish..."
wait

# Tally
generated=$(find "$OUT_DIR" -name "TYA_*.png" 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "==> Done. $generated PNGs in $OUT_DIR/"
echo "==> Next: bash scripts/upload-fb-creatives.sh"
echo "       (turns every PNG into a PAUSED Meta draft ad)"
