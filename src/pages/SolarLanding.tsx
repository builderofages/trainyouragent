import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ComprehensiveSolutionsGrid } from "@/components/solutions/ComprehensiveSolutionsGrid";
import { ComparisonTable } from "@/components/conversion/ComparisonTable";
import ROICalculatorEnhanced from "@/components/ROICalculatorEnhanced";
import { VoiceAgentDemo } from "@/components/VoiceAgentDemo";
import { UrgencySection } from "@/components/conversion/UrgencySection";
import FAQ from "@/components/FAQ";
import { StrategySessionLeadGate } from "@/components/conversion/StrategySessionLeadGate";
import { SecurityDisclaimer } from "@/components/SecurityDisclaimer";
import { comprehensiveSolutions } from "@/data/comprehensiveBusinessFunctions";
import { expandedSolutions } from "@/data/solutionsExpanded";
import { PainPointsJourney } from "@/components/solutions/PainPointsJourney";
import { IndustryBenefits } from "@/components/solutions/IndustryBenefits";

const SolarLanding = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const solution = expandedSolutions.solar;
  
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
        <section className="relative pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-7xl text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Turn Solar Inquiries Into Signed Contracts — AI That Educates & Closes
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Qualify homeowners, explain incentives, schedule site assessments, and drive project completion 24/7. Deploy in 3-7 days.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90"
              >
                Calculate Savings
              </button>
              <button
                onClick={() => setLeadGateOpen(true)}
                className="px-8 py-4 border border-border rounded-lg font-semibold hover:bg-accent"
              >
                Get Free Strategy Session
              </button>
            </div>
          </div>
        </section>
        
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

      <PainPointsJourney solution={solution} />
      <IndustryBenefits solution={solution} />
      
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
