import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/enhanced/GlassCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/tracking';
import { toast } from 'sonner';

interface ExitIntentLeadCaptureProps {
  industry?: string;
}

export const ExitIntentLeadCapture = ({ industry }: ExitIntentLeadCaptureProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Don't enable exit intent on touch devices (mobile)
    if ('ontouchstart' in window) {
      return;
    }
    
    // Don't show if already shown this session
    if (sessionStorage.getItem('exit_intent_shown')) {
      return;
    }

    // Don't show if user already booked
    if (sessionStorage.getItem('booking_confirmed')) {
      return;
    }

    let hasShown = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top of viewport
      if (e.clientY <= 0 && !hasShown && !isDismissed) {
        hasShown = true;
        setIsVisible(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
        
        trackEvent('exit_intent_triggered', { industry });
      }
    };

    // Add slight delay before enabling exit intent
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 10000); // Wait 10 seconds before enabling

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDismissed, industry]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    
    trackEvent('exit_intent_dismissed', { industry });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Track event
      trackEvent('exit_intent_submitted', {
        industry: industry || 'Homepage',
      });
      
      toast.success('Thanks! Check your email for your free guide.');
      setIsVisible(false);
      setIsDismissed(true);
    } catch (error) {
      console.error('Exit intent submission error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="relative max-w-md p-8">
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Gift className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Wait! Don't Miss This</h3>
                <p className="text-muted-foreground">
                  Get our free guide: "How AI Voice Agents Save {industry || 'Businesses'} $2,400/Month"
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Get Free Guide'
                  )}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
