/**
 * Engagement Scoring System
 * Tracks visitor behavior and assigns scores to determine engagement level
 */

export interface EngagementScore {
  totalScore: number;
  level: 'low' | 'medium' | 'high' | 'very-high';
  signals: EngagementSignal[];
}

export interface EngagementSignal {
  type: string;
  points: number;
  timestamp: number;
}

// Point values for different engagement actions
export const ENGAGEMENT_POINTS = {
  pageView: 1,
  timeOnPage30s: 2,
  timeOnPage60s: 3,
  timeOnPage120s: 5,
  scroll50: 2,
  scroll75: 3,
  scroll90: 4,
  calculatorStarted: 5,
  calculatorCompleted: 8,
  voiceDemoStarted: 8,
  voiceDemoCompleted: 12,
  videoWatched50: 5,
  videoWatched75: 7,
  industryLandingVisit: 3,
  resourceDownload: 6,
  ctaClicked: 4,
  formStarted: 6,
  multiplePageVisits: 2, // per additional page
} as const;

// Engagement level thresholds
export const ENGAGEMENT_THRESHOLDS = {
  low: 0,      // 0-5 points
  medium: 6,   // 6-15 points
  high: 16,    // 16-30 points
  veryHigh: 31, // 31+ points
} as const;

/**
 * Calculate engagement level from score
 */
export function getEngagementLevel(score: number): EngagementScore['level'] {
  if (score >= ENGAGEMENT_THRESHOLDS.veryHigh) return 'very-high';
  if (score >= ENGAGEMENT_THRESHOLDS.high) return 'high';
  if (score >= ENGAGEMENT_THRESHOLDS.medium) return 'medium';
  return 'low';
}

/**
 * Get engagement signals from sessionStorage
 */
export function getEngagementSignals(): EngagementSignal[] {
  try {
    const stored = sessionStorage.getItem('engagement_signals');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Add engagement signal and calculate new score
 */
export function addEngagementSignal(type: keyof typeof ENGAGEMENT_POINTS): EngagementScore {
  const signals = getEngagementSignals();
  const points = ENGAGEMENT_POINTS[type];
  
  const newSignal: EngagementSignal = {
    type,
    points,
    timestamp: Date.now(),
  };
  
  signals.push(newSignal);
  
  // Store updated signals
  try {
    sessionStorage.setItem('engagement_signals', JSON.stringify(signals));
  } catch {
    // If storage fails, continue without persistence
  }
  
  const totalScore = signals.reduce((sum, signal) => sum + signal.points, 0);
  const level = getEngagementLevel(totalScore);
  
  return { totalScore, level, signals };
}

/**
 * Get current engagement score
 */
export function getCurrentEngagementScore(): EngagementScore {
  const signals = getEngagementSignals();
  const totalScore = signals.reduce((sum, signal) => sum + signal.points, 0);
  const level = getEngagementLevel(totalScore);
  
  return { totalScore, level, signals };
}

/**
 * Check if a specific action has been completed
 */
export function hasCompletedAction(actionType: string): boolean {
  const signals = getEngagementSignals();
  return signals.some(signal => signal.type === actionType);
}

/**
 * Clear engagement signals (useful for testing)
 */
export function clearEngagementSignals(): void {
  try {
    sessionStorage.removeItem('engagement_signals');
  } catch {
    // Silent fail
  }
}
