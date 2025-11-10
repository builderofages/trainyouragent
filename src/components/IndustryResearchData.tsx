import { motion } from "framer-motion";
import { TrendingUp, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";

interface ResearchStat {
  stat: string;
  description: string;
  source: string;
  sourceUrl: string;
  impact: string;
}

interface IndustryResearchDataProps {
  industry: string;
  stats: ResearchStat[];
  gradient: string;
}

export const IndustryResearchData = ({ industry, stats, gradient }: IndustryResearchDataProps) => {
  return (
    <section className={`py-20 bg-gradient-to-br ${gradient}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Industry Research</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What the Data Shows</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real research from leading industry organizations reveals the opportunity in {industry}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-8 h-full hover-lift">
                <div className="text-5xl font-bold text-gradient mb-4">{stat.stat}</div>
                <p className="text-muted-foreground mb-4 leading-relaxed">{stat.description}</p>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold mb-2">Impact:</p>
                  <p className="text-sm text-muted-foreground mb-3">{stat.impact}</p>
                  <a
                    href={stat.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Source: {stat.source}
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
