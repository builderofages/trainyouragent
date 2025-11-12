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

const SolarLanding = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  
  return (
    <>
      <Helmet>
        <title>Solar AI Voice Agents | TrainYourAgent - Lead Education & Project Coordination</title>
        <meta 
          name="description" 
          content="From inquiry to installation. AI educates prospects, schedules consultations, and manages project coordination 24/7. 3-7 day deployment. Free strategy session." 
        />
        <meta property="og:title" content="Solar Energy AI Solutions | TrainYourAgent" />
        <meta property="og:description" content="AI-powered lead qualification and project management for solar installers" />
        <meta property="og:image" content="/og-images/solar.jpg" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-mesh">
        <Header />
        
        {/* Hero Section */}
        <HeroSectionEnhanced
          industry="solar"
          headline="From Inquiry to Installation — AI That Educates, Qualifies, and Closes"
          subheadline="Convert more solar inquiries with instant answers about savings, incentives, and process. AI handles education and qualification 24/7. Deploy in 3-7 days."
          onPrimaryCTA={() => document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' })}
          onSecondaryCTA={() => setLeadGateOpen(true)}
        />
        
        {/* Comprehensive Solutions Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                8 Ways AI Transforms Your Solar Business
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From lead education to project coordination, see how AI accelerates your sales cycle while your team focuses on installations and customer success
              </p>
            </div>
            <ComprehensiveSolutionsGrid 
              businessFunctions={comprehensiveSolutions.solar.businessFunctions}
            />
          </div>
        </section>
        
        {/* Pain Points Journey */}
        <PainPointsJourney industry="solar" />
        
        {/* Industry Benefits */}
        <IndustryBenefits industry="solar" />
        
        {/* Comparison Table */}
        <ComparisonTable industry="solar" />
        
        {/* ROI Calculator */}
        <div id="roi-calculator">
          <ROICalculatorEnhanced defaultIndustry="Solar" />
        </div>
        
        {/* Voice Demo */}
        <VoiceAgentDemo defaultIndustry="Solar" />
        
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
          defaultIndustry="Solar"
        />
      </div>
    </>
  );
};

export default SolarLanding;
