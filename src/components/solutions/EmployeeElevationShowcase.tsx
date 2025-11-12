import { motion } from "framer-motion";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { TrendingUp, Sparkles, DollarSign, Heart } from "lucide-react";
import { EmployeeStory } from "@/data/employeeElevationStories";

interface EmployeeElevationShowcaseProps {
  stories: EmployeeStory[];
  industry: string;
}

export const EmployeeElevationShowcase = ({ stories, industry }: EmployeeElevationShowcaseProps) => {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-background/50 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            AI as a SUPERPOWER, Not a Replacement
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How {industry} Professionals Evolved Their Careers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real people who got promoted, earned more, and found fulfillment when AI freed them from repetitive work
          </p>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <GlassCard className="h-full">
                <div className="p-6">
                  {/* Person Info */}
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary/70 to-primary/40 flex items-center justify-center text-2xl font-bold text-white mb-4">
                      {story.name.charAt(0)}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{story.name}</h3>
                    <p className="text-sm text-muted-foreground">{story.companySize}</p>
                  </div>

                  {/* Before Section */}
                  <div className="mb-6 pb-6 border-b border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <span className="text-lg">❌</span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Before AI</p>
                        <p className="font-semibold text-foreground">{story.beforeTitle}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{story.beforeSalary}</p>
                    <ul className="space-y-2">
                      {story.beforeResponsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                          <span className="text-destructive mt-0.5">•</span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Transformation Arrow */}
                  <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">Transformed</span>
                    </div>
                  </div>

                  {/* After Section */}
                  <div className="mb-6 pb-6 border-b border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-lg">✅</span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">After AI</p>
                        <p className="font-semibold text-primary">{story.afterTitle}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-primary mb-3">{story.afterSalary}</p>
                    <ul className="space-y-2">
                      {story.afterResponsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                          <span className="text-primary mt-0.5">✓</span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact Metrics */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                      <DollarSign className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Revenue Impact</p>
                        <p className="text-sm font-semibold text-foreground">{story.revenueImpact}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                      <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Career Growth</p>
                        <p className="text-sm font-semibold text-foreground">{story.satisfactionIncrease}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <GlassCard className="inline-block">
            <div className="p-8">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-3">
                AI Didn't Replace These People
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                It gave them a <span className="text-primary font-semibold">SUPERPOWER</span> to deliver 10x more value,<br />
                earn more money, and find real fulfillment in strategic work
              </p>
              <p className="text-sm text-muted-foreground italic">
                Your team deserves the same transformation
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
