import "./index.css";

import React, {
  useEffect,
  useState,
  Component,
  ErrorInfo,
  ReactNode,
} from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";
// import App from "./App";
import FarcasterProvider from "./components/providers/EthereumProvider";
import WeekOne from "./components/WeekOne";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import MintHackerPass from "./components/MintHackerPass";
import Game from "./components/Game";

import "stream-chat-react/dist/css/v2/index.css";
import Live from "./components/Live";

const CUTOFF_TIME = new Date("2026-01-16T23:59:00Z");

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-screen bg-black text-white p-8 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <pre className="bg-gray-800 p-4 rounded mb-6 max-w-2xl overflow-auto">
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function WeekOneEndedMessage() {
  return (
    <main className="relative w-screen min-h-screen flex bg-black overflow-x-hidden">
      {/* Marquee header */}
      <div className="absolute top-0 w-full h-6 overflow-hidden bg-[#2DFF05] flex items-center">
        <div className="animate-[slideRight_15s_linear_infinite] whitespace-nowrap text-black font-mek text-xs sm:text-base">
          W E E K • O N E • C O M P L E T E • W E E K • O N E • C O M P L E T E
        </div>
        <div
          className="animate-[slideRight_15s_linear_infinite] whitespace-nowrap text-black font-mek ml-4 text-xs sm:text-base"
          aria-hidden="true"
        >
          W E E K • O N E • C O M P L E T E • W E E K • O N E • C O M P L E T E
        </div>
      </div>

      <div className="flex mt-10 flex-col gap-4 sm:gap-6 items-center justify-center text-center w-full max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-white">
        <h1 className="font-mek text-4xl sm:text-5xl md:text-7xl">
          week one is done
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl mt-6">
          you can read week's two instructions here:
        </p>

        <a
          href="https://github.com/weeklyhackathon/week-2"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2DFF05]/70 hover:text-[#2DFF05] text-lg sm:text-xl md:text-2xl transition-colors"
        >
          github.com/weeklyhackathon/week-2
        </a>

        <p className="text-lg sm:text-xl md:text-2xl mt-6">
          or wait until we figure out properly how to do onchain voting and have
          you mint a cool nft. it will happen soon, as soon as possible.
        </p>

        <p className="font-mek text-xl sm:text-2xl md:text-3xl text-[#2DFF05] mt-6">
          stay tuned!
        </p>
      </div>
    </main>
  );
}

function Root() {
  console.log("Rendering Root component");
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
      await sdk.actions.addFrame();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  if (new Date() > CUTOFF_TIME) {
    return <WeekOneEndedMessage />;
  }

  return (
    <React.StrictMode>
      <FarcasterProvider>
        {!isLive && <Navbar />}
        <Routes>
          <Route path="/" element={<Live setIsLive={setIsLive} />} />
          <Route path="/week-one" element={<WeekOne />} />
          <Route path="/mint-hacker-pass" element={<MintHackerPass />} />
          <Route path="/game" element={<Game />} />
        </Routes>
        {!isLive && <Footer />}
      </FarcasterProvider>
    </React.StrictMode>
  );
}

function AppWrapper() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

console.log("Mounting React application");
ReactDOM.createRoot(document.getElementById("root")!).render(<AppWrapper />);
