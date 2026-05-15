# INTEGRATIONS_SETUP.md

> Wire-up guide for every external service the **trainyouragent.com** site
> depends on. Owner: Alexander Mills. Goal: knock all 10 keys out in one sitting.

---

## ONE-PAGE CHECKLIST

| # | Integration | Env vars | Time |
|---|---|---|---|
| 1 | **Resend** (email) | `RESEND_API_KEY`, `LEAD_NOTIFY_TO`*, `LEAD_NOTIFY_FROM`* | 4 min |
| 2 | **Anthropic** (chat + simulator) | `ANTHROPIC_API_KEY` | 3 min |
| 3 | **Stripe** (checkout + webhook) | `STRIPE_SECRET_KEY`, `STRIPE_PRICE_OPERATORS`, `STRIPE_PRICE_FOUNDERS_BUILD`, `STRIPE_WEBHOOK_SECRET` | 14 min |
| 4 | **Slack webhook** (lead pings) | `SLACK_WEBHOOK_URL` | 5 min |
| 5 | **beehiiv** (newsletter) | `BEEHIIV_PUB_ID`, `BEEHIIV_API_KEY` | 6 min |
| 6 | **Meta Pixel + CAPI** (FB/IG ads) | `META_PIXEL_ID`, `META_CAPI_TOKEN` | 10 min |
| 7 | **GA4 + GTM** | `GA4_MEASUREMENT_ID` | 8 min |
| 8 | **Google Ads conversions** | `GADS_CONVERSION_ID`, `GADS_CONVERSION_LABEL` | 7 min |
| 9 | **Cal.com webhook** | `CAL_WEBHOOK_SECRET` | 5 min |
| 10 | **Supabase** (lead storage) | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | 8 min |

`*` = optional override; sensible defaults already in code. **Total: ~70 min.**

---

## MINIMUM VIABLE — DO THESE THREE FIRST

> If you're about to point paid traffic at the site **today**, only three of
> the ten matter. Without them, ads still cost money but nothing converts:

1. **Resend** — without this, lead form submissions silently disappear. No email lands in your inbox, no booking confirmation goes out. The site looks like it works but you have no idea anyone signed up.
2. **Anthropic** — without this, the on-site Claude chat widget and the agent simulator (the two demos that actually sell the product) return errors. The whole "see it work" pitch falls flat.
3. **Meta Pixel + CAPI** — without the pixel, Meta has no idea which clicks converted. You can't optimize for Lead/Purchase, retargeting audiences stay empty, and CPLs will be 3-5x what they should be after the first week.

The other seven (Stripe, Slack, beehiiv, GA4, Google Ads, Cal webhook, Supabase) make the site **better** but the site can convert ad traffic without them on day one.


---

## HOW TO ADD AN ENV VAR TO VERCEL (you'll do this 20+ times)

**CLI (fastest):**
```bash
# from the repo root, after `vercel link`
echo "<value>" | vercel env add <KEY_NAME> production
echo "<value>" | vercel env add <KEY_NAME> preview
echo "<value>" | vercel env add <KEY_NAME> development
```

**Dashboard click-path:**
1. https://vercel.com/dashboard
2. Click the `trainyouragent` project
3. **Settings** (top tab) -> **Environment Variables** (left nav)
4. **Key** = the env var name (e.g. `RESEND_API_KEY`)
5. **Value** = the secret
6. **Environments** = check all three (Production, Preview, Development)
7. **Save**

After adding **any** env var, Vercel does NOT auto-redeploy. You must run:
```bash
vercel --prod
```
or click **Deployments -> ... menu on latest -> Redeploy**.

---

## 1. Resend (transactional email)

**What breaks without it:** every lead form on the site (newsletter, contact, demo request, ROI calc, configurator, buyers-guide modal) silently fails. The serverless function at `api/lead.ts` short-circuits and you get zero notifications. Booking confirmations from the Cal webhook also won't send.

**Signup:** https://resend.com/signup (free tier = 3,000 emails/mo, 100/day)

**Get the key:**
1. Log into https://resend.com
2. Left nav -> **API Keys**
3. **Create API Key** -> name it `trainyouragent-prod` -> Permission **Full access** -> **Add**
4. Copy the `re_...` value immediately (only shown once)

**Verify your sending domain (required to send from `@trainyouragent.com`):**
1. Left nav -> **Domains** -> **Add Domain** -> `trainyouragent.com`
2. Add the 3 DNS records (MX, SPF/TXT, DKIM/CNAME) to your registrar
3. Wait ~10 min, click **Verify**

**Add to Vercel:**
```bash
echo "re_xxxxxxxxxxxxxxxxxxxx" | vercel env add RESEND_API_KEY production
echo "hello@trainyouragent.com" | vercel env add LEAD_NOTIFY_TO production
echo "leads@trainyouragent.com" | vercel env add LEAD_NOTIFY_FROM production
```

`LEAD_NOTIFY_TO` and `LEAD_NOTIFY_FROM` are optional — `api/lead.ts` defaults them to `hello@trainyouragent.com` and `leads@trainyouragent.com`. Override only if you want a different inbox.

**Test (after redeploy):**
```bash
curl -X POST https://trainyouragent.com/api/lead \
  -H "Content-Type: application/json" \
  -d '{"email":"you@yourdomain.com","name":"Smoke Test","source":"newsletter","path":"/test"}'
```
Expected: `{"ok":true}` and an email lands in `LEAD_NOTIFY_TO` within ~5 sec.


---

## 2. Anthropic (Claude chat widget + agent simulator)

**What breaks without it:** the on-site Claude chat widget (bottom-right of every page, served by `api/chat.ts`) and the **AgentSimulator** demo on the homepage both return 500. These are the two product demos that actually convince visitors the product works — no Anthropic key = no live demo = no conversions.

**Signup:** https://console.anthropic.com/

**Get the key:**
1. https://console.anthropic.com/settings/keys
2. **Create Key** -> name it `trainyouragent-prod` -> **Add**
3. Copy `sk-ant-api03-...` (only shown once)

**Add billing first** (free credits expire fast):
1. https://console.anthropic.com/settings/billing
2. Add a card. Set a **monthly spend limit** of e.g. $200 so a runaway loop can't drain you.

**Add to Vercel:**
```bash
echo "sk-ant-api03-xxxxxxxxx" | vercel env add ANTHROPIC_API_KEY production
```

**Test:**
```bash
curl -N -X POST https://trainyouragent.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Say hello in 4 words."}]}'
```
Expected: a streaming response with text chunks. If you see `{"error":"..."}` the key is wrong or billing isn't set up.

---

## 3. Stripe (pricing -> checkout)

**What breaks without it:** the **/pricing** page CTAs ("Start Operators plan", "Founders Build") POST to `api/checkout.ts` which returns `stripe-not-configured` and the user sees an error toast instead of being redirected to Stripe.

**Signup:** https://dashboard.stripe.com/register

**Step A — Get the secret key:**
1. https://dashboard.stripe.com/apikeys
2. **Standard keys** -> reveal **Secret key** -> copy `sk_live_...` (or `sk_test_...` while testing)

**Step B — Create the two products + prices:**
1. https://dashboard.stripe.com/products -> **+ Add product**
2. Product 1:
   - Name: `Operators`
   - Pricing model: **Recurring**, $799 / month, USD
   - **Save product** -> copy the **Price ID** (`price_...`) shown under the price row -> this is `STRIPE_PRICE_OPERATORS`
3. Product 2:
   - Name: `Founders Build`
   - Pricing model: **One-time**, e.g. $4,900 USD (use whatever you sell at)
   - **Save product** -> copy the **Price ID** -> this is `STRIPE_PRICE_FOUNDERS_BUILD`

**Step C — Add to Vercel:**
```bash
echo "sk_live_xxxxxxxxx"  | vercel env add STRIPE_SECRET_KEY        production
echo "price_xxxxxxxxx"    | vercel env add STRIPE_PRICE_OPERATORS   production
echo "price_yyyyyyyyy"    | vercel env add STRIPE_PRICE_FOUNDERS_BUILD production
```

**Test:**
```bash
curl -X POST https://trainyouragent.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"plan":"operators","email":"you@yourdomain.com"}'
```
Expected: `{"url":"https://checkout.stripe.com/c/pay/cs_live_..."}`. Open the URL in a browser to confirm the Stripe-hosted page loads with the right price.

**Step D — Wire the webhook (`api/stripe-webhook.ts`):**

Required for: server-side `Purchase` event to Meta CAPI (so iOS/ITP/ad-block users still convert), Slack ping when a customer buys, beehiiv `customers` tag for the post-purchase sequence, and the Resend welcome email.

1. https://dashboard.stripe.com/webhooks -> **+ Add endpoint**
2. Endpoint URL: `https://trainyouragent.com/api/stripe-webhook`
3. Listen to: `checkout.session.completed` and `invoice.payment_succeeded`
4. After creating, copy **Signing secret** (`whsec_...`) -> this is `STRIPE_WEBHOOK_SECRET`
5. Add to Vercel:
   ```bash
   echo "whsec_xxxxxxxxx" | vercel env add STRIPE_WEBHOOK_SECRET production
   ```
6. Test from the Stripe dashboard: webhook page -> **Send test webhook** -> pick `checkout.session.completed`. Endpoint should return `200 {"ok":true,"type":"checkout.session.completed",...}`. If it returns `401 bad-signature`, the secret is wrong.


---

## 4. Slack webhook (instant lead pings)

**What breaks without it:** nothing breaks — but `api/lead.ts` skips the Slack notification branch and you only find out about leads via email. Strongly recommended; it makes leads feel real and lets you reply within minutes.

**Signup:** already have Slack? Skip. Otherwise https://slack.com/get-started

**Get the webhook URL:**
1. https://api.slack.com/apps -> **Create New App** -> **From scratch**
2. App name: `trainyouragent-leads`. Pick your workspace. **Create App**
3. Left nav -> **Incoming Webhooks** -> toggle **Activate Incoming Webhooks** to On
4. Scroll to bottom -> **Add New Webhook to Workspace** -> pick the channel (e.g. `#leads`) -> **Allow**
5. Copy the **Webhook URL** (`https://hooks.slack.com/services/T0.../B0.../xxxx`)

**Add to Vercel:**
```bash
echo "https://hooks.slack.com/services/T.../B.../xxxx" | vercel env add SLACK_WEBHOOK_URL production
```

**Test:**
```bash
curl -X POST https://hooks.slack.com/services/T.../B.../xxxx \
  -H "Content-Type: application/json" \
  -d '{"text":"Slack webhook smoke test from trainyouragent.com"}'
```
Expected: `ok` and a message in your channel. Then re-run the Resend lead test from section 1 — the same lead should also ping Slack.

---

## 5. beehiiv (newsletter)

**What breaks without it:** newsletter signup forms collect emails but they never make it into beehiiv, so subscribers don't get the welcome sequence or the weekly issue. (A separate subagent is wiring this up — these instructions are so you can finish if it stalls.)

**Signup:** https://www.beehiiv.com/sign-up

**Get the publication ID:**
1. Log into https://app.beehiiv.com
2. Settings (bottom-left gear) -> **Publication settings**
3. Scroll to **Publication ID** — copy the `pub_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` value -> this is `BEEHIIV_PUB_ID`

**Get the API key:**
1. Settings -> **Integrations** -> **API**
2. **+ New API Key** -> name it `trainyouragent-prod` -> **Create**
3. Copy the key (only shown once) -> this is `BEEHIIV_API_KEY`

> Requires beehiiv **Scale** plan or higher for API access. If you're on a lower tier, upgrade first or the calls will 403.

**Add to Vercel:**
```bash
echo "pub_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" | vercel env add BEEHIIV_PUB_ID production
echo "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" | vercel env add BEEHIIV_API_KEY production
```

**Test (direct against beehiiv API, no site code required):**
```bash
curl -X POST "https://api.beehiiv.com/v2/publications/$BEEHIIV_PUB_ID/subscriptions" \
  -H "Authorization: Bearer $BEEHIIV_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"smoke-test@yourdomain.com","reactivate_existing":false,"send_welcome_email":false,"utm_source":"smoketest"}'
```
Expected: `{"data":{"id":"sub_...","email":"smoke-test@..."}}`. Check the subscriber appears in **Subscribers** in the beehiiv dashboard.


---

## 6. Meta Pixel + Conversions API (Facebook/Instagram ads)

**What breaks without it:** Meta has no idea which ad clicks converted. After ~3 days the algorithm gives up trying to find converters and CPLs balloon 3-5x. The CAPI half is what recovers iOS17/ITP/ad-block losses (the browser pixel alone misses 30-50% of conversions in 2026).

**Signup:** https://business.facebook.com/ -> create a Business if you don't have one.

### Step A — Get the Pixel ID

1. https://business.facebook.com/events_manager2/
2. **Connect Data Sources** -> **Web** -> **Get started** -> name it `trainyouragent.com` -> **Create**
3. Pick **Meta Pixel and Conversions API** -> **Next**
4. Enter `https://trainyouragent.com` -> **Check**
5. Skip the platform integration. The Pixel ID is shown at the top of the Events Manager page (a 15-16 digit number) -> this is `META_PIXEL_ID`

### Step B — Get the CAPI Token

1. In Events Manager, with your pixel selected: **Settings** tab
2. Scroll to **Conversions API** -> **Generate access token**
3. Copy the token -> this is `META_CAPI_TOKEN` (treat it like a password — full event-write access to your pixel)

### Step C — Install the browser pixel in `index.html`

Open `index.html` and paste this block inside `<head>`, **right before `</head>`**:

```html
<!-- Meta Pixel -->
<script>
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'REPLACE_WITH_META_PIXEL_ID');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=REPLACE_WITH_META_PIXEL_ID&ev=PageView&noscript=1"/></noscript>
<!-- End Meta Pixel -->
```

Replace **both** copies of `REPLACE_WITH_META_PIXEL_ID` with the actual numeric ID (the pixel script can't read Vite env vars from raw HTML — it has to be hardcoded, or templated at build time).

### Step D — The CAPI server endpoint

Already shipped at **`api/meta-event.ts`** in this repo (see the file). It SHA-256-hashes PII, supports test event codes, and returns `events_received` from Meta.

To send a server-side event from anywhere on the site (e.g. inside `api/lead.ts` after a lead is captured):

```ts
await fetch("https://trainyouragent.com/api/meta-event", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    event_name: "Lead",
    event_id: `lead_${crypto.randomUUID()}`,   // dedup key — match in browser pixel call
    event_source_url: "https://trainyouragent.com/contact",
    user: { email: body.email, fbp: cookies.fbp, fbc: cookies.fbc },
    custom_data: { lead_source: body.source },
  }),
});
```

### Step E — Add to Vercel

```bash
echo "1234567890123456" | vercel env add META_PIXEL_ID production
echo "EAAxxxxxxxxxxxxx" | vercel env add META_CAPI_TOKEN production
# Optional — set while debugging in Events Manager -> Test events tab:
echo "TEST12345"        | vercel env add META_TEST_EVENT_CODE production
```

### Step F — Test

```bash
curl -X POST https://trainyouragent.com/api/meta-event \
  -H "Content-Type: application/json" \
  -d '{
    "event_name":"Lead",
    "event_id":"smoke_test_001",
    "event_source_url":"https://trainyouragent.com/test",
    "user":{"email":"smoke@trainyouragent.com"},
    "custom_data":{"lead_source":"curl_smoke_test"}
  }'
```
Expected: `{"ok":true,"events_received":1,"fbtrace_id":"...","event_id":"smoke_test_001"}`. Confirm in Events Manager -> **Test events** (if you set the test code) or **Overview** (if not — appears within ~10 min).


---

## 7. Google Analytics 4 + Google Tag Manager

**What breaks without it:** no traffic data, no funnel attribution, no audiences for Google Ads remarketing. You're flying blind on which pages convert.

**Strategy:** install **GTM** in the HTML. Inside GTM, add a GA4 Configuration tag. This way you never touch the HTML again to add new tags (Google Ads conversions, LinkedIn Insight, etc. all go through GTM).

### Step A — Create the GA4 property

1. https://analytics.google.com/ -> **Admin** (gear, bottom-left) -> **Create -> Property**
2. Name: `trainyouragent.com`. Reporting timezone + currency. **Next** -> **Create**
3. Pick **Web** -> URL `https://trainyouragent.com` -> stream name `Web` -> **Create stream**
4. Copy the **Measurement ID** (`G-XXXXXXXXXX`) -> this is `GA4_MEASUREMENT_ID`

### Step B — Create the GTM container

1. https://tagmanager.google.com/ -> **Create Account**
2. Account: `trainyouragent`. Container: `trainyouragent.com`. Target platform: **Web**. **Create**
3. Container ID is shown in the top bar: `GTM-XXXXXXX` — copy it.

### Step C — Install GTM in `index.html`

Paste **right after `<head>`**:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

And **right after `<body>`**:

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

Replace both `GTM-XXXXXXX` with your container ID.

### Step D — Wire GA4 inside GTM

1. In GTM dashboard -> **Tags** -> **New** -> **Tag Configuration** -> **Google Analytics: GA4 Configuration**
2. **Measurement ID** = `G-XXXXXXXXXX`
3. **Triggering** -> **All Pages**
4. **Save** -> **Submit** (top-right) -> **Publish**

### Step E — Add to Vercel

```bash
echo "G-XXXXXXXXXX" | vercel env add GA4_MEASUREMENT_ID production
```

(The site's React `NewsletterCapture`/`Index` components read `import.meta.env.VITE_GA4_MEASUREMENT_ID` if you want to push events to `dataLayer` from React. To expose it to the client, also add `VITE_GA4_MEASUREMENT_ID` with the same value.)

### Step F — Test

Open https://trainyouragent.com in a tab. In another tab:
```bash
# Real-time API requires a service account — easier verification:
open "https://analytics.google.com/analytics/web/#/p<your-property-id>/realtime/overview"
```
You should appear as 1 active user within 30 seconds.

For GTM specifically, install the **Tag Assistant** Chrome extension and click "Connect" -> visit the site. It shows every tag firing.


---

## 8. Google Ads conversion tracking

**What breaks without it:** if you run Google Ads (Search/Performance Max), the algorithm has no signal for which clicks converted, so smart bidding falls back to clicks-only optimization. Same death spiral as Meta without CAPI.

**Signup:** https://ads.google.com/

### Step A — Create the conversion action

1. https://ads.google.com -> **Goals** (left nav, hamburger -> Goals -> Conversions -> Summary)
2. **+ New conversion action** -> **Website**
3. Domain: `trainyouragent.com` -> **Scan**
4. **+ Add a conversion action manually**
5. Goal category: **Lead** (or Submit lead form). Conversion name: `Lead form submit`
6. Value: **Use the same value for each conversion** -> $200 (placeholder, swap to real LTV later)
7. Count: **One** (per click). Click-through window: 30 days. **Done** -> **Save and continue**

### Step B — Get the IDs

1. After saving, click the conversion you just made -> **Tag setup** -> **Use Google Tag Manager**
2. You'll see two values:
   - **Conversion ID** = `AW-XXXXXXXXX` -> this is `GADS_CONVERSION_ID` (use the part after `AW-`, or the whole string — the doc convention here is the full `AW-...` string)
   - **Conversion label** = `xxxxxxxxxxxxxxxxxx` -> this is `GADS_CONVERSION_LABEL`

### Step C — Wire it through GTM

1. In GTM -> **Tags** -> **New** -> **Google Ads Conversion Tracking**
2. Conversion ID: `AW-XXXXXXXXX` (without the `AW-` prefix in some GTM versions)
3. Conversion Label: paste it
4. Triggering -> **New trigger** -> **Custom Event** -> Event name `lead_submit` -> save
5. Save the tag, **Submit -> Publish** the container.

### Step D — Push the event from the lead form

In whichever React component handles the form success (e.g. `Contact.tsx`, `DemoRequest.tsx`), add after the successful `fetch('/api/lead')`:

```ts
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ event: "lead_submit", lead_source: "contact" });
```

GTM will see the `lead_submit` event and fire both the GA4 event AND the Google Ads conversion.

### Step E — Add to Vercel

```bash
echo "AW-XXXXXXXXX"             | vercel env add GADS_CONVERSION_ID    production
echo "xxxxxxxxxxxxxxxxxx"        | vercel env add GADS_CONVERSION_LABEL production
```

### Step F — Test

1. Install the **Tag Assistant Companion** Chrome extension
2. Visit https://trainyouragent.com -> open the chat / contact form -> submit a fake lead
3. Tag Assistant should show **Google Ads Conversion Tracking** firing with status `OK`
4. In Google Ads -> **Goals -> Conversions -> Summary**, the conversion should show "Recording conversions" within ~24 hours.

---

## 9. Cal.com webhook (booked-call notifications + Schedule retargeting)

**What breaks without it:** booked calls don't ping Slack instantly, no internal email, and Meta gets no `Schedule` conversion event (which is the most valuable retargeting trigger you have — booked-but-no-showed audiences re-convert at 4-6x cold).

**Signup:** https://cal.com/signup (free tier is fine)

### Step A — Pick your webhook secret

Generate any high-entropy string:
```bash
openssl rand -hex 32
```
Copy the output — that's `CAL_WEBHOOK_SECRET`.

### Step B — Create the webhook in Cal.com

1. https://app.cal.com -> **Settings** -> **Developer** -> **Webhooks** -> **+ New**
2. **Subscriber URL:** `https://trainyouragent.com/api/cal-webhook`
3. **Event Triggers:** check `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`
4. **Secret:** paste the value you generated above
5. **Payload Template:** leave default (full payload)
6. **Active** = ON -> **Create webhook**

### Step C — Add to Vercel

```bash
echo "<the openssl-generated value>" | vercel env add CAL_WEBHOOK_SECRET production
```

The endpoint at `api/cal-webhook.ts` (already shipped in this repo) verifies the HMAC signature, then fans out to Slack, Resend, and the Meta CAPI `Schedule` event.

### Step D — Test

Best test: book yourself a real call via your Cal.com link. Within ~5 sec you should see:
- Slack message in `#leads`
- Email in `LEAD_NOTIFY_TO`
- Meta Events Manager shows a `Schedule` event

To test the endpoint in isolation (without a real Cal booking), this curl crafts a valid HMAC:

```bash
SECRET="<your CAL_WEBHOOK_SECRET>"
BODY='{"triggerEvent":"BOOKING_CREATED","payload":{"uid":"smoke1","startTime":"2026-05-20T15:00:00Z","type":"30 min intro","attendees":[{"name":"Smoke Test","email":"smoke@trainyouragent.com"}]}}'
SIG=$(printf "%s" "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -hex | awk '{print $2}')
curl -X POST https://trainyouragent.com/api/cal-webhook \
  -H "Content-Type: application/json" \
  -H "X-Cal-Signature-256: $SIG" \
  -d "$BODY"
```
Expected: `{"ok":true,"triggerEvent":"BOOKING_CREATED"}`. A bad signature returns `{"ok":false,"error":"bad-signature"}` (401).


---

## 10. Supabase (lead storage for retargeting + nurture)

**What breaks without it:** nothing on day one — leads still email and Slack-ping. But you have **no database** of past leads, so you can't (a) build a custom audience for retargeting later, (b) run a nurture sequence, (c) deduplicate, or (d) attribute revenue back to the original lead source. You'll regret skipping it in month two.

> Why Supabase over Vercel Postgres: free tier is generous (500MB, 50k MAU), signup takes 60 sec, and you get auth + storage + realtime in the same project for free. Vercel Postgres is fine but charges from day one and is just Postgres.

**Signup:** https://supabase.com/dashboard/sign-up

### Step A — Create the project

1. https://supabase.com/dashboard -> **New project**
2. Name: `trainyouragent`. Region: closest to your Vercel region (likely **us-east-1**). DB password: generate one and save it. **Create new project**
3. Wait ~90 sec for provisioning.

### Step B — Get the keys

1. Project dashboard -> **Settings** (gear, bottom-left) -> **API**
2. Three values to copy:
   - **Project URL** (`https://xxxxxxxxx.supabase.co`) -> `SUPABASE_URL`
   - **anon / public key** (long JWT) -> `SUPABASE_ANON_KEY` (safe to expose to browser)
   - **service_role / secret key** (long JWT) -> `SUPABASE_SERVICE_ROLE_KEY` (server-side only, **never** expose to browser — bypasses Row-Level Security)

### Step C — Create the leads table

In the dashboard -> **SQL Editor** -> **New query** -> paste:

```sql
create table if not exists leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  email        text not null,
  name         text,
  company      text,
  phone        text,
  source       text not null,
  path         text,
  payload      jsonb,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  fbp          text,
  fbc          text,
  ip           text,
  user_agent   text
);
create index if not exists leads_email_idx on leads (lower(email));
create index if not exists leads_source_idx on leads (source, created_at desc);

-- RLS: lock the table; only service_role writes via api/lead.ts
alter table leads enable row level security;
```

Click **Run**. The table appears in **Table editor**.

### Step D — Add to Vercel

```bash
echo "https://xxxxxxxxx.supabase.co" | vercel env add SUPABASE_URL              production
echo "eyJhbGciOi..."                  | vercel env add SUPABASE_ANON_KEY         production
echo "eyJhbGciOi..."                  | vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

### Step E — Patch `api/lead.ts` to write through

Add this snippet to `api/lead.ts` inside `handler`, right before the `Promise.allSettled(tasks)` call:

```ts
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  tasks.push(
    fetch(`${process.env.SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email: body.email,
        name: body.name,
        company: body.company,
        phone: body.phone,
        source: body.source,
        path: body.path,
        payload: body.payload || null,
        ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
        user_agent: req.headers.get("user-agent") || null,
      }),
    })
  );
}
```

### Step F — Test

```bash
curl -X POST https://trainyouragent.com/api/lead \
  -H "Content-Type: application/json" \
  -d '{"email":"supabase-smoke@trainyouragent.com","name":"DB Test","source":"newsletter","path":"/test"}'
```

Then confirm the row landed:
```bash
curl "$SUPABASE_URL/rest/v1/leads?select=email,source,created_at&order=created_at.desc&limit=1" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY"
```
Expected: `[{"email":"supabase-smoke@trainyouragent.com","source":"newsletter","created_at":"..."}]`.


---

## ONCE EVERY KEY IS IN VERCEL, RUN THIS

### 1. Pull env locally to confirm everything loaded

```bash
cd ~/code/trainyouragent     # or wherever the repo lives
vercel link                  # one-time, picks the project
vercel env pull .env.local   # downloads all env vars
grep -c "=" .env.local       # count keys — should be 18+ (across all 10 integrations)
```

### 2. Redeploy production

```bash
vercel --prod
```

Wait for the deploy to finish (~1-2 min). Note the deploy URL it prints.

### 3. Smoke test every endpoint against the live URL

Save this as `smoke.sh` in the repo root and run it after every deploy:

```bash
#!/usr/bin/env bash
set -e
SITE="https://trainyouragent.com"
EMAIL="smoke-$(date +%s)@trainyouragent.com"

echo "[1/6] Lead form (Resend + Slack + Supabase)..."
curl -fsS -X POST "$SITE/api/lead" -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"name\":\"Smoke\",\"source\":\"newsletter\",\"path\":\"/smoke\"}" \
  | tee /dev/stderr | grep -q '"ok":true'

echo "[2/6] Anthropic chat (streaming)..."
curl -fsS -X POST "$SITE/api/chat" -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"reply with the word OK"}]}' | head -c 200
echo

echo "[3/6] Stripe checkout session..."
curl -fsS -X POST "$SITE/api/checkout" -H "Content-Type: application/json" \
  -d "{\"plan\":\"operators\",\"email\":\"$EMAIL\"}" \
  | tee /dev/stderr | grep -q 'checkout.stripe.com'

echo "[4/6] Meta CAPI..."
curl -fsS -X POST "$SITE/api/meta-event" -H "Content-Type: application/json" \
  -d "{\"event_name\":\"Lead\",\"event_id\":\"smoke_$(date +%s)\",\"event_source_url\":\"$SITE/smoke\",\"user\":{\"email\":\"$EMAIL\"}}" \
  | tee /dev/stderr | grep -q '"ok":true'

echo "[5/6] Cal webhook (HMAC)..."
SECRET="$CAL_WEBHOOK_SECRET"
BODY='{"triggerEvent":"BOOKING_CREATED","payload":{"uid":"smoke","startTime":"2026-05-20T15:00:00Z","type":"30 min","attendees":[{"name":"Smoke","email":"'"$EMAIL"'"}]}}'
SIG=$(printf "%s" "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -hex | awk '{print $2}')
curl -fsS -X POST "$SITE/api/cal-webhook" \
  -H "Content-Type: application/json" -H "X-Cal-Signature-256: $SIG" -d "$BODY" \
  | tee /dev/stderr | grep -q '"ok":true'

echo "[6/6] Supabase row landed..."
curl -fsS "$SUPABASE_URL/rest/v1/leads?email=eq.$EMAIL&select=email,source,created_at" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  | tee /dev/stderr | grep -q "$EMAIL"

echo
echo "ALL CHECKS PASSED."
```

```bash
chmod +x smoke.sh
source .env.local && ./smoke.sh
```

### 4. Verify pixel + GTM in browser

1. Open https://trainyouragent.com in Chrome.
2. Install **Meta Pixel Helper** + **Tag Assistant Companion** extensions (one-time).
3. Refresh page. Both extensions should show green:
   - Meta Pixel Helper: 1 pixel found (your ID), `PageView` event firing
   - Tag Assistant: GTM container loaded, GA4 Configuration tag fired
4. Submit a fake lead via the contact form. Both extensions should show one additional event each (`Lead` for Meta, `lead_submit` for GTM).

### 5. Final check — Vercel function logs

```bash
vercel logs --prod --since 10m | grep -E "(api/lead|api/chat|api/checkout|api/meta-event|api/cal-webhook)"
```
You should see `200 OK` for every endpoint you just tested. Any `500` here = redeploy didn't pick up an env var, or a key is wrong.

---

## TROUBLESHOOTING TABLE

| Symptom | Probable cause | Fix |
|---|---|---|
| `/api/lead` returns 200 but no email | `RESEND_API_KEY` missing OR sending domain not verified in Resend | Re-check Resend Domains tab, redeploy |
| `/api/chat` returns 500 with `error: ...credit_balance...` | Anthropic billing not set up | Add card at console.anthropic.com/settings/billing |
| `/api/checkout` returns `unknown-plan` | `STRIPE_PRICE_OPERATORS` missing or has typo | Re-paste the `price_...` ID, redeploy |
| Stripe Checkout opens but shows wrong price | Pasted product ID (`prod_...`) instead of price ID (`price_...`) | Use the price row's ID, not the product's |
| Meta CAPI returns `(#100) Invalid parameter` | `META_PIXEL_ID` is wrong (used the dataset ID instead) | Pixel ID is the 15-16 digit number on the Events Manager overview |
| Cal webhook returns 401 `bad-signature` | Secret in Cal.com dashboard differs from `CAL_WEBHOOK_SECRET` env | Re-paste the same string in both places |
| Supabase insert returns `new row violates row-level security` | Used `SUPABASE_ANON_KEY` instead of service role | Use `SUPABASE_SERVICE_ROLE_KEY` for server inserts |
| GA4 shows zero realtime users | GTM container not published, or wrong `G-XXXX` ID | Hit **Submit -> Publish** in GTM, double-check ID |
| Vercel env var added but endpoint still 500s | Forgot to redeploy | `vercel --prod` (env vars don't auto-trigger deploys) |

---

## REPO MAP — WHICH FILE READS WHICH ENV VAR

| Env var | Read in |
|---|---|
| `ANTHROPIC_API_KEY` | `api/chat.ts` |
| `RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM`, `SLACK_WEBHOOK_URL` | `api/lead.ts`, `api/cal-webhook.ts`, `api/stripe-webhook.ts`, `api/booking-abandoned.ts` |
| `STRIPE_SECRET_KEY`, `STRIPE_PRICE_OPERATORS`, `STRIPE_PRICE_FOUNDERS_BUILD` | `api/checkout.ts` |
| `STRIPE_WEBHOOK_SECRET` | `api/stripe-webhook.ts` |
| `BEEHIIV_PUB_ID`, `BEEHIIV_API_KEY` | `api/lead.ts`, `api/stripe-webhook.ts`, `api/booking-abandoned.ts` |
| `META_PIXEL_ID`, `META_CAPI_TOKEN`, `META_TEST_EVENT_CODE` | `api/meta-event.ts`, `api/cal-webhook.ts`, `api/stripe-webhook.ts`, `index.html` (pixel ID hardcoded) |
| `GA4_MEASUREMENT_ID` | GTM container (referenced from `index.html`) |
| `GADS_CONVERSION_ID`, `GADS_CONVERSION_LABEL` | GTM container |
| `CAL_WEBHOOK_SECRET` | `api/cal-webhook.ts` |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | `api/lead.ts` (after Step E patch) |

---

**End of doc.** Total wire-up time if you have all the signups already: ~70 min. From cold start: ~2 hrs.
