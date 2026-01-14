import { useState, Suspense, lazy } from "react";
import Header from "@/components/Header";
import { HeroSectionPremium } from "@/components/premium/HeroSectionPremium";
import { ProblemSection } from "@/components/premium/ProblemSection";
import { LiveDemoSection } from "@/components/premium/LiveDemoSection";
import { HowItWorksTimeline } from "@/components/premium/HowItWorksTimeline";
import { IndustriesGrid } from "@/components/premium/IndustriesGrid";
import { PricingDark } from "@/components/premium/PricingDark";
import { ROICalculatorPremium } from "@/components/premium/ROICalculatorPremium";
import { BeyondVoice } from "@/components/premium/BeyondVoice";
import { FAQPremium } from "@/components/premium/FAQPremium";
import { FinalCTA } from "@/components/premium/FinalCTA";
import { FooterPremium } from "@/components/premium/FooterPremium";

// Lazy load lead gate for performance
const StrategySessionLeadGate = lazy(() => 
  import("@/components/conversion/StrategySessionLeadGate").then(m => ({ default: m.StrategySessionLeadGate }))
);

const Index = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <HeroSectionPremium />
      <ProblemSection />
      <LiveDemoSection />
      <HowItWorksTimeline />
      <IndustriesGrid />
      <PricingDark />
      <ROICalculatorPremium />
      <BeyondVoice />
      <FAQPremium />
      <FinalCTA />
      <FooterPremium />
      
      <Suspense fallback={null}>
        <StrategySessionLeadGate
          open={leadGateOpen}
          onOpenChange={setLeadGateOpen}
        />
      </Suspense>
    </div>
  );
};

export default Index;
