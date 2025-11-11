import { AlertCircle } from "lucide-react";

interface ResultsDisclaimerProps {
  variant?: "default" | "compact" | "inline";
  context?: "roi" | "timeline" | "general";
}

export const ResultsDisclaimer = ({ 
  variant = "default", 
  context = "general" 
}: ResultsDisclaimerProps) => {
  const getContextualText = () => {
    switch (context) {
      case "roi":
        return "ROI projections are based on industry averages and pilot data. Actual results depend on your specific call volume, conversion rate, and business factors. The 30-Day Risk-Free Pilot allows you to test results in your own business context.";
      case "timeline":
        return "Timeline estimates are ranges based on typical implementations. Actual timeline depends on service complexity, integration needs, response time to training questions, and industry-specific requirements. Your custom timeline will be confirmed during your strategy session.";
      default:
        return "Results may vary based on implementation, industry, call volume, and business-specific factors. Past performance and pilot program statistics do not guarantee future results. The 94% pilot conversion rate reflects historical pilot participant conversion data and is not a guarantee of individual outcomes.";
    }
  };

  if (variant === "inline") {
    return (
      <p className="text-xs text-muted-foreground italic">
        * {getContextualText()}
      </p>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">{getContextualText()}</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 border-amber-500/20 bg-amber-500/5">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-1">Results Disclosure</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {getContextualText()}
          </p>
        </div>
      </div>
    </div>
  );
};
