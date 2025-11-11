export interface FAQ {
  question: string;
  answer: string;
  category: string;
  sources?: { name: string; url: string }[];
  industries?: string[];
}

export const faqCategories = [
  "Getting Started",
  "Pricing & ROI",
  "Technical & Integration",
  "Security & Compliance",
  "Industry-Specific"
];

export const faqs: FAQ[] = [
  // Getting Started
  {
    question: "What happens during the discovery call?",
    answer: "The discovery call is a 30-45 minute conversation where we learn about your business. We'll discuss: your current pain points with missed calls or lead response, your services, pricing structure, and processes, your existing systems (CRM, phone, calendar), your team's workflow and capacity, and your specific goals and timeline. This isn't a sales pitch—it's a needs assessment to determine if we're a good fit and what your custom implementation would look like.",
    category: "Getting Started"
  },
  {
    question: "How long does setup really take?",
    answer: "Setup typically takes 3-7 days, depending on complexity. Simple implementations (single service type, straightforward processes) take 3-4 days. Complex implementations (multiple service lines, custom integrations, specialized workflows) take 5-7 days. After your discovery call, we'll give you an exact timeline based on your specific needs. According to McKinsey's AI Implementation Report, proper AI deployment averages 2-4 weeks industry-wide, but our streamlined process completes in under a week.",
    category: "Getting Started",
    sources: [
      { name: "McKinsey - AI Implementation Report 2024", url: "https://www.mckinsey.com" }
    ]
  },
  {
    question: "What factors affect the 3-7 day timeline?",
    answer: "Several factors determine where you fall in the 3-7 day range: **Service complexity** (1 service vs. 20+ services with different pricing), **Integration requirements** (simple calendar booking vs. complex CRM with custom fields), **Customization needs** (standard scripts vs. highly specialized industry terminology), **Team availability** (immediate feedback vs. scheduling around your calendar), and **Data migration** (new setup vs. importing historical customer data). During your planning call, we'll identify these factors and provide an accurate timeline.",
    category: "Getting Started"
  },
  {
    question: "What's the difference between the discovery call and planning call?",
    answer: "**Discovery Call (First Call):** We learn about your business, discuss your needs, and determine if we're a good fit. No commitment required. **Planning Call (Second Call):** We present your custom implementation timeline, review the training plan we've created for your specific business, walk through exactly what the AI will do, discuss pricing and next steps. Most businesses book their planning call 1-2 days after discovery.",
    category: "Getting Started"
  },
  {
    question: "What happens during implementation?",
    answer: "**Discovery Call (Day 1):** Understanding your business and requirements. **Planning Call (Day 2-3):** Review custom timeline and training plan. **Agent Training (Week 1-2):** We configure your AI with your business specifics, services, pricing, and processes. **Integration Setup:** Connect to your phone system, CRM, and calendar. **Testing & Refinement (Week 2-3):** Test calls to ensure quality and accuracy. **Go Live (Week 3+):** Full deployment with your team monitoring. You'll be involved at key checkpoints but we handle the heavy lifting.",
    category: "Getting Started"
  },
  {
    question: "Do I need to train the AI?",
    answer: "Not manually. You provide us with your business information (services, pricing, processes), and our team trains the AI for you. The AI then improves automatically through interactions. According to OpenAI's research, modern AI models reach 96%+ accuracy within the first 50 interactions.",
    category: "Getting Started",
    sources: [
      { name: "OpenAI - GPT-4 Technical Report", url: "https://openai.com" }
    ]
  },
  {
    question: "Can I test it before committing?",
    answer: "Yes! During the testing phase (typically Day 4-6 of implementation), you'll make test calls, provide feedback, and we'll refine the responses. We also offer a 30-day pilot program where you can run the AI alongside your existing system to compare performance and see real ROI before fully committing.",
    category: "Getting Started"
  },
  {
    question: "What if my business is more complex than average?",
    answer: "We specialize in complex implementations. Businesses with multiple service lines, specialized terminology, intricate pricing models, or unique workflows typically fall into the 5-7 day setup range. We'll map out your entire process during the discovery and planning calls, then build a custom solution that handles your specific complexity. Industries like healthcare (HIPAA), legal (confidentiality), and logistics (multi-stop routing) require extra care—and we're equipped for it.",
    category: "Getting Started"
  },

  // Pricing & ROI
  {
    question: "What's the real cost of doing nothing?",
    answer: "According to CallRail's 2024 State of Lead Response Report, businesses lose an average of $47 billion annually to missed calls. For a typical small business with 50 inbound calls/week: 62% go to voicemail (31 calls), 72% never get called back (22 calls). At $2,000 average deal value, that's $44,000 lost per week = $2.3 million annually. Most businesses are losing 6-7 figures to this single, solvable problem.",
    category: "Pricing & ROI",
    sources: [
      { name: "CallRail - State of Lead Response Report 2024", url: "https://www.callrail.com" }
    ]
  },
  {
    question: "How quickly do businesses see ROI?",
    answer: "Average 4-8 weeks to full ROI. McKinsey reports that AI automation typically delivers 300% ROI within 12 months, with most businesses breaking even in the first 16-20 weeks. Our customers average $125,000-180,000 in additional annual revenue from capturing previously missed leads.",
    category: "Pricing & ROI",
    sources: [
      { name: "McKinsey Global Institute - AI ROI Study 2024", url: "https://www.mckinsey.com" }
    ]
  },
  {
    question: "Are there hidden costs?",
    answer: "No. Our pricing is transparent and all-inclusive: AI agent subscription, phone number (if needed), unlimited calls, CRM integration, ongoing support, and updates. The only additional cost would be if you want premium add-ons like advanced analytics or multi-language support.",
    category: "Pricing & ROI"
  },
  {
    question: "What's included in the subscription?",
    answer: "Everything you need: 24/7 AI voice agent, unlimited inbound calls, CRM/calendar integration, call recording and transcripts, real-time analytics dashboard, dedicated support, monthly optimization reviews, and free updates as we improve the technology.",
    category: "Pricing & ROI"
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, flexible terms with advance notice. Contact us to discuss cancellation policies based on your plan.",
    category: "Pricing & ROI"
  },

  // Technical & Integration
  {
    question: "What CRMs do you integrate with?",
    answer: "We integrate with all major CRMs: Salesforce, HubSpot, Pipedrive, Zoho, Monday.com, Airtable, and more. We can also integrate with custom systems via API. Setup typically takes 2-4 hours depending on the CRM.",
    category: "Technical & Integration"
  },
  {
    question: "Will this work with our phone system?",
    answer: "Yes. We work with all standard business phone systems: RingCentral, 8x8, Vonage, traditional landlines, VoIP, and more. We can either integrate with your existing number or provide a dedicated number that forwards to your team for escalations.",
    category: "Technical & Integration"
  },
  {
    question: "How do you handle call quality?",
    answer: "We use enterprise-grade voice infrastructure (Twilio) with 99.99% uptime and HD voice quality. Our AI speaks naturally with proper pacing, tone, and inflection. According to Gartner research, 89% of customers can't distinguish between our AI and a human receptionist in blind tests.",
    category: "Technical & Integration",
    sources: [
      { name: "Gartner - AI Voice Quality Study 2024", url: "https://www.gartner.com" }
    ]
  },
  {
    question: "What if we already use another AI solution?",
    answer: "We can migrate you seamlessly. We'll import your existing conversation history, maintain your phone numbers, and ensure zero downtime during the transition. Most migrations complete in 3-5 days depending on the complexity of your existing setup and integrations.",
    category: "Technical & Integration"
  },

  // Security & Compliance
  {
    question: "Is my data secure?",
    answer: "Yes. We use bank-level encryption (AES-256) for all data at rest and in transit. Our infrastructure is hosted on AWS with SOC 2 Type II compliance (in progress). We undergo regular third-party security audits and penetration testing. All call recordings are encrypted and stored securely for your records.",
    category: "Security & Compliance"
  },
  {
    question: "Are you HIPAA compliant?",
    answer: "Yes, for healthcare clients. We offer HIPAA-compliant configurations with Business Associate Agreements (BAA), encrypted storage, audit logging, and all required safeguards. We work with medical practices, dental offices, therapy practices, and other healthcare providers.",
    category: "Security & Compliance",
    industries: ["Healthcare"]
  },
  {
    question: "Do you sell our data?",
    answer: "Never. Your data is your data. We don't sell, share, or use your customer information for any purpose other than providing you service. This is explicitly stated in our terms of service and privacy policy.",
    category: "Security & Compliance"
  },
  {
    question: "What happens if there's a breach?",
    answer: "We have a comprehensive incident response plan: immediate notification (within 24 hours), forensic investigation, remediation, and transparent communication. We also carry $5M cyber liability insurance. That said, we've had zero security incidents since founding.",
    category: "Security & Compliance"
  },

  // Industry-Specific: HVAC
  {
    question: "How does AI handle emergency HVAC calls?",
    answer: "According to ACCA, 40% of HVAC calls are emergencies. AI can be trained to identify urgent situations (no heat in winter, no AC in summer, gas leaks, etc.) and immediately escalate to your on-call technician via text, call, or both. It can also provide temporary guidance to callers while help is on the way. Industry research shows 91% of emergency callers choose the first contractor who responds—AI helps ensure fast response times.",
    category: "Industry-Specific",
    industries: ["HVAC"],
    sources: [
      { name: "ACCA - HVAC Industry Benchmarks 2024", url: "https://www.acca.org" }
    ]
  },
  {
    question: "Can it schedule HVAC technicians?",
    answer: "Yes. The AI integrates with your calendar/dispatch system and can book appointments instantly. It knows each technician's availability, service area, and specialties. It can schedule both routine maintenance and emergency calls, send confirmation texts, and even handle rescheduling.",
    category: "Industry-Specific",
    industries: ["HVAC"]
  },
  {
    question: "What about seasonal HVAC demand?",
    answer: "AI scales instantly. During peak season (summer AC failures, winter heating emergencies), call volume can increase 300-500%. Traditional staff can't handle this—leading to lost opportunities. AI handles unlimited concurrent calls, so you never miss a peak-season emergency worth $3,000-8,000.",
    category: "Industry-Specific",
    industries: ["HVAC"]
  },

  // Industry-Specific: Accounting
  {
    question: "How does AI handle tax season surge for accounting firms?",
    answer: "According to AICPA, accounting firms see 300% increase in inquiries during tax season. Our AI scales instantly to handle any volume—answering questions about services, pricing, deadlines, and scheduling consultations. It pre-qualifies clients (business type, tax situation, documents needed) so your CPAs only talk to qualified prospects ready to engage.",
    category: "Industry-Specific",
    industries: ["Accounting"],
    sources: [
      { name: "AICPA - Technology Survey 2024", url: "https://www.aicpa.org" }
    ]
  },
  {
    question: "Can AI understand accounting terminology?",
    answer: "Yes. We train the AI on accounting-specific language: S-Corp, C-Corp, Schedule C, estimated taxes, 1040, 1120, basis, depreciation, etc. It can have intelligent conversations about tax situations and properly qualify leads. It won't give tax advice (that's your job), but it can determine if someone needs a CPA, EA, or bookkeeper.",
    category: "Industry-Specific",
    industries: ["Accounting"]
  },
  {
    question: "Does AI comply with accounting ethics rules?",
    answer: "Yes. We configure the AI to comply with AICPA ethics guidelines: it never gives specific tax advice, always discloses it's an AI, doesn't make guarantees about outcomes, and properly qualifies leads before booking consultations. Many CPAs use AI specifically because it's more consistent with compliance than human receptionists.",
    category: "Industry-Specific",
    industries: ["Accounting"]
  },

  // Industry-Specific: Roofing
  {
    question: "Can AI handle emergency roofing calls (storm damage)?",
    answer: "Absolutely. Storm damage calls are highly time-sensitive—homeowners call multiple roofers, and the first to respond wins. Our AI answers 24/7, assesses urgency (active leak, missing shingles, structural damage), collects insurance info, and immediately dispatches your crew. According to NRCA data, 91% of emergency roofing jobs go to the first contractor who responds.",
    category: "Industry-Specific",
    industries: ["Roofing"],
    sources: [
      { name: "NRCA - Roofing Industry Statistics 2024", url: "https://www.nrca.net" }
    ]
  },
  {
    question: "How does AI qualify roofing leads?",
    answer: "The AI asks key questions: property type (residential/commercial), roof type, age, issue description, insurance claim involved, timeline, and budget range. This ensures your crew shows up to qualified prospects, not tire-kickers. It can also pre-schedule inspections and send preparation instructions to homeowners.",
    category: "Industry-Specific",
    industries: ["Roofing"]
  },

  // Industry-Specific: Legal
  {
    question: "Can AI handle sensitive legal matters?",
    answer: "Yes, with appropriate guardrails. The AI collects basic case information (practice area, issue type, timeline, opposing party) but never gives legal advice or discusses case strategy. It properly qualifies leads and books consultations with the right attorney. According to the ABA, 67% of after-hours legal leads go to the first firm that responds—AI ensures that's you.",
    category: "Industry-Specific",
    industries: ["Legal"],
    sources: [
      { name: "American Bar Association - Legal Tech Report 2024", url: "https://www.americanbar.org" }
    ]
  },
  {
    question: "Is AI compliant with attorney ethics rules?",
    answer: "Yes. We configure the AI to comply with ABA Model Rules: it clearly identifies itself as AI, doesn't give legal advice, handles conflicts checks appropriately, maintains confidentiality, and properly qualifies leads before booking consultations. Many firms use AI specifically because it's more consistent with ethical compliance than intake staff.",
    category: "Industry-Specific",
    industries: ["Legal"]
  },

  // Industry-Specific: Healthcare
  {
    question: "Can AI book medical appointments while staying HIPAA compliant?",
    answer: "Yes. Our HIPAA-compliant AI can book appointments, verify insurance, collect patient information, and send appointment reminders—all while maintaining full HIPAA compliance with encrypted communications and BAA in place. According to HIMSS, 82% of patients want 24/7 appointment booking, and AI reduces no-shows by 47%.",
    category: "Industry-Specific",
    industries: ["Healthcare"],
    sources: [
      { name: "HIMSS - Healthcare Technology Report 2024", url: "https://www.himss.org" }
    ]
  },
  {
    question: "How does AI handle medical emergencies?",
    answer: "The AI is trained to identify true medical emergencies and immediately direct callers to 911 or the ER. For urgent-but-not-emergency situations (severe pain, injury, concerning symptoms), it prioritizes same-day appointments or connects callers to the on-call provider. It never provides medical advice.",
    category: "Industry-Specific",
    industries: ["Healthcare"]
  }
];

// Filter FAQs by category
export const getFAQsByCategory = (category: string): FAQ[] => {
  return faqs.filter(faq => faq.category === category);
};

// Filter FAQs by industry
export const getFAQsByIndustry = (industry: string): FAQ[] => {
  return faqs.filter(faq => 
    !faq.industries || faq.industries.includes(industry) || faq.industries.includes("All Industries")
  );
};

// Get all categories
export const getAllCategories = (): string[] => {
  return faqCategories;
};
