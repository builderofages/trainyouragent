import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, ArrowLeft, CheckCircle2, Calendar, Zap, MessageSquare, DollarSign, Users, Building2, Flame, Martini, Calculator, UtensilsCrossed, Home, Scale, Heart, Truck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { Progress } from "@/components/ui/progress";
import { trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  icon: any;
  options: {
    label: string;
    description: string;
    days: number;
    icon: any;
  }[];
}

interface EstimatorAnswers {
  industry?: string;
  services: number;
  integrations: number;
  terminology: number;
  pricing: number;
  feedback: number;
}

interface IndustryTimelineConfig {
  id: string;
  name: string;
  icon: any;
  baselineDays: number;
  considerations: string[];
  commonComplexities: string;
}

const industryBaselines: IndustryTimelineConfig[] = [
  {
    id: "hvac",
    name: "HVAC",
    icon: Flame,
    baselineDays: 3,
    considerations: [
      "Emergency service protocols",
      "Seasonal pricing variations",
      "Equipment brand familiarity"
    ],
    commonComplexities: "HVAC typically needs standard setup. Emergency dispatch training is straightforward."
  },
  {
    id: "bars",
    name: "Bars & Nightclubs",
    icon: Martini,
    baselineDays: 3.5,
    considerations: [
      "VIP/bottle service protocols",
      "Event-specific pricing",
      "Peak hours handling (Fri/Sat nights)"
    ],
    commonComplexities: "Nightlife requires training on premium service language and event booking complexity."
  },
  {
    id: "accounting",
    name: "Accounting",
    icon: Calculator,
    baselineDays: 4,
    considerations: [
      "Tax deadline awareness",
      "Complex service qualification",
      "Compliance terminology"
    ],
    commonComplexities: "Accounting requires extensive terminology training and service qualification logic."
  },
  {
    id: "restaurants",
    name: "Restaurants",
    icon: UtensilsCrossed,
    baselineDays: 3,
    considerations: [
      "Menu knowledge",
      "Dietary restriction handling",
      "Reservation system integration"
    ],
    commonComplexities: "Restaurants typically have straightforward reservation logic with standard pricing."
  },
  {
    id: "roofing",
    name: "Roofing",
    icon: Home,
    baselineDays: 3.5,
    considerations: [
      "Emergency leak detection",
      "Insurance claim processes",
      "Material type knowledge"
    ],
    commonComplexities: "Roofing needs training on emergency triage and insurance coordination."
  },
  {
    id: "legal",
    name: "Legal",
    icon: Scale,
    baselineDays: 4.5,
    considerations: [
      "Practice area routing",
      "Confidentiality protocols",
      "Case qualification criteria"
    ],
    commonComplexities: "Legal has the highest complexity due to specialized terminology and careful qualification needs."
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: Heart,
    baselineDays: 4,
    considerations: [
      "HIPAA compliance requirements",
      "Insurance verification protocols",
      "Medical terminology"
    ],
    commonComplexities: "Healthcare requires HIPAA-compliant training and insurance verification logic."
  },
  {
    id: "logistics",
    name: "Logistics",
    icon: Truck,
    baselineDays: 3.5,
    considerations: [
      "Shipping calculation logic",
      "Route optimization",
      "Cargo handling specifications"
    ],
    commonComplexities: "Logistics needs training on dynamic pricing and capacity management."
  },
  {
    id: "other",
    name: "Other Industry",
    icon: Building2,
    baselineDays: 3.5,
    considerations: [
      "Custom business requirements",
      "Unique terminology",
      "Specialized workflows"
    ],
    commonComplexities: "Custom industries typically need moderate setup time depending on complexity."
  }
];

const industryQuestion: Question = {
  id: "industry",
  question: "What industry is your business in?",
  icon: Building2,
  options: industryBaselines.map(industry => ({
    label: industry.name,
    description: industry.commonComplexities,
    days: industry.baselineDays - 3,
    icon: industry.icon
  }))
};

const serviceQuestions: Question[] = [
  {
    id: "services",
    question: "How many different services do you offer?",
    icon: Zap,
    options: [
      { label: "Single service", description: "One main service offering", days: 0, icon: Zap },
      { label: "2-5 services", description: "Small service menu", days: 0.5, icon: Zap },
      { label: "6-15 services", description: "Medium service catalog", days: 1, icon: Zap },
      { label: "16+ services", description: "Extensive service menu", days: 2, icon: Zap },
    ],
  },
  {
    id: "integrations",
    question: "What integrations do you need?",
    icon: Users,
    options: [
      { label: "None - just phone", description: "Voice calls only", days: 0, icon: Users },
      { label: "Calendar only", description: "Appointment scheduling", days: 0.5, icon: Calendar },
      { label: "Calendar + CRM", description: "Scheduling and contact management", days: 1, icon: Users },
      { label: "CRM + Calendar + Payments", description: "Full business suite", days: 1.5, icon: DollarSign },
      { label: "Complex custom integrations", description: "Multiple systems", days: 2, icon: Users },
    ],
  },
  {
    id: "terminology",
    question: "How would you describe your industry terminology?",
    icon: MessageSquare,
    options: [
      { label: "Standard/Common", description: "Everyday language", days: 0, icon: MessageSquare },
      { label: "Moderately specialized", description: "Some industry terms", days: 0.5, icon: MessageSquare },
      { label: "Highly technical", description: "Specialized vocabulary", days: 1, icon: MessageSquare },
      { label: "Unique to our business", description: "Custom terminology", days: 1.5, icon: MessageSquare },
    ],
  },
  {
    id: "pricing",
    question: "What's your pricing structure like?",
    icon: DollarSign,
    options: [
      { label: "Fixed price per service", description: "Simple flat rates", days: 0, icon: DollarSign },
      { label: "Tiered pricing (2-3 tiers)", description: "Multiple price levels", days: 0.5, icon: DollarSign },
      { label: "Variable by location/season", description: "Dynamic pricing", days: 1, icon: DollarSign },
      { label: "Complex/custom quotes", description: "Quote-based pricing", days: 1.5, icon: DollarSign },
    ],
  },
  {
    id: "feedback",
    question: "How quickly can you provide feedback during setup?",
    icon: Calendar,
    options: [
      { label: "Same day responses", description: "Immediate availability", days: 0, icon: Calendar },
      { label: "Within 24 hours", description: "Next business day", days: 0.5, icon: Calendar },
      { label: "2-3 day response time", description: "Within a few days", days: 1, icon: Calendar },
      { label: "Slower than 3 days", description: "Limited availability", days: 1.5, icon: Calendar },
    ],
  },
];

const allQuestions: Question[] = [industryQuestion, ...serviceQuestions];

interface TimelineEstimatorProps {
  onClose?: () => void;
}

export const TimelineEstimator = ({ onClose }: TimelineEstimatorProps) => {
  const [step, setStep] = useState<"welcome" | "questions" | "results">("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const industryParam = urlParams.get('industry');
    return industryParam && industryBaselines.find(ind => ind.id === industryParam) ? 1 : 0;
  });
  const [answers, setAnswers] = useState<Partial<EstimatorAnswers>>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const industryParam = urlParams.get('industry');
    if (industryParam && industryBaselines.find(ind => ind.id === industryParam)) {
      return { industry: industryParam };
    }
    return {};
  });
  const [startTime] = useState(Date.now());

  const handleStart = () => {
    setStep("questions");
    const urlParams = new URLSearchParams(window.location.search);
    const industryParam = urlParams.get('industry');
    trackEvent("timeline_estimator_started", {
      source: "implementation_timeline",
      page: window.location.pathname,
      has_industry_preselect: !!industryParam,
      preselected_industry: industryParam || undefined
    });
  };

  const handleAnswer = (questionId: string, days: number) => {
    const newAnswers = { ...answers, [questionId]: days };
    setAnswers(newAnswers);

    trackEvent("timeline_estimator_question_answered", {
      question_number: currentQuestion + 1,
      question_id: questionId,
      added_days: days,
      total_questions: allQuestions.length,
      industry: answers.industry || "not_selected_yet"
    });

    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep("results");
      
      const timeline = calculateTimeline(newAnswers as EstimatorAnswers);
      trackEvent("timeline_estimator_completed", {
        industry: timeline.industryName,
        industry_id: newAnswers.industry,
        industry_baseline_days: timeline.breakdown.industry,
        estimated_days_min: timeline.min,
        estimated_days_max: timeline.max,
        complexity: timeline.complexity,
        services_days: newAnswers.services || 0,
        integrations_days: newAnswers.integrations || 0,
        terminology_days: newAnswers.terminology || 0,
        pricing_days: newAnswers.pricing || 0,
        feedback_days: newAnswers.feedback || 0,
        time_spent_seconds: Math.round((Date.now() - startTime) / 1000),
      });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReset = () => {
    setStep("welcome");
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleBookCall = () => {
    const timeline = calculateTimeline(answers as EstimatorAnswers);
    trackEvent("timeline_estimator_cta_clicked", {
      cta_type: "book_discovery_call",
      estimated_timeline: `${timeline.min}-${timeline.max} days`,
      complexity: timeline.complexity,
      industry: timeline.industryName,
      industry_id: answers.industry
    });
    window.open("https://calendly.com/trainyouragent/discovery", "_blank");
  };

  const calculateTimeline = (answers: EstimatorAnswers) => {
    const selectedIndustry = industryBaselines.find(
      ind => ind.id === answers.industry
    ) || industryBaselines.find(ind => ind.id === "other");
    
    const industryBase = selectedIndustry?.baselineDays || 3;
    
    const total = industryBase + 
      (answers.services || 0) +
      (answers.integrations || 0) +
      (answers.terminology || 0) +
      (answers.pricing || 0) +
      (answers.feedback || 0);
    
    const rounded = Math.ceil(total);

    return {
      min: Math.max(3, rounded - 1),
      max: Math.min(7, rounded + 1),
      exact: rounded,
      industryName: selectedIndustry?.name || "General",
      industryIcon: selectedIndustry?.icon || Building2,
      industryConsiderations: selectedIndustry?.considerations || [],
      breakdown: {
        industry: industryBase,
        industryName: selectedIndustry?.name || "General",
        services: answers.services || 0,
        integrations: answers.integrations || 0,
        terminology: answers.terminology || 0,
        pricing: answers.pricing || 0,
        feedback: answers.feedback || 0,
      },
      complexity: rounded <= 4 ? "Simple" : rounded <= 5 ? "Standard" : "Complex",
    };
  };

  const progress = ((currentQuestion + 1) / allQuestions.length) * 100;
  const timeline = calculateTimeline(answers as EstimatorAnswers);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12 px-6"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mb-8"
            >
              <Clock className="w-12 h-12 text-primary-foreground" />
            </motion.div>
            
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Estimate Your Implementation Timeline
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Answer 6 quick questions including your industry to get your personalized timeline estimate. Takes about 60 seconds.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary mb-1">6</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary mb-1">60s</div>
                <div className="text-sm text-muted-foreground">Time Needed</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary mb-1">3-7</div>
                <div className="text-sm text-muted-foreground">Day Range</div>
              </div>
            </div>

            <MagneticButton size="lg" onClick={handleStart}>
              Start Estimator
              <ArrowRight className="ml-2" />
            </MagneticButton>
          </motion.div>
        )}

        {step === "questions" && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="py-8 px-6"
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Question {currentQuestion + 1} of {allQuestions.length}
                </span>
                <span className="text-sm font-medium text-primary">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-8">
                {(() => {
                  const Icon = allQuestions[currentQuestion].icon;
                  return <Icon className="w-8 h-8 text-primary" />;
                })()}
                <h3 className="text-2xl font-bold">{allQuestions[currentQuestion].question}</h3>
              </div>

              <div className={cn(
                "grid gap-3",
                currentQuestion === 0 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {allQuestions[currentQuestion].options.map((option, index) => {
                  const OptionIcon = option.icon;
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleAnswer(allQuestions[currentQuestion].id, option.days)}
                      className={cn(
                        "w-full p-6 rounded-xl border-2 text-left transition-all duration-200",
                        "hover:border-primary hover:bg-primary/5 hover:scale-[1.02]",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        "bg-card border-border",
                        currentQuestion === 0 && "min-h-[160px]"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <OptionIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg mb-1">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                        {option.days > 0 && (
                          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            +{option.days}d
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {currentQuestion > 0 && (
              <div className="mt-8">
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="mr-2" />
                  Previous Question
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-8 px-6"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4"
              >
                {(() => {
                  const IndustryIcon = timeline.industryIcon;
                  return <IndustryIcon className="w-10 h-10 text-primary" />;
                })()}
              </motion.div>

              <h2 className="text-3xl font-bold mb-3">Your Estimated Timeline</h2>
              
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
                className="inline-flex items-baseline gap-2 mb-2"
              >
                <span className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {timeline.min}-{timeline.max}
                </span>
                <span className="text-3xl font-semibold text-muted-foreground">days</span>
              </motion.div>

              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                  {timeline.industryName}
                </div>
                
                <div
                  className={cn(
                    "inline-block px-4 py-2 rounded-full text-sm font-semibold",
                    timeline.complexity === "Simple" && "bg-green-500/10 text-green-600 dark:text-green-400",
                    timeline.complexity === "Standard" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                    timeline.complexity === "Complex" && "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                  )}
                >
                  {timeline.complexity} Complexity
                </div>
              </div>
            </div>

            {timeline.industryConsiderations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20"
              >
                <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {timeline.industryName}-Specific Considerations
                </h4>
                <ul className="space-y-1">
                  {timeline.industryConsiderations.map((consideration, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{consideration}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <GlassCard className="p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Timeline Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">{timeline.breakdown.industryName} Industry Base</span>
                  <span className="font-semibold">{timeline.breakdown.industry} days</span>
                </div>
                {timeline.breakdown.services > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Service Complexity</span>
                    <span className="font-semibold text-primary">+{timeline.breakdown.services} days</span>
                  </div>
                )}
                {timeline.breakdown.integrations > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Integrations</span>
                    <span className="font-semibold text-primary">+{timeline.breakdown.integrations} days</span>
                  </div>
                )}
                {timeline.breakdown.terminology > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Terminology Training</span>
                    <span className="font-semibold text-primary">+{timeline.breakdown.terminology} days</span>
                  </div>
                )}
                {timeline.breakdown.pricing > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Pricing Configuration</span>
                    <span className="font-semibold text-primary">+{timeline.breakdown.pricing} days</span>
                  </div>
                )}
                {timeline.breakdown.feedback > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Feedback Cycle</span>
                    <span className="font-semibold text-primary">+{timeline.breakdown.feedback} days</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-3 pt-4">
                  <span className="font-semibold text-lg">Total Estimated Time</span>
                  <span className="font-bold text-xl text-primary">{timeline.min}-{timeline.max} days</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This {timeline.industryName.toLowerCase()} timeline estimate is based on your answers. Your actual timeline will be confirmed during your discovery call, where we'll discuss your specific needs in detail.
                </p>
              </div>
            </GlassCard>

            <div className="flex flex-col sm:flex-row gap-3">
              <MagneticButton size="lg" className="flex-1" onClick={handleBookCall}>
                <Calendar className="mr-2" />
                Book Discovery Call to Confirm
              </MagneticButton>
              <Button size="lg" variant="outline" onClick={handleReset}>
                Start Over
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
