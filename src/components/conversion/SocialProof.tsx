import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneOff, Clock, TrendingUp } from "lucide-react";

interface ResearchStat {
  stat: string;
  description: string;
  source: string;
  icon: typeof PhoneOff;
}

export const SocialProofNotifications = () => {
  const [currentStat, setCurrentStat] = useState<ResearchStat | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const researchStats: ResearchStat[] = [
    { 
      stat: "78% of callers hang up after 4 rings", 
      description: "Your business is losing leads every minute",
      source: "CallRail Study 2024",
      icon: PhoneOff
    },
    { 
      stat: "62% of missed calls never call back", 
      description: "First response time is critical for conversion",
      source: "Harvard Business Review",
      icon: Clock
    },
    { 
      stat: "AI answers in 0.3 seconds vs 3.2 rings", 
      description: "Instant response = higher conversion rates",
      source: "MIT Technology Review",
      icon: TrendingUp
    },
    { 
      stat: "73% of high-intent leads call after hours", 
      description: "Miss the call, miss the revenue",
      source: "Lead Response Study",
      icon: PhoneOff
    },
  ];

  useEffect(() => {
    // Don't show on mobile
    if (window.innerWidth < 768) return;

    // Wait 5 seconds before showing first stat
    const initialDelay = setTimeout(() => {
      showRandomStat();
    }, 5000);

    return () => clearTimeout(initialDelay);
  }, []);

  const showRandomStat = () => {
    const randomStat = researchStats[Math.floor(Math.random() * researchStats.length)];
    setCurrentStat(randomStat);
    setIsVisible(true);

    // Hide after 8 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    // Show next stat after 20-30 seconds
    const nextDelay = 20000 + Math.random() * 10000;
    setTimeout(() => {
      showRandomStat();
    }, nextDelay);
  };

  return (
    <AnimatePresence>
      {isVisible && currentStat && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 0 }}
          className="fixed bottom-8 left-8 z-40 hidden md:block max-w-xs"
        >
          <div className="glass-card p-4 shadow-dramatic border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-glow-sm">
                <currentStat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary text-sm mb-1">
                  {currentStat.stat}
                </p>
                <p className="text-xs text-foreground mb-2">
                  {currentStat.description}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  Source: {currentStat.source}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
