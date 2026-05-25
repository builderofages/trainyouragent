import { motion } from "framer-motion";
import { ArrowRight, Zap, RotateCcw, Check, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGradientMesh } from "./AnimatedGradientMesh";
import { siteConfig } from "@/config/site";

export const FinalCTA = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <AnimatedGradientMesh />

      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Headline */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Every Minute You Wait,
          <br />
          Leads Are Calling Someone Else
        </motion.h2>

        {/* Subheadline */}
        <motion.div
          className="text-lg md:text-xl text-slate-700 mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <p>You've got two choices:</p>
          <p className="text-slate-700">Keep losing leads to voicemail.</p>
          <p className="text-white font-semibold">Or fix it this week.</p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Button
            size="lg"
            onClick={() => window.open(siteConfig.bookingUrl, "_blank")}
            className="bg-white text-deep-space hover:bg-white/90 font-semibold px-8 py-6 text-lg
                       shadow-[0_0_40px_hsla(0,0%,100%,0.3)] hover:shadow-[0_0_60px_hsla(0,0%,100%,0.4)]
                       transition-all duration-300"
          >
            Book a 30-min build call → leave with a plan
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.open(siteConfig.bookingUrl, "_blank")}
            className="border-[#042C53]/20 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg
                       backdrop-blur-sm transition-all duration-300 hover:border-[#042C53]/40"
          >
Talk to a live AI agent → 60 sec, no signup
          </Button>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-slate-700 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-tech-cyan" />
            <span>5-day setup</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-tech-cyan" />
            <span>Month-to-month</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-tech-cyan" />
            <span>30-day guarantee</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-tech-cyan" />
            <span>ROI or refund</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
