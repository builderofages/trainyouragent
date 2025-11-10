import { motion } from "framer-motion";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { Article } from "@/data/articles";

interface ArticleCardProps {
  article: Partial<Article>;
  index?: number;
}

export const ArticleCard = ({ article, index = 0 }: ArticleCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/resources/${article.slug}`}>
        <GlassCard hover className="p-6 h-full group cursor-pointer">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2">
                {article.category}
              </Badge>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
              {article.date && (
                <span>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              )}
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>

          {article.industries && article.industries.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              {article.industries.slice(0, 3).map((industry) => (
                <Badge key={industry} variant="outline" className="text-xs">
                  {industry}
                </Badge>
              ))}
            </div>
          )}

          {article.sources && article.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Sources: {article.sources.map(s => s.name.split(' - ')[0]).slice(0, 2).join(', ')}
                {article.sources.length > 2 && ` +${article.sources.length - 2} more`}
              </p>
            </div>
          )}
        </GlassCard>
      </Link>
    </motion.div>
  );
};
