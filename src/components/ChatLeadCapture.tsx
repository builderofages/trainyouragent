import { useState } from "react";
import { motion } from "framer-motion";
import { X, Mail, User, Phone, Building2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { sendToApollo, getUTMParameters } from "@/lib/apollo-integration";

interface ChatLeadCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; phone?: string; industry?: string }) => void;
}

const industries = [
  "HVAC & Home Services",
  "Accounting & Finance",
  "Roofing & Construction",
  "Legal Services",
  "Healthcare & Medical",
  "Logistics & Transportation",
  "Restaurants & Hospitality",
  "Bars & Nightclubs",
  "Other",
];

export const ChatLeadCapture = ({ isOpen, onClose, onSubmit }: ChatLeadCaptureProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please enter your name and email",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Get UTM parameters
    const utmParams = getUTMParameters();

    // Send to Apollo.io
    const success = await sendToApollo({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      industry: industry || "Not selected",
      source: "Chat Lead Capture",
      tags: ["Chat Lead", "Website Lead"],
      notes: `Chat lead captured from website. ${industry ? `Industry: ${industry}` : ""}`,
      custom_fields: {
        ...utmParams,
        lead_type: "chat",
      },
    });

    if (!success) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Track with analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "chat_lead_captured", {
        event_category: "Lead Capture",
        event_label: industry || "Unknown",
        value: name,
      });
    }

    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead", {
        content_name: "Chat Lead Capture",
        content_category: industry || "Unknown",
      });
    }

    toast({
      title: "Welcome!",
      description: "Starting your chat session now...",
    });

    const leadData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || "Not provided",
      industry: industry || "Not selected",
    };

    onSubmit(leadData);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-background border-l border-border shadow-2xl z-40 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Chat with AI Agent</h3>
            <p className="text-xs text-muted-foreground">Get instant answers 24/7</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-destructive/20 hover:text-destructive"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Let's Get Started</h2>
            <p className="text-sm text-muted-foreground">
              Tell us a bit about yourself to begin your personalized chat experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2"
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                required
              />
            </div>

            {/* Phone (Optional) */}
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                Phone <span className="text-xs text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Industry (Optional) */}
            <div>
              <Label htmlFor="industry" className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Industry <span className="text-xs text-muted-foreground">(optional)</span>
              </Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your industry" />
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-primary"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Starting Chat..." : "Start Chatting"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to receive communications from Train Your Agent
            </p>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};
