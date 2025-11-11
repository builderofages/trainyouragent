# Apollo.io Integration Guide

Complete instructions to connect your TrainYourAgent site to Apollo.io CRM for lead management.

---

## 🎯 What Apollo.io Integration Does

When properly configured, ALL lead capture forms on your site will automatically:
- ✅ Create contacts in Apollo.io with full contact information
- ✅ Add industry tags (HVAC, Legal, Healthcare, etc.)
- ✅ Add source tags (HVAC Landing, Voice Demo Request, Newsletter, etc.)
- ✅ Capture custom fields (call volume, budget, timeline, challenges, goals)
- ✅ Track UTM parameters from ad campaigns for attribution
- ✅ Include behavioral notes and engagement context

**Lead capture points that send to Apollo.io:**
1. **Strategy Session Lead Gate** - 4-step qualification form before booking
2. **Voice Demo Lead Gate** - Lead capture before voice demo activation
3. **Chat Lead Capture** - Website chat widget submissions
4. **Newsletter Signups** - Email capture for content marketing
5. **ROI Calculator** - Lead magnet for calculator results PDF
6. **Timeline Estimator** - Personalized timeline estimation tool
7. **Solution Configurator** - Custom solution roadmap generator
8. **Landing Page Forms** - All 8 industry-specific landing page forms

---

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] Active Apollo.io account (Free or Paid plan)
- [ ] Admin or API access permissions in Apollo.io
- [ ] Code access to your project files

---

## Step 1: Get Your Apollo.io API Key

### 1.1 Log into Apollo.io
Navigate to: **https://app.apollo.io**

### 1.2 Access API Settings
1. Click your profile picture (top-right corner)
2. Select **"Settings"** from dropdown
3. In left sidebar, click **"API & Integrations"**
4. Click **"Create API Key"** button

### 1.3 Create New API Key
1. **Name:** `TrainYourAgent Website`
2. **Description (optional):** `Lead capture from website forms, voice demos, and calculators`
3. Click **"Create"**

### 1.4 Copy Your API Key
- Your API key will appear once (starts with something like `YXBpLXVzZX...`)
- **IMPORTANT:** Save it immediately - you cannot view it again!
- Click **"Copy"** button to clipboard

---

## Step 2: Add API Key to Your Project

### 2.1 Open Configuration File
Open file: **`src/config/site.ts`**

### 2.2 Locate Apollo Configuration Section
Find this section (around line 20-23):
```typescript
// Apollo.io Integration
apollo: {
  apiKey: "", // TODO: Add your Apollo.io API key from Integration Setup Guide
},
```

### 2.3 Add Your API Key
Replace the empty string with your API key:
```typescript
// Apollo.io Integration
apollo: {
  apiKey: "YXBpLXVzZXItNjQxMzU2OjY0MTM1NjphcGlrZXk6UVdGelkyRnNkR1Z5", // Your actual API key
},
```

### 2.4 Save File
Save `src/config/site.ts` - Apollo.io integration is now active!

---

## Step 3: Configure Labels/Tags in Apollo.io

To properly organize and segment your leads, create these labels in Apollo.io:

### 3.1 Access Label Management
1. In Apollo.io, go to **Settings → Labels**
2. Click **"Create Label"**

### 3.2 Create Source Labels
Create these labels to track lead origin:

**Format:** `Website [Source Type]`
- `Website Chat Lead`
- `Voice Demo Request`
- `ROI Calculator User`
- `Timeline Estimator`
- `Newsletter Subscriber`
- `Solution Configurator`
- `Strategy Session Request`

**Industry Landing Pages:**
- `HVAC Landing`
- `Legal Landing`
- `Healthcare Landing`
- `Accounting Landing`
- `Restaurants Landing`
- `Roofing Landing`
- `Logistics Landing`
- `Bars & Nightclubs Landing`

### 3.3 Create Industry Labels
Create labels for each vertical you serve:
- `HVAC`
- `Legal`
- `Healthcare`
- `Accounting`
- `Restaurants`
- `Roofing`
- `Logistics`
- `Bars & Nightclubs`

### 3.4 Create Engagement Labels (Optional)
Track high-value engagement:
- `Voice Demo Completed`
- `ROI Calculator Used`
- `Timeline Estimated`
- `High Budget ($5K+)`
- `Urgent Timeline`

---

## Step 4: Configure Custom Fields (Optional but Recommended)

Custom fields allow you to capture qualification data beyond basic contact info.

### 4.1 Access Custom Fields
1. Go to **Settings → Custom Fields**
2. Click **"Create Custom Field"**

### 4.2 Create These Custom Fields

| Field Name | Field Type | Purpose |
|------------|------------|---------|
| `Lead Source` | Single-line text | Track specific page/component where lead came from |
| `Industry` | Dropdown | Industry vertical (auto-populated from forms) |
| `Call Volume` | Dropdown | Daily/weekly call volume (for qualification) |
| `Company Size` | Dropdown | Number of employees |
| `Current Solution` | Dropdown | What they use now (answering service, voicemail, etc.) |
| `Biggest Challenge` | Multi-line text | Free-form description of main pain point |
| `Goals` | Multi-line text | Business objectives (comma-separated) |
| `Timeline` | Dropdown | Implementation urgency |
| `Budget Range` | Dropdown | Monthly budget for AI solution |
| `How Found Us` | Dropdown | Discovery channel (Google, LinkedIn, Referral, etc.) |
| `Notes` | Multi-line text | Additional context from forms |
| `UTM Source` | Single-line text | Ad campaign source parameter |
| `UTM Medium` | Single-line text | Ad campaign medium parameter |
| `UTM Campaign` | Single-line text | Ad campaign name parameter |

### 4.3 Dropdown Options (Suggested)

**Call Volume:**
- Less than 10 per day
- 10-25 per day
- 25-50 per day
- 50-100 per day
- 100+ per day

**Company Size:**
- 1-5 employees
- 6-20 employees
- 21-50 employees
- 51-100 employees
- 100+ employees

**Current Solution:**
- No receptionist (voicemail only)
- Human receptionist
- Answering service
- Other AI system
- Nothing (handling ourselves)

**Timeline:**
- Urgent - need ASAP
- 1-2 weeks
- 1 month
- Just exploring
- Not sure yet

**Budget Range:**
- Less than $1,000/month
- $1,000-2,000/month
- $2,000-3,000/month
- $3,000-5,000/month
- $5,000+/month
- Need recommendation

---

## Step 5: Test Lead Capture

### 5.1 Test Strategy Session Lead Gate
1. Visit your homepage: `https://yourdomain.com`
2. Click **"Get Your Free Strategy Session"** button
3. Fill out all 4 steps of the form
4. Submit form
5. Check Apollo.io for new contact

**Expected Result:**
- New contact created with name, email, phone, company
- Tagged with: `Strategy Session Request`, `[Industry]`
- Custom fields populated with form data

### 5.2 Test Voice Demo Lead Gate
1. Visit homepage and scroll to Voice Agent Demo section
2. Click **"Start Voice Demo"**
3. Fill out lead capture form (name, email, phone, industry)
4. Submit form
5. Check Apollo.io

**Expected Result:**
- Contact created/updated
- Tagged with: `Voice Demo Request`, `[Industry]`

### 5.3 Test Industry Landing Page
1. Visit: `https://yourdomain.com/hvac` (or any industry page)
2. Click primary CTA button
3. Fill out strategy session form (industry should be pre-selected to HVAC)
4. Submit form
5. Check Apollo.io

**Expected Result:**
- Contact created
- Tagged with: `Strategy Session Request`, `HVAC`, `HVAC Landing`
- Industry field = "HVAC"

### 5.4 Test Newsletter Signup
1. Scroll to bottom of any page
2. Enter email in newsletter signup field
3. Submit
4. Check Apollo.io

**Expected Result:**
- Contact created with email only
- Tagged with: `Newsletter Subscriber`

---

## Step 6: Verify Data Flow

### 6.1 Check Browser Console (For Testing)
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Submit a form
4. Look for log message: `"Lead sent to Apollo.io successfully: [contact_id]"`

If you see errors like:
- `"Apollo.io API key not configured"` → API key missing in `src/config/site.ts`
- `"Apollo.io API error: 401"` → Invalid API key
- `"Apollo.io API error: 403"` → API key doesn't have required permissions

### 6.2 Check Apollo.io Contact Created
1. In Apollo.io, go to **People** tab
2. Search for the email you submitted
3. Click contact to view details
4. Verify:
   - ✅ Contact info (name, email, phone, company) is correct
   - ✅ Tags/labels are applied
   - ✅ Custom fields are populated
   - ✅ UTM parameters captured (if you came from an ad)

---

## Step 7: Set Up Lead Routing & Notifications

### 7.1 Create Sequences for Auto-Follow-Up
1. Go to **Sequences** in Apollo.io
2. Create sequence: **"Website Lead - Immediate Follow-Up"**
3. Add email steps:
   - **Step 1 (Immediate):** Welcome email with booking link
   - **Step 2 (1 day):** Value proposition + case study
   - **Step 3 (3 days):** ROI calculator results (if they used it)

### 7.2 Set Up Slack/Email Notifications
1. Go to **Settings → Integrations**
2. Connect **Slack** or **Email** integration
3. Configure notifications for:
   - New contacts added with tag: `Strategy Session Request`
   - Contacts with budget: `$5,000+/month`
   - Contacts with timeline: `Urgent - need ASAP`

### 7.3 Create Views for Lead Prioritization
**Hot Leads View:**
- Filter: Tag = `Strategy Session Request`
- Filter: Budget Range = `$3,000+`
- Filter: Timeline = `Urgent` OR `1-2 weeks`

**Voice Demo Completions:**
- Filter: Tag = `Voice Demo Completed`
- Sort: Created date (newest first)

**ROI Calculator Users:**
- Filter: Tag = `ROI Calculator User`
- Custom field: `Calculated Savings` > $50,000

---

## Troubleshooting

### Issue: "Apollo.io API key not configured"
**Solution:** API key is missing or empty in `src/config/site.ts`
1. Verify API key is correctly pasted
2. Check for extra spaces or quotes
3. Save file and refresh browser

### Issue: Leads not appearing in Apollo.io
**Possible causes:**
1. **API Key Invalid:** Generate new API key in Apollo.io
2. **Rate Limits:** Apollo.io free plan has API limits (check your plan)
3. **Network Blocking:** Check browser console for CORS errors

### Issue: Custom fields not populated
**Solution:**
1. Verify custom field names match exactly (case-sensitive)
2. Check field types (dropdown vs text)
3. Re-create custom fields if needed

### Issue: Tags not applied
**Solution:**
1. Create missing labels/tags in Apollo.io first
2. Tag names must match exactly
3. Refresh Apollo.io contact to see tags

### Issue: Duplicate contacts created
**Expected behavior:** Apollo.io de-duplicates by email
- If you submit same email multiple times, Apollo updates existing contact
- Check Apollo.io settings for duplicate detection rules

---

## Lead Data Structure Reference

### Strategy Session Lead Gate Data
```javascript
{
  first_name: "John",
  last_name: "Smith",
  email: "john@hvaccompany.com",
  phone: "(555) 123-4567",
  organization_name: "Smith HVAC Services",
  label_names: ["Strategy Session Request", "HVAC", "HVAC Landing"],
  custom_fields: {
    industry: "HVAC",
    call_volume: "25-50 per day",
    company_size: "6-20 employees",
    current_solution: "Human receptionist",
    biggest_challenge: "Missing after-hours emergency calls",
    goals: "Capture 100% of calls, Reduce staff workload, Generate more revenue",
    timeline: "1-2 weeks",
    budget_range: "$2,000-3,000/month",
    lead_source: "Website - HVAC Landing Page",
    additional_context: "Our receptionist can't handle weekends",
    submitted_at: "2025-01-15T14:30:00Z",
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "hvac-emergency-calls"
  }
}
```

### Voice Demo Lead Gate Data
```javascript
{
  first_name: "Sarah",
  last_name: "Johnson",
  email: "sarah@legalfirm.com",
  phone: "(555) 987-6543",
  label_names: ["Voice Demo Request", "Legal"],
  custom_fields: {
    industry: "Legal",
    lead_source: "Voice Demo Widget",
    submitted_at: "2025-01-15T15:45:00Z"
  }
}
```

---

## Next Steps After Integration

### 1. Monitor Lead Quality
Track these metrics weekly:
- Number of leads per source
- Conversion rate: Lead → Strategy Session Booked
- Average lead response time
- Lead quality score (custom field)

### 2. Optimize Landing Pages
Analyze Apollo.io data:
- Which industry landing pages generate most leads?
- Which budget ranges convert best?
- What pain points appear most frequently?

### 3. Refine Follow-Up Sequences
Test variations:
- Email subject lines
- Follow-up timing (1 day vs 2 days)
- Content offers (case study vs ROI calculator)

### 4. Scale Ad Campaigns
Use Apollo.io data to:
- Identify highest-ROI industries
- Optimize ad spend by conversion rate
- Create lookalike audiences from best leads

---

## Support

**Apollo.io Support:**
- Email: support@apollo.io
- Help Center: https://help.apollo.io
- API Documentation: https://apolloio.github.io/apollo-api-docs/

**TrainYourAgent Support:**
- Email: support@trainyouragent.com
- For integration issues, include:
  - Browser console screenshot
  - Test lead details (name/email submitted)
  - Apollo.io account email

---

## Security & Compliance

### API Key Security
- ✅ **NEVER** commit API keys to public repositories (e.g., GitHub)
- ✅ Use environment variables for production deployments
- ✅ Rotate API keys every 90 days (best practice)
- ✅ Restrict API key permissions to minimum required (read/write contacts only)

### GDPR & Privacy Compliance
- ✅ Privacy Policy mentions third-party CRM usage (Apollo.io)
- ✅ Contact forms include consent checkbox (optional but recommended)
- ✅ Provide unsubscribe mechanism in email sequences
- ✅ Honor data deletion requests (GDPR Article 17)

### Data Retention
- Apollo.io stores contact data indefinitely by default
- Configure retention policies in Apollo.io settings
- Regularly audit and clean inactive leads

---

## FAQ

**Q: Does Apollo.io integration cost extra?**
A: No, Apollo.io has a free tier. Paid plans offer higher API limits and advanced features.

**Q: What happens if my API key expires?**
A: Leads will fail to sync. You'll see errors in browser console. Generate a new API key and update `site.ts`.

**Q: Can I use a different CRM instead of Apollo.io?**
A: Yes, but you'll need custom integration development. Apollo.io code is in `src/lib/apollo-integration.ts`.

**Q: How quickly do leads appear in Apollo.io?**
A: Immediately (1-2 seconds) after form submission if API key is configured correctly.

**Q: Can I test without a real Apollo.io account?**
A: Partially. Forms will still work, but you'll see console warnings: `"Apollo.io API key not configured"`.

**Q: Does this work with Apollo.io's Salesforce integration?**
A: Yes! If you sync Apollo.io → Salesforce, website leads flow to both systems automatically.

---

## Changelog

**Version 1.0** (Current)
- Initial Apollo.io integration
- 8 lead capture points configured
- Custom field mapping
- UTM parameter tracking
- sessionStorage duplicate prevention

---

**🎉 Integration Complete!**

Your site is now sending qualified leads directly to Apollo.io with full context for your sales team.
