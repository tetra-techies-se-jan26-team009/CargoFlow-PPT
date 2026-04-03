import { useState, useRef, useEffect } from "react";

// ─── Utility ────────────────────────────────────────────────────────────────
const cn = (...classes) => classes.filter(Boolean).join(" ");

const BOT_NAME = "CargoAI";
const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  text: "Hi there! I'm Cargo AI, your assistant. How can I help you today?",
  time: new Date(),
};

// ─── Typing Indicator ───────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
        {BOT_NAME[0]}
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ──────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  const timeStr = msg.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={cn("flex items-end gap-2 mb-4", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {BOT_NAME[0]}
        </div>
      )}

      <div className={cn("flex flex-col gap-1 max-w-[78%]", isUser && "items-end")}>
        <div
          className={cn(
            "px-4 py-2.5 text-sm leading-relaxed shadow-sm",
            isUser
              ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
              : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm"
          )}
        >
          {msg.text}
        </div>
        <span className="text-[10px] text-gray-400 px-1">{timeStr}</span>
      </div>
    </div>
  );
}

// ─── Chat Window ─────────────────────────────────────────────────────────────
function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: Date.now(), role: "user", text, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // ── Replace this block with your actual backend call ──────────────────
      // Example:
      // const res = await fetch("/api/chat", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ message: text }),
      // });
      // const data = await res.json();
      // const reply = data.reply;
      // ──────────────────────────────────────────────────────────────────────

      // Simulated delay — remove when wired to real backend
      await new Promise((r) => setTimeout(r, 1200));
      const reply = `You said: "${text}". This is a placeholder — wire me to your backend!`;

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: reply, time: new Date() },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "Oops! Something went wrong. Please try again.",
          time: new Date(),
        }, console.error("Chatbot error:", error)
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="flex flex-col w-[370px] h-[540px] bg-gray-50 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
          {BOT_NAME[0]}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm leading-tight">{BOT_NAME}</p>
          <span className="flex items-center gap-1 text-blue-200 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Online
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          aria-label="Close chat"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 scroll-smooth">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* ── Suggested prompts (only when no user messages) ── */}
      {messages.length === 1 && (
        <div className="flex gap-2 px-4 pb-2 flex-wrap">
          {["What can you do?", "Talk to a human", "Pricing info"].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setInput(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* ── Input ── */}
      <div className="flex items-end gap-2 px-3 py-3 bg-white border-t border-gray-100 flex-shrink-0">
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
          }}
          onKeyDown={handleKey}
          placeholder="Type a message…"
          className="flex-1 resize-none text-sm text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition max-h-24 leading-relaxed"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isTyping}
          className="w-9 h-9 flex-shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-sm"
          aria-label="Send message"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M14 8L2 2l2.5 6L2 14l12-6z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Launcher Button ──────────────────────────────────────────────────────────
function LauncherButton({ isOpen, onClick, hasUnread }) {
  return (
    <div className="relative">
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-blue-400 opacity-40 animate-ping [animation-duration:2s]"></span>
      )}

      <button
        onClick={onClick}
        className="relative z-10 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg flex items-center justify-center transition-all duration-200"
      >
        {hasUnread && !isOpen && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
      )}
        <span
          className="absolute transition-all duration-300"
          style={{ opacity: isOpen ? 0 : 1, transform: isOpen ? "rotate(90deg) scale(0.5)" : "rotate(0deg) scale(1)" }}
        >
          {/* Chat icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
              fill="white"
            />
          </svg>
        </span>
        <span
          className="absolute transition-all duration-300"
          style={{ opacity: isOpen ? 1 : 0, transform: isOpen ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)" }}
        >
          {/* Close icon */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        {/* icon */}
      </button>
    </div>
  
  );
}

// ─── Main Chatbot Widget ─────────────────────────────────────────────────────
export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const handleOpen = () => {
    setIsOpen(true);
    setHasUnread(false);
  };

  const handleClose = () => setIsOpen(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <div
        className="transition-all duration-300 origin-bottom-right"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1) translateY(0)" : "scale(0) translateY(16px)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {isOpen && <ChatWindow onClose={handleClose} />}
      </div>

      <LauncherButton isOpen={isOpen} onClick={isOpen ? handleClose : handleOpen} hasUnread={hasUnread} />
    </div>
  );
}