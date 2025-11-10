// Search index for global search functionality

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: "page" | "article" | "tool" | "industry" | "integration";
  url: string;
  icon?: string;
  keywords?: string[];
}

export const searchIndex: SearchItem[] = [
  // Pages
  {
    id: "home",
    title: "Home",
    description: "Custom AI Agents for Every Industry",
    category: "page",
    url: "/",
    keywords: ["home", "main", "landing"]
  },
  {
    id: "solutions",
    title: "Solutions by Industry",
    description: "AI solutions tailored for your specific industry",
    category: "page",
    url: "/solutions",
    keywords: ["industries", "niches", "solutions", "custom"]
  },
  {
    id: "demos",
    title: "Interactive Demos & Calculators",
    description: "Try our AI calculators and see demos",
    category: "page",
    url: "/demos",
    keywords: ["demo", "calculator", "roi", "try", "test"]
  },
  {
    id: "resources",
    title: "Resources & Research",
    description: "Industry research, articles, and insights",
    category: "page",
    url: "/resources",
    keywords: ["blog", "articles", "research", "insights", "data"]
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect with your existing tools and platforms",
    category: "page",
    url: "/integrations",
    keywords: ["integrate", "connect", "crm", "calendar", "tools"]
  },
  {
    id: "comparisons",
    title: "AI vs Traditional Solutions",
    description: "Honest comparison of AI agents vs human alternatives",
    category: "page",
    url: "/comparisons",
    keywords: ["compare", "vs", "versus", "human", "receptionist", "call center"]
  },
  {
    id: "case-studies",
    title: "Case Studies",
    description: "Real-world AI success stories from various industries",
    category: "page",
    url: "/case-studies",
    keywords: ["success", "stories", "examples", "results", "proof"]
  },
  {
    id: "about",
    title: "About Us",
    description: "Learn about our mission and approach",
    category: "page",
    url: "/about",
    keywords: ["about", "mission", "company", "story"]
  },
  {
    id: "team",
    title: "Our Team",
    description: "Meet the people building the future of AI automation",
    category: "page",
    url: "/team",
    keywords: ["team", "people", "founders", "advisors", "experts"]
  },
  {
    id: "technology",
    title: "Technology",
    description: "How our AI technology works",
    category: "page",
    url: "/technology",
    keywords: ["tech", "technology", "ai", "how it works", "technical"]
  },
  {
    id: "security",
    title: "Security & Compliance",
    description: "Enterprise-grade security and compliance standards",
    category: "page",
    url: "/security",
    keywords: ["security", "compliance", "privacy", "hipaa", "gdpr"]
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    description: "How we handle your data and protect your privacy",
    category: "page",
    url: "/privacy",
    keywords: ["privacy", "policy", "data", "gdpr"]
  },
  {
    id: "terms",
    title: "Terms of Service",
    description: "Terms and conditions for using our services",
    category: "page",
    url: "/terms",
    keywords: ["terms", "conditions", "legal", "agreement"]
  },

  // Tools / Calculators
  {
    id: "roi-calculator",
    title: "ROI Calculator",
    description: "Calculate your potential return on investment",
    category: "tool",
    url: "/demos?tool=roi",
    keywords: ["roi", "return", "investment", "calculate", "savings"]
  },
  {
    id: "missed-call-calculator",
    title: "Missed Call Cost Calculator",
    description: "See how much missed calls are costing you",
    category: "tool",
    url: "/demos?tool=missed-calls",
    keywords: ["missed calls", "lost revenue", "cost", "calculator"]
  },
  {
    id: "ai-vs-human-calculator",
    title: "AI vs Human Cost Calculator",
    description: "Compare the cost of AI agents vs human employees",
    category: "tool",
    url: "/demos?tool=ai-vs-human",
    keywords: ["compare", "cost", "ai", "human", "employee", "staff"]
  },
  {
    id: "lead-response-calculator",
    title: "Lead Response Time Calculator",
    description: "Calculate the impact of faster lead response",
    category: "tool",
    url: "/demos?tool=lead-response",
    keywords: ["lead", "response", "speed", "conversion", "calculator"]
  },

  // Industries
  {
    id: "hvac-industry",
    title: "HVAC & Home Services AI",
    description: "AI solutions for HVAC, plumbing, and home services",
    category: "industry",
    url: "/niche/hvac",
    keywords: ["hvac", "heating", "cooling", "plumbing", "home services", "emergency"]
  },
  {
    id: "accounting-industry",
    title: "Accounting & Finance AI",
    description: "AI automation for accounting firms and CPAs",
    category: "industry",
    url: "/accounting",
    keywords: ["accounting", "cpa", "finance", "tax", "bookkeeping"]
  },
  {
    id: "roofing-industry",
    title: "Roofing & Construction AI",
    description: "AI solutions for roofing and construction companies",
    category: "industry",
    url: "/roofing",
    keywords: ["roofing", "construction", "contractor", "building"]
  },
  {
    id: "legal-industry",
    title: "Legal Services AI",
    description: "AI automation for law firms and legal practices",
    category: "industry",
    url: "/legal",
    keywords: ["legal", "law", "attorney", "lawyer", "practice"]
  },
  {
    id: "healthcare-industry",
    title: "Healthcare & Medical AI",
    description: "HIPAA-compliant AI for healthcare providers",
    category: "industry",
    url: "/healthcare",
    keywords: ["healthcare", "medical", "doctor", "clinic", "patient", "hipaa"]
  },
  {
    id: "restaurants-industry",
    title: "Restaurants & Hospitality AI",
    description: "AI solutions for restaurants and hospitality",
    category: "industry",
    url: "/restaurants",
    keywords: ["restaurant", "food", "hospitality", "reservation", "dining"]
  },
  {
    id: "logistics-industry",
    title: "Logistics & Transportation AI",
    description: "AI automation for logistics and transportation",
    category: "industry",
    url: "/logistics",
    keywords: ["logistics", "transportation", "shipping", "delivery", "freight"]
  },

  // Key Integrations
  {
    id: "salesforce-integration",
    title: "Salesforce Integration",
    description: "Connect with Salesforce CRM",
    category: "integration",
    url: "/integrations?search=salesforce",
    keywords: ["salesforce", "crm", "sales"]
  },
  {
    id: "hubspot-integration",
    title: "HubSpot Integration",
    description: "Connect with HubSpot CRM and marketing tools",
    category: "integration",
    url: "/integrations?search=hubspot",
    keywords: ["hubspot", "crm", "marketing"]
  },
  {
    id: "servicetitan-integration",
    title: "ServiceTitan Integration",
    description: "Connect with ServiceTitan for home services",
    category: "integration",
    url: "/integrations?search=servicetitan",
    keywords: ["servicetitan", "hvac", "home services"]
  },
  {
    id: "quickbooks-integration",
    title: "QuickBooks Integration",
    description: "Connect with QuickBooks accounting software",
    category: "integration",
    url: "/integrations?search=quickbooks",
    keywords: ["quickbooks", "accounting", "bookkeeping"]
  },
  {
    id: "calendly-integration",
    title: "Calendly Integration",
    description: "Sync with Calendly for appointment scheduling",
    category: "integration",
    url: "/integrations?search=calendly",
    keywords: ["calendly", "calendar", "scheduling", "appointments"]
  }
];
