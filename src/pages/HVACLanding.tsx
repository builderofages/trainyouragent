import { motion } from "framer-motion";
import { Thermometer, Clock, TrendingUp, Calendar, Phone, Shield, DollarSign, ArrowRight, Sparkles, Wrench, AlertCircle } from "lucide-react";
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
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { comprehensiveSolutions } from "@/data/comprehensiveBusinessFunctions";

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

const HVACLanding = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "" });
  const solution = expandedSolutions.hvac;
  const businessFunctions = comprehensiveSolutions.hvac?.businessFunctions;
  const isMobile = useIsMobile();
  const [performanceTier, setPerformanceTier] = useState<'high' | 'medium' | 'low'>('high');
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  
  // Validate data on mount
  useEffect(() => {
    if (!solution) {
      console.error('Missing solution data for HVAC');
    }
    if (!businessFunctions || businessFunctions.length === 0) {
      console.error('Missing business functions for HVAC');
    }
  }, [solution, businessFunctions]);
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const demoMessagesRef = useRef<HTMLDivElement>(null);
  const roiStatsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect performance tier
    if (typeof navigator !== 'undefined') {
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        setPerformanceTier('low');
      } else if ('connection' in navigator && (navigator as any).connection?.effectiveType === '3g') {
        setPerformanceTier('medium');
      }
    }
  }, []);

  useEffect(() => {
    // GSAP scroll animations
    const ctx = gsap.context(() => {
      // Hero stats animation
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

      // Demo messages animation
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

      // ROI stats animation
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
    
    conversions.formSubmitted("hvac_contact", "hvac");
    toast.success("Thanks! We'll be in touch to schedule your free strategy session.");
    window.open(siteConfig.bookingUrl, '_blank');
  };

  const seoData = landingPageSEO.hvac;

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('HVAC Landing Page Error:', {
          error: error.message,
          componentStack: errorInfo.componentStack,
        });
      }}
    >
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
        {!isMobile && (
          <ParallaxSection speed={0.3} className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-background to-cyan-500/5" />
          </ParallaxSection>
        )}
        {!isMobile ? (
          <ParallaxSection speed={0.5} className="absolute top-0 right-0 w-[600px] h-[600px]">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 20, repeat: Infinity }}
              className="w-full h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
              style={{ willChange: 'transform' }}
            />
          </ParallaxSection>
        ) : (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
          />
        )}

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
                <Thermometer className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">For HVAC Contractors</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Turn After-Hours Emergencies
                <span className="block text-gradient bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Into Revenue
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                AI that never misses an emergency call, qualifies leads 24/7, and schedules service appointments—even at 2am on Sunday.
              </p>

              <div ref={heroStatsRef} className="grid grid-cols-3 gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ duration: 0.2 }}
                  style={{ willChange: 'transform' }}
                >
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={24} suffix="/7" />
                  </div>
                  <div className="text-sm text-muted-foreground">Call Coverage</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ duration: 0.2 }}
                  style={{ willChange: 'transform' }}
                >
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={35} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground">More Bookings</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ duration: 0.2 }}
                  style={{ willChange: 'transform' }}
                >
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={2} suffix=" min" />
                  </div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                </motion.div>
              </div>

              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  strength={isMobile ? 10 : 25}
                  size="lg"
                  className="text-lg px-8 h-14 gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-shadow"
                  onClick={() => {
                    conversions.ctaClicked("hvac_hero_cta");
                    setLeadGateOpen(true);
                  }}
                >
                  Get Your Free Strategy Session
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </MagneticButton>
                <MagneticButton
                  strength={isMobile ? 8 : 15}
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 glass-card"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Watch Demo
                </MagneticButton>
                <MagneticButton
                  strength={isMobile ? 8 : 15}
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 glass-card"
                  onClick={() => {
                    conversions.ctaClicked("hvac_calculator_cta");
                    setLeadGateOpen(true);
                  }}
                >
                  Calculate Savings
                </MagneticButton>
              </div>
            </motion.div>

            {/* Right: Interactive Demo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <FloatingIsland intensity={isMobile ? "low" : "medium"} delay={0.3}>
                <GlassCard className="p-8" style={{ willChange: 'transform' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
                      style={{ willChange: 'transform' }}
                    >
                      <Thermometer className="w-5 h-5 text-white" />
                    </motion.div>
                  <div>
                    <div className="font-bold">AI HVAC Dispatcher</div>
                    <div className="text-xs text-blue-500">● Available 24/7</div>
                  </div>
                </div>

                <div ref={demoMessagesRef} className="space-y-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-3 demo-message"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">My AC stopped working and it's 95 degrees! Can you help today?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-3 flex-row-reverse demo-message"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-3 rounded-lg flex-1 border border-blue-500/20">
                      <p className="text-sm">Absolutely! We have emergency service available. Let me check our technician schedule. What's your zip code?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex gap-3 demo-message"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">90210</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex gap-3 flex-row-reverse demo-message"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-3 rounded-lg flex-1 border border-blue-500/20">
                      <p className="text-sm mb-2">Great! I have Mike available at 2:30pm today. Emergency service call is $150, plus repairs. I'm booking you now and sending confirmation via text with Mike's ETA.</p>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI qualifies leads, checks availability, and books service 24/7
                </div>
              </GlassCard>
              </FloatingIsland>
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
              8 Ways AI Transforms Your HVAC Business
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Voice agents are just the beginning. See how we automate your entire operation from A to Z.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Select the solutions you need → Get custom pricing → Deploy in 3-7 days
            </p>
          </motion.div>

          <ComprehensiveSolutionsGrid 
            businessFunctions={comprehensiveSolutions.hvac.businessFunctions}
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
                conversions.ctaClicked("hvac_solutions_cta");
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
      <PainPointsJourney solution={solution} />

      {/* Solution Journey */}
      <SolutionJourney industry="HVAC contractors" currentStage={1} />


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
              Experience Your AI Agent
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Test drive the actual AI that will answer your HVAC calls 24/7
            </p>
          </motion.div>
          
          <VoiceAgentDemo defaultIndustry="hvac" />
        </div>
      </section>

      {/* Industry Benefits */}
      <IndustryBenefits solution={solution} />

      {/* Comparison Table */}
      <ComparisonTable industry="hvac" />

      {/* ROI Calculator - Interactive */}
      <section id="roi" className="py-20 relative overflow-hidden">
        {!isMobile && (
          <ParallaxSection speed={0.3} className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
          </ParallaxSection>
        )}
        <div className="container mx-auto px-4 relative z-10">
          <ROICalculatorEnhanced defaultIndustry="hvac" />
        </div>
      </section>

      {/* Implementation Timeline */}
      <ImplementationTimeline industryId="hvac" />

      {/* Timeline Estimator CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <TimelineEstimatorCTA 
            industryId="hvac"
            variant="banner"
            location="hvac_landing_post_timeline"
          />
        </div>
      </section>

      {/* Research Data */}
      <IndustryResearchData 
        industry="HVAC"
        gradient="from-blue-500/5 to-cyan-500/5"
        stats={[
          {
            stat: "42%",
            description: "of after-hours emergency calls go to competitors",
            source: "Service Nation Alliance",
            sourceUrl: "https://www.servicenationalliance.com",
            impact: "24/7 AI coverage captures every emergency opportunity"
          },
          {
            stat: "$75K+",
            description: "average annual revenue lost from missed calls",
            source: "CallRail HVAC Study",
            sourceUrl: "https://www.callrail.com",
            impact: "AI never misses a call, even at 2am"
          },
          {
            stat: "78%",
            description: "of customers expect immediate response for emergencies",
            source: "BrightLocal Consumer Review",
            sourceUrl: "https://www.brightlocal.com",
            impact: "AI responds in under 2 seconds, 24/7"
          }
        ]}
      />

      {/* Urgency Section */}
      <UrgencySection industry="HVAC" costPerHour={120} spotsRemaining={4} />

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
                <h2 className="text-3xl font-bold mb-4">Ready to Capture Every Lead?</h2>
                <p className="text-muted-foreground">Book discovery call - Implementation: 3-7 days for your business</p>
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
                      className="glass-card"
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
                      placeholder="you@hvaccompany.com"
                      className="glass-card"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="glass-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your HVAC company"
                      className="glass-card"
                    />
                  </div>
                </div>

                <MagneticButton
                  type="submit"
                  size="lg"
                  className="w-full text-lg h-14 gap-2"
                >
                  Get My Custom Quote
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>

                <p className="text-xs text-center text-muted-foreground">
                  We'll schedule a discovery call to discuss your business's specific needs and timeline
                </p>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <StrategySessionLeadGate 
        open={leadGateOpen}
        onOpenChange={setLeadGateOpen}
        defaultIndustry="HVAC"
      />

      <IndustryFAQ 
        industry="HVAC"
        onStrategySessionClick={() => setLeadGateOpen(true)}
      />

      <Footer />
    </div>
    </ErrorBoundary>
  );
};

export default HVACLanding;
