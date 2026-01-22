import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import {
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Wrench,
  Calculator,
  Home,
  Briefcase,
  Heart,
  Truck,
  Utensils,
} from "lucide-react";
import { motion } from "framer-motion";
import { nicheConfig, isAllowedRedirect } from "@/config/niches";
import { toast } from "sonner";
import { MondayWebhookSetup, getWebhookUrl, sendToMonday } from "@/components/MondayWebhookSetup";

const nicheData: Record<string, any> = {
  hvac: {
    icon: Wrench,
    title: "HVAC Businesses",
    subtitle: "Capture leads 24/7, qualify customers instantly, and book appointments automatically",
    color: "from-blue-500 to-cyan-500",
    painPoints: [
      {
        icon: Clock,
        title: "Missing Calls After Hours",
        description: "Lose 60% of leads outside business hours",
        color: "from-red-500 to-orange-500",
      },
      {
        icon: DollarSign,
        title: "High Customer Acquisition Cost",
        description: "Average $300+ per HVAC customer",
        color: "from-yellow-500 to-red-500",
      },
      {
        icon: Users,
        title: "Slow Response Times",
        description: "Customers choose competitors who respond faster",
        color: "from-orange-500 to-red-500",
      },
    ],
    solutions: [
      { title: "24/7 Lead Capture", description: "Never miss another customer call" },
      { title: "Instant Qualification", description: "Pre-qualify leads automatically" },
      { title: "Smart Scheduling", description: "Book appointments while you sleep" },
    ],
    stats: [
      { value: "3x", label: "More Leads Captured" },
      { value: "60%", label: "Lower CAC" },
      { value: "24/7", label: "Customer Coverage" },
    ],
  },
  accounting: {
    icon: Calculator,
    title: "Accounting Firms",
    subtitle: "Streamline client onboarding, document collection, and consultation booking",
    color: "from-green-500 to-emerald-500",
    painPoints: [
      {
        icon: Clock,
        title: "Time-Consuming Onboarding",
        description: "Hours spent collecting client documents",
        color: "from-red-500 to-orange-500",
      },
      {
        icon: DollarSign,
        title: "Missed Consultation Opportunities",
        description: "Potential clients slip through the cracks",
        color: "from-yellow-500 to-red-500",
      },
      {
        icon: Users,
        title: "Manual Follow-Ups",
        description: "Too much time on administrative tasks",
        color: "from-orange-500 to-red-500",
      },
    ],
    solutions: [
      { title: "Automated Onboarding", description: "Collect documents automatically" },
      { title: "Smart Scheduling", description: "Book consultations seamlessly" },
      { title: "Client Qualification", description: "Pre-screen potential clients" },
    ],
    stats: [
      { value: "5x", label: "Faster Onboarding" },
      { value: "70%", label: "Time Saved" },
      { value: "24/7", label: "Client Support" },
    ],
  },
  roofing: {
    icon: Home,
    title: "Roofing Contractors",
    subtitle: "Qualify leads, schedule inspections, and provide instant estimates",
    color: "from-orange-500 to-red-500",
    painPoints: [
      {
        icon: Clock,
        title: "Delayed Inspections",
        description: "Lose leads to faster competitors",
        color: "from-red-500 to-orange-500",
      },
      {
        icon: DollarSign,
        title: "Unqualified Leads",
        description: "Waste time on tire-kickers",
        color: "from-yellow-500 to-red-500",
      },
      {
        icon: Users,
        title: "No After-Hours Coverage",
        description: "Miss emergency repair requests",
        color: "from-orange-500 to-red-500",
      },
    ],
    solutions: [
      { title: "Instant Estimates", description: "Provide quotes immediately" },
      { title: "Lead Qualification", description: "Focus on serious customers" },
      { title: "Auto Scheduling", description: "Book inspections automatically" },
    ],
    stats: [
      { value: "4x", label: "More Qualified Leads" },
      { value: "50%", label: "Faster Response" },
      { value: "24/7", label: "Emergency Coverage" },
    ],
  },
  legal: {
    icon: Briefcase,
    title: "Law Firms",
    subtitle: "Screen potential clients, gather case details, schedule consultations",
    color: "from-purple-500 to-indigo-500",
    painPoints: [
      {
        icon: Clock,
        title: "Time-Intensive Intake",
        description: "Hours spent on initial consultations",
        color: "from-red-500 to-orange-500",
      },
      {
        icon: DollarSign,
        title: "Unqualified Prospects",
        description: "Wasted consultations with non-viable cases",
        color: "from-yellow-500 to-red-500",
      },
      {
        icon: Users,
        title: "Missed Opportunities",
        description: "Potential clients go to responsive competitors",
        color: "from-orange-500 to-red-500",
      },
    ],
    solutions: [
      { title: "Client Screening", description: "Pre-qualify cases automatically" },
      { title: "Case Detail Collection", description: "Gather information before meetings" },
      { title: "Smart Scheduling", description: "Book consultations efficiently" },
    ],
    stats: [
      { value: "3x", label: "Better Qualified Leads" },
      { value: "60%", label: "Time Saved" },
      { value: "24/7", label: "Client Intake" },
    ],
  },
  healthcare: {
    icon: Heart,
    title: "Healthcare Practices",
    subtitle: "Patient intake, appointment management, and follow-up automation",
    color: "from-primary to-accent",
    painPoints: [
      {
        icon: Clock,
        title: "Manual Patient Intake",
        description: "Staff overwhelmed with paperwork",
        color: "from-red-500 to-orange-500",
      },
      {
        icon: DollarSign,
        title: "Missed Appointments",
        description: "No-shows cost thousands monthly",
        color: "from-yellow-500 to-red-500",
      },
      {
        icon: Users,
        title: "Poor Follow-Up",
        description: "Patients fall through the cracks",
        color: "from-orange-500 to-red-500",
      },
    ],
    solutions: [
      { title: "Digital Intake", description: "Automate patient information collection" },
      { title: "Smart Reminders", description: "Reduce no-shows automatically" },
      { title: "Follow-Up Automation", description: "Never miss a patient check-in" },
    ],
    stats: [
      { value: "80%", label: "Fewer No-Shows" },
      { value: "5x", label: "Faster Intake" },
      { value: "24/7", label: "Patient Support" },
    ],
  },
  logistics: {
    icon: Truck,
    title: "Logistics & Shipping",
    subtitle: "Quote generation, shipment tracking, and customer service automation",
    color: "from-yellow-500 to-amber-500",
    painPoints: [
      {
        icon: Clock,
        title: "Slow Quote Turnaround",
        description: "Lose deals to faster competitors",
        color: "from-red-500 to-orange-500",
      },
      {
        icon: DollarSign,
        title: "Manual Quote Creation",
        description: "Hours spent on pricing calculations",
        color: "from-yellow-500 to-red-500",
      },
      {
        icon: Users,
        title: "Customer Service Overload",
        description: "Tracking inquiries overwhelm staff",
        color: "from-orange-500 to-red-500",
      },
    ],
    solutions: [
      { title: "Instant Quotes", description: "Generate accurate quotes in seconds" },
      { title: "Auto Tracking Updates", description: "Keep customers informed automatically" },
      { title: "24/7 Support", description: "Answer inquiries around the clock" },
    ],
    stats: [
      { value: "10x", label: "Faster Quotes" },
      { value: "70%", label: "Support Time Saved" },
      { value: "24/7", label: "Customer Service" },
    ],
  },
  restaurants: {
    icon: Utensils,
    title: "Restaurants & Catering",
    subtitle: "Reservation management, catering inquiries, and menu assistance",
    color: "from-red-500 to-pink-500",
    painPoints: [
      {
        icon: Clock,
        title: "Phone Lines Jammed",
        description: "Missed reservations during peak hours",
        color: "from-red-500 to-orange-500",
      },
      {
        icon: DollarSign,
        title: "Lost Catering Opportunities",
        description: "Slow response to event inquiries",
        color: "from-yellow-500 to-red-500",
      },
      {
        icon: Users,
        title: "Staff Overwhelmed",
        description: "Front-of-house can't keep up with calls",
        color: "from-orange-500 to-red-500",
      },
    ],
    solutions: [
      { title: "Smart Reservations", description: "Book tables automatically" },
      { title: "Catering Automation", description: "Handle event inquiries 24/7" },
      { title: "Menu Assistance", description: "Answer questions instantly" },
    ],
    stats: [
      { value: "2x", label: "More Reservations" },
      { value: "50%", label: "Less Staff Burden" },
      { value: "24/7", label: "Booking Available" },
    ],
  },
};

const NicheLanding = () => {
  const { nicheId } = useParams<{ nicheId: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showWebhookSetup, setShowWebhookSetup] = useState(false);

  const config = nicheId ? nicheConfig[nicheId] : null;
  const niche = nicheId ? nicheData[nicheId] : null;
  const Icon = niche?.icon;

  useEffect(() => {
    // Check if webhook is configured for this niche
    const webhookKey = `monday_${nicheId}_webhook`;
    const webhookUrl = getWebhookUrl(webhookKey);
    if (!webhookUrl) {
      setShowWebhookSetup(true);
    }
  }, [nicheId]);

  useEffect(() => {
    if (!nicheId || !config || !niche) {
      navigate("/");
      return;
    }

    if (!config.enabled) {
      toast.error("This niche is not available yet");
      navigate("/");
      return;
    }

    // Start countdown
    setCountdown(config.delaySeconds);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          // Validate redirect URL before navigating
          if (isAllowedRedirect(config.redirectUrl)) {
            window.location.href = config.redirectUrl;
          } else {
            console.error("Invalid redirect URL blocked:", config.redirectUrl);
            navigate("/");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [nicheId, config, niche, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error("Please fill in all fields");
      return;
    }

    // Send to Monday.com if webhook is configured
    const webhookKey = `monday_${nicheId}_webhook`;
    const webhookUrl = getWebhookUrl(webhookKey);
    
    if (webhookUrl) {
      const sent = await sendToMonday(webhookUrl, {
        type: "niche_lead",
        niche: nicheId,
        name: name,
        email: email,
        niche_title: niche?.title,
      });
      
      if (sent) {
        console.log(`Lead for ${nicheId} sent to Monday.com`);
        toast.success("Thanks! Your info has been sent to our team. Redirecting now...");
      } else {
        toast.success("Thanks! Redirecting now...");
      }
    } else {
      toast.success("Thanks! Redirecting now...");
    }

    if (config) {
      setTimeout(() => {
        // Validate redirect URL before navigating
        if (isAllowedRedirect(config.redirectUrl)) {
          window.location.href = config.redirectUrl;
        } else {
          console.error("Invalid redirect URL blocked:", config.redirectUrl);
          navigate("/");
        }
      }, 1000);
    }
  };

  if (!niche || !config) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Webhook Setup - Only shown if needed */}
          {showWebhookSetup && nicheId && (
            <MondayWebhookSetup
              storageKey={`monday_${nicheId}_webhook`}
              title={`Configure ${niche?.title} Lead Capture`}
              description="Connect your Monday.com CRM to automatically receive leads from this niche landing page"
            />
          )}

          {/* Redirect Notice */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-4 bg-primary/10 border-primary">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-primary" />
                <p className="text-sm">
                  Redirecting to your specialized AI agent site in{" "}
                  <span className="font-bold">{countdown}</span> seconds...
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    if (isAllowedRedirect(config.redirectUrl)) {
                      window.location.href = config.redirectUrl;
                    } else {
                      console.error("Invalid redirect URL blocked:", config.redirectUrl);
                      navigate("/");
                    }
                  }}
                  className="ml-auto gap-2"
                >
                  Go Now <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              {Icon && (
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${niche.color} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              AI Agents for{" "}
              <span className={`bg-gradient-to-r ${niche.color} bg-clip-text text-transparent`}>
                {niche.title}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {niche.subtitle}
            </p>
          </motion.div>

          {/* Lead Capture Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <Card className="p-8 max-w-md mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <h3 className="text-2xl font-bold mb-4 text-center">
                Get Early Access
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Continue to AI Agent
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Pain Points */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-10">
              Common Challenges
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {niche.painPoints.map((point: any, index: number) => {
                const PainIcon = point.icon;
                return (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="p-6 h-full border-red-500/20 bg-red-500/5">
                      <div
                        className={`w-14 h-14 rounded-lg bg-gradient-to-br ${point.color} flex items-center justify-center mb-4`}
                      >
                        <PainIcon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{point.title}</h3>
                      <p className="text-muted-foreground">{point.description}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <Card className={`p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20`}>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">
                  Your AI-Powered Solution
                </h2>
                <p className="text-xl text-muted-foreground">
                  Transform your business operations with intelligent automation
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {niche.solutions.map((solution: any) => (
                  <div
                    key={solution.title}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{solution.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {solution.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() => (window.location.href = config.redirectUrl)}
                  className="gap-2"
                >
                  Explore Your AI Agent
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            {niche.stats.map((stat: any, index: number) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <Card className="p-8 text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NicheLanding;
