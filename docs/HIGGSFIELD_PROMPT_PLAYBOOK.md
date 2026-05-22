# Higgsfield Marketing Studio — Production-Ready Prompt Playbook

Built from Higgsfield's official 2026 blog tutorials + Seedance 2.0 prompting
guide + four iterations on TrainYourAgent ads. This is the structure that
produces brand-safe, error-free output. Use it every time.

---

## The 7-Part Prompt Template

Every $1T-grade Higgsfield prompt has these seven parts, in this order:

```
1. REFERENCE LOCKS        @image_1 is X. @image_2 is Y. Do not animate.
2. SETTING                Location, time-of-day, lighting, background detail.
3. CHARACTER              Build, hair, wardrobe (incl. "blank, no logos"), age.
4. BEAT-BY-BEAT           0-3s: action. 3-6s: action. 6-8s: action. Camera per beat.
5. SPOKEN DIALOGUE        Exact words, in quotes. One short line per beat max.
6. CAMERA + LIGHTING      One paragraph. Specific lens / angle / movement.
7. SOUND DESIGN           Ambient + SFX + spoken words + "no copyrighted music."
8. IMPORTANT: CONSTRAINTS Hard rules. The phrase the model treats as binding.
9. STYLE LOCK             4K, realistic, lifestyle commercial, etc.
```

---

## Pre-flight — generate text-bearing assets in GPT Image 2.0 first

**The #1 source of AI-video errors is text rendering.** Seedance 2.0 will
garble brand wordmarks, dashboard text, phone-screen UI, and any signage.
**Don't ask the video model to render text.** Pre-render it as a static
image, then attach it as `@image_1`, `@image_2`, etc. and tell the video
model "display this statically on the phone screen, do not animate."

Workflow:
1. Open [GPT Image 2.0](https://higgsfield.ai/s/gpt-image-2-higgsfieldai-NpYCRi)
   on Higgsfield (GPT-Image is the only model that gets text right).
2. Generate one image per text-bearing surface you need:
   - **Phone dashboard screen** — TrainYourAgent dashboard at 9:16 with
     "47 booked this week · $12,400 pipeline · 0 missed."
   - **Brand wordmark card** — clean white card, "TrainYourAgent" in
     dark navy Inter Tight font, no other text.
   - **Phone-call notification screen** — iOS lockscreen with "Incoming
     call · Customer · TrainYourAgent answering…"
3. Save each as `@image_1`, `@image_2`, `@image_3`. Reference by name
   inside the video prompt.

---

## TrainYourAgent — Master Negative-Prompt Boilerplate

Copy this into the **IMPORTANT: CONSTRAINTS** section of every TYA prompt:

```
IMPORTANT — DO NOT INCLUDE:
- Distorted hands, extra fingers, missing fingers, six fingers, deformed thumbs.
- Morphing face across the shot; eyes that drift apart; jawline that changes.
- Lip-sync drift; mouth movements that do not match the voiceover.
- Any text rendered inside the video frame other than what comes from
  @image_1 / @image_2 — no captions, no subtitles, no overlays, no watermark.
- Brand wordmark variations — wordmark only ever appears via @image_2.
- Multiple people in frame; the founder is alone for the entire shot.
- Sudden cuts beyond the explicit beat structure; camera shake beyond
  natural handheld feel; whip-pans; jump cuts.
- Visible AI artifacts: shimmer on skin, plastic skin, beauty filter,
  warping clothes, melting fingers, fake bokeh on flat surfaces.
- Brand logos other than TrainYourAgent — clothing must be plain, blank
  fabric, no prints, no graphics, no brand marks, no text whatsoever.
- Phone screen content other than @image_1 — no random apps, no
  notifications, no battery icons, no time stamp.

STYLE LOCK: Single continuous character, single continuous wardrobe,
single continuous room and lighting for the entire 8 seconds.
Shot like a real iPhone 15 selfie video at 4K. Natural skin texture
with visible pores, slight grain, accurate color. No beauty filter,
no plastic skin, no Instagram filter.
```

---

## Ad #1 — Founder Confession (REWRITE)

**Goal:** Hormozi-style pain hook → solution → social proof in 8 seconds.

**Pre-flight assets needed:**
- `@image_1` — TrainYourAgent dashboard screenshot (9:16, dark navy theme,
  numbers showing "47 booked · $12,400 · 0 missed")
- `@image_2` — Clean white card with "TrainYourAgent" wordmark in dark
  navy, no other text, no tagline.

**Prompt:**
```
@image_1 is the TrainYourAgent dashboard — display it statically on the
phone screen in the final beat. @image_2 is the brand wordmark card — fade
to it on the final frame. Do not animate either image.

SETTING: Modern kitchen at golden hour, warm window light from camera-right,
blurred background with a single potted plant and a wooden coffee bar.
White subway tile, warm wood countertop, no other people in frame.

CHARACTER: Mid-30s American male small-business founder. Brown hair, short,
slightly messy. Light stubble. Plain dark heather-grey t-shirt — completely
blank fabric, no logos, no brand marks, no prints, no text, no graphics
on clothing whatsoever. Sits at the counter, iPhone 15 in his right hand
at chest level, screen angled toward camera.

BEAT-BY-BEAT:
0–2s: Medium close-up, slight handheld sway. He looks tired, runs his
left hand through his hair, exhales. Phone screen NOT visible yet.
2–5s: Tighter on his face. He looks straight into camera, calm not pitched.
Lip movements perfectly match this VO:
  "Twelve missed calls yesterday. Twelve customers who hired somebody else."
5–7s: He turns the phone toward camera. Phone screen shows @image_1 —
the TrainYourAgent dashboard, perfectly static, exactly as the reference.
He says, calmly:
  "I plugged in a voice agent. Now my phone gets answered. Every time."
7–8s: Fade to white. @image_2 brand wordmark holds on screen for the final
beat. No other text.

CAMERA + LIGHTING: Single continuous handheld iPhone selfie shot. Natural
warm window light, 5500K, soft shadows. f/1.8 shallow depth — face sharp,
background gently blurred. No filter, no color grade, no LUT.

SOUND DESIGN: Ambient kitchen room tone. Soft refrigerator hum. One quiet
notification chime when the dashboard appears. Spoken voiceover only at
2-5s and 5-7s beats. Voice is calm American male, conversational not
salesy. NO copyrighted music. NO background song.

[INSERT MASTER NEGATIVE-PROMPT BOILERPLATE HERE]
```

---

## Ad #2 — 11:47pm Operator (REWRITE)

**Goal:** Late-night relatability hook for owner-operators who work past 11pm.

**Pre-flight assets needed:**
- `@image_1` — phone lock screen at 11:47pm showing "TrainYourAgent ·
  Incoming call — handling now."
- `@image_2` — same brand wordmark card as Ad #1.

**Prompt:**
```
@image_1 is the phone lock screen at 11:47pm — display statically when the
phone appears on the kitchen table. @image_2 is the brand wordmark card —
fade to it on the final frame. Do not animate either image.

SETTING: Dim suburban kitchen at 11:47pm. Single warm overhead light over
the kitchen island. Background dark, blurred. Half-empty coffee mug visible
camera-left. Open laptop visible camera-right, screen dimmed.

CHARACTER: Late-30s American male, three-day stubble, exhausted but
intense. Plain navy crew-neck t-shirt — completely blank, no logos, no
prints, no graphics, no text whatsoever. Sitting at the island, leaning
forward on his elbows, iPhone 15 face-down on the wood in front of him.

BEAT-BY-BEAT:
0–2s: Tight on his eyes. Heavy blink. He pulls the laptop screen brightness
down and exhales.
2–5s: Looks directly at camera. Lip movements match VO exactly:
  "It is eleven forty-seven on a Tuesday. Your phone is ringing right now."
5–7s: His phone on the table lights up — @image_1 visible on the lock
screen, perfectly static. He doesn't pick it up. He keeps eye contact with
camera. Says:
  "An AI agent just booked that job. Stop missing money."
7–8s: Fade to white. @image_2 brand wordmark holds.

CAMERA + LIGHTING: Single continuous handheld selfie iPhone shot, locked
on his face except for one soft pan down to the phone at 5s and back up by
6s. Single warm light source. Deep shadows. f/1.8 shallow depth.

SOUND DESIGN: Quiet room tone. Faint laptop fan hum. One real iPhone
notification ping when @image_1 lights up at 5s. Voiceover only at the
two beats above. Calm tired American male voice. NO copyrighted music.

[INSERT MASTER NEGATIVE-PROMPT BOILERPLATE HERE]
```

---

## Ad #3 — Before/After Receipts (REWRITE)

**Goal:** Outcome-focused proof ad. Receipts > opinion.

**Pre-flight assets needed:**
- `@image_1` — phone screen showing 41 missed calls (stacked iOS
  notifications, red badge "41").
- `@image_2` — same phone now showing TrainYourAgent dashboard: "47
  booked · $12,400 pipeline · 0 missed."
- `@image_3` — brand wordmark card as before.

**Prompt:**
```
@image_1 is the BEFORE phone screen — 41 missed calls, stacked red iOS
notifications. @image_2 is the AFTER phone screen — TrainYourAgent
dashboard with 47 booked and 0 missed. @image_3 is the brand wordmark.
Display each statically when called for in the beat structure. Do not
animate any of them.

SETTING: Clean white desk, natural daylight from camera-left, blurred home
office in background. Single succulent plant. One iPhone 15 placed flat
on the desk, screen facing up toward camera.

CHARACTER: Mid-30s American male, brown hair short, light stubble. Plain
charcoal heather t-shirt — completely blank, no logos, no prints, no
graphics, no text whatsoever. Sitting at the desk, both hands resting on
the wood. Calm. Confident. Eye contact with camera throughout.

BEAT-BY-BEAT:
0–3s: Top-down close-up on the phone. Phone screen shows @image_1 — 41
missed calls — perfectly static, exactly as the reference. Calm male VO:
  "Three months ago I missed forty-one calls in a week."
3–5s: Phone screen smoothly cross-fades from @image_1 to @image_2 — the
TrainYourAgent dashboard with 47 booked, 0 missed. Camera holds steady.
Same VO continues:
  "Today my agent answered every one of them."
5–7s: Camera pulls up smoothly to reveal the founder behind the desk,
looking at camera. Same VO continues:
  "Same phone number. Same business. The only thing that changed is who
  picks up."
7–8s: Cut to clean white card with @image_3 — brand wordmark "TrainYourAgent"
in dark navy. Holds for the final beat. No other text.

CAMERA + LIGHTING: Single continuous shot with one smooth crane move from
top-down on the phone up and back to reveal the founder. Natural daylight,
6500K, soft shadows. Color grade clean, no LUT.

SOUND DESIGN: Quiet office room tone. One subtle whoosh on the
cross-fade between @image_1 and @image_2. Voiceover continuous through
the three beats above. Same calm American male voice as Ads #1 and #2 —
identical character continuity. NO copyrighted music. NO background song.

[INSERT MASTER NEGATIVE-PROMPT BOILERPLATE HERE]
```

---

## Settings to use every time

| Setting          | Value                      | Why                                   |
| ---------------- | -------------------------- | ------------------------------------- |
| Aspect ratio     | 9:16                       | TikTok / Reels / Shorts / Stories     |
| Quality          | 1080p (when budget allows) | 720p is fine for testing, ship 1080p  |
| Duration         | 8s for hooks, 15s for full | 8s for top-of-funnel A/B, 15s on win  |
| Preset           | UGC for testimonial-style  | Most authentic; highest CTR for SMB B2B |
| Avatar           | Same male avatar every ad  | Character continuity across campaign  |

---

## Operating workflow

1. Pre-generate all text-bearing assets in GPT Image 2.0. Save with
   meaningful filenames.
2. Open Marketing Studio → URL to Ad → paste `https://trainyouragent.com`.
3. Select **UGC** preset (or Hyper Motion / TV Spot per format).
4. Attach all pre-generated images as references.
5. Paste the prompt from this playbook.
6. Lock the same avatar across the full campaign for continuity.
7. Generate. Inspect. If the output has a specific defect, paste this
   prompt back into Claude with "Fix beat X — the defect was Y" — don't
   re-iterate end-to-end.
8. When a hook lands, batch the same prompt across 5+ avatar variations.
   That's an entire ad set in 30 minutes.

---

## What I won't do anymore (lessons from v99a failures)

1. **No more rendering brand text inside the video.** Always via @image
   reference. Seedance scrambles 'TrainYourAgent' on every other render.
2. **No more single-paragraph prompts.** Always beat-by-beat with timestamps.
3. **No more "modern home office" without specifying lighting + props.**
   Vague = inconsistent. Specific = repeatable.
4. **No more clothing without a "blank, no logos" clause.** Seedance will
   invent fake brand marks otherwise.
5. **No more spoken lines longer than two sentences per beat.** Lip-sync
   drifts past that.
6. **No more "TrainYourAgent" or any wordmark in the spoken dialogue.**
   The model mispronounces it. The brand only appears as the final card.

---

## References

- [Higgsfield Marketing Studio — Full Prompts blog](https://higgsfield.ai/blog/marketing-studio-video-2)
- [Seedance 2.0 Prompting Guide](https://higgsfield.ai/blog/seedance-prompting-guide)
- [Higgsfield UGC Factory](https://higgsfield.ai/ugc-factory)
- [Marketing Studio launch](https://higgsfield.ai/marketing-studio-intro)
