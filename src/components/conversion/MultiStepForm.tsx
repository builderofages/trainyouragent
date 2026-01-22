import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

interface FormData {
  industry: string;
  companySize: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    industry: "",
    companySize: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const totalSteps = 3;

  const industries = [
    "Accounting", "Legal", "Healthcare", "Roofing", "HVAC",
    "Logistics", "Restaurants", "Other"
  ];

  const companySizes = [
    "1-10 employees", "11-50 employees", "51-200 employees",
    "201-500 employees", "500+ employees"
  ];

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.industry || !formData.companySize)) {
      toast({
        title: "Required Fields",
        description: "Please select your industry and company size",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && (!formData.name || !formData.email)) {
      toast({
        title: "Required Fields",
        description: "Please enter your name and email",
        variant: "destructive",
      });
      return;
    }
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message) {
      toast({
        title: "Required Field",
        description: "Please tell us about your needs",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check for configured webhook
      const webhookUrl = localStorage.getItem("multi_step_form_webhook") || "";
      
      if (webhookUrl && !webhookUrl.includes("YOUR_")) {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            source: "multi_step_form",
            timestamp: new Date().toISOString(),
          }),
        });
        
        if (!response.ok) {
          throw new Error("Webhook request failed");
        }
      }

      toast({
        title: "Success!",
        description: "We'll be in touch within 24 hours.",
      });

      // Reset form
      setFormData({
        industry: "",
        companySize: "",
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setStep(1);
    } catch (error) {
      console.error("Multi-step form webhook error:", error);
      toast({
        title: "Error",
        description: "Failed to submit. Please email us at support@trainyouragent.com",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= num
                    ? "bg-gradient-primary text-white shadow-blue"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {step > num ? <CheckCircle className="w-5 h-5" /> : num}
              </div>
              {num < totalSteps && (
                <div
                  className={`h-1 flex-1 mx-2 rounded transition-all ${
                    step > num ? "bg-primary" : "bg-secondary"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground px-2">
          <span>Business Info</span>
          <span>Contact Details</span>
          <span>Your Needs</span>
        </div>
      </div>

      {/* Form Steps */}
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <Label>What's your industry?</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      type="button"
                      onClick={() => updateFormData("industry", industry)}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        formData.industry === industry
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Company size?</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {companySizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updateFormData("companySize", size)}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        formData.companySize === size
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="John Smith"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Business Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="john@company.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="message">Tell us about your needs *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => updateFormData("message", e.target.value)}
                  placeholder="What challenges are you facing? What would you like to automate?"
                  rows={6}
                  required
                />
              </div>

              <div className="glass-card p-4">
                <h4 className="font-bold text-foreground mb-2">Your Information</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><span className="font-medium">Industry:</span> {formData.industry}</p>
                  <p><span className="font-medium">Company Size:</span> {formData.companySize}</p>
                  <p><span className="font-medium">Name:</span> {formData.name}</p>
                  <p><span className="font-medium">Email:</span> {formData.email}</p>
                  {formData.phone && <p><span className="font-medium">Phone:</span> {formData.phone}</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < totalSteps ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" className="bg-gradient-primary">
              Submit Request
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
