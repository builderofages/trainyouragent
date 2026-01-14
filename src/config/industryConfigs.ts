import { 
  Thermometer, Scale, HardHat, Stethoscope, Calculator, Truck, 
  UtensilsCrossed, Wine, Sparkles, Hotel, Car, Home, Sun, Dumbbell
} from "lucide-react";
import type { IndustryConfig } from "@/components/premium/IndustryLandingTemplate";

export const industryConfigs: Record<string, IndustryConfig> = {
  hvac: {
    id: "hvac",
    name: "HVAC",
    slug: "hvac",
    icon: Thermometer,
    tagline: "Never miss an emergency call again",
    headline: {
      line1: "Emergency Calls",
      line2: "Answered Instantly.",
      line3: "Revenue Captured."
    },
    subheadline: "AI that handles after-hours emergencies, qualifies leads, and schedules service appointments 24/7—even during heat waves and cold snaps.",
    stats: [
      { value: 24, suffix: "/7", label: "Call Coverage" },
      { value: 35, suffix: "%", label: "More Bookings" },
      { value: 2, suffix: " min", label: "Response Time" }
    ],
    problems: [
      { stat: "67%", label: "After-Hours Calls", description: "of emergency calls happen outside business hours" },
      { stat: "$180K", label: "Lost Revenue", description: "average annual revenue lost from missed calls" },
      { stat: "62%", label: "Unanswered", description: "of calls go unanswered during peak seasons" }
    ],
    seo: {
      title: "AI Voice Agents for HVAC Companies | TrainYourAgent",
      description: "Never miss an emergency HVAC call again. AI voice agents that answer 24/7, qualify leads, and book service appointments. Live in 5 days. 94% booking rate.",
      keywords: ["HVAC AI", "HVAC answering service", "HVAC voice agent", "HVAC call handling", "ServiceTitan integration"]
    },
    gradient: "from-blue-400 to-cyan-400",
    accentColor: "blue",
    videoPath: "/videos/industries/hvac-hero.mp4"
  },
  legal: {
    id: "legal",
    name: "Legal",
    slug: "legal",
    icon: Scale,
    tagline: "Capture every potential client",
    headline: {
      line1: "Client Calls",
      line2: "Screened 24/7.",
      line3: "Cases Captured."
    },
    subheadline: "AI that qualifies legal inquiries, screens for case fit, and schedules consultations—even at midnight when accident victims are searching.",
    stats: [
      { value: 48, suffix: "%", label: "Calls Missed" },
      { value: 60, suffix: "%", label: "After-Hours" },
      { value: 78, suffix: "%", label: "First Responder Wins" }
    ],
    problems: [
      { stat: "48%", label: "Missed Calls", description: "of legal inquiry calls go unanswered" },
      { stat: "60%", label: "After-Hours", description: "of personal injury leads call outside business hours" },
      { stat: "$250K", label: "Lost Cases", description: "average annual value lost from missed opportunities" }
    ],
    seo: {
      title: "AI Voice Agents for Law Firms | TrainYourAgent",
      description: "Never miss a potential client again. AI voice agents for law firms that screen cases 24/7, schedule consultations, and capture leads. Clio integrated.",
      keywords: ["legal AI", "law firm answering service", "legal voice agent", "attorney call handling", "Clio integration"]
    },
    gradient: "from-amber-400 to-yellow-400",
    accentColor: "amber",
    videoPath: "/videos/industries/legal-hero.mp4"
  },
  healthcare: {
    id: "healthcare",
    name: "Healthcare",
    slug: "healthcare",
    icon: Stethoscope,
    tagline: "HIPAA-compliant patient engagement",
    headline: {
      line1: "Patient Calls",
      line2: "Answered Instantly.",
      line3: "Care Delivered."
    },
    subheadline: "HIPAA-compliant AI that schedules appointments, handles refill requests, and triages patient inquiries 24/7.",
    stats: [
      { value: 23, suffix: "%", label: "No-Show Rate" },
      { value: 80, suffix: "%", label: "Reduction" },
      { value: 15, suffix: " hrs", label: "Saved Weekly" }
    ],
    problems: [
      { stat: "23%", label: "No-Shows", description: "average no-show rate for medical appointments" },
      { stat: "15-20", label: "Hours Weekly", description: "staff spend on phone calls" },
      { stat: "$125K", label: "Lost Revenue", description: "annual cost of missed appointments" }
    ],
    seo: {
      title: "AI Voice Agents for Healthcare | TrainYourAgent",
      description: "HIPAA-compliant AI voice agents for medical practices. Reduce no-shows by 80%, automate scheduling, and handle refill requests 24/7.",
      keywords: ["healthcare AI", "medical answering service", "HIPAA compliant AI", "patient scheduling", "Epic integration"]
    },
    gradient: "from-emerald-400 to-teal-400",
    accentColor: "emerald",
    videoPath: "/videos/industries/healthcare-hero.mp4"
  },
  accounting: {
    id: "accounting",
    name: "Accounting",
    slug: "accounting",
    icon: Calculator,
    tagline: "Handle tax season overflow",
    headline: {
      line1: "Client Calls",
      line2: "Tax Season Ready.",
      line3: "Revenue Maximized."
    },
    subheadline: "AI that handles 400% call volume spikes during tax season, qualifies advisory opportunities, and schedules consultations 24/7.",
    stats: [
      { value: 400, suffix: "%", label: "Volume Spike" },
      { value: 30, suffix: "%", label: "Admin Time" },
      { value: 5, suffix: "x", label: "Advisory Margins" }
    ],
    problems: [
      { stat: "400%", label: "Volume Spike", description: "call volume increase during tax season" },
      { stat: "30%", label: "Non-Billable", description: "of time spent on admin work" },
      { stat: "$125K", label: "Lost Revenue", description: "from missed calls during peak season" }
    ],
    seo: {
      title: "AI Voice Agents for Accounting Firms | TrainYourAgent",
      description: "Handle tax season call overflow with AI. Voice agents that qualify clients, schedule consultations, and convert tax clients to advisory services.",
      keywords: ["accounting AI", "CPA answering service", "tax season AI", "accounting firm automation"]
    },
    gradient: "from-violet-400 to-purple-400",
    accentColor: "violet",
    videoPath: "/videos/industries/accounting-hero.mp4"
  },
  roofing: {
    id: "roofing",
    name: "Roofing",
    slug: "roofing",
    icon: HardHat,
    tagline: "Capture storm damage leads instantly",
    headline: {
      line1: "Storm Calls",
      line2: "Captured Instantly.",
      line3: "Jobs Booked."
    },
    subheadline: "AI that handles post-storm call surges, qualifies insurance claims, and schedules inspections—when every minute counts.",
    stats: [
      { value: 500, suffix: "%", label: "Storm Surge" },
      { value: 35, suffix: "%", label: "More Leads" },
      { value: 48, suffix: " hrs", label: "Decision Window" }
    ],
    problems: [
      { stat: "500%", label: "Call Surge", description: "volume increase after major storms" },
      { stat: "48", label: "Hour Window", description: "before homeowners choose a roofer" },
      { stat: "$85K", label: "Lost Per Storm", description: "in missed opportunities" }
    ],
    seo: {
      title: "AI Voice Agents for Roofing Companies | TrainYourAgent",
      description: "Capture storm damage leads before competitors. AI voice agents that handle call surges, qualify insurance claims, and book inspections 24/7.",
      keywords: ["roofing AI", "roofing answering service", "storm damage leads", "roofing automation"]
    },
    gradient: "from-orange-400 to-red-400",
    accentColor: "orange",
    videoPath: "/videos/industries/roofing-hero.mp4"
  },
  restaurants: {
    id: "restaurants",
    name: "Restaurants",
    slug: "restaurants",
    icon: UtensilsCrossed,
    tagline: "Never miss a reservation or order",
    headline: {
      line1: "Reservations",
      line2: "Orders Taken.",
      line3: "Tables Filled."
    },
    subheadline: "AI that handles reservations, takes orders, and manages catering inquiries—even during dinner rush when every call matters.",
    stats: [
      { value: 40, suffix: "%", label: "Phone Revenue" },
      { value: 25, suffix: "%", label: "Unanswered" },
      { value: 4, suffix: "K", label: "Daily Lost" }
    ],
    problems: [
      { stat: "30-40%", label: "Phone Revenue", description: "of takeout revenue comes from phone orders" },
      { stat: "25%", label: "Missed Calls", description: "during peak dining hours" },
      { stat: "$4K+", label: "Daily Loss", description: "from missed calls during dinner rush" }
    ],
    seo: {
      title: "AI Voice Agents for Restaurants | TrainYourAgent",
      description: "Never miss a reservation or order again. AI voice agents that handle phone orders, reservations, and catering inquiries 24/7.",
      keywords: ["restaurant AI", "restaurant answering service", "reservation AI", "restaurant automation"]
    },
    gradient: "from-rose-400 to-pink-400",
    accentColor: "rose",
    videoPath: "/videos/industries/restaurants-hero.mp4"
  },
  bars: {
    id: "bars",
    name: "Bars & Nightclubs",
    slug: "bars-nightclubs",
    icon: Wine,
    tagline: "VIP reservations made simple",
    headline: {
      line1: "VIP Tables",
      line2: "Events Booked.",
      line3: "Revenue Flowing."
    },
    subheadline: "AI that handles VIP reservations, event inquiries, and bottle service bookings—when the music's too loud to hear.",
    stats: [
      { value: 60, suffix: "%", label: "VIP Revenue" },
      { value: 35, suffix: "%", label: "Missed Calls" },
      { value: 2, suffix: "K", label: "Per Booking" }
    ],
    problems: [
      { stat: "60%", label: "VIP Revenue", description: "comes from table and bottle service" },
      { stat: "35%", label: "Missed Calls", description: "during peak nightlife hours" },
      { stat: "$2K+", label: "Per Booking", description: "average VIP table value lost" }
    ],
    seo: {
      title: "AI Voice Agents for Bars & Nightclubs | TrainYourAgent",
      description: "Capture VIP reservations 24/7. AI voice agents that handle bottle service, event bookings, and party inquiries when it's too loud to answer.",
      keywords: ["nightclub AI", "bar answering service", "VIP reservation AI", "nightlife automation"]
    },
    gradient: "from-fuchsia-400 to-purple-400",
    accentColor: "fuchsia",
    videoPath: "/videos/industries/bars-hero.mp4"
  },
  spas: {
    id: "spas",
    name: "Spas & Wellness",
    slug: "spas",
    icon: Sparkles,
    tagline: "Book treatments 24/7",
    headline: {
      line1: "Appointments",
      line2: "Booked Seamlessly.",
      line3: "Clients Relaxed."
    },
    subheadline: "AI that handles appointment booking, package inquiries, and membership questions—matching the serene experience you provide.",
    stats: [
      { value: 40, suffix: "%", label: "After-Hours" },
      { value: 28, suffix: "%", label: "No-Shows" },
      { value: 85, suffix: "%", label: "Retention" }
    ],
    problems: [
      { stat: "40%", label: "After-Hours", description: "of booking requests come outside business hours" },
      { stat: "28%", label: "No-Shows", description: "average appointment no-show rate" },
      { stat: "$95K", label: "Lost Revenue", description: "from no-shows and missed bookings" }
    ],
    seo: {
      title: "AI Voice Agents for Spas & Wellness | TrainYourAgent",
      description: "Book spa appointments 24/7 with AI. Voice agents that handle treatment bookings, package inquiries, and membership questions seamlessly.",
      keywords: ["spa AI", "wellness answering service", "spa booking AI", "Mindbody integration"]
    },
    gradient: "from-pink-400 to-rose-400",
    accentColor: "pink",
    videoPath: "/videos/industries/spas-hero.mp4"
  },
  hotels: {
    id: "hotels",
    name: "Hotels & Hospitality",
    slug: "hotels",
    icon: Hotel,
    tagline: "Concierge service at scale",
    headline: {
      line1: "Reservations",
      line2: "Guest Requests.",
      line3: "5-Star Service."
    },
    subheadline: "AI concierge that handles reservations, guest requests, and amenity inquiries—delivering luxury service around the clock.",
    stats: [
      { value: 24, suffix: "/7", label: "Concierge" },
      { value: 45, suffix: "%", label: "Direct Bookings" },
      { value: 92, suffix: "%", label: "Guest Satisfaction" }
    ],
    problems: [
      { stat: "45%", label: "Direct Bookings", description: "lost to OTAs due to slow response" },
      { stat: "68%", label: "Guest Requests", description: "come outside front desk hours" },
      { stat: "$150K", label: "OTA Commissions", description: "paid annually that could be saved" }
    ],
    seo: {
      title: "AI Voice Agents for Hotels | TrainYourAgent",
      description: "AI concierge service for hotels. Handle reservations, guest requests, and amenity inquiries 24/7 with luxury-level service.",
      keywords: ["hotel AI", "hospitality answering service", "hotel concierge AI", "hotel automation"]
    },
    gradient: "from-amber-400 to-orange-400",
    accentColor: "amber",
    videoPath: "/videos/industries/hotels-hero.mp4"
  },
  automotive: {
    id: "automotive",
    name: "Automotive",
    slug: "automotive",
    icon: Car,
    tagline: "Book service appointments instantly",
    headline: {
      line1: "Service Calls",
      line2: "Sales Inquiries.",
      line3: "Appointments Booked."
    },
    subheadline: "AI that handles service scheduling, sales inquiries, and parts questions—keeping your bays full and showroom busy.",
    stats: [
      { value: 35, suffix: "%", label: "More Appointments" },
      { value: 78, suffix: "%", label: "First Response Wins" },
      { value: 15, suffix: " min", label: "Avg Wait Eliminated" }
    ],
    problems: [
      { stat: "78%", label: "First Response", description: "of buyers choose the first dealer to respond" },
      { stat: "35%", label: "Missed Calls", description: "during peak service hours" },
      { stat: "$125K", label: "Lost Revenue", description: "from missed service and sales opportunities" }
    ],
    seo: {
      title: "AI Voice Agents for Automotive Dealerships | TrainYourAgent",
      description: "Never miss a service appointment or sales lead. AI voice agents for auto dealers that book appointments and capture leads 24/7.",
      keywords: ["automotive AI", "car dealership answering service", "auto service AI", "DMS integration"]
    },
    gradient: "from-slate-400 to-zinc-400",
    accentColor: "slate",
    videoPath: "/videos/industries/automotive-hero.mp4"
  },
  "real-estate": {
    id: "real-estate",
    name: "Real Estate",
    slug: "real-estate",
    icon: Home,
    tagline: "Capture every buyer and seller",
    headline: {
      line1: "Buyer Calls",
      line2: "Listings Inquiries.",
      line3: "Deals Closed."
    },
    subheadline: "AI that qualifies buyers, schedules showings, and captures seller leads—when timing is everything in real estate.",
    stats: [
      { value: 35, suffix: "%", label: "After-Hours Leads" },
      { value: 78, suffix: "%", label: "First Response" },
      { value: 5, suffix: " min", label: "To Qualify" }
    ],
    problems: [
      { stat: "78%", label: "First Agent Wins", description: "buyers work with the first agent to respond" },
      { stat: "35%", label: "After-Hours", description: "of buyer inquiries come outside business hours" },
      { stat: "$15K", label: "Per Lead Lost", description: "average commission value missed" }
    ],
    seo: {
      title: "AI Voice Agents for Real Estate | TrainYourAgent",
      description: "Capture every buyer and seller lead 24/7. AI voice agents that qualify leads, schedule showings, and never miss an opportunity.",
      keywords: ["real estate AI", "realtor answering service", "real estate lead capture", "MLS integration"]
    },
    gradient: "from-green-400 to-emerald-400",
    accentColor: "green",
    videoPath: "/videos/industries/real-estate-hero.mp4"
  },
  solar: {
    id: "solar",
    name: "Solar",
    slug: "solar",
    icon: Sun,
    tagline: "Qualify solar leads 24/7",
    headline: {
      line1: "Solar Leads",
      line2: "Qualified Instantly.",
      line3: "Installations Booked."
    },
    subheadline: "AI that qualifies homeowners, assesses roof suitability, and schedules consultations—capturing leads while interest is hot.",
    stats: [
      { value: 45, suffix: "%", label: "Lead Qualification" },
      { value: 25, suffix: "%", label: "More Conversions" },
      { value: 3, suffix: " days", label: "To Consultation" }
    ],
    problems: [
      { stat: "45%", label: "Unqualified Leads", description: "waste sales team time" },
      { stat: "72", label: "Hour Window", description: "before leads go cold" },
      { stat: "$2,500", label: "Per Lead Cost", description: "makes every inquiry valuable" }
    ],
    seo: {
      title: "AI Voice Agents for Solar Companies | TrainYourAgent",
      description: "Qualify solar leads 24/7 with AI. Voice agents that assess homeowner fit, schedule consultations, and never let a lead go cold.",
      keywords: ["solar AI", "solar lead qualification", "solar answering service", "solar automation"]
    },
    gradient: "from-yellow-400 to-amber-400",
    accentColor: "yellow",
    videoPath: "/videos/industries/solar-hero.mp4"
  },
  logistics: {
    id: "logistics",
    name: "Logistics",
    slug: "logistics",
    icon: Truck,
    tagline: "Track shipments and dispatch 24/7",
    headline: {
      line1: "Shipment Calls",
      line2: "Dispatch Requests.",
      line3: "Deliveries On Time."
    },
    subheadline: "AI that handles tracking inquiries, dispatch requests, and customer updates—keeping freight moving around the clock.",
    stats: [
      { value: 40, suffix: "%", label: "Call Reduction" },
      { value: 24, suffix: "/7", label: "Dispatch" },
      { value: 15, suffix: " hrs", label: "Saved Weekly" }
    ],
    problems: [
      { stat: "40%", label: "Tracking Calls", description: "of calls are 'where's my shipment?'" },
      { stat: "68%", label: "After-Hours", description: "of urgent dispatch needs happen overnight" },
      { stat: "$85K", label: "Labor Costs", description: "annual savings with AI automation" }
    ],
    seo: {
      title: "AI Voice Agents for Logistics | TrainYourAgent",
      description: "Handle tracking inquiries and dispatch requests 24/7. AI voice agents for freight, trucking, and logistics companies.",
      keywords: ["logistics AI", "freight answering service", "trucking AI", "dispatch automation"]
    },
    gradient: "from-indigo-400 to-blue-400",
    accentColor: "indigo",
    videoPath: "/videos/industries/logistics-hero.mp4"
  },
  gym: {
    id: "gym",
    name: "Gym & Fitness",
    slug: "gym",
    icon: Dumbbell,
    tagline: "Convert members 24/7",
    headline: {
      line1: "Member Calls",
      line2: "Class Bookings.",
      line3: "Retention Maximized."
    },
    subheadline: "AI that handles membership inquiries, books classes, and schedules tours—converting prospects while your trainers focus on clients.",
    stats: [
      { value: 31, suffix: "%", label: "Annual Churn" },
      { value: 80, suffix: "%", label: "First-Time Drop" },
      { value: 30, suffix: "%", label: "No-Shows" }
    ],
    problems: [
      { stat: "31%", label: "Annual Churn", description: "average gym membership churn rate" },
      { stat: "80%", label: "First-Time Drop", description: "of first-time visitors never return" },
      { stat: "$150K", label: "Lost Revenue", description: "from poor lead follow-up and churn" }
    ],
    seo: {
      title: "AI Voice Agents for Gyms & Fitness | TrainYourAgent",
      description: "Convert more gym members 24/7. AI voice agents that handle inquiries, book classes, and schedule tours. Mindbody integrated.",
      keywords: ["gym AI", "fitness answering service", "gym membership AI", "Mindbody integration"]
    },
    gradient: "from-red-400 to-orange-400",
    accentColor: "red",
    videoPath: "/videos/industries/gym-hero.mp4"
  }
};
