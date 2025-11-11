import { motion } from "framer-motion";
import { Phone, Calendar, Brain, TestTube, Rocket, Clock, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/tracking";

interface TimelineStage {
  id: string;
  title: string;
  duration: string;
  description: string;
  icon: any;
  details: string[];
  color: string;
  stageNumber: number;
}

const timelineStages: TimelineStage[] = [
  {
    id: "discovery-call",
    title: "Discovery Call",
    duration: "Day 1",
    description: "Understand your business needs and requirements",
    icon: Phone,
    details: [
      "Discuss your services, pricing, and processes",
      "Review existing systems (CRM, phone, calendar)",
      "Understand your customer communication patterns",
      "Determine fit and provide timeline estimate"
    ],
    color: "from-blue-500 to-cyan-500",
    stageNumber: 1
  },
  {
    id: "planning-call",
    title: "Planning Call",
    duration: "Day 2-3",
    description: "Create your custom implementation roadmap",
    icon: Calendar,
    details: [
      "Present custom implementation timeline",
      "Review training plan specific to your business",
      "Walk through what the AI will do",
      "Answer questions and finalize approach"
    ],
    color: "from-cyan-500 to-teal-500",
    stageNumber: 2
  },
  {
    id: "agent-training",
    title: "Agent Training",
    duration: "Week 1-2",
    description: "Configure AI with your business specifics",
    icon: Brain,
    details: [
      "Train on services, pricing, and terminology",
      "Set up integrations (CRM, calendar, phone)",
      "Program custom workflows and responses",
      "Configure industry-specific knowledge"
    ],
    color: "from-teal-500 to-green-500",
    stageNumber: 3
  },
  {
    id: "testing-refinement",
    title: "Testing & Refinement",
    duration: "Week 2-3",
    description: "Ensure quality and accuracy before launch",
    icon: TestTube,
    details: [
      "Conduct test calls with various scenarios",
      "Refine responses based on your feedback",
      "Test edge cases and error handling",
      "Final approval before launch"
    ],
    color: "from-green-500 to-emerald-500",
    stageNumber: 4
  },
  {
    id: "go-live",
    title: "Go Live",
    duration: "Week 3+",
    description: "Full deployment with ongoing support",
    icon: Rocket,
    details: [
      "Full deployment with real-time monitoring",
      "AI handles live customer calls",
      "Ongoing support and optimization",
      "Monthly performance reviews"
    ],
    color: "from-emerald-500 to-primary",
    stageNumber: 5
  }
];

const complexityFactors = [
  { label: "Service Complexity", description: "Number of services offered" },
  { label: "Integration Needs", description: "CRM, calendar, payment systems" },
  { label: "Customization Level", description: "Industry-specific requirements" },
  { label: "Team Availability", description: "Response time for feedback" }
];

const ImplementationTimeline = () => {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    if (!hasViewed) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setHasViewed(true);
            trackEvent('implementation_timeline_viewed', {
              page: window.location.pathname
            });
          }
        },
        { threshold: 0.3 }
      );

      const element = document.getElementById('implementation-timeline');
      if (element) observer.observe(element);

      return () => observer.disconnect();
    }
  }, [hasViewed]);

  const handleStageClick = (stageId: string, stageNumber: number) => {
    setExpandedStage(expandedStage === stageId ? null : stageId);
    if (expandedStage !== stageId) {
      trackEvent('timeline_stage_expanded', {
        stage_id: stageId,
        stage_number: stageNumber,
        page: window.location.pathname
      });
    }
  };

  return (
    <section id="implementation-timeline" className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Complete Transparency</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Implementation Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            From discovery call to go-live. Timeline varies based on your needs.
          </p>

          {/* Complexity Factors */}
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Timeline varies based on:</span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {complexityFactors.map((factor, index) => (
                <motion.div
                  key={factor.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="glass-card px-4 py-2 rounded-full group cursor-help">
                    <span className="text-sm font-medium">{factor.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Timeline - Desktop Horizontal Layout */}
        <div className="hidden lg:block max-w-7xl mx-auto mb-16">
          <div className="relative">
            {/* Progress Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-primary origin-left"
              style={{ width: "calc(100% - 120px)", marginLeft: "60px" }}
            />

            {/* Stages */}
            <div className="grid grid-cols-5 gap-4">
              {timelineStages.map((stage, index) => {
                const Icon = stage.icon;
                const isExpanded = expandedStage === stage.id;

                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative"
                  >
                    {/* Stage Node */}
                    <div className="flex flex-col items-center mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-lg cursor-pointer relative z-10`}
                        onClick={() => handleStageClick(stage.id, stage.stageNumber)}
                      >
                        <Icon className="w-8 h-8 text-white" />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`absolute inset-0 rounded-full bg-gradient-to-br ${stage.color} opacity-50`}
                        />
                      </motion.div>
                      <div className="mt-4 text-center">
                        <div className="text-xs font-semibold text-primary mb-1">
                          Stage {stage.stageNumber}
                        </div>
                        <div className="text-sm font-bold text-muted-foreground">
                          {stage.duration}
                        </div>
                      </div>
                    </div>

                    {/* Stage Card */}
                    <GlassCard
                      hover
                      className={`transition-all duration-300 cursor-pointer ${
                        isExpanded ? 'shadow-dramatic' : ''
                      }`}
                      onClick={() => handleStageClick(stage.id, stage.stageNumber)}
                    >
                      <h3 className="text-lg font-bold mb-2">{stage.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {stage.description}
                      </p>

                      {/* Details */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: isExpanded ? 'auto' : 0,
                          opacity: isExpanded ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-2 border-t border-border/50 pt-4">
                          {stage.details.map((detail, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>

                      <div className="text-xs text-primary font-semibold mt-4">
                        {isExpanded ? 'Click to collapse' : 'Click to expand'}
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Timeline - Mobile/Tablet Vertical Layout */}
        <div className="lg:hidden max-w-2xl mx-auto">
          <div className="relative">
            {/* Vertical Progress Line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-teal-500 to-primary origin-top"
            />

            {/* Stages */}
            <div className="space-y-8">
              {timelineStages.map((stage, index) => {
                const Icon = stage.icon;
                const isExpanded = expandedStage === stage.id;

                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative pl-20"
                  >
                    {/* Stage Node */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-lg cursor-pointer z-10`}
                      onClick={() => handleStageClick(stage.id, stage.stageNumber)}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Stage Card */}
                    <GlassCard
                      hover
                      className="cursor-pointer"
                      onClick={() => handleStageClick(stage.id, stage.stageNumber)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-semibold text-primary">
                          Stage {stage.stageNumber}
                        </div>
                        <div className="text-sm font-bold text-muted-foreground">
                          {stage.duration}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{stage.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {stage.description}
                      </p>

                      {/* Details */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: isExpanded ? 'auto' : 0,
                          opacity: isExpanded ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-2 border-t border-border/50 pt-4">
                          {stage.details.map((detail, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>

                      <div className="text-xs text-primary font-semibold mt-4">
                        {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <GlassCard hover className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Book a discovery call to discuss your needs and get a custom implementation timeline
            </p>
            <MagneticButton
              size="lg"
              className="gap-2"
              onClick={() => {
                trackEvent('timeline_cta_click', {
                  source: 'implementation_timeline',
                  button_text: 'Book Discovery Call'
                });
                window.open('https://calendly.com/trainyouragent', '_blank');
              }}
            >
              <Calendar className="w-5 h-5" />
              Book Discovery Call
            </MagneticButton>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default ImplementationTimeline;
