import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Rocket, ArrowRight } from "lucide-react";
import { MagneticButton } from "./enhanced/MagneticButton";
import { siteConfig } from "@/config/site";

const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed
    const dismissed = sessionStorage.getItem('ctaDismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      // Show after scrolling 30% down the page
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;

      if (scrollPercentage > 30 && !isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('ctaDismissed', 'true');
  };

  const handleCTA = () => {
    window.open(siteConfig.bookingUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
        >
          <div className="container mx-auto px-4 pb-4">
            <div className="glass-card p-4 md:p-6 shadow-2xl border-2 border-primary/20 rounded-2xl max-w-4xl mx-auto">
              <div className="flex items-center justify-between gap-4">
                {/* Icon + Text */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="hidden sm:flex w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent items-center justify-center flex-shrink-0">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg md:text-xl mb-1 truncate">
                      Ready to 10x Your Leads?
                    </h3>
                    <p className="text-sm text-muted-foreground hidden md:block">
                      Join 10,000+ businesses using AI to automate lead generation
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <MagneticButton
                    onClick={handleCTA}
                    size="lg"
                    className="gap-2 shadow-glow whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Book a Demo</span>
                    <span className="sm:hidden">Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>

                  <motion.button
                    onClick={handleDismiss}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-destructive/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Progress bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-4 origin-left"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCTA;
