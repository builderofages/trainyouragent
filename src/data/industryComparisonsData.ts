export interface IndustryComparisonDetails {
  // Basic info
  industry: string;
  displayName: string;
  
  // AI vs Receptionist
  aiAgentCost: string;
  receptionistCost: string;
  aiAvailability: string;
  receptionistAvailability: string;
  aiScalability: string;
  receptionistScalability: string;
  
  // AI vs Call Center
  callCenterCostPerCall: string;
  callCenterMonthlyEstimate: string;
  aiResponseTime: string;
  callCenterResponseTime: string;
  
  // AI vs Virtual Assistant
  vaCost: string;
  vaAvailability: string;
  vaLanguageSupport: string;
  
  // Real scenario data
  typicalCallVolume: string;
  aiMonthlyCost: string;
  humanStaffCost: string;
  callCenterCost: string;
  monthlySavings: string;
  yearOneSavings: string;
  
  // Industry-specific features
  industrySpecificFeatures: string[];
  criticalComplianceNeeds: string[];
  peakSeasonFactors: string;
  afterHoursImportance: "critical" | "high" | "medium" | "low";
  
  // CRM integrations
  nativeCRMIntegrations: string;
  
  // Setup & contract
  setupTime: string;
  contractTerms: string;
  
  // Industry warnings
  notIdealFor: string;
}

export const industryComparisonsData: Record<string, IndustryComparisonDetails> = {
  hvac: {
    industry: "hvac",
    displayName: "HVAC & Home Services",
    
    aiAgentCost: "$599-1,497/mo ($7.2K-18K/yr)",
    receptionistCost: "$35K-45K + benefits ($50K-65K/yr)",
    aiAvailability: "24/7/365 — critical for emergency calls",
    receptionistAvailability: "8am-6pm weekdays (nights/weekends = voicemail)",
    aiScalability: "Unlimited calls — handles 50 simultaneous emergency calls during storm season",
    receptionistScalability: "1-2 calls at a time — overwhelmed during peak season",
    
    callCenterCostPerCall: "$4-7 per call",
    callCenterMonthlyEstimate: "$8,000-14,000/mo (200 calls/week)",
    aiResponseTime: "Instant answer — no hold times",
    callCenterResponseTime: "2-5 min average wait + transfers",
    
    vaCost: "$1,500-3,000/mo (part-time)",
    vaAvailability: "Business hours only — misses 60% of emergency calls",
    vaLanguageSupport: "1-2 languages typically",
    
    typicalCallVolume: "150-250 calls/week (surges during storms/heatwaves)",
    aiMonthlyCost: "$1,197/mo",
    humanStaffCost: "$4,200/mo (receptionist salary + benefits)",
    callCenterCost: "$10,500/mo (avg $6/call × 175 calls/week)",
    monthlySavings: "$3,003 vs receptionist / $9,303 vs call center",
    yearOneSavings: "$36,036 vs receptionist / $111,636 vs call center",
    
    industrySpecificFeatures: [
      "Emergency dispatch prioritization logic",
      "ServiceTitan, Housecall Pro, Jobber native integration",
      "After-hours emergency vs non-emergency routing",
      "Automatic technician availability checking",
      "Weather-based surge capacity scaling",
      "Service area verification before booking"
    ],
    criticalComplianceNeeds: ["EPA certification verification", "Licensed contractor requirements", "Emergency service protocols"],
    peakSeasonFactors: "Summer AC failures & winter furnace emergencies create 3-4x normal call volume",
    afterHoursImportance: "critical",
    
    nativeCRMIntegrations: "ServiceTitan, Housecall Pro, Jobber, FieldEdge",
    setupTime: "3-5 days (dispatch logic requires testing)",
    contractTerms: "Month-to-month — cancel anytime",
    
    notIdealFor: "Companies requiring in-person reception for walk-in customers or dispatching complex commercial projects requiring engineering judgment"
  },
  
  legal: {
    industry: "legal",
    displayName: "Legal Services",
    
    aiAgentCost: "$799-1,997/mo ($9.6K-24K/yr)",
    receptionistCost: "$40K-55K + benefits ($60K-80K/yr)",
    aiAvailability: "24/7 intake — capture leads outside business hours",
    receptionistAvailability: "9am-5pm weekdays only",
    aiScalability: "Handles 100+ simultaneous intakes during mass tort campaigns",
    receptionistScalability: "1-2 calls max — bottleneck during marketing pushes",
    
    callCenterCostPerCall: "$8-15 per intake",
    callCenterMonthlyEstimate: "$6,000-12,000/mo (80-100 intakes/week)",
    aiResponseTime: "Immediate qualification — no wait times",
    callCenterResponseTime: "3-8 min queue time + qualification",
    
    vaCost: "$2,000-4,500/mo",
    vaAvailability: "Limited hours — misses evening/weekend leads",
    vaLanguageSupport: "English + Spanish (if bilingual VA)",
    
    typicalCallVolume: "60-100 intakes/week (higher during ad campaigns)",
    aiMonthlyCost: "$1,497/mo",
    humanStaffCost: "$5,000/mo (intake specialist salary + benefits)",
    callCenterCost: "$8,800/mo (avg $11/call × 80 calls/week)",
    monthlySavings: "$3,503 vs receptionist / $7,303 vs call center",
    yearOneSavings: "$42,036 vs receptionist / $87,636 vs call center",
    
    industrySpecificFeatures: [
      "Conflict checking pre-qualification",
      "Case type identification & urgency assessment",
      "Clio, MyCase, PracticePanther integration",
      "Attorney-client privilege disclaimers",
      "Statute of limitations urgency flagging",
      "Lead value scoring (case type + facts)"
    ],
    criticalComplianceNeeds: ["Attorney-client privilege protocols", "Bar association compliance", "Confidentiality standards", "Informed consent documentation"],
    peakSeasonFactors: "Mass tort campaigns & TV ads create unpredictable lead surges requiring instant scalability",
    afterHoursImportance: "high",
    
    nativeCRMIntegrations: "Clio, MyCase, PracticePanther, Filevine, Smokeball",
    setupTime: "5-7 days (conflict checking & compliance setup)",
    contractTerms: "Month-to-month flexible pilot",
    
    notIdealFor: "Complex litigation strategy discussions requiring senior partner judgment or highly emotional family law matters needing immediate counseling"
  },
  
  healthcare: {
    industry: "healthcare",
    displayName: "Healthcare",
    
    aiAgentCost: "$899-1,797/mo ($10.8K-21.6K/yr)",
    receptionistCost: "$38K-52K + benefits ($55K-75K/yr)",
    aiAvailability: "24/7 appointment scheduling & triage",
    receptionistAvailability: "Clinic hours only — voicemail outside hours",
    aiScalability: "Handles flu season surges & vaccine appointment rushes",
    receptionistScalability: "Overwhelmed during peak seasons — long hold times",
    
    callCenterCostPerCall: "$5-9 per call",
    callCenterMonthlyEstimate: "$9,000-16,000/mo (200 calls/week)",
    aiResponseTime: "Instant triage — immediate appointment availability",
    callCenterResponseTime: "4-7 min average hold time",
    
    vaCost: "$1,800-3,500/mo",
    vaAvailability: "Business hours — misses urgent after-hours calls",
    vaLanguageSupport: "Limited language options",
    
    typicalCallVolume: "150-300 calls/week (surges during flu season)",
    aiMonthlyCost: "$1,397/mo",
    humanStaffCost: "$4,600/mo (medical receptionist + benefits)",
    callCenterCost: "$12,000/mo (avg $7/call × 200 calls/week)",
    monthlySavings: "$3,203 vs receptionist / $10,603 vs call center",
    yearOneSavings: "$38,436 vs receptionist / $127,236 vs call center",
    
    industrySpecificFeatures: [
      "HIPAA-compliant call recording & transcription",
      "Symptom-based appointment urgency assessment",
      "EHR integration (Epic, Athena, DrChrono)",
      "Insurance verification prompts",
      "Prescription refill routing protocols",
      "Emergency vs routine triage logic"
    ],
    criticalComplianceNeeds: ["HIPAA compliance", "PHI safeguards", "Business Associate Agreement (BAA)", "Patient consent protocols"],
    peakSeasonFactors: "Flu season, allergy season, and vaccine rollouts create 2-3x appointment volume spikes",
    afterHoursImportance: "high",
    
    nativeCRMIntegrations: "Epic MyChart, Athenahealth, DrChrono, Kareo, SimplePractice",
    setupTime: "5-7 days (HIPAA compliance configuration required)",
    contractTerms: "Month-to-month with BAA",
    
    notIdealFor: "Mental health crisis calls requiring immediate counseling or complex medical emergencies requiring nurse triage judgment"
  },
  
  accounting: {
    industry: "accounting",
    displayName: "Accounting & Finance",
    
    aiAgentCost: "$699-1,497/mo ($8.4K-18K/yr)",
    receptionistCost: "$36K-48K + benefits ($52K-70K/yr)",
    aiAvailability: "24/7 — clients call outside business hours frequently",
    receptionistAvailability: "Office hours only",
    aiScalability: "Handles tax season surge (Jan-April) without additional cost",
    receptionistScalability: "Need temp staff during tax season",
    
    callCenterCostPerCall: "$4-8 per call",
    callCenterMonthlyEstimate: "$4,000-8,000/mo (100 calls/week off-season)",
    aiResponseTime: "Immediate response & appointment booking",
    callCenterResponseTime: "2-6 min wait times",
    
    vaCost: "$1,500-3,200/mo",
    vaAvailability: "Limited availability during client's evening hours",
    vaLanguageSupport: "Typically English only",
    
    typicalCallVolume: "80-150 calls/week (300+ during tax season)",
    aiMonthlyCost: "$1,197/mo",
    humanStaffCost: "$4,000/mo (admin + benefits)",
    callCenterCost: "$6,400/mo (avg $6/call × 100 calls/week)",
    monthlySavings: "$2,803 vs receptionist / $5,203 vs call center",
    yearOneSavings: "$33,636 vs receptionist / $62,436 vs call center",
    
    industrySpecificFeatures: [
      "Tax appointment type identification",
      "Client confidentiality protocols",
      "QuickBooks, Xero, FreshBooks integration",
      "Document upload reminders",
      "Tax deadline urgency messaging",
      "Service type qualification (bookkeeping, tax prep, CFO)"
    ],
    criticalComplianceNeeds: ["Client confidentiality", "SOC 2 compliance preferred", "Secure document handling"],
    peakSeasonFactors: "January through April tax season creates 3-4x normal volume — temporary staff typically needed",
    afterHoursImportance: "medium",
    
    nativeCRMIntegrations: "QuickBooks, Xero, FreshBooks, Karbon, Financial Cents",
    setupTime: "3-5 days",
    contractTerms: "Month-to-month — scale up for tax season",
    
    notIdealFor: "Complex CFO advisory calls requiring strategic financial guidance or IRS audit representation requiring CPA expertise"
  },
  
  restaurants: {
    industry: "restaurants",
    displayName: "Restaurants & Hospitality",
    
    aiAgentCost: "$499-1,197/mo ($6K-14.4K/yr)",
    receptionistCost: "$32K-42K + benefits ($46K-60K/yr)",
    aiAvailability: "24/7 — take reservations while kitchen is closed",
    receptionistAvailability: "Varies — staff juggle phones + front desk",
    aiScalability: "Handles Valentine's Day, Mother's Day, NYE surges effortlessly",
    receptionistScalability: "Overwhelmed during peak hours — missed calls = lost revenue",
    
    callCenterCostPerCall: "$3-6 per reservation",
    callCenterMonthlyEstimate: "$4,800-9,600/mo (160 reservations/week)",
    aiResponseTime: "Instant table availability — no hold music",
    callCenterResponseTime: "Long waits during dinner rush",
    
    vaCost: "$1,200-2,500/mo",
    vaAvailability: "Not available during peak dinner service",
    vaLanguageSupport: "Usually English + Spanish",
    
    typicalCallVolume: "120-200 calls/week (higher for fine dining)",
    aiMonthlyCost: "$897/mo",
    humanStaffCost: "$3,500/mo (host salary + benefits)",
    callCenterCost: "$6,400/mo (avg $5/call × 160 calls/week)",
    monthlySavings: "$2,603 vs receptionist / $5,503 vs call center",
    yearOneSavings: "$31,236 vs receptionist / $66,036 vs call center",
    
    industrySpecificFeatures: [
      "OpenTable, Resy, Toast POS integration",
      "Dietary restriction capture",
      "Special occasion identification (birthdays, anniversaries)",
      "Party size & seating preference routing",
      "Peak hours capacity management",
      "Waitlist management & SMS notifications"
    ],
    criticalComplianceNeeds: ["Food allergy documentation", "Health code compliance", "Accessibility requirements"],
    peakSeasonFactors: "Valentine's Day, Mother's Day, NYE create massive reservation surges — phone lines ring off the hook",
    afterHoursImportance: "medium",
    
    nativeCRMIntegrations: "OpenTable, Resy, Toast, Square Reservations, Yelp Reservations",
    setupTime: "3-5 days",
    contractTerms: "Month-to-month flexible",
    
    notIdealFor: "Handling angry customers about food quality complaints or managing complex event catering negotiations requiring tasting consultations"
  },
  
  roofing: {
    industry: "roofing",
    displayName: "Roofing & Construction",
    
    aiAgentCost: "$699-1,497/mo ($8.4K-18K/yr)",
    receptionistCost: "$35K-48K + benefits ($50K-70K/yr)",
    aiAvailability: "24/7 — storm damage leads call immediately after events",
    receptionistAvailability: "Business hours — miss storm emergency leads at night",
    aiScalability: "Handles 200+ storm leads in 48 hours post-disaster",
    receptionistScalability: "Overwhelmed during storm season — can't handle surge",
    
    callCenterCostPerCall: "$5-10 per lead",
    callCenterMonthlyEstimate: "$6,000-12,000/mo (120 leads/week)",
    aiResponseTime: "Instant response — critical for time-sensitive storm leads",
    callCenterResponseTime: "Queue delays = lost leads to competitors",
    
    vaCost: "$1,500-3,000/mo",
    vaAvailability: "Misses post-storm evening/night leads",
    vaLanguageSupport: "1-2 languages",
    
    typicalCallVolume: "100-180 calls/week (300+ after major storms)",
    aiMonthlyCost: "$1,197/mo",
    humanStaffCost: "$4,200/mo (office manager + benefits)",
    callCenterCost: "$8,400/mo (avg $7/call × 120 calls/week)",
    monthlySavings: "$3,003 vs receptionist / $7,203 vs call center",
    yearOneSavings: "$36,036 vs receptionist / $86,436 vs call center",
    
    industrySpecificFeatures: [
      "Storm damage urgency assessment",
      "Insurance claim identification",
      "Service area & roofing type qualification",
      "JobNimbus, AccuLynx, Roofing CRM integration",
      "Photo upload instructions for damage assessment",
      "Estimator availability scheduling"
    ],
    criticalComplianceNeeds: ["Licensed contractor verification", "Insurance documentation", "Building permit requirements"],
    peakSeasonFactors: "Hurricane season & hailstorms create immediate lead surges requiring instant response to beat competition",
    afterHoursImportance: "critical",
    
    nativeCRMIntegrations: "JobNimbus, AccuLynx, JobProgress, Roofing CRM",
    setupTime: "3-5 days (storm lead routing logic)",
    contractTerms: "Month-to-month — scale during storm season",
    
    notIdealFor: "Complex commercial roofing projects requiring engineering specifications or historical restoration requiring specialized expertise"
  },
  
  logistics: {
    industry: "logistics",
    displayName: "Logistics & Transportation",
    
    aiAgentCost: "$799-1,697/mo ($9.6K-20.4K/yr)",
    receptionistCost: "$37K-50K + benefits ($53K-72K/yr)",
    aiAvailability: "24/7 — drivers call at all hours for dispatch",
    receptionistAvailability: "Office hours only — drivers left without support",
    aiScalability: "Handles peak season surges (holidays, Q4 e-commerce)",
    receptionistScalability: "Single call capacity — creates bottlenecks",
    
    callCenterCostPerCall: "$4-8 per call",
    callCenterMonthlyEstimate: "$7,200-14,000/mo (180 calls/week)",
    aiResponseTime: "Instant driver support & customer updates",
    callCenterResponseTime: "Hold times frustrate time-sensitive callers",
    
    vaCost: "$1,800-3,500/mo",
    vaAvailability: "Limited availability for after-hours driver issues",
    vaLanguageSupport: "English + Spanish typically",
    
    typicalCallVolume: "150-250 calls/week (drivers + customers)",
    aiMonthlyCost: "$1,397/mo",
    humanStaffCost: "$4,400/mo (dispatcher + benefits)",
    callCenterCost: "$10,800/mo (avg $6/call × 180 calls/week)",
    monthlySavings: "$3,003 vs receptionist / $9,403 vs call center",
    yearOneSavings: "$36,036 vs receptionist / $112,836 vs call center",
    
    industrySpecificFeatures: [
      "Shipment tracking & ETA updates",
      "Driver dispatch routing",
      "Load board integration",
      "McLeod, TMW, TruckMate integration",
      "DOT compliance documentation",
      "Customer delivery notifications"
    ],
    criticalComplianceNeeds: ["DOT regulations", "FMCSA compliance", "Hours of Service tracking"],
    peakSeasonFactors: "Q4 holiday shipping & e-commerce surges create 2-3x volume requiring 24/7 dispatch support",
    afterHoursImportance: "critical",
    
    nativeCRMIntegrations: "McLeod, TMW Systems, TruckMate, DAT Load Board",
    setupTime: "5-7 days (dispatch logic & integrations)",
    contractTerms: "Month-to-month with seasonal scaling",
    
    notIdealFor: "Complex international customs negotiations or handling driver HR issues requiring management judgment"
  },
  
  bars: {
    industry: "bars",
    displayName: "Bars & Nightclubs",
    
    aiAgentCost: "$499-1,097/mo ($6K-13.2K/yr)",
    receptionistCost: "$30K-40K + benefits ($43K-58K/yr)",
    aiAvailability: "24/7 — book VIP tables while venue is closed",
    receptionistAvailability: "Venue hours only — daytime calls go unanswered",
    aiScalability: "Handles New Year's Eve, spring break, special event surges",
    receptionistScalability: "Too loud during events to answer phones effectively",
    
    callCenterCostPerCall: "$3-7 per reservation",
    callCenterMonthlyEstimate: "$3,600-8,400/mo (120 reservations/week)",
    aiResponseTime: "Instant VIP table availability & event info",
    callCenterResponseTime: "Slow response = competitor bookings",
    
    vaCost: "$1,000-2,200/mo",
    vaAvailability: "Not available during peak nightlife hours",
    vaLanguageSupport: "Limited language support",
    
    typicalCallVolume: "80-160 calls/week (300+ during event weekends)",
    aiMonthlyCost: "$797/mo",
    humanStaffCost: "$3,300/mo (host + benefits)",
    callCenterCost: "$5,400/mo (avg $5.50/call × 120 calls/week)",
    monthlySavings: "$2,503 vs receptionist / $4,603 vs call center",
    yearOneSavings: "$30,036 vs receptionist / $55,236 vs call center",
    
    industrySpecificFeatures: [
      "VIP table reservation & pricing",
      "Event RSVP & guest list management",
      "Bottle service qualification",
      "Age verification reminders",
      "Dress code & entry requirements",
      "Group size & special requests"
    ],
    criticalComplianceNeeds: ["Age verification protocols", "Capacity limits", "Liquor license compliance"],
    peakSeasonFactors: "New Year's Eve, spring break, major concerts create massive reservation surges & group inquiries",
    afterHoursImportance: "medium",
    
    nativeCRMIntegrations: "SevenRooms, Tablelist, Square Nightlife, Eventbrite",
    setupTime: "3-5 days",
    contractTerms: "Month-to-month flexible",
    
    notIdealFor: "Managing intoxicated customer complaints or handling security incident escalations requiring immediate on-site management"
  },

  gym: {
    industry: "gym",
    displayName: "Gym & Fitness",
    
    aiAgentCost: "$599-1,297/mo ($7.2K-15.6K/yr)",
    receptionistCost: "$32K-42K + benefits ($46K-60K/yr)",
    aiAvailability: "24/7 — capture late-night fitness seekers",
    receptionistAvailability: "Business hours — miss after-work and weekend inquiries",
    aiScalability: "Handle January rush and New Year resolution surge",
    receptionistScalability: "Overwhelmed during peak enrollment periods",
    
    callCenterCostPerCall: "$4-7 per call",
    callCenterMonthlyEstimate: "$5,600-9,800/mo (140 calls/week)",
    aiResponseTime: "Instant membership info — no hold times",
    callCenterResponseTime: "3-6 min wait times during peak hours",
    
    vaCost: "$1,400-2,800/mo",
    vaAvailability: "Business hours — misses evening and weekend prospects",
    vaLanguageSupport: "English + Spanish typically",
    
    typicalCallVolume: "120-200 calls/week (400+ during January)",
    aiMonthlyCost: "$997/mo",
    humanStaffCost: "$3,800/mo (front desk + benefits)",
    callCenterCost: "$7,700/mo (avg $5.50/call × 140 calls/week)",
    monthlySavings: "$2,803 vs receptionist / $6,703 vs call center",
    yearOneSavings: "$33,636 vs receptionist / $80,436 vs call center",
    
    industrySpecificFeatures: [
      "Membership plan comparison and pricing",
      "Trial pass scheduling and follow-up",
      "Class schedule and availability info",
      "Personal training session booking",
      "Mindbody, Glofox, Zen Planner integration",
      "Member account and billing support"
    ],
    criticalComplianceNeeds: ["Liability waiver collection", "Minor consent forms", "Health questionnaire intake"],
    peakSeasonFactors: "January New Year resolution surge creates 3-4x normal inquiry volume — staff overwhelmed",
    afterHoursImportance: "high",
    
    nativeCRMIntegrations: "Mindbody, Glofox, Zen Planner, ClubReady, ABC Fitness",
    setupTime: "3-5 days",
    contractTerms: "Month-to-month flexible",
    
    notIdealFor: "Complex personal training assessments requiring in-person evaluation or handling member injuries and medical emergencies"
  }
};
