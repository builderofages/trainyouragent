import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { ExpandedNicheSolution } from "@/data/solutionsExpanded";

interface IndustryBenefitsProps {
  solution: ExpandedNicheSolution;
}

export const IndustryBenefits = ({ solution }: IndustryBenefitsProps) => {
  const getButtonVariant = (type: string) => {
    switch (type) {
      case "primary":
        return "bg-gradient-primary";
      case "secondary":
        return "outline";
      case "calculator":
        return "bg-gradient-to-r from-accent to-primary";
      case "demo":
        return "bg-gradient-to-r from-primary to-accent";
      default:
        return "bg-gradient-primary";
    }
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary uppercase">Results You'll See</span>
          </div>
          <h2 className="text-4xl font-black mb-4">
            How AI Transforms Your {solution.name}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real solutions with measurable results - each benefit includes specific metrics and next steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {solution.benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hover className="p-8 h-full flex flex-col">
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-primary">{benefit.metric}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-border">
                  <MagneticButton
                    onClick={() => {
                      if (benefit.cta.link.startsWith("http")) {
                        window.open(benefit.cta.link, "_blank");
                      } else {
                        window.location.href = benefit.cta.link;
                      }
                    }}
                    className={getButtonVariant(benefit.cta.type)}
                    size="lg"
                  >
                    {benefit.cta.text}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </MagneticButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Backed by Industry Research</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {solution.socialProof.map((proof, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="text-3xl font-black text-primary mb-2">
                    "{proof.stat.split(" ")[0]}"
                  </div>
                  <p className="text-sm mb-3">{proof.stat}</p>
                  <p className="text-xs text-muted-foreground mb-2">Source: {proof.source}</p>
                  <p className="text-sm font-medium text-destructive">{proof.impact}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
