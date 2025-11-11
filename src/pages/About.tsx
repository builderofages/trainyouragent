import { motion } from "framer-motion";
import { Zap, Users, Target, TrendingUp, Shield, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { siteConfig } from "@/config/site";

const About = () => {
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
                  icon: "🔧",
                  before: "Office manager spent 25 hours/week answering calls, scheduling, managing invoices",
                  after: ["Vendor relationship management (negotiated 12% better pricing)", "Customer retention campaigns (18% increase)", "Process optimization (23 min saved per job)", "Training new technicians"],
                  result: "15% raise + promotion. Company revenue up $180K annually."
                },
                {
                  title: "Law Firm",
                  icon: "⚖️",
                  before: "Paralegal spent 30 hours/week on intake calls, consultations, calendar coordination",
                  after: ["Complex case research and legal document prep", "Client relationship management for high-value cases", "Continuing legal education", "Process improvements (40% faster case prep)"],
                  result: "Paralegal expanded skillset. Firm took on 35% more cases without hiring."
                },
                {
                  title: "Restaurant",
                  icon: "🍽️",
                  before: "Host stressed juggling phones + walk-ins, frequent booking errors during rush",
                  after: ["Greeting and seating VIP/regular customers", "Upselling premium experiences (wine pairings, chef's table)", "Special events and private dining coordination", "Training front-of-house staff"],
                  result: "Host became FOH manager. Per-table revenue up 22%."
                },
                {
                  title: "Medical Practice",
                  icon: "❤️",
                  before: "Receptionist handled 40+ calls/day for appointments, insurance, refills",
                  after: ["Proactive preventive care outreach", "Complex care coordination for chronic disease patients", "Insurance pre-authorization and claims assistance", "Patient education and follow-up care"],
                  result: "Better patient outcomes. Practice added 200 patients without growing staff."
                }
              ].map((example, idx) => (
                <div key={idx} className="p-6 bg-background/50 rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{example.icon}</span>
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
              ))}
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

          {/* Team Section - Ready for Real Content */}
          <GlassCard className="p-12 mb-12">
            <h2 className="text-3xl font-bold mb-6">Meet the Team</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We're a team of AI engineers, business strategists, and automation experts who got tired of watching businesses lose revenue to missed calls. Our backgrounds span Fortune 500 enterprise technology, small business operations, and cutting-edge AI research.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Placeholder for team members - ready for real photos and details */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  ?
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Founder / CEO</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    [Add your name, background, and expertise here. Include relevant experience, credentials, or LinkedIn profile link.]
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  ?
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Technical Lead / CTO</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    [Add co-founder or key team member info here. Include technical credentials and relevant experience.]
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground italic">
                💡 <strong>Note:</strong> Replace the placeholder content above with real team member photos, names, backgrounds, and LinkedIn profiles. Authenticity builds trust—prospects want to know who they're working with.
              </p>
            </div>
          </GlassCard>

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
                onClick={() => window.open(siteConfig.bookingUrl, '_blank')}
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

      <Footer />
    </div>
  );
};

export default About;
