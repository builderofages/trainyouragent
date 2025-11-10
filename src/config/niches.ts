export interface NicheConfig {
  redirectUrl: string;
  enabled: boolean;
  delaySeconds: number;
}

export const nicheConfig: Record<string, NicheConfig> = {
  hvac: {
    redirectUrl: "https://trainyouragentai.com",
    enabled: true,
    delaySeconds: 5,
  },
  accounting: {
    redirectUrl: "https://calendly.com/trainyouragent", // PLACEHOLDER - Update when ready
    enabled: false, // Set to true when ready to launch
    delaySeconds: 5,
  },
  roofing: {
    redirectUrl: "https://calendly.com/trainyouragent", // PLACEHOLDER - Update when ready
    enabled: false, // Set to true when ready to launch
    delaySeconds: 5,
  },
  legal: {
    redirectUrl: "https://your-legal-site.com", // REPLACE WITH YOUR URL
    enabled: false,
    delaySeconds: 5,
  },
  healthcare: {
    redirectUrl: "https://your-healthcare-site.com", // REPLACE WITH YOUR URL
    enabled: false,
    delaySeconds: 5,
  },
  logistics: {
    redirectUrl: "https://your-logistics-site.com", // REPLACE WITH YOUR URL
    enabled: false,
    delaySeconds: 5,
  },
  restaurants: {
    redirectUrl: "https://your-restaurant-site.com", // REPLACE WITH YOUR URL
    enabled: false,
    delaySeconds: 5,
  },
};
