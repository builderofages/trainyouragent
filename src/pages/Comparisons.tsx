import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, Phone, Clock, DollarSign, TrendingUp, CheckCircle2, 
  XCircle, Sparkles, Building2, Zap, Shield, Database
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "@/config/site";

const Comparisons = () => {
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
                            ai="$997-2,997/mo ($12K-36K/yr)"
                            human="$35K-45K + benefits ($50K-65K)"
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="Availability"
                            ai="24/7/365 — never sleeps"
                            human="40 hrs/week + PTO & sick days"
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
                            ai="Instant — unlimited concurrent calls"
                            human="Hire & train new staff (weeks)"
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="Training Time"
                            ai="One-time setup (1-2 days)"
                            human="2-4 weeks onboarding minimum"
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
                            human="Usually 1-2 languages"
                            aiAdvantage
                          />
                          <ComparisonRow 
                            feature="Data Entry Accuracy"
                            ai="99%+ (automated CRM sync)"
                            human="85-95% (human error)"
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
                        ai="Fixed monthly: $997-2,997"
                        human="$3-8 per call (unpredictable)"
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
                        ai="Direct CRM & tool integration"
                        human="Limited integration options"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Response Time"
                        ai="Instant (< 1 second)"
                        human="Queue times + transfers"
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
                        ai="$997-2,997/mo (unlimited)"
                        human="$15-25/hr ($2,400-4,000/mo for 160hrs)"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Hours Available"
                        ai="24/7/365"
                        human="Limited hours + time zones"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Scalability"
                        ai="Instant unlimited capacity"
                        human="One person at a time"
                        aiAdvantage
                      />
                      <ComparisonRow 
                        feature="Language & Accent"
                        ai="100+ languages, any accent"
                        human="Depends on individual VA"
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
            className="glass-card p-12 rounded-3xl text-center"
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
                onClick={() => window.open(siteConfig.bookingUrl, '_blank')}
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
        </div>
      </section>

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
