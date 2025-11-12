import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSectionEnhanced";
import StatsSection from "@/components/StatsSectionEnhanced";
import ServicesShowcase from "@/components/ServicesShowcase";
import NicheDirectory from "@/components/NicheDirectoryEnhanced";
import SocialProof from "@/components/SocialProofEnhanced";
import NewsletterSection from "@/components/NewsletterSectionEnhanced";
import Footer from "@/components/FooterEnhanced";
import ROICalculator from "@/components/ROICalculatorEnhanced";
import { ROIIndustryComparison } from "@/components/ROIIndustryComparison";
import { ParallaxSection } from "@/components/effects/ParallaxSection";
import { ParticleFieldEnhanced } from "@/components/effects/ParticleFieldEnhanced";
import { ScrollGradient } from "@/components/effects/ScrollGradient";
import { AnimatedBackground } from "@/components/effects/AnimatedBackground";
import { HorizontalGallery } from "@/components/scroll/HorizontalGallery";
import { ScrollRevealSection } from "@/components/scroll/ScrollRevealSection";
import { StickyReveal } from "@/components/scroll/StickyReveal";
import { useGSAP } from "@/hooks/useGSAP";
import HowItWorks from "@/components/HowItWorks";
import IndustryResearchSection from "@/components/IndustryResearchSection";
import BeforeAfter from "@/components/BeforeAfter";
import FAQ from "@/components/FAQ";
import ImplementationTimeline from "@/components/ImplementationTimeline";
import { LiveChat } from "@/components/conversion/LiveChat";
import { SocialProofNotifications } from "@/components/conversion/SocialProof";
import { FloatingContactMenu } from "@/components/FloatingContactMenu";
import { PhoneSection } from "@/components/PhoneSection";
import { TimelineEstimatorCTA } from "@/components/TimelineEstimatorCTA";
import { TechnologyPartners } from "@/components/TechnologyPartners";
import { Differentiation } from "@/components/Differentiation";
import { SmartCTAEngine } from "@/components/conversion/SmartCTAEngine";
import { ExitIntentLeadCapture } from "@/components/conversion/ExitIntentLeadCapture";
import { StrategySessionLeadGate } from "@/components/conversion/StrategySessionLeadGate";
import { useEngagementTracking } from "@/hooks/useEngagementTracking";

const Index = () => {
  useGSAP();
  
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const [calculatorROI, setCalculatorROI] = useState<number | undefined>(undefined);
  
  const {
    trackCalculatorCompleted,
  } = useEngagementTracking();

  return (
    <div className="min-h-screen bg-background relative">
        <ParticleFieldEnhanced count={30} interactive />
        <AnimatedBackground variant="mesh" />
        <ScrollGradient />
        
        <Header />
        <HeroSection />
        
        <ParallaxSection speed={0.5}>
          <StatsSection />
        </ParallaxSection>
        
        <IndustryResearchSection />
        
        <Differentiation />
        
        <HowItWorks />
        
        <ParallaxSection speed={0.3}>
          <ImplementationTimeline />
        </ParallaxSection>
        
        <ParallaxSection speed={-0.3}>
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <ROICalculator 
                onCalculationComplete={(roi) => {
                  setCalculatorROI(roi);
                  trackCalculatorCompleted();
                }}
              />
            </div>
          </section>
        </ParallaxSection>
        
        {/* Industry ROI Comparison Tool */}
        <section className="bg-background">
          <ROIIndustryComparison />
        </section>

        <HorizontalGallery />
        
        <section id="services">
          <ServicesShowcase />
        </section>
        
        <BeforeAfter />
        
        <PhoneSection />
        
        <ScrollRevealSection />
        
        <ParallaxSection speed={0.4}>
          <NicheDirectory />
        </ParallaxSection>
        
        <ParallaxSection speed={-0.2}>
          <SocialProof />
        </ParallaxSection>

        <StickyReveal />
        
        <TechnologyPartners />
        
        <FAQ />

        {/* Timeline Estimator CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <TimelineEstimatorCTA variant="banner" location="homepage_pre_newsletter" />
          </div>
        </section>
        
        <NewsletterSection />
        <Footer />
        
        <LiveChat />
        <FloatingContactMenu />
        <SocialProofNotifications />
        
        {/* Smart Lead Funnel Components */}
        <SmartCTAEngine
          calculatorROI={calculatorROI}
          onCTAClick={() => setLeadGateOpen(true)}
        />
        
        <ExitIntentLeadCapture />
        
        <StrategySessionLeadGate
          open={leadGateOpen}
          onOpenChange={setLeadGateOpen}
        />
      </div>
  );
};

export default Index;
