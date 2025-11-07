import { useState } from "react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { AnimatedCounter } from "@/components/enhanced/AnimatedCounter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, DollarSign, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { use3DCard } from "@/hooks/use3DCard";

const ResultCard = ({ icon: Icon, label, value, color, delay }: any) => {
  const { ref, style, onMouseMove, onMouseLeave } = use3DCard(8);

  return (
    <motion.div
      ref={ref as any}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring" }}
      className="perspective-1000"
    >
      <GlassCard hover className={`p-6 hover-lift ${color}`}>
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="text-4xl font-bold">
          {value}
        </div>
      </GlassCard>
    </motion.div>
  );
};

const ROICalculator = () => {
  const [monthlyLeads, setMonthlyLeads] = useState(100);
  const [conversionRate, setConversionRate] = useState(7);
  const [avgJobValue, setAvgJobValue] = useState(500);

  // Calculations
  const missedLeadsPercentage = 60;
  const currentMissedLeads = Math.round((monthlyLeads * missedLeadsPercentage) / 100);
  const recoveredLeads = Math.round(currentMissedLeads * 0.85);
  const additionalConversions = Math.round((recoveredLeads * conversionRate) / 100);
  const monthlyROI = additionalConversions * avgJobValue;
  const yearlyROI = monthlyROI * 12;
  const costPerMonth = 97;
  const netMonthlyProfit = monthlyROI - costPerMonth;
  const roiMultiplier = Math.round(netMonthlyProfit / costPerMonth);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="inline-block mb-4"
        >
          <span className="px-4 py-2 rounded-full glass-card text-sm font-medium shadow-glow-sm">
            <Sparkles className="inline w-4 h-4 mr-2" />
            Calculate Your Returns
          </span>
        </motion.div>
        <h3 className="text-4xl md:text-5xl font-bold mb-4">
          ROI <span className="text-gradient">Calculator</span>
        </h3>
        <p className="text-xl text-muted-foreground">
          See how much revenue you're leaving on the table
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Inputs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8 shadow-dramatic">
            <h4 className="text-xl font-bold mb-6">Your Business Metrics</h4>
            <div className="space-y-8">
              <div>
                <Label className="text-base mb-3 block font-semibold">
                  Monthly Leads: <span className="text-primary">{monthlyLeads}</span>
                </Label>
                <Slider
                  value={[monthlyLeads]}
                  onValueChange={(v) => setMonthlyLeads(v[0])}
                  min={10}
                  max={500}
                  step={10}
                  className="mb-3"
                />
                <Input
                  type="number"
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                  className="glass-card border-glass-border h-12 text-lg"
                />
              </div>

              <div>
                <Label className="text-base mb-3 block font-semibold">
                  Conversion Rate: <span className="text-primary">{conversionRate}%</span>
                </Label>
                <Slider
                  value={[conversionRate]}
                  onValueChange={(v) => setConversionRate(v[0])}
                  min={1}
                  max={20}
                  step={0.5}
                  className="mb-3"
                />
                <Input
                  type="number"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="glass-card border-glass-border h-12 text-lg"
                />
              </div>

              <div>
                <Label className="text-base mb-3 block font-semibold">
                  Average Job Value: <span className="text-primary">${avgJobValue}</span>
                </Label>
                <Slider
                  value={[avgJobValue]}
                  onValueChange={(v) => setAvgJobValue(v[0])}
                  min={100}
                  max={5000}
                  step={50}
                  className="mb-3"
                />
                <Input
                  type="number"
                  value={avgJobValue}
                  onChange={(e) => setAvgJobValue(Number(e.target.value))}
                  className="glass-card border-glass-border h-12 text-lg"
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <ResultCard
            icon={Users}
            label="Recovered Leads/Month"
            value={<AnimatedCounter end={recoveredLeads} prefix="+" />}
            color="text-blue-500"
            delay={0.1}
          />

          <ResultCard
            icon={TrendingUp}
            label="Additional Customers/Month"
            value={<AnimatedCounter end={additionalConversions} prefix="+" />}
            color="text-green-500"
            delay={0.2}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <GlassCard className="p-8 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 border-2 border-primary/30 shadow-glow hover:shadow-glow transition-all duration-500">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <DollarSign className="w-8 h-8 text-primary" />
                </motion.div>
                <span className="text-sm font-medium text-muted-foreground">
                  Additional Monthly Revenue
                </span>
              </div>
              <div className="text-5xl font-bold text-gradient mb-2">
                $<AnimatedCounter end={monthlyROI} />
              </div>
              <div className="text-lg text-muted-foreground">
                $<AnimatedCounter end={yearlyROI} />/year
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <GlassCard className="text-center p-6 shadow-dramatic">
              <div className="text-sm text-muted-foreground mb-2">
                ROI Multiple
              </div>
              <div className="text-4xl font-bold">
                <AnimatedCounter end={roiMultiplier} suffix="x" className="text-gradient" />
                <span className="text-gradient"> Return</span>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8 text-sm text-muted-foreground glass-card p-4 rounded-xl inline-block mx-auto"
      >
        📊 Based on industry averages: 60% of leads call after hours, AI captures 85% of those
      </motion.div>
    </div>
  );
};

export default ROICalculator;
