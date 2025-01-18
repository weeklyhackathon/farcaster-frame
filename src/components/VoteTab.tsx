import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { sdk } from "@farcaster/frame-sdk";
import axios from "axios";
import weeklyHackathonWeekOneVoteAbi from "../lib/weeklyHackathonWeekOneVote.abi.json";
import { HackathonFinalist, useFarcaster } from "./providers/FarcasterProvider";
import { HACKATHON_TOKEN_CONTRACT_ADDRESS } from "./BuyHackathonButton";

const WEEKLY_HACKATHON_WEEK_ONE_CONTRACT_ADDRESS =
  "0xb08806a1c22bf9c06dfa73296fb17a14d9cfc63b";

const reorder = (
  list: HackathonFinalist[],
  startIndex: number,
  endIndex: number
) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const UserItem = ({
  user,
  index,
  isDragging,
  provided,
}: {
  user: HackathonFinalist;
  index: number;
  isDragging: boolean;
  provided: any;
}) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`flex px-2 border border-[#2DFF05] rounded-lg ${
        isDragging ? "bg-[#1A1A1A]" : "bg-[#121212]"
      } hover:bg-[#1A1A1A] transition-colors`}
    >
      <div className="flex items-center w-full gap-2">
        <span className="text-[#2DFF05]/50 text-sm">#{index + 1}</span>
        <div className="flex-1 flex gap-4 items-center cursor-grab hover:bg-[#2DFF05]/10 p-2 rounded-md transition-colors">
          <img
            src={user.pfp_url || "https://via.placeholder.com/40"}
            className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
            alt={user.display_name || user.username}
            draggable={false}
          />
          <span className="text-[#2DFF05] text-sm truncate">
            {user.display_name || user.username}
          </span>
        </div>
      </div>
    </div>
  );
};

const VoteTab = ({
  setShowVoteModal,
  weekOneFinalists,
}: {
  setShowVoteModal: (show: boolean) => void;
  weekOneFinalists: HackathonFinalist[];
}) => {
  const [finalists, setFinalists] = useState(weekOneFinalists);
  const [isVoting, setIsVoting] = useState(false);
  const [isPreparingVote, setIsPreparingVote] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [metadataIpfsHash, setMetadataIpfsHash] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { vote, setVote } = useFarcaster();
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

  const handleDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    )
      return;

    setFinalists((prevFinalists) =>
      reorder(prevFinalists, source.index, destination.index)
    );
  };

  const result = useBalance({
    address,
    token: HACKATHON_TOKEN_CONTRACT_ADDRESS, 
  })

  const formatBalance = (balance: number) => {
    if (balance < 100000) {
      return balance.toFixed(0);
    } else if (balance < 1000000) {
      return (balance / 1000).toFixed(1) + "K";
    } else {
      return (balance / 1000000).toFixed(1) + "M";
    }
  };

  const formattedBalance = result?.data ? formatBalance(parseFloat(result.data.formatted)) : 0;

  const enoughBalance = result.data ? parseFloat(result.data.formatted) > 88888 : false;

  const prepareVote = async () => {
    try {
      const preliminaryVote = finalists.map((finalist) => finalist.id).join("");

      setVote(preliminaryVote);
      setIsVoting(true);

      setIsPreparingVote(true);
      const response = await axios.post(
        "https://farcaster.anky.bot/weeklyhackathon/prepare-vote",
        {
          vote: preliminaryVote,
          address: address,
          fid: (await sdk.context).user.fid,
        }
      );
      setMetadataIpfsHash(response.data.metadataIpfsHash);
      setShowMintModal(true);
      setIsPreparingVote(false);
    } catch (error) {
      console.error("Vote preparation failed:", error);
      setIsPreparingVote(false);
      setIsVoting(false);
    }
  };

  const castVote = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    console.log("🎮 Starting vote casting process...");
    console.log("🎯 Vote:", vote);
    console.log("📝 IPFS Hash:", metadataIpfsHash);

    try {
      console.log("📝 Calling emitVote contract function...");
      const tx = await writeContract({
        address: WEEKLY_HACKATHON_WEEK_ONE_CONTRACT_ADDRESS as `0x${string}`,
        abi: weeklyHackathonWeekOneVoteAbi,
        functionName: "emitVote",
        args: [Number(vote), metadataIpfsHash],
      });
      console.log("✅ Transaction submitted:", tx);
    } catch (err) {
      console.log("❌ Vote casting failed!");
      console.error("Error details:", err);

      if (err instanceof Error) {
        console.log("🚫 Error message:", err.message);
        setError(err.message);
      } else {
        console.log("⚠️ Unknown error type:", err);
        setError("An unknown error occurred while voting");
      }
    }
  };

  if (2 < 1) {
    return <div>hello</div>;
  }

  return (
    <div className="w-full h-full p-2 bg-[#0A0A0A] flex flex-col gap-4">
      <div className="text-[#2DFF05] p-3 bg-[#2DFF0510] rounded-lg">
        Your $hackathon balance: {formattedBalance} {enoughBalance ? "✅" : "⚠"}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="finalists">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="h-full overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-[#2DFF05] scrollbar-track-[#1A1A1A]"
            >
              {finalists.map((finalist, index) => (
                <Draggable
                  key={finalist.fid.toString()}
                  draggableId={finalist.fid.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <UserItem
                      user={finalist}
                      index={index}
                      isDragging={snapshot.isDragging}
                      provided={provided}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="fixed bottom-32 left-0 right-0 w-full flex justify-center items-center gap-4 px-8">
        <button
          onClick={prepareVote}
          disabled={isVoting}
          className={`w-1/2 mx-auto font-bold py-3 px-6 rounded-lg transition-all duration-300 relative ${
            isVoting
              ? "bg-[#2DFF05]/50 cursor-wait"
              : "bg-[#2DFF05] hover:bg-[#25CC04]"
          } text-black overflow-hidden`}
        >
          {isPreparingVote ? (
            <>
              <div className="absolute inset-0 bg-[#2DFF05] animate-slide-right"></div>
              <span className="relative z-10">preparing...</span>
            </>
          ) : (
            <span>prepare vote</span>
          )}
        </button>
        <button
          onClick={() => setShowVoteModal(false)}
          disabled={isVoting}
          className="flex-1 border bg-blackborder-[#2DFF05]/70 text-[#2DFF05]/70 font-bold py-3 rounded-lg hover:bg-[#2DFF05]/10 hover:text-[#2DFF05] transition-all duration-300"
        >
          back
        </button>
      </div>

      {showMintModal && (
        <div className="fixed inset-0 h-screen top-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#121212] p-4 rounded-lg max-w-md w-full h-[90vh] flex flex-col justify-between">
            <div className="flex-1 flex flex-col items-center gap-6">
              <div className="w-full bg-black rounded-lg p-4">
                <h3 className="text-[#2DFF05] text-xl mb-2 text-center">
                  your vote:
                </h3>
                <div className="flex flex-col gap-3">
                  {finalists.map((finalist, index) => (
                    <div
                      key={finalist.fid}
                      className="flex items-center gap-2 bg-[#121212] p-1 rounded"
                    >
                      <span className="text-[#2DFF05] font-bold">
                        {index + 1}.
                      </span>
                      <img
                        src={finalist.pfp_url}
                        alt={finalist.display_name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-white">
                        {finalist.display_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full">
              {!isConfirmed && (
                <small className="text-green-500 text-xs block mb-4 text-center">
                  (this will trigger an nft minting transaction that you will
                  need to sign with your wallet)
                </small>
              )}

              <div className="flex gap-4 w-full">
                {isConfirmed ? (
                  <button
                    onClick={() => {
                      const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(
                        `Just voted for $hackathon week-1 inside a frame\n\nDo the same here:`
                      )}&embeds[]=https://weeklyhackathon.com`;
                      sdk.actions.openUrl(url);
                    }}
                    className="flex-1 bg-[#2DFF05] text-black font-bold py-3 rounded-lg hover:bg-[#25CC04] transition-all duration-300"
                  >
                    Share
                  </button>
                ) : (
                  <button
                    onClick={castVote}
                    disabled={(!isConnected || isSendTxPending) && !isConfirmed}
                    className="flex-1 bg-[#2DFF05] text-black font-bold py-3 rounded-lg hover:bg-[#25CC04] transition-all duration-300 disabled:opacity-50"
                  >
                    {isConfirming
                      ? "confirming..."
                      : isSendTxPending
                      ? "voting..."
                      : "vote onchain"}
                  </button>
                )}
                {!isConfirmed && (
                  <button
                    onClick={() => {
                      setShowMintModal(false);
                      setIsVoting(false);
                    }}
                    className="flex-1 bg-black border border-[#2DFF05]/70 text-[#2DFF05]/70 font-bold py-3 rounded-lg hover:bg-[#2DFF05]/10 hover:text-[#2DFF05] transition-all duration-300"
                  >
                    go back
                  </button>
                )}
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

              {error && <div className="mt-4 text-red-500">{error}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoteTab;
