import { motion } from "framer-motion";
import { Shield, TrendingUp, Clock } from "lucide-react";

export const RiskReversal = () => {
  const guarantees = [
    {
      icon: Shield,
      title: "Flexible Pilot Program",
      description: "Month-to-month terms. Prove ROI first. Scale when you're ready.",
    },
    {
      icon: TrendingUp,
      title: "94% Conversion Rate",
      description: "Pilot participants convert because they see measurable revenue increase.",
    },
    {
      icon: Clock,
      title: "3-7 Day Setup",
      description: "Live and capturing leads in under a week. Industry average is 2-4 weeks.",
    },
  ];

  return (
    <div className="flex items-center justify-center gap-8 flex-wrap">
      {guarantees.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 text-left group cursor-default"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 group-hover:shadow-glow transition-shadow">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="max-w-[200px]">
              <p className="font-bold text-sm text-foreground mb-0.5">{item.title}</p>
              <p className="text-xs text-muted-foreground leading-tight">{item.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
