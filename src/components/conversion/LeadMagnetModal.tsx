import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { conversions, getStoredUTMParams } from "@/lib/tracking";

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceName: string;
  resourceDescription: string;
  industry: string;
}

export const LeadMagnetModal = ({
  isOpen,
  onClose,
  resourceName,
  resourceDescription,
  industry,
}: LeadMagnetModalProps) => {
  const [formData, setFormData] = useState({ name: "", email: "", company: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const utmParams = getStoredUTMParams();
      
      // Send to Monday.com webhook
      const webhookUrl = "https://hook.us2.make.com/YOUR_LEAD_MAGNET_WEBHOOK"; // User needs to configure
      
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          resource_name: resourceName,
          industry,
          ...utmParams,
          timestamp: new Date().toISOString(),
        }),
      });

      // Track conversion
      conversions.leadMagnetDownloaded(resourceName, industry);

      toast.success("Download link sent to your email!");
      
      // Simulate PDF download (in production, this would be a real PDF URL)
      setTimeout(() => {
        toast.info("Opening download in new tab...");
        // window.open('/path-to-pdf.pdf', '_blank');
      }, 1000);

      onClose();
    } catch (error) {
      console.error("Lead magnet submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <GlassCard
              className="w-full max-w-lg p-8 relative"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">{resourceName}</h2>
                <p className="text-muted-foreground">{resourceDescription}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Smith"
                    className="glass-card"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    className="glass-card"
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company Name (Optional)</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="ABC Company"
                    className="glass-card"
                  />
                </div>

                <MagneticButton
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download Free Resource
                    </>
                  )}
                </MagneticButton>

                <p className="text-xs text-center text-muted-foreground">
                  We'll email you the download link immediately. No spam, ever.
                </p>
              </form>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
