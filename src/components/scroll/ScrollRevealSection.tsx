import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Define Your Agent",
    description: "Tell us about your business goals and ideal customer interactions"
  },
  {
    number: "02",
    title: "Train on Your Data",
    description: "Upload documents, FAQs, or connect to your knowledge base"
  },
  {
    number: "03",
    title: "Customize Responses",
    description: "Fine-tune tone, qualification criteria, and escalation rules"
  },
  {
    number: "04",
    title: "Deploy Everywhere",
    description: "Launch across all your channels with a single click"
  }
];

export const ScrollRevealSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || cards.length === 0) return;

    gsap.set(cards, { 
      opacity: 0, 
      rotateY: -15,
      scale: 0.9
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "bottom center",
        scrub: 1,
      }
    });

    cards.forEach((card, index) => {
      if (card) {
        tl.to(card, {
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out"
        }, index * 0.2);
      }
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) trigger.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get Started in Minutes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No coding required. Launch your AI agent in four simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto perspective-2000">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="transform-gpu"
            >
              <GlassCard hover className="h-full">
                <div className="flex items-start gap-4">
                  <div className="text-5xl font-bold text-primary/20">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
