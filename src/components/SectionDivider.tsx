// src/components/SectionDivider.tsx
// v44: thin animated gradient bar used between major sections.
// Falls back to a static gradient when prefers-reduced-motion is set.

export default function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full h-px overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes tya-divider-shift { 0% { background-position: 0% 0; } 100% { background-position: 200% 0; } }
          .tya-divider { animation: tya-divider-shift 6s linear infinite; }
        }
      `}</style>
      <div
        className="tya-divider absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(24,95,165,0) 0%, rgba(24,95,165,0.45) 50%, rgba(24,95,165,0) 100%)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}
