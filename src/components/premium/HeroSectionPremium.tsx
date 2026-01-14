import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollChevron } from "./ScrollChevron";

const rotatingWords = [
  { word: "Effortlessly.", tagline: "Watch AI handle your calls in real-time" },
  { word: "Faster.", tagline: "Every ring answered in under 1 second" },
  { word: "Smarter.", tagline: "Conversations that actually convert" },
  { word: "24/7.", tagline: "Never miss another opportunity" },
  { word: "Automatically.", tagline: "Set it up once, profit forever" },
];

export const HeroSectionPremium = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-deep-space">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, hsl(220, 60%, 25%) 0%, transparent 70%)",
            left: "20%",
            top: "10%",
          }}
          animate={{
            x: [0, 100, 50, 0],
            y: [0, 50, 100, 0],
            scale: [1, 1.2, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, hsl(185, 60%, 30%) 0%, transparent 70%)",
            right: "10%",
            bottom: "20%",
          }}
          animate={{
            x: [0, -80, -40, 0],
            y: [0, 80, 40, 0],
            scale: [1, 1.15, 1.05, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
      
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

        {/* Main headline */}
        <div className="mb-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight">
            <span className="block">Your Phone Rings.</span>
            <span className="block">We Answer.</span>
          </h1>
        </div>

        {/* You Grow + Rotating Keywords */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-tech-cyan via-trust-blue to-tech-cyan bg-clip-text text-transparent">
              You Grow
            </span>
            <span className="ml-2 inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIndex}
                  className="inline-block bg-gradient-to-r from-white via-tech-cyan to-white bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {rotatingWords[currentIndex].word}
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>
        </div>

        {/* Synced Tagline */}
        <div className="mb-10 h-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              className="text-lg md:text-xl text-white/70 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {rotatingWords[currentIndex].tagline}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Premium CTA Button */}
        <div className="flex flex-col items-center justify-center gap-6 mb-12">
          <Button
            size="lg"
            onClick={() => scrollToSection("live-demo")}
            className="group relative overflow-hidden bg-gradient-to-r from-tech-cyan to-primary 
                       text-deep-space font-bold px-10 py-7 text-xl rounded-full
                       shadow-[0_0_40px_hsla(185,80%,50%,0.4)] 
                       hover:shadow-[0_0_60px_hsla(185,80%,50%,0.6)]
                       transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                             -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Play className="mr-3 h-6 w-6 fill-current relative z-10" />
            <span className="relative z-10">Hear It Live</span>
            <ArrowRight className="ml-3 h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform" />
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
        </div>

        {/* Single elegant social proof */}
        <p className="text-white/50 text-sm tracking-wide">
          Trusted by <span className="text-white font-semibold">200+</span> businesses to never miss a call
        </p>
      </div>

      <ScrollChevron targetId="problem-section" />
    </section>
  );
};
