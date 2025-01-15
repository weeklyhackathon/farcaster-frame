import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import sdk, { FrameNotificationDetails } from "@farcaster/frame-sdk";
import { UseSignInData } from "@farcaster/auth-kit";
import {
  CastEmbedLocationContext,
  ChannelLocationContext,
  LauncherLocationContext,
  NotificationLocationContext,
  SafeAreaInsets,
} from "@farcaster/frame-core/dist/context";

export type LocationContext =
  | CastEmbedLocationContext
  | NotificationLocationContext
  | LauncherLocationContext
  | ChannelLocationContext;

export type FrameContext = {
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  location?: LocationContext;
  client: {
    clientFid: number;
    added: boolean;
    safeAreaInsets?: SafeAreaInsets;
    notificationDetails?: FrameNotificationDetails;
  };
};

interface FarcasterContextType {
  fid: number | null;
  username: string | null;
  displayName: string | null;
  pfp: string | null;
  isFrame: boolean;
  jwt: string | null;
  isAuthenticated: boolean;
  signIn: (data: UseSignInData) => Promise<void>;
  signOut: () => void;
  userFarcasterFrameContext: FrameContext | null;
}

const FarcasterContext = createContext<FarcasterContextType | undefined>(
  undefined
);

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

export const FarcasterProvider = ({ children }: { children: ReactNode }) => {
  const [fid, setFid] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [pfp, setPfp] = useState<string | null>(null);
  const [isFrame, setIsFrame] = useState(false);
  const [jwt, setJwt] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userFarcasterFrameContext, setUserFarcasterFrameContext] =
    useState<FrameContext | null>(null);

  useEffect(() => {
    const initializeFrameContext = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.fid) {
          setUserFarcasterFrameContext(context);
          setFid(context.user.fid);
          setIsFrame(true);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log("Not in a Farcaster Frame context");
        setIsFrame(false);
      }
    };

    initializeFrameContext();
  }, []);

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

    if (data.success && data.payload) {
      return data.payload;
    }
    throw new Error(data.message);
  };

  const signIn = async (data: UseSignInData) => {
    if (
      !data.nonce ||
      !data.message ||
      !data.signature ||
      !data.fid ||
      !data.username
    ) {
      throw new Error("Invalid sign in data");
    }

    try {
      const userData = await nativeLogin(
        data.nonce,
        data.message,
        data.signature,
        data.fid,
        data.username
      );

      setFid(data.fid);
      setUsername(userData.username);
      setDisplayName(userData.farcasterUsername || userData.username);
      setPfp(userData.pfp);
      setJwt(userData.jwt);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signOut = () => {
    setFid(null);
    setUsername(null);
    setDisplayName(null);
    setPfp(null);
    setJwt(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (jwt) {
      isJwtValid(jwt).then((isValid) => {
        if (!isValid) {
          signOut();
        }
      });
    }
  }, [jwt]);

  const value = {
    fid,
    username,
    displayName,
    pfp,
    isFrame,
    jwt,
    isAuthenticated,
    signIn,
    signOut,
    userFarcasterFrameContext,
  };

  return (
    <FarcasterContext.Provider value={value}>
      {children}
    </FarcasterContext.Provider>
  );
};

export const useFarcasterContext = () => {
  const context = useContext(FarcasterContext);
  if (context === undefined) {
    throw new Error(
      "useFarcasterContext must be used within a FarcasterProvider"
    );
  }
  return context;
};
