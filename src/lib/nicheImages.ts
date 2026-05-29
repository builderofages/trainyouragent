// src/lib/nicheImages.ts — v209
//
// HD image banners per niche. Replaces the emoji marker that was being used
// everywhere with proper magazine-cover-style photography.
//
// Strategy: pollinations.ai with a hand-tuned prompt per niche. Each call is
// deterministic (seed locked) so the same niche always returns the same image.
// First fetch generates server-side (~3-8s), every subsequent fetch is CDN-
// cached. We pass `loading="lazy"` at the call sites and use a CSS gradient
// placeholder backdrop so the page never visibly waits on the network.
//
// Free, no API key, commercial-safe (pollinations is FOSS + CC0).

const PROMPTS: Record<string, string> = {
  cleaning:        "professional photograph, sunlit modern living room being cleaned, person in uniform with spray bottle, clean minimal aesthetic, magazine cover",
  laundromat:      "professional photograph, rows of modern white front-loading washing machines, warm overhead lighting, clean industrial laundromat interior, magazine editorial",
  hvac:            "professional photograph, HVAC technician in uniform servicing outdoor AC condenser unit, blue sky, sharp clean aesthetic, commercial photography",
  dental:          "professional photograph, modern bright dental office interior with chair and equipment, soft natural light, calm clean aesthetic, magazine editorial",
  roofing:         "professional photograph, residential house roof with new asphalt shingles, blue sky, warm sun, roofer on roof in background, magazine aerial editorial",
  plumbing:        "professional photograph, plumber in uniform repairing copper pipes under modern kitchen sink, focused work, clean professional aesthetic, commercial",
  landscaping:     "professional photograph, freshly mowed striped suburban front lawn with manicured hedges, golden hour, magazine garden editorial",
  realestate:      "professional photograph, modern luxury suburban home exterior at golden hour, manicured lawn, warm windows, real estate magazine cover",
  medspa:          "professional photograph, calm modern medical spa interior with soft pink and beige tones, serene minimal, wellness magazine editorial",
  autorepair:      "professional photograph, clean modern auto repair shop interior, mechanic working on car on lift, warm overhead lights, magazine editorial",
  lawfirm:         "professional photograph, sophisticated law office interior with leather chairs and bookshelves, warm wood, soft light, magazine editorial",
  restaurant:      "professional photograph, warm intimate restaurant dining room interior, soft golden light, set tables, magazine food editorial",
  salon:           "professional photograph, modern hair salon interior with stylist chairs and large mirrors, soft pink and beige tones, magazine beauty editorial",
  gym:             "professional photograph, modern industrial gym interior with weight racks and equipment, dramatic side light, fitness magazine editorial",
  chiro:           "professional photograph, calm modern chiropractic office with adjustment table, soft natural light, wellness magazine editorial",
  accountant:      "professional photograph, modern accountant workspace with laptop calculator and financial documents on warm wood desk, magazine business editorial",
  electrician:     "professional photograph, electrician in uniform working on residential electrical panel, focused safe professional, commercial photography",
  pestcontrol:     "professional photograph, pest control technician in uniform with sprayer at suburban home exterior, professional clean aesthetic, commercial photography",
  carpetcleaning:  "professional photograph, person operating professional carpet cleaning machine in modern home living room, clean stripes visible, magazine editorial",
  bartender:       "professional photograph, warm intimate cocktail bar interior with bartender mixing drink, low golden light, magazine nightlife editorial",
  vet:             "professional photograph, friendly veterinarian examining happy dog in modern bright clinic exam room, warm caring aesthetic, magazine editorial",
  daycare:         "professional photograph, bright cheerful daycare interior with colorful toys and soft lighting, warm safe aesthetic, magazine editorial",
  moving:          "professional photograph, two movers carrying labeled boxes from white moving truck to suburban home, sunny day, magazine editorial",
  locksmith:       "professional photograph, locksmith in uniform working on modern door lock with tools, focused close-up, commercial photography",
  pooltech:        "professional photograph, pool technician testing water at clean modern backyard pool, blue sparkling water, magazine editorial",
  // Generic safe fallback that still looks editorial.
  default:         "professional photograph, modern small business storefront at golden hour, clean editorial aesthetic, magazine cover",
};

/**
 * Build a deterministic pollinations.ai image URL for a niche.
 * - `id`   niche id from NICHE_SITES
 * - `w/h`  target dimensions (image is generated at this aspect)
 *
 * The image is cached per (prompt + width + height + seed) tuple, so repeat
 * loads from any visitor hit the CDN cache after the first generation.
 */
export function nicheImageUrl(id: string, w = 800, h = 480): string {
  const prompt = PROMPTS[id] || PROMPTS.default;
  const seed = idToSeed(id);
  const p = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${p}?width=${w}&height=${h}&nologo=true&model=flux&seed=${seed}`;
}

/**
 * Variant generator — same niche prompt but with a "variation N" suffix and
 * a derived seed, so the slideshow can rotate through 3-4 visually distinct
 * but on-brand images.
 */
export function nicheImageVariant(id: string, variant: number, w = 1280, h = 540): string {
  const prompt = (PROMPTS[id] || PROMPTS.default) + ` — composition variation ${variant + 1}, different angle, same business type`;
  const seed = (idToSeed(id) + variant * 9173) % 1_000_000;
  const p = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${p}?width=${w}&height=${h}&nologo=true&model=flux&seed=${seed}`;
}

/**
 * Before/after pair per niche. Used by the drag-to-reveal slider on the
 * per-niche site. Prompts are hand-mapped where it makes a visible
 * difference; everything else falls back to a generic "messy vs clean".
 */
export function nicheBeforeAfter(id: string, w = 900, h = 600): { before: string; after: string } {
  const map: Record<string, { before: string; after: string }> = {
    cleaning:        { before: "professional photograph, messy cluttered residential kitchen with dishes piled in sink, dim",
                       after:  "professional photograph, same kitchen pristine clean, sparkling counters, bright daylight, magazine editorial" },
    laundromat:      { before: "professional photograph, pile of wrinkled dirty clothes spilling out of laundry basket on floor, dim apartment",
                       after:  "professional photograph, neatly folded stack of crisp white shirts and clothing, soft daylight, magazine editorial" },
    roofing:         { before: "professional photograph, weathered damaged residential roof with missing curling asphalt shingles, overcast sky",
                       after:  "professional photograph, same residential house with new perfect asphalt shingle roof, blue sky, golden hour, magazine editorial" },
    landscaping:     { before: "professional photograph, overgrown weedy front yard lawn, patchy bare spots, dim",
                       after:  "professional photograph, freshly mowed striped emerald lawn with manicured hedges, golden hour, magazine editorial" },
    autorepair:      { before: "professional photograph, dirty car engine bay with grime and worn parts, dim garage",
                       after:  "professional photograph, same engine bay cleaned and serviced, bright shop lights, magazine editorial" },
    pestcontrol:     { before: "professional photograph, ants and pests on kitchen counter near food crumbs, dim",
                       after:  "professional photograph, spotless pest-free kitchen counter, bright daylight, magazine editorial" },
    carpetcleaning:  { before: "professional photograph, stained dirty carpet with visible spills in residential living room, dim",
                       after:  "professional photograph, same carpet pristine clean with visible vacuum stripes, bright daylight, magazine editorial" },
    pooltech:        { before: "professional photograph, cloudy murky green algae-filled backyard pool, dim",
                       after:  "professional photograph, sparkling crystal-clear blue backyard pool, bright sunny day, magazine editorial" },
    dental:          { before: "professional photograph, before — slight tooth discoloration close-up smile",
                       after:  "professional photograph, after — bright white healthy smile close-up, professional dental photography" },
    hvac:            { before: "professional photograph, old rusty broken outdoor AC condenser unit, overgrown weeds around base",
                       after:  "professional photograph, brand new clean modern AC condenser unit installed on concrete pad, clear yard, magazine editorial" },
    plumbing:        { before: "professional photograph, rusted leaking corroded pipes under kitchen sink, dim",
                       after:  "professional photograph, new copper pipes neatly installed under same sink, bright clean aesthetic, magazine editorial" },
  };
  const pair = map[id] || {
    before: "professional photograph, slightly messy small business interior before service, dim editorial",
    after:  "professional photograph, same interior after professional service, bright clean magazine editorial",
  };
  const baseSeed = idToSeed(id);
  const before = `https://image.pollinations.ai/prompt/${encodeURIComponent(pair.before)}?width=${w}&height=${h}&nologo=true&model=flux&seed=${baseSeed}`;
  const after  = `https://image.pollinations.ai/prompt/${encodeURIComponent(pair.after)}?width=${w}&height=${h}&nologo=true&model=flux&seed=${(baseSeed + 5021) % 1_000_000}`;
  return { before, after };
}

// Stable seed per niche so the same niche always renders the same image.
function idToSeed(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  // pollinations seed range: any positive int
  return h % 1_000_000;
}
