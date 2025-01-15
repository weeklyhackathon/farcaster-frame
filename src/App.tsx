import { useState, useEffect } from "react";
import { Link } from "react-router";
import MintHackerPass from "./components/MintHackerPass";

const App = () => {
  const [prizePool, setPrizePool] = useState("8,888.88");
  const [lastUpdated, setLastUpdated] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState("88d 88h 88m 88s");
  const [animationInterval, setAnimationInterval] = useState(null);

  const timeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const fetchPrizePool = async () => {
    // Start frantic animation
    const interval = setInterval(() => {
      setPrizePool((Math.random() * 10000).toFixed(2));
    }, 50);
    setAnimationInterval(interval as any);

    try {
      const response = await fetch(
        "https://farcaster.anky.bot/clanker/get-hackathon-rewards"
      );
      const data = await response.json();

      // Clear animation
      clearInterval(interval);
      setAnimationInterval(null);

      setPrizePool(data.data.userRewards.toFixed(2));
      setLastUpdated(timeAgo(data.lastUpdated));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching prize pool:", error);
      clearInterval(interval);
      setAnimationInterval(null);
      setPrizePool("4032");
      setLastUpdated("Failed to fetch update time");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrizePool();
    const interval = setInterval(fetchPrizePool, 60000); // Update every minute
    return () => {
      clearInterval(interval);
      if (animationInterval) clearInterval(animationInterval);
    };
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const endDate = new Date("2025-01-16T23:59:00Z");
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative w-screen min-h-screen flex  bg-black overflow-x-hidden">
      {/* Marquee header */}
      <div className="absolute top-0 w-full h-6 overflow-hidden bg-[#2DFF05] flex items-center">
        <div className="animate-[slideRight_15s_linear_infinite] whitespace-nowrap text-black font-mek text-xs sm:text-base">
          W E E K L Y • H A C K A T H O N • W E E K L Y • H A C K A T H O N
        </div>
        <div
          className="animate-[slideRight_15s_linear_infinite] whitespace-nowrap text-black font-mek ml-4 text-xs sm:text-base"
          aria-hidden="true"
        >
          W E E K L Y • H A C K A T H O N • W E E K L Y • H A C K A T H O N
        </div>
        <style>
          {`
            @keyframes slideRight {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}
        </style>
      </div>

      <div className="flex mt-2 flex-col gap-4 sm:gap-6 items-center justify-center text-center w-full max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-white">
        <h1 className="font-mek text-4xl sm:text-5xl md:text-7xl">
          $hackathon
        </h1>
        <div className="relative group">
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                "0x3dF58A5737130FdC180D360dDd3EFBa34e5801cb"
              );
              const el = document.getElementById("ca-text");
              el?.classList.add("animate-matrix");
              setTimeout(() => el?.classList.remove("animate-matrix"), 1000);
              const notification = document.getElementById("copy-notification");
              notification?.classList.remove("opacity-0");
              notification?.classList.add("opacity-100");
              setTimeout(() => {
                notification?.classList.remove("opacity-100");
                notification?.classList.add("opacity-0");
              }, 2000);
            }}
            className="w-full bg-black px-4 py-2 border border-[#2DFF05] rounded text-[#2DFF05] hover:bg-[#2DFF05] hover:bg-opacity-20 transition-colors font-mono text-xs sm:text-sm md:text-base break-all relative"
          >
            <span id="ca-text" className="transition-all duration-300">
              0x3dF58A5737130FdC180D360dDd3EFBa34e5801cb
            </span>
            <div
              id="copy-notification"
              className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[#2DFF05] opacity-0 transition-opacity duration-300 text-xs sm:text-sm"
            >
              copied!
            </div>
            <style>
              {`
                @keyframes matrixEffect {
                  0% { color: white; text-shadow: none; filter: blur(0); }
                  30% { color: #2DFF05; text-shadow: 0 0 8px #2DFF05; filter: blur(1px); }
                  60% { color: #2DFF05; text-shadow: 0 0 8px #2DFF05; filter: blur(2px); }
                  100% { color: white; text-shadow: none; filter: blur(0); }
                }
                .animate-matrix { animation: matrixEffect 1s ease-in-out; }
              `}
            </style>
          </button>
        </div>
        <div className="font-mek text-xl sm:text-2xl md:text-3xl text-[#2DFF05] mt-4">
          week one:
        </div>

        <div className="font-mek text-3xl sm:text-4xl md:text-6xl text-[#2DFF05] tracking-wider">
          {countdown}
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <div className="font-mek text-xl sm:text-2xl md:text-3xl text-[#2DFF05] text-center">
              Current Prize Pool: $
              {isLoading ? (
                <span className="blur-sm animate-pulse">{prizePool}</span>
              ) : (
                prizePool
              )}{" "}
              USD
            </div>
            <button
              onClick={fetchPrizePool}
              className="relative z-10 p-2 border border-[#2DFF05] rounded hover:bg-[#2DFF05] hover:bg-opacity-20 transition-colors"
              aria-label="Refresh prize pool"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#2DFF05]"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                <path d="M16 21h5v-5"></path>
              </svg>
            </button>
          </div>
          <div className="text-xs text-[#2DFF05]/70">{lastUpdated}</div>
        </div>
        <MintHackerPass />

        <p className="text-lg sm:text-xl md:text-2xl">
          The first self-sustaining weekly hackathon on Farcaster. Each week,
          all trading fees from $hackathon are awarded to the builders that will
          shape the future of decentralized social media.
        </p>

        <div className="text-lg sm:text-xl md:text-2xl mt-2 sm:mt-4">
          <span className="font-mek text-[#2DFF05]">How it works:</span>
          <ul className="mt-2 space-y-2 text-left">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Every Thursday at 23:59 UTC, a new challenge is announced
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Build something amazing during the week</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Winner takes all trading fees accumulated that week</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Rinse and repeat - forever</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 text-xl sm:text-2xl md:text-3xl justify-center w-full">
          <Link
            to="/week-one"
            className="w-full sm:w-auto px-4 py-2 border border-[#2DFF05] rounded text-[#2DFF05] hover:bg-[#2DFF05] hover:bg-opacity-20 transition-colors font-mek"
          >
            Week One's Challenge
          </Link>
          <a
            href="https://dexscreener.com/base/0x3dF58A5737130FdC180D360dDd3EFBa34e5801cb"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2 border border-[#2DFF05] rounded text-[#2DFF05] hover:bg-[#2DFF05] hover:bg-opacity-20 transition-colors font-mek"
          >
            Track $hackathon
          </a>

          <Link
            to="/game"
            className="w-full sm:w-auto px-4 py-2 border border-[#2DFF05] rounded text-[#2DFF05] hover:bg-[#2DFF05] hover:bg-opacity-20 transition-colors font-mek"
          >
            game (experimental)
          </Link>
          <Link
            to="/live"
            className="w-full sm:w-auto px-4 py-2 border border-[#2DFF05] rounded text-[#2DFF05] hover:bg-[#2DFF05] hover:bg-opacity-20 transition-colors font-mek"
          >
            live (experimental)
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-gray-400 mt-6 sm:mt-8">
          A community experiment. Not affiliated with Farcaster.
        </p>
      </div>
    </main>
  );
};

export default App;
