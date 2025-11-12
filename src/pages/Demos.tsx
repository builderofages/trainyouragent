import { motion } from "framer-motion";
import { Calculator, TrendingUp, Users, DollarSign, PhoneOff, Bot, Clock, Play, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ROICalculator from "@/components/ROICalculatorEnhanced";
import MissedCallCalculator from "@/components/calculators/MissedCallCalculator";
import AIvsHumanCalculator from "@/components/calculators/AIvsHumanCalculator";
import LeadResponseCalculator from "@/components/calculators/LeadResponseCalculator";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { DemoLeadGate } from "@/components/DemoLeadGate";
import { trackConversion } from "@/lib/tracking";
import { useToast } from "@/hooks/use-toast";

const nicheData = {
  all: {
    title: "All Industries",
    demos: ["Interactive Voice Demo", "Lead Capture Demo", "Appointment Scheduling Demo"],
    calculators: ["roi", "missed-calls", "ai-vs-human", "response-time"]
  },
  hvac: {
    title: "HVAC & Home Services",
    demos: ["Emergency Call Handling", "After-Hours Dispatch", "Service Scheduling"],
    calculators: ["roi", "missed-calls", "ai-vs-human"],
    defaultData: { avgDealValue: 8500, monthlyLeads: 120 }
  },
  accounting: {
    title: "Accounting & Finance",
    demos: ["Client Intake Demo", "Tax Season Overflow", "Appointment Booking"],
    calculators: ["roi", "ai-vs-human", "response-time"],
    defaultData: { avgDealValue: 3200, monthlyLeads: 45 }
  },
  roofing: {
    title: "Roofing & Construction",
    demos: ["Storm Emergency Response", "Estimate Scheduling", "Insurance Claim Intake"],
    calculators: ["roi", "missed-calls", "response-time"],
    defaultData: { avgDealValue: 12400, monthlyLeads: 80 }
  },
  legal: {
    title: "Legal Services",
    demos: ["Case Intake Demo", "Consultation Scheduling", "After-Hours Lead Capture"],
    calculators: ["roi", "missed-calls", "ai-vs-human"],
    defaultData: { avgDealValue: 4500, monthlyLeads: 35 }
  },
  healthcare: {
    title: "Healthcare & Medical",
    demos: ["Appointment Scheduling", "Patient Triage", "Prescription Refills"],
    calculators: ["roi", "missed-calls", "response-time"],
    defaultData: { avgDealValue: 285, monthlyLeads: 250 }
  },
  restaurants: {
    title: "Restaurants & Hospitality",
    demos: ["Reservation System", "Takeout Orders", "Event Bookings"],
    calculators: ["roi", "ai-vs-human", "missed-calls"],
    defaultData: { avgDealValue: 65, monthlyLeads: 500 }
  },
  logistics: {
    title: "Logistics & Transportation",
    demos: ["Quote Requests", "Shipment Tracking", "Load Scheduling"],
    calculators: ["roi", "ai-vs-human", "response-time"],
    defaultData: { avgDealValue: 1850, monthlyLeads: 95 }
  }
};

const Demos = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("roi");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [demoLeadGateOpen, setDemoLeadGateOpen] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<{
    name: string;
    type: 'voice' | 'lead-capture' | 'scheduling';
  } | null>(null);

  const currentNiche = nicheData[selectedNiche as keyof typeof nicheData];

  const handleWatchDemo = (demoName: string, demoType: 'voice' | 'lead-capture' | 'scheduling') => {
    // Check if user already submitted demo lead
    const hasSubmittedDemo = sessionStorage.getItem('demo_lead_submitted');
    
    trackConversion('demo_watch_clicked', {
      demo_name: demoName,
      demo_type: demoType,
      industry: selectedNiche,
    });

    if (hasSubmittedDemo) {
      // User already qualified, open demo directly
      openDemo(demoType, demoName);
    } else {
      // Show lead gate first
      setSelectedDemo({ name: demoName, type: demoType });
      setDemoLeadGateOpen(true);
    }
  };

  const openDemo = (demoType: string, demoName: string) => {
    trackConversion('demo_opened', {
      demo_type: demoType,
      demo_name: demoName,
      industry: selectedNiche,
    });

    toast({
      title: "Demo Feature Coming Soon",
      description: `The ${demoName} will be available shortly. Thank you for your interest!`,
    });
    
    // TODO: Implement actual demo opening logic
    // if (demoType === 'voice') { /* open voice demo */ }
    // if (demoType === 'lead-capture') { /* open lead capture demo */ }
    // if (demoType === 'scheduling') { /* open scheduling demo */ }
  };

  const getDemoType = (demoName: string): 'voice' | 'lead-capture' | 'scheduling' => {
    if (demoName.toLowerCase().includes('voice') || demoName.toLowerCase().includes('call') || demoName.toLowerCase().includes('dispatch')) {
      return 'voice';
    }
    if (demoName.toLowerCase().includes('scheduling') || demoName.toLowerCase().includes('appointment') || demoName.toLowerCase().includes('booking')) {
      return 'scheduling';
    }
    return 'lead-capture';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Interactive Demos & Calculators</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
              Experience AI in Action
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Try interactive demos and calculate your specific ROI with research-backed industry data.
            </p>

            {/* Niche Selector */}
            <div className="max-w-md mx-auto">
              <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                <SelectTrigger className="w-full h-12 text-lg border-2 border-primary/20 bg-background hover:border-primary/40 transition-colors">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-2 border-primary/20">
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="hvac">🏠 HVAC & Home Services</SelectItem>
                  <SelectItem value="accounting">💼 Accounting & Finance</SelectItem>
                  <SelectItem value="roofing">🏗️ Roofing & Construction</SelectItem>
                  <SelectItem value="legal">⚖️ Legal Services</SelectItem>
                  <SelectItem value="healthcare">🏥 Healthcare & Medical</SelectItem>
                  <SelectItem value="restaurants">🍽️ Restaurants & Hospitality</SelectItem>
                  <SelectItem value="logistics">🚚 Logistics & Transportation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Demos Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">
              {currentNiche.title} Demos
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {currentNiche.demos.map((demo, index) => (
                <GlassCard key={index} className="p-6 hover-lift cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Play className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{demo}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        See how AI handles real {selectedNiche === 'all' ? 'customer' : currentNiche.title.toLowerCase()} interactions
                      </p>
                      <MagneticButton 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full"
                        onClick={() => handleWatchDemo(demo, getDemoType(demo))}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Watch Demo
                      </MagneticButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          {/* Calculators Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">
              ROI Calculators for {currentNiche.title}
            </h2>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 h-auto bg-muted/50 p-2 rounded-xl">
                {currentNiche.calculators.includes("roi") && (
                  <TabsTrigger 
                    value="roi" 
                    className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="hidden sm:inline">ROI Calculator</span>
                    <span className="sm:hidden">ROI</span>
                  </TabsTrigger>
                )}
                {currentNiche.calculators.includes("missed-calls") && (
                  <TabsTrigger 
                    value="missed-calls" 
                    className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span className="hidden sm:inline">Missed Calls</span>
                    <span className="sm:hidden">Calls</span>
                  </TabsTrigger>
                )}
                {currentNiche.calculators.includes("ai-vs-human") && (
                  <TabsTrigger 
                    value="ai-vs-human" 
                    className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                  >
                    <Bot className="w-4 h-4" />
                    <span className="hidden sm:inline">AI vs Human</span>
                    <span className="sm:hidden">AI/Human</span>
                  </TabsTrigger>
                )}
                {currentNiche.calculators.includes("response-time") && (
                  <TabsTrigger 
                    value="response-time" 
                    className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                  >
                    <Clock className="w-4 h-4" />
                    <span className="hidden sm:inline">Response Time</span>
                    <span className="sm:hidden">Speed</span>
                  </TabsTrigger>
                )}
              </TabsList>

              {currentNiche.calculators.includes("roi") && (
                <TabsContent value="roi">
                  <ROICalculator />
                </TabsContent>
              )}

              {currentNiche.calculators.includes("missed-calls") && (
                <TabsContent value="missed-calls">
                  <MissedCallCalculator />
                </TabsContent>
              )}

              {currentNiche.calculators.includes("ai-vs-human") && (
                <TabsContent value="ai-vs-human">
                  <AIvsHumanCalculator />
                </TabsContent>
              )}

              {currentNiche.calculators.includes("response-time") && (
                <TabsContent value="response-time">
                  <LeadResponseCalculator />
                </TabsContent>
              )}
            </Tabs>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center p-8 glass-card rounded-2xl"
          >
            <p className="text-sm text-muted-foreground mb-2">
              <strong>All calculations backed by industry research:</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              CallRail 2024 Report • InsideSales.com Study • BLS Data • SHRM Research • Work Institute • Drift CX Report • Gartner
            </p>
          </motion.div>
        </div>
      </section>

      {/* Demo Lead Gate */}
      {selectedDemo && (
        <DemoLeadGate
          isOpen={demoLeadGateOpen}
          onClose={() => {
            setDemoLeadGateOpen(false);
            setSelectedDemo(null);
          }}
          onSuccess={(demoType) => {
            setDemoLeadGateOpen(false);
            openDemo(demoType, selectedDemo.name);
            setSelectedDemo(null);
          }}
          selectedIndustry={selectedNiche !== 'all' ? selectedNiche.toUpperCase() : ''}
          demoType={selectedDemo.type}
          demoName={selectedDemo.name}
        />
      )}

      <Footer />
    </div>
  );
};

export default Demos;
