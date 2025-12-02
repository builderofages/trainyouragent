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
import { EmployeeElevationShowcase } from "@/components/solutions/EmployeeElevationShowcase";
import { IndustryResearchSection } from "@/components/solutions/IndustryResearchSection";
import { employeeElevationStories } from "@/data/employeeElevationStories";
import { Dumbbell, Users, TrendingUp, Clock, Trophy, Target, Heart, Zap } from "lucide-react";
import { motion } from "framer-motion";

const GymLanding = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const solution = expandedSolutions.gym;
  const elevationStories = employeeElevationStories.gym || [];
  
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Gym Landing Page Error:', {
          error: error.message,
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      <>
      <Helmet>
        <title>Gym & Fitness AI Voice Agents | TrainYourAgent - 24/7 Membership Sales & Retention</title>
        <meta 
          name="description" 
          content="Stop losing members to poor follow-up. AI voice agents handle membership sales, trial conversions, PT bookings, and retention campaigns 24/7. 3-7 day deployment. Free strategy session." 
        />
        <meta property="og:title" content="Gym & Fitness AI Solutions | TrainYourAgent" />
        <meta property="og:description" content="AI-powered membership sales and retention for gyms, fitness studios, and wellness centers" />
        <meta property="og:image" content="/og-images/gym.jpg" />
        <meta name="keywords" content="gym AI, fitness center automation, membership sales AI, personal training booking, gym lead conversion, member retention AI, fitness studio software" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-mesh">
        <Header />
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto max-w-7xl text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Dumbbell className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Gym & Fitness AI Solutions</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Stop Losing Members to{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Poor Follow-Up
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                67% of trial pass leads never get proper follow-up. AI handles membership sales, 
                trial conversions, and retention campaigns 24/7 while your team focuses on transforming lives.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <button
                  onClick={() => document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                >
                  Calculate Your Revenue Recovery
                </button>
                <button
                  onClick={() => setLeadGateOpen(true)}
                  className="px-8 py-4 border border-border rounded-xl font-semibold hover:bg-accent transition-all"
                >
                  Get Free Strategy Session
                </button>
              </div>
              
              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: Target, stat: "67%", label: "Trial leads never followed up" },
                  { icon: TrendingUp, stat: "31%", label: "Annual member churn rate" },
                  { icon: Clock, stat: "24/7", label: "Lead capture & follow-up" },
                  { icon: Trophy, stat: "3-7 Days", label: "Full deployment" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="p-4 rounded-xl bg-card/50 backdrop-blur border border-border"
                  >
                    <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{item.stat}</div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Industry Challenges Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The Hidden Revenue Killers in Your Gym
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Every day, potential members slip through the cracks while your staff juggles a hundred tasks
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Users,
                  title: "Trial Leads Going Cold",
                  problem: "67% of trial pass visitors never get a follow-up call",
                  cost: "$2,400/month in lost memberships"
                },
                {
                  icon: Clock,
                  title: "Peak Hour Phone Chaos",
                  problem: "5-8pm rush means calls go to voicemail",
                  cost: "40% of inquiries lost to competitors"
                },
                {
                  icon: Heart,
                  title: "Member Churn Crisis",
                  problem: "31% annual churn with no win-back system",
                  cost: "$180K lifetime value walking out the door"
                },
                {
                  icon: Target,
                  title: "PT Booking Friction",
                  problem: "Members want to book PT but can't reach anyone",
                  cost: "$8K/month in lost PT revenue"
                },
                {
                  icon: TrendingUp,
                  title: "Upgrade Opportunities Missed",
                  problem: "No proactive outreach for membership upgrades",
                  cost: "$150/member/year in missed upsells"
                },
                {
                  icon: Zap,
                  title: "Class Fill Rate Issues",
                  problem: "Empty class spots not filled from waitlists",
                  cost: "20% capacity utilization loss"
                }
              ].map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
                >
                  <challenge.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                  <p className="text-muted-foreground mb-3">{challenge.problem}</p>
                  <div className="text-sm font-medium text-destructive">{challenge.cost}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Comprehensive Solutions Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                8 Ways AI Transforms Your Gym Business
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From lead capture to retention, see how AI handles every aspect of member communication 
                while your team delivers exceptional fitness experiences
              </p>
            </div>
            <ComprehensiveSolutionsGrid 
              businessFunctions={comprehensiveSolutions.gym?.businessFunctions || []}
            />
          </div>
        </section>

        {/* Pain Points Journey */}
        {solution && <PainPointsJourney solution={solution} />}
        
        {/* Industry Benefits */}
        {solution && <IndustryBenefits solution={solution} />}
        
        {/* Employee Elevation Stories */}
        {elevationStories.length > 0 && (
          <EmployeeElevationShowcase 
            stories={elevationStories} 
            industry="Gym & Fitness" 
          />
        )}
        
        {/* Industry Research Section */}
        <IndustryResearchSection industry="gym" />
        
        {/* Comparison Table */}
        <ComparisonTable industry="gym" />
          
        {/* ROI Calculator */}
        <div id="roi-calculator">
          <ROICalculatorEnhanced defaultIndustry="gym" />
        </div>
        
        {/* Voice Demo */}
        <VoiceAgentDemo defaultIndustry="gym" />
        
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
          defaultIndustry="Gym & Fitness"
        />
      </div>
    </>
    </ErrorBoundary>
  );
};

export default GymLanding;
