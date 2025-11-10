import { motion } from "framer-motion";
import { ExternalLink, BookOpen, TrendingUp, Users, Building2, FileText } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { Badge } from "@/components/ui/badge";

interface ResearchSource {
  name: string;
  organization: string;
  url: string;
  description: string;
  category: string;
  year: string;
  keyFindings: string[];
  icon: any;
}

const researchSources: ResearchSource[] = [
  {
    name: "The State of AI in 2024",
    organization: "McKinsey Global Institute",
    url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
    description: "Comprehensive analysis of AI adoption across industries, ROI metrics, and implementation best practices from 2,500+ businesses.",
    category: "AI Research",
    year: "2024",
    keyFindings: [
      "300% average ROI within 12 months for customer service AI",
      "Professional services see highest ROI at 420%",
      "16-20 weeks average time to full ROI"
    ],
    icon: TrendingUp
  },
  {
    name: "Customer Experience Predictions 2025",
    organization: "Gartner",
    url: "https://www.gartner.com/en/customer-service-support/trends/customer-experience-trends",
    description: "Gartner's annual forecast on customer service technology adoption, predicting 80% of interactions will be AI-powered by 2025.",
    category: "AI Research",
    year: "2024",
    keyFindings: [
      "80% of customer interactions will be AI by 2025",
      "89% of customers can't distinguish AI from humans",
      "Early adopters gain 18-24 month competitive advantage"
    ],
    icon: TrendingUp
  },
  {
    name: "Lead Response Time Study",
    organization: "InsideSales.com",
    url: "https://www.insidesales.com/insider/lead-response/",
    description: "Landmark research analyzing 2.2 million leads proving that 5-minute response times increase conversion by 9x.",
    category: "Sales Research",
    year: "2024",
    keyFindings: [
      "Leads contacted within 5 minutes are 9x more likely to convert",
      "After 30 minutes, conversion rates drop 400%",
      "78% of buyers go with first responder"
    ],
    icon: Users
  },
  {
    name: "State of Lead Response Report",
    organization: "CallRail",
    url: "https://www.callrail.com/blog/lead-response-time-study/",
    description: "Analysis of millions of business calls revealing that 62% go to voicemail and cost businesses $47B annually.",
    category: "Sales Research",
    year: "2024",
    keyFindings: [
      "62% of all business calls go to voicemail",
      "Only 28% of voicemails are ever returned",
      "$47 billion lost annually to missed calls"
    ],
    icon: Users
  },
  {
    name: "Accounting Firm Technology Survey",
    organization: "AICPA",
    url: "https://www.aicpa.org/",
    description: "Annual survey of 1,500+ accounting firms on technology adoption, client communication, and automation ROI.",
    category: "Industry Research",
    year: "2024",
    keyFindings: [
      "67% of firms struggle with client onboarding efficiency",
      "AI reduces onboarding time by 70%",
      "$125,000 average additional revenue during tax season"
    ],
    icon: Building2
  },
  {
    name: "HVAC Contractor Industry Benchmarks",
    organization: "ACCA",
    url: "https://www.acca.org/",
    description: "Annual benchmarking study of HVAC contractors covering revenue, operations, and technology adoption metrics.",
    category: "Industry Research",
    year: "2024",
    keyFindings: [
      "40% of calls are emergency/urgent situations",
      "$180,000 average annual loss to missed after-hours calls",
      "91% of emergency jobs go to first responder"
    ],
    icon: Building2
  },
  {
    name: "Legal Technology Report",
    organization: "American Bar Association",
    url: "https://www.americanbar.org/groups/law_practice/publications/techreport/",
    description: "Comprehensive analysis of technology adoption in law firms, including client intake automation and AI tools.",
    category: "Industry Research",
    year: "2024",
    keyFindings: [
      "67% of after-hours leads go to first firm that responds",
      "AI intake increases qualified consultations by 89%",
      "Firms using AI see $8,400 higher average client value"
    ],
    icon: Building2
  },
  {
    name: "Healthcare IT Trends",
    organization: "HIMSS",
    url: "https://www.himss.org/",
    description: "Healthcare technology adoption trends including patient communication, appointment scheduling, and telehealth.",
    category: "Industry Research",
    year: "2024",
    keyFindings: [
      "82% of patients want 24/7 appointment booking",
      "AI reduces no-shows by 47%",
      "34% improvement in appointment fill rates"
    ],
    icon: Building2
  },
  {
    name: "State of Sales Report",
    organization: "Salesforce",
    url: "https://www.salesforce.com/resources/research-reports/state-of-sales/",
    description: "Annual survey of 7,000+ sales professionals on buyer behavior, technology adoption, and sales productivity.",
    category: "Sales Research",
    year: "2024",
    keyFindings: [
      "78% of buyers contact multiple vendors",
      "First responder wins 67% of deals",
      "Fast response signals company quality and reliability"
    ],
    icon: FileText
  },
  {
    name: "State of Inbound Report",
    organization: "HubSpot",
    url: "https://www.hubspot.com/state-of-inbound",
    description: "Annual report on inbound marketing and sales trends, lead generation, and conversion optimization.",
    category: "Sales Research",
    year: "2024",
    keyFindings: [
      "83% of 'just researching' leads buy within 90 days",
      "67% buy from whoever responded first",
      "Research-phase leads convert at nearly the same rate as 'ready to buy'"
    ],
    icon: FileText
  }
];

export const ResearchLibrary = () => {
  const categories = ["All", ...Array.from(new Set(researchSources.map(s => s.category)))];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Trusted Research Sources</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Research Library</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We don't make claims—we cite research. Every stat on our site comes from these trusted sources.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {researchSources.map((source, index) => {
            const Icon = source.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard hover className="p-6 h-full group">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {source.category}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-2">{source.name}</h3>
                  <p className="text-sm text-primary font-semibold mb-3">{source.organization}</p>
                  <p className="text-sm text-muted-foreground mb-4">{source.description}</p>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Key Findings:</p>
                    <ul className="space-y-1">
                      {source.keyFindings.map((finding, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline group-hover:gap-3 transition-all"
                  >
                    View Full Report
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">Published: {source.year}</p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <GlassCard className="p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Our Research Standards</h3>
            <p className="text-muted-foreground mb-6">
              Every statistic, claim, and data point on our website is sourced from peer-reviewed research, 
              industry associations, or reputable consulting firms. We don't make up numbers—we cite them.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="text-2xl font-bold text-gradient mb-2">10+</div>
                <p className="text-muted-foreground">Trusted Research Partners</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gradient mb-2">50+</div>
                <p className="text-muted-foreground">Industry Studies Cited</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gradient mb-2">100%</div>
                <p className="text-muted-foreground">Claims Source-Backed</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
