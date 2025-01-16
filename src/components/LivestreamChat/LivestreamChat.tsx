import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  defaultRenderMessages,
  MessageRenderer,
  DefaultStreamChatGenerics,
} from "stream-chat-react";
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

  const customRenderMessages: MessageRenderer<DefaultStreamChatGenerics> = (
    options
  ) => {
    console.log("options", options);
    const elements = defaultRenderMessages(options);
    console.log("elements", elements);
    elements.push(<li key="caught-up">You're all caught up!</li>);
    console.log("elements", elements);
    return elements;
  };

  return (
    <Chat client={channel.getClient()} theme="str-chat__theme-dark">
      <Channel channel={channel}>
        <div className="chat-mangler">
          <MessageList renderMessages={customRenderMessages} />
          <MessageInput />
        </div>
      </Channel>
    </Chat>
  );
};

export default LivestreamChat;
