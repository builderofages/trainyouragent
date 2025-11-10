import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, TrendingUp, Zap, Shield } from "lucide-react";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MondayWebhookSetup, getWebhookUrl, sendToMonday } from "@/components/MondayWebhookSetup";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showWebhookSetup, setShowWebhookSetup] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if webhook is configured, if not show setup
    const webhookUrl = getWebhookUrl("monday_newsletter_webhook");
    if (!webhookUrl) {
      setShowWebhookSetup(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    const webhookUrl = getWebhookUrl("monday_newsletter_webhook");
    
    // Send to Monday.com if webhook is configured
    if (webhookUrl) {
      const sent = await sendToMonday(webhookUrl, {
        type: "newsletter_signup",
        email: email,
        page: "homepage",
      });
      
      if (sent) {
        console.log("Newsletter signup sent to Monday.com");
      }
    }

    setIsSubscribed(true);
    toast({
      title: "Welcome to the AI Revolution! 🚀",
      description: webhookUrl 
        ? "Your info has been sent to our CRM. Check your inbox for exclusive AI insights!"
        : "Check your inbox for exclusive AI insights",
    });
    
    setTimeout(() => {
      setEmail("");
      setIsSubscribed(false);
    }, 3000);
  };

  const benefits = [
    { icon: TrendingUp, text: "Weekly AI strategy insights" },
    { icon: Zap, text: "Early access to new features" },
    { icon: Shield, text: "No spam, unsubscribe anytime" },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 -right-40 w-96 h-96 bg-gradient-primary rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Webhook Setup - Only shown if needed */}
          {showWebhookSetup && (
            <MondayWebhookSetup
              storageKey="monday_newsletter_webhook"
              title="Configure Monday.com Integration"
              description="Connect your Monday.com CRM to automatically receive newsletter signups"
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8 md:p-12 shadow-dramatic hover:shadow-glow transition-all duration-500 relative overflow-hidden border-2 border-glass-border">
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-10 rounded-bl-full" />
              
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", duration: 0.8 }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 shadow-glow"
                >
                  <Mail className="w-10 h-10 text-white" />
                </motion.div>

                {/* Heading */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
                    Join the{" "}
                    <span className="text-gradient">
                      AI Vanguard
                    </span>
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Get exclusive insights, case studies, and early access to revolutionary AI features
                  </p>
                </motion.div>

                {/* Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-6 py-6 text-lg rounded-full glass-card border-2 border-glass-border focus:border-primary transition-all duration-300 shadow-card"
                      disabled={isSubscribed}
                    />
                    <MagneticButton
                      type="submit"
                      size="lg"
                      disabled={isSubscribed}
                      className="px-8 py-6 text-lg rounded-full bg-gradient-primary hover:shadow-glow transition-all duration-300 whitespace-nowrap shadow-blue"
                      strength={20}
                    >
                      {isSubscribed ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Subscribed!
                        </>
                      ) : (
                        "Get Started"
                      )}
                    </MagneticButton>
                  </div>
                </motion.form>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="flex items-center gap-3 glass-card p-3 rounded-xl"
                    >
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 shadow-glow-sm"
                      >
                        <benefit.icon className="w-5 h-5 text-primary" />
                      </motion.div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {benefit.text}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Social Proof */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 pt-8 border-t border-glass-border flex items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                        className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full border-2 border-background flex items-center justify-center text-white text-xs font-bold shadow-blue cursor-pointer"
                      >
                        {i}
                      </motion.div>
                    ))}
                  </div>
                  <span>Join businesses transforming with AI insights</span>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
