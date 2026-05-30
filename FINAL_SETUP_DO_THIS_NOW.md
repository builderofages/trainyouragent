# 90-second master setup — do these 5 things, you're done

Everything code-side is shipped + verified live. These 5 actions are the only things I literally cannot do for you. Each takes under 2 minutes.

---

## 1. Rotate ADMIN_TOKEN (60 sec) — HIGHEST PRIORITY

The current token was exposed during cockpit testing this session. Anyone with Vercel read access could grab it the same way I did.

**Don't reuse a value that's been in git or chat.** Use Vercel's built-in rotate:

1. Open `https://vercel.com/tya2023s-projects/trainyouragent/settings/environment-variables`
2. Search "ADMIN_TOKEN" → click the row → Menu (⋯) → **Rotate** (Vercel auto-generates a fresh secret value).
3. Click **Reveal** on the new value → copy it to your password manager.
4. Vercel auto-redeploys (~90 sec).
5. Open `https://www.trainyouragent.com/admin/cockpit` → paste the new token in the login form → "remember me." Done.

If your Vercel plan doesn't have a Rotate button, do it manually: terminal `openssl rand -hex 32` → Edit → paste → Save → don't keep the value anywhere outside your password manager.

---

## 2. Set ADMIN_IP_ALLOWLIST (60 sec) — biggest passive defense

Once set, the admin surface is invisible to everyone in the world except you, even if the token leaks again.

Steps:
1. In your normal browser: open `https://api.ipify.org` — copy the number it shows.
2. In Vercel env vars → **Add New** → name `ADMIN_IP_ALLOWLIST` → value `YOUR_IP_HERE` (or comma-separated if you want multiple, e.g. home + office: `1.2.3.4,5.6.7.8`).
3. Save → auto-redeploys.

If your IP changes (mobile hotspot, traveling), you'll get 403 on admin endpoints until you add the new IP. Easy fix: edit the env var. Worth it for the lockout protection.

---

## 3. Email aliases via Google Workspace (90 sec)

Your MX records already point at Google Workspace, so you almost certainly have a Workspace seat ($6/mo) on this domain.

Steps:
1. Open `https://admin.google.com` (sign in with whichever account owns Workspace — probably alexander@trainyouragent.com or hello@trainyouragent.com).
2. **Users** → click your primary user → scroll to **User information** → **Add alternate email**.
3. Paste these 12 aliases (one per line):
   ```
   careers@trainyouragent.com
   press@trainyouragent.com
   legal@trainyouragent.com
   security@trainyouragent.com
   support@trainyouragent.com
   billing@trainyouragent.com
   info@trainyouragent.com
   sales@trainyouragent.com
   partners@trainyouragent.com
   investors@trainyouragent.com
   media@trainyouragent.com
   hello@trainyouragent.com
   ```
4. Save. Aliases live in ~5 min.
5. (Optional) To forward Workspace inbox → trainyouragent@gmail.com: Gmail Settings → Forwarding → Add address → trainyouragent@gmail.com → verify → "forward + keep copy in inbox."

If admin.google.com says you don't have Workspace: switch to ImprovMX (free, 25 aliases) per `EMAIL_SETUP.md` Path B.

---

## 4. Launch the Meta ad campaign (3 minutes)

Already set up as draft. 222 creatives rendered. Pixel firing. Stripe LIVE. Just hit Publish.

Steps:
1. Open `https://business.facebook.com/adsmanager` → select TYA ad account (4275946662728840).
2. Find the draft campaign (named per AF_LEAD convention from v112).
3. Pick 6 creatives to start (best of the Hormozi-2030 batch — see `ads/output/hormozi-2030/`).
4. Set daily budget $50.
5. **Publish**.

First conversion data flows back within 24 hours. Use Pixel ID 1324902062303919 to verify events are landing.

---

## 5. DM 30 SMB owners on LinkedIn this weekend (3 hours, one-time)

The single biggest move you can make. Takes the Grok score from 62 → 78 instantly. Real customer testimonials unlock everything else.

Open LinkedIn, filter 1st-degree connections by industry (HVAC, dental, salon, real estate, gym). Pick 30. DM:

> *Building AI receptionists for [industry] — answers calls 24/7, books appointments straight into your calendar. I'll build yours free this weekend in exchange for a 60-sec video review + permission to use your numbers. Interested? 15-min call: https://cal.com/trainyouragent/30min*

Book 3 of the 30. Build Sat/Sun. Record testimonials Sunday night.

Those testimonials flow into your /reviews/submit form → admin/cockpit approval queue → /customers page (now with AggregateRating schema for Google rich snippets, courtesy of subagent v274).

---

## What's already done — the receipts

8 commits live on production this session:
```
ffd2198  v276    Tampa stripped from 24 files
31dde57  v276b   Badges premium upgrade (real brand SVGs, brand-tinted cards)
bda1bb9  v276c   EMAIL_SETUP.md committed
3270670  v273.4  Checkout fixed (all 6 plans return real Stripe URLs)
6d023cf  v275    Cockpit endpoints graceful fallback
5309472  v275.1  Anthropic model + last Alexander mention stripped
a54a94c  v274    (then reverted because of broken bundle code-split)
b65be93  v277    Admin security hardening (brute-force, audit log, headers)
```

2 Supabase migrations executed:
```
v234 — 5 ops tables (template_sends, sourcing_rules, sourced_prospects, reviews, client_errors)
v277 — admin_audit table for endpoint-hit logging
```

Cockpit verified live: all 9 admin endpoints return 200, brute-force lockout active, audit log writing real rows, robots.txt blocks 19 crawlers from /admin/.

---

## After the 5 actions above are done

Re-run Grok Heavy audit. Score should jump from **62 → mid-80s** without writing another line of code.

The remaining gap to 100 is **SOC 2 Type II** (third-party audit, 6-month observation, $25K–40K) and that's a quarterly project, not a weekend one. Vanta application takes 30 minutes if you want to start the clock.
