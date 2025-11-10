import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { integrations, integrationCategories } from "@/data/integrations";

const Integrations = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesCategory =
      selectedCategory === "All" || integration.category === selectedCategory;
    const matchesSearch = integration.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const difficultyColors = {
    Easy: "bg-green-500/10 text-green-700 dark:text-green-400",
    Medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    Advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-[0.03]" />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Integrate with{" "}
              <span className="text-gradient">Your Existing Tools</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect seamlessly with 50+ platforms. Custom integrations available via API.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-6 border-b border-border">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {integrationCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-6 py-2 text-sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          {filteredIntegrations.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No integrations found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration, index) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard hover className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{integration.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {integration.category}
                        </Badge>
                      </div>
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">
                      {integration.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <Badge
                        className={difficultyColors[integration.difficulty]}
                        variant="secondary"
                      >
                        {integration.difficulty}
                      </Badge>
                      {integration.url && (
                        <a
                          href={integration.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Learn More <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom Integrations CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto">
          <GlassCard className="p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Don't See Your Tool?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              We build custom integrations for your specific needs. Our API makes it easy to
              connect with any platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/trainyouragent"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-primary text-white font-semibold rounded-full hover:shadow-glow transition-all duration-300"
              >
                Request Integration
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                View API Docs
              </a>
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Integrations;
