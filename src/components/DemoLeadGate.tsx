import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { sendToApollo } from "@/lib/apollo-integration";
import { trackConversion } from "@/lib/tracking";

interface DemoLeadGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (demoType: string) => void;
  selectedIndustry?: string;
  demoType: 'voice' | 'lead-capture' | 'scheduling';
  demoName: string;
}

const industries = [
  "HVAC",
  "Legal",
  "Healthcare", 
  "Accounting",
  "Restaurants",
  "Roofing",
  "Logistics",
  "Bars & Nightclubs"
];

export const DemoLeadGate = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  selectedIndustry = "",
  demoType,
  demoName
}: DemoLeadGateProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    industry: selectedIndustry,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.industry) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send to Apollo.io
      const success = await sendToApollo({
        name: formData.name,
        email: formData.email,
        industry: formData.industry,
        source: `Demo Request - ${demoName}`,
        tags: ["Demo Request", formData.industry, demoType],
        notes: `Requested ${demoName} demo`,
        custom_fields: {
          demo_type: demoType,
          demo_name: demoName,
        }
      });

      if (success) {
        // Track conversion
        trackConversion('demo_lead_submitted', {
          demo_type: demoType,
          demo_name: demoName,
          industry: formData.industry,
        });

        // Set session flag
        sessionStorage.setItem('demo_lead_submitted', 'true');
        sessionStorage.setItem('demo_user_industry', formData.industry);

        toast({
          title: "Success!",
          description: "Your demo is loading...",
        });

        // Close modal and trigger demo
        setTimeout(() => {
          onSuccess(demoType);
        }, 500);
      } else {
        throw new Error("Failed to submit lead data");
      }
    } catch (error) {
      console.error("Demo lead submission error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-card border-2 border-border rounded-2xl shadow-2xl p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
              <Play className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Watch the Demo</h2>
            <p className="text-muted-foreground text-sm">
              Enter your info to unlock the {demoName}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Smith"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger id="industry" className="mt-1.5">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Unlocking Demo...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            By submitting, you agree to receive product updates and demos.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
