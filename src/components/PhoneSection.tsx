import { Phone, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { ClickToCall } from "./ClickToCall";

export const PhoneSection = () => {
  if (!siteConfig.phoneNumber) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container">
        <div className="glass-card p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Call to action */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Instant Response</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Prefer to Talk?
                  <br />
                  <span className="text-primary">Call Our AI Agent</span>
                </h2>

                <p className="text-lg text-muted-foreground mb-6">
                  Experience our technology firsthand. Our AI voice agent will answer your questions, 
                  understand your needs, and help you get started in minutes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <ClickToCall 
                    variant="default" 
                    size="lg"
                    trackingLocation="phone_section"
                    className="text-lg px-8"
                  />
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{siteConfig.businessHours.message}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Features */}
            <div className="space-y-4">
              {[
                {
                  icon: Phone,
                  title: "Instant Connection",
                  description: "Connect with our AI agent immediately - no wait times, no voicemail"
                },
                {
                  icon: Zap,
                  title: "Intelligent Qualification",
                  description: "Our agent understands your needs and provides personalized recommendations"
                },
                {
                  icon: Clock,
                  title: "24/7 Availability",
                  description: "Call anytime, day or night - our AI agent is always ready to help"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
