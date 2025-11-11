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
import { sendStrategySessionLead } from "@/lib/apollo-integration";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";

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
      if (formData.goals.length === 0) newErrors.goals = [] as any; // Type workaround for validation message
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
      setStep(step + 1);
      
      // Track analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'strategy_session_lead_gate_step', {
          step_number: step,
          step_name: getStepName(step)
        });
      }
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
      const success = await sendStrategySessionLead(formData);

      if (success) {
        setIsSuccess(true);
        
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

        // Auto-open Calendly after 2 seconds
        setTimeout(() => {
          window.open(siteConfig.bookingUrl, '_blank');
          
          // Track booking intent
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'calendly_opened_after_lead_gate', {
              industry: formData.industry
            });
          }
        }, 2000);

        toast.success("Thank you! Opening booking calendar...");
      } else {
        toast.error("Something went wrong. Please try again or contact us directly.");
      }
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
      // Track abandonment
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'strategy_session_lead_gate_abandoned', {
          step: step,
          step_name: getStepName(step)
        });
      }
    }
    onOpenChange(false);
    
    // Reset after animation
    setTimeout(() => {
      setStep(1);
      setFormData({ ...initialFormData, industry: defaultIndustry || "" });
      setErrors({});
      setIsSuccess(false);
    }, 300);
  };

  // Helper functions for contextual insights
  const getCallVolumeInsight = (volume: string): string => {
    const insights: Record<string, string> = {
      "<10": "At this volume, you're likely losing 2-3 calls per week (20-30% miss rate). That's $500-2K in missed revenue monthly for most businesses.",
      "10-25": "Businesses at this volume typically miss 15-20% of calls. AI can capture an extra $2-4K in monthly revenue you're currently losing.",
      "25-50": "This is the sweet spot for AI ROI. You're likely missing $5-8K monthly in after-hours and overflow calls. AI pays for itself in the first week.",
      "50-100": "At this volume, you need 2-3 receptionists to cover all calls. AI can replace 1.5 full-time positions, saving $40-60K annually.",
      "100+": "High-volume businesses save $80K+ annually with AI. You can handle seasonal spikes without temp hiring or missed calls."
    };
    return insights[volume] || "";
  };

  const getCurrentSolutionInsight = (solution: string): string => {
    const insights: Record<string, string> = {
      "No receptionist": "Studies show businesses with only voicemail lose 67% of callers who won't leave messages. You're losing $10-50K annually in potential revenue.",
      "Human receptionist": "Great! AI can work alongside your receptionist, handling after-hours and overflow so your team focuses on complex situations during business hours.",
      "Answering service": "Most answering services cost $3-8 per call and lack CRM integration. AI typically costs 60-70% less with better data capture.",
      "Other AI": "Not all AI is created equal. Custom-trained agents outperform generic solutions by 3-5x in conversion rates. Let's compare what you're currently getting.",
      "Nothing": "You're in emergency mode. Every unanswered call is lost revenue. AI can be live in 3-7 days and starts capturing leads immediately."
    };
    return insights[solution] || "";
  };

  const getTimelineInsight = (timeline: string): string => {
    const insights: Record<string, string> = {
      "Urgent - need ASAP": "We prioritize urgent implementations. You can be live in 3-5 days with priority support. Most urgent clients see ROI within the first week.",
      "1-2 weeks": "Perfect timeline. This gives us time to custom-train your agent thoroughly while maintaining urgency. You'll be capturing leads before month-end.",
      "1 month": "Smart approach. This timeline allows for comprehensive training, integration testing, and staff onboarding. You'll have a bulletproof system.",
      "Just exploring": "Great time to explore! 80% of businesses who 'just explore' AI discover they're losing $20-80K annually in missed calls. Knowledge is power.",
      "Not sure yet": "No problem. During our strategy session, we'll analyze your current situation and show you exactly what you're missing. No pressure, just insights."
    };
    return insights[timeline] || "";
  };

  const getBudgetBenchmark = (budget: string, industry: string): string => {
    const benchmarks: Record<string, string> = {
      "<$1000": `Most ${industry} businesses at this budget start with our basic tier, focusing on after-hours coverage. Average ROI: 380%.`,
      "$1000-2000": `This is the most popular tier for ${industry} companies. You get full 24/7 coverage with CRM integration. Typical payback: 3-4 weeks.`,
      "$2000-3000": `${industry} businesses in this range typically add advanced features like multi-language support and custom integrations. ROI: 450%+.`,
      "$3000-5000": `Premium tier for high-volume ${industry} operations. Includes dedicated success manager and priority support. Most see 5-8x ROI.`,
      "$5000+": `Enterprise ${industry} clients at this level get white-glove service, custom development, and direct executive access. ROI typically exceeds 600%.`,
      "Need recommendation": "Perfect! Based on your call volume and industry, we'll recommend the optimal tier during your strategy session."
    };
    return benchmarks[budget] || "";
  };

  const getSuccessStory = (industry: string): string => {
    const stories: Record<string, string> = {
      "HVAC": "Premier HVAC in Dallas was losing $60K annually in after-hours emergency calls. After implementing AI, they captured 100% of night/weekend emergencies and added $180K in annual revenue within 6 months.",
      "Legal": "Thompson & Associates law firm reduced intake time from 45 minutes to 8 minutes per prospect. Their AI pre-qualifies cases 24/7, increasing booked consultations by 240%.",
      "Healthcare": "Family Health Clinic eliminated 80% of no-shows with automated appointment reminders. Their front desk staff now focuses on patient care instead of phone duty.",
      "Restaurants": "Bella Vista Restaurant freed their host from constant phone interruptions. AI handles 100% of reservations while the host creates memorable in-person experiences. Bookings up 35%.",
      "Accounting": "Miller CPA Firm implemented AI during tax season. Instead of hiring 3 temp receptionists, AI handled 800+ calls with zero wait time. Saved $18K in seasonal staffing.",
      "Roofing": "Summit Roofing Services was missing 40% of storm-related emergency calls. AI now captures every lead 24/7, generating an additional $240K in annual revenue.",
      "Logistics": "FastTrack Logistics reduced quote response time from 4 hours to under 2 minutes. AI handles 200+ daily shipping inquiries, increasing conversion rate by 180%.",
      "Bars & Nightclubs": "Club Velvet implemented AI for VIP table bookings. Weekend booking rate increased 65%, and staff can focus on in-venue guest experience instead of phones.",
    };
    return stories[industry] || "Businesses in your industry typically see 3-5x ROI within the first 90 days of implementation.";
  };

  const calculateEstimatedSavings = (data: FormData): string => {
    const volumeMap: Record<string, number> = {
      "<10": 500,
      "10-25": 1500,
      "25-50": 2500,
      "50-100": 4000,
      "100+": 6000
    };
    
    const baselineSavings = volumeMap[data.callVolume] || 0;
    const multiplier = data.currentSolution === "Answering service" ? 1.5 : 1.0;
    
    return (baselineSavings * multiplier).toLocaleString();
  };

  const calculateRevenueRecovery = (data: FormData): string => {
    const volumeMap: Record<string, number> = {
      "<10": 8000,
      "10-25": 24000,
      "25-50": 48000,
      "50-100": 72000,
      "100+": 120000
    };
    
    return (volumeMap[data.callVolume] || 0).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                        placeholder="Smith HVAC Services"
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
                      <Label htmlFor="industry">Industry *</Label>
                      <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                        <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HVAC">HVAC & Home Services</SelectItem>
                          <SelectItem value="Legal">Legal Services</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Restaurants">Restaurants & Hospitality</SelectItem>
                          <SelectItem value="Accounting">Accounting & Finance</SelectItem>
                          <SelectItem value="Roofing">Roofing & Construction</SelectItem>
                          <SelectItem value="Logistics">Logistics & Transportation</SelectItem>
                          <SelectItem value="Bars & Nightclubs">Bars & Nightclubs</SelectItem>
                          <SelectItem value="Other">Other Industry</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.industry && <p className="text-xs text-red-500 mt-1">{errors.industry}</p>}
                    </div>

                    <div>
                      <Label htmlFor="callVolume">Current Call Volume *</Label>
                      <Select value={formData.callVolume} onValueChange={(value) => setFormData({ ...formData, callVolume: value })}>
                        <SelectTrigger className={errors.callVolume ? "border-red-500" : ""}>
                          <SelectValue placeholder="Average calls per day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<10">Less than 10 per day</SelectItem>
                          <SelectItem value="10-25">10-25 per day</SelectItem>
                          <SelectItem value="25-50">25-50 per day</SelectItem>
                          <SelectItem value="50-100">50-100 per day</SelectItem>
                          <SelectItem value="100+">100+ per day</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.callVolume && <p className="text-xs text-red-500 mt-1">{errors.callVolume}</p>}
                      
                      {/* Educational Insight */}
                      {formData.callVolume && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg"
                        >
                          <p className="text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{getCallVolumeInsight(formData.callVolume)}</span>
                          </p>
                        </motion.div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="companySize">Company Size *</Label>
                      <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
                        <SelectTrigger className={errors.companySize ? "border-red-500" : ""}>
                          <SelectValue placeholder="Number of employees" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Solo">Just me (Solo)</SelectItem>
                          <SelectItem value="2-10">2-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="200+">200+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.companySize && <p className="text-xs text-red-500 mt-1">{errors.companySize}</p>}
                    </div>

                    <div>
                      <Label htmlFor="currentSolution">Current Phone Solution *</Label>
                      <Select value={formData.currentSolution} onValueChange={(value) => setFormData({ ...formData, currentSolution: value })}>
                        <SelectTrigger className={errors.currentSolution ? "border-red-500" : ""}>
                          <SelectValue placeholder="What do you use now?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No receptionist">No receptionist (just voicemail)</SelectItem>
                          <SelectItem value="Human receptionist">Human receptionist</SelectItem>
                          <SelectItem value="Answering service">Answering service / Call center</SelectItem>
                          <SelectItem value="Other AI">Other AI solution</SelectItem>
                          <SelectItem value="Nothing">Nothing - calls go unanswered</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.currentSolution && <p className="text-xs text-red-500 mt-1">{errors.currentSolution}</p>}
                      
                      {/* Educational Insight */}
                      {formData.currentSolution && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg"
                        >
                          <p className="text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{getCurrentSolutionInsight(formData.currentSolution)}</span>
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* ROI Preview Sidebar */}
                    {formData.callVolume && formData.industry && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mt-6 p-6 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-xl"
                      >
                        <h4 className="font-bold mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                          <TrendingUp className="w-4 h-4" />
                          Your Estimated Impact
                        </h4>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Industry:</span>
                            <span className="font-semibold">{formData.industry}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Call Volume:</span>
                            <span className="font-semibold">{formData.callVolume}/day</span>
                          </div>
                          
                          <div className="h-px bg-border my-2" />
                          
                          <div className="p-3 bg-green-500/10 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">Estimated Monthly Savings</div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              ${calculateEstimatedSavings(formData)}
                            </div>
                          </div>
                          
                          <div className="p-3 bg-blue-500/10 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">Annual Revenue Recovery</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              ${calculateRevenueRecovery(formData)}
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground text-center pt-2">
                            Based on {formData.industry} industry benchmarks
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Step 3: Needs Assessment */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="biggestChallenge">What's Your Biggest Challenge with Phone Coverage? *</Label>
                      <Textarea
                        id="biggestChallenge"
                        value={formData.biggestChallenge}
                        onChange={(e) => setFormData({ ...formData, biggestChallenge: e.target.value })}
                        placeholder="Example: We lose after-hours emergency calls worth $50K+ annually..."
                        rows={4}
                        className={errors.biggestChallenge ? "border-red-500" : ""}
                      />
                      {errors.biggestChallenge && <p className="text-xs text-red-500 mt-1">{errors.biggestChallenge}</p>}
                    </div>

                    <div>
                      <Label>What Are Your Goals? (Select all that apply) *</Label>
                      <div className="space-y-2 mt-2">
                        {[
                          "Capture after-hours calls",
                          "Reduce staff costs",
                          "Scale during busy seasons",
                          "Improve response time",
                          "Free up team time",
                          "Better lead qualification",
                          "Other"
                        ].map((goal) => (
                          <div key={goal} className="flex items-center space-x-2">
                            <Checkbox
                              id={goal}
                              checked={formData.goals.includes(goal)}
                              onCheckedChange={() => handleGoalToggle(goal)}
                            />
                            <label htmlFor={goal} className="text-sm cursor-pointer">
                              {goal}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.goals && <p className="text-xs text-red-500 mt-1">{errors.goals}</p>}
                    </div>

                    <div>
                      <Label htmlFor="timeline">Implementation Timeline *</Label>
                      <Select value={formData.timeline} onValueChange={(value) => setFormData({ ...formData, timeline: value })}>
                        <SelectTrigger className={errors.timeline ? "border-red-500" : ""}>
                          <SelectValue placeholder="When do you need this?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Urgent">Urgent - need ASAP</SelectItem>
                          <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                          <SelectItem value="1 month">Within 1 month</SelectItem>
                          <SelectItem value="Just exploring">Just exploring options</SelectItem>
                          <SelectItem value="Not sure">Not sure yet</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.timeline && <p className="text-xs text-red-500 mt-1">{errors.timeline}</p>}
                      
                      {/* Timeline Insight */}
                      {formData.timeline && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg"
                        >
                          <p className="text-xs text-purple-600 dark:text-purple-400 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{getTimelineInsight(formData.timeline)}</span>
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Success Story Micro-Content */}
                    {formData.industry && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-muted/30 rounded-lg border-l-4 border-primary"
                      >
                        <p className="text-xs font-semibold mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          💡 Similar Business Success
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          {getSuccessStory(formData.industry)}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Step 4: Budget & Qualification */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="budget">Monthly Budget Range *</Label>
                      <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                        <SelectTrigger className={errors.budget ? "border-red-500" : ""}>
                          <SelectValue placeholder="What's your budget?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<$1000">Less than $1,000/month</SelectItem>
                          <SelectItem value="$1000-2000">$1,000 - $2,000/month</SelectItem>
                          <SelectItem value="$2000-3000">$2,000 - $3,000/month</SelectItem>
                          <SelectItem value="$3000-5000">$3,000 - $5,000/month</SelectItem>
                          <SelectItem value="$5000+">$5,000+/month</SelectItem>
                          <SelectItem value="Need recommendation">Need recommendation based on needs</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.budget && <p className="text-xs text-red-500 mt-1">{errors.budget}</p>}
                      
                      {/* Budget Benchmark */}
                      {formData.budget && formData.industry && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20"
                        >
                          <div className="flex items-start gap-3">
                            <Database className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold mb-2">Industry Benchmark</p>
                              <p className="text-xs text-muted-foreground">
                                {getBudgetBenchmark(formData.budget, formData.industry)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="foundUs">How Did You Find Us? *</Label>
                      <Select value={formData.foundUs} onValueChange={(value) => setFormData({ ...formData, foundUs: value })}>
                        <SelectTrigger className={errors.foundUs ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Google search">Google search</SelectItem>
                          <SelectItem value="Social media">Social media (LinkedIn, Facebook, etc.)</SelectItem>
                          <SelectItem value="Referral">Referral from colleague/friend</SelectItem>
                          <SelectItem value="Industry directory">Industry directory/listing</SelectItem>
                          <SelectItem value="Advertisement">Online advertisement</SelectItem>
                          <SelectItem value="YouTube">YouTube</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.foundUs && <p className="text-xs text-red-500 mt-1">{errors.foundUs}</p>}
                    </div>

                    <div>
                      <Label htmlFor="additionalContext">Anything Else We Should Know? (Optional)</Label>
                      <Textarea
                        id="additionalContext"
                        value={formData.additionalContext}
                        onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
                        placeholder="Any specific requirements, questions, or context that would help us prepare..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 1 || isSubmitting}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              {step < totalSteps ? (
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="gap-2 bg-gradient-primary"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit & Book Session
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
            <p className="text-muted-foreground mb-4">
              Your information has been received. We're opening the booking calendar in a new tab...
            </p>
            <p className="text-sm text-muted-foreground">
              We'll review your details and come prepared with industry-specific insights for your strategy session.
            </p>
            <Button onClick={handleClose} variant="outline" className="mt-6">
              Close
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};
