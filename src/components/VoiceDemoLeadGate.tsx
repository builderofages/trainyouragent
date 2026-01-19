import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Mic, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

    try {
      // Track conversion
      conversions.demoBooked(industry || "Not selected");

      // Store in session to prevent re-prompting
      sessionStorage.setItem("voice_demo_lead_captured", "true");
      sessionStorage.setItem("voice_demo_industry", industry || "Not selected");

      toast({
        title: "Welcome!",
        description: "Starting the voice demo...",
      });

      // Trigger demo
      onSuccess();

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setIndustry("");
      setVoiceConsent(false);
    } catch (error) {
      console.error("Voice demo lead capture error:", error);
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
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Try Our Voice AI</h2>
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
              Enter your details to start the interactive voice demo
            </p>

            <div className="space-y-2">
              <Label htmlFor="voice-name">Name *</Label>
              <Input
                id="voice-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice-email">Email *</Label>
              <Input
                id="voice-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice-phone">Phone (optional)</Label>
              <Input
                id="voice-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice-industry">Industry (optional)</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="voice-industry">
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

            <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
              <Checkbox
                id="voice-consent"
                checked={voiceConsent}
                onCheckedChange={(checked) => setVoiceConsent(checked as boolean)}
              />
              <label
                htmlFor="voice-consent"
                className="text-sm text-muted-foreground cursor-pointer leading-tight"
              >
                I consent to voice recording and processing by VAPI.ai for this demo. 
                Your voice data is processed securely and not stored permanently.
              </label>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting Demo...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Voice Demo
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
