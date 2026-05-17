import { motion } from "framer-motion";
import { BookOpen, TrendingUp, FileText, BarChart3 } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { use3DCard } from "@/hooks/use3DCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { StrategySessionLeadGate } from "@/components/conversion/StrategySessionLeadGate";
import { useState } from "react";
import { trackEvent } from "@/lib/tracking";

const researchPublications = [
  {
    title: "McKinsey AI Report 2024",
    publisher: "McKinsey Global Institute",
    icon: TrendingUp,
    keyFinding: "300% average ROI for AI automation in customer service",
    description: "Comprehensive analysis of AI adoption across industries showing significant efficiency gains and cost reduction.",
    year: "2024",
    category: "AI & Automation",
  },
  {
    title: "The Lead Response Time Study",
    publisher: "InsideSales.com",
    icon: BarChart3,
    keyFinding: "9x higher conversion when leads contacted within 5 minutes",
    description: "Groundbreaking research proving the critical importance of immediate lead response in sales conversion.",
    year: "2023",
    category: "Sales & Marketing",
  },
  {
    title: "State of Customer Experience 2024",
    publisher: "Gartner",
    icon: FileText,
    keyFinding: "80% of customer interactions will be AI-powered by 2025",
    description: "Industry predictions and trends showing the rapid adoption of conversational AI in customer experience.",
    year: "2024",
    category: "Customer Experience",
  },
  {
    title: "The Cost of Missed Calls",
    publisher: "Harvard Business Review",
    icon: BookOpen,
    keyFinding: "$47B lost annually to unanswered business calls",
    description: "Economic analysis revealing the massive opportunity cost of missed customer communications.",
    year: "2023",
    category: "Business Economics",
  },
];

const ResearchCard = ({ research, index }: { research: any; index: number }) => {
  const { ref, style, onMouseMove, onMouseLeave } = use3DCard(8);
  const Icon = research.icon;

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
      <GlassCard hover className="h-full p-6 group cursor-pointer hover-lift">
        <div className="flex items-start gap-4 mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:shadow-glow-sm flex-shrink-0"
          >
            <Icon className="w-6 h-6 text-primary" />
          </motion.div>
          <div className="flex-1">
            <span className="text-xs text-primary font-semibold">{research.category}</span>
            <h3 className="text-lg font-bold mt-1 mb-1">{research.title}</h3>
            <p className="text-sm text-muted-foreground">{research.publisher} • {research.year}</p>
          </div>
        </div>
        
        <div className="mb-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-sm font-semibold text-foreground">
            📊 Key Finding
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            "{research.keyFinding}"
          </p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {research.description}
        </p>
      </GlassCard>
    </motion.div>
  );
};

const IndustryResearchSection = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-b from-muted/50 via-background to-muted/30 relative overflow-hidden">
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
              Industry Research
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Backed by{" "}
            <span className="text-gradient">Leading Research</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our solutions are informed by the latest industry studies and research from leading institutions
          </p>
        </motion.div>

        {/* Research Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {researchPublications.map((research, index) => (
            <ResearchCard key={research.title} research={research} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4">
            Want to learn more about the AI automation opportunity?
          </p>
          <MagneticButton
            size="lg"
            onClick={() => {
              trackEvent('cta_clicked', { location: 'industry_research' });
              setLeadGateOpen(true);
            }}
          >
            Explore How AI Can Transform Your Business
          </MagneticButton>
        </motion.div>
      </div>

      <StrategySessionLeadGate 
        open={leadGateOpen}
        onOpenChange={setLeadGateOpen}
      />
    </section>
  );
};

export default IndustryResearchSection;
