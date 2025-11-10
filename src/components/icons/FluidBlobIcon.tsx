import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FluidBlobIconProps {
  icon: LucideIcon;
  gradient?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { container: 48, icon: 20 },
  md: { container: 64, icon: 28 },
  lg: { container: 80, icon: 36 },
  xl: { container: 96, icon: 44 },
};

export const FluidBlobIcon = ({ 
  icon: Icon, 
  gradient = "from-primary via-accent to-primary", 
  size = "md",
  animate = true,
  className 
}: FluidBlobIconProps) => {
  const { container, icon: iconSize } = sizeMap[size];
  
  return (
    <motion.div
      whileHover={animate ? { 
        scale: 1.1,
        rotate: [0, -5, 5, 0]
      } : undefined}
      transition={{ type: "spring", stiffness: 200 }}
      className={cn("relative inline-block", className)}
      style={{
        width: container,
        height: container,
      }}
    >
      {/* Animated Blob SVG */}
      <svg
        width={container}
        height={container}
        viewBox="0 0 200 200"
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id={`blobgrad-${gradient}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          </linearGradient>
          <filter id="blob-glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Morphing Blob */}
        <motion.path
          fill={`url(#blobgrad-${gradient})`}
          filter="url(#blob-glow)"
          animate={{
            d: [
              "M47.1,-55.4C59.9,-47.3,68.5,-32.2,71.7,-16.1C74.9,0.1,72.7,17.4,65.1,32.8C57.5,48.2,44.5,61.7,28.8,67.9C13.1,74.1,-5.3,73,-22.3,67.3C-39.3,61.6,-54.9,51.3,-63.8,37.1C-72.7,22.9,-74.9,4.8,-71.8,-11.7C-68.7,-28.2,-60.3,-43.1,-47.8,-51.4C-35.3,-59.7,-17.7,-61.4,-0.5,-60.7C16.6,-60,34.3,-63.5,47.1,-55.4Z",
              "M42.7,-54.4C54.1,-45.3,61.7,-31.5,65.3,-16.8C68.9,-2.1,68.5,13.5,62.8,27.3C57.1,41.1,46.1,53.1,32.4,60.4C18.7,67.7,2.3,70.3,-13.6,67.9C-29.5,65.5,-44.9,58.1,-56.1,46.8C-67.3,35.5,-74.3,20.3,-74.8,4.7C-75.3,-10.9,-69.3,-26.9,-59.3,-40.3C-49.3,-53.7,-35.3,-64.5,-20.2,-68.4C-5.1,-72.3,11.1,-69.3,25.7,-62.4C40.3,-55.5,51.3,-44.7,42.7,-54.4Z",
              "M47.1,-55.4C59.9,-47.3,68.5,-32.2,71.7,-16.1C74.9,0.1,72.7,17.4,65.1,32.8C57.5,48.2,44.5,61.7,28.8,67.9C13.1,74.1,-5.3,73,-22.3,67.3C-39.3,61.6,-54.9,51.3,-63.8,37.1C-72.7,22.9,-74.9,4.8,-71.8,-11.7C-68.7,-28.2,-60.3,-43.1,-47.8,-51.4C-35.3,-59.7,-17.7,-61.4,-0.5,-60.7C16.6,-60,34.3,-63.5,47.1,-55.4Z"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          transform="translate(100 100)"
        />
        
        {/* Inner Pulse */}
        <motion.circle
          cx="100"
          cy="100"
          r="40"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          opacity="0.4"
          animate={{
            r: [35, 45, 35],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
      
      {/* Icon */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          animate={animate ? {
            scale: [1, 1.1, 1],
          } : undefined}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon 
            size={iconSize} 
            className="text-primary"
            style={{ filter: "drop-shadow(0 4px 12px hsl(var(--primary) / 0.4))" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
