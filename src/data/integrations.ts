export interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  logo?: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  industries?: string[];
  url?: string;
}

export const integrations: Integration[] = [
  // CRM & Sales
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM & Sales",
    description: "Enterprise CRM integration with real-time data sync",
    difficulty: "Medium",
    industries: ["All Industries"],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM & Sales",
    description: "Marketing and sales automation platform",
    difficulty: "Easy",
    industries: ["All Industries"],
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    category: "CRM & Sales",
    description: "Sales-focused CRM for pipeline management",
    difficulty: "Easy",
    industries: ["All Industries"],
  },
  {
    id: "zoho-crm",
    name: "Zoho CRM",
    category: "CRM & Sales",
    description: "All-in-one CRM solution for businesses",
    difficulty: "Medium",
    industries: ["All Industries"],
  },
  {
    id: "copper",
    name: "Copper",
    category: "CRM & Sales",
    description: "CRM built for Google Workspace",
    difficulty: "Easy",
    industries: ["All Industries"],
  },
  {
    id: "close",
    name: "Close",
    category: "CRM & Sales",
    description: "CRM designed for inside sales teams",
    difficulty: "Easy",
    industries: ["All Industries"],
  },

  // Calendar & Scheduling
  {
    id: "google-calendar",
    name: "Google Calendar",
    category: "Calendar & Scheduling",
    description: "Seamless calendar integration and booking",
    difficulty: "Easy",
    industries: ["All Industries"],
  },
  {
    id: "outlook-calendar",
    name: "Outlook Calendar",
    category: "Calendar & Scheduling",
    description: "Microsoft calendar and scheduling integration",
    difficulty: "Easy",
    industries: ["All Industries"],
  },
  {
    id: "calendly",
    name: "Calendly",
    category: "Calendar & Scheduling",
    description: "Automated scheduling and appointment booking",
    difficulty: "Easy",
    industries: ["All Industries"],
  },
  {
    id: "acuity",
    name: "Acuity Scheduling",
    category: "Calendar & Scheduling",
    description: "Online appointment scheduling software",
    difficulty: "Easy",
    industries: ["All Industries"],
  },
  {
    id: "cal-com",
    name: "Cal.com",
    category: "Calendar & Scheduling",
    description: "Open-source scheduling infrastructure",
    difficulty: "Medium",
    industries: ["All Industries"],
  },

  // Communication
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description: "Team communication and notifications",
    difficulty: "Easy",
    industries: ["All Industries"],
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    category: "Communication",
    description: "Enterprise collaboration platform",
    difficulty: "Medium",
    industries: ["All Industries"],
  },
  {
    id: "whatsapp-business",
    name: "WhatsApp Business",
    category: "Communication",
    description: "Customer communication via WhatsApp",
    difficulty: "Medium",
    industries: ["All Industries"],
  },
  {
    id: "discord",
    name: "Discord",
    category: "Communication",
    description: "Community and team chat platform",
    difficulty: "Easy",
    industries: ["All Industries"],
  },

  // Project Management
  {
    id: "monday",
    name: "Monday.com",
    category: "Project Management",
    description: "Work operating system for teams",
    difficulty: "Medium",
    industries: ["All Industries"],
  },
  {
    id: "asana",
    name: "Asana",
    category: "Project Management",
    description: "Project and task management platform",
    difficulty: "Easy",
    industries: ["All Industries"],
  },
  {
    id: "clickup",
    name: "ClickUp",
    category: "Project Management",
    description: "All-in-one productivity platform",
    difficulty: "Medium",
    industries: ["All Industries"],
  },
  {
    id: "trello",
    name: "Trello",
    category: "Project Management",
    description: "Visual project management with boards",
    difficulty: "Easy",
    industries: ["All Industries"],
  },
  {
    id: "notion",
    name: "Notion",
    category: "Project Management",
    description: "Connected workspace for docs and projects",
    difficulty: "Easy",
    industries: ["All Industries"],
  },

  // Accounting & Payments
  {
    id: "quickbooks",
    name: "QuickBooks",
    category: "Accounting & Payments",
    description: "Accounting software for small businesses",
    difficulty: "Medium",
    industries: ["Accounting", "All Industries"],
  },
  {
    id: "xero",
    name: "Xero",
    category: "Accounting & Payments",
    description: "Cloud-based accounting platform",
    difficulty: "Medium",
    industries: ["Accounting", "All Industries"],
  },
  {
    id: "freshbooks",
    name: "FreshBooks",
    category: "Accounting & Payments",
    description: "Invoicing and accounting for small businesses",
    difficulty: "Easy",
    industries: ["Accounting", "All Industries"],
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Accounting & Payments",
    description: "Payment processing and financial infrastructure",
    difficulty: "Medium",
    industries: ["All Industries"],
  },
  {
    id: "square",
    name: "Square",
    category: "Accounting & Payments",
    description: "Payment processing and point of sale",
    difficulty: "Easy",
    industries: ["Restaurants", "Retail", "All Industries"],
  },

  // Industry-Specific
  {
    id: "servicetitan",
    name: "ServiceTitan",
    category: "Industry-Specific",
    description: "Field service management for HVAC, plumbing, electrical",
    difficulty: "Advanced",
    industries: ["HVAC", "Plumbing", "Electrical"],
  },
  {
    id: "jobnimbus",
    name: "JobNimbus",
    category: "Industry-Specific",
    description: "CRM and project management for contractors",
    difficulty: "Medium",
    industries: ["Roofing", "Construction"],
  },
  {
    id: "clio",
    name: "Clio",
    category: "Industry-Specific",
    description: "Legal practice management software",
    difficulty: "Medium",
    industries: ["Legal"],
  },
  {
    id: "practice-fusion",
    name: "Practice Fusion",
    category: "Industry-Specific",
    description: "Electronic health records (EHR) system",
    difficulty: "Advanced",
    industries: ["Healthcare"],
  },
  {
    id: "toast",
    name: "Toast",
    category: "Industry-Specific",
    description: "Restaurant point of sale and management",
    difficulty: "Medium",
    industries: ["Restaurants"],
  },
  {
    id: "samsara",
    name: "Samsara",
    category: "Industry-Specific",
    description: "Fleet management and logistics platform",
    difficulty: "Advanced",
    industries: ["Logistics", "Transportation"],
  },
  {
    id: "housecall-pro",
    name: "Housecall Pro",
    category: "Industry-Specific",
    description: "Field service management for home services",
    difficulty: "Easy",
    industries: ["HVAC", "Plumbing", "Electrical"],
  },
  {
    id: "lawpay",
    name: "LawPay",
    category: "Industry-Specific",
    description: "Legal payment processing solution",
    difficulty: "Easy",
    industries: ["Legal"],
  },
];

export const integrationCategories = [
  "All",
  "CRM & Sales",
  "Calendar & Scheduling",
  "Communication",
  "Project Management",
  "Accounting & Payments",
  "Industry-Specific",
];
