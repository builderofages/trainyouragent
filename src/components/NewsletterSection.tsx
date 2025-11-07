import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Welcome to the AI Vanguard! 🚀",
        description: "You'll receive exclusive insights and updates.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-24 px-4 bg-void relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full bg-neon/5 blur-3xl"
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card/10 backdrop-blur-xl border-2 border-neon/30 rounded-3xl p-12 md:p-16 shadow-glow">
            {/* Icon */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="mb-6 flex justify-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-neon flex items-center justify-center shadow-glow">
                <Sparkles className="w-8 h-8 text-void" />
              </div>
            </motion.div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white text-center">
              Join the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-neon">
                AI Vanguard
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 text-center max-w-2xl mx-auto">
              Get exclusive insights, early access to new features, and AI strategies that drive real growth
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12 h-14 bg-background/50 border-2 border-border focus:border-neon text-foreground rounded-2xl text-lg"
                />
              </div>
              <Button 
                type="submit"
                size="lg"
                className="bg-gradient-neon hover:opacity-90 text-void font-bold h-14 px-8 rounded-2xl shadow-glow"
              >
                Get Started
              </Button>
            </form>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon animate-glow-pulse" />
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon animate-glow-pulse" />
                <span>Unsubscribe anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon animate-glow-pulse" />
                <span>Join 10,000+ subscribers</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
