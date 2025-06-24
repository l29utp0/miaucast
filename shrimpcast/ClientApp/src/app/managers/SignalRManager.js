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
    redirectSource: "RedirectSource",
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
    await connection.start().catch((ex) => console.log(ex));
    return connection;
  }
}
export default SignalRManager;
