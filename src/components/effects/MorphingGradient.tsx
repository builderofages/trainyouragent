import { motion } from "framer-motion";

interface MorphingGradientProps {
  colors?: string[];
  speed?: number;
  className?: string;
}

export const MorphingGradient = ({ 
  colors = [
    "hsl(251, 91%, 71%)",
    "hsl(271, 91%, 65%)",
    "hsl(211, 100%, 66%)",
    "hsl(188, 94%, 43%)"
  ],
  speed = 10,
  className = ""
}: MorphingGradientProps) => {
  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colors.join(", ")})`,
        backgroundSize: "400% 400%",
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};
