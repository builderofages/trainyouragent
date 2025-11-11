import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  Wrench,
  Target,
  Download,
  Calendar,
} from "lucide-react";
import { trackEvent } from "@/lib/tracking";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface FormData {
  challenge: string;
  revenue: string;
  staffSize: string;
  techStack: string;
  goals: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export default function SolutionConfigurator() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    challenge: "",
    revenue: "",
    staffSize: "",
    techStack: "",
    goals: "",
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const totalSteps = 6;

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => (prev + 1) as Step);
      trackEvent("configurator_step_completed", { step: currentStep });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    // Send to Monday.com webhook
    try {
      await fetch(siteConfig.webhooks.configurator, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          utm_source: localStorage.getItem("utm_source"),
          utm_medium: localStorage.getItem("utm_medium"),
          utm_campaign: localStorage.getItem("utm_campaign"),
        }),
      });

      trackEvent("configurator_completed", { challenge: formData.challenge });
      toast.success("Your personalized roadmap is ready!");
      
      // In production, this would generate a PDF. For now, redirect to booking.
      window.open(siteConfig.bookingUrl, "_blank");
    } catch (error) {
      console.error("Failed to submit configurator:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContainer
            title="What's your biggest challenge?"
            subtitle="Help us understand where you need the most support"
            icon={Target}
          >
            <RadioGroup value={formData.challenge} onValueChange={(val) => updateFormData("challenge", val)}>
              {[
                { value: "missed_calls", label: "Missing too many calls and losing leads" },
                { value: "scheduling", label: "Scheduling chaos and no-shows" },
                { value: "lead_quality", label: "Poor lead quality and conversion rates" },
                { value: "staff_overwhelm", label: "Staff overwhelmed with admin tasks" },
                { value: "growth", label: "Can't scale operations fast enough" },
                { value: "visibility", label: "Low market visibility and online presence" },
              ].map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </StepContainer>
        );

      case 2:
        return (
          <StepContainer
            title="What's your current monthly revenue?"
            subtitle="This helps us estimate your potential ROI"
            icon={DollarSign}
          >
            <RadioGroup value={formData.revenue} onValueChange={(val) => updateFormData("revenue", val)}>
              {[
                { value: "0-50k", label: "$0 - $50,000" },
                { value: "50k-100k", label: "$50,000 - $100,000" },
                { value: "100k-250k", label: "$100,000 - $250,000" },
                { value: "250k-500k", label: "$250,000 - $500,000" },
                { value: "500k-1m", label: "$500,000 - $1,000,000" },
                { value: "1m+", label: "$1,000,000+" },
              ].map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </StepContainer>
        );

      case 3:
        return (
          <StepContainer
            title="How many staff members do you have?"
            subtitle="Understanding your team size helps us recommend the right solutions"
            icon={Users}
          >
            <RadioGroup value={formData.staffSize} onValueChange={(val) => updateFormData("staffSize", val)}>
              {[
                { value: "1-5", label: "1-5 employees (Solo or small team)" },
                { value: "6-15", label: "6-15 employees (Growing business)" },
                { value: "16-50", label: "16-50 employees (Established business)" },
                { value: "51+", label: "51+ employees (Large organization)" },
              ].map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </StepContainer>
        );

      case 4:
        return (
          <StepContainer
            title="What tools are you currently using?"
            subtitle="We'll ensure seamless integration with your existing tech"
            icon={Wrench}
          >
            <RadioGroup value={formData.techStack} onValueChange={(val) => updateFormData("techStack", val)}>
              {[
                { value: "basic", label: "Basic tools (Email, Phone, Spreadsheets)" },
                { value: "crm", label: "CRM system (Salesforce, HubSpot, etc.)" },
                { value: "advanced", label: "Advanced stack (CRM + Scheduling + Payment)" },
                { value: "custom", label: "Custom or industry-specific software" },
                { value: "none", label: "Looking to start fresh" },
              ].map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </StepContainer>
        );

      case 5:
        return (
          <StepContainer
            title="What are your growth goals?"
            subtitle="Let's align our recommendations with your ambitions"
            icon={TrendingUp}
          >
            <RadioGroup value={formData.goals} onValueChange={(val) => updateFormData("goals", val)}>
              {[
                { value: "stabilize", label: "Stabilize current operations and reduce chaos" },
                { value: "grow_20", label: "Grow revenue by 20-50% this year" },
                { value: "grow_100", label: "Double revenue within 12 months" },
                { value: "expand", label: "Expand to new locations or markets" },
                { value: "dominate", label: "Become the market leader in my area" },
              ].map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </StepContainer>
        );

      case 6:
        return (
          <StepContainer
            title="Get Your Personalized Roadmap"
            subtitle="Enter your details to receive your custom transformation plan"
            icon={Sparkles}
          >
            <div className="space-y-4">
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
                <Label htmlFor="email">Email Address *</Label>
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
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => updateFormData("company", e.target.value)}
                  placeholder="Your Company LLC"
                />
              </div>
            </div>
          </StepContainer>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!formData.challenge;
      case 2:
        return !!formData.revenue;
      case 3:
        return !!formData.staffSize;
      case 4:
        return !!formData.techStack;
      case 5:
        return !!formData.goals;
      case 6:
        return !!formData.name && !!formData.email && !!formData.phone;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Progress bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < totalSteps ? (
              <MagneticButton
                strength={20}
                onClick={nextStep}
                disabled={!isStepValid()}
                size="lg"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </MagneticButton>
            ) : (
              <MagneticButton
                strength={25}
                onClick={handleSubmit}
                disabled={!isStepValid()}
                size="lg"
                className="bg-gradient-to-r from-primary to-cyan-500"
              >
                Get My Roadmap
                <Download className="w-4 h-4 ml-2" />
              </MagneticButton>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface StepContainerProps {
  title: string;
  subtitle: string;
  icon: any;
  children: React.ReactNode;
}

const StepContainer = ({ title, subtitle, icon: Icon, children }: StepContainerProps) => {
  return (
    <GlassCard className="p-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mb-6 mx-auto"
      >
        <Icon className="w-8 h-8 text-primary" />
      </motion.div>

      <h2 className="text-3xl font-bold text-center mb-3">{title}</h2>
      <p className="text-muted-foreground text-center mb-8">{subtitle}</p>

      <div className="space-y-3">{children}</div>
    </GlassCard>
  );
};
