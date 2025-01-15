import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import sdk from "@farcaster/frame-sdk";
import weeklyHackathonAbi from "../lib/weekly_hackathon_abi.json";

const WEEKLY_HACKATHON_CONTRACT_ADDRESS =
  "0x9D341F2dBB7b77f77C051CbBF348F4BF5C858Fab";

const MintHackerPass = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [passportImageUrl, setPassportImageUrl] = useState<string | null>(null);
  const [isFarcasterFrame, setIsFarcasterFrame] = useState(true);
  const [hackerProfile, setHackerProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [fid, setFid] = useState<number | null>(null);
  const [hasNFT, setHasNFT] = useState(false);
  const [alreadyClickedOnce, setAlreadyClickedOnce] = useState(false);

  const { address, isConnected } = useAccount();

  const {
    writeContract,
    data: hash,
    isPending: isSendTxPending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Check if user has NFT on component mount
  const { data: tokenBalance } = useReadContract({
    address: WEEKLY_HACKATHON_CONTRACT_ADDRESS as `0x${string}`,
    abi: weeklyHackathonAbi,
    functionName: "balanceOf",
    args: [address],
  }) as { data: bigint | undefined };
  console.log("tokenBalance", tokenBalance);

  useEffect(() => {
    if (tokenBalance && tokenBalance > 0n) {
      setHasNFT(true);
      handlePreparePassport();
    }
  }, [tokenBalance, address]);

  const handlePreparePassport = async () => {
    const context = await sdk.context;
    if (!context?.user?.fid) {
      setIsFarcasterFrame(false);
      if (alreadyClickedOnce) {
        window.open(
          "https://warpcast.com/~/frames/launch?domain=weeklyhackathon.com",
          "_blank"
        );
      }
      setAlreadyClickedOnce(true);
      return;
    }
    console.log("context", context);

    setFid(context.user.fid);

    console.log("Starting Hacker Pass (passport) preparation...");
    setIsLoading(true);
    setError(null);

    try {
      console.log(
        "Sending request to prepare-hackerpas2222s (passport) endpoint..."
      );
      if (!address) {
        setError("Please connect your wallet first");
        return;
      }
      const response = await axios.post(
        "https://farcaster.anky.bot/weeklyhackathon/prepare-passport",
        {
          address: address as `0x${string}`,
          fid: context.user.fid,
        }
      );
      console.log("IIIIN HE123i7821378RE", response.data);
      console.log("response.data", response.data.data);
      if (response.data?.data?.hackerProfile?.imageUrl) {
        console.log("ONE");
        setHackerProfile(response.data?.data?.hackerProfile);
        console.log("hackerProfile", hackerProfile);
        setPassportImageUrl(response.data?.data?.hackerProfile?.imageUrl);
      } else {
        console.log("TWO");
        console.log("IN HEREEEEE", response.data.data);
        setPassportImageUrl(response.data.data.preMintData.imageUrl);

        if (
          !response.data.data.status.isMinted &&
          response.data.data.status.canMint
        ) {
          setShowModal(true);
        }
      }
      setShowModal(true);
    } catch (err: any) {
      console.error("Error preparing passport:", err);
      setError(err?.response?.data?.message || "Failed to prepare passport");
    } finally {
      setIsLoading(false);
    }
  };

  const mintPassport = useCallback(async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!fid) {
      setError("No Farcaster ID found");
      return;
    }

    console.log("🎮 Starting passport mint...");
    console.log("🎯 FID:", fid);

    try {
      console.log("📝 Calling mintPassport contract function...");
      const tx = await writeContract({
        address: WEEKLY_HACKATHON_CONTRACT_ADDRESS as `0x${string}`,
        abi: weeklyHackathonAbi,
        functionName: "mintPassport",
        args: [BigInt(fid)],
      });
      console.log("✅ Transaction submitted:", tx);
    } catch (err) {
      console.log("❌ Mint failed!");
      console.error("Error details:", err);

      if (err instanceof Error) {
        console.log("🚫 Error message:", err.message);
        setError(err.message);
      } else {
        console.log("⚠️ Unknown error type:", err);
        setError("An unknown error occurred while minting");
      }
    }
  }, [isConnected, writeContract, fid]);

  const handleShare = () => {
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      `[>_] INITIALIZED: $hackathon access granted </>\n\n[█] Week 0x01 Challenge: Build the ultimate Frames v2 starter experience\n\n[⌘] Current pool: $7.2k USD [LIVE/GROWING]\n\n[∞] Ready to hack? Join the revolution - mint your pass in the frame below.`
    )}&embeds[]=${
      passportImageUrl || hackerProfile?.imageUrl
    }&embeds[]=https://weeklyhackathon.com`;
    window.open(url, "_blank");
  };

  const renderNFTDisplay = () => (
    <div className="flex flex-col items-center">
      <img
        src={passportImageUrl || ""}
        alt="Hacker Pass"
        className="w-full max-w-lg h-auto mb-2 shadow-[0_0_20px_rgba(45,255,5,0.8)] rounded-lg"
      />
      <p
        className="text-[#2DFF05] text-sm mb-4"
        style={{ textShadow: "0 0 10px rgba(45, 255, 5, 0.5)" }}
      >
        Save this image to your photo library
      </p>
      <button
        onClick={handleShare}
        className="bg-black text-[#2DFF05] px-8 py-4 rounded font-mono border-2 border-[#2DFF05] hover:bg-[#2DFF05] hover:text-black transition-colors"
        style={{ textShadow: "0 0 10px rgba(45, 255, 5, 0.5)" }}
      >
        share
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {hasNFT ? (
        renderNFTDisplay()
      ) : !showModal ? (
        <>
          <button
            onClick={handlePreparePassport}
            disabled={isLoading}
            className="bg-black text-[#2DFF05] px-12 py-6 rounded-lg shadow-[0_0_20px_rgba(45,255,5,0.5)] transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(45,255,5,0.8)] disabled:opacity-50 border-2 border-[#2DFF05] font-bold text-xl tracking-wider"
            style={{ textShadow: "0 0 10px rgba(45, 255, 5, 0.5)" }}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#2DFF05] mx-auto" />
            ) : !isFarcasterFrame ? (
              "Open Farcaster Client"
            ) : (
              "Prepare Hacker Pass"
            )}
          </button>
          {!isFarcasterFrame && (
            <div className="text-red-500 text-sm mt-2">
              Please access through a Farcaster client to mint your pass
            </div>
          )}
        </>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-20">
          <div className="bg-[#141414] rounded-lg p-8 max-w-lg w-full flex flex-col items-center">
            <img
              src={passportImageUrl || ""}
              alt="Hacker Pass"
              className="w-full h-auto mb-2 shadow-[0_0_20px_rgba(45,255,5,0.8)] rounded-lg"
              onLoad={() => console.log("Image loaded successfully")}
              onError={() => console.error("Error loading image")}
            />
            <p
              className="text-[#2DFF05] text-sm mb-4"
              style={{ textShadow: "0 0 10px rgba(45, 255, 5, 0.5)" }}
            >
              Save this image to your photo library
            </p>
            <div className="flex gap-4">
              <button
                onClick={isConfirmed ? handleShare : mintPassport}
                disabled={(!isConnected || isSendTxPending) && !isConfirmed}
                className="bg-black text-[#2DFF05] px-8 py-4 rounded font-mono border-2 border-[#2DFF05] hover:bg-[#2DFF05] hover:text-black transition-colors disabled:opacity-50"
                style={{ textShadow: "0 0 10px rgba(45, 255, 5, 0.5)" }}
              >
                {isConfirmed
                  ? "share"
                  : isSendTxPending
                  ? "minting..."
                  : "mint"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-black text-red-500 px-8 py-4 rounded font-mono border-2 border-red-500 hover:bg-red-500 hover:text-black transition-colors"
                style={{ textShadow: "0 0 10px rgba(239, 68, 68, 0.5)" }}
              >
                go back
              </button>
            </div>

            {hash && (
              <div className="mt-4 text-sm text-gray-600">
                <div>Transaction Hash: {hash}</div>
                <div>
                  Status:{" "}
                  {isConfirming
                    ? "confirming..."
                    : isConfirmed
                    ? "confirmed!"
                    : "pending"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
};

export default MintHackerPass;
