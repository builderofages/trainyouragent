import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface HexagonIconProps {
  icon: LucideIcon;
  gradient?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { container: 48, icon: 20, path: "M12 2L22 8v8l-10 6L2 16V8z" },
  md: { container: 64, icon: 28, path: "M16 3L28 10v12L16 29L4 22V10z" },
  lg: { container: 80, icon: 36, path: "M20 3L36 12v16L20 37L4 28V12z" },
  xl: { container: 96, icon: 44, path: "M24 4L44 15v18L24 44L4 33V15z" },
};

export const HexagonIcon = ({ 
  icon: Icon, 
  gradient = "from-primary via-accent to-primary", 
  size = "md",
  animate = true,
  className 
}: HexagonIconProps) => {
  const { container, icon: iconSize, path } = sizeMap[size];
  
  return (
    <motion.div
      whileHover={animate ? { 
        scale: 1.1, 
        rotateY: 10,
        rotateX: 5
      } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("relative inline-block", className)}
      style={{
        width: container,
        height: container,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Hexagon Background */}
      <svg
        width={container}
        height={container}
        viewBox="0 0 48 48"
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id={`hexgrad-${gradient}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background Hexagon */}
        <motion.path
          d={path}
          fill={`url(#hexgrad-${gradient})`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Border Hexagon with Glow */}
        <motion.path
          d={path}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* Inner Glow */}
        <motion.path
          d={path}
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1"
          opacity="0.3"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />
      </svg>
      
      {/* Icon - Perfectly Centered */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateY(0)' }}>
        <motion.div
          animate={animate ? {
            rotateZ: [0, 5, -5, 0],
          } : undefined}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          <Icon 
            size={iconSize} 
            className="text-primary drop-shadow-lg"
            style={{ filter: "drop-shadow(0 2px 8px hsl(var(--primary) / 0.3))" }}
          />
        </motion.div>
      </div>
      
      {/* Shine Effect on Hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full"
        initial={{ opacity: 0, x: -20, y: -20 }}
        whileHover={{ opacity: 1, x: 20, y: 20 }}
        transition={{ duration: 0.6 }}
        style={{ mixBlendMode: "overlay" }}
      />
    </motion.div>
  );
};
