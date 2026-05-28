// api/_lib/lead-sourcing.ts — v198
//
// Pluggable data-source layer for the autopilot's lead-sourcing.
// Two providers:
//   • OpenStreetMap Overpass — free, no API key, US SMB coverage is OK but
//     misses lots of newer businesses. Used by default so the autopilot
//     works out of the box.
//   • Google Places API — set GOOGLE_PLACES_API_KEY to upgrade. Far better
//     coverage of US SMBs + phone numbers + websites.
//
// Both return the same normalized RawProspect[] so the cron doesn't care.

export type RawProspect = {
  source: "osm" | "google-places";
  source_id: string;
  prospect_company: string;
  city?: string;
  state?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  raw?: Record<string, unknown>;
};

// ── Niche → query keyword map. The OSM/Places "search term". ──────────
// Conservative — only the niches that map cleanly to a real-world business
// type. Add more as needed.
const NICHE_TO_QUERY: Record<string, string> = {
  cleaning: "cleaning service",
  laundromat: "laundromat",
  hvac: "hvac contractor",
  dental: "dentist",
  salon: "hair salon",
  auto: "auto repair",
  landscaping: "landscaping",
  plumbing: "plumber",
  restaurant: "restaurant",
  fitness: "gym",
  "real-estate": "real estate office",
  "law-firm": "law firm",
  roofing: "roofing contractor",
  "med-spa": "med spa",
  chiropractor: "chiropractor",
  "pest-control": "pest control",
  electrician: "electrician",
  moving: "moving company",
  veterinary: "veterinary clinic",
  insurance: "insurance agency",
  mortgage: "mortgage broker",
  accounting: "accounting firm",
  catering: "catering",
  barbershop: "barbershop",
  "physical-therapy": "physical therapy",
};
export function queryForNiche(niche: string, override?: string): string {
  if (override && override.trim()) return override.trim();
  return NICHE_TO_QUERY[niche] || niche.replace(/-/g, " ");
}

// ── Geocode a city string → lat/lon. Uses OSM Nominatim (free, no key). ──
type Geo = { lat: number; lon: number; state?: string };
export async function geocodeCity(city: string, country = "US"): Promise<Geo | null> {
  if (!city.trim()) return null;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&format=json&limit=1`;
  try {
    const r = await fetch(url, {
      headers: { "user-agent": "TrainYourAgent-Autopilot/1.0 (alexander@trainyouragent.com)" },
    });
    if (!r.ok) return null;
    const j = (await r.json()) as Array<{ lat: string; lon: string; display_name?: string }>;
    if (!j || j.length === 0) return null;
    const lat = parseFloat(j[0].lat);
    const lon = parseFloat(j[0].lon);
    if (!isFinite(lat) || !isFinite(lon)) return null;
    // pull state from display_name if format includes it
    const parts = (j[0].display_name || "").split(",").map((s) => s.trim());
    const state = parts.length >= 3 ? parts[parts.length - 3] : undefined;
    return { lat, lon, state };
  } catch {
    return null;
  }
}

// ── Provider: Google Places (preferred if key configured) ────────────
async function fetchGooglePlaces(query: string, geo: Geo, radiusM: number, max: number): Promise<RawProspect[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return [];
  // Text Search supports "query in location" semantics. v1 endpoint.
  const url = `https://places.googleapis.com/v1/places:searchText`;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.internationalPhoneNumber,places.websiteUri,places.location",
      },
      body: JSON.stringify({
        textQuery: query,
        locationBias: { circle: { center: { latitude: geo.lat, longitude: geo.lon }, radius: radiusM } },
        pageSize: Math.min(20, max),
      }),
    });
    if (!r.ok) return [];
    const j = (await r.json()) as { places?: Array<{ id?: string; displayName?: { text?: string }; formattedAddress?: string; internationalPhoneNumber?: string; websiteUri?: string }> };
    const out: RawProspect[] = [];
    for (const p of j.places || []) {
      if (!p.id || !p.displayName?.text) continue;
      out.push({
        source: "google-places",
        source_id: p.id,
        prospect_company: p.displayName.text,
        address: p.formattedAddress,
        phone: p.internationalPhoneNumber,
        website: p.websiteUri,
        raw: p as Record<string, unknown>,
      });
      if (out.length >= max) break;
    }
    return out;
  } catch {
    return [];
  }
}

// ── Provider: OSM Overpass (free, no key, default) ───────────────────
async function fetchOsmOverpass(query: string, geo: Geo, radiusM: number, max: number): Promise<RawProspect[]> {
  // Overpass QL: query nodes/ways within radius matching name pattern OR an
  // amenity/shop/office tag that roughly maps to the query. We use a name
  // regex + a broad set of business tags. Imperfect — Google Places is
  // much better — but works with no setup.
  const q = `[out:json][timeout:25];
(
  node["name"~"${query.replace(/[\\"]/g, "")}",i](around:${radiusM},${geo.lat},${geo.lon});
  way["name"~"${query.replace(/[\\"]/g, "")}",i](around:${radiusM},${geo.lat},${geo.lon});
);
out tags ${Math.min(50, max)};`;
  try {
    const r = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(q),
    });
    if (!r.ok) return [];
    const j = (await r.json()) as { elements?: Array<{ id?: number; type?: string; tags?: Record<string, string> }> };
    const out: RawProspect[] = [];
    for (const el of j.elements || []) {
      const t = el.tags || {};
      const name = t["name"] || t["brand"];
      if (!name) continue;
      out.push({
        source: "osm",
        source_id: `${el.type || "x"}-${el.id}`,
        prospect_company: name,
        address: [t["addr:housenumber"], t["addr:street"], t["addr:city"], t["addr:state"]].filter(Boolean).join(" "),
        phone: t["phone"] || t["contact:phone"],
        email: t["email"] || t["contact:email"],
        website: t["website"] || t["contact:website"],
        raw: t as Record<string, unknown>,
      });
      if (out.length >= max) break;
    }
    return out;
  } catch {
    return [];
  }
}

/** Try preferred provider then fall back to OSM. */
export async function discoverProspects(opts: { query: string; geo: Geo; radius_meters: number; max: number }): Promise<RawProspect[]> {
  const google = await fetchGooglePlaces(opts.query, opts.geo, opts.radius_meters, opts.max);
  if (google.length > 0) return google;
  return await fetchOsmOverpass(opts.query, opts.geo, opts.radius_meters, opts.max);
}

// ── Email pattern guess (when source has website but no email) ──────
// Standard outbound-tooling fallback. Not a verified email — flagged
// in template_sends.meta as `email_source: 'pattern-guess'` so the
// operator knows.
export function guessEmail(websiteUrl: string): string | null {
  if (!websiteUrl) return null;
  try {
    const u = new URL(websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`);
    const host = u.hostname.replace(/^www\./, "");
    // Skip free / social hosts — those guesses never land
    if (/(facebook|instagram|linkedin|twitter|x\.com|tiktok|youtube|wix|squarespace|wordpress|google|yelp)\./.test(host)) return null;
    return `info@${host}`;
  } catch {
    return null;
  }
}
