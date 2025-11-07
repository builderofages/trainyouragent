import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, DollarSign, Users } from "lucide-react";
import { motion } from "framer-motion";

const ROICalculator = () => {
  const [monthlyLeads, setMonthlyLeads] = useState(100);
  const [conversionRate, setConversionRate] = useState(7);
  const [avgJobValue, setAvgJobValue] = useState(500);

  // Calculations
  const missedLeadsPercentage = 60; // Industry average after-hours
  const currentMissedLeads = Math.round((monthlyLeads * missedLeadsPercentage) / 100);
  const recoveredLeads = Math.round(currentMissedLeads * 0.85); // AI captures 85%
  const additionalConversions = Math.round((recoveredLeads * conversionRate) / 100);
  const monthlyROI = additionalConversions * avgJobValue;
  const yearlyROI = monthlyROI * 12;
  const costPerMonth = 97; // Starter plan
  const netMonthlyProfit = monthlyROI - costPerMonth;
  const roiMultiplier = Math.round(netMonthlyProfit / costPerMonth);

  return (
    <Card className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-2">ROI Calculator</h3>
        <p className="text-muted-foreground">
          See how much revenue you're leaving on the table
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <Label className="text-base mb-3 block">
              Monthly Leads
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
              max={500}
              step={10}
              className="mt-3"
            />
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Conversion Rate (%)
            </Label>
            <Input
              type="number"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[conversionRate]}
              onValueChange={(v) => setConversionRate(v[0])}
              min={1}
              max={20}
              step={0.5}
              className="mt-3"
            />
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Average Job Value ($)
            </Label>
            <Input
              type="number"
              value={avgJobValue}
              onChange={(e) => setAvgJobValue(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[avgJobValue]}
              onValueChange={(v) => setAvgJobValue(v[0])}
              min={100}
              max={5000}
              step={50}
              className="mt-3"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <motion.div
            key={recoveredLeads}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">
                Recovered Leads/Month
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-500">
              +{recoveredLeads}
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
                Additional Customers/Month
              </span>
            </div>
            <div className="text-3xl font-bold text-green-500">
              +{additionalConversions}
            </div>
          </motion.div>

          <motion.div
            key={monthlyROI}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-6 rounded-lg bg-gradient-to-br from-primary to-blue-600 text-primary-foreground"
          >
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">
                Additional Monthly Revenue
              </span>
            </div>
            <div className="text-4xl font-bold mb-1">
              ${monthlyROI.toLocaleString()}
            </div>
            <div className="text-sm opacity-80">
              ${yearlyROI.toLocaleString()}/year
            </div>
          </motion.div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              ROI Multiple
            </div>
            <div className="text-2xl font-bold text-primary">
              {roiMultiplier}x Return
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Based on industry averages: 60% of leads call after hours, AI captures 85% of those
      </div>
    </Card>
  );
};

export default ROICalculator;
