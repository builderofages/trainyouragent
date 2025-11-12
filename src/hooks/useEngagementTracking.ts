import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  addEngagementSignal,
  getCurrentEngagementScore,
  type EngagementScore,
} from '@/lib/engagement-scoring';
import { trackEvent } from '@/lib/tracking';

/**
 * Hook to track visitor engagement and calculate engagement score
 */
export function useEngagementTracking() {
  const location = useLocation();
  const [engagementScore, setEngagementScore] = useState<EngagementScore>(
    getCurrentEngagementScore()
  );
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [scrollDepth, setScrollDepth] = useState(0);

  // Track page view
  useEffect(() => {
    const score = addEngagementSignal('pageView');
    setEngagementScore(score);
    
    trackEvent('engagement_score_updated', {
      score: score.totalScore,
      level: score.level,
      page: location.pathname,
    });
  }, [location.pathname]);

  // Track time on page
  useEffect(() => {
    const intervals = [
      { time: 30000, signal: 'timeOnPage30s' as const, tracked: false },
      { time: 60000, signal: 'timeOnPage60s' as const, tracked: false },
      { time: 120000, signal: 'timeOnPage120s' as const, tracked: false },
    ];

    const timers = intervals.map(({ time, signal }) => {
      return setTimeout(() => {
        const score = addEngagementSignal(signal);
        setEngagementScore(score);
        
        trackEvent('engagement_score_updated', {
          score: score.totalScore,
          level: score.level,
          signal,
          page: location.pathname,
        });
      }, time);
    });

    // Time counter
    const counter = setInterval(() => {
      setTimeOnPage((prev) => prev + 1);
    }, 1000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(counter);
    };
  }, [location.pathname]);

  // Track scroll depth
  useEffect(() => {
    const milestones = [
      { depth: 50, signal: 'scroll50' as const, tracked: false },
      { depth: 75, signal: 'scroll75' as const, tracked: false },
      { depth: 90, signal: 'scroll90' as const, tracked: false },
    ];

    let tracked = new Set<string>();

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const scrollPercent = (scrolled / documentHeight) * 100;

      setScrollDepth(scrollPercent);

      milestones.forEach(({ depth, signal }) => {
        if (scrollPercent >= depth && !tracked.has(signal)) {
          tracked.add(signal);
          const score = addEngagementSignal(signal);
          setEngagementScore(score);
          
          trackEvent('engagement_score_updated', {
            score: score.totalScore,
            level: score.level,
            signal,
            scroll_depth: scrollPercent,
            page: location.pathname,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Helper functions to track specific actions
  const trackCalculatorStarted = () => {
    const score = addEngagementSignal('calculatorStarted');
    setEngagementScore(score);
    trackEvent('engagement_score_updated', {
      score: score.totalScore,
      level: score.level,
      signal: 'calculatorStarted',
    });
  };

  const trackCalculatorCompleted = () => {
    const score = addEngagementSignal('calculatorCompleted');
    setEngagementScore(score);
    trackEvent('engagement_score_updated', {
      score: score.totalScore,
      level: score.level,
      signal: 'calculatorCompleted',
    });
  };

  const trackVoiceDemoStarted = () => {
    const score = addEngagementSignal('voiceDemoStarted');
    setEngagementScore(score);
    trackEvent('engagement_score_updated', {
      score: score.totalScore,
      level: score.level,
      signal: 'voiceDemoStarted',
    });
  };

  const trackVoiceDemoCompleted = () => {
    const score = addEngagementSignal('voiceDemoCompleted');
    setEngagementScore(score);
    trackEvent('engagement_score_updated', {
      score: score.totalScore,
      level: score.level,
      signal: 'voiceDemoCompleted',
    });
  };

  const trackCTAClicked = () => {
    const score = addEngagementSignal('ctaClicked');
    setEngagementScore(score);
  };

  return {
    engagementScore,
    timeOnPage,
    scrollDepth,
    trackCalculatorStarted,
    trackCalculatorCompleted,
    trackVoiceDemoStarted,
    trackVoiceDemoCompleted,
    trackCTAClicked,
  };
}
