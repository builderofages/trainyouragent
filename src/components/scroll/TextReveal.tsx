import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface TextRevealProps {
  children: string;
  className?: string;
  stagger?: number;
}

export const TextReveal = ({ children, className = "", stagger = 0.02 }: TextRevealProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, { type: "chars,words" });

    gsap.from(split.chars, {
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      },
      opacity: 0,
      y: 50,
      rotationX: -90,
      stagger: stagger,
      ease: "back.out(1.7)",
    });

    return () => {
      split.revert();
    };
  }, [children, stagger]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
};
