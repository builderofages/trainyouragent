// src/lib/brand.ts
// Single source of truth for TrainYourAgent brand tokens.
// Future pages should import from here instead of inlining hex.
// Existing pages can be refactored incrementally — no breaking change.

export const COLOR = {
  ink:        "#0B1B2B",  // body text
  navy:       "#042C53",  // primary brand, headlines, dark surfaces
  navyHover:  "#0A3D6E",  // primary CTA hover
  blue:       "#185FA5",  // links, accents, eyebrows
  blueDeep:   "#0C447C",  // logo solids
  blueSoft:   "#9CC4EC",  // dark-mode text on navy
  tint:       "#E6F1FB",  // light surfaces, badges
  tintHover:  "#DCEBFA",  // tint hover state
  bgSoft:     "#F6FAFE",  // subtle section background
  white:      "#FFFFFF",
  green:      "#22A36C",  // success, "live" indicators
  greenHover: "#1E8E5E",
} as const;

export const FONT = {
  sans:    "'Inter Tight', system-ui, -apple-system, sans-serif",
  display: "'Playfair Display', serif",
  mono:    "'JetBrains Mono', ui-monospace, monospace",
} as const;

export const SIZE = {
  xs: "11px", sm: "12px", base: "14px", md: "15px", lg: "17px",
  xl: "20px", h3: "24px", h2: "32px", h1: "44px", display: "68px", hero: "80px",
} as const;

export const RADIUS = {
  sm: "8px", md: "12px", lg: "16px", xl: "24px", pill: "9999px",
} as const;

export const SHADOW = {
  card:   "0 4px 24px -10px rgba(4,44,83,0.18)",
  hero:   "0 4px 40px -12px rgba(4,44,83,0.22)",
  closer: "0 20px 60px -20px rgba(4,44,83,0.35)",
} as const;

export const URL = {
  cal:        "https://cal.com/trainyouragent/30min",
  linkedin:   "https://www.linkedin.com/in/agentmills",
  email:      "mailto:hello@trainyouragent.com",
  emailSec:   "mailto:security@trainyouragent.com",
  emailLegal: "mailto:legal@trainyouragent.com",
  emailPart:  "mailto:partners@trainyouragent.com",
  emailCare:  "mailto:careers@trainyouragent.com",
} as const;

// v46a HONESTY FIX:
// We don't have a published phone line yet. Rather than ship a fake
// (813) 555-0142 number that anyone over 35 instantly clocks as the
// "555 movie phone" tell, every page now points to Cal.com for a
// real human conversation. Swap to a real number when ported.
//   - Update TODO_REAL_PHONE: false → set display/tel/href + flip to true
//   - Every page reads PHONE.hasReal to decide whether to render a tel: link
export const PHONE = {
  hasReal: false as boolean,
  display: "Book a 15-min Zoom",        // shown wherever phone would render
  tel:     "+1",                         // unused while hasReal=false
  href:    "https://cal.com/trainyouragent/30min", // Cal.com fallback
  copyShort: "Phone line ports Q3 — book a 15-min Zoom for now",
} as const;

// Public traction (his own LinkedIn — safe to cite)
export const PROOF = {
  yearsInAI:    "4 yrs",
  shipsBuilt:   "300+",
  monthlyMRR:   "$20K+",
  verticals:    "14",
} as const;

// Fonts loader — call once on mount in any new page that needs it.
export function loadFonts(doc: Document = document) {
  if (doc.getElementById("tya-fonts")) return;
  const l = doc.createElement("link");
  l.id = "tya-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap";
  doc.head.appendChild(l);
}
