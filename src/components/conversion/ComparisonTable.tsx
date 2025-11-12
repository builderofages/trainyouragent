import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { industryComparisonData } from "@/data/industryComparisonData";

interface ComparisonFeature {
  feature: string;
  aiAgent: boolean | string;
  humanStaff: boolean | string;
  missedCalls: boolean | string;
}

interface ComparisonTableProps {
  industry?: string;
}

export const ComparisonTable = ({ industry = "business" }: ComparisonTableProps) => {
  const comparisonData = industryComparisonData[industry?.toLowerCase()] || industryComparisonData.hvac;
  
  const features: ComparisonFeature[] = [
    { feature: "24/7 Availability", aiAgent: true, humanStaff: false, missedCalls: false },
    { feature: "Instant Response Time", aiAgent: "< 2 seconds", humanStaff: "2-5 minutes", missedCalls: "Never" },
    { feature: "Handles Multiple Calls Simultaneously", aiAgent: true, humanStaff: false, missedCalls: false },
    { feature: "Lead Qualification", aiAgent: "Automatic", humanStaff: "Manual", missedCalls: "Never" },
    { feature: "Appointment Scheduling", aiAgent: true, humanStaff: true, missedCalls: false },
    { feature: "CRM Integration", aiAgent: "Automatic", humanStaff: "Manual entry", missedCalls: "Never" },
    { feature: "Call Recording & Transcription", aiAgent: true, humanStaff: "Sometimes", missedCalls: false },
    { feature: "Sick Days / Vacation", aiAgent: false, humanStaff: true, missedCalls: true },
    { feature: "Monthly Cost", aiAgent: comparisonData.aiAgentCost, humanStaff: comparisonData.humanStaffCost, missedCalls: "$0 (+ lost revenue)" },
    { feature: "Setup Time", aiAgent: comparisonData.setupTime, humanStaff: "4-6 weeks", missedCalls: "N/A" },
  ];

  const renderCell = (value: boolean | string, isWinner?: boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className={`w-6 h-6 ${isWinner ? "text-green-500" : "text-muted-foreground"}`} />
      ) : (
        <X className="w-6 h-6 text-destructive/60" />
      );
    }
    
    if (value === "Never") {
      return <X className="w-6 h-6 text-destructive/60" />;
    }
    
    return (
      <span className={`text-sm font-medium ${isWinner ? "text-foreground" : "text-muted-foreground"}`}>
        {value}
      </span>
    );
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            AI Agent vs Traditional Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how AI stacks up against human staff and missed calls
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-6 font-bold text-lg">Feature</th>
                    <th className="p-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-2">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                        <div className="font-bold text-gradient">AI Agent</div>
                        <div className="text-xs text-green-500 mt-1">Winner</div>
                      </div>
                    </th>
                    <th className="p-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                          <Minus className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="font-bold">Human Staff</div>
                      </div>
                    </th>
                    <th className="p-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                          <X className="w-6 h-6 text-destructive" />
                        </div>
                        <div className="font-bold">Missed Calls</div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-6 font-medium">{row.feature}</td>
                      <td className="p-6 text-center bg-primary/5">
                        {renderCell(row.aiAgent, true)}
                      </td>
                      <td className="p-6 text-center">
                        {renderCell(row.humanStaff)}
                      </td>
                      <td className="p-6 text-center">
                        {renderCell(row.missedCalls)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-t border-primary/20">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">
                  Average ROI: <span className="text-gradient">{comparisonData.averageROI}</span>
                </div>
                <p className="text-muted-foreground">
                  Most {industry} businesses see complete payback within {comparisonData.paybackPeriod}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
