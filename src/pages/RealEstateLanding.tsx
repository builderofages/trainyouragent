import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSectionEnhanced from "@/components/HeroSectionEnhanced";
import { ComprehensiveSolutionsGrid } from "@/components/solutions/ComprehensiveSolutionsGrid";
import { PainPointsJourney } from "@/components/solutions/PainPointsJourney";
import { IndustryBenefits } from "@/components/solutions/IndustryBenefits";
import { ComparisonTable } from "@/components/conversion/ComparisonTable";
import ROICalculatorEnhanced from "@/components/ROICalculatorEnhanced";
import { VoiceAgentDemo } from "@/components/VoiceAgentDemo";
import { UrgencySection } from "@/components/conversion/UrgencySection";
import FAQ from "@/components/FAQ";
import { StrategySessionLeadGate } from "@/components/conversion/StrategySessionLeadGate";
import { SecurityDisclaimer } from "@/components/SecurityDisclaimer";
import { comprehensiveSolutions } from "@/data/comprehensiveBusinessFunctions";

const RealEstateLanding = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  
  return (
    <>
      <Helmet>
        <title>Real Estate AI Voice Agents | TrainYourAgent - Lead Capture & Showing Coordination</title>
        <meta 
          name="description" 
          content="Capture every lead 24/7 while you close deals. AI qualifies buyers, schedules showings, and nurtures past clients. 3-7 day deployment. Free strategy session." 
        />
        <meta property="og:title" content="Real Estate AI Solutions | TrainYourAgent" />
        <meta property="og:description" content="AI-powered lead capture and client management for real estate professionals" />
        <meta property="og:image" content="/og-images/real-estate.jpg" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-mesh">
        <Header />
        
        {/* Hero Section */}
        <HeroSectionEnhanced
          industry="real_estate"
          headline="Capture Every Lead, 24/7 — AI That Books Showings While You Close Deals"
          subheadline="Never miss an inquiry again. AI qualifies buyers, schedules showings, and nurtures your sphere while you focus on transactions. Deploy in 3-7 days."
          onPrimaryCTA={() => document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' })}
          onSecondaryCTA={() => setLeadGateOpen(true)}
        />
        
        {/* Comprehensive Solutions Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                8 Ways AI Transforms Your Real Estate Business
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From lead capture to transaction coordination, see how AI maximizes your productivity while you focus on what matters: closing deals
              </p>
            </div>
            <ComprehensiveSolutionsGrid 
              businessFunctions={comprehensiveSolutions.real_estate.businessFunctions}
            />
          </div>
        </section>
        
        {/* Pain Points Journey */}
        <PainPointsJourney industry="real_estate" />
        
        {/* Industry Benefits */}
        <IndustryBenefits industry="real_estate" />
        
        {/* Comparison Table */}
        <ComparisonTable industry="real_estate" />
        
        {/* ROI Calculator */}
        <div id="roi-calculator">
          <ROICalculatorEnhanced defaultIndustry="Real Estate" />
        </div>
        
        {/* Voice Demo */}
        <VoiceAgentDemo defaultIndustry="Real Estate" />
        
        {/* Urgency Section */}
        <UrgencySection />
        
        {/* FAQ */}
        <FAQ />
        
        {/* Security Disclaimer */}
        <SecurityDisclaimer variant="compact" />
        
        <Footer />
        
        {/* Lead Gate Modal */}
        <StrategySessionLeadGate 
          open={leadGateOpen}
          onOpenChange={setLeadGateOpen}
          defaultIndustry="Real Estate"
        />
      </div>
    </>
  );
};

export default RealEstateLanding;
