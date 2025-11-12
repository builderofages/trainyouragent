import { motion } from "framer-motion";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { Sparkles, Wrench, Clock, MessageSquare } from "lucide-react";

interface CustomSolutionsCalloutProps {
  variant?: "default" | "compact" | "banner";
  className?: string;
  onContactClick?: () => void;
}

export const CustomSolutionsCallout = ({ 
  variant = "default", 
  className = "",
  onContactClick 
}: CustomSolutionsCalloutProps) => {
  
  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-6 md:p-8 ${className}`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Need a Custom Solution?</h3>
              <p className="text-muted-foreground">
                Beyond our standard AI voice agents, we build custom automation, integrations, and workflows tailored to your unique business needs. <strong className="text-foreground">Setup time varies based on solution complexity.</strong>
              </p>
            </div>
          </div>
          <MagneticButton 
            className="rounded-full bg-gradient-primary whitespace-nowrap"
            onClick={onContactClick}
          >
            Discuss Custom Needs
          </MagneticButton>
        </div>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <GlassCard className={`p-6 border-primary/20 ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <Wrench className="w-5 h-5 text-primary" />
          <h4 className="font-bold">Custom Solutions Available</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Need more than a voice agent? We build custom automation, CRM integrations, and workflows. Setup time varies by complexity.
        </p>
        <MagneticButton 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onContactClick}
        >
          Contact Us
        </MagneticButton>
      </GlassCard>
    );
  }

  // Default variant
  return (
    <GlassCard className={`p-8 md:p-10 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 ${className}`}>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2">Want Custom Solutions?</h3>
          <p className="text-muted-foreground">
            We go beyond standard AI voice agents to create fully custom automation systems.
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <Wrench className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">Custom Integrations</h4>
            <p className="text-sm text-muted-foreground">
              Connect AI to your existing CRM, scheduling software, inventory systems, payment processors, or proprietary tools.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">Advanced Workflows</h4>
            <p className="text-sm text-muted-foreground">
              Multi-step automation, conditional logic, escalation rules, human-in-the-loop approval flows, and more.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">Timeline Varies by Complexity</h4>
            <p className="text-sm text-muted-foreground">
              Standard AI voice agents: 3-7 days. Custom integrations: 1-3 weeks. Enterprise workflows: 3-6 weeks. We'll provide accurate timeline during your free strategy session.
            </p>
          </div>
        </div>
      </div>

      <MagneticButton 
        className="rounded-full bg-gradient-primary w-full md:w-auto"
        onClick={onContactClick}
      >
        Discuss Your Custom Needs
      </MagneticButton>
    </GlassCard>
  );
};
