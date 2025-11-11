# Phone Integration Setup Guide

## Overview
Your site is now ready for inbound phone voice agent integration using VAPI. This guide will help you complete the setup.

---

## Step 1: Purchase VAPI Phone Number (15 minutes)

1. **Sign up for VAPI** (if you haven't already)
   - Go to https://vapi.ai
   - Create an account
   - Verify your email

2. **Purchase a Phone Number**
   - Navigate to: Dashboard → Phone Numbers
   - Click "Purchase Number"
   - Choose:
     - **Local number** in your area code (recommended for local presence)
     - **Toll-free** (800/888 number for national appeal)
   - Cost: $2-5/month + usage fees

3. **Save Your Number**
   - Copy the phone number in format: `+1-XXX-XXX-XXXX`
   - You'll need this in the next step

---

## Step 2: Configure Your Website (5 minutes)

1. **Update Site Config**
   - Open: `src/config/site.ts`
   - Update these fields:
   ```typescript
   phoneNumber: "+1-555-123-4567",  // Your VAPI number
   phoneNumberDisplay: "(555) 123-4567",  // Formatted for display
   ```

2. **Refresh Your Site**
   - The phone components will automatically appear
   - Header: Click-to-call button
   - Mobile: Floating phone button
   - Homepage: Phone section with features

---

## Step 3: Create VAPI Phone Assistant (20 minutes)

1. **Go to VAPI Dashboard → Assistants**
   - Click "Create Assistant"
   - Choose "Phone" as the type

2. **Configure the Assistant**
   - Use the configuration from: `src/lib/vapi-phone-config.ts`
   - Copy the entire `vapiPhoneConfig` object
   - Paste into VAPI's assistant configuration

3. **Key Settings to Configure:**

   **Basic Info:**
   - Name: "TrainYourAgent Sales Assistant"
   - First Message: "Thank you for calling TrainYourAgent!..."
   - Voice: ElevenLabs → Rachel (or your preferred voice)

   **Model Settings:**
   - Provider: OpenAI
   - Model: GPT-4 (for best intelligence)
   - Temperature: 0.7

   **Functions (Tools):**
   Add these three functions:
   
   a) **book_demo**
   ```json
   {
     "name": "book_demo",
     "description": "Book a demo appointment when caller is ready",
     "parameters": {
       "type": "object",
       "properties": {
         "name": {"type": "string"},
         "email": {"type": "string"},
         "phone": {"type": "string"},
         "industry": {"type": "string"},
         "preferredTime": {"type": "string"},
         "painPoints": {"type": "string"}
       },
       "required": ["name", "email", "phone", "industry"]
     }
   }
   ```

   b) **transfer_to_sales**
   ```json
   {
     "name": "transfer_to_sales",
     "description": "Transfer hot leads to sales team",
     "parameters": {
       "type": "object",
       "properties": {
         "leadScore": {"type": "string", "enum": ["hot", "warm"]},
         "name": {"type": "string"},
         "company": {"type": "string"},
         "industry": {"type": "string"},
         "reason": {"type": "string"},
         "painPoints": {"type": "string"}
       },
       "required": ["leadScore", "name", "industry", "reason"]
     }
   }
   ```

   c) **take_message**
   ```json
   {
     "name": "take_message",
     "description": "Take message for follow-up",
     "parameters": {
       "type": "object",
       "properties": {
         "name": {"type": "string"},
         "phone": {"type": "string"},
         "email": {"type": "string"},
         "industry": {"type": "string"},
         "message": {"type": "string"},
         "urgency": {"type": "string", "enum": ["high", "medium", "low"]}
       },
       "required": ["name", "phone", "message"]
     }
   }
   ```

4. **Advanced Settings:**
   - Max Call Duration: 10 minutes
   - Enable Call Recording: Yes
   - Voicemail Detection: Enabled
   - End Call on Function: No (let agent continue after booking)

5. **Save the Assistant**
   - Click "Save" or "Create"
   - Copy the Assistant ID

---

## Step 4: Link Phone Number to Assistant (5 minutes)

1. **Go to: Dashboard → Phone Numbers**
2. **Click on your purchased number**
3. **Under "Inbound Settings":**
   - Select your assistant from dropdown
   - Enable "Call Recording"
   - Set business hours (or 24/7)
4. **Save Changes**

---

## Step 5: Connect to Monday.com (10 minutes)

1. **Create Monday.com Board**
   - Name: "Inbound Phone Calls"
   - Columns:
     - Caller Name
     - Phone Number
     - Email
     - Industry
     - Lead Score (Hot/Warm/Cold)
     - Pain Points
     - Next Action
     - Call Transcript
     - Recording URL
     - Timestamp

2. **Create Webhook in Monday.com**
   - Board → Integrations → Webhooks
   - Create new incoming webhook
   - Copy the webhook URL

3. **Update Your Code**
   - Open: `src/lib/vapi-phone-config.ts`
   - Line 119: Paste webhook URL:
   ```typescript
   export const phoneWebhookUrl = "https://your-webhook-url-here";
   ```

4. **Configure VAPI to Send Data**
   - VAPI Dashboard → Your Assistant → Webhooks
   - Add webhook for:
     - `call.ended`
     - `function.called`
   - Paste your Monday.com webhook URL

---

## Step 6: Set Up Call Transfer (Optional, 10 minutes)

**If you want hot leads transferred to your phone:**

1. **VAPI Dashboard → Phone Numbers → Your Number**
2. **Enable "Call Transfer"**
3. **Add your forwarding number:**
   - Your cell phone: `+1-XXX-XXX-XXXX`
   - Or office line
4. **Configure transfer conditions:**
   - When agent calls `transfer_to_sales` function
   - During business hours only (optional)

5. **Test the transfer:**
   - Call your VAPI number
   - Say "I'm ready to sign up today"
   - Agent should transfer you

---

## Step 7: Test Everything (15 minutes)

### Test Scenarios:

1. **Cold Lead:**
   - Call the number
   - Say "I'm just looking for information"
   - Expect: Agent provides info, offers to email materials

2. **Warm Lead:**
   - Call and say "I'm interested in your service for my HVAC business"
   - Expect: Agent asks qualifying questions, offers demo booking

3. **Hot Lead:**
   - Call and say "I need this now, what's the pricing?"
   - Expect: Agent transfers or books immediate call

4. **Message Taking:**
   - Call and say "Can someone call me back tomorrow?"
   - Expect: Agent takes detailed message

5. **After Hours** (if configured):
   - Call outside business hours
   - Verify voicemail/message system works

### What to Check:
- ✅ Phone components appear on website
- ✅ Click-to-call works on mobile/desktop
- ✅ VAPI answers calls promptly
- ✅ Agent sounds natural and professional
- ✅ Functions trigger correctly (booking, transfer, message)
- ✅ Data flows to Monday.com
- ✅ Call recordings are saved
- ✅ Transfer works (if enabled)

---

## Step 8: Monitor & Optimize (Ongoing)

### Week 1: Review Calls Daily
1. **VAPI Dashboard → Calls**
   - Listen to recordings
   - Read transcripts
   - Identify confusion points

2. **Optimize the Prompt**
   - If agent misunderstands industry terms → Add industry glossary
   - If too verbose → Add "Keep responses under 2 sentences"
   - If missing lead qualification → Strengthen qualification questions

3. **Adjust Transfer Criteria**
   - Too many transfers? → Raise the bar for "hot" leads
   - Not enough transfers? → Be more aggressive with qualification

### Month 1: Analyze Trends
- Track call volume by day/time
- Identify peak hours
- Monitor lead quality scores
- Calculate cost per qualified lead
- Measure demo booking rate from phone calls

---

## Costs Breakdown

### VAPI Pricing (as of 2024):
- **Phone Number:** $5/month (local) or $10/month (toll-free)
- **Per Minute:** $0.10/minute (approximate)
- **Average Call:** 3-5 minutes = $0.30-$0.50 per call

### Monthly Estimate:
- 100 calls/month × 4 min avg × $0.10/min = $40
- Phone number = $5
- **Total: ~$45-50/month**

### ROI Calculation:
- If you convert 5% of callers → 5 demos
- If you close 20% of demos → 1 new client
- **Cost per client from phone: $50**
- Compare to: PPC cost per client, sales team cost, etc.

---

## Support Resources

### VAPI Documentation:
- Phone Numbers: https://docs.vapi.ai/phone-calling
- Functions: https://docs.vapi.ai/functions
- Webhooks: https://docs.vapi.ai/webhooks

### Need Help?
- VAPI Support: support@vapi.ai
- VAPI Discord: https://discord.gg/vapi
- Monday.com Support: https://support.monday.com

---

## Quick Reference

### Your Phone Number:
```
TO BE FILLED AFTER SETUP
```

### VAPI Assistant ID:
```
TO BE FILLED AFTER SETUP
```

### Monday.com Webhook URL:
```
TO BE FILLED AFTER SETUP
```

### Transfer Number (if using):
```
TO BE FILLED AFTER SETUP
```

---

## Next Steps After Setup

1. **Add phone number to all marketing materials:**
   - Email signature
   - Business cards
   - Google My Business
   - Social media profiles
   - Paid ads

2. **Track these metrics:**
   - Call volume by source
   - Lead quality by source
   - Demo booking rate
   - Cost per lead
   - Conversion rate phone vs. web form

3. **Consider advanced features:**
   - SMS follow-up after calls
   - Multi-language support
   - Industry-specific agents
   - Integration with CRM beyond Monday.com

---

**Ready to launch? Let's get started! 🚀**
