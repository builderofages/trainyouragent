import { motion } from "framer-motion";
import { BookOpen, Award, CheckCircle2, ExternalLink, Sparkles, Search, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";

const researchPartners = [
  {
    name: "Gartner",
    category: "Global Research & Advisory",
    description: "World's leading research and advisory company providing insights on technology trends",
    reports: ["AI Adoption Report 2024", "Customer Experience Predictions"],
    logo: "G"
  },
  {
    name: "McKinsey Global Institute",
    category: "Management Consulting",
    description: "Leading source of research on the global economy and business management",
    reports: ["The State of AI 2024", "AI Economic Impact Study"],
    logo: "M"
  },
  {
    name: "Harvard Business Review",
    category: "Business Research",
    description: "Premier source for management ideas and best practices",
    reports: ["Lead Response Time Studies", "Buyer Behavior Analysis"],
    logo: "H"
  },
  {
    name: "Forrester Research",
    category: "Technology Research",
    description: "Independent research firm focused on customer experience and technology",
    reports: ["Future of Customer Experience", "AI CX Trends"],
    logo: "F"
  }
];

const industryAssociations = [
  {
    name: "AICPA",
    fullName: "American Institute of CPAs",
    industry: "Accounting",
    reports: ["Technology Survey 2024", "Firm Metrics Report"]
  },
  {
    name: "ABA",
    fullName: "American Bar Association",
    industry: "Legal",
    reports: ["TECHREPORT 2024", "Legal Trends"]
  },
  {
    name: "ACCA",
    fullName: "Air Conditioning Contractors of America",
    industry: "HVAC",
    reports: ["Industry Standards", "Business Benchmarks"]
  },
  {
    name: "NRCA",
    fullName: "National Roofing Contractors Association",
    industry: "Roofing",
    reports: ["Industry Research", "Market Analysis"]
  },
  {
    name: "HIMSS",
    fullName: "Healthcare Information and Management Systems Society",
    industry: "Healthcare",
    reports: ["Patient Engagement Study", "Healthcare IT Trends"]
  },
  {
    name: "SHRM",
    fullName: "Society for Human Resource Management",
    industry: "Human Resources",
    reports: ["Cost-per-Hire Report", "Total Rewards Survey"]
  }
];

const methodology = [
  {
    step: "1",
    title: "Identify Business Challenge",
    description: "We start with real problems our clients face, not hypothetical scenarios"
  },
  {
    step: "2",
    title: "Search Credible Sources",
    description: "We only cite peer-reviewed or industry-recognized research institutions"
  },
  {
    step: "3",
    title: "Cross-Reference Data",
    description: "Every statistic is verified across multiple independent sources"
  },
  {
    step: "4",
    title: "Cite & Link Sources",
    description: "Full transparency with direct links to original research materials"
  },
  {
    step: "5",
    title: "Annual Updates",
    description: "We refresh data yearly or when new authoritative reports are published"
  }
];

const ResearchPartners = () => {
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
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Research-Backed Claims</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
              Trusted Research Partners
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every statistic, every claim, every recommendation is backed by credible research from the world's leading institutions. No made-up numbers. No marketing fluff. Just facts.
            </p>
          </motion.div>

          {/* Our Commitment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-20"
          >
            <GlassCard className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    Our Standards
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Only cite peer-reviewed or industry-recognized sources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Always provide direct links to source material</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Update data annually or when new reports published</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Transparent about estimated vs verified data</span>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-black text-primary mb-4">100%</div>
                    <p className="text-xl font-semibold">Verifiable Sources</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      If we can't cite it, we don't claim it
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Global Research Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Global Research Institutions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {researchPartners.map((partner, index) => (
                <GlassCard key={index} className="p-6 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-black text-white">{partner.logo}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{partner.name}</h3>
                      <p className="text-sm text-primary font-semibold mb-2">{partner.category}</p>
                      <p className="text-sm text-muted-foreground mb-3">{partner.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-foreground">Key Reports We Use:</p>
                        {partner.reports.map((report, i) => (
                          <p key={i} className="text-xs text-muted-foreground">• {report}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          {/* Industry Associations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Industry Associations</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {industryAssociations.map((association, index) => (
                <GlassCard key={index} className="p-6 hover-lift text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{association.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{association.fullName}</p>
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
                    {association.industry}
                  </span>
                  <div className="space-y-1">
                    {association.reports.map((report, i) => (
                      <p key={i} className="text-xs text-muted-foreground">• {report}</p>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          {/* Methodology */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Our Research Methodology</h2>
            <div className="space-y-4">
              {methodology.map((item, index) => (
                <GlassCard key={index} className="p-6 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-black text-primary">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-12 rounded-3xl text-center"
          >
            <Search className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Questions About Our Research?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Want to verify a source? Found more recent data? Have research to share? We're committed to transparency and continuous improvement.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <MagneticButton
                variant="outline"
                className="rounded-full"
                onClick={() => window.location.href = 'mailto:research@trainyouragent.com'}
              >
                research@trainyouragent.com
              </MagneticButton>
              <MagneticButton
                className="rounded-full bg-gradient-primary"
                onClick={() => window.open('/resources', '_self')}
              >
                <FileText className="w-5 h-5 mr-2" />
                Browse Research Library
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResearchPartners;
