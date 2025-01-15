import React, { useState, useEffect, useRef } from "react";
import { User, ArrowLeft } from "lucide-react";
import { useAccount, usePublicClient } from "wagmi";
import clanker_v2_abi from "../lib/clanker_v2_abi.json";

const HACKATHON_TOKEN_CONTRACT_ADDRESS =
  "0x3dF58A5737130FdC180D360dDd3EFBa34e5801cb";

const MOCK_USERS = Array(169)
  .fill(null)
  .map((_, i) => ({
    id: i,
    name: `User ${i}`,
    online: true,
  }));

const HACKER_MESSAGES = [
  "Just breached the mainframe... with love and respect ❤️",
  "Anyone seen my quantum encryption key?",
  "Remember: The best firewall is kindness",
  "Implementing peace.exe...",
  "Who's up for some ethical hacking?",
];

const PointDistributor = () => {
  const NUM_ROOMS = 8;
  const [points, setPoints] = useState(Array(NUM_ROOMS).fill(0));
  const [remainingPoints, setRemainingPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "congrats, that's amazing",
      user: "User 1",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const publicClient = usePublicClient();

  const fetchUsersBalanceOfHackathon = async () => {
    try {
      if (!publicClient) return;
      const { address } = useAccount();
      const balance = (await publicClient?.readContract({
        address: HACKATHON_TOKEN_CONTRACT_ADDRESS,
        abi: clanker_v2_abi,
        functionName: "balanceOf",
        args: [address],
      })) as bigint;
      setTotalPoints(Number(balance));
      setRemainingPoints(Number(balance));
    } catch (error) {
      console.error("Error fetching users balance of hackathon:", error);
    }
  };

  // Calculate angles for octagon layout
  const getRoomPosition = (index: number) => {
    const angle = (index * 45 - 90) * (Math.PI / 180);
    const radius = 150;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    fetchUsersBalanceOfHackathon();
  }, [messages]);

  const handleRoomClick = (roomId: number) => {
    console.log("IN HERE", roomId);
    setSelectedRoom(roomId);
  };

  const handleSliderChange = (index: number, value: number) => {
    const newValue = Math.max(
      0,
      Math.min(value, remainingPoints + points[index])
    );
    const newPoints = [...points];
    newPoints[index] = newValue;
    setPoints(newPoints);
    setRemainingPoints(totalPoints - newPoints.reduce((a, b) => a + b, 0));
  };

  const handleGoBack = () => {
    setSelectedRoom(null);
    setMessages([
      {
        id: 1,
        text: "congrats, that's amazing",
        user: "User 1",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

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
          user: `Hacker${Math.floor(Math.random() * 100)}`,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, responseMessage]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const rooms = Array(8)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      number: i + 1,
      points: i === 0 ? 888 : i <= 3 ? 200 : 8,
    }));
  if (!selectedRoom) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 p-4">
        <h1 className="text-2xl mb-8 text-orange-400">Point Distribution</h1>

        {/* Points Remaining Display */}
        <div className="mb-8 text-xl">
          <span
            className={
              remainingPoints === 0 ? "text-green-500" : "text-orange-400"
            }
          >
            {remainingPoints} points remaining
          </span>
        </div>

        {/* Octagon Layout */}
        <div className="relative w-96 h-96 mb-8">
          {rooms.map((room, index) => {
            const pos = getRoomPosition(index);
            return (
              <div
                key={index}
                onClick={() => handleRoomClick(room.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${pos.x + 192}px`,
                  top: `${pos.y + 192}px`,
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="text-lg mb-1">Room {index + 1}</div>
                  <div className="w-32 bg-gray-900 rounded-lg p-4 border-2 border-green-400">
                    <div className="text-center mb-2">{points[index]} pts</div>
                    <input
                      type="range"
                      min="0"
                      max={remainingPoints + points[index]}
                      value={points[index]}
                      onChange={(e) =>
                        handleSliderChange(index, parseInt(e.target.value))
                      }
                      className="w-full accent-green-400"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Distribution Buttons */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => {
              const evenPoints = Math.floor(remainingPoints / NUM_ROOMS);
              const newPoints = points.map((p) => p + evenPoints);
              setPoints(newPoints);
              setRemainingPoints(
                totalPoints - newPoints.reduce((a, b) => a + b, 0)
              );
            }}
            className="px-4 py-2 border-2 border-green-400 rounded hover:bg-green-400 hover:text-black transition-colors"
          >
            Distribute Evenly
          </button>
          <button
            onClick={() => {
              setPoints(Array(NUM_ROOMS).fill(0));
              setRemainingPoints(totalPoints);
            }}
            className="px-4 py-2 border-2 border-green-400 rounded hover:bg-green-400 hover:text-black transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Submit Button */}
        <button
          disabled={remainingPoints > 0}
          onClick={() => console.log("Final distribution:", points)}
          className={`px-6 py-3 border-2 rounded text-lg ${
            remainingPoints > 0
              ? "border-gray-600 text-gray-600 cursor-not-allowed"
              : "border-green-400 hover:bg-green-400 hover:text-black transition-colors"
          }`}
        >
          Submit Distribution
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black min-h-screen font-mono">
      <div className="border-2 border-green-500 rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center border-b-2 border-green-500 pb-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors rounded-lg"
          >
            <ArrowLeft size={20} />
            BACK
          </button>
          <h2 className="text-green-500 text-xl">Room {selectedRoom}</h2>
        </div>

        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
          <div className="w-full h-full">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/mgtu7u9PKkI?si=iTGu91cGg2CzNIP1"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>

          <div className="p-2 bg-green-100/10 text-green-500">
            video by @jpfraneto ({selectedRoom})
          </div>
        </div>

        <div className="flex flex-wrap gap-2 p-4 border-2 border-green-500 rounded-lg bg-black/50">
          {MOCK_USERS.slice(0, 5).map((user) => (
            <div
              key={user.id}
              className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center"
            >
              <User size={16} className="text-green-500" />
            </div>
          ))}
          <span className="text-green-500">
            and {MOCK_USERS.length - 5} others
          </span>
        </div>

        <div className="space-y-4">
          <div className="h-full overflow-y-auto space-y-2 p-4 border-2 border-green-500 rounded-lg scrollbar-thin scrollbar-thumb-green-500">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-lg ${
                  msg.user === "You"
                    ? "bg-green-500/20 text-green-500 ml-auto border border-green-500"
                    : "bg-green-900/20 text-green-500 border border-green-500"
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
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent border-2 border-green-500 rounded-lg p-2 text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="p-2 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-black transition-colors"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PointDistributor;

///////
