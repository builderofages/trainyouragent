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

const AutomotiveLanding = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  
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
        <HeroSectionEnhanced
          industry="automotive"
          headline="Turn Every Inquiry Into Service Revenue — AI That Never Sleeps"
          subheadline="Capture service appointments, handle parts inquiries, and drive retention with proactive maintenance reminders. Deploy in 3-7 days."
          onPrimaryCTA={() => document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' })}
          onSecondaryCTA={() => setLeadGateOpen(true)}
        />
        
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
        
        {/* Pain Points Journey */}
        <PainPointsJourney industry="automotive" />
        
        {/* Industry Benefits */}
        <IndustryBenefits industry="automotive" />
        
        {/* Comparison Table */}
        <ComparisonTable industry="automotive" />
        
        {/* ROI Calculator */}
        <div id="roi-calculator">
          <ROICalculatorEnhanced defaultIndustry="Automotive" />
        </div>
        
        {/* Voice Demo */}
        <VoiceAgentDemo defaultIndustry="Automotive" />
        
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
          defaultIndustry="Automotive"
        />
      </div>
    </>
  );
};

export default AutomotiveLanding;
