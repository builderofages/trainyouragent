import { motion } from "framer-motion";
import { TrendingUp, Users, Zap, DollarSign, Clock, CheckCircle } from "lucide-react";
import { AnimatedCounter } from "@/components/enhanced/AnimatedCounter";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { use3DCard } from "@/hooks/use3DCard";

const stats = [
  {
    icon: TrendingUp,
    value: 300,
    suffix: "%",
    label: "Average AI Automation ROI",
    description: "McKinsey Global Institute reports typical 300% ROI for AI automation",
    source: "McKinsey AI Report 2024",
  },
  {
    icon: DollarSign,
    value: 47,
    suffix: "B",
    label: "Lost to Missed Calls Annually",
    description: "Businesses lose $47B yearly from unanswered customer calls",
    source: "Harvard Business Review",
  },
  {
    icon: Clock,
    value: 5,
    suffix: " min",
    label: "Lead Response Time Critical",
    description: "Leads contacted within 5 minutes are 9x more likely to convert",
    source: "InsideSales.com Study",
  },
  {
    icon: Users,
    value: 73,
    suffix: "%",
    label: "Of Leads Come After Hours",
    description: "Most customer inquiries happen outside business hours",
    source: "CallRail Industry Data",
  },
  {
    icon: CheckCircle,
    value: 80,
    suffix: "%",
    label: "AI Interactions by 2025",
    description: "Gartner predicts 80% of customer interactions will be AI-powered",
    source: "Gartner CX Research",
  },
  {
    icon: Zap,
    value: 24,
    suffix: "/7",
    label: "Always-On Availability",
    description: "AI agents provide instant response at any hour, any day",
    source: "Industry Standard",
  },
];

const StatCard = ({ stat, index }: { stat: any; index: number }) => {
  const { ref, style, onMouseMove, onMouseLeave } = use3DCard(8);
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref as any}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="perspective-1000"
    >
      <GlassCard hover className="text-center group cursor-pointer hover-lift h-full">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:shadow-glow-sm"
        >
          <Icon className="w-8 h-8 text-primary" />
        </motion.div>
        <div className="text-4xl font-bold mb-2">
                <AnimatedCounter
            end={stat.value}
            suffix={stat.suffix}
            className="text-gradient"
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
        <p className="text-sm text-muted-foreground mb-3">{stat.description}</p>
        <p className="text-xs text-muted-foreground/70 italic">Source: {stat.source}</p>
      </GlassCard>
    </motion.div>
  );
};

const StatsSection = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 rounded-full glass-card text-sm font-medium shadow-glow-sm">
              Proven Results
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The AI Automation{" "}
            <span className="text-gradient">Opportunity</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Industry research reveals the massive potential of AI automation
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* Trusted By Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-6">Research sources we trust</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {["McKinsey", "Gartner", "Harvard Business Review", "Forrester", "InsideSales"].map((source) => (
              <motion.span
                key={source}
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="text-lg font-semibold transition-opacity"
              >
                {source}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
