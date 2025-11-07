import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, ProHVAC Solutions",
    content: "Our lead response time went from hours to seconds. The AI agent handles after-hours calls flawlessly. Revenue up 300% in 6 months.",
    rating: 5,
    industry: "HVAC",
  },
  {
    name: "Marcus Rodriguez",
    role: "Operations Director",
    content: "I was skeptical at first, but this AI agent transformed our entire workflow. What used to take 3 people now runs automatically.",
    rating: 5,
    industry: "Accounting",
  },
  {
    name: "Jennifer Walsh",
    role: "Founder, Elite Roofing Co",
    content: "The ROI was immediate. Our team focuses on high-value work while the AI handles everything else. Game-changing technology.",
    rating: 5,
    industry: "Roofing",
  },
];

const SocialProof = () => {
  return (
    <section className="py-24 px-4 bg-background relative overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-4 text-foreground">
            Loved by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-neon">
              Industry Leaders
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of businesses that chose to evolve
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="relative overflow-hidden border-2 border-border hover:border-neon/50 transition-all duration-500 bg-card shadow-card hover:shadow-glow p-8 h-full">
                {/* Quote icon */}
                <Quote className="absolute top-4 right-4 w-12 h-12 text-neon/10" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-neon text-neon" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="mt-auto">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-neon flex items-center justify-center text-void font-bold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  
                  {/* Industry badge */}
                  <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-neon/10 border border-neon/30">
                    <span className="text-xs font-semibold text-neon">
                      {testimonial.industry}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">Trusted by businesses worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
            {["HVAC Pro", "AccountFlow", "RoofMaster", "SmartOps", "BizAI"].map((company) => (
              <div key={company} className="text-2xl font-bold text-foreground">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
