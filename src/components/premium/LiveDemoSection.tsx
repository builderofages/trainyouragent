import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VoiceAgentDemo } from "@/components/VoiceAgentDemo";

const industries = [
  { value: "gym", label: "Gym & Fitness" },
  { value: "hvac", label: "HVAC & Home Services" },
  { value: "healthcare", label: "Healthcare" },
  { value: "legal", label: "Legal" },
  { value: "real-estate", label: "Real Estate" },
  { value: "other", label: "Other" },
];

const features = [
  "Responds in under 1 second",
  "Handles interruptions naturally",
  "Books appointments in real-time",
  "Trained specifically for your industry",
];

const suggestions = [
  "What services do you offer?",
  "Can I book an appointment?",
  "What are your prices?",
];

export const LiveDemoSection = () => {
  const [selectedIndustry, setSelectedIndustry] = useState("gym");

  return (
    <section id="live-demo" className="relative py-24 md:py-32 bg-surface overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-surface" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Left side - Pitch */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Tag */}
            <span className="text-trust-blue text-sm font-semibold tracking-widest uppercase mb-4 block">
              Don't Trust Us. Test Us.
            </span>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-black text-text-primary leading-tight mb-6">
              Talk to Our AI.
              <br />
              Right Now.
              <br />
              <span className="text-text-secondary">No Signup Required.</span>
            </h2>

            {/* Body */}
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              This isn't a recording. This isn't a chatbot.
              <br />
              This is the exact AI that could be answering your business phone tomorrow.
            </p>

            <p className="text-text-secondary mb-8">
              Go ahead. Try to stump it.
              <br />
              Ask it anything about our services.
              <br />
              <span className="font-semibold text-text-primary">Be skeptical. We dare you.</span>
            </p>

            {/* Features */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <div className="w-5 h-5 rounded-full bg-success-green/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-success-green" />
                  </div>
                  <span className="text-text-primary">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Demo Widget */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Industry selector */}
            <div className="mb-4">
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="w-full bg-white border-border text-text-primary">
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary text-sm">Select Your Industry</span>
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Demo widget frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-trust-blue via-tech-cyan to-trust-blue rounded-2xl opacity-20 blur-xl" />
              
            {/* Widget */}
            <div className="relative bg-deep-space rounded-2xl p-8">
              <VoiceAgentDemo defaultIndustry={selectedIndustry} />
            </div>
          </div>

            {/* Suggestion bubbles */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  className="px-4 py-2 text-sm text-text-secondary bg-white border border-border 
                           rounded-full hover:border-trust-blue hover:text-trust-blue transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  "{suggestion}"
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
