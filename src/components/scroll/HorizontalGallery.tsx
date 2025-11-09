import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { Zap, Target, BarChart3, MessageSquare, Globe, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "AI responses in milliseconds, not minutes. Your customers never wait."
  },
  {
    icon: Target,
    title: "Precision Targeting",
    description: "Qualify leads with surgical accuracy based on your exact criteria."
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Understand customer behavior with comprehensive interaction data."
  },
  {
    icon: MessageSquare,
    title: "Natural Conversations",
    description: "Human-like dialogue that builds trust and captures intent."
  },
  {
    icon: Globe,
    title: "Multi-Channel",
    description: "Deploy across web, SMS, email, and social media seamlessly."
  },
  {
    icon: Sparkles,
    title: "Auto-Improving",
    description: "AI learns from every interaction to get better over time."
  },
];

export const HorizontalGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const scrollWidth = container.scrollWidth - window.innerWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        end: () => `+=${scrollWidth + 1000}`,
        anticipatePin: 1,
      }
    });

    tl.to(container, {
      x: -scrollWidth,
      ease: "none"
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) trigger.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen bg-gradient-to-br from-muted/30 to-background overflow-hidden">
      <div className="absolute inset-0 flex items-center">
        <div ref={containerRef} className="flex gap-8 px-4 md:px-8">
          <div className="min-w-[300px] md:min-w-[400px] flex items-center">
            <div className="max-w-md">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to automate your business with AI
              </p>
            </div>
          </div>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <GlassCard
                key={index}
                hover
                className="min-w-[300px] md:min-w-[350px] h-[400px] flex flex-col"
              >
                <div className="p-4 bg-primary/10 rounded-lg w-fit mb-6">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground text-lg">
                  {feature.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
