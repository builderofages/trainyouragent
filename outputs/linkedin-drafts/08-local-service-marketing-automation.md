# 08 — Local Service Marketing Automation

**Status:** Draft for Alexander review · Cornerstone: `/capabilities/local-service-marketing-automation`

---

A local HVAC company can outrank a $50M-revenue national chain on "HVAC repair [their city]" for less than $1,500/mo in marketing automation, run by AI.

Here's the playbook.

**Google Business Profile is the moat.** Not your website. The local-pack carousel above the organic results is where the calls come from. The signals that move you in the local pack are: review velocity, photo upload velocity, Q&A density, and post recency. All four can be automated.

**The agent stack we ship for local marketing:**

1. **Review-request agent.** Twilio-triggered SMS to every customer 30 minutes after job completion (we pull the trigger from your ServiceTitan/Jobber/Housecall Pro webhook). Template is personalized with the tech's name and the service performed. Click-through to GBP review: ~38% vs ~6% for generic "please review us" texts.

2. **Review-response agent.** Anthropic Claude monitors your GBP for new reviews via the Google Business Profile API. For 4–5 stars: drafts a personalized thank-you mentioning the specific service. For 1–3 stars: drafts an empathetic response, flags you in Slack for human approval before posting. Response-rate target: 100% of reviews within 24 hours.

3. **GBP post agent.** Auto-generates 1 weekly post — service-of-the-week, customer story (with consent), seasonal tip. Pulls images from your media library, writes copy in your brand voice. 52 posts/year compounds in the GBP algorithm.

4. **GBP Q&A seeder.** First 30 days, agent seeds 20 common questions ("Do you do emergency HVAC repair?") with branded answers, mirroring what your sales team would say on the phone.

5. **Citation builder.** Every 30 days, agent crawls 40 directory sites (Yelp, Angi, BBB, Nextdoor, etc.) to verify your NAP (name/address/phone) is consistent. Inconsistent listings get flagged for human cleanup.

6. **Local SEO landing-page generator.** Per-zip-code landing pages auto-generated from your service menu + local trust signals (reviews from that zip, photos from jobs in that zip). 30 zips × 4 services = 120 pages, all internally linked, no thin-content penalty risk because the content is unique per zip.

Real numbers from an HVAC client in Phoenix metro:

- GBP review count: 84 → 312 in 6 months
- GBP map-pack appearances (impressions): 18K/mo → 71K/mo
- Inbound calls attributed to GBP: 47/mo → 184/mo
- Cost to operate: $899/mo (build was $8,500)

The thing every local marketing vendor gets wrong: they treat content as the lever. It's not. The lever is signal velocity to GBP. Content is downstream.

Full playbook with the GBP API integration patterns + the review-response prompt set: https://trainyouragent.com/capabilities/local-service-marketing-automation

— Alexander
