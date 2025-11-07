import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { AnimatedCounter } from "@/components/enhanced/AnimatedCounter";
import { use3DCard } from "@/hooks/use3DCard";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "HVAC Business Owner",
    content: "TrainYourAgent transformed our operations overnight. We're now handling 3x the calls without adding staff.",
    rating: 5,
    industry: "HVAC",
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Accounting Firm Partner",
    content: "The AI agents handle routine tasks flawlessly, freeing our team to focus on high-value advisory work.",
    rating: 5,
    industry: "Accounting",
    avatar: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Roofing Contractor",
    content: "Quote generation that used to take hours now happens in minutes. Our close rate has doubled.",
    rating: 5,
    industry: "Roofing",
    avatar: "ER",
  },
];

const TestimonialCard = ({ testimonial, index }: any) => {
  const { ref, style, onMouseMove, onMouseLeave } = use3DCard(8);

  return (
    <motion.div
      ref={ref as any}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="perspective-1000"
    >
      <GlassCard hover className="relative p-8 shadow-dramatic hover:shadow-glow transition-all duration-500 h-full border-2 border-glass-border">
        {/* Quote Icon */}
        <div className="absolute top-6 right-6 opacity-10">
          <Quote className="w-16 h-16 text-primary" />
        </div>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + i * 0.05 }}
              whileHover={{ scale: 1.2, rotate: 360 }}
            >
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <p className="text-foreground text-lg mb-6 leading-relaxed relative z-10">
          "{testimonial.content}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold shadow-glow-sm"
          >
            {testimonial.avatar}
          </motion.div>
          <div>
            <div className="font-bold text-foreground">
              {testimonial.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {testimonial.role}
            </div>
          </div>
        </div>

        {/* Industry Badge */}
        <div className="absolute bottom-6 right-6">
          <span className="px-3 py-1 glass-card text-primary text-xs font-bold rounded-full shadow-glow-sm">
            {testimonial.industry}
          </span>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const SocialProof = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
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
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 rounded-full glass-card text-sm font-medium shadow-glow-sm">
              ⭐ Testimonials
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Loved by{" "}
            <span className="text-gradient">
              Innovators
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of businesses transforming their operations with AI
          </p>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
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
            Powering innovation across industries
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: "Success Rate", value: 99, suffix: "%" },
              { label: "Happy Clients", value: 10, suffix: "K+" },
              { label: "AI Agents Live", value: 50, suffix: "K+" },
              { label: "Industries", value: 25, suffix: "+" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-center glass-card p-6 rounded-xl shadow-card hover:shadow-dramatic transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    className="text-gradient"
                  />
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
