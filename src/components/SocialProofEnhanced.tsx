import { motion } from "framer-motion";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { AnimatedCounter } from "@/components/enhanced/AnimatedCounter";
import { use3DCard } from "@/hooks/use3DCard";

const industryInsights = [
  {
    industry: "HVAC",
    stat: "$180,000",
    description: "Average annual revenue lost by HVAC contractors to missed after-hours calls",
    source: "ACCA Industry Report 2024",
    icon: "🏭",
  },
  {
    industry: "Accounting",
    stat: "67%",
    description: "Of accounting firms struggle with efficient client onboarding and communication",
    source: "AICPA Technology Survey 2024",
    icon: "📊",
  },
  {
    industry: "Legal",
    stat: "42 hours",
    description: "Average time spent monthly on client intake and scheduling by law firms",
    source: "ABA Legal Technology Report",
    icon: "⚖️",
  },
  {
    industry: "Restaurants",
    stat: "30%",
    description: "Of reservation calls go unanswered during peak hours, representing lost revenue",
    source: "National Restaurant Association",
    icon: "🍽️",
  },
  {
    industry: "Healthcare",
    stat: "$150B",
    description: "Lost annually in US healthcare due to administrative inefficiencies",
    source: "JAMA Study 2023",
    icon: "🏥",
  },
  {
    industry: "Roofing",
    stat: "48 hours",
    description: "Average response time to emergency roofing inquiries leads to 60% lead loss",
    source: "IBISWorld Roofing Analysis",
    icon: "🏠",
  },
];

const InsightCard = ({ insight, index }: any) => {
  const { ref, style, onMouseMove, onMouseLeave } = use3DCard(8);

  return (
    <motion.div
      ref={ref as any}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="perspective-1000"
    >
      <GlassCard hover className="relative p-8 shadow-dramatic hover:shadow-glow transition-all duration-500 h-full border-2 border-glass-border">
        {/* Industry Icon */}
        <div className="absolute top-6 right-6 opacity-20 text-5xl">
          {insight.icon}
        </div>

        {/* Stat */}
        <div className="mb-4">
          <div className="text-5xl font-bold text-gradient mb-2">
            {insight.stat}
          </div>
          <span className="px-3 py-1 glass-card text-primary text-xs font-bold rounded-full shadow-glow-sm">
            {insight.industry}
          </span>
        </div>

        {/* Description */}
        <p className="text-foreground text-base mb-4 leading-relaxed relative z-10">
          {insight.description}
        </p>

        {/* Source */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground italic">
            Source: {insight.source}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const SocialProof = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-10" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 rounded-full glass-card text-sm font-medium shadow-glow-sm">
              📊 Industry Data
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            The{" "}
            <span className="text-gradient">
              Opportunity
            </span>
            {" "}by Industry
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Research-backed insights revealing the massive potential of AI automation across sectors
          </p>
        </motion.div>

        {/* Industry Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {industryInsights.map((insight, index) => (
            <InsightCard key={index} insight={insight} index={index} />
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-8">
            The AI automation revolution is here
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: "Avg AI ROI", value: 300, suffix: "%" },
              { label: "Businesses Using AI", value: 35, suffix: "%" },
              { label: "Industries Adopting", value: 12, suffix: "+" },
              { label: "Growth Rate (YoY)", value: 45, suffix: "%" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-center glass-card p-6 rounded-xl shadow-card hover:shadow-dramatic transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    className="text-gradient"
                  />
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
