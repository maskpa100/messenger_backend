// websocketServer.ts
import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET_KEY } from "../config/authSecret";
import { dialogUser } from "../Controllers/WebSocket/dialogUser";
import { query_MySql } from "../config/MySql";
import { getMessage, insertMessage } from "../query_MySql";
import { handleUserMessage } from "../Controllers/WebSocket/handleUserMessage";

export interface WebSocketWithAuth extends WebSocket {
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
              handleUserMessage(ws, parsedMessage, connections);
            }
          }
        } catch (error) {
          console.error("Ошибка парсинга сообщения:", error);
          ws.send(
            JSON.stringify({
              message:
                "Ошибка: не удалось распарсить сообщение. Убедитесь, что оно в формате JSON.",
              parsedMessage: message.toString(),
              user: `user: ${connections[ws.user?.userId]}`,
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
