import { Phone, MessageSquare, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { ChatModal } from "./ChatModal";

export const FloatingContactMenu = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPulse, setIsPulse] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  const handleCallClick = () => {
    // Track phone click event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'phone_number_clicked', {
        event_category: 'engagement',
        event_label: 'floating_menu',
        value: 1,
      });
    }

    // Track Meta Pixel event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Contact', {
        content_name: 'Phone Click',
        content_category: 'floating_menu',
      });
    }
  };

  const handleChatClick = () => {
    setIsChatOpen(true);
    setIsExpanded(false);

    // Track chat open event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'chat_opened', {
        event_category: 'engagement',
        event_label: 'floating_menu',
        value: 1,
      });
    }

    // Track Meta Pixel event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Contact', {
        content_name: 'Chat Opened',
        content_category: 'floating_menu',
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="relative">
              {/* Pulse effect */}
              {isPulse && !isExpanded && (
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

              {/* Expanded menu options */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full right-0 mb-4 flex flex-col gap-3"
                  >
                    {/* Chat Option */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleChatClick}
                      className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span className="font-medium">Chat with AI</span>
                    </motion.button>

                    {/* Call Option */}
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={`tel:${siteConfig.phoneNumber}`}
                      onClick={handleCallClick}
                      className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap"
                    >
                      <Phone className="h-5 w-5" />
                      <span className="font-medium">Call AI Agent</span>
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main menu button */}
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isExpanded ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6 text-primary-foreground" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6 text-primary-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Tooltip */}
              {!isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap pointer-events-none"
                >
                  <div className="glass-card px-3 py-2 text-sm font-medium">
                    Get Instant Help
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Chat or Call 24/7
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};
