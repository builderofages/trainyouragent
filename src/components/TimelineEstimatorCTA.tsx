import { useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TimelineEstimator } from "@/components/TimelineEstimator";
import { trackEvent } from "@/lib/tracking";

interface TimelineEstimatorCTAProps {
  industryId?: string;
  variant?: "inline" | "banner" | "card";
  location?: string;
}

export const TimelineEstimatorCTA = ({ 
  industryId, 
  variant = "card",
  location = "unknown"
}: TimelineEstimatorCTAProps) => {
  const [estimatorOpen, setEstimatorOpen] = useState(false);

  const handleOpen = () => {
    setEstimatorOpen(true);
    trackEvent('timeline_estimator_cta_clicked', {
      industry_id: industryId,
      variant,
      location
    });
  };

  if (variant === "inline") {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2"
        >
          <MagneticButton
            onClick={handleOpen}
            variant="outline"
            className="gap-2"
          >
            <Clock className="w-4 h-4" />
            Estimate Your Timeline
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </motion.div>
        <Dialog open={estimatorOpen} onOpenChange={setEstimatorOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <TimelineEstimator 
              onClose={() => setEstimatorOpen(false)}
              industryId={industryId}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (variant === "banner") {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <GlassCard className="p-6 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    How long will implementation take?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get your personalized timeline estimate in 60 seconds
                  </p>
                </div>
              </div>
              <MagneticButton
                onClick={handleOpen}
                size="lg"
                className="gap-2 whitespace-nowrap"
              >
                Estimate Timeline
                <ArrowRight className="w-5 h-5" />
              </MagneticButton>
            </div>
          </GlassCard>
        </motion.div>
        <Dialog open={estimatorOpen} onOpenChange={setEstimatorOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <TimelineEstimator 
              onClose={() => setEstimatorOpen(false)}
              industryId={industryId}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Default: card variant
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <GlassCard hover className="p-8 text-center group cursor-pointer" onClick={handleOpen}>
          <motion.div
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Clock className="w-8 h-8 text-primary" />
          </motion.div>
          <h3 className="text-xl font-bold mb-2">
            Estimate Your Implementation Timeline
          </h3>
          <p className="text-muted-foreground mb-6">
            Answer 6 quick questions to get a personalized timeline (takes 60 seconds)
          </p>
          <MagneticButton
            size="lg"
            className="gap-2 group-hover:shadow-glow"
          >
            Start Estimator
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
        </GlassCard>
      </motion.div>
      <Dialog open={estimatorOpen} onOpenChange={setEstimatorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <TimelineEstimator 
            onClose={() => setEstimatorOpen(false)}
            industryId={industryId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
