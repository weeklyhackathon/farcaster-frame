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

function Root() {
  console.log("Rendering Root component");
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    console.log("Root useEffect triggered, isSDKLoaded:", isSDKLoaded);
    const load = async () => {
      console.log("Initializing Farcaster SDK");
      sdk.actions.ready();
      await sdk.actions.addFrame();
    };
    if (sdk && !isSDKLoaded) {
      console.log("Loading SDK...");
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  return (
    <React.StrictMode>
      <FarcasterProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/week-one" element={<WeekOne />} />
            <Route path="/mint-hacker-pass" element={<MintHackerPass />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </FarcasterProvider>
    </React.StrictMode>
  );
}

console.log("Mounting React application");
ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
