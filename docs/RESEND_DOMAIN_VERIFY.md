# Resend Domain Verification — Required for Nurture Drip + Welcome Emails

## Symptom

`/api/nurture-enqueue` returns 502 for any email that isn't `trainyouragent@gmail.com`:

```
batch 422: "Invalid `to` field. Please use our testing email address instead..."
single 403: "You can only send testing emails to your own email address"
```

Reason: `RESEND_FROM_EMAIL` defaults to `onboarding@resend.dev` (Resend's sandbox sender). Sandbox can only send to the verified test address. Every real prospect on the nurture drip drops silently.

## Fix (4 minutes, no code change required)

### 1. Add the domain in Resend
- Open https://resend.com/domains
- Click **Add Domain** → enter `trainyouragent.com` → region US-East-1

### 2. Copy the DNS records Resend generates (3 records)
Resend will show:
- **TXT** for `resend._domainkey.trainyouragent.com` (DKIM)
- **TXT** for `send.trainyouragent.com` (SPF: `v=spf1 include:amazonses.com ~all`)
- **MX** for `send.trainyouragent.com` (priority 10, value `feedback-smtp.us-east-1.amazonses.com`)

### 3. Add the records at your domain registrar
- Wherever `trainyouragent.com` is registered (likely Vercel or Cloudflare or Namecheap)
- Paste each record exactly as Resend showed it
- Allow up to 30 min for propagation (usually under 5 min)

### 4. Verify in Resend
- Back at https://resend.com/domains → click the domain row → **Verify**
- All 3 records should turn green

### 5. Swap the Vercel env var
- https://vercel.com/builderofages/trainyouragent/settings/environment-variables
- Edit `RESEND_FROM_EMAIL` → set to `alexander@trainyouragent.com`
- (If the var doesn't exist, add it. Scope: Production + Preview + Development)
- Redeploy

### 6. Verify with curl
```bash
curl -X POST -H 'content-type: application/json' \
  -d '{"email":"some_real_prospect@gmail.com","source":"home","niche":"hvac","name":"Test"}' \
  https://www.trainyouragent.com/api/nurture-enqueue
```

Expected: `{"ok":true,"scheduled":5,"errors":[]}`

## Until this is done

- `/api/lead` still captures emails to Supabase (lead store works fine)
- `/api/intake` still sends to alexander@trainyouragent.com (works because that's the verified address)
- Nurture drip silently fails for every prospect that isn't your own address
- Welcome email after Stripe checkout silently fails for the same reason
- Churn-save + dunning emails silently fail for the same reason

**This is the single biggest infra gap blocking the email-as-revenue-machine flywheel.**

The DNS records I helped you generate weeks ago were for `cnnct.ai` before we deleted it. `trainyouragent.com` was added in Resend at v133 but the DNS records were never propagated. Confirm by opening https://resend.com/domains and looking at the `trainyouragent.com` row — if it shows "Not Verified" in red, this is the issue.
