export interface PackageTier {
  id: string;
  name: string;
  description: string;
  targetCompany: string;
  includedFunctions: string[]; // IDs from comprehensiveBusinessFunctions
  monthlyPrice: string;
  annualSavings: string;
  setupTime: string;
  bestFor: string[];
  notIncluded?: string[];
}

export const packageTiers: Record<string, PackageTier[]> = {
  hvac: [
    {
      id: "starter",
      name: "Starter Package",
      description: "Essential 24/7 call handling and lead capture",
      targetCompany: "Solo operators to 3 technicians, $500K-$1M revenue",
      includedFunctions: ["communication", "lead-management", "support"],
      monthlyPrice: "$597",
      annualSavings: "$120,000",
      setupTime: "3-5 days",
      bestFor: [
        "Capturing missed calls during service runs",
        "Basic lead qualification",
        "After-hours emergency routing",
        "Simple appointment scheduling"
      ],
      notIncluded: ["Advanced workflow automation", "Analytics dashboard", "Maintenance renewal campaigns"]
    },
    {
      id: "growth",
      name: "Growth Package",
      description: "Everything in Starter + scheduling, sales automation, and analytics",
      targetCompany: "4-10 technicians, $1M-$3M revenue",
      includedFunctions: ["communication", "lead-management", "scheduling", "support", "sales", "analytics"],
      monthlyPrice: "$1,174",
      annualSavings: "$380,000",
      setupTime: "1 week",
      bestFor: [
        "Optimizing technician routes and productivity",
        "Maintenance agreement renewals",
        "Data-driven decision making",
        "Seasonal surge capacity"
      ],
      notIncluded: ["Multi-step workflow automation", "Compliance documentation"]
    },
    {
      id: "professional",
      name: "Professional Package",
      description: "Complete business automation across all 8 functions",
      targetCompany: "10-20 technicians, $3M-$6M revenue",
      includedFunctions: ["communication", "lead-management", "scheduling", "support", "sales", "analytics", "workflow", "compliance"],
      monthlyPrice: "$1,623",
      annualSavings: "$620,000",
      setupTime: "2-3 weeks",
      bestFor: [
        "End-to-end customer journey automation",
        "Multi-location coordination",
        "Strategic growth planning",
        "Audit-ready documentation"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise Package",
      description: "Custom solution with dedicated support and advanced integrations",
      targetCompany: "20+ technicians, $6M+ revenue, multi-location",
      includedFunctions: ["communication", "lead-management", "scheduling", "support", "sales", "analytics", "workflow", "compliance"],
      monthlyPrice: "Custom pricing",
      annualSavings: "$1M+",
      setupTime: "3-4 weeks",
      bestFor: [
        "Multi-location enterprise coordination",
        "Custom integrations and workflows",
        "Dedicated account management",
        "White-glove implementation"
      ]
    }
  ],
  legal: [
    {
      id: "starter",
      name: "Starter Package",
      description: "24/7 case intake and consultation scheduling",
      targetCompany: "Solo practitioners to 2 attorneys, $500K-$1.5M revenue",
      includedFunctions: ["communication", "lead-management", "scheduling"],
      monthlyPrice: "$947",
      annualSavings: "$180,000",
      setupTime: "5-7 days",
      bestFor: [
        "Capturing after-hours case inquiries",
        "Practice area screening",
        "Consultation booking",
        "Basic conflict checking"
      ],
      notIncluded: ["Client retention campaigns", "Case workflow automation", "Advanced compliance tracking"]
    },
    {
      id: "growth",
      name: "Growth Package",
      description: "Everything in Starter + client support, retention, and analytics",
      targetCompany: "3-6 attorneys, $1.5M-$4M revenue",
      includedFunctions: ["communication", "lead-management", "scheduling", "support", "sales", "analytics"],
      monthlyPrice: "$1,644",
      annualSavings: "$450,000",
      setupTime: "1-2 weeks",
      bestFor: [
        "Client retention and relationship management",
        "Practice area expansion opportunities",
        "Lead source ROI optimization",
        "Billing and collection automation"
      ],
      notIncluded: ["End-to-end case workflow automation", "Advanced malpractice protection"]
    },
    {
      id: "professional",
      name: "Professional Package",
      description: "Complete law firm automation with compliance and workflow",
      targetCompany: "6-15 attorneys, $4M-$10M revenue",
      includedFunctions: ["communication", "lead-management", "scheduling", "support", "sales", "analytics", "workflow", "compliance"],
      monthlyPrice: "$2,293",
      annualSavings: "$750,000",
      setupTime: "2-3 weeks",
      bestFor: [
        "Intake to engagement automation",
        "Statute of limitations tracking",
        "Multi-practice area coordination",
        "Malpractice risk reduction"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise Package",
      description: "Custom solution for large firms with advanced needs",
      targetCompany: "15+ attorneys, $10M+ revenue, multi-office",
      includedFunctions: ["communication", "lead-management", "scheduling", "support", "sales", "analytics", "workflow", "compliance"],
      monthlyPrice: "Custom pricing",
      annualSavings: "$1.5M+",
      setupTime: "3-4 weeks",
      bestFor: [
        "Multi-office enterprise coordination",
        "Advanced matter management integration",
        "Dedicated legal tech specialist",
        "Custom compliance workflows"
      ]
    }
  ],
  healthcare: [
    {
      id: "starter",
      name: "Starter Package",
      description: "HIPAA-compliant 24/7 appointment scheduling",
      targetCompany: "1-3 providers, solo practice to small clinic",
      includedFunctions: ["communication", "scheduling", "support"],
      monthlyPrice: "$847",
      annualSavings: "$140,000",
      setupTime: "1 week",
      bestFor: [
        "24/7 appointment booking",
        "Prescription refill requests",
        "No-show reduction with reminders",
        "Basic patient inquiries"
      ],
      notIncluded: ["Insurance verification", "Chronic care coordination", "Revenue cycle optimization"]
    },
    {
      id: "growth",
      name: "Growth Package",
      description: "Everything in Starter + patient acquisition and retention",
      targetCompany: "4-8 providers, $2M-$5M revenue",
      includedFunctions: ["communication", "lead-management", "scheduling", "support", "sales", "analytics"],
      monthlyPrice: "$1,524",
      annualSavings: "$425,000",
      setupTime: "1-2 weeks",
      bestFor: [
        "New patient intake and insurance verification",
        "Preventive care campaigns",
        "Provider schedule optimization",
        "Patient satisfaction improvement"
      ],
      notIncluded: ["Advanced care coordination workflows", "Full compliance documentation"]
    },
    {
      id: "professional",
      name: "Professional Package",
      description: "Complete patient experience automation with HIPAA compliance",
      targetCompany: "8-15 providers, $5M-$12M revenue",
      includedFunctions: ["communication", "lead-management", "scheduling", "support", "sales", "analytics", "workflow", "compliance"],
      monthlyPrice: "$2,023",
      annualSavings: "$680,000",
      setupTime: "2-3 weeks",
      bestFor: [
        "End-to-end patient journey automation",
        "Chronic care management programs",
        "Revenue cycle optimization",
        "HIPAA audit protection"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise Package",
      description: "Custom healthcare solution for large practices and health systems",
      targetCompany: "15+ providers, $12M+ revenue, multi-location",
      includedFunctions: ["communication", "lead-management", "scheduling", "support", "sales", "analytics", "workflow", "compliance"],
      monthlyPrice: "Custom pricing",
      annualSavings: "$1.2M+",
      setupTime: "3-4 weeks",
      bestFor: [
        "Multi-location health system coordination",
        "Advanced EHR integration",
        "Population health management",
        "Dedicated healthcare tech specialist"
      ]
    }
  ]
  // ... Similar structure for accounting, restaurants, roofing, logistics, bars
  // For brevity, showing pattern—all 8 industries would follow same tier structure
};
