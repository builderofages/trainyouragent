import { motion } from "framer-motion";
import { Home, Clock, DollarSign, Users, TrendingUp, CheckCircle, ArrowRight, Sparkles, Calendar, Shield, Zap } from "lucide-react";
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
import { SolutionJourney } from "@/components/solutions/SolutionJourney";
import { JourneyUpsellCTA as SmartUpsellCTA } from "@/components/conversion/JourneyUpsellCTA";
import { ComparisonTable } from "@/components/conversion/ComparisonTable";
import { UrgencySection } from "@/components/conversion/UrgencySection";
import { expandedSolutions } from "@/data/solutionsExpanded";
import { FloatingIsland } from "@/components/effects/FloatingIsland";
import { ParallaxSection } from "@/components/effects/ParallaxSection";
import { useIsMobile } from "@/hooks/use-mobile";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RoofingLanding = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", serviceArea: "" });
  const isMobile = useIsMobile();
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const demoMessagesRef = useRef<HTMLDivElement>(null);
  const roiStatsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroStatsRef.current) {
        gsap.from(heroStatsRef.current.children, {
          scrollTrigger: {
            trigger: heroStatsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          opacity: 0,
          scale: 0.8,
          stagger: 0.2,
          duration: 0.8,
          ease: "back.out(1.7)"
        });
      }

      if (demoMessagesRef.current) {
        gsap.from(".demo-message", {
          scrollTrigger: {
            trigger: demoMessagesRef.current,
            start: "top 80%"
          },
          opacity: 0,
          y: 30,
          stagger: 0.3,
          duration: 0.6,
          ease: "power3.out"
        });
      }

      if (roiStatsRef.current) {
        gsap.from(roiStatsRef.current.children, {
          scrollTrigger: {
            trigger: roiStatsRef.current,
            start: "top 80%"
          },
          opacity: 0,
          scale: 0.9,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out"
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
    toast.success("Thanks! We'll schedule a discovery call to discuss your needs and timeline.");
    window.open(siteConfig.bookingUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-background to-red-500/5" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
                <Home className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">For Roofing Contractors</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Never Miss Another
                <span className="block text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Storm Lead Again
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Capture emergency leads 24/7, qualify homeowners instantly, and schedule inspections 
                while your competitors sleep. AI that works as hard as you do.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={4} suffix="x" />
                  </div>
                  <div className="text-sm text-muted-foreground">More Qualified Leads</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={50} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground">Faster Response</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Emergency Coverage</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  size="lg"
                  className="text-lg px-8 h-14 gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Your AI Roofer
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">AI Roofing Assistant</div>
                    <div className="text-xs text-orange-500">● Online</div>
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
                      <Home className="w-4 h-4 text-primary" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">Hi, I think I have hail damage on my roof. Can someone come look at it?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-3 rounded-lg flex-1 border border-orange-500/20">
                      <p className="text-sm">Absolutely! We offer free storm damage inspections. I can get you scheduled right away. What's your address so I can check if you're in our service area?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Home className="w-4 h-4 text-primary" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">123 Oak Street, Dallas, TX 75201</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-3 rounded-lg flex-1 border border-orange-500/20">
                      <p className="text-sm mb-2">Perfect! You're in our service area. I have these times available for your free inspection:</p>
                      <ul className="text-xs space-y-1">
                        <li className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>Tomorrow at 9:00 AM</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>Tomorrow at 2:00 PM</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>Thursday at 10:00 AM</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI qualifies leads and books inspections instantly—day or night
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Journey */}
      <PainPointsJourney solution={expandedSolutions.roofing} />

      <SolutionJourney industry="roofing contractors" currentStage={1} />

      <div className="container mx-auto px-4">
        <SmartUpsellCTA currentStage={1} industry="roofing" context="benefits" />
      </div>

      {/* Solutions */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">AI-Powered Solutions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your 24/7 Lead Generation Machine
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Instant Lead Qualification",
                description: "AI asks the right questions to separate serious homeowners from tire-kickers before they hit your calendar.",
                features: ["Insurance verification", "Budget qualification", "Urgency assessment", "Service area check"]
              },
              {
                icon: Calendar,
                title: "Automated Inspection Scheduling",
                description: "Book inspection appointments instantly—even at 2 AM during storm season. Your calendar fills while you sleep.",
                features: ["Real-time availability", "Crew coordination", "Auto reminders", "Rescheduling handling"]
              },
              {
                icon: DollarSign,
                title: "Ballpark Estimates",
                description: "Provide instant rough estimates based on roof size, material, and job complexity. Set expectations early.",
                features: ["Size-based pricing", "Material calculations", "Job complexity factor", "Financing options"]
              },
              {
                icon: Shield,
                title: "Storm Response System",
                description: "Automatically prioritize emergency repairs and insurance claims. Capture every storm lead while competitors scramble.",
                features: ["Emergency detection", "Insurance claims help", "Priority scheduling", "24/7 availability"]
              }
            ].map((solution, index) => {
              const Icon = solution.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-8 h-full hover-lift">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{solution.title}</h3>
                    <p className="text-muted-foreground mb-6">{solution.description}</p>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industry Benefits */}
      <IndustryBenefits solution={expandedSolutions.roofing} />

      {/* Comparison Table */}
      <ComparisonTable industry="roofing" />

      {/* ROI Calculator */}
      <section className="py-20 bg-gradient-to-br from-orange-500/5 to-red-500/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <GlassCard className="p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">The Math That Matters</h2>
                <p className="text-muted-foreground">Real numbers from roofing contractors using AI</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">4x</div>
                  <div className="text-sm text-muted-foreground">More qualified leads</div>
                  <div className="text-xs text-muted-foreground mt-1">vs traditional methods</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">$8,400</div>
                  <div className="text-sm text-muted-foreground">Avg. monthly revenue increase</div>
                  <div className="text-xs text-muted-foreground mt-1">Based on 3 extra jobs/month</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">&lt; 30s</div>
                  <div className="text-sm text-muted-foreground">Response time</div>
                  <div className="text-xs text-muted-foreground mt-1">24/7/365 coverage</div>
                </div>
              </div>

              <div className="text-center pt-8 border-t border-border">
                <div className="text-2xl font-bold mb-2">
                  Typical ROI: <span className="text-gradient">First Job</span>
                </div>
                <p className="text-muted-foreground">One extra roofing job pays for months of service</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Urgency Section */}
      <UrgencySection industry="roofing" costPerHour={250} spotsRemaining={5} />

      {/* Industry Research Data */}
      <IndustryResearchData
        industry="Roofing"
        gradient="from-orange-500/5 to-red-500/5"
        stats={[
          {
            stat: "$12B",
            description: "in uncaptured emergency leads lost annually by roofing contractors",
            source: "IBISWorld Roofing Industry Report 2024",
            sourceUrl: "https://www.ibisworld.com",
            impact: "91% of emergency roofing jobs go to the first contractor who responds (NRCA)"
          },
          {
            stat: "73%",
            description: "of homeowners call multiple roofers after storm damage",
            source: "NRCA Consumer Survey 2024",
            sourceUrl: "https://www.nrca.net",
            impact: "First responder wins 67% of jobs. Speed of response is #1 factor in contractor selection."
          },
          {
            stat: "40%",
            description: "of roofing leads come outside business hours",
            source: "Contractor Magazine Industry Study",
            sourceUrl: "https://www.contractormag.com",
            impact: "AI captures 100% of after-hours calls vs traditional methods missing 62% (CallRail)"
          }
        ]}
      />

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
                <h2 className="text-3xl font-bold mb-4">Start Capturing More Leads Today</h2>
                <p className="text-muted-foreground">Book discovery call. Implementation: 3-7 days based on needs.</p>
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
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="serviceArea">Service Area</Label>
                    <Input
                      id="serviceArea"
                      value={formData.serviceArea}
                      onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                      placeholder="e.g., Dallas-Fort Worth"
                    />
                  </div>
                </div>

                <MagneticButton
                  type="submit"
                  size="lg"
                  className="w-full text-lg h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </MagneticButton>

                <p className="text-xs text-center text-muted-foreground">
                  30-day money-back guarantee. No hidden fees.
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

export default RoofingLanding;
