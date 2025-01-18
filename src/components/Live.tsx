import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider, UseSignInData } from "@farcaster/auth-kit";
import "stream-chat-react/dist/css/v2/index.css";
import { useState, useEffect } from "react";
import FramesSDK, { sdk } from "@farcaster/frame-sdk";
import { useStore } from "../store/useStore";
import MaybeDisplaySignInButton from "../components/MaybeDisplaySignInButton/MaybeDisplaySignInButton";
import {
  DefaultGenerics,
  StreamChat,
  type Channel as StreamChannel,
} from "stream-chat";
import LivestreamChat from "../components/LivestreamChat/LivestreamChat";
import VoteTab from "../components/VoteTab";
import ReactPlayer from "react-player";
import { HackathonFinalist, useFarcaster } from "./providers/FarcasterProvider";

const API_URL = "https://production.weeklyhackathon.com";

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

const chatClient = StreamChat.getInstance(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoianAifQ.ECluHEzlzMzge3Eh5tC7xbL02LIIuSGxJ8tRBz4LPlU",
  {
    timeout: 6000,
  }
);

function Live({ setIsLive }: { setIsLive: (isLive: boolean) => void }) {
  const {
    name: username,
    setName: setUsername,
    jwt,
    setJwt,
    pfp,
    setPfp,
    displayName,
    setDisplayName,
    clearData,
  } = useStore();

  const [channel, setChannel] = useState<StreamChannel<DefaultGenerics> | null>(
    null
  );
  const [errors, setErrors] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showVoteModal, setShowVoteModal] = useState(true);
  const [countdown, setCountdown] = useState<string>("");
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const [selectedUser, setSelectedUser] = useState<HackathonFinalist | null>(
    null
  );

  const [showWelcome, setShowWelcome] = useState(true);
  const [frameContext, setFrameContext] = useState<Awaited<
    typeof FramesSDK.context
  > | null>(null);

  const { weekOneFinalists: unsortedWeekOneFinalists } = useFarcaster();
  const weekOneFinalists = [...unsortedWeekOneFinalists].sort(
    (a, b) => a.draggablePosition - b.draggablePosition
  );

  setIsLive(true);

  FramesSDK.actions
    .ready()
    .then(() => FramesSDK.context.then(setFrameContext).catch(() => {}));

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEnterButton(true);
    }, 888);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log(errors);
    const targetDate = new Date("2025-01-20T05:57:00Z");

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

    if (data.success && data.payload) {
      return data.payload;
    }
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

  if (jwt && !channel) {
    isJwtValid(jwt).then((isValid) => {
      if (isValid) {
        const userData = {
          id: username,
          name: displayName || username,
          ...(pfp && { image: pfp }),
        };

        chatClient
          .connectUser(userData, jwt)
          .then(() => {
            const channel = chatClient.getChannelById(
              "livestream",
              "messaging",
              {}
            );
            setChannel(channel);
            setIsAuthenticated(true);
          })
          .catch((error) => {
            logoutCleanup();
            setErrors(error.message);
          });
      } else {
        logoutCleanup();
      }
    });
  }
  if (showWelcome) {
    return (
      <div
        className={`fixed inset-0 bg-black flex items-center justify-center transition-all duration-1000 ${
          isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="text-center">
          <h1 className="font-mek text-6xl font-bold text-[#2DFF05] mb-12 opacity-0 animate-[fadeInDown_1.2s_ease-out_forwards]">
            $hackathon week-1 finalists
          </h1>

          <div className="relative h-64 w-64 mx-auto mb-12 opacity-0 animate-[fadeIn_1.2s_ease-out_0.6s_forwards]">
            {weekOneFinalists.map((user, index) => (
              <div
                key={user.fid}
                onClick={() => sdk.actions.viewProfile({ fid: user.fid })}
                className="absolute left-1/3 top-1/3 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500"
                style={{
                  transform: `rotate(${
                    (index * 360) / weekOneFinalists.length
                  }deg) translateX(100px) rotate(-${
                    (index * 360) / weekOneFinalists.length
                  }deg)`,
                }}
              >
                <img
                  src={user.pfp_url}
                  alt={user.display_name}
                  className="w-20 h-20 rounded-full border-2 border-[#2DFF05] hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(45,255,5,0.3)]"
                />
              </div>
            ))}
          </div>

          {showEnterButton && (
            <button
              onClick={() => {
                setIsExiting(true);
                setTimeout(() => {
                  setShowWelcome(false);
                  setSelectedUser(null);
                }, 1000);
              }}
              className="font-mek bg-black px-12 py-4 text-2xl border-2 border-[#2DFF05] text-[#2DFF05] rounded-lg
                hover:bg-[#2DFF05] hover:text-black transition-all duration-300
                opacity-0 animate-[fadeInUp_1s_ease-out_1.2s_forwards] hover:scale-105
                shadow-[0_0_20px_rgba(45,255,5,0.2)] hover:shadow-[0_0_30px_rgba(45,255,5,0.4)]"
            >
              ENTER
            </button>
          )}
        </div>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes fadeInDown {
              from { 
                opacity: 0;
                transform: translateY(-20px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes fadeInUp {
              from { 
                opacity: 0;
                transform: translateY(20px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </div>
    );
  }
  return (
    <AuthKitProvider config={optimismConfig}>
      <div className="flex fixed top-0 flex-col items-center justify-center h-screen mx-auto w-screen">
        <div className="flex flex-col items-center w-full bg-black h-full">
          <div className="w-full h-full flex flex-col md:flex-row">
            <div className="w-full md:w-2/3 flex flex-col">
              <div className="aspect-video relative w-full">
                {selectedUser ? (
                  <div className="player-wrapper w-full h-full">
                    <ReactPlayer
                      className="react-player w-full h-full"
                      url={selectedUser.demo_url}
                      width="100%"
                      height="100%"
                    />
                  </div>
                ) : (
                  <div className="player-wrapper w-full h-full bg-black overflow-hidden relative">
                    <div className="absolute inset-0 flex">
                      {[...Array(20)].map((_, colIndex) => (
                        <div
                          key={colIndex}
                          className="flex-1 flex flex-col"
                          style={{
                            animation: `matrixRain ${
                              1 + Math.random() * 2
                            }s linear infinite`,
                          }}
                        >
                          {[...Array(30)].map((_, rowIndex) => (
                            <div
                              key={rowIndex}
                              className="text-[#2DFF05] text-opacity-90 text-sm font-mono"
                              style={{
                                animation: `matrixFade 2s linear infinite`,
                                animationDelay: `${Math.random() * 2}s`,
                              }}
                            >
                              {String.fromCharCode(0x30a0 + Math.random() * 96)}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <style>
                      {`
                        @keyframes matrixRain {
                          from { transform: translateY(-100%); }
                          to { transform: translateY(100%); }
                        }
                        @keyframes matrixFade {
                          0%, 100% { opacity: 0; }
                          50% { opacity: 1; }
                        }
                      `}
                    </style>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 flex gap-4">
                  {selectedUser ? (
                    <>
                      <a
                        href={selectedUser.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black/80 p-2 rounded-full hover:bg-black/60 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="#2DFF05"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                      <a
                        href={selectedUser.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black/80 p-2 rounded-full hover:bg-black/60 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="#2DFF05"
                        >
                          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                        </svg>
                      </a>
                      {frameContext?.user?.fid ? (
                        <div
                          onClick={() => {
                            FramesSDK.actions.openUrl(
                              `https://warpcast.com/~/frames/launch?domain=${
                                selectedUser.project_url.split("://")[1]
                              }`
                            );
                          }}
                          className="cursor-pointer bg-black/80 p-2 rounded-full hover:bg-black/60 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="#2DFF05"
                          >
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                          </svg>
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-3 px-1 py-2 bg-black">
                {weekOneFinalists.map((user) => (
                  <div
                    key={user.fid}
                    onClick={() => setSelectedUser(user)}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedUser?.fid === user.fid
                        ? "transform scale-110 ring-2 ring-[#2DFF05] ring-offset-2 ring-offset-black rounded-full"
                        : "hover:scale-110"
                    }`}
                  >
                    <img
                      src={user.pfp_url}
                      alt={user.display_name}
                      className="w-10 h-10 rounded-full object-cover border border-[#2DFF05]"
                      title={user.display_name}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/3 h-full relative">
              {/* Vote Button */}
              <button
                onClick={() => setShowVoteModal(!showVoteModal)}
                className="absolute top-4 left-4 z-50 bg-black border-2 border-[#2DFF05] text-2xl p-2 rounded-lg hover:bg-[#25CC04] transition-all duration-300 animate-voteButtonIntro"
              >
                🗳️
              </button>
              <div className="absolute top-4 left-16 bg-black/80 backdrop-blur-sm border-2 border-[#2DFF05] rounded-lg px-4 py-2 z-50">
                <span className="font-mek text-2xl text-[#2DFF05]">
                  {countdown}
                </span>
              </div>

              {isAuthenticated ? (
                <div className="w-full h-72 bg-[#2A2A2A] rounded-lg shadow-lg">
                  <LivestreamChat
                    channel={channel}
                    displayName={displayName}
                    username={username}
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-[#2A2A2A] p-4 rounded-lg text-white text-center flex justify-center items-center">
                  <MaybeDisplaySignInButton
                    frameContext={frameContext}
                    jwt={jwt}
                    isAuthenticated={isAuthenticated}
                    onFarcasterSignIn={onFarcasterSignIn}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Vote Modal */}
          {showVoteModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex h-screen items-center justify-center transition-all duration-300 animate-fadeIn">
              <div className="w-full h-full max-w-3xl relative rounded-lg shadow-2xl transform animate-scaleIn">
                <VoteTab
                  setShowVoteModal={setShowVoteModal}
                  weekOneFinalists={weekOneFinalists}
                />
              </div>
            </div>
          )}
        </div>

        <style>
          {`
            @keyframes voteButtonIntro {
              0% {
                transform: translateX(-100vw) scale(3);
                background: #2DFF05;
              }
              50% {
                transform: translateX(0) scale(3);
                background: #2DFF05;
              }
              75% {
                transform: translateX(0) scale(1.5);
                background: black;
              }
              100% {
                transform: translateX(0) scale(1);
                background: black;
              }
            }
            .animate-voteButtonIntro {
              animation: voteButtonIntro 2s ease-out forwards;
            }
          `}
        </style>
      </div>
    </AuthKitProvider>
  );
}

export default Live;
