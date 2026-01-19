import { motion } from "framer-motion";
import { Briefcase, Clock, DollarSign, Users, TrendingUp, CheckCircle, ArrowRight, Sparkles, Scale, FileText, Shield } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { StrategySessionLeadGate } from "@/components/conversion/StrategySessionLeadGate";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { landingPageSEO } from "@/lib/seo-metadata";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { AnimatedCounter } from "@/components/enhanced/AnimatedCounter";
import { IndustryResearchData } from "@/components/IndustryResearchData";
import { PainPointsJourney } from "@/components/solutions/PainPointsJourney";
import { IndustryBenefits } from "@/components/solutions/IndustryBenefits";
import { SolutionJourney } from "@/components/solutions/SolutionJourney";
import { ComprehensiveSolutionsGrid } from "@/components/solutions/ComprehensiveSolutionsGrid";
import { comprehensiveSolutions } from "@/data/comprehensiveBusinessFunctions";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import { ComparisonTable } from "@/components/conversion/ComparisonTable";
import { UrgencySection } from "@/components/conversion/UrgencySection";
import { TimelineEstimatorCTA } from "@/components/TimelineEstimatorCTA";
import { IndustryFAQ } from "@/components/IndustryFAQ";
import { expandedSolutions } from "@/data/solutionsExpanded";
import ROICalculatorEnhanced from "@/components/ROICalculatorEnhanced";
import { VoiceAgentDemo } from "@/components/VoiceAgentDemo";
import { conversions } from "@/lib/tracking";
import { FloatingIsland } from "@/components/effects/FloatingIsland";
import { ParallaxSection } from "@/components/effects/ParallaxSection";
import ImplementationTimeline from "@/components/ImplementationTimeline";
import { useIsMobile } from "@/hooks/use-mobile";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LegalLanding = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", practiceArea: "" });
  const isMobile = useIsMobile();
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const demoMessagesRef = useRef<HTMLDivElement>(null);
  const roiStatsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroStatsRef.current) {
        gsap.from(heroStatsRef.current.children, {
          scrollTrigger: {
            trigger: heroStatsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          opacity: 0,
          scale: 0.8,
          stagger: 0.2,
          duration: 0.8,
          ease: "back.out(1.7)"
        });
      }

      if (demoMessagesRef.current) {
        gsap.from(".demo-message", {
          scrollTrigger: {
            trigger: demoMessagesRef.current,
            start: "top 80%"
          },
          opacity: 0,
          y: 30,
          stagger: 0.3,
          duration: 0.6,
          ease: "power3.out"
        });
      }

      if (roiStatsRef.current) {
        gsap.from(roiStatsRef.current.children, {
          scrollTrigger: {
            trigger: roiStatsRef.current,
            start: "top 80%"
          },
          opacity: 0,
          scale: 0.9,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.success("Thanks! We'll be in touch to schedule your free strategy session.");
    window.open(siteConfig.bookingUrl, '_blank');
  };

  const seoData = landingPageSEO.legal;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords.join(", ")} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content={seoData.ogType} />
      </Helmet>
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-background to-indigo-500/5" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
                <Briefcase className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">For Legal Professionals</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Stop Screening Calls.
                <span className="block text-gradient bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  Let AI Do It
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Pre-screen potential clients, gather case details, and schedule consultations automatically. 
                Focus on law—not intake paperwork.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={3} suffix="x" />
                  </div>
                  <div className="text-sm text-muted-foreground">Better Qualified</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={60} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground">Time Saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Client Intake</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  size="lg"
                  className="text-lg px-8 h-14 gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  onClick={() => {
                    conversions.ctaClicked("legal_hero_cta");
                    setLeadGateOpen(true);
                  }}
                >
                  Get Your Free Strategy Session
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>
                <MagneticButton
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 glass-card"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See Demo
                </MagneticButton>
              </div>
            </motion.div>

            {/* Right: Interactive Demo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">AI Legal Intake Assistant</div>
                    <div className="text-xs text-purple-500">● Available Now</div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Scale className="w-4 h-4 text-primary" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">I need help with a personal injury case. I was in a car accident last month.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-3 rounded-lg flex-1 border border-purple-500/20">
                      <p className="text-sm">I'm sorry to hear that. We specialize in personal injury cases. Let me gather some details to see if we can help you get the compensation you deserve.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-3 rounded-lg flex-1 border border-purple-500/20">
                      <p className="text-sm mb-2">Quick questions to qualify your case:</p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>✓ Were you injured?</li>
                        <li>✓ Was the other driver at fault?</li>
                        <li>✓ Do you have medical records?</li>
                        <li>✓ Have you contacted insurance?</li>
                      </ul>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI pre-qualifies cases and books consultations 24/7
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comprehensive AI Solutions Section */}
      <section className="py-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Complete AI Solutions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              8 Ways AI Transforms Your Legal Practice
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Voice agents are just the beginning. See how we automate your entire operation from A to Z.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Select the solutions you need → Get custom pricing → Deploy in 3-7 days
            </p>
          </motion.div>

          <ComprehensiveSolutionsGrid 
            businessFunctions={comprehensiveSolutions.legal.businessFunctions}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <MagneticButton
              size="lg"
              onClick={() => {
                conversions.ctaClicked("legal_solutions_cta");
                setLeadGateOpen(true);
              }}
              className="text-lg px-8 h-14 gap-2"
            >
              Build My Custom AI Solution Package
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
            <p className="text-sm text-muted-foreground mt-4">
              Get personalized pricing and implementation timeline in your free strategy session
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pain Points Journey */}
      <PainPointsJourney solution={expandedSolutions.legal} />

      <SolutionJourney industry="law firms" currentStage={1} />


      {/* Solutions */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">AI-Powered Legal Intake</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your 24/7 Virtual Paralegal
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Scale,
                title: "Intelligent Case Screening",
                description: "AI asks targeted questions to identify viable cases based on your acceptance criteria. No more wasted consultations.",
                features: ["Practice area matching", "Jurisdiction verification", "Merit assessment", "Conflict checks"]
              },
              {
                icon: FileText,
                title: "Pre-Consultation Prep",
                description: "Gather case details, relevant documents, and timelines before the consultation. Come prepared, close faster.",
                features: ["Case detail collection", "Document upload", "Timeline builder", "Incident reports"]
              },
              {
                icon: Shield,
                title: "Compliance & Security",
                description: "Maintain attorney-client privilege with secure, encrypted intake. HIPAA and state bar compliant.",
                features: ["End-to-end encryption", "Secure document storage", "Audit trails", "Confidentiality maintained"]
              },
              {
                icon: Clock,
                title: "24/7 Lead Capture",
                description: "Capture and qualify leads around the clock. Respond instantly while competitors wait until business hours.",
                features: ["After-hours intake", "Emergency case handling", "Instant responses", "Multi-language support"]
              }
            ].map((solution, index) => {
              const Icon = solution.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-8 h-full hover-lift">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{solution.title}</h3>
                    <p className="text-muted-foreground mb-6">{solution.description}</p>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industry Benefits */}
      <IndustryBenefits solution={expandedSolutions.legal} />

      {/* Live Voice Demo */}
      <section id="demo" className="py-20 relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Experience Your AI Intake System
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Test drive the actual AI that will qualify your legal leads 24/7
            </p>
          </motion.div>
          
          <VoiceAgentDemo defaultIndustry="legal" />
        </div>
      </section>

      {/* Comparison Table */}
      <ComparisonTable industry="legal" />

      {/* ROI Calculator - Interactive */}
      <section id="roi" className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <ROICalculatorEnhanced defaultIndustry="legal" />
        </div>
      </section>

      {/* Implementation Timeline */}
      <ImplementationTimeline industryId="legal" />

      {/* Timeline Estimator CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <TimelineEstimatorCTA 
            industryId="legal"
            variant="banner"
            location="legal_landing_post_timeline"
          />
        </div>
      </section>

      {/* Urgency Section */}
      <UrgencySection industry="legal" costPerHour={375} spotsRemaining={2} />

      {/* Industry Research Data */}
      <IndustryResearchData
        industry="Legal Services"
        gradient="from-purple-500/5 to-indigo-500/5"
        stats={[
          {
            stat: "67%",
            description: "of after-hours legal leads go to the first firm that responds",
            source: "American Bar Association Tech Report 2024",
            sourceUrl: "https://www.americanbar.org",
            impact: "Firms using AI intake increase qualified consultations by 89% and see $8,400 higher average client value"
          },
          {
            stat: "56%",
            description: "of potential clients abandon intake forms if too complex or time-consuming",
            source: "Clio Legal Trends Report 2024",
            sourceUrl: "https://www.clio.com",
            impact: "AI-guided intake reduces abandonment by 78% through conversational collection"
          },
          {
            stat: "$180K",
            description: "average monthly revenue from leads that would have been missed without 24/7 availability",
            source: "ABA Practice Management Study",
            sourceUrl: "https://www.americanbar.org",
            impact: "73% of high-value legal inquiries occur outside standard business hours (HBR)"
          }
        ]}
      />

      {/* Contact Form */}
      <section id="contact-form" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <GlassCard className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Start Qualifying Better Cases Today</h2>
                <p className="text-muted-foreground">Free consultation. No credit card required.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@lawfirm.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="practiceArea">Practice Area</Label>
                    <Input
                      id="practiceArea"
                      value={formData.practiceArea}
                      onChange={(e) => setFormData({ ...formData, practiceArea: e.target.value })}
                      placeholder="e.g., Personal Injury"
                    />
                  </div>
                </div>

                <MagneticButton
                  type="submit"
                  size="lg"
                  className="w-full text-lg h-14 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                >
                  Schedule Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </MagneticButton>

                <p className="text-xs text-center text-muted-foreground">
                  Confidential. Bar-compliant. Unsubscribe anytime.
                </p>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <StrategySessionLeadGate 
        open={leadGateOpen}
        onOpenChange={setLeadGateOpen}
        defaultIndustry="Legal"
      />

      <IndustryFAQ 
        industry="Legal"
        onStrategySessionClick={() => setLeadGateOpen(true)}
      />

      <Footer />
    </div>
  );
};

export default LegalLanding;
