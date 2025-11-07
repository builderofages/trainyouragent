import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import NicheDirectory from "@/components/NicheDirectory";
import SocialProof from "@/components/SocialProof";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import ROICalculator from "@/components/ROICalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <StatsSection />
      <section className="py-20 bg-muted/30">
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
