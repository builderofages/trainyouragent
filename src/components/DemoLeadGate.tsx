import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Play, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
      // Track conversion
      trackConversion(`demo_request_${demoType}`, {
        industry: formData.industry,
        demo_type: demoType,
        demo_name: demoName,
      });

      toast({
        title: "Welcome!",
        description: `Starting ${demoName}...`,
      });

      // Store in session
      sessionStorage.setItem("demo_lead_captured", "true");
      sessionStorage.setItem("demo_industry", formData.industry);

      // Trigger success
      onSuccess(demoType);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        industry: selectedIndustry,
      });
    } catch (error) {
      console.error("Demo lead gate error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-cyan-500 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-full">
                <Play className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">{demoName}</h2>
                <p className="text-sm text-white/80">Experience it live</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your details to start the demo
            </p>

            <div className="space-y-2">
              <Label htmlFor="demo-name">Name *</Label>
              <Input
                id="demo-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-email">Email *</Label>
              <Input
                id="demo-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-industry">Industry *</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger id="demo-industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Demo
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
