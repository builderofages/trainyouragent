import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface IconWrapperProps {
  icon: LucideIcon;
  className?: string;
  gradient?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8 md:w-10 md:h-10",
  md: "w-10 h-10 md:w-14 md:h-14",
  lg: "w-12 h-12 md:w-16 md:h-16",
  xl: "w-14 h-14 md:w-20 md:h-20",
};

const iconSizes = {
  sm: "w-4 h-4 md:w-5 md:h-5",
  md: "w-5 h-5 md:w-7 md:h-7",
  lg: "w-6 h-6 md:w-8 md:h-8",
  xl: "w-7 h-7 md:w-10 md:h-10",
};

export const IconWrapper = ({ 
  icon: Icon, 
  className, 
  gradient = "from-primary to-accent",
  size = "md",
  animate = true 
}: IconWrapperProps) => {
  return (
    <motion.div
      whileHover={animate ? { scale: 1.1, rotate: 5 } : undefined}
      transition={{ type: "spring", stiffness: 300 }}
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-gradient-to-br shadow-glow-sm",
        sizeClasses[size],
        gradient,
        className
      )}
    >
      <Icon className={cn("text-white", iconSizes[size])} />
    </motion.div>
  );
};
