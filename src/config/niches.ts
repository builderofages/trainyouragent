export interface NicheConfig {
  redirectUrl: string;
  enabled: boolean;
  delaySeconds: number;
}

// Whitelist of allowed redirect domains to prevent open redirect vulnerabilities
const ALLOWED_REDIRECT_DOMAINS = [
  "trainyouragent.com",
  "trainyouragentai.com",
  "calendly.com",
  "cal.com",
];

/**
 * Validates if a redirect URL is safe to use
 * @param url - The URL to validate
 * @returns true if the URL is on an allowed domain
 */
export function isAllowedRedirect(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_REDIRECT_DOMAINS.some(
      (domain) =>
        parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
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
    redirectUrl: "https://calendly.com/trainyouragent",
    enabled: true,
    delaySeconds: 5,
  },
  gym: {
    redirectUrl: "https://calendly.com/trainyouragent",
    enabled: true,
    delaySeconds: 5,
  },
};
