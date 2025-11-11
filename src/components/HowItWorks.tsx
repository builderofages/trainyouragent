import { motion } from "framer-motion";
import { GlassCard } from "./enhanced/GlassCard";
import { Rocket, Brain, Zap, TrendingUp, ArrowRight } from "lucide-react";
import { MagneticButton } from "./enhanced/MagneticButton";
import { siteConfig } from "@/config/site";

const steps = [
  {
    number: "01",
    icon: Rocket,
    title: "Sign Up & Onboard",
    description: "Quick 5-minute setup. Tell us about your business, your goals, and your ideal customers. No technical knowledge required.",
    duration: "5 minutes",
    color: "from-blue-500 to-cyan-500"
  },
  {
    number: "02",
    icon: Brain,
    title: "Discovery & Planning Call",
    description: "We schedule a discovery call to understand your business needs, then create a custom implementation timeline. Setup typically takes 3-7 days depending on complexity and customization requirements.",
    duration: "3-7 days",
    color: "from-purple-500 to-pink-500"
  },
  {
    number: "03",
    icon: Zap,
    title: "Go Live",
    description: "Your AI agent starts capturing and qualifying leads 24/7. Get real-time notifications and integrate with your existing CRM or Monday.com.",
    duration: "Instant",
    color: "from-orange-500 to-red-500"
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Scale & Optimize",
    description: "Watch your leads grow while we continuously optimize your agent's performance based on real conversations and conversion data.",
    duration: "Ongoing",
    color: "from-green-500 to-teal-500"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden" id="how-it-works">
      {/* Animated background gradients */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From setup to scale in 4 simple steps. We handle the complexity, you get the results.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GlassCard className="p-8 h-full hover-lift relative overflow-hidden group">
                    {/* Step number background */}
                    <div className="absolute -right-4 -top-4 text-[120px] font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                      {step.number}
                    </div>

                    {/* Icon with gradient */}
                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 mb-6`}>
                      <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold">{step.title}</h3>
                        <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow connector for non-last items */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                        <ArrowRight className="w-8 h-8 text-primary/30" />
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <MagneticButton
              size="lg"
              className="text-lg px-8 h-14 gap-2 shadow-glow"
              onClick={() => window.open(siteConfig.bookingUrl, '_blank')}
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Setup in 5 minutes
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
