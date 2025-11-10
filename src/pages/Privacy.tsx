import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";

const Privacy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: `We collect information you provide directly to us, including:
      
- Name, email address, phone number, and company information
- Payment and billing information
- Communications with our support team
- Usage data and analytics
- Device and browser information`,
    },
    {
      title: "How We Use Your Information",
      content: `We use the information we collect to:
      
- Provide, maintain, and improve our services
- Process transactions and send related information
- Send technical notices and support messages
- Respond to your comments and questions
- Analyze usage patterns and optimize performance
- Protect against fraudulent or illegal activity`,
    },
    {
      title: "Data Sharing and Disclosure",
      content: `We do not sell your personal information. We may share your information with:
      
- Service providers who assist in our operations
- Professional advisors (lawyers, accountants)
- Law enforcement when required by law
- In connection with a merger or acquisition (with notice)
      
All third-party service providers are contractually obligated to protect your data.`,
    },
    {
      title: "Data Security",
      content: `We implement industry-standard security measures including:
      
- Encryption of data in transit and at rest
- Regular security audits and penetration testing
- Access controls and authentication requirements
- Secure data centers with 24/7 monitoring
- Employee training on data protection
      
While we strive to protect your data, no method of transmission over the Internet is 100% secure.`,
    },
    {
      title: "Your Rights (GDPR & CCPA)",
      content: `You have the right to:
      
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Object to processing of your data
- Data portability
- Withdraw consent at any time
      
To exercise these rights, contact us at privacy@trainyouragent.com`,
    },
    {
      title: "Cookies and Tracking",
      content: `We use cookies and similar technologies for:
      
- Essential website functionality
- Analytics and performance monitoring
- Marketing and advertising (with your consent)
      
You can control cookie preferences through your browser settings.`,
    },
    {
      title: "Data Retention",
      content: `We retain your personal information for as long as:
      
- Your account is active
- Necessary to provide services
- Required by law or for legitimate business purposes
      
When data is no longer needed, we securely delete or anonymize it.`,
    },
    {
      title: "Children's Privacy",
      content: `Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.`,
    },
    {
      title: "International Data Transfers",
      content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place through:
      
- Standard contractual clauses
- Privacy Shield certification (where applicable)
- Consent for specific transfers`,
    },
    {
      title: "Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via:
      
- Email notification
- Prominent notice on our website
- In-app notifications
      
Your continued use of our services after changes constitutes acceptance.`,
    },
    {
      title: "Contact Us",
      content: `For privacy-related questions or concerns:
      
Email: privacy@trainyouragent.com
Address: TrainYourAgent LLC, Florida, United States
Phone: Contact via email for inquiries
      
Data Protection Officer: [If applicable]`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-muted-foreground mt-4">
              At TrainYourAgent, we take your privacy seriously. This policy explains how we
              collect, use, and protect your personal information.
            </p>
          </motion.div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              This policy is effective as of {new Date().toLocaleDateString()} and will remain in
              effect except with respect to any changes in its provisions in the future, which will
              be in effect immediately after being posted on this page.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;
