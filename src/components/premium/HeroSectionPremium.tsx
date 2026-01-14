import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Shield, RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollChevron } from "./ScrollChevron";
import { VideoBackground } from "@/components/performance/VideoBackground";
import heroVideo from "/videos/hero-bg.mp4";

export const HeroSectionPremium = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background with fallback */}
      <VideoBackground
        src={heroVideo}
        overlay
        overlayOpacity={0.7}
        fallbackGradient
        className="absolute inset-0"
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Subtle enterprise badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-medium tracking-[0.2em] uppercase
                       bg-white/5 border border-white/10 text-white/60 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-success-green animate-pulse" />
            Enterprise AI • Live in 5 Days
          </motion.span>
        </motion.div>

        {/* Main headline - sequential animation */}
        <div className="mb-6">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight"
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Your Phone Rings.
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              We Answer.
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-tech-cyan via-trust-blue to-tech-cyan bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              You Grow.
            </motion.span>
          </motion.h1>
        </div>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          AI voice agents that handle calls, book appointments, and capture leads 24/7.
          <br className="hidden md:block" />
          <span className="text-white/80">No scripts. No hold music. No missed opportunities.</span>
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
            className="group bg-white text-deep-space hover:bg-white/90 font-semibold px-8 py-6 text-lg
                       shadow-[0_0_40px_hsla(0,0%,100%,0.2)] hover:shadow-[0_0_60px_hsla(0,0%,100%,0.3)]
                       transition-all duration-300"
          >
            <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Hear It Live
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
          <div className="flex items-center gap-2 hover:text-white/70 transition-colors">
            <Zap className="h-4 w-4 text-tech-cyan" />
            <span>Live in 5 Days</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-2 hover:text-white/70 transition-colors">
            <Target className="h-4 w-4 text-tech-cyan" />
            <span>94% Booking Rate</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-2 hover:text-white/70 transition-colors">
            <Shield className="h-4 w-4 text-tech-cyan" />
            <span>Enterprise Security</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-2 hover:text-white/70 transition-colors">
            <RotateCcw className="h-4 w-4 text-tech-cyan" />
            <span>Cancel Anytime</span>
          </div>
        </motion.div>
      </div>

      <ScrollChevron targetId="problem-section" />
    </section>
  );
};
