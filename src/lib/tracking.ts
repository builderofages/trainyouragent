// UTM Parameter Tracking and Conversion Events

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

// Store UTM parameters in localStorage
export const captureUTMParams = (): UTMParams => {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {
    source: urlParams.get('utm_source') || undefined,
    medium: urlParams.get('utm_medium') || undefined,
    campaign: urlParams.get('utm_campaign') || undefined,
    content: urlParams.get('utm_content') || undefined,
    term: urlParams.get('utm_term') || undefined,
  };

  // Only store if there are actual UTM parameters
  if (Object.values(utmParams).some(value => value !== undefined)) {
    localStorage.setItem('utm_params', JSON.stringify(utmParams));
  }

  return utmParams;
};

// Get stored UTM parameters
export const getStoredUTMParams = (): UTMParams => {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem('utm_params');
  return stored ? JSON.parse(stored) : {};
};

// Track conversion events
export const trackConversion = (eventName: string, data?: Record<string, any>) => {
  const utmParams = getStoredUTMParams();
  const eventData = {
    ...data,
    ...utmParams,
    timestamp: new Date().toISOString(),
  };

  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventData);
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, eventData);
  }

  // Console log for debugging
  console.log(`[Conversion] ${eventName}`, eventData);
};

// Specific conversion event helpers
export const conversions = {
  ctaClicked: (location: string, industry?: string) => {
    trackConversion('cta_clicked', { location, industry });
  },

  demoBooked: (industry?: string) => {
    trackConversion('demo_booking', { industry, value: 500 });
  },
  
  calculatorCompleted: (calculatorType: string, result: number) => {
    trackConversion('calculator_completion', { 
      calculator_type: calculatorType,
      calculated_value: result 
    });
  },
  
  leadMagnetDownloaded: (resourceName: string, industry?: string) => {
    trackConversion('lead_magnet_download', { 
      resource_name: resourceName,
      industry 
    });
  },
  
  chatStarted: (industry?: string) => {
    trackConversion('chat_started', { industry });
  },
  
  phoneClicked: (industry?: string) => {
    trackConversion('phone_click', { industry });
  },
  
  formSubmitted: (formType: string, industry?: string) => {
    trackConversion('form_submission', { 
      form_type: formType,
      industry 
    });
  },
  
  liveDemoStarted: (industry?: string) => {
    trackConversion('live_demo_started', { industry });
  },
  
  videoWatched: (videoName: string, percentWatched: number) => {
    trackConversion('video_view', { 
      video_name: videoName,
      percent_watched: percentWatched 
    });
  },
  
  timelineEstimatorStarted: (source: string) => {
    trackConversion('timeline_estimator_started', { 
      source,
      page: window.location.pathname 
    });
  },
  
  timelineEstimatorCompleted: (data: {
    estimated_days_min: number;
    estimated_days_max: number;
    complexity: string;
    services_days: number;
    integrations_days: number;
    terminology_days: number;
    pricing_days: number;
    feedback_days: number;
  }) => {
    trackConversion('timeline_estimator_completed', data);
  },

  strategySessionBooked: (industry?: string, budget?: string) => {
    trackConversion('strategy_session_booked', { 
      industry,
      budget,
      value: 500 
    });
  },
};

// Alias for trackConversion for consistency
export const trackEvent = trackConversion;

// Initialize tracking on page load
export const initializeTracking = () => {
  captureUTMParams();
};
