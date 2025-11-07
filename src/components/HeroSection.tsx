import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, ArrowRight } from "lucide-react";

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-neon rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      <ParticleBackground />
      
      <div className="container relative z-10 px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/30 mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-neon" />
            <span className="text-sm font-medium text-foreground">AI That Thinks Like Your Business</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-foreground leading-tight"
          >
            Unleash AI Agents That{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-neon">
                Revolutionize
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-neon"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </span>{" "}
            Your Business
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-medium"
          >
            Automate the mundane, amplify your genius. Deploy in days, dominate your niche.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow text-lg px-8 py-6 rounded-2xl font-bold"
            >
              <span className="relative z-10 flex items-center gap-2">
                Discover Your AI Edge
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-20"
                whileHover={{ scale: 1.05 }}
              />
            </Button>

            <Button 
              size="lg" 
              variant="outline" 
              className="group border-2 border-neon text-foreground hover:bg-neon/10 text-lg px-8 py-6 rounded-2xl font-bold backdrop-blur-sm"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon group-hover:animate-glow-pulse" />
                See Agents in Action
              </span>
            </Button>
          </motion.div>

          {/* Floating metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { label: "Ops Automated", value: "80%" },
              { label: "Faster Leads", value: "10X" },
              { label: "Client Success", value: "95%" },
              { label: "Deploy Time", value: "3 Days" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="relative group"
              >
                <div className="bg-card/50 backdrop-blur-md rounded-2xl p-6 border border-border/50 hover:border-neon/50 transition-all hover:shadow-glow">
                  <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-neon mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
