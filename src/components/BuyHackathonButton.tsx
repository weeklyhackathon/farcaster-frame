import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import clanker_v2_abi from "../lib/clanker_v2_abi.json";

const HACKATHON_TOKEN_CONTRACT_ADDRESS =
  "0x3dF58A5737130FdC180D360dDd3EFBa34e5801cb";

const BuyHackathonButton = () => {
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useAccount();

  const {
    writeContract,
    data: hash,
    isPending: isSendTxPending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleBuyHackathon = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      console.log("🎮 Starting hackathon token purchase...");
      const tx = await writeContract({
        address: HACKATHON_TOKEN_CONTRACT_ADDRESS as `0x${string}`,
        abi: clanker_v2_abi,
        functionName: "marketBuy",
        args: [BigInt(88889)],
      });
      console.log("✅ Transaction submitted:", tx);
    } catch (err) {
      console.log("❌ Purchase failed!");
      console.error("Error details:", err);

      if (err instanceof Error) {
        console.log("🚫 Error message:", err.message);
        setError(err.message);
      } else {
        console.log("⚠️ Unknown error type:", err);
        setError("An unknown error occurred while purchasing");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <button
        onClick={handleBuyHackathon}
        disabled={!isConnected || isSendTxPending || isConfirming}
        className="bg-black text-[#2DFF05] px-12 py-6 rounded-lg shadow-[0_0_20px_rgba(45,255,5,0.5)] transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(45,255,5,0.8)] disabled:opacity-50 border-2 border-[#2DFF05] font-bold text-xl tracking-wider font-mono"
        style={{ textShadow: "0 0 10px rgba(45, 255, 5, 0.5)" }}
      >
        {isSendTxPending || isConfirming ? (
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#2DFF05] mx-auto" />
        ) : isConfirmed ? (
          "Purchase Complete!"
        ) : (
          "Buy 88,889 $HACKATHON"
        )}
      </button>

      {hash && (
        <div className="mt-4 text-sm text-[#2DFF05]">
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

      {error && (
        <div className="mt-4 text-red-500 text-center font-mono">{error}</div>
      )}
    </div>
  );
};

export default BuyHackathonButton;
