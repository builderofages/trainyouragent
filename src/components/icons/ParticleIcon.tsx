import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface ParticleIconProps {
  icon: LucideIcon;
  gradient?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { container: 48, icon: 20, particles: 12 },
  md: { container: 64, icon: 28, particles: 16 },
  lg: { container: 80, icon: 36, particles: 20 },
  xl: { container: 96, icon: 44, particles: 24 },
};

export const ParticleIcon = ({ 
  icon: Icon, 
  gradient = "from-primary via-accent to-primary", 
  size = "md",
  animate = true,
  className 
}: ParticleIconProps) => {
  const { container, icon: iconSize, particles: particleCount } = sizeMap[size];
  
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = container / 2 - 10;
      return {
        id: i,
        x: Math.cos(angle) * radius + container / 2,
        y: Math.sin(angle) * radius + container / 2,
        delay: i * 0.05,
        size: Math.random() * 2 + 2,
      };
    });
  }, [container, particleCount]);
  
  return (
    <motion.div
      whileHover={animate ? { scale: 1.1 } : undefined}
      className={cn("relative inline-block", className)}
      style={{
        width: container,
        height: container,
      }}
    >
      {/* Particles */}
      <svg
        width={container}
        height={container}
        className="absolute inset-0"
      >
        <defs>
          <radialGradient id={`particle-${gradient}`}>
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
          </radialGradient>
        </defs>
        
        {/* Connection Lines */}
        {particles.map((p1, i) => {
          const p2 = particles[(i + 1) % particles.length];
          return (
            <motion.line
              key={`line-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              strokeOpacity="0.2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: p1.delay }}
            />
          );
        })}
        
        {/* Particle Dots */}
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill={`url(#particle-${gradient})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={animate ? {
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
            } : { scale: 1, opacity: 0.8 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Center Glow */}
        <motion.circle
          cx={container / 2}
          cy={container / 2}
          r={container / 4}
          fill="hsl(var(--primary))"
          opacity="0.1"
          animate={animate ? {
            r: [container / 4, container / 3, container / 4],
            opacity: [0.1, 0.2, 0.1],
          } : undefined}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
      
      {/* Icon */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          animate={animate ? {
            rotateZ: [0, 360],
            scale: [1, 1.05, 1],
          } : undefined}
          transition={{
            rotateZ: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Icon 
            size={iconSize} 
            className="text-primary"
            style={{ filter: "drop-shadow(0 0 12px hsl(var(--primary) / 0.6))" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
