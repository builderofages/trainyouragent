import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface VideoBackgroundProps {
  src?: string;
  poster?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  className?: string;
  children?: React.ReactNode;
  fallbackGradient?: boolean;
}

export const VideoBackground = ({
  src,
  poster,
  overlay = true,
  overlayOpacity = 0.6,
  className = "",
  children,
  fallbackGradient = true,
}: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Play video when in view
  useEffect(() => {
    if (isInView && videoRef.current && isLoaded) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, likely due to browser policies
        setHasError(true);
      });
    }
  }, [isInView, isLoaded]);

  // Pause when out of view
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && videoRef.current) {
        videoRef.current.pause();
      } else if (!document.hidden && videoRef.current && isInView) {
        videoRef.current.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isInView]);

  const showFallback = !src || hasError || !isLoaded;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Fallback animated gradient */}
      {fallbackGradient && showFallback && (
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full opacity-30"
            style={{
              background: "radial-gradient(circle, hsl(220, 60%, 25%) 0%, transparent 70%)",
              left: "20%",
              top: "10%",
            }}
            animate={{
              x: [0, 100, 50, 0],
              y: [0, 50, 100, 0],
              scale: [1, 1.2, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full opacity-25"
            style={{
              background: "radial-gradient(circle, hsl(270, 50%, 20%) 0%, transparent 70%)",
              right: "10%",
              top: "30%",
            }}
            animate={{
              x: [0, -80, -40, 0],
              y: [0, 80, 40, 0],
              scale: [1, 1.15, 1.05, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, hsl(185, 60%, 20%) 0%, transparent 70%)",
              left: "50%",
              bottom: "10%",
            }}
            animate={{
              x: [0, 60, -30, 0],
              y: [0, -60, 30, 0],
              scale: [1, 1.1, 1.2, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          />
        </div>
      )}

      {/* Video element */}
      {src && isInView && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isLoaded && !hasError ? "opacity-100" : "opacity-0"
          }`}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Dark base layer */}
      <div className="absolute inset-0 bg-deep-space" style={{ opacity: showFallback ? 1 : 0 }} />

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-deep-space/80 via-deep-space/60 to-deep-space/90"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
