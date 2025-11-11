import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PhoneOff, TrendingDown, AlertTriangle, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/enhanced/AnimatedCounter";
import { ResultsDisclaimer } from "@/components/ResultsDisclaimer";

const MissedCallCalculator = () => {
  const [dailyCalls, setDailyCalls] = useState(25);
  const [voicemailPercent, setVoicemailPercent] = useState(62);
  const [neverReturnedPercent, setNeverReturnedPercent] = useState(72);
  const [avgDealValue, setAvgDealValue] = useState(500);
  const [daysOpen, setDaysOpen] = useState(260);

  // Calculations
  const callsToVoicemail = (dailyCalls * voicemailPercent) / 100;
  const missedCallsPerDay = (callsToVoicemail * neverReturnedPercent) / 100;
  const missedCallsPerYear = missedCallsPerDay * daysOpen;
  const dailyLostRevenue = missedCallsPerDay * avgDealValue;
  const annualLostRevenue = missedCallsPerYear * avgDealValue;

  return (
    <Card className="p-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <PhoneOff className="w-8 h-8 text-destructive" />
          <h3 className="text-3xl font-bold">Missed Call Cost Calculator</h3>
        </div>
        <p className="text-muted-foreground">
          Calculate how much revenue you're losing to unanswered calls
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <Label className="text-base mb-3 block">
              Daily Inbound Calls
            </Label>
            <Input
              type="number"
              value={dailyCalls}
              onChange={(e) => setDailyCalls(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[dailyCalls]}
              onValueChange={(v) => setDailyCalls(v[0])}
              min={5}
              max={200}
              step={5}
              className="mt-3"
            />
          </div>

          <div>
            <Label className="text-base mb-3 block">
              % That Go to Voicemail
            </Label>
            <Input
              type="number"
              value={voicemailPercent}
              onChange={(e) => setVoicemailPercent(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[voicemailPercent]}
              onValueChange={(v) => setVoicemailPercent(v[0])}
              min={0}
              max={100}
              step={1}
              className="mt-3"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Industry average: 62% (CallRail 2024)
            </p>
          </div>

          <div>
            <Label className="text-base mb-3 block">
              % of Voicemails Never Returned
            </Label>
            <Input
              type="number"
              value={neverReturnedPercent}
              onChange={(e) => setNeverReturnedPercent(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[neverReturnedPercent]}
              onValueChange={(v) => setNeverReturnedPercent(v[0])}
              min={0}
              max={100}
              step={1}
              className="mt-3"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Industry average: 72% (CallRail 2024)
            </p>
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Average Deal Value ($)
            </Label>
            <Input
              type="number"
              value={avgDealValue}
              onChange={(e) => setAvgDealValue(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[avgDealValue]}
              onValueChange={(v) => setAvgDealValue(v[0])}
              min={100}
              max={10000}
              step={100}
              className="mt-3"
            />
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Days Open Per Year
            </Label>
            <Input
              type="number"
              value={daysOpen}
              onChange={(e) => setDaysOpen(Number(e.target.value))}
              className="text-lg h-12"
            />
            <Slider
              value={[daysOpen]}
              onValueChange={(v) => setDaysOpen(v[0])}
              min={200}
              max={365}
              step={5}
              className="mt-3"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <motion.div
            key={missedCallsPerDay}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-4 rounded-lg bg-destructive/10 border border-destructive/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <PhoneOff className="w-5 h-5 text-destructive" />
              <span className="text-sm font-medium text-muted-foreground">
                Missed Calls Per Day
              </span>
            </div>
            <div className="text-3xl font-bold text-destructive">
              <AnimatedCounter end={Math.round(missedCallsPerDay)} />
            </div>
          </motion.div>

          <motion.div
            key={missedCallsPerYear}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">
                Missed Calls Per Year
              </span>
            </div>
            <div className="text-3xl font-bold text-orange-500">
              <AnimatedCounter end={Math.round(missedCallsPerYear)} />
            </div>
          </motion.div>

          <motion.div
            key={dailyLostRevenue}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">
                Daily Lost Revenue
              </span>
            </div>
            <div className="text-3xl font-bold text-red-500">
              $<AnimatedCounter end={Math.round(dailyLostRevenue)} />
            </div>
          </motion.div>

          <motion.div
            key={annualLostRevenue}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-6 rounded-lg bg-gradient-to-br from-destructive to-red-600 text-destructive-foreground"
          >
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">
                Annual Lost Revenue Opportunity
              </span>
            </div>
            <div className="text-4xl font-bold mb-1">
              $<AnimatedCounter end={Math.round(annualLostRevenue)} />
            </div>
            <div className="text-sm opacity-80">
              You're losing ${Math.round(annualLostRevenue).toLocaleString()} per year to missed calls
            </div>
          </motion.div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              With AI: Capture 85% of These Calls
            </div>
            <div className="text-2xl font-bold text-primary">
              +${Math.round(annualLostRevenue * 0.85).toLocaleString()}/year
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground space-y-1 mb-6">
        <p>Based on industry research from CallRail 2024 State of Lead Response Report</p>
        <p>62% of calls go to voicemail • 72% of voicemails are never returned</p>
      </div>

      <ResultsDisclaimer variant="compact" context="roi" />
    </Card>
  );
};

export default MissedCallCalculator;
