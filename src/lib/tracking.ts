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

// Track conversion events (ENHANCED with GTM dataLayer)
export const trackConversion = (eventName: string, data?: Record<string, any>) => {
  const utmParams = getStoredUTMParams();
  const eventData = {
    ...data,
    ...utmParams,
    timestamp: new Date().toISOString(),
    page_path: window.location.pathname,
    page_title: document.title
  };

  // Google Tag Manager dataLayer (PRIORITY)
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      ...eventData
    });
  }

  // Google Analytics 4 (direct gtag - FALLBACK)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventData);
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, eventData);
  }

  // LinkedIn Insight Tag
  if (typeof window !== 'undefined' && (window as any)._linkedin_data_partner_ids) {
    (window as any).lintrk('track', { conversion_id: eventName });
  }

  // v78: gate behind DEV so we don't leak conversion event payloads
  // (which may include emails / PII) into every visitor's browser console
  // in production.
  if (import.meta.env.DEV) {
    console.log(`[Conversion] ${eventName}`, eventData);
  }
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

  industryComparison: {
    calculated: (data: {
      top_industry: string;
      top_roi: number;
      monthly_leads: number;
      conversion_rate: number;
    }) => {
      trackConversion('industry_comparison_calculated', data);
    },
    detailViewed: (data: {
      industry: string;
      rank: number;
      monthly_roi: number;
    }) => {
      trackConversion('industry_comparison_detail_viewed', data);
    },
    fullAnalysisClicked: (data: { industry: string; rank: number }) => {
      trackConversion('industry_comparison_full_analysis_clicked', data);
    },
  },

  // Lead Gate Events (NEW)
  leadGateOpened: (component: string, hasIndustryPreselect: boolean) => {
    trackConversion('lead_gate_opened', { 
      component, 
      has_industry_preselect: hasIndustryPreselect 
    });
  },

  leadGateStepViewed: (step: number, component: string) => {
    trackConversion('lead_gate_step_viewed', { 
      step, 
      component,
      step_name: ['contact_info', 'business_context', 'needs_assessment', 'budget_qualification'][step - 1]
    });
  },

  leadGateAbandoned: (step: number, timeSpent: number) => {
    trackConversion('lead_gate_abandoned', { 
      step, 
      time_spent_seconds: timeSpent,
      abandonment_reason: 'user_closed'
    });
  },

  bookingPageOpened: (source: string, industry?: string) => {
    trackConversion('booking_page_opened', { 
      source, 
      industry,
      booking_platform: 'cal.com'
    });
  },

  // ROI Calculator Events (ENHANCED)
  roiCalculatorStarted: (industry: string, variant?: string) => {
    trackConversion('roi_calculator_started', { 
      industry,
      ab_test_variant: variant
    });
  },

  roiCalculatorCompleted: (data: {
    industry: string;
    monthly_roi: number;
    annual_roi: number;
    missed_calls: number;
    recoverable_revenue: number;
    variant?: string;
  }) => {
    trackConversion('roi_calculator_completed', {
      ...data,
      value: data.monthly_roi
    });
  },

  roiPdfDownloaded: (industry: string, monthlyROI: number) => {
    trackConversion('roi_pdf_downloaded', { 
      industry,
      monthly_roi: monthlyROI,
      value: 50
    });
  },

  // Voice Demo Events (ENHANCED)
  voiceDemoLeadSubmitted: (industry: string, sessionDuration: number) => {
    trackConversion('voice_demo_lead_submitted', { 
      industry,
      session_duration_seconds: sessionDuration,
      value: 100 
    });
  },

  voiceDemoCompleted: (industry: string, duration: number, messageCount: number) => {
    trackConversion('voice_demo_completed', { 
      industry,
      demo_duration_seconds: duration,
      message_count: messageCount,
      value: 75
    });
  },

  // Page Engagement Events (NEW)
  scrollDepthReached: (depth: number, page: string) => {
    trackConversion('scroll_depth', { 
      depth_percentage: depth,
      page_path: page
    });
  },

  timeOnPageThreshold: (seconds: number, page: string) => {
    trackConversion('time_on_page_threshold', { 
      time_seconds: seconds,
      page_path: page
    });
  },

  // Social Proof Events (NEW)
  caseStudyViewed: (industry: string, caseTitle: string) => {
    trackConversion('case_study_viewed', { 
      industry,
      case_study_title: caseTitle
    });
  },

  testimonialInteraction: (action: 'view' | 'click', source: string) => {
    trackConversion('testimonial_interaction', { 
      action,
      source
    });
  }
};

// Alias for trackConversion for consistency
export const trackEvent = trackConversion;

// Initialize tracking on page load
export const initializeTracking = () => {
  captureUTMParams();
  
  // Initialize GA4 if measurement ID exists
  // v127: fixed env var name — vite.config.ts exposes VITE_GA4_MEASUREMENT_ID (with the 4),
  // not VITE_GA_MEASUREMENT_ID. Off-by-one was silently dropping all SPA route GA events.
  if (import.meta.env.VITE_GA4_MEASUREMENT_ID) {
    (window as any).gtag?.('config', import.meta.env.VITE_GA4_MEASUREMENT_ID, {
      send_page_view: true,
      page_path: window.location.pathname
    });
  }
  
  // Initialize Meta Pixel if ID exists
  if (import.meta.env.VITE_META_PIXEL_ID) {
    (window as any).fbq?.('init', import.meta.env.VITE_META_PIXEL_ID);
    (window as any).fbq?.('track', 'PageView');
  }
};
