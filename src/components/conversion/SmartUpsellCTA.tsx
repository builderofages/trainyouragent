import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, Phone, Calendar, MessageSquare, TrendingUp, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/enhanced/GlassCard';
import { MagneticButton } from '@/components/enhanced/MagneticButton';
import { useBehaviorTracking } from '@/hooks/useBehaviorTracking';
import { trackEvent } from '@/lib/tracking';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

interface UpsellSuggestion {
  id: string;
  title: string;
  message: string;
  icon: React.ReactNode;
  cta: string;
  ctaAction: () => void;
  priority: number;
}

interface SmartUpsellCTAProps {
  industry?: string;
  className?: string;
}

export const SmartUpsellCTA = ({ industry = 'your business', className }: SmartUpsellCTAProps) => {
  const behavior = useBehaviorTracking();
  const [currentSuggestion, setCurrentSuggestion] = useState<UpsellSuggestion | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [hasShown, setHasShown] = useState<string[]>([]);

  useEffect(() => {
    if (dismissed) return;

    const suggestions: UpsellSuggestion[] = [];

    // High Priority: Calculator completed → Try live demo
    if (behavior.calculatorCompleted && !behavior.demoStarted) {
      suggestions.push({
        id: 'calc-to-demo',
        title: '🎯 See Your ROI in Action',
        message: `You could save thousands per month. Want to hear how our AI handles real ${industry} conversations?`,
        icon: <Phone className="w-5 h-5" />,
        cta: 'Try Live Voice Demo',
        ctaAction: () => {
          const demoSection = document.getElementById('voice-demo');
          demoSection?.scrollIntoView({ behavior: 'smooth' });
          trackEvent('smart_upsell_click', { trigger: 'calc-to-demo', industry });
        },
        priority: 10,
      });
    }

    // High Priority: Demo completed → Book strategy call
    if (behavior.demoCompleted && !behavior.calculatorCompleted) {
      suggestions.push({
        id: 'demo-to-booking',
        title: '🚀 Ready to Get Started?',
        message: `Impressive, right? Let's discuss how to implement this for your ${industry} business.`,
        icon: <Calendar className="w-5 h-5" />,
        cta: 'Book Free Strategy Call',
        ctaAction: () => {
          window.open(siteConfig.bookingUrl, '_blank');
          trackEvent('smart_upsell_click', { trigger: 'demo-to-booking', industry });
        },
        priority: 10,
      });
    }

    // Medium Priority: Time on page 45s+ without interaction → Try calculator
    if (behavior.timeOnPage >= 45 && !behavior.calculatorOpened && !behavior.hasInteracted) {
      suggestions.push({
        id: 'time-to-calc',
        title: '💡 Curious About Your ROI?',
        message: `Most ${industry} businesses recover $5,000-$15,000/month in missed calls. Calculate yours in 30 seconds.`,
        icon: <Calculator className="w-5 h-5" />,
        cta: 'Calculate My ROI',
        ctaAction: () => {
          const calcSection = document.getElementById('roi-calculator');
          calcSection?.scrollIntoView({ behavior: 'smooth' });
          trackEvent('smart_upsell_click', { trigger: 'time-to-calc', industry });
        },
        priority: 7,
      });
    }

    // Medium Priority: Deep scroll without conversion → Book call
    if (behavior.scrollDepth >= 60 && behavior.timeOnPage >= 90 && !behavior.demoStarted && !behavior.calculatorOpened) {
      suggestions.push({
        id: 'scroll-to-booking',
        title: '👋 Still Exploring?',
        message: `You've seen the value. Let's discuss your specific ${industry} needs in a quick 15-minute call.`,
        icon: <Calendar className="w-5 h-5" />,
        cta: 'Book a Quick Call',
        ctaAction: () => {
          window.open(siteConfig.bookingUrl, '_blank');
          trackEvent('smart_upsell_click', { trigger: 'scroll-to-booking', industry });
        },
        priority: 6,
      });
    }

    // Medium Priority: Calculator opened but not completed → Encourage completion
    if (behavior.calculatorOpened && !behavior.calculatorCompleted && behavior.timeOnPage >= 60) {
      suggestions.push({
        id: 'calc-incomplete',
        title: '📊 See Your Numbers',
        message: `You're one click away from seeing exactly how much revenue you're leaving on the table.`,
        icon: <TrendingUp className="w-5 h-5" />,
        cta: 'Complete Calculator',
        ctaAction: () => {
          const calcSection = document.getElementById('roi-calculator');
          calcSection?.scrollIntoView({ behavior: 'smooth' });
          trackEvent('smart_upsell_click', { trigger: 'calc-incomplete', industry });
        },
        priority: 8,
      });
    }

    // Low Priority: Long idle time → Offer help
    if (behavior.idleTime >= 30 && behavior.timeOnPage >= 60) {
      suggestions.push({
        id: 'idle-to-chat',
        title: '💬 Have Questions?',
        message: `We're here to help! Chat with us about how AI can transform your ${industry} operations.`,
        icon: <MessageSquare className="w-5 h-5" />,
        cta: 'Start a Conversation',
        ctaAction: () => {
          // Trigger chat panel
          const chatButton = document.querySelector('[data-chat-button]') as HTMLElement;
          chatButton?.click();
          trackEvent('smart_upsell_click', { trigger: 'idle-to-chat', industry });
        },
        priority: 5,
      });
    }

    // Both calculator AND demo completed → Final push
    if (behavior.calculatorCompleted && behavior.demoCompleted) {
      suggestions.push({
        id: 'full-engagement',
        title: '🎉 You\'re Ready!',
        message: `You've seen the numbers and experienced the AI. Let's get you set up this week.`,
        icon: <Sparkles className="w-5 h-5" />,
        cta: 'Claim Your Setup Slot',
        ctaAction: () => {
          window.open(siteConfig.bookingUrl, '_blank');
          trackEvent('smart_upsell_click', { trigger: 'full-engagement', industry });
        },
        priority: 11,
      });
    }

    // Select highest priority suggestion that hasn't been shown
    const availableSuggestions = suggestions.filter(s => !hasShown.includes(s.id));
    if (availableSuggestions.length > 0) {
      const topSuggestion = availableSuggestions.sort((a, b) => b.priority - a.priority)[0];
      setCurrentSuggestion(topSuggestion);
      setHasShown(prev => [...prev, topSuggestion.id]);
      
      trackEvent('smart_upsell_shown', { 
        trigger: topSuggestion.id, 
        industry,
        time_on_page: behavior.timeOnPage,
        scroll_depth: behavior.scrollDepth 
      });
    }
  }, [
    behavior.timeOnPage,
    behavior.calculatorOpened,
    behavior.calculatorCompleted,
    behavior.demoStarted,
    behavior.demoCompleted,
    behavior.scrollDepth,
    behavior.idleTime,
    behavior.hasInteracted,
    dismissed,
    hasShown,
    industry,
  ]);

  const handleDismiss = () => {
    setDismissed(true);
    setCurrentSuggestion(null);
    trackEvent('smart_upsell_dismissed', { 
      trigger: currentSuggestion?.id,
      industry 
    });
  };

  if (!currentSuggestion || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={cn('fixed bottom-6 right-6 z-40 max-w-md', className)}
      >
        <GlassCard className="p-6 shadow-glow border-primary/30 relative overflow-hidden">
          {/* Animated gradient background */}
          <motion.div
            animate={{
              background: [
                'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
                'linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 -z-10"
          />

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                className="p-2 rounded-lg bg-primary/20 text-primary"
              >
                {currentSuggestion.icon}
              </motion.div>
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-1">{currentSuggestion.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentSuggestion.message}
                </p>
              </div>
            </div>

            <MagneticButton
              onClick={currentSuggestion.ctaAction}
              className="w-full"
              size="lg"
            >
              {currentSuggestion.cta}
            </MagneticButton>
          </div>

          {/* Progress indicator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 8 }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent origin-left"
            onAnimationComplete={handleDismiss}
          />
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
};
