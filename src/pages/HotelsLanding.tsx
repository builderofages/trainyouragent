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

const HotelsLanding = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  
  return (
    <>
      <Helmet>
        <title>Hotel AI Voice Agents | TrainYourAgent - 24/7 Guest Services & Reservations</title>
        <meta 
          name="description" 
          content="Transform guest experience with AI concierge services. Handle reservations, requests, and upsells 24/7. 3-7 day deployment. Free strategy session." 
        />
        <meta property="og:title" content="Hotel & Hospitality AI Solutions | TrainYourAgent" />
        <meta property="og:description" content="AI-powered guest services and reservation management for hotels" />
        <meta property="og:image" content="/og-images/hotels.jpg" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-mesh">
        <Header />
        
        {/* Hero Section */}
        <HeroSectionEnhanced
          industry="hotels"
          headline="Transform Guest Experience with AI-Powered Concierge Services"
          subheadline="Capture every reservation, handle guest requests instantly, and increase upsells while your team delivers white-glove service. Deploy in 3-7 days."
          onPrimaryCTA={() => document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' })}
          onSecondaryCTA={() => setLeadGateOpen(true)}
        />
        
        {/* Comprehensive Solutions Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                8 Ways AI Transforms Your Hotel Operations
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From reservations to concierge services, see how AI enhances every guest touchpoint while your staff focuses on hospitality excellence
              </p>
            </div>
            <ComprehensiveSolutionsGrid 
              businessFunctions={comprehensiveSolutions.hotels.businessFunctions}
            />
          </div>
        </section>
        
        {/* Pain Points Journey */}
        <PainPointsJourney industry="hotels" />
        
        {/* Industry Benefits */}
        <IndustryBenefits industry="hotels" />
        
        {/* Comparison Table */}
        <ComparisonTable industry="hotels" />
        
        {/* ROI Calculator */}
        <div id="roi-calculator">
          <ROICalculatorEnhanced defaultIndustry="Hospitality" />
        </div>
        
        {/* Voice Demo */}
        <VoiceAgentDemo defaultIndustry="Hospitality" />
        
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
          defaultIndustry="Hospitality"
        />
      </div>
    </>
  );
};

export default HotelsLanding;
