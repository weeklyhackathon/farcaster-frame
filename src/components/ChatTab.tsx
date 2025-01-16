import { useState, useRef, useEffect } from "react";

const HACKER_MESSAGES = [
  "The matrix is strong tonight! 🌐",
  "Vibing in the mainframe ⚡️",
  "Digital dreams becoming reality 💫",
  "Riding the cybernetic wave 🌊",
  "Quantum entangled with these beats 🎵",
];

const ChatTab = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to the digital dimension",
      user: "System",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRandomMessage = () => {
    return HACKER_MESSAGES[Math.floor(Math.random() * HACKER_MESSAGES.length)];
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        user: "You",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, newMessage]);
      setMessage("");

      // Simulate response
      setTimeout(() => {
        const responseMessage = {
          id: messages.length + 2,
          text: getRandomMessage(),
          user: `Raver${Math.floor(Math.random() * 100)}`,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, responseMessage]);
      }, 500 + Math.random() * 1000);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 p-4">
      <div className="h-[300px] overflow-y-auto space-y-2 p-4 border-2 border-[#2DFF05] rounded-lg scrollbar-thin scrollbar-thumb-[#2DFF05]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg ${
              msg.user === "You"
                ? "bg-[#2DFF05]/20 text-[#2DFF05] ml-auto border border-[#2DFF05]"
                : "bg-[#1A8C03]/20 text-[#2DFF05] border border-[#2DFF05]"
            } max-w-[80%] inline-block`}
          >
            <p className="text-sm font-bold">{msg.user}</p>
            <p>{msg.text}</p>
            <p className="text-xs opacity-50">{msg.timestamp}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-transparent border-2 border-[#2DFF05] rounded-lg p-2 text-[#2DFF05] focus:outline-none focus:ring-2 focus:ring-[#2DFF05]"
          placeholder="Send your vibe..."
        />
        <button
          type="submit"
          className="p-2 border-2 border-[#2DFF05] text-[#2DFF05] rounded-lg hover:bg-[#2DFF05] hover:text-black transition-colors"
        >
          SEND
        </button>
      </form>
    </div>
  );
};

export default ChatTab;
