import { Card } from "@/components/ui/card";
import { CheckCircle, TrendingUp, XCircle } from "lucide-react";
import { BusinessTypeExample } from "@/data/businessTypeExamples";

interface BusinessTypeScenarioProps {
  businessTypeExample: BusinessTypeExample;
}

export const BusinessTypeScenario = ({ businessTypeExample }: BusinessTypeScenarioProps) => {
  const { realScenario } = businessTypeExample;
  
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-4xl font-bold text-center mb-4">
          See Yourself in This Scenario
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-12">
          A day in the life of a {businessTypeExample.businessType}
        </p>
        
        <Card className="p-8 glass-card">
          {/* Scenario Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="text-5xl">🏢</div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{realScenario.title}</h3>
              <p className="text-muted-foreground">{realScenario.location}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* WITHOUT AI Section */}
            <div className="p-6 rounded-lg bg-destructive/5 border-2 border-destructive/20">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-destructive" />
                <h4 className="font-bold text-xl text-destructive">
                  What Happens Today (Without AI)
                </h4>
              </div>
              <p className="text-foreground/90 mb-4 leading-relaxed">
                {realScenario.withoutAI}
              </p>
              <div className="text-sm font-semibold text-destructive bg-destructive/10 px-4 py-2 rounded-md inline-block">
                💰 Lost: {realScenario.lostValue}
              </div>
            </div>
            
            {/* WITH AI Section */}
            <div className="p-6 rounded-lg bg-primary/5 border-2 border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
                <h4 className="font-bold text-xl text-primary">
                  With AI (Automated)
                </h4>
              </div>
              <ul className="space-y-3">
                {realScenario.withAIBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/90">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* EMPLOYEE FOCUS Section */}
            <div className="p-6 rounded-lg bg-accent/5 border-2 border-accent/20">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
                <h4 className="font-bold text-xl text-accent">
                  Your Team Can Now Focus On:
                </h4>
              </div>
              <ul className="space-y-3">
                {realScenario.employeeFocus.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/90 font-medium">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
