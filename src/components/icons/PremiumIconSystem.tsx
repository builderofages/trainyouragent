import { LucideIcon } from "lucide-react";
import { HexagonIcon } from "./HexagonIcon";
import { FluidBlobIcon } from "./FluidBlobIcon";
import { IsometricIcon } from "./IsometricIcon";
import { ParticleIcon } from "./ParticleIcon";

export type IconStyle = "hexagon" | "blob" | "isometric" | "particle";

interface PremiumIconProps {
  icon: LucideIcon;
  style?: IconStyle;
  gradient?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  className?: string;
}

export const PremiumIcon = ({ 
  icon, 
  style = "hexagon",
  gradient,
  size = "md",
  animate = true,
  className 
}: PremiumIconProps) => {
  const iconComponents = {
    hexagon: HexagonIcon,
    blob: FluidBlobIcon,
    isometric: IsometricIcon,
    particle: ParticleIcon,
  };
  
  const IconComponent = iconComponents[style];
  
  return (
    <IconComponent
      icon={icon}
      gradient={gradient}
      size={size}
      animate={animate}
      className={className}
    />
  );
};

// Industry-specific presets - Professional Blue Palette
export const industryIcons = {
  hvac: { style: "hexagon" as IconStyle, gradient: "from-blue-500 via-cyan-500 to-blue-600" },
  accounting: { style: "blob" as IconStyle, gradient: "from-emerald-500 via-green-500 to-teal-500" },
  roofing: { style: "isometric" as IconStyle, gradient: "from-orange-500 via-red-500 to-amber-600" },
  legal: { style: "hexagon" as IconStyle, gradient: "from-blue-600 via-indigo-500 to-cyan-600" },
  healthcare: { style: "blob" as IconStyle, gradient: "from-cyan-500 via-teal-500 to-blue-500" },
  logistics: { style: "particle" as IconStyle, gradient: "from-blue-600 via-sky-500 to-cyan-600" },
  restaurants: { style: "blob" as IconStyle, gradient: "from-yellow-500 via-orange-500 to-red-500" },
  general: { style: "particle" as IconStyle, gradient: "from-primary via-accent to-primary" },
};
