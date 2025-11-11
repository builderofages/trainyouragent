import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Play, TrendingUp, Users, Zap } from "lucide-react";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { VoiceAgentDemo } from "./VoiceAgentDemo";
import { TrustBadges } from "./conversion/TrustBadges";
import { RiskReversal } from "./RiskReversal";
import { StrategySessionLeadGate } from "@/components/conversion/StrategySessionLeadGate";
import { useState } from "react";
import { trackEvent } from "@/lib/tracking";

const HeroSection = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  const stats = [
    { icon: TrendingUp, value: "94%", label: "Pilot Conversion" },
    { icon: Users, value: "3-7", label: "Days to Go Live" },
    { icon: Zap, value: "24/7", label: "AI Coverage" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Neutral Elegant Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-slate-100" />
      
      {/* Subtle Animated Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-slate-300/8 to-gray-400/8 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-gray-300/10 to-slate-400/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-2xl"
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
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-12 md:pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ scale }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full glass-card mb-6 md:mb-8 shadow-glow-sm"
            >
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary animate-pulse" />
              <span className="text-xs md:text-sm font-medium">AI-Powered Business Automation</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4 md:mb-6">
              Custom AI Agents for{" "}
              <span className="text-gradient-premium">
                Every Industry
              </span>
            </h1>

            <p className="text-base md:text-xl lg:text-2xl text-muted-foreground mb-6 md:mb-8 max-w-2xl leading-relaxed">
              Industry research shows 300% average ROI for AI automation. Capture every lead, 
              qualify customers instantly, and automate operations 24/7.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 mb-8 md:mb-12">
              <MagneticButton 
                size="lg" 
                className="text-base md:text-lg px-6 md:px-8 h-12 md:h-14 gap-2 shadow-premium hover:shadow-glow-intense bg-gradient-premium relative overflow-hidden group w-full sm:w-auto" 
                strength={25}
                onClick={() => {
                  trackEvent('cta_clicked', { location: 'hero_primary' });
                  setLeadGateOpen(true);
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-shimmer opacity-0 group-hover:opacity-100"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <Play className="w-4 h-4 md:w-5 md:h-5 relative z-10" />
                <span className="relative z-10">Book a Demo</span>
              </MagneticButton>
              <MagneticButton 
                size="lg" 
                variant="outline" 
                className="text-base md:text-lg px-6 md:px-8 h-12 md:h-14 glass-card-premium border-gradient w-full sm:w-auto" 
                strength={25}
                onClick={() => {
                  const element = document.querySelector('#solutions');
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Explore Solutions
              </MagneticButton>
            </div>

            {/* Risk Reversal */}
            <div className="mb-8">
              <RiskReversal />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 pt-6 md:pt-8 border-t border-border/50">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.08, y: -6 }}
                    className="text-left perspective-1000 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-premium flex items-center justify-center shadow-glow-sm group-hover:shadow-glow"
                      >
                        <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </motion.div>
                      <div className="text-2xl md:text-4xl font-black text-gradient-premium">{stat.value}</div>
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column - Voice Agent Demo */}
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
              <VoiceAgentDemo />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <StrategySessionLeadGate 
        open={leadGateOpen}
        onOpenChange={setLeadGateOpen}
      />
    </section>
  );
};

export default HeroSection;
