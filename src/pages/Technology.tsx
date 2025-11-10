import { motion } from "framer-motion";
import { Code, Cpu, Cloud, Zap, Database, Globe, Webhook, Lock, Sparkles, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";

const techStack = {
  ai: [
    { name: "OpenAI GPT-4", description: "Natural language understanding" },
    { name: "Google Speech-to-Text", description: "Voice recognition" },
    { name: "Custom NLP Models", description: "Industry-specific training" },
    { name: "Vector Databases", description: "Knowledge retrieval" }
  ],
  infrastructure: [
    { name: "AWS Cloud", description: "Global infrastructure" },
    { name: "Serverless Architecture", description: "Auto-scaling" },
    { name: "Global CDN", description: "Low latency worldwide" },
    { name: "Multi-region Redundancy", description: "99.9% uptime" }
  ],
  integrations: [
    { name: "Salesforce", description: "CRM integration" },
    { name: "HubSpot", description: "Marketing automation" },
    { name: "Twilio", description: "Voice infrastructure" },
    { name: "Google Calendar", description: "Scheduling" }
  ],
  development: [
    { name: "React + TypeScript", description: "Modern frontend" },
    { name: "Node.js", description: "Backend services" },
    { name: "PostgreSQL", description: "Reliable database" },
    { name: "Redis", description: "High-speed caching" }
  ]
};

const capabilities = [
  {
    icon: Cpu,
    title: "Advanced AI Processing",
    features: ["Natural conversation flow", "Context awareness", "Multi-language support", "Sentiment analysis"]
  },
  {
    icon: Zap,
    title: "Real-Time Performance",
    features: ["<100ms response time", "Unlimited concurrent calls", "Instant CRM updates", "Live transcription"]
  },
  {
    icon: Database,
    title: "Data & Analytics",
    features: ["Call recordings & transcripts", "Performance metrics", "Custom reporting", "Lead scoring"]
  },
  {
    icon: Webhook,
    title: "API & Integrations",
    features: ["RESTful API", "Webhook support", "Custom integrations", "Zapier compatible"]
  }
];

const Technology = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Code className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Technology Stack</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
              Built for Scale, Security & Speed
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Enterprise-grade infrastructure powered by cutting-edge AI technology. Designed to handle millions of interactions with 99.9% uptime.
            </p>
          </motion.div>

          {/* Capabilities Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-8 hover-lift h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <capability.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{capability.title}</h3>
                  <ul className="space-y-2">
                    {capability.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-12 text-center">Our Technology Stack</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* AI & ML */}
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">AI & Machine Learning</h3>
                </div>
                <div className="space-y-4">
                  {techStack.ai.map((tech, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{tech.name}</p>
                        <p className="text-sm text-muted-foreground">{tech.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Infrastructure */}
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Cloud className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Cloud Infrastructure</h3>
                </div>
                <div className="space-y-4">
                  {techStack.infrastructure.map((tech, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{tech.name}</p>
                        <p className="text-sm text-muted-foreground">{tech.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Integrations */}
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Integrations</h3>
                </div>
                <div className="space-y-4">
                  {techStack.integrations.map((tech, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{tech.name}</p>
                        <p className="text-sm text-muted-foreground">{tech.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Development */}
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Development Stack</h3>
                </div>
                <div className="space-y-4">
                  {techStack.development.map((tech, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{tech.name}</p>
                        <p className="text-sm text-muted-foreground">{tech.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Performance That Matters</h2>
            <GlassCard className="p-8">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                  <p className="text-sm text-muted-foreground">Uptime Guarantee</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">&lt;100ms</div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">∞</div>
                  <p className="text-sm text-muted-foreground">Concurrent Calls</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">50+</div>
                  <p className="text-sm text-muted-foreground">Countries Supported</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* API Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card p-12 rounded-3xl text-center"
          >
            <Webhook className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Developer-Friendly API</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              RESTful API with comprehensive documentation, webhook support, and SDKs for popular languages. Build custom integrations that fit your unique workflow.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <MagneticButton
                variant="outline"
                className="rounded-full"
                onClick={() => window.open('/api-docs', '_blank')}
              >
                <Code className="w-5 h-5 mr-2" />
                API Documentation
              </MagneticButton>
              <MagneticButton
                className="rounded-full bg-gradient-primary"
                onClick={() => window.open('https://calendly.com/trainyouragent', '_blank')}
              >
                Talk to Engineering
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Technology;
