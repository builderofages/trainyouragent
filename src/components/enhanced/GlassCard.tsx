import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, hover = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card rounded-xl p-6 transition-all duration-300",
          hover && "hover:glass-card-hover hover:shadow-dramatic",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
