#!/usr/bin/env bash
# higgsfield-bulk-render.sh — v141
#
# Two-stage TYA ad pipeline:
#   Stage 1 (this script): Higgsfield Nano Banana Pro generates PURE PHOTO
#     for each prompt × aspect. No text overlay in the AI render — that
#     bypasses NSFW filter triggers and Higgsfield's poor text rendering.
#   Stage 2 (scripts/composite-ad-text.sh): ImageMagick composites the
#     branded headline + TYA diamond watermark on top of each PNG.
#
# Run:
#   bash scripts/higgsfield-bulk-render.sh     # render all 72 × 3 = 216 photos
#   NICHE=hvac bash scripts/higgsfield-bulk-render.sh   # single niche
#   bash scripts/composite-ad-text.sh          # add brand text + watermark
#
# Setup once:
#   npm install -g @higgsfield/cli && higgsfield auth login

set -uo pipefail

OUT_DIR="${OUT_DIR:-ads/photo-raw}"
MODEL="${MODEL:-nano_banana_2}"
NICHE_FILTER="${NICHE:-}"
PARALLEL="${PARALLEL:-3}"
ASPECTS="${ASPECTS:-9:16 4:5 1:1}"
RESOLUTION="${RESOLUTION:-1k}"
LOG_DIR="${LOG_DIR:-/tmp/tya-render-logs}"

mkdir -p "$OUT_DIR" "$LOG_DIR"

# Photography style prefix — Deakins/Lubezki documentary realism.
# No text overlay specified — Stage 2 composites text in post.
PREFIX="Documentary realism photograph, shot on 50mm prime lens, natural tungsten interior light or golden hour exterior, shallow depth of field, real human skin texture with natural imperfection, candid mid-action moment, industry-accurate wardrobe, environmental authenticity, navy 042C53 and bone white FAFAFA color palette where applicable, cinematic editorial mood, photojournalism feel. SCENE: "

NEGATIVE=" NEGATIVE: no plastic synthetic skin, no glossy AI face, no bilateral facial symmetry, no six fingers, no extra fingers, no warped hands, no floating logos, no neon, no cyber grid, no holographic overlays, no flat studio softbox lighting, no symmetrical composition, no stock photo pose, no thumbs up, no perfect teeth smile, no plastic hair, no Uncanny Valley face, no text rendered in image, no gibberish text, no oversaturated HDR, no rainbow gradient, no nudity, no bare skin focus, no exposed feet, no children, no weapons, no blood, no smoke vapor focus."

# niche|framework|scene  (no text overlay, no bare body parts, no
# "exhausted" or other moderation triggers — pure scene description)
read -r -d '' PROMPTS <<'EOF' || true
hvac|pain|tight handheld view from passenger seat of HVAC service pickup truck cab at night, 45 year old white male HVAC technician with grey beard and short hair sits in driver seat wearing blue work shirt with embroidered name patch reading MIKE, glances down at smartphone in his hand which shows incoming call notification, dome light illuminates dashboard, through windshield we see empty parking lot and a single sodium-vapor streetlight, breath slightly visible in cool air
hvac|outcome|warm modest suburban kitchen at evening, weathered hands of older Latino HVAC business owner counting hundred dollar bills onto wooden kitchen table near a closed leather wallet, tungsten light from overhead pendant lamp, family photos slightly visible in soft background
hvac|urgency|HVAC service van parked in residential driveway at twilight golden hour, technician in coveralls walking from van toward front porch holding tool bag, warm porch light glowing, suburban houses receding into background, low angle wide shot
hvac|contrarian|portrait of same 45 year old white male HVAC technician Mike from earlier scene now sitting at small office desk after work hours wearing same blue work shirt, looking directly at camera with quiet half-smile, single warm key light, beige wood paneling background slightly out of focus
plumbing|pain|low angle close-up under a residential kitchen sink at night, water actively spraying from a fitting leak onto the wood cabinet floor, copper pipes visible, dim under-cabinet light, mood of urgency, no human in frame
plumbing|outcome|emergency plumber Tom 50 year old white man with mustache wearing navy company uniform shirt with embroidered TOM name patch, sliding out from under residential kitchen sink holding a wrench, smiling at homeowner standing nearby, warm late-evening kitchen lighting
plumbing|urgency|plumber truck parked on suburban residential street at night, side door open, technician in uniform with tool bag walking toward house front door, headlights from nearby car visible, mood urgent but professional
plumbing|contrarian|portrait of plumber leaning against side of his white service truck at sunset in front of small commercial building, holding smartphone in hand, looking directly at camera with confident expression, golden hour rim light
healthcare|pain|overhead documentary shot of dental practice front reception desk during busy morning, 28 year old Asian female receptionist wearing teal scrubs and small glasses cradles a telephone handset on her shoulder while typing at computer keyboard, three line phone visible with multiple lit indicators, patient standing at counter waiting
healthcare|outcome|42 year old Latina dentist wearing scrubs and surgical loupes pushed up onto her forehead, dark hair in long braid, leaning over patient chair in modern dental operatory, focused expression, calm clinical lighting
healthcare|urgency|dental hygienist seated at small workstation reviewing tablet computer showing fully booked calendar grid for next four weeks, modern dental practice background slightly defocused
healthcare|contrarian|portrait of confident female dentist wearing teal scrubs with arms gently crossed standing in modern dental operatory background, looking directly at camera with neutral professional expression
legal|pain|wood paneled solo practitioner law office at evening, antique brass desk clock showing 7 45 PM, 55 year old white male attorney with rolled shirt sleeves and loosened tie sits at large wooden desk with case files stacked, holding office phone receiver to ear, paper coffee cup nearby
legal|outcome|28 year old Black female junior associate wearing professional suit sitting at modern law office desk, looking at tablet computer showing intake management software interface, calm focused expression
legal|urgency|wide angle interior shot of small law firm reception waiting area completely empty after business hours, leather couches, framed law diplomas on wall, low warm lighting
legal|contrarian|portrait of senior attorney in shirt sleeves standing in his law office, looking directly at camera with slight knowing smile, bookshelves of legal volumes blurred in background
realestate|pain|35 year old Black male real estate agent wearing branded polo shirt sitting in driver seat of his car in traffic at intersection, looking down at smartphone showing real estate lead notification, sunlight coming through windshield
realestate|outcome|same real estate agent now relaxed in driver seat of parked car at attractive residential listing, smiling at smartphone showing calendar with new appointment booked, golden hour exterior light
realestate|urgency|real estate agent in branded polo with camera and clipboard walking up driveway of new Coming Soon listing house at sunset, taking photos for listing
realestate|contrarian|portrait of real estate agent leaning casually against his parked car in front of suburban house, looking directly at camera with confident professional expression
roofing|pain|residential suburban street during heavy thunderstorm at dusk, rain falling heavily, sky lit by lightning flash, foreground shows smartphone in roofing contractor hand with multiple missed call notifications visible on screen
roofing|outcome|50 year old white female roofing company owner wearing branded fleece vest seated at desk in small commercial office, watching tablet computer screen showing software dashboard, calm composed expression, daylight from office windows
roofing|urgency|close-up of paper wall calendar showing month of June with hurricane season start date circled in red marker, tacked to wood paneled wall in small office
roofing|contrarian|professional roofer standing on residential roof in safety harness holding hammer, looking down toward camera from above, blue sky background
solar|pain|38 year old white male solar sales representative wearing branded polo and headset seated at desk in open plan sales office, hand on telephone receiver showing visible frustration after just hanging up
solar|outcome|same solar sales rep now smiling and engaged on a call at his desk, computer monitor visible showing pricing chart, calm professional energy, modern office environment
solar|urgency|close-up of paper wall calendar with tax credit deadline date circled in red marker pen, professional office background
solar|contrarian|portrait of solar salesman in branded polo standing in modern sales office, looking directly at camera with slight knowing smirk, computer monitors blurred in background
accounting|pain|52 year old Korean American female accountant partner wearing soft cardigan and glasses pushed up onto forehead, seated at desk holding phone receiver to ear, large stack of paper client folders on desk beside her, ceramic mug of coffee, paper calendar showing February
accounting|outcome|same accounting partner now relaxed at her desk, fresh hot coffee in mug, working on tax return on computer monitor, tablet on side showing intake management dashboard, calm focused expression
accounting|urgency|close-up of paper desk calendar showing month of December with January 1 highlighted in red marker, professional accounting office desk background
accounting|contrarian|portrait of accounting partner wearing cardigan and glasses standing in her office, looking directly at camera with deadpan professional expression, bookshelf of accounting reference books behind her
automotive|pain|50 year old white male auto service writer named Mike with grey beard wearing blue uniform shirt with embroidered MIKE name patch, glasses pushed up on forehead, standing behind service counter with multi-line phone lit up with several calls, walk-in customer waiting at counter looks impatient
automotive|outcome|same service writer Mike now walking through auto service bay area in his uniform, leaning under open car hood inspecting engine, calm working expression, fluorescent shop lighting
automotive|urgency|wide shot of automotive service bay at sunset, last customer car driving slowly out of bay through open garage door, warm golden hour light
automotive|contrarian|portrait of auto service writer Mike in his uniform holding a wrench, looking directly at camera with confident neutral expression, service bay slightly visible behind him
restaurants|pain|busy upscale Italian restaurant dining room during dinner service, host stand foreground, 45 year old Latino male host wearing white dress shirt and dark vest with salt and pepper hair stands at podium glancing at phone ringing on his clipboard reservation book, soft warm tungsten light, wood fired pizza oven glowing in background
restaurants|outcome|same restaurant host now smiling at guest at podium during dinner service, tablet computer next to him displays reservation management interface, calm professional energy
restaurants|urgency|exterior of independent restaurant at dusk with warm interior glow through windows and illuminated OPEN sign by entrance, street lamp casting glow on sidewalk
restaurants|contrarian|portrait of Italian restaurant host in white shirt and dark vest standing at host podium, looking directly at camera with warm smile, soft restaurant lighting in background
gyms|pain|interior of modern Pilates fitness studio after class ends with morning daylight, 28 year old Black female instructor wearing black athletic top and leggings stands behind small reception desk with light sweat showing, ponytail, several students chatting nearby blocking the counter, prospective customer visible entering through front door
gyms|outcome|same Pilates instructor now standing relaxed at reception desk greeting a new prospect with friendly handshake, tablet computer visible behind her showing class booking software, bright airy studio space
gyms|urgency|close-up of paper desk calendar showing month of December with January 1 highlighted in red marker, fitness studio background slightly defocused
gyms|contrarian|portrait of female Pilates instructor in black athletic wear standing in studio with reformer machines blurred in background, looking directly at camera with calm professional expression
bars|pain|interior of upscale cocktail bar in early afternoon completely empty, sunlight streaming through front windows casting parallel light stripes across dark wood floor, telephone sitting unanswered on polished wood bar top, stools stacked
bars|outcome|30 year old white female bartender with short platinum blonde hair and visible sleeve tattoos on her left forearm wearing black apron, restocking bottles on back bar, tablet computer mounted near cash register showing reservation interface, late afternoon golden light
bars|urgency|close-up of paper wall calendar showing month of November with date in late November circled in red marker, dark bar interior background
bars|contrarian|portrait of female bartender with platinum hair and sleeve tattoos behind polished wood bar, looking directly at camera with deadpan expression, warm bar lighting
propertymgmt|pain|42 year old South Asian male property manager wearing simple grey t-shirt lying in bed in dark bedroom, illuminated only by glowing smartphone screen showing late night incoming call notification, alarm clock visible reading 2 14 AM
propertymgmt|outcome|same property manager now sleeping peacefully in bed with phone face down on nightstand, soft pre-dawn light just beginning to come through window, glowing notification visible on phone screen
propertymgmt|urgency|close-up of large color printed map of city neighborhood showing real estate portfolio buildings highlighted, one new building circled with red marker
propertymgmt|contrarian|portrait of property manager in plain grey t-shirt standing in office area, looking directly at camera with tired but determined expression
pestcontrol|pain|quiet suburban kitchen at night illuminated by single hanging pendant lamp, 38 year old white female homeowner wearing flannel pajamas and Henley shirt with hair tied up stands frozen at kitchen counter looking down at thumb sized cockroach, hand holding clean wine glass mid-rinse
pestcontrol|outcome|same homeowner now holding smartphone to her ear, relief and gentle smile on her face, phone screen visible showing appointment confirmation interface, warm kitchen lighting
pestcontrol|urgency|close-up of paper wall calendar showing month of March with early April date highlighted in red marker, residential office area background
pestcontrol|contrarian|portrait of pest control technician wearing branded uniform polo and cap leaning against side of company service truck, looking directly at camera with friendly confident expression, sunny day
saas|pain|29 year old Black female sales account executive wearing comfortable hoodie sitting at modern coworking desk with two computer monitors, can of sparkling water nearby, looking down at calendar app on screen showing meetings with concerned expression
saas|outcome|same female AE now smiling broadly at her dual monitor setup, computer screen showing closed deal notification with checkmark, can of sparkling water nearby, relaxed posture
saas|urgency|close-up of digital wall calendar display showing Q4 highlighted, modern office background with people walking past slightly defocused
saas|contrarian|portrait of female AE in hoodie sitting at coworking desk, looking directly at camera with slight confident smirk, modern office background blurred
startup|pain|solo startup founder in his late 20s wearing simple t shirt sitting alone at desk in modest home office at midnight, laptop open with many browser tabs visible, single desk lamp lit, focused but tired expression
startup|outcome|same founder now leaning back at desk with relaxed smile, looking at smartphone showing notification of first qualified meeting booked, warm morning light through window
startup|urgency|close-up of paper wall calendar showing 14 months of runway timeline, marked with red and green markers, startup office desk background
startup|contrarian|portrait of young startup founder in t shirt sitting at desk in modest office, looking directly at camera with quiet determined expression
insurance|pain|insurance agent desk in busy office, multi-line desk phone with several lit incoming call indicators, stack of printed quote request forms beside computer, agent's hand visible reaching for phone
insurance|outcome|insurance agent calmly speaking on phone at his desk, computer monitor showing qualified leads dashboard, professional office background
homeservices|pain|handyman in casual work clothes seated in his white service truck cab at sunset, looking down at smartphone showing list of missed calls, golden hour exterior light
homeservices|outcome|same handyman now standing outside his truck with toolbox, looking at smartphone showing weekly calendar full of confirmed bookings, residential driveway setting
coaches|pain|personal trainer in athletic wear actively demonstrating an exercise to client in modern gym, smartphone on bench nearby with incoming call notification on screen, focused on client
coaches|outcome|personal trainer wrapping up a training session shaking hand with client, smartphone visible showing notifications of new trial session bookings, bright gym interior
cleaning|pain|owner of small cleaning business in branded polo shirt mid-clean at a residential job site holding cleaning supplies, looking with concern at smartphone showing missed call
cleaning|outcome|same cleaning business owner standing at completed job site with cleaning supplies organized, smiling at smartphone showing new contract booking notification
veterinary|pain|busy veterinary practice front desk during morning hours, vet tech in scrubs juggling multiple phone lines with concerned pet owner and small dog visible in waiting area background
veterinary|outcome|veterinary technician in scrubs standing calmly at front desk, holding tablet computer showing intake management interface, peaceful clinic atmosphere
EOF

# Verify CLI
if ! command -v higgsfield >/dev/null 2>&1; then
  echo "ERROR: 'higgsfield' CLI not found. Run: npm install -g @higgsfield/cli && higgsfield auth login"
  exit 1
fi
if ! higgsfield auth token >/dev/null 2>&1; then
  echo "ERROR: Higgsfield CLI not authenticated. Run: higgsfield auth login"
  exit 1
fi

render_one() {
  local niche="$1" framework="$2" scene="$3" aspect="$4"
  local aspect_safe="${aspect/:/x}"
  local out_file="$OUT_DIR/TYA_${niche}_${framework}_photo_${aspect_safe}.png"
  local log_file="$LOG_DIR/${niche}_${framework}_photo_${aspect_safe}.log"

  if [[ -f "$out_file" ]]; then
    echo "  ✓ EXISTS  $out_file"
    return
  fi

  local prompt="${PREFIX}${scene}.${NEGATIVE}"
  echo "  → RENDER  $niche/$framework @ $aspect"

  local url
  url=$(higgsfield generate create "$MODEL" \
    --aspect_ratio "$aspect" \
    --resolution "$RESOLUTION" \
    --prompt "$prompt" \
    --wait 2>"$log_file" | tr -d '\r' | grep -oE 'https://[^ ]+\.(png|jpg|jpeg|webp)' | head -1)

  if [[ -z "$url" ]]; then
    local reason
    reason=$(grep -oE 'status "[^"]+"' "$log_file" | head -1)
    echo "  ✗ FAILED  $niche/$framework @ $aspect — $reason"
    return 1
  fi

  curl -sSL -o "$out_file" "$url"
  if [[ -s "$out_file" ]]; then
    echo "  ✓ SAVED   $out_file"
  else
    echo "  ✗ DL FAIL $url"
    rm -f "$out_file"
  fi
}

export -f render_one
export MODEL RESOLUTION PREFIX NEGATIVE OUT_DIR LOG_DIR

queue=$(mktemp)
trap "rm -f $queue" EXIT

count=0
while IFS='|' read -r niche framework scene; do
  [[ -z "${niche:-}" ]] && continue
  [[ "${niche:0:1}" == "#" ]] && continue
  if [[ -n "$NICHE_FILTER" && "$niche" != "$NICHE_FILTER" ]]; then continue; fi
  for aspect in $ASPECTS; do
    printf '%s\t%s\t%s\t%s\n' "$niche" "$framework" "$scene" "$aspect" >>"$queue"
    count=$((count + 1))
  done
done <<<"$PROMPTS"

echo "==> Bulk-render begin: $count jobs queued, $PARALLEL in parallel"
echo "==> Model: $MODEL | Aspects: $ASPECTS | Output: $OUT_DIR/"
echo ""

while IFS=$'\t' read -r n f s a; do
  [[ -z "${n:-}" ]] && continue
  while [[ $(jobs -rp | wc -l) -ge $PARALLEL ]]; do
    wait -n 2>/dev/null || sleep 1
  done
  render_one "$n" "$f" "$s" "$a" &
done < "$queue"

wait

generated=$(find "$OUT_DIR" -name "TYA_*.png" 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "==> Stage 1 done. $generated raw photos in $OUT_DIR/"
echo "==> Next: bash scripts/composite-ad-text.sh   (adds brand text + watermark)"
