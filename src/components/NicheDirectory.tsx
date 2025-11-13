import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Wrench, Calculator, Home, ArrowRight, Scale, Heart, UtensilsCrossed, Truck, GlassWater } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const niches = [
  {
    id: 1,
    icon: Wrench,
    title: "HVAC AI Agents",
    description: "Transform HVAC operations with intelligent scheduling, customer communication, and predictive maintenance.",
    color: "from-blue-500 to-blue-600",
    stats: { metric: "85% capture rate", source: "Industry Benchmark" },
    tags: ["Lead Gen", "Scheduling", "Analytics"],
    available: true,
    link: "/hvac",
  },
  {
    id: 2,
    icon: Calculator,
    title: "Accounting AI Agents",
    description: "Automate bookkeeping, expense tracking, and financial forecasting with precision AI assistance.",
    color: "from-emerald-500 to-emerald-600",
    stats: { metric: "60% miss after-hours calls", source: "CallRail Study" },
    tags: ["Automation", "Reporting", "Compliance"],
    available: true,
    link: "/accounting",
  },
  {
    id: 3,
    icon: Home,
    title: "Roofing AI Agents",
    description: "Streamline project management, customer quotes, and crew coordination for roofing businesses.",
    color: "from-orange-500 to-orange-600",
    stats: { metric: "62% never call back", source: "Harvard Business Review" },
    tags: ["Project Mgmt", "Quotes", "Crew Ops"],
    available: true,
    link: "/roofing",
  },
  {
    id: 4,
    icon: Scale,
    title: "Legal AI Agents",
    description: "Intelligent case intake, client qualification, and consultation scheduling for law firms.",
    color: "from-purple-500 to-purple-600",
    stats: { metric: "48% miss lead calls", source: "CallRail Legal" },
    tags: ["Case Intake", "Scheduling", "Qualification"],
    available: true,
    link: "/legal",
  },
  {
    id: 5,
    icon: Heart,
    title: "Healthcare AI Agents",
    description: "HIPAA-compliant appointment scheduling, patient triage, and prescription refill automation.",
    color: "from-red-500 to-red-600",
    stats: { metric: "55% after-hours miss", source: "Healthcare Analytics" },
    tags: ["Appointments", "Triage", "HIPAA"],
    available: true,
    link: "/healthcare",
  },
  {
    id: 6,
    icon: UtensilsCrossed,
    title: "Restaurant AI Agents",
    description: "Reservation management, takeout orders, and event bookings with dietary restriction tracking.",
    color: "from-amber-500 to-amber-600",
    stats: { metric: "68% call volume peaks", source: "Restaurant Tech" },
    tags: ["Reservations", "Orders", "Events"],
    available: true,
    link: "/restaurants",
  },
  {
    id: 7,
    icon: Truck,
    title: "Logistics AI Agents",
    description: "Quote requests, shipment tracking, and load scheduling for transportation companies.",
    color: "from-indigo-500 to-indigo-600",
    stats: { metric: "72% after-hours inquiries", source: "Logistics Today" },
    tags: ["Quotes", "Tracking", "Scheduling"],
    available: true,
    link: "/logistics",
  },
  {
    id: 8,
    icon: GlassWater,
    title: "Bars & Nightclubs AI",
    description: "VIP reservations, event RSVPs, and bottle service bookings with guest list management.",
    color: "from-primary to-accent",
    stats: { metric: "80% weekend call surge", source: "Hospitality Insights" },
    tags: ["Events", "VIP", "Reservations"],
    available: true,
    link: "/bars-nightclubs",
  },
];

const categories = ["All Industries", "HVAC", "Accounting", "Roofing", "Custom"];

const NicheDirectory = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Industries");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const filteredNiches = niches.filter((niche) => {
    const matchesCategory = activeCategory === "All Industries" || niche.title.includes(activeCategory);
    const matchesSearch = niche.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         niche.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="solutions" className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Discover Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-primary">
              Perfect AI Realm
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Industry-specific AI agents tailored to your unique business challenges
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-12 space-y-6"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for your industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-full border-2 border-border focus:border-primary transition-all duration-300 shadow-sm focus:shadow-blue"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-gradient-primary text-white shadow-blue"
                    : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Niche Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {filteredNiches.map((niche, index) => (
              <motion.div
                key={niche.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(niche.id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card className="relative group overflow-hidden bg-card border-2 border-border hover:border-primary transition-all duration-500 shadow-card hover:shadow-blue h-[420px] flex flex-col">
                  {/* Gradient Background on Hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCard === niche.id ? 0.05 : 0 }}
                    className={`absolute inset-0 bg-gradient-to-br ${niche.color}`}
                  />

                  <div className="p-8 relative z-10 flex-1 flex flex-col">
                    {/* Icon - Fixed height */}
                    <div className="flex-none mb-6">
                      <motion.div
                        animate={{
                          rotateY: hoveredCard === niche.id ? 360 : 0,
                        }}
                        transition={{ duration: 0.6 }}
                        className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${niche.color} rounded-2xl shadow-lg`}
                      >
                        <niche.icon className="w-8 h-8 text-white" />
                      </motion.div>
                    </div>

                    {/* Content that grows */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-2xl font-black text-foreground mb-3">
                        {niche.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed flex-1">
                        {niche.description}
                      </p>
                    </div>

                    {/* Fixed bottom section */}
                    <div className="flex-none space-y-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {niche.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-secondary text-foreground text-xs font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {niche.stats.metric}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Source: {niche.stats.source}
                        </p>
                      </div>

                      {/* CTA Button */}
                      <Button
                        className="w-full rounded-full group/btn bg-gradient-primary hover:shadow-blue"
                        onClick={() => niche.link && navigate(`${niche.link}?source=directory`)}
                      >
                        Explore Solutions
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Custom Solution CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 p-8 md:p-12 text-center">
            <h3 className="text-3xl font-black text-foreground mb-4">
              Don't See Your Industry?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We build custom AI agent solutions tailored to your unique business needs. 
              Let's create your perfect AI ecosystem together.
            </p>
            <Button size="lg" className="rounded-full bg-gradient-primary hover:shadow-blue text-lg px-8">
              Request Custom AI Realm
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default NicheDirectory;
