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
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-16 h-16",
  xl: "w-20 h-20",
};

const iconSizes = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-8 h-8",
  xl: "w-10 h-10",
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
