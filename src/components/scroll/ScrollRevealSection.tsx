import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { Brain, Code, Cpu, Database } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Brain,
    title: "1. Define Your Needs",
    description: "Tell us about your business, industry, and pain points",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Code,
    title: "2. AI Training",
    description: "We train your custom agent on your specific workflows",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Cpu,
    title: "3. Integration",
    description: "Seamlessly connect to your existing tools and systems",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Database,
    title: "4. Launch & Scale",
    description: "Go live and watch your operations transform",
    color: "from-green-500 to-emerald-500",
  },
];

export const ScrollRevealSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: "top top",
        end: "+=3000",
      },
    });

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      tl.from(
        card,
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotationX: -45,
        },
        index * 0.3
      ).to(
        card,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
        },
        index * 0.3 + 0.1
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-gradient-to-b from-background to-muted/30">
      <div className="absolute inset-0 bg-gradient-mesh opacity-10" />
      
      <div className="container mx-auto px-4 h-screen flex flex-col justify-center">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-16">
          How It <span className="text-gradient">Works</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-2000">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
              >
                <GlassCard hover className="h-full p-8 shadow-dramatic border-2 border-glass-border">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-glow`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
