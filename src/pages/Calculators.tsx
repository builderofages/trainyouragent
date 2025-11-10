import { motion } from "framer-motion";
import { Calculator, TrendingUp, Users, DollarSign, PhoneOff, Bot, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ROICalculator from "@/components/ROICalculatorEnhanced";
import MissedCallCalculator from "@/components/calculators/MissedCallCalculator";
import AIvsHumanCalculator from "@/components/calculators/AIvsHumanCalculator";
import LeadResponseCalculator from "@/components/calculators/LeadResponseCalculator";

const Calculators = () => {
  const [activeTab, setActiveTab] = useState("roi");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">AI ROI Calculators</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Calculate your specific opportunity cost and ROI with research-backed data from industry studies.
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 h-auto">
              <TabsTrigger value="roi" className="flex items-center gap-2 py-3">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">ROI Calculator</span>
                <span className="sm:hidden">ROI</span>
              </TabsTrigger>
              <TabsTrigger value="missed-calls" className="flex items-center gap-2 py-3">
                <PhoneOff className="w-4 h-4" />
                <span className="hidden sm:inline">Missed Calls</span>
                <span className="sm:hidden">Calls</span>
              </TabsTrigger>
              <TabsTrigger value="ai-vs-human" className="flex items-center gap-2 py-3">
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">AI vs Human</span>
                <span className="sm:hidden">AI/Human</span>
              </TabsTrigger>
              <TabsTrigger value="response-time" className="flex items-center gap-2 py-3">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Response Time</span>
                <span className="sm:hidden">Speed</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="roi">
              <ROICalculator />
            </TabsContent>

            <TabsContent value="missed-calls">
              <MissedCallCalculator />
            </TabsContent>

            <TabsContent value="ai-vs-human">
              <AIvsHumanCalculator />
            </TabsContent>

            <TabsContent value="response-time">
              <LeadResponseCalculator />
            </TabsContent>
          </Tabs>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center p-6 bg-muted/50 rounded-lg"
          >
            <p className="text-sm text-muted-foreground mb-2">
              <strong>All calculators backed by industry research:</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              CallRail 2024 Report • InsideSales.com Study • BLS Data • SHRM Research • Work Institute • Drift CX Report
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Calculators;
