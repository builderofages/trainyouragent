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
    redirectUrl: "https://calendly.com/trainyouragent", // UPDATE THIS URL WHEN READY
    enabled: true,
    delaySeconds: 5,
  },
  roofing: {
    redirectUrl: "https://calendly.com/trainyouragent", // UPDATE THIS URL WHEN READY
    enabled: true,
    delaySeconds: 5,
  },
  legal: {
    redirectUrl: "https://calendly.com/trainyouragent", // UPDATE THIS URL WHEN READY
    enabled: true,
    delaySeconds: 5,
  },
  healthcare: {
    redirectUrl: "https://calendly.com/trainyouragent", // UPDATE THIS URL WHEN READY
    enabled: true,
    delaySeconds: 5,
  },
  logistics: {
    redirectUrl: "https://calendly.com/trainyouragent", // UPDATE THIS URL WHEN READY
    enabled: true,
    delaySeconds: 5,
  },
  restaurants: {
    redirectUrl: "https://calendly.com/trainyouragent", // UPDATE THIS URL WHEN READY
    enabled: true,
    delaySeconds: 5,
  },
  bars: {
    redirectUrl: "https://calendly.com/trainyouragent", // UPDATE THIS URL WHEN READY
    enabled: true,
    delaySeconds: 5,
  },
};
