import Header from "@/components/Header";
import HeroSection from "@/components/HeroSectionEnhanced";
import StatsSection from "@/components/StatsSectionEnhanced";
import NicheDirectory from "@/components/NicheDirectoryEnhanced";
import SocialProof from "@/components/SocialProofEnhanced";
import NewsletterSection from "@/components/NewsletterSectionEnhanced";
import Footer from "@/components/FooterEnhanced";
import ROICalculator from "@/components/ROICalculatorEnhanced";
import { ScrollGradient } from "@/components/effects/ScrollGradient";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Scroll-Based Gradient Shifts */}
      <ScrollGradient />
      
      <Header />
      <HeroSection />
      <StatsSection />
      <section className="py-20 bg-muted/30 relative z-10">
        <div className="container mx-auto px-4">
          <ROICalculator />
        </div>
      </section>
      <NicheDirectory />
      <SocialProof />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
