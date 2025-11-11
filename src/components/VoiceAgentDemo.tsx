import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2, Bot, User, Sparkles, MessageSquare } from "lucide-react";
import { GlassCard } from "./enhanced/GlassCard";
import { MagneticButton } from "./enhanced/MagneticButton";
import { VoiceVisualizer } from "./VoiceVisualizer";
import { DemoCTA } from "./DemoCTA";
import { useVAPI } from "@/hooks/useVAPI";
import { industryConfigs } from "@/lib/vapi-industry-configs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { trackEvent } from "@/lib/tracking";

export const VoiceAgentDemo = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("hvac");
  const currentConfig = industryConfigs[selectedIndustry];
  
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
  } = useVAPI(currentConfig);

  const [textInput, setTextInput] = useState("");
  const [showTextMode, setShowTextMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get current prompts based on conversation stage
  const currentPrompts = messages.length >= 2 
    ? currentConfig.suggestedPrompts.followUp 
    : currentConfig.suggestedPrompts.initial;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleIndustryChange = (industry: string) => {
    if (isConnected) {
      toast.error("Please end the current call before changing industries");
      return;
    }
    setSelectedIndustry(industry);
    trackEvent('voice_demo_industry_selected', { industry });
  };

  const handleVoiceToggle = async () => {
    if (isConnected) {
      endCall();
      trackEvent('voice_demo_ended', { industry: selectedIndustry, message_count: messages.length });
    } else {
      await startCall();
      trackEvent('voice_demo_started', { industry: selectedIndustry });
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
    <div className="space-y-4 md:space-y-6">
      {/* Industry Selector */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Label className="text-base mb-3 block font-semibold">
          Select Industry Demo Mode
        </Label>
        <Select value={selectedIndustry} onValueChange={handleIndustryChange}>
          <SelectTrigger className="w-full md:w-80 h-12 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-xl">
            {Object.entries(industryConfigs).map(([key, config]) => (
              <SelectItem key={key} value={key} className="text-base cursor-pointer">
                <span className="mr-2">{config.icon}</span>
                {config.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <GlassCard className="p-4 md:p-8 shadow-dramatic hover:shadow-glow transition-all duration-500 border-gradient">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <motion.div
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-sm"
              animate={{ rotate: isConnected ? 360 : 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">Live AI Voice Agent</h3>
              <p className={`text-xs md:text-sm ${getStatusColor()} font-medium`}>
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
          <div className="text-center py-8 md:py-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-6 md:mb-8"
            >
              <button
                onClick={handleVoiceToggle}
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary via-accent to-primary p-1 shadow-glow-intense hover:shadow-premium transition-all duration-300 group"
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-background flex items-center justify-center">
                  <Mic className="w-10 h-10 md:w-12 md:h-12 text-primary group-hover:scale-110 transition-transform" />
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

            <h4 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-gradient-premium">
              Talk to Our AI Agent Live
            </h4>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
              Experience how our AI handles real business conversations
            </p>

            {/* Suggested Prompts */}
            <div className="space-y-3">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                {currentPrompts.map((prompt, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handlePromptClick(prompt)}
                    className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 text-xs md:text-sm transition-all hover-lift"
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
            <div className="space-y-3 md:space-y-4 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2">
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
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === "assistant"
                          ? "bg-gradient-to-br from-primary to-accent"
                          : "bg-muted"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      ) : (
                        <User className="w-4 h-4 md:w-5 md:h-5" />
                      )}
                    </div>
                    <div
                      className={`p-3 md:p-4 rounded-2xl max-w-[85%] md:max-w-[80%] ${
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
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              {showTextMode ? (
                <>
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                    placeholder="Type your message..."
                    className="flex-1 text-sm md:text-base"
                  />
                  <MagneticButton onClick={handleSendText} size="lg" className="w-full sm:w-auto">
                    Send
                  </MagneticButton>
                </>
              ) : (
                <MagneticButton
                  onClick={handleVoiceToggle}
                  size="lg"
                  className="w-full gap-2 text-sm md:text-base"
                  variant={isConnected ? "destructive" : "default"}
                >
                  {isConnected ? (
                    <>
                      <MicOff className="w-4 h-4 md:w-5 md:h-5" />
                      End Call
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 md:w-5 md:h-5" />
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
