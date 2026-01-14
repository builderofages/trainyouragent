import { Suspense, lazy, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { ArrowRight, Play, Zap, Target, Shield, RotateCcw, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoBackground } from "@/components/performance/VideoBackground";
import { ScrollChevron } from "./ScrollChevron";
import { AnimatedCounter } from "./AnimatedCounter";
import { ProblemSection } from "./ProblemSection";
import { HowItWorksTimeline } from "./HowItWorksTimeline";
import { FAQPremium } from "./FAQPremium";
import { FinalCTA } from "./FinalCTA";
import { FooterPremium } from "./FooterPremium";
import Header from "@/components/Header";
import { siteConfig } from "@/config/site";
import { comprehensiveSolutions } from "@/data/comprehensiveBusinessFunctions";
import { expandedSolutions } from "@/data/solutionsExpanded";
import heroVideo from "/videos/hero-bg.mp4";

// Lazy load heavy components
const VoiceAgentDemo = lazy(() => import("@/components/VoiceAgentDemo").then(m => ({ default: m.VoiceAgentDemo })));
const ROICalculatorEnhanced = lazy(() => import("@/components/ROICalculatorEnhanced"));
const ComprehensiveSolutionsGrid = lazy(() => import("@/components/solutions/ComprehensiveSolutionsGrid").then(m => ({ default: m.ComprehensiveSolutionsGrid })));
const PainPointsJourney = lazy(() => import("@/components/solutions/PainPointsJourney").then(m => ({ default: m.PainPointsJourney })));
const IndustryBenefits = lazy(() => import("@/components/solutions/IndustryBenefits").then(m => ({ default: m.IndustryBenefits })));
const ComparisonTable = lazy(() => import("@/components/conversion/ComparisonTable").then(m => ({ default: m.ComparisonTable })));
const StrategySessionLeadGate = lazy(() => import("@/components/conversion/StrategySessionLeadGate").then(m => ({ default: m.StrategySessionLeadGate })));

// Loading component
const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export interface IndustryConfig {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
  tagline: string;
  headline: {
    line1: string;
    line2: string;
    line3: string;
  };
  subheadline: string;
  stats: {
    value: number;
    suffix: string;
    label: string;
  }[];
  problems: {
    stat: string;
    label: string;
    description: string;
  }[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  gradient: string;
  accentColor: string;
}

interface IndustryLandingTemplateProps {
  config: IndustryConfig;
}

export const IndustryLandingTemplate = ({ config }: IndustryLandingTemplateProps) => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  
  // Get industry-specific data
  const businessFunctions = comprehensiveSolutions[config.id]?.businessFunctions || [];
  const solution = expandedSolutions[config.id];
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-deep-space">
      <Helmet>
        <title>{config.seo.title}</title>
        <meta name="description" content={config.seo.description} />
        <meta name="keywords" content={config.seo.keywords.join(", ")} />
        <meta property="og:title" content={config.seo.title} />
        <meta property="og:description" content={config.seo.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={config.seo.title} />
        <meta name="twitter:description" content={config.seo.description} />
        <link rel="canonical" href={`https://trainyouragent.com/${config.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": `AI Voice Agents for ${config.name}`,
            "description": config.seo.description,
            "provider": {
              "@type": "Organization",
              "name": siteConfig.companyName,
              "url": "https://trainyouragent.com"
            },
            "areaServed": "United States",
            "serviceType": "AI Voice Agent"
          })}
        </script>
      </Helmet>

      <Header />

      {/* Premium Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <VideoBackground
          src={heroVideo}
          overlay
          overlayOpacity={0.75}
          fallbackGradient
          className="absolute inset-0"
        />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Industry badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-medium tracking-[0.2em] uppercase
                           bg-white/5 border border-white/10 text-white/60 backdrop-blur-sm">
              <config.icon className="w-3.5 h-3.5 text-tech-cyan" />
              AI for {config.name}
            </span>
          </motion.div>

          {/* Main headline */}
          <div className="mb-6">
            <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {config.headline.line1}
              </motion.span>
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {config.headline.line2}
              </motion.span>
              <motion.span
                className={`block bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                {config.headline.line3}
              </motion.span>
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {config.subheadline}
          </motion.p>

          {/* Stats row */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 md:gap-12 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            {config.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <Button
              size="lg"
              onClick={() => scrollToSection("demo")}
              className="group bg-white text-deep-space hover:bg-white/90 font-semibold px-8 py-6 text-lg
                         shadow-[0_0_40px_hsla(0,0%,100%,0.2)] hover:shadow-[0_0_60px_hsla(0,0%,100%,0.3)]
                         transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Hear It Live
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open(siteConfig.bookingUrl, '_blank')}
              className="border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg
                         backdrop-blur-sm transition-all duration-300
                         hover:border-white/40 hover:shadow-[0_0_30px_hsla(185,80%,50%,0.2)]"
            >
              Book Strategy Session
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-white/50 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-tech-cyan" />
              <span>Live in 5 Days</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-tech-cyan" />
              <span>94% Booking Rate</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-tech-cyan" />
              <span>Enterprise Security</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-tech-cyan" />
              <span>Cancel Anytime</span>
            </div>
          </motion.div>
        </div>

      <ScrollChevron targetId="problem-section" />
      </section>

      {/* Problem Section */}
      <ProblemSection />

      {/* Solutions Grid */}
      <section className="py-24 bg-deep-space/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              8 Ways AI Transforms Your {config.name} Business
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Complete automation suite designed specifically for {config.name.toLowerCase()} operations.
            </p>
          </motion.div>
          
          <Suspense fallback={<SectionLoader />}>
            <ComprehensiveSolutionsGrid businessFunctions={businessFunctions} />
          </Suspense>
        </div>
      </section>

      {/* Pain Points Journey */}
      {solution && (
        <section className="py-24 bg-gradient-to-b from-deep-space/50 to-deep-space">
          <div className="container mx-auto px-4">
            <Suspense fallback={<SectionLoader />}>
              <PainPointsJourney solution={solution} />
            </Suspense>
          </div>
        </section>
      )}

      {/* Industry Benefits */}
      {solution && (
        <section className="py-24 bg-deep-space">
          <div className="container mx-auto px-4">
            <Suspense fallback={<SectionLoader />}>
              <IndustryBenefits solution={solution} />
            </Suspense>
          </div>
        </section>
      )}

      {/* Comparison Table */}
      <section className="py-24 bg-deep-space/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              AI vs Traditional Solutions
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              See how AI voice agents compare to hiring staff or call centers.
            </p>
          </motion.div>
          
          <Suspense fallback={<SectionLoader />}>
            <ComparisonTable />
          </Suspense>
        </div>
      </section>

      {/* Voice Demo */}
      <section id="demo" className="py-24 bg-deep-space">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Hear It In Action
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Experience how our AI handles real {config.name.toLowerCase()} calls.
            </p>
          </motion.div>
          
          <Suspense fallback={<SectionLoader />}>
            <VoiceAgentDemo />
          </Suspense>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-24 bg-deep-space/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Calculate Your ROI
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              See exactly how much revenue you're leaving on the table.
            </p>
          </motion.div>
          
          <Suspense fallback={<SectionLoader />}>
            <ROICalculatorEnhanced />
          </Suspense>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorksTimeline />

      {/* FAQ */}
      <FAQPremium />

      {/* CTA Section with Lead Gate */}
      <section className="py-24 bg-deep-space">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your {config.name} Business?
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
              Book a free strategy session to see how AI can work for your specific situation.
            </p>
            <Button
              size="lg"
              onClick={() => setLeadGateOpen(true)}
              className="bg-white text-deep-space hover:bg-white/90 font-semibold px-8 py-6 text-lg"
            >
              Get Your Free Strategy Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Strategy Session Lead Gate */}
      <Suspense fallback={null}>
        <StrategySessionLeadGate 
          open={leadGateOpen} 
          onOpenChange={setLeadGateOpen}
          defaultIndustry={config.name}
        />
      </Suspense>

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <FooterPremium />
    </div>
  );
};

export default IndustryLandingTemplate;
