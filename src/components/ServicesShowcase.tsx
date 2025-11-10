import { motion } from "framer-motion";
import { 
  Phone, GraduationCap, TrendingUp, Wrench, AlertTriangle, 
  DollarSign, Lightbulb, Globe, Code, Megaphone, Video, Target 
} from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { use3DCard } from "@/hooks/use3DCard";

const services = [
  {
    id: "voice-agents",
    icon: Phone,
    name: "AI Voice Agents",
    description: "24/7 call handling, booking automation, and lead qualification with human-like conversations.",
    tags: ["HVAC", "Accounting", "Roofing", "All"],
    highlight: "24/7 availability, instant response",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "staff-training",
    icon: GraduationCap,
    name: "AI Staff Training",
    description: "Automated onboarding and compliance training that adapts to each employee's learning pace.",
    tags: ["All Industries"],
    highlight: "Adaptive learning technology",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "predictive-analytics",
    icon: TrendingUp,
    name: "Predictive Analytics Suite",
    description: "Demand forecasting, inventory optimization, and revenue prediction powered by AI.",
    tags: ["HVAC", "Roofing", "Logistics"],
    highlight: "Data-driven forecasting",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "training-academy",
    icon: Lightbulb,
    name: "Custom AI Training Academy",
    description: "Comprehensive staff education on AI workflows and best practices for your industry.",
    tags: ["All Industries"],
    highlight: "Industry-specific training",
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "crisis-management",
    icon: AlertTriangle,
    name: "Crisis Management AI",
    description: "Emergency triage and priority routing to handle urgent situations automatically.",
    tags: ["HVAC", "Healthcare", "Legal"],
    highlight: "Enterprise-grade reliability",
    color: "from-red-500 to-rose-500",
  },
  {
    id: "revenue-optimization",
    icon: DollarSign,
    name: "Revenue Optimization",
    description: "Upsell frameworks, dynamic pricing, and conversion optimization strategies.",
    tags: ["All Industries"],
    highlight: "Maximize customer lifetime value",
    color: "from-indigo-500 to-violet-500",
  },
  {
    id: "ai-consulting",
    icon: Wrench,
    name: "AI Consulting",
    description: "Custom strategy development and implementation planning tailored to your business.",
    tags: ["Enterprise"],
    highlight: "White-glove service",
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "seo-aio",
    icon: Target,
    name: "AI Search Optimization (AIO)",
    description: "Local SEO, Google AI summaries, and search visibility optimization for the AI era.",
    tags: ["All Industries"],
    highlight: "AI-era search optimization",
    color: "from-lime-500 to-green-500",
  },
  {
    id: "website-dev",
    icon: Code,
    name: "Upgraded Website Development",
    description: "Modern client portals, maintenance tracking, and booking systems integrated with AI.",
    tags: ["All Industries"],
    highlight: "Mobile-first design",
    color: "from-sky-500 to-blue-500",
  },
  {
    id: "concierge",
    icon: Megaphone,
    name: "Concierge Management",
    description: "Ad optimization, campaign management, and performance tracking across all channels.",
    tags: ["All Industries"],
    highlight: "Optimized campaign performance",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    id: "media-creation",
    icon: Video,
    name: "AI Media & Ad Creation",
    description: "UGC content, automated creative generation, and full ad campaign production.",
    tags: ["All Industries"],
    highlight: "Automated creative generation",
    color: "from-amber-500 to-yellow-500",
  },
  {
    id: "global-expansion",
    icon: Globe,
    name: "Global Market Expansion",
    description: "International compliance, multi-market scaling, and localized AI solutions.",
    tags: ["Enterprise"],
    highlight: "Localized AI solutions",
    color: "from-rose-500 to-red-500",
  },
];

const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  const { ref, style, onMouseMove, onMouseLeave } = use3DCard(10);
  const Icon = service.icon;

  return (
    <motion.div
      ref={ref as any}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="perspective-1000"
    >
      <GlassCard hover className="p-6 h-full group cursor-pointer hover-lift relative overflow-hidden">
        {/* Gradient Accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color}`} />
        
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} mb-4 shadow-glow-sm`}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {service.name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {service.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {service.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="pt-4 border-t border-glass-border">
          <p className="text-xs font-semibold text-gradient">
            ✨ {service.highlight}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const ServicesShowcase = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 rounded-full glass-card text-sm font-medium shadow-glow-sm">
              Complete AI Solutions
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Dominate Your Market</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From AI voice agents to global expansion, we provide the full suite of tools 
            and services to transform your business operations
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6">
            Not sure which services you need? Let's talk.
          </p>
          <a
            href="https://calendly.com/trainyouragent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-primary text-white font-semibold rounded-full hover:shadow-glow transition-all duration-300"
          >
            Schedule a Strategy Call
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesShowcase;
