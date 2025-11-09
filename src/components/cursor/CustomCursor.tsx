import { useEffect, useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'button' | 'text'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const trailRefs = useRef<{ x: number; y: number }[]>(Array(5).fill({ x: 0, y: 0 }));

  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    // Only show on desktop with hover capability
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    setIsVisible(true);
    document.body.classList.add('custom-cursor');

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Update trail positions
      trailRefs.current = [
        { x: e.clientX, y: e.clientY },
        ...trailRefs.current.slice(0, -1)
      ];
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        setCursorState('button');
        
        // Magnetic effect
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );

        if (distance < 100) {
          const pullStrength = (100 - distance) / 100;
          cursorX.set(e.clientX + (centerX - e.clientX) * pullStrength * 0.3);
          cursorY.set(e.clientY + (centerY - e.clientY) * pullStrength * 0.3);
        }
      } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setCursorState('text');
      } else if (target.tagName === 'H1' || target.tagName === 'H2' || target.tagName === 'H3' || target.tagName === 'P') {
        setCursorState('hover');
      } else {
        setCursorState('default');
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('custom-cursor');
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  const cursorSize = cursorState === 'button' ? 60 : cursorState === 'hover' ? 40 : 20;
  const cursorColor = cursorState === 'button' ? 'hsl(var(--primary))' : 'hsl(var(--foreground))';

  return (
    <>
      {/* Main cursor */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
        }}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      >
        <motion.div
          animate={{
            width: cursorSize,
            height: cursorSize,
            backgroundColor: cursorColor,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            boxShadow: `0 0 20px ${cursorColor}`,
          }}
        />
      </motion.div>

      {/* Glow trail */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
        }}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
      >
        <motion.div
          animate={{
            scale: cursorState === 'button' ? 1.5 : 1,
          }}
          className="w-32 h-32 rounded-full -translate-x-1/2 -translate-y-1/2 bg-primary/20 blur-2xl"
        />
      </motion.div>

      {/* Trail dots */}
      {trailRefs.current.slice(1).map((pos, index) => (
        <motion.div
          key={index}
          animate={{
            x: pos.x,
            y: pos.y,
            opacity: 0.3 - index * 0.06,
            scale: 1 - index * 0.15,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9997] -translate-x-1/2 -translate-y-1/2"
        />
      ))}
    </>
  );
};
