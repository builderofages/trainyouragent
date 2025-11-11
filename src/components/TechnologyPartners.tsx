import { motion } from "framer-motion";
import { GlassCard } from "./enhanced/GlassCard";
import { Sparkles } from "lucide-react";

export const TechnologyPartners = () => {
  const partners = [
    {
      name: "VAPI",
      description: "Voice AI Infrastructure",
      logoPath: "/logos/vapi-logo.svg",
      brandColor: "text-blue-500",
      logoStyle: "font-bold text-2xl tracking-tight",
    },
    {
      name: "ElevenLabs",
      description: "Neural Voice Synthesis",
      logoPath: "/logos/elevenlabs-logo.svg",
      brandColor: "text-purple-600",
      logoStyle: "font-bold text-2xl",
    },
    {
      name: "Apollo.io",
      description: "CRM Integration",
      logoPath: "/logos/apollo-logo.svg",
      brandColor: "text-indigo-600",
      logoStyle: "font-bold text-2xl",
    },
    {
      name: "OpenAI",
      description: "Language Models",
      logoPath: "/logos/openai-logo.svg",
      brandColor: "text-emerald-600",
      logoStyle: "font-bold text-2xl",
    },
    {
      name: "Anthropic",
      description: "Advanced AI",
      logoPath: "/logos/anthropic-logo.svg",
      brandColor: "text-orange-500",
      logoStyle: "font-bold text-2xl italic",
    },
    {
      name: "Twilio",
      description: "Communication Platform",
      logoPath: "/logos/twilio-logo.svg",
      brandColor: "text-red-500",
      logoStyle: "font-bold text-2xl",
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
                <div className="w-20 h-20 mb-3 flex items-center justify-center relative">
                  <img 
                    src={partner.logoPath}
                    alt={`${partner.name} logo`}
                    className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      // Fallback to text logo if image doesn't exist
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLDivElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <div 
                    className={`${partner.brandColor} ${partner.logoStyle} transition-all duration-300 group-hover:scale-110`}
                    style={{ display: 'none' }}
                  >
                    {partner.name}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{partner.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
