// src/components/HeroCapabilityChips.tsx
// v71: 8-capability hero chip row. Fixes Grok Heavy's one visible ding —
// "hero leans voice-heavy, full breadth requires one scroll." This row
// makes the Everything-AI breadth visible at-a-glance under the h1.
//
// Each chip: icon + single word + smooth-scroll or link target. On hover:
// navy fill on tint. Mounts inside StaggerChildren so each chip reveals
// in sequence after the headline.

import { Link } from "react-router-dom";
import {
  Phone,
  MessageSquare,
  UserCheck,
  PhoneOutgoing,
  TrendingUp,
  Sparkles,
  Wrench,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { StaggerChildren } from "@/components/motion";

type Chip = {
  label: string;
  to: string;
  Icon: LucideIcon;
  /** aria-label expansion for screen readers */
  full: string;
};

const CHIPS: Chip[] = [
  { label: "Voice",         to: "/solutions#voice",     Icon: Phone,         full: "Voice agents" },
  { label: "Chat",          to: "/solutions#chat",      Icon: MessageSquare, full: "Chat agents" },
  { label: "Receptionists", to: "/solutions#reception", Icon: UserCheck,     full: "AI receptionists" },
  { label: "Sales",         to: "/solutions#sales",     Icon: PhoneOutgoing, full: "Sales agents" },
  { label: "Marketing",     to: "/solutions#growth",    Icon: TrendingUp,    full: "Marketing AI" },
  { label: "Brand",         to: "/solutions#brand",     Icon: Sparkles,      full: "Brand systems" },
  { label: "Tooling",       to: "/solutions#infra",     Icon: Wrench,        full: "Internal tooling" },
  { label: "Custom",        to: "/solutions#custom",    Icon: Boxes,         full: "Custom AI builds" },
];

export default function HeroCapabilityChips() {
  return (
    <div
      aria-label="The eight capability categories this site delivers"
      className="mt-5 sm:mt-6 mb-2 -ml-0.5"
    >
      <StaggerChildren
        className="flex flex-wrap gap-2 sm:gap-2.5"
        delay={0.04}
        y={8}
      >
        {CHIPS.map((c) => {
          const Icon = c.Icon;
          return (
            <Link
              key={c.label}
              to={c.to}
              aria-label={c.full}
              className="
                group inline-flex items-center gap-1.5
                px-3 py-1.5 sm:px-3.5 sm:py-2
                rounded-full border border-[#042C53]/25
                bg-white/70 backdrop-blur-sm
                text-[12.5px] sm:text-[13px] font-semibold text-[#042C53]
                hover:bg-[#E6F1FB] hover:border-[#042C53]/60
                transition-colors duration-150
              "
            >
              <Icon
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#185FA5] group-hover:text-[#042C53]"
                strokeWidth={2.2}
                aria-hidden="true"
              />
              <span>{c.label}</span>
            </Link>
          );
        })}
      </StaggerChildren>
    </div>
  );
}
