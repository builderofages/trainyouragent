// src/components/illustrations/NicheIllustrations.tsx — v52B
// One inline SVG illustration per playbook niche. Brand colors only
// (#042C53 navy, #185FA5 blue, #E6F1FB tint). All <3KB, all respect
// prefers-reduced-motion. Default render size ~80x80.

import type { CSSProperties } from "react";

const NAVY = "#042C53";
const BLUE = "#185FA5";
const TINT = "#E6F1FB";

type Props = { className?: string; style?: CSSProperties; size?: number };

function Wrap({
  children,
  className,
  style,
  size = 80,
  title,
}: Props & { children: React.ReactNode; title: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: size, height: size, ...style }}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {children}
    </svg>
  );
}

export function HvacIllo(p: Props) {
  return (
    <Wrap {...p} title="HVAC — thermostat and warmth">
      <rect x="6" y="22" width="68" height="40" rx="4" fill={TINT} stroke={NAVY} strokeWidth="2" />
      <polygon points="40,8 14,26 66,26" fill={TINT} stroke={NAVY} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="40" cy="42" r="11" fill="#fff" stroke={NAVY} strokeWidth="2" />
      <text x="40" y="46" textAnchor="middle" fontSize="10" fontWeight="700" fill={NAVY} fontFamily="'Inter Tight', sans-serif">72</text>
      <path d="M16 60 Q22 56 28 60 T40 60 T52 60 T64 60" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
    </Wrap>
  );
}

export function RoofingIllo(p: Props) {
  return (
    <Wrap {...p} title="Roofing — gable, shingles, sun">
      <circle cx="62" cy="20" r="8" fill={BLUE} opacity="0.85" />
      <polygon points="40,12 8,42 72,42" fill={TINT} stroke={NAVY} strokeWidth="2" strokeLinejoin="round" />
      <line x1="40" y1="12" x2="40" y2="42" stroke={NAVY} strokeWidth="1.5" />
      <g stroke={BLUE} strokeWidth="1.6" strokeLinecap="round">
        <line x1="16" y1="46" x2="64" y2="46" />
        <line x1="20" y1="52" x2="60" y2="52" />
        <line x1="24" y1="58" x2="56" y2="58" />
        <line x1="28" y1="64" x2="52" y2="64" />
      </g>
      <rect x="14" y="42" width="52" height="28" fill="none" stroke={NAVY} strokeWidth="2" />
    </Wrap>
  );
}

export function PlumbingIllo(p: Props) {
  return (
    <Wrap {...p} title="Plumbing — pipe network with droplet">
      <path
        d="M12 20 H32 V40 H50 V60 H68"
        fill="none"
        stroke={NAVY}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="20" r="3.5" fill={BLUE} />
      <circle cx="32" cy="40" r="3.5" fill={BLUE} />
      <circle cx="50" cy="40" r="3.5" fill={BLUE} />
      <circle cx="50" cy="60" r="3.5" fill={BLUE} />
      <path d="M68 60 q-4 8 0 12 q4 -4 0 -12 z" fill={BLUE} stroke={NAVY} strokeWidth="1.5" />
    </Wrap>
  );
}

export function ElectricalIllo(p: Props) {
  return (
    <Wrap {...p} title="Electrical — bolt and outlet">
      <rect x="42" y="14" width="30" height="52" rx="6" fill={TINT} stroke={NAVY} strokeWidth="2" />
      <circle cx="52" cy="34" r="2.4" fill={NAVY} />
      <circle cx="62" cy="34" r="2.4" fill={NAVY} />
      <rect x="54" y="46" width="6" height="10" rx="1.5" fill={NAVY} />
      <polygon points="22,8 12,40 22,40 16,72 36,32 22,32 28,8" fill={BLUE} stroke={NAVY} strokeWidth="2" strokeLinejoin="round" />
    </Wrap>
  );
}

export function LandscapingIllo(p: Props) {
  return (
    <Wrap {...p} title="Landscaping — tree and grass">
      <circle cx="28" cy="28" r="16" fill={TINT} stroke={NAVY} strokeWidth="2" />
      <path d="M28 28 q-6 -8 0 -14 q6 6 0 14" fill={BLUE} opacity="0.7" />
      <rect x="25" y="42" width="6" height="14" fill={NAVY} />
      <g stroke={NAVY} strokeWidth="2" strokeLinecap="round">
        <line x1="6" y1="66" x2="74" y2="66" />
        <path d="M14 66 v-6 M22 66 v-9 M30 66 v-7 M40 66 v-10 M48 66 v-7 M56 66 v-9 M64 66 v-6" />
      </g>
    </Wrap>
  );
}

export function DentalIllo(p: Props) {
  return (
    <Wrap {...p} title="Dental — tooth">
      <path
        d="M40 10 C 22 10, 14 20, 14 32 C 14 46, 22 60, 26 70 C 28 74, 32 74, 34 68 L 38 50 C 38 46, 42 46, 42 50 L 46 68 C 48 74, 52 74, 54 70 C 58 60, 66 46, 66 32 C 66 20, 58 10, 40 10 Z"
        fill={TINT}
        stroke={NAVY}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M28 24 q12 -6 24 0" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
    </Wrap>
  );
}

export function MedSpaIllo(p: Props) {
  return (
    <Wrap {...p} title="Med spa — leaf and droplet">
      <path
        d="M16 56 C 16 30, 38 14, 64 14 C 64 40, 42 56, 16 56 Z"
        fill={TINT}
        stroke={NAVY}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M22 50 Q 40 30 60 18" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M50 50 q-6 10 0 16 q6 -6 0 -16 z" fill={BLUE} stroke={NAVY} strokeWidth="1.6" />
    </Wrap>
  );
}

export function LawFirmIllo(p: Props) {
  return (
    <Wrap {...p} title="Law firm — scale of justice">
      <line x1="40" y1="10" x2="40" y2="62" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
      <line x1="14" y1="22" x2="66" y2="22" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="62" x2="58" y2="62" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
      <path d="M16 22 L 8 42 a 12 6 0 0 0 16 0 Z" fill={TINT} stroke={NAVY} strokeWidth="2" strokeLinejoin="round" />
      <path d="M64 22 L 56 42 a 12 6 0 0 0 16 0 Z" fill={TINT} stroke={NAVY} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="40" cy="12" r="3" fill={BLUE} />
    </Wrap>
  );
}

export function RealEstateIllo(p: Props) {
  return (
    <Wrap {...p} title="Real estate — house with key">
      <polygon points="40,10 12,32 16,32 16,66 64,66 64,32 68,32" fill={TINT} stroke={NAVY} strokeWidth="2" strokeLinejoin="round" />
      <rect x="34" y="44" width="12" height="22" fill="#fff" stroke={NAVY} strokeWidth="2" />
      <rect x="22" y="40" width="8" height="8" fill="#fff" stroke={NAVY} strokeWidth="1.5" />
      <rect x="50" y="40" width="8" height="8" fill="#fff" stroke={NAVY} strokeWidth="1.5" />
      <circle cx="56" cy="56" r="3" fill={BLUE} />
      <line x1="56" y1="58" x2="56" y2="64" stroke={BLUE} strokeWidth="2" />
    </Wrap>
  );
}

export function PropertyManagementIllo(p: Props) {
  return (
    <Wrap {...p} title="Property management — building">
      <rect x="14" y="14" width="22" height="56" fill={TINT} stroke={NAVY} strokeWidth="2" />
      <rect x="42" y="26" width="24" height="44" fill={TINT} stroke={NAVY} strokeWidth="2" />
      <g fill={BLUE}>
        <rect x="18" y="20" width="4" height="4" />
        <rect x="26" y="20" width="4" height="4" />
        <rect x="18" y="28" width="4" height="4" />
        <rect x="26" y="28" width="4" height="4" />
        <rect x="18" y="36" width="4" height="4" />
        <rect x="26" y="36" width="4" height="4" />
        <rect x="18" y="44" width="4" height="4" />
        <rect x="26" y="44" width="4" height="4" />
        <rect x="46" y="32" width="4" height="4" />
        <rect x="54" y="32" width="4" height="4" />
        <rect x="46" y="40" width="4" height="4" />
        <rect x="54" y="40" width="4" height="4" />
        <rect x="46" y="48" width="4" height="4" />
        <rect x="54" y="48" width="4" height="4" />
      </g>
      <rect x="22" y="60" width="6" height="10" fill={NAVY} />
      <rect x="50" y="60" width="8" height="10" fill={NAVY} />
    </Wrap>
  );
}

export function RestaurantIllo(p: Props) {
  return (
    <Wrap {...p} title="Restaurant — chef hat">
      <path
        d="M20 32 a 14 14 0 1 1 8 -26 a 14 14 0 0 1 24 0 a 14 14 0 1 1 8 26 Z"
        fill={TINT}
        stroke={NAVY}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="18" y="32" width="44" height="22" rx="2" fill="#fff" stroke={NAVY} strokeWidth="2" />
      <line x1="26" y1="36" x2="26" y2="50" stroke={BLUE} strokeWidth="1.5" />
      <line x1="40" y1="36" x2="40" y2="50" stroke={BLUE} strokeWidth="1.5" />
      <line x1="54" y1="36" x2="54" y2="50" stroke={BLUE} strokeWidth="1.5" />
      <rect x="14" y="54" width="52" height="6" rx="1" fill={NAVY} />
    </Wrap>
  );
}

export function AutoRepairIllo(p: Props) {
  return (
    <Wrap {...p} title="Auto repair — wrench and gear">
      <g transform="translate(40 40)">
        <circle r="20" fill="none" stroke={NAVY} strokeWidth="2.5" />
        <circle r="8" fill={TINT} stroke={NAVY} strokeWidth="2" />
        <g fill={NAVY}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <rect
              key={a}
              x="-3"
              y="-26"
              width="6"
              height="8"
              rx="1"
              transform={`rotate(${a})`}
            />
          ))}
        </g>
      </g>
      <path
        d="M58 14 a 8 8 0 0 0 -10 10 L 22 50 l 6 6 26 -26 a 8 8 0 0 0 10 -10 l -6 6 -4 -4 z"
        fill={BLUE}
        stroke={NAVY}
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </Wrap>
  );
}

export function InsuranceIllo(p: Props) {
  return (
    <Wrap {...p} title="Insurance — shield and clipboard">
      <path
        d="M40 8 L 14 18 V 38 C 14 56, 28 68, 40 72 C 52 68, 66 56, 66 38 V 18 Z"
        fill={TINT}
        stroke={NAVY}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <polyline
        points="28,38 36,46 52,28"
        fill="none"
        stroke={BLUE}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Wrap>
  );
}

export function FitnessIllo(p: Props) {
  return (
    <Wrap {...p} title="Fitness — dumbbell">
      <rect x="6" y="28" width="10" height="24" rx="2" fill={NAVY} />
      <rect x="64" y="28" width="10" height="24" rx="2" fill={NAVY} />
      <rect x="16" y="34" width="6" height="12" rx="1.5" fill={NAVY} />
      <rect x="58" y="34" width="6" height="12" rx="1.5" fill={NAVY} />
      <rect x="22" y="36" width="36" height="8" rx="2" fill={BLUE} />
      <line x1="30" y1="34" x2="30" y2="46" stroke={NAVY} strokeWidth="1" />
      <line x1="40" y1="34" x2="40" y2="46" stroke={NAVY} strokeWidth="1" />
      <line x1="50" y1="34" x2="50" y2="46" stroke={NAVY} strokeWidth="1" />
    </Wrap>
  );
}

export function PestControlIllo(p: Props) {
  return (
    <Wrap {...p} title="Pest control — hex grid and shield">
      <g fill="none" stroke={BLUE} strokeWidth="1.5">
        <polygon points="14,16 22,20 22,28 14,32 6,28 6,20" />
        <polygon points="30,16 38,20 38,28 30,32 22,28 22,20" />
        <polygon points="14,32 22,36 22,44 14,48 6,44 6,36" />
        <polygon points="30,32 38,36 38,44 30,48 22,44 22,36" />
      </g>
      <path
        d="M56 18 L 38 24 V 40 C 38 54, 48 62, 56 64 C 64 62, 74 54, 74 40 V 24 Z"
        fill={TINT}
        stroke={NAVY}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polyline
        points="47,40 53,46 65,32"
        fill="none"
        stroke={NAVY}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Wrap>
  );
}

/** Slug → component map. Slugs match src/lib/playbooks.ts registry. */
export function NicheIllustration({
  slug,
  className,
  style,
  size = 80,
}: { slug: string } & Props) {
  const props = { className, style, size };
  switch (slug) {
    case "hvac": return <HvacIllo {...props} />;
    case "roofing": return <RoofingIllo {...props} />;
    case "plumbing": return <PlumbingIllo {...props} />;
    case "electrical": return <ElectricalIllo {...props} />;
    case "landscaping": return <LandscapingIllo {...props} />;
    case "dental": return <DentalIllo {...props} />;
    case "med-spa": return <MedSpaIllo {...props} />;
    case "law-firm": return <LawFirmIllo {...props} />;
    case "real-estate": return <RealEstateIllo {...props} />;
    case "property-management": return <PropertyManagementIllo {...props} />;
    case "restaurant": return <RestaurantIllo {...props} />;
    case "auto-repair": return <AutoRepairIllo {...props} />;
    case "insurance": return <InsuranceIllo {...props} />;
    case "fitness": return <FitnessIllo {...props} />;
    case "pest-control": return <PestControlIllo {...props} />;
    default: return null;
  }
}
