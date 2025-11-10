import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingIslandProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

const intensityMap = {
  low: { y: 10, duration: 6 },
  medium: { y: 20, duration: 8 },
  high: { y: 30, duration: 10 },
};

export const FloatingIsland = ({ 
  children, 
  delay = 0, 
  className,
  intensity = "medium"
}: FloatingIslandProps) => {
  const { y, duration } = intensityMap[intensity];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: [0, -y, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: {
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }
      }}
      className={cn("floating-island", className)}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        animate={{
          rotateX: [0, 2, 0, -2, 0],
          rotateY: [0, -2, 0, 2, 0],
        }}
        transition={{
          duration: duration * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
