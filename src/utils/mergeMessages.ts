import { Messengers } from "../Service_MySql/Types";

type DialogMessage = {
  userId: number;
  dialog_userId: number;
  messages: {
    id: number;
    from_user: number;
    to_user: number;
    time: Date;
    message: string;
    delivered: boolean;
  }[];
};

export function mergeMessages(
  existingDialogs: DialogMessage[],
  newMessages: Messengers[],
  userId: number
): DialogMessage[] {
  const dialogsMap: { [key: number]: DialogMessage } = {};

  // Создаем структуру из существующих диалогов для удобного доступа
  existingDialogs.forEach((dialog) => {
    dialogsMap[dialog.dialog_userId] = dialog;
  });

  // Обрабатываем новые сообщения
  newMessages.forEach(
    ({ id, time, from_user, to_user, message, delivered }) => {
      const dialogUser = from_user === userId ? to_user : from_user;

      // Если такого dialog_user еще нет, создаем новый диалог
      if (!dialogsMap[dialogUser]) {
        dialogsMap[dialogUser] = {
          userId,
          dialog_userId: dialogUser,
          messages: [],
        };
      }

      // Проверка на наличие сообщения с таким id
      const existingMessage = dialogsMap[dialogUser].messages.find(
        (msg) => msg.id === id
      );
      if (!existingMessage) {
        // Добавляем сообщение, если его еще нет
        dialogsMap[dialogUser].messages.push({
          id,
          time,
          from_user,
          to_user,
          message,
          delivered,
        });
      }
    }
  );
  Object.values(dialogsMap).forEach((dialog) => {
    dialog.messages.sort((a, b) => a.id - b.id);
  });
  // Возвращаем массив из значений dialogsMap
  return Object.values(dialogsMap);
}
