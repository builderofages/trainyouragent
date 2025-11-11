import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, Phone, Calendar, MessageSquare, TrendingUp, Sparkles, Zap, Target, Gift } from 'lucide-react';
import { GlassCard } from '@/components/enhanced/GlassCard';
import { MagneticButton } from '@/components/enhanced/MagneticButton';
import { useBehaviorTracking } from '@/hooks/useBehaviorTracking';
import { trackEvent } from '@/lib/tracking';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

interface MessageVariant {
  title: string;
  message: string;
  cta: string;
}

interface VisualVariant {
  id: string;
  cardStyle: string;
  buttonVariant: 'default' | 'outline' | 'secondary';
  iconAnimation: 'rotate' | 'pulse' | 'bounce';
  position: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

interface TimingVariant {
  id: string;
  delayMultiplier: number; // Multiply base timing by this
  minTimeOnPage: number;
}

interface UpsellSuggestion {
  id: string;
  messageVariants: MessageVariant[];
  icon: React.ReactNode;
  ctaAction: () => void;
  priority: number;
  baseTiming: number; // Base seconds before showing
}

interface SmartUpsellCTAProps {
  industry?: string;
  className?: string;
}

// A/B Test Variants Configuration
const VISUAL_VARIANTS: VisualVariant[] = [
  {
    id: 'gradient-bold',
    cardStyle: 'border-primary/30 shadow-glow',
    buttonVariant: 'default',
    iconAnimation: 'rotate',
    position: 'bottom-right',
  },
  {
    id: 'minimal-clean',
    cardStyle: 'border-border/50 shadow-lg',
    buttonVariant: 'outline',
    iconAnimation: 'pulse',
    position: 'bottom-right',
  },
  {
    id: 'accent-bright',
    cardStyle: 'border-accent/40 shadow-glow-sm bg-accent/5',
    buttonVariant: 'secondary',
    iconAnimation: 'bounce',
    position: 'bottom-left',
  },
];

const TIMING_VARIANTS: TimingVariant[] = [
  { id: 'fast', delayMultiplier: 0.7, minTimeOnPage: 20 },
  { id: 'medium', delayMultiplier: 1.0, minTimeOnPage: 30 },
  { id: 'slow', delayMultiplier: 1.5, minTimeOnPage: 45 },
];

const getVariantAssignment = (key: string): string => {
  const stored = sessionStorage.getItem(`ab_variant_${key}`);
  if (stored) return stored;
  
  // Randomly assign variant and persist
  const variants = key === 'visual' ? VISUAL_VARIANTS : key === 'timing' ? TIMING_VARIANTS : [];
  const selected = variants[Math.floor(Math.random() * variants.length)];
  const variantId = selected?.id || 'default';
  sessionStorage.setItem(`ab_variant_${key}`, variantId);
  return variantId;
};

export const SmartUpsellCTA = ({ industry = 'your business', className }: SmartUpsellCTAProps) => {
  const behavior = useBehaviorTracking();
  const [currentSuggestion, setCurrentSuggestion] = useState<UpsellSuggestion | null>(null);
  const [currentMessageVariant, setCurrentMessageVariant] = useState<MessageVariant | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [hasShown, setHasShown] = useState<string[]>([]);
  
  // Get assigned variants
  const visualVariantId = getVariantAssignment('visual');
  const timingVariantId = getVariantAssignment('timing');
  const visualVariant = VISUAL_VARIANTS.find(v => v.id === visualVariantId) || VISUAL_VARIANTS[0];
  const timingVariant = TIMING_VARIANTS.find(v => v.id === timingVariantId) || TIMING_VARIANTS[1];

  useEffect(() => {
    if (dismissed) return;

    const suggestions: UpsellSuggestion[] = [];

    // High Priority: Calculator completed → Try live demo
    if (behavior.calculatorCompleted && !behavior.demoStarted && behavior.timeOnPage >= timingVariant.minTimeOnPage) {
      suggestions.push({
        id: 'calc-to-demo',
        messageVariants: [
          {
            title: '🎯 See Your ROI in Action',
            message: `You could save thousands per month. Want to hear how our AI handles real ${industry} conversations?`,
            cta: 'Try Live Voice Demo',
          },
          {
            title: '💰 Ready to Hear Real Results?',
            message: `Those numbers are impressive, right? Experience how our AI actually sounds with ${industry} customers.`,
            cta: 'Listen to AI Demo',
          },
          {
            title: '🚀 From Numbers to Reality',
            message: `Your ROI looks great on paper. Now hear it in action with a live ${industry} demo call.`,
            cta: 'Experience Live Demo',
          },
        ],
        icon: <Phone className="w-5 h-5" />,
        ctaAction: () => {
          const demoSection = document.getElementById('voice-demo');
          demoSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
        priority: 10,
        baseTiming: 5,
      });
    }

    // High Priority: Demo completed → Book strategy call
    if (behavior.demoCompleted && behavior.timeOnPage >= timingVariant.minTimeOnPage) {
      suggestions.push({
        id: 'demo-to-booking',
        messageVariants: [
          {
            title: '🚀 Ready to Get Started?',
            message: `Impressive, right? Let's discuss implementing this for your ${industry} business.`,
            cta: 'Book Free Strategy Call',
          },
          {
            title: '⚡ Let\'s Make This Happen',
            message: `You've seen what's possible. Book a 15-min call to get your ${industry} AI set up this week.`,
            cta: 'Schedule Quick Setup Call',
          },
          {
            title: '🎯 Claim Your Implementation Slot',
            message: `Most ${industry} businesses go live in 5 days. Let's get you started with a free consultation.`,
            cta: 'Get Started Today',
          },
        ],
        icon: <Calendar className="w-5 h-5" />,
        ctaAction: () => {
          window.open(siteConfig.bookingUrl, '_blank');
        },
        priority: 10,
        baseTiming: 3,
      });
    }

    // Medium Priority: Time on page without interaction → Try calculator
    const calculatorTiming = 45 * timingVariant.delayMultiplier;
    if (behavior.timeOnPage >= calculatorTiming && !behavior.calculatorOpened && !behavior.hasInteracted) {
      suggestions.push({
        id: 'time-to-calc',
        messageVariants: [
          {
            title: '💡 Curious About Your ROI?',
            message: `Most ${industry} businesses recover $5,000-$15,000/month in missed calls. Calculate yours in 30 seconds.`,
            cta: 'Calculate My ROI',
          },
          {
            title: '📊 What\'s Your Lost Revenue?',
            message: `${industry} businesses lose an average of $8,500/month from missed calls. See your exact number.`,
            cta: 'Show Me My Numbers',
          },
          {
            title: '🎁 Free ROI Assessment',
            message: `Discover how much revenue you're leaving on the table. Takes 30 seconds, results will surprise you.`,
            cta: 'Get Free Assessment',
          },
        ],
        icon: <Calculator className="w-5 h-5" />,
        ctaAction: () => {
          const calcSection = document.getElementById('roi-calculator');
          calcSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
        priority: 7,
        baseTiming: calculatorTiming,
      });
    }

    // Medium Priority: Deep scroll without conversion → Book call
    const scrollTiming = 90 * timingVariant.delayMultiplier;
    if (behavior.scrollDepth >= 60 && behavior.timeOnPage >= scrollTiming && !behavior.demoStarted && !behavior.calculatorOpened) {
      suggestions.push({
        id: 'scroll-to-booking',
        messageVariants: [
          {
            title: '👋 Still Exploring?',
            message: `You've seen the value. Let's discuss your specific ${industry} needs in a quick 15-minute call.`,
            cta: 'Book a Quick Call',
          },
          {
            title: '🤝 Have Questions?',
            message: `${industry} experts available now. Get your questions answered in a no-pressure consultation.`,
            cta: 'Talk to an Expert',
          },
          {
            title: '💬 Let\'s Chat About Your Goals',
            message: `Every ${industry} business is unique. Schedule a call to discuss your specific situation and goals.`,
            cta: 'Schedule Free Call',
          },
        ],
        icon: <Calendar className="w-5 h-5" />,
        ctaAction: () => {
          window.open(siteConfig.bookingUrl, '_blank');
        },
        priority: 6,
        baseTiming: scrollTiming,
      });
    }

    // Medium Priority: Calculator opened but not completed → Encourage completion
    const incompleteTiming = 60 * timingVariant.delayMultiplier;
    if (behavior.calculatorOpened && !behavior.calculatorCompleted && behavior.timeOnPage >= incompleteTiming) {
      suggestions.push({
        id: 'calc-incomplete',
        messageVariants: [
          {
            title: '📊 See Your Numbers',
            message: `You're one click away from seeing exactly how much revenue you're leaving on the table.`,
            cta: 'Complete Calculator',
          },
          {
            title: '⏰ Quick! Finish Your ROI',
            message: `Just 2 more inputs and you'll see your exact monthly revenue opportunity. Don't leave money on the table!`,
            cta: 'Finish ROI Calculation',
          },
          {
            title: '🎯 Almost There!',
            message: `You started calculating your ROI - complete it to see your personalized profit projection.`,
            cta: 'See My Results',
          },
        ],
        icon: <TrendingUp className="w-5 h-5" />,
        ctaAction: () => {
          const calcSection = document.getElementById('roi-calculator');
          calcSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
        priority: 8,
        baseTiming: incompleteTiming,
      });
    }

    // Low Priority: Long idle time → Offer help
    const idleTiming = 30 * timingVariant.delayMultiplier;
    if (behavior.idleTime >= idleTiming && behavior.timeOnPage >= 60) {
      suggestions.push({
        id: 'idle-to-chat',
        messageVariants: [
          {
            title: '💬 Have Questions?',
            message: `We're here to help! Chat with us about how AI can transform your ${industry} operations.`,
            cta: 'Start a Conversation',
          },
          {
            title: '🤔 Need Help Deciding?',
            message: `Talk to our AI specialist about ${industry}-specific implementation. Quick answers, no pressure.`,
            cta: 'Chat with Specialist',
          },
          {
            title: '✨ Get Expert Guidance',
            message: `Have questions about pricing, setup, or ${industry} best practices? We're here to help.`,
            cta: 'Ask a Question',
          },
        ],
        icon: <MessageSquare className="w-5 h-5" />,
        ctaAction: () => {
          const chatButton = document.querySelector('[data-chat-button]') as HTMLElement;
          chatButton?.click();
        },
        priority: 5,
        baseTiming: idleTiming,
      });
    }

    // Both calculator AND demo completed → Final push
    if (behavior.calculatorCompleted && behavior.demoCompleted) {
      suggestions.push({
        id: 'full-engagement',
        messageVariants: [
          {
            title: '🎉 You\'re Ready!',
            message: `You've seen the numbers and experienced the AI. Let's get you set up this week.`,
            cta: 'Claim Your Setup Slot',
          },
          {
            title: '🚀 Time to Launch',
            message: `You've done the research. Most ${industry} businesses see results in the first week. Let's go!`,
            cta: 'Start Implementation',
          },
          {
            title: '⚡ Limited Slots Available',
            message: `You're qualified and ready. We have 3 ${industry} onboarding slots left this month. Book yours now.`,
            cta: 'Reserve My Slot',
          },
        ],
        icon: <Sparkles className="w-5 h-5" />,
        ctaAction: () => {
          window.open(siteConfig.bookingUrl, '_blank');
        },
        priority: 11,
        baseTiming: 2,
      });
    }

    // Select highest priority suggestion that hasn't been shown
    const availableSuggestions = suggestions.filter(s => !hasShown.includes(s.id));
    if (availableSuggestions.length > 0) {
      const topSuggestion = availableSuggestions.sort((a, b) => b.priority - a.priority)[0];
      
      // Get message variant assignment
      const messageVariantKey = `ab_message_${topSuggestion.id}`;
      let messageVariantIndex = parseInt(sessionStorage.getItem(messageVariantKey) || '-1');
      if (messageVariantIndex === -1) {
        messageVariantIndex = Math.floor(Math.random() * topSuggestion.messageVariants.length);
        sessionStorage.setItem(messageVariantKey, messageVariantIndex.toString());
      }
      
      const selectedMessage = topSuggestion.messageVariants[messageVariantIndex];
      
      setCurrentSuggestion(topSuggestion);
      setCurrentMessageVariant(selectedMessage);
      setHasShown(prev => [...prev, topSuggestion.id]);
      
      trackEvent('smart_upsell_shown', { 
        trigger: topSuggestion.id,
        message_variant: messageVariantIndex,
        visual_variant: visualVariantId,
        timing_variant: timingVariantId,
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
    timingVariant,
    visualVariantId,
  ]);

  const handleDismiss = () => {
    setDismissed(true);
    setCurrentSuggestion(null);
    
    const messageVariantKey = `ab_message_${currentSuggestion?.id}`;
    const messageVariantIndex = sessionStorage.getItem(messageVariantKey);
    
    trackEvent('smart_upsell_dismissed', { 
      trigger: currentSuggestion?.id,
      message_variant: messageVariantIndex,
      visual_variant: visualVariantId,
      timing_variant: timingVariantId,
      industry,
      time_on_page: behavior.timeOnPage
    });
  };

  const handleAction = () => {
    const messageVariantKey = `ab_message_${currentSuggestion?.id}`;
    const messageVariantIndex = sessionStorage.getItem(messageVariantKey);
    
    trackEvent('smart_upsell_click', {
      trigger: currentSuggestion?.id,
      message_variant: messageVariantIndex,
      visual_variant: visualVariantId,
      timing_variant: timingVariantId,
      industry,
      time_on_page: behavior.timeOnPage
    });
    
    currentSuggestion?.ctaAction();
  };

  if (!currentSuggestion || !currentMessageVariant || dismissed) return null;

  const iconAnimations = {
    rotate: { rotate: [0, 10, -10, 0] },
    pulse: { scale: [1, 1.2, 1] },
    bounce: { y: [0, -10, 0] },
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={cn('fixed z-40 max-w-md', positionClasses[visualVariant.position], className)}
      >
        <GlassCard className={cn('p-6 relative overflow-hidden', visualVariant.cardStyle)}>
          {/* Animated gradient background - only for gradient variant */}
          {visualVariant.id === 'gradient-bold' && (
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
          )}

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
                animate={iconAnimations[visualVariant.iconAnimation]}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                className={cn(
                  'p-2 rounded-lg',
                  visualVariant.id === 'accent-bright' ? 'bg-accent/30 text-accent' : 'bg-primary/20 text-primary'
                )}
              >
                {currentSuggestion.icon}
              </motion.div>
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-1">{currentMessageVariant.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentMessageVariant.message}
                </p>
              </div>
            </div>

            <MagneticButton
              onClick={handleAction}
              className="w-full"
              size="lg"
              variant={visualVariant.buttonVariant}
            >
              {currentMessageVariant.cta}
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
