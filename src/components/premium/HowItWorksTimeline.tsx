import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Brain, CheckCircle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const steps = [
  {
    day: "Day 1",
    icon: MessageSquare,
    title: "Discovery",
    description: "30-minute call.\nWe learn your business inside out.",
  },
  {
    day: "Day 2-3",
    icon: Brain,
    title: "AI Training",
    description: "We train your AI on YOUR business.\nServices. Prices. FAQs. Your voice.",
  },
  {
    day: "Day 4",
    icon: CheckCircle,
    title: "Testing",
    description: "You test it. We refine it.\nUntil it's perfect. You approve.",
  },
  {
    day: "Day 5",
    icon: Rocket,
    title: "Go Live",
    description: "Flip the switch.\nStart capturing every call.",
  },
];

export const HowItWorksTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  return (
    <section className="relative py-24 md:py-32 bg-surface overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-4">
        {/* Tag */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-trust-blue text-sm font-semibold tracking-widest uppercase">
            Simple Setup
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-4xl md:text-5xl font-black text-text-primary text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Live in 5 Days. Not 5 Months.
        </motion.h2>

        {/* Timeline - Desktop */}
        <div className="hidden md:block relative max-w-5xl mx-auto">
          {/* Progress line */}
          <div className="absolute top-12 left-0 right-0 h-0.5 bg-border">
            <motion.div
              className="h-full bg-gradient-to-r from-trust-blue to-tech-cyan"
              style={{ scaleX: lineProgress, transformOrigin: "left" }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {/* Day label */}
                <div className="text-center mb-4">
                  <span className="text-sm font-semibold text-trust-blue">{step.day}</span>
                </div>

                {/* Icon node */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-white border-2 border-trust-blue 
                               flex items-center justify-center shadow-lg z-10 relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <step.icon className="w-5 h-5 text-trust-blue" />
                  </motion.div>
                </div>

                {/* Content card */}
                <motion.div
                  className="bg-white rounded-xl p-6 shadow-md border border-border/50 
                           hover:shadow-xl hover:border-trust-blue/30 transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  <h3 className="text-lg font-bold text-text-primary mb-2">{step.title}</h3>
                  <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline - Mobile */}
        <div className="md:hidden space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-trust-blue flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-border my-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <span className="text-xs font-semibold text-trust-blue">{step.day}</span>
                <h3 className="text-lg font-bold text-text-primary">{step.title}</h3>
                <p className="text-sm text-text-secondary whitespace-pre-line">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Button
            size="lg"
            onClick={() => window.open(siteConfig.bookingUrl, "_blank")}
            className="bg-trust-blue hover:bg-trust-blue/90 text-white font-semibold px-8"
          >
            Ready to Start? Book Your Discovery Call →
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
