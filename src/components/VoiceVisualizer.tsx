import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface VoiceVisualizerProps {
  isActive: boolean;
  volumeLevel?: number;
  variant?: "bars" | "wave" | "pulse";
}

export const VoiceVisualizer = ({ 
  isActive, 
  volumeLevel = 0.5,
  variant = "bars" 
}: VoiceVisualizerProps) => {
  const [bars, setBars] = useState(Array(5).fill(0));

  useEffect(() => {
    if (!isActive) {
      setBars(Array(5).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setBars(Array(5).fill(0).map(() => 
        Math.random() * volumeLevel * 100
      ));
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, volumeLevel]);

  if (variant === "bars") {
    return (
      <div className="flex items-center justify-center gap-1 h-12">
        {bars.map((height, i) => (
          <motion.div
            key={i}
            className="w-1 bg-gradient-to-t from-primary to-accent rounded-full"
            animate={{
              height: isActive ? `${Math.max(height, 20)}%` : "20%",
            }}
            transition={{
              duration: 0.1,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div className="flex items-center justify-center gap-1 h-12">
        {Array(7).fill(0).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-gradient-to-t from-primary to-accent rounded-full"
            animate={isActive ? {
              height: ["20%", "80%", "20%"],
            } : {
              height: "20%",
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  // Pulse variant
  return (
    <div className="flex items-center justify-center h-12">
      <motion.div
        className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent opacity-30"
        animate={isActive ? {
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.1, 0.3],
        } : {
          scale: 1,
          opacity: 0.3,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent"
        animate={isActive ? {
          scale: [1, 1.2, 1],
        } : {
          scale: 1,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
