import { motion } from "framer-motion";
import { BookOpen, Search, Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { ArticleCard } from "@/components/ArticleCard";
import { ResearchLibrary } from "@/components/ResearchLibrary";
import { articles } from "@/data/articles";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const allArticles = articles;
  const categories = ["All", "AI Research", "Industry Research", "Sales Research", "Business Analysis"];

  const filteredArticles = selectedCategory === "All" 
    ? allArticles 
    : allArticles.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Research-Backed Insights</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Resources & Research</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Data-driven articles backed by research from McKinsey, Gartner, Harvard Business Review, and industry leaders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-y border-border bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-6 py-2"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredArticles.map((article, index) => (
              <ArticleCard key={article.slug} article={article} index={index} />
            ))}
          </div>
        </div>
      </section>

      <ResearchLibrary />

      <Footer />
    </div>
  );
};

export default Resources;
