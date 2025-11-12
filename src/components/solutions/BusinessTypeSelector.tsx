import { Card } from "@/components/ui/card";
import { businessTypeExamples, BusinessTypeExample } from "@/data/businessTypeExamples";

interface BusinessTypeSelectorProps {
  industry: string;
  selectedBusinessType: string | null;
  onSelectBusinessType: (businessType: string) => void;
}

export const BusinessTypeSelector = ({ 
  industry, 
  selectedBusinessType, 
  onSelectBusinessType 
}: BusinessTypeSelectorProps) => {
  const businessTypes = businessTypeExamples.filter(bt => bt.industry === industry);
  
  if (businessTypes.length === 0) return null;
  
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          What Type of {industry.charAt(0).toUpperCase() + industry.slice(1)} Business Do You Run?
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-12">
          Select your business type to see personalized solutions
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {businessTypes.map((type) => (
            <Card
              key={type.businessType}
              onClick={() => onSelectBusinessType(type.businessType)}
              className={`
                p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-xl glass-card
                ${selectedBusinessType === type.businessType 
                  ? "ring-2 ring-primary shadow-lg scale-105" 
                  : "hover:ring-1 hover:ring-primary/50"
                }
              `}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🏢</div>
                <h3 className="font-bold text-sm mb-2">{type.businessType}</h3>
                <p className="text-xs text-muted-foreground">
                  {type.avgCallVolume}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
