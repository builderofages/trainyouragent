import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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

const SpasLanding = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const solution = expandedSolutions.spas;
  
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Spas Landing Page Error:', {
          error: error.message,
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      <>
      <Helmet>
        <title>Spa & Wellness AI Voice Agents | TrainYourAgent - 24/7 Booking & Client Management</title>
        <meta 
          name="description" 
          content="Never miss another spa booking. AI voice agents handle appointments, membership sales, and client follow-up 24/7. 3-7 day deployment. Free strategy session available." 
        />
        <meta property="og:title" content="Spa AI Solutions | TrainYourAgent" />
        <meta property="og:description" content="AI-powered booking and client management for spas and wellness centers" />
        <meta property="og:image" content="/og-images/spas.jpg" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-mesh">
        <Header />
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-7xl text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Never Miss Another Booking — AI That Runs Your Front Desk 24/7
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Convert more inquiries, reduce no-shows, and free your team to focus on client experience. Deploy in 3-7 days.
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
                8 Ways AI Transforms Your Spa Business
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From booking to retention, see how AI handles every aspect of client communication while your team delivers exceptional experiences
              </p>
            </div>
            <ComprehensiveSolutionsGrid 
              businessFunctions={comprehensiveSolutions.spas.businessFunctions}
            />
        </div>
      </section>

      <PainPointsJourney solution={solution} />
      <IndustryBenefits solution={solution} />
      
      {/* Comparison Table */}
      <ComparisonTable industry="spas" />
        
        {/* ROI Calculator */}
        <div id="roi-calculator">
          <ROICalculatorEnhanced defaultIndustry="spas" />
        </div>
        
        {/* Voice Demo */}
        <VoiceAgentDemo defaultIndustry="spas" />
        
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
          defaultIndustry="Spas & Wellness"
        />
      </div>
    </>
    </ErrorBoundary>
  );
};

export default SpasLanding;
