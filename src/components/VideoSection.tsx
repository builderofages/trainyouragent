import { motion } from "framer-motion";
import { Play, Star, Users, TrendingUp } from "lucide-react";
import { GlassCard } from "./enhanced/GlassCard";
import { useState } from "react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Owner, Climate Control HVAC",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    quote: "Our lead volume increased 3x in the first month. The AI handles initial inquiries so well that we only talk to qualified, ready-to-buy customers.",
    video: "placeholder", // Replace with actual video URL
    stats: { leads: "+312%", conversion: "45%", time: "< 30 sec" }
  },
  {
    name: "Michael Chen",
    role: "CEO, Summit Accounting",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    quote: "We used to miss calls after hours. Now our AI agent captures every opportunity 24/7. It's like having a full-time receptionist that never sleeps.",
    video: "placeholder",
    stats: { leads: "+420%", conversion: "52%", time: "< 20 sec" }
  },
  {
    name: "Jennifer Martinez",
    role: "Owner, Apex Roofing Solutions",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
    quote: "During storm season, we were overwhelmed with calls. The AI agent qualified everyone instantly and our close rate actually went UP because we focused on the best leads.",
    video: "placeholder",
    stats: { leads: "+280%", conversion: "58%", time: "< 15 sec" }
  }
];

const VideoSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(0);

  return (
    <section className="py-24 bg-gradient-to-br from-muted/50 via-background to-muted/30 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium">Client Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Real Results from Real Businesses
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how business owners like you are transforming their lead generation
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="overflow-hidden p-0 hover-lift">
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group cursor-pointer">
                {/* Placeholder for video */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-glow group-hover:shadow-glow cursor-pointer"
                  >
                    <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                  </motion.div>
                </div>
                
                {/* Avatar overlay */}
                <img
                  src={testimonials[selectedVideo].avatar}
                  alt={testimonials[selectedVideo].name}
                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
                />
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient mb-1">
                    {testimonials[selectedVideo].stats.leads}
                  </div>
                  <div className="text-xs text-muted-foreground">More Leads</div>
                </div>
                <div className="text-center border-x border-border/50">
                  <div className="text-2xl font-bold text-gradient mb-1">
                    {testimonials[selectedVideo].stats.conversion}
                  </div>
                  <div className="text-xs text-muted-foreground">Conversion</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient mb-1">
                    {testimonials[selectedVideo].stats.time}
                  </div>
                  <div className="text-xs text-muted-foreground">Response Time</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Testimonial List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedVideo(index)}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedVideo === index ? 'ring-2 ring-primary' : ''
                }`}
              >
                <GlassCard className={`p-6 ${selectedVideo === index ? 'bg-primary/5' : ''}`}>
                  <div className="flex gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full border-2 border-primary/20"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold">{testimonial.name}</h4>
                        {selectedVideo === index && (
                          <Play className="w-4 h-4 text-primary fill-primary animate-pulse" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {testimonial.role}
                      </p>
                      <p className="text-sm leading-relaxed italic">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex gap-1 mt-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 mt-16 pt-16 border-t border-border/50"
        >
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <div>
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary" />
            <div>
              <div className="text-2xl font-bold">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-primary fill-primary" />
            <div>
              <div className="text-2xl font-bold">2,000+</div>
              <div className="text-sm text-muted-foreground">5-Star Reviews</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
