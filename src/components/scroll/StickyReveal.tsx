import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { ArrowRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const StickyReveal = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const button = buttonRef.current;
    
    if (!section || !title || !subtitle || !button) return;

    gsap.set([title, subtitle, button], { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "center center",
        scrub: 1,
        pin: true,
        pinSpacing: true,
      }
    });

    tl.to(title, { opacity: 1, y: 0, duration: 0.3 })
      .to(subtitle, { opacity: 1, y: 0, duration: 0.3 }, "-=0.1")
      .to(button, { opacity: 1, y: 0, duration: 0.3 }, "-=0.1");

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) trigger.kill();
      });
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Limited Time Offer</span>
          </div>

          <h2 
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            Ready to Transform
            <br />
            <span className="text-gradient">Your Business?</span>
          </h2>

          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Join 10,000+ businesses already using AI agents to capture more leads 
            and close more deals.
          </p>

          <div ref={buttonRef} className="flex flex-wrap gap-4 justify-center">
            <MagneticButton size="lg" className="text-lg px-8 h-14 gap-2 shadow-glow" strength={20}>
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
            <MagneticButton size="lg" variant="outline" className="text-lg px-8 h-14 glass-card" strength={20}>
              Book a Demo
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
};
