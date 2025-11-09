import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  text: string;
  className?: string;
}

export const TextReveal = ({ text, className = "" }: TextRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = container.querySelectorAll('.word');

    gsap.set(words, { opacity: 0.2 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "bottom center",
        scrub: 1,
      }
    });

    words.forEach((word) => {
      tl.to(word, {
        opacity: 1,
        duration: 0.1,
        ease: "none"
      });
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === container) trigger.kill();
      });
    };
  }, [text]);

  const words = text.split(' ');

  return (
    <div ref={containerRef} className={className}>
      {words.map((word, index) => (
        <span key={index} className="word inline-block mr-2">
          {word}
        </span>
      ))}
    </div>
  );
};
