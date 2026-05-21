// VAPI Inbound Phone Assistant Configuration
export const vapiPhoneConfig = {
  name: "TrainYourAgent Sales Assistant",
  model: {
    provider: "openai",
    model: "gpt-4",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `You are a professional sales assistant for TrainYourAgent, a company that provides AI voice agents for businesses.

YOUR ROLE:
You answer incoming phone calls and help potential clients learn about our services, qualify their needs, and guide them to the next step.

KEY INFORMATION:
- We offer 24/7 AI voice agents that never miss calls
- Our agents handle appointment scheduling, lead qualification, and customer inquiries
- We serve multiple industries: HVAC, Healthcare, Legal, Accounting, Restaurants, Roofing, Logistics
- Pricing starts at $99/month for basic plans
- Setup takes 48 hours on average
- We integrate with popular CRMs and scheduling tools

CALL FLOW:
1. Greet warmly and ask about their industry/business
2. Listen for pain points (missed calls, scheduling issues, lead response time)
3. Explain how our AI agents solve their specific problem
4. Qualify the lead:
   - HOT: Ready to buy, clear need, decision maker → Offer immediate demo booking or transfer
   - WARM: Interested but needs more info → Schedule follow-up call or send information
   - COLD: Just browsing → Take contact info for nurture campaign

5. Next steps:
   - Book demo via Calendly (use book_demo function)
   - Transfer to sales team for hot leads (use transfer_to_sales function)
   - Take detailed message for follow-up (use take_message function)

COMMUNICATION STYLE:
- Professional but friendly and conversational
- Ask questions to understand their business
- Listen actively and address their specific concerns
- Be enthusiastic about how we can help
- Keep responses concise (2-3 sentences max)
- Use their industry language and pain points

IMPORTANT:
- Always get their name, phone, and email before ending
- Confirm appointment times in their timezone
- If transferring, summarize the lead for the sales team
- Thank them for calling and set clear next steps`
      }
    ]
  },
  voice: {
    provider: "11labs",
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Professional, clear voice
  },
  firstMessage: "Thank you for calling TrainYourAgent! I'm here to help you learn about our AI voice agents and how they can help your business never miss another call. May I ask what industry you're in?",
  endCallMessage: "Thank you so much for your time today. We're excited to help transform your customer communication. Have a great day!",
  
  // Function definitions for lead handling
  functions: [
    {
      name: "book_demo",
      description: "Book a demo appointment when the caller is ready to see the product in action. Collect their information and preferred time.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Caller's full name"
          },
          email: {
            type: "string",
            description: "Caller's email address"
          },
          phone: {
            type: "string",
            description: "Caller's phone number"
          },
          industry: {
            type: "string",
            description: "Caller's industry or business type"
          },
          preferredTime: {
            type: "string",
            description: "Preferred time/date for demo"
          },
          painPoints: {
            type: "string",
            description: "Key challenges they mentioned"
          }
        },
        required: ["name", "email", "phone", "industry"]
      }
    },
    {
      name: "transfer_to_sales",
      description: "Transfer hot lead to sales team when they're ready to talk pricing, have urgent needs, or are decision-makers ready to buy.",
      parameters: {
        type: "object",
        properties: {
          leadScore: {
            type: "string",
            enum: ["hot", "warm"],
            description: "Lead temperature - hot for ready to buy, warm for interested"
          },
          name: {
            type: "string",
            description: "Caller's name"
          },
          company: {
            type: "string",
            description: "Company name"
          },
          industry: {
            type: "string",
            description: "Industry"
          },
          reason: {
            type: "string",
            description: "Why transferring (e.g., 'Ready to sign up', 'Needs custom pricing', 'Urgent implementation needed')"
          },
          painPoints: {
            type: "string",
            description: "Key pain points discussed"
          },
          budget: {
            type: "string",
            description: "Budget range if discussed"
          }
        },
        required: ["leadScore", "name", "industry", "reason"]
      }
    },
    {
      name: "take_message",
      description: "Take a detailed message when caller can't talk now, needs follow-up, or has specific questions for the team.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Caller's name"
          },
          phone: {
            type: "string",
            description: "Callback phone number"
          },
          email: {
            type: "string",
            description: "Email address"
          },
          industry: {
            type: "string",
            description: "Their industry"
          },
          message: {
            type: "string",
            description: "Detailed message or questions"
          },
          preferredContactTime: {
            type: "string",
            description: "Best time to reach them"
          },
          urgency: {
            type: "string",
            enum: ["high", "medium", "low"],
            description: "How urgent is their need"
          }
        },
        required: ["name", "phone", "message"]
      }
    }
  ]
};

// Get webhook URL from localStorage for phone call data
export const getPhoneWebhookUrl = (): string => {
  return localStorage.getItem("phone_webhook_url") || "";
};

// Helper to send call data to Monday.com
export const sendCallDataToMonday = async (callData: any) => {
  const webhookUrl = getPhoneWebhookUrl();
  
  if (!webhookUrl) {
    console.warn("Phone webhook URL not configured - configure in Settings");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caller_name: callData.name || "Unknown",
        phone_number: callData.phone || "Not provided",
        email: callData.email || "Not provided",
        industry: callData.industry || "Not specified",
        lead_score: callData.leadScore || "warm",
        pain_points: callData.painPoints || "Not discussed",
        next_action: callData.nextAction || "Follow-up needed",
        call_transcript: callData.transcript || "",
        call_recording_url: callData.recordingUrl || "",
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send call data to Monday.com");
    }

    if (import.meta.env.DEV) console.log("Call data sent to Monday.com successfully");
  } catch (error) {
    console.error("Error sending call data to Monday.com:", error);
  }
};
