import { Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";

export const FloatingPhoneButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPulse, setIsPulse] = useState(true);

  useEffect(() => {
    // Show after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Stop pulse after 10 seconds
    const pulseTimer = setTimeout(() => {
      setIsPulse(false);
    }, 13000);

    return () => {
      clearTimeout(timer);
      clearTimeout(pulseTimer);
    };
  }, []);

  if (!siteConfig.phoneNumber) {
    return null;
  }

  const handleClick = () => {
    // Track phone click event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'phone_number_clicked', {
        event_category: 'engagement',
        event_label: 'floating_button',
        value: 1,
      });
    }

    // Track Meta Pixel event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Contact', {
        content_name: 'Phone Click',
        content_category: 'floating_button',
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 md:hidden"
        >
          <a
            href={`tel:${siteConfig.phoneNumber}`}
            onClick={handleClick}
            className="relative block"
          >
            {/* Pulse effect */}
            {isPulse && (
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/20"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Button */}
            <motion.div
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="h-6 w-6 text-primary-foreground" />
            </motion.div>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap"
            >
              <div className="glass-card px-3 py-2 text-sm font-medium">
                Talk to AI Agent
                <div className="text-xs text-muted-foreground mt-0.5">
                  {siteConfig.businessHours.message}
                </div>
              </div>
            </motion.div>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
