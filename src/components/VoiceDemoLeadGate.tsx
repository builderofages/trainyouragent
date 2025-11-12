import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, Phone, Building2, Sparkles, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { sendToApollo, getUTMParameters } from "@/lib/apollo-integration";
import { conversions } from "@/lib/tracking";

interface VoiceDemoLeadGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

export const VoiceDemoLeadGate = ({ isOpen, onClose, onSuccess }: VoiceDemoLeadGateProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [voiceConsent, setVoiceConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please enter your name and email to try the demo",
        variant: "destructive",
      });
      return;
    }

    if (!voiceConsent) {
      toast({
        title: "Consent required",
        description: "Please consent to voice recording to use the demo",
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
      source: "Voice Demo Lead Gate",
      tags: ["Voice Demo Request", "Website Lead"],
      notes: `Voice demo request submitted from website. ${industry ? `Industry: ${industry}` : ""}`,
      custom_fields: {
        ...utmParams,
        demo_type: "voice",
        timestamp: new Date().toISOString(),
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
    conversions.liveDemoStarted(industry || "unknown");

    // Store in sessionStorage to prevent re-prompting
    sessionStorage.setItem("voice_demo_lead_submitted", "true");
    sessionStorage.setItem(
      "voice_demo_lead_data",
      JSON.stringify({ name, email, phone, industry })
    );

    toast({
      title: "Success!",
      description: "Starting your voice demo now...",
    });

    setIsSubmitting(false);
    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">Try Voice Demo</h3>
                <p className="text-xs text-muted-foreground">Experience AI in action</p>
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
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Get Instant Access</h2>
              <p className="text-sm text-muted-foreground">
                Enter your details to start a live voice conversation with our AI agent
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="voice-name" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Name *
                </Label>
                <Input
                  id="voice-name"
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
                <Label htmlFor="voice-email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email *
                </Label>
                <Input
                  id="voice-email"
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
                <Label htmlFor="voice-phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Phone <span className="text-xs text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="voice-phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Industry */}
              <div>
                <Label htmlFor="voice-industry" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Industry *
                </Label>
                <Select value={industry} onValueChange={setIndustry} required>
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

              {/* Voice Consent Checkbox */}
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                <Checkbox 
                  id="voice-consent" 
                  checked={voiceConsent}
                  onCheckedChange={(checked) => setVoiceConsent(checked as boolean)}
                  required 
                  className="mt-1"
                />
                <Label 
                  htmlFor="voice-consent" 
                  className="text-xs text-muted-foreground leading-relaxed cursor-pointer flex-1"
                >
                  I consent to voice recording and processing by VAPI.ai for demo purposes. 
                  Voice data is stored for 30 days for quality assurance. See our{" "}
                  <Link to="/privacy" className="text-primary hover:underline font-medium">
                    Privacy Policy
                  </Link>{" "}
                  for details. *
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Starting Demo..."
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Start Voice Demo
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to receive communications from Train Your Agent
              </p>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
