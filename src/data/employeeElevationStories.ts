export interface EmployeeStory {
  name: string;
  beforeTitle: string;
  afterTitle: string;
  beforeSalary: string;
  afterSalary: string;
  beforeResponsibilities: string[];
  afterResponsibilities: string[];
  revenueImpact: string;
  satisfactionIncrease: string;
  companySize: string;
}

export const employeeElevationStories: Record<string, EmployeeStory[]> = {
  hvac: [
    {
      name: "Sarah M.",
      beforeTitle: "Receptionist",
      afterTitle: "Customer Success Manager",
      beforeSalary: "$42,000/year",
      afterSalary: "$65,000/year + bonus",
      beforeResponsibilities: [
        "Answered 100+ calls daily during summer heat waves",
        "Manually scheduled service appointments",
        "Dealt with frustrated customers on hold",
        "No time for strategic or relationship work"
      ],
      afterResponsibilities: [
        "Monitors AI quality 30 minutes daily",
        "Proactive maintenance renewal outreach ($120K added revenue)",
        "Vendor relationship management (12% cost savings)",
        "Training coordinator for growing team",
        "Customer retention strategy implementation"
      ],
      revenueImpact: "$120,000 annual maintenance renewal revenue",
      satisfactionIncrease: "From stressed and overwhelmed to strategic leader",
      companySize: "8 technicians, $2.5M annual revenue"
    },
    {
      name: "Marcus T.",
      beforeTitle: "Office Manager",
      afterTitle: "Operations Coordinator",
      beforeSalary: "$48,000/year",
      afterSalary: "$72,000/year + profit sharing",
      beforeResponsibilities: [
        "Managed dispatch and scheduling manually",
        "Fielded emergency calls at all hours",
        "Coordinated technician routes on paper",
        "Constant firefighting, no optimization time"
      ],
      afterResponsibilities: [
        "Crew productivity optimization (30% more jobs per day)",
        "Material procurement and vendor negotiation",
        "Quality control inspections",
        "Process documentation and efficiency improvements",
        "Strategic capacity planning"
      ],
      revenueImpact: "$180,000 additional capacity from optimized routing",
      satisfactionIncrease: "Work-life balance restored, promotion to leadership",
      companySize: "15 technicians, $4.2M annual revenue"
    },
    {
      name: "Jennifer L.",
      beforeTitle: "Administrative Assistant",
      afterTitle: "Revenue Operations Specialist",
      beforeSalary: "$38,000/year",
      afterSalary: "$58,000/year",
      beforeResponsibilities: [
        "Data entry for every service call",
        "Manually followed up on unpaid invoices",
        "Created basic reports in spreadsheets",
        "Repetitive administrative tasks"
      ],
      afterResponsibilities: [
        "Revenue cycle optimization and collections strategy",
        "ServiceTitan reporting and analytics",
        "Pricing strategy analysis",
        "Upsell opportunity identification",
        "Financial forecasting and planning"
      ],
      revenueImpact: "$95,000 improved collections, 40% faster payment",
      satisfactionIncrease: "From data entry to strategic business analyst",
      companySize: "12 technicians, $3.8M annual revenue"
    }
  ],
  legal: [
    {
      name: "Amanda R.",
      beforeTitle: "Legal Secretary",
      afterTitle: "Client Retention Specialist",
      beforeSalary: "$45,000/year",
      afterSalary: "$68,000/year + bonus",
      beforeResponsibilities: [
        "Answered intake calls and scheduled consultations",
        "Manually tracked case statuses",
        "Fielded repetitive billing questions",
        "No time for client relationship work"
      ],
      afterResponsibilities: [
        "High-touch relationship management for top clients",
        "Client retention campaigns (25% improvement)",
        "Practice area expansion research",
        "Billing optimization and collection strategy",
        "Complex case coordination requiring judgment"
      ],
      revenueImpact: "$150,000 retained revenue from improved client relationships",
      satisfactionIncrease: "From administrative to strategic client partner",
      companySize: "5 attorneys, $2.8M annual revenue"
    },
    {
      name: "David K.",
      beforeTitle: "Intake Coordinator",
      afterTitle: "Business Development Manager",
      beforeSalary: "$42,000/year",
      afterSalary: "$75,000/year + commission",
      beforeResponsibilities: [
        "Screened 50+ intake calls daily",
        "Scheduled consultation appointments",
        "Handled routine case status inquiries",
        "Repetitive qualification questions"
      ],
      afterResponsibilities: [
        "Referral network development and management",
        "Strategic partnership cultivation",
        "Marketing campaign optimization",
        "High-value case identification and routing",
        "Practice growth strategy implementation"
      ],
      revenueImpact: "$280,000 new business from referral partnerships",
      satisfactionIncrease: "Career transformation from admin to revenue-driver",
      companySize: "8 attorneys, $4.5M annual revenue"
    },
    {
      name: "Patricia W.",
      beforeTitle: "Legal Assistant",
      afterTitle: "Practice Operations Director",
      beforeSalary: "$48,000/year",
      afterSalary: "$82,000/year",
      beforeResponsibilities: [
        "Coordinated attorney schedules manually",
        "Handled client communication",
        "Managed document filing and tracking",
        "Constant interruptions and task-switching"
      ],
      afterResponsibilities: [
        "Firm-wide process optimization",
        "Technology implementation and training",
        "Attorney productivity analysis",
        "Client experience program development",
        "Strategic capacity planning"
      ],
      revenueImpact: "$200,000 additional capacity from optimized workflows",
      satisfactionIncrease: "From task-executor to strategic operations leader",
      companySize: "12 attorneys, $6.2M annual revenue"
    }
  ],
  healthcare: [
    {
      name: "Nicole P.",
      beforeTitle: "Front Desk Receptionist",
      afterTitle: "Patient Experience Coordinator",
      beforeSalary: "$40,000/year",
      afterSalary: "$62,000/year",
      beforeResponsibilities: [
        "Answered 150+ calls daily",
        "Manually scheduled appointments",
        "Verified insurance information",
        "Managed walk-in patients during phone chaos"
      ],
      afterResponsibilities: [
        "Care coordination for chronic disease patients",
        "Community outreach and preventive care programs",
        "Provider scheduling optimization (18% revenue increase)",
        "Complex patient situations requiring empathy",
        "Patient satisfaction improvement initiatives"
      ],
      revenueImpact: "$185,000 additional capacity from optimized schedules",
      satisfactionIncrease: "From overwhelmed to making real patient impact",
      companySize: "6 providers, $3.2M annual revenue"
    },
    {
      name: "Carlos M.",
      beforeTitle: "Medical Assistant",
      afterTitle: "Clinical Coordinator",
      beforeSalary: "$44,000/year",
      afterSalary: "$65,000/year",
      beforeResponsibilities: [
        "Handled prescription refill calls",
        "Managed appointment reminder calls",
        "Fielded routine patient inquiries",
        "Limited time for actual clinical work"
      ],
      afterResponsibilities: [
        "Chronic care management program coordination",
        "Provider workflow optimization",
        "Quality metrics improvement",
        "Clinical protocol development",
        "Staff training and mentorship"
      ],
      revenueImpact: "$120,000 chronic care management revenue",
      satisfactionIncrease: "Returned to patient care from phone duty",
      companySize: "8 providers, $4.8M annual revenue"
    },
    {
      name: "Lisa H.",
      beforeTitle: "Office Manager",
      afterTitle: "Revenue Cycle Director",
      beforeSalary: "$52,000/year",
      afterSalary: "$78,000/year + bonus",
      beforeResponsibilities: [
        "Managed front desk operations",
        "Handled staff scheduling",
        "Dealt with patient complaints",
        "Basic billing oversight"
      ],
      afterResponsibilities: [
        "Revenue cycle optimization",
        "Payer contract negotiation",
        "Denial management and appeals",
        "Financial analytics and reporting",
        "Strategic growth planning"
      ],
      revenueImpact: "$240,000 improved collections and reduced denials",
      satisfactionIncrease: "From operational firefighting to strategic finance",
      companySize: "10 providers, $5.5M annual revenue"
    }
  ],
  accounting: [
    {
      name: "Rachel S.",
      beforeTitle: "Staff Accountant",
      afterTitle: "Advisory Services Specialist",
      beforeSalary: "$50,000/year",
      afterSalary: "$78,000/year + commission",
      beforeResponsibilities: [
        "Answered tax season phone calls",
        "Collected documents from clients",
        "Scheduled appointments",
        "Basic tax return preparation"
      ],
      afterResponsibilities: [
        "Proactive tax planning outreach to high-value clients",
        "Client business analysis and strategic consulting",
        "Advisory services presentation and closing",
        "Complex tax scenarios requiring expertise",
        "Client relationship depth building"
      ],
      revenueImpact: "$200,000 advisory services revenue",
      satisfactionIncrease: "From transactional work to trusted advisor",
      companySize: "4 CPAs, $1.8M annual revenue"
    },
    {
      name: "Thomas J.",
      beforeTitle: "Administrative Assistant",
      afterTitle: "Client Success Manager",
      beforeSalary: "$42,000/year",
      afterSalary: "$62,000/year",
      beforeResponsibilities: [
        "Managed client intake calls",
        "Tracked missing documents",
        "Provided tax return status updates",
        "Handled routine inquiries"
      ],
      afterResponsibilities: [
        "Quarterly business review coordination",
        "Service expansion opportunity identification",
        "Client retention initiatives",
        "Technology training for clients",
        "Strategic planning support"
      ],
      revenueImpact: "$95,000 upsell revenue from existing clients",
      satisfactionIncrease: "From administrative to strategic partner",
      companySize: "6 CPAs, $2.5M annual revenue"
    },
    {
      name: "Michelle D.",
      beforeTitle: "Bookkeeper",
      afterTitle: "Controller & CFO Services Lead",
      beforeSalary: "$48,000/year",
      afterSalary: "$85,000/year + profit sharing",
      beforeResponsibilities: [
        "Client bookkeeping and reconciliation",
        "Answered QuickBooks questions",
        "Generated basic financial reports",
        "Managed monthly close processes"
      ],
      afterResponsibilities: [
        "CFO services program development",
        "Strategic financial planning for clients",
        "Team management and training",
        "High-value client relationship ownership",
        "Fractional CFO consulting"
      ],
      revenueImpact: "$180,000 CFO services revenue stream",
      satisfactionIncrease: "Career transformation to executive consulting",
      companySize: "5 CPAs, $2.2M annual revenue"
    }
  ],
  restaurants: [
    {
      name: "Elena G.",
      beforeTitle: "Host/Hostess",
      afterTitle: "Guest Experience Manager",
      beforeSalary: "$32,000/year + tips",
      afterSalary: "$52,000/year + bonus",
      beforeResponsibilities: [
        "Answered phone calls during dinner service",
        "Managed reservations and waitlist",
        "Dealt with walk-in guests",
        "No time for guest relationship building"
      ],
      afterResponsibilities: [
        "VIP customer relationship management (40% repeat increase)",
        "Event planning and catering sales coordination",
        "Staff training and service quality improvement",
        "Social media and community engagement",
        "Guest feedback analysis and improvements"
      ],
      revenueImpact: "$85,000 catering and event revenue",
      satisfactionIncrease: "From reactive to strategic guest relationships",
      companySize: "45 seats, $1.2M annual revenue"
    },
    {
      name: "Miguel R.",
      beforeTitle: "Assistant Manager",
      afterTitle: "Operations & Revenue Manager",
      beforeSalary: "$45,000/year",
      afterSalary: "$68,000/year + profit sharing",
      beforeResponsibilities: [
        "Handled phone orders and reservations",
        "Managed daily operations",
        "Coordinated staff schedules",
        "Constant firefighting"
      ],
      afterResponsibilities: [
        "Menu engineering and profitability analysis",
        "Vendor negotiation and cost optimization",
        "Revenue forecasting and capacity planning",
        "Multi-location expansion planning",
        "Strategic partnership development"
      ],
      revenueImpact: "$120,000 improved margins through menu optimization",
      satisfactionIncrease: "From operational to strategic business partner",
      companySize: "65 seats, $1.8M annual revenue"
    },
    {
      name: "Sophia L.",
      beforeTitle: "Server/Coordinator",
      afterTitle: "Catering & Events Director",
      beforeSalary: "$35,000/year + tips",
      afterSalary: "$65,000/year + commission",
      beforeResponsibilities: [
        "Took phone orders between tables",
        "Coordinated catering inquiries",
        "Managed reservation scheduling",
        "Split attention between dining room and phones"
      ],
      afterResponsibilities: [
        "Corporate catering sales and account management",
        "Event planning and execution",
        "Venue partnership development",
        "Catering menu development",
        "High-value client relationship ownership"
      ],
      revenueImpact: "$180,000 new catering revenue stream",
      satisfactionIncrease: "Career path from server to sales leadership",
      companySize: "50 seats, $1.5M annual revenue"
    }
  ],
  roofing: [
    {
      name: "Jessica P.",
      beforeTitle: "Office Manager",
      afterTitle: "Insurance Claims Specialist",
      beforeSalary: "$44,000/year",
      afterSalary: "$72,000/year + commission",
      beforeResponsibilities: [
        "Answered emergency calls at all hours",
        "Scheduled estimates and jobs",
        "Coordinated crew schedules",
        "Basic office administration"
      ],
      afterResponsibilities: [
        "Insurance claim documentation and navigation",
        "Supplement negotiation with adjusters",
        "Homeowner insurance education",
        "High-value claim coordination",
        "40% higher close rates on insurance work"
      ],
      revenueImpact: "$320,000 additional insurance restoration revenue",
      satisfactionIncrease: "From chaos coordinator to revenue specialist",
      companySize: "8 crews, $3.2M annual revenue"
    },
    {
      name: "Brandon H.",
      beforeTitle: "Estimator",
      afterTitle: "Business Development Director",
      beforeSalary: "$52,000/year",
      afterSalary: "$85,000/year + commission",
      beforeResponsibilities: [
        "Responded to quote requests",
        "Scheduled own appointments",
        "Wrote estimates in the field",
        "Limited time for relationship building"
      ],
      afterResponsibilities: [
        "Strategic partnership development (insurance agents, realtors)",
        "Commercial roofing business development",
        "Referral network cultivation",
        "High-value project consultation",
        "Sales team leadership and training"
      ],
      revenueImpact: "$450,000 new commercial and partnership revenue",
      satisfactionIncrease: "From reactive estimator to strategic growth leader",
      companySize: "12 crews, $5.8M annual revenue"
    },
    {
      name: "Stephanie M.",
      beforeTitle: "Customer Service Rep",
      afterTitle: "Customer Success & Retention Manager",
      beforeSalary: "$38,000/year",
      afterSalary: "$58,000/year + bonus",
      beforeResponsibilities: [
        "Answered incoming phone calls",
        "Provided project status updates",
        "Handled customer complaints",
        "Scheduled follow-up appointments"
      ],
      afterResponsibilities: [
        "Proactive customer communication programs",
        "Warranty and maintenance contract sales",
        "Customer feedback analysis and improvements",
        "Referral program management",
        "Reputation and review strategy"
      ],
      revenueImpact: "$95,000 maintenance contract and referral revenue",
      satisfactionIncrease: "From reactive service to strategic relationships",
      companySize: "10 crews, $4.5M annual revenue"
    }
  ],
  logistics: [
    {
      name: "Derek W.",
      beforeTitle: "Dispatcher",
      afterTitle: "Strategic Account Manager",
      beforeSalary: "$48,000/year",
      afterSalary: "$82,000/year + commission",
      beforeResponsibilities: [
        "Answered load inquiry calls 24/7",
        "Booked individual loads",
        "Coordinated pickups and deliveries",
        "Handled tracking requests"
      ],
      afterResponsibilities: [
        "Enterprise customer relationship management",
        "Dedicated lane proposal development",
        "Contract negotiation (35% increase in value)",
        "Strategic capacity planning",
        "Account growth strategy"
      ],
      revenueImpact: "$600,000 new contracted revenue",
      satisfactionIncrease: "From transactional dispatcher to strategic partner",
      companySize: "25 trucks, $8.5M annual revenue"
    },
    {
      name: "Vanessa K.",
      beforeTitle: "Operations Coordinator",
      afterTitle: "Network Optimization Manager",
      beforeSalary: "$52,000/year",
      afterSalary: "$78,000/year + profit sharing",
      beforeResponsibilities: [
        "Coordinated daily dispatch operations",
        "Handled customer inquiries",
        "Managed driver communications",
        "Reactive problem-solving"
      ],
      afterResponsibilities: [
        "Network design and route optimization",
        "Carrier relationship and rate negotiation",
        "Backhaul opportunity identification",
        "Strategic pricing analysis",
        "Operational efficiency improvements"
      ],
      revenueImpact: "$280,000 improved margins through optimization",
      satisfactionIncrease: "From daily operations to strategic planning",
      companySize: "40 trucks, $12M annual revenue"
    },
    {
      name: "Anthony L.",
      beforeTitle: "Customer Service Rep",
      afterTitle: "Operations Technology Specialist",
      beforeSalary: "$42,000/year",
      afterSalary: "$68,000/year",
      beforeResponsibilities: [
        "Provided shipment tracking updates",
        "Answered customer inquiries",
        "Generated basic reports",
        "Data entry and admin tasks"
      ],
      afterResponsibilities: [
        "TMS system optimization and automation",
        "Advanced analytics and reporting",
        "Technology vendor management",
        "Process automation implementation",
        "Team training on new technologies"
      ],
      revenueImpact: "$150,000 cost savings from automation",
      satisfactionIncrease: "From manual tasks to technology leadership",
      companySize: "35 trucks, $10M annual revenue"
    }
  ],
  bars: [
    {
      name: "Jordan T.",
      beforeTitle: "Manager/Host",
      afterTitle: "VIP Program Director",
      beforeSalary: "$42,000/year + tips",
      afterSalary: "$72,000/year + commission",
      beforeResponsibilities: [
        "Answered reservation calls during shifts",
        "Managed door and guest lists",
        "Coordinated table assignments",
        "General operations management"
      ],
      afterResponsibilities: [
        "High-value customer cultivation and relationship management",
        "VIP membership program development",
        "Corporate event sales (50% bottle service increase)",
        "Influencer and partnership coordination",
        "Guest satisfaction and loyalty programs"
      ],
      revenueImpact: "$220,000 VIP and bottle service revenue increase",
      satisfactionIncrease: "From operational chaos to strategic revenue leadership",
      companySize: "200 capacity, $2.8M annual revenue"
    },
    {
      name: "Alexis P.",
      beforeTitle: "Event Coordinator",
      afterTitle: "Entertainment & Revenue Manager",
      beforeSalary: "$45,000/year",
      afterSalary: "$75,000/year + profit sharing",
      beforeResponsibilities: [
        "Handled event inquiry calls",
        "Coordinated private party bookings",
        "Managed basic event logistics",
        "Reactive booking management"
      ],
      afterResponsibilities: [
        "Talent booking and entertainment curation",
        "Event profitability analysis and optimization",
        "Promotion strategy and marketing campaigns",
        "Partnership development (brands, sponsors)",
        "Revenue per guest optimization"
      ],
      revenueImpact: "$180,000 increased event and promotion revenue",
      satisfactionIncrease: "From logistics coordinator to entertainment curator",
      companySize: "300 capacity, $3.5M annual revenue"
    },
    {
      name: "Marcus H.",
      beforeTitle: "Bartender/Manager",
      afterTitle: "Beverage Program Director",
      beforeSalary: "$48,000/year + tips",
      afterSalary: "$82,000/year + profit sharing",
      beforeResponsibilities: [
        "Managed bar operations",
        "Answered bottle service inquiries",
        "Coordinated reservations",
        "Limited time for strategic work"
      ],
      afterResponsibilities: [
        "Beverage program development and innovation",
        "Supplier relationship and contract negotiation",
        "Profitability analysis and menu engineering",
        "Staff training and development",
        "Multi-location beverage strategy"
      ],
      revenueImpact: "$150,000 improved beverage margins and sales",
      satisfactionIncrease: "From bartending to beverage strategy leadership",
      companySize: "250 capacity, $3.2M annual revenue"
    }
  ],
  spas: [
    {
      name: "Elena S.",
      beforeTitle: "Front Desk Coordinator",
      afterTitle: "Client Experience Director",
      beforeSalary: "$38,000/year",
      afterSalary: "$62,000/year + performance bonus",
      beforeResponsibilities: [
        "Answered phone calls and booking inquiries",
        "Managed walk-in clients and waitlist",
        "Processed payments and rescheduling",
        "Limited time for client relationship building"
      ],
      afterResponsibilities: [
        "VIP client retention strategy and personalized outreach",
        "Membership package design and upselling",
        "Client journey optimization and experience audits",
        "Staff training on luxury service standards",
        "Partnership development with local hotels and businesses"
      ],
      revenueImpact: "$180,000 from membership growth and retail upsells",
      satisfactionIncrease: "From reactive admin work to strategic experience design",
      companySize: "8-therapist day spa, $1.8M annual revenue"
    },
    {
      name: "Jasmine T.",
      beforeTitle: "Spa Attendant",
      afterTitle: "Membership Growth Manager",
      beforeSalary: "$35,000/year",
      afterSalary: "$58,000/year + commission",
      beforeResponsibilities: [
        "Prepared treatment rooms and linens",
        "Assisted with client check-in process",
        "Managed retail inventory restocking",
        "No strategic involvement in growth"
      ],
      afterResponsibilities: [
        "Membership conversion campaigns and follow-up",
        "Client win-back and re-engagement initiatives",
        "Referral program management",
        "Package optimization based on booking patterns",
        "Community outreach and local partnership building"
      ],
      revenueImpact: "$120,000 from new memberships and package upgrades",
      satisfactionIncrease: "From behind-the-scenes work to visible revenue generation",
      companySize: "12-room medical spa, $2.4M annual revenue"
    },
    {
      name: "Maria C.",
      beforeTitle: "Receptionist",
      afterTitle: "Wellness Program Coordinator",
      beforeSalary: "$36,000/year",
      afterSalary: "$55,000/year + incentives",
      beforeResponsibilities: [
        "Scheduled appointments and managed cancellations",
        "Handled client complaints and service recovery",
        "Processed daily transactions",
        "No time for program development"
      ],
      afterResponsibilities: [
        "Corporate wellness program development and sales",
        "Group event coordination (bridal, birthdays, corporate)",
        "Wellness workshop planning and marketing",
        "Seasonal promotion strategy",
        "Therapist utilization optimization"
      ],
      revenueImpact: "$95,000 from corporate contracts and group bookings",
      satisfactionIncrease: "From transaction processing to business development",
      companySize: "6-therapist wellness center, $1.2M annual revenue"
    }
  ],
  hotels: [
    {
      name: "David M.",
      beforeTitle: "Front Desk Agent",
      afterTitle: "Guest Relations Manager",
      beforeSalary: "$42,000/year",
      afterSalary: "$68,000/year + performance bonus",
      beforeResponsibilities: [
        "Checked guests in and out",
        "Answered phone inquiries about availability",
        "Processed reservations and cancellations",
        "Limited guest interaction beyond check-in"
      ],
      afterResponsibilities: [
        "VIP guest experience personalization and surprise-and-delight",
        "Guest complaint resolution and service recovery leadership",
        "Loyalty program engagement and upgrade conversions",
        "Pre-arrival concierge planning for high-value guests",
        "Staff training on hospitality excellence"
      ],
      revenueImpact: "$220,000 from upsells, repeat bookings, and positive reviews",
      satisfactionIncrease: "From transactional role to relationship-building leadership",
      companySize: "120-room boutique hotel, $5.5M annual revenue"
    },
    {
      name: "Sophia L.",
      beforeTitle: "Concierge",
      afterTitle: "VIP Services Director",
      beforeSalary: "$45,000/year",
      afterSalary: "$75,000/year + commission",
      beforeResponsibilities: [
        "Provided local recommendations and directions",
        "Booked restaurant reservations",
        "Arranged transportation for guests",
        "Minimal time for strategic guest engagement"
      ],
      afterResponsibilities: [
        "Curated VIP experience packages (proposals, anniversaries, celebrations)",
        "Local partnership development with restaurants, venues, and services",
        "Personalized itinerary design for luxury travelers",
        "Corporate group coordination and event planning",
        "High-touch service for repeat guests and loyalty members"
      ],
      revenueImpact: "$185,000 from experience packages and partnership commissions",
      satisfactionIncrease: "From basic concierge to luxury experience architect",
      companySize: "85-room luxury hotel, $7.2M annual revenue"
    },
    {
      name: "Andre P.",
      beforeTitle: "Reservations Agent",
      afterTitle: "Revenue Optimization Specialist",
      beforeSalary: "$40,000/year",
      afterSalary: "$65,000/year + incentives",
      beforeResponsibilities: [
        "Answered reservation calls and emails",
        "Processed booking modifications",
        "Managed group block inquiries",
        "No involvement in pricing strategy"
      ],
      afterResponsibilities: [
        "Dynamic pricing strategy and yield management",
        "Group sales outreach and negotiation",
        "OTA channel management and rate parity monitoring",
        "Length-of-stay optimization and package bundling",
        "Demand forecasting and inventory allocation"
      ],
      revenueImpact: "$310,000 from improved RevPAR and occupancy optimization",
      satisfactionIncrease: "From order-taking to strategic revenue management",
      companySize: "180-room full-service hotel, $12M annual revenue"
    }
  ],
  automotive: [
    {
      name: "Carlos R.",
      beforeTitle: "Service Advisor",
      afterTitle: "Customer Retention Manager",
      beforeSalary: "$48,000/year + commission",
      afterSalary: "$72,000/year + performance bonus",
      beforeResponsibilities: [
        "Scheduled service appointments",
        "Answered technical questions about repairs",
        "Provided service estimates and upsells",
        "Limited time for relationship building"
      ],
      afterResponsibilities: [
        "Proactive maintenance reminder campaigns",
        "Service contract renewal and upgrade outreach",
        "Win-back campaigns for lapsed customers",
        "Referral program management",
        "Customer satisfaction follow-up and recovery"
      ],
      revenueImpact: "$240,000 from service retention and contract renewals",
      satisfactionIncrease: "From reactive service to proactive relationship management",
      companySize: "Single-location dealership, $18M annual revenue"
    },
    {
      name: "Michelle K.",
      beforeTitle: "Parts Counter Associate",
      afterTitle: "Inventory & Procurement Specialist",
      beforeSalary: "$42,000/year",
      afterSalary: "$63,000/year + cost savings bonus",
      beforeResponsibilities: [
        "Answered parts availability inquiries",
        "Processed walk-in and phone orders",
        "Managed backorder tracking",
        "No strategic procurement involvement"
      ],
      afterResponsibilities: [
        "Vendor relationship management and price negotiation",
        "Inventory turnover optimization",
        "Special order coordination for wholesale customers",
        "Seasonal demand forecasting",
        "Obsolete inventory liquidation strategy"
      ],
      revenueImpact: "$95,000 from cost savings and wholesale relationship growth",
      satisfactionIncrease: "From order-taking to strategic supply chain management",
      companySize: "Mid-size auto repair shop, $3.2M annual revenue"
    },
    {
      name: "James T.",
      beforeTitle: "Receptionist",
      afterTitle: "Service Operations Coordinator",
      beforeSalary: "$38,000/year",
      afterSalary: "$58,000/year + performance incentives",
      beforeResponsibilities: [
        "Greeted walk-in customers",
        "Answered general service inquiries",
        "Scheduled appointments in downtime",
        "Limited operational visibility"
      ],
      afterResponsibilities: [
        "Technician utilization and bay optimization",
        "Shuttle and loaner vehicle coordination",
        "Multi-location appointment balancing",
        "Customer communication workflow management",
        "Service department KPI tracking and reporting"
      ],
      revenueImpact: "$180,000 from improved technician efficiency and throughput",
      satisfactionIncrease: "From front desk role to operational excellence leadership",
      companySize: "3-location dealership group, $45M annual revenue"
    }
  ],
  real_estate: [
    {
      name: "Rachel H.",
      beforeTitle: "Office Manager",
      afterTitle: "Transaction Coordinator & Compliance Specialist",
      beforeSalary: "$44,000/year",
      afterSalary: "$68,000/year + transaction fees",
      beforeResponsibilities: [
        "Answered general office inquiries",
        "Scheduled showing appointments",
        "Managed listing paperwork",
        "Limited involvement in transaction management"
      ],
      afterResponsibilities: [
        "Full transaction coordination from contract to close",
        "Compliance and disclosure document management",
        "Title company and lender coordination",
        "Agent support on complex transactions",
        "Process improvement and agent training"
      ],
      revenueImpact: "$125,000 from transaction fees and agent productivity gains",
      satisfactionIncrease: "From admin work to mission-critical transaction expertise",
      companySize: "15-agent brokerage, $28M annual sales volume"
    },
    {
      name: "Brandon L.",
      beforeTitle: "Receptionist",
      afterTitle: "Lead Nurturing & Follow-up Manager",
      beforeSalary: "$40,000/year",
      afterSalary: "$65,000/year + commission",
      beforeResponsibilities: [
        "Answered inbound buyer/seller inquiries",
        "Transferred calls to available agents",
        "Managed walk-in visitors",
        "No lead nurturing responsibilities"
      ],
      afterResponsibilities: [
        "ISA (Inside Sales Agent) lead qualification and nurturing",
        "Automated drip campaign management and personalization",
        "Open house follow-up and conversion",
        "Expired listing and FSBO outreach coordination",
        "Lead scoring and agent assignment optimization"
      ],
      revenueImpact: "$310,000 from improved lead conversion and agent productivity",
      satisfactionIncrease: "From call routing to revenue-generating lead conversion",
      companySize: "25-agent team, $48M annual sales volume"
    },
    {
      name: "Amanda S.",
      beforeTitle: "Administrative Assistant",
      afterTitle: "Marketing & Client Relations Director",
      beforeSalary: "$42,000/year",
      afterSalary: "$70,000/year + performance bonus",
      beforeResponsibilities: [
        "Scheduled listing appointments",
        "Managed MLS listings and photos",
        "Processed client correspondence",
        "No strategic marketing involvement"
      ],
      afterResponsibilities: [
        "Social media content strategy and community engagement",
        "Past client nurturing and referral generation",
        "Agent brand development and marketing support",
        "Video marketing and virtual tour coordination",
        "Local partnership and sponsorship management"
      ],
      revenueImpact: "$220,000 from referral business and brand visibility",
      satisfactionIncrease: "From support role to strategic marketing leadership",
      companySize: "Single mega-agent team, $35M annual sales volume"
    }
  ],
  solar: [
    {
      name: "Tyler W.",
      beforeTitle: "Sales Coordinator",
      afterTitle: "Project Management & Installation Specialist",
      beforeSalary: "$46,000/year",
      afterSalary: "$72,000/year + project completion bonuses",
      beforeResponsibilities: [
        "Scheduled site assessment appointments",
        "Answered general solar inquiry calls",
        "Processed initial paperwork",
        "No involvement in project execution"
      ],
      afterResponsibilities: [
        "End-to-end project coordination from sale to activation",
        "Permitting and utility interconnection management",
        "Installation crew scheduling and quality oversight",
        "Customer communication during installation process",
        "Post-installation follow-up and referral generation"
      ],
      revenueImpact: "$195,000 from faster project completion and referral business",
      satisfactionIncrease: "From appointment setter to project delivery leader",
      companySize: "Regional solar installer, $8.5M annual revenue"
    },
    {
      name: "Priya M.",
      beforeTitle: "Customer Service Representative",
      afterTitle: "Client Success & Retention Manager",
      beforeSalary: "$42,000/year",
      afterSalary: "$68,000/year + retention incentives",
      beforeResponsibilities: [
        "Answered billing and technical questions",
        "Scheduled maintenance appointments",
        "Processed warranty claims",
        "Limited proactive customer engagement"
      ],
      afterResponsibilities: [
        "Proactive system monitoring and performance outreach",
        "Battery storage upsell and system expansion campaigns",
        "Referral program management and testimonial gathering",
        "Educational workshop coordination for existing customers",
        "Long-term maintenance contract renewals"
      ],
      revenueImpact: "$155,000 from battery add-ons, referrals, and contract renewals",
      satisfactionIncrease: "From support role to strategic account management",
      companySize: "Mid-size solar company, $12M annual revenue"
    },
    {
      name: "Derek H.",
      beforeTitle: "Administrative Assistant",
      afterTitle: "Permitting & Compliance Coordinator",
      beforeSalary: "$40,000/year",
      afterSalary: "$62,000/year + project completion bonuses",
      beforeResponsibilities: [
        "Filed initial permit applications",
        "Tracked pending permits",
        "Managed basic compliance documentation",
        "Reactive to permit issues"
      ],
      afterResponsibilities: [
        "Multi-jurisdiction permit expertise and relationship building",
        "AHJ (Authority Having Jurisdiction) liaison and issue resolution",
        "Incentive and rebate application management",
        "Inspection scheduling and coordination",
        "Permit process optimization and team training"
      ],
      revenueImpact: "$280,000 from faster permit approval and reduced project delays",
      satisfactionIncrease: "From paperwork processing to critical-path project enabler",
      companySize: "Large regional installer, $22M annual revenue"
    }
  ]
};
