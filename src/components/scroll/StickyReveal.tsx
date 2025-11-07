import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "@/components/enhanced/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

export const StickyReveal = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;

    if (!section || !title || !subtitle || !cta) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: "top top",
        end: "+=2000",
      },
    });

    tl.from(title, {
      scale: 0.5,
      opacity: 0,
      y: 100,
      duration: 0.5,
    })
      .from(
        subtitle,
        {
          opacity: 0,
          y: 50,
          duration: 0.3,
        },
        "-=0.2"
      )
      .from(
        cta,
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
        },
        "-=0.1"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5"
    >
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2
          ref={titleRef}
          className="text-6xl md:text-8xl font-black mb-8 leading-tight"
        >
          Ready to{" "}
          <span className="text-gradient">Transform</span>
          <br />
          Your Business?
        </h2>
        
        <p
          ref={subtitleRef}
          className="text-2xl md:text-3xl text-muted-foreground mb-12 max-w-3xl mx-auto"
        >
          Join 10,000+ businesses already using AI to scale operations and maximize revenue
        </p>
        
        <div ref={ctaRef} className="flex flex-wrap gap-6 justify-center">
          <MagneticButton
            size="lg"
            className="text-xl px-12 h-16 shadow-glow hover:shadow-glow transition-all duration-300"
            strength={25}
          >
            Start Free Trial
          </MagneticButton>
          <MagneticButton
            size="lg"
            variant="outline"
            className="text-xl px-12 h-16 glass-card"
            strength={25}
          >
            Book Demo
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};
