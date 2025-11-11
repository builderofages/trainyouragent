import { motion } from "framer-motion";
import { Music, Users, DollarSign, Calendar, Clock, TrendingUp, ArrowRight, Sparkles, Phone, Star, Shield } from "lucide-react";
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

const BarsNightclubsLanding = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", venue: "" });
  const solution = expandedSolutions.bars;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    conversions.formSubmitted("bars_contact", "bars");
    toast.success("Thanks! We'll be in touch within 24 hours to discuss your venue needs.");
    window.open(siteConfig.bookingUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-background to-pink-500/5" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
                <Music className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">For Bars & Nightclubs</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Stop Losing VIP Bookings.
                <span className="block text-gradient bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Start Filling Every Table
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                AI that handles bottle service bookings, guest lists, and event inquiries 24/7—even when your staff can't hear the phone over the music.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={3} suffix="x" />
                  </div>
                  <div className="text-sm text-muted-foreground">VIP Bookings</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={50} suffix="K+" />
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Availability</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  size="lg"
                  className="text-lg px-8 h-14 gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => {
                    conversions.demoBooked("bars");
                    window.open(siteConfig.bookingUrl, '_blank');
                  }}
                >
                  Book Strategy Call
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>
                <MagneticButton
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 glass-card"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See Demo
                </MagneticButton>
                <MagneticButton
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 glass-card"
                  onClick={() => {
                    conversions.calculatorCompleted("bars_roi", 0);
                    document.getElementById('roi')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Calculate ROI
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">AI VIP Concierge</div>
                    <div className="text-xs text-purple-500">● Available Now</div>
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
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">Hi! I want to book a VIP table for Saturday night. Party of 8.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-3 rounded-lg flex-1 border border-purple-500/20">
                      <p className="text-sm">Perfect! We have premium VIP tables available. This Saturday features DJ Marcus. Minimum spend is $2,500 for 8 guests. Would you like to reserve?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">Yes! Can you also arrange bottle service?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-3 rounded-lg flex-1 border border-purple-500/20">
                      <p className="text-sm">Absolutely! I'll send you our premium bottle menu. I'm booking Table 5, Saturday 10pm under your name. You'll receive confirmation via text with your personal host's contact.</p>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI handles VIP bookings, guest lists, and upsells 24/7
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
      <ComparisonTable industry="bars and nightclubs" />

      {/* ROI Calculator */}
      <section id="roi" className="py-20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
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
                <p className="text-muted-foreground">Based on average nightlife venue metrics</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">$50K+</div>
                  <div className="text-sm text-muted-foreground">Additional monthly revenue</div>
                  <div className="text-xs text-muted-foreground mt-1">From VIP/bottle bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">70%</div>
                  <div className="text-sm text-muted-foreground">Less staff phone time</div>
                  <div className="text-xs text-muted-foreground mt-1">Focus on in-venue service</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">3x</div>
                  <div className="text-sm text-muted-foreground">More event bookings</div>
                  <div className="text-xs text-muted-foreground mt-1">24/7 availability</div>
                </div>
              </div>

              <div className="text-center pt-8 border-t border-border">
                <div className="text-2xl font-bold mb-4">
                  Average Payback Period: <span className="text-gradient">10 days</span>
                </div>
                <MagneticButton
                  size="lg"
                  className="gap-2"
                  onClick={() => {
                    conversions.demoBooked("bars");
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
        industry="bars and nightclubs"
        gradient="from-purple-500/5 to-pink-500/5"
        stats={[
          {
            stat: "75%",
            description: "of nightclub revenue comes from VIP table and bottle service",
            source: "Nightclub & Bar Magazine",
            sourceUrl: "https://www.nightclub.com",
            impact: "Missing VIP bookings directly impacts your bottom line"
          },
          {
            stat: "$200K+",
            description: "average annual loss from missed event booking inquiries",
            source: "IAVM",
            sourceUrl: "https://www.iavm.org",
            impact: "24/7 availability captures every event opportunity"
          },
          {
            stat: "62%",
            description: "of weekend reservation calls go unanswered during peak hours",
            source: "Hospitality Tech Study",
            sourceUrl: "https://hospitalitytech.com",
            impact: "AI handles unlimited simultaneous calls"
          }
        ]}
      />

      {/* Urgency Section */}
      <UrgencySection industry="bars and nightclubs" costPerHour={150} spotsRemaining={2} />

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
                <h2 className="text-3xl font-bold mb-4">Ready to Fill Every VIP Table?</h2>
                <p className="text-muted-foreground">Get a custom quote for your venue in 24 hours</p>
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
                      placeholder="you@venue.com"
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
                    <Label htmlFor="venue">Venue Name *</Label>
                    <Input
                      id="venue"
                      required
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="Your venue"
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
                  We'll contact you within 24 hours to discuss your venue's specific needs
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

export default BarsNightclubsLanding;
