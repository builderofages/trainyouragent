import { motion } from "framer-motion";
import { Clock, TrendingDown, AlertCircle, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { StrategySessionLeadGate } from "@/components/conversion/StrategySessionLeadGate";
import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/tracking";

interface UrgencySectionProps {
  industry?: string;
  costPerHour?: number;
  spotsRemaining?: number;
}

export const UrgencySection = ({ 
  industry = "business",
  costPerHour = 75,
  spotsRemaining = 3 
}: UrgencySectionProps) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [leadGateOpen, setLeadGateOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const costAccumulated = (timeElapsed / 3600) * costPerHour;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-background to-orange-500/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard className="max-w-4xl mx-auto p-12 border-2 border-destructive/30">
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30 mb-6"
              >
                <AlertCircle className="w-5 h-5 text-destructive" />
                <span className="font-semibold text-destructive">Limited Availability</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Every Hour You Wait Costs Money
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Your competitors are already capturing leads 24/7 with AI
              </p>
            </div>

            {/* Live cost counter */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <GlassCard className="p-6 text-center bg-destructive/5 border-destructive/20">
                <Clock className="w-8 h-8 text-destructive mx-auto mb-3" />
                <div className="text-3xl font-bold text-destructive mb-1">
                  ${costAccumulated.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Potential revenue lost since you landed here
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Based on {costPerHour}/hr opportunity cost
                </div>
              </GlassCard>

              <GlassCard className="p-6 text-center">
                <TrendingDown className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">
                  {spotsRemaining}
                </div>
                <div className="text-sm text-muted-foreground">
                  Implementation spots remaining this month
                </div>
                <div className="text-xs text-orange-500 mt-2 font-medium">
                  Filling fast
                </div>
              </GlassCard>

              <GlassCard className="p-6 text-center bg-primary/5 border-primary/20">
                <ArrowRight className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-gradient mb-1">
                  2 weeks
                </div>
                <div className="text-sm text-muted-foreground">
                  From booking to live AI agent
                </div>
                <div className="text-xs text-primary mt-2 font-medium">
                  Fast implementation
                </div>
              </GlassCard>
            </div>

            {/* Risk statistics */}
            <div className="mb-8 p-6 bg-muted/30 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">62% of leads call competitors</div>
                    <div className="text-muted-foreground">When you miss their first call</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">$50K+ average annual loss</div>
                    <div className="text-muted-foreground">From missed after-hours calls alone</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <MagneticButton
                size="lg"
                className="text-lg px-12 h-16 gap-3 bg-gradient-to-r from-destructive to-orange-500 hover:from-destructive/90 hover:to-orange-500/90 shadow-glow"
                onClick={() => {
                  trackEvent('cta_clicked', { location: 'urgency_section' });
                  setLeadGateOpen(true);
                }}
              >
                Secure Your Spot Now
                <ArrowRight className="w-5 h-5" />
              </MagneticButton>
              
              <p className="text-sm text-muted-foreground mt-4">
                Setup begins immediately after booking • No credit card required
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <StrategySessionLeadGate 
        open={leadGateOpen}
        onOpenChange={setLeadGateOpen}
        defaultIndustry={industry}
      />
    </section>
  );
};
