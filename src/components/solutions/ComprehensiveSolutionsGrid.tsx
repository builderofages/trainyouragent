import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { ChevronDown, ChevronUp, Clock, DollarSign } from "lucide-react";
import { BusinessFunction } from "@/data/comprehensiveBusinessFunctions";

interface ComprehensiveSolutionsGridProps {
  businessFunctions: BusinessFunction[];
  onAddToPackage?: (functionId: string) => void;
  selectedFunctions?: string[];
}

export const ComprehensiveSolutionsGrid = ({
  businessFunctions,
  onAddToPackage,
  selectedFunctions = []
}: ComprehensiveSolutionsGridProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {businessFunctions.map((func, index) => {
        const isExpanded = expandedId === func.id;
        const isSelected = selectedFunctions.includes(func.id);
        const Icon = func.icon;

        return (
          <motion.div
            key={func.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className={`h-full ${isSelected ? 'ring-2 ring-primary' : ''}`}>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {func.category}
                    </h3>
                    <p className="text-sm text-muted-foreground">{func.description}</p>
                  </div>
                </div>

                {/* Key Features */}
                <div className="space-y-2 mb-4">
                  {func.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-sm text-foreground/80">{feature}</p>
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{func.implementationTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-primary">{func.roiMetric}</span>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 mb-4 pt-4 border-t border-border/50"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-2">All Features:</h4>
                      <div className="space-y-1.5">
                        {func.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
                            <p className="text-sm text-foreground/70">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-2">Industry Example:</h4>
                      <p className="text-sm text-muted-foreground italic">{func.industrySpecificExample}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-2">Integrations:</h4>
                      <div className="flex flex-wrap gap-2">
                        {func.integrations.map((integration, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary"
                          >
                            {integration}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-primary/5 rounded-lg p-3">
                      <p className="text-sm font-medium text-foreground">
                        Monthly Cost: <span className="text-primary">{func.monthlyCost}</span>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <MagneticButton
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedId(isExpanded ? null : func.id)}
                    className="flex-1"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Learn More
                      </>
                    )}
                  </MagneticButton>

                  {onAddToPackage && (
                    <MagneticButton
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => onAddToPackage(func.id)}
                      className="flex-1"
                    >
                      {isSelected ? "✓ Added" : "Add to Package"}
                    </MagneticButton>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
};
