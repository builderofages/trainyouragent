import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-gradient-to-r from-accent to-primary"
            : "bg-gradient-to-r from-primary to-accent"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-primary-foreground" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[75%] rounded-lg p-3 ${
          isUser
            ? "bg-gradient-to-r from-accent/20 to-primary/20 border border-primary/20"
            : "bg-muted"
        }`}
      >
        <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs text-muted-foreground mt-1 block">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </motion.div>
  );
};
