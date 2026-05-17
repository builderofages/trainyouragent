// src/lib/cities.ts — v47B
// 30 US cities for the /local/{citySlug}/{verticalSlug} programmatic SEO layer.
// Population in approximate thousands (rounded), lat/lng to ~3 decimals so the
// SVG US-map dots land in the right neighborhood. SMB density is a rough 1-10
// score derived from BLS small-business counts per capita + local SaaS signal.
// localFlavor is one honest sentence we use in the page hero subhead.

export type Region = "south" | "west" | "midwest" | "northeast";

export type City = {
  slug: string;
  displayName: string;
  state: string;
  statePostal: string;
  region: Region;
  population: number;
  lat: number;
  lng: number;
  smbDensity: number;
  industries: [string, string, string];
  localFlavor: string;
};

export const CITIES: City[] = [
  { slug: "tampa", displayName: "Tampa", state: "Florida", statePostal: "FL", region: "south", population: 403, lat: 27.951, lng: -82.458, smbDensity: 8, industries: ["healthcare", "hospitality", "professional services"], localFlavor: "Tampa is one of the fastest-growing SMB metros in the Southeast, with a heavy mix of healthcare practices, hospitality groups, and home-services operators." },
  { slug: "orlando", displayName: "Orlando", state: "Florida", statePostal: "FL", region: "south", population: 316, lat: 28.538, lng: -81.379, smbDensity: 8, industries: ["hospitality", "tourism", "real estate"], localFlavor: "Orlando lives and dies by the phone, with tourism, vacation rentals, and hospitality stacks sending a constant flood of inbound calls the front desk can never fully cover." },
  { slug: "miami", displayName: "Miami", state: "Florida", statePostal: "FL", region: "south", population: 449, lat: 25.762, lng: -80.192, smbDensity: 9, industries: ["real estate", "logistics", "professional services"], localFlavor: "Miami runs hot 24/7. Real estate brokers, importers, and bilingual service businesses need front-desk coverage that doesn't sleep and speaks both English and Spanish." },
  { slug: "jacksonville", displayName: "Jacksonville", state: "Florida", statePostal: "FL", region: "south", population: 971, lat: 30.332, lng: -81.656, smbDensity: 7, industries: ["logistics", "healthcare", "financial services"], localFlavor: "Jacksonville is a working port city. Logistics shops, regional health systems, and back-office finance teams here measure success in calls answered and tickets closed." },
  { slug: "atlanta", displayName: "Atlanta", state: "Georgia", statePostal: "GA", region: "south", population: 499, lat: 33.749, lng: -84.388, smbDensity: 9, industries: ["logistics", "media", "professional services"], localFlavor: "Atlanta sits at the crossroads of the Southeast. Distribution centers, marketing shops, and multi-location service brands all run on speed-to-lead and after-hours coverage." },
  { slug: "charlotte", displayName: "Charlotte", state: "North Carolina", statePostal: "NC", region: "south", population: 897, lat: 35.227, lng: -80.843, smbDensity: 8, industries: ["financial services", "real estate", "energy"], localFlavor: "Charlotte's banking and energy backbone props up a long tail of professional-services SMBs that need enterprise-quality phone and chat without the enterprise headcount." },
  { slug: "raleigh", displayName: "Raleigh", state: "North Carolina", statePostal: "NC", region: "south", population: 469, lat: 35.779, lng: -78.638, smbDensity: 8, industries: ["biotech", "software", "healthcare"], localFlavor: "Raleigh runs on the Research Triangle. Biotech labs, software startups, and group practices here expect modern tooling and integrate-anything workflows by default." },
  { slug: "nashville", displayName: "Nashville", state: "Tennessee", statePostal: "TN", region: "south", population: 689, lat: 36.162, lng: -86.781, smbDensity: 8, industries: ["healthcare", "music & media", "hospitality"], localFlavor: "Nashville's HCA-anchored healthcare ecosystem and booming hospitality scene push small businesses to staff up, or finally automate the front desk." },
  { slug: "austin", displayName: "Austin", state: "Texas", statePostal: "TX", region: "south", population: 974, lat: 30.267, lng: -97.743, smbDensity: 9, industries: ["software", "real estate", "hospitality"], localFlavor: "Austin SMBs are early adopters by nature. Agencies, software vendors, and restaurant groups here will try a new AI receptionist before a competing market even hears of one." },
  { slug: "dallas", displayName: "Dallas", state: "Texas", statePostal: "TX", region: "south", population: 1304, lat: 32.776, lng: -96.797, smbDensity: 9, industries: ["financial services", "logistics", "telecom"], localFlavor: "Dallas-Fort Worth is one of the densest SMB metros in the country. Operators here run multi-location businesses and need automation that scales across teams, not just one phone line." },
  { slug: "houston", displayName: "Houston", state: "Texas", statePostal: "TX", region: "south", population: 2304, lat: 29.760, lng: -95.369, smbDensity: 9, industries: ["energy", "healthcare", "logistics"], localFlavor: "Houston SMBs sit downstream of energy, the Texas Medical Center, and the port. Phone volume is brutal, and most front desks have been begging for help for years." },
  { slug: "san-antonio", displayName: "San Antonio", state: "Texas", statePostal: "TX", region: "south", population: 1495, lat: 29.424, lng: -98.494, smbDensity: 7, industries: ["healthcare", "tourism", "military services"], localFlavor: "San Antonio's healthcare networks and tourism corridor along the River Walk drive a steady book of inbound calls that small operators struggle to keep up with." },
  { slug: "phoenix", displayName: "Phoenix", state: "Arizona", statePostal: "AZ", region: "west", population: 1608, lat: 33.448, lng: -112.074, smbDensity: 8, industries: ["real estate", "healthcare", "construction"], localFlavor: "Phoenix's relentless growth pulls in real-estate brokers, contractors, and clinics faster than they can hire. Automating intake is the only way most of them keep up." },
  { slug: "las-vegas", displayName: "Las Vegas", state: "Nevada", statePostal: "NV", region: "west", population: 660, lat: 36.169, lng: -115.139, smbDensity: 7, industries: ["hospitality", "events", "real estate"], localFlavor: "Las Vegas is a 24/7 phone city. Hospitality, events, and a growing real-estate market mean someone is always calling, and overnight voicemail is a losing strategy." },
  { slug: "denver", displayName: "Denver", state: "Colorado", statePostal: "CO", region: "west", population: 716, lat: 39.739, lng: -104.990, smbDensity: 8, industries: ["energy", "outdoor & retail", "software"], localFlavor: "Denver's mix of outdoor-industry retail, energy services, and a growing software bench makes it a sweet spot for AI tooling that has to feel as polished as the customer." },
  { slug: "salt-lake-city", displayName: "Salt Lake City", state: "Utah", statePostal: "UT", region: "west", population: 200, lat: 40.760, lng: -111.891, smbDensity: 8, industries: ["software", "outdoor recreation", "financial services"], localFlavor: "Salt Lake City's Silicon-Slopes ecosystem has trained operators to expect great tooling, and to switch fast when something better shows up." },
  { slug: "boise", displayName: "Boise", state: "Idaho", statePostal: "ID", region: "west", population: 235, lat: 43.615, lng: -116.202, smbDensity: 7, industries: ["agriculture", "construction", "healthcare"], localFlavor: "Boise's small-business base is growing on the back of inbound migration. Local contractors and clinics are getting buried in calls they never used to see." },
  { slug: "portland", displayName: "Portland", state: "Oregon", statePostal: "OR", region: "west", population: 652, lat: 45.515, lng: -122.679, smbDensity: 7, industries: ["food & beverage", "outdoor & retail", "software"], localFlavor: "Portland's small-batch food, beverage, and retail scene leans heavy on customer touch. Most owners just want a friendly automated layer that doesn't sound corporate." },
  { slug: "seattle", displayName: "Seattle", state: "Washington", statePostal: "WA", region: "west", population: 749, lat: 47.606, lng: -122.332, smbDensity: 9, industries: ["software", "biotech", "logistics"], localFlavor: "Seattle SMBs sell into a buyer who expects API-grade tooling. Anything you put on the front desk has to integrate, log, and behave itself." },
  { slug: "san-diego", displayName: "San Diego", state: "California", statePostal: "CA", region: "west", population: 1388, lat: 32.715, lng: -117.161, smbDensity: 8, industries: ["biotech", "tourism", "defense"], localFlavor: "San Diego's biotech corridor and year-round tourism keep front desks slammed. The businesses here are mature enough to want real automation, not toy chatbots." },
  { slug: "sacramento", displayName: "Sacramento", state: "California", statePostal: "CA", region: "west", population: 525, lat: 38.582, lng: -121.494, smbDensity: 7, industries: ["government services", "healthcare", "agriculture"], localFlavor: "Sacramento's mix of government-adjacent SMBs and regional health groups has made operators allergic to anything that can't pass a basic compliance review." },
  { slug: "minneapolis", displayName: "Minneapolis", state: "Minnesota", statePostal: "MN", region: "midwest", population: 429, lat: 44.978, lng: -93.265, smbDensity: 8, industries: ["healthcare", "financial services", "manufacturing"], localFlavor: "Minneapolis runs on a deep bench of medical-device, financial-services, and mid-market manufacturing SMBs. They want quiet reliability, not flashy demos." },
  { slug: "indianapolis", displayName: "Indianapolis", state: "Indiana", statePostal: "IN", region: "midwest", population: 880, lat: 39.768, lng: -86.158, smbDensity: 7, industries: ["logistics", "healthcare", "manufacturing"], localFlavor: "Indianapolis sits in the middle of national logistics lanes. The SMBs here pick up the phone for a living and notice the moment they stop missing calls." },
  { slug: "columbus", displayName: "Columbus", state: "Ohio", statePostal: "OH", region: "midwest", population: 905, lat: 39.961, lng: -82.999, smbDensity: 7, industries: ["insurance", "logistics", "healthcare"], localFlavor: "Columbus's insurance and logistics anchors have spilled out a long tail of B2B service shops that hit a hiring wall every January and start looking at AI." },
  { slug: "cleveland", displayName: "Cleveland", state: "Ohio", statePostal: "OH", region: "midwest", population: 372, lat: 41.499, lng: -81.694, smbDensity: 6, industries: ["healthcare", "manufacturing", "financial services"], localFlavor: "Cleveland's Clinic-driven healthcare scene and old-line manufacturing base make for skeptical buyers. They want references and a Tampa-style straight pitch." },
  { slug: "pittsburgh", displayName: "Pittsburgh", state: "Pennsylvania", statePostal: "PA", region: "northeast", population: 303, lat: 40.440, lng: -79.996, smbDensity: 6, industries: ["healthcare", "robotics", "education"], localFlavor: "Pittsburgh's UPMC-anchored health system and CMU-fed robotics scene have trained local SMBs to expect substance over polish." },
  { slug: "philadelphia", displayName: "Philadelphia", state: "Pennsylvania", statePostal: "PA", region: "northeast", population: 1576, lat: 39.953, lng: -75.165, smbDensity: 8, industries: ["healthcare", "education", "professional services"], localFlavor: "Philadelphia is a dense, neighborhood-by-neighborhood SMB city. Most shops here lose calls during lunch and never know it." },
  { slug: "boston", displayName: "Boston", state: "Massachusetts", statePostal: "MA", region: "northeast", population: 654, lat: 42.360, lng: -71.058, smbDensity: 9, industries: ["biotech", "education", "financial services"], localFlavor: "Boston buyers vet tooling like a thesis. Biotech, edu, and finance SMBs here will read the security docs before they take the meeting." },
  { slug: "new-york", displayName: "New York", state: "New York", statePostal: "NY", region: "northeast", population: 8336, lat: 40.713, lng: -74.006, smbDensity: 10, industries: ["financial services", "media", "hospitality"], localFlavor: "New York is the deepest SMB metro in the country. Speed-to-lead is everything, and the businesses that automate intake first eat the rest of the borough's lunch." },
  { slug: "chicago", displayName: "Chicago", state: "Illinois", statePostal: "IL", region: "midwest", population: 2664, lat: 41.878, lng: -87.630, smbDensity: 9, industries: ["financial services", "logistics", "professional services"], localFlavor: "Chicago's mid-market is enormous. Financial services, logistics, and pro-services SMBs here are big enough to need real automation and small enough to actually buy it." },
];

export const CITY_BY_SLUG: Record<string, City> = Object.fromEntries(CITIES.map((c) => [c.slug, c]));

export function getCity(slug: string | undefined): City | undefined {
  if (!slug) return undefined;
  return CITY_BY_SLUG[slug];
}

export function citiesInRegion(region: Region, exceptSlug?: string): City[] {
  return CITIES.filter((c) => c.region === region && c.slug !== exceptSlug);
}
