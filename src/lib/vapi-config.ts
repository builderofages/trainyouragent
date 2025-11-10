// VAPI Configuration
export const vapiConfig = {
  publicKey: "", // User needs to add their VAPI public key
  assistant: {
    firstMessage: "Hi! I'm your AI assistant. I can help you learn about our voice AI services, answer questions about pricing, and even schedule a demo. What would you like to know?",
    voice: {
      provider: "11labs",
      voiceId: "21m00Tcm4TlvDq8ikWAM", // Default ElevenLabs voice
    },
    model: {
      provider: "openai",
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant for Train Your Agent, a company that provides AI voice agents for businesses. 

Key Information:
- We offer 24/7 AI voice agents that never miss calls
- Our agents can schedule appointments, answer questions, and qualify leads
- We support multiple industries: HVAC, Healthcare, Legal, Accounting, Restaurants, Roofing, Logistics
- Pricing starts at $99/month for basic plans
- Setup takes 48 hours on average
- We integrate with popular CRMs and scheduling tools

Your role:
1. Answer questions about our services professionally
2. Suggest booking a demo if the user shows interest
3. Be friendly, concise, and helpful
4. If asked about scheduling, offer to connect them with our team
5. Highlight benefits specific to their industry when mentioned

Always be conversational and natural. Keep responses under 3 sentences when possible.`
        }
      ],
      temperature: 0.7,
    },
  },
};

// Suggested prompts for different stages
export const suggestedPrompts = {
  initial: [
    "What industries do you work with?",
    "How much does this cost?",
    "Tell me about your AI voice agents",
    "Can I see a demo?",
  ],
  interested: [
    "How long does setup take?",
    "What CRMs do you integrate with?",
    "Do you offer a free trial?",
    "Can I schedule a demo call?",
  ],
  decision: [
    "What are your contract terms?",
    "Can I talk to a sales rep?",
    "How quickly can we get started?",
    "Do you have case studies?",
  ],
};
