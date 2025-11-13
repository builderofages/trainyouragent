# Apollo.io Complete Configuration Guide

**CRITICAL:** This guide contains ALL required tags and custom fields that MUST be created in your Apollo.io dashboard BEFORE the TrainYourAgent website integration will work properly. Missing configuration will result in rejected contacts or lost qualification data.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Required Tags/Labels (15 Total)](#required-tagslabels-15-total)
3. [Required Custom Fields (14 Total)](#required-custom-fields-14-total)
4. [Step-by-Step Setup Instructions](#step-by-step-setup-instructions)
5. [Verification Checklist](#verification-checklist)
6. [Testing Your Configuration](#testing-your-configuration)
7. [Lead Scoring & Automation Setup](#lead-scoring--automation-setup)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### What This Integration Does

When properly configured, ALL lead capture forms on your site will automatically:
- ✅ Create contacts in Apollo.io with full contact information
- ✅ Add industry tags for vertical segmentation
- ✅ Add source tags for attribution tracking
- ✅ Capture 14 custom qualification fields
- ✅ Track UTM parameters from ad campaigns
- ✅ Include behavioral notes and engagement context

### Why Manual Configuration is Required

Apollo.io requires all custom fields and labels to be pre-created in your dashboard. The API cannot create these automatically. **If you skip this setup, leads will either be rejected entirely or critical qualification data will be silently lost.**

---

## Required Tags/Labels (15 Total)

Tags/Labels in Apollo.io are used for segmentation, automation triggers, and lead scoring. You must create all 15 tags listed below.

### Source Tags (6 Total)

These identify where the lead originated on your website:

1. **Strategy Session Request** ⭐ (CRITICAL - primary identifier)
2. **Voice Demo Request**
3. **ROI Calculator User**
4. **Timeline Estimator User**
5. **Newsletter Subscriber**
6. **Website Chat**

### Industry Tags (13 Total)

These identify which vertical the lead belongs to:

7. **HVAC**
8. **Accounting**
9. **Roofing**
10. **Legal**
11. **Healthcare**
12. **Logistics**
13. **Restaurants**
14. **Bars & Nightclubs**
15. **Spas**
16. **Hotels**
17. **Automotive**
18. **Real Estate**
19. **Solar**

### How to Create Tags in Apollo.io

1. Log into Apollo.io dashboard (https://app.apollo.io)
2. Navigate to **Settings** → **Labels**
3. Click **"+ New Label"** button
4. **Important:** Select **"Contact"** as the label type (NOT Company or Opportunity)
5. Enter the exact tag name from the list above (case-sensitive)
6. Optionally add a color to help visually distinguish tag categories
7. Click **"Save"**
8. Repeat for all 15 tags

**Pro Tip:** Use color coding:
- Source Tags → Blue
- Industry Tags → Green
- Engagement Tags → Orange

---

## Required Custom Fields (14 Total)

Custom fields capture detailed qualification data from lead forms. Each field must be created with the EXACT name and field type specified below.

### 1. industry

- **Field Name:** `industry` (lowercase, no spaces)
- **Field Type:** Dropdown (Single Select)
- **Required:** Yes
- **Dropdown Options (13 Total):**
  - HVAC
  - Accounting
  - Roofing
  - Legal
  - Healthcare
  - Logistics
  - Restaurants
  - Bars & Nightclubs
  - Spas
  - Hotels
  - Automotive
  - Real Estate
  - Solar

**Usage:** Identifies which industry vertical the lead came from. Used for segmentation, lead scoring, and industry-specific follow-up sequences.

**Lead Scoring Impact:** +10 points for high-complexity industries (Legal, Healthcare, Solar)

---

### 2. call_volume

- **Field Name:** `call_volume` (lowercase with underscore)
- **Field Type:** Dropdown (Single Select)
- **Required:** Yes (for Strategy Session leads)
- **Dropdown Options:**
  - Less than 25 calls/day
  - 25-50 calls/day
  - 50-100 calls/day
  - 100-200 calls/day
  - 200+ calls/day

**Usage:** Indicates business size and potential ROI. Higher call volume = higher priority lead.

**Lead Scoring Impact:**
- 200+ calls/day = +30 points
- 100-200 calls/day = +20 points
- 50-100 calls/day = +10 points
- 25-50 calls/day = +5 points

---

### 3. company_size

- **Field Name:** `company_size` (lowercase with underscore)
- **Field Type:** Dropdown (Single Select)
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

**Lead Scoring Impact:** +10 points for 51+ employees

---

### 4. current_solution

- **Field Name:** `current_solution` (lowercase with underscore)
- **Field Type:** Dropdown (Single Select)
- **Required:** Yes (for Strategy Session leads)
- **Dropdown Options:**
  - No system (manual handling)
  - Receptionist/Office Manager
  - Call Center/Answering Service
  - Basic IVR System
  - Competitor AI Solution
  - Other

**Usage:** Identifies what they're replacing. "No system" and "Manual handling" = highest intent. "Competitor AI Solution" = comparison shopping, needs differentiation messaging.

**Lead Scoring Impact:** +15 points for "No system" (highest intent)

---

### 5. biggest_challenge

- **Field Name:** `biggest_challenge` (lowercase with underscore)
- **Field Type:** Text (Long Text / Textarea)
- **Required:** Yes (for Strategy Session leads)
- **Max Length:** 1000 characters

**Usage:** Most important qualification data. Reveals pain points, urgency, and specific problems the prospect wants to solve. Used for personalized outreach and pre-call research.

**Example Values:**
- "We're missing 15-20 calls per day during lunch rush and losing reservations to competitors"
- "After-hours emergency calls go to voicemail and customers book with 24/7 competitors"
- "Our receptionist is overwhelmed and can't handle peak volume, leading to 10+ min hold times"

---

### 6. goals

- **Field Name:** `goals` (lowercase, no underscore)
- **Field Type:** Text (Long Text / Textarea)
- **Required:** Yes (for Strategy Session leads)
- **Max Length:** 1000 characters

**Usage:** Comma-separated list of selected goals from the lead gate form. Shows what success looks like to the prospect.

**Example Values:**
- "Capture more leads, Reduce missed calls, Improve response time"
- "Scale without hiring, Better after-hours coverage, Automate appointment scheduling"

---

### 7. timeline

- **Field Name:** `timeline` (lowercase, no spaces)
- **Field Type:** Dropdown (Single Select)
- **Required:** Yes (for Strategy Session leads)
- **Dropdown Options:**
  - Immediate/ASAP (need solution now)
  - 1-2 weeks
  - 1 month
  - 2-3 months
  - Just exploring (no timeline)

**Usage:** Urgency indicator for prioritizing follow-up. "Immediate/ASAP" triggers hot lead alerts.

**Lead Scoring Impact:**
- Immediate/ASAP = +30 points (hot lead)
- 1-2 weeks = +20 points
- 1 month = +10 points
- Just exploring = 0 points

---

### 8. budget_range

- **Field Name:** `budget_range` (lowercase with underscore)
- **Field Type:** Dropdown (Single Select)
- **Required:** Yes (for Strategy Session leads)
- **Dropdown Options:**
  - Less than $2,000/month
  - $2,000-$5,000/month
  - $5,000-$10,000/month
  - $10,000+/month

**Usage:** Budget qualification. Helps sales team focus on high-value opportunities first.

**Lead Scoring Impact:**
- $10K+/month = +50 points (hot lead trigger)
- $5K-10K/month = +30 points (warm lead trigger)
- $2K-5K/month = +15 points
- <$2K/month = +5 points

---

### 9. lead_source

- **Field Name:** `lead_source` (lowercase with underscore)
- **Field Type:** Text (Short Text)
- **Required:** Yes (all leads)
- **Max Length:** 255 characters

**Usage:** Tracks specific page or component where lead was captured.

**Example Values:**
- "HVAC Landing Page - Hero CTA"
- "Voice Demo - Healthcare"
- "ROI Calculator - Legal"
- "Newsletter Signup - Resources Page"

---

### 10. additional_context

- **Field Name:** `additional_context` (lowercase with underscore)
- **Field Type:** Text (Long Text / Textarea)
- **Required:** No (optional field)
- **Max Length:** 2000 characters

**Usage:** Free-form text box for prospects to share additional information not captured by structured fields.

---

### 11. submitted_at

- **Field Name:** `submitted_at` (lowercase with underscore)
- **Field Type:** Date (Date/Time)
- **Required:** Yes (all leads)

**Usage:** Timestamp of form submission. Used for response time tracking and SLA monitoring.

**Format:** ISO 8601 (e.g., "2025-01-15T14:32:00Z")

---

### 12. utm_source

- **Field Name:** `utm_source` (lowercase with underscore)
- **Field Type:** Text (Short Text)
- **Required:** No (captured if present in URL)
- **Max Length:** 255 characters

**Usage:** Tracks traffic source from UTM parameters for ad campaign attribution.

**Example Values:** "google", "facebook", "linkedin", "organic"

---

### 13. utm_medium

- **Field Name:** `utm_medium` (lowercase with underscore)
- **Field Type:** Text (Short Text)
- **Required:** No (captured if present in URL)
- **Max Length:** 255 characters

**Usage:** Tracks marketing medium from UTM parameters.

**Example Values:** "cpc", "social", "email", "display"

---

### 14. utm_campaign

- **Field Name:** `utm_campaign` (lowercase with underscore)
- **Field Type:** Text (Short Text)
- **Required:** No (captured if present in URL)
- **Max Length:** 255 characters

**Usage:** Tracks specific campaign name from UTM parameters.

**Example Values:** "hvac-emergency-q1", "legal-leads-summer", "healthcare-expansion"

---

## Step-by-Step Setup Instructions

### Part 1: Create All Custom Fields

1. Log into Apollo.io dashboard (https://app.apollo.io)
2. Click your profile picture (top-right) → **"Settings"**
3. In left sidebar, click **"Custom Fields"**
4. Click **"+ New Custom Field"** button
5. **IMPORTANT:** Select **"Contact"** as the field type (NOT Company or Opportunity)
6. Fill in the field details:
   - **Field Name:** Enter EXACT name from list above (e.g., `call_volume`)
   - **Field Type:** Select correct type (Dropdown, Text, Date)
   - **For Dropdown Fields:** Click "Add Option" and enter each dropdown value EXACTLY as listed
7. Click **"Save"**
8. Repeat steps 4-7 for all 14 custom fields

**Critical Notes:**
- Field names are case-sensitive and MUST use underscores where specified
- Dropdown options must match EXACTLY (including capitalization and punctuation)
- Missing fields will cause API errors or data loss

### Part 2: Create All Tags/Labels

1. In Apollo.io dashboard, go to **Settings** → **Labels**
2. Click **"+ New Label"**
3. Select **"Contact"** as the label type
4. Enter exact tag name from the list above
5. Optionally assign a color for visual organization
6. Click **"Save"**
7. Repeat for all 15 tags

### Part 3: Verify Configuration

After creating all fields and tags, verify they exist:

**Custom Fields:**
- Go to Settings → Custom Fields → Filter by "Contact" type
- You should see all 14 fields listed
- Click each field to verify dropdown options are correct

**Tags/Labels:**
- Go to Settings → Labels
- Filter by "Contact" type
- You should see all 15 tags listed

---

## Verification Checklist

Use this checklist to ensure your Apollo.io configuration is complete:

### Custom Fields (14 Total)
- [ ] `industry` (Dropdown with 13 industries)
- [ ] `call_volume` (Dropdown with 5 options)
- [ ] `company_size` (Dropdown with 7 options)
- [ ] `current_solution` (Dropdown with 6 options)
- [ ] `biggest_challenge` (Long Text)
- [ ] `goals` (Long Text)
- [ ] `timeline` (Dropdown with 5 options)
- [ ] `budget_range` (Dropdown with 4 options)
- [ ] `lead_source` (Short Text)
- [ ] `additional_context` (Long Text)
- [ ] `submitted_at` (Date/Time)
- [ ] `utm_source` (Short Text)
- [ ] `utm_medium` (Short Text)
- [ ] `utm_campaign` (Short Text)

### Source Tags (6 Total)
- [ ] Strategy Session Request
- [ ] Voice Demo Request
- [ ] ROI Calculator User
- [ ] Timeline Estimator User
- [ ] Newsletter Subscriber
- [ ] Website Chat

### Industry Tags (13 Total)
- [ ] HVAC
- [ ] Accounting
- [ ] Roofing
- [ ] Legal
- [ ] Healthcare
- [ ] Logistics
- [ ] Restaurants
- [ ] Bars & Nightclubs
- [ ] Spas
- [ ] Hotels
- [ ] Automotive
- [ ] Real Estate
- [ ] Solar

### API Configuration
- [ ] Apollo.io API key added to `src/config/site.ts`
- [ ] Edge function proxy deployed (`supabase/functions/apollo-proxy`)

---

## Testing Your Configuration

### Test Lead Submission (End-to-End)

1. **Navigate to a landing page:** Go to https://yourdomain.com/hvac
2. **Click CTA button:** "Get Your Free Strategy Session"
3. **Complete lead gate form:**
   - Step 1: Enter contact info (name, email, phone, company)
   - Step 2: Select industry (HVAC), call volume (50-100/day), company size, current solution
   - Step 3: Enter biggest challenge, select goals, choose timeline
   - Step 4: Select budget range, add additional context
4. **Submit form:** Click "Schedule My Strategy Session"
5. **Check browser console:** Should see success message
6. **Verify in Apollo.io:**
   - Go to Apollo.io → Contacts
   - Search for the email you used
   - Contact should appear within 1 minute

### Verify Contact Data

Click the contact in Apollo.io and check:

**✅ Basic Fields Populated:**
- First Name
- Last Name
- Email
- Phone
- Company Name

**✅ Tags Applied:**
- "Strategy Session Request" tag
- "HVAC" tag (or whichever industry you selected)

**✅ Custom Fields Populated:**
- Scroll down to "Custom Fields" section
- All 14 fields should show values you entered in the form
- Dropdowns should show selected option (not field names or errors)

### Common Test Failures & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| **400 Bad Request** | Field name mismatch | Verify field names use correct underscores and capitalization |
| **Contact created but missing custom fields** | Custom fields not created in Apollo | Create all 14 custom fields in Settings → Custom Fields |
| **Tags missing from contact** | Labels not created in Apollo | Create all 15 tags in Settings → Labels |
| **Dropdown values rejected** | Dropdown options don't match | Edit custom field and add missing dropdown options EXACTLY as listed |
| **No contact created at all** | API key invalid or missing | Verify API key in `src/config/site.ts` |
| **CORS error in browser console** | Direct API call instead of edge function | Ensure `apollo-integration.ts` uses `supabase.functions.invoke()` |

---

## Lead Scoring & Automation Setup

### Hot Lead Scoring Formula

Automatically calculate lead score using custom field values:

**Budget Tier (50 points max):**
- $10,000+/month = 50 points
- $5,000-$10,000/month = 30 points
- $2,000-$5,000/month = 15 points
- <$2,000/month = 5 points

**Timeline Urgency (30 points max):**
- Immediate/ASAP = 30 points
- 1-2 weeks = 20 points
- 1 month = 10 points
- 2-3 months = 5 points
- Just exploring = 0 points

**Call Volume (30 points max):**
- 200+ calls/day = 30 points
- 100-200 calls/day = 20 points
- 50-100 calls/day = 10 points
- 25-50 calls/day = 5 points
- <25 calls/day = 2 points

**Engagement Tags (50 points max):**
- Voice Demo Completed = 50 points
- Strategy Session Request = 40 points
- ROI Calculator Used = 20 points
- Timeline Estimator Used = 10 points

**Industry Complexity (10 points max):**
- Legal/Healthcare/Solar = 10 points (high-complexity, higher ACV)
- All other industries = 5 points

### Lead Tiers

Based on total score:

- **HOT (80+ points):** Immediate action required within 2 minutes
- **WARM (50-79 points):** Follow up same day
- **QUALIFIED (30-49 points):** Follow up within 24 hours
- **NURTURE (<30 points):** Add to educational email sequence

### Hot Lead Automation (Zapier/Make.com)

**Trigger:** New Contact Created in Apollo.io

**Filter Conditions (ANY of):**
- Has tag "Strategy Session Request" AND `budget_range` = "$10,000+/month"
- Has tag "Strategy Session Request" AND `budget_range` = "$5,000-$10,000/month" AND `timeline` = "Immediate/ASAP"
- Has tag "Voice Demo Completed"
- Custom field `call_volume` = "200+ calls/day"

**Actions:**
1. **Send Slack Message** to #hot-leads channel:
   ```
   🔥 HOT LEAD ALERT
   Name: {{first_name}} {{last_name}}
   Company: {{company_name}}
   Industry: {{industry}}
   Budget: {{budget_range}}
   Timeline: {{timeline}}
   Challenge: {{biggest_challenge}}
   Phone: {{phone}}
   Email: {{email}}
   
   👉 View in Apollo: [Apollo Profile Link]
   
   ⏰ Response Time Goal: 5 minutes
   ```

2. **Send Email** to sales@trainyouragent.com with same details

3. **Add to Google Sheet** for tracking response times and outcomes

4. **Update Lead Score** custom field with calculated total

### Warm Lead Automation

**Trigger:** New Contact Created in Apollo.io

**Filter Conditions:**
- Has tag "Strategy Session Request"
- `budget_range` = "$2,000-$5,000/month" OR "$5,000-$10,000/month"
- `timeline` = "1-2 weeks" OR "1 month"
- Does NOT meet hot lead criteria

**Actions:**
1. Send Slack message to #warm-leads (lower priority)
2. Add to "Warm Leads - Follow Up Today" view in Apollo
3. Trigger "Strategy Session Follow-Up" email sequence (see email templates)

### Apollo.io Views to Create

**1. Hot Leads - Immediate Action**
- Filters: Has tag "Strategy Session Request", budget ≥$5K, timeline ≤ 1 month
- Sort: Created date (newest first)
- Auto-assign: Round robin to sales team

**2. Warm Leads - Follow Up Today**
- Filters: Has tag "Strategy Session Request", budget $2K-$10K, timeline ≤ 2 months
- Sort: Budget (highest first), then timeline (most urgent first)

**3. Recent Voice Demos - Call ASAP**
- Filters: Has tag "Voice Demo Completed", created in last 24 hours
- Sort: Created date (newest first)

**4. High Budget Prospects**
- Filters: `budget_range` = "$10,000+/month"
- Sort: Created date (newest first)

**5. Stalled Hot Leads - Re-Activation**
- Filters: Hot lead score (80+), last contacted >3 days ago, no reply
- Sort: Last contacted (oldest first)

---

## Troubleshooting

### Issue: "Something went wrong" error during form submission

**Possible Causes:**
1. Apollo.io API key missing or invalid
2. Custom field name mismatch
3. Dropdown value not in allowed list
4. CORS error (calling API directly instead of via edge function)

**Debug Steps:**
1. Open browser console (F12)
2. Look for detailed error message
3. Check Network tab for failed API requests
4. Verify Apollo.io API key in `src/config/site.ts`
5. Check `supabase/functions/apollo-proxy/index.ts` logs in Supabase dashboard

### Issue: Contact created but custom fields are empty

**Cause:** Custom fields not created in Apollo.io dashboard

**Fix:**
1. Go to Apollo.io → Settings → Custom Fields
2. Create all 14 custom fields with EXACT names as listed in this guide
3. Test form submission again

### Issue: Tags not applied to contact

**Cause:** Labels not created in Apollo.io dashboard

**Fix:**
1. Go to Apollo.io → Settings → Labels
2. Create all 15 tags with EXACT names as listed in this guide
3. Ensure label type is "Contact" (not Company or Opportunity)
4. Test form submission again

### Issue: Dropdown field shows "invalid value" in Apollo

**Cause:** Submitted dropdown value not in the allowed options list

**Fix:**
1. Go to Apollo.io → Settings → Custom Fields
2. Find the dropdown field showing invalid values
3. Click "Edit" on that field
4. Add the missing dropdown option EXACTLY as it appears in the form
5. Save field

### Issue: Contact created but with wrong industry tag

**Cause:** Industry pre-selection not working on landing pages

**Fix:**
1. Check landing page code for `defaultIndustry` prop on `StrategySessionLeadGate` component
2. Verify industry name matches EXACTLY (e.g., "Bars & Nightclubs" not "Bars and Nightclubs")
3. Clear browser cache and test again

---

## Support & Resources

**Apollo.io Support:**
- Help Center: https://help.apollo.io
- Email: support@apollo.io
- Live Chat: Available in Apollo.io dashboard

**Related Documentation:**
- [Apollo.io Custom Fields Setup](./APOLLO_CUSTOM_FIELDS_SETUP.md) - Detailed field creation guide
- [Apollo.io Integration Guide](./APOLLO_INTEGRATION_GUIDE.md) - Complete integration setup
- [Integration Setup Guide](./INTEGRATION_SETUP_GUIDE.md) - All integrations (Apollo, VAPI, Analytics)

**Internal Support:**
- Email: tech@trainyouragent.com
- Slack: #tech-support channel

---

## Configuration Complete Checklist

Before launching your website, verify:

- [ ] All 14 custom fields created with correct names and types
- [ ] All dropdown fields have complete option lists (13 industries, 5 call volumes, etc.)
- [ ] All 15 tags/labels created as Contact-type labels
- [ ] Apollo.io API key added to `src/config/site.ts`
- [ ] Edge function proxy deployed and working
- [ ] Test lead submission successful
- [ ] Test contact appears in Apollo with all data
- [ ] Hot lead Slack/email automation configured
- [ ] Lead scoring views created in Apollo
- [ ] Sales team trained on hot lead response process

---

**Last Updated:** January 2025  
**Version:** 2.0 (13 Industries)  
**Maintained By:** TrainYourAgent Technical Team
