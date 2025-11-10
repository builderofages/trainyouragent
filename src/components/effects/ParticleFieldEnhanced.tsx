import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  vx: number;
  vy: number;
}

interface ParticleFieldEnhancedProps {
  count?: number;
  interactive?: boolean;
  connected?: boolean;
  className?: string;
}

export const ParticleFieldEnhanced = ({ 
  count = 80, 
  interactive = true,
  connected = true,
  className = ""
}: ParticleFieldEnhancedProps) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));
  }, [count]);

  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="particle-grad">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
          </radialGradient>
          
          <filter id="particle-glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Connection Lines */}
        {connected && particles.map((p1, i) => {
          return particles.slice(i + 1).map((p2) => {
            const distance = Math.sqrt(
              Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
            );
            
            if (distance < 15) {
              return (
                <motion.line
                  key={`line-${p1.id}-${p2.id}`}
                  x1={`${p1.x}%`}
                  y1={`${p1.y}%`}
                  x2={`${p2.x}%`}
                  y2={`${p2.y}%`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="0.5"
                  strokeOpacity={0.1 * (1 - distance / 15)}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                />
              );
            }
            return null;
          });
        })}
        
        {/* Particles */}
        {particles.map((particle) => {
          const distanceToMouse = interactive
            ? Math.sqrt(
                Math.pow(particle.x - mousePos.x, 2) +
                Math.pow(particle.y - mousePos.y, 2)
              )
            : 100;
          
          const pushAway = distanceToMouse < 10;
          
          return (
            <motion.circle
              key={particle.id}
              cx={`${particle.x}%`}
              cy={`${particle.y}%`}
              r={particle.size}
              fill="url(#particle-grad)"
              filter="url(#particle-glow)"
              animate={pushAway ? {
                cx: `${particle.x + (particle.x - mousePos.x) * 2}%`,
                cy: `${particle.y + (particle.y - mousePos.y) * 2}%`,
              } : {
                cx: [
                  `${particle.x}%`,
                  `${particle.x + particle.vx * 10}%`,
                  `${particle.x}%`,
                ],
                cy: [
                  `${particle.y}%`,
                  `${particle.y + particle.vy * 10}%`,
                  `${particle.y}%`,
                ],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};
