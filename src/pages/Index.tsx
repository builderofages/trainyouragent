import Header from "@/components/Header";
import HeroSection from "@/components/HeroSectionEnhanced";
import StatsSection from "@/components/StatsSectionEnhanced";
import NicheDirectory from "@/components/NicheDirectoryEnhanced";
import SocialProof from "@/components/SocialProofEnhanced";
import NewsletterSection from "@/components/NewsletterSectionEnhanced";
import Footer from "@/components/FooterEnhanced";
import ROICalculator from "@/components/ROICalculatorEnhanced";
import { ParallaxSection } from "@/components/effects/ParallaxSection";
import { ParticleField } from "@/components/effects/ParticleField";
import { ScrollGradient } from "@/components/effects/ScrollGradient";
import { HorizontalGallery } from "@/components/scroll/HorizontalGallery";
import { ScrollRevealSection } from "@/components/scroll/ScrollRevealSection";
import { StickyReveal } from "@/components/scroll/StickyReveal";
import { useGSAP } from "@/hooks/useGSAP";

const Index = () => {
  useGSAP();

  return (
    <div className="min-h-screen bg-background relative">
        <ParticleField count={60} />
        <ScrollGradient />
        
        <Header />
        <HeroSection />
        
        <ParallaxSection speed={0.5}>
          <StatsSection />
        </ParallaxSection>
        
        <ParallaxSection speed={-0.3}>
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <ROICalculator />
            </div>
          </section>
        </ParallaxSection>

        <HorizontalGallery />
        
        <ScrollRevealSection />
        
        <ParallaxSection speed={0.4}>
          <NicheDirectory />
        </ParallaxSection>
        
        <ParallaxSection speed={-0.2}>
          <SocialProof />
        </ParallaxSection>

        <StickyReveal />
        
        <NewsletterSection />
        <Footer />
      </div>
  );
};

export default Index;
