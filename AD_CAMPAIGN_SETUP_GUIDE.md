# Complete Ad Campaign Setup Guide

This guide covers everything you need to configure in external tools to launch your ad campaigns.

## ✅ COMPLETED (Code Implementation)

- [x] 8 industry-specific Open Graph images generated (1200x630px)
- [x] All OG images saved to `public/og-images/`
- [x] SEO metadata configured to use industry-specific OG images
- [x] GTM dataLayer push events in tracking.ts
- [x] All conversion tracking code ready

## 🔧 REQUIRED EXTERNAL CONFIGURATIONS

---

## PART 1: Google Tag Manager Setup (30 minutes)

### Step 1: Get Your GTM Container ID

1. Go to [tagmanager.google.com](https://tagmanager.google.com)
2. Create account: "TrainYourAgent"
3. Create container: "TrainYourAgent Production" (Web)
4. Copy your Container ID (format: `GTM-XXXXXXX`)

### Step 2: Update index.html

**File:** `index.html`

**Line 9:** Replace `GTM-XXXXXXX` with your actual Container ID
**Line 269:** Replace `GTM-XXXXXXX` in noscript tag with your actual Container ID

```html
<!-- Line 9 -->
gtm_id: 'GTM-YOUR-ACTUAL-ID',

<!-- Line 269 -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-YOUR-ACTUAL-ID"
```

### Step 3: Create Data Layer Variables in GTM

In GTM Dashboard → Variables → User-Defined Variables → New

Create these 15 variables (all type: Data Layer Variable):

1. **dlv - industry** → Variable Name: `industry`
2. **dlv - utm_source** → Variable Name: `utm_source`
3. **dlv - utm_medium** → Variable Name: `utm_medium`
4. **dlv - utm_campaign** → Variable Name: `utm_campaign`
5. **dlv - utm_content** → Variable Name: `utm_content`
6. **dlv - utm_term** → Variable Name: `utm_term`
7. **dlv - budget_range** → Variable Name: `budget_range`
8. **dlv - call_volume** → Variable Name: `call_volume`
9. **dlv - monthly_roi** → Variable Name: `monthly_roi`
10. **dlv - value** → Variable Name: `value`
11. **dlv - component** → Variable Name: `component`
12. **dlv - step** → Variable Name: `step`
13. **dlv - page_path** → Variable Name: `page_path`
14. **dlv - timestamp** → Variable Name: `timestamp`
15. **dlv - session_duration** → Variable Name: `session_duration_seconds`

### Step 4: Create Custom Event Triggers

In GTM Dashboard → Triggers → New (Custom Event type)

1. **Strategy Session Lead Submitted** → Event: `strategy_session_lead_submitted`
2. **Lead Gate Opened** → Event: `lead_gate_opened`
3. **Lead Gate Abandoned** → Event: `lead_gate_abandoned`
4. **ROI Calculator Completed** → Event: `roi_calculator_completed`
5. **ROI PDF Downloaded** → Event: `roi_pdf_downloaded`
6. **Voice Demo Lead Submitted** → Event: `voice_demo_lead_submitted`
7. **Voice Demo Completed** → Event: `voice_demo_completed`
8. **Scroll Depth** → Event: `scroll_depth`
9. **Time on Page** → Event: `time_on_page_threshold`
10. **CTA Clicked** → Event: `cta_clicked`
11. **Form Submission** → Event: `form_submission`
12. **Booking Page Opened** → Event: `booking_page_opened`

### Step 5: Create GA4 Configuration Tag

**Tag Name:** GA4 - Configuration
- **Tag Type:** Google Analytics: GA4 Configuration
- **Measurement ID:** YOUR_GA4_MEASUREMENT_ID
- **User Properties:**
  - `industry` → `{{dlv - industry}}`
  - `utm_source` → `{{dlv - utm_source}}`
  - `utm_campaign` → `{{dlv - utm_campaign}}`
- **Triggering:** All Pages

### Step 6: Create 12 GA4 Event Tags

**Format:** Tag Type = GA4 Event, Configuration Tag = "GA4 - Configuration"

1. **Strategy Session Lead Submitted**
   - Event Name: `strategy_session_lead_submitted`
   - Parameters: industry, budget, call_volume, value (500), currency (USD)
   - Trigger: Strategy Session Lead Submitted

2. **Lead Gate Opened**
   - Event Name: `lead_gate_opened`
   - Parameters: component, has_industry_preselect, industry
   - Trigger: Lead Gate Opened

3. **Lead Gate Abandoned**
   - Event Name: `lead_gate_abandoned`
   - Parameters: step, time_spent_seconds, industry
   - Trigger: Lead Gate Abandoned

4. **ROI Calculator Completed**
   - Event Name: `roi_calculator_completed`
   - Parameters: industry, monthly_roi, annual_roi, value (monthly_roi), currency
   - Trigger: ROI Calculator Completed

5. **ROI PDF Downloaded**
   - Event Name: `roi_pdf_downloaded`
   - Parameters: industry, monthly_roi, value (50), currency
   - Trigger: ROI PDF Downloaded

6. **Voice Demo Lead Submitted**
   - Event Name: `voice_demo_lead_submitted`
   - Parameters: industry, session_duration_seconds, value (100), currency
   - Trigger: Voice Demo Lead Submitted

7. **Voice Demo Completed**
   - Event Name: `voice_demo_completed`
   - Parameters: industry, demo_duration_seconds, message_count, value (75), currency
   - Trigger: Voice Demo Completed

8. **Booking Page Opened**
   - Event Name: `booking_page_opened`
   - Parameters: source, industry, booking_platform, value (25), currency
   - Trigger: Booking Page Opened

9-12. Create similar tags for: Scroll Depth, Time on Page, CTA Clicked, Form Submission

### Step 7: Publish GTM Container

1. Click "Submit" in top right
2. Add Version Name: "Initial Ad Campaign Setup"
3. Add Description: "All conversion tracking tags, triggers, and variables"
4. Click "Publish"

### Step 8: Test GTM Configuration

1. Enable GTM Preview Mode (top right)
2. Open your website in new tab
3. Test each conversion:
   - Open lead gate → Verify `lead_gate_opened` fires
   - Complete lead gate → Verify `strategy_session_lead_submitted` fires
   - Use ROI calculator → Verify `roi_calculator_completed` fires
4. Check GA4 DebugView for real-time events

---

## PART 2: Google Analytics 4 Setup (15 minutes)

### Step 1: Mark Events as Conversions

1. Go to GA4 Property → Admin → Conversions
2. Click "New conversion event"
3. Add these 5 events:
   - `strategy_session_lead_submitted` (Primary)
   - `roi_calculator_completed` (Secondary)
   - `voice_demo_lead_submitted` (Secondary)
   - `roi_pdf_downloaded` (Tertiary)
   - `booking_page_opened` (Tertiary)
4. Toggle "Mark as conversion" for each

### Step 2: Create Custom Audiences

**Audience 1: Strategy Session Leads (Exclude from Acquisition)**
- Include: `event_name = strategy_session_lead_submitted`
- Duration: 30 days

**Audience 2: ROI Calculator Users - No Conversion (Retarget)**
- Include: `event_name = roi_calculator_completed`
- Exclude: `event_name = strategy_session_lead_submitted`
- Duration: 14 days

**Audience 3: Lead Gate Abandoners (Urgency Retarget)**
- Include: `event_name = lead_gate_opened`
- Exclude: `event_name = strategy_session_lead_submitted`
- Duration: 7 days

**Audiences 4-11: Industry-Specific (x8)**
- Example: "HVAC Landing Visitors - No Conversion"
- Include: `page_path contains /hvac`
- Exclude: `event_name = strategy_session_lead_submitted`
- Duration: 30 days

**Audience 12: High-Budget Prospects (VIP Retarget)**
- Include: `budget_range = $10,000+/month` AND `event_name = lead_gate_opened`
- Exclude: `event_name = strategy_session_lead_submitted`
- Duration: 60 days

---

## PART 3: Google Ads Campaigns (2-3 hours)

### Campaign Structure (Repeat for All 8 Industries)

**Industries:**
1. HVAC → `/hvac`
2. Legal → `/legal`
3. Healthcare → `/healthcare`
4. Accounting → `/accounting`
5. Restaurants → `/restaurants`
6. Roofing → `/roofing`
7. Logistics → `/logistics`
8. Bars/Nightclubs → `/bars`

### Campaign Settings (Per Industry)

**Basic Settings:**
- Campaign Type: Search
- Campaign Name: `[Industry] - AI Agent - Search - 2025`
- Network: Google Search only (disable Search Partners initially)
- Locations: United States
- Languages: English
- Budget: $30-50/day per campaign
- Bidding: Target CPA ($150-200)
- Ad Rotation: Optimize

**Ad Groups (3 per campaign):**

**Ad Group 1: Core Service Keywords**
- [industry] answering service
- [industry] virtual receptionist
- [industry] ai receptionist
- 24/7 [industry] service
- [industry] appointment booking

**Ad Group 2: Problem-Aware Keywords**
- missed [industry] calls
- [industry] call overflow
- after hours [industry] service
- [industry] emergency calls

**Ad Group 3: Solution-Aware Keywords**
- [industry] automation
- [industry] ai assistant
- [industry] lead capture
- [industry] scheduling automation

### Responsive Search Ad Copy (Per Industry)

**HVAC Example - Use this pattern for all 8:**

**15 Headlines:**
1. Never Miss HVAC Emergency Call
2. 24/7 AI Receptionist for HVAC
3. 40% More HVAC Jobs Booked ← Pin to Position 1
4. AI Answers Emergency Calls
5. HVAC Answering Service 24/7
6. Stop Losing After-Hours Leads
7. Book HVAC Jobs Automatically
8. AI That Thinks Like Your Tech
9. 3-7 Day Setup | No Long-Term
10. $15K+ Monthly Revenue Recovered
11. Free HVAC AI Strategy Session
12. Try Before You Buy | Flexible
13. Answer Every HVAC Call
14. Instant Emergency Response
15. HVAC Lead Capture Automation

**4 Descriptions:**
1. AI answers 24/7, books appointments, and qualifies leads. Most HVAC companies see 40% more booked jobs. ← Pin
2. Never miss another emergency call. AI handles overflow during rush, screens spam, and routes hot leads to techs.
3. Get your free strategy session. See how AI can recover $15K+/month in missed opportunities. No commitment.
4. Flexible pilot program. Deploy in 3-7 days. Try it risk-free before committing long-term. Book your demo now.

**Ad Extensions:**
- Sitelinks: "See ROI Calculator" → `/calculators`, "HVAC Case Studies" → `/resources`, "Book Strategy Session" → `/hvac?cta=header`
- Callouts: "24/7 Emergency Response", "3-7 Day Setup", "No Long-Term Contracts", "94% Pilot Success Rate"
- Structured Snippets: Services: AI Receptionist, Lead Qualification, Appointment Booking, Call Recording, CRM Integration

**Final URL:**
```
https://trainyouragent.com/hvac?utm_source=google&utm_medium=cpc&utm_campaign=hvac-search&utm_content=rsa-v1
```

**Repeat this structure for all 8 industries with industry-specific copy.**

### Negative Keywords (Apply to All Campaigns)

```
free, cheap, diy, open source, job, jobs, hiring, salary, career, course, training program
```

### Conversion Tracking Setup

1. Google Ads → Tools → Conversions → Import
2. Select "Google Analytics 4"
3. Import these conversions:
   - `strategy_session_lead_submitted` ($500 value)
   - `roi_calculator_completed` (dynamic value)
   - `voice_demo_lead_submitted` ($100 value)
4. Enable Enhanced Conversions

---

## PART 4: Apollo.io Email Sequences (3-4 hours)

### Step 1: Create Email Templates

Go to Apollo.io → Sequences → Templates

**Create 38 email templates across 5 sequences:**

**Sequence 1: Strategy Session Request Follow-Up (10 emails)**

1. **Immediate Welcome** (0 min delay)
   - Subject: "Your Strategy Session Request Received - What Happens Next"
   - Body: Welcome, confirm receipt, set expectations, include case study video link

2. **Pre-Call Value** (4 hours)
   - Subject: "{{first_name}}, here's what we'll cover in your strategy session"
   - Body: 4-phase implementation process, timeline estimator, FAQ links

3. **Social Proof** (1 day)
   - Subject: "How [Industry] Company X Recovered $XXK/Month in 7 Days"
   - Body: Full case study, before/after, ROI calculations, testimonial

4. **Cost Objection Handler** (2 days)
   - Subject: "{{first_name}}, let's talk about ROI (not cost)"
   - Body: Missed call math, AI vs. human comparison, payback period (2-4 weeks)

5. **Time Objection Handler** (4 days)
   - Subject: "Too busy to implement AI? That's exactly why you need it"
   - Body: 3-7 day implementation, minimal involvement, time-savings calculation

6. **Case Study Spotlight** (6 days)
   - Subject: "{{industry}} Case Study: From 48% Missed Calls to Zero"
   - Body: Deep-dive case study, video testimonial link

7. **Urgency/Scarcity** (8 days)
   - Subject: "{{first_name}}, only 3 pilot slots remaining this month"
   - Body: Implementation capacity limits (true), calendar availability

8. **2-Minute Video Walkthrough** (10 days)
   - Subject: "See exactly how your {{industry}} AI agent would work"
   - Body: Personalized Loom video, demo walkthrough

9. **Founder's Personal Note** (12 days)
   - Subject: "A personal note from Alexander"
   - Body: Authentic story, mission, LinkedIn connection offer

10. **Final Breakup** (14 days)
    - Subject: "Should I close your file?"
    - Body: Respectful breakup, offer to re-engage later, feedback request

**Sequence 2: ROI Calculator Users (7 emails, 10 days)**

1. Immediate ROI Summary (0 min)
2. Relevance Check (2 days)
3. Case Study Match (4 days)
4. Implementation Timeline (6 days)
5. Objection Handler (8 days)
6. Final CTA (10 days)
7. Permission to Archive (10 days + 4 hours)

**Sequence 3: Voice Demo Lead Submitted (5 emails, 7 days)**

1. Demo Confirmation (0 min)
2. Follow-Up (1 day)
3. Deployment Path (3 days)
4. Urgency (5 days)
5. Final CTA (7 days)

**Sequence 4: Lead Gate Abandoners (4 emails, 7 days)**

1. Completion Reminder (4 hours)
2. Value Reminder (2 days)
3. Social Proof (4 days)
4. Final Reminder (7 days)

**Sequence 5: Newsletter Subscribers (12 emails, 90 days)**

Long-term nurture with educational content, case studies, and soft CTAs.

### Step 2: Create Sequences in Apollo.io

1. Sequences → Create New Sequence
2. Add email steps with delays as specified
3. Set enrollment conditions:
   - Tag: "Strategy Session Request" → Sequence 1
   - Tag: "ROI Calculator User" → Sequence 2
   - Tag: "Voice Demo Lead" → Sequence 3
   - Tag: "Lead Gate Abandoned" → Sequence 4
   - Tag: "Newsletter Subscriber" → Sequence 5

### Step 3: Set Up Auto-Enrollment (Zapier/Make.com)

**Trigger:** New contact in Apollo.io with specific tag
**Action:** Enroll in corresponding sequence

**Tag Mapping:**
- "Strategy Session Request" → Sequence 1
- "ROI Calculator User" → Sequence 2
- "Voice Demo Lead" → Sequence 3
- "Lead Gate Abandoned" → Sequence 4
- "Newsletter Subscriber" → Sequence 5

### Step 4: Configure Reply Detection

1. Enable "Pause sequence on reply" for all sequences
2. Set up reply routing:
   - Hot lead replies (mention "book", "schedule", "yes") → Slack #hot-leads
   - General replies → Daniel (Head of Sales)

---

## PART 5: Facebook Ads & Retargeting (1-2 hours)

### Step 1: Add Meta Pixel ID

**File:** Create `.env` file in project root (if not exists)

```
VITE_META_PIXEL_ID=YOUR_META_PIXEL_ID
```

Get Pixel ID from Facebook Events Manager.

### Step 2: Create Custom Audiences

Go to Facebook Ads Manager → Audiences → Create Audience → Custom Audience → Website Traffic

**Create 10 Audiences:**

1. **All Website Visitors** (30 days)
   - URL: All website visitors

2. **HVAC Landing Visitors** (30 days)
   - URL contains: `/hvac`
   - Exclude: Custom Event `strategy_session_lead_submitted`

3-9. **Repeat for all 8 industries** (Legal, Healthcare, Accounting, Restaurants, Roofing, Logistics, Bars)

10. **ROI Calculator Users - No Conversion** (14 days)
    - Custom Event: `roi_calculator_completed`
    - Exclude: Custom Event `strategy_session_lead_submitted`

11. **Lead Gate Abandoners** (7 days)
    - Custom Event: `lead_gate_opened`
    - Exclude: Custom Event `strategy_session_lead_submitted`

12. **High-Budget Prospects** (60 days)
    - Custom Event: `lead_gate_opened`
    - Event parameter: `budget_range = $10,000+/month`
    - Exclude: Custom Event `strategy_session_lead_submitted`

### Step 3: Create Retargeting Campaigns

**Campaign 1: Industry-Specific Retargeting**
- 8 Ad Sets (one per industry)
- Budget: $10-20/day per ad set
- Creative: Use generated OG images from `public/og-images/[industry].jpg`
- Destination: Relevant landing page

**Campaign 2: High-Intent Retargeting**
- Ad Set 1: ROI Calculator Users → Show dynamic ROI savings
- Ad Set 2: Voice Demo Users → Show demo video
- Ad Set 3: Lead Gate Abandoners → Urgency messaging
- Budget: $20-40/day total

**Campaign 3: VIP Retargeting**
- Ad Set: High-Budget Prospects only
- Budget: $40-80/day
- Creative: Founder video or 1-on-1 consultation offer

---

## PART 6: Launch Checklist

### Pre-Launch (Complete Before Spending $1 on Ads)

- [ ] GTM Container ID replaced in index.html (lines 9, 269)
- [ ] All 15 GTM data layer variables created
- [ ] All 13 GTM custom event triggers created
- [ ] GA4 Configuration Tag created and published
- [ ] All 12 GA4 event tags created
- [ ] GTM container published
- [ ] GTM Preview Mode tested successfully
- [ ] 5 events marked as conversions in GA4
- [ ] 12 custom audiences created in GA4
- [ ] All 38 Apollo.io email templates created
- [ ] 5 Apollo.io sequences configured with delays
- [ ] Auto-enrollment automation set up (Zapier/Make)
- [ ] Meta Pixel ID added to .env file
- [ ] 12 Facebook custom audiences created
- [ ] All 8 industry OG images validated (1200x630px)

### Week 1: Campaign Launch

- [ ] Launch first 4 Google Ads campaigns (HVAC, Legal, Healthcare, Accounting)
- [ ] Budget: $30/day per campaign
- [ ] Monitor Quality Score (target 7-10)
- [ ] Review search terms daily, add negative keywords
- [ ] Check GTM events in GA4 DebugView

### Week 2: Initial Optimization

- [ ] Launch remaining 4 Google Ads campaigns (Restaurants, Roofing, Logistics, Bars)
- [ ] Identify top 3 performing campaigns
- [ ] Pause low-performing ad combinations (QS <5)
- [ ] Increase budget on winners to $50-80/day
- [ ] Launch Facebook retargeting Campaign 1 (Industry-Specific)

### Week 3: Scaling

- [ ] Scale winning Google Ads to $100+/day
- [ ] Launch Facebook Campaign 2 (High-Intent Retarget)
- [ ] Create lookalike audiences based on converters
- [ ] Test new ad copy variations
- [ ] Review Apollo.io sequence performance (open/reply rates)

### Week 4: Advanced Optimization

- [ ] Launch Facebook Campaign 3 (VIP Retarget)
- [ ] Set up Google Display remarketing
- [ ] Test Performance Max campaigns
- [ ] A/B test OG images on Facebook
- [ ] Document learnings and create playbook

---

## SUCCESS METRICS

### Lead Nurture (Apollo.io Sequences)
- Open Rate: Target 40%+ (industry avg 20-25%)
- Click Rate: Target 8%+ (industry avg 2-3%)
- Reply Rate: Target 5%+
- Booking Rate: Target 12-15% of enrollments

### Google Ads
- Quality Score: Target 7-10
- CTR: Target 4%+ (industry avg 2%)
- CPC: Target $10-30
- Conversion Rate: Target 8-12%
- Cost Per Lead: Target $150-250
- ROI: Target 3:1 minimum

### Facebook Ads
- Social Ad CTR: Target 3-5%
- Engagement Rate: Target 2%+
- Cost Per Click: Target $2-8
- Retargeting Conversion Rate: Target 15-20%

### Overall Attribution
- Conversion Tracking Accuracy: 95%+
- Attribution Coverage: 90%+ of conversions have UTM data
- Lead Gate Completion Rate: Track drop-off at each step
- Industry Segmentation: 100% of leads tagged correctly

---

## SUPPORT RESOURCES

**Google Tag Manager:**
- Documentation: https://support.google.com/tagmanager
- Preview Mode Guide: https://support.google.com/tagmanager/answer/6107056

**Google Analytics 4:**
- Event Setup: https://support.google.com/analytics/answer/9267735
- Conversion Tracking: https://support.google.com/analytics/answer/9267568

**Google Ads:**
- Responsive Search Ads: https://support.google.com/google-ads/answer/7684791
- Quality Score Guide: https://support.google.com/google-ads/answer/6167118

**Apollo.io:**
- Sequence Setup: https://knowledge.apollo.io/hc/en-us/sections/360007617554-Sequences
- API Documentation: https://apolloio.github.io/apollo-api-docs/

**Facebook Ads:**
- Custom Audiences: https://www.facebook.com/business/help/744354708981227
- Pixel Setup: https://www.facebook.com/business/help/952192354843755

---

## NEXT STEPS

1. **Today:** Replace GTM Container ID in index.html, create all GTM variables/triggers/tags
2. **Tomorrow:** Set up Apollo.io email sequences, create first 10 templates
3. **Day 3:** Complete remaining Apollo.io templates, set up auto-enrollment
4. **Day 4:** Launch first 4 Google Ads campaigns (HVAC, Legal, Healthcare, Accounting)
5. **Day 5:** Monitor campaigns, set up Facebook custom audiences
6. **Week 2:** Launch remaining campaigns and retargeting

**Questions?** Review this guide section by section. Test everything before spending ad budget.
