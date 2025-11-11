import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles, TrendingUp, Zap, Target, Globe } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface JourneyStage {
  stage: number;
  title: string;
  subtitle: string;
  icon: any;
  solutions: string[];
  metrics: string;
  timeframe: string;
  gradient: string;
}

interface SolutionJourneyProps {
  industry?: string;
  currentStage?: number;
}

export const SolutionJourney = ({ industry = "your business", currentStage = 1 }: SolutionJourneyProps) => {
  const navigate = useNavigate();

  const journeyStages: JourneyStage[] = [
    {
      stage: 1,
      title: "Foundation",
      subtitle: "Start Here - Entry Point",
      icon: Zap,
      solutions: ["AI Voice Agents (24/7 call handling)", "Instant lead capture", "Emergency response automation"],
      metrics: "3-5x more leads captured",
      timeframe: "Week 1-4",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      stage: 2,
      title: "Operations Enhancement",
      subtitle: "Automate Your Workflows",
      icon: Target,
      solutions: ["Scheduling automation", "Document collection & CRM integration", "Payment processing automation"],
      metrics: "40% reduction in admin time",
      timeframe: "Month 2-3",
      gradient: "from-cyan-500/20 to-teal-500/20",
    },
    {
      stage: 3,
      title: "Intelligence Layer",
      subtitle: "Unlock Business Intelligence",
      icon: TrendingUp,
      solutions: ["Predictive analytics", "Lead scoring & qualification", "Revenue optimization insights"],
      metrics: "2x improvement in conversion rates",
      timeframe: "Month 3-4",
      gradient: "from-teal-500/20 to-green-500/20",
    },
    {
      stage: 4,
      title: "Growth Acceleration",
      subtitle: "Scale Your Growth",
      icon: Sparkles,
      solutions: ["Staff training & optimization", "Crisis management protocols", "Marketing automation & campaigns"],
      metrics: "3x faster growth trajectory",
      timeframe: "Month 4-6",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      stage: 5,
      title: "Market Domination",
      subtitle: "Lead Your Industry",
      icon: Globe,
      solutions: ["SEO & AIO optimization", "Custom web portals & apps", "Multi-location expansion"],
      metrics: "5x market visibility increase",
      timeframe: "Month 6-12",
      gradient: "from-emerald-500/20 to-blue-500/20",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 text-primary mx-auto" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-cyan-500 to-primary bg-clip-text text-transparent">
            Your Transformation Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We don't just sell voice agents. We transform {industry} with a complete growth system.
            <br />
            <span className="text-primary font-semibold">Start with voice agents, scale to market domination.</span>
          </p>
        </motion.div>

        {/* Journey Timeline */}
        <div className="max-w-6xl mx-auto mb-12">
          {journeyStages.map((stage, index) => (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative mb-8 last:mb-0"
            >
              {/* Connection line */}
              {index < journeyStages.length - 1 && (
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  className="absolute left-6 md:left-8 top-16 w-0.5 h-full bg-gradient-to-b from-primary to-cyan-500"
                />
              )}

              <GlassCard
                hover
                className={cn(
                  "p-6 md:p-8 relative overflow-hidden transition-all duration-500",
                  currentStage === stage.stage && "ring-2 ring-primary shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                )}
              >
                {/* Background gradient */}
                <div className={cn("absolute inset-0 bg-gradient-to-br", stage.gradient)} />

                {/* Current stage indicator */}
                {currentStage === stage.stage && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-bold"
                  >
                    You Are Here
                  </motion.div>
                )}

                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex-shrink-0"
                  >
                    <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                      <stage.icon className="w-8 h-8 text-primary" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-primary/20 text-primary rounded text-sm font-bold">
                            Stage {stage.stage}
                          </span>
                          <span className="text-sm text-muted-foreground">{stage.timeframe}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-1">{stage.title}</h3>
                        <p className="text-primary font-semibold">{stage.subtitle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Expected Impact</p>
                        <p className="text-lg font-bold text-primary">{stage.metrics}</p>
                      </div>
                    </div>

                    {/* Solutions list */}
                    <div className="grid md:grid-cols-2 gap-3 mb-6">
                      {stage.solutions.map((solution, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + i * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{solution}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA */}
                    <MagneticButton
                      strength={15}
                      onClick={() => navigate('/solutions/configurator')}
                      variant={currentStage === stage.stage ? "default" : "outline"}
                      className="group"
                    >
                      {currentStage === stage.stage ? "Continue Your Journey" : `Learn About ${stage.title}`}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </MagneticButton>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <GlassCard className="p-8 inline-block">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl">
              Get a personalized roadmap showing exactly how to transform your business, step by step.
            </p>
            <MagneticButton
              strength={25}
              onClick={() => navigate('/solutions/configurator')}
              size="lg"
              className="text-lg"
            >
              Build Your Custom Roadmap
              <Sparkles className="w-5 h-5" />
            </MagneticButton>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
