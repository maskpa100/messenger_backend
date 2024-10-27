import { query_MySql } from "../../config/MySql";
import { getMessage, insertMessage } from "../../query_MySql";
import { WebSocketWithAuth } from "../../Routers/WebSocket";

export const handleUserMessage = async (
  ws: WebSocketWithAuth,
  parsedMessage: any,
  connections: { [key: string]: WebSocketWithAuth }
) => {
  if (parsedMessage.request.userId) {
    const targetWs = connections[parsedMessage.request.userId];

    if (targetWs) {
      const userSettings = targetWs.request; // Получаем настройки только если целевой пользователь существует
      const userCheckSql =
        "SELECT id, email, family, name, avatar, time FROM users WHERE id = ?";
      const dialog_userExists = await query_MySql(userCheckSql, [
        ws.user?.userId,
      ]);
      if (dialog_userExists.length === 0) {
        console.log({ message: "Пользователь не найден" });
      }
      const userCheckSql2 =
        "SELECT id, email, family, name, avatar, time FROM users WHERE id = ?";
      const dialog_userExists2 = await query_MySql(userCheckSql, [
        parsedMessage.request.userId,
      ]);
      if (dialog_userExists.length === 0) {
        console.log({ message: "Пользователь не найден" });
      }
      const result = await insertMessage(
        ws.user?.userId,
        parsedMessage.request.userId,
        parsedMessage.request.content
      );
      console.log(result.insertId);
      const resultMessage = await getMessage(result.insertId);

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
      // Если пользователь не в сети, отправляем соответствующее сообщение
      ws.send(
        JSON.stringify({ message: "Пользователь не в сети или не существует" })
      );
    }
  } else {
    ws.send("Сообщение не содержит userId");
  }
};
