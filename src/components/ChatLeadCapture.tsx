import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, MessageCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

    try {
      // Track conversion
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "chat_lead_captured", {
          industry: industry || "Not selected",
        });
      }

      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: "Chat Lead",
          content_category: industry || "Not selected",
        });
      }

      toast({
        title: "Thank you!",
        description: "Starting your chat session...",
      });

      // Proceed to chat
      onSubmit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        industry: industry || undefined,
      });

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setIndustry("");
    } catch (error) {
      console.error("Chat lead capture error:", error);
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed bottom-20 right-4 z-50 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-primary p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary-foreground">
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">Start a Chat</span>
        </div>
        <button
          onClick={onClose}
          className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          Quick intro so we can personalize your experience
        </p>

        <div className="space-y-2">
          <Label htmlFor="chat-name">Name *</Label>
          <Input
            id="chat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chat-email">Email *</Label>
          <Input
            id="chat-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chat-phone">Phone (optional)</Label>
          <Input
            id="chat-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chat-industry">Industry (optional)</Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger id="chat-industry">
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Starting...
            </>
          ) : (
            "Start Chatting"
          )}
        </Button>
      </form>
    </motion.div>
  );
};
