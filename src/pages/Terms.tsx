import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";

const Terms = () => {
  const sections = [
    {
      title: "Agreement to Terms",
      content: `By accessing or using TrainYourAgent services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
      
These terms apply to all users, including visitors, registered users, and paid subscribers.`,
    },
    {
      title: "Service Description",
      content: `TrainYourAgent provides AI-powered automation solutions including:
      
- Voice agents for call handling and booking
- Customer service automation
- Lead qualification and routing
- Integration with third-party platforms
- Analytics and reporting tools
      
We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.`,
    },
    {
      title: "30-Day Risk-Free Pilot Program",
      content: `Pilot Program Terms:

- Pilot allows you to test AI agents in your live business environment
- No long-term commitment required during pilot period
- Access to full platform features and support
- Pilot can be extended by mutual agreement
- Conversion to paid plan optional after pilot completion
- Pilot availability subject to capacity and qualification

To qualify for pilot program, contact sales@trainyouragent.com`,
    },
    {
      title: "Implementation Timeline",
      content: `Typical implementation ranges from 3-7 business days depending on:

- Number of services/offerings to configure
- Integration complexity (CRM, scheduling systems)
- Industry-specific terminology and compliance requirements
- Response time to training questions and feedback

Timeline estimates provided by our calculator are approximations. Actual timeline confirmed during your strategy session based on your specific needs. Results may vary based on implementation factors, call volume, and business-specific requirements.`,
    },
    {
      title: "Results and Outcomes Disclaimer",
      content: `IMPORTANT: Results may vary based on implementation, industry, call volume, and business-specific factors. Past performance and pilot program statistics do not guarantee future results.

- Implementation timeline estimates are ranges, not guarantees
- ROI projections are based on industry averages and pilot data
- Actual results depend on call volume, agent training, and business factors
- The 94% pilot conversion rate reflects historical data, not individual guarantees
- 30-Day Pilot allows you to test results in your specific business context

No warranties are made regarding specific outcomes, revenue increases, or business results.`,
    },
    {
      title: "User Accounts",
      content: `To use our services, you must:
      
- Provide accurate and complete registration information
- Maintain the security of your account credentials
- Notify us immediately of unauthorized access
- Be at least 18 years old or have parental consent
      
You are responsible for all activities under your account.`,
    },
    {
      title: "Acceptable Use Policy",
      content: `You agree NOT to:
      
- Violate any laws or regulations
- Infringe on intellectual property rights
- Transmit harmful code or malware
- Attempt to gain unauthorized access
- Use the service for fraudulent purposes
- Harass, abuse, or harm others
- Scrape or data mine our systems
      
Violations may result in immediate account termination.`,
    },
    {
      title: "Payment Terms",
      content: `For paid subscriptions:
      
- Fees are billed in advance on a monthly or annual basis
- All fees are non-refundable except as required by law
- You authorize us to charge your payment method
- Prices may change with 30 days notice
- Failure to pay may result in service suspension
      
See our pricing page for current rates and plans.`,
    },
    {
      title: "Cancellation and Refunds",
      content: `You may cancel your subscription at any time:
      
- Cancellations take effect at the end of the current billing period
- No refunds for partial months
- Data may be deleted 30 days after cancellation
- Annual plans are non-refundable after 30 days
      
Contact support@trainyouragent.com to cancel.`,
    },
    {
      title: "Intellectual Property",
      content: `All content and materials on our platform are owned by TrainYourAgent and protected by:
      
- Copyright laws
- Trademark laws
- Trade secret laws
      
You may not copy, modify, distribute, or reverse engineer our software without written permission.
      
You retain ownership of your data and content.`,
    },
    {
      title: "Warranties and Disclaimers",
      content: `OUR SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
      
We do not guarantee:
- Uninterrupted or error-free operation
- Specific results or outcomes
- Accuracy of AI-generated responses
- Compatibility with all systems
      
We disclaim all implied warranties including merchantability and fitness for a particular purpose.`,
    },
    {
      title: "Limitation of Liability",
      content: `To the maximum extent permitted by law:
      
- We are not liable for indirect, incidental, or consequential damages
- Our total liability is limited to fees paid in the last 12 months
- We are not liable for third-party integrations or services
- You agree to indemnify us against claims arising from your use
      
Some jurisdictions do not allow these limitations.`,
    },
    {
      title: "Data Security and Compliance",
      content: `Platform Security:

- Built on industry-leading infrastructure (VAPI, Apollo.io)
- Enterprise-grade security practices
- End-to-end encryption in transit (TLS 1.3)
- Data storage on SOC 2 Type II certified infrastructure
- HIPAA-compliant infrastructure for healthcare clients

Individual compliance requirements may vary by industry. Healthcare organizations requiring Business Associate Agreements (BAA) should discuss specific needs during onboarding.`,
    },
    {
      title: "Data and Privacy",
      content: `Your use of our services is also governed by our Privacy Policy.
      
We process data in accordance with:
- GDPR (for EU users)
- CCPA (for California users)
- Other applicable data protection laws
      
See our Privacy Policy for detailed information.`,
    },
    {
      title: "Dispute Resolution",
      content: `In the event of a dispute:
      
1. Contact us first at legal@trainyouragent.com
2. We will attempt good faith negotiations
3. If unresolved, disputes will be settled by binding arbitration
4. Arbitration will be conducted by the American Arbitration Association
5. You waive the right to a jury trial or class action
      
Some jurisdictions do not allow arbitration requirements.`,
    },
    {
      title: "Governing Law",
      content: `These Terms are governed by the laws of the State of Florida, without regard to conflict of law principles.
      
Any legal action must be brought in the courts of Florida.`,
    },
    {
      title: "Changes to Terms",
      content: `We may modify these Terms at any time:
      
- Material changes will be notified via email
- Continued use constitutes acceptance
- Previous versions will be archived
      
Last modified: {new Date().toLocaleDateString()}`,
    },
    {
      title: "Contact Information",
      content: `For questions about these Terms:
      
Email: legal@trainyouragent.com
Address: TrainYourAgent LLC, Florida, United States
Phone: Contact via email for inquiries
      
Support: support@trainyouragent.com`,
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
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-muted-foreground mt-4">
              Please read these terms carefully before using TrainYourAgent services.
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

          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              By using TrainYourAgent, you acknowledge that you have read, understood, and agree to
              be bound by these Terms of Service. If you do not agree to these terms, you must
              discontinue use of our services immediately.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
