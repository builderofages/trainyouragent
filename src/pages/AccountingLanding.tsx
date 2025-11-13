import { motion } from "framer-motion";
import { Calculator, Clock, FileText, Users, TrendingUp, CheckCircle, ArrowRight, Sparkles, DollarSign, Calendar, Shield } from "lucide-react";
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

const AccountingLanding = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", firmSize: "" });
  const isMobile = useIsMobile();
  const [performanceTier, setPerformanceTier] = useState<'high' | 'medium' | 'low'>('high');
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const demoMessagesRef = useRef<HTMLDivElement>(null);
  const roiStatsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        setPerformanceTier('low');
      } else if ('connection' in navigator && (navigator as any).connection?.effectiveType === '3g') {
        setPerformanceTier('medium');
      }
    }
  }, []);

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
    
    try {
      const { sendToApollo, getUTMParameters } = await import('@/lib/apollo-integration');
      const utmParams = getUTMParameters();
      
      await sendToApollo({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.firmSize,
        industry: 'Accounting',
        source: 'Accounting Landing Page Form',
        tags: ['Accounting Landing', 'Contact Form', 'Website Lead'],
        notes: `Firm Size: ${formData.firmSize}`,
        custom_fields: {
          ...utmParams,
          firm_size: formData.firmSize,
          page_url: window.location.href,
          form_type: 'contact'
        },
      });
      
      toast.success("Thanks! We'll be in touch to schedule your free strategy session.");
      window.open(siteConfig.bookingUrl, '_blank');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.success("Thanks! We'll be in touch to schedule your free strategy session.");
      window.open(siteConfig.bookingUrl, '_blank');
    }
  };

  const seoData = landingPageSEO.accounting;

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
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-background to-emerald-500/5" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"
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
                <Calculator className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">For Accounting Professionals</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Stop Chasing Clients.
                <span className="block text-gradient bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  Let AI Find Them
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Automate client onboarding, document collection, and consultation scheduling. 
                Focus on accounting—not administrative work.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={5} suffix="x" />
                  </div>
                  <div className="text-sm text-muted-foreground">Faster Onboarding</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={70} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground">Time Saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Client Support</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  size="lg"
                  className="text-lg px-8 h-14 gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  onClick={() => {
                    conversions.ctaClicked("accounting_hero_cta");
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">AI Accounting Assistant</div>
                    <div className="text-xs text-green-500">● Online</div>
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
                      <Calculator className="w-4 h-4 text-primary" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">Hi! I need help with my business taxes. Do you handle S-Corp returns?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 rounded-lg flex-1 border border-green-500/20">
                      <p className="text-sm">Absolutely! We specialize in S-Corp tax preparation. Let me ask a few quick questions to see if we're a good fit, then I'll schedule you with our senior tax specialist.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-primary" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">Perfect! What do you need to know?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 rounded-lg flex-1 border border-green-500/20">
                      <p className="text-sm mb-2">Great! Just 3 quick questions:</p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>✓ What's your annual revenue range?</li>
                        <li>✓ Do you have employees?</li>
                        <li>✓ When's your fiscal year end?</li>
                      </ul>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI automatically qualifies and books consultations 24/7
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
              8 Ways AI Transforms Your Accounting Firm
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Voice agents are just the beginning. See how we automate your entire operation from A to Z.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Select the solutions you need → Get custom pricing → Deploy in 3-7 days
            </p>
          </motion.div>

          <ComprehensiveSolutionsGrid 
            businessFunctions={comprehensiveSolutions.accounting.businessFunctions}
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
                conversions.ctaClicked("accounting_solutions_cta");
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
      <PainPointsJourney solution={expandedSolutions.accounting} />

      {/* Solution Journey */}
      <SolutionJourney industry="accounting firms" currentStage={1} />


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
              <Sparkles className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">AI-Powered Solutions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your 24/7 Digital Receptionist
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Calendar,
                title: "Automated Client Onboarding",
                description: "AI collects all necessary documents, tax forms, and information before your first meeting. No more chasing paperwork.",
                features: ["Secure document upload", "Tax form collection", "Client questionnaires", "Compliance checks"]
              },
              {
                icon: Shield,
                title: "Smart Client Qualification",
                description: "Pre-screen prospects based on your ideal client profile. Only qualified leads get to your calendar.",
                features: ["Revenue thresholds", "Service needs matching", "Complexity assessment", "Automatic scheduling"]
              },
              {
                icon: DollarSign,
                title: "Instant Quote Generation",
                description: "Provide pricing estimates immediately based on client needs and complexity. No waiting, no guessing.",
                features: ["Service-based pricing", "Complexity calculations", "Custom package quotes", "Transparent pricing"]
              },
              {
                icon: Clock,
                title: "After-Hours Lead Capture",
                description: "Capture leads 24/7, even during tax season crunch time. Your AI never sleeps, takes vacation, or calls in sick.",
                features: ["24/7 availability", "Instant responses", "Emergency handling", "Follow-up scheduling"]
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
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{solution.title}</h3>
                    <p className="text-muted-foreground mb-6">{solution.description}</p>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
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
              Experience Your AI Tax Assistant
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Test drive the actual AI that will screen your accounting leads 24/7
            </p>
          </motion.div>
          
          <VoiceAgentDemo defaultIndustry="accounting" />
        </div>
      </section>

      {/* Industry Benefits */}
      <IndustryBenefits solution={expandedSolutions.accounting} />

      {/* Comparison Table */}
      <ComparisonTable industry="accounting" />

      {/* ROI Calculator - Interactive */}
      <section id="roi" className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <ROICalculatorEnhanced defaultIndustry="accounting" />
        </div>
      </section>

      {/* Implementation Timeline */}
      <ImplementationTimeline industryId="accounting" />

      {/* Timeline Estimator CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <TimelineEstimatorCTA 
            industryId="accounting"
            variant="banner"
            location="accounting_landing_post_timeline"
          />
        </div>
      </section>

      {/* Urgency Section */}
      <UrgencySection industry="accounting" costPerHour={300} spotsRemaining={3} />

      {/* Industry Research Data */}
      <IndustryResearchData
        industry="Accounting"
        gradient="from-green-500/5 to-emerald-500/5"
        stats={[
          {
            stat: "67%",
            description: "of accounting firms struggle with client onboarding efficiency",
            source: "AICPA Technology Survey 2024",
            sourceUrl: "https://www.aicpa.org",
            impact: "AI reduces onboarding time by 70% - from 5 days to 1.5 days average"
          },
          {
            stat: "$125K",
            description: "average additional revenue during tax season for firms using AI",
            source: "AICPA 2024 Tax Season Report",
            sourceUrl: "https://www.aicpa.org",
            impact: "AI captures 300% more inquiries during peak season without additional staff"
          },
          {
            stat: "5x",
            description: "faster response time compared to manual client intake",
            source: "CPA.com Practice Management Study",
            sourceUrl: "https://www.cpa.com",
            impact: "Leads contacted within 5 minutes are 9x more likely to convert (InsideSales.com)"
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
                <h2 className="text-3xl font-bold mb-4">Get Started with Your AI Assistant</h2>
                <p className="text-muted-foreground">Book a discovery call. Custom implementation timeline: 3-7 days.</p>
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
                      placeholder="your@email.com"
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
                    <Label htmlFor="firmSize">Firm Size</Label>
                    <Input
                      id="firmSize"
                      value={formData.firmSize}
                      onChange={(e) => setFormData({ ...formData, firmSize: e.target.value })}
                      placeholder="e.g., 5 CPAs"
                    />
                  </div>
                </div>

                <MagneticButton
                  type="submit"
                  size="lg"
                  className="w-full text-lg h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Book Discovery Call
                  <ArrowRight className="w-5 h-5 ml-2" />
                </MagneticButton>

                <p className="text-xs text-center text-muted-foreground">
                  We'll never share your information. Unsubscribe anytime.
                </p>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <StrategySessionLeadGate 
        open={leadGateOpen}
        onOpenChange={setLeadGateOpen}
        defaultIndustry="Accounting"
      />

      <IndustryFAQ 
        industry="Accounting"
        onStrategySessionClick={() => setLeadGateOpen(true)}
      />

      <Footer />
    </div>
  );
};

export default AccountingLanding;
