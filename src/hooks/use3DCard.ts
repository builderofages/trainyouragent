import { useRef, useState, useCallback } from "react";

export const use3DCard = (maxTilt: number = 12) => {
  const ref = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      setTilt({
        x: -deltaY * maxTilt,
        y: deltaX * maxTilt,
      });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const style = {
    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return {
    ref,
    style,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
};
