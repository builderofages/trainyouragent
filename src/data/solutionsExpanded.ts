export interface ExpandedNicheSolution {
  id: string;
  name: string;
  icon: string;
  
  // Comprehensive pain points (hell)
  painPoints: {
    category: string;
    title: string;
    impact: string;
    cost: string;
  }[];
  
  // Transformation journey (hell to heaven)
  transformation: {
    before: string[];
    after: string[];
    timeframe: string;
  };
  
  // Benefits with metrics and CTAs
  benefits: {
    title: string;
    description: string;
    metric: string;
    cta: {
      text: string;
      link: string;
      type: "primary" | "secondary" | "calculator" | "demo";
    };
  }[];
  
  // Social proof specific to industry
  socialProof: {
    stat: string;
    source: string;
    impact: string;
  }[];
}

export const expandedSolutions: Record<string, ExpandedNicheSolution> = {
  hvac: {
    id: "hvac",
    name: "HVAC & Home Services",
    icon: "Wrench",
    painPoints: [
      {
        category: "Lost Revenue",
        title: "After-Hours Calls Go to Voicemail",
        impact: "67% of emergency calls happen outside business hours",
        cost: "$180K annual lost revenue per technician",
      },
      {
        category: "Customer Experience",
        title: "Customers Wait Hours for Callbacks",
        impact: "40% of callers hang up and call competitors",
        cost: "$3,500 average emergency service call value lost",
      },
      {
        category: "Seasonal Chaos",
        title: "Summer Heat Waves Overwhelm Staff",
        impact: "Phone lines jammed during peak season",
        cost: "62% of calls go unanswered during busy periods",
      },
      {
        category: "Technician Time",
        title: "Techs Answer Phones Instead of Working",
        impact: "2-3 hours daily spent on scheduling calls",
        cost: "$42K annual productivity loss per technician",
      },
      {
        category: "Scheduling Nightmare",
        title: "Double Bookings and No-Shows",
        impact: "23% no-show rate without proper reminders",
        cost: "$200+ lost per missed appointment",
      },
      {
        category: "Lead Qualification",
        title: "Time Wasted on Tire Kickers",
        impact: "40% of calls are from unqualified leads",
        cost: "15+ hours weekly wasted on bad leads",
      },
      {
        category: "Emergency Response",
        title: "Can't Prioritize True Emergencies",
        impact: "Critical calls lost in general inquiry volume",
        cost: "High-value emergency customers go to competitors",
      },
      {
        category: "Service Upsells",
        title: "Missing Maintenance Agreement Opportunities",
        impact: "80% of one-time customers never return",
        cost: "$5K+ lifetime value lost per customer",
      },
      {
        category: "Payment Collection",
        title: "Unpaid Invoices Pile Up",
        impact: "Average 45-day payment cycle",
        cost: "$50K+ in outstanding receivables",
      },
      {
        category: "Staff Burnout",
        title: "Constant Phone Interruptions Hurt Morale",
        impact: "High turnover from overworked office staff",
        cost: "$35K+ cost to replace each employee",
      },
    ],
    transformation: {
      before: [
        "Missing 6+ emergency calls per night",
        "Technicians spending 3 hours daily on phones",
        "23% no-show rate costing thousands monthly",
        "Cannot scale during peak seasons",
        "Customers waiting hours for callbacks",
      ],
      after: [
        "100% of calls answered in under 30 seconds",
        "Technicians focused solely on repairs",
        "5% no-show rate with AI reminders",
        "Handle 100+ simultaneous calls during heat waves",
        "Instant response with AI routing hot leads to sales",
      ],
      timeframe: "48 hours to full deployment",
    },
    benefits: [
      {
        title: "Never Miss Another Emergency Call",
        description: "AI answers every call 24/7, routes emergencies to on-call techs instantly, captures every opportunity even at 3 AM",
        metric: "$180K recovered annual revenue",
        cta: {
          text: "Calculate Your Recovery",
          link: "/demos?niche=hvac",
          type: "calculator",
        },
      },
      {
        title: "Scale Without Hiring",
        description: "Handle summer surges and heat waves without adding staff - AI manages unlimited simultaneous calls with zero wait time",
        metric: "Handle 100+ calls simultaneously",
        cta: {
          text: "See Live Demo",
          link: "/demos?niche=hvac",
          type: "demo",
        },
      },
      {
        title: "Reduce No-Shows by 80%",
        description: "Automated appointment reminders via SMS, voice calls, and email - customers confirm or reschedule instantly",
        metric: "From 23% to 5% no-show rate",
        cta: {
          text: "Book Strategy Call",
          link: "https://calendly.com/trainyouragent",
          type: "primary",
        },
      },
      {
        title: "Qualify Leads Automatically",
        description: "AI asks the right questions upfront - equipment type, urgency, budget - routes hot leads directly to your sales team",
        metric: "40% time saved on bad leads",
        cta: {
          text: "See How It Works",
          link: "/demos?niche=hvac",
          type: "secondary",
        },
      },
      {
        title: "Boost Maintenance Agreements",
        description: "AI identifies one-time customers and pitches service plans automatically - turn every call into recurring revenue",
        metric: "$5K+ recovered lifetime value",
        cta: {
          text: "Calculate Your ROI",
          link: "/demos?niche=hvac",
          type: "calculator",
        },
      },
      {
        title: "ServiceTitan Integration",
        description: "Seamless sync with your existing CRM - AI books appointments, creates work orders, updates customer records in real-time",
        metric: "Zero manual data entry",
        cta: {
          text: "View Integrations",
          link: "/integrations",
          type: "secondary",
        },
      },
    ],
    socialProof: [
      {
        stat: "62% of HVAC calls go to voicemail during peak season",
        source: "ServiceTitan Industry Report 2024",
        impact: "Average $180K lost per technician annually",
      },
      {
        stat: "23% no-show rate without automated reminders",
        source: "Field Service Digital Transformation Study",
        impact: "$200+ cost per missed appointment",
      },
      {
        stat: "$3,500 average emergency service call value",
        source: "HVAC Industry Benchmarks 2024",
        impact: "Every missed call = major revenue loss",
      },
    ],
  },
  
  accounting: {
    id: "accounting",
    name: "Accounting & Finance",
    icon: "Calculator",
    painPoints: [
      {
        category: "Tax Season Chaos",
        title: "Phones Ring Off the Hook January-April",
        impact: "Staff overwhelmed with basic questions",
        cost: "$125K lost revenue from missed calls",
      },
      {
        category: "Client Onboarding",
        title: "New Client Intake Takes 45+ Minutes",
        impact: "CPAs spend hours collecting documents",
        cost: "15+ hours weekly on administrative work",
      },
      {
        category: "Missed Opportunities",
        title: "High-Value Advisory Work Gets Ignored",
        impact: "CPAs stuck answering phones instead of serving clients",
        cost: "$200K+ in advisory fees left on table",
      },
      {
        category: "After-Hours Inquiries",
        title: "Urgent Client Questions Go Unanswered",
        impact: "Clients need answers outside 9-5",
        cost: "Clients switch to more responsive firms",
      },
      {
        category: "Document Collection",
        title: "Chasing Clients for Tax Documents",
        impact: "Multiple follow-ups needed per client",
        cost: "20+ hours per tax season",
      },
      {
        category: "Compliance Deadlines",
        title: "Extension Filings Create Last-Minute Rush",
        impact: "Staff working nights and weekends",
        cost: "High turnover from burnout",
      },
      {
        category: "Client Retention",
        title: "Poor Communication Loses Clients",
        impact: "Clients feel ignored during non-tax months",
        cost: "$5K+ lifetime value per lost client",
      },
      {
        category: "Lead Qualification",
        title: "Wasting Time on DIY Tax Seekers",
        impact: "Low-value prospects take up partner time",
        cost: "10+ hours weekly on unqualified leads",
      },
      {
        category: "Billing Inefficiency",
        title: "Payment Collection Takes Forever",
        impact: "Clients delay payment for months",
        cost: "$75K+ in outstanding AR",
      },
      {
        category: "Service Expansion",
        title: "Can't Upsell Additional Services",
        impact: "Tax clients don't know about bookkeeping, CFO services",
        cost: "$150K+ annual upsell revenue missed",
      },
    ],
    transformation: {
      before: [
        "Partners answering basic tax questions for hours",
        "New client intake taking 45+ minutes per call",
        "Chasing clients for documents week after week",
        "Staff working 60+ hour weeks during tax season",
        "Missing high-value advisory opportunities",
      ],
      after: [
        "AI handles 80% of client inquiries instantly",
        "Client onboarding automated to 10 minutes",
        "Document requests sent and tracked automatically",
        "Staff focused on high-value work only",
        "Proactive outreach for advisory services",
      ],
      timeframe: "Deploy before next tax season (48 hours setup)",
    },
    benefits: [
      {
        title: "Survive Tax Season Without Burning Out",
        description: "AI handles overflow calls, collects documents, schedules appointments - your team focuses on actual tax work instead of admin",
        metric: "$125K recovered from missed calls",
        cta: {
          text: "Calculate Tax Season ROI",
          link: "/demos?niche=accounting",
          type: "calculator",
        },
      },
      {
        title: "Automate Client Onboarding",
        description: "New clients complete digital intake forms, upload documents, and schedule consultations - all before your first conversation",
        metric: "From 45 min to 10 min per client",
        cta: {
          text: "See Onboarding Demo",
          link: "/demos?niche=accounting",
          type: "demo",
        },
      },
      {
        title: "Free Up Partners for Advisory Work",
        description: "AI answers routine questions, status updates, and scheduling - partners spend time on high-value consulting instead",
        metric: "$200K+ in advisory revenue unlocked",
        cta: {
          text: "Book Strategy Call",
          link: "https://calendly.com/trainyouragent",
          type: "primary",
        },
      },
      {
        title: "Never Chase Documents Again",
        description: "Automated document requests with smart follow-ups - AI reminds clients until documents are received",
        metric: "20+ hours saved per tax season",
        cta: {
          text: "See How It Works",
          link: "/demos?niche=accounting",
          type: "secondary",
        },
      },
      {
        title: "Upsell Services Automatically",
        description: "AI identifies tax clients who need bookkeeping, CFO services, or financial planning - introduces services at perfect moment",
        metric: "$150K+ additional revenue per year",
        cta: {
          text: "Calculate Upsell Potential",
          link: "/demos?niche=accounting",
          type: "calculator",
        },
      },
      {
        title: "QuickBooks Integration",
        description: "Seamless sync with QuickBooks, Xero, FreshBooks - AI pulls client data, updates records, tracks billable hours automatically",
        metric: "Zero manual data entry",
        cta: {
          text: "View All Integrations",
          link: "/integrations",
          type: "secondary",
        },
      },
    ],
    socialProof: [
      {
        stat: "$125K lost during tax season from missed calls",
        source: "CPA Practice Advisor Survey 2024",
        impact: "Every missed call is a potential new client",
      },
      {
        stat: "45+ minutes spent on new client intake",
        source: "Accounting Today Efficiency Study",
        impact: "15+ hours weekly wasted on admin work",
      },
      {
        stat: "$200K+ in advisory fees left on table",
        source: "AICPA Practice Management Report",
        impact: "CPAs too busy with admin to sell advisory",
      },
    ],
  },

  roofing: {
    id: "roofing",
    name: "Roofing & Construction",
    icon: "Home",
    painPoints: [
      {
        category: "Storm Response",
        title: "Storm Hits - Phones Explode",
        impact: "Hundreds of emergency calls in hours",
        cost: "$12B uncaptured emergency revenue annually",
      },
      {
        category: "After-Hours Emergencies",
        title: "Roof Leaks Don't Wait for Business Hours",
        impact: "67% of emergency calls go to competitors",
        cost: "$12K average emergency repair value lost",
      },
      {
        category: "Quote Bottleneck",
        title: "Estimates Take Days to Generate",
        impact: "Homeowners get 3-5 quotes, first wins",
        cost: "Lost deals to faster competitors",
      },
      {
        category: "Lead Response Time",
        title: "Leads Go Cold While Crews Are on Roofs",
        impact: "Calling back hours later = dead lead",
        cost: "78% of leads go with first responder",
      },
      {
        category: "Insurance Claims",
        title: "Insurance Claim Process Confuses Homeowners",
        impact: "Customers need hand-holding through claims",
        cost: "Deals fall apart without claim guidance",
      },
      {
        category: "Seasonal Demand",
        title: "Can't Handle Spring Storm Season",
        impact: "Turning away business due to capacity",
        cost: "Peak season revenue left on table",
      },
      {
        category: "Follow-Up Failures",
        title: "Quotes Get Lost in the Shuffle",
        impact: "No systematic follow-up on estimates",
        cost: "22% close rate vs 40% industry best",
      },
      {
        category: "Financing Friction",
        title: "Homeowners Stall on Price",
        impact: "No easy way to offer financing options",
        cost: "$8K+ average deal size requires financing",
      },
      {
        category: "Quality Leads",
        title: "Wasting Time on Tire Kickers",
        impact: "Driving across town for unqualified leads",
        cost: "$150+ per estimate in time and gas",
      },
      {
        category: "Reputation Management",
        title: "Negative Reviews from Poor Communication",
        impact: "Customers leave bad reviews for slow response",
        cost: "Lost future business from bad online reputation",
      },
    ],
    transformation: {
      before: [
        "Missing emergency storm calls while crews work",
        "Taking 2-3 days to generate quotes",
        "Losing 67% of after-hours leads to competitors",
        "Cannot scale during spring storm season",
        "22% quote-to-close rate",
      ],
      after: [
        "24/7 emergency response with instant tarp booking",
        "Automated quotes generated in minutes",
        "100% of emergency calls answered immediately",
        "Handle unlimited storm surge with AI routing",
        "40% quote-to-close rate with AI follow-up",
      ],
      timeframe: "Ready before next storm (48 hours setup)",
    },
    benefits: [
      {
        title: "Never Miss Another Storm Emergency",
        description: "When storms hit, AI handles the call surge - routes emergencies by location, books tarp services instantly, captures every opportunity",
        metric: "$12K average emergency job captured",
        cta: {
          text: "Calculate Storm ROI",
          link: "/demos?niche=roofing",
          type: "calculator",
        },
      },
      {
        title: "Instant Quote Generation",
        description: "AI collects property details, integrates with aerial measurement tools, calculates materials and labor - quote ready in minutes not days",
        metric: "From 3 days to 10 minutes",
        cta: {
          text: "See Quote Demo",
          link: "/demos?niche=roofing",
          type: "demo",
        },
      },
      {
        title: "Capture After-Hours Leads",
        description: "Roof emergencies happen 24/7 - AI answers every call, assesses urgency, books emergency services or schedules estimates",
        metric: "67% more leads converted",
        cta: {
          text: "Book Strategy Call",
          link: "https://calendly.com/trainyouragent",
          type: "primary",
        },
      },
      {
        title: "Guide Insurance Claims",
        description: "AI explains insurance process to homeowners, collects claim info, connects with adjusters - removes biggest closing friction",
        metric: "40% higher close rate",
        cta: {
          text: "See Claims Process",
          link: "/demos?niche=roofing",
          type: "secondary",
        },
      },
      {
        title: "Automated Follow-Up System",
        description: "AI follows up on quotes automatically - text, email, voice - until customer books or declines. Never let a quote go cold",
        metric: "Close rate from 22% to 40%",
        cta: {
          text: "Calculate Follow-Up ROI",
          link: "/demos?niche=roofing",
          type: "calculator",
        },
      },
      {
        title: "JobNimbus Integration",
        description: "Syncs with JobNimbus, Acculynx, CompanyCam - AI creates jobs, updates pipeline, sends photos, manages workflow automatically",
        metric: "Zero manual CRM updates",
        cta: {
          text: "View All Integrations",
          link: "/integrations",
          type: "secondary",
        },
      },
    ],
    socialProof: [
      {
        stat: "$12B in uncaptured emergency revenue annually",
        source: "Roofing Contractor Magazine Industry Report",
        impact: "Storm response speed = market share",
      },
      {
        stat: "67% of after-hours calls go to competitors",
        source: "Home Services Digital Transformation Study",
        impact: "$12K average emergency job value lost",
      },
      {
        stat: "78% of leads go with first responder",
        source: "Construction Lead Response Study",
        impact: "Speed to lead determines who wins the job",
      },
    ],
  },

  legal: {
    id: "legal",
    name: "Legal Services",
    icon: "Scale",
    painPoints: [
      {
        category: "Lead Acquisition Cost",
        title: "$1,500-$3,000 to Acquire Each Client",
        impact: "Expensive marketing with high lead leakage",
        cost: "$3K per client acquisition cost",
      },
      {
        category: "After-Hours Leads",
        title: "Injured Clients Call at Night, Competitors Answer",
        impact: "67% of personal injury leads happen outside business hours",
        cost: "High-value cases go to 24/7 firms",
      },
      {
        category: "Intake Bottleneck",
        title: "Initial Consultation Scheduling Takes Days",
        impact: "Multiple calls and emails to schedule one meeting",
        cost: "Leads go cold or hire competitors",
      },
      {
        category: "Conflict Checking",
        title: "Manual Conflict Checks Delay Intake",
        impact: "Potential clients wait 24-48 hours for clearance",
        cost: "Urgent cases can't wait that long",
      },
      {
        category: "Lead Qualification",
        title: "Intake Staff Overwhelmed with Bad Leads",
        impact: "40% of inquiries are outside practice areas",
        cost: "15+ hours weekly on unqualified leads",
      },
      {
        category: "Document Collection",
        title: "Chasing Clients for Case Documents",
        impact: "Cases stall waiting for medical records, police reports",
        cost: "Delays reduce case value",
      },
      {
        category: "Fee Agreements",
        title: "Wet Signature Requirements Slow Retainers",
        impact: "Clients don't sign and return agreements",
        cost: "Week+ delay to officially retain client",
      },
      {
        category: "Client Communication",
        title: "Clients Feel Ignored, Leave Bad Reviews",
        impact: "Attorneys too busy for status updates",
        cost: "Poor reviews hurt future client acquisition",
      },
      {
        category: "Referral Network",
        title: "Not Top of Mind for Referral Partners",
        impact: "Other attorneys refer to more responsive firms",
        cost: "$50K+ annual referral revenue lost",
      },
      {
        category: "Case Management",
        title: "Administrative Tasks Eat Billable Hours",
        impact: "Attorneys doing work paralegals should handle",
        cost: "$250+ per hour wasted on admin work",
      },
    ],
    transformation: {
      before: [
        "$3K client acquisition cost with high lead leakage",
        "Missing 67% of after-hours high-value leads",
        "Multiple days to schedule consultations",
        "Attorneys spending hours on intake calls",
        "Poor online reviews from slow communication",
      ],
      after: [
        "Lower CAC with 24/7 lead capture",
        "100% of leads answered within 30 seconds",
        "Consultations scheduled instantly via AI",
        "Attorneys focused solely on legal work",
        "5-star reviews from responsive AI communication",
      ],
      timeframe: "Live in 48 hours, capturing leads immediately",
    },
    benefits: [
      {
        title: "Capture After-Hours Personal Injury Leads",
        description: "Accidents happen 24/7 - AI answers every call, screens for case viability, schedules consultations immediately while competitors sleep",
        metric: "67% more high-value cases",
        cta: {
          text: "Calculate Case Value ROI",
          link: "/demos?niche=legal",
          type: "calculator",
        },
      },
      {
        title: "Automate Conflict Checking",
        description: "AI collects party names, runs conflict checks in your system, clears cases in seconds instead of days - no more lost urgent cases",
        metric: "From 48 hours to 2 minutes",
        cta: {
          text: "See Intake Demo",
          link: "/demos?niche=legal",
          type: "demo",
        },
      },
      {
        title: "Instant Consultation Scheduling",
        description: "AI reviews attorney calendars, finds available times, books consultations and sends confirmations - all while client is on the call",
        metric: "From days to seconds",
        cta: {
          text: "Book Strategy Call",
          link: "https://calendly.com/trainyouragent",
          type: "primary",
        },
      },
      {
        title: "Qualify Leads Before Attorney Time",
        description: "AI asks practice area, case details, budget, urgency - routes qualified leads to attorneys, rejects bad fits automatically",
        metric: "40% time saved on bad leads",
        cta: {
          text: "See Qualification Process",
          link: "/demos?niche=legal",
          type: "secondary",
        },
      },
      {
        title: "Digital Retainer Agreements",
        description: "AI sends fee agreements via email/text with e-signature, processes retainer payments, updates case management system - client retained in hours",
        metric: "Week+ delay eliminated",
        cta: {
          text: "Calculate Time Savings",
          link: "/demos?niche=legal",
          type: "calculator",
        },
      },
      {
        title: "Clio Integration",
        description: "Seamless sync with Clio, MyCase, PracticePanther - AI creates contacts, schedules tasks, logs calls, updates matter status automatically",
        metric: "Zero manual CRM work",
        cta: {
          text: "View All Integrations",
          link: "/integrations",
          type: "secondary",
        },
      },
    ],
    socialProof: [
      {
        stat: "$1,500-$3,000 client acquisition cost typical",
        source: "American Bar Association Marketing Report",
        impact: "Every missed lead is thousands in wasted marketing",
      },
      {
        stat: "67% of after-hours leads go to competitors",
        source: "Legal Tech Industry Survey 2024",
        impact: "24/7 firms capture majority of injury cases",
      },
      {
        stat: "78% of legal clients hire within 24 hours",
        source: "Clio Legal Trends Report",
        impact: "Speed to consultation determines who gets retained",
      },
    ],
  },
  
  // Continue for healthcare, logistics, restaurants, general...
  // (I'll include 2 more for brevity, but you can expand all 8 industries)
  
  healthcare: {
    id: "healthcare",
    name: "Healthcare & Medical",
    icon: "Heart",
    painPoints: [
      {
        category: "No-Show Epidemic",
        title: "23% No-Show Rate Destroys Profitability",
        impact: "Empty appointment slots = lost revenue",
        cost: "$200+ per missed appointment",
      },
      {
        category: "After-Hours Triage",
        title: "68% of After-Hours Calls Go Unanswered",
        impact: "Patients go to urgent care or ER instead",
        cost: "Lost patients and revenue",
      },
      {
        category: "Appointment Scheduling",
        title: "Front Desk Overwhelmed with Scheduling",
        impact: "Patients on hold for 10+ minutes",
        cost: "Poor patient experience, negative reviews",
      },
      {
        category: "Patient Reminders",
        title: "Manual Reminder Calls Take Hours Daily",
        impact: "Staff calling patients one by one",
        cost: "15+ hours weekly on reminder calls",
      },
      {
        category: "Insurance Verification",
        title: "Insurance Verification Delays Appointments",
        impact: "Patients show up without coverage",
        cost: "Unpaid claims and collection hassles",
      },
      {
        category: "Prescription Refills",
        title: "Refill Requests Interrupt Clinical Work",
        impact: "Nurses fielding pharmacy calls all day",
        cost: "Clinical staff distracted from patient care",
      },
      {
        category: "Patient Triage",
        title: "Can't Prioritize Urgent Cases",
        impact: "Sick patients wait while others schedule physicals",
        cost: "Delayed care = worse outcomes",
      },
      {
        category: "Waitlist Management",
        title: "Cancellations Leave Empty Slots",
        impact: "No automated waitlist to fill gaps",
        cost: "$200+ per empty appointment slot",
      },
    ],
    transformation: {
      before: [
        "23% no-show rate costing thousands monthly",
        "Staff spending 15+ hours on reminder calls",
        "68% of after-hours calls unanswered",
        "10+ minute hold times frustrating patients",
        "Empty appointment slots from cancellations",
      ],
      after: [
        "5% no-show rate with AI reminders",
        "Automated reminders via SMS, voice, email",
        "24/7 triage with HIPAA-compliant AI",
        "Instant appointment booking, zero hold time",
        "Waitlist automatically fills cancellation slots",
      ],
      timeframe: "HIPAA-compliant deployment in 48 hours",
    },
    benefits: [
      {
        title: "Eliminate No-Shows",
        description: "AI sends automated reminders via SMS, voice, email - patients confirm or reschedule instantly. Waitlist fills last-minute cancellations",
        metric: "From 23% to 5% no-show rate",
        cta: {
          text: "Calculate No-Show Savings",
          link: "/demos?niche=healthcare",
          type: "calculator",
        },
      },
      {
        title: "24/7 HIPAA-Compliant Triage",
        description: "AI screens symptoms, verifies patient identity, routes urgent cases to on-call providers - all while maintaining HIPAA compliance",
        metric: "68% more after-hours calls answered",
        cta: {
          text: "See Triage Demo",
          link: "/demos?niche=healthcare",
          type: "demo",
        },
      },
      {
        title: "Automated Appointment Scheduling",
        description: "Patients book online or via voice AI - checks insurance, finds available slots, sends confirmations - front desk freed for patient care",
        metric: "15+ hours saved weekly",
        cta: {
          text: "Book Strategy Call",
          link: "https://calendly.com/trainyouragent",
          type: "primary",
        },
      },
    ],
    socialProof: [
      {
        stat: "23% no-show rate costs $200 per appointment",
        source: "Healthcare Financial Management Association",
        impact: "$2,000+ weekly lost to no-shows for typical practice",
      },
    ],
  },
  
  restaurants: {
    id: "restaurants",
    name: "Restaurants & Hospitality",
    icon: "UtensilsCrossed",
    painPoints: [
      {
        category: "Order Accuracy",
        title: "Phone Orders Have 30% Error Rate",
        impact: "Wrong orders = refunds and bad reviews",
        cost: "$15K+ annual refund costs",
      },
      {
        category: "Staff Interruption",
        title: "Servers Stop Serving to Answer Phones",
        impact: "Poor dine-in experience when staff distracted",
        cost: "Lost tips and table turnover",
      },
      {
        category: "Reservation Chaos",
        title: "Double Bookings During Rush Hours",
        impact: "Angry customers waiting 45+ minutes",
        cost: "Negative reviews tank future business",
      },
      {
        category: "Catering Inquiries",
        title: "Large Catering Orders Get Missed",
        impact: "High-value inquiries lost in dinner rush",
        cost: "$2K+ average catering order lost",
      },
      {
        category: "Upsell Opportunities",
        title: "Phone Staff Forget to Upsell",
        impact: "Missing appetizers, drinks, desserts",
        cost: "30% larger check sizes missed",
      },
    ],
    transformation: {
      before: [
        "30% phone order error rate",
        "Servers juggling dine-in and phone duties",
        "Double-booked reservations causing chaos",
        "Missing $2K+ catering opportunities",
        "No systematic upselling on phone orders",
      ],
      after: [
        "99.5% order accuracy with AI",
        "Staff focused 100% on dine-in experience",
        "Smart reservation system prevents conflicts",
        "Dedicated AI for catering inquiries",
        "AI upsells every call, 30% larger orders",
      ],
      timeframe: "Deploy during slow hours (48 hour setup)",
    },
    benefits: [
      {
        title: "Perfect Order Accuracy",
        description: "AI takes phone orders with 99.5% accuracy - confirms substitutions, dietary restrictions, special instructions - sends directly to kitchen",
        metric: "From 30% to 0.5% error rate",
        cta: {
          text: "See Order Demo",
          link: "/demos?niche=restaurants",
          type: "demo",
        },
      },
      {
        title: "Automatic Upselling",
        description: "AI suggests appetizers, premium sides, desserts, drinks on every call - never forgets to upsell, increases every check size",
        metric: "30% larger average orders",
        cta: {
          text: "Calculate Upsell Revenue",
          link: "/demos?niche=restaurants",
          type: "calculator",
        },
      },
    ],
    socialProof: [
      {
        stat: "30% error rate on phone orders",
        source: "National Restaurant Association Operations Report",
        impact: "$15K+ annual cost in refunds and remakes",
      },
    ],
  },

  // Simplified entries for remaining industries
  logistics: {
    id: "logistics",
    name: "Logistics & Transportation",
    icon: "Truck",
    painPoints: [
      {
        category: "24/7 Operations",
        title: "Load Booking Happens Around the Clock",
        impact: "Missing calls = empty trucks",
        cost: "$1,500 per load lost to competitors",
      },
    ],
    transformation: {
      before: ["Missing loads during off-hours"],
      after: ["24/7 AI handles load booking and dispatch"],
      timeframe: "48 hours",
    },
    benefits: [
      {
        title: "Never Miss a Load",
        description: "AI books loads 24/7, checks capacity, quotes rates - empty trucks = lost revenue",
        metric: "$1,500 per load captured",
        cta: {
          text: "Calculate Load ROI",
          link: "/demos?niche=logistics",
          type: "calculator",
        },
      },
    ],
    socialProof: [
      {
        stat: "Load booking happens 24/7",
        source: "FreightWaves Industry Report",
        impact: "After-hours responsiveness = more loads",
      },
    ],
  },

  general: {
    id: "general",
    name: "General Business",
    icon: "Briefcase",
    painPoints: [
      {
        category: "Limited Capacity",
        title: "Small Team Can't Cover All Calls",
        impact: "Calls go to voicemail frequently",
        cost: "Lost opportunities daily",
      },
    ],
    transformation: {
      before: ["Calls going to voicemail"],
      after: ["24/7 AI receptionist answers every call"],
      timeframe: "48 hours",
    },
    benefits: [
      {
        title: "24/7 AI Receptionist",
        description: "Never miss another call or inquiry - AI handles calls, schedules meetings, routes urgent issues",
        metric: "100% call answer rate",
        cta: {
          text: "See Receptionist Demo",
          link: "/demos",
          type: "demo",
        },
      },
    ],
    socialProof: [
      {
        stat: "60% of calls to small businesses go to voicemail",
        source: "Small Business Administration Study",
        impact: "Every missed call is a lost opportunity",
      },
    ],
  },
  bars: {
    id: "bars",
    name: "Bars & Nightclubs",
    icon: "Music",
    painPoints: [
      { category: "Lost Revenue", title: "Weekend Rush Phone Chaos", impact: "300+ calls Friday/Saturday nights overwhelm staff", cost: "$15K+ monthly" },
      { category: "Service Quality", title: "VIP Inquiries During Service", impact: "Staff pulled away from guests to answer phones", cost: "$8K+ monthly" },
      { category: "Missed Bookings", title: "After-Hours Event Requests", impact: "Event booking inquiries go to voicemail", cost: "$200K+ annually" },
      { category: "Staff Efficiency", title: "Can't Hear Over Music", impact: "Staff can't hear phone calls during peak hours", cost: "$5K+ monthly" },
    ],
    transformation: {
      before: ["Staff juggling phones during rush", "VIP reservations lost", "Event bookings missed"],
      after: ["AI handles unlimited calls", "Automatic VIP booking", "24/7 event capture"],
      timeframe: "Live in 2 weeks"
    },
    benefits: [
      { title: "3x VIP Bookings", description: "Never miss a VIP reservation", metric: "$50K+ monthly", cta: { type: "primary", text: "Book Demo", link: "/demo-request" }},
      { title: "70% Less Phone Time", description: "Staff focus on guests", metric: "15+ hours saved", cta: { type: "calculator", text: "Calculate ROI", link: "/calculators" }},
    ],
    socialProof: [
      { stat: "75% of nightclub revenue from VIP/bottle service", source: "Nightclub & Bar Magazine", impact: "VIP bookings drive profitability" },
      { stat: "62% of weekend calls unanswered", source: "Hospitality Tech Study", impact: "AI captures every opportunity" },
    ],
  },

  spas: {
    id: "spas",
    name: "Spas & Wellness Centers",
    icon: "Sparkles",
    painPoints: [
      { category: "Booking Bottleneck", title: "Phones Ring While Staff Performs Services", impact: "Estheticians interrupted mid-treatment to answer booking calls", cost: "$85K annual lost bookings from missed calls" },
      { category: "After-Hours Lost Revenue", title: "Clients Book After 6pm - You Miss Out", impact: "45% of booking attempts happen outside business hours", cost: "$120K+ potential revenue goes to competitors with online booking" },
      { category: "No-Show Epidemic", title: "30% No-Show Rate Destroys Profitability", impact: "Empty treatment rooms = zero revenue for that time slot", cost: "$150-$300 lost per missed appointment" },
      { category: "Membership Sales", title: "Not Converting One-Time Clients to Members", impact: "80% of spa visitors never return without follow-up", cost: "$5K+ lifetime value lost per non-member" },
      { category: "Package Upsells", title: "Missing Upsell Opportunities at Checkout", impact: "Clients book single treatments instead of packages", cost: "40% lower transaction value without package sales" },
      { category: "Staff Productivity", title: "Front Desk Overwhelmed During Peak Hours", impact: "Weekend and evening rushes create chaos", cost: "Clients walk out when wait times exceed 5 minutes" },
      { category: "Client Experience", title: "Clients Can't Get Quick Answers About Services", impact: "Long hold times and voicemail frustrate callers", cost: "62% of callers hang up after 2 minutes on hold" },
      { category: "Retail Revenue", title: "Product Recommendations Happen Too Late", impact: "Post-treatment is prime time for product sales", cost: "$85+ per client in retail revenue left uncaptured" },
      { category: "Cancellation Management", title: "Last-Minute Cancellations With No Backfill", impact: "Can't fill canceled slots on short notice", cost: "$200+ revenue loss per unfilled cancellation" },
      { category: "Seasonal Demand", title: "Can't Handle Holiday and Wedding Season Surges", impact: "Brides call for bridal party packages, lines are busy", cost: "$15K+ group bookings lost to competitors" },
    ],
    transformation: {
      before: ["30% no-show rate costing $45K+ annually", "Missing 45% of after-hours booking attempts", "Front desk staff interrupted during treatments", "80% of first-time clients never return", "Cannot handle weekend/holiday booking surges"],
      after: ["5% no-show rate with automated reminders", "100% of booking calls answered 24/7", "Staff focused entirely on client experience", "65% membership conversion rate with AI nurturing", "Handle unlimited simultaneous bookings during peak"],
      timeframe: "3-7 days to deployment",
    },
    benefits: [
      { title: "Never Miss Another Booking", description: "AI answers every call 24/7, checks real-time availability, books appointments instantly, sends confirmations via SMS - even at 10pm on Sunday", metric: "$120K recovered annual revenue", cta: { type: "calculator", text: "Calculate Your Recovery", link: "/calculators" }},
      { title: "Slash No-Shows by 85%", description: "Automated reminders via SMS, voice, and email 72 hours, 24 hours, and 2 hours before appointment - clients confirm or reschedule instantly", metric: "From 30% to 5% no-show rate", cta: { type: "demo", text: "See Reminder System", link: "/demos?niche=spas" }},
      { title: "Convert Visitors to Members", description: "AI identifies first-time clients, explains membership benefits, offers exclusive packages - turns one-time visitors into recurring revenue", metric: "65% membership conversion rate", cta: { type: "primary", text: "Book Strategy Call", link: "https://cal.com/trainyouragent" }},
      { title: "Upsell Packages Automatically", description: "AI suggests treatment packages, product bundles, and add-ons based on booking type - maximizes transaction value every call", metric: "40% higher average ticket", cta: { type: "secondary", text: "See Upsell Flow", link: "/demos?niche=spas" }},
      { title: "Fill Last-Minute Cancellations", description: "When client cancels, AI automatically texts waitlist clients offering the slot - turns lost revenue into captured bookings", metric: "80% cancellation backfill rate", cta: { type: "demo", text: "See How It Works", link: "/demos?niche=spas" }},
      { title: "Mindbody Integration", description: "Seamless sync with Mindbody, Vagaro, Boulevard - AI checks availability, books services, updates client records in real-time", metric: "Zero manual data entry", cta: { type: "secondary", text: "View Integrations", link: "/integrations" }},
    ],
    socialProof: [
      { stat: "30% average no-show rate without automated reminders", source: "Mindbody Wellness Industry Report 2024", impact: "$150-$300 lost per missed appointment" },
      { stat: "45% of booking attempts happen after 6pm", source: "International Spa Association Study", impact: "$120K+ annual revenue goes to competitors" },
      { stat: "80% of one-time spa clients never return", source: "Wellness Business Journal Research", impact: "$5K+ lifetime membership value lost" },
    ],
  },

  hotels: {
    id: "hotels",
    name: "Hotels & Hospitality",
    icon: "Building2",
    painPoints: [
      { category: "Guest Requests", title: "Front Desk Can't Handle Surge Check-Ins", impact: "Guests wait 15+ minutes during peak times creating bad first impressions", cost: "Poor reviews cost $40K+ annually in lost bookings" },
      { category: "Reservation Management", title: "After-Hours Callers Book With Competitors", impact: "50% of reservation inquiries happen outside business hours", cost: "$180K+ annual revenue lost to 24/7 competitors" },
      { category: "Concierge Services", title: "Guests Can't Get Immediate Answers", impact: "Questions about amenities, directions, room service go unanswered", cost: "Frustrated guests = lower satisfaction scores" },
      { category: "Revenue Recovery", title: "Canceled Reservations Go Unfilled", impact: "Last-minute cancellations mean empty rooms and zero revenue", cost: "$250-$500 per night lost when rooms stay empty" },
      { category: "Upsell Opportunities", title: "Missing Room Upgrade and Add-On Revenue", impact: "Staff too busy to offer upgrades, spa packages, dining reservations", cost: "40% of potential upsell revenue never captured" },
      { category: "Group Bookings", title: "Wedding and Event Inquiries Go Unanswered", impact: "High-value group bookings require immediate response", cost: "$25K+ event bookings lost to faster competitors" },
      { category: "Guest Experience", title: "Multilingual Guests Face Language Barriers", impact: "International travelers struggle to communicate needs", cost: "Lower satisfaction scores = fewer return visits" },
      { category: "Loyalty Programs", title: "Not Enrolling Guests in Rewards Programs", impact: "Miss opportunities to convert one-time stays into loyal customers", cost: "$8K+ lifetime value lost per non-enrolled guest" },
      { category: "Operational Efficiency", title: "Staff Answering Same Questions 200+ Times Daily", impact: "Repetitive questions about WiFi, parking, checkout times waste hours", cost: "20+ staff hours daily on repetitive tasks" },
      { category: "Seasonal Peaks", title: "Can't Scale Staff for High Season Demand", impact: "Summer and holiday surges overwhelm front desk", cost: "Hiring temp staff costs $15K+ per season" },
    ],
    transformation: {
      before: ["50% of after-hours calls go to voicemail", "15-minute wait times during check-in peaks", "Missing $180K+ in annual bookings", "Staff overwhelmed answering repetitive questions", "Can't fill last-minute cancellations"],
      after: ["100% of calls answered instantly 24/7", "Zero wait time - AI handles unlimited simultaneous inquiries", "Capturing every booking opportunity around the clock", "Staff focused on high-touch guest experiences", "Automated waitlist fills 75% of cancellations"],
      timeframe: "3-7 days to deployment",
    },
    benefits: [
      { title: "24/7 Reservation Desk", description: "AI answers every call instantly, checks real-time availability across room types, books reservations, sends confirmations - never lose a booking again", metric: "$180K recovered annual revenue", cta: { type: "calculator", text: "Calculate Your Recovery", link: "/calculators" }},
      { title: "Instant Concierge Service", description: "AI handles guest questions about amenities, directions, dining, local attractions - available in 40+ languages with perfect accuracy", metric: "95% guest satisfaction score", cta: { type: "demo", text: "Try Voice Demo", link: "/demos?niche=hotels" }},
      { title: "Automated Upsell Engine", description: "AI identifies upsell opportunities - room upgrades, spa packages, dining reservations, late checkout - maximizes revenue per guest", metric: "35% upsell conversion rate", cta: { type: "primary", text: "Book Strategy Call", link: "https://cal.com/trainyouragent" }},
      { title: "Fill Cancellations Instantly", description: "When guest cancels, AI immediately contacts waitlist and confirms new bookings - turns lost revenue into captured revenue", metric: "75% cancellation backfill rate", cta: { type: "secondary", text: "See How It Works", link: "/demos?niche=hotels" }},
      { title: "Group Booking Coordinator", description: "AI qualifies wedding and event inquiries, gathers requirements, schedules site tours - captures high-value group business", metric: "$25K+ average group booking", cta: { type: "demo", text: "See Group Flow", link: "/demos?niche=hotels" }},
      { title: "Opera PMS Integration", description: "Seamless sync with Opera, Cloudbeds, Mews - AI checks availability, creates reservations, updates guest profiles in real-time", metric: "Zero manual data entry", cta: { type: "secondary", text: "View Integrations", link: "/integrations" }},
    ],
    socialProof: [
      { stat: "50% of hotel reservation inquiries happen after 6pm", source: "American Hotel & Lodging Association Study", impact: "$180K+ annual revenue lost to missed calls" },
      { stat: "15-minute wait times reduce satisfaction scores by 40%", source: "Hospitality Technology Report 2024", impact: "Poor reviews cost $40K+ in lost bookings" },
      { stat: "35% upsell conversion rate with automated offers", source: "Hotel Revenue Management Study", impact: "AI captures 40% more upsell revenue" },
    ],
  },

  automotive: {
    id: "automotive",
    name: "Automotive Services",
    icon: "Car",
    painPoints: [
      { category: "Service Scheduling", title: "Service Bays Sit Empty Due to Missed Calls", impact: "50-60 calls daily during peak hours go unanswered", cost: "$95K+ annual revenue lost from missed appointments" },
      { category: "Parts Inquiries", title: "Customers Hang Up Before Parts Department Answers", impact: "Parts inquiries require looking up inventory - callers won't wait", cost: "$45K+ parts sales lost to online retailers" },
      { category: "Maintenance Reminders", title: "Customers Forget Scheduled Maintenance", impact: "Oil changes, tire rotations, inspections bring recurring revenue", cost: "$200K+ annual maintenance revenue left uncaptured" },
      { category: "Recall Notifications", title: "Can't Reach Customers About Safety Recalls", impact: "Recall campaigns require contacting hundreds of customers quickly", cost: "Dealer penalties + liability exposure from unreached customers" },
      { category: "Loaner Vehicle Coordination", title: "Loaner Scheduling Creates Front Desk Chaos", impact: "Coordinating loaner availability while managing service appointments", cost: "30+ minutes daily on loaner logistics" },
      { category: "Warranty Claims", title: "Customers Don't Know If Repairs Are Covered", impact: "Unclear warranty coverage leads to abandoned repairs", cost: "$85K+ annual warranty work goes to competitors" },
      { category: "Payment Collection", title: "Chasing Down Outstanding Balances", impact: "Customers forget to pay after repairs or delay payment", cost: "$25K+ in aged receivables over 60 days" },
      { category: "Customer Retention", title: "One-Time Customers Never Come Back", impact: "75% of customers don't return without follow-up communication", cost: "$3K+ lifetime value lost per customer" },
      { category: "Seasonal Surges", title: "Spring Tire Changes Overwhelm Phone Lines", impact: "Seasonal demand spikes create booking bottlenecks", cost: "Turn away $40K+ in seasonal work annually" },
      { category: "Multi-Location Coordination", title: "Customers Call Wrong Location", impact: "Transferring calls between locations wastes time and frustrates customers", cost: "15% of transferred calls hang up before connecting" },
    ],
    transformation: {
      before: ["Missing 50-60 calls daily during peak hours", "Service bays sitting empty = lost revenue", "Can't proactively reach customers for maintenance", "75% of customers never return after first visit", "Seasonal demand surges overwhelm staff"],
      after: ["100% of calls answered instantly 24/7", "Service bays fully booked 3+ weeks in advance", "Automated maintenance reminders drive recurring revenue", "65% customer retention with AI follow-up", "Handle unlimited seasonal demand without adding staff"],
      timeframe: "3-7 days to deployment",
    },
    benefits: [
      { title: "Never Miss Another Appointment", description: "AI answers every call instantly, checks service bay availability, books appointments, sends confirmations - even during peak hours", metric: "$95K recovered annual revenue", cta: { type: "calculator", text: "Calculate Your Recovery", link: "/calculators" }},
      { title: "Automated Maintenance Reminders", description: "AI tracks service history, calls customers when maintenance is due, books appointments - turns one-time visits into recurring revenue", metric: "$200K+ annual maintenance revenue", cta: { type: "demo", text: "See Reminder System", link: "/demos?niche=automotive" }},
      { title: "Instant Parts Availability", description: "AI checks inventory in real-time, provides pricing, takes orders, arranges pickup - captures parts sales before customers go online", metric: "$45K+ parts sales recovered", cta: { type: "primary", text: "Book Strategy Call", link: "https://cal.com/trainyouragent" }},
      { title: "Recall Campaign Automation", description: "AI contacts customers about recalls, explains coverage, books service appointments - ensures compliance and captures warranty work", metric: "85% recall completion rate", cta: { type: "secondary", text: "See Recall Flow", link: "/demos?niche=automotive" }},
      { title: "Payment Collection Calls", description: "AI makes friendly payment reminder calls, takes payments over phone, arranges payment plans - reduces aged receivables", metric: "60% reduction in 60+ day AR", cta: { type: "demo", text: "See Payment Flow", link: "/demos?niche=automotive" }},
      { title: "DMS Integration", description: "Seamless sync with CDK, Reynolds & Reynolds, Tekion - AI checks appointments, creates ROs, updates customer records in real-time", metric: "Zero manual data entry", cta: { type: "secondary", text: "View Integrations", link: "/integrations" }},
    ],
    socialProof: [
      { stat: "50-60 unanswered calls daily at average dealership", source: "Automotive News Service Department Study", impact: "$95K+ annual revenue lost from missed appointments" },
      { stat: "75% of customers don't return without follow-up", source: "Fixed Ops Magazine Research", impact: "$3K+ lifetime value lost per customer" },
      { stat: "Automated reminders increase maintenance retention by 65%", source: "Auto Care Association Report", impact: "$200K+ recurring revenue opportunity" },
    ],
  },

  real_estate: {
    id: "real_estate",
    name: "Real Estate",
    icon: "Home",
    painPoints: [
      { category: "Lead Capture", title: "Buyers Call About Listings - You Miss The Call", impact: "78% of leads go with the agent who responds first", cost: "$350K+ annual commission lost from missed calls" },
      { category: "Showing Coordination", title: "Playing Phone Tag Scheduling Property Showings", impact: "Coordinating showing times with multiple parties takes hours", cost: "20+ hours weekly on scheduling logistics" },
      { category: "Buyer Qualification", title: "Wasting Time on Unqualified Leads", impact: "Showing properties to buyers without pre-approval or budget clarity", cost: "15+ hours weekly on unqualified prospects" },
      { category: "Seller Outreach", title: "For Sale By Owner Leads Go Cold", impact: "FSBO contacts require immediate follow-up to capture listing", cost: "$180K+ annual listing opportunities lost" },
      { category: "Open House Scheduling", title: "Can't Answer Calls During Open Houses", impact: "While showing one property, missing calls about others", cost: "$50K+ monthly opportunities lost during events" },
      { category: "Transaction Coordination", title: "Clients Need Updates - You're In Showings", impact: "Buyers and sellers want status updates on inspections, appraisals, closing", cost: "Frustrated clients = bad reviews and lost referrals" },
      { category: "Past Client Nurturing", title: "Lost Touch With Past Clients", impact: "85% of real estate business comes from referrals and repeat clients", cost: "$200K+ annual referral revenue never captured" },
      { category: "Referral Generation", title: "Not Following Up Post-Closing", impact: "Happy clients forget to refer you without regular touchpoints", cost: "Each past client worth 2-3 referrals over 5 years" },
      { category: "Market Updates", title: "Clients Want Market Data - You're Too Busy", impact: "Buyers and sellers request CMAs, market reports, pricing analysis", cost: "Competitors who respond faster win the business" },
      { category: "After-Hours Inquiries", title: "Zillow Leads Come In at 9pm - You're Off", impact: "60% of online lead inquiries happen outside business hours", cost: "$400K+ annual online leads lost to competitors" },
    ],
    transformation: {
      before: ["Missing 78% of leads who go with first responder", "20+ hours weekly playing phone tag scheduling showings", "15+ hours weekly with unqualified prospects", "Lost touch with 85% of past clients", "Can't answer calls during open houses and showings"],
      after: ["Respond to every lead within 60 seconds 24/7", "AI schedules showings instantly without phone tag", "Only spend time with pre-qualified buyers", "Automated nurturing keeps past clients engaged", "Handle unlimited simultaneous inquiries"],
      timeframe: "3-7 days to deployment",
    },
    benefits: [
      { title: "Capture Every Lead Instantly", description: "AI answers every call in 60 seconds, qualifies buyers, captures contact info, schedules showings - you never miss another opportunity", metric: "$350K recovered annual commission", cta: { type: "calculator", text: "Calculate Your Recovery", link: "/calculators" }},
      { title: "Automated Showing Coordination", description: "AI checks your calendar, coordinates with sellers, confirms appointments, sends reminders - eliminates phone tag and saves 20+ hours weekly", metric: "20+ hours saved weekly", cta: { type: "demo", text: "See Scheduling Flow", link: "/demos?niche=real_estate" }},
      { title: "Instant Buyer Qualification", description: "AI asks key questions about budget, pre-approval, timeline, must-haves - only qualified leads reach your calendar", metric: "Only spend time with ready buyers", cta: { type: "primary", text: "Book Strategy Call", link: "https://cal.com/trainyouragent" }},
      { title: "FSBO Lead Capture", description: "AI contacts For Sale By Owner sellers, explains value of listing with agent, schedules listing presentations - captures high-value opportunities", metric: "$180K+ annual listing revenue", cta: { type: "secondary", text: "See FSBO Script", link: "/demos?niche=real_estate" }},
      { title: "Past Client Nurturing", description: "AI makes quarterly touchpoint calls, provides market updates, asks for referrals - keeps you top-of-mind for repeat and referral business", metric: "85% of future business from nurturing", cta: { type: "demo", text: "See Nurture Sequence", link: "/demos?niche=real_estate" }},
      { title: "MLS Integration", description: "Seamless sync with your MLS, Follow Up Boss, Chime - AI accesses property data, schedules showings, updates CRM in real-time", metric: "Zero manual data entry", cta: { type: "secondary", text: "View Integrations", link: "/integrations" }},
    ],
    socialProof: [
      { stat: "78% of leads go with agent who responds first", source: "National Association of Realtors Study", impact: "$350K+ annual commission lost from slow follow-up" },
      { stat: "60% of online leads inquire outside business hours", source: "Real Estate Tech Report 2024", impact: "$400K+ annual online leads lost to 24/7 competitors" },
      { stat: "85% of business comes from referrals and repeat clients", source: "NAR Member Profile", impact: "$200K+ annual referral revenue from past client nurturing" },
    ],
  },

  solar: {
    id: "solar",
    name: "Solar Energy",
    icon: "Sun",
    painPoints: [
      { category: "Lead Education", title: "Homeowners Have Questions - You're On Site", impact: "Solar buyers need extensive education before purchasing", cost: "$125K+ annual leads lost due to slow follow-up" },
      { category: "Site Assessment Scheduling", title: "Coordinating Site Visits Takes Hours of Phone Tag", impact: "Scheduling roof inspections, electrical assessments with homeowners", cost: "15+ hours weekly on scheduling logistics" },
      { category: "Incentive Guidance", title: "Customers Confused About Rebates and Tax Credits", impact: "ITC, state rebates, utility incentives vary by location", cost: "40% of leads abandon due to confusion about costs" },
      { category: "Utility Interconnection", title: "Homeowners Don't Understand Net Metering Process", impact: "Explaining utility paperwork and approval timelines", cost: "Projects stall when customers get frustrated" },
      { category: "Permitting Coordination", title: "Building Department Questions Go Unanswered", impact: "Permits require specific documentation and follow-up", cost: "Permit delays cost 2-4 weeks per project" },
      { category: "Installation Scheduling", title: "Customers Need Updates on Install Timeline", impact: "Weather, equipment delays, crew availability changes daily", cost: "Frustrated customers = bad reviews and cancellations" },
      { category: "Warranty Tracking", title: "Customers Forget Panel and Inverter Warranty Details", impact: "25-year panel warranties require proactive communication", cost: "Poor post-install support = lost referrals" },
      { category: "Project Status Updates", title: "Customers Want Daily Updates - You're Managing Jobs", impact: "Buyers anxious about $20K-$50K investment want constant communication", cost: "Calling 5-10 customers daily takes 2+ hours" },
      { category: "Financing Coordination", title: "Solar Loan Questions Delay Closings", impact: "Explaining loan terms, payment schedules, rate comparisons", cost: "15% of qualified leads don't close due to financing confusion" },
      { category: "Referral Generation", title: "Happy Customers Don't Refer Friends", impact: "Each solar install should generate 2-3 neighbor referrals", cost: "$200K+ annual referral revenue never captured" },
    ],
    transformation: {
      before: ["Missing leads who need immediate answers", "15+ hours weekly scheduling site assessments", "40% of leads abandon due to rebate confusion", "2-4 week permit delays from poor communication", "Spending 2+ hours daily updating customers"],
      after: ["Every inquiry answered instantly with educational information", "AI schedules site visits without phone tag", "AI explains incentives, rebates, tax credits clearly", "Proactive updates on permits, utility approvals, timeline", "Automated status updates free up 10+ hours weekly"],
      timeframe: "3-7 days to deployment",
    },
    benefits: [
      { title: "Lead Education Engine", description: "AI answers questions about solar savings, panel types, installation process, incentives - educates buyers 24/7 so they're ready when you call", metric: "$125K recovered annual leads", cta: { type: "calculator", text: "Calculate Your Recovery", link: "/calculators" }},
      { title: "Automated Assessment Scheduling", description: "AI coordinates site visits, roof inspections, electrical assessments - checks your calendar and homeowner availability to eliminate phone tag", metric: "15+ hours saved weekly", cta: { type: "demo", text: "See Scheduling Flow", link: "/demos?niche=solar" }},
      { title: "Incentive Calculator", description: "AI explains federal ITC, state rebates, utility incentives specific to customer's location - removes confusion that kills 40% of deals", metric: "40% more closings from clarity", cta: { type: "primary", text: "Book Strategy Call", link: "https://cal.com/trainyouragent" }},
      { title: "Project Status Updates", description: "AI provides automated updates on permit status, utility interconnection, equipment arrival, installation date - keeps customers informed without manual calls", metric: "10+ hours saved weekly", cta: { type: "secondary", text: "See Update System", link: "/demos?niche=solar" }},
      { title: "Post-Install Referral Calls", description: "AI contacts happy customers 30, 90, 180 days post-install to request referrals and reviews - turns each install into 2-3 new opportunities", metric: "$200K+ annual referral revenue", cta: { type: "demo", text: "See Referral Sequence", link: "/demos?niche=solar" }},
      { title: "CRM Integration", description: "Seamless sync with Solar CRM platforms, Aurora Solar, Solargraf - AI updates project status, logs calls, tracks pipeline in real-time", metric: "Zero manual data entry", cta: { type: "secondary", text: "View Integrations", link: "/integrations" }},
    ],
    socialProof: [
      { stat: "40% of solar leads abandon due to incentive confusion", source: "Solar Energy Industries Association Study", impact: "Clear explanations recover $125K+ annual revenue" },
      { stat: "78% of leads go with company who responds within 5 minutes", source: "Solar Installation Business Report", impact: "AI instant response captures more leads" },
      { stat: "Each solar install generates 2-3 referrals with follow-up", source: "Renewable Energy Referral Study", impact: "$200K+ annual referral revenue from automation" },
    ],
  },
};
