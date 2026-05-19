// src/components/visual/MeshGradientBackdrop.tsx
// v73-B — 2040 visual layer.
//
// Animated mesh-gradient backdrop. Three blurred radial blobs drift slowly
// in different vectors over a navy-tinted ground. Pure CSS keyframes on
// GPU transforms (no JS animation loop, no canvas). Respects
// prefers-reduced-motion via the .v73-* rules in index.css.
//
// Mount inside a `relative` parent. It pins itself to inset-0 at -z-10.
// Pointer-events are off so it never intercepts clicks.

import { memo } from "react";

type Props = {
  /** Optional intensity multiplier 0.5–1.5. Default 1. Lets darker sections dim it. */
  intensity?: number;
  /** Variant: "light" over white hero (default), "dark" over navy section. */
  variant?: "light" | "dark";
  className?: string;
};

function MeshGradientBackdropImpl({ intensity = 1, variant = "light", className = "" }: Props) {
  const isDark = variant === "dark";

  const blob1Bg = isDark
    ? "radial-gradient(circle, rgba(24,95,165,0.55) 0%, rgba(24,95,165,0) 70%)"
    : "radial-gradient(circle, rgba(24,95,165,0.35) 0%, rgba(24,95,165,0) 70%)";
  const blob2Bg = isDark
    ? "radial-gradient(circle, rgba(133,183,235,0.30) 0%, rgba(133,183,235,0) 70%)"
    : "radial-gradient(circle, rgba(230,241,251,0.55) 0%, rgba(230,241,251,0) 70%)";
  const blob3Bg = isDark
    ? "radial-gradient(circle, rgba(4,44,83,0.45) 0%, rgba(4,44,83,0) 70%)"
    : "radial-gradient(circle, rgba(4,44,83,0.18) 0%, rgba(4,44,83,0) 70%)";

  // Cap intensity to avoid catastrophic visuals on tweak.
  const op1 = Math.min(0.6, 0.35 * intensity);
  const op2 = Math.min(0.55, 0.30 * intensity);
  const op3 = Math.min(0.5, 0.22 * intensity);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Optional dark base wash */}
      {isDark && (
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #042C53 0%, #0A3D6E 100%)" }} />
      )}

      {/* Blob 1 — primary navy bloom, drifts top-left to bottom-right */}
      <div
        className="absolute v73-drift-1 rounded-full blur-3xl"
        style={{
          top: "-10%",
          left: "-10%",
          width: "62vw",
          height: "62vw",
          maxWidth: "900px",
          maxHeight: "900px",
          minWidth: "320px",
          minHeight: "320px",
          background: blob1Bg,
          opacity: op1,
        }}
      />

      {/* Blob 2 — pale highlight, drifts reverse */}
      <div
        className="absolute v73-drift-2 rounded-full blur-3xl"
        style={{
          bottom: "-15%",
          right: "-10%",
          width: "55vw",
          height: "55vw",
          maxWidth: "800px",
          maxHeight: "800px",
          minWidth: "280px",
          minHeight: "280px",
          background: blob2Bg,
          opacity: op2,
        }}
      />

      {/* Blob 3 — deeper navy accent, slow vertical drift */}
      <div
        className="absolute v73-drift-3 rounded-full blur-3xl"
        style={{
          top: "30%",
          left: "35%",
          width: "45vw",
          height: "45vw",
          maxWidth: "700px",
          maxHeight: "700px",
          minWidth: "240px",
          minHeight: "240px",
          background: blob3Bg,
          opacity: op3,
        }}
      />
    </div>
  );
}

export const MeshGradientBackdrop = memo(MeshGradientBackdropImpl);
export default MeshGradientBackdrop;
