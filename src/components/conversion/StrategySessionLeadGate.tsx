import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, CheckCircle, Loader2, Sparkles, TrendingUp, Database } from "lucide-react";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";
import { trackEvent } from "@/lib/tracking";
import { industryComparisonsData } from "@/data/industryComparisonsData";
import { industryComparisonData } from "@/data/industryComparisonData";

interface StrategySessionLeadGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultIndustry?: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  callVolume: string;
  companySize: string;
  currentSolution: string;
  biggestChallenge: string;
  goals: string[];
  timeline: string;
  budget: string;
  foundUs: string;
  additionalContext: string;
}

const initialFormData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  industry: "",
  callVolume: "",
  companySize: "",
  currentSolution: "",
  biggestChallenge: "",
  goals: [],
  timeline: "",
  budget: "",
  foundUs: "",
  additionalContext: "",
};

export const StrategySessionLeadGate = ({ 
  open, 
  onOpenChange,
  defaultIndustry 
}: StrategySessionLeadGateProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({ 
    ...initialFormData,
    industry: defaultIndustry || "" 
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalSteps = 4;

  // Track lead gate opened
  useState(() => {
    if (open) {
      trackEvent('lead_gate_opened', {
        has_industry_preselect: !!defaultIndustry,
        industry: defaultIndustry || 'none'
      });
    }
  });

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone is required";
      } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = "Invalid phone format";
      }
      if (!formData.company.trim()) newErrors.company = "Company name is required";
    }

    if (currentStep === 2) {
      if (!formData.industry) newErrors.industry = "Industry is required";
      if (!formData.callVolume) newErrors.callVolume = "Call volume is required";
      if (!formData.companySize) newErrors.companySize = "Company size is required";
      if (!formData.currentSolution) newErrors.currentSolution = "Current solution is required";
    }

    if (currentStep === 3) {
      if (!formData.biggestChallenge.trim()) newErrors.biggestChallenge = "Please describe your biggest challenge";
      if (formData.goals.length === 0) newErrors.goals = [] as any;
      if (!formData.timeline) newErrors.timeline = "Timeline is required";
    }

    if (currentStep === 4) {
      if (!formData.budget) newErrors.budget = "Budget range is required";
      if (!formData.foundUs) newErrors.foundUs = "Please tell us how you found us";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      const nextStep = step + 1;
      setStep(nextStep);
      
      trackEvent('lead_gate_step_viewed', {
        step: nextStep,
        step_name: getStepName(nextStep)
      });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const getStepName = (stepNum: number): string => {
    const steps = ['basics', 'context', 'needs', 'qualification'];
    return steps[stepNum - 1] || 'unknown';
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    try {
      // Track conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'strategy_session_lead_submitted', {
          industry: formData.industry,
          call_volume: formData.callVolume,
          budget: formData.budget,
          timeline: formData.timeline
        });
      }

      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: 'Strategy Session Lead',
          content_category: formData.industry,
          value: 1,
        });
      }

      // Store in sessionStorage to prevent duplicate forms
      sessionStorage.setItem('strategy_session_lead_submitted', 'true');
      sessionStorage.setItem('booking_industry', formData.industry);

      setIsSuccess(true);

      // Auto-open Cal.com after 2 seconds
      setTimeout(() => {
        window.open(siteConfig.bookingUrl, '_blank');
        
        trackEvent('booking_page_opened', {
          source: 'lead_gate_completion',
          industry: formData.industry
        });

        // Redirect to demo video page after 3 seconds
        setTimeout(() => {
          window.location.href = '/demo-video?confirmed=true';
        }, 1000);
      }, 2000);

      toast.success("Thank you! Opening booking calendar...");
    } catch (error) {
      console.error("Lead submission error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleClose = () => {
    if (!isSuccess) {
      trackEvent('lead_gate_abandoned', {
        step: step,
        step_name: getStepName(step)
      });
    }
    onOpenChange(false);
    
    setTimeout(() => {
      setStep(1);
      setFormData({ ...initialFormData, industry: defaultIndustry || "" });
      setErrors({});
      setIsSuccess(false);
    }, 300);
  };

  // Helper functions for contextual insights using REAL industry data
  const getCallVolumeInsight = (volume: string): string => {
    if (!formData.industry) return "";
    
    const industryKey = formData.industry.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
    const industryData = industryComparisonsData[industryKey];
    
    if (!industryData) return "";
    
    const monthlySavings = parseFloat(industryData.monthlySavings.replace(/[^0-9.]/g, ''));
    const typicalVolume = industryData.typicalCallVolume;
    
    return `${industryData.displayName} businesses typically handle ${typicalVolume}. Based on your volume and our data, you could save approximately $${monthlySavings.toLocaleString()}/month vs traditional staffing.`;
  };

  const getCurrentSolutionInsight = (solution: string): string => {
    if (!formData.industry) return "";
    
    const industryKey = formData.industry.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
    const industryData = industryComparisonsData[industryKey];
    
    if (!industryData) return "";
    
    const aiCost = industryData.aiMonthlyCost;
    const humanCost = industryData.humanStaffCost;
    const monthlySavings = parseFloat(industryData.monthlySavings.replace(/[^0-9.]/g, ''));
    
    if (solution === "Human receptionist") {
      return `${industryData.displayName}: AI costs ${aiCost}/month vs ${humanCost}/month for a receptionist. That's $${monthlySavings.toLocaleString()}/month in savings while working 24/7.`;
    } else if (solution === "Answering service") {
      const callCenterCost = industryData.callCenterCost;
      return `${industryData.displayName}: Call centers cost ${callCenterCost}/month vs AI at ${aiCost}/month. Major cost reduction with better CRM integration.`;
    } else if (solution === "No receptionist" || solution === "Nothing") {
      return `${industryData.displayName} businesses lose ${industryData.afterHoursImportance} after-hours. AI can be live in ${industryData.setupTime} and starts capturing every call immediately.`;
    }
    
    return `AI can be deployed in ${industryData.setupTime} for ${industryData.displayName}, with ${industryData.nativeCRMIntegrations} for seamless data flow.`;
  };

  const getTimelineInsight = (timeline: string): string => {
    if (!formData.industry) return "";
    
    const industryKey = formData.industry.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
    const industryData = industryComparisonsData[industryKey];
    
    if (!industryData) return "";
    
    const setupTime = industryData.setupTime;
    const peakFactors = industryData.peakSeasonFactors;
    
    if (timeline === "Urgent - need ASAP" || timeline === "Urgent") {
      return `${industryData.displayName} typically deploys in ${setupTime}. ${peakFactors}. We can prioritize urgent implementations with dedicated support.`;
    } else if (timeline === "1-2 weeks") {
      return `Perfect timeline for ${industryData.displayName}. Standard setup is ${setupTime}, giving us time to configure ${industryData.nativeCRMIntegrations} and train on your specific processes.`;
    } else if (timeline === "1 month") {
      return `Excellent timeline for comprehensive setup. ${industryData.displayName} implementation includes ${industryData.industrySpecificFeatures.slice(0, 2).join(', ')}, all fully tested and optimized.`;
    } else if (timeline === "Just exploring") {
      const yearOneSavings = parseFloat(industryData.yearOneSavings.split('/')[0].replace(/[^0-9.]/g, ''));
      return `Smart to explore! Most ${industryData.displayName} businesses discover they're losing $${yearOneSavings.toLocaleString()}+ annually in missed opportunities. Let's quantify your specific situation.`;
    }
    
    return `During your strategy session, we'll show you exactly how AI fits into ${industryData.displayName} operations and what you're currently missing.`;
  };

  const getBudgetBenchmark = (budget: string, industry: string): string => {
    const industryKey = industry.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
    const industryData = industryComparisonsData[industryKey];
    const paybackData = industryComparisonData[industryKey];
    
    if (!industryData) return "";
    
    const aiCost = industryData.aiMonthlyCost;
    const yearOneSavings = parseFloat(industryData.yearOneSavings.split('/')[0].replace(/[^0-9.]/g, ''));
    const aiCostNumeric = parseFloat(aiCost.replace(/[^0-9.]/g, '').split('-')[1] || aiCost.replace(/[^0-9.]/g, ''));
    const roiPercent = Math.round((yearOneSavings / (aiCostNumeric * 12)) * 100);
    const paybackPeriod = paybackData?.paybackPeriod || "2-4 weeks";
    
    return `${industryData.displayName} AI typically costs ${aiCost}/month. Based on industry data, average ROI is ${roiPercent}% with payback in ${paybackPeriod}. Your budget aligns well with proven ${industry} implementations.`;
  };

  const getSuccessStory = (industry: string): string => {
    const industryKey = industry.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
    const industryData = industryComparisonsData[industryKey];
    
    if (!industryData) return "Businesses in your industry typically see strong ROI within the first 90 days of implementation.";
    
    const yearOneSavings = industryData.yearOneSavings.split('/')[0];
    const features = industryData.industrySpecificFeatures.slice(0, 2).join(', ');
    const compliance = industryData.criticalComplianceNeeds;
    
    return `${industryData.displayName} businesses using our system report ${yearOneSavings} in first-year value with ${features}. ${compliance ? `Critical compliance: ${compliance}.` : ''} Real client data from industry implementations.`;
  };

  const calculateEstimatedSavings = (data: FormData): string => {
    if (!data.industry) return "0";
    
    const industryKey = data.industry.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
    const industryData = industryComparisonsData[industryKey];
    
    if (!industryData) return "0";
    
    const monthlySavings = parseFloat(industryData.monthlySavings.replace(/[^0-9.]/g, ''));
    
    return monthlySavings.toLocaleString();
  };

  const calculateRevenueRecovery = (data: FormData): string => {
    if (!data.industry) return "0";
    
    const industryKey = data.industry.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
    const industryData = industryComparisonsData[industryKey];
    
    if (!industryData) return "0";
    
    const yearOneSavings = parseFloat(industryData.yearOneSavings.split('/')[0].replace(/[^0-9.]/g, ''));
    
    return yearOneSavings.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto pb-safe">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isSuccess ? "You're All Set!" : "Book Your Free Strategy Session"}
          </DialogTitle>
        </DialogHeader>

        {!isSuccess ? (
          <>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
                <span className="text-sm font-medium">{Math.round((step / totalSteps) * 100)}% Complete</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Step 1: Business Basics */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Smith"
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Your Company LLC"
                        className={errors.company ? "border-red-500" : ""}
                      />
                      {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
                    </div>
                  </div>
                )}

                {/* Step 2: Business Context */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label>Industry *</Label>
                      <Select value={formData.industry} onValueChange={(v) => setFormData({ ...formData, industry: v })}>
                        <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HVAC">HVAC & Home Services</SelectItem>
                          <SelectItem value="Legal">Legal Services</SelectItem>
                          <SelectItem value="Healthcare">Healthcare & Medical</SelectItem>
                          <SelectItem value="Accounting">Accounting & Finance</SelectItem>
                          <SelectItem value="Restaurants">Restaurants & Hospitality</SelectItem>
                          <SelectItem value="Roofing">Roofing & Construction</SelectItem>
                          <SelectItem value="Logistics">Logistics & Transportation</SelectItem>
                          <SelectItem value="Bars & Nightclubs">Bars & Nightclubs</SelectItem>
                          <SelectItem value="Spas">Spas & Wellness</SelectItem>
                          <SelectItem value="Hotels">Hotels & Hospitality</SelectItem>
                          <SelectItem value="Automotive">Automotive Services</SelectItem>
                          <SelectItem value="Real Estate">Real Estate</SelectItem>
                          <SelectItem value="Solar">Solar Energy</SelectItem>
                          <SelectItem value="Gym">Fitness & Gyms</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.industry && <p className="text-xs text-red-500 mt-1">{errors.industry}</p>}
                    </div>

                    <div>
                      <Label>Monthly Call Volume *</Label>
                      <Select value={formData.callVolume} onValueChange={(v) => setFormData({ ...formData, callVolume: v })}>
                        <SelectTrigger className={errors.callVolume ? "border-red-500" : ""}>
                          <SelectValue placeholder="How many calls per month?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-50">1-50 calls</SelectItem>
                          <SelectItem value="51-200">51-200 calls</SelectItem>
                          <SelectItem value="201-500">201-500 calls</SelectItem>
                          <SelectItem value="501-1000">501-1,000 calls</SelectItem>
                          <SelectItem value="1000+">1,000+ calls</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.callVolume && <p className="text-xs text-red-500 mt-1">{errors.callVolume}</p>}
                      {formData.callVolume && formData.industry && (
                        <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                          <TrendingUp className="inline w-3 h-3 mr-1" />
                          {getCallVolumeInsight(formData.callVolume)}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Company Size *</Label>
                      <Select value={formData.companySize} onValueChange={(v) => setFormData({ ...formData, companySize: v })}>
                        <SelectTrigger className={errors.companySize ? "border-red-500" : ""}>
                          <SelectValue placeholder="Number of employees" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 employees</SelectItem>
                          <SelectItem value="6-20">6-20 employees</SelectItem>
                          <SelectItem value="21-50">21-50 employees</SelectItem>
                          <SelectItem value="51-100">51-100 employees</SelectItem>
                          <SelectItem value="100+">100+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.companySize && <p className="text-xs text-red-500 mt-1">{errors.companySize}</p>}
                    </div>

                    <div>
                      <Label>Current Phone Solution *</Label>
                      <Select value={formData.currentSolution} onValueChange={(v) => setFormData({ ...formData, currentSolution: v })}>
                        <SelectTrigger className={errors.currentSolution ? "border-red-500" : ""}>
                          <SelectValue placeholder="How do you handle calls now?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Human receptionist">Human receptionist</SelectItem>
                          <SelectItem value="Answering service">Answering service / Call center</SelectItem>
                          <SelectItem value="Voicemail">Voicemail only</SelectItem>
                          <SelectItem value="IVR system">IVR / Phone tree</SelectItem>
                          <SelectItem value="Nothing">No dedicated solution</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.currentSolution && <p className="text-xs text-red-500 mt-1">{errors.currentSolution}</p>}
                      {formData.currentSolution && formData.industry && (
                        <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                          <Database className="inline w-3 h-3 mr-1" />
                          {getCurrentSolutionInsight(formData.currentSolution)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Needs Assessment */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="biggestChallenge">What's your biggest phone/lead challenge? *</Label>
                      <Textarea
                        id="biggestChallenge"
                        value={formData.biggestChallenge}
                        onChange={(e) => setFormData({ ...formData, biggestChallenge: e.target.value })}
                        placeholder="Tell us about the main issues you're facing with calls, leads, or customer communication..."
                        className={errors.biggestChallenge ? "border-red-500" : ""}
                        rows={3}
                      />
                      {errors.biggestChallenge && <p className="text-xs text-red-500 mt-1">{errors.biggestChallenge}</p>}
                    </div>

                    <div>
                      <Label>What goals matter most? (Select all that apply) *</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                          "Capture more leads",
                          "Reduce missed calls",
                          "24/7 availability",
                          "Lower staffing costs",
                          "Faster response times",
                          "Better customer experience"
                        ].map((goal) => (
                          <div key={goal} className="flex items-center space-x-2">
                            <Checkbox
                              id={goal}
                              checked={formData.goals.includes(goal)}
                              onCheckedChange={() => handleGoalToggle(goal)}
                            />
                            <label htmlFor={goal} className="text-sm cursor-pointer">{goal}</label>
                          </div>
                        ))}
                      </div>
                      {formData.goals.length === 0 && errors.goals !== undefined && (
                        <p className="text-xs text-red-500 mt-1">Please select at least one goal</p>
                      )}
                    </div>

                    <div>
                      <Label>Implementation Timeline *</Label>
                      <Select value={formData.timeline} onValueChange={(v) => setFormData({ ...formData, timeline: v })}>
                        <SelectTrigger className={errors.timeline ? "border-red-500" : ""}>
                          <SelectValue placeholder="When do you want to start?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Urgent">Urgent - need ASAP</SelectItem>
                          <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                          <SelectItem value="1 month">Within a month</SelectItem>
                          <SelectItem value="Just exploring">Just exploring options</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.timeline && <p className="text-xs text-red-500 mt-1">{errors.timeline}</p>}
                      {formData.timeline && formData.industry && (
                        <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                          <Sparkles className="inline w-3 h-3 mr-1" />
                          {getTimelineInsight(formData.timeline)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Budget & Qualification */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div>
                      <Label>Monthly Budget for AI Solution *</Label>
                      <Select value={formData.budget} onValueChange={(v) => setFormData({ ...formData, budget: v })}>
                        <SelectTrigger className={errors.budget ? "border-red-500" : ""}>
                          <SelectValue placeholder="What's your monthly budget?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Under $500">Under $500/month</SelectItem>
                          <SelectItem value="$500-$1,000">$500-$1,000/month</SelectItem>
                          <SelectItem value="$1,000-$2,500">$1,000-$2,500/month</SelectItem>
                          <SelectItem value="$2,500-$5,000">$2,500-$5,000/month</SelectItem>
                          <SelectItem value="$5,000+">$5,000+/month</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.budget && <p className="text-xs text-red-500 mt-1">{errors.budget}</p>}
                      {formData.budget && formData.industry && (
                        <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                          <TrendingUp className="inline w-3 h-3 mr-1" />
                          {getBudgetBenchmark(formData.budget, formData.industry)}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>How did you find us? *</Label>
                      <Select value={formData.foundUs} onValueChange={(v) => setFormData({ ...formData, foundUs: v })}>
                        <SelectTrigger className={errors.foundUs ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Google Search">Google Search</SelectItem>
                          <SelectItem value="Social Media">Social Media</SelectItem>
                          <SelectItem value="Referral">Referral / Word of Mouth</SelectItem>
                          <SelectItem value="Advertisement">Advertisement</SelectItem>
                          <SelectItem value="Industry Event">Industry Event / Conference</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.foundUs && <p className="text-xs text-red-500 mt-1">{errors.foundUs}</p>}
                    </div>

                    <div>
                      <Label htmlFor="additionalContext">Anything else we should know? (Optional)</Label>
                      <Textarea
                        id="additionalContext"
                        value={formData.additionalContext}
                        onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
                        placeholder="Any specific requirements, questions, or context you'd like to share..."
                        rows={3}
                      />
                    </div>

                    {/* ROI Preview */}
                    {formData.industry && (
                      <div className="p-4 bg-gradient-to-r from-primary/10 to-cyan-500/10 rounded-lg border border-primary/20">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Your Potential with AI
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Est. Monthly Savings</p>
                            <p className="text-xl font-bold text-primary">${calculateEstimatedSavings(formData)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">First Year Value</p>
                            <p className="text-xl font-bold text-primary">${calculateRevenueRecovery(formData)}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {getSuccessStory(formData.industry)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}
              
              {step < totalSteps ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Book Strategy Session
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </>
        ) : (
          /* Success State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>
            
            <h3 className="text-xl font-bold mb-2">Thank You!</h3>
            <p className="text-muted-foreground mb-4">
              Opening Cal.com to book your strategy session...
            </p>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                After booking, you'll be redirected to our demo video to see our AI in action.
              </p>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};
