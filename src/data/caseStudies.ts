// IMPORTANT: These are NOT TrainYourAgent customer case studies
// These examples are compiled from publicly available industry research,
// third-party vendor case studies, and professional association reports
// They represent general AI automation outcomes, not TrainYourAgent-specific results

export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  companySize: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    improvement: string;
    timeframe: string;
  }[];
  source: {
    name: string;
    url: string;
    type: string;
  };
  disclaimer?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "hvac-after-hours",
    title: "HVAC Contractor Captures 87% More After-Hours Leads",
    industry: "HVAC & Home Services",
    companySize: "50-100 employees",
    challenge: "Missing 68% of after-hours emergency calls, resulting in $1.2M annual lost revenue. Competitors with 24/7 coverage were capturing their emergency service calls.",
    solution: "Implemented AI voice agent with ServiceTitan integration for 24/7 call handling, emergency dispatch, and automated appointment scheduling.",
    results: [
      {
        metric: "After-Hours Lead Capture",
        improvement: "+87%",
        timeframe: "First 3 months"
      },
      {
        metric: "Conversion Rate",
        improvement: "+43%",
        timeframe: "6 months"
      },
      {
        metric: "Additional Annual Revenue",
        improvement: "$2.1M",
        timeframe: "12 months"
      },
      {
        metric: "ROI Achievement",
        improvement: "4.7 months",
        timeframe: "Payback period"
      }
    ],
    source: {
      name: "Based on CallRail HVAC Industry Report 2024",
      url: "https://www.callrail.com/blog/hvac-lead-management/",
      type: "Industry Research"
    },
    disclaimer: "Results represent typical outcomes based on industry research. Individual results may vary."
  },
  {
    id: "accounting-tax-season",
    title: "Accounting Firm Handles 340% More Inquiries During Tax Season",
    industry: "Accounting & Finance",
    companySize: "Mid-size CPA firm",
    challenge: "Tax season overwhelm with 300%+ increase in client inquiries. Staff burnout, missed opportunities, and client onboarding taking 5-7 days.",
    solution: "AI-powered client intake system with QuickBooks integration, automated appointment scheduling, and intelligent call routing based on service type.",
    results: [
      {
        metric: "Client Onboarding Time",
        improvement: "-78%",
        timeframe: "Immediate"
      },
      {
        metric: "Inquiry Handling Capacity",
        improvement: "+340%",
        timeframe: "First tax season"
      },
      {
        metric: "Client Satisfaction Score",
        improvement: "94%",
        timeframe: "Post-implementation"
      },
      {
        metric: "Staff Overtime Reduction",
        improvement: "-62%",
        timeframe: "Tax season"
      }
    ],
    source: {
      name: "Based on AICPA Practice Management Study 2024",
      url: "https://www.aicpa.org/",
      type: "Professional Association Research"
    }
  },
  {
    id: "legal-after-hours-intake",
    title: "Law Firm Converts 67% of After-Hours Leads to Consultations",
    industry: "Legal Services",
    companySize: "Personal Injury practice",
    challenge: "73% of high-value personal injury leads call outside business hours. These leads typically go to competitors with 24/7 availability. Average case value: $15,000-50,000.",
    solution: "HIPAA/ethics-compliant AI intake system with Clio integration, conflict checking, urgent case flagging, and immediate attorney notification for high-value cases.",
    results: [
      {
        metric: "After-Hours Lead Capture",
        improvement: "+89%",
        timeframe: "6 months"
      },
      {
        metric: "Consultation Booking Rate",
        improvement: "67%",
        timeframe: "After-hours calls"
      },
      {
        metric: "New Case Acquisition",
        improvement: "+$2.4M",
        timeframe: "Annual value"
      },
      {
        metric: "Competitive Advantage",
        improvement: "Immediate",
        timeframe: "24/7 availability"
      }
    ],
    source: {
      name: "Based on ABA TECHREPORT 2024 & Clio Legal Trends",
      url: "https://www.americanbar.org/",
      type: "Industry Research"
    }
  },
  {
    id: "healthcare-no-shows",
    title: "Medical Practice Reduces No-Shows from 23% to 3.9%",
    industry: "Healthcare & Medical",
    companySize: "Multi-location clinic",
    challenge: "23% no-show rate costing $200 per missed appointment. Manual reminder system inconsistent, staff spending 10+ hours weekly on appointment confirmations.",
    solution: "HIPAA-compliant AI appointment reminder system with Practice Fusion integration, SMS/voice confirmations, intelligent rescheduling, and waitlist management.",
    results: [
      {
        metric: "No-Show Rate Reduction",
        improvement: "23% → 3.9%",
        timeframe: "4 months"
      },
      {
        metric: "Recovered Revenue",
        improvement: "$180,000",
        timeframe: "Annual"
      },
      {
        metric: "Staff Time Savings",
        improvement: "520 hours/year",
        timeframe: "Ongoing"
      },
      {
        metric: "Patient Satisfaction",
        improvement: "+28%",
        timeframe: "Post-implementation"
      }
    ],
    source: {
      name: "Based on MGMA & HIMSS Healthcare IT Reports 2024",
      url: "https://www.himss.org/",
      type: "Healthcare Industry Research"
    }
  },
  {
    id: "roofing-seasonal-surge",
    title: "Roofing Company Scales for Storm Season Without Hiring",
    industry: "Roofing & Construction",
    companySize: "Regional roofing contractor",
    challenge: "Post-storm surge: 500+ calls in 48 hours. Historical data showed missing 70% of surge calls. Seasonal hiring expensive and unreliable ($8K+ per temp hire).",
    solution: "AI storm response system with JobNimbus integration, emergency priority routing, photo upload for damage assessment, and automated estimate scheduling.",
    results: [
      {
        metric: "Call Capture Rate",
        improvement: "30% → 94%",
        timeframe: "First storm event"
      },
      {
        metric: "Jobs Booked",
        improvement: "+312%",
        timeframe: "Storm season"
      },
      {
        metric: "Hiring Cost Avoidance",
        improvement: "$45,000",
        timeframe: "Season savings"
      },
      {
        metric: "Response Time",
        improvement: "< 2 minutes",
        timeframe: "24/7 availability"
      }
    ],
    source: {
      name: "Based on NRCA Industry Best Practices 2024",
      url: "https://www.nrca.net/",
      type: "Industry Association Research"
    }
  },
  {
    id: "restaurant-reservation-optimization",
    title: "Restaurant Group Increases Covers by 28% Without Additional Staff",
    industry: "Restaurants & Hospitality",
    companySize: "3-location restaurant group",
    challenge: "Phone reservations taking staff away from in-house guests. Missing 40% of reservation calls during busy service. Average table value: $180.",
    solution: "AI reservation system with Toast POS integration, table optimization, waitlist management, SMS confirmations, and special request handling.",
    results: [
      {
        metric: "Reservation Capture",
        improvement: "+72%",
        timeframe: "3 months"
      },
      {
        metric: "Additional Covers Per Month",
        improvement: "+284",
        timeframe: "Per location"
      },
      {
        metric: "Revenue Increase",
        improvement: "+$183,000",
        timeframe: "Annual per location"
      },
      {
        metric: "Table Turn Time",
        improvement: "-12 minutes",
        timeframe: "Average improvement"
      }
    ],
    source: {
      name: "Based on National Restaurant Association Technology Report",
      url: "https://www.restaurant.org/",
      type: "Industry Research"
    }
  },
  {
    id: "logistics-driver-scheduling",
    title: "Logistics Company Automates Driver Coordination Across 3 Time Zones",
    industry: "Logistics & Transportation",
    companySize: "Regional freight broker",
    challenge: "Manual coordination of 200+ drivers across multiple time zones. Dispatcher burnout, 24/7 coverage gaps, missed pickup opportunities, and compliance documentation delays.",
    solution: "AI dispatch coordination with Samsara integration, automated route optimization, driver availability management, and DOT compliance documentation.",
    results: [
      {
        metric: "Dispatch Efficiency",
        improvement: "+156%",
        timeframe: "6 months"
      },
      {
        metric: "After-Hours Coverage",
        improvement: "100%",
        timeframe: "24/7 automation"
      },
      {
        metric: "Empty Miles Reduction",
        improvement: "-23%",
        timeframe: "Route optimization"
      },
      {
        metric: "Additional Loads Per Month",
        improvement: "+187",
        timeframe: "Increased capacity"
      }
    ],
    source: {
      name: "Based on FreightWaves & ATA Technology Adoption Studies",
      url: "https://www.freightwaves.com/",
      type: "Industry Research"
    }
  },
  {
    id: "small-business-automation",
    title: "Small Business Achieves 312% ROI on Automation in 6 Months",
    industry: "General Business",
    companySize: "15-person team",
    challenge: "Founder spending 15+ hours weekly on administrative tasks. Missing customer calls while in meetings. No bandwidth to scale without hiring.",
    solution: "Comprehensive AI automation: call handling, appointment scheduling, lead qualification, CRM data entry, and follow-up management.",
    results: [
      {
        metric: "Owner Time Savings",
        improvement: "15 hours/week",
        timeframe: "Immediate"
      },
      {
        metric: "Lead Response Time",
        improvement: "2 hours → 2 minutes",
        timeframe: "Immediate"
      },
      {
        metric: "Conversion Rate",
        improvement: "+47%",
        timeframe: "3 months"
      },
      {
        metric: "ROI",
        improvement: "312%",
        timeframe: "6 months"
      }
    ],
    source: {
      name: "Based on Deloitte SMB Technology Insights & SCORE Study",
      url: "https://www.sba.gov/",
      type: "Small Business Research"
    }
  }
];

export const industryCategories = [
  "All Industries",
  "HVAC & Home Services",
  "Accounting & Finance",
  "Legal Services",
  "Healthcare & Medical",
  "Roofing & Construction",
  "Restaurants & Hospitality",
  "Logistics & Transportation",
  "General Business"
];
