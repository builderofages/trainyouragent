import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, XCircle, AlertCircle, DollarSign, Clock, Users, 
  TrendingUp, Shield, Zap, Sparkles, Phone, Building2 
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StrategySessionLeadGate } from "@/components/conversion/StrategySessionLeadGate";
import { ROIIndustryComparison } from "@/components/ROIIndustryComparison";
import { trackEvent } from "@/lib/tracking";
import { industryComparisonsData } from "@/data/industryComparisonsData";

const Comparisons = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("hvac");

  // Get current industry data
  const industryData = industryComparisonsData[selectedIndustry] || industryComparisonsData.hvac;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Honest Comparison</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
              AI vs Traditional Solutions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We believe in transparency. Here's an honest comparison of AI automation versus traditional alternatives—including when each option makes sense for your business.
            </p>
          </motion.div>

          {/* Industry Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto mb-12"
          >
            <Select value={selectedIndustry} onValueChange={(value) => {
              setSelectedIndustry(value);
              trackEvent('industry_filter_changed', { 
                industry: value, 
                location: 'comparisons_page' 
              });
            }}>
              <SelectTrigger className="w-full h-12 text-base bg-background/50 backdrop-blur-sm border-primary/20">
                <SelectValue placeholder="See comparisons for your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hvac">HVAC & Home Services</SelectItem>
                <SelectItem value="legal">Legal Services</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="restaurants">Restaurants & Hospitality</SelectItem>
                <SelectItem value="accounting">Accounting & Finance</SelectItem>
                <SelectItem value="roofing">Roofing & Construction</SelectItem>
                <SelectItem value="logistics">Logistics & Transportation</SelectItem>
                <SelectItem value="bars">Bars & Nightclubs</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Get industry-specific cost breakdowns and ROI examples
            </p>
          </motion.div>

          {/* Industry Context Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <GlassCard className="p-6 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{industryData.displayName} Industry Insights</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {industryData.peakSeasonFactors}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {industryData.criticalComplianceNeeds.map((need, idx) => (
                      <span key={idx} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {need}
                      </span>
                    ))}
                    <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                      After-hours: {industryData.afterHoursImportance} priority
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Comparison Tabs */}
          <Tabs defaultValue="receptionist" className="mb-16">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="receptionist">AI vs Receptionist</TabsTrigger>
              <TabsTrigger value="callcenter">AI vs Call Center</TabsTrigger>
              <TabsTrigger value="va">AI vs Virtual Assistant</TabsTrigger>
              <TabsTrigger value="generic">Custom vs Generic AI</TabsTrigger>
            </TabsList>

            {/* AI vs Human Receptionist */}
            <TabsContent value="receptionist">
              <div className="space-y-8">
                {/* Comparison Table */}
                <GlassCard className="overflow-hidden">
                  <div className="p-8">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <Users className="w-8 h-8 text-primary" />
                      AI Agent vs Human Receptionist
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-4 px-4 font-semibold">Feature</th>
                            <th className="text-left py-4 px-4 font-semibold text-primary">AI Agent</th>
                            <th className="text-left py-4 px-4 font-semibold">Human Receptionist</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <ComparisonRow 
                            feature="Annual Cost"
                            ai={industryData.aiAgentCost}
                            human={industryData.receptionistCost}
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="Availability"
                            ai={industryData.aiAvailability}
                            human={industryData.receptionistAvailability}
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="Consistency"
                            ai="100% consistent every call"
                            human="Varies by mood, energy, training"
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="Scalability"
                            ai={industryData.aiScalability}
                            human={industryData.receptionistScalability}
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="Setup Time"
                            ai={industryData.setupTime}
                            human="2-4 weeks onboarding minimum"
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="Contract Terms"
                            ai={industryData.contractTerms}
                            human="Full-time employment commitment"
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="Turnover Risk"
                            ai="Zero — no staffing concerns"
                            human="31% annually (BLS data)"
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="Call Volume Capacity"
                            ai="Unlimited simultaneous calls"
                            human="1 call at a time (maybe 2)"
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="Language Support"
                            ai="100+ languages instantly"
                            human={industryData.vaLanguageSupport}
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="CRM Integration"
                            ai={industryData.nativeCRMIntegrations}
                            human="Manual data entry required"
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="Data Entry Accuracy"
                            ai="99%+ (automated CRM sync)"
                            human="85-95% (human error)"
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="Call Recording & Analytics"
                            ai="100% automatic with transcripts"
                            human="Optional, manual review"
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="Empathy & Judgment"
                            ai="Programmed responses"
                            human="Genuine human connection"
                            humanAdvantage
                          />
                          <ComparisonRow 
                            feature="Complex Situations"
                            ai="Follows scripts & logic"
                            human="Can improvise & adapt"
                            humanAdvantage
                          />
                          <ComparisonRow 
                            feature="Face-to-Face Interaction"
                            ai="Not applicable"
                            human="In-person presence"
                            humanAdvantage
                          />
                        </tbody>
                      </table>
                    </div>
                  </div>
                </GlassCard>

                {/* When to Choose */}
                <div className="grid md:grid-cols-2 gap-6">
                  <GlassCard className="p-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Choose AI Agent When:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>You need 24/7 coverage for high call volume</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>After-hours calls are costing you revenue</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>You need instant scalability for seasonal surges</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Budget constraints limit staffing options</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Calls follow predictable scripts (appointments, info)</span>
                      </li>
                    </ul>
                  </GlassCard>

                  <GlassCard className="p-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Choose Human Receptionist When:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
                        <span>Low call volume (1-5 calls per day)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
                        <span>Calls require complex human judgment regularly</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
                        <span>Face-to-face interaction is critical to your business</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
                        <span>Personal touch is paramount to brand identity</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
                        <span>Your team prefers traditional staff interactions</span>
                      </li>
                    </ul>
                  </GlassCard>
                </div>

                {/* Honest Pros & Cons */}
                <HonestProsCons 
                  solution="AI Agent"
                  pros={[
                    "24/7 availability—never miss an opportunity",
                    "Significantly lower long-term cost",
                    "Perfect consistency and data accuracy",
                    "Instant scalability for demand spikes",
                    "No turnover, sick days, or training cycles"
                  ]}
                  cons={[
                    "Initial setup and configuration required",
                    "May lack empathy for highly emotional situations",
                    "Technology learning curve for some users",
                    "Dependent on internet connectivity",
                    "Not ideal for complex multi-step problem-solving"
                  ]}
                />
              </div>
            </TabsContent>

            {/* AI vs Call Center */}
            <TabsContent value="callcenter">
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <Phone className="w-8 h-8 text-primary" />
                  AI Agent vs Outsourced Call Center
                </h2>
                <div className="overflow-x-auto mb-8">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-4 px-4 font-semibold">Factor</th>
                        <th className="text-left py-4 px-4 font-semibold text-primary">AI Agent</th>
                        <th className="text-left py-4 px-4 font-semibold">Call Center</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <ComparisonRow 
                        feature="Cost Structure"
                        ai={`Fixed monthly: ${industryData.aiAgentCost.split('/')[0]}`}
                        human={`${industryData.callCenterCostPerCall} (${industryData.callCenterMonthlyEstimate})`}
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Setup Time"
                        ai={industryData.setupTime}
                        human="2-4 weeks minimum"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Contract Length"
                        ai={industryData.contractTerms}
                        human="Annual contracts typical"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Brand Control"
                        ai="100% your brand voice & values"
                        human="Third-party representing you"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Data Security"
                        ai="Your infrastructure & controls"
                        human="Third-party data handling"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Quality Consistency"
                        ai="Identical every interaction"
                        human="Varies by agent & location"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Integration Depth"
                        ai={industryData.nativeCRMIntegrations}
                        human="Limited integration options"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Response Time"
                        ai={industryData.aiResponseTime}
                        human={industryData.callCenterResponseTime}
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Holiday Coverage"
                        ai="No additional cost"
                        human="Premium holiday rates"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Complex Escalations"
                        ai="Rule-based escalation"
                        human="Human judgment & routing"
                        humanAdvantage
                      />
                    </tbody>
                  </table>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3">Choose AI Agent:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Predictable costs regardless of call volume</li>
                      <li>• Complete brand control and quality assurance</li>
                      <li>• Deep integration with your existing tools</li>
                      <li>• Data security and compliance requirements</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Choose Call Center:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Extremely high unpredictable call volume</li>
                      <li>• Complex multi-step customer service needs</li>
                      <li>• Industry requires human-to-human for compliance</li>
                      <li>• Temporary surge coverage (not long-term solution)</li>
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>

            {/* AI vs Virtual Assistant */}
            <TabsContent value="va">
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-primary" />
                  AI Agent vs Virtual Assistant (VA)
                </h2>
                <div className="overflow-x-auto mb-8">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-4 px-4 font-semibold">Comparison Point</th>
                        <th className="text-left py-4 px-4 font-semibold text-primary">AI Agent</th>
                        <th className="text-left py-4 px-4 font-semibold">Virtual Assistant</th>
                      </tr>
                    </thead>
                     <tbody className="divide-y divide-border">
                      <ComparisonRow 
                        feature="Cost"
                        ai={industryData.aiAgentCost}
                        human={industryData.vaCost}
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Hours Available"
                        ai={industryData.aiAvailability}
                        human={industryData.vaAvailability}
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Scalability"
                        ai={industryData.aiScalability}
                        human="Limited to VA's working hours & capacity"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Setup Time"
                        ai={industryData.setupTime}
                        human="1-2 weeks hiring + onboarding"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Language & Accent"
                        ai="100+ languages, any accent"
                        human={industryData.vaLanguageSupport}
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="CRM Integration"
                        ai={industryData.nativeCRMIntegrations}
                        human="Manual data entry typically"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Task Flexibility"
                        ai="Specialized for calls/chat/scheduling"
                        human="Broad administrative flexibility"
                        humanAdvantage
                      />
                      <ComparisonRow 
                        feature="Learning & Adaptation"
                        ai="Trained on your data & scripts"
                        human="Learns over time with guidance"
                        neutral
                      />
                    </tbody>
                  </table>
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-6">
                  <h3 className="font-bold mb-2">💡 Hybrid Approach Works Best</h3>
                  <p className="text-sm text-muted-foreground">
                    Many businesses use AI for repetitive call handling (appointments, FAQs, lead capture) and VAs for complex tasks requiring human judgment (project management, research, creative work). This combination maximizes efficiency and cost-effectiveness.
                  </p>
                </div>
              </GlassCard>
            </TabsContent>

            {/* Custom vs Generic AI */}
            <TabsContent value="generic">
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-primary" />
                  Custom AI (TrainYourAgent) vs Generic AI Solutions
                </h2>
                <div className="overflow-x-auto mb-8">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-4 px-4 font-semibold">Feature</th>
                        <th className="text-left py-4 px-4 font-semibold text-primary">Custom AI (Us)</th>
                        <th className="text-left py-4 px-4 font-semibold">Generic AI Tools</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <ComparisonRow 
                        feature="Industry Expertise"
                        ai="Trained on industry-specific data"
                        human="General purpose, no specialization"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Integration Depth"
                        ai="Deep native integrations (ServiceTitan, Clio, etc.)"
                        human="Basic API connections only"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Customization"
                        ai="Tailored to your workflows & brand"
                        human="One-size-fits-all templates"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Support Quality"
                        ai="Dedicated account management"
                        human="Community forums & chatbots"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Training Data"
                        ai="Your business data + industry benchmarks"
                        human="Generic web-scraped data"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Compliance"
                        ai="Industry-specific (HIPAA, ABA ethics, etc.)"
                        human="Generic compliance claims"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Pricing"
                        ai="Higher cost for specialization"
                        human="Lower cost for basic features"
                        humanAdvantage
                      />
                      <ComparisonRow 
                        feature="DIY Flexibility"
                        ai="Managed service with customization"
                        human="Full DIY control"
                        neutral
                      />
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                    <h3 className="font-bold text-primary mb-2">🎯 Why Industry-Specific Matters</h3>
                    <p className="text-sm text-muted-foreground">
                      Generic AI tools don't understand that HVAC emergency calls need immediate dispatch, or that legal intake requires conflict checking, or that healthcare scheduling must be HIPAA-compliant. Custom AI trained on your industry's nuances delivers 3-5x better results.
                    </p>
                  </div>

                  <div className="bg-muted/50 border border-border rounded-lg p-6">
                    <h3 className="font-bold mb-2">Generic AI Makes Sense When:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• You have technical expertise to configure and maintain it</li>
                      <li>• Your use case is simple and doesn't require industry knowledge</li>
                      <li>• Budget is extremely constrained ($0-500/mo)</li>
                      <li>• You prefer DIY experimentation over done-for-you service</li>
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 rounded-3xl text-center mb-16"
          >
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Still Not Sure Which Option Is Right?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's have an honest conversation about your specific situation. We'll help you determine if AI automation, a hybrid approach, or traditional staffing makes the most sense for your business.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <MagneticButton
                size="lg"
                className="rounded-full bg-gradient-primary"
                onClick={() => {
                  trackEvent('cta_clicked', { location: 'comparisons_main' });
                  setLeadGateOpen(true);
                }}
              >
                <Clock className="w-5 h-5 mr-2" />
                Schedule Honest Consultation
              </MagneticButton>
              <MagneticButton
                size="lg"
                variant="outline"
                className="rounded-full"
                onClick={() => window.location.href = '/demos'}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Calculate Your Costs
              </MagneticButton>
            </div>
          </motion.div>

          {/* Real Business Scenarios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-center mb-4">
              Real Business Scenarios: Which Solution is Right?
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Compare actual costs across different business types and call volumes
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* HVAC Scenario */}
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">HVAC Company</h3>
                    <p className="text-sm text-muted-foreground">200 calls/week, 24/7 emergencies</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                    <span className="text-sm">AI Agent Cost:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">$2,997/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Human Receptionist:</span>
                    <span className="font-bold">$4,500/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Call Center ($6/call):</span>
                    <span className="font-bold">$5,200/mo</span>
                  </div>
                </div>
                
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                    ✓ Recommended: AI Agent
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Saves $1,500-2,200/mo, handles unlimited concurrent emergency calls, never misses after-hours revenue
                  </p>
                </div>
              </GlassCard>

              {/* Legal Scenario */}
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Law Firm</h3>
                    <p className="text-sm text-muted-foreground">50 intake calls/week, high-value clients</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                    <span className="text-sm">AI Agent Cost:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">$1,997/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Paralegal Intake (20hr/wk):</span>
                    <span className="font-bold">$3,200/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Legal Answering Service:</span>
                    <span className="font-bold">$2,800/mo</span>
                  </div>
                </div>
                
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                    ✓ Recommended: AI Agent
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Saves $800-1,200/mo, pre-qualifies cases 24/7, gathers complete intake before consultation
                  </p>
                </div>
              </GlassCard>

              {/* Healthcare Scenario */}
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Medical Practice</h3>
                    <p className="text-sm text-muted-foreground">150 calls/week, appointment scheduling</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">AI Agent Cost:</span>
                    <span className="font-bold">$1,497/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                    <span className="text-sm">Receptionist (part-time):</span>
                    <span className="font-bold text-green-600 dark:text-green-400">$2,400/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Medical Answering Service:</span>
                    <span className="font-bold">$2,200/mo</span>
                  </div>
                </div>
                
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">
                    ⚠ Consider: Hybrid Approach
                  </p>
                  <p className="text-xs text-muted-foreground">
                    AI handles after-hours + overflow, human receptionist for complex patient needs during business hours
                  </p>
                </div>
              </GlassCard>

              {/* Restaurant Scenario */}
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Restaurant</h3>
                    <p className="text-sm text-muted-foreground">80 reservation calls/week</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                    <span className="text-sm">AI Agent Cost:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">$997/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Host (dedicated phone duty):</span>
                    <span className="font-bold">$3,200/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Reservation Service:</span>
                    <span className="font-bold">$1,800/mo</span>
                  </div>
                </div>
                
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                    ✓ Recommended: AI Agent
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Saves $800-2,200/mo, frees host to focus on in-person guest experience, never misses off-hours bookings
                  </p>
                </div>
              </GlassCard>
            </div>
          </motion.div>

          {/* Cost Over Time Comparison */}
          <GlassCard className="p-8 mb-16 max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold mb-6 text-center">
              Total Cost Comparison Over Time: {industryData.displayName}
            </h3>
            <p className="text-center text-muted-foreground mb-8">
              Based on {industryData.typicalCallVolume}
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  period: "3 Months", 
                  ai: "$8,991", 
                  human: "$16,250", 
                  callCenter: "$19,500",
                  saved: "$7,259-10,509" 
                },
                { 
                  period: "1 Year", 
                  ai: "$35,964", 
                  human: "$65,000", 
                  callCenter: "$78,000",
                  saved: "$29,036-42,036" 
                },
                { 
                  period: "3 Years", 
                  ai: "$107,892", 
                  human: "$195,000", 
                  callCenter: "$234,000",
                  saved: "$87,108-126,108" 
                }
              ].map((data, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20"
                >
                  <div className="text-2xl font-bold mb-4 text-gradient">{data.period}</div>
                  <div className="space-y-3 text-sm mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">AI Agent:</span>
                      <span className="font-semibold text-primary">{data.ai}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Human Staff:</span>
                      <span className="font-semibold">{data.human}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Call Center:</span>
                      <span className="font-semibold">{data.callCenter}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-1">You Save</div>
                    <div className="text-xl font-bold text-green-500">{data.saved}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-muted/30 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Pro Tip:</strong> Savings compound over time. Most businesses break even within the first month and save 60-70% annually vs human staff.
              </p>
            </div>
          </GlassCard>

          {/* Honesty Section - When AI ISN'T Right */}
          <GlassCard className="p-12 mb-16 border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-amber-500/5 max-w-6xl mx-auto">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-16 h-16 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-3">When AI Might NOT Be Your Best Option</h3>
                <p className="text-lg text-muted-foreground">
                  We believe in honesty over sales tactics. AI automation isn't the right solution for every business. Here's when you should consider alternatives:
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: When to Consider Humans */}
              <div className="space-y-4">
                <h4 className="font-bold text-xl flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  Consider Human Staff If:
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <XCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Very Low Call Volume:</strong> If you receive fewer than 5 calls per day, the cost may not justify automation. A part-time receptionist or answering service might be more economical.
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <XCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Complex Emotional Situations:</strong> Crisis counseling, sensitive legal matters, or highly emotional customer situations often benefit from human empathy and judgment that AI can't replicate.
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <XCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>In-Person Reception Critical:</strong> If your brand depends on face-to-face greeting, physical security screening, or handling walk-ins, you need a human presence at the front desk.
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <XCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Physical Tasks Required:</strong> Mail sorting, package handling, office coordination, or physical security tasks can't be automated. AI handles phone calls, not physical work.
                    </div>
                  </li>
                </ul>
              </div>
              
              {/* Right: Hybrid Approach */}
              <div className="space-y-4">
                <h4 className="font-bold text-xl flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Best of Both Worlds: Hybrid Approach
                </h4>
                
                <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-4">
                    Many businesses get the best results by combining AI with human staff:
                  </p>
                  
                  <ul className="space-y-3 text-sm mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>AI handles:</strong> After-hours calls, overflow during busy times, routine inquiries, appointment scheduling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Humans handle:</strong> Complex situations, VIP clients, in-person reception, physical tasks</span>
                    </li>
                  </ul>
                  
                  <div className="p-4 bg-background/50 rounded-lg mb-4">
                    <p className="text-xs font-semibold mb-2">Real Example: Medical Practice</p>
                    <p className="text-xs text-muted-foreground">
                      Front desk receptionist works 9am-5pm for in-person patients. AI handles after-hours calls, appointment reminders, prescription refills, and overflow during lunch rush. Result: Better patient experience + lower costs.
                    </p>
                  </div>
                  
                  <MagneticButton 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      trackEvent('cta_clicked', { location: 'comparisons_hybrid' });
                      setLeadGateOpen(true);
                    }}
                  >
                    Discuss Hybrid Solutions
                  </MagneticButton>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Our Promise:</strong> During your free strategy session, we'll honestly tell you if AI is right for your business—even if that means recommending a different solution. We're here to solve problems, not make unnecessary sales.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ROI Industry Comparison Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Compare ROI Across All Industries
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Not sure which vertical has the most opportunity? See side-by-side projections for all 8 industries based on your business profile.
            </p>
          </motion.div>
          
          <ROIIndustryComparison />
        </div>
      </section>

      <StrategySessionLeadGate 
        open={leadGateOpen}
        onOpenChange={setLeadGateOpen}
      />

      <Footer />
    </div>
  );
};

// Helper Components
const ComparisonRow = ({ 
  feature, 
  ai, 
  human, 
  aiAdvantage, 
  humanAdvantage,
  neutral
}: { 
  feature: string; 
  ai: string; 
  human: string; 
  aiAdvantage?: boolean;
  humanAdvantage?: boolean;
  neutral?: boolean;
}) => (
  <tr>
    <td className="py-4 px-4 font-medium">{feature}</td>
    <td className={`py-4 px-4 ${aiAdvantage ? 'text-primary font-medium' : ''}`}>
      {aiAdvantage && <CheckCircle2 className="w-4 h-4 inline mr-2" />}
      {ai}
    </td>
    <td className={`py-4 px-4 ${humanAdvantage ? 'text-primary font-medium' : ''}`}>
      {humanAdvantage && <CheckCircle2 className="w-4 h-4 inline mr-2" />}
      {human}
    </td>
  </tr>
);

const HonestProsCons = ({ solution, pros, cons }: { solution: string; pros: string[]; cons: string[] }) => (
  <GlassCard className="p-8">
    <h3 className="text-2xl font-bold mb-6">Honest Pros & Cons: {solution}</h3>
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-lg font-semibold">Advantages</h4>
        </div>
        <ul className="space-y-3">
          {pros.map((pro, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{pro}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <XCircle className="w-5 h-5 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-semibold">Limitations</h4>
        </div>
        <ul className="space-y-3">
          {cons.map((con, index) => (
            <li key={index} className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </GlassCard>
);

export default Comparisons;
