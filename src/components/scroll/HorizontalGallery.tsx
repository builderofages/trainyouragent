import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { Sparkles, Rocket, Zap, Target, TrendingUp, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Automation",
    description: "Intelligent agents that learn and adapt to your business needs",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Rocket,
    title: "Lightning Fast Setup",
    description: "Go from zero to fully operational in less than 24 hours",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "24/7 Operations",
    description: "Never miss a lead with round-the-clock AI coverage",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Target,
    title: "Smart Lead Qualification",
    description: "Automatically qualify and prioritize high-value prospects",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: TrendingUp,
    title: "Exponential Growth",
    description: "3x your leads without adding headcount or overhead",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Globe,
    title: "Multi-Industry Support",
    description: "Specialized agents for HVAC, accounting, legal, and more",
    color: "from-yellow-500 to-orange-500",
  },
];

export const HorizontalGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;

    if (!container || !scrollContainer) return;

    const totalScrollWidth = scrollContainer.scrollWidth - window.innerWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${totalScrollWidth + window.innerHeight}`,
        invalidateOnRefresh: true,
      },
    });

    tl.to(scrollContainer, {
      x: -totalScrollWidth,
      ease: "none",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-gradient-to-br from-background to-muted/50">
      <div className="absolute inset-0 bg-gradient-mesh opacity-10" />
      
      <div className="container mx-auto px-4 h-screen flex items-center">
        <div className="absolute top-24 left-8 z-10">
          <h2 className="text-5xl font-bold mb-4">
            Why Choose <span className="text-gradient">TrainYourAgent</span>
          </h2>
          <p className="text-xl text-muted-foreground">Scroll to explore our features →</p>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-8 items-center absolute left-0 pl-[50vw]"
          style={{ paddingRight: "50vw" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <GlassCard
                key={index}
                hover
                className="flex-shrink-0 w-[400px] h-[500px] p-8 shadow-dramatic border-2 border-glass-border"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-glow`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute bottom-8 right-8">
                  <span className="text-6xl font-black text-primary/10">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
