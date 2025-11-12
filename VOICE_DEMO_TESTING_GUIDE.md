# Voice Demo & Lead Gate Testing Guide

## Overview
This guide covers comprehensive testing of industry-specific voice prompts and lead gate contextual data across all 8 industry landing pages.

---

## Phase 1: Voice Demo Industry-Specific Testing

### Test All Landing Pages
- `/hvac` - HVAC contractors
- `/legal` - Law firms
- `/healthcare` - Healthcare practices
- `/accounting` - Accounting firms
- `/restaurants` - Restaurants
- `/roofing` - Roofing contractors
- `/logistics` - Logistics & shipping
- `/bars` - Bars & nightclubs

---

### 1.1 Voice Demo Lead Gate Pre-Selection

**For each landing page:**

1. Click "Start Voice Demo" button
2. **Verify**: VoiceDemoLeadGate modal appears
3. **Verify**: Industry dropdown is **pre-selected** to match the landing page
   - HVAC page → "HVAC" selected
   - Legal page → "Legal" selected
   - Healthcare page → "Healthcare" selected
   - etc.
4. **Verify**: Form validation works:
   - Required fields (Name, Email)
   - Email format validation
   - Consent checkbox must be checked
5. **Verify**: SessionStorage prevents repeated lead gate after submission

---

### 1.2 Voice AI Industry-Specific Behavior

**After lead gate submission and VAPI connection:**

#### AI Greeting Verification

| Industry | Expected Greeting |
|----------|------------------|
| HVAC | "Hi! I'm your HVAC AI assistant. I can help with emergency repairs, service quotes, and scheduling. What brings you here today?" |
| Legal | "Hello! I'm your legal intake assistant. I can help qualify your case, answer general questions, and schedule consultations. How can I assist you?" |
| Healthcare | "Hi! I'm your healthcare assistant. I can help schedule appointments, answer insurance questions, and provide general information. What can I help you with?" |
| Accounting | "Hello! I'm your accounting assistant. I can help with tax questions, bookkeeping needs, and scheduling consultations. How may I help you?" |
| Restaurants | "Hi! I'm your restaurant assistant. I can help with reservations, menu questions, and special requests. What would you like to know?" |
| Roofing | "Hello! I'm your roofing assistant. I can help with damage assessments, quotes, and scheduling inspections. What can I help you with?" |
| Logistics | "Hi! I'm your logistics assistant. I can help with shipping quotes, tracking, and delivery questions. How can I assist you?" |
| Bars & Nightclubs | "Hey! I'm your nightclub assistant. I can help with table bookings, bottle service, and event reservations. What's up?" |

#### Initial Suggested Prompts Verification

| Industry | Expected Prompts |
|----------|-----------------|
| HVAC | • "My furnace stopped working" • "Quote for new AC unit" • "Schedule maintenance" |
| Legal | • "Need a personal injury lawyer" • "How much does consultation cost?" • "Do you handle criminal cases?" |
| Healthcare | • "Schedule an appointment" • "Do you accept my insurance?" • "New patient information" |
| Accounting | • "Help with business taxes" • "Need bookkeeping services" • "Tax planning consultation" |
| Restaurants | • "Reserve a table for 4" • "Do you have gluten-free options?" • "Private dining for 20" |
| Roofing | • "My roof is leaking" • "Storm damaged my shingles" • "Need a free inspection" |
| Logistics | • "Get a shipping quote to Texas" • "Track my shipment" • "International shipping rates" |
| Bars & Nightclubs | • "Book a table for 8 Saturday" • "What's the bottle service minimum?" • "VIP section available?" |

#### AI Response Behavior Testing

**Test each industry with specific prompts:**

**HVAC:**
- Say: "My furnace stopped working" → AI should detect emergency urgency
- Say: "Need quote for new AC" → AI should offer to schedule assessment

**Legal:**
- Say: "Car accident injury" → AI should avoid specific legal advice, ask qualifying questions
- Say: "How much do you charge?" → AI should explain consultation process

**Healthcare:**
- Say: "Chronic back pain" → AI should use HIPAA-compliant language, avoid diagnosis
- Say: "Do you take Blue Cross?" → AI should ask for specific plan details

**Accounting:**
- Say: "Business tax help" → AI should mention tax deadlines, ask about entity type
- Say: "Need bookkeeping" → AI should ask about monthly transactions volume

**Restaurants:**
- Say: "Table for 4 Saturday 7pm" → AI should check availability, ask for dietary needs
- Say: "Gluten-free menu?" → AI should offer to review options

**Roofing:**
- Say: "Roof is leaking after storm" → AI should offer free inspection, ask about insurance
- Say: "How much for new roof?" → AI should ask about square footage, material preference

**Logistics:**
- Say: "Ship 500 lbs to California" → AI should ask dimensions, delivery timeline
- Say: "Track shipment #12345" → AI should offer to look up tracking details

**Bars:**
- Say: "Table for 10 Saturday night" → AI should mention bottle minimums for large groups
- Say: "VIP section available?" → AI should explain VIP packages, minimums

---

### 1.3 Follow-Up Prompts Context Switching

After 2+ messages exchanged:
- **Verify**: Suggested prompts change to follow-up questions
- **Verify**: Follow-up prompts remain industry-specific (not generic)

---

### 1.4 Text Mode Functionality

1. **Verify**: Text Mode button only appears when demo is active (isConnected or messages.length > 0)
2. Click "Text Mode" button
3. **Verify**: Text input field appears
4. Send a written message
5. **Verify**: AI response still reflects industry-specific behavior
6. **Verify**: Can switch back to voice mode

---

## Phase 2: Lead Gate Contextual Data Testing

### For StrategySessionLeadGate Component Across All 8 Industries

#### 2.1 Step 2: Business Context Insights

**Call Volume Insights Testing**

After selecting call volume, verify industry-specific insights appear:

| Industry | Expected Insight Pattern |
|----------|------------------------|
| HVAC | "HVAC businesses typically handle 150-250 calls/week. At your volume, you're likely missing $3,003/mo in revenue vs receptionist costs." |
| Legal | "Legal practices typically handle 50-80 intake calls/week. At your volume, you're likely missing $3,503/mo..." |
| Healthcare | "Healthcare practices typically handle 100-200 appointment calls/week..." |
| Accounting | Shows typical 30-60 client calls/week + $2,803/mo savings |
| Restaurants | Shows typical 80-150 reservation calls/week + $2,403/mo savings |
| Roofing | Shows typical 60-120 quote calls/week + $2,553/mo savings |
| Logistics | Shows typical 40-80 dispatch calls/week + $2,103/mo savings |
| Bars | Shows typical 50-100 booking calls/week + $2,103/mo savings |

**Current Solution Insights Testing**

After selecting "Human receptionist":

| Industry | Expected Cost Comparison |
|----------|------------------------|
| HVAC | "$1,197/mo AI vs $4,200/mo receptionist = $3,003/mo savings ($36,036/year)" |
| Legal | "$1,797/mo AI vs $5,500/mo receptionist = $3,703/mo savings ($44,436/year)" |
| Healthcare | "$1,797/mo AI vs $4,800/mo receptionist = $3,003/mo savings ($36,036/year)" |
| Accounting | "$1,497/mo AI vs $4,500/mo receptionist = $3,003/mo savings ($36,036/year)" |
| Restaurants | "$997/mo AI vs $3,800/mo receptionist = $2,803/mo savings ($33,636/year)" |
| Roofing | "$1,647/mo AI vs $4,500/mo receptionist = $2,853/mo savings ($34,236/year)" |
| Logistics | "$1,497/mo AI vs $4,200/mo receptionist = $2,703/mo savings ($32,436/year)" |
| Bars | "$997/mo AI vs $3,500/mo receptionist = $2,503/mo savings ($30,036/year)" |

**Industry-Specific Features Verification**

| Industry | Expected Features Mentioned |
|----------|---------------------------|
| HVAC | "ServiceTitan integration, emergency dispatch prioritization, weather-based surge capacity" |
| Legal | "Clio integration, case type identification, statute of limitations urgency flagging" |
| Healthcare | "HIPAA compliance, EHR integration, symptom-based triage routing" |
| Accounting | "QuickBooks integration, tax season automation, secure document collection" |
| Restaurants | "OpenTable integration, dietary restrictions tracking, waitlist management" |
| Roofing | "Insurance claim automation, storm damage assessment, photo documentation" |
| Logistics | "Real-time shipment tracking, automated ETA updates, customs documentation" |
| Bars | "VIP guest management, bottle service upsells, event capacity tracking" |

---

#### 2.2 Step 3: Needs Assessment Insights

**Timeline Insights Testing**

When selecting "Urgent - need ASAP":

| Industry | Expected Timeline + Peak Season Factors |
|----------|---------------------------------------|
| HVAC | "3-5 days with dispatch logic testing. Summer AC failures & winter furnace emergencies create 3-4x normal call volume." |
| Legal | "5-7 days with case type training. Personal injury cases spike after major accidents and holidays." |
| Healthcare | "5-7 days with HIPAA compliance verification. Flu season & open enrollment drive 2-3x normal volume." |
| Accounting | "3-5 days setup. Tax season (Jan-Apr) creates 5-10x normal volume with 24/7 demand." |
| Restaurants | "3-5 days setup. Holidays, Valentine's Day, Mother's Day = 3-5x normal reservations." |
| Roofing | "3-7 days setup. Storm season and insurance claim deadlines drive urgent repair requests." |
| Logistics | "5-7 days setup. Holiday shipping surges and peak season create 4-6x normal volume." |
| Bars | "3-5 days setup. Weekends, holidays, special events = 5-10x normal booking calls." |

---

#### 2.3 Step 4: Budget Insights

**Budget Benchmark ROI Testing**

When selecting "$10,000+/month" budget:

| Industry | Expected ROI Calculation | Expected Payback Period |
|----------|------------------------|------------------------|
| HVAC | "251% ROI" (calculated from $36,036 / $14,364) | "18 days" |
| Legal | "234% ROI" (calculated from $42,036 / $17,964) | "12 days" |
| Healthcare | "251% ROI" (calculated from $36,036 / $14,364) | "15 days" |
| Accounting | "242% ROI" (calculated from $36,036 / $14,874) | "14 days" |
| Restaurants | "283% ROI" (calculated from $33,636 / $11,886) | "21 days" |
| Roofing | "207% ROI" (calculated from $34,236 / $16,524) | "16 days" |
| Logistics | "217% ROI" (calculated from $32,436 / $14,964) | "17 days" |
| Bars | "253% ROI" (calculated from $30,036 / $11,886) | "19 days" |

**Success Story Verification**

Each industry should reference REAL features and compliance needs:

- Healthcare: Mentions HIPAA compliance, patient consent
- Legal: Mentions attorney-client privilege, conflicts check
- Accounting: Mentions client confidentiality, data security

---

## Phase 3: Apollo.io Data Verification

### After Form Submission

1. Open Apollo.io dashboard
2. Search for the test contact you just submitted
3. **Verify Contact Created** with correct information
4. **Verify Tags Applied**:
   - Source: "Strategy Session Request" ✅
   - Industry: "[Selected Industry] Landing" (e.g., "HVAC Landing") ✅
   - Additional: "Website Lead" ✅
5. **Verify Custom Fields Populated**:
   - `industry`: Correct industry ✅
   - `call_volume`: Selected volume ✅
   - `budget_range`: Selected budget ✅
   - `timeline`: Selected timeline ✅
   - `biggest_challenge`: Textarea content ✅
   - `current_solution`: Selected solution ✅
   - `company_size`: Selected size ✅
   - `goals`: Selected goals ✅
6. **Verify No Fake/Placeholder Data** sent to Apollo

---

## Phase 4: Analytics Verification

### GTM DataLayer Events

Open browser console and check `dataLayer` after each action:

**Voice Demo Events:**
```javascript
dataLayer.push({
  event: 'voice_demo_started',
  industry: 'hvac',
  demo_type: 'voice',
  component: 'VoiceAgentDemo'
});

dataLayer.push({
  event: 'voice_demo_lead_submitted',
  industry: 'hvac',
  demo_type: 'voice'
});

dataLayer.push({
  event: 'voice_demo_completed',
  industry: 'hvac',
  demo_duration_seconds: 120,
  message_count: 8
});
```

**Lead Gate Events:**
```javascript
dataLayer.push({
  event: 'lead_gate_opened',
  component: 'StrategySessionLeadGate',
  industry: 'hvac'
});

dataLayer.push({
  event: 'lead_gate_step_viewed',
  step: 2,
  component: 'StrategySessionLeadGate'
});

dataLayer.push({
  event: 'strategy_session_lead_submitted',
  industry: 'hvac',
  budget_range: '$10,000+/month',
  call_volume: '100+ calls/day',
  value: 500
});
```

### GA4 DebugView

1. Open GA4 → Configure → DebugView
2. Enable debug mode in browser console: `gtag('set', 'debug_mode', true);`
3. Perform actions and verify events appear in DebugView with correct parameters

### Meta Pixel Events

Check browser console for `fbq` calls:
```javascript
fbq('track', 'Lead', {
  content_name: 'Voice Demo Lead',
  industry: 'hvac'
});
```

---

## Phase 5: Edge Cases & Error Handling

### Test Scenarios

1. **Industry Selector During Active Demo**
   - Start voice demo
   - Try to change industry dropdown
   - **Verify**: Selector is disabled during active call

2. **VAPI Connection Errors**
   - Block microphone permissions
   - **Verify**: User-friendly toast notification appears
   - **Verify**: No console errors

3. **Apollo.io Submission Failures**
   - Simulate network failure (throttle to offline in DevTools)
   - Submit form
   - **Verify**: Graceful error handling with retry option

4. **Mobile Microphone Permissions**
   - Test on iOS Safari
   - Test on Android Chrome
   - **Verify**: Permission prompts work correctly
   - **Verify**: Voice input works after granting permission

5. **SessionStorage Lead Gate Prevention**
   - Complete voice demo lead gate
   - Click "Start Voice Demo" again
   - **Verify**: Lead gate doesn't reappear (uses sessionStorage flag)
   - Open new incognito window
   - **Verify**: Lead gate appears in fresh session

6. **Text Mode Button Visibility**
   - Load page with voice demo component
   - **Verify**: Text Mode button is hidden
   - Start voice demo
   - **Verify**: Text Mode button appears once connected

---

## Testing Spreadsheet Template

### Tab 1: Voice Demo Behavior

| Landing Page | Industry Pre-Selected | AI Greeting Correct | Suggested Prompts Match | AI Behavior Industry-Specific | Follow-Up Prompts Switch | Text Mode Works | Console Errors | Result |
|--------------|----------------------|---------------------|------------------------|------------------------------|-------------------------|-----------------|----------------|--------|
| /hvac | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| /legal | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| /healthcare | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| /accounting | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| /restaurants | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| /roofing | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| /logistics | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| /bars | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |

### Tab 2: Lead Gate Contextual Data

| Industry | Call Volume Insight Real | Current Solution Shows Real Costs | Timeline Shows Real Setup Time | Budget Shows Real ROI | Success Story Uses Real Features | Apollo.io Data Accurate | Result |
|----------|-------------------------|----------------------------------|-------------------------------|-----------------------|----------------------------------|------------------------|--------|
| HVAC | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| Legal | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| Healthcare | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| Accounting | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| Restaurants | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| Roofing | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| Logistics | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| Bars | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |

### Tab 3: Apollo.io Integration

| Industry Landing | Contact Created | Tags Correct | Custom Fields Populated | No Fake Data | Timestamp Accurate | Result |
|------------------|----------------|--------------|------------------------|--------------|-------------------|--------|
| HVAC | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| Legal | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| Healthcare | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| Accounting | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| Restaurants | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| Roofing | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| Logistics | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| Bars | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |

### Tab 4: Analytics Verification

| Event Name | Parameters Correct | GTM Fires | GA4 Fires | Meta Pixel Fires | Result |
|------------|-------------------|-----------|-----------|------------------|--------|
| voice_demo_started | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| voice_demo_lead_submitted | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| voice_demo_completed | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| lead_gate_opened | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| lead_gate_step_viewed | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| strategy_session_lead_submitted | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |
| booking_page_opened | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | PASS/FAIL |

### Tab 5: Issues Log

| Issue ID | Component | Description | Industry | Browser | Device | Priority | Status | Fix Notes |
|----------|-----------|-------------|----------|---------|--------|----------|--------|-----------|
| VD-001 | VoiceAgentDemo | Example issue | HVAC | Chrome | Desktop | High | Open | Notes here |

---

## Success Criteria

**All tests must PASS before launch:**

- ✅ 100% industry pre-selection accuracy (8/8 landing pages)
- ✅ Voice AI behavior matches industry context (verified through test prompts)
- ✅ Lead gate insights pull REAL data from `industryComparisonsData.ts` (no hardcoded fake numbers)
- ✅ Apollo.io receives accurate industry-specific data
- ✅ Zero critical console errors during voice demo flow
- ✅ Analytics events fire with correct parameters
- ✅ Mobile microphone permissions work on iOS Safari and Android Chrome
- ✅ SessionStorage prevents duplicate lead gates
- ✅ Text Mode button appears only when demo is active

---

## Troubleshooting

### Common Issues

**Issue**: Voice demo doesn't start after lead gate submission
- **Check**: Browser microphone permissions granted
- **Check**: VAPI public key configured correctly in `vapi-config.ts`
- **Check**: Console for WebSocket connection errors

**Issue**: Lead gate insights show generic data instead of industry-specific
- **Check**: `defaultIndustry` prop is passed to component
- **Check**: Industry exists in `industryComparisonsData.ts`
- **Check**: Helper functions are using correct data source

**Issue**: Apollo.io not receiving contacts
- **Check**: Apollo.io API key configured in edge function
- **Check**: Network tab for 200 response from `/apollo-proxy`
- **Check**: Apollo.io dashboard → Settings → API to verify key is active

**Issue**: Analytics events not firing
- **Check**: GTM container ID is correct in `index.html`
- **Check**: `dataLayer` is initialized before GTM script
- **Check**: Console for GTM debug messages

---

## Next Steps After Testing

1. Document all PASS/FAIL results in spreadsheet
2. Log all issues in Issues tab with priority levels
3. Fix critical issues (blocking functionality)
4. Fix high-priority issues (significant UX problems)
5. Retest failed scenarios after fixes
6. Sign off on launch when all critical tests pass
