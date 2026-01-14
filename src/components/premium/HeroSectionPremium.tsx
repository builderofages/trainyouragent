import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGradientMesh } from "./AnimatedGradientMesh";
import { ScrollChevron } from "./ScrollChevron";

export const HeroSectionPremium = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedGradientMesh />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Glowing badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.span
            className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase
                       bg-white/5 border border-white/10 text-tech-cyan backdrop-blur-sm"
            animate={{
              boxShadow: [
                "0 0 20px hsla(185, 80%, 50%, 0.2)",
                "0 0 40px hsla(185, 80%, 50%, 0.4)",
                "0 0 20px hsla(185, 80%, 50%, 0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AI That Answers. AI That Closes. AI That Never Sleeps.
          </motion.span>
        </motion.div>

        {/* Main headline - sequential animation */}
        <div className="mb-6">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight"
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Your Phone Rings.
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              We Answer.
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-tech-cyan via-trust-blue to-tech-cyan bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              You Grow.
            </motion.span>
          </motion.h1>
        </div>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          The AI voice agent that handles calls, books appointments, and captures leads 24/7.
          <br className="hidden md:block" />
          No scripts. No hold music. No missed opportunities.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 1.5,
            type: "spring",
            stiffness: 200,
          }}
        >
          <Button
            size="lg"
            onClick={() => scrollToSection("live-demo")}
            className="bg-white text-deep-space hover:bg-white/90 font-semibold px-8 py-6 text-lg
                       shadow-[0_0_40px_hsla(0,0%,100%,0.2)] hover:shadow-[0_0_60px_hsla(0,0%,100%,0.3)]
                       transition-all duration-300"
          >
            Hear It Live
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => scrollToSection("pricing-section")}
            className="border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg
                       backdrop-blur-sm transition-all duration-300
                       hover:border-white/40 hover:shadow-[0_0_30px_hsla(185,80%,50%,0.2)]"
          >
            See Pricing
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-white/50 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-tech-cyan" />
            <span>Live in 5 Days</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-tech-cyan" />
            <span>94% Booking Rate</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-tech-cyan" />
            <span>Enterprise Security</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-tech-cyan" />
            <span>Cancel Anytime</span>
          </div>
        </motion.div>
      </div>

      <ScrollChevron targetId="problem-section" />
    </section>
  );
};
