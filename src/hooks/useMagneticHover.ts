import { useRef, useState, useCallback } from "react";

export const useMagneticHover = (strength: number = 20) => {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;

      setPosition({
        x: deltaX * strength,
        y: deltaY * strength,
      });
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return {
    ref,
    style,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
};
