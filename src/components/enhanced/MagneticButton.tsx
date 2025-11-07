import { forwardRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useMagneticHover } from "@/hooks/useMagneticHover";

interface MagneticButtonProps extends ButtonProps {
  strength?: number;
}

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ strength = 15, children, ...props }, forwardedRef) => {
    const { ref, style, onMouseMove, onMouseLeave } = useMagneticHover(strength);

    return (
      <Button
        ref={(node) => {
          ref.current = node as any;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        style={style}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";
