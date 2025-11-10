import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, MapPin } from "lucide-react";

interface Notification {
  name: string;
  location: string;
  action: string;
  time: string;
}

export const SocialProofNotifications = () => {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const notifications: Notification[] = [
    { name: "Sarah M.", location: "Miami, FL", action: "booked a demo", time: "2 minutes ago" },
    { name: "John D.", location: "Austin, TX", action: "downloaded ROI calculator", time: "5 minutes ago" },
    { name: "Lisa K.", location: "Seattle, WA", action: "signed up for trial", time: "8 minutes ago" },
    { name: "Michael R.", location: "Boston, MA", action: "booked a demo", time: "12 minutes ago" },
    { name: "Emma S.", location: "Denver, CO", action: "viewed pricing", time: "15 minutes ago" },
    { name: "David T.", location: "Chicago, IL", action: "booked a demo", time: "18 minutes ago" },
  ];

  useEffect(() => {
    // Don't show on mobile
    if (window.innerWidth < 768) return;

    // Wait 3 seconds before showing first notification
    const initialDelay = setTimeout(() => {
      showRandomNotification();
    }, 3000);

    return () => clearTimeout(initialDelay);
  }, []);

  const showRandomNotification = () => {
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    setCurrentNotification(randomNotification);
    setIsVisible(true);

    // Hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // Show next notification after 15-25 seconds
    const nextDelay = 15000 + Math.random() * 10000;
    setTimeout(() => {
      showRandomNotification();
    }, nextDelay);
  };

  return (
    <AnimatePresence>
      {isVisible && currentNotification && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 0 }}
          className="fixed bottom-8 left-8 z-40 hidden md:block"
        >
          <div className="glass-card p-4 pr-6 shadow-dramatic max-w-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-blue">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground text-sm mb-1">
                  <span className="text-primary">{currentNotification.name}</span> just {currentNotification.action}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{currentNotification.location}</span>
                  <span>•</span>
                  <span>{currentNotification.time}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
