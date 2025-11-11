import Header from "@/components/Header";
import HeroSection from "@/components/HeroSectionEnhanced";
import StatsSection from "@/components/StatsSectionEnhanced";
import ServicesShowcase from "@/components/ServicesShowcase";
import NicheDirectory from "@/components/NicheDirectoryEnhanced";
import SocialProof from "@/components/SocialProofEnhanced";
import NewsletterSection from "@/components/NewsletterSectionEnhanced";
import Footer from "@/components/FooterEnhanced";
import ROICalculator from "@/components/ROICalculatorEnhanced";
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
import StickyCTA from "@/components/StickyCTA";
import { ExitPopup } from "@/components/conversion/ExitPopup";
import { LiveChat } from "@/components/conversion/LiveChat";
import { SocialProofNotifications } from "@/components/conversion/SocialProof";
import { SmartUpsellCTA } from "@/components/conversion/SmartUpsellCTA";
import { FloatingContactMenu } from "@/components/FloatingContactMenu";
import { PhoneSection } from "@/components/PhoneSection";

const Index = () => {
  useGSAP();

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
        
        <HowItWorks />
        
        <ParallaxSection speed={0.3}>
          <ImplementationTimeline />
        </ParallaxSection>
        
        <ParallaxSection speed={-0.3}>
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <ROICalculator />
            </div>
          </section>
        </ParallaxSection>

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
        
        <FAQ />
        
        <NewsletterSection />
        <Footer />
        
        <StickyCTA />
        <ExitPopup />
        <LiveChat />
        <SmartUpsellCTA />
        <FloatingContactMenu />
        <SocialProofNotifications />
      </div>
  );
};

export default Index;
