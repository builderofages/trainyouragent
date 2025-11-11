import { motion } from "framer-motion";
import { Heart, Clock, Users, CheckCircle, ArrowRight, Sparkles, Calendar, Phone, FileText } from "lucide-react";
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

const HealthcareLanding = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", practiceType: "" });
  const isMobile = useIsMobile();
  const [performanceTier, setPerformanceTier] = useState<'high' | 'medium' | 'low'>('high');
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const demoMessagesRef = useRef<HTMLDivElement>(null);
  const roiStatsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        setPerformanceTier('low');
      } else if ('connection' in navigator && (navigator as any).connection?.effectiveType === '3g') {
        setPerformanceTier('medium');
      }
    }
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-background to-rose-500/5" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-3xl"
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
                <Heart className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-medium">For Healthcare Practices</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Focus on Patients.
                <span className="block text-gradient bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  Not Paperwork
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Automate patient intake, appointment scheduling, and follow-up reminders. 
                Reduce no-shows by 80% while freeing your staff to focus on care.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={80} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground">Fewer No-Shows</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={5} suffix="x" />
                  </div>
                  <div className="text-sm text-muted-foreground">Faster Intake</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Patient Support</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  size="lg"
                  className="text-lg px-8 h-14 gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                  onClick={() => {
                    conversions.demoBooked("healthcare");
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">AI Patient Assistant</div>
                    <div className="text-xs text-pink-500">● Always Available</div>
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
                      <p className="text-sm">Hi, I'd like to schedule a physical exam. I'm a new patient.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 p-3 rounded-lg flex-1 border border-pink-500/20">
                      <p className="text-sm">Welcome! I can help you schedule your physical exam. Since you're a new patient, I'll need to collect some information first. Do you have your insurance card handy?</p>
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
                      <p className="text-sm">Yes, I have Blue Cross Blue Shield</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 p-3 rounded-lg flex-1 border border-pink-500/20">
                      <p className="text-sm mb-2">Perfect! We accept BCBS. I'll send you a secure link to upload your insurance card and complete your medical history. Then I'll show you available appointment times.</p>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI handles intake, insurance, and scheduling automatically
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Journey */}
      <PainPointsJourney solution={expandedSolutions.healthcare} />

      <SolutionJourney industry="healthcare practices" currentStage={1} />

      <div className="container mx-auto px-4">
        <SmartUpsellCTA currentStage={1} industry="healthcare" context="benefits" />
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
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium">HIPAA-Compliant AI</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Digital Front Desk Staff
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: FileText,
                title: "Digital Patient Intake",
                description: "Patients complete medical history, insurance, and consent forms on their phone before arrival. Zero clipboards.",
                features: ["Mobile-friendly forms", "E-signature support", "Insurance verification", "Medical history"]
              },
              {
                icon: Calendar,
                title: "Smart Appointment Management",
                description: "AI books appointments 24/7, sends automated reminders, and handles rescheduling. Reduce no-shows by 80%.",
                features: ["Online scheduling", "SMS/email reminders", "Calendar sync", "Waitlist management"]
              },
              {
                icon: Phone,
                title: "24/7 Virtual Receptionist",
                description: "Answer common questions, handle prescription refill requests, and triage urgent matters automatically.",
                features: ["FAQs automation", "Refill requests", "Urgent triage", "Multi-language"]
              },
              {
                icon: Users,
                title: "Follow-Up Automation",
                description: "Automated post-visit surveys, medication reminders, and preventive care notifications keep patients engaged.",
                features: ["Post-visit surveys", "Medication reminders", "Wellness checks", "Review requests"]
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
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{solution.title}</h3>
                    <p className="text-muted-foreground mb-6">{solution.description}</p>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-pink-500 flex-shrink-0" />
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
      <IndustryBenefits solution={expandedSolutions.healthcare} />

      {/* Comparison Table */}
      <ComparisonTable industry="healthcare" />

      {/* ROI Calculator */}
      <section className="py-20 bg-gradient-to-br from-pink-500/5 to-rose-500/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <GlassCard className="p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">The Numbers Speak for Themselves</h2>
                <p className="text-muted-foreground">Real savings from healthcare practices using AI</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">$8,200</div>
                  <div className="text-sm text-muted-foreground">Saved per month</div>
                  <div className="text-xs text-muted-foreground mt-1">Reduced admin costs</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">80%</div>
                  <div className="text-sm text-muted-foreground">Fewer no-shows</div>
                  <div className="text-xs text-muted-foreground mt-1">Automated reminders</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">5x</div>
                  <div className="text-sm text-muted-foreground">Faster intake</div>
                  <div className="text-xs text-muted-foreground mt-1">Digital forms</div>
                </div>
              </div>

              <div className="text-center pt-8 border-t border-border">
                <div className="text-2xl font-bold mb-2">
                  Typical ROI: <span className="text-gradient">First Month</span>
                </div>
                <p className="text-muted-foreground">Most practices break even in weeks, not months</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <ImplementationTimeline industryId="healthcare" />

      {/* Timeline Estimator CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <TimelineEstimatorCTA 
            industryId="healthcare"
            variant="banner"
            location="healthcare_landing_post_timeline"
          />
        </div>
      </section>

      {/* Urgency Section */}
      <UrgencySection industry="healthcare" costPerHour={200} spotsRemaining={4} />

      {/* Industry Research Data */}
      <IndustryResearchData
        industry="Healthcare"
        gradient="from-pink-500/5 to-rose-500/5"
        stats={[
          {
            stat: "82%",
            description: "of patients want 24/7 appointment booking capability",
            source: "HIMSS Healthcare Technology Report 2024",
            sourceUrl: "https://www.himss.org",
            impact: "AI appointment scheduling improves fill rates by 34% and reduces no-shows by 47%"
          },
          {
            stat: "$12K",
            description: "average monthly revenue increase from reduced no-shows alone",
            source: "MGMA Practice Management Study",
            sourceUrl: "https://www.mgma.com",
            impact: "No-show rates drop from 22% to 4% with AI-powered appointment reminders and scheduling"
          },
          {
            stat: "30%",
            description: "more patients seen per day with AI-automated intake processes",
            source: "Becker's Hospital Review 2024",
            sourceUrl: "https://www.beckershospitalreview.com",
            impact: "Patient intake time reduced from 45 minutes to 10 minutes through digital pre-registration"
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
                <h2 className="text-3xl font-bold mb-4">Transform Your Practice Today</h2>
                <p className="text-muted-foreground">HIPAA-compliant. Easy setup. Cancel anytime.</p>
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
                      placeholder="your@practice.com"
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
                    <Label htmlFor="practiceType">Practice Type</Label>
                    <Input
                      id="practiceType"
                      value={formData.practiceType}
                      onChange={(e) => setFormData({ ...formData, practiceType: e.target.value })}
                      placeholder="e.g., Family Medicine"
                    />
                  </div>
                </div>

                <MagneticButton
                  type="submit"
                  size="lg"
                  className="w-full text-lg h-14 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  Book Discovery Call
                  <ArrowRight className="w-5 h-5 ml-2" />
                </MagneticButton>

                <p className="text-xs text-center text-muted-foreground">
                  HIPAA-compliant. Secure. Patient data protected.
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

export default HealthcareLanding;
