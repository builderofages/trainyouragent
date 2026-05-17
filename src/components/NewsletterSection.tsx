import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, TrendingUp, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribed(true);
    toast({
      title: "Welcome to the AI Revolution! 🚀",
      description: "Check your inbox for exclusive AI insights",
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
    <section className="py-24 bg-white relative overflow-hidden">
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
          <div className="bg-white/90 backdrop-blur-sm border-2 border-primary/20 shadow-blue p-8 md:p-12 relative overflow-hidden rounded-3xl">
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-10 rounded-bl-full" />
            
            <div className="relative z-10">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 0.8 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mb-6 shadow-blue"
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
                  <span className="bg-clip-text text-transparent bg-gradient-primary">
                    AI Vanguard
                  </span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Get exclusive insights, case studies, and early access to early access to new features
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
                    className="flex-1 px-6 py-6 text-lg rounded-full border-2 border-border focus:border-primary transition-all duration-300"
                    disabled={isSubscribed}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubscribed}
                    className="px-8 py-6 text-lg rounded-full bg-gradient-primary hover:shadow-blue transition-all duration-300 whitespace-nowrap"
                  >
                    {isSubscribed ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Subscribed!
                      </>
                    ) : (
                      "Email me the weekly ship-notes"
                    )}
                  </Button>
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
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
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
                transition={{ delay: 0.6 }}
                className="mt-8 pt-8 border-t border-border flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gradient-primary rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <span>Join businesses transforming with AI insights</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
