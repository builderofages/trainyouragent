import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";

const stats = [
  {
    value: 62,
    suffix: "%",
    label: "of business calls go unanswered",
    description: "Your phone rings. Nobody's there.\nCustomers hang up. Call competitors.",
    source: "Salesforce Research",
  },
  {
    value: 78,
    suffix: "%",
    label: "of customers buy from first responder",
    description: "Speed wins. Always.\nSecond place is first loser.",
    source: "Harvard Business Review",
  },
  {
    value: 1200,
    prefix: "$",
    label: "average lifetime value lost per missed call",
    description: "That's not a voicemail.\nThat's money evaporating.",
    source: "CallRail Industry Report",
  },
];

export const ProblemSection = () => {
  const scrollToCalculator = () => {
    const element = document.getElementById("roi-calculator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="problem-section" className="relative py-24 md:py-32 bg-deep-space overflow-hidden">
      {/* Grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Tag */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-tech-cyan text-sm font-semibold tracking-widest uppercase">
            The $47 Billion Problem
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white text-center mb-16 max-w-4xl mx-auto leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Every Missed Call Is Revenue Walking Away
        </motion.h2>

        {/* Stats grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <div className="mb-4">
                <AnimatedCounter
                  end={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={2}
                  delay={0.5 + index * 0.2}
                  className="text-6xl md:text-7xl font-black text-white"
                />
              </div>
              <p className="text-white/60 text-lg mb-4">{stat.label}</p>
              <div className="w-12 h-px bg-white/20 mx-auto mb-4" />
              <p className="text-white/80 whitespace-pre-line leading-relaxed">
                {stat.description}
              </p>
              <p className="text-white/30 text-xs mt-4">Source: {stat.source}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            You can't grow a business on missed calls.
            <br />
            <span className="text-white font-semibold">So stop missing them.</span>
          </p>
          
          <motion.button
            onClick={scrollToCalculator}
            className="inline-flex items-center px-6 py-3 text-tech-cyan font-semibold 
                       border border-tech-cyan/30 rounded-full hover:bg-tech-cyan/10 
                       transition-all duration-300 hover:border-tech-cyan/60"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Calculate Your Losses →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
