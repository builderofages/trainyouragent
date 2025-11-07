import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench, Calculator, Home } from "lucide-react";

const niches = [
  {
    icon: Wrench,
    title: "HVAC Mastery",
    description: "Turn Calls into Cashflow Overnight",
    color: "from-blue-500 to-cyan-500",
    stats: "95% Lead Capture",
  },
  {
    icon: Calculator,
    title: "Accounting Intelligence",
    description: "Automate Books, Amplify Insights",
    color: "from-emerald-500 to-teal-500",
    stats: "Coming Soon",
  },
  {
    icon: Home,
    title: "Roofing Excellence",
    description: "Seal Deals Faster Than Rain Falls",
    color: "from-orange-500 to-red-500",
    stats: "Coming Soon",
  },
];

const NicheCarousel = () => {
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
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-neon">
              AI Realm
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Industry-specific agents that understand your unique challenges
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {niches.map((niche, index) => (
            <motion.div
              key={niche.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className="relative overflow-hidden border-2 border-border hover:border-neon/50 transition-all duration-500 bg-card shadow-card hover:shadow-glow h-full">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${niche.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative p-8 flex flex-col h-full">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${niche.color} flex items-center justify-center shadow-lg`}>
                      <niche.icon className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3 text-foreground">
                    {niche.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-lg flex-grow">
                    {niche.description}
                  </p>

                  {/* Stats badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/30 mb-6 w-fit">
                    <span className="text-sm font-semibold text-neon">
                      {niche.stats}
                    </span>
                  </div>

                  {/* CTA */}
                  <Button 
                    className="w-full group/btn bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    size="lg"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Dive In
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Custom realm CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Don't see your industry?
          </p>
          <Button variant="outline" size="lg" className="border-2 border-neon text-foreground hover:bg-neon/10 font-semibold">
            Request Custom AI Realm
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default NicheCarousel;
