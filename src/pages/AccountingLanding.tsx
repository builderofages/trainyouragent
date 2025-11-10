import { motion } from "framer-motion";
import { Calculator, Clock, FileText, Users, TrendingUp, CheckCircle, Star, ArrowRight, Sparkles, DollarSign, Calendar, Shield } from "lucide-react";
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

const AccountingLanding = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", firmSize: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks! We'll be in touch within 24 hours.");
    window.open(siteConfig.bookingUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-background to-emerald-500/5" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"
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
                <Calculator className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">For Accounting Professionals</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Stop Chasing Clients.
                <span className="block text-gradient bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  Let AI Find Them
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Automate client onboarding, document collection, and consultation scheduling. 
                Focus on accounting—not administrative work.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={5} suffix="x" />
                  </div>
                  <div className="text-sm text-muted-foreground">Faster Onboarding</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">
                    <AnimatedCounter end={70} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground">Time Saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Client Support</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  size="lg"
                  className="text-lg px-8 h-14 gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Your AI Accountant
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">AI Accounting Assistant</div>
                    <div className="text-xs text-green-500">● Online</div>
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
                      <Calculator className="w-4 h-4 text-primary" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">Hi! I need help with my business taxes. Do you handle S-Corp returns?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 rounded-lg flex-1 border border-green-500/20">
                      <p className="text-sm">Absolutely! We specialize in S-Corp tax preparation. Let me ask a few quick questions to see if we're a good fit, then I'll schedule you with our senior tax specialist.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-primary" />
                    </div>
                    <div className="glass-card p-3 rounded-lg flex-1">
                      <p className="text-sm">Perfect! What do you need to know?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 rounded-lg flex-1 border border-green-500/20">
                      <p className="text-sm mb-2">Great! Just 3 quick questions:</p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>✓ What's your annual revenue range?</li>
                        <li>✓ Do you have employees?</li>
                        <li>✓ When's your fiscal year end?</li>
                      </ul>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI automatically qualifies and books consultations 24/7
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Real Cost of Manual Client Intake
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every hour spent on admin work is an hour you're not billing clients
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Clock,
                title: "15+ Hours Per Week",
                description: "Wasted on initial consultations with unqualified prospects",
                stat: "$4,500/month",
                label: "Lost billable time"
              },
              {
                icon: FileText,
                title: "Documents Chase Game",
                description: "Endless back-and-forth emails trying to collect client paperwork",
                stat: "3-5 days",
                label: "Average delay"
              },
              {
                icon: Users,
                title: "Missed Opportunities",
                description: "Prospects calling after hours go straight to voicemail—and competitors",
                stat: "40-60%",
                label: "After-hours inquiries"
              }
            ].map((pain, index) => {
              const Icon = pain.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-8 h-full border-destructive/20 bg-destructive/5 hover-lift">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{pain.title}</h3>
                    <p className="text-muted-foreground mb-6">{pain.description}</p>
                    <div className="pt-6 border-t border-border/50">
                      <div className="text-3xl font-bold text-destructive mb-1">{pain.stat}</div>
                      <div className="text-sm text-muted-foreground">{pain.label}</div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

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
              <Sparkles className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">AI-Powered Solutions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your 24/7 Digital Receptionist
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Calendar,
                title: "Automated Client Onboarding",
                description: "AI collects all necessary documents, tax forms, and information before your first meeting. No more chasing paperwork.",
                features: ["Secure document upload", "Tax form collection", "Client questionnaires", "Compliance checks"]
              },
              {
                icon: Shield,
                title: "Smart Client Qualification",
                description: "Pre-screen prospects based on your ideal client profile. Only qualified leads get to your calendar.",
                features: ["Revenue thresholds", "Service needs matching", "Complexity assessment", "Automatic scheduling"]
              },
              {
                icon: DollarSign,
                title: "Instant Quote Generation",
                description: "Provide pricing estimates immediately based on client needs and complexity. No waiting, no guessing.",
                features: ["Service-based pricing", "Complexity calculations", "Custom package quotes", "Transparent pricing"]
              },
              {
                icon: Clock,
                title: "After-Hours Lead Capture",
                description: "Capture leads 24/7, even during tax season crunch time. Your AI never sleeps, takes vacation, or calls in sick.",
                features: ["24/7 availability", "Instant responses", "Emergency handling", "Follow-up scheduling"]
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
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{solution.title}</h3>
                    <p className="text-muted-foreground mb-6">{solution.description}</p>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
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

      {/* ROI Calculator */}
      <section className="py-20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <GlassCard className="p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Your ROI in Numbers</h2>
                <p className="text-muted-foreground">Based on average accounting firm metrics</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">$4,500</div>
                  <div className="text-sm text-muted-foreground">Monthly time saved</div>
                  <div className="text-xs text-muted-foreground mt-1">(15 hrs/week × $75/hr)</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">3-5x</div>
                  <div className="text-sm text-muted-foreground">More qualified leads</div>
                  <div className="text-xs text-muted-foreground mt-1">24/7 capture vs 9-5</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">70%</div>
                  <div className="text-sm text-muted-foreground">Faster onboarding</div>
                  <div className="text-xs text-muted-foreground mt-1">5 days → 1.5 days</div>
                </div>
              </div>

              <div className="text-center pt-8 border-t border-border">
                <div className="text-2xl font-bold mb-2">
                  Average Payback Period: <span className="text-gradient">14 days</span>
                </div>
                <p className="text-muted-foreground">Most firms see ROI within the first 2 weeks</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Trusted by CPAs Nationwide</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Jennifer Walsh, CPA",
                firm: "Walsh & Associates",
                quote: "We've onboarded 3x more clients since implementing the AI assistant. It handles all the tedious document collection while we focus on actual accounting work.",
                rating: 5
              },
              {
                name: "David Kumar",
                firm: "Kumar Tax Services",
                quote: "During tax season, this AI saved us from hiring temporary staff. It captured leads 24/7 and pre-qualified everyone before they hit our calendar.",
                rating: 5
              },
              {
                name: "Maria Santos",
                firm: "Santos Financial Group",
                quote: "ROI in 12 days. I was skeptical, but the AI books more qualified consultations than our old receptionist ever did—and it works weekends.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-8 h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.firm}</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
                <h2 className="text-3xl font-bold mb-4">Get Your AI Assistant in 24 Hours</h2>
                <p className="text-muted-foreground">No credit card required. 30-day money-back guarantee.</p>
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
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="firmSize">Firm Size</Label>
                    <Input
                      id="firmSize"
                      value={formData.firmSize}
                      onChange={(e) => setFormData({ ...formData, firmSize: e.target.value })}
                      placeholder="e.g., 5 CPAs"
                    />
                  </div>
                </div>

                <MagneticButton
                  type="submit"
                  size="lg"
                  className="w-full text-lg h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Schedule Your Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </MagneticButton>

                <p className="text-xs text-center text-muted-foreground">
                  We'll never share your information. Unsubscribe anytime.
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

export default AccountingLanding;
