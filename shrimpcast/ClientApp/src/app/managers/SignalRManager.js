import { HubConnectionBuilder } from "@microsoft/signalr";
import { HttpTransportType } from "@microsoft/signalr";
import LocalStorageManager from "./LocalStorageManager";

class SignalRManager {
  static events = {
    forceDisconnect: "ForceDisconnect",
    configUpdated: "ConfigUpdated",
    pollOptionAdded: "OptionAdded",
    pollOptionRemoved: "OptionRemoved",
    pollVoteUpdate: "VoteUpdate",
    ping: "Ping",
    pong: "Pong",
    userCountChange: "UserCountChange",
    messageReceived: "ChatMessage",
    userConnected: "UserConnected",
    userDisconnected: "UserDisconnected",
    modStatusUpdate: "ModStatusUpdate",
    emoteAdded: "EmoteAdded",
    emoteRemoved: "EmoteRemoved",
    bingoOptionUpdate: "BingoOptionStatusUpdate",
    bingoOptionAdded: "BingoOptionAdded",
    bingoOptionRemoved: "BingoOptionRemoved",
    bingoReset: "BingoReset",
    goldStatusUpdate: "GoldStatusUpdate",
    nameChange: "NameChange",
    messageHistory: "MessageHistory",
  };

  static async connect() {
    let token = LocalStorageManager.getToken();
    let connection = new HubConnectionBuilder()
      .withUrl(`/hubs/ws?accessToken=${token}`, {
        transport: HttpTransportType.WebSockets,
        skipNegotiation: true,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          const maxRetries = 50;
          const retryCount = retryContext.previousRetryCount;
          console.log(`Attempting to reconnect: ${retryCount} / ${maxRetries}`);
          if (!retryCount) return 0;
          return retryContext.previousRetryCount < maxRetries ? 2000 : null;
        },
      })
      .build();

    // Set up reconnection behavior
    connection.onreconnected(async (connectionId) => {
      console.log("Connection re-established with ID:", connectionId);

      // Request missing messages since last known message
      const lastMessageId = LocalStorageManager.getLastMessageId();
      if (lastMessageId) {
        try {
          await connection.invoke("GetMessagesSince", lastMessageId);
        } catch (ex) {
          console.error("Error retrieving message history:", ex);
        }
      }
    });

    await connection.start().catch((ex) => console.log(ex));
    return connection;
  }

  static setupMessageTracking(signalR) {
    signalR.on(this.events.messageReceived, (message) => {
      if (message.messageId && message.messageType === "UserMessage") {
        LocalStorageManager.saveLastMessageId(message.messageId);
      }
    });

    // Handle message history responses
    signalR.on(this.events.messageHistory, (messages) => {
      console.log("Received message history:", messages.length, "messages");
      if (messages && messages.length) {
        // Find the latest message ID to update our tracking
        const latestMessage = messages.reduce(
          (latest, current) =>
            latest.messageId > current.messageId ? latest : current,
          { messageId: 0 },
        );

        if (latestMessage.messageId > 0) {
          LocalStorageManager.saveLastMessageId(latestMessage.messageId);
        }
      }
    });
  }
}
export default SignalRManager;
