# TrainYourAgent

> Production AI voice + chat agents for service businesses. Tampa-based. Built in public.

[![Site](https://img.shields.io/badge/site-trainyouragent.com-042C53)](https://www.trainyouragent.com)
[![Live demo](https://img.shields.io/badge/live%20voice%20demo-talk%20now-185FA5)](https://www.trainyouragent.com/voice-demo)
[![Public metrics](https://img.shields.io/badge/metrics-live-10B981)](https://www.trainyouragent.com/metrics)
[![Status](https://img.shields.io/badge/status-operational-10B981)](https://www.trainyouragent.com/uptime)

---

## What this is

This is the source of trainyouragent.com — the website + every API endpoint + the chat/voice agents + the playbook system + the admin dashboard. We ship it in public.

If you're a customer, [book a build call](https://www.trainyouragent.com/book).
If you're a developer, the rest of this README is for you.

## What's in here

| Layer | Stack |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Routing | react-router-dom v6 |
| Animation | framer-motion (subtle, respects prefers-reduced-motion) |
| Hosting | Vercel (edge + Node serverless) |
| Database | Supabase (Postgres + RLS) |
| AI | Multi-provider fallback chain: Anthropic Claude -> Groq Llama 3.3 70B -> Google Gemini 2.5 Flash |
| Voice agent | Browser Web Speech API + Groq Llama (zero ongoing cost) |
| Email | Resend |
| Booking | Cal.com (webhook-driven) |
| Payments | Stripe (Checkout + webhooks) |
| Analytics | Meta Pixel CAPI + GA4 (server-side dedup via shared event_id) |

## Site map

- `/` — Home with pathway personalization (set lane + niche, the site re-skins)
- `/pricing` — Three plans, Hormozi-method offer stack, real risk-reversal
- `/voice-demo` — Live voice agent (talk in your browser, no signup)
- `/playbooks/{niche}` — 15 deep operator playbooks for SMB verticals (HVAC, dental, law-firm, etc.) with real cited industry data + embedded chat demo per niche
- `/local/{city}/{vertical}` — 120 city x vertical SEO pages with LocalBusiness JSON-LD
- `/tools/*` — 9 free working tools (cost estimator, ROI calculator, prompt critic, scenario generator, latency simulator, prompt library, model selector, automation ROI, vendor matrix)
- `/blog` — 70 long-form posts
- `/docs` — Knowledge base
- `/api-docs` — Public API documentation
- `/metrics` — Real built-in-public metrics (no synthetic baselines)
- `/founder-log` — Daily ship journal
- `/glossary` — 46 AI terms defined
- `/trust-center` — Security, compliance, accessibility, uptime
- `/admin` — Token-gated dashboard

## Architecture decisions

**Multi-provider LLM fallback.** Every chat call tries Anthropic first, falls through to Groq, then Gemini. Header `x-llm-provider:` tells the client who answered. Reason: demo can't go dark even at $0 Anthropic credits.

**Pathway personalization.** Visitor picks lane (SMB / startup / agency) and niche (HVAC / dental / etc.) at `/start`. We store in localStorage and re-render Home, Pricing, Book, and Chat with niche-specific copy + stats + CTAs.

**Server-side prompt engineering.** Every chat mode (`assistant`, `simulator`, `critic`, `objections`, `sop`, `seo`, `voice-receptionist`) has its system prompt hardcoded server-side. Client sends `mode`, not the prompt itself. This blocks prompt-injection attacks that would let a visitor burn our LLM budget on arbitrary tasks.

**Honest metrics.** `/api/public-metrics` returns real numbers from the lead store. Zero synthetic baselines. If the number is small, it's small.

**Built-in public.** Every commit is live. Every metric is live. Every roadmap item is voteable. The point isn't to hide the work — it's to be the operator visitors believe ships.

## Running locally

```bash
git clone https://github.com/builderofages/trainyouragent.git
cd trainyouragent
npm install --legacy-peer-deps
cp .env.example .env.local   # then fill in keys (see below)
npm run dev
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

**Required for the site to render:**
- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key

**Required for AI demos to respond:**
- `ANTHROPIC_API_KEY` — optional; if unset, chain falls through to Groq
- `GROQ_API_KEY` — free tier, get one at console.groq.com
- `GEMINI_API_KEY` — free tier, optional last fallback

**Server-side secrets (never bundled to client):**
- `SUPABASE_SERVICE_KEY` — service role, server-only
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*`
- `RESEND_API_KEY`
- `CAL_WEBHOOK_SECRET`
- `ADMIN_TOKEN` — required for /admin and /api/admin/*
- `STRIPE_SETUP_INIT_TOKEN` — required to run /api/stripe-setup

## API

See `/api-docs` on the live site or `api/` directory for source.

Public endpoints:
- `POST /api/lead` — capture form submissions (allowlisted sources)
- `POST /api/event` — track visitor events (allowlisted types)
- `POST /api/chat` — chat completions with multi-provider fallback
- `GET /api/public-metrics` — aggregated metrics, no PII
- `GET /api/recent-activity` — last 10 anonymized events
- `GET /api/og?title=...` — dynamic OG image generation
- `GET /api/sitemap.xml` — 564+ URL sitemap

Token-gated:
- `GET /api/admin/{metrics,leads,funnel}` — admin dashboard data
- `GET /api/nurture-tick?token=...` — drip campaign cron

Webhooks (signature-verified):
- `POST /api/cal-webhook` — Cal.com booking events
- `POST /api/stripe-webhook` — Stripe subscription/checkout events

## Security

See [SECURITY.md](./SECURITY.md) for the vulnerability disclosure policy and [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) for the most recent audit.

Highlights:
- All third-party secrets are env-var-only (verified — zero in source or git history)
- Rate limits on every public endpoint
- CORS allowlist (no `*`)
- Webhook signatures verified (Cal HMAC, Stripe official scheme)
- Supabase RLS enabled on all tables, anon role denied
- CSP, HSTS, X-Frame-Options DENY, full Permissions-Policy
- Admin token gated with constant-time comparison

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). PRs welcome from anyone running an AI agent project for SMBs.

## License

[Source-available — see LICENSE](./LICENSE). The code is for reference and learning. Forking the brand, the cited research, the playbook content, or the founder bio is not permitted.

## Who built this

Alexander Mills · Tampa Bay, FL · [LinkedIn](https://www.linkedin.com/in/agentmills/) · alexander@trainyouragent.com
