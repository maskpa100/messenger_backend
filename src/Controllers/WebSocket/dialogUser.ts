import { query_MySql } from "../../config/MySql";
import { WebSocketWithAuth } from "../../Routers/WebSocket";
import { getDialogMessages } from "../../Service_MySql/messengers";
import { getUserById } from "../../Service_MySql/users";

export const dialogUser = async (
  ws: WebSocketWithAuth,
  connections: { [key: string]: WebSocketWithAuth },
  userId: number,
  dialog_user: number
) => {
  const targetWs = connections[dialog_user];

  try {
    if (!dialog_user) {
      return { message: "Поля dialog_user обязательно" };
    }
    if (userId === undefined || dialog_user === undefined) {
      return { message: "Параметры userId и dialog_user обязательны" };
    }

    const userExists = await getUserById(userId);
    if (!userExists) {
      return { message: "Пользователь не найден" };
    }

    const dialog_userExists = await getUserById(dialog_user);
    if (!dialog_userExists) {
      return { message: "Пользователь не найден" };
    }

    const messages = await getDialogMessages(userId, dialog_user);

    const result = {
      type: "dialogue",
      messages: messages,
      user: userExists,
      dialog_user: dialog_userExists,
      userId: userId,
    };

    ws.send(JSON.stringify({ result }));
    if (targetWs) {
      targetWs.send(
        JSON.stringify({
          type: "delivered",
          result: {
            dialog_user: userId,
          },
        })
      );
    }
  } catch (error) {
    return { message: "Ошибка при получении сообщений", error };
  }
};
