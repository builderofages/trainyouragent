import { useState, useCallback, useRef, useEffect } from "react";
import { vapiConfig } from "@/lib/vapi-config";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const useChatAgent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    // Initialize VAPI for text messaging
    if (vapiConfig.publicKey && typeof window !== 'undefined') {
      import('@vapi-ai/web').then(({ default: Vapi }) => {
        vapiRef.current = new Vapi(vapiConfig.publicKey);
        
        // Send initial greeting
        setTimeout(() => {
          setMessages([{
            role: "assistant",
            content: "Hi! I'm your AI assistant. I can help you learn about our voice AI services, answer questions about pricing, and even schedule a demo. What would you like to know?",
            timestamp: new Date(),
          }]);
        }, 500);
      }).catch(error => {
        console.error("Failed to initialize VAPI:", error);
      });
    } else {
      // Fallback if VAPI not configured - still show greeting
      setTimeout(() => {
        setMessages([{
          role: "assistant",
          content: "Hi! I'm your AI assistant. I can help you learn about our voice AI services, answer questions about pricing, and even schedule a demo. What would you like to know?",
          timestamp: new Date(),
        }]);
      }, 500);
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Use VAPI text messaging if available
      if (vapiRef.current) {
        // Note: VAPI's web SDK is primarily for voice, but we can simulate text conversation
        // by using the same assistant configuration and generating responses
        
        // For now, provide intelligent responses based on common questions
        const response = await generateIntelligentResponse(content, messages);
        
        const assistantMessage: Message = {
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };
        
        setTimeout(() => {
          setMessages((prev) => [...prev, assistantMessage]);
          setIsLoading(false);
        }, 1000); // Simulate typing delay
      } else {
        // Fallback to simple responses if VAPI not configured
        const response = await generateIntelligentResponse(content, messages);
        
        const assistantMessage: Message = {
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };
        
        setTimeout(() => {
          setMessages((prev) => [...prev, assistantMessage]);
          setIsLoading(false);
        }, 1000);
      }

      // Track message sent
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'chat_message_sent', {
          event_category: 'engagement',
          event_label: 'chat_agent',
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try calling us directly or use the demo booking button to schedule a time to talk.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  }, [messages]);

  return {
    messages,
    isLoading,
    sendMessage,
  };
};

// Intelligent response generator based on user input
async function generateIntelligentResponse(
  userMessage: string,
  conversationHistory: Message[]
): Promise<string> {
  const lowerMessage = userMessage.toLowerCase();

  // Industry questions
  if (lowerMessage.includes("industry") || lowerMessage.includes("industries") || lowerMessage.includes("work with")) {
    return "We work with multiple industries including HVAC, Healthcare, Legal, Accounting, Restaurants, Roofing, and Logistics. Our AI voice agents are customized for each industry's specific needs. Which industry are you in?";
  }

  // Pricing questions
  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("pricing") || lowerMessage.includes("how much")) {
    return "Our pricing starts at $99/month for basic plans. The exact cost depends on your call volume and feature requirements. Would you like to schedule a demo where we can discuss a custom quote for your needs?";
  }

  // Demo requests
  if (lowerMessage.includes("demo") || lowerMessage.includes("see it") || lowerMessage.includes("show me")) {
    return "I'd be happy to arrange a demo! You can book a time directly through our Calendly link, or I can have our team reach out to you. What works best for you?";
  }

  // Setup time
  if (lowerMessage.includes("setup") || lowerMessage.includes("long") || lowerMessage.includes("time") || lowerMessage.includes("start")) {
    return "Setup typically takes about 48 hours on average. We'll work with you to configure the AI agent for your specific needs, integrate with your existing systems, and get everything tested before going live.";
  }

  // Integration questions
  if (lowerMessage.includes("integrate") || lowerMessage.includes("crm") || lowerMessage.includes("connect")) {
    return "We integrate with popular CRMs like Salesforce, HubSpot, Monday.com, and scheduling tools like Calendly. Our API can also connect to most custom systems. What tools are you currently using?";
  }

  // Trial questions
  if (lowerMessage.includes("trial") || lowerMessage.includes("test") || lowerMessage.includes("try")) {
    return "Yes! We offer demo sessions where you can test the AI agent with real scenarios. We can also set up a pilot program for your business. Would you like to schedule a demo to discuss this?";
  }

  // Features/capabilities
  if (lowerMessage.includes("feature") || lowerMessage.includes("can it") || lowerMessage.includes("what does") || lowerMessage.includes("capability")) {
    return "Our AI agents can handle appointment scheduling, answer FAQs, qualify leads, provide quotes, take messages, and transfer to human staff when needed. They work 24/7 and never miss a call. What specific capabilities are most important for your business?";
  }

  // Contact/sales
  if (lowerMessage.includes("talk") || lowerMessage.includes("speak") || lowerMessage.includes("sales") || lowerMessage.includes("rep")) {
    return "I can connect you with our team! You can either book a time on our calendar or call our AI agent directly to get transferred to a sales specialist. Which would you prefer?";
  }

  // Default response
  return "That's a great question! To give you the most accurate answer, I'd recommend booking a quick demo where we can discuss your specific needs. Our team can walk you through exactly how our AI voice agents can help your business. Would you like me to share the booking link?";
}
