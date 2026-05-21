import { useState, useEffect, useRef, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import { vapiConfig } from "@/lib/vapi-config";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export const useVAPI = (industryConfig?: any) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  
  const vapiRef = useRef<Vapi | null>(null);
  const hasStarted = useRef(false);
  const currentConfig = industryConfig || vapiConfig;

  useEffect(() => {
    // Initialize VAPI client
    if (!vapiRef.current && vapiConfig.publicKey) {
      try {
        vapiRef.current = new Vapi(vapiConfig.publicKey);
        setupEventListeners();
      } catch (err) {
        console.error("Failed to initialize VAPI:", err);
        setError("Failed to initialize voice assistant. Please check your configuration.");
      }
    }

    return () => {
      if (vapiRef.current && hasStarted.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const setupEventListeners = () => {
    if (!vapiRef.current) return;

    // v78: all call-lifecycle console.logs gated behind import.meta.env.DEV
    // so we don't spam every visitor's browser console in prod.
    const dlog = (...args: any[]) => {
      if (import.meta.env.DEV) console.log(...args);
    };

    vapiRef.current.on("call-start", () => {
      dlog("Call started");
      setIsConnected(true);
      setError(null);
      hasStarted.current = true;
    });

    vapiRef.current.on("call-end", () => {
      dlog("Call ended");
      setIsConnected(false);
      setIsListening(false);
      setIsSpeaking(false);
      hasStarted.current = false;
    });

    vapiRef.current.on("speech-start", () => {
      dlog("User started speaking");
      setIsListening(true);
    });

    vapiRef.current.on("speech-end", () => {
      dlog("User stopped speaking");
      setIsListening(false);
    });

    vapiRef.current.on("message", (message: any) => {
      dlog("Message received:", message);
      
      if (message.type === "transcript" && message.transcriptType === "final") {
        if (message.role === "user") {
          setMessages(prev => [...prev, {
            role: "user",
            content: message.transcript,
            timestamp: new Date(),
          }]);
        } else if (message.role === "assistant") {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: message.transcript,
            timestamp: new Date(),
          }]);
        }
      }
    });

    vapiRef.current.on("error", (error: any) => {
      console.error("VAPI error:", error);
      setError(error.message || "An error occurred with the voice assistant");
      setIsConnected(false);
      setIsListening(false);
      setIsSpeaking(false);
    });

    vapiRef.current.on("volume-level", (level: number) => {
      setVolumeLevel(level);
      setIsSpeaking(level > 0.1);
    });
  };

  const startCall = useCallback(async () => {
    if (!vapiRef.current) {
      setError("Voice assistant not initialized. Please add your VAPI public key.");
      return;
    }

    if (isConnected) {
      if (import.meta.env.DEV) console.log("Call already in progress");
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setError(null);
      // Start call with assistant config - VAPI expects an assistant ID or config object
      const assistantConfig = industryConfig ? {
        ...currentConfig.assistant,
        firstMessage: industryConfig.firstMessage,
        model: {
          ...currentConfig.assistant.model,
          messages: [
            {
              role: "system",
              content: industryConfig.systemPrompt
            }
          ]
        }
      } : currentConfig.assistant;
      
      await vapiRef.current.start(assistantConfig as any);
    } catch (err: any) {
      console.error("Failed to start call:", err);
      if (err.name === "NotAllowedError") {
        setError("Microphone access denied. Please allow microphone access to use voice features.");
      } else {
        setError(err.message || "Failed to start voice assistant");
      }
    }
  }, [isConnected]);

  const endCall = useCallback(() => {
    if (vapiRef.current && isConnected) {
      vapiRef.current.stop();
      setIsConnected(false);
      setIsListening(false);
      setIsSpeaking(false);
      hasStarted.current = false;
    }
  }, [isConnected]);

  const sendMessage = useCallback((text: string) => {
    if (!vapiRef.current || !isConnected) return;
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, {
      role: "user",
      content: text,
      timestamp: new Date(),
    }]);

    // Send to VAPI
    vapiRef.current.send({
      type: "add-message",
      message: {
        role: "user",
        content: text,
      },
    });
  }, [isConnected]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    isConnected,
    isListening,
    isSpeaking,
    messages,
    error,
    volumeLevel,
    startCall,
    endCall,
    sendMessage,
    clearMessages,
  };
};
