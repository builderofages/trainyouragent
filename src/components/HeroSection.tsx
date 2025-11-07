import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Play, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

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

      <motion.div
        style={{ opacity }}
        className="container mx-auto px-6 relative z-10 pt-32 pb-20"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-full shadow-card">
            <Sparkles className="w-4 h-4 text-primary animate-pulse-slow" />
            <span className="text-sm font-medium text-foreground">
              The Future of Business Automation is Here
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-5xl mx-auto space-y-6 mb-12"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-primary">
              AI Agents
            </span>
            <br />
            <span className="text-foreground">That Think Like</span>
            <br />
            <span className="text-foreground">Your Business</span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Deploy custom AI agents in days, not months. Automate 80% of operations, 
            amplify your genius, and scale without limits.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-full bg-gradient-primary hover:shadow-blue transition-all duration-300 group"
          >
            Discover Your AI Edge
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-6 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-primary/20 hover:border-primary hover:shadow-card transition-all duration-300 group"
          >
            <Play className="w-5 h-5 mr-2" />
            See Agents in Action
          </Button>
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { icon: TrendingUp, stat: "80%", label: "Operations Automated" },
            { icon: Sparkles, stat: "10X", label: "Faster Lead Response" },
            { icon: ArrowRight, stat: "24/7", label: "AI-Powered Support" },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-card hover:shadow-blue transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-black text-foreground">{item.stat}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
