import { motion } from "framer-motion";
import { Truck, Clock, DollarSign, Users, CheckCircle, ArrowRight, Sparkles, Package, MapPin, Zap } from "lucide-react";
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

const LogisticsLanding = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "" });
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
        company: formData.company,
        industry: 'Logistics',
        source: 'Logistics Landing Page Form',
        tags: ['Logistics Landing', 'Contact Form', 'Website Lead'],
        notes: `Company: ${formData.company}`,
        custom_fields: {
          ...utmParams,
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

  const seoData = landingPageSEO.logistics;

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
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-background to-amber-500/5" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-full blur-3xl"
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
                <Truck className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">For Logistics & Shipping</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Stop Losing Deals to
                <span className="block text-gradient bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                  Faster Quotes
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Generate instant shipping quotes, automate tracking updates, and handle customer inquiries 24/7. 
                Win more business by being the fastest to respond.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={10} suffix="x" />
                  </div>
                  <div className="text-sm text-muted-foreground">Faster Quotes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={70} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground">Support Saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Service</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  size="lg"
                  className="text-lg px-8 h-14 gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
                  onClick={() => {
                    conversions.ctaClicked("logistics_hero_cta");
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">AI Logistics Assistant</div>
                    <div className="text-xs text-yellow-500">● Online</div>
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
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">I need to ship 5 pallets from Chicago to LA. What's the cost?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-3 rounded-lg flex-1 border border-yellow-500/20">
                      <p className="text-sm mb-2">Let me get you an instant quote. A few quick details:</p>
                      <ul className="text-xs space-y-1">
                        <li>• Weight per pallet?</li>
                        <li>• Standard or expedited?</li>
                        <li>• Liftgate needed?</li>
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">500 lbs each, standard shipping, no liftgate</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-3 rounded-lg flex-1 border border-yellow-500/20">
                      <p className="text-sm font-bold mb-1">Quote: $2,450</p>
                      <p className="text-xs text-muted-foreground">5-7 business days transit. Book now to lock in this rate!</p>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI generates quotes instantly, 24/7
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
              8 Ways AI Transforms Your Logistics Operation
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Voice agents are just the beginning. See how we automate your entire operation from A to Z.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Select the solutions you need → Get custom pricing → Deploy in 3-7 days
            </p>
          </motion.div>

          <ComprehensiveSolutionsGrid 
            businessFunctions={comprehensiveSolutions.logistics.businessFunctions}
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
                conversions.ctaClicked("logistics_solutions_cta");
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
      <PainPointsJourney solution={expandedSolutions.logistics} />

      <SolutionJourney industry="logistics companies" currentStage={1} />


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
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">AI-Powered Logistics</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your 24/7 Logistics Command Center
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Instant Quote Generation",
                description: "AI calculates accurate shipping quotes in seconds based on weight, distance, mode, and current rates. Be the fastest responder.",
                features: ["Real-time rate calculation", "Multi-modal pricing", "Fuel surcharges", "Volume discounts"]
              },
              {
                icon: MapPin,
                title: "Automated Tracking Updates",
                description: "Customers get real-time tracking updates via SMS and email. Your support team focuses on exceptions, not status checks.",
                features: ["Real-time GPS tracking", "Automated notifications", "Delivery confirmations", "Exception alerts"]
              },
              {
                icon: Package,
                title: "Smart Load Optimization",
                description: "AI suggests optimal routes, consolidation opportunities, and carrier selection to maximize margins.",
                features: ["Route optimization", "Load consolidation", "Carrier selection", "Cost minimization"]
              },
              {
                icon: Users,
                title: "24/7 Customer Self-Service",
                description: "Customers get instant answers to tracking, documentation, and billing questions without waiting for support.",
                features: ["Tracking inquiries", "BOL requests", "Invoice questions", "Claims initiation"]
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
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{solution.title}</h3>
                    <p className="text-muted-foreground mb-6">{solution.description}</p>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
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
              Experience Your AI Logistics Assistant
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Test drive the actual AI that will handle your quotes and tracking 24/7
            </p>
          </motion.div>
          
          <VoiceAgentDemo defaultIndustry="logistics" />
        </div>
      </section>

      {/* Industry Benefits */}
      <IndustryBenefits solution={expandedSolutions.logistics} />

      {/* Comparison Table */}
      <ComparisonTable industry="logistics" />

      {/* ROI Calculator - Interactive */}
      <section id="roi" className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <ROICalculatorEnhanced defaultIndustry="logistics" />
        </div>
      </section>

      {/* Implementation Timeline */}
      <ImplementationTimeline industryId="logistics" />

      {/* Timeline Estimator CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <TimelineEstimatorCTA 
            industryId="logistics"
            variant="banner"
            location="logistics_landing_post_timeline"
          />
        </div>
      </section>

      {/* Urgency Section */}
      <UrgencySection industry="logistics" costPerHour={180} spotsRemaining={6} />

      {/* Industry Research Data */}
      <IndustryResearchData
        industry="Logistics & Freight"
        gradient="from-yellow-500/5 to-amber-500/5"
        stats={[
          {
            stat: "42%",
            description: "higher close rate when quotes are provided within 2 minutes vs 6 hours",
            source: "CSCMP Logistics Performance Study 2024",
            sourceUrl: "https://www.cscmp.org",
            impact: "In logistics, fastest quote wins. 78% of shippers go with first responder (Gartner Supply Chain)"
          },
          {
            stat: "65%",
            description: "reduction in customer service calls with AI-powered tracking updates",
            source: "Logistics Management Magazine Survey",
            sourceUrl: "https://www.logisticsmgmt.com",
            impact: "Staff focus on solving real problems instead of answering 'where's my shipment?' questions"
          },
          {
            stat: "$47B",
            description: "lost annually across all industries due to missed calls and slow response times",
            source: "CallRail State of Lead Response 2024",
            sourceUrl: "https://www.callrail.com",
            impact: "AI captures 100% of load booking requests vs 40% with manual processes"
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
                <h2 className="text-3xl font-bold mb-4">Start Winning More Deals Today</h2>
                <p className="text-muted-foreground">Free consultation. No commitments.</p>
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
                      placeholder="your@company.com"
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
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your logistics company"
                    />
                  </div>
                </div>

                <MagneticButton
                  type="submit"
                  size="lg"
                  className="w-full text-lg h-14 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
                >
                  Book Discovery Call
                  <ArrowRight className="w-5 h-5 ml-2" />
                </MagneticButton>

                <p className="text-xs text-center text-muted-foreground">
                  Book a discovery call. Implementation timeline: 3-7 days based on complexity.
                </p>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <StrategySessionLeadGate 
        open={leadGateOpen}
        onOpenChange={setLeadGateOpen}
        defaultIndustry="Logistics"
      />

      <IndustryFAQ 
        industry="Logistics"
        onStrategySessionClick={() => setLeadGateOpen(true)}
      />

      <Footer />
    </div>
  );
};

export default LogisticsLanding;
