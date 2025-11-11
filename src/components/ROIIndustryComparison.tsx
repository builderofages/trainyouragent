import { useState, useEffect, useMemo } from "react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Trophy, TrendingUp, ChevronRight, Info } from "lucide-react";
import { motion } from "framer-motion";
import { conversions } from "@/lib/tracking";

interface IndustryData {
  id: string;
  name: string;
  defaultJobValue: number;
  missedLeadRate: number;
  recoveryRate: number;
  avgConversionRate: number;
  afterHoursRate: number;
  source: string;
}

interface IndustryComparisonResult extends IndustryData {
  monthlyROI: number;
  yearlyROI: number;
  recoveredLeads: number;
  additionalConversions: number;
  roiMultiple: number;
  rank: number;
}

const industries: IndustryData[] = [
  {
    id: "hvac",
    name: "HVAC",
    defaultJobValue: 3500,
    missedLeadRate: 58,
    recoveryRate: 88,
    avgConversionRate: 35,
    afterHoursRate: 65,
    source: "CallRail 2024 HVAC Lead Response Report",
  },
  {
    id: "legal",
    name: "Legal",
    defaultJobValue: 5000,
    missedLeadRate: 48,
    recoveryRate: 92,
    avgConversionRate: 28,
    afterHoursRate: 40,
    source: "Legal Marketing Association 2024",
  },
  {
    id: "accounting",
    name: "Accounting",
    defaultJobValue: 2500,
    missedLeadRate: 52,
    recoveryRate: 90,
    avgConversionRate: 32,
    afterHoursRate: 45,
    source: "Accounting Today 2024 Client Acquisition Study",
  },
  {
    id: "roofing",
    name: "Roofing",
    defaultJobValue: 8000,
    missedLeadRate: 70,
    recoveryRate: 85,
    avgConversionRate: 30,
    afterHoursRate: 55,
    source: "Roofing Contractor Magazine 2024",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    defaultJobValue: 450,
    missedLeadRate: 54,
    recoveryRate: 91,
    avgConversionRate: 65,
    afterHoursRate: 50,
    source: "Healthcare IT News 2024 Patient Engagement Report",
  },
  {
    id: "logistics",
    name: "Logistics",
    defaultJobValue: 1800,
    missedLeadRate: 60,
    recoveryRate: 87,
    avgConversionRate: 40,
    afterHoursRate: 48,
    source: "Logistics Management 2024 Industry Survey",
  },
  {
    id: "restaurants",
    name: "Restaurants",
    defaultJobValue: 85,
    missedLeadRate: 65,
    recoveryRate: 82,
    avgConversionRate: 72,
    afterHoursRate: 60,
    source: "Restaurant Business Online 2024",
  },
  {
    id: "bars",
    name: "Bars & Nightclubs",
    defaultJobValue: 250,
    missedLeadRate: 68,
    recoveryRate: 80,
    avgConversionRate: 55,
    afterHoursRate: 70,
    source: "Nightclub & Bar Media Group 2024",
  },
];

export const ROIIndustryComparison = () => {
  const [monthlyLeads, setMonthlyLeads] = useState(100);
  const [conversionRate, setConversionRate] = useState(7);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryComparisonResult | null>(null);

  // Calculate ROI for all industries
  const results = useMemo(() => {
    const calculated = industries.map((industry) => {
      const missedLeads = monthlyLeads * (industry.missedLeadRate / 100);
      const recoveredLeads = missedLeads * (industry.recoveryRate / 100);
      const additionalConversions = recoveredLeads * (conversionRate / 100);
      const monthlyROI = additionalConversions * industry.defaultJobValue;
      const yearlyROI = monthlyROI * 12;
      const roiMultiple = monthlyROI / 300; // Assuming $300/month service cost

      return {
        ...industry,
        monthlyROI,
        yearlyROI,
        recoveredLeads: Math.round(recoveredLeads),
        additionalConversions: Math.round(additionalConversions),
        roiMultiple: parseFloat(roiMultiple.toFixed(1)),
        rank: 0,
      };
    });

    // Sort by monthlyROI and assign ranks
    calculated.sort((a, b) => b.monthlyROI - a.monthlyROI);
    calculated.forEach((result, index) => {
      result.rank = index + 1;
    });

    return calculated;
  }, [monthlyLeads, conversionRate]);

  useEffect(() => {
    conversions.industryComparison.calculated({
      top_industry: results[0].name,
      top_roi: results[0].monthlyROI,
      monthly_leads: monthlyLeads,
      conversion_rate: conversionRate,
    });
  }, [results, monthlyLeads, conversionRate]);

  const getRankColor = (rank: number): string => {
    if (rank === 1) return "bg-green-500 text-white";
    if (rank <= 3) return "bg-blue-500 text-white";
    if (rank <= 5) return "bg-yellow-500 text-black";
    return "bg-muted text-muted-foreground";
  };

  const getIndustryInsights = (industry: IndustryComparisonResult): string[] => {
    const insights: string[] = [];

    if (industry.defaultJobValue > 2000) {
      insights.push(
        `High average transaction value ($${industry.defaultJobValue.toLocaleString()}) means each recovered lead has significant revenue impact`
      );
    }

    if (industry.missedLeadRate > 60) {
      insights.push(
        `${industry.missedLeadRate}% missed lead rate indicates substantial untapped opportunity`
      );
    }

    if (industry.recoveryRate > 90) {
      insights.push(
        `${industry.recoveryRate}% AI recovery rate—among the highest across all industries`
      );
    }

    if (industry.afterHoursRate > 55) {
      insights.push(
        `${industry.afterHoursRate}% of calls occur after hours—prime opportunity for 24/7 AI coverage`
      );
    }

    if (industry.rank === 1) {
      insights.push(
        "Based on your inputs, this industry offers the highest monthly revenue increase potential"
      );
    } else if (industry.rank <= 3) {
      insights.push(
        "This is a strong opportunity, ranking in the top 3 industries for your business profile"
      );
    }

    return insights;
  };

  const handleIndustryClick = (industry: IndustryComparisonResult) => {
    setSelectedIndustry(industry);
    conversions.industryComparison.detailViewed({
      industry: industry.name,
      rank: industry.rank,
      monthly_roi: industry.monthlyROI,
    });
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Compare ROI Across Industries
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See which vertical has the highest revenue opportunity based on your business profile
          </p>
        </motion.div>

        {/* Input Controls */}
        <GlassCard className="p-8 mb-12 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <TrendingUp className="w-4 h-4" />
                Monthly Leads
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[monthlyLeads]}
                  onValueChange={(value) => setMonthlyLeads(value[0])}
                  min={10}
                  max={500}
                  step={10}
                  className="flex-1"
                />
                <span className="text-lg font-bold w-16 text-right">{monthlyLeads}</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Info className="w-4 h-4" />
                Conversion Rate (%)
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[conversionRate]}
                  onValueChange={(value) => setConversionRate(value[0])}
                  min={1}
                  max={50}
                  step={1}
                  className="flex-1"
                />
                <span className="text-lg font-bold w-16 text-right">{conversionRate}%</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Industry Comparison Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((industry, index) => (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard
                className={`p-6 cursor-pointer transition-all duration-300 h-full ${
                  industry.rank === 1
                    ? "border-2 border-green-500 shadow-glow"
                    : industry.rank <= 3
                    ? "border-primary/30"
                    : "border-border/20"
                } hover:scale-105 hover:shadow-lg`}
                onClick={() => handleIndustryClick(industry)}
              >
                {/* Rank Badge */}
                <div className="flex justify-between items-start mb-3">
                  <Badge className={getRankColor(industry.rank)}>#{industry.rank}</Badge>
                  {industry.rank === 1 && <Trophy className="w-6 h-6 text-yellow-500" />}
                </div>

                {/* Industry Name */}
                <h4 className="font-bold text-lg mb-3">{industry.name}</h4>

                {/* Monthly ROI */}
                <div className="text-3xl font-bold text-gradient mb-2">
                  ${Math.round(industry.monthlyROI).toLocaleString()}
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>

                {/* ROI Multiple Badge */}
                <Badge variant="outline" className="mb-3">
                  {industry.roiMultiple}x Return
                </Badge>

                {/* Mini Stats */}
                <div className="text-xs text-muted-foreground space-y-1 mb-3">
                  <div>+{industry.recoveredLeads} recovered leads</div>
                  <div>+{industry.additionalConversions} new customers</div>
                </div>

                {/* Expansion Indicator */}
                <div className="text-xs text-primary flex items-center gap-1">
                  Click for details <ChevronRight className="w-3 h-3" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={selectedIndustry !== null} onOpenChange={() => setSelectedIndustry(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedIndustry && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-3">
                  {selectedIndustry.name} - Detailed Breakdown
                </DialogTitle>
              </DialogHeader>

              {/* Ranked Position */}
              <div className="flex items-center gap-3 mb-6">
                <Badge className={`${getRankColor(selectedIndustry.rank)} text-base px-4 py-1.5`}>
                  Ranked #{selectedIndustry.rank} of 8
                </Badge>
                {selectedIndustry.rank === 1 && (
                  <span className="text-sm text-green-600 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Highest revenue opportunity for your business profile
                  </span>
                )}
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <GlassCard className="p-6">
                  <h4 className="font-bold mb-3">Your Business Inputs</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Leads:</span>
                      <span className="font-medium">{monthlyLeads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversion Rate:</span>
                      <span className="font-medium">{conversionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Job Value:</span>
                      <span className="font-medium">
                        ${selectedIndustry.defaultJobValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h4 className="font-bold mb-3">{selectedIndustry.name} Benchmarks</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Missed Lead Rate:</span>
                      <span className="font-medium">{selectedIndustry.missedLeadRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AI Recovery Rate:</span>
                      <span className="font-medium">{selectedIndustry.recoveryRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">After-Hours Calls:</span>
                      <span className="font-medium">{selectedIndustry.afterHoursRate}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                      Source: {selectedIndustry.source}
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* ROI Results */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <GlassCard className="p-6 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Monthly Revenue</div>
                  <div className="text-3xl font-bold text-gradient">
                    ${Math.round(selectedIndustry.monthlyROI).toLocaleString()}
                  </div>
                </GlassCard>
                <GlassCard className="p-6 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Annual Revenue</div>
                  <div className="text-3xl font-bold text-gradient">
                    ${Math.round(selectedIndustry.yearlyROI).toLocaleString()}
                  </div>
                </GlassCard>
                <GlassCard className="p-6 text-center">
                  <div className="text-sm text-muted-foreground mb-2">ROI Multiple</div>
                  <div className="text-3xl font-bold text-gradient">
                    {selectedIndustry.roiMultiple}x
                  </div>
                </GlassCard>
              </div>

              {/* Why This Matters */}
              <GlassCard className="p-6 bg-primary/5">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Why {selectedIndustry.name} Ranks #{selectedIndustry.rank}
                </h4>
                <ul className="space-y-2 text-sm">
                  {getIndustryInsights(selectedIndustry).map((insight, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* CTA */}
              <div className="flex gap-3 justify-center mt-6 flex-wrap">
                <MagneticButton
                  size="lg"
                  onClick={() => {
                    conversions.industryComparison.fullAnalysisClicked({
                      industry: selectedIndustry.name,
                      rank: selectedIndustry.rank,
                    });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setSelectedIndustry(null);
                  }}
                >
                  Run Full ROI Analysis for {selectedIndustry.name}
                </MagneticButton>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
