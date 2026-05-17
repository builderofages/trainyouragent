import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Play, Calculator, Clock } from 'lucide-react';
import { MagneticButton } from '@/components/enhanced/MagneticButton';
import { GlassCard } from '@/components/enhanced/GlassCard';
import { getCurrentEngagementScore, hasCompletedAction } from '@/lib/engagement-scoring';
import { trackEvent } from '@/lib/tracking';

interface SmartCTAEngineProps {
  industry?: string;
  calculatorROI?: number;
  onCTAClick: () => void;
}

type CTAVariant = {
  id: string;
  icon: any;
  headline: string;
  subtext: string;
  ctaText: string;
  color: string;
};

export const SmartCTAEngine = ({ industry, calculatorROI, onCTAClick }: SmartCTAEngineProps) => {
  const [currentCTA, setCurrentCTA] = useState<CTAVariant | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('smart_cta_dismissed')) {
      return;
    }

    // Don't show if user already booked
    if (sessionStorage.getItem('booking_confirmed')) {
      return;
    }

    const { totalScore, level } = getCurrentEngagementScore();
    
    // Only show for medium+ engagement
    if (level === 'low') {
      return;
    }

    // Determine which CTA to show based on context
    let selectedCTA: CTAVariant | null = null;

    // High-value ROI calculator users
    if (calculatorROI && calculatorROI >= 10000) {
      selectedCTA = {
        id: 'high_roi',
        icon: TrendingUp,
        headline: `Discuss Your $${Math.round(calculatorROI / 1000)}K Monthly ROI`,
        subtext: "Let's build a custom solution to capture this revenue opportunity",
        ctaText: 'Book a 30-min build call → leave with a plan',
        color: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
      };
    }
    // Voice demo completed users
    else if (hasCompletedAction('voiceDemoCompleted')) {
      selectedCTA = {
        id: 'demo_completed',
        icon: Play,
        headline: industry 
          ? `Build Your Custom ${industry} Agent`
          : 'Build Your Custom AI Agent',
        subtext: "You've seen it work. Let's create your production-ready solution.",
        ctaText: 'Book the build call → live in 21 days',
        color: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
      };
    }
    // Calculator users without high ROI
    else if (hasCompletedAction('calculatorCompleted')) {
      selectedCTA = {
        id: 'calculator_completed',
        icon: Calculator,
        headline: 'Want Us to Explain These Numbers?',
        subtext: "Get a personalized walkthrough of your ROI projections",
        ctaText: 'Book a 30-min ROI review with the founder',
        color: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
      };
    }
    // High engagement, multiple page visits
    else if (totalScore >= 20) {
      const pageVisits = sessionStorage.getItem('page_visit_count') || '0';
      const visitCount = parseInt(pageVisits);
      
      if (visitCount >= 3) {
        selectedCTA = {
          id: 'high_engagement',
          icon: Clock,
          headline: `You've Explored ${visitCount} Pages - Ready to Talk?`,
          subtext: "Looks like we're a good fit. Let's discuss your specific needs.",
          ctaText: 'Book a 30-min call with the founder',
          color: 'bg-gradient-to-br from-orange-500/10 to-red-500/10',
        };
      }
    }
    // Industry-specific CTA
    else if (industry) {
      const industryNames: Record<string, string> = {
        hvac: 'HVAC',
        legal: 'Legal',
        healthcare: 'Healthcare',
        accounting: 'Accounting',
        restaurants: 'Restaurant',
        roofing: 'Roofing',
        logistics: 'Logistics',
        bars: 'Bars & Nightclub',
      };
      
      selectedCTA = {
        id: 'industry_specific',
        icon: TrendingUp,
        headline: `${industryNames[industry] || 'Your Industry'} Solutions`,
        subtext: "See how we've helped similar businesses capture more revenue",
        ctaText: 'See real builds for your industry →',
        color: 'bg-gradient-to-br from-primary/10 to-accent/10',
      };
    }

    if (selectedCTA) {
      setCurrentCTA(selectedCTA);
      
      // Show after slight delay for better UX
      setTimeout(() => {
        setIsVisible(true);
        
        trackEvent('smart_cta_shown', {
          cta_id: selectedCTA.id,
          engagement_score: totalScore,
          engagement_level: level,
          industry,
          calculator_roi: calculatorROI,
        });
      }, 2000);
    }

    // Track page visit count
    const currentCount = parseInt(sessionStorage.getItem('page_visit_count') || '0');
    sessionStorage.setItem('page_visit_count', (currentCount + 1).toString());
  }, [industry, calculatorROI]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('smart_cta_dismissed', 'true');
    
    if (currentCTA) {
      trackEvent('smart_cta_dismissed', {
        cta_id: currentCTA.id,
      });
    }
  };

  const handleClick = () => {
    if (currentCTA) {
      trackEvent('smart_cta_clicked', {
        cta_id: currentCTA.id,
        industry,
        calculator_roi: calculatorROI,
      });
    }
    onCTAClick();
  };

  if (!currentCTA || isDismissed) {
    return null;
  }

  const Icon = currentCTA.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-6 z-[55] max-w-md"
        >
          <GlassCard className={`p-6 shadow-glow-intense ${currentCTA.color}`}>
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center shadow-glow flex-shrink-0">
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{currentCTA.headline}</h3>
                <p className="text-sm text-muted-foreground">{currentCTA.subtext}</p>
              </div>
            </div>

            <MagneticButton
              size="lg"
              className="w-full bg-gradient-premium"
              onClick={handleClick}
            >
              {currentCTA.ctaText}
            </MagneticButton>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
