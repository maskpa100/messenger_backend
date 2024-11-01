import { query_MySql } from "../../config/MySql";
import { getMessage, insertMessage } from "../../Service_MySql/messengers";
import { WebSocketWithAuth } from "../../Routers/WebSocket";
import { getUserById } from "../../Service_MySql/users";

export const handleUserMessage = async (
  ws: WebSocketWithAuth,
  parsedMessage: any,
  connections: { [key: string]: WebSocketWithAuth }
) => {
  if (parsedMessage.request.userId) {
    const targetWs = connections[parsedMessage.request.userId];

    const dialog_userExists = await getUserById(ws.user?.userId);
    if (!dialog_userExists) {
      return { message: "Пользователь не найден" };
    }

    const dialog_userExists2 = await getUserById(parsedMessage.request.userId);
    if (!dialog_userExists2) {
      return { message: "Пользователь не найден" };
    }
    const result = await insertMessage(
      ws.user?.userId,
      parsedMessage.request.userId,
      parsedMessage.request.content
    );
    const resultMessage = await getMessage(result.insertId);
    if (targetWs) {
      // проверяем подключен ли пользователь
      const userSettings = targetWs.request;

      const message = {
        dialog_userId: ws.user?.userId,
        dialog_user: dialog_userExists,
        messages: resultMessage, // тут новые данные
      };
      // Отправляем сообщение нужному пользователю
      targetWs.send(
        JSON.stringify({
          type: "message",
          content: message,
        })
      );
      // отправить себе
      const message2 = {
        dialog_userId: parsedMessage.request.userId,
        dialog_user: dialog_userExists2,
        messages: resultMessage,
        userId: ws.user?.userId,
      };
      ws.send(
        JSON.stringify({
          type: "message",
          content: message2,
        })
      );
    } else {
      const message2 = {
        dialog_userId: parsedMessage.request.userId,
        dialog_user: dialog_userExists2,
        messages: resultMessage,
        userId: ws.user?.userId,
      };
      ws.send(
        JSON.stringify({
          type: "message",
          content: message2,
        })
      );
    }
  } else {
    ws.send("Сообщение не содержит userId");
  }
};
