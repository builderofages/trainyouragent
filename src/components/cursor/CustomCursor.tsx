import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<"default" | "hover" | "button" | "text">("default");
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device supports hover (desktop only)
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover) return;

    setIsVisible(true);

    const updateCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement;
      
      // Check if hovering over interactive elements
      if (
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.tagName === "A" ||
        target.closest("a")
      ) {
        setCursorState("button");
        
        // Magnetic effect
        const element = target.closest("button, a") as HTMLElement;
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementCenterX = rect.left + rect.width / 2;
          const elementCenterY = rect.top + rect.height / 2;
          
          const distance = Math.sqrt(
            Math.pow(e.clientX - elementCenterX, 2) + 
            Math.pow(e.clientY - elementCenterY, 2)
          );

          // Apply magnetic pull within 100px
          if (distance < 100) {
            const pullStrength = (100 - distance) / 100;
            const pullX = (elementCenterX - e.clientX) * pullStrength * 0.3;
            const pullY = (elementCenterY - e.clientY) * pullStrength * 0.3;
            
            cursorX.set(e.clientX + pullX);
            cursorY.set(e.clientY + pullY);
          }
        }
      } else if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        setCursorState("text");
      } else if (
        target.tagName === "H1" ||
        target.tagName === "H2" ||
        target.tagName === "H3" ||
        target.tagName === "P"
      ) {
        setCursorState("hover");
      } else {
        setCursorState("default");
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updateCursor);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Hide default cursor
    document.body.style.cursor = "none";
    const allElements = document.querySelectorAll("*");
    allElements.forEach((el) => {
      (el as HTMLElement).style.cursor = "none";
    });

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.body.style.cursor = "auto";
      allElements.forEach((el) => {
        (el as HTMLElement).style.cursor = "auto";
      });
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  const getCursorSize = () => {
    switch (cursorState) {
      case "button":
        return { width: 60, height: 60 };
      case "hover":
        return { width: 40, height: 40 };
      case "text":
        return { width: 2, height: 24 };
      default:
        return { width: 12, height: 12 };
    }
  };

  const size = getCursorSize();

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: size.width,
          height: size.height,
          backgroundColor:
            cursorState === "button"
              ? "rgba(91, 163, 255, 0.4)"
              : "rgba(255, 255, 255, 0.9)",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />

      {/* Trailing Glow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: cursorState === "button" ? 80 : 50,
          height: cursorState === "button" ? 80 : 50,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-xl" />
      </motion.div>

      {/* Outer Ring */}
      {cursorState === "button" && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997] border-2 border-primary/50 rounded-full"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ width: 60, height: 60, opacity: 0 }}
          animate={{ width: 80, height: 80, opacity: 1 }}
          exit={{ width: 60, height: 60, opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Trail Effect */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 pointer-events-none z-[9996] rounded-full bg-primary/10 blur-sm"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            width: 20 - i * 3,
            height: 20 - i * 3,
            opacity: 0.8 - i * 0.15,
          }}
          transition={{
            duration: 0.3 + i * 0.1,
            ease: "easeOut",
            delay: i * 0.02,
          }}
        />
      ))}
    </>
  );
};
