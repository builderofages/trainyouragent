# Facebook Ads Manager Custom Audiences Setup Guide

Complete guide for setting up 12 retargeting audiences, campaign structure, and optimization strategies for TrainYourAgent Facebook Ads campaigns.

---

## Table of Contents

1. [Meta Pixel Custom Audiences Setup](#1-meta-pixel-custom-audiences-setup)
2. [Audience Configuration Steps](#2-audience-configuration-steps)
3. [Campaign Structure Using Custom Audiences](#3-campaign-structure-using-custom-audiences)
4. [Pixel Event Tracking Verification](#4-pixel-event-tracking-verification)
5. [Exclusion Rules](#5-exclusion-rules-critical-for-preventing-ad-waste)
6. [Budget Allocation by Audience Performance](#6-budget-allocation-by-audience-performance)

---

## 1. Meta Pixel Custom Audiences Setup

### 12 Required Audiences

#### **Audience 1: All Website Visitors (Last 30 Days)**
- **Condition:** Website visitors in last 30 days
- **Membership Duration:** 30 days
- **Purpose:** Broad retargeting pool for brand awareness
- **Estimated Size:** 5,000-15,000 visitors/month
- **Use Case:** General retargeting with brand messaging, social proof, and trust-building content

---

#### **Audience 2-9: Industry-Specific Landing Page Visitors**

**Audience 2: HVAC Landing Page Visitors**
- **URL Contains:** `/hvac`
- **Membership Duration:** 60 days
- **Exclusion:** Converted leads (strategy session booked)
- **Purpose:** Retarget HVAC-interested prospects with emergency call messaging
- **Creative Focus:** "Stop losing 2am emergency calls to competitors. AI answers 24/7."
- **Estimated Size:** 800-1,500 visitors/month

**Audience 3: Legal Landing Page Visitors**
- **URL Contains:** `/legal`
- **Membership Duration:** 90 days (longer sales cycle for legal services)
- **Exclusion:** Converted leads
- **Purpose:** Retarget law firms with after-hours intake messaging
- **Creative Focus:** "67% of legal leads go to first firm that responds. Be that firm."
- **Estimated Size:** 600-1,200 visitors/month

**Audience 4: Healthcare Landing Page Visitors**
- **URL Contains:** `/healthcare`
- **Membership Duration:** 90 days
- **Exclusion:** Converted leads
- **Purpose:** Retarget medical practices with HIPAA-compliant messaging
- **Creative Focus:** "HIPAA-compliant AI that never misses a patient call. 5-7 day setup."
- **Estimated Size:** 700-1,400 visitors/month

**Audience 5: Accounting Landing Page Visitors**
- **URL Contains:** `/accounting`
- **Membership Duration:** 60 days
- **Exclusion:** Converted leads
- **Purpose:** Retarget accounting firms with tax season automation
- **Creative Focus:** "Handle 3x more clients during tax season without hiring staff."
- **Estimated Size:** 500-1,000 visitors/month

**Audience 6: Restaurants Landing Page Visitors**
- **URL Contains:** `/restaurants`
- **Membership Duration:** 45 days
- **Exclusion:** Converted leads
- **Purpose:** Retarget restaurants with reservation/catering messaging
- **Creative Focus:** "Never miss a reservation or catering inquiry. 40% of calls go unanswered."
- **Estimated Size:** 900-1,800 visitors/month

**Audience 7: Roofing Landing Page Visitors**
- **URL Contains:** `/roofing`
- **Membership Duration:** 60 days
- **Exclusion:** Converted leads
- **Purpose:** Retarget roofing contractors with storm response messaging
- **Creative Focus:** "Capture 70% more storm leads. AI answers in under 30 seconds."
- **Estimated Size:** 600-1,200 visitors/month

**Audience 8: Logistics Landing Page Visitors**
- **URL Contains:** `/logistics`
- **Membership Duration:** 75 days
- **Exclusion:** Converted leads
- **Purpose:** Retarget logistics companies with quote generation speed
- **Creative Focus:** "Generate quotes in 30 seconds vs 4 hours. Fastest quote wins."
- **Estimated Size:** 400-900 visitors/month

**Audience 9: Bars & Nightclubs Landing Page Visitors**
- **URL Contains:** `/bars`
- **Membership Duration:** 45 days
- **Exclusion:** Converted leads
- **Purpose:** Retarget nightlife venues with VIP/event booking messaging
- **Creative Focus:** "$50K+ extra monthly revenue from VIP bookings captured 24/7."
- **Estimated Size:** 500-1,000 visitors/month

---

#### **Audience 10: ROI Calculator Users - No Conversion**
- **Conditions:**
  - Custom Event: `roi_calculator_completed` fired
  - **Exclusion:** `strategy_session_lead_submitted` OR `booking_page_opened` events
- **Membership Duration:** 45 days
- **Purpose:** High-intent visitors who calculated ROI but didn't book
- **Retargeting Message:** "You saw you could save $X,XXX/month - Let's make it happen"
- **Creative Strategy:** Use dynamic ads showing their projected savings (if possible via URL parameters)
- **Estimated Size:** 200-500 users/month
- **Expected Performance:** $40-70 CPL (highest intent audience)

---

#### **Audience 11: Lead Gate Abandoners**
- **Conditions:**
  - Custom Event: `lead_gate_opened` fired
  - Custom Event: `lead_gate_step_viewed` with step >= 2 (viewed at least Step 2)
  - **Exclusion:** `strategy_session_lead_submitted` event
- **Membership Duration:** 30 days
- **Purpose:** Visitors who started lead capture form but abandoned mid-way
- **Retargeting Message:** "Still thinking it over? No commitment - just a conversation"
- **Creative Strategy:** Risk reversal messaging emphasizing "no credit card", "flexible pilot program"
- **Estimated Size:** 150-400 users/month
- **Expected Performance:** $70-100 CPL

---

#### **Audience 12: High-Budget Prospects**
- **Conditions:**
  - Custom Event: `strategy_session_lead_submitted` with `budget_range` parameter = "$5,000-$10,000/month" OR "$10,000+/month"
  - OR Custom Event: `roi_calculator_completed` with `monthly_roi` parameter >= 10000
- **Membership Duration:** 180 days
- **Purpose:** Enterprise-tier prospects for premium service upsells and nurturing
- **Retargeting Message:** "Ready to scale? Let's build your custom enterprise solution"
- **Creative Strategy:** Premium positioning, case studies from large implementations, white-glove service
- **Estimated Size:** 50-150 users/month
- **Expected Performance:** $80-120 CPL (higher cost but 3x conversion rate on strategy calls)

---

## 2. Audience Configuration Steps

### Step 1: Navigate to Meta Ads Manager

1. Go to: [https://business.facebook.com/adsmanager](https://business.facebook.com/adsmanager)
2. Click **"Audiences"** in left sidebar
   - Direct link: [https://business.facebook.com/audiences](https://business.facebook.com/audiences)

### Step 2: Create Custom Audience

1. Click **"Create Audience"** → **"Custom Audience"**
2. Select **"Website"** as source
3. Choose your Meta Pixel (ensure GTM-P8DPG8PF is connected)
   - If pixel not showing, verify Meta Pixel ID is configured in `index.html`

### Step 3: Configure Audience Conditions

#### For URL-Based Audiences (Industry Landing Pages):

**Settings:**
- **Retention:** Set membership duration (30-90 days based on sales cycle)
- **Rules:** "People who visited specific web pages"
- **URL Contains:** `/hvac` (or `/legal`, `/healthcare`, `/restaurants`, `/roofing`, `/accounting`, `/logistics`, `/bars`)
- **Exclusions:** Add "Converted Leads" audience (see Step 5 for creating this exclusion audience)

**Example: HVAC Landing Page Visitors**
```
Name: TrainYourAgent - HVAC Landing Visitors
Retention: 60 days
Include: URL Contains /hvac
Exclude: Converted Leads (180 days)
Description: HVAC contractors who visited landing page but did not book strategy session
```

#### For Event-Based Audiences (Calculator Users, Abandoners, High-Budget):

**Settings:**
- **Retention:** Set membership duration
- **Rules:** "People who took specific actions"
- **Events:** Select custom events from dropdown
  - Available events: `roi_calculator_completed`, `lead_gate_opened`, `lead_gate_step_viewed`, `strategy_session_lead_submitted`, `booking_page_opened`
- **Parameters:** Add parameter filters when needed
  - Example: `budget_range` = "$10,000+/month"
  - Example: `monthly_roi` >= 10000
- **Exclusions:** Add conversion events to exclude people who already converted

**Example: ROI Calculator Users - No Conversion**
```
Name: TrainYourAgent - ROI Calculator Users (No Conversion)
Retention: 45 days
Include: Custom Event roi_calculator_completed
Exclude: Custom Event strategy_session_lead_submitted
Exclude: Custom Event booking_page_opened
Description: High-intent visitors who calculated ROI but did not submit lead form
```

**Example: Lead Gate Abandoners**
```
Name: TrainYourAgent - Lead Gate Abandoners
Retention: 30 days
Include: Custom Event lead_gate_opened
Include: Custom Event lead_gate_step_viewed (step >= 2)
Exclude: Custom Event strategy_session_lead_submitted
Description: Users who opened lead gate and viewed step 2+ but did not submit
```

**Example: High-Budget Prospects**
```
Name: TrainYourAgent - High Budget Prospects
Retention: 180 days
Include: Custom Event strategy_session_lead_submitted WHERE budget_range = "$5,000-$10,000/month" OR "$10,000+/month"
OR Include: Custom Event roi_calculator_completed WHERE monthly_roi >= 10000
Description: Enterprise-tier prospects for premium upsells and ongoing nurture
```

### Step 4: Name and Save

**Naming Convention:**
- Format: `TrainYourAgent - [Audience Name]`
- Examples:
  - `TrainYourAgent - HVAC Landing Visitors`
  - `TrainYourAgent - ROI Calculator Users (No Conversion)`
  - `TrainYourAgent - Lead Gate Abandoners`

**Description Best Practices:**
- Include purpose and targeting notes for team reference
- Document exclusions applied
- Note expected size and performance benchmarks

---

## 3. Campaign Structure Using Custom Audiences

### Campaign 1: Industry Retargeting (8 Ad Sets)

**Campaign Settings:**
- **Objective:** Conversions (Strategy Session Bookings)
- **Budget:** $50-100/day per industry ($400-800/day total)
- **Optimization Goal:** Lead (strategy session form submissions)
- **Bid Strategy:** Lowest cost with bid cap (start at $100-150 per lead)

**Ad Sets:** 8 (one per industry landing page audience)

**Ad Set Structure (Example: HVAC):**
- **Audience:** TrainYourAgent - HVAC Landing Visitors
- **Placement:** Facebook Feed, Instagram Feed, Facebook/Instagram Stories
- **Daily Budget:** $50-100
- **Schedule:** Continuous
- **Optimization:** Conversions (strategy_session_lead_submitted)

**Creative Guidelines:**
- Use industry-specific OG images (`/og-images/hvac.jpg`, `/og-images/legal.jpg`, etc.)
- Headline emphasizes industry pain point
- Body copy includes specific stat/research citation
- CTA: "Get Your Free Strategy Session"

**Example Ad Copy (HVAC):**
```
Headline: Still Losing Emergency Calls at 2am?
Body: 42% of after-hours HVAC emergency calls go to competitors (Service Nation Alliance). 
See how [HVAC Company] captured $75K+ extra revenue with AI that answers 24/7. 
Free strategy session - 3-7 day setup. No commitment.
CTA: Get Your Free Strategy Session
Image: /og-images/hvac.jpg
```

**Example Ad Copy (Legal):**
```
Headline: 67% of Legal Leads Go to First Firm That Responds
Body: After-hours legal inquiries generate $180K+ monthly for firms with AI intake (ABA). 
Your prospects don't wait - they call the next attorney. 
Free strategy session to see how AI captures every lead 24/7.
CTA: Get Your Free Strategy Session
Image: /og-images/legal.jpg
```

---

### Campaign 2: Calculator Abandoners

**Campaign Settings:**
- **Objective:** Conversions
- **Budget:** $75/day
- **Audience:** ROI Calculator Users - No Conversion
- **Optimization Goal:** Lead

**Creative Strategy:**
- Urgency messaging with projected savings
- Countdown timer creative (if using video)
- Before/After transformation angle

**Ad Copy Example:**
```
Headline: You Calculated You're Losing $X,XXX/Month to Missed Calls
Body: The AI ROI Calculator showed you the truth - now let's fix it. 
Most businesses see payback in 14-21 days. Limited pilot spots available this month.
3-7 day setup. Flexible month-to-month pilot program.
CTA: Claim Your Pilot Spot
```

---

### Campaign 3: Lead Gate Abandoners

**Campaign Settings:**
- **Objective:** Conversions
- **Budget:** $50/day
- **Audience:** Lead Gate Abandoners
- **Optimization Goal:** Lead

**Creative Strategy:**
- Risk reversal messaging
- Address common objections (cost, commitment, complexity)
- Emphasize "just a conversation"

**Ad Copy Example:**
```
Headline: No Credit Card. No Contract. Just a Conversation.
Body: You started filling out the form but stopped - we get it. Big decisions take time. 
See if AI is right for your business with zero commitment. 
Our free strategy session shows you exactly what's possible for YOUR business.
CTA: Finish Your Request
```

---

### Campaign 4: High-Value Upsell

**Campaign Settings:**
- **Objective:** Lead Generation (for enterprise demos)
- **Budget:** $100/day
- **Audience:** High-Budget Prospects
- **Optimization Goal:** Qualified leads

**Creative Strategy:**
- Premium enterprise messaging
- Case studies from large implementations
- White-glove service emphasis

**Ad Copy Example:**
```
Headline: Handling 1,000+ Calls/Month? You Need More Than a Basic AI Agent
Body: Enterprise businesses need enterprise solutions. 
Custom multi-agent workflows, advanced integrations, dedicated implementation team. 
Talk to our team about scaling AI across your organization.
CTA: Schedule Enterprise Demo
```

---

## 4. Pixel Event Tracking Verification

### Required Events for Audiences to Populate

All events are already implemented in `src/lib/tracking.ts` and fire to Meta Pixel via `fbq()` calls. Verify they're firing correctly:

**Standard Events:**
- `PageView` - Fires on every page load
- `Lead` - Fires on strategy session form submission

**Custom Events:**
- `roi_calculator_completed` - User completes ROI calculator
- `lead_gate_opened` - User opens strategy session lead gate modal
- `lead_gate_step_viewed` - User views each step of lead gate (parameters: step number, component name)
- `lead_gate_abandoned` - User closes lead gate without submitting (parameters: step, time_spent)
- `strategy_session_lead_submitted` - User completes lead gate form (parameters: industry, budget_range, call_volume)
- `booking_page_opened` - Cal.com redirect occurs (parameters: source, industry)
- `voice_demo_started` - User activates voice demo
- `voice_demo_completed` - User completes voice demo interaction

### Verification Steps

1. **Install Meta Pixel Helper Chrome Extension**
   - Download: [Chrome Web Store - Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/)

2. **Test Event Firing:**
   - Visit trainyouragent.com
   - Complete actions:
     - Page view → `PageView` event should fire
     - Open ROI calculator → should see page context
     - Complete ROI calculator → `roi_calculator_completed` should fire
     - Click "Get Your Free Strategy Session" → `lead_gate_opened` should fire
     - Progress through lead gate steps → `lead_gate_step_viewed` fires for each step
     - Submit form → `strategy_session_lead_submitted` fires with parameters
   - Check Pixel Helper icon shows green checkmark for each event

3. **Check Events Manager:**
   - Go to [Meta Events Manager](https://business.facebook.com/events_manager)
   - Click **"Test Events"** tab
   - Perform actions on site
   - Verify events appear in real-time with correct parameters

4. **Verify Parameters Are Passing:**
   - Click on event in Events Manager
   - Check "Event Details" shows parameters like:
     - `industry`: "hvac", "legal", "healthcare", etc.
     - `budget_range`: "<$2,000/month", "$2,000-$5,000/month", etc.
     - `monthly_roi`: numeric value
     - `call_volume`: "25-50/day", "50-100/day", etc.

### Troubleshooting

**Events not firing?**
- Check browser console for JavaScript errors
- Ensure `VITE_META_PIXEL_ID` environment variable is set in project
- Verify Meta Pixel code in `index.html` lines 275-282

**Audiences not populating?**
- Ensure 100+ people trigger event within 7 days (minimum audience size requirement)
- Check Events Manager → Diagnostics for pixel errors
- Verify audience retention period is appropriate (30-180 days)

**Parameters missing?**
- Check `src/lib/tracking.ts` includes proper parameters in `fbq('trackCustom', 'event_name', { parameters })`
- Verify data types match (strings, numbers, booleans)
- Ensure parameter names match exactly between code and audience configuration

---

## 5. Exclusion Rules (Critical for Preventing Ad Waste)

### Create "Converted Leads" Exclusion Audience

**Purpose:** Prevent showing ads to people who already booked strategy sessions

**Configuration:**
```
Name: TrainYourAgent - Converted Leads (EXCLUSION)
Retention: 180 days
Include: Custom Event strategy_session_lead_submitted
OR Include: Custom Event booking_page_opened
Description: Users who completed lead form or opened Cal.com booking page - EXCLUDE from all retargeting
```

### Apply Exclusions to All Retargeting Campaigns

**Step-by-Step:**
1. In each Ad Set → **Audience** section → **Exclusions**
2. Click **"Exclude a Custom Audience"**
3. Select **"TrainYourAgent - Converted Leads (EXCLUSION)"**
4. Save changes

**Additional Exclusion Strategy:**

**Create "Recent Visitors" Exclusion (Optional):**
```
Name: TrainYourAgent - Recent Visitors (7 Days)
Retention: 7 days
Include: All website visitors (last 7 days)
Description: Create "cool down" period for retargeting - exclude very recent visitors
```

Apply this to Campaign 2-4 (Calculator Abandoners, Lead Gate Abandoners, High-Budget) to prevent immediate retargeting. Allow 7 days before showing retargeting ads.

### Why Exclusions Matter

- **Prevent Ad Fatigue:** Don't annoy converted customers
- **Reduce Wasted Spend:** Stop paying to advertise to people who already converted
- **Improve Metrics:** Exclusions improve CTR and conversion rates by focusing only on prospects
- **Better User Experience:** Customers appreciate not seeing ads after they've already taken action

---

## 6. Budget Allocation by Audience Performance

### Week 1-2: Equal Budget Testing Phase

**Strategy:** Allocate equal daily budget across all audiences to gather performance data

**Budget Breakdown:**
- All Website Visitors: $50/day
- 8 Industry Landing Pages: $50-100/day each ($400-800 total)
- ROI Calculator Users: $75/day
- Lead Gate Abandoners: $50/day
- High-Budget Prospects: $100/day

**Total Initial Budget:** $675-975/day

**Key Metrics to Track:**
- Cost Per Lead (CPL)
- Lead Quality Score (based on budget_range, call_volume submitted)
- Strategy Session Show-Up Rate
- Pilot Conversion Rate

---

### Week 3+: Performance-Based Optimization

**Optimization Rules:**

**Increase Budget (+25-50%) When:**
- CPL < $75
- Lead quality score > 7/10 (based on Apollo.io data)
- Strategy session show-up rate > 60%
- Pilot conversion rate > 75%

**Decrease Budget (-25-50%) When:**
- CPL > $150
- Lead quality score < 4/10
- Strategy session show-up rate < 40%
- Pilot conversion rate < 50%

**Pause Audience When:**
- CPL > $200 for 7+ days
- Lead quality consistently poor
- Audience size drops below 500 (too small to optimize)

---

### Expected Performance Benchmarks

Based on industry averages for B2B SaaS retargeting:

| Audience | Expected CPL | Lead Quality | Show-Up Rate | Notes |
|----------|-------------|--------------|--------------|-------|
| **Industry Landing Pages** | $60-90 | High (7-8/10) | 65-75% | Warm traffic, clear intent |
| **Calculator Abandoners** | $40-70 | Very High (8-9/10) | 70-80% | Highest intent - already calculated ROI |
| **Lead Gate Abandoners** | $70-100 | Medium (6-7/10) | 55-65% | Some friction but engaged |
| **High-Budget Prospects** | $80-120 | Highest (9-10/10) | 75-85% | Premium tier, 3x conversion rate |
| **All Website Visitors** | $90-130 | Medium (5-6/10) | 50-60% | Broadest audience, lower intent |

---

### Monthly Optimization Cadence

**Week 1:**
- Launch all 12 audiences with equal budgets
- Monitor pixel events firing correctly
- Verify audience sizes populating

**Week 2:**
- Analyze initial performance data
- Identify top 3 performing audiences
- Test 2-3 creative variations per audience

**Week 3:**
- Reallocate budget to top performers (+50%)
- Reduce budget on poor performers (-50%)
- Launch A/B tests on ad copy and creatives

**Week 4:**
- Finalize budget allocation for Month 2
- Scale winning audiences (+100%)
- Pause or optimize underperformers
- Document learnings for next month

---

## Success Metrics Summary

### Primary KPIs:
- **Overall CPL Target:** <$85
- **Strategy Session Show-Up Rate:** >65%
- **Pilot Conversion Rate:** >80%
- **ROAS (Return on Ad Spend):** >4:1 (based on average pilot value $799-5,999/month)

### Secondary KPIs:
- **CTR (Click-Through Rate):** >1.5%
- **Landing Page Conversion Rate:** >8%
- **Lead Gate Completion Rate:** >70%
- **Cost Per Impression:** <$15 CPM

---

## Next Steps

1. ✅ **Configure all 12 custom audiences in Meta Ads Manager** (follow Step 2)
2. ✅ **Create "Converted Leads" exclusion audience** (follow Step 5)
3. ✅ **Set up 4 campaign structures** (follow Step 3)
4. ✅ **Verify pixel events firing correctly** (follow Step 4)
5. ✅ **Launch with equal budget testing** (Week 1-2 strategy)
6. ⏳ **Monitor performance daily** - check Ads Manager for CPL, CTR, conversions
7. ⏳ **Optimize after 2 weeks** - reallocate budget to top performers
8. ⏳ **Scale winning audiences** - increase budget on audiences with CPL <$75

---

## Support Resources

- **Meta Business Help Center:** [https://www.facebook.com/business/help](https://www.facebook.com/business/help)
- **Meta Pixel Setup:** [https://www.facebook.com/business/help/952192354843755](https://www.facebook.com/business/help/952192354843755)
- **Custom Audiences Guide:** [https://www.facebook.com/business/help/744354708981227](https://www.facebook.com/business/help/744354708981227)
- **Meta Events Manager:** [https://business.facebook.com/events_manager](https://business.facebook.com/events_manager)
- **Meta Pixel Helper Extension:** [Chrome Web Store](https://chrome.google.com/webstore/detail/meta-pixel-helper/)

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-12  
**Status:** Ready for Implementation
