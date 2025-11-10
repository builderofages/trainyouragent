import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/enhanced/GlassCard";

const CookiePolicy = () => {
  const sections = [
    {
      title: "What Are Cookies",
      content:
        "Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.",
    },
    {
      title: "How We Use Cookies",
      content:
        "We use cookies to: (1) Remember your preferences and settings, (2) Understand how you interact with our website, (3) Improve our services and user experience, (4) Analyze website traffic and performance, (5) Provide personalized content and recommendations.",
    },
    {
      title: "Types of Cookies We Use",
      content:
        "Essential Cookies: Required for the website to function properly. These cannot be disabled. Analytics Cookies: Help us understand how visitors use our website through Google Analytics and similar services. Functionality Cookies: Remember your preferences and choices. Marketing Cookies: Track your browsing across websites to show relevant advertisements.",
    },
    {
      title: "Third-Party Cookies",
      content:
        "We may use third-party services that set cookies on your device, including: Google Analytics for website analytics, Calendly for booking and scheduling, Social media platforms for content sharing. These third parties have their own privacy policies governing their use of cookies.",
    },
    {
      title: "Managing Cookies",
      content:
        "You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies or delete existing ones. Please note that disabling certain cookies may affect the functionality of our website. To learn more about managing cookies, visit your browser's help section.",
    },
    {
      title: "Cookie Duration",
      content:
        "Session Cookies: Temporary cookies that expire when you close your browser. Persistent Cookies: Remain on your device for a set period or until you delete them. The duration varies by cookie type and purpose.",
    },
    {
      title: "Changes to This Policy",
      content:
        "We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. We will notify you of any material changes by posting the updated policy on this page with a new 'Last Updated' date.",
    },
    {
      title: "Contact Us",
      content:
        "If you have questions about our use of cookies, please contact us at privacy@trainyouragent.com.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary/30 to-white">
      <Header />
      
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Cookie Policy
          </h1>
          <p className="text-muted-foreground mb-12">
            Last Updated: November 10, 2025
          </p>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <GlassCard>
              <p className="text-sm text-muted-foreground">
                This Cookie Policy is effective as of the date stated above and applies to all visitors and users of our website.
              </p>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
