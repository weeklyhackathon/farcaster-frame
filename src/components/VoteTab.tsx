import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import sdk from "@farcaster/frame-sdk";

const MOCK_USERS = [
  {
    username: "moon.eth",
    fid: 247765,
    pfp_url: "https://i.imgur.com/MWCBl32.jpg",
    display_name: "Moon",
  },
  {
    username: "hellno.eth",
    fid: 13596,
    pfp_url: "https://i.imgur.com/qoHFjQD.gif",
    display_name: "hellno the optimist",
  },
  {
    username: "wasabi",
    fid: 11037,
    pfp_url: "https://i.imgur.com/NgfWDg2.jpg",
    display_name: "Wasabi 🥥🌴",
  },
  {
    username: "bleu.eth",
    fid: 253127,
    pfp_url:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/b24ac276-e91a-495e-01f6-5fe333f6a300/original",
    display_name: "agusti",
  },
  {
    username: "lobzztr",
    fid: 7942,
    pfp_url: "https://i.imgur.com/jX1zToT.png",
    display_name: "Anjal",
  },
  {
    username: "0xcaso",
    fid: 5698,
    pfp_url:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/06d51e08-d18a-460d-d3e2-717cf1ada700/rectcrop3",
    display_name: "caso.base.eth",
  },
  {
    username: "jpfraneto.eth",
    fid: 16098,
    pfp_url:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bd27ed2e-efe3-4432-6b12-d2664216c500/original",
    display_name: "jp 🎩",
  },
  {
    username: "cashlessman.eth",
    fid: 268438,
    pfp_url:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/a74b030e-2d92-405c-c2d0-1696f5d51d00/original",
    display_name: "cashlessman 🎩",
  },
];

const UserItem = ({
  user,
  index,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  user: any;
  index: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) => {
  return (
    <div className="flex items-center gap-2 p-2 border border-[#2DFF05] rounded-lg bg-[#121212] hover:bg-[#1A1A1A] transition-colors">
      <div
        onClick={() => {
          sdk.actions.viewProfile({ fid: user.fid });
        }}
        className="flex w-full gap-4 mr-auto items-center"
      >
        <span className="text-[#2DFF05]/50 text-sm">#{index + 1}</span>
        <img
          src={user.pfp_url || "https://via.placeholder.com/40"}
          className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
          alt={user.display_name || user.username}
        />
        <span className="text-[#2DFF05] text-sm truncate">
          {user.display_name || user.username}
        </span>
      </div>
      <div className="flex gap-1 ml-2">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className={`p-1 rounded bg-black transition-colors`}
        >
          <ChevronUp className="w-4 h-4 text-[#2DFF05]" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className={`p-1 rounded bg-black transition-colors `}
        >
          <ChevronDown className="w-4 h-4 text-[#2DFF05]" />
        </button>
      </div>
    </div>
  );
};

const VoteTab = () => {
  const [users, setUsers] = useState(MOCK_USERS);

  const moveUser = (fromIndex: number, toIndex: number) => {
    const updatedUsers = [...users];
    const [movedUser] = updatedUsers.splice(fromIndex, 1);
    updatedUsers.splice(toIndex, 0, movedUser);
    setUsers(updatedUsers);
  };

  return (
    <div className="w-full h-full p-2 bg-[#0A0A0A]">
      <div className="h-full overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-[#2DFF05] scrollbar-track-[#1A1A1A] pr-2">
        <p className="text-[#2DFF05] text-xl ml-48 mb-16">arrange and vote</p>
        {users.map((user, index) => (
          <UserItem
            key={user.fid}
            user={user}
            index={index}
            onMoveUp={() => moveUser(index, index - 1)}
            onMoveDown={() => moveUser(index, index + 1)}
            isFirst={index === 0}
            isLast={index === users.length - 1}
          />
        ))}
      </div>
      <button
        onClick={async () => {
          try {
            alert("submit vote");
          } catch (error) {
            console.error("Error submitting vote:", error);
          }
        }}
        className="fixed left-0 right-0 bottom-32 w-48 mx-auto bg-[#2DFF05] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#25CC04] transition-all duration-300"
      >
        Submit Vote
      </button>
      <small className="text-green-500 text-sm fixed left-0 right-0 bottom-20  mt-4 w-full px-4 ">
        (this will trigger a smart contract call that you will need to sign with
        your wallet)
      </small>
    </div>
  );
};

export default VoteTab;
