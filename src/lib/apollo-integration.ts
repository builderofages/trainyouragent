import { siteConfig } from "@/config/site";

export interface ApolloContactData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  organization_name?: string;
  title?: string;
  label_names?: string[];
  custom_fields?: Record<string, any>;
}

export interface ApolloLeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  source: string;
  tags?: string[];
  notes?: string;
  custom_fields?: Record<string, any>;
}

/**
 * Send lead data to Apollo.io
 * Converts simple lead data format to Apollo.io contact format
 */
export const sendToApollo = async (leadData: ApolloLeadData): Promise<boolean> => {
  const apiKey = siteConfig.apollo.apiKey;

  if (!apiKey) {
    console.warn("Apollo.io API key not configured. Lead data:", leadData);
    return false;
  }

  // Extract industry from URL if not provided
  let industryTag = leadData.industry || '';
  if (!industryTag && typeof window !== 'undefined') {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const pathIndustry = pathSegments[0];
      // Map URL paths to industry names
      const industryMap: Record<string, string> = {
        'hvac': 'HVAC',
        'legal': 'Legal',
        'healthcare': 'Healthcare',
        'accounting': 'Accounting',
        'restaurants': 'Restaurants',
        'roofing': 'Roofing',
        'logistics': 'Logistics',
        'bars-nightclubs': 'Bars & Nightclubs'
      };
      industryTag = industryMap[pathIndustry] || pathIndustry;
    }
  }

  // Split name into first and last name
  const nameParts = leadData.name.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Build Apollo contact data
  const apolloData: ApolloContactData = {
    first_name: firstName,
    last_name: lastName,
    email: leadData.email,
    phone: leadData.phone,
    organization_name: leadData.company,
    label_names: leadData.tags || [],
    custom_fields: {
      industry: industryTag || leadData.industry,
      lead_source: leadData.source,
      notes: leadData.notes,
      submitted_at: new Date().toISOString(),
      ...leadData.custom_fields,
    },
  };

  try {
    const response = await fetch("https://api.apollo.io/v1/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify(apolloData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Apollo.io API error:", response.status, errorData);
      return false;
    }

    const result = await response.json();
    console.log("Lead sent to Apollo.io successfully:", result.contact?.id);
    return true;
  } catch (error) {
    console.error("Failed to send lead to Apollo.io:", error);
    return false;
  }
};

/**
 * Track UTM parameters from URL and localStorage
 */
export const getUTMParameters = (): Record<string, string> => {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const storedUTM = localStorage.getItem("utm_params");

  const utmParams: Record<string, string> = {};

  // Get from URL or localStorage
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((param) => {
    const value = params.get(param);
    if (value) {
      utmParams[param] = value;
    }
  });

  // Merge with stored UTM if exists
  if (storedUTM && Object.keys(utmParams).length === 0) {
    try {
      const parsed = JSON.parse(storedUTM);
      Object.assign(utmParams, parsed);
    } catch (e) {
      // Ignore parsing errors
    }
  }

  // Store for future use
  if (Object.keys(utmParams).length > 0) {
    localStorage.setItem("utm_params", JSON.stringify(utmParams));
  }

  return utmParams;
};
