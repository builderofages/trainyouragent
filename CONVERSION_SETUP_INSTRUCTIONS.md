# Conversion Features Setup Instructions

## 🎯 Overview
All conversion features have been implemented and are ready for configuration. This guide will help you set up the final pieces.

---

## ✅ Completed Features

### 1. **Exit-Intent Popup** ✓
- Shows when users try to leave the page
- Captures emails for "Free ROI Calculator" lead magnet
- Session-based (shows once per session)
- Location: Active on all pages

### 2. **Live Chat Widget** ✓
- Tawk.to integration ready
- Component created and added to homepage
- Location: `src/components/conversion/LiveChat.tsx`

### 3. **Trust Badges** ✓
- SSL, GDPR, Industry Leading, Satisfaction Guaranteed
- Two variants: full cards and compact
- Added to hero section and demo request page
- Location: `src/components/conversion/TrustBadges.tsx`

### 4. **Social Proof Notifications** ✓
- "John from Miami just booked a demo" style popups
- Appears in bottom-left corner (desktop only)
- Randomized notifications every 15-25 seconds
- Location: Active on homepage

### 5. **Multi-Step Form** ✓
- 3-step conversion form with progress bar
- Industry selection → Contact details → Needs assessment
- Form summary before submission
- Dedicated page: `/demo-request`
- Location: `src/components/conversion/MultiStepForm.tsx`

### 6. **Legal Pages** ✓
- Updated Privacy Policy with Florida business info
- Updated Terms of Service with proper contact details
- NEW Cookie Policy page added
- All footer links fixed to proper routes

### 7. **Site Configuration** ✓
- Updated email to `support@trainyouragent.com`
- Added real social media URLs (Twitter, LinkedIn, Instagram)
- All footer links now route correctly

---

## 🔧 Setup Required

### **Step 1: Monday.com Webhook Setup**

All forms submit to Monday.com webhooks. You need to create webhooks and add the URLs.

#### How to Create Monday.com Webhooks:

1. Go to your Monday.com board
2. Click "Integrations" → "Webhooks"
3. Create a new webhook
4. Copy the webhook URL
5. Replace in the following files:

**Files to update:**

1. **Exit Popup**: `src/components/conversion/ExitPopup.tsx`
   - Line 42: Replace `YOUR_MONDAY_WEBHOOK_URL`

2. **Multi-Step Form**: `src/components/conversion/MultiStepForm.tsx`
   - Line 87: Replace `YOUR_MONDAY_WEBHOOK_URL`

3. **Newsletter Section**: `src/components/NewsletterSectionEnhanced.tsx`
   - Find the webhook URL placeholder and replace it

4. **Sticky CTA**: `src/components/StickyCTA.tsx`
   - Find the webhook URL placeholder and replace it

---

### **Step 2: Tawk.to Live Chat Setup**

1. Sign up for free at [Tawk.to](https://www.tawk.to/)
2. Create a new property for your website
3. Get your Property ID and Widget ID
4. Update `src/components/conversion/LiveChat.tsx`:
   - Line 7: Replace `YOUR_TAWK_PROPERTY_ID`
   - Line 8: Replace `YOUR_TAWK_WIDGET_ID`

**Note**: Until configured, live chat won't appear (no errors will show).

---

### **Step 3: Test All Features**

#### Exit Popup Test:
1. Visit homepage
2. Move mouse cursor to top of browser (like you're leaving)
3. Popup should appear
4. Submit email and check Monday.com

#### Social Proof Test:
1. Visit homepage
2. Wait 3 seconds
3. Notification should appear in bottom-left
4. More appear every 15-25 seconds

#### Multi-Step Form Test:
1. Visit `/demo-request`
2. Complete all 3 steps
3. Submit and check Monday.com

#### Live Chat Test:
1. Add Tawk.to credentials
2. Visit homepage
3. Chat widget should appear in bottom-right

---

## 📊 Analytics Setup (Optional - Not Yet Implemented)

When you're ready to add analytics tracking:

### Google Analytics 4:
- I can add GA4 tracking
- Tracks page views, conversions, form submissions
- **Requires**: Your GA4 Measurement ID

### Meta Pixel:
- I can add Facebook/Meta Pixel
- Tracks conversions for ad campaigns
- **Requires**: Your Meta Pixel ID

**To implement**: Provide your GA4 Measurement ID and/or Meta Pixel ID

---

## 🎨 Customization Options

### Exit Popup:
- **Headline**: Line 81 in `ExitPopup.tsx`
- **Offer**: Line 84 (currently "Free ROI Calculator")
- **Button text**: Line 109

### Social Proof Notifications:
- **Messages**: Lines 18-25 in `SocialProof.tsx`
- **Timing**: Line 38 (currently 15-25 second intervals)
- **Display duration**: Line 34 (currently 5 seconds)

### Trust Badges:
- **Messages**: Lines 12-27 in `TrustBadges.tsx`
- **Icons**: Change icons from lucide-react

### Multi-Step Form:
- **Industries**: Line 35 in `MultiStepForm.tsx`
- **Company Sizes**: Line 40
- **Questions**: Modify steps 1-3 in the form

---

## 📝 Summary Checklist

- [ ] Add Monday.com webhook URLs (4 files)
- [ ] Configure Tawk.to live chat credentials
- [ ] Test exit popup on homepage
- [ ] Test social proof notifications
- [ ] Test multi-step form at `/demo-request`
- [ ] Verify all footer links work
- [ ] Check Cookie Policy page at `/cookie-policy`
- [ ] Test email submission to Monday.com
- [ ] (Optional) Add Google Analytics 4
- [ ] (Optional) Add Meta Pixel for ads

---

## 🚀 Ready to Launch!

Once webhooks are configured:
1. Test all forms
2. Verify submissions in Monday.com
3. Check live chat works
4. Review all legal pages
5. Test social proof notifications
6. Deploy to production!

---

## 📧 Need Help?

If you need assistance with:
- Custom webhook configurations
- Analytics implementation
- Additional conversion features
- Form customization

Just ask and I'll help you implement it!
