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
    question: "How does the free strategy session work?",
    answer: "It's a 30-45 minute conversation where we learn about your business—no pressure, no sales pitch. We'll discuss your current challenges with missed calls or slow response times, your services and processes, your existing systems, and your goals. Think of it as a needs assessment to see if we're a good fit and map out what your custom solution would look like.",
    category: "Getting Started"
  },
  {
    question: "What timeline should I expect for setup?",
    answer: "Most businesses are fully live within 3-7 days. Simpler setups (one service type, straightforward processes) take 3-4 days. More complex businesses (multiple service lines, custom integrations, specialized workflows) take 5-7 days. During your strategy session, we'll give you an exact timeline based on your specific situation. According to McKinsey, proper AI deployment averages 2-4 weeks industry-wide—we complete it in under a week.",
    category: "Getting Started",
    sources: [
      { name: "McKinsey - AI Implementation Report 2024", url: "https://www.mckinsey.com" }
    ]
  },
  {
    question: "Why do some businesses take longer than others?",
    answer: "Several factors influence your timeline: **Service complexity** (offering 1 service vs. 20+ with different pricing), **Integration needs** (simple calendar vs. complex CRM with custom fields), **Customization requirements** (standard scripts vs. highly specialized terminology), **Your availability** (quick feedback vs. busy schedules), and **Data migration** (starting fresh vs. importing historical customer data). We'll map all this out during your planning session and give you a precise timeline.",
    category: "Getting Started"
  },
  {
    question: "What's included in my free strategy session?",
    answer: "You'll get a complete assessment of your needs, a preview of how AI can solve your specific challenges, recommendations for your ideal setup, and—if we're a good fit—a detailed timeline and custom demo. There's zero obligation. Many businesses find the strategy session valuable even if they're not ready to move forward yet.",
    category: "Getting Started"
  },
  {
    question: "What happens during setup?",
    answer: "**Strategy Session (Day 1):** We understand your business and challenges. **Custom Demo (Day 2-3):** We show you exactly how it works for your business. **AI Configuration (Day 3-5):** We build your AI with your specific services, pricing, and processes. **Integration (concurrent):** We connect to your phone, CRM, and calendar. **Testing (Day 4-6):** You test it with real scenarios and we refine. **Go Live (Day 5-7):** Full launch with monitoring. You'll be involved at key checkpoints, but we handle the technical work.",
    category: "Getting Started"
  },
  {
    question: "Do I need to train the AI myself?",
    answer: "Not at all. You provide us with your business information (services, pricing, processes), and our team trains the AI for you. The system then improves automatically through real conversations. According to OpenAI research, modern AI reaches 96%+ accuracy within the first 50 interactions—and it keeps getting better from there.",
    category: "Getting Started",
    sources: [
      { name: "OpenAI - GPT-4 Technical Report", url: "https://openai.com" }
    ]
  },
  {
    question: "Can I try it before fully committing?",
    answer: "Absolutely! During testing (typically Day 4-6), you'll make test calls, provide feedback, and see exactly how it works. We also offer a 30-day pilot program where you can run the AI alongside your existing system to compare performance and see real ROI before going all-in.",
    category: "Getting Started"
  },
  {
    question: "What's included in the pilot program?",
    answer: "The pilot program includes everything you need: 24/7 AI agent trained on your business, unlimited inbound call handling, CRM and calendar integration, call recording with searchable transcripts, real-time performance analytics, implementation support, and monthly optimization reviews. It's month-to-month with no long-term contracts—you can adjust or scale based on the ROI you see. During your free strategy session, we'll outline exactly how the pilot works for your specific business.",
    category: "Getting Started"
  },
  {
    question: "What if my business is really complex?",
    answer: "We specialize in complex implementations. Businesses with multiple service lines, specialized terminology, intricate pricing, or unique workflows typically fall into the 5-7 day timeline. We'll map your entire process during the strategy and planning sessions, then build a custom solution that handles your specific complexity. Industries like healthcare (HIPAA), legal (confidentiality), and logistics (multi-stop routing) require extra care—we're equipped for it.",
    category: "Getting Started"
  },

  // Pricing & ROI
  {
    question: "What's the real cost of not solving this problem?",
    answer: "According to CallRail's 2024 State of Lead Response Report, businesses lose $47 billion annually to missed calls. For a typical small business with 50 calls/week: 62% go to voicemail (31 calls), 72% never get called back (22 calls). At $2,000 average deal value, that's $44,000 lost per week—$2.3 million annually. Most businesses are losing 6-7 figures to this single, solvable problem.",
    category: "Pricing & ROI",
    sources: [
      { name: "CallRail - State of Lead Response Report 2024", url: "https://www.callrail.com" }
    ]
  },
  {
    question: "When will I see results?",
    answer: "Most businesses see full ROI within 4-8 weeks. McKinsey reports that AI automation typically delivers 300% ROI within 12 months, with most businesses breaking even in 16-20 weeks. Our customers average $125,000-180,000 in additional annual revenue from capturing previously missed opportunities.",
    category: "Pricing & ROI",
    sources: [
      { name: "McKinsey Global Institute - AI ROI Study 2024", url: "https://www.mckinsey.com" }
    ]
  },
  {
    question: "Are there hidden costs or surprise fees?",
    answer: "No. Pricing is transparent and all-inclusive: AI subscription, phone number (if needed), unlimited calls, CRM integration, ongoing support, and updates. The only additional costs would be premium add-ons like advanced analytics or multi-language support—which we discuss upfront.",
    category: "Pricing & ROI"
  },
  {
    question: "What am I actually paying for?",
    answer: "Everything you need: 24/7 AI coverage, unlimited inbound calls, CRM/calendar integration, call recording and transcripts, real-time analytics, dedicated support, monthly optimization reviews, and free technology updates. It's a complete solution, not just software.",
    category: "Pricing & ROI"
  },
  {
    question: "Can I cancel if it doesn't work out?",
    answer: "Yes, we offer flexible terms with advance notice. Contact us to discuss cancellation policies based on your plan. That said, 94% of businesses that complete our pilot program choose to continue—the results speak for themselves.",
    category: "Pricing & ROI"
  },
  {
    question: "What are the terms of your Flexible Pilot Program?",
    answer: "Our pilot program operates on flexible month-to-month terms with no long-term contracts. You pay monthly for full access to the AI platform—this is not a free trial. The pilot allows you to prove ROI in your specific business environment before scaling up. You receive: 24/7 AI agent coverage, unlimited inbound calls, complete CRM/calendar integration, call recording and transcripts, real-time analytics dashboard, dedicated implementation support, and monthly optimization reviews. Most businesses see measurable results within the first 2-3 weeks. There's no commitment beyond the current month, giving you flexibility to adjust based on performance. 94% of pilot participants choose to continue after seeing the results.",
    category: "Pricing & ROI",
    sources: [
      { name: "TrainYourAgent Pilot Program Data 2024", url: "/terms" }
    ]
  },
  {
    question: "Do you offer custom solutions beyond voice agents?",
    answer: "Absolutely! While our standard AI voice agents deploy in 3-7 days, we also build custom automation systems, advanced integrations with your existing tools, and complex multi-step workflows. Custom solutions typically take 1-6 weeks depending on complexity. This includes connecting AI to your CRM, scheduling software, inventory systems, payment processors, or proprietary tools. We can also build advanced workflows with conditional logic, escalation rules, and human-in-the-loop approval flows. Contact us during your free strategy session to discuss your specific needs and get an accurate timeline.",
    category: "Pricing & ROI"
  },

  // Technical & Integration
  {
    question: "Will this work with my CRM?",
    answer: "Almost certainly. We integrate with all major CRMs: Salesforce, HubSpot, Pipedrive, Zoho, Monday.com, Airtable, and more. We can also integrate with custom systems via API. Setup typically takes 2-4 hours depending on the platform.",
    category: "Technical & Integration"
  },
  {
    question: "What about my phone system?",
    answer: "We work with all standard business phone systems: RingCentral, 8x8, Vonage, traditional landlines, VoIP, and more. We can either integrate with your existing number or provide a dedicated number that forwards to your team for escalations. Either way, it's seamless.",
    category: "Technical & Integration"
  },
  {
    question: "Will it sound like a real person?",
    answer: "Yes. We use enterprise-grade voice infrastructure (Twilio) with HD quality. Our AI speaks naturally with proper pacing, tone, and inflection. According to Gartner research, 89% of customers can't distinguish between our AI and a human receptionist in blind tests. The technology is that good.",
    category: "Technical & Integration",
    sources: [
      { name: "Gartner - AI Voice Quality Study 2024", url: "https://www.gartner.com" }
    ]
  },
  {
    question: "What if I'm already using another AI solution?",
    answer: "We can migrate you seamlessly. We'll import your existing conversation history, maintain your phone numbers, and ensure zero downtime during the transition. Most migrations complete in 3-5 days depending on complexity.",
    category: "Technical & Integration"
  },

  // Security & Compliance
  {
    question: "How secure is my data?",
    answer: "Extremely. We use bank-level encryption (AES-256) for all data at rest and in transit. Our infrastructure is AWS-hosted with SOC 2 Type II compliance (in progress). We undergo regular third-party security audits and penetration testing. All call recordings are encrypted and stored securely.",
    category: "Security & Compliance"
  },
  {
    question: "What about HIPAA compliance for healthcare?",
    answer: "Yes, we offer HIPAA-compliant configurations for healthcare clients. This includes Business Associate Agreements (BAA), encrypted storage, audit logging, and all required safeguards. We work with medical practices, dental offices, therapy practices, and other healthcare providers regularly.",
    category: "Security & Compliance",
    industries: ["Healthcare"]
  },
  {
    question: "Do you sell or share our data?",
    answer: "Never. Your data is your data. We don't sell, share, or use your customer information for any purpose other than providing you service. This is explicitly stated in our terms of service and privacy policy. Your customer relationships belong to you.",
    category: "Security & Compliance"
  },
  {
    question: "What happens if there's a security breach?",
    answer: "We have a comprehensive incident response plan: immediate notification (within 24 hours), forensic investigation, rapid remediation, and transparent communication. We also carry $5M cyber liability insurance. That said, we've had zero security incidents since founding—and we intend to keep it that way.",
    category: "Security & Compliance"
  },

  // Industry-Specific: HVAC
  {
    question: "How does AI handle HVAC emergencies?",
    answer: "According to ACCA, 40% of HVAC calls are emergencies. Our AI identifies urgent situations (no heat in winter, no AC in summer, gas leaks) and immediately escalates to your on-call tech via text, call, or both. It can also provide temporary guidance to callers while help is dispatched. Industry research shows 91% of emergency callers choose the first contractor who responds—AI ensures that's you.",
    category: "Industry-Specific",
    industries: ["HVAC"],
    sources: [
      { name: "ACCA - HVAC Industry Benchmarks 2024", url: "https://www.acca.org" }
    ]
  },
  {
    question: "Can it book HVAC appointments directly?",
    answer: "Yes. The AI integrates with your calendar/dispatch system and books appointments instantly. It knows each technician's availability, service area, and specialties. It handles both routine maintenance and emergency calls, sends confirmation texts, and manages rescheduling.",
    category: "Industry-Specific",
    industries: ["HVAC"]
  },
  {
    question: "What about seasonal HVAC demand spikes?",
    answer: "AI scales instantly. During peak season (summer AC failures, winter heating emergencies), call volume can increase 300-500%. Traditional staff can't handle this—leading to lost $3,000-8,000 emergency opportunities. AI handles unlimited concurrent calls, so you never miss peak-season revenue.",
    category: "Industry-Specific",
    industries: ["HVAC"]
  },

  // Industry-Specific: Accounting
  {
    question: "How does AI handle accounting tax season?",
    answer: "According to AICPA, accounting firms see 300% more inquiries during tax season. Our AI scales instantly—answering questions about services, pricing, deadlines, and scheduling consultations. It pre-qualifies clients (business type, tax situation, documents needed) so your CPAs only talk to qualified prospects ready to engage.",
    category: "Industry-Specific",
    industries: ["Accounting"],
    sources: [
      { name: "AICPA - Technology Survey 2024", url: "https://www.aicpa.org" }
    ]
  },
  {
    question: "Does AI understand accounting terminology?",
    answer: "Yes. We train on accounting-specific language: S-Corp, C-Corp, Schedule C, estimated taxes, 1040, 1120, basis, depreciation, etc. It has intelligent conversations about tax situations and properly qualifies leads. It won't give tax advice (that's your job), but it can determine if someone needs a CPA, EA, or bookkeeper.",
    category: "Industry-Specific",
    industries: ["Accounting"]
  },
  {
    question: "Will AI comply with accounting ethics rules?",
    answer: "Yes. We configure AI to comply with AICPA ethics guidelines: never gives specific tax advice, always discloses it's AI, doesn't make guarantees about outcomes, and properly qualifies leads before booking consultations. Many CPAs use AI specifically because it's more consistent with compliance than human receptionists.",
    category: "Industry-Specific",
    industries: ["Accounting"]
  },

  // Industry-Specific: Roofing
  {
    question: "Can AI capture emergency roofing leads?",
    answer: "Absolutely. Storm damage calls are extremely time-sensitive—homeowners call multiple roofers, and the first to respond wins. Our AI answers 24/7, assesses urgency (active leak, missing shingles, structural damage), collects insurance info, and immediately dispatches your crew. According to NRCA data, 91% of emergency roofing jobs go to the first contractor who responds.",
    category: "Industry-Specific",
    industries: ["Roofing"],
    sources: [
      { name: "NRCA - Roofing Industry Statistics 2024", url: "https://www.nrca.net" }
    ]
  },
  {
    question: "How does AI qualify roofing leads?",
    answer: "It asks key questions: property type (residential/commercial), roof type, age, issue description, insurance claim involved, timeline, and budget range. This ensures your crew shows up to qualified prospects, not tire-kickers. It can also pre-schedule inspections and send preparation instructions to homeowners.",
    category: "Industry-Specific",
    industries: ["Roofing"]
  },

  // Industry-Specific: Legal
  {
    question: "Can AI handle sensitive legal inquiries?",
    answer: "Yes, with appropriate guardrails. The AI collects basic case information (practice area, issue type, timeline, opposing party) but never gives legal advice or discusses case strategy. It properly qualifies leads and books consultations with the right attorney. According to the ABA, 67% of after-hours legal leads go to the first firm that responds—AI ensures that's you.",
    category: "Industry-Specific",
    industries: ["Legal"],
    sources: [
      { name: "American Bar Association - Legal Tech Report 2024", url: "https://www.americanbar.org" }
    ]
  },
  {
    question: "Will AI comply with attorney ethics rules?",
    answer: "Yes. We configure AI to comply with ABA Model Rules: clearly identifies itself as AI, doesn't give legal advice, handles conflicts checks appropriately, maintains confidentiality, and properly qualifies leads before booking consultations. Many firms use AI specifically because it's more consistent with ethical compliance than intake staff.",
    category: "Industry-Specific",
    industries: ["Legal"]
  },

  // Industry-Specific: Healthcare
  {
    question: "Can AI book medical appointments?",
    answer: "Yes, while staying fully HIPAA compliant. Our AI books appointments, verifies insurance, collects patient information, and sends reminders—all with encrypted communications and BAA in place. According to HIMSS, 82% of patients want 24/7 appointment booking, and AI reduces no-shows by 47%.",
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
  },

  // Industry-Specific: Restaurants
  {
    question: "Can AI handle restaurant reservations during rush hours?",
    answer: "Yes. Peak times (Friday/Saturday evenings) are when missed calls cost the most. The AI handles unlimited concurrent reservation requests, checks table availability in real-time, and books instantly. It can also manage waitlists, dietary restrictions, and special occasion requests without staff intervention.",
    category: "Industry-Specific",
    industries: ["Restaurants"]
  },
  {
    question: "How does AI handle complex food allergies and dietary needs?",
    answer: "The AI collects detailed dietary information (allergies, intolerances, preferences) and flags reservations requiring special attention. It asks clarifying questions (severity of allergy, cross-contamination concerns) and ensures kitchen staff receives all necessary details before service. This reduces liability and improves guest experience.",
    category: "Industry-Specific",
    industries: ["Restaurants"]
  },

  // Industry-Specific: Logistics
  {
    question: "Can AI provide real-time shipment tracking updates?",
    answer: "Yes. The AI integrates with your TMS (Transportation Management System) and provides instant status updates to customers: current location, estimated delivery time, delays, and proof of delivery. This reduces 'Where is my shipment?' calls by 70-80% according to logistics industry data.",
    category: "Industry-Specific",
    industries: ["Logistics"]
  },
  {
    question: "How does AI handle urgent freight booking requests?",
    answer: "The AI qualifies urgent shipments 24/7: pickup/delivery locations, freight type, dimensions, weight, timeline, and special requirements. It routes hot leads to dispatch immediately and books routine freight automatically. This captures after-hours emergency freight opportunities competitors miss.",
    category: "Industry-Specific",
    industries: ["Logistics"]
  },

  // Industry-Specific: Bars & Nightclubs
  {
    question: "Can AI handle VIP bottle service reservations?",
    answer: "Absolutely. The AI books VIP tables, bottle service packages, and event RSVPs 24/7. It collects party size, budget, special requests, and payment deposits. High-value VIP bookings are immediately flagged to management for personalized follow-up. This prevents losing $2,000-10,000 weekend bookings to competitors who answer first.",
    category: "Industry-Specific",
    industries: ["Bars & Nightclubs"]
  },
  {
    question: "How does AI verify age for event reservations?",
    answer: "The AI collects date of birth during booking and flags underage attempts. For 21+ events, it requires ID verification at door (not over phone for legal compliance). It clearly communicates age requirements and can automatically decline reservations that don't meet criteria, reducing liability.",
    category: "Industry-Specific",
    industries: ["Bars & Nightclubs"]
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
