import { motion } from "framer-motion";
import { Music, Users, DollarSign, Calendar, Clock, TrendingUp, ArrowRight, Sparkles, Phone, Star, Shield } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
import { FloatingIsland } from "@/components/effects/FloatingIsland";
import { ParallaxSection } from "@/components/effects/ParallaxSection";
import { useIsMobile } from "@/hooks/use-mobile";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BarsNightclubsLanding = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", venue: "" });
  const solution = expandedSolutions.bars;
  const isMobile = useIsMobile();
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const demoMessagesRef = useRef<HTMLDivElement>(null);
  const roiStatsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP scroll animations with higher energy for nightlife
    const ctx = gsap.context(() => {
      // Hero stats animation - more bounce for nightclub vibe
      if (heroStatsRef.current) {
        gsap.from(heroStatsRef.current.children, {
          scrollTrigger: {
            trigger: heroStatsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          opacity: 0,
          scale: 0.7,
          rotation: -10,
          stagger: 0.15,
          duration: 0.9,
          ease: "back.out(2)"
        });
      }

      // Demo messages animation
      if (demoMessagesRef.current) {
        gsap.from(".demo-message", {
          scrollTrigger: {
            trigger: demoMessagesRef.current,
            start: "top 80%"
          },
          opacity: 0,
          x: -30,
          stagger: 0.25,
          duration: 0.7,
          ease: "power3.out"
        });
      }

      // ROI stats animation - pulsing effect for nightclub energy
      if (roiStatsRef.current) {
        gsap.from(roiStatsRef.current.children, {
          scrollTrigger: {
            trigger: roiStatsRef.current,
            start: "top 80%"
          },
          opacity: 0,
          scale: 0.85,
          stagger: 0.12,
          duration: 0.9,
          ease: "elastic.out(1, 0.75)"
        });
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

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
        {!isMobile && (
          <ParallaxSection speed={0.3} className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-background to-cyan-500/5" />
          </ParallaxSection>
        )}
        {!isMobile ? (
          <ParallaxSection speed={0.6} className="absolute top-0 right-0 w-[600px] h-[600px]">
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
              style={{ willChange: 'transform' }}
            />
          </ParallaxSection>
        ) : (
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
          />
        )}

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Music className="w-4 h-4 text-blue-500" />
                </motion.div>
                <span className="text-sm font-medium">For Bars & Nightclubs</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Stop Losing VIP Bookings.
                <span className="block text-gradient bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Start Filling Every Table
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                AI that handles bottle service bookings, guest lists, and event inquiries 24/7—even when your staff can't hear the phone over the music.
              </p>

              <div ref={heroStatsRef} className="grid grid-cols-3 gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  transition={{ duration: 0.2 }}
                  style={{ willChange: 'transform' }}
                >
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={3} suffix="x" />
                  </div>
                  <div className="text-sm text-muted-foreground">VIP Bookings</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.08, rotate: -2 }}
                  transition={{ duration: 0.2 }}
                  style={{ willChange: 'transform' }}
                >
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={50} suffix="K+" />
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  transition={{ duration: 0.2 }}
                  style={{ willChange: 'transform' }}
                >
                  <div className="text-3xl font-bold text-gradient mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Availability</div>
                </motion.div>
              </div>

              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  strength={isMobile ? 12 : 28}
                  size="lg"
                  className="text-lg px-8 h-14 gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-shadow"
                  onClick={() => {
                    conversions.demoBooked("bars");
                    window.open(siteConfig.bookingUrl, '_blank');
                  }}
                >
                  Book Strategy Call
                  <motion.div
                    animate={{ x: [0, 4, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </MagneticButton>
                <MagneticButton
                  strength={isMobile ? 8 : 16}
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 glass-card"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See Demo
                </MagneticButton>
                <MagneticButton
                  strength={isMobile ? 8 : 16}
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
              <FloatingIsland intensity={isMobile ? "low" : "high"} delay={0.4}>
                <GlassCard className="p-8" style={{ willChange: 'transform' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      whileHover={{ rotate: 20, scale: 1.15 }}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
                      style={{ willChange: 'transform' }}
                    >
                      <Music className="w-5 h-5 text-white" />
                    </motion.div>
                  <div>
                    <div className="font-bold">AI VIP Concierge</div>
                    <div className="text-xs text-blue-500">● Available Now</div>
                  </div>
                </div>

                <div ref={demoMessagesRef} className="space-y-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-3 demo-message"
                    whileHover={{ scale: 1.02 }}
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
                    className="flex gap-3 flex-row-reverse demo-message"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-3 rounded-lg flex-1 border border-blue-500/20">
                      <p className="text-sm">Perfect! We have premium VIP tables available. This Saturday features DJ Marcus. Minimum spend is $2,500 for 8 guests. Would you like to reserve?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex gap-3 demo-message"
                    whileHover={{ scale: 1.02 }}
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
                    className="flex gap-3 flex-row-reverse demo-message"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-3 rounded-lg flex-1 border border-blue-500/20">
                      <p className="text-sm">Absolutely! I'll send you our premium bottle menu. I'm booking Table 5, Saturday 10pm under your name. You'll receive confirmation via text with your personal host's contact.</p>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI handles VIP bookings, guest lists, and upsells 24/7
                </div>
              </GlassCard>
              </FloatingIsland>
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
      <section id="roi" className="py-20 relative overflow-hidden">
        {!isMobile && (
          <ParallaxSection speed={0.4} className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
          </ParallaxSection>
        )}
        <div className="container mx-auto px-4 relative z-10">
          <FloatingIsland intensity={isMobile ? "low" : "high"} delay={0.3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <GlassCard className="p-12" style={{ willChange: 'transform' }}>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Your Revenue Impact</h2>
                <p className="text-muted-foreground">Based on average nightlife venue metrics</p>
              </div>

                <div ref={roiStatsRef} className="grid md:grid-cols-3 gap-8 mb-12">
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.08, y: -10, rotate: 2 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    style={{ willChange: 'transform' }}
                  >
                    <div className="text-5xl font-bold text-gradient mb-2">$50K+</div>
                    <div className="text-sm text-muted-foreground">Additional monthly revenue</div>
                    <div className="text-xs text-muted-foreground mt-1">From VIP/bottle bookings</div>
                  </motion.div>
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.08, y: -10, rotate: -2 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    style={{ willChange: 'transform' }}
                  >
                    <div className="text-5xl font-bold text-gradient mb-2">70%</div>
                    <div className="text-sm text-muted-foreground">Less staff phone time</div>
                    <div className="text-xs text-muted-foreground mt-1">Focus on in-venue service</div>
                  </motion.div>
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.08, y: -10, rotate: 2 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    style={{ willChange: 'transform' }}
                  >
                    <div className="text-5xl font-bold text-gradient mb-2">3x</div>
                    <div className="text-sm text-muted-foreground">More event bookings</div>
                    <div className="text-xs text-muted-foreground mt-1">24/7 availability</div>
                  </motion.div>
                </div>

                <div className="text-center pt-8 border-t border-border">
                  <div className="text-2xl font-bold mb-4">
                    Average Payback Period: <span className="text-gradient">10 days</span>
                  </div>
                  <MagneticButton
                    strength={isMobile ? 12 : 28}
                    size="lg"
                    className="gap-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-shadow"
                    onClick={() => {
                      conversions.demoBooked("bars");
                      window.open(siteConfig.bookingUrl, '_blank');
                    }}
                  >
                    Book Your Demo
                    <motion.div
                      animate={{ rotate: [0, 15, 0], scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      <Calendar className="w-5 h-5" />
                    </motion.div>
                  </MagneticButton>
                </div>
              </GlassCard>
            </motion.div>
          </FloatingIsland>
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
