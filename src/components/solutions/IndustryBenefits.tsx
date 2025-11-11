import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { AnimatedCounter } from "@/components/enhanced/AnimatedCounter";
import { ExpandedNicheSolution } from "@/data/solutionsExpanded";
import { useIsMobile } from "@/hooks/use-mobile";

interface IndustryBenefitsProps {
  solution: ExpandedNicheSolution;
}

export const IndustryBenefits = ({ solution }: IndustryBenefitsProps) => {
  const isMobile = useIsMobile();
  
  const getButtonVariant = (type: string) => {
    switch (type) {
      case "primary":
        return "bg-gradient-primary";
      case "secondary":
        return "outline";
      case "calculator":
        return "bg-gradient-to-r from-accent to-primary";
      case "demo":
        return "bg-gradient-to-r from-primary to-accent";
      default:
        return "bg-gradient-primary";
    }
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary uppercase">Results You'll See</span>
          </div>
          <h2 className="text-4xl font-black mb-4">
            How AI Transforms Your {solution.name}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real solutions with measurable results - each benefit includes specific metrics and next steps
          </p>
        </motion.div>

        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />

        <motion.div
          className="grid md:grid-cols-2 gap-8 relative z-10"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
              }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {solution.benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 50,
                  scale: 0.9,
                  rotateX: -15
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotateX: 0,
                  transition: {
                    type: "spring",
                    damping: 20,
                    stiffness: 100,
                    duration: 0.6
                  }
                }
              }}
            >
              <motion.div
                whileHover={{
                  scale: isMobile ? 1 : 1.03,
                  y: isMobile ? 0 : -8,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                  }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <GlassCard hover className="p-8 h-full flex flex-col relative overflow-hidden group">
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)"
                    }}
                  />

                  <div className="mb-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4">
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                          rotate: [0, 5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2
                        }}
                      >
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </motion.div>
                      <motion.span
                        className="text-sm font-bold text-primary"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                      >
                        {benefit.metric}
                      </motion.span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-border relative z-10">
                    <MagneticButton
                      strength={isMobile ? 12 : 25}
                      onClick={() => {
                        if (benefit.cta.link.startsWith("http")) {
                          window.open(benefit.cta.link, "_blank");
                        } else {
                          window.location.href = benefit.cta.link;
                        }
                      }}
                      className={`${getButtonVariant(benefit.cta.type)} relative overflow-hidden group/btn`}
                      size="lg"
                    >
                      {/* Animated gradient shimmer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <span className="relative z-10 flex items-center gap-2">
                        {benefit.cta.text}
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </span>
                    </MagneticButton>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Backed by Industry Research</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {solution.socialProof.map((proof, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="text-3xl font-black text-primary mb-2">
                    "{proof.stat.split(" ")[0]}"
                  </div>
                  <p className="text-sm mb-3">{proof.stat}</p>
                  <p className="text-xs text-muted-foreground mb-2">Source: {proof.source}</p>
                  <p className="text-sm font-medium text-destructive">{proof.impact}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
