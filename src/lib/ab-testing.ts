export type VariantId = 'control' | 'variant_a' | 'variant_b' | 'variant_c';
export type ExperimentId = 'roi_headline' | 'roi_cta_copy' | 'roi_layout' | 'roi_form_fields';

export interface Experiment {
  id: ExperimentId;
  name: string;
  variants: {
    id: VariantId;
    weight: number; // 0-100, sum should equal 100
    active: boolean;
  }[];
  startDate: string;
  endDate?: string;
  active: boolean;
}

export interface UserVariant {
  experimentId: ExperimentId;
  variantId: VariantId;
  assignedAt: string;
  sessionId: string;
}

// Active experiments configuration
export const experiments: Record<ExperimentId, Experiment> = {
  roi_headline: {
    id: 'roi_headline',
    name: 'ROI Calculator Headline Test',
    variants: [
      { id: 'control', weight: 25, active: true },
      { id: 'variant_a', weight: 25, active: true },
      { id: 'variant_b', weight: 25, active: true },
      { id: 'variant_c', weight: 25, active: true },
    ],
    startDate: new Date().toISOString(),
    active: true,
  },
  roi_cta_copy: {
    id: 'roi_cta_copy',
    name: 'ROI Calculator CTA Copy Test',
    variants: [
      { id: 'control', weight: 25, active: true },
      { id: 'variant_a', weight: 25, active: true },
      { id: 'variant_b', weight: 25, active: true },
      { id: 'variant_c', weight: 25, active: true },
    ],
    startDate: new Date().toISOString(),
    active: true,
  },
  roi_layout: {
    id: 'roi_layout',
    name: 'ROI Calculator Layout Test',
    variants: [
      { id: 'control', weight: 100, active: true },
    ],
    startDate: new Date().toISOString(),
    active: false, // Not yet implemented
  },
  roi_form_fields: {
    id: 'roi_form_fields',
    name: 'ROI Calculator Form Fields Test',
    variants: [
      { id: 'control', weight: 100, active: true },
    ],
    startDate: new Date().toISOString(),
    active: false, // Not yet implemented
  },
};

// Get session ID from sessionStorage or create new one
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

// Get all stored variants from localStorage
const getStoredVariants = (): Partial<Record<ExperimentId, UserVariant>> => {
  try {
    const stored = localStorage.getItem('ab_tests');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Store variant assignment in localStorage
const storeVariant = (experimentId: ExperimentId, variantId: VariantId): void => {
  try {
    const variants = getStoredVariants();
    variants[experimentId] = {
      experimentId,
      variantId,
      assignedAt: new Date().toISOString(),
      sessionId: getSessionId(),
    };
    localStorage.setItem('ab_tests', JSON.stringify(variants));
  } catch {
    // Fail silently if localStorage is not available (e.g., Safari private mode)
  }
};

// Assign variant based on weighted distribution
export const assignVariant = (experimentId: ExperimentId): VariantId => {
  const experiment = experiments[experimentId];
  
  // If experiment is not active, return control
  if (!experiment || !experiment.active) {
    return 'control';
  }

  // Check if user already has an assigned variant
  const storedVariants = getStoredVariants();
  if (storedVariants[experimentId]) {
    return storedVariants[experimentId].variantId;
  }

  // Assign new variant based on weights
  const activeVariants = experiment.variants.filter(v => v.active);
  const totalWeight = activeVariants.reduce((sum, v) => sum + v.weight, 0);
  const random = Math.random() * totalWeight;
  
  let cumulativeWeight = 0;
  for (const variant of activeVariants) {
    cumulativeWeight += variant.weight;
    if (random <= cumulativeWeight) {
      storeVariant(experimentId, variant.id);
      return variant.id;
    }
  }

  // Fallback to control
  storeVariant(experimentId, 'control');
  return 'control';
};

// Get assigned variant (or assign if not exists)
export const getVariant = (experimentId: ExperimentId): VariantId => {
  return assignVariant(experimentId);
};

// Get all active experiments
export const getActiveExperiments = (): Experiment[] => {
  return Object.values(experiments).filter(exp => exp.active);
};

// Clear all variant assignments (for testing)
export const clearVariants = (): void => {
  try {
    localStorage.removeItem('ab_tests');
  } catch {
    // Fail silently
  }
};
