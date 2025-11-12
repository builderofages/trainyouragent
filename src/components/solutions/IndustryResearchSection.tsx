import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { industryResearch } from "@/data/industryResearch";

interface IndustryResearchSectionProps {
  industry: string;
}

export const IndustryResearchSection = ({ industry }: IndustryResearchSectionProps) => {
  const stats = industryResearch[industry] || [];
  
  if (stats.length === 0) return null;
  
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-4">
          Why {industry.charAt(0).toUpperCase() + industry.slice(1)} Businesses Are Switching to AI
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-12">
          Industry research from leading sources
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6 glass-card hover:shadow-xl transition-shadow">
              {/* Large Stat Number */}
              <div className="text-5xl font-black text-primary mb-4">
                {stat.statistic.split(' ')[0]}
              </div>
              
              {/* Stat Description */}
              <p className="text-lg font-semibold mb-3">
                {stat.statistic.split(' ').slice(1).join(' ')}
              </p>
              
              {/* Context */}
              <p className="text-sm text-muted-foreground mb-3">
                {stat.context}
              </p>
              
              {/* Impact */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 mb-4">
                <p className="text-sm font-medium text-primary">
                  💰 Impact: {stat.impact}
                </p>
              </div>
              
              {/* Source Citation */}
              <a 
                href={stat.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <span>📚 {stat.source}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
