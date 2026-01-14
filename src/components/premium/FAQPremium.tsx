import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { siteConfig } from "@/config/site";

const faqs = [
  {
    question: "How fast can we be live?",
    answer: "Most businesses are live within 5 business days. Simple setups: 3 days. Enterprise customizations: 1-2 weeks.",
  },
  {
    question: "What happens if the AI can't handle a call?",
    answer: "It gathers caller info and notifies you instantly via text and email. For urgent situations, it can transfer to a live number. You never lose the lead.",
  },
  {
    question: "Does it work with my existing phone number?",
    answer: "Yes. We port your number or set up forwarding. Your customers won't notice anything changed - except someone always answers now.",
  },
  {
    question: "What's your guarantee?",
    answer: "30-day guarantee. If you're not seeing ROI in month one, we work with you to fix it or refund your setup fee. No questions asked.",
  },
  {
    question: "How does billing work?",
    answer: "Monthly subscription, billed at start of each month. No long-term contracts. Cancel with 30 days notice. Simple.",
  },
  {
    question: "Can the AI handle my specific scenario?",
    answer: "Probably yes. Book a 15-minute call and we'll tell you exactly how we'd handle your specific use case. No commitment.",
  },
];

export const FAQPremium = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 md:py-32 bg-surface overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Headline */}
        <motion.h2
          className="text-4xl md:text-5xl font-black text-text-primary text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Questions? Answers.
        </motion.h2>

        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * index }}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left 
                         hover:bg-surface/50 transition-colors duration-200"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-text-primary pr-4">{faq.question}</span>
                <div className="shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-trust-blue" />
                  ) : (
                    <Plus className="w-5 h-5 text-text-secondary" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-5 text-text-secondary leading-relaxed border-t border-border">
                      <p className="pt-4">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-text-secondary mb-4">
            Still have questions?
          </p>
          <button
            onClick={() => window.open(siteConfig.bookingUrl, "_blank")}
            className="text-trust-blue font-semibold hover:underline"
          >
            Book a quick call →
          </button>
        </motion.div>
      </div>
    </section>
  );
};
