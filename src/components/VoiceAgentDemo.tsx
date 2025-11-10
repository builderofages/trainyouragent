import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2, Bot, User, Sparkles, MessageSquare } from "lucide-react";
import { GlassCard } from "./enhanced/GlassCard";
import { MagneticButton } from "./enhanced/MagneticButton";
import { VoiceVisualizer } from "./VoiceVisualizer";
import { DemoCTA } from "./DemoCTA";
import { useVAPI } from "@/hooks/useVAPI";
import { suggestedPrompts } from "@/lib/vapi-config";
import { Input } from "./ui/input";
import { toast } from "sonner";

export const VoiceAgentDemo = () => {
  const {
    isConnected,
    isListening,
    isSpeaking,
    messages,
    error,
    volumeLevel,
    startCall,
    endCall,
    sendMessage,
  } = useVAPI();

  const [textInput, setTextInput] = useState("");
  const [showTextMode, setShowTextMode] = useState(false);
  const [currentPrompts, setCurrentPrompts] = useState(suggestedPrompts.initial);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Update suggested prompts based on conversation
  useEffect(() => {
    if (messages.length >= 4) {
      setCurrentPrompts(suggestedPrompts.decision);
    } else if (messages.length >= 2) {
      setCurrentPrompts(suggestedPrompts.interested);
    }
  }, [messages.length]);

  const handleVoiceToggle = async () => {
    if (isConnected) {
      endCall();
    } else {
      await startCall();
    }
  };

  const handleSendText = () => {
    if (!textInput.trim()) return;
    sendMessage(textInput);
    setTextInput("");
  };

  const handlePromptClick = (prompt: string) => {
    if (isConnected) {
      sendMessage(prompt);
    } else {
      setTextInput(prompt);
    }
  };

  const getStatusText = () => {
    if (!isConnected) return "Ready to Chat";
    if (isListening) return "Listening...";
    if (isSpeaking) return "AI Speaking...";
    return "Connected";
  };

  const getStatusColor = () => {
    if (!isConnected) return "text-muted-foreground";
    if (isListening) return "text-green-500";
    if (isSpeaking) return "text-primary";
    return "text-blue-500";
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-8 shadow-dramatic hover:shadow-glow transition-all duration-500 border-gradient">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-sm"
              animate={{ rotate: isConnected ? 360 : 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold">Live AI Voice Agent</h3>
              <p className={`text-sm ${getStatusColor()} font-medium`}>
                {getStatusText()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MagneticButton
              variant="outline"
              size="sm"
              onClick={() => setShowTextMode(!showTextMode)}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              {showTextMode ? "Voice Mode" : "Text Mode"}
            </MagneticButton>
          </div>
        </div>

        {/* Main Content */}
        {!isConnected && messages.length === 0 ? (
          // Initial State
          <div className="text-center py-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-8"
            >
              <button
                onClick={handleVoiceToggle}
                className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary via-accent to-primary p-1 shadow-glow-intense hover:shadow-premium transition-all duration-300 group"
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-background flex items-center justify-center">
                  <Mic className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </button>
            </motion.div>

            <h4 className="text-2xl font-bold mb-3 text-gradient-premium">
              Talk to Our AI Agent Live
            </h4>
            <p className="text-muted-foreground mb-8">
              Experience how our AI handles real business conversations
            </p>

            {/* Suggested Prompts */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {currentPrompts.map((prompt, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handlePromptClick(prompt)}
                    className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 text-sm transition-all hover-lift"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Active/Message State
          <div className="space-y-6">
            {/* Voice Visualizer */}
            {isConnected && !showTextMode && (
              <div className="flex justify-center py-4">
                <VoiceVisualizer
                  isActive={isListening || isSpeaking}
                  volumeLevel={volumeLevel}
                  variant="wave"
                />
              </div>
            )}

            {/* Messages */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === "assistant"
                          ? "bg-gradient-to-br from-primary to-accent"
                          : "bg-muted"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <Bot className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div
                      className={`p-4 rounded-2xl max-w-[80%] ${
                        msg.role === "assistant"
                          ? "bg-muted/50"
                          : "bg-gradient-to-br from-primary to-accent text-white"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts During Conversation */}
            {isConnected && currentPrompts && (
              <div className="flex flex-wrap gap-2">
                {currentPrompts.slice(0, 3).map((prompt, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => handlePromptClick(prompt)}
                    className="px-3 py-1.5 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/20 text-xs transition-all hover-lift"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-3">
              {showTextMode ? (
                <>
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <MagneticButton onClick={handleSendText} size="lg">
                    Send
                  </MagneticButton>
                </>
              ) : (
                <MagneticButton
                  onClick={handleVoiceToggle}
                  size="lg"
                  className="w-full gap-2"
                  variant={isConnected ? "destructive" : "default"}
                >
                  {isConnected ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      End Call
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Start Voice Demo
                    </>
                  )}
                </MagneticButton>
              )}
            </div>
          </div>
        )}
      </GlassCard>

      {/* CTA appears after conversation */}
      <DemoCTA
        conversationCount={messages.length}
        onBookDemo={() => window.open("https://calendly.com/your-link", "_blank")}
        onGetPricing={() => window.location.href = "/pricing"}
        onViewCaseStudies={() => window.location.href = "/case-studies"}
        onCallSales={() => window.location.href = "tel:+1234567890"}
      />
    </div>
  );
};
