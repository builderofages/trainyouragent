import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, ExternalLink, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { articles } from "@/data/articles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/enhanced/GlassCard";
import NotFound from "./NotFound";

const ResourceArticle = () => {
  const { slug } = useParams();
  const article = articles.find(a => a.slug === slug);

  if (!article || !article.content) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to="/resources" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Resources
            </Link>

            <Badge className="mb-4">{article.category}</Badge>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
              <span>{article.author}</span>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              {article.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={index} className="text-4xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>;
                } else if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.slice(3)}</h2>;
                } else if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.slice(4)}</h3>;
                } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <p key={index} className="font-bold text-xl my-4">{paragraph.slice(2, -2)}</p>;
                } else if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n');
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 my-4">
                      {items.map((item, i) => (
                        <li key={i}>{item.slice(2)}</li>
                      ))}
                    </ul>
                  );
                } else {
                  return <p key={index} className="my-4 leading-relaxed">{paragraph}</p>;
                }
              })}
            </div>

            {article.sources && article.sources.length > 0 && (
              <GlassCard className="p-8 mb-12">
                <h3 className="text-2xl font-bold mb-4">Sources & Citations</h3>
                <p className="text-muted-foreground mb-6">
                  All data in this article comes from published research and industry reports:
                </p>
                <div className="space-y-3">
                  {article.sources.map((source, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <ExternalLink className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                          {source.name}
                        </a>
                        <p className="text-sm text-muted-foreground">Published: {source.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ResourceArticle;
