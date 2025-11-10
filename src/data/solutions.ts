export interface NicheSolution {
  id: string;
  name: string;
  icon: string;
  challenges: string[];
  solutions: {
    title: string;
    description: string;
    features: string[];
  }[];
  roi: {
    avgDealValue: number;
    monthlyLeads: number;
    conversionRate: number;
  };
  integrations: string[];
}

export const nicheSolutions: Record<string, NicheSolution> = {
  hvac: {
    id: "hvac",
    name: "HVAC & Home Services",
    icon: "Wrench",
    challenges: [
      "62% of calls go to voicemail during busy season",
      "$180K annual lost revenue from after-hours calls",
      "Emergency calls need immediate response 24/7",
      "Seasonal demand surges overwhelm staff",
    ],
    solutions: [
      {
        title: "24/7 Emergency Dispatch",
        description: "AI agents handle emergency calls and dispatch technicians instantly",
        features: [
          "Priority routing for urgent calls",
          "Real-time technician availability",
          "Automated after-hours booking",
          "SMS confirmations and updates",
        ],
      },
      {
        title: "Seasonal Surge Management",
        description: "Scale capacity automatically during peak seasons",
        features: [
          "Handle 100+ calls simultaneously",
          "No missed calls during heat waves",
          "Intelligent call routing",
          "Queue management",
        ],
      },
    ],
    roi: {
      avgDealValue: 3500,
      monthlyLeads: 120,
      conversionRate: 28,
    },
    integrations: ["ServiceTitan", "Housecall Pro", "Google Calendar"],
  },
  accounting: {
    id: "accounting",
    name: "Accounting & Finance",
    icon: "Calculator",
    challenges: [
      "$125K lost during tax season from missed calls",
      "Client intake takes 45+ minutes per call",
      "Staff overwhelmed during busy periods",
      "No time for high-value advisory work",
    ],
    solutions: [
      {
        title: "Automated Client Intake",
        description: "Collect client information and documents before meetings",
        features: [
          "Digital onboarding forms",
          "Document collection automation",
          "Tax return questionnaires",
          "Compliance checklists",
        ],
      },
      {
        title: "Tax Season Support",
        description: "Handle overflow during peak season without adding staff",
        features: [
          "24/7 client inquiry handling",
          "Appointment scheduling",
          "Document status updates",
          "Extension filing support",
        ],
      },
    ],
    roi: {
      avgDealValue: 5000,
      monthlyLeads: 60,
      conversionRate: 45,
    },
    integrations: ["QuickBooks", "Xero", "FreshBooks", "Google Calendar"],
  },
  roofing: {
    id: "roofing",
    name: "Roofing & Construction",
    icon: "Home",
    challenges: [
      "$12B in uncaptured emergency revenue annually",
      "Storm damage leads need immediate response",
      "Quote generation takes hours per job",
      "67% of after-hours calls go to competitors",
    ],
    solutions: [
      {
        title: "Emergency Storm Response",
        description: "Capture and route emergency calls during storms",
        features: [
          "24/7 emergency call handling",
          "GPS-based crew routing",
          "Instant tarp service booking",
          "Insurance claim support",
        ],
      },
      {
        title: "Automated Quoting",
        description: "Generate instant estimates for standard projects",
        features: [
          "Aerial measurement integration",
          "Material cost calculations",
          "Financing options",
          "Digital contract signing",
        ],
      },
    ],
    roi: {
      avgDealValue: 12000,
      monthlyLeads: 80,
      conversionRate: 22,
    },
    integrations: ["JobNimbus", "Acculynx", "CompanyCam", "Google Calendar"],
  },
  legal: {
    id: "legal",
    name: "Legal Services",
    icon: "Scale",
    challenges: [
      "$1,500-$3,000 client acquisition cost",
      "67% of after-hours leads go to competitors",
      "Initial consultation scheduling takes multiple calls",
      "Conflict checks delay intake process",
    ],
    solutions: [
      {
        title: "24/7 Case Intake",
        description: "Capture and qualify leads around the clock",
        features: [
          "Practice area screening",
          "Conflict checking automation",
          "Consultation scheduling",
          "Document collection",
        ],
      },
      {
        title: "Consultation Management",
        description: "Streamline the path from inquiry to retained client",
        features: [
          "Automated intake forms",
          "Fee agreement delivery",
          "Retainer payment processing",
          "Case management integration",
        ],
      },
    ],
    roi: {
      avgDealValue: 8500,
      monthlyLeads: 50,
      conversionRate: 35,
    },
    integrations: ["Clio", "MyCase", "PracticePanther", "LawPay"],
  },
  healthcare: {
    id: "healthcare",
    name: "Healthcare & Medical",
    icon: "Heart",
    challenges: [
      "23% no-show rate costs $200 per appointment",
      "68% of after-hours calls go unanswered",
      "Patient triage delays care delivery",
      "Appointment reminders are manual and time-consuming",
    ],
    solutions: [
      {
        title: "Automated Appointment Management",
        description: "Reduce no-shows and improve patient communication",
        features: [
          "Automated SMS reminders",
          "Online appointment scheduling",
          "Waitlist management",
          "Cancellation handling",
        ],
      },
      {
        title: "HIPAA-Compliant Patient Triage",
        description: "Intelligent call routing and symptom screening",
        features: [
          "Secure patient verification",
          "Symptom screening protocols",
          "Priority routing for urgent cases",
          "Prescription refill requests",
        ],
      },
    ],
    roi: {
      avgDealValue: 250,
      monthlyLeads: 500,
      conversionRate: 75,
    },
    integrations: ["Practice Fusion", "Kareo", "Athenahealth", "Epic"],
  },
  logistics: {
    id: "logistics",
    name: "Logistics & Transportation",
    icon: "Truck",
    challenges: [
      "Load booking happens 24/7 across time zones",
      "Dispatch coordination requires constant availability",
      "Customer service inquiries slow operations",
      "Real-time tracking updates are manual",
    ],
    solutions: [
      {
        title: "24/7 Load Coordination",
        description: "Book loads and coordinate shipments around the clock",
        features: [
          "Automated load booking",
          "Real-time capacity checking",
          "Rate quotes and negotiations",
          "Carrier assignment",
        ],
      },
      {
        title: "Customer Service Automation",
        description: "Handle tracking inquiries and delivery updates",
        features: [
          "Shipment tracking updates",
          "Delivery confirmation",
          "Issue escalation",
          "Proof of delivery",
        ],
      },
    ],
    roi: {
      avgDealValue: 1500,
      monthlyLeads: 200,
      conversionRate: 40,
    },
    integrations: ["Samsara", "Motive", "Fleet Complete", "TMS Systems"],
  },
  restaurants: {
    id: "restaurants",
    name: "Restaurants & Hospitality",
    icon: "UtensilsCrossed",
    challenges: [
      "Phone orders interrupt kitchen workflow",
      "Reservation management is chaotic during peak hours",
      "Staff shortage impacts customer service",
      "Catering inquiries need immediate response",
    ],
    solutions: [
      {
        title: "Automated Phone Ordering",
        description: "Take orders without interrupting operations",
        features: [
          "Menu navigation and upselling",
          "Dietary restriction handling",
          "Order accuracy verification",
          "POS system integration",
        ],
      },
      {
        title: "Reservation & Waitlist Management",
        description: "Optimize table turnover and customer experience",
        features: [
          "Real-time availability",
          "Waitlist management",
          "Automated confirmations",
          "Special occasion handling",
        ],
      },
    ],
    roi: {
      avgDealValue: 75,
      monthlyLeads: 1200,
      conversionRate: 85,
    },
    integrations: ["Toast", "Square", "OpenTable", "Resy"],
  },
  general: {
    id: "general",
    name: "General Business",
    icon: "Briefcase",
    challenges: [
      "Limited staff capacity for phone coverage",
      "After-hours inquiries go unanswered",
      "Repetitive questions waste valuable time",
      "Lead response time impacts conversion",
    ],
    solutions: [
      {
        title: "AI Receptionist",
        description: "Never miss a call or inquiry again",
        features: [
          "24/7 call answering",
          "Intelligent call routing",
          "FAQ handling",
          "Appointment scheduling",
        ],
      },
      {
        title: "Lead Qualification",
        description: "Automatically qualify and route high-value leads",
        features: [
          "Lead scoring automation",
          "CRM data enrichment",
          "Follow-up scheduling",
          "Sales team notifications",
        ],
      },
    ],
    roi: {
      avgDealValue: 2000,
      monthlyLeads: 100,
      conversionRate: 30,
    },
    integrations: ["HubSpot", "Salesforce", "Google Calendar", "Slack"],
  },
};
