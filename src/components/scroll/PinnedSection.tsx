import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PinnedSectionProps {
  children: ReactNode;
  duration?: number;
  className?: string;
}

export const PinnedSection = ({ children, duration = 1, className = "" }: PinnedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: "top top",
        end: `+=${window.innerHeight * duration}`,
      },
    });

    tl.from(content, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
    })
      .to(content, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
      });

    return () => {
      tl.kill();
    };
  }, [duration]);

  return (
    <section ref={sectionRef} className={`relative h-screen ${className}`}>
      <div ref={contentRef} className="h-full flex items-center justify-center">
        {children}
      </div>
    </section>
  );
};
