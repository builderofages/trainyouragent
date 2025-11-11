export const siteConfig = {
  companyName: "TrainYourAgent",
  tagline: "Custom AI Agents for Every Industry",
  bookingUrl: "https://calendly.com/trainyouragent",
  // TODO: Add your VAPI phone number after setup
  phoneNumber: "", // Format: "+1-XXX-XXX-XXXX"
  phoneNumberDisplay: "", // Format: "(XXX) XXX-XXXX" - for display
  email: "support@trainyouragent.com",
  showPricing: false,
  showDashboard: false,
  businessHours: {
    message: "AI Agent Available 24/7",
    available: true, // Set to true since AI is always available
  },
  socialMedia: {
    twitter: "https://x.com/trainyouragent",
    linkedin: "https://www.linkedin.com/company/train-your-agent/",
    instagram: "https://www.instagram.com/trainyouragent",
  },
  webhooks: {
    demoRequest: "https://hooks.monday.com/hooks/demo",
    newsletter: "https://hooks.monday.com/hooks/newsletter",
    leadMagnet: "https://hooks.monday.com/hooks/lead_magnet",
    contactForm: "https://hooks.monday.com/hooks/contact",
    configurator: "https://hooks.monday.com/hooks/configurator",
    chat: "https://hooks.monday.com/hooks/chat",
  },
};
