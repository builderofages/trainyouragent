import { ReactNode, useEffect } from "react";
import { CustomCursor } from "./CustomCursor";

interface CursorProviderProps {
  children: ReactNode;
}

export const CursorProvider = ({ children }: CursorProviderProps) => {
  useEffect(() => {
    // Only enable on desktop devices with hover support
    const hasHover = window.matchMedia("(hover: hover)").matches;
    
    if (hasHover) {
      // Add class to body for cursor styling
      document.body.classList.add("custom-cursor");
    }

    return () => {
      document.body.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <>
      {children}
      <CustomCursor />
    </>
  );
};
