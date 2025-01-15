import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider, UseSignInData } from "@farcaster/auth-kit";
import "stream-chat-react/dist/css/v2/index.css";
import { useState } from "react";

import { useStore } from "../store/useStore";
import MaybeDisplaySignInButton from "./MaybeDisplaySignInButton/MaybeDisplaySignInButton";
import {
  DefaultGenerics,
  StreamChat,
  type Channel as StreamChannel,
} from "stream-chat";
import LivestreamChat from "./LivestreamChat/LivestreamChat";
import BuyHackathonButton from "./BuyHackathonButton";
import { Link } from "react-router-dom";

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
  const [activeTab, setActiveTab] = useState<"chat" | "vote">("chat");
  // const [showTokenModal, setShowTokenModal] = useState(false);
  setIsLive(true);

  const nativeLogin = async (
    nonce: string,
    message: string,
    signature: string,
    fid: number,
    username: string
  ) => {
    const response = await fetch("/api/login", {
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
    const response = await fetch("/api/revalidate", {
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
      <div className="flex flex-col items-center justify-center h-screen  mx-auto w-screen">
        <div className="flex flex-col items-center  md:max-w-[555px] w-full bg-black h-full">
          <h1 className="font-mek text-6xl md:text-8xl mt-4 text-[#2DFF05]">
            WE ARE LIVE
          </h1>
          {!isAuthenticated && (
            <div className="w-full border-white border-2 aspect-video bg-red-200">
              <video
                src="/assets/static.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full "
              />
            </div>
          )}
          {errors && <p className="error">{errors}</p>}
          {pfp && <img src={pfp} alt="Profile picture" />}
          <LivestreamChat
            channel={channel}
            displayName={displayName}
            username={username}
          />
          <div className="w-full mt-4 mx-auto  flex flex-col justify-center items-center">
            <MaybeDisplaySignInButton
              jwt={jwt}
              isAuthenticated={isAuthenticated}
              callback={onFarcasterSignIn}
            />

            <div className="flex w-full max-w-md mt-4 border-b border-[#2DFF05]">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 py-2 text-center transition-colors ${
                  activeTab === "chat"
                    ? "bg-[#2DFF05] text-black"
                    : "bg-[#1A8C03] text-[#2DFF05]"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab("vote")}
                className={`flex-1 py-2 text-center transition-colors ${
                  activeTab === "vote"
                    ? "bg-[#2DFF05] text-black"
                    : "bg-[#1A8C03] text-[#2DFF05]"
                }`}
              >
                Vote
              </button>
            </div>

            {/* <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowTokenModal(true)}
                className="px-3 py-1 bg-black/80 border border-[#2DFF05] rounded text-[#2DFF05] text-sm hover:bg-[#2DFF05]/20 transition-colors"
              >
                Token Requirements
              </button>
            </div> */}
            {/* 
            {showTokenModal && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="bg-black p-6 rounded-lg border border-[#2DFF05] max-w-md">
                  <p className="text-[#2DFF05] text-center">
                    You need at least 88889 $hackathon on your connected wallet
                    to chat
                  </p>
                  <BuyHackathonButton />
                  <button
                    onClick={() => setShowTokenModal(false)}
                    className="mt-4 w-full px-4 py-2 border border-[#2DFF05] rounded text-[#2DFF05] hover:bg-[#2DFF05]/20 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )} */}

            <Link to="/" className="text-[#2DFF05]">
              back
            </Link>
          </div>
        </div>
      </div>
    </AuthKitProvider>
  );
}

export default Live;
