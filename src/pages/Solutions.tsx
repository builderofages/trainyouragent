import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Wrench, Calculator, Home, Scale, Heart, Truck, 
  UtensilsCrossed, Briefcase, ArrowRight, TrendingUp 
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { PremiumIcon, industryIcons } from "@/components/icons/PremiumIconSystem";
import { StrategySessionLeadGate } from "@/components/conversion/StrategySessionLeadGate";
import { CustomSolutionsCallout } from "@/components/CustomSolutionsCallout";
import { nicheSolutions } from "@/data/solutions";
import { expandedSolutions } from "@/data/solutionsExpanded";
import { FloatingIsland } from "@/components/effects/FloatingIsland";
import { PainPointsJourney } from "@/components/solutions/PainPointsJourney";
import { IndustryBenefits } from "@/components/solutions/IndustryBenefits";

const nicheOptions = [
  { id: "hvac", name: "HVAC & Home Services", icon: Wrench, gradient: "gradient-hvac" },
  { id: "accounting", name: "Accounting & Finance", icon: Calculator, gradient: "gradient-accounting" },
  { id: "roofing", name: "Roofing & Construction", icon: Home, gradient: "gradient-roofing" },
  { id: "legal", name: "Legal Services", icon: Scale, gradient: "gradient-legal" },
  { id: "healthcare", name: "Healthcare & Medical", icon: Heart, gradient: "gradient-healthcare" },
  { id: "logistics", name: "Logistics & Transportation", icon: Truck, gradient: "gradient-logistics" },
  { id: "restaurants", name: "Restaurants & Hospitality", icon: UtensilsCrossed, gradient: "gradient-restaurants" },
  { id: "general", name: "General Business", icon: Briefcase, gradient: "from-primary to-accent" },
];

const Solutions = () => {
  const [selectedNiche, setSelectedNiche] = useState("hvac");
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const solution = nicheSolutions[selectedNiche];
  const expandedSolution = expandedSolutions[selectedNiche];
  const selectedOption = nicheOptions.find(n => n.id === selectedNiche);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-[0.03]" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-hero mb-6">
              AI Solutions Built for{" "}
              <span className="text-gradient-premium">Your Industry</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Select your industry to see tailored AI solutions, ROI calculators, and integrations
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industry Selector */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {nicheOptions.map((niche, index) => (
              <motion.div
                key={niche.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FloatingIsland delay={index * 0.05} intensity="low">
                  <GlassCard
                    onClick={() => setSelectedNiche(niche.id)}
                    className={`cursor-pointer transition-all duration-300 hover-lift ${
                      selectedNiche === niche.id
                        ? "border-2 border-primary shadow-glow-intense border-gradient"
                        : "border border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center p-6 relative">
                      <motion.div
                        animate={selectedNiche === niche.id ? {
                          scale: [1, 1.05, 1],
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <PremiumIcon
                          icon={niche.icon}
                          style={industryIcons[niche.id as keyof typeof industryIcons]?.style || "hexagon"}
                          gradient={industryIcons[niche.id as keyof typeof industryIcons]?.gradient}
                          size="lg"
                          animate={selectedNiche === niche.id}
                        />
                      </motion.div>
                      <h3 className={`font-bold text-base mt-4 ${selectedNiche === niche.id ? "text-gradient-premium" : ""}`}>
                        {niche.name}
                      </h3>
                    </div>
                  </GlassCard>
                </FloatingIsland>
              </motion.div>
            ))}
          </div>

          {/* Selected Solution Display */}
          <motion.div
            key={selectedNiche}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            {/* Industry Overview */}
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 flex items-center justify-center gap-3">
                {selectedOption && <selectedOption.icon className="w-10 h-10 text-primary" />}
                {solution.name}
              </h2>
            </div>

            {/* Key Challenges */}
            <GlassCard hover className="p-8">
              <h3 className="text-2xl font-bold mb-6">Key Industry Challenges</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {solution.challenges.map((challenge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20"
                  >
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{challenge}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* AI Solutions */}
            <div>
              <h3 className="text-3xl font-bold mb-8 text-center">Our AI Solutions</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {solution.solutions.map((sol, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard hover className="p-6 h-full">
                      <div className={`h-1 w-16 bg-gradient-to-r ${selectedOption?.gradient} rounded-full mb-4`} />
                      <h4 className="text-xl font-bold mb-3">{sol.title}</h4>
                      <p className="text-muted-foreground mb-4">{sol.description}</p>
                      <ul className="space-y-2">
                        {sol.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-2 text-sm">
                            <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ROI Preview */}
            <GlassCard hover className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold">Industry ROI Benchmarks</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-foreground mb-2">
                    ${solution.roi.avgDealValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Deal Value</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-foreground mb-2">
                    {solution.roi.monthlyLeads}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Leads (Typical)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-foreground mb-2">
                    {solution.roi.conversionRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">Conversion Rate</div>
                </div>
              </div>
              <div className="text-center">
                <MagneticButton
                  onClick={() => window.location.href = `/demos?niche=${selectedNiche}`}
                  className="bg-gradient-primary"
                >
                  Calculate Your ROI
                </MagneticButton>
              </div>
            </GlassCard>

            {/* Integrations */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">Industry-Specific Integrations</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {solution.integrations.map((integration, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-6 py-3 glass-card border border-glass-border rounded-lg font-medium"
                  >
                    {integration}
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>

          {/* Expanded Pain Points Journey */}
          {expandedSolution && (
            <>
              <PainPointsJourney solution={expandedSolution} />
              <IndustryBenefits solution={expandedSolution} />
            </>
          )}

          {/* Final CTA */}
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your {solution.name}?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Schedule a strategy call to see how AI can solve your specific challenges
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton
                onClick={() => setLeadGateOpen(true)}
                className="bg-gradient-primary"
                size="lg"
              >
                Get Your Free Strategy Session
              </MagneticButton>
              <MagneticButton
                onClick={() => window.location.href = `/demos?niche=${selectedNiche}`}
                variant="outline"
                size="lg"
              >
                See Demos & Calculators
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Solutions Callout */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <CustomSolutionsCallout 
            variant="banner"
            onContactClick={() => setLeadGateOpen(true)}
          />
        </div>
      </section>

      <StrategySessionLeadGate 
        open={leadGateOpen} 
        onOpenChange={setLeadGateOpen}
        defaultIndustry={selectedNiche.toUpperCase()}
      />

      <Footer />
    </div>
  );
};

export default Solutions;
