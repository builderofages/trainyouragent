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
    redirectUrl: "https://your-accounting-site.com", // REPLACE WITH YOUR URL
    enabled: false, // Set to true when ready
    delaySeconds: 5,
  },
  roofing: {
    redirectUrl: "https://your-roofing-site.com", // REPLACE WITH YOUR URL
    enabled: false,
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
