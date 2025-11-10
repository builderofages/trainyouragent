import { motion } from "framer-motion";
import { Calendar, DollarSign, FileText, Phone, CheckCircle } from "lucide-react";
import { MagneticButton } from "./enhanced/MagneticButton";
import { GlassCard } from "./enhanced/GlassCard";

interface DemoCTAProps {
  conversationCount?: number;
  onBookDemo?: () => void;
  onGetPricing?: () => void;
  onViewCaseStudies?: () => void;
  onCallSales?: () => void;
}

export const DemoCTA = ({
  conversationCount = 0,
  onBookDemo,
  onGetPricing,
  onViewCaseStudies,
  onCallSales,
}: DemoCTAProps) => {
  const shouldShow = conversationCount >= 2;

  if (!shouldShow) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <GlassCard className="p-6 border-2 border-primary/30 shadow-glow">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4"
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-2 text-gradient-premium">
            You've Experienced the Power of AI
          </h3>
          <p className="text-muted-foreground">
            Ready to see how this can transform your business?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <MagneticButton
            onClick={onBookDemo}
            size="lg"
            className="gap-2 shadow-blue hover:shadow-glow group"
          >
            <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Book Your Demo
          </MagneticButton>

          <MagneticButton
            onClick={onGetPricing}
            variant="outline"
            size="lg"
            className="gap-2 hover-lift"
          >
            <DollarSign className="w-5 h-5" />
            Get Pricing
          </MagneticButton>

          <MagneticButton
            onClick={onViewCaseStudies}
            variant="outline"
            size="lg"
            className="gap-2 hover-lift"
          >
            <FileText className="w-5 h-5" />
            Case Studies
          </MagneticButton>

          <MagneticButton
            onClick={onCallSales}
            variant="outline"
            size="lg"
            className="gap-2 hover-lift"
          >
            <Phone className="w-5 h-5" />
            Call Sales
          </MagneticButton>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-primary"
            />
            <span className="text-sm font-medium text-primary">
              Book today and get 20% off your first month
            </span>
          </div>
        </motion.div>
      </GlassCard>
    </motion.div>
  );
};
