import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, Phone, Twitter, Instagram, Linkedin, MessageSquare, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { StrategySessionLeadGate } from "@/components/conversion/StrategySessionLeadGate";
import { CustomSolutionsCallout } from "@/components/CustomSolutionsCallout";
import { FloatingIsland } from "@/components/effects/FloatingIsland";
import { siteConfig } from "@/config/site";

const Contact = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      items: [
        { label: "General Inquiries", value: "support@trainyouragent.com" },
        { label: "Sales", value: "sales@trainyouragent.com" },
        { label: "Legal", value: "legal@trainyouragent.com" },
        { label: "Privacy", value: "privacy@trainyouragent.com" },
      ]
    },
    {
      icon: MapPin,
      title: "Location",
      items: [
        { label: "Headquarters", value: "TrainYourAgent LLC" },
        { label: "Based in", value: "Florida, United States" },
        { label: "Service Area", value: "Nationwide Coverage" },
        { label: "Operations", value: "Virtual Office" },
      ]
    },
    {
      icon: Clock,
      title: "Business Hours",
      items: [
        { label: "AI Available", value: "24/7/365" },
        { label: "Human Support", value: "Mon-Fri" },
        { label: "Hours", value: "9:00 AM - 5:00 PM EST" },
        { label: "Response Time", value: "Within 24 hours" },
      ]
    },
  ];

  const socialLinks = [
    { icon: Twitter, url: siteConfig.socialMedia.twitter, label: "Twitter" },
    { icon: Instagram, url: siteConfig.socialMedia.instagram, label: "Instagram" },
    { icon: Linkedin, url: siteConfig.socialMedia.linkedin, label: "LinkedIn" },
  ];

  const faqs = [
    {
      question: "When will I hear back?",
      answer: "We respond to all inquiries within 24 hours during business days. For urgent matters, use our live chat or call our AI receptionist for immediate assistance."
    },
    {
      question: "What's the best way to reach you?",
      answer: "For strategy sessions and sales inquiries, use the 'Get Your Free Strategy Session' button. For general questions, email support@trainyouragent.com. For immediate assistance, use our live chat in the bottom-right corner."
    },
    {
      question: "Do you offer phone consultations?",
      answer: "Yes! Our AI voice agent is available 24/7. For human consultation, book a free strategy session and we'll discuss your needs in detail."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Get in Touch</span>
            </div>
            <h1 className="text-hero mb-6">
              Let's Talk About <span className="text-gradient-premium">Your Growth</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions? Ready to transform your business with AI? We're here to help. Reach out and let's discuss how we can help you capture more revenue.
            </p>
          </motion.div>

          {/* Contact Methods Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {contactMethods.map((method, index) => (
              <FloatingIsland key={index} delay={index * 0.1} intensity="low">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-8 h-full hover-lift border-gradient">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-premium flex items-center justify-center mb-6 shadow-glow-sm">
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-6 text-gradient-premium">{method.title}</h3>
                    <div className="space-y-4">
                      {method.items.map((item, i) => (
                        <div key={i}>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">{item.label}</p>
                          <p className="text-sm font-bold text-foreground">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              </FloatingIsland>
            ))}
          </div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-12 rounded-3xl text-center mb-20"
          >
            <Send className="w-20 h-20 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-black mb-4">
              Ready to <span className="text-gradient-premium">Get Started?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Book your free strategy session and discover how AI can transform your business operations within 3-7 days.
            </p>
            <MagneticButton
              size="lg"
              className="rounded-full bg-gradient-premium shadow-premium hover:shadow-glow-intense text-lg px-8"
              onClick={() => setLeadGateOpen(true)}
              strength={25}
            >
              <MessageSquare className="w-6 h-6 mr-3" />
              Get Your Free Strategy Session
            </MagneticButton>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-20"
          >
            <h3 className="text-2xl font-black mb-6">Connect With Us</h3>
            <div className="flex gap-4 justify-center">
              {socialLinks.map((social, index) => (
                <MagneticButton
                  key={index}
                  variant="outline"
                  size="lg"
                  className="rounded-full border-gradient w-16 h-16 p-0"
                  onClick={() => window.open(social.url, '_blank')}
                  strength={20}
                >
                  <social.icon className="w-6 h-6" />
                </MagneticButton>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-3xl font-black mb-8 text-center">
              Common <span className="text-gradient-premium">Questions</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {faqs.map((faq, index) => (
                <FloatingIsland key={index} delay={0.6 + index * 0.1} intensity="low">
                  <GlassCard className="p-6 h-full hover-lift border-gradient">
                    <h4 className="font-black text-lg mb-3 text-primary">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </GlassCard>
                </FloatingIsland>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom Solutions Info */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 max-w-2xl">
          <CustomSolutionsCallout 
            variant="compact"
            onContactClick={() => setLeadGateOpen(true)}
          />
        </div>
      </section>

      <StrategySessionLeadGate open={leadGateOpen} onOpenChange={setLeadGateOpen} />

      <Footer />
    </div>
  );
};

export default Contact;
