import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ComprehensiveSolutionsGrid } from "@/components/solutions/ComprehensiveSolutionsGrid";
import { ComparisonTable } from "@/components/conversion/ComparisonTable";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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

const AutomotiveLanding = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const solution = expandedSolutions.automotive;
  
  return (
    <>
      <Helmet>
        <title>Automotive AI Voice Agents | TrainYourAgent - Service Scheduling & Customer Retention</title>
        <meta 
          name="description" 
          content="Turn every inquiry into service revenue. AI handles appointments, maintenance reminders, and parts inquiries 24/7. 3-7 day deployment. Free strategy session." 
        />
        <meta property="og:title" content="Automotive Dealership AI Solutions | TrainYourAgent" />
        <meta property="og:description" content="AI-powered service scheduling and customer retention for dealerships and repair shops" />
        <meta property="og:image" content="/og-images/automotive.jpg" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-mesh">
        <Header />
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-7xl text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Turn Every Inquiry Into Service Revenue — AI That Never Sleeps
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Capture service appointments, handle parts inquiries, and drive retention with proactive maintenance reminders. Deploy in 3-7 days.
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
                8 Ways AI Transforms Your Automotive Business
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From service appointments to parts sales, see how AI drives revenue while your advisors focus on in-shop customer experience
              </p>
            </div>
            <ComprehensiveSolutionsGrid 
              businessFunctions={comprehensiveSolutions.automotive.businessFunctions}
            />
        </div>
      </section>

      <PainPointsJourney solution={solution} />
      <IndustryBenefits solution={solution} />
      
      {/* Comparison Table */}
      <ComparisonTable industry="automotive" />
        
        {/* ROI Calculator */}
        <div id="roi-calculator">
          <ROICalculatorEnhanced defaultIndustry="automotive" />
        </div>
        
        {/* Voice Demo */}
        <VoiceAgentDemo defaultIndustry="automotive" />
        
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
          defaultIndustry="Automotive Services"
        />
      </div>
    </>
  );
};

export default AutomotiveLanding;
