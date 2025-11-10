import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How long does setup take?",
    answer: "Most businesses are up and running in under 24 hours. Our team handles the entire setup process - you just provide your business info and preferences. No technical knowledge required."
  },
  {
    question: "Do I need technical knowledge to use TrainYourAgent?",
    answer: "Not at all! Our platform is designed for business owners, not developers. We handle all the technical complexity behind the scenes. You simply train your AI agent using plain English conversations."
  },
  {
    question: "What if my industry isn't listed?",
    answer: "We work with businesses across 50+ industries beyond what's shown on our site. If your industry isn't listed, book a consultation call and we'll create a custom solution tailored to your specific needs."
  },
  {
    question: "Can I customize the AI's responses?",
    answer: "Absolutely! You have complete control over your AI agent's personality, tone, responses, and qualification criteria. You can update and refine your agent's behavior at any time through our intuitive dashboard."
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 30-day money-back guarantee. If you're not satisfied with your AI agent's performance within the first month, we'll refund your investment - no questions asked."
  },
  {
    question: "How does pricing work?",
    answer: "Our pricing is based on the number of conversations your AI agent handles per month. There are no hidden fees or long-term contracts. Most businesses see ROI within the first 2-4 weeks."
  },
  {
    question: "Will my customers know they're talking to an AI?",
    answer: "That's up to you! Many businesses choose to be transparent about their AI assistants. Our agents are sophisticated enough that customers often can't tell the difference, but we recommend honesty for best long-term relationships."
  },
  {
    question: "How do you handle data security?",
    answer: "Your data security is our top priority. All conversations are encrypted, we're SOC 2 compliant, and we never share your customer data with third parties. Your business information stays private and secure."
  }
];

const FAQ = () => {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden" id="faq">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Got Questions?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about TrainYourAgent
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
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
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
