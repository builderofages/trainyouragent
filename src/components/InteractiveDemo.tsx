import { useState } from "react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Sparkles } from "lucide-react";

const InteractiveDemo = () => {
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState("");

  const conversation = [
    {
      role: "bot",
      message: "Hi! I'm your HVAC AI assistant. How can I help you today?",
    },
    {
      role: "user",
      message: "My AC isn't cooling properly",
      prompt: "Type: My AC isn't cooling properly",
    },
    {
      role: "bot",
      message:
        "I can help with that! Can you tell me when you first noticed the issue?",
    },
    {
      role: "user",
      message: "Started yesterday",
      prompt: "Type: Started yesterday",
    },
    {
      role: "bot",
      message:
        "Got it! I'd like to schedule a technician to take a look. What's your address and preferred time?",
    },
    {
      role: "user",
      message: "123 Main St, tomorrow morning works",
      prompt: "Type: 123 Main St, tomorrow morning works",
    },
    {
      role: "bot",
      message:
        "Perfect! ✓ I've scheduled a technician for tomorrow at 9 AM. You'll receive a confirmation text shortly. Is there anything else I can help with?",
    },
  ];

  const handleNext = () => {
    if (step < conversation.length - 1) {
      setStep(step + 1);
      setUserInput("");
    } else {
      setStep(0);
      setUserInput("");
    }
  };

  const currentMessage = conversation[step];
  const isUserTurn = currentMessage.role === "user";

  return (
    <GlassCard className="p-6 max-w-2xl mx-auto shadow-dramatic hover:shadow-glow transition-all duration-500">
      <div className="flex items-center gap-2 mb-6">
        <motion.div 
          className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-glow-sm"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h3 className="font-bold">Live Demo</h3>
          <p className="text-sm text-muted-foreground">
            See AI in action (HVAC example)
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4 mb-6 min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {conversation.slice(0, step + 1).map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "bot"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.role === "bot" ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.role === "bot"
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {msg.message}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      {isUserTurn ? (
        <div className="space-y-3">
          <Input
            placeholder={currentMessage.prompt}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleNext();
            }}
            className="h-12 glass-card border-glass-border"
          />
          <MagneticButton onClick={handleNext} className="w-full shadow-blue hover:shadow-glow" size="lg">
            Send Message
          </MagneticButton>
        </div>
      ) : (
        <MagneticButton onClick={handleNext} className="w-full shadow-blue hover:shadow-glow" size="lg">
          {step === conversation.length - 1 ? "Restart Demo" : "Continue Demo"}
        </MagneticButton>
      )}

      <div className="text-center mt-4 text-sm text-muted-foreground">
        Step {step + 1} of {conversation.length}
      </div>
    </GlassCard>
  );
};

export default InteractiveDemo;
