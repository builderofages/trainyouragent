import { motion } from "framer-motion";
import { Shield, Lock, Award, CheckCircle } from "lucide-react";

interface TrustBadgesProps {
  variant?: "default" | "compact";
}

export const TrustBadges = ({ variant = "default" }: TrustBadgesProps) => {
  const badges = [
    {
      icon: Shield,
      text: "Enterprise-Grade Security",
      subtext: "SOC 2 infrastructure",
    },
    {
      icon: Lock,
      text: "End-to-End Encryption",
      subtext: "TLS 1.3 protection",
    },
    {
      icon: Award,
      text: "HIPAA-Compliant Infrastructure",
      subtext: "Healthcare ready",
    },
    {
      icon: CheckCircle,
      text: "30-Day Pilot",
      subtext: "Risk-free trial",
    },
  ];

  if (variant === "compact") {
    return (
      <div className="flex items-center justify-center gap-6 flex-wrap">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <badge.icon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{badge.text}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.text}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4 }}
          className="glass-card p-4 text-center group cursor-default"
        >
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3 shadow-blue group-hover:shadow-xl transition-all">
            <badge.icon className="w-6 h-6 text-white" />
          </div>
          <p className="font-bold text-foreground text-sm mb-1">{badge.text}</p>
          <p className="text-xs text-muted-foreground">{badge.subtext}</p>
        </motion.div>
      ))}
    </div>
  );
};
