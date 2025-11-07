import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import NicheDirectory from "@/components/NicheDirectory";
import SocialProof from "@/components/SocialProof";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <StatsSection />
      <NicheDirectory />
      <SocialProof />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
