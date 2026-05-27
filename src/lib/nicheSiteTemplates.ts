// src/lib/nicheSiteTemplates.ts — v180
//
// The "free website" template engine. Each niche is a config object that
// renders a complete premium one-page site via NicheSiteTemplate.tsx.
// Hand a prospect /template/<niche>?company=Their%20Co and they see THEIR
// business with a working-looking voice agent + chatbot demo, in our brand.
// Swap the name + a couple fields = instant pitch asset. Zero code per deal.
//
// Brand is locked to the TYA system (cream/navy/Playfair). Each niche carries
// its own accent so sites feel distinct without leaving the brand.

export type NicheChatExchange = { from: "customer" | "agent"; text: string };

export type NicheSite = {
  id: string;
  niche: string;            // display label, e.g. "Cleaning Service"
  emoji: string;            // light visual marker for the gallery
  accent: string;           // hex accent (stays in-brand family)
  defaultCompany: string;   // placeholder business name
  city: string;             // placeholder city
  // hero
  heroLead: string;         // bold sans first clause
  heroItalic: string;       // Playfair italic accent clause
  subhead: string;          // one-line value prop
  // proof chips under hero
  chips: string[];
  // services grid (4)
  services: { title: string; body: string }[];
  // the missed-call pain stat
  painStat: string;
  painLabel: string;
  // voice agent demo
  voiceGreeting: string;    // what the agent says on pickup
  voiceTryLines: string[];  // sample caller prompts
  // chatbot demo
  chat: NicheChatExchange[];
  // pricing line
  priceLine: string;
};

export const NICHE_SITES: NicheSite[] = [
  {
    id: "cleaning",
    niche: "Cleaning Service",
    emoji: "🧽",
    accent: "#0E7C7B",
    defaultCompany: "SparkleHouse Cleaning",
    city: "Tampa",
    heroLead: "Every booking request answered",
    heroItalic: "before your competitor picks up.",
    subhead: "Your AI receptionist books recurring cleans, quotes square footage, and fills cancellations — 24/7, on your existing number.",
    chips: ["Recurring bookings", "Instant quotes", "Cancellation fills", "Spanish + English"],
    services: [
      { title: "Residential cleaning", body: "Weekly, biweekly, monthly recurring plans booked and confirmed automatically." },
      { title: "Move-in / move-out", body: "Square-footage quoted on the call, deposit link texted before you hang up." },
      { title: "Commercial contracts", body: "After-hours office and retail cleans scheduled around your crews." },
      { title: "Deep & post-construction", body: "Add-on scoping, photos requested, same-day estimate sent." },
    ],
    painStat: "1 in 3",
    painLabel: "cleaning leads call a competitor when you don't answer",
    voiceGreeting: "Thanks for calling SparkleHouse Cleaning — this is your assistant. Are you looking for a recurring clean, a one-time deep clean, or a move-out?",
    voiceTryLines: ["“I need a 3-bedroom cleaned before Friday.”", "“How much for biweekly?”", "“Do you do move-out cleans?”"],
    chat: [
      { from: "customer", text: "Do you have anything this weekend?" },
      { from: "agent", text: "We do — Saturday 9am or Sunday 1pm are open for a standard clean. How many bedrooms and bathrooms?" },
      { from: "customer", text: "3 bed 2 bath" },
      { from: "agent", text: "That's $180 for a standard clean. Want me to lock Saturday 9am and text you a confirmation?" },
    ],
    priceLine: "Live on your phone line in 7 days · from $1,997/mo",
  },
  {
    id: "laundromat",
    niche: "Laundromat / Wash & Fold",
    emoji: "🧺",
    accent: "#2563A8",
    defaultCompany: "FreshFold Laundry",
    city: "Tampa",
    heroLead: "Pickup, delivery, and wash-&-fold orders",
    heroItalic: "taken while you run the floor.",
    subhead: "An AI line that schedules pickups, quotes by the pound, and answers hours-and-machines questions so your staff never stops folding.",
    chips: ["Pickup scheduling", "Per-pound quotes", "Route windows", "Loyalty signups"],
    services: [
      { title: "Wash & fold", body: "Per-pound orders booked with pickup and drop-off windows confirmed by text." },
      { title: "Pickup & delivery", body: "Address captured, route window assigned, customer notified automatically." },
      { title: "Commercial laundry", body: "Restaurants, gyms, and salons set up on recurring contracts." },
      { title: "Self-serve support", body: "Hours, machine availability, and card-reload questions answered 24/7." },
    ],
    painStat: "62%",
    painLabel: "of pickup requests come outside staffed hours",
    voiceGreeting: "Thanks for calling FreshFold — want to schedule a wash-and-fold pickup, or check on an order?",
    voiceTryLines: ["“Can you pick up tomorrow morning?”", "“How much per pound?”", "“Are you open right now?”"],
    chat: [
      { from: "customer", text: "Do you pick up in Seminole Heights?" },
      { from: "agent", text: "We do! Pickups there run 8–10am. About how many pounds, roughly?" },
      { from: "customer", text: "Maybe 20 lbs" },
      { from: "agent", text: "That's around $35 wash-and-fold. Want tomorrow's 8–10 window? I'll text you the confirmation." },
    ],
    priceLine: "Live on your phone line in 7 days · from $1,997/mo",
  },
  {
    id: "hvac",
    niche: "HVAC",
    emoji: "❄️",
    accent: "#185FA5",
    defaultCompany: "Bay Area Air & Heat",
    city: "Tampa",
    heroLead: "Every after-hours emergency call",
    heroItalic: "becomes a booked job.",
    subhead: "Your agent triages emergency vs. routine, quotes the dispatch fee, and books the tech truck — even at 2am during a heat wave.",
    chips: ["Emergency triage", "Dispatch quoting", "Service booking", "Maintenance plans"],
    services: [
      { title: "Emergency dispatch", body: "After-hours calls triaged, fee quoted, and the on-call tech booked instantly." },
      { title: "Service scheduling", body: "Tune-ups and repairs slotted into your calendar with the right window." },
      { title: "Maintenance plans", body: "Recurring memberships sold and renewed on the call." },
      { title: "Install quotes", body: "System replacement leads captured and routed to your closer same day." },
    ],
    painStat: "$180K",
    painLabel: "average annual revenue lost to missed HVAC calls",
    voiceGreeting: "Thanks for calling Bay Area Air & Heat — is this an emergency, or are you scheduling routine service?",
    voiceTryLines: ["“My AC died and it's 95 degrees.”", "“What's your dispatch fee?”", "“Can someone come tomorrow?”"],
    chat: [
      { from: "customer", text: "AC stopped working, house is getting hot" },
      { from: "agent", text: "Sorry to hear that — is anyone home medically vulnerable, or pets in the heat?" },
      { from: "customer", text: "Just us, but it's bad" },
      { from: "agent", text: "I can get a tech out today between 2–4pm. Dispatch is $89, applied to the repair. Want me to book it?" },
    ],
    priceLine: "Live on your phone line in 14 days · from $1,997/mo",
  },
  {
    id: "dental",
    niche: "Dental Practice",
    emoji: "🦷",
    accent: "#0C8A6E",
    defaultCompany: "Bayshore Family Dental",
    city: "Tampa",
    heroLead: "New-patient calls booked",
    heroItalic: "without pulling your front desk away.",
    subhead: "An AI receptionist that books cleanings, screens insurance, handles reschedules, and fills last-minute cancellations.",
    chips: ["New-patient intake", "Insurance screening", "Reschedules", "Recall reminders"],
    services: [
      { title: "New-patient booking", body: "Insurance captured, first cleaning scheduled, paperwork link texted." },
      { title: "Cancellation fills", body: "Open slots offered to your waitlist automatically the moment they appear." },
      { title: "Recall & hygiene", body: "Six-month recall calls handled so chairs stay full." },
      { title: "After-hours triage", body: "Emergencies routed, everything else booked for the next open slot." },
    ],
    painStat: "35%",
    painLabel: "of new-patient calls go to voicemail and never call back",
    voiceGreeting: "Thank you for calling Bayshore Family Dental — are you a new patient, or scheduling a follow-up?",
    voiceTryLines: ["“I need a cleaning, I'm a new patient.”", "“Do you take Delta Dental?”", "“Can I move my appointment?”"],
    chat: [
      { from: "customer", text: "Are you taking new patients?" },
      { from: "agent", text: "We are! Do you have dental insurance you'd like me to note, or are you paying out of pocket?" },
      { from: "customer", text: "I have Cigna" },
      { from: "agent", text: "Perfect, we're in-network. I have next Tuesday 10am or Thursday 2pm for your first cleaning — which works?" },
    ],
    priceLine: "Live on your phone line in 14 days · HIPAA BAA included",
  },
  {
    id: "salon",
    niche: "Salon & Spa",
    emoji: "💇",
    accent: "#A24598",
    defaultCompany: "Lume Salon & Spa",
    city: "Tampa",
    heroLead: "Every appointment request booked",
    heroItalic: "while your stylists stay with clients.",
    subhead: "Your agent books color, cuts, and treatments, quotes by service, and fills late cancellations from your waitlist.",
    chips: ["Service booking", "Stylist matching", "Waitlist fills", "Deposit links"],
    services: [
      { title: "Appointment booking", body: "Color, cut, and treatment slots booked to the right stylist's calendar." },
      { title: "Deposit collection", body: "No-show protection — deposit link texted before the slot is held." },
      { title: "Waitlist fills", body: "Cancellations instantly offered to waiting clients." },
      { title: "Package upsells", body: "Add-ons and membership packages offered naturally on the call." },
    ],
    painStat: "1 in 4",
    painLabel: "booking calls come in while every chair is busy",
    voiceGreeting: "Thanks for calling Lume Salon & Spa — what service can I book for you today?",
    voiceTryLines: ["“I want a balayage next week.”", "“How much for a cut and color?”", "“Do you have anything Saturday?”"],
    chat: [
      { from: "customer", text: "Do you have color availability this week?" },
      { from: "agent", text: "Yes! Are you thinking full color, highlights, or a balayage?" },
      { from: "customer", text: "Balayage" },
      { from: "agent", text: "With Maya I have Thursday 1pm or Friday 11am. It's $185 and I'll text a $40 deposit link to hold it — which day?" },
    ],
    priceLine: "Live on your phone line in 7 days · from $1,997/mo",
  },
  {
    id: "auto",
    niche: "Auto Repair",
    emoji: "🔧",
    accent: "#B45309",
    defaultCompany: "Gulf Coast Auto",
    city: "Tampa",
    heroLead: "Service-bay appointments booked",
    heroItalic: "without a tech wiping their hands to grab the phone.",
    subhead: "An AI line that books diagnostics, quotes common jobs, and schedules around your bay capacity.",
    chips: ["Bay scheduling", "Job quoting", "Status updates", "Tow coordination"],
    services: [
      { title: "Appointment booking", body: "Diagnostics and repairs slotted around real bay availability." },
      { title: "Common-job quotes", body: "Brakes, oil, tires quoted on the call with parts lead-time noted." },
      { title: "Status callbacks", body: "Customers get proactive updates instead of calling to check in." },
      { title: "Tow & after-hours", body: "Breakdown calls captured overnight and booked for the morning." },
    ],
    painStat: "48%",
    painLabel: "of repair calls hit voicemail during busy bay hours",
    voiceGreeting: "Thanks for calling Gulf Coast Auto — are you booking service, or checking on a vehicle that's with us?",
    voiceTryLines: ["“My check-engine light is on.”", "“How much for front brakes?”", "“Can I drop off tomorrow?”"],
    chat: [
      { from: "customer", text: "Need a brake job, how much?" },
      { from: "agent", text: "Front pads and rotors on most cars run $280–$340. What's the year, make, and model?" },
      { from: "customer", text: "2018 Honda Accord" },
      { from: "agent", text: "That's $295 out the door. I can get you a bay tomorrow at 8am or 1pm — which works?" },
    ],
    priceLine: "Live on your phone line in 10 days · from $1,997/mo",
  },
  {
    id: "landscaping",
    niche: "Landscaping & Lawn",
    emoji: "🌳",
    accent: "#3F8A2E",
    defaultCompany: "EverGreen Outdoor",
    city: "Tampa",
    heroLead: "Estimate requests captured",
    heroItalic: "before the crew's even off the truck.",
    subhead: "Your agent books estimates, sells recurring maintenance, and routes by neighborhood so your trucks stay efficient.",
    chips: ["Estimate booking", "Recurring plans", "Route batching", "Seasonal upsells"],
    services: [
      { title: "Estimate scheduling", body: "Property address captured, walkthrough booked, photos requested up front." },
      { title: "Recurring maintenance", body: "Weekly and biweekly mowing plans sold and confirmed on the call." },
      { title: "Project quoting", body: "Sod, mulch, and hardscape leads scoped and routed to your estimator." },
      { title: "Seasonal pushes", body: "Cleanups and irrigation checks offered when the season turns." },
    ],
    painStat: "$140K",
    painLabel: "average revenue lost yearly to unanswered estimate calls",
    voiceGreeting: "Thanks for calling EverGreen Outdoor — are you looking for recurring lawn care, or a one-time project?",
    voiceTryLines: ["“I need weekly mowing.”", "“Can you quote sod install?”", "“How soon can someone look at my yard?”"],
    chat: [
      { from: "customer", text: "Do you do weekly mowing in Carrollwood?" },
      { from: "agent", text: "We do! For an average quarter-acre lot weekly service is about $140/mo. What's the address so I can confirm the route day?" },
      { from: "customer", text: "It's a corner lot, a bit bigger" },
      { from: "agent", text: "Got it — I'll book a quick walkthrough Wednesday 9am and lock your weekly slot. Sound good?" },
    ],
    priceLine: "Live on your phone line in 7 days · from $1,997/mo",
  },
  {
    id: "plumbing",
    niche: "Plumbing",
    emoji: "🚰",
    accent: "#1E6FB8",
    defaultCompany: "TrueFlow Plumbing",
    city: "Tampa",
    heroLead: "Every burst-pipe call answered",
    heroItalic: "and dispatched in under a minute.",
    subhead: "An AI line that triages emergencies, quotes the trip charge, and books the truck — day or night.",
    chips: ["Emergency dispatch", "Trip-fee quoting", "Job scheduling", "Photo intake"],
    services: [
      { title: "Emergency response", body: "Leaks and backups triaged, fee quoted, nearest tech dispatched." },
      { title: "Scheduled repairs", body: "Water heaters, fixtures, and re-pipes booked to your calendar." },
      { title: "Quote-on-call", body: "Common jobs priced instantly; photos requested to firm it up." },
      { title: "After-hours capture", body: "Overnight calls booked for first thing instead of lost to voicemail." },
    ],
    painStat: "67%",
    painLabel: "of plumbing emergencies happen outside business hours",
    voiceGreeting: "Thanks for calling TrueFlow Plumbing — is this an active leak or emergency, or are you scheduling a repair?",
    voiceTryLines: ["“My water heater is leaking everywhere.”", "“What's your trip charge?”", "“Can you come tonight?”"],
    chat: [
      { from: "customer", text: "Water heater is leaking, kind of bad" },
      { from: "agent", text: "Let's get someone out. Is the water shut off at the valve, or still running?" },
      { from: "customer", text: "Still running" },
      { from: "agent", text: "Turn the valve clockwise to stop it — I'm dispatching a tech now, ETA 45 min, $99 trip applied to the repair." },
    ],
    priceLine: "Live on your phone line in 10 days · from $1,997/mo",
  },
  {
    id: "restaurant",
    niche: "Restaurant",
    emoji: "🍽️",
    accent: "#C2410C",
    defaultCompany: "Casa Verde Kitchen",
    city: "Tampa",
    heroLead: "Reservations, takeout, and catering",
    heroItalic: "handled without tying up the line.",
    subhead: "Your agent takes reservations, quotes catering, and answers hours-and-menu questions so your hosts stay with guests.",
    chips: ["Reservations", "Takeout orders", "Catering quotes", "Waitlist"],
    services: [
      { title: "Reservations", body: "Party size and time booked straight into your floor plan." },
      { title: "Takeout & pickup", body: "Orders captured and timed; payment link texted ahead." },
      { title: "Catering leads", body: "Event details scoped and routed to your catering manager." },
      { title: "FAQ deflection", body: "Hours, parking, allergens, and menu questions answered 24/7." },
    ],
    painStat: "30%",
    painLabel: "of dinner-rush calls go unanswered",
    voiceGreeting: "Thanks for calling Casa Verde Kitchen — would you like a reservation, takeout, or catering?",
    voiceTryLines: ["“Table for 4 at 7?”", "“Do you cater for 40 people?”", "“What are your hours?”"],
    chat: [
      { from: "customer", text: "Can I get a table for 4 tonight at 7:30?" },
      { from: "agent", text: "Let me check — yes, 7:30 for 4 is open. Any seating preference, patio or inside?" },
      { from: "customer", text: "Patio please" },
      { from: "agent", text: "Done — patio table for 4 at 7:30 under your name. I'll text a confirmation. See you tonight!" },
    ],
    priceLine: "Live on your phone line in 7 days · from $1,997/mo",
  },
  {
    id: "fitness",
    niche: "Gym & Fitness Studio",
    emoji: "🏋️",
    accent: "#7C3AED",
    defaultCompany: "Iron Bay Fitness",
    city: "Tampa",
    heroLead: "Every membership inquiry booked",
    heroItalic: "into a tour before they cool off.",
    subhead: "An AI line that books tours, sells trials, answers class schedules, and handles freeze-and-cancel requests.",
    chips: ["Tour booking", "Trial signups", "Class schedules", "Membership admin"],
    services: [
      { title: "Tour & trial booking", body: "Prospects booked into a tour or free trial the moment they call." },
      { title: "Class scheduling", body: "Spots reserved and waitlists managed across your timetable." },
      { title: "Membership admin", body: "Freezes, upgrades, and cancellations handled by policy, no front-desk time." },
      { title: "Win-back", body: "Lapsed members re-engaged with the right offer automatically." },
    ],
    painStat: "1 in 3",
    painLabel: "membership inquiries never get a callback",
    voiceGreeting: "Thanks for calling Iron Bay Fitness — are you interested in a tour, a free trial, or class info?",
    voiceTryLines: ["“Can I come check out the gym?”", "“Do you have a free trial?”", "“What time is the 6am class?”"],
    chat: [
      { from: "customer", text: "Do you offer a trial?" },
      { from: "agent", text: "We do — a free 3-day pass. Want me to set it up? I'll just need your name and the best number to text the pass to." },
      { from: "customer", text: "Sure, sounds good" },
      { from: "agent", text: "You're all set — pass texted, valid starting tomorrow. Want me to book a quick tour for your first visit?" },
    ],
    priceLine: "Live on your phone line in 7 days · from $1,997/mo",
  },
];

export function getNicheSite(id: string | undefined): NicheSite | undefined {
  if (!id) return undefined;
  return NICHE_SITES.find((n) => n.id === id.toLowerCase());
}
