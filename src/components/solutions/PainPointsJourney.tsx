import { motion } from "framer-motion";
import { AlertCircle, TrendingDown, ArrowRight, CheckCircle, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { ExpandedNicheSolution } from "@/data/solutionsExpanded";

interface PainPointsJourneyProps {
  solution: ExpandedNicheSolution;
}

export const PainPointsJourney = ({ solution }: PainPointsJourneyProps) => {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        {/* Hell: Pain Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-full mb-4">
              <TrendingDown className="w-5 h-5 text-destructive" />
              <span className="text-sm font-bold text-destructive uppercase">Current Reality</span>
            </div>
            <h2 className="text-4xl font-black mb-4">The Pain Points Killing Your {solution.name}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These aren't hypothetical problems - they're costing you real money every single day
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solution.painPoints.map((pain, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard hover className="p-6 h-full border-l-4 border-l-destructive bg-gradient-to-br from-destructive/5 to-transparent">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-xs font-bold text-destructive uppercase mb-1">
                        {pain.category}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{pain.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{pain.impact}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-destructive/20 rounded-full">
                    <TrendingDown className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-bold text-destructive">{pain.cost}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Transformation Arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-16"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow-intense">
              <ArrowRight className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-sm font-bold text-primary">{solution.transformation.timeframe}</span>
            </div>
          </div>
        </motion.div>

        {/* Heaven: Transformation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-primary uppercase">Your Future</span>
            </div>
            <h2 className="text-4xl font-black mb-4">What Changes With AI</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your operations in {solution.transformation.timeframe} - here's what your new reality looks like
            </p>
          </div>

          <GlassCard className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  </div>
                  Before AI
                </h3>
                <ul className="space-y-3">
                  {solution.transformation.before.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                    >
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* After */}
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  After AI
                </h3>
                <ul className="space-y-3">
                  {solution.transformation.after.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20"
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
