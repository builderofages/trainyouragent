import { motion } from "framer-motion";
import { Calculator, TrendingUp, Users, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { Link } from "react-router-dom";
import ROICalculator from "@/components/ROICalculatorEnhanced";

const Calculators = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">AI ROI Calculators</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Calculate your specific opportunity cost and ROI with research-backed data from industry studies.
            </p>
          </motion.div>

          <div className="mb-20">
            <ROICalculator />
          </div>

          <div className="text-center">
            <p className="text-muted-foreground">More calculators coming soon: Missed Call Cost, AI vs Human Cost Comparison, Lead Response Impact</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Calculators;
