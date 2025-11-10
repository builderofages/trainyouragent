import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Clock, TrendingUp, Zap, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/enhanced/AnimatedCounter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const LeadResponseCalculator = () => {
  const [currentResponseTime, setCurrentResponseTime] = useState("1-5min");
  const [desiredResponseTime, setDesiredResponseTime] = useState("instant");
  const [monthlyLeads, setMonthlyLeads] = useState(100);
  const [conversionRate, setConversionRate] = useState(2.5);
  const [customerLifetimeValue, setCustomerLifetimeValue] = useState(1500);

  // Response time multipliers based on InsideSales.com research
  const responseMultipliers: Record<string, { multiplier: number; label: string; color: string }> = {
    "instant": { multiplier: 1.0, label: "Instant (< 1 min)", color: "text-green-500" },
    "1-5min": { multiplier: 0.90, label: "1-5 minutes", color: "text-blue-500" },
    "5-10min": { multiplier: 0.50, label: "5-10 minutes", color: "text-yellow-500" },
    "10-30min": { multiplier: 0.30, label: "10-30 minutes", color: "text-orange-500" },
    "30-60min": { multiplier: 0.15, label: "30-60 minutes", color: "text-red-500" },
    "1-24hr": { multiplier: 0.10, label: "1-24 hours", color: "text-red-600" },
    "24hr+": { multiplier: 0.02, label: "24+ hours", color: "text-destructive" },
  };

  const currentMultiplier = responseMultipliers[currentResponseTime].multiplier;
  const desiredMultiplier = responseMultipliers[desiredResponseTime].multiplier;
  
  const baseConversionRate = conversionRate / currentMultiplier;
  const currentConversions = (monthlyLeads * conversionRate) / 100;
  const improvedConversionRate = baseConversionRate * desiredMultiplier;
  const improvedConversions = (monthlyLeads * improvedConversionRate) / 100;
  const additionalConversions = improvedConversions - currentConversions;
  const monthlyRevenueImpact = additionalConversions * customerLifetimeValue;
  const annualRevenueImpact = monthlyRevenueImpact * 12;
  const improvementPercent = ((improvedConversionRate - conversionRate) / conversionRate) * 100;

  return (
    <Card className="p-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Clock className="w-8 h-8 text-primary" />
          <h3 className="text-3xl font-bold">Lead Response Time Impact Calculator</h3>
        </div>
        <p className="text-muted-foreground">
          See how faster response times dramatically increase conversions
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <Label className="text-base mb-3 block">
              Current Average Response Time
            </Label>
            <Select value={currentResponseTime} onValueChange={setCurrentResponseTime}>
              <SelectTrigger className="h-12 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(responseMultipliers).map(([key, value]) => (
                  <SelectItem key={key} value={key} className="text-base">
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className={`text-sm mt-2 font-medium ${responseMultipliers[currentResponseTime].color}`}>
              Current conversion multiplier: {(currentMultiplier * 100).toFixed(0)}%
            </p>
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Desired Response Time
            </Label>
            <Select value={desiredResponseTime} onValueChange={setDesiredResponseTime}>
              <SelectTrigger className="h-12 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(responseMultipliers).map(([key, value]) => (
                  <SelectItem key={key} value={key} className="text-base">
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className={`text-sm mt-2 font-medium ${responseMultipliers[desiredResponseTime].color}`}>
              Target conversion multiplier: {(desiredMultiplier * 100).toFixed(0)}%
            </p>
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Monthly Inbound Leads
            </Label>
            <Input
              type="number"
              value={monthlyLeads}
              onChange={(e) => setMonthlyLeads(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[monthlyLeads]}
              onValueChange={(v) => setMonthlyLeads(v[0])}
              min={10}
              max={1000}
              step={10}
              className="mt-3"
            />
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Current Conversion Rate (%)
            </Label>
            <Input
              type="number"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="text-lg h-12"
              step="0.1"
            />
            <Slider
              value={[conversionRate]}
              onValueChange={(v) => setConversionRate(v[0])}
              min={0.5}
              max={20}
              step={0.5}
              className="mt-3"
            />
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Average Customer Lifetime Value ($)
            </Label>
            <Input
              type="number"
              value={customerLifetimeValue}
              onChange={(e) => setCustomerLifetimeValue(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[customerLifetimeValue]}
              onValueChange={(v) => setCustomerLifetimeValue(v[0])}
              min={100}
              max={25000}
              step={100}
              className="mt-3"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="p-5 rounded-lg bg-muted border">
            <div className="text-sm font-semibold text-muted-foreground mb-3">CURRENT STATE</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Response Time:</span>
                <span className="font-semibold">{responseMultipliers[currentResponseTime].label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Conversion Rate:</span>
                <span className="font-semibold">{conversionRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly Conversions:</span>
                <span className="font-semibold">{currentConversions.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <motion.div
            key={improvedConversionRate}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-5 rounded-lg bg-primary/10 border border-primary/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-primary" />
              <div className="text-sm font-semibold">IMPROVED STATE</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Response Time:</span>
                <span className="font-semibold text-primary">{responseMultipliers[desiredResponseTime].label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Conversion Rate:</span>
                <span className="font-semibold text-primary">{improvedConversionRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly Conversions:</span>
                <span className="font-semibold text-primary">{improvedConversions.toFixed(1)}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            key={additionalConversions}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-4 rounded-lg bg-green-500/10 border border-green-500/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">
                Additional Conversions/Month
              </span>
            </div>
            <div className="text-3xl font-bold text-green-500">
              +{(Math.round(additionalConversions * 10) / 10).toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {improvementPercent > 0 ? '+' : ''}{improvementPercent.toFixed(0)}% improvement
            </div>
          </motion.div>

          <motion.div
            key={annualRevenueImpact}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-6 rounded-lg bg-gradient-to-br from-primary to-blue-600 text-primary-foreground"
          >
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">
                Additional Annual Revenue
              </span>
            </div>
            <div className="text-4xl font-bold mb-1">
              $<AnimatedCounter end={Math.round(annualRevenueImpact)} />
            </div>
            <div className="text-sm opacity-80">
              ${Math.round(monthlyRevenueImpact).toLocaleString()}/month
            </div>
          </motion.div>

          {currentResponseTime !== "instant" && desiredResponseTime === "instant" && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm text-yellow-700 dark:text-yellow-300 mb-1">
                    Key Insight
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Leads contacted within 5 minutes are 9x more likely to convert than those contacted after 30 minutes (InsideSales.com)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>Based on InsideSales.com Lead Response Time Study & Drift 2024 Conversational Marketing Report</p>
        <p>"Companies that respond to leads within 5 minutes are 9x more likely to convert them"</p>
      </div>
    </Card>
  );
};

export default LeadResponseCalculator;
