import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, ArrowRight } from 'lucide-react';
import { MagneticButton } from '@/components/enhanced/MagneticButton';
import { GlassCard } from '@/components/enhanced/GlassCard';
import { Input } from '@/components/ui/input';
import { trackEvent } from '@/lib/tracking';
import { sendToApollo } from '@/lib/apollo-integration';
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
      // Send to Apollo.io
      await sendToApollo({
        email,
        name,
        source: 'Exit Intent Popup',
        tags: ['Exit Intent Capture', industry ? `${industry.toUpperCase()} Landing` : 'Homepage'],
        custom_fields: {
          lead_source: 'Exit Intent Popup',
          industry: industry || 'Not specified',
        },
      });

      trackEvent('exit_intent_submitted', {
        industry,
        has_email: !!email,
        has_name: !!name,
      });

      toast.success('Thanks! Check your email for your ROI calculation guide.');
      
      // Mark as submitted
      sessionStorage.setItem('exit_intent_submitted', 'true');
      
      setIsVisible(false);
    } catch (error) {
      console.error('Failed to submit exit intent form:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
          >
            <GlassCard className="p-8 relative shadow-glow-intense bg-gradient-to-br from-background via-background to-primary/5">
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center shadow-glow">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Wait! Before You Go...</h3>
              </div>

              <p className="text-lg text-muted-foreground mb-6">
                See your potential ROI in 60 seconds. Get a free calculation guide showing exactly how much revenue you could recover.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <MagneticButton
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-premium h-14 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Get My Free ROI Guide
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </MagneticButton>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                No spam. Just valuable insights for your business.
              </p>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
