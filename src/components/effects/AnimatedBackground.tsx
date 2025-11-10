import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  variant?: "mesh" | "waves" | "gradient" | "particles";
  className?: string;
}

export const AnimatedBackground = ({ 
  variant = "mesh",
  className = ""
}: AnimatedBackgroundProps) => {
  if (variant === "mesh") {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(at 40% 20%, hsla(251, 91%, 71%, 0.3) 0px, transparent 50%),
              radial-gradient(at 80% 0%, hsla(271, 91%, 65%, 0.3) 0px, transparent 50%),
              radial-gradient(at 0% 50%, hsla(211, 100%, 66%, 0.3) 0px, transparent 50%),
              radial-gradient(at 100% 100%, hsla(188, 94%, 43%, 0.3) 0px, transparent 50%)
            `,
          }}
          animate={{
            backgroundPosition: [
              "40% 20%, 80% 0%, 0% 50%, 100% 100%",
              "60% 40%, 20% 30%, 50% 80%, 30% 20%",
              "40% 20%, 80% 0%, 0% 50%, 100% 100%",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    );
  }

  if (variant === "waves") {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          <motion.path
            d="M0,100 Q250,50 500,100 T1000,100 T1500,100 V200 H0 Z"
            fill="url(#wave-gradient)"
            animate={{
              d: [
                "M0,100 Q250,50 500,100 T1000,100 T1500,100 V200 H0 Z",
                "M0,100 Q250,150 500,100 T1000,100 T1500,100 V200 H0 Z",
                "M0,100 Q250,50 500,100 T1000,100 T1500,100 V200 H0 Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <motion.div
        className={`absolute inset-0 ${className}`}
        style={{
          background: `linear-gradient(135deg, 
            hsl(var(--primary) / 0.05) 0%, 
            hsl(var(--accent) / 0.08) 50%, 
            hsl(var(--primary) / 0.05) 100%)`,
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  }

  return null;
};
