# TrainYourAgent — Higgsfield Brand Spec

Single source of truth for every image and video generated. Paste this
into Higgsfield's "Brand Kit" / "Style Reference" upload slot so every
output renders on-brand without re-typing the rules every time.

---

## Logo

**Primary mark:** TrainYourAgent diamond logo
- Geometry: diamond (rotated square) divided by a vertical + horizontal
  centerline, with a small filled circle at the intersection
- Stroke weight: 6% of glyph height
- Always rendered in TYA Navy `#042C53` on light backgrounds
- Always rendered in pure white `#FFFFFF` on dark backgrounds
- Minimum padding around logo: 1.5× glyph height (clear-space rule)
- Never on a gradient. Never with a drop shadow. Never tilted.
- Wordmark `TrainYourAgent` set in **Inter Tight 600**, kerning -0.01em,
  always paired to the right of the mark with 0.4× glyph-height gap.

**Watermark for ads (bottom-right corner):**
- Logo + wordmark lockup at 64px height (1080×1920 canvas)
- 32px padding from bottom + right edges
- 80% opacity on photographic content, 100% on end card
- Subtle 50% black drop-shadow at 4px blur — for legibility over busy
  backgrounds. Allowed only on watermark, never on hero logo.

---

## Color palette

| Role | Hex | Use |
|---|---|---|
| TYA Navy | `#042C53` | Primary logo, primary CTA, headline color on light bg |
| Atmospheric Blue | `#185FA5` | Eyebrow text, accent, link color |
| Soft Sky | `#9CC4EC` | Secondary CTA outline, footer text on dark |
| Bone White | `#FAFAFA` | Primary background on light scenes |
| Cool Slate | `#0B1B2B` | Primary text on light bg |
| Signal Green | `#22A36C` | Live/active indicators, "after" success state |
| Pain Red | `#D9404B` | Pain counter, "leak" indicator, rare |
| Pure Black | `#000000` | Dark-mode background, never as text |

Never use:
- Bright neon
- Hot pink / magenta
- Cyber green
- Gradient text
- Outline text with stroke

---

## Typography

- **Headlines:** Inter Tight 600 + Playfair Display 500 italic for the
  italicized accent word in the headline. Headline always ends with an
  italic Playfair phrase. Examples:
  - "AI that runs the part of your business *that used to run you.*"
  - "Stop the leak. *Agent picks up.*"
  - "Be one of our first ten *and pay half-price forever.*"
- **Body:** Inter Tight 400, line-height 1.5, max 60ch
- **UI labels (eyebrows):** Inter Tight 600 uppercase, tracking 0.18em,
  TYA Navy or Atmospheric Blue, 11px
- **Numerics:** Inter Tight 600 with `font-variant-numeric: tabular-nums`
  so dollar counters don't visually jitter

**Forbidden:** Comic-style fonts. Brush scripts. Outlined or stroked text.
Tilted text. Text on a circular path. Drop-shadowed text on images.

---

## Photography style

When generating image ads in Higgsfield Nano Banana Pro:
- **Documentary realism** — Roger Deakins / Emmanuel Lubezki natural-light
  references. Never flat studio softbox lighting.
- **Tungsten interior or golden-hour exterior** preferred over fluorescent
- **Shallow depth of field** — subject sharp, background context-visible
  but soft
- **35mm or 50mm focal length feel** — not wide-angle, not telephoto
- **Faces:** Real human texture (visible pores, hairline imperfection,
  asymmetric expressions). Never glossy plastic. Never bilateral symmetry.
- **Ethnicity diversity required** — rotate Black, Latino, white, Asian,
  South Asian, Middle Eastern across the batch. No one is "the default."
- **Body diversity required** — not just gym bodies. Operators look like
  operators: 30-60yo, varied builds, often tired-looking.
- **Wardrobe:** Industry-accurate. HVAC tech in coveralls (not white
  button-down). Restaurant host in vest. Nurse in scrubs (not white coat
  unless MD). Service writer in shop uniform.

**Forbidden visual tropes:**
- Plastic skin / hyperreal AI face
- Symmetric face (use the negative prompt: "asymmetric face, real human")
- Stock-photo "businesswoman pointing at chart"
- Hand grabbing handshake from off-screen
- Floating glowing orb / cyber-grid
- Six-finger hand (always negative-prompt this)
- Excessive bokeh balls
- Lens flare unless naturally motivated
- Vignette unless naturally motivated
- HDR oversaturation

---

## Composition rules

- **Subject in left or right third**, never dead center
- **Eye level matches subject's** — no looking-down-at-them angle, no
  hero-shot looking-up
- **Negative space top-right or bottom-left** reserved for text overlay
- **Action line / sight line into the frame**, not out of it
- **Foreground / mid / background layers** all carry information

---

## End card (every ad ends with this)

**Length:** 1.0s hold (videos), full canvas (images that need a static CTA)
**Background:** Bone White `#FAFAFA`
**Logo:** TYA diamond mark, 128px height, centered, TYA Navy
**Wordmark:** "TrainYourAgent" Inter Tight 600 28px, TYA Navy, 12px below mark
**Tagline:** Inter Tight 500 italic Playfair (italic word only), 16px,
Cool Slate, 24px below wordmark. Rotates by ad theme:
- Default: "*AI that runs the part of your business that used to run you.*"
- Pain framework: "*Stop the leak. Agent picks up.*"
- Outcome framework: "*Live in 21 days. Pay only when it earns.*"
- Contrarian: "*Built by an operator. Not by a Skool grad.*"

**URL:** `trainyouragent.com/apply` in Inter Tight 600 14px, TYA Navy,
24px below tagline.

---

## Aspect ratio matrix

Every concept renders at 3 ratios for full Meta placement coverage:

| Ratio | Pixels | Placement |
|---|---|---|
| 9:16 | 1080 × 1920 | Reels, Stories, TikTok (highest priority) |
| 4:5 | 1080 × 1350 | Instagram Feed (highest 2026 CTR) |
| 1:1 | 1080 × 1080 | FB Feed fallback, square crop safety |

Re-fire each concept at all 3. Do not let Meta auto-crop a single
9:16 across all placements — that loses ~40% of Feed CTR.

---

## Universal negative prompt (paste into every Higgsfield generation)

```
no plastic skin, no glossy AI face, no bilateral facial symmetry, no
six fingers, no extra fingers, no warped hands, no melting watches,
no floating logos, no neon, no cyber-grid background, no holographic
overlays, no stock photo lighting, no symmetrical composition, no
generic chart-pointing pose, no thumbs-up cliché, no perfect-teeth
smile, no plastic hair, no Uncanny Valley face, no AI watermark, no
ai-generated text typography in scene, no fake reflection in eyes, no
duplicate limbs, no extra arms, no text that looks like gibberish, no
asian face on latino name, no white face on black name (respect
character lock), no flat softbox studio lighting, no oversaturated
HDR, no excessive lens flare, no rainbow gradient, no laser eyes
```

---

## Universal positive prompt prefix (paste at start of every Higgsfield gen)

```
Documentary-realism photography, natural light, Roger Deakins
cinematography references, shallow depth of field, 50mm equivalent,
real human texture including pores and hairline imperfection,
asymmetric facial expression, candid moment captured mid-action,
industry-accurate wardrobe, environmental specificity, [TYA Navy
#042C53 + Bone White #FAFAFA palette where colors appear], on-brand
TrainYourAgent diamond watermark bottom-right at 80% opacity.
```

---

## File naming convention for assets

`TYA_<niche>_<concept>_<framework>_<aspect>.{jpg|mp4}`

Examples:
- `TYA_hvac_after-hours-dispatch_pain_9x16.mp4`
- `TYA_legal_intake-screener_outcome_4x5.jpg`
- `TYA_restaurants_dinner-rush_relatable_1x1.jpg`

Frameworks: `pain` | `outcome` | `urgency` | `contrarian` | `relatable`

Drop completed files into `ads/static/` (images) or `ads/video/` (mp4).
The `scripts/upload-fb-creatives.sh` walks both dirs and creates a
PAUSED draft ad for every file under the TYA campaign.
