import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { ChevronDown, ChevronUp, Clock, DollarSign, AlertCircle, RefreshCw } from "lucide-react";
import { BusinessFunction } from "@/data/comprehensiveBusinessFunctions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ComprehensiveSolutionsGridProps {
  businessFunctions: BusinessFunction[];
  onAddToPackage?: (functionId: string) => void;
  selectedFunctions?: string[];
  isLoading?: boolean;
  error?: Error | null;
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="space-y-4 p-6 rounded-xl border border-border/50 bg-background/50">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </div>
    ))}
  </div>
);

const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <Alert variant="destructive" className="max-w-2xl mx-auto">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Unable to Load Solutions</AlertTitle>
    <AlertDescription className="mt-2 space-y-3">
      <p className="text-sm">{error.message || "Something went wrong loading the solutions data."}</p>
      <MagneticButton onClick={onRetry} variant="outline" size="sm" className="mt-2">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </MagneticButton>
    </AlertDescription>
  </Alert>
);

const EmptyState = () => (
  <div className="text-center py-12 max-w-lg mx-auto">
    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
      <AlertCircle className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-semibold mb-2">No Solutions Available</h3>
    <p className="text-muted-foreground mb-4">
      We couldn't find any AI solutions for this industry yet. Our team is constantly adding new industries.
    </p>
    <MagneticButton variant="outline" onClick={() => window.location.href = '/contact'}>
      Contact Us for Custom Solutions
    </MagneticButton>
  </div>
);

export const ComprehensiveSolutionsGrid = ({
  businessFunctions,
  onAddToPackage,
  selectedFunctions = [],
  isLoading = false,
  error = null
}: ComprehensiveSolutionsGridProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Show loading skeleton
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  // Validate data
  if (!businessFunctions || !Array.isArray(businessFunctions) || businessFunctions.length === 0) {
    return <EmptyState />;
  }

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
