// src/components/visual/GlassCard.tsx
// v73-B — 2040 visual layer.
//
// Reusable glass-morphism card primitive. Two variants:
//   light  → over white/hero (default)
//   dark   → over navy sections
//
// Drop-in replacement for existing card patterns. We deliberately keep
// the API tiny — `as`, `variant`, `className`, plus any DOM props.
// Existing cards aren't refactored yet; this is just available for
// new compositions in v73-B and beyond.

import React, { forwardRef } from "react";

type Variant = "light" | "dark";

type GlassCardProps<E extends React.ElementType = "div"> = {
  as?: E;
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<E>, "as" | "variant" | "className" | "children">;

const VARIANT: Record<Variant, string> = {
  light:
    "bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl ring-1 ring-[#042C53]/5",
  dark:
    "bg-[#042C53]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl ring-1 ring-white/5 text-white",
};

function GlassCardInner<E extends React.ElementType = "div">(
  { as, variant = "light", className = "", children, ...rest }: GlassCardProps<E>,
  ref: React.Ref<Element>,
) {
  const Tag = (as ?? "div") as React.ElementType;
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`${VARIANT[variant]} ${className}`.trim()}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Tag>
  );
}

// forwardRef preserves ref typing for the common <div> case.
export const GlassCard = forwardRef(GlassCardInner) as <E extends React.ElementType = "div">(
  props: GlassCardProps<E> & { ref?: React.Ref<Element> },
) => React.ReactElement | null;

export default GlassCard;
