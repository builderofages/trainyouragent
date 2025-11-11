import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedHeroIconProps {
  icon: LucideIcon;
  color: string;
  animation: "float" | "pulse" | "rotate" | "bounce" | "shake";
  delay?: number;
}

export const AnimatedHeroIcon = ({ 
  icon: Icon, 
  color, 
  animation, 
  delay = 0 
}: AnimatedHeroIconProps) => {
  const getAnimation = () => {
    switch (animation) {
      case "float":
        return {
          y: [0, -10, 0],
        };
      case "pulse":
        return {
          scale: [1, 1.15, 1],
        };
      case "rotate":
        return {
          rotate: [0, 360],
        };
      case "bounce":
        return {
          y: [0, -15, 0],
        };
      case "shake":
        return {
          rotate: [0, 5, -5, 0],
        };
    }
  };

  const getDuration = () => {
    switch (animation) {
      case "float": return 3;
      case "pulse": return 2;
      case "rotate": return 4;
      case "bounce": return 1.5;
      case "shake": return 2;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        damping: 10,
        stiffness: 100,
        delay: delay
      }}
      whileHover={{ scale: 1.2, rotate: 5 }}
      className="relative cursor-pointer"
    >
      <motion.div
        animate={getAnimation()}
        transition={{
          duration: getDuration(),
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <Icon className={`w-8 h-8 md:w-10 md:h-10 ${color}`} />
      </motion.div>
    </motion.div>
  );
};
