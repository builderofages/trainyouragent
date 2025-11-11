# Integration Setup Guide

Complete step-by-step instructions for configuring Apollo.io, VAPI, Tawk.to, and Analytics.

## 1. Apollo.io Integration

### Get Your API Key
1. Log into Apollo.io (https://app.apollo.io)
2. Settings → API & Integrations → Create API Key
3. Copy the API key (starts with "...")

### Add to Project
Open `src/config/site.ts` and add your key:
```typescript
apollo: {
  apiKey: "your_apollo_api_key_here",
}
```

### Create Labels in Apollo
- Website Chat Lead
- Voice Demo Request
- ROI Calculator User
- Timeline Estimator
- Newsletter Subscriber
- [Industry] Landing Page (for each industry)

## 2. VAPI Voice Agent Configuration

### Get Public Key
1. Go to https://vapi.ai
2. Dashboard → Settings → API Keys
3. Copy "Public Key"
4. Add to `src/lib/vapi-config.ts` line 3

### Optional: Phone Number
1. VAPI Dashboard → Phone Numbers → Purchase
2. Copy number format: "+15551234567"
3. Add to `src/config/site.ts`:
```typescript
phoneNumber: "+15551234567",
phoneNumberDisplay: "(555) 123-4567"
```

## 3. Tawk.to Live Chat

### Setup (FREE)
1. Sign up at https://www.tawk.to
2. Create property: "TrainYourAgent Website"
3. Get Property ID and Widget ID
4. Update `src/components/conversion/LiveChat.tsx` lines 9-10

### Customize
- Color: #3B82F6 (primary blue)
- Position: Bottom Right
- Industry-specific triggers after 30s

## 4. Analytics Setup

### Google Analytics 4
Add Measurement ID to tracking configuration

### Meta Pixel
Add Pixel ID for Facebook/Instagram ads

### LinkedIn Insight Tag
Add Partner ID for LinkedIn campaigns

## 5. Testing Checklist

- [ ] Apollo.io leads appear with correct tags
- [ ] Voice demo requires lead submission first
- [ ] All CTAs say "Get Your Free Strategy Session"
- [ ] Timeline estimator shows industry-specific baselines
- [ ] ROI calculator generates PDF with email capture
- [ ] Tawk.to chat widget appears
- [ ] Analytics events fire correctly
- [ ] Mobile responsive on all pages
- [ ] SEO meta tags present on landing pages

## Support

- Apollo.io: support@apollo.io
- VAPI: support@vapi.ai
- Tawk.to: support@tawk.to
