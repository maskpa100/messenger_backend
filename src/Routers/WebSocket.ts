// websocketServer.ts
import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET_KEY } from "../config/authSecret";

interface WebSocketWithAuth extends WebSocket {
  user?: JwtPayload;
  settings?: {
    page?: string;
    // Вы можете добавить другие параметры, если нужно
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
      ws.on("message", (message) => {
        try {
          const parsedMessage = JSON.parse(message.toString());
          if (parsedMessage.type === "settings") {
            connections[ws.user?.userId].settings = parsedMessage.settings;
            // Сохраните настройки пользователя для дальнейшего использования
            console.log(
              `Настройки пользователя ${ws.user?.userId}:`,
              parsedMessage.settings
            );
            ws.send(
              JSON.stringify({
                message: `Настройки пользователя ${parsedMessage.settings.page}`,
              })
            );
            // Здесь вы можете реализовать логику для обработки этих настроек
          } else {
            // Обработка других сообщений
            handleUserMessage(ws, parsedMessage);
          }
        } catch (error) {
          console.error("Ошибка парсинга сообщения:", error);
          ws.send(
            JSON.stringify({
              message:
                "Ошибка: не удалось распарсить сообщение. Убедитесь, что оно в формате JSON.",
              parsedMessage: message.toString(),
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

const handleUserMessage = (ws: WebSocketWithAuth, parsedMessage: any) => {
  if (parsedMessage.userId) {
    const targetWs = connections[parsedMessage.userId];

    if (targetWs) {
      const userSettings = targetWs.settings; // Получаем настройки только если целевой пользователь существует

      // Отправляем сообщение нужному пользователю
      targetWs.send(
        JSON.stringify({
          type: "message", // Тип сообщения, может быть полезным для обработки
          content: `Сообщение для вас от пользователя ${ws.user?.userId}: ${parsedMessage.content}`,
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
