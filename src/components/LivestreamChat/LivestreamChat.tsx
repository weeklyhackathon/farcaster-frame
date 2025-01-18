import { Chat, Channel, MessageList, MessageInput } from "stream-chat-react";
import { type Channel as StreamChannel } from "stream-chat";

const LivestreamChat = ({
  channel,
  displayName,
  username,
}: {
  channel: StreamChannel | null;
  displayName: string | null;
  username: string;
}) => {
  console.log("channel", channel);
  console.log("displayName", displayName);
  console.log("username", username);
  if (!channel) {
    return null;
  }

  return (
    <div className="h-full md:h-[calc(100vh-150px)]">
      <Chat client={channel.getClient()} theme="str-chat__theme-dark ">
        <Channel channel={channel}>
          <div className="chat-mangler">
            <MessageList />
            <MessageInput />
          </div>
        </Channel>
      </Chat>
    </div>
  );
};

export default LivestreamChat;
