import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, TrendingUp, Clock, DollarSign, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { caseStudies, industryCategories } from "@/data/caseStudies";
// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
import { siteConfig } from "@/config/site";

const CaseStudies = () => {
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");

  const filteredStudies = selectedIndustry === "All Industries"
    ? caseStudies
    : caseStudies.filter(study => study.industry === selectedIndustry);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Hero Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Real Results</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
              AI Success Stories
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Publicly documented AI implementations across industries demonstrating measurable business impact.
            </p>
            <div className="flex items-start gap-2 max-w-3xl mx-auto p-4 rounded-lg bg-accent/50 border border-border">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground text-left">
                <strong className="text-foreground">Research-Based Examples:</strong> These case studies represent publicly available data from industry research, vendor case studies, and association reports. Individual results may vary based on implementation, industry conditions, and business practices.
              </p>
            </div>
          </motion.div>

          {/* Industry Filter */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-12"
          >
            <div className="flex flex-wrap gap-3 justify-center">
              {industryCategories.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    selectedIndustry === industry
                      ? "bg-primary text-primary-foreground shadow-glow-sm"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Case Studies Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            {filteredStudies.map((study) => (
              <motion.div key={study.id} variants={staggerItem}>
                <GlassCard className="p-8 h-full hover-lift">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{study.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {study.industry}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                          {study.companySize}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Challenge */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                      Challenge
                    </h4>
                    <p className="text-sm leading-relaxed text-foreground">
                      {study.challenge}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                      Solution
                    </h4>
                    <p className="text-sm leading-relaxed text-foreground">
                      {study.solution}
                    </p>
                  </div>

                  {/* Results */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                      Results
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {study.results.map((result, index) => (
                        <div key={index} className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                          <div className="text-2xl font-bold text-primary mb-1">
                            {result.improvement}
                          </div>
                          <div className="text-xs font-medium text-foreground mb-1">
                            {result.metric}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {result.timeframe}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Source */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">Source</p>
                        <p className="text-sm font-medium truncate">{study.source.name}</p>
                      </div>
                      <a
                        href={study.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="glass-card p-12 rounded-3xl text-center"
          >
            <TrendingUp className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              These results are achievable. Let's discuss how AI automation can transform your business with measurable, research-backed outcomes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <MagneticButton
                size="lg"
                className="rounded-full bg-gradient-primary"
                onClick={() => window.open(siteConfig.bookingUrl, '_blank')}
              >
                <Clock className="w-5 h-5 mr-2" />
                Book Strategy Call
              </MagneticButton>
              <MagneticButton
                size="lg"
                variant="outline"
                className="rounded-full"
                onClick={() => window.location.href = '/demos'}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Calculate Your ROI
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CaseStudies;
