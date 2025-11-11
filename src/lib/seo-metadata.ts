export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType: string;
}

export const landingPageSEO: Record<string, SEOMetadata> = {
  hvac: {
    title: "Stop Losing HVAC Emergency Calls | 24/7 AI Receptionist | 3-5 Day Setup",
    description: "Never miss another emergency HVAC call. AI answers 24/7, books appointments, qualifies leads. Most HVAC companies see 40% more booked jobs. Get your free strategy session.",
    keywords: [
      "hvac answering service",
      "hvac ai receptionist",
      "emergency call handling",
      "hvac appointment booking",
      "24/7 hvac service",
      "hvac lead capture",
    ],
    ogImage: "/og-images/hvac.jpg",
    ogType: "website",
  },
  bars: {
    title: "VIP Table Bookings 24/7 | Nightclub AI Receptionist | Never Miss Weekend Rush",
    description: "Capture VIP bookings, bottle service, and guest list requests 24/7. AI handles 300+ calls during weekend rush. Average bars see $50K+ additional monthly revenue.",
    keywords: [
      "nightclub booking system",
      "vip table reservations",
      "bottle service automation",
      "bar answering service",
      "nightclub ai assistant",
      "event booking automation",
    ],
    ogImage: "/og-images/bars-nightclubs.jpg",
    ogType: "website",
  },
  accounting: {
    title: "Tax Season Call Overflow? | AI Receptionist for CPAs | 70% Time Saved",
    description: "Automate client onboarding, document collection, and consultation scheduling. AI qualifies leads 24/7 while you focus on billable work. 5x faster onboarding.",
    keywords: [
      "accounting answering service",
      "cpa virtual receptionist",
      "tax season automation",
      "client onboarding automation",
      "accounting firm ai",
      "document collection automation",
    ],
    ogImage: "/og-images/accounting.jpg",
    ogType: "website",
  },
  roofing: {
    title: "Capture Roofing Leads 24/7 | Emergency AI Receptionist | Never Miss Storm Calls",
    description: "AI answers every emergency roof leak call instantly. Books inspections, sends quotes, handles insurance claims. Average roofers capture 60% more storm leads.",
    keywords: [
      "roofing answering service",
      "roofing lead capture",
      "emergency roof repair calls",
      "roofing appointment scheduling",
      "insurance claim automation",
      "storm damage leads",
    ],
    ogImage: "/og-images/roofing.jpg",
    ogType: "website",
  },
  legal: {
    title: "Capture After-Hours Legal Leads | AI Intake System | HIPAA Compliant",
    description: "AI qualifies potential clients 24/7, routes to the right attorney, handles intake forms. Legal practices see 3x more qualified consultations booked.",
    keywords: [
      "legal answering service",
      "law firm virtual receptionist",
      "client intake automation",
      "legal lead qualification",
      "attorney booking system",
      "confidential call handling",
    ],
    ogImage: "/og-images/legal.jpg",
    ogType: "website",
  },
  healthcare: {
    title: "Patient Appointment Scheduling 24/7 | HIPAA Compliant AI | Reduce No-Shows",
    description: "AI schedules appointments, sends reminders, answers common questions 24/7. Healthcare practices reduce no-shows by 40% and save 20+ hours weekly.",
    keywords: [
      "medical answering service",
      "patient scheduling automation",
      "healthcare virtual receptionist",
      "hipaa compliant ai",
      "appointment reminder system",
      "medical practice automation",
    ],
    ogImage: "/og-images/healthcare.jpg",
    ogType: "website",
  },
  logistics: {
    title: "Shipping Quote Automation | 24/7 Logistics AI | Instant Load Booking",
    description: "AI provides instant shipping quotes, books loads, tracks shipments 24/7. Logistics companies capture 50% more after-hours quotes and reduce phone time by 60%.",
    keywords: [
      "logistics answering service",
      "freight quote automation",
      "shipping booking system",
      "load matching ai",
      "dispatch automation",
      "trucking virtual receptionist",
    ],
    ogImage: "/og-images/logistics.jpg",
    ogType: "website",
  },
  restaurants: {
    title: "Restaurant Reservations 24/7 | AI Host Never Calls In Sick | Reduce Wait Times",
    description: "AI handles reservations, takeout orders, and dietary questions instantly. Restaurants see 30% more bookings and save 15+ hours weekly on phone management.",
    keywords: [
      "restaurant answering service",
      "reservation automation",
      "takeout order system",
      "restaurant virtual host",
      "table booking automation",
      "waitlist management ai",
    ],
    ogImage: "/og-images/restaurants.jpg",
    ogType: "website",
  },
};
