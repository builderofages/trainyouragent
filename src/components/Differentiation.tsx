import { motion } from "framer-motion";
import { GlassCard } from "./enhanced/GlassCard";
import { Target, Zap, TrendingUp, Shield, Clock, Award } from "lucide-react";

export const Differentiation = () => {
  const differences = [
    {
      icon: Target,
      title: "Research-Backed, Not Hype",
      description: "Every claim sourced from McKinsey, Gartner, CallRail, and Harvard Business Review. No fake testimonials or inflated numbers.",
    },
    {
      icon: Clock,
      title: "3-7 Day Implementation",
      description: "Industry average is 2-4 weeks. We're live faster because we've streamlined the process down to a science.",
    },
    {
      icon: TrendingUp,
      title: "94% Pilot Conversion Rate",
      description: "Our pilot participants convert because they see real revenue increase—not because we pressure them. Results speak louder than sales tactics.",
    },
    {
      icon: Shield,
      title: "Enterprise Security, Small Business Pricing",
      description: "Enterprise-grade security on HIPAA-compliant infrastructure with end-to-end encryption. You get enterprise-level protection without enterprise costs.",
    },
    {
      icon: Award,
      title: "30-Day Risk-Free Pilot",
      description: "Prove the ROI before committing. We're so confident you'll see results that we offer a full 30-day pilot to test it in your business.",
    },
    {
      icon: Zap,
      title: "Continuous Optimization",
      description: "Monthly performance reviews. Regular updates. Your AI gets smarter every month based on real call data and conversion metrics.",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How We're <span className="text-gradient">Actually Different</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No marketing fluff. Just honest differentiators that make your implementation successful.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {differences.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover className="p-8 h-full group">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
