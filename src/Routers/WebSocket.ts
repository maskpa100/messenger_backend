// websocketServer.ts
import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET_KEY } from "../config/authSecret";
import { dialogUser } from "../Controllers/WebSocket/dialogUser";
import { query_MySql } from "../config/MySql";
import { getMessage, insertMessage } from "../query_MySql";

interface WebSocketWithAuth extends WebSocket {
  user?: JwtPayload;
  request?: {
    action?: string;
    dialog_user?: string;
    userId?: string;
  };
}

// Объект для хранения WebSocket соединений по userId
const connections: { [key: string]: WebSocketWithAuth } = {};

export const initWebSocketServer = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws: WebSocketWithAuth, req) => {
    const token = req.url?.split("?token=")[1];

    if (!token) {
      ws.close(4001, "Токен не предоставлен");
      return;
    }

    try {
      // Верифицируем токен
      const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
      console.log(decoded);

      // Сохраняем информацию о пользователе в WebSocket объекте
      ws.user = decoded;

      // Добавляем соединение в объект connections
      connections[decoded.userId] = ws;

      // Успешное соединение
      ws.send(
        JSON.stringify({
          message: "Соединение установлено, пользователь авторизован",
        })
      );
      ws.send(JSON.stringify(decoded));

      // Ожидание настроек пользователя
      ws.on("message", async (message) => {
        try {
          const parsedMessage = JSON.parse(message.toString());
          const userId = ws.user?.userId;
          if (userId && connections[userId]) {
            connections[userId].request = parsedMessage.request;
          } else {
            console.error("Соединение не найдено для userId:", userId);
          }
          connections[ws.user?.userId].request = parsedMessage.request;

          if (parsedMessage.type === "request") {
            if (parsedMessage.request.action === "dialogue") {
              const result = await dialogUser(
                decoded.userId,
                parsedMessage.request.dialog_user
              );
              ws.send(JSON.stringify({ result }));
            }
            if (parsedMessage.request.action === "addMessage") {
              handleUserMessage(ws, parsedMessage);
            }
          }
        } catch (error) {
          console.error("Ошибка парсинга сообщения:", error);
          ws.send(
            JSON.stringify({
              message:
                "Ошибка: не удалось распарсить сообщение. Убедитесь, что оно в формате JSON.",
              parsedMessage: message.toString(),
              user: `-- ${connections[ws.user?.userId]}`,
            })
          );
        }
      });
    } catch (error) {
      ws.close(4002, "Неверный токен");
    }

    // Удаляем соединение из объекта при закрытии
    ws.on("close", () => {
      if (ws.user) {
        delete connections[ws.user.userId];
      }
    });
  });
};

const handleUserMessage = async (ws: WebSocketWithAuth, parsedMessage: any) => {
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
      const result = await insertMessage(
        ws.user?.userId,
        parsedMessage.request.userId,
        parsedMessage.request.content
      );
      console.log(result.insertId);
      const resultMessage = await getMessage(result.insertId);
      console.log();

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
        dialog_userId: dialog_userExists,
        dialog_user: ws.user?.userId,
        messages: resultMessage,
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
