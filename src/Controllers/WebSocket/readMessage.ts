import { WebSocketWithAuth } from "../../Routers/WebSocket";
import { getReadMessage } from "../../Service_MySql/messengers";

type ParsedMessage = {
  type: string;
  request: {
    action: string;
    dialog_user: number;
    userId: number;
  };
};

export async function readMessage(
  ws: WebSocketWithAuth,
  connections: { [key: string]: WebSocketWithAuth },
  parsedMessage: ParsedMessage
) {
  const targetWs = connections[parsedMessage.request.dialog_user];
  if (targetWs) {
    console.log(`${ws.user?.userId} and ${parsedMessage.request.userId}`);

    await getReadMessage(ws.user?.userId, parsedMessage.request.dialog_user);
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
