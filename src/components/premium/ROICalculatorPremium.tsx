import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { siteConfig } from "@/config/site";

const industries = [
  { value: "gym", label: "Gym & Fitness", avgValue: 800 },
  { value: "hvac", label: "HVAC", avgValue: 500 },
  { value: "healthcare", label: "Healthcare", avgValue: 600 },
  { value: "legal", label: "Legal", avgValue: 2500 },
  { value: "real-estate", label: "Real Estate", avgValue: 3000 },
  { value: "restaurant", label: "Restaurant", avgValue: 150 },
];

export const ROICalculatorPremium = () => {
  const [callsPerWeek, setCallsPerWeek] = useState(50);
  const [missedRate, setMissedRate] = useState(30);
  const [avgValue, setAvgValue] = useState(500);
  const [industry, setIndustry] = useState("hvac");
  
  const [animatedMonthly, setAnimatedMonthly] = useState(0);
  const [animatedAnnual, setAnimatedAnnual] = useState(0);
  const [animatedROI, setAnimatedROI] = useState(0);

  // Calculate results
  const missedCallsPerMonth = Math.round((callsPerWeek * 4) * (missedRate / 100));
  const monthlyLoss = missedCallsPerMonth * avgValue;
  const annualLoss = monthlyLoss * 12;
  const monthlyInvestment = 997; // Growth plan
  const roi = Math.round(((monthlyLoss - monthlyInvestment) / monthlyInvestment) * 100);

  // Animate numbers
  useEffect(() => {
    const duration = 500;
    const steps = 30;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedMonthly(Math.round(monthlyLoss * easeOut));
      setAnimatedAnnual(Math.round(annualLoss * easeOut));
      setAnimatedROI(Math.round(roi * easeOut));
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, [monthlyLoss, annualLoss, roi]);

  // Update avg value when industry changes
  useEffect(() => {
    const selectedIndustry = industries.find(i => i.value === industry);
    if (selectedIndustry) {
      setAvgValue(selectedIndustry.avgValue);
    }
  }, [industry]);

  return (
    <section id="roi-calculator" className="relative py-24 md:py-32 bg-surface overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-trust-blue/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Tag */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-trust-blue text-sm font-semibold tracking-widest uppercase">
            Do The Math
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-4xl md:text-5xl font-black text-text-primary text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          How Much Are You Losing?
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left - Inputs */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Calls per week */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <label className="font-semibold text-text-primary">Calls Per Week</label>
                <span className="text-trust-blue font-bold">{callsPerWeek} calls</span>
              </div>
              <Slider
                value={[callsPerWeek]}
                onValueChange={(v) => setCallsPerWeek(v[0])}
                min={10}
                max={200}
                step={5}
                className="w-full"
              />
            </div>

            {/* Missed rate */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <label className="font-semibold text-text-primary">Missed Call Rate</label>
                <span className="text-trust-blue font-bold">{missedRate}%</span>
              </div>
              <Slider
                value={[missedRate]}
                onValueChange={(v) => setMissedRate(v[0])}
                min={10}
                max={70}
                step={5}
                className="w-full"
              />
            </div>

            {/* Avg value */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <label className="font-semibold text-text-primary">Average Customer Value</label>
                <span className="text-trust-blue font-bold">${avgValue}</span>
              </div>
              <Slider
                value={[avgValue]}
                onValueChange={(v) => setAvgValue(v[0])}
                min={50}
                max={5000}
                step={50}
                className="w-full"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="font-semibold text-text-primary block mb-3">Your Industry</label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind.value} value={ind.value}>
                      {ind.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Right - Results */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {/* Monthly loss */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-l-4 border-destructive">
              <p className="text-text-secondary text-sm font-semibold uppercase tracking-wide mb-2">
                Monthly Revenue At Risk
              </p>
              <p className="text-4xl md:text-5xl font-black text-destructive mb-2">
                ${animatedMonthly.toLocaleString()}
              </p>
              <p className="text-text-secondary">
                That's {missedCallsPerMonth} customers walking to your competitors every month.
              </p>
            </div>

            {/* Annual loss */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-l-4 border-warning-orange">
              <p className="text-text-secondary text-sm font-semibold uppercase tracking-wide mb-2">
                Annual Impact
              </p>
              <p className="text-4xl md:text-5xl font-black text-warning-orange mb-2">
                ${animatedAnnual.toLocaleString()}
              </p>
              <p className="text-text-secondary">
                That's a salary. A vehicle. An expansion budget.
              </p>
            </div>

            {/* ROI */}
            <div className="bg-gradient-to-r from-trust-blue to-tech-cyan rounded-2xl p-8 shadow-xl text-white">
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wide mb-2">
                ROI With Us
              </p>
              <p className="text-4xl md:text-5xl font-black mb-2">
                {animatedROI > 0 ? animatedROI : 0}%
              </p>
              <p className="text-white/80">
                Pay ${monthlyInvestment}/mo. Recover ${animatedMonthly.toLocaleString()}+/mo.
                <br />
                <span className="font-semibold text-white">That's not an expense. It's a money machine.</span>
              </p>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className="w-full bg-trust-blue hover:bg-trust-blue/90 text-white font-semibold py-6 text-lg"
              onClick={() => window.open(siteConfig.bookingUrl, "_blank")}
            >
              Let's Fix This → Book Your Call
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
