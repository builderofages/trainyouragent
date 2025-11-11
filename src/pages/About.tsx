import { motion } from "framer-motion";
import { Zap, Users, Target, TrendingUp, Shield, CheckCircle, Wrench, Scale, UtensilsCrossed, Heart, Briefcase, LineChart, Code2, Headset } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { StrategySessionLeadGate } from "@/components/conversion/StrategySessionLeadGate";
import { useState } from "react";
import { trackEvent } from "@/lib/tracking";

const About = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              We Got Tired of Watching <span className="text-gradient">Businesses Lose Money</span> to Missed Calls
            </h1>
            <p className="text-xl text-muted-foreground">
              So we built something that actually fixes it—AI that never sleeps, never misses a call, and turns every lead into revenue.
            </p>
          </motion.div>

          {/* The Problem We Saw */}
          <GlassCard className="p-12 mb-12">
            <h2 className="text-3xl font-bold mb-6">The Problem We Couldn't Ignore</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              After working with hundreds of small businesses, we kept seeing the same nightmare: hardworking owners losing 6-7 figures annually because they couldn't answer every call. HVAC contractors missing emergency calls at 2am. Law firms losing high-value clients to competitors who answered first. Restaurants turning away reservations during rush hours because the phone rang off the hook.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              The worst part? These weren't bad businesses. They were incredible at what they did. But nobody can be available 24/7. And hiring more staff is expensive, unreliable, and doesn't scale during seasonal spikes.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We knew there had to be a better way. Not another voicemail system. Not another "we'll call you back" service. Something that actually answers, qualifies, and books—just like a top-tier receptionist would. That's why we built TrainYourAgent.
            </p>
          </GlassCard>

          {/* Our Approach is Different */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Why We're Different</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Target,
                  title: "Research-Backed, Not Hype",
                  desc: "We don't make wild claims. Every stat we share comes from McKinsey, Gartner, CallRail, and other credible sources. We let the data speak—and it's compelling enough on its own."
                },
                {
                  icon: Zap,
                  title: "Fast Implementation (3-7 Days)",
                  desc: "Industry average is 2-4 weeks. We're live in under a week. Why? Because we've built a streamlined process that works. No endless onboarding. No technical headaches. Just results."
                },
                {
                  icon: Users,
                  title: "We Actually Care About ROI",
                  desc: "94% of our pilot program participants convert to full implementation—not because we pressure them, but because they see real revenue increase. We offer a 30-day pilot so you can prove it works before committing."
                },
                {
                  icon: Shield,
                  title: "Enterprise Security, Small Business Pricing",
                  desc: "Bank-level encryption. SOC 2 compliance. HIPAA options for healthcare. You get enterprise-grade security without enterprise-grade costs. Your customer data is sacred to us."
                }
              ].map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard hover className="p-8 h-full">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* What Makes Us Actually Work */}
          <GlassCard className="p-12 mb-12 bg-gradient-to-br from-primary/5 to-accent/5">
            <h2 className="text-3xl font-bold mb-6">What Makes This Actually Work</h2>
            <div className="space-y-4">
              {[
                "We don't replace humans. We amplify them. Your AI handles the repetitive stuff (answering, qualifying, scheduling) so your team can focus on high-value work.",
                "We customize for YOUR business. Not generic scripts. We train the AI on YOUR services, YOUR pricing, YOUR processes. It speaks your language.",
                "We measure everything. Real-time analytics show exactly how many calls you're capturing, which leads convert, and what your actual ROI is. No guessing.",
                "We're obsessed with continuous improvement. Monthly optimization reviews. Regular updates. Your AI gets smarter every month based on real performance data."
              ].map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg text-muted-foreground leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Job Evolution Section */}
          <GlassCard className="p-12 mb-12 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-2 border-primary/20">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-3">We Don't Replace People—We Elevate Them</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  The goal isn't to eliminate jobs. It's to eliminate the repetitive tasks that prevent your team from doing what they do best: solving problems, building relationships, and growing your business.
                </p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <p className="text-muted-foreground leading-relaxed">
                Yes, workflows change when you implement AI. But the person who was spending 6 hours a day answering phones suddenly has bandwidth to focus on higher-value work that directly increases revenue and job satisfaction.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                AI handles the predictable, repetitive work. Humans focus on the complex, creative, relationship-driven work that moves the business forward.
              </p>
            </div>

            <h3 className="text-2xl font-bold mb-6">Real Workflow Transformations:</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                {
                  title: "HVAC Company",
                  icon: Wrench,
                  before: "Office manager spent 25 hours/week answering calls, scheduling, managing invoices",
                  after: ["Vendor relationship management (negotiated 12% better pricing)", "Customer retention campaigns (18% increase)", "Process optimization (23 min saved per job)", "Training new technicians"],
                  result: "15% raise + promotion. Company revenue up $180K annually."
                },
                {
                  title: "Law Firm",
                  icon: Scale,
                  before: "Paralegal spent 30 hours/week on intake calls, consultations, calendar coordination",
                  after: ["Complex case research and legal document prep", "Client relationship management for high-value cases", "Continuing legal education", "Process improvements (40% faster case prep)"],
                  result: "Paralegal expanded skillset. Firm took on 35% more cases without hiring."
                },
                {
                  title: "Restaurant",
                  icon: UtensilsCrossed,
                  before: "Host stressed juggling phones + walk-ins, frequent booking errors during rush",
                  after: ["Greeting and seating VIP/regular customers", "Upselling premium experiences (wine pairings, chef's table)", "Special events and private dining coordination", "Training front-of-house staff"],
                  result: "Host became FOH manager. Per-table revenue up 22%."
                },
                {
                  title: "Medical Practice",
                  icon: Heart,
                  before: "Receptionist handled 40+ calls/day for appointments, insurance, refills",
                  after: ["Proactive preventive care outreach", "Complex care coordination for chronic disease patients", "Insurance pre-authorization and claims assistance", "Patient education and follow-up care"],
                  result: "Better patient outcomes. Practice added 200 patients without growing staff."
                }
              ].map((example, idx) => {
                const IconComponent = example.icon;
                return (
                  <div key={idx} className="p-6 bg-background/50 rounded-xl border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold">{example.title}</h4>
                    </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">Before AI:</p>
                      <p className="text-sm text-muted-foreground pl-4">{example.before}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary mb-2">After AI:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground pl-4">
                        {example.after.map((item, i) => <li key={i}>• {item}</li>)}
                      </ul>
                      <div className="mt-3 p-3 bg-green-500/10 rounded-lg">
                        <p className="text-xs font-semibold text-green-700 dark:text-green-400">{example.result}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
              <h4 className="font-bold text-lg mb-3">The Pattern We See Consistently:</h4>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <CheckCircle className="w-5 h-5 text-primary mb-2" />
                  <span className="font-semibold">Employees:</span>
                  <p className="text-muted-foreground mt-1">More engaging work. Often leads to promotions and raises.</p>
                </div>
                <div>
                  <CheckCircle className="w-5 h-5 text-primary mb-2" />
                  <span className="font-semibold">Businesses:</span>
                  <p className="text-muted-foreground mt-1">Same headcount handles more volume. Revenue increases without proportional costs.</p>
                </div>
                <div>
                  <CheckCircle className="w-5 h-5 text-primary mb-2" />
                  <span className="font-semibold">Customers:</span>
                  <p className="text-muted-foreground mt-1">Faster 24/7 responses plus more personalized attention from staff.</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Meet the Team */}
          <div className="mb-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Meet the Team
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A collective of experienced professionals united by a mission: showing businesses how AI elevates employees instead of replacing them.
              </p>
            </div>

            {/* Leadership Team */}
            <div className="mb-20">
              <h3 className="text-3xl font-bold text-foreground mb-12 text-center">Leadership Team</h3>
              <div className="grid md:grid-cols-2 gap-12">
                {/* Alexander - Founder & CEO */}
                <GlassCard hover className="p-8">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      A
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-foreground mb-1">Alexander</h4>
                      <div className="flex items-center gap-2 text-primary mb-4">
                        <Briefcase className="w-5 h-5" />
                        <p className="font-semibold">Founder & CEO</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Led 10+ departments as Head Executive at a major SMMA, building and scaling teams of 1,000+ employees across multiple successful ventures. Through this journey, helped lead brands to achieve millions in sales and generate hundreds of millions of views.
                    </p>
                    <p>
                      Early AI adopter and ChatGPT beta tester since initial release. Deep expertise across all major LLMs (OpenAI, Anthropic, Google, Meta). Identified critical gap in business automation while scaling multiple companies.
                    </p>
                    <p>
                      Recognized AI as a force multiplier for employee productivity, not a replacement—and built TrainYourAgent to prove it.
                    </p>
                  </div>
                </GlassCard>

                {/* Jess - CRM & Operations Lead */}
                <GlassCard hover className="p-8">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      J
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-foreground mb-1">Jess</h4>
                      <div className="flex items-center gap-2 text-primary mb-4">
                        <LineChart className="w-5 h-5" />
                        <p className="font-semibold">CRM & Operations Lead</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      5+ years at a Fortune 500 communications company generating billions in annual revenue. Specialized in sales operations, customer account management, and retention strategies.
                    </p>
                    <p>
                      Expert in CRM optimization, lead scoring, and conversion funnel analysis. Also serves as Creative Director for brand assets, UI/UX design, and visual identity.
                    </p>
                    <p>
                      Brings enterprise-level sales methodology to small business automation, ensuring every client gets Fortune 500-caliber processes.
                    </p>
                  </div>
                </GlassCard>

                {/* Dan - Sales Director */}
                <GlassCard hover className="p-8">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      D
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-foreground mb-1">Dan</h4>
                      <div className="flex items-center gap-2 text-primary mb-4">
                        <Briefcase className="w-5 h-5" />
                        <p className="font-semibold">Sales Director</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Built and scaled his own company from $0 to $50K+/month in recurring revenue. Proven track record in lead generation, conversion optimization, and sales team leadership.
                    </p>
                    <p>
                      Expert in consultative selling methodology—helping clients see AI as a business enabler, not a job eliminator. Specializes in showing businesses how AI creates bandwidth for strategic work while maintaining the human touch.
                    </p>
                    <p>
                      Leads our sales organization with a focus on long-term client relationships and genuine business transformation.
                    </p>
                  </div>
                </GlassCard>

                {/* David - Head of Development */}
                <GlassCard hover className="p-8">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      <Code2 className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-foreground mb-1">David</h4>
                      <div className="flex items-center gap-2 text-primary mb-4">
                        <Code2 className="w-5 h-5" />
                        <p className="font-semibold">Head of Development</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      10+ years of development experience across multiple programming languages, frameworks, and tech stacks. Built games, enterprise websites, SaaS platforms, and AI-powered applications from concept to deployment.
                    </p>
                    <p>
                      Deep expertise in AI/ML integration, prompt engineering, and LLM orchestration systems. Shares Alexander's passion for using AI to elevate human capabilities rather than replace them.
                    </p>
                    <p>
                      Leads a team of 5 talented developers who bring diverse technical backgrounds and share his vision for ethical AI implementation. Ensures every solution is built with security, scalability, and reliability at its core.
                    </p>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Core Team */}
            <div>
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-foreground mb-4">Our Core Team</h3>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Every team member brings specialized expertise and is hired for proven experience in their field. We believe in building a team of A-players who share our mission of elevating businesses through intelligent automation.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Sales Team */}
                <GlassCard hover className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-4 text-center">Sales Team (5 Members)</h4>
                  <div className="space-y-4 text-muted-foreground text-sm">
                    <p>
                      Our sales team brings extensive experience from various industries including SaaS, B2B services, and enterprise solutions. Each member has a proven track record in consultative selling, customer relationship management, and deal closure.
                    </p>
                    <p>
                      Led by Dan, they focus on understanding each client's unique business challenges and crafting personalized AI solutions that drive measurable results. Their approach is educational and partnership-focused.
                    </p>
                  </div>
                </GlassCard>

                {/* Development Team */}
                <GlassCard hover className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                      <Code2 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-4 text-center">Development Team (5 Members)</h4>
                  <div className="space-y-4 text-muted-foreground text-sm">
                    <p>
                      Under David's leadership, our development team brings diverse technical backgrounds spanning web development, mobile apps, game development, and AI/ML systems. Each developer has experience building production-grade applications.
                    </p>
                    <p>
                      They handle everything from custom AI training and integration to platform optimization and feature development—ensuring TrainYourAgent stays at the cutting edge of conversational AI technology.
                    </p>
                  </div>
                </GlassCard>

                {/* Operations & Support */}
                <GlassCard hover className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Headset className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-4 text-center">Operations & Support Staff</h4>
                  <div className="space-y-4 text-muted-foreground text-sm">
                    <p>
                      Our operations and support team members are carefully selected for their experience in customer success, project management, technical support, and business operations. Each brings expertise from similar industries.
                    </p>
                    <p>
                      They ensure seamless onboarding, responsive support, and ongoing optimization for every client. From implementation coordinators to customer success managers, every team member is empowered to deliver exceptional service.
                    </p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>

          {/* Proof Points */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { number: "94%", label: "Pilot → Full Conversion" },
              { number: "3-7", label: "Days to Go Live" },
              { number: "$125K+", label: "Avg. Annual Revenue Increase" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover className="p-8 text-center">
                  <div className="text-5xl font-bold text-gradient mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <GlassCard className="p-12 bg-gradient-to-br from-primary/5 to-accent/5">
              <h3 className="text-3xl font-bold mb-4">Ready to Stop Losing Revenue?</h3>
              <p className="text-xl text-muted-foreground mb-8">
                Get your free strategy session. We'll show you exactly how much you're leaving on the table—and how to capture it.
              </p>
              <MagneticButton
                size="lg"
                className="text-lg px-8 h-14 gap-2 shadow-glow"
                onClick={() => {
                  trackEvent('cta_clicked', { location: 'about_page' });
                  setLeadGateOpen(true);
                }}
              >
                <TrendingUp className="w-5 h-5" />
                Get Your Free Strategy Session
              </MagneticButton>
              <p className="text-sm text-muted-foreground mt-4">
                30-minute call. Zero pressure. Just honest insights about your business.
              </p>
            </GlassCard>
          </motion.div>
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

export default About;
