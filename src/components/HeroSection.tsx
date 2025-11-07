import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Play, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import InteractiveDemo from "./InteractiveDemo";

const FloatingShape = ({ delay = 0, duration = 20 }: { delay?: number; duration?: number }) => (
  <motion.div
    className="absolute w-32 h-32 bg-gradient-primary opacity-20 rounded-3xl blur-2xl"
    animate={{
      x: [0, 100, 0],
      y: [0, -100, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "linear",
      delay,
    }}
  />
);

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const stats = [
    { icon: TrendingUp, value: "3x", label: "More Leads" },
    { icon: Users, value: "60%", label: "Lower CAC" },
    { icon: Zap, value: "24/7", label: "Coverage" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingShape delay={0} duration={20} />
        <motion.div style={{ y: y1 }} className="absolute top-20 right-20">
          <FloatingShape delay={2} duration={25} />
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute bottom-40 left-20">
          <FloatingShape delay={4} duration={30} />
        </motion.div>
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Business Automation</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Custom AI Agents for{" "}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Every Industry
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
              Train specialized AI agents to capture leads, qualify customers, and automate 
              operations 24/7 — no coding required.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" className="text-lg px-8 h-14 gap-2">
                <Play className="w-5 h-5" />
                See Demo
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                Explore Solutions
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className="text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <InteractiveDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
