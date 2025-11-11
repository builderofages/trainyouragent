import { motion } from "framer-motion";
import { Shield, Info } from "lucide-react";

interface SecurityDisclaimerProps {
  variant?: "default" | "compact";
}

export const SecurityDisclaimer = ({ variant = "default" }: SecurityDisclaimerProps) => {
  if (variant === "compact") {
    return (
      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
        <p className="leading-relaxed">
          Our platform is built on industry-leading infrastructure (VAPI, Apollo.io) that maintains 
          SOC 2 Type II and HIPAA compliance. Individual compliance requirements may vary by industry.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 border-primary/20"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Security & Compliance</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Our platform is built on industry-leading infrastructure (VAPI, Apollo.io) that maintains 
        SOC 2 Type II and HIPAA compliance. While we implement enterprise-grade security practices, 
        individual compliance requirements may vary by industry. Healthcare clients requiring HIPAA 
        Business Associate Agreements should discuss specific needs during onboarding. Contact{" "}
        <a href="mailto:legal@trainyouragent.com" className="text-primary hover:underline">
          legal@trainyouragent.com
        </a>{" "}
        for compliance inquiries.
      </p>
    </motion.div>
  );
};
