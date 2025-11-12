import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ExternalLink, Calendar } from "lucide-react";
import { faqs } from "@/data/faqs";
import { useEffect } from "react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { trackEvent } from "@/lib/tracking";

interface IndustryFAQProps {
  industry: string;
  onStrategySessionClick: () => void;
}

const generateIndustryFAQSchema = (industry: string) => {
  const industryFAQs = faqs.filter(faq => faq.industries?.includes(industry));
  const generalFAQs = faqs.filter(faq => !faq.industries || faq.industries.length === 0).slice(0, 5);
  const combinedFAQs = [...industryFAQs, ...generalFAQs].slice(0, 10);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": combinedFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/<[^>]*>/g, '')
      }
    }))
  };
};

export const IndustryFAQ = ({ industry, onStrategySessionClick }: IndustryFAQProps) => {
  const industryFAQs = faqs.filter(faq => faq.industries?.includes(industry));
  const generalFAQs = faqs.filter(faq => !faq.industries || faq.industries.length === 0).slice(0, 5);
  const displayFaqs = [...industryFAQs, ...generalFAQs].slice(0, 10);

  useEffect(() => {
    const schemaScript = document.getElementById(`faq-schema-${industry.toLowerCase()}`);
    if (schemaScript) {
      schemaScript.textContent = JSON.stringify(generateIndustryFAQSchema(industry));
    }
  }, [industry]);

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden" id="faq">
      <script 
        id={`faq-schema-${industry.toLowerCase()}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateIndustryFAQSchema(industry))
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{industry} Industry FAQs</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Common Questions About {industry} AI Agents
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Answers backed by industry research and real data
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {displayFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="glass-card hover:glass-card-hover transition-all duration-300 px-6 border-none shadow-sm hover:shadow-md"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                    <div className="space-y-3">
                      <p>{faq.answer}</p>
                      {faq.sources && faq.sources.length > 0 && (
                        <div className="pt-3 border-t border-border/50">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Sources:</p>
                          <div className="space-y-1">
                            {faq.sources.map((source, idx) => (
                              <a
                                key={idx}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-primary hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {source.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <GlassCard hover className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 text-center">
            <h3 className="text-2xl font-bold mb-2">Still have questions about {industry} solutions?</h3>
            <p className="text-muted-foreground mb-6">
              Book a free strategy session to discuss your {industry.toLowerCase()} business needs
            </p>
            <MagneticButton
              size="lg"
              className="gap-2"
              onClick={() => {
                trackEvent('faq_strategy_session_click', {
                  source: 'industry_faq',
                  industry: industry,
                  button_text: 'Get Your Free Strategy Session'
                });
                onStrategySessionClick();
              }}
            >
              <Calendar className="w-5 h-5" />
              Get Your Free Strategy Session
            </MagneticButton>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
