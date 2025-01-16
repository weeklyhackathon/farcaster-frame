import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider, UseSignInData } from "@farcaster/auth-kit";
import "stream-chat-react/dist/css/v2/index.css";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

import FramesSDK from "@farcaster/frame-sdk";

import { useStore } from "../store/useStore";
import MaybeDisplaySignInButton from "./MaybeDisplaySignInButton/MaybeDisplaySignInButton";
import {
  DefaultGenerics,
  StreamChat,
  type Channel as StreamChannel,
} from "stream-chat";
import LivestreamChat from "./LivestreamChat/LivestreamChat";
import VoteTab from "./VoteTab";

const API_URL = "https://server.weeklyhackathon.com";

interface TokenValidationResponse {
  success: boolean;
  message: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  payload?: {
    username: string;
    farcasterUsername?: string;
    jwt: string;
    pfp: string;
    addresses: `0x${string}`[];
    powerBadge: boolean;
  };
}

const optimismConfig = {
  rpcUrl: "https://mainnet.optimism.io",
  domain: window.location.host,
  siweUri: window.location.origin + "/api/login",
};

const apiKey = import.meta.env.VITE_GETSTREAM_API_KEY;

const chatClient = StreamChat.getInstance(apiKey, {
  timeout: 6000,
});

function Live({ setIsLive }: { setIsLive: (isLive: boolean) => void }) {
  const {
    name: username,
    setName: setUsername,
    jwt: jwt,
    setJwt: setJwt,
    pfp: pfp,
    setPfp: setPfp,
    displayName,
    setDisplayName,
    clearData,
  } = useStore();
  const [channel, setChannel] = useState<StreamChannel<DefaultGenerics> | null>(
    null
  );
  const [errors, setErrors] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [countdown, setCountdown] = useState<string>("");
  setIsLive(true);

  type FrameContext = Awaited<typeof FramesSDK.context>;

  const [frameContext, setFrameContext] = useState<FrameContext | null>(null);

  FramesSDK.actions
    .ready()
    .then(() => FramesSDK.context.then(setFrameContext).catch(() => {}));

  useEffect(() => {
    if (frameContext) {
      console.log("Frame context: ", frameContext);
    }
  }, [frameContext]);

  useEffect(() => {
    const targetDate = new Date("2025-01-17T00:29:00Z");

    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nativeLogin = async (
    nonce: string,
    message: string,
    signature: string,
    fid: number,
    username: string
  ) => {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      body: JSON.stringify({
        fid,
        username,
        signature,
        nonce,
        message,
        domain: window.location.host,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const data = (await response.json()) as LoginResponse;
    console.log("Login response: ", data);

    if (data.success) {
      if (data.payload) {
        return data.payload;
      } else return "Missing payload";
    }

    console.error("Login failed: ", data.message);
    return data.message;
  };

  const isJwtValid = async (jwt: string) => {
    const response = await fetch(`${API_URL}/api/revalidate`, {
      method: "POST",
      body: JSON.stringify({ jwt }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const data = (await response.json()) as TokenValidationResponse;
    return data.success;
  };

  const logoutCleanup = () => {
    clearData();
    setChannel(null);
    setIsAuthenticated(false);
  };

  const onFarcasterSignIn = (data: UseSignInData) => {
    console.log("User signed in: ", data);
    if (
      !data.nonce ||
      !data.message ||
      !data.signature ||
      !data.fid ||
      !data.username
    ) {
      console.error("Invalid sign in data");
      setErrors("Invalid sign in data");
      logoutCleanup();
      return;
    }

    nativeLogin(
      data.nonce,
      data.message,
      data.signature,
      data.fid,
      data.username
    ).then((userData) => {
      if (typeof userData === "string") {
        console.error("Login failed: ", userData);
        setErrors(userData);
        logoutCleanup();
        return;
      }

      const { username, pfp, jwt } = userData;
      setUsername(username);
      if (userData.farcasterUsername) {
        setDisplayName(userData.farcasterUsername);
      }
      setPfp(pfp);
      setJwt(jwt);

      const userRequestData: Record<string, string> = {
        id: username as string,
        name: (displayName || username) as string,
      };
      if (pfp) {
        userRequestData.image = pfp;
      }

      chatClient
        .connectUser(userRequestData as any, jwt)
        .then(() => {
          console.log("User connected, connecting to chat channel");
          const channel = chatClient.getChannelById(
            "livestream",
            "messaging",
            {}
          );
          setChannel(channel);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error("Error connecting user: ", error);
          setErrors(error.message);
          logoutCleanup();
        });
    });
  };

  // If they just came back and we have a JWT, connect them to the chat channel without wallet or farcaster login
  if (jwt && !channel) {
    isJwtValid(jwt).then((isValid) => {
      if (isValid) {
        const userData: Record<string, string> = {
          id: username,
          name: displayName || username,
        };
        if (pfp) {
          userData.image = pfp;
        }
        chatClient
          .connectUser(userData as any, jwt)
          .then(() => {
            console.log("User connected, connecting to chat channel");
            const channel = chatClient.getChannelById(
              "livestream",
              "messaging",
              {}
            );
            setChannel(channel);
            setIsAuthenticated(true);
          })
          .catch((error) => {
            console.error("Error connecting user: ", error);
            logoutCleanup();
            setErrors(error.message);
          });
      } else {
        logoutCleanup();
      }
    });
  }

  return (
    <AuthKitProvider config={optimismConfig}>
      <div className="flex flex-col items-center justify-center h-screen mx-auto w-screen">
        <div className="flex flex-col items-center md:max-w-[555px] w-full bg-black h-full">
          <h1 className="w-fit ml-auto font-mek text-6xl md:text-8xl mt-4 text-[#2DFF05]">
            {countdown}
          </h1>
          <div className="w-full border-white border-2 aspect-video bg-red-200">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/h96MGcsi7GQ?si=FMd3Vmfayzsub8bh"
              title="YouTube video player"
            ></iframe>
          </div>
          {errors && <p className="error">{errors}</p>}

          <div className="w-full h-full">
            {isAuthenticated ? (
              <div className="w-full h-96 bg-[#2A2A2A] rounded-b-lg shadow-lg">
                <LivestreamChat
                  channel={channel}
                  displayName={displayName}
                  username={username}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-[#2A2A2A] p-4 rounded-b-lg text-white text-center flex justify-center items-center">
                <MaybeDisplaySignInButton
                  frameContext={frameContext}
                  jwt={jwt}
                  isAuthenticated={isAuthenticated}
                  onFarcasterSignIn={onFarcasterSignIn}
                />
              </div>
            )}
          </div>

          {/* Floating Vote Button */}
          <button
            onClick={() => setShowVoteModal(!showVoteModal)}
            className={`fixed top-4 left-4 border-2 border-[#2DFF05] text-4xl p-4 rounded-full shadow-lg transition-all duration-300 z-[60] ${
              showVoteModal
                ? "bg-[#2DFF05] rotate-12 scale-110 shadow-[#2DFF05]/50 shadow-xl"
                : "bg-black hover:bg-[#25CC04]"
            }`}
          >
            🗳️
          </button>

          {/* Vote Modal */}
          {showVoteModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex h-screen items-center justify-center transition-all duration-300 animate-fadeIn">
              <div className="w-full h-full max-w-3xl relative rounded-lg shadow-2xl transform animate-scaleIn">
                <VoteTab />
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthKitProvider>
  );
}

export default Live;
