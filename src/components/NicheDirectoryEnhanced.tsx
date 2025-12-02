import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Wrench, Calculator, Home, Briefcase, Heart, Truck, Utensils, Sparkles, ArrowRight, Dumbbell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { use3DCard } from "@/hooks/use3DCard";
import { useNavigate } from "react-router-dom";
import { nicheConfig } from "@/config/niches";
import { PremiumIcon, industryIcons } from "@/components/icons/PremiumIconSystem";
import { FloatingIsland } from "@/components/effects/FloatingIsland";

const niches = [
  {
    id: "hvac",
    icon: Wrench,
    title: "HVAC Specialists",
    description: "Automate appointments, quotes, and emergency service coordination",
    color: "from-blue-500 to-cyan-500",
    stats: { metric: "85% capture rate", source: "Industry Benchmark" },
    tags: ["Lead Gen", "Scheduling", "24/7"],
    customLink: "/niche/hvac",
  },
  {
    id: "accounting",
    icon: Calculator,
    title: "Accounting Firms",
    description: "Streamline client onboarding, document collection, and consultation booking",
    color: "from-green-500 to-emerald-500",
    stats: { metric: "60% miss after-hours calls", source: "CallRail Study" },
    tags: ["Onboarding", "Documents", "Scheduling"],
    customLink: "/accounting",
  },
  {
    id: "roofing",
    icon: Home,
    title: "Roofing Contractors",
    description: "Qualify leads, schedule inspections, and provide instant estimates",
    color: "from-orange-500 to-red-500",
    stats: { metric: "62% never call back", source: "Harvard Business Review" },
    tags: ["Estimates", "Inspections", "Lead Qual"],
    customLink: "/roofing",
  },
  {
    id: "legal",
    icon: Briefcase,
    title: "Law Firms",
    description: "Screen potential clients, gather case details, schedule consultations",
    color: "from-purple-500 to-indigo-500",
    stats: { metric: "42% abandon phone queue", source: "Legal Industry Report" },
    tags: ["Screening", "Intake", "Booking"],
    customLink: "/legal",
  },
  {
    id: "healthcare",
    icon: Heart,
    title: "Healthcare Practices",
    description: "Patient intake, appointment management, and follow-up automation",
    color: "from-primary to-accent",
    stats: { metric: "30% no-show appointments", source: "Healthcare Analytics" },
    tags: ["Intake", "Scheduling", "Follow-ups"],
    customLink: "/healthcare",
  },
  {
    id: "logistics",
    icon: Truck,
    title: "Logistics & Shipping",
    description: "Quote generation, shipment tracking, and customer service automation",
    color: "from-yellow-500 to-amber-500",
    stats: { metric: "48-hour quote delays", source: "Logistics Benchmark" },
    tags: ["Quotes", "Tracking", "Support"],
    customLink: "/logistics",
  },
  {
    id: "restaurants",
    icon: Utensils,
    title: "Restaurants & Catering",
    description: "Reservation management, catering inquiries, and menu assistance",
    color: "from-primary to-accent",
    stats: { metric: "75% prefer phone bookings", source: "Restaurant Industry Study" },
    tags: ["Reservations", "Catering", "Menu"],
    customLink: "/restaurants",
  },
  {
    id: "gym",
    icon: Dumbbell,
    title: "Gym & Fitness",
    description: "Membership sales, trial conversions, PT bookings, and retention automation",
    color: "from-primary to-accent",
    stats: { metric: "67% trial leads never followed up", source: "IHRSA" },
    tags: ["Memberships", "PT Booking", "Retention"],
    customLink: "/gym",
  },
].map(niche => ({
  ...niche,
  available: nicheConfig[niche.id]?.enabled || false,
  link: niche.customLink || `/niche/${niche.id}`,
}));

const categories = ["All", "Home Services", "Professional Services", "Healthcare", "Logistics", "Food Service", "Fitness"];

const NicheCard = ({ niche, index }: { niche: any; index: number }) => {
  const navigate = useNavigate();
  const { ref, style, onMouseMove, onMouseLeave } = use3DCard(10);
  const Icon = niche.icon;
  const iconConfig = industryIcons[niche.id as keyof typeof industryIcons] || industryIcons.general;

  const handleClick = () => {
    if (niche.available && niche.link) {
      navigate(`${niche.link}?source=directory`);
    }
  };

  return (
    <FloatingIsland delay={index * 0.05} intensity="low">
      <motion.div
        ref={ref as any}
        style={style}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: index * 0.05, duration: 0.5 }}
        onClick={handleClick}
        className={`perspective-1000 ${niche.available ? "cursor-pointer" : "cursor-not-allowed"}`}
      >
        <GlassCard hover={niche.available} className="relative h-full overflow-hidden group border-gradient hover-lift-intense">
          {/* Gradient Background on Hover */}
          <motion.div 
            className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-10"
            transition={{ duration: 0.5 }}
          />

          {/* Coming Soon Badge */}
          {!niche.available && (
            <div className="absolute top-4 right-4 z-10">
              <Badge variant="secondary" className="glass-card-premium shadow-glow-sm">
                Coming Soon
              </Badge>
            </div>
          )}

          {/* Premium Icon */}
          <div className="relative z-10 mb-4">
            <PremiumIcon
              icon={Icon}
              style={iconConfig.style}
              gradient={iconConfig.gradient}
              size="lg"
              animate={niche.available}
            />
          </div>

        {/* Content */}
        <h3 className="text-2xl font-black mb-3 group-hover:text-gradient-premium transition-all duration-300 relative z-10">
          {niche.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 relative z-10 group-hover:text-foreground transition-colors">
          {niche.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 relative z-10">
          {niche.tags.map((tag) => (
            <motion.div
              key={tag}
              whileHover={{ scale: 1.1 }}
              className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20 shadow-glow-sm"
            >
              {tag}
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="pt-4 border-t border-border/50 relative z-10">
          <motion.div 
            className="text-xs"
            whileHover={{ scale: 1.02 }}
          >
            <span className="font-bold text-sm text-foreground block mb-1">{niche.stats.metric}</span>
            <span className="text-[10px] text-muted-foreground">Source: {niche.stats.source}</span>
          </motion.div>
        </div>

        {/* Arrow indicator for available */}
        {niche.available && (
          <motion.div
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            whileHover={{ x: 5, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center shadow-glow">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </motion.div>
        )}
      </GlassCard>
      </motion.div>
    </FloatingIsland>
  );
};

const NicheDirectory = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Category mapping for filtering
  const categoryMap: Record<string, string[]> = {
    "All": [],
    "Home Services": ["hvac", "roofing"],
    "Professional Services": ["accounting", "legal"],
    "Healthcare": ["healthcare"],
    "Logistics": ["logistics"],
    "Food Service": ["restaurants"],
    "Fitness": ["gym"],
  };

  const filteredNiches = niches.filter((niche) => {
    const matchesSearch = niche.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      niche.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || 
      (categoryMap[activeCategory] || []).includes(niche.id);
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="solutions" className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 rounded-full glass-card text-sm font-medium shadow-glow-sm">
              <Sparkles className="inline w-4 h-4 mr-2" />
              AI Agent Marketplace
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            Choose Your{" "}
            <span className="text-gradient-premium">AI Agent Realm</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Specialized AI agents trained for your specific industry needs
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search industries, use cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 glass-card border-glass-border shadow-card text-lg"
            />
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "glass-card hover:shadow-card"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Niches Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={searchQuery + activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {filteredNiches.map((niche, index) => (
              <NicheCard key={niche.id} niche={niche} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <GlassCard className="inline-block p-8 shadow-dramatic">
            <h3 className="text-3xl font-black mb-4">
              Don't see your <span className="text-gradient-premium">industry?</span>
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              We're constantly expanding. Request a custom AI agent for your specific needs.
            </p>
            <MagneticButton 
              size="lg" 
              className="shadow-premium hover:shadow-glow-intense bg-gradient-premium text-lg px-10 h-16"
              strength={30}
            >
              Request Custom AI Realm
            </MagneticButton>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default NicheDirectory;
