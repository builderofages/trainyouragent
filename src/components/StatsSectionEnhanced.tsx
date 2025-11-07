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
    label: "Increase in Leads",
    description: "Average growth in qualified leads within 90 days",
  },
  {
    icon: DollarSign,
    value: 60,
    suffix: "%",
    label: "Lower Customer Acquisition Cost",
    description: "Reduce CAC through automated qualification",
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "Availability",
    description: "Never miss a lead with round-the-clock coverage",
  },
  {
    icon: Users,
    value: 1000,
    suffix: "+",
    label: "Active Businesses",
    description: "Growing community of AI-powered operations",
  },
  {
    icon: CheckCircle,
    value: 95,
    suffix: "%",
    label: "Satisfaction Rate",
    description: "Industry-leading customer satisfaction",
  },
  {
    icon: Zap,
    value: 10,
    suffix: "x",
    label: "Faster Response Time",
    description: "Instant responses to customer inquiries",
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
        <p className="text-sm text-muted-foreground">{stat.description}</p>
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
            Numbers That{" "}
            <span className="text-gradient">Speak Volumes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of businesses transforming operations with AI agents
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
          <p className="text-sm text-muted-foreground mb-6">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {["TechCorp", "BuildPro", "ServiceMax", "AutoFlow", "DataSync"].map((company) => (
              <motion.span
                key={company}
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="text-lg font-semibold transition-opacity"
              >
                {company}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
