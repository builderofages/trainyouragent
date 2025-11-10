import { motion } from "framer-motion";
import { GlassCard } from "./enhanced/GlassCard";
import { X, Check, TrendingDown, TrendingUp, Clock, DollarSign, Users, Zap } from "lucide-react";
import { MagneticButton } from "./enhanced/MagneticButton";
import { siteConfig } from "@/config/site";

const comparisons = [
  {
    category: "Response Time",
    icon: Clock,
    before: {
      value: "4-24 hours",
      description: "Missed calls, delayed responses, lost opportunities",
      metric: "Average response time"
    },
    after: {
      value: "< 30 seconds",
      description: "Instant engagement 24/7, every inquiry answered immediately",
      metric: "AI response time"
    },
    improvement: "96% faster"
  },
  {
    category: "Lead Conversion",
    icon: TrendingUp,
    before: {
      value: "12-18%",
      description: "Manual qualification, inconsistent follow-up",
      metric: "Conversion rate"
    },
    after: {
      value: "40-55%",
      description: "AI qualification, instant scheduling, perfect follow-up",
      metric: "Conversion rate"
    },
    improvement: "3x higher"
  },
  {
    category: "Cost Per Lead",
    icon: DollarSign,
    before: {
      value: "$280-$450",
      description: "High ad spend, wasted budget on unqualified leads",
      metric: "Average CPL"
    },
    after: {
      value: "$45-$85",
      description: "Lower ad costs, only qualified leads, better ROI",
      metric: "Average CPL"
    },
    improvement: "82% cheaper"
  },
  {
    category: "Coverage",
    icon: Users,
    before: {
      value: "9am-6pm",
      description: "Business hours only, weekends and evenings lost",
      metric: "Availability"
    },
    after: {
      value: "24/7/365",
      description: "Maximize lead capture with 24/7 availability",
      metric: "Availability"
    },
    improvement: "3x coverage"
  }
];

const BeforeAfter = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background effects */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-destructive/5 via-primary/5 to-accent/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">The Transformation</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Before AI vs After AI
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See the dramatic difference AI agents make in real business metrics
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto space-y-6">
          {comparisons.map((comparison, index) => {
            const Icon = comparison.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard className="p-6 md:p-8 hover-lift">
                  <div className="grid md:grid-cols-[200px,1fr,auto,1fr] gap-6 items-center">
                    {/* Category */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{comparison.category}</h3>
                      </div>
                    </div>

                    {/* Before */}
                    <div className="relative">
                      <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                        <X className="w-4 h-4 text-destructive" />
                      </div>
                      <div className="pl-8">
                        <div className="text-sm text-muted-foreground mb-1">
                          {comparison.before.metric}
                        </div>
                        <div className="text-3xl font-bold text-destructive/80 mb-2 flex items-center gap-2">
                          {comparison.before.value}
                          <TrendingDown className="w-5 h-5" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {comparison.before.description}
                        </p>
                      </div>
                    </div>

                    {/* Arrow & Improvement */}
                    <div className="hidden md:flex flex-col items-center justify-center px-6">
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-4xl mb-2"
                      >
                        →
                      </motion.div>
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-bold whitespace-nowrap">
                        {comparison.improvement}
                      </div>
                    </div>

                    {/* After */}
                    <div className="relative">
                      <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <div className="pl-8">
                        <div className="text-sm text-muted-foreground mb-1">
                          {comparison.after.metric}
                        </div>
                        <div className="text-3xl font-bold text-gradient mb-2 flex items-center gap-2">
                          {comparison.after.value}
                          <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {comparison.after.description}
                        </p>
                      </div>
                    </div>
                  </div>
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
          className="text-center mt-16"
        >
          <div className="inline-block glass-card p-8 rounded-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Make the Switch?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg">
              Join thousands of businesses that have transformed their lead generation with AI
            </p>
            <MagneticButton
              size="lg"
              className="text-lg px-8 h-14 gap-2 shadow-glow"
              onClick={() => window.open(siteConfig.bookingUrl, '_blank')}
            >
              Book a Free Consultation
            </MagneticButton>
            <p className="text-xs text-muted-foreground mt-4">
              No credit card required for consultation
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BeforeAfter;
