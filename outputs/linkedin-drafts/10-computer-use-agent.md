# 10 — Computer-Use Agent (Browser & Internal Tools Automation)

**Status:** Draft for Alexander review · Cornerstone: `/capabilities/computer-use-agent`

---

Anthropic's computer-use API is the most under-priced piece of automation infrastructure in 2026.

For 50¢ in API cost you can have an agent log into a legacy vendor portal that has no API, navigate three layers of menus, fill 14 form fields with the right data, and download the resulting PDF — every single business day.

A real example we shipped last month for a logistics broker.

**The job:** every morning at 6am, log into the shipper's freight portal (no API, browser-only, 2007-era UI), pull the day's available loads matching their lane preferences, paste the load list into their internal Slack, then log into TQL Carrier Hub and post matching truck capacity to those loads.

**Before:** 90 minutes of dispatcher time. Every morning. Inconsistent because the dispatcher would skip steps when running late.

**After:** computer-use agent. 4 minutes. Runs at 6am sharp, every day. Slack message goes out by 6:08am. Dispatcher reviews at her desk by 7am.

**Stack:**

- **Anthropic claude-sonnet-4-5** with the computer-use tool
- **Browserbase** as the headless browser host (their managed Playwright wraps the computer-use harness — way faster than self-hosting)
- **Vault** for the portal credentials (rotated weekly)
- **Cron** on Modal.com (triggers at 6am ET)
- **Slack webhook** for the output post
- **Sentry** for failure alerts (if the portal UI changes, the agent fails open with a screenshot to dispatch)

Cost economics:

- Build: $4,500
- LLM cost per run: ~$0.42 (computer-use is heavy on tokens but you only need it for the hard navigation; we use Haiku for the easier parsing steps)
- Browserbase: ~$0.08 per run (3-minute session)
- All-in monthly: ~$15/mo in passthrough + $299/mo retainer
- ROI: 90 min × $35/hr × 22 business days = $1,155 of dispatcher time saved per month
- Payback: 1.2 months

The other places computer-use eats: insurance claims submissions, healthcare prior-authorization forms, government filing portals (state DOL, IRS e-services, USPS Business), real-estate MLS data entry, court e-filing systems, ServiceNow ticketing for IT teams, anything where "we'd love an API but they don't have one."

The honest caveats: (1) UI drift breaks the agent — we run a daily smoke test and a fallback screenshot path so when the portal updates a button label, we know within hours not weeks. (2) Some portals have aggressive bot detection (Cloudflare Turnstile, etc) — we negotiate human-verification handoff in the auth path. (3) Auditability is non-trivial — every action is logged with a screenshot, retained 90 days.

Where teams should NOT use computer-use: anything an API can do. APIs are 10× cheaper, 100× more reliable, and don't break on UI changes. Computer-use is for the long tail where no API exists or vendor pricing for API access is extortionate.

Full playbook with the Browserbase + Modal architecture + the UI-drift smoke-test suite: https://trainyouragent.com/capabilities/computer-use-agent

— Alexander
