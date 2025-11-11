import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Users, Bot, TrendingUp, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/enhanced/AnimatedCounter";
import { ResultsDisclaimer } from "@/components/ResultsDisclaimer";

const AIvsHumanCalculator = () => {
  const [staffNeeded, setStaffNeeded] = useState(2);
  const [annualSalary, setAnnualSalary] = useState(35000);
  const [benefitsPercent, setBenefitsPercent] = useState(30);
  const [trainingCost, setTrainingCost] = useState(4700);
  const [turnoverRate, setTurnoverRate] = useState(31);
  const [aiSubscription, setAiSubscription] = useState(997);

  // Calculations
  const salaryWithBenefits = annualSalary * (1 + benefitsPercent / 100);
  const turnoverCost = (salaryWithBenefits * (turnoverRate / 100)) + (trainingCost * (turnoverRate / 100));
  const trueCostPerEmployee = salaryWithBenefits + trainingCost + turnoverCost;
  const totalHumanCost = trueCostPerEmployee * staffNeeded;
  const totalAICost = aiSubscription * 12;
  const threeYearHuman = totalHumanCost * 3;
  const threeYearAI = totalAICost * 3;
  const annualSavings = totalHumanCost - totalAICost;
  const roiMultiple = annualSavings / totalAICost;
  const breakEvenMonths = totalAICost / (annualSavings / 12);

  return (
    <Card className="p-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Users className="w-8 h-8 text-blue-500" />
          <span className="text-2xl font-bold">vs</span>
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-3xl font-bold mb-2">AI vs Human Cost Comparison</h3>
        <p className="text-muted-foreground">
          Calculate the true cost of hiring vs AI automation
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <Label className="text-base mb-3 block">
              Number of Staff Needed
            </Label>
            <Input
              type="number"
              value={staffNeeded}
              onChange={(e) => setStaffNeeded(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[staffNeeded]}
              onValueChange={(v) => setStaffNeeded(v[0])}
              min={1}
              max={10}
              step={1}
              className="mt-3"
            />
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Average Annual Salary ($)
            </Label>
            <Input
              type="number"
              value={annualSalary}
              onChange={(e) => setAnnualSalary(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[annualSalary]}
              onValueChange={(v) => setAnnualSalary(v[0])}
              min={25000}
              max={80000}
              step={1000}
              className="mt-3"
            />
            <p className="text-sm text-muted-foreground mt-2">
              US median for receptionist: $35,080 (BLS 2024)
            </p>
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Benefits Percentage (%)
            </Label>
            <Input
              type="number"
              value={benefitsPercent}
              onChange={(e) => setBenefitsPercent(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[benefitsPercent]}
              onValueChange={(v) => setBenefitsPercent(v[0])}
              min={0}
              max={50}
              step={1}
              className="mt-3"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Average benefits cost: 30% of salary (SHRM 2024)
            </p>
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Training Cost Per Employee ($)
            </Label>
            <Input
              type="number"
              value={trainingCost}
              onChange={(e) => setTrainingCost(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[trainingCost]}
              onValueChange={(v) => setTrainingCost(v[0])}
              min={1000}
              max={15000}
              step={100}
              className="mt-3"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Average cost-per-hire: $4,700 (SHRM 2024)
            </p>
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Annual Turnover Rate (%)
            </Label>
            <Input
              type="number"
              value={turnoverRate}
              onChange={(e) => setTurnoverRate(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[turnoverRate]}
              onValueChange={(v) => setTurnoverRate(v[0])}
              min={0}
              max={100}
              step={1}
              className="mt-3"
            />
            <p className="text-sm text-muted-foreground mt-2">
              National average: 31% (BLS 2024)
            </p>
          </div>

          <div>
            <Label className="text-base mb-3 block">
              AI Monthly Subscription ($)
            </Label>
            <Input
              type="number"
              value={aiSubscription}
              onChange={(e) => setAiSubscription(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[aiSubscription]}
              onValueChange={(v) => setAiSubscription(v[0])}
              min={500}
              max={3000}
              step={100}
              className="mt-3"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="p-5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-semibold text-foreground">
                Human Employee Cost
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Salary:</span>
                <span className="font-medium">${annualSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">+ Benefits ({benefitsPercent}%):</span>
                <span className="font-medium">${Math.round(annualSalary * (benefitsPercent / 100)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">+ Training:</span>
                <span className="font-medium">${trainingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">+ Turnover Cost:</span>
                <span className="font-medium">${Math.round(turnoverCost).toLocaleString()}</span>
              </div>
              <div className="border-t border-blue-500/20 pt-2 mt-2 flex justify-between">
                <span className="font-semibold">Per Employee:</span>
                <span className="font-bold text-lg">${Math.round(trueCostPerEmployee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="font-semibold">× {staffNeeded} employees:</span>
                <span className="font-bold text-xl text-blue-500">${Math.round(totalHumanCost).toLocaleString()}/yr</span>
              </div>
            </div>
          </div>

          <motion.div
            key={totalAICost}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-5 rounded-lg bg-primary/10 border border-primary/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <Bot className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                AI Solution Cost
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Subscription:</span>
                <span className="font-medium">${aiSubscription.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">× 12 months:</span>
                <span className="font-bold text-xl text-primary">${totalAICost.toLocaleString()}/yr</span>
              </div>
              <div className="mt-3 p-3 bg-primary/5 rounded">
                <div className="text-xs text-muted-foreground mb-1">AI Benefits:</div>
                <div className="text-xs space-y-1">
                  <div>✓ 24/7/365 coverage (no PTO, sick days)</div>
                  <div>✓ Instant response time</div>
                  <div>✓ Unlimited concurrent calls</div>
                  <div>✓ No training or turnover costs</div>
                  <div>✓ Consistent quality every time</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            key={annualSavings}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">
                Annual Savings with AI
              </span>
            </div>
            <div className="text-4xl font-bold mb-3">
              $<AnimatedCounter end={Math.round(annualSavings)} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="opacity-80">ROI Multiple</div>
                <div className="text-2xl font-bold">{roiMultiple.toFixed(1)}x</div>
              </div>
              <div>
                <div className="opacity-80">Break-Even</div>
                <div className="text-2xl font-bold">{Math.round(breakEvenMonths)}mo</div>
              </div>
            </div>
          </motion.div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm font-semibold mb-2">3-Year Total Cost of Ownership</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Human Employees:</span>
                <span className="text-lg font-bold">${Math.round(threeYearHuman).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">AI Solution:</span>
                <span className="text-lg font-bold text-primary">${Math.round(threeYearAI).toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="font-semibold">3-Year Savings:</span>
                <span className="text-xl font-bold text-green-600">${Math.round(threeYearHuman - threeYearAI).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground space-y-1 mb-6">
        <p>Data sources: Bureau of Labor Statistics, SHRM Cost-per-Hire Report 2024, Work Institute Retention Report</p>
        <p>Benefits include healthcare, 401k, payroll taxes, workers comp, and paid time off</p>
      </div>

      <ResultsDisclaimer variant="compact" context="roi" />
    </Card>
  );
};

export default AIvsHumanCalculator;
