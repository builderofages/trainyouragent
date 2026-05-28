# Niche-Template Close Tool — Setup

The close tool is live at `/admin/templates` (operator) and `/template/[niche]?company=...` (prospect-facing). v192-v193 added real outbound infrastructure (Supabase prospect tracking, daily follow-up cron, attribution from Cal.com, HMAC-signed unsubscribe). Most of it works automatically once the code is deployed, but these manual steps unlock the rest.

## 1. Run the Supabase migration

Open Supabase → SQL editor → New query, paste the contents of `supabase/migrations/v192_template_sends.sql`, run. Creates the `template_sends` table with all indexes + RLS policy.

After running, verify in Table Editor that `template_sends` exists with the expected columns (`prospect_company`, `niche`, `channel`, `sent_at`, `opened_at`, `booked_at`, `last_nurture_template`, etc).

## 2. Verify required env vars in Vercel

These should already be set from prior work. Confirm in Vercel → Project Settings → Environment Variables:

- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` — required for everything Supabase-backed
- `ADMIN_TOKEN` — gates `/api/template-send`, `/api/admin/template-activity`, the nurture cron, AND signs the unsubscribe HMAC. Critical.
- `RESEND_API_KEY`, `LEAD_NOTIFY_FROM` — for the nurture emails. `LEAD_NOTIFY_FROM` should be `Alexander <alexander@trainyouragent.com>` once the Resend domain is verified; if not yet, the cron falls back to `onboarding@resend.dev`.
- `CAL_WEBHOOK_SECRET` — already required by the existing `/api/cal-webhook`; the new template-attribution path reuses this.
- `ELEVENLABS_API_KEY`, `OPENAI_API_KEY` — for the voice playback (already wired).
- `ANTHROPIC_API_KEY` (or Groq / Gemini fallback keys) — for the live chat (already wired).

Redeploy after any env change.

## 3. Confirm Cal.com webhook

Cal.com → Settings → Developer → Webhooks. The existing webhook at `https://trainyouragent.com/api/cal-webhook` (events: `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`) handles template attribution automatically — when a booking fires, it parses `Niche: X · City: Y` from the `notes` field (which the template page's Cal URL builder pre-fills) and marks the matching `template_sends` row as `booked`. No new config needed; just confirm the webhook is still firing.

## 4. Vercel Cron — daily nurture

`vercel.json` now includes:

```json
{ "path": "/api/cron/template-nurture", "schedule": "0 15 * * *" }
```

Auto-registered on next deploy. Runs daily at 15:00 UTC (≈10am ET). Vercel will need cron protection — by default it sends a `?token` query param from a system-generated value. Since our endpoint checks `ADMIN_TOKEN` instead, the cron will fail until you either (a) add `?token=$ADMIN_TOKEN` to the path in `vercel.json` (works but exposes the token in logs), or (b) update the cron path to use Vercel's built-in cron auth and adjust `checkAdmin` to accept `x-vercel-cron`. Quick win for now is (a) — append `?token=$ADMIN_TOKEN` to the path.

## 5. Paste ADMIN_TOKEN into the gallery (one-time, per device)

Open `/admin/templates`. In the "Server Activity" panel, paste your `ADMIN_TOKEN` value into the password field. It stores in localStorage on this device. Now:

- Every gallery action (DM / Email / SMS / Share / Link / Open Site) logs a server-side row that the nurture cron picks up.
- The activity panel auto-refreshes every 60s with `BOOKED · 2h ago` / `OPENED · 3h ago` / `SENT` badges per prospect.
- The "Queue all to server" button in the bulk drawer now works — paste 50 prospect names, hit Queue, system logs all of them so the cron sends the follow-up sequence automatically.

## What the operator actually does day-to-day

1. Open `/admin/templates`.
2. Type the prospect's company + city + email + phone.
3. Filter by niche.
4. Hit "Share via…" (mobile) or "Copy DM" (desktop) — OS share sheet opens with the personalized DM pre-filled.
5. Paste into LinkedIn / iMessage / WhatsApp / wherever.
6. Forget about it. The nurture cron handles Day-3 + Day-7 follow-up automatically. The Server Activity panel shows who opened, who booked, who's still pending.

## What the prospect sees

`/template/[niche]?company=ACME&city=Tampa` →

- Personalized header, hero, CTA, voice greeting ("Thanks for calling ACME …")
- Tap-to-hear ElevenLabs voice playback of the greeting
- Live chat that responds in character as ACME's receptionist
- QR code for in-person handouts
- Cal.com booking button pre-filled with name + niche + city in notes
- Backup lead capture form (email/phone) if they won't book Cal
- Per-URL OG image — DM previews on LinkedIn/Slack/iMessage show "ACME — Real Estate" with a branded 1200x630 card
- Compliance: `noindex` (private outbound surface). The non-personalized version (`/template/[niche]` with no `?company=`) is indexable for SEO.

## Attribution loop, end to end

1. Operator hits Copy DM → `/api/template-send` inserts a row, gallery shows it in Server Activity as `SENT`.
2. Prospect opens the personalized URL → `/api/template-opened` updates the row, gallery flips to `OPENED · just now`.
3. Day 3 (if not booked): Resend fires Day-3 nurture email with HMAC-signed unsubscribe + Gmail one-click List-Unsubscribe header. Marks `last_nurture_template='day3'`.
4. Day 7: same with Day-7 template. `last_nurture_template='day7'`.
5. Prospect books on Cal → Cal webhook fires → parses `Niche: X` from notes → marks `template_sends.booked_at = now()` + `nurture_stopped_reason='booked'`. Sequencer stops. Gallery shows `BOOKED · 2m ago`.
6. Prospect clicks unsubscribe → `/api/template-optout` verifies HMAC, marks `nurture_stopped_reason='opted_out'`. Sequencer stops.

That's the whole machine.

## Troubleshooting

- **Server Activity panel is empty after a send.** Either the migration hasn't run yet, ADMIN_TOKEN doesn't match what's in Vercel env, or `SUPABASE_SERVICE_KEY` is missing. Check Vercel function logs for `/api/template-send` to see the exact error.
- **Nurture emails aren't sending.** Confirm `RESEND_API_KEY` set, `trainyouragent.com` domain verified in Resend (or fall back to `onboarding@resend.dev` as `LEAD_NOTIFY_FROM`), cron is actually firing in Vercel → Functions → Crons.
- **Cal booking didn't mark prospect as booked.** Check that the booking's notes field includes `Niche: X` — that's the parse target. If a prospect booked manually via a different link, the attribution can't match.
- **Prospect says "I never got an unsub email."** They got the in-body link AND the native Gmail Unsubscribe button. If both fail, manually update Supabase: `update template_sends set nurture_stopped_reason='manual' where prospect_email='...'`.
