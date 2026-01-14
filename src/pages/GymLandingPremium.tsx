import { useState, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Users, TrendingUp, Clock, Trophy, Target, Heart, Zap, ArrowRight, Check } from "lucide-react";
import Header from "@/components/Header";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VideoBackground } from "@/components/performance/VideoBackground";
import { SEOHead, generateFAQSchema, commonFAQs } from "@/components/seo/SEOHead";
import { AnimatedCounter } from "@/components/premium/AnimatedCounter";
import { FooterPremium } from "@/components/premium/FooterPremium";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { comprehensiveSolutions } from "@/data/comprehensiveBusinessFunctions";
import { expandedSolutions } from "@/data/solutionsExpanded";
import { employeeElevationStories } from "@/data/employeeElevationStories";

// Lazy load heavy components
const ComprehensiveSolutionsGrid = lazy(() => 
  import("@/components/solutions/ComprehensiveSolutionsGrid").then(m => ({ default: m.ComprehensiveSolutionsGrid }))
);
const PainPointsJourney = lazy(() => 
  import("@/components/solutions/PainPointsJourney").then(m => ({ default: m.PainPointsJourney }))
);
const IndustryBenefits = lazy(() => 
  import("@/components/solutions/IndustryBenefits").then(m => ({ default: m.IndustryBenefits }))
);
const VoiceAgentDemo = lazy(() => 
  import("@/components/VoiceAgentDemo").then(m => ({ default: m.VoiceAgentDemo }))
);
const ROICalculatorEnhanced = lazy(() => import("@/components/ROICalculatorEnhanced"));
const StrategySessionLeadGate = lazy(() => 
  import("@/components/conversion/StrategySessionLeadGate").then(m => ({ default: m.StrategySessionLeadGate }))
);

// Section loading component
const SectionLoader = () => (
  <div className="py-16 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-trust-blue border-t-transparent rounded-full animate-spin" />
  </div>
);

const stats = [
  { value: 67, suffix: "%", label: "Trial leads never followed up", icon: Target },
  { value: 31, suffix: "%", label: "Annual member churn rate", icon: TrendingUp },
  { value: 24, suffix: "/7", label: "Lead capture & follow-up", icon: Clock },
  { value: 5, suffix: " Days", label: "Full deployment", icon: Trophy },
];

const challenges = [
  {
    icon: Users,
    title: "Trial Leads Going Cold",
    problem: "67% of trial pass visitors never get a follow-up call",
    cost: "$2,400/month in lost memberships",
  },
  {
    icon: Clock,
    title: "Peak Hour Phone Chaos",
    problem: "5-8pm rush means calls go to voicemail",
    cost: "40% of inquiries lost to competitors",
  },
  {
    icon: Heart,
    title: "Member Churn Crisis",
    problem: "31% annual churn with no win-back system",
    cost: "$180K lifetime value walking out the door",
  },
  {
    icon: Target,
    title: "PT Booking Friction",
    problem: "Members want to book PT but can't reach anyone",
    cost: "$8K/month in lost PT revenue",
  },
  {
    icon: TrendingUp,
    title: "Upgrade Opportunities Missed",
    problem: "No proactive outreach for membership upgrades",
    cost: "$150/member/year in missed upsells",
  },
  {
    icon: Zap,
    title: "Class Fill Rate Issues",
    problem: "Empty class spots not filled from waitlists",
    cost: "20% capacity utilization loss",
  },
];

const features = [
  "Responds in under 1 second",
  "Handles membership inquiries 24/7",
  "Books tours and trial passes automatically",
  "Follows up with every lead",
  "Integrates with Mindbody, Glofox, ClubReady",
];

const GymLandingPremium = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const solution = expandedSolutions.gym;
  const elevationStories = employeeElevationStories.gym || [];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // FAQ Schema for AEO
  const faqSchema = generateFAQSchema([...commonFAQs.general, ...commonFAQs.gym]);

  return (
    <ErrorBoundary>
      <SEOHead
        title="Gym & Fitness AI Voice Agents - 24/7 Membership Sales & Retention"
        description="Stop losing members to poor follow-up. AI voice agents handle membership sales, trial conversions, PT bookings, and retention campaigns 24/7. 3-7 day deployment. Free strategy session."
        keywords="gym AI, fitness center automation, membership sales AI, personal training booking, gym lead conversion, member retention AI, fitness studio software, Mindbody integration"
        canonical="/gym"
        ogImage="/og-images/gym.jpg"
        industry="Gym & Fitness"
        structuredData={faqSchema}
      />

      <div className="min-h-screen bg-background">
        <Header />

        {/* Premium Hero Section */}
        <VideoBackground
          className="min-h-screen flex items-center"
          fallbackGradient
          overlay
          overlayOpacity={0.7}
        >
          <div className="container mx-auto px-4 pt-20">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-tech-cyan text-sm font-semibold">
                  <Dumbbell className="w-4 h-4" />
                  Gym & Fitness AI Solutions
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="text-5xl md:text-7xl font-black text-white leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Stop Losing Members to{" "}
                <span className="bg-gradient-to-r from-tech-cyan to-trust-blue bg-clip-text text-transparent">
                  Poor Follow-Up
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                className="text-xl md:text-2xl text-white/70 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                67% of trial pass leads never get proper follow-up. AI handles membership sales, 
                trial conversions, and retention campaigns 24/7 while your team focuses on transforming lives.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  size="lg"
                  onClick={() => scrollToSection("live-demo")}
                  className="bg-white text-deep-space hover:bg-white/90 font-semibold px-8 py-6 text-lg"
                >
                  Hear It Live <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLeadGateOpen(true)}
                  className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg"
                >
                  Get Free Strategy Session
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                  >
                    <stat.icon className="w-6 h-6 text-tech-cyan mx-auto mb-2" />
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} delay={1 + index * 0.1} />
                    </div>
                    <p className="text-xs text-white/60">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </VideoBackground>

        {/* Problem Section */}
        <section className="py-24 bg-deep-space">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-tech-cyan text-sm font-semibold tracking-widest uppercase mb-4 block">
                The Hidden Revenue Killers
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Every Day, Potential Members Slip Through the Cracks
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                While your staff juggles a hundred tasks on the floor
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-tech-cyan/50 transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <challenge.icon className="w-10 h-10 text-tech-cyan mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                  <p className="text-white/60 mb-3">{challenge.problem}</p>
                  <p className="text-sm font-semibold text-destructive">{challenge.cost}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Demo Section */}
        <section id="live-demo" className="py-24 bg-surface">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Left - Pitch */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-trust-blue text-sm font-semibold tracking-widest uppercase mb-4 block">
                  Don't Trust Us. Test Us.
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-text-primary mb-6">
                  Talk to Our Gym AI.
                  <br />
                  <span className="text-text-secondary">Right Now.</span>
                </h2>
                <p className="text-lg text-text-secondary mb-8">
                  This is the exact AI that could be answering your gym's phone tomorrow. 
                  Ask about memberships, class schedules, personal training—anything.
                </p>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-success-green/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-success-green" />
                      </div>
                      <span className="text-text-primary">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right - Demo */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Suspense fallback={<SectionLoader />}>
                  <VoiceAgentDemo defaultIndustry="gym" />
                </Suspense>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-trust-blue text-sm font-semibold tracking-widest uppercase mb-4 block">
                Complete Automation
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-text-primary mb-4">
                8 Ways AI Transforms Your Gym
              </h2>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                From lead capture to retention, see how AI handles every aspect of member communication
              </p>
            </motion.div>
            <Suspense fallback={<SectionLoader />}>
              <ComprehensiveSolutionsGrid 
                businessFunctions={comprehensiveSolutions.gym?.businessFunctions || []}
              />
            </Suspense>
          </div>
        </section>

        {/* Pain Points Journey */}
        {solution && (
          <Suspense fallback={<SectionLoader />}>
            <PainPointsJourney solution={solution} />
          </Suspense>
        )}

        {/* Industry Benefits */}
        {solution && (
          <Suspense fallback={<SectionLoader />}>
            <IndustryBenefits solution={solution} />
          </Suspense>
        )}

        {/* ROI Calculator */}
        <section id="roi-calculator" className="py-24 bg-surface">
          <div className="container mx-auto px-4">
            <Suspense fallback={<SectionLoader />}>
              <ROICalculatorEnhanced defaultIndustry="gym" />
            </Suspense>
          </div>
        </section>

        {/* Final CTA */}
        <VideoBackground
          className="py-24"
          fallbackGradient
          overlay
          overlayOpacity={0.8}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-black text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Every Day You Wait,
              <br />
              Trial Leads Are Joining Competitors
            </motion.h2>
            <motion.p
              className="text-xl text-white/70 mb-8 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Stop losing $2,400/month in missed memberships. 
              Get your AI answering calls in 5 days.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Button
                size="lg"
                onClick={() => setLeadGateOpen(true)}
                className="bg-white text-deep-space hover:bg-white/90 font-semibold px-8 py-6 text-lg"
              >
                Get Free Strategy Session
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open(siteConfig.bookingUrl, "_blank")}
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg"
              >
                Book a 15-Min Call
              </Button>
            </motion.div>
          </div>
        </VideoBackground>

        <FooterPremium />

        {/* Lead Gate */}
        <Suspense fallback={null}>
          <StrategySessionLeadGate
            open={leadGateOpen}
            onOpenChange={setLeadGateOpen}
            defaultIndustry="Gym & Fitness"
          />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default GymLandingPremium;
