import { WebSocketWithAuth } from "../../Routers/WebSocket";

type ParsedMessage = {
  type: string;
  request: {
    action: string;
    dialog_user: number;
    userId: number;
  };
};

export function readMessage(
  connections: { [key: string]: WebSocketWithAuth },
  parsedMessage: ParsedMessage
) {
  const targetWs = connections[parsedMessage.request.dialog_user];
  if (targetWs) {
    targetWs.send(
      JSON.stringify({
        type: "delivered",
        result: {
          dialog_user: parsedMessage.request.userId,
        },
      })
    );
  }
}
