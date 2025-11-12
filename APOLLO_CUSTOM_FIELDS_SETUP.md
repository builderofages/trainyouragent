# Apollo.io Custom Fields Setup Guide

## Critical Setup Requirement

**IMPORTANT:** All 14 custom fields listed below MUST be created in your Apollo.io dashboard BEFORE the website integration will work properly. If these fields don't exist, Apollo.io will either reject contacts or silently drop the qualification data.

## How to Create Custom Fields in Apollo.io

1. Log into Apollo.io dashboard
2. Navigate to **Settings** → **Custom Fields**
3. Click **"+ New Custom Field"**
4. Select **Contact** as the field type (NOT Company or Opportunity)
5. Enter the exact field name listed below (case-sensitive)
6. Select the appropriate field type
7. Add dropdown options if applicable
8. Click **Save**

---

## Required Custom Fields (14 Total)

### 1. industry
- **Field Type:** Dropdown (Single Select)
- **Field Name:** `industry` (lowercase, no spaces)
- **Required:** Yes
- **Dropdown Options:**
  - HVAC
  - Legal
  - Healthcare
  - Accounting
  - Restaurants
  - Roofing
  - Logistics
  - Bars & Nightclubs

**Usage:** Identifies which industry vertical the lead came from. Used for segmentation, lead scoring, and industry-specific follow-up sequences.

---

### 2. call_volume
- **Field Type:** Dropdown (Single Select)
- **Field Name:** `call_volume` (lowercase, underscore)
- **Required:** Yes (for Strategy Session leads)
- **Dropdown Options:**
  - Less than 25 calls/day
  - 25-50 calls/day
  - 50-100 calls/day
  - 100-200 calls/day
  - 200+ calls/day

**Usage:** Indicates business size and potential ROI. Higher call volume = higher priority lead. Used for lead scoring (30 points for 100+/day).

---

### 3. company_size
- **Field Type:** Dropdown (Single Select)
- **Field Name:** `company_size` (lowercase, underscore)
- **Required:** Yes (for Strategy Session leads)
- **Dropdown Options:**
  - Just me (solo entrepreneur)
  - 2-5 employees
  - 6-10 employees
  - 11-25 employees
  - 26-50 employees
  - 51-100 employees
  - 100+ employees

**Usage:** Determines implementation complexity and budget capacity. Larger companies typically have higher budgets and more complex needs.

---

### 4. current_solution
- **Field Type:** Dropdown (Single Select)
- **Field Name:** `current_solution` (lowercase, underscore)
- **Required:** Yes (for Strategy Session leads)
- **Dropdown Options:**
  - No system (manual handling)
  - Receptionist/Office Manager
  - Call Center/Answering Service
  - Basic IVR System
  - Competitor AI Solution
  - Other

**Usage:** Identifies what they're replacing. "No system" and "Manual handling" = highest intent. "Competitor AI Solution" = comparison shopping, needs differentiation.

---

### 5. biggest_challenge
- **Field Type:** Text (Long Text / Textarea)
- **Field Name:** `biggest_challenge` (lowercase, underscore)
- **Required:** Yes (for Strategy Session leads)
- **Max Length:** 1000 characters

**Usage:** Most important qualification data. Reveals pain points, urgency, and specific problems the prospect wants to solve. Used for personalized outreach and pre-call research.

---

### 6. goals
- **Field Type:** Text (Long Text / Textarea)
- **Field Name:** `goals` (lowercase, no underscore)
- **Required:** Yes (for Strategy Session leads)
- **Max Length:** 1000 characters

**Usage:** Comma-separated list of selected goals (e.g., "Capture more leads, Reduce missed calls, Improve response time, Scale without hiring, Better after-hours coverage"). Shows what success looks like to the prospect.

---

### 7. timeline
- **Field Type:** Dropdown (Single Select)
- **Field Name:** `timeline` (lowercase, no spaces)
- **Required:** Yes (for Strategy Session leads)
- **Dropdown Options:**
  - Immediate/ASAP (need solution now)
  - 1-2 weeks
  - 1 month
  - 2-3 months
  - Just exploring (no timeline)

**Usage:** Critical for lead prioritization. "Immediate/ASAP" = 30 points in lead scoring. "Just exploring" = nurture sequence, not immediate follow-up.

---

### 8. budget_range
- **Field Type:** Dropdown (Single Select)
- **Field Name:** `budget_range` (lowercase, underscore)
- **Required:** Yes (for Strategy Session leads)
- **Dropdown Options:**
  - Less than $2,000/month
  - $2,000-$5,000/month
  - $5,000-$10,000/month
  - $10,000+/month
  - Not sure yet

**Usage:** Most important lead scoring factor (50 points for $10K+). Determines if lead is qualified for sales team. "$10K+" triggers HOT lead alerts to Slack + email within 2 minutes.

---

### 9. lead_source
- **Field Type:** Text (Short Text)
- **Field Name:** `lead_source` (lowercase, underscore)
- **Required:** Yes
- **Max Length:** 255 characters

**Usage:** Captures where the lead came from (e.g., "Homepage Hero CTA", "HVAC Landing Page", "ROI Calculator Results", "Exit Intent Popup"). Used for conversion funnel analysis and campaign attribution.

---

### 10. additional_context
- **Field Type:** Text (Long Text / Textarea)
- **Field Name:** `additional_context` (lowercase, underscore)
- **Required:** No
- **Max Length:** 2000 characters

**Usage:** Free-form field for any additional information the prospect wants to share. Often contains valuable context about specific requirements, concerns, or unique situations.

---

### 11. submitted_at
- **Field Type:** Date
- **Field Name:** `submitted_at` (lowercase, underscore)
- **Required:** Yes
- **Format:** ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)

**Usage:** Timestamp of form submission. Used for lead aging analysis, response time tracking, and determining if a lead is "stale" (>7 days old).

---

### 12. utm_source
- **Field Type:** Text (Short Text)
- **Field Name:** `utm_source` (lowercase, underscore)
- **Required:** No
- **Max Length:** 255 characters

**Usage:** UTM parameter tracking traffic source (e.g., "google", "facebook", "linkedin", "email"). Critical for paid ad campaign ROI measurement and attribution.

**Example Values:**
- google (Google Ads)
- facebook (Facebook Ads)
- linkedin (LinkedIn Ads)
- newsletter (Email campaigns)
- organic (SEO traffic)

---

### 13. utm_medium
- **Field Type:** Text (Short Text)
- **Field Name:** `utm_medium` (lowercase, underscore)
- **Required:** No
- **Max Length:** 255 characters

**Usage:** UTM parameter tracking marketing medium (e.g., "cpc", "email", "social", "referral"). Used for campaign analysis and budget allocation decisions.

**Example Values:**
- cpc (Cost-per-click / Paid search)
- social (Social media)
- email (Email marketing)
- referral (Referral traffic)
- organic (Organic search)

---

### 14. utm_campaign
- **Field Type:** Text (Short Text)
- **Field Name:** `utm_campaign` (lowercase, underscore)
- **Required:** No
- **Max Length:** 255 characters

**Usage:** UTM parameter tracking specific campaign name (e.g., "q1-hvac-promo", "legal-intake-automation", "holiday-sale-2025"). Enables campaign-level ROI tracking.

**Example Values:**
- q1-2025-hvac-campaign
- legal-intake-automation
- healthcare-hipaa-compliant
- restaurant-reservations

---

## Verification Checklist

After creating all 14 custom fields, verify:

- [ ] All 14 field names match exactly (case-sensitive, underscores in correct places)
- [ ] All dropdown fields have the exact options listed above
- [ ] All fields are set to **Contact** type (not Company or Opportunity)
- [ ] Text fields have appropriate max lengths set
- [ ] `submitted_at` is set to Date type (not Text)
- [ ] No typos in field names (common mistakes: `call_volume` not `callVolume`, `utm_source` not `utm-source`)

---

## Testing Your Setup

### Test Lead Submission

1. Go to your website
2. Fill out a Strategy Session Lead Gate form
3. Submit the form
4. Check Apollo.io dashboard:
   - Contact should appear with email address
   - All 14 custom fields should be populated with data
   - Tags should be applied: "Strategy Session Request", industry tag (e.g., "HVAC")
5. Check browser console (F12):
   - Look for "Apollo proxy: Contact created successfully"
   - If you see errors, check edge function logs

### Common Errors & Solutions

**Error:** "Contact created but custom fields are empty"
- **Cause:** Field names don't match exactly
- **Solution:** Double-check spelling and capitalization of all field names

**Error:** "Apollo API error: 422 Unprocessable Entity"
- **Cause:** Dropdown value doesn't match configured options
- **Solution:** Verify dropdown options match exactly (case-sensitive)

**Error:** "Field 'X' does not exist"
- **Cause:** Custom field wasn't created in Apollo.io
- **Solution:** Create the missing field in Apollo.io Settings → Custom Fields

**Error:** "Validation failed: Invalid email format"
- **Cause:** Email field validation in Apollo is stricter than browser validation
- **Solution:** This is handled automatically by the integration, but test with real email addresses

---

## Lead Scoring Based on Custom Fields

Your Apollo.io setup should use these fields for lead scoring:

| Field | Scoring Logic | Points |
|-------|---------------|--------|
| budget_range | $10,000+/month | 50 |
| budget_range | $5,000-$10,000/month | 30 |
| budget_range | $2,000-$5,000/month | 15 |
| budget_range | Less than $2,000/month | 5 |
| timeline | Immediate/ASAP | 30 |
| timeline | 1-2 weeks | 20 |
| timeline | 1 month | 10 |
| call_volume | 100+/day | 30 |
| call_volume | 50-100/day | 20 |
| call_volume | 25-50/day | 10 |
| Tags | Voice Demo Completed | 50 |
| Tags | Strategy Session Request | 40 |
| Tags | ROI Calculator Used | 20 |

**Lead Tiers:**
- **HOT** (80+ points): Immediate sales follow-up within 5 minutes
- **WARM** (50-79 points): Follow-up within 24 hours
- **QUALIFIED** (30-49 points): Standard follow-up within 48 hours
- **NURTURE** (<30 points): Automated email sequence

---

## Automation Triggers Based on Custom Fields

Set up these automation rules in Apollo.io:

### HOT Lead Alert
**Trigger:** New contact with:
- `budget_range` = "$10,000+/month" OR
- Tag = "Voice Demo Completed" OR
- `timeline` = "Immediate/ASAP"

**Action:**
- Send Slack notification to #hot-leads
- Send email to sales@trainyouragent.com
- Add to "Hot Leads - Immediate Action" sequence
- Assign to sales rep

### Industry-Specific Sequences
**Trigger:** New contact with `industry` field populated

**Action:** Enroll in industry-specific email sequence:
- `industry` = "HVAC" → "HVAC Nurture Sequence"
- `industry` = "Legal" → "Legal Intake Sequence"
- `industry` = "Healthcare" → "Healthcare HIPAA Sequence"
- etc.

### Budget-Based Routing
**Trigger:** New contact with `budget_range` populated

**Action:**
- "$10,000+/month" → Assign to Senior Sales Rep
- "$5,000-$10,000/month" → Assign to Account Executive
- "$2,000-$5,000/month" → Assign to Inside Sales
- "Less than $2,000/month" → Automated nurture sequence only

---

## Integration Status Check

To verify your Apollo.io integration is working correctly:

1. **Check Edge Function Logs:**
   - Open Supabase Dashboard
   - Navigate to Edge Functions → apollo-proxy
   - Look for recent invocations
   - Verify "Contact created successfully" messages
   - Check for any error responses from Apollo API

2. **Check Browser Console:**
   - Open your website
   - Press F12 to open Developer Tools
   - Go to Console tab
   - Submit a form
   - Look for "Lead submitted to Apollo.io successfully"

3. **Check Apollo.io Dashboard:**
   - Go to Apollo.io → Contacts
   - Sort by "Date Added" (newest first)
   - Click on most recent contact
   - Scroll down to Custom Fields section
   - Verify all 14 fields are populated

4. **Check Tags:**
   - In Apollo.io contact view
   - Look for Tags section
   - Verify correct tags applied:
     - Source tag (e.g., "Strategy Session Request")
     - Industry tag (e.g., "HVAC", "Legal")

---

## Support & Troubleshooting

### If Custom Fields Are Not Populating:

1. Verify field names match exactly (case-sensitive)
2. Check that fields are set to "Contact" type
3. Test with a new lead submission
4. Check edge function logs for Apollo API errors
5. Contact Apollo.io support if API returns 422 errors

### If Contacts Are Not Being Created:

1. Verify API key is correct in `supabase/functions/apollo-proxy/index.ts`
2. Check edge function deployment status
3. Test edge function directly in Supabase dashboard
4. Verify network requests reach the edge function (Network tab in DevTools)

### Need Help?

- **Apollo.io Support:** support@apollo.io
- **TrainYourAgent Support:** support@trainyouragent.com
- **Edge Function Logs:** Check Supabase Dashboard → Edge Functions → apollo-proxy
- **Browser Console:** Press F12, check Console tab for errors

---

## Next Steps After Setup

Once all 14 custom fields are created and verified:

1. ✅ Submit a test lead from your website
2. ✅ Verify all fields populate in Apollo.io
3. ✅ Set up lead scoring rules
4. ✅ Create industry-specific email sequences
5. ✅ Configure hot lead alerts (Slack + Email)
6. ✅ Train sales team on using custom field data for pre-call research
7. ✅ Set up UTM parameter tracking in your ad campaigns

---

## Changelog

**Version 1.0** (2025-11-12)
- Initial setup guide created
- All 14 required custom fields documented
- Field types, dropdown options, and usage explained
- Verification checklist and troubleshooting guide added
