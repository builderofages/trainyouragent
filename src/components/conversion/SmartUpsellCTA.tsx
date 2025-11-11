import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SmartUpsellCTAProps {
  currentStage: number;
  industry: string;
  context?: "calculator" | "benefits" | "demo" | "exit";
  className?: string;
}

const upsellMessages = {
  1: {
    calculator: "Most {industry} companies add scheduling automation within 30 days of implementing voice agents.",
    benefits: "Once your calls are handled 24/7, the next step is automating your workflows to save even more time.",
    demo: "Love what you see? Imagine combining this with intelligent scheduling and CRM automation.",
    exit: "Before you go - see how {industry} leaders are automating entire workflows after starting with voice agents.",
  },
  2: {
    calculator: "With operations automated, {industry} companies typically add predictive analytics to double conversion rates.",
    benefits: "Now that workflows are automated, unlock business intelligence to identify your highest-value opportunities.",
    demo: "Ready to see how analytics could transform your decision-making?",
    exit: "You're looking at operations automation - want to see how intelligence layer could 2x your results?",
  },
  3: {
    calculator: "With intelligence in place, successful {industry} businesses add growth acceleration to scale 3x faster.",
    benefits: "You've optimized operations and insights - now it's time to accelerate growth with advanced marketing.",
    demo: "Imagine combining these insights with automated marketing campaigns and staff optimization.",
    exit: "You've seen the intelligence layer - discover how growth acceleration takes you to the next level.",
  },
  4: {
    calculator: "Top {industry} companies achieve market domination by adding SEO, custom portals, and expansion tools.",
    benefits: "You're scaling fast - now establish market dominance with advanced visibility and expansion capabilities.",
    demo: "Ready to explore how leaders in {industry} dominate their markets?",
    exit: "Before you leave - see how {industry} companies are achieving market domination.",
  },
};

const nextStageInfo = {
  1: { title: "Operations Enhancement", icon: TrendingUp, gradient: "from-cyan-500 to-teal-500" },
  2: { title: "Intelligence Layer", icon: Sparkles, gradient: "from-teal-500 to-green-500" },
  3: { title: "Growth Acceleration", icon: Sparkles, gradient: "from-green-500 to-emerald-500" },
  4: { title: "Market Domination", icon: Sparkles, gradient: "from-emerald-500 to-blue-500" },
};

export const SmartUpsellCTA = ({
  currentStage,
  industry,
  context = "benefits",
  className,
}: SmartUpsellCTAProps) => {
  const navigate = useNavigate();

  // Don't show if already at final stage
  if (currentStage >= 5) return null;

  const message = upsellMessages[currentStage as keyof typeof upsellMessages]?.[context]?.replace("{industry}", industry) || "";
  const nextStage = nextStageInfo[currentStage as keyof typeof nextStageInfo];

  if (!nextStage) return null;

  const Icon = nextStage.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn("my-8", className)}
    >
      <GlassCard hover className="p-6 relative overflow-hidden group cursor-pointer">
        {/* Animated background gradient */}
        <motion.div
          className={cn("absolute inset-0 bg-gradient-to-r opacity-10", `${nextStage.gradient}`)}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex-shrink-0"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Next Step in Your Journey
              </span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
            </div>
            <h4 className="font-bold text-lg mb-2">{nextStage.title}</h4>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>

          {/* CTA */}
          <MagneticButton
            strength={15}
            onClick={() => navigate('/solutions/configurator')}
            variant="outline"
            className="group/btn flex-shrink-0"
          >
            Explore Next Stage
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </MagneticButton>
        </div>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          }}
        />
      </GlassCard>
    </motion.div>
  );
};
