import { motion } from "framer-motion";
import { Thermometer, Clock, TrendingUp, Calendar, Phone, Shield, DollarSign, ArrowRight, Sparkles, Wrench, AlertCircle } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { AnimatedCounter } from "@/components/enhanced/AnimatedCounter";
import { IndustryResearchData } from "@/components/IndustryResearchData";
import { PainPointsJourney } from "@/components/solutions/PainPointsJourney";
import { IndustryBenefits } from "@/components/solutions/IndustryBenefits";
import { ComparisonTable } from "@/components/conversion/ComparisonTable";
import { UrgencySection } from "@/components/conversion/UrgencySection";
import { expandedSolutions } from "@/data/solutionsExpanded";
import { conversions } from "@/lib/tracking";

const HVACLanding = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "" });
  const solution = expandedSolutions.hvac;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    conversions.formSubmitted("hvac_contact", "hvac");
    toast.success("Thanks! We'll be in touch within 24 hours to discuss your HVAC business needs.");
    window.open(siteConfig.bookingUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-background to-cyan-500/5" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
                <Thermometer className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">For HVAC Contractors</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Turn After-Hours Emergencies
                <span className="block text-gradient bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Into Revenue
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                AI that never misses an emergency call, qualifies leads 24/7, and schedules service appointments—even at 2am on Sunday.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={24} suffix="/7" />
                  </div>
                  <div className="text-sm text-muted-foreground">Call Coverage</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={35} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground">More Bookings</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={2} suffix=" min" />
                  </div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  size="lg"
                  className="text-lg px-8 h-14 gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  onClick={() => {
                    conversions.demoBooked("hvac");
                    window.open(siteConfig.bookingUrl, '_blank');
                  }}
                >
                  Get Your AI Dispatcher
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>
                <MagneticButton
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 glass-card"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Watch Demo
                </MagneticButton>
                <MagneticButton
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 glass-card"
                  onClick={() => {
                    conversions.calculatorCompleted("hvac_roi", 0);
                    document.getElementById('roi')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Calculate Savings
                </MagneticButton>
              </div>
            </motion.div>

            {/* Right: Interactive Demo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">AI HVAC Dispatcher</div>
                    <div className="text-xs text-blue-500">● Available 24/7</div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">My AC stopped working and it's 95 degrees! Can you help today?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-3 rounded-lg flex-1 border border-blue-500/20">
                      <p className="text-sm">Absolutely! We have emergency service available. Let me check our technician schedule. What's your zip code?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">90210</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-3 rounded-lg flex-1 border border-blue-500/20">
                      <p className="text-sm mb-2">Great! I have Mike available at 2:30pm today. Emergency service call is $150, plus repairs. I'm booking you now and sending confirmation via text with Mike's ETA.</p>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI qualifies leads, checks availability, and books service 24/7
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Journey */}
      <PainPointsJourney solution={solution} />

      {/* Industry Benefits */}
      <IndustryBenefits solution={solution} />

      {/* Comparison Table */}
      <ComparisonTable industry="HVAC" />

      {/* ROI Calculator */}
      <section id="roi" className="py-20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <GlassCard className="p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Your Revenue Impact</h2>
                <p className="text-muted-foreground">Based on average HVAC contractor metrics</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">$75K+</div>
                  <div className="text-sm text-muted-foreground">Additional annual revenue</div>
                  <div className="text-xs text-muted-foreground mt-1">From captured after-hours calls</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">35%</div>
                  <div className="text-sm text-muted-foreground">More service bookings</div>
                  <div className="text-xs text-muted-foreground mt-1">24/7 availability</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">15 hrs</div>
                  <div className="text-sm text-muted-foreground">Office time saved/week</div>
                  <div className="text-xs text-muted-foreground mt-1">Focus on actual work</div>
                </div>
              </div>

              <div className="text-center pt-8 border-t border-border">
                <div className="text-2xl font-bold mb-4">
                  Average Payback Period: <span className="text-gradient">18 days</span>
                </div>
                <MagneticButton
                  size="lg"
                  className="gap-2"
                  onClick={() => {
                    conversions.demoBooked("hvac");
                    window.open(siteConfig.bookingUrl, '_blank');
                  }}
                >
                  Book Your Demo
                  <Calendar className="w-5 h-5" />
                </MagneticButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Research Data */}
      <IndustryResearchData 
        industry="HVAC"
        gradient="from-blue-500/5 to-cyan-500/5"
        stats={[
          {
            stat: "42%",
            description: "of after-hours emergency calls go to competitors",
            source: "Service Nation Alliance",
            sourceUrl: "https://www.servicenationalliance.com",
            impact: "24/7 AI coverage captures every emergency opportunity"
          },
          {
            stat: "$75K+",
            description: "average annual revenue lost from missed calls",
            source: "CallRail HVAC Study",
            sourceUrl: "https://www.callrail.com",
            impact: "AI never misses a call, even at 2am"
          },
          {
            stat: "78%",
            description: "of customers expect immediate response for emergencies",
            source: "BrightLocal Consumer Review",
            sourceUrl: "https://www.brightlocal.com",
            impact: "AI responds in under 2 seconds, 24/7"
          }
        ]}
      />

      {/* Urgency Section */}
      <UrgencySection industry="HVAC" costPerHour={120} spotsRemaining={4} />

      {/* Contact Form */}
      <section id="contact-form" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <GlassCard className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Ready to Capture Every Lead?</h2>
                <p className="text-muted-foreground">Get a custom quote for your HVAC business in 24 hours</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="glass-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@hvaccompany.com"
                      className="glass-card"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="glass-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your HVAC company"
                      className="glass-card"
                    />
                  </div>
                </div>

                <MagneticButton
                  type="submit"
                  size="lg"
                  className="w-full text-lg h-14 gap-2"
                >
                  Get My Custom Quote
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>

                <p className="text-xs text-center text-muted-foreground">
                  We'll contact you within 24 hours to discuss your business's specific needs
                </p>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HVACLanding;
