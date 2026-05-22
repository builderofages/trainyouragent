# Federation + Tracking Setup — v100/v101

One-time setup so leads from **trainyouragent.com**, **cnnct.ai** (Ghost),
and **tyahq.com** all land in the same Supabase / admin / nurture pipeline,
and so paid-ad tracking is wired across all three.

Estimated total time: **15 minutes**.

---

## 1. Apply the Supabase migration

Open the [Supabase SQL editor for the TrainYourAgent project][sql] and paste
the contents of `supabase/migrations/v100_venture_federation.sql`. Click
**Run**. It's idempotent — safe to re-run if you've already applied parts of
it.

Verify with:

```sql
select column_name, data_type, column_default
  from information_schema.columns
 where table_name = 'tya_leads'
   and column_name in ('venture','brand_url','cross_sell');
```

You should see three rows. Done.

[sql]: https://app.supabase.com/project/_/sql/new

---

## 2. Generate two federation tokens

Pick any high-entropy strings — these are shared secrets between the sibling
sites and this site. Don't use anything memorable.

```bash
# macOS / Linux
echo "gh_$(openssl rand -hex 16)"
echo "hq_$(openssl rand -hex 16)"
```

You'll get something like:

```
gh_8e2d4f1a7b3c9e6d5a8b2c4d1e3f5a7b
hq_3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f
```

Keep both tokens handy — you'll paste each into two places.

---

## 3. Wire the federation env var in Vercel

In Vercel → trainyouragent → Settings → Environment Variables, add:

| Name                       | Value                                                       | Environments        |
| -------------------------- | ----------------------------------------------------------- | ------------------- |
| `LEAD_FEDERATION_TOKENS`   | `ghost:gh_8e2d4f1a...,tyahq:hq_3c5d7e9f...`                 | Production, Preview |

Then redeploy (or push any commit) to pick it up.

---

## 4. Drop the embed on cnnct.ai

Wherever you want a lead-capture form on Ghost Agency's site:

```html
<div id="tya-lead-ghost"
     data-venture="ghost"
     data-token="gh_8e2d4f1a7b3c9e6d5a8b2c4d1e3f5a7b"
     data-source="cnnct-home-hero"
     data-brand-url="https://cnnct.ai"></div>
<script src="https://trainyouragent.com/embed/lead.js" async></script>
```

`data-source` is a free-form tag — useful for attribution later
(e.g. `cnnct-pricing-bottom`, `cnnct-blog-cta`).

---

## 5. Drop the embed on tyahq.com

Same pattern, different venture + token:

```html
<div id="tya-lead-hq"
     data-venture="tyahq"
     data-token="hq_3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f"
     data-source="hq-home-hero"
     data-brand-url="https://tyahq.com"></div>
<script src="https://trainyouragent.com/embed/lead.js" async></script>
```

---

## 6. Verify

1. Submit a test email on cnnct.ai and on tyahq.com.
2. In Supabase SQL editor:

   ```sql
   select id, email, source, venture, brand_url, cross_sell, created_at
     from public.unified_leads
    order by created_at desc
    limit 10;
   ```

   You should see your two test rows with `venture = 'ghost'` and
   `venture = 'tyahq'`. If you submit the **same** email from cnnct.ai and
   then trainyouragent.com, the second row will have `cross_sell = true`
   — that's the upsell signal.

3. In `/admin` on trainyouragent.com you'll now see a venture filter on the
   leads view (added in a follow-up commit).

---

## 7. Tracking env vars (Meta Pixel + GA4)

While you're in Vercel env vars, also add:

| Name                  | Where to get it                                                          |
| --------------------- | ------------------------------------------------------------------------ |
| `META_PIXEL_ID`       | Meta Events Manager → your pixel → Settings → Pixel ID (15-16 digits)    |
| `GA4_MEASUREMENT_ID`  | GA4 → Admin → Data streams → your stream → Measurement ID (`G-XXXXXXXX`) |

The build-time placeholder injection in `vite.config.ts` will swap them in
on the next deploy. When unset, the page short-circuits cleanly — no
broken pixel, no 404 noscript image, no console noise.

For Meta CAPI server-side mirroring of Lead events, additionally add:

| Name                       | Where to get it                                                 |
| -------------------------- | --------------------------------------------------------------- |
| `META_CAPI_ACCESS_TOKEN`   | Meta Events Manager → your pixel → Conversions API → Generate token |

That's it. After the next deploy, every `/api/lead` POST also fires a
server-side Lead event to Meta with deduplicated event IDs.

---

## Token rotation

If you ever need to rotate a federation token:

1. Generate a new one (`openssl rand -hex 16`).
2. Update `LEAD_FEDERATION_TOKENS` in Vercel (you can list two pairs
   temporarily during the cutover, e.g. `ghost:OLD,ghost:NEW`).
3. Update the embed snippet on the sibling site to use the new token.
4. Once verified, remove the old pair from Vercel.

No code changes required.
