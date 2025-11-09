import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Wrench, Calculator, Home, Briefcase, Heart, Truck, Utensils, Sparkles, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { use3DCard } from "@/hooks/use3DCard";
import { useNavigate } from "react-router-dom";
import { nicheConfig } from "@/config/niches";

const niches = [
  {
    id: "hvac",
    icon: Wrench,
    title: "HVAC Specialists",
    description: "Automate appointments, quotes, and emergency service coordination",
    color: "from-blue-500 to-cyan-500",
    stats: { users: "2.5K+", satisfaction: "98%" },
    tags: ["Lead Gen", "Scheduling", "24/7"],
  },
  {
    id: "accounting",
    icon: Calculator,
    title: "Accounting Firms",
    description: "Streamline client onboarding, document collection, and consultation booking",
    color: "from-green-500 to-emerald-500",
    stats: { users: "1.8K+", satisfaction: "97%" },
    tags: ["Onboarding", "Documents", "Scheduling"],
  },
  {
    id: "roofing",
    icon: Home,
    title: "Roofing Contractors",
    description: "Qualify leads, schedule inspections, and provide instant estimates",
    color: "from-orange-500 to-red-500",
    stats: { users: "Coming Soon", satisfaction: "—" },
    tags: ["Estimates", "Inspections", "Lead Qual"],
  },
  {
    id: "legal",
    icon: Briefcase,
    title: "Law Firms",
    description: "Screen potential clients, gather case details, schedule consultations",
    color: "from-purple-500 to-indigo-500",
    stats: { users: "Coming Soon", satisfaction: "—" },
    tags: ["Screening", "Intake", "Booking"],
  },
  {
    id: "healthcare",
    icon: Heart,
    title: "Healthcare Practices",
    description: "Patient intake, appointment management, and follow-up automation",
    color: "from-pink-500 to-rose-500",
    stats: { users: "Coming Soon", satisfaction: "—" },
    tags: ["Intake", "Scheduling", "Follow-ups"],
  },
  {
    id: "logistics",
    icon: Truck,
    title: "Logistics & Shipping",
    description: "Quote generation, shipment tracking, and customer service automation",
    color: "from-yellow-500 to-amber-500",
    stats: { users: "Coming Soon", satisfaction: "—" },
    tags: ["Quotes", "Tracking", "Support"],
  },
  {
    id: "restaurants",
    icon: Utensils,
    title: "Restaurants & Catering",
    description: "Reservation management, catering inquiries, and menu assistance",
    color: "from-red-500 to-pink-500",
    stats: { users: "Coming Soon", satisfaction: "—" },
    tags: ["Reservations", "Catering", "Menu"],
  },
].map(niche => ({
  ...niche,
  available: nicheConfig[niche.id]?.enabled || false,
  link: `/niche/${niche.id}`,
}));

const categories = ["All", "Home Services", "Professional Services", "Healthcare", "Logistics", "Food Service"];

const NicheCard = ({ niche, index }: { niche: any; index: number }) => {
  const navigate = useNavigate();
  const { ref, style, onMouseMove, onMouseLeave } = use3DCard(6);
  const Icon = niche.icon;

  const handleClick = () => {
    if (niche.available && niche.link) {
      navigate(niche.link);
    }
  };

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
      onClick={handleClick}
      className={`perspective-1000 ${niche.available ? "cursor-pointer" : "cursor-not-allowed"}`}
    >
      <GlassCard hover={niche.available} className="relative h-full overflow-hidden group">
        {/* Gradient Background on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${niche.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

        {/* Coming Soon Badge */}
        {!niche.available && (
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="secondary" className="glass-card">
              Coming Soon
            </Badge>
          </div>
        )}

        {/* Icon */}
        <motion.div
          whileHover={niche.available ? { scale: 1.1, rotate: 5 } : {}}
          transition={{ type: "spring", stiffness: 300 }}
          className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${niche.color} mb-4 shadow-lg`}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {niche.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {niche.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {niche.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center pt-4 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{niche.stats.users}</span> users
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{niche.stats.satisfaction}</span> satisfaction
          </div>
        </div>

        {/* Arrow indicator for available */}
        {niche.available && (
          <motion.div
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ x: 5 }}
          >
            <ArrowRight className="w-5 h-5 text-primary" />
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  );
};

const NicheDirectory = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNiches = niches.filter((niche) => {
    const matchesSearch = niche.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      niche.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || true; // Simplified for now
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your{" "}
            <span className="text-gradient">AI Agent Realm</span>
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
            <h3 className="text-2xl font-bold mb-4">
              Don't see your industry?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              We're constantly expanding. Request a custom AI agent for your specific needs.
            </p>
            <MagneticButton size="lg" className="shadow-blue hover:shadow-glow">
              Request Custom AI Realm
            </MagneticButton>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default NicheDirectory;
