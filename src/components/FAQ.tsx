import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ExternalLink, Calendar } from "lucide-react";
import { faqs, faqCategories, getFAQsByCategory } from "@/data/faqs";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { trackEvent } from "@/lib/tracking";
import { StrategySessionLeadGate } from "@/components/conversion/StrategySessionLeadGate";

const generateFAQSchema = (faqList: ReturnType<typeof getFAQsByCategory>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/<[^>]*>/g, '') // Strip HTML tags for schema
      }
    }))
  };
};

const FAQ = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Getting Started");
  const displayFaqs = getFAQsByCategory(selectedCategory);

  // Update schema whenever displayed FAQs change
  useEffect(() => {
    const schemaScript = document.getElementById('faq-schema');
    if (schemaScript) {
      schemaScript.textContent = JSON.stringify(generateFAQSchema(displayFaqs));
    }
  }, [displayFaqs]);

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden" id="faq" itemScope itemType="https://schema.org/FAQPage">
      {/* JSON-LD Schema for SEO */}
      <script 
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(displayFaqs))
        }}
      />
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      
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
            <span className="text-sm font-medium">Data-Backed Answers</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every answer backed by industry research and real data
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {faqCategories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer px-6 py-2 text-sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

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

        {/* Premium CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <GlassCard hover className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 text-center">
            <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Book a discovery call to discuss your needs and get a custom timeline
            </p>
            <MagneticButton
              size="lg"
              className="gap-2"
              onClick={() => {
                trackEvent('faq_discovery_call_click', {
                  source: 'faq_section',
                  button_text: 'Get Your Free Strategy Session'
                });
                setLeadGateOpen(true);
              }}
            >
              <Calendar className="w-5 h-5" />
              Get Your Free Strategy Session
            </MagneticButton>
          </GlassCard>
        </motion.div>
      </div>

      <StrategySessionLeadGate 
        open={leadGateOpen}
        onOpenChange={setLeadGateOpen}
      />
    </section>
  );
};

export default FAQ;
