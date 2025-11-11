import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Briefcase, Calculator, Phone, FileText, Users, TrendingUp, 
  Target, DollarSign, Clock, CheckCircle, ExternalLink, Copy,
  Presentation, ArrowRight, Sparkles, Shield, Calendar
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";

const SalesToolkit = () => {
  const [presentationMode, setPresentationMode] = useState(false);

  const industries = [
    { name: "HVAC", url: "/hvac", color: "from-blue-500 to-cyan-500" },
    { name: "Accounting", url: "/accounting", color: "from-emerald-500 to-green-500" },
    { name: "Roofing", url: "/roofing", color: "from-orange-500 to-red-500" },
    { name: "Legal", url: "/legal", color: "from-blue-600 to-indigo-500" },
    { name: "Healthcare", url: "/healthcare", color: "from-cyan-500 to-teal-500" },
    { name: "Logistics", url: "/logistics", color: "from-blue-600 to-sky-500" },
    { name: "Restaurants", url: "/restaurants", color: "from-yellow-500 to-orange-500" },
    { name: "Bars & Nightclubs", url: "/bars-nightclubs", color: "from-purple-500 to-pink-500" },
  ];

  const talkingPoints = {
    painPoints: [
      "62% of leads call competitors when you miss their first call",
      "$50K+ average annual loss from missed after-hours calls",
      "15+ hours/week wasted on unqualified prospect calls",
      "78% of customers expect immediate response, even after hours"
    ],
    solutions: [
      "24/7 AI availability captures EVERY lead, even at 2am",
      "Automatic lead qualification saves 15+ hours/week",
      "CRM integration eliminates manual data entry",
      "ROI typically seen within 14-30 days"
    ],
    objectionHandlers: [
      {
        objection: "\"We already have a receptionist\"",
        response: "Great! Our AI works alongside your team, handling after-hours calls, overflow, and repetitive qualification questions so your receptionist can focus on higher-value tasks."
      },
      {
        objection: "\"How do I know AI won't sound robotic?\"",
        response: "Our AI uses ElevenLabs voice synthesis—the same technology used by Fortune 500 companies. Let me play you a demo call right now. Most people can't tell it's AI."
      },
      {
        objection: "\"What if it makes a mistake?\"",
        response: "The AI is programmed with escalation protocols. For complex scenarios, it smoothly transfers to your team with full context. Plus, you review and approve all responses before going live."
      },
      {
        objection: "\"Seems expensive\"",
        response: "Let's use our ROI calculator. How many calls do you typically miss per week? [Calculate] See? You're losing $X monthly right now. Our solution pays for itself in less than 30 days."
      }
    ]
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className={`min-h-screen bg-background ${presentationMode ? 'text-xl' : ''}`}>
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Sales Team Resources</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sales Toolkit</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Everything you need to close deals faster
            </p>

            <MagneticButton
              variant={presentationMode ? "default" : "outline"}
              onClick={() => setPresentationMode(!presentationMode)}
              className="gap-2"
            >
              <Presentation className="w-5 h-5" />
              {presentationMode ? "Exit" : "Enable"} Presentation Mode
            </MagneticButton>
          </motion.div>

          {/* Quick Links to Landing Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ExternalLink className="w-6 h-6 text-primary" />
                Industry Landing Pages
              </h2>
              <div className="grid md:grid-cols-4 gap-4">
                {industries.map((industry) => (
                  <a
                    key={industry.name}
                    href={industry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <GlassCard className="p-4 hover-lift text-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${industry.color} mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <ExternalLink className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-semibold">{industry.name}</div>
                    </GlassCard>
                  </a>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Talking Points */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 h-full">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-destructive" />
                  Pain Points (Start Here)
                </h2>
                <ul className="space-y-4">
                  {talkingPoints.painPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-destructive">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{point}</p>
                        <button
                          onClick={() => copyToClipboard(point)}
                          className="text-xs text-primary hover:underline mt-1 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 h-full">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Solutions (The Pitch)
                </h2>
                <ul className="space-y-4">
                  {talkingPoints.solutions.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">{point}</p>
                        <button
                          onClick={() => copyToClipboard(point)}
                          className="text-xs text-primary hover:underline mt-1 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          </div>

          {/* Objection Handlers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-orange-500" />
                Objection Handlers
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {talkingPoints.objectionHandlers.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="font-semibold text-destructive">{item.objection}</div>
                    <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
                      {item.response}
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.response)}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Response
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Quick Actions
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <MagneticButton
                  size="lg"
                  className="gap-2 h-20 flex-col"
                  onClick={() => window.open(siteConfig.bookingUrl, '_blank')}
                >
                  <Calendar className="w-6 h-6" />
                  <span>Book Demo</span>
                </MagneticButton>
                <MagneticButton
                  size="lg"
                  variant="outline"
                  className="gap-2 h-20 flex-col glass-card"
                  onClick={() => window.open('/demos', '_blank')}
                >
                  <Calculator className="w-6 h-6" />
                  <span>ROI Calculator</span>
                </MagneticButton>
                <MagneticButton
                  size="lg"
                  variant="outline"
                  className="gap-2 h-20 flex-col glass-card"
                  onClick={() => window.open('/case-studies', '_blank')}
                >
                  <FileText className="w-6 h-6" />
                  <span>Case Studies</span>
                </MagneticButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SalesToolkit;
