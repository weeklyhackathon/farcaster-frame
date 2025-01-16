import { SignInButton, UseSignInData } from "@farcaster/auth-kit";
import FramesSDK from "@farcaster/frame-sdk";

type FrameContext = Awaited<typeof FramesSDK.context>;

const MaybeDisplaySignInButton = ({
  frameContext,
  jwt,
  isAuthenticated,
  onFarcasterSignIn,
}: {
  frameContext: FrameContext | null;
  jwt: string;
  isAuthenticated: boolean;
  onFarcasterSignIn: (data: UseSignInData) => void;
}) => {
  if (jwt || isAuthenticated) {
    return null;
  }

  const nonce = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");

  const framesLogin = () => {
    FramesSDK.actions.signIn({ nonce }).then(({ signature, message }) => {
      if (frameContext && signature && message) {
        onFarcasterSignIn({
          nonce,
          signature: signature as `0x${string}`,
          message,
          fid: frameContext.user.fid,
          username: frameContext.user.username,
        } as any);
      }
    });
  };

  if (frameContext) {
    return (
      <div className="flex flex-col gap-8">
        <button
          className="bg-[#2DFF05] text-black px-4 py-2 rounded-lg"
          onClick={framesLogin}
        >
          Sign in as @{frameContext.user.username}
        </button>
      </div>
    );
  }

  return (
    <div>
      <SignInButton onSuccess={onFarcasterSignIn} />
    </div>
  );
};

export default MaybeDisplaySignInButton;
