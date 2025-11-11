import { useState, useEffect } from 'react';

export interface BehaviorData {
  timeOnPage: number;
  calculatorOpened: boolean;
  calculatorCompleted: boolean;
  demoStarted: boolean;
  demoCompleted: boolean;
  scrollDepth: number;
  idleTime: number;
  hasInteracted: boolean;
}

export const useBehaviorTracking = () => {
  const [behavior, setBehavior] = useState<BehaviorData>({
    timeOnPage: 0,
    calculatorOpened: false,
    calculatorCompleted: false,
    demoStarted: false,
    demoCompleted: false,
    scrollDepth: 0,
    idleTime: 0,
    hasInteracted: false,
  });

  useEffect(() => {
    // Track time on page
    const timeInterval = setInterval(() => {
      setBehavior(prev => ({
        ...prev,
        timeOnPage: prev.timeOnPage + 1,
        idleTime: prev.idleTime + 1,
      }));
    }, 1000);

    // Track scroll depth
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      setBehavior(prev => ({
        ...prev,
        scrollDepth: Math.max(prev.scrollDepth, Math.round(scrollPercent)),
        idleTime: 0,
        hasInteracted: true,
      }));
    };

    // Track user interaction
    const handleInteraction = () => {
      setBehavior(prev => ({
        ...prev,
        idleTime: 0,
        hasInteracted: true,
      }));
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keypress', handleInteraction);

    // Check for behavior signals in sessionStorage
    const checkStoredBehavior = () => {
      setBehavior(prev => ({
        ...prev,
        calculatorOpened: sessionStorage.getItem('calculator_opened') === 'true',
        calculatorCompleted: sessionStorage.getItem('calculator_completed') === 'true',
        demoStarted: sessionStorage.getItem('demo_started') === 'true',
        demoCompleted: sessionStorage.getItem('demo_completed') === 'true',
      }));
    };

    checkStoredBehavior();
    const storageInterval = setInterval(checkStoredBehavior, 2000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(storageInterval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keypress', handleInteraction);
    };
  }, []);

  return behavior;
};

// Helper functions to mark behavior events
export const markCalculatorOpened = () => {
  sessionStorage.setItem('calculator_opened', 'true');
};

export const markCalculatorCompleted = () => {
  sessionStorage.setItem('calculator_completed', 'true');
};

export const markDemoStarted = () => {
  sessionStorage.setItem('demo_started', 'true');
};

export const markDemoCompleted = () => {
  sessionStorage.setItem('demo_completed', 'true');
};
