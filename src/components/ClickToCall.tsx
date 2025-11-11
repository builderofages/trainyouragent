import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

interface ClickToCallProps {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
  trackingLocation?: string;
}

export const ClickToCall = ({ 
  variant = "default",
  size = "default",
  showIcon = true,
  showText = true,
  className = "",
  trackingLocation = "unknown"
}: ClickToCallProps) => {
  if (!siteConfig.phoneNumber) {
    return null;
  }

  const handleClick = () => {
    // Track phone click event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'phone_number_clicked', {
        event_category: 'engagement',
        event_label: trackingLocation,
        value: 1,
      });
    }

    // Track Meta Pixel event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Contact', {
        content_name: 'Phone Click',
        content_category: trackingLocation,
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      asChild
    >
      <a 
        href={`tel:${siteConfig.phoneNumber}`}
        onClick={handleClick}
        className="flex items-center gap-2"
      >
        {showIcon && <Phone className="h-4 w-4" />}
        {showText && (
          <span>{siteConfig.phoneNumberDisplay || siteConfig.phoneNumber}</span>
        )}
      </a>
    </Button>
  );
};
