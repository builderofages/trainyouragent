import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Check, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MondayWebhookSetupProps {
  storageKey: string;
  title: string;
  description: string;
}

export const MondayWebhookSetup = ({ storageKey, title, description }: MondayWebhookSetupProps) => {
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem(storageKey) || "";
  });
  const [isEditing, setIsEditing] = useState(!webhookUrl);
  const { toast } = useToast();

  const handleSave = () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(webhookUrl);
      localStorage.setItem(storageKey, webhookUrl);
      setIsEditing(false);
      toast({
        title: "Saved!",
        description: "Monday.com webhook URL saved successfully",
      });
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid webhook URL",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <GlassCard className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor={storageKey}>Monday.com Webhook URL</Label>
              <Input
                id={storageKey}
                type="url"
                placeholder="https://hooks.monday.com/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Create a webhook in Monday.com: Integrations → Webhooks → "When a form is submitted"
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Check className="w-4 h-4 mr-2" />
                Save Webhook
              </Button>
              {webhookUrl && (
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Webhook configured</span>
            </div>
            <Button onClick={handleEdit} variant="ghost" size="sm">
              Edit
            </Button>
          </div>
        )}

        {!webhookUrl && (
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mt-4">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Leads will not be sent to Monday.com until you configure the webhook URL
            </p>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export const getWebhookUrl = (storageKey: string): string | null => {
  return localStorage.getItem(storageKey);
};

export const sendToMonday = async (
  webhookUrl: string,
  data: Record<string, any>
): Promise<boolean> => {
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        source: window.location.href,
      }),
    });
    return true;
  } catch (error) {
    console.error("Error sending to Monday.com:", error);
    return false;
  }
};
