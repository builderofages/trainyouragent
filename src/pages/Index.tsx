import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import NicheCarousel from "@/components/NicheCarousel";
import SocialProof from "@/components/SocialProof";
import NewsletterSection from "@/components/NewsletterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <StatsSection />
      <NicheCarousel />
      <SocialProof />
      <NewsletterSection />
    </div>
  );
};

export default Index;
