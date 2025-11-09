import { ReactNode } from "react";
import { CustomCursor } from "./CustomCursor";

interface CursorProviderProps {
  children: ReactNode;
}

export const CursorProvider = ({ children }: CursorProviderProps) => {
  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
};
