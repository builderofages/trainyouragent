import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Trash2, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { Button } from "@/components/ui/button";
import { MondayWebhookSetup } from "@/components/MondayWebhookSetup";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const webhooks = [
    {
      key: "monday_newsletter_webhook",
      title: "Newsletter Signups",
      description: "Receive newsletter subscriptions from your homepage",
    },
    {
      key: "monday_hvac_webhook",
      title: "HVAC Leads",
      description: "Receive leads from the HVAC niche landing page",
    },
    {
      key: "monday_accounting_webhook",
      title: "Accounting Leads",
      description: "Receive leads from the Accounting niche landing page",
    },
    {
      key: "monday_roofing_webhook",
      title: "Roofing Leads",
      description: "Receive leads from the Roofing niche landing page",
    },
  ];

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all webhook configurations?")) {
      webhooks.forEach((webhook) => {
        localStorage.removeItem(webhook.key);
      });
      toast({
        title: "All webhooks cleared",
        description: "You'll need to reconfigure your integrations",
      });
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Integration Settings</h1>
                <p className="text-muted-foreground">
                  Manage your Monday.com CRM integrations
                </p>
              </div>
            </div>
          </motion.div>

          {/* Help Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <GlassCard className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-bold mb-2">How to get your Monday.com webhook URL:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Go to your Monday.com board</li>
                <li>Click "Integrate" in the top right</li>
                <li>Search for "Webhooks" or "Incoming Webhooks"</li>
                <li>Create a new webhook with trigger "When a form is submitted"</li>
                <li>Copy the webhook URL and paste it below</li>
              </ol>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-2"
                onClick={() => window.open("https://monday.com/", "_blank")}
              >
                Open Monday.com
                <ExternalLink className="w-4 h-4" />
              </Button>
            </GlassCard>
          </motion.div>

          {/* Webhook Configurations */}
          <div className="space-y-6">
            {webhooks.map((webhook, index) => (
              <motion.div
                key={webhook.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <MondayWebhookSetup
                  storageKey={webhook.key}
                  title={webhook.title}
                  description={webhook.description}
                />
              </motion.div>
            ))}
          </div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <GlassCard className="p-6 border-destructive/20">
              <h3 className="font-bold text-destructive mb-2">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Clear all webhook configurations. This action cannot be undone.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearAll}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Webhooks
              </Button>
            </GlassCard>
          </motion.div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
