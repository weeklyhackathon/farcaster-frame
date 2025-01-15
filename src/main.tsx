import "./index.css";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";
import App from "./App";
import FarcasterProvider from "./components/providers/EthereumProvider";
import WeekOne from "./components/WeekOne";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import MintHackerPass from "./components/MintHackerPass";
import Game from "./components/Game";

import "stream-chat-react/dist/css/v2/index.css";
import Live from "./components/Live";

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

  return (
    <React.StrictMode>
      <FarcasterProvider>
        {!isLive && <Navbar />}
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/week-one" element={<WeekOne />} />
          <Route path="/mint-hacker-pass" element={<MintHackerPass />} />
          <Route path="/game" element={<Game />} />
          <Route path="/live" element={<Live setIsLive={setIsLive} />} />
        </Routes>
        {!isLive && <Footer />}
      </FarcasterProvider>
    </React.StrictMode>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  );
}

console.log("Mounting React application");
ReactDOM.createRoot(document.getElementById("root")!).render(<AppWrapper />);
