import { useState } from "react";
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
import { StrategySessionLeadGate } from "@/components/conversion/StrategySessionLeadGate";

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
      
      <StrategySessionLeadGate
        open={leadGateOpen}
        onOpenChange={setLeadGateOpen}
      />
    </div>
  );
};

export default Index;
