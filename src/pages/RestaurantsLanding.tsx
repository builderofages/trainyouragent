import { motion } from "framer-motion";
import { Utensils, Clock, Users, CheckCircle, ArrowRight, Sparkles, Calendar, Phone, MessageSquare } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { landingPageSEO } from "@/lib/seo-metadata";
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

import { ComparisonTable } from "@/components/conversion/ComparisonTable";
import { UrgencySection } from "@/components/conversion/UrgencySection";
import { TimelineEstimatorCTA } from "@/components/TimelineEstimatorCTA";
import { expandedSolutions } from "@/data/solutionsExpanded";
import { conversions } from "@/lib/tracking";
import { FloatingIsland } from "@/components/effects/FloatingIsland";
import { ParallaxSection } from "@/components/effects/ParallaxSection";
import ImplementationTimeline from "@/components/ImplementationTimeline";
import { useIsMobile } from "@/hooks/use-mobile";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RestaurantsLanding = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", restaurantName: "" });
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
    toast.success("Thanks! We'll be in touch to schedule your free strategy session.");
    window.open(siteConfig.bookingUrl, '_blank');
  };

  const seoData = landingPageSEO.restaurants;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords.join(", ")} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content={seoData.ogType} />
      </Helmet>
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-background to-pink-500/5" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full blur-3xl"
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
                <Utensils className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">For Restaurants & Catering</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Stop Missing Calls.
                <span className="block text-gradient bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  Start Filling Tables
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Automate reservations, catering inquiries, and menu questions 24/7. 
                Your phone lines stay clear, your tables stay full.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={2} suffix="x" />
                  </div>
                  <div className="text-sm text-muted-foreground">More Reservations</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={50} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground">Less Staff Burden</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Booking</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  size="lg"
                  className="text-lg px-8 h-14 gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  onClick={() => {
                    conversions.demoBooked("restaurants");
                    window.open(siteConfig.bookingUrl, '_blank');
                  }}
                >
                  Get Your Free Strategy Session
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">AI Restaurant Host</div>
                    <div className="text-xs text-red-500">● Ready to Serve</div>
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
                      <p className="text-sm">Hi! I'd like to make a reservation for 6 people this Saturday at 7pm</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 p-3 rounded-lg flex-1 border border-red-500/20">
                      <p className="text-sm">Great choice! I'd be happy to help you book a table for 6. Let me check our availability for Saturday at 7pm.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 p-3 rounded-lg flex-1 border border-red-500/20">
                      <p className="text-sm mb-2">Perfect! I have availability at:</p>
                      <ul className="text-xs space-y-1">
                        <li className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>Saturday 7:00 PM (Main Dining)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>Saturday 7:15 PM (Patio)</span>
                        </li>
                      </ul>
                      <p className="text-xs mt-2 text-muted-foreground">Which would you prefer?</p>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI books reservations and answers questions 24/7
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Journey */}
      <PainPointsJourney solution={expandedSolutions.restaurants} />

      <SolutionJourney industry="restaurants" currentStage={1} />


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
              <Sparkles className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">AI-Powered Hospitality</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Digital Maître D'
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Calendar,
                title: "Smart Reservation System",
                description: "AI books tables 24/7, checks real-time availability, handles special requests, and sends confirmation texts automatically.",
                features: ["Real-time availability", "Party size management", "Special requests", "Automated confirmations"]
              },
              {
                icon: MessageSquare,
                title: "Catering Inquiry Handler",
                description: "Capture catering requests at 2 AM. AI collects event details, guest count, menu preferences, and schedules consultations.",
                features: ["Event detail collection", "Menu customization", "Budget qualification", "Auto-scheduling"]
              },
              {
                icon: Utensils,
                title: "Menu Information Assistant",
                description: "Answer allergen questions, explain dishes, suggest pairings. Your AI knows your menu better than most servers.",
                features: ["Allergen information", "Dish descriptions", "Wine pairings", "Daily specials"]
              },
              {
                icon: Phone,
                title: "Multi-Channel Management",
                description: "Phone, web, SMS, social media—AI handles reservations from every channel and syncs them to one calendar.",
                features: ["Phone integration", "Web booking", "SMS reservations", "Social media sync"]
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
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{solution.title}</h3>
                    <p className="text-muted-foreground mb-6">{solution.description}</p>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
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
      <IndustryBenefits solution={expandedSolutions.restaurants} />

      {/* Comparison Table */}
      <ComparisonTable industry="restaurants" />

      {/* ROI Calculator */}
      <section className="py-20 bg-gradient-to-br from-red-500/5 to-pink-500/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <GlassCard className="p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Fill More Tables, Stress Less</h2>
                <p className="text-muted-foreground">Real results from restaurants using AI</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">2x</div>
                  <div className="text-sm text-muted-foreground">More reservations</div>
                  <div className="text-xs text-muted-foreground mt-1">Never miss a call</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">$24K</div>
                  <div className="text-sm text-muted-foreground">Extra catering revenue</div>
                  <div className="text-xs text-muted-foreground mt-1">Per month average</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">50%</div>
                  <div className="text-sm text-muted-foreground">Less staff burden</div>
                  <div className="text-xs text-muted-foreground mt-1">Focus on service</div>
                </div>
              </div>

              <div className="text-center pt-8 border-t border-border">
                <div className="text-2xl font-bold mb-2">
                  ROI Timeline: <span className="text-gradient">2-3 Weeks</span>
                </div>
                <p className="text-muted-foreground">Most restaurants break even in the first month</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <ImplementationTimeline industryId="restaurants" />

      {/* Timeline Estimator CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <TimelineEstimatorCTA 
            industryId="restaurants"
            variant="banner"
            location="restaurants_landing_post_timeline"
          />
        </div>
      </section>

      {/* Urgency Section */}
      <UrgencySection industry="restaurants" costPerHour={150} spotsRemaining={4} />

      {/* Industry Research Data */}
      <IndustryResearchData
        industry="Restaurants"
        gradient="from-red-500/5 to-pink-500/5"
        stats={[
          {
            stat: "40%",
            description: "of restaurant calls go unanswered during peak hours",
            source: "National Restaurant Association Report 2024",
            sourceUrl: "https://www.restaurant.org",
            impact: "Each missed call represents $45-85 in lost revenue. AI answers 100% of calls simultaneously."
          },
          {
            stat: "$18K",
            description: "average monthly revenue from catering inquiries captured after hours",
            source: "Toast Restaurant Technology Report",
            sourceUrl: "https://www.toasttab.com",
            impact: "Catering inquiries often come at night. AI captures every one and qualifies leads automatically."
          },
          {
            stat: "3x",
            description: "more reservations booked with 24/7 AI availability vs phone-only",
            source: "OpenTable Restaurant Industry Data",
            sourceUrl: "https://www.opentable.com",
            impact: "73% of diners prefer booking reservations outside business hours (InsideSales.com)"
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
                <h2 className="text-3xl font-bold mb-4">Start Filling More Tables Today</h2>
                <p className="text-muted-foreground">Free consultation. No credit card required.</p>
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
                      placeholder="your@restaurant.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="restaurantName">Restaurant Name</Label>
                    <Input
                      id="restaurantName"
                      value={formData.restaurantName}
                      onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                      placeholder="Your restaurant"
                    />
                  </div>
                </div>

                <MagneticButton
                  type="submit"
                  size="lg"
                  className="w-full text-lg h-14 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                >
                  Book Discovery Call
                  <ArrowRight className="w-5 h-5 ml-2" />
                </MagneticButton>

                <p className="text-xs text-center text-muted-foreground">
                  No commitments. Cancel anytime. We'll never share your info.
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

export default RestaurantsLanding;
