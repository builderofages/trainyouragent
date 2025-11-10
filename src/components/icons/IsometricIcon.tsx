import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IsometricIconProps {
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

export const IsometricIcon = ({ 
  icon: Icon, 
  gradient = "from-primary via-accent to-primary", 
  size = "md",
  animate = true,
  className 
}: IsometricIconProps) => {
  const { container, icon: iconSize } = sizeMap[size];
  
  return (
    <motion.div
      whileHover={animate ? { 
        rotateY: 15,
        rotateX: -15,
        scale: 1.05
      } : undefined}
      transition={{ type: "spring", stiffness: 300 }}
      className={cn("relative inline-block", className)}
      style={{
        width: container,
        height: container,
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      {/* 3D Layered Squares */}
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {/* Back Layer */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 rounded-2xl`}
          style={{
            transform: "translateZ(-20px) rotateY(10deg) rotateX(-10deg)",
          }}
          animate={animate ? {
            transform: [
              "translateZ(-20px) rotateY(10deg) rotateX(-10deg)",
              "translateZ(-25px) rotateY(12deg) rotateX(-12deg)",
              "translateZ(-20px) rotateY(10deg) rotateX(-10deg)",
            ]
          } : undefined}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Middle Layer */}
        <motion.div
          className={`absolute inset-2 bg-gradient-to-br ${gradient} opacity-40 rounded-xl shadow-lg`}
          style={{
            transform: "translateZ(-10px) rotateY(5deg) rotateX(-5deg)",
          }}
          animate={animate ? {
            transform: [
              "translateZ(-10px) rotateY(5deg) rotateX(-5deg)",
              "translateZ(-15px) rotateY(7deg) rotateX(-7deg)",
              "translateZ(-10px) rotateY(5deg) rotateX(-5deg)",
            ]
          } : undefined}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        
        {/* Front Layer */}
        <motion.div
          className={`absolute inset-4 bg-gradient-to-br ${gradient} opacity-60 rounded-lg shadow-xl`}
          style={{
            transform: "translateZ(0px)",
          }}
          animate={animate ? {
            boxShadow: [
              "0 20px 40px -10px hsl(var(--primary) / 0.3)",
              "0 25px 50px -15px hsl(var(--primary) / 0.5)",
              "0 20px 40px -10px hsl(var(--primary) / 0.3)",
            ]
          } : undefined}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        
        {/* Top Highlight */}
        <motion.div
          className="absolute inset-6 bg-gradient-to-br from-white/40 to-transparent rounded-md"
          style={{
            transform: "translateZ(5px)",
            mixBlendMode: "overlay"
          }}
        />
      </div>
      
      {/* Icon */}
      <div 
        className="absolute inset-0 flex items-center justify-center z-10"
        style={{ transform: "translateZ(10px)" }}
      >
        <motion.div
          animate={animate ? {
            rotateY: [0, 5, -5, 0],
          } : undefined}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon 
            size={iconSize} 
            className="text-primary"
            style={{ 
              filter: "drop-shadow(0 4px 12px hsl(var(--primary) / 0.4))",
              transform: "translateZ(10px)"
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
