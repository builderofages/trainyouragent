import { motion } from "framer-motion";
import { GlassCard } from "./enhanced/GlassCard";
import { Sparkles } from "lucide-react";

export const TechnologyPartners = () => {
  const partners = [
    {
      name: "VAPI",
      description: "Voice AI Infrastructure",
      logo: "🎙️",
    },
    {
      name: "ElevenLabs",
      description: "Neural Voice Synthesis",
      logo: "🔊",
    },
    {
      name: "Apollo.io",
      description: "CRM Integration",
      logo: "🚀",
    },
    {
      name: "OpenAI",
      description: "Language Models",
      logo: "🧠",
    },
    {
      name: "Anthropic",
      description: "Advanced AI",
      logo: "⚡",
    },
    {
      name: "Twilio",
      description: "Communication Platform",
      logo: "📞",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Enterprise-Grade Technology</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powered by <span className="text-gradient">Industry Leaders</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We partner with the world's most advanced AI and communications platforms to deliver enterprise-grade reliability.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hover className="p-6 text-center group cursor-default h-full flex flex-col items-center justify-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {partner.logo}
                </div>
                <h3 className="font-bold text-foreground mb-1">{partner.name}</h3>
                <p className="text-xs text-muted-foreground">{partner.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
