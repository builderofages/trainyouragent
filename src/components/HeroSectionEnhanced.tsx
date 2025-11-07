import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Play, TrendingUp, Users, Zap } from "lucide-react";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { GlassCard } from "@/components/enhanced/GlassCard";
import InteractiveDemo from "./InteractiveDemo";
import { ParticleField } from "./effects/ParticleField";

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 250]);
  const y2 = useTransform(scrollY, [0, 500], [0, -200]);
  const y3 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const blur = useTransform(scrollY, [0, 300], [0, 10]);

  const stats = [
    { icon: TrendingUp, value: "3x", label: "More Leads" },
    { icon: Users, value: "60%", label: "Lower CAC" },
    { icon: Zap, value: "24/7", label: "Coverage" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Vibrant Animated Background with Parallax */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        style={{ scale: useTransform(scrollY, [0, 500], [1, 1.2]) }}
      />
      
      {/* Floating Particles */}
      <ParticleField />
      
      {/* Large Animated Orbs with Parallax */}
      <motion.div
        style={{ y: y1, opacity }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y2, opacity }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -100, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent/40 to-primary/40 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y3, scale: useTransform(scrollY, [0, 500], [1, 1.5]) }}
        animate={{
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"
      />

      {/* Animated Mesh Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-mesh"
        style={{ opacity }}
      />

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
            style={{ 
              scale,
              filter: useTransform(blur, (v) => `blur(${v}px)`)
            }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 shadow-glow-sm"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">AI-Powered Business Automation</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Custom AI Agents for{" "}
              <motion.span 
                className="text-gradient"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Every Industry
              </motion.span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Train specialized AI agents to capture leads, qualify customers, and automate 
              operations 24/7 — no coding required.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <MagneticButton size="lg" className="text-lg px-8 h-14 gap-2 shadow-blue hover:shadow-glow" strength={20}>
                <Play className="w-5 h-5" />
                See Demo
              </MagneticButton>
              <MagneticButton size="lg" variant="outline" className="text-lg px-8 h-14 glass-card" strength={20}>
                Explore Solutions
              </MagneticButton>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="text-left perspective-1000"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <div className="text-3xl font-bold text-gradient">{stat.value}</div>
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
            className="perspective-2000"
          >
            <motion.div
              whileHover={{ scale: 1.02, rotateY: 2 }}
              transition={{ duration: 0.3 }}
              className="tilt-3d"
            >
              <InteractiveDemo />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
