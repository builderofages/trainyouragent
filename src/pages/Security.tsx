import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle2, Server, Eye, FileCheck, Globe, Key, AlertCircle, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "TLS 1.3 in transit, AES-256 at rest",
    details: ["All data encrypted during transmission", "Military-grade encryption at rest", "Zero-knowledge architecture"]
  },
  {
    icon: Server,
    title: "Enterprise Infrastructure",
    description: "99.9% uptime SLA on AWS",
    details: ["Multi-region redundancy", "Automated daily backups", "DDoS protection included"]
  },
  {
    icon: Eye,
    title: "Privacy First",
    description: "We never sell your data",
    details: ["GDPR & CCPA compliant", "Right to deletion", "Transparent data usage"]
  },
  {
    icon: FileCheck,
    title: "Compliance Certified",
    description: "SOC 2 Type II in progress",
    details: ["HIPAA compliant for healthcare", "Industry-specific certifications", "Regular third-party audits"]
  },
  {
    icon: Shield,
    title: "Access Controls",
    description: "Role-based permissions",
    details: ["Multi-factor authentication", "SSO for enterprise", "Complete audit logs"]
  },
  {
    icon: AlertCircle,
    title: "Incident Response",
    description: "24/7 security monitoring",
    details: ["Real-time threat detection", "Immediate incident response", "Transparent communication"]
  }
];

const complianceStandards = [
  { name: "SOC 2 Type II", status: "In Progress", description: "Security & availability controls" },
  { name: "GDPR", status: "Compliant", description: "EU data protection" },
  { name: "CCPA", status: "Compliant", description: "California privacy rights" },
  { name: "HIPAA", status: "Compliant", description: "Healthcare data security" },
  { name: "PCI DSS", status: "Compliant", description: "Payment card data" }
];

const Security = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Enterprise-Grade Security</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
              Your Data, Secured
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We take security seriously. Bank-level encryption, industry certifications, and transparent practices protect your business and your customers.
            </p>
          </motion.div>

          {/* Security Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 hover-lift h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Infrastructure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Infrastructure & Reliability</h2>
            <GlassCard className="p-8">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                  <p className="text-sm text-muted-foreground">Uptime SLA</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">&lt;100ms</div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">Daily</div>
                  <p className="text-sm text-muted-foreground">Automated Backups</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                  <p className="text-sm text-muted-foreground">Security Monitoring</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Compliance Standards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Compliance & Certifications</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complianceStandards.map((standard, index) => (
                <GlassCard key={index} className="p-6 hover-lift">
                  <div className="flex items-start justify-between mb-4">
                    <FileCheck className="w-8 h-8 text-primary" />
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      standard.status === 'Compliant' 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                    }`}>
                      {standard.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{standard.name}</h3>
                  <p className="text-sm text-muted-foreground">{standard.description}</p>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          {/* Data Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Data Privacy Commitment</h2>
            <GlassCard className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    What We Do
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Encrypt all data in transit and at rest</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Maintain transparent data usage policies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Provide data portability and deletion rights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Regular third-party security audits</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-primary" />
                    What We Never Do
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Sell your data to third parties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Use your data for ads or marketing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Share data without your consent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Access your data unnecessarily</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Contact Security Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="glass-card p-12 rounded-3xl text-center"
          >
            <Key className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Questions About Security?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our security team is here to answer your questions about compliance, certifications, or any security concerns.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <MagneticButton
                variant="outline"
                className="rounded-full"
                onClick={() => window.location.href = 'mailto:security@trainyouragent.com'}
              >
                security@trainyouragent.com
              </MagneticButton>
              <MagneticButton
                className="rounded-full bg-gradient-primary"
                onClick={() => window.open('https://status.trainyouragent.com', '_blank')}
              >
                <Globe className="w-5 h-5 mr-2" />
                System Status
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Security;
