# Stripe setup — TrainYourAgent

One-time wiring to take real money via Stripe Checkout.

## Steps

1. **Get your Stripe secret key**
   Go to https://dashboard.stripe.com/apikeys and copy the secret key (starts with `sk_live_...` for production).

2. **Add the key to Vercel production env**
   ```
   vercel env add STRIPE_SECRET_KEY production
   # paste your sk_live_... key
   ```
   Then redeploy: `vercel --prod`

3. **Seed the products + prices**
   ```
   curl -X POST "https://www.trainyouragent.com/api/stripe-setup?init_token=tya-init-2026"
   ```
   The endpoint is idempotent — safe to re-run. It returns three `priceId`s (Starter / Operator / Scale).

4. **Wire the price IDs as env vars**
   ```
   vercel env add STRIPE_PRICE_STARTER  production    # price_xxx from step 3
   vercel env add STRIPE_PRICE_OPERATOR production    # price_xxx from step 3
   vercel env add STRIPE_PRICE_SCALE    production    # price_xxx from step 3
   ```

5. **Add the webhook secret**
   ```
   vercel env add STRIPE_WEBHOOK_SECRET production
   # paste the whsec_... value from the webhook config page
   ```

6. **Configure the Stripe webhook**
   In Stripe → Developers → Webhooks → Add endpoint:
   - URL: `https://www.trainyouragent.com/api/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`

7. **Redeploy**
   ```
   vercel --prod
   ```

## Verifying

After step 7, hit:
```
curl -s -X POST -H 'content-type: application/json' \
  -d '{"plan":"starter","email":"test@example.com"}' \
  https://www.trainyouragent.com/api/checkout
```
You should get back `{"url":"https://checkout.stripe.com/c/pay/..."}`.

## Plans seeded

| Slug                | Name                       | Price       | Description                                                   |
|---------------------|----------------------------|-------------|---------------------------------------------------------------|
| starter             | Starter                    | $1,500/mo   | 1-agent build, 1 channel                                      |
| operator            | Operator                   | $5,000/mo   | 3-agent builds, multi-channel, weekly tuning                  |
| scale               | Scale                      | $15,000/mo  | Unlimited builds, white-glove ops, dedicated Slack channel    |
| saas-agent-builder  | Self-Serve Agent Builder   | $99/mo      | Unlimited agents, embeddable, brand-your-own — SaaS tier      |

To change pricing or copy, edit `api/stripe-setup.ts`'s `PLANS` constant — the endpoint will create new prices on next run (old ones stay active in Stripe until you archive them manually).

## v71: Adding the SaaS Agent Builder $99/mo price

The `saas-agent-builder` plan needs its own Stripe price. One command via the Stripe CLI:

```
stripe prices create \
  --currency=usd \
  --unit-amount=9900 \
  --recurring="interval=month" \
  --product-data="name=Self-Serve Agent Builder" \
  --product-data="description=Unlimited AI agents, embeddable widget, custom branding."
```

Copy the returned `price_xxx` and wire it as an env var:

```
vercel env add STRIPE_PRICE_SAAS_AGENT_BUILDER production
# paste the price_xxx value
vercel --prod
```

Verify:
```
curl -s -X POST -H 'content-type: application/json' \
  -d '{"plan":"saas-agent-builder","email":"test@example.com"}' \
  https://www.trainyouragent.com/api/checkout
```
Expect `{"url":"https://checkout.stripe.com/c/pay/..."}`. If `STRIPE_PRICE_SAAS_AGENT_BUILDER` is missing, the endpoint returns `{"ok":false,"error":"plan-not-configured"}` and the SaaS Agent Builder page gracefully falls back to capturing the visitor as a free-trial lead instead.
