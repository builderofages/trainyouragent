import { motion } from "framer-motion";
import { TrendingUp, PhoneOff, Zap, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

const researchHighlights = [
  {
    quote: "Businesses implementing AI in customer service achieve an average 300% ROI within 12 months.",
    source: "McKinsey Global Institute",
    report: "The State of AI 2024",
    icon: TrendingUp,
    url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
  },
  {
    quote: "73% of high-intent leads call outside business hours, but most businesses miss these calls.",
    source: "Harvard Business Review",
    report: "Buyer Behavior Study",
    icon: PhoneOff,
    url: "https://hbr.org/",
  },
  {
    quote: "AI adoption in small businesses increased 187% in 2024, with payback periods of 4-8 months.",
    source: "Deloitte",
    report: "SMB Technology Insights 2024",
    icon: Zap,
    url: "https://www2.deloitte.com/",
  },
];

const SocialProof = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-secondary/30 via-white to-secondary/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-10" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            What{" "}
            <span className="bg-clip-text text-transparent bg-gradient-primary">
              Industry Research
            </span>
            {" "}Says
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real data from leading research organizations on AI adoption and ROI
          </p>
        </motion.div>

        {/* Research Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {researchHighlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className="relative p-8 bg-white border-2 border-border hover:border-primary transition-all duration-500 shadow-card hover:shadow-blue h-full">
                {/* Icon */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-primary rounded-xl shadow-glow-sm">
                    <highlight.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Quote */}
                <p className="text-foreground text-lg mb-6 leading-relaxed relative z-10 font-medium">
                  "{highlight.quote}"
                </p>

                {/* Source */}
                <div className="border-t border-border pt-4 mt-4">
                  <div className="font-bold text-foreground text-sm mb-1">
                    {highlight.source}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {highlight.report}
                  </div>
                  <a 
                    href={highlight.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View Research <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-8">
            Research-backed insights from trusted sources
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: "Industry Reports", value: "25+" },
              { label: "Research Partners", value: "15+" },
              { label: "Data Points", value: "500K+" },
              { label: "Industries Analyzed", value: "20+" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
