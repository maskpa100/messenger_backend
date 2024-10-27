type Message = {
  id: number;
  time: string;
  from_user: number;
  to_user: number;
  message: string;
  delivered: number;
};

type DialogMessage = {
  userId: number;
  dialog_user: number;
  messages: {
    id: number;
    time: string;
    message: string;
    delivered: number;
  }[];
};

export function mergeMessages(
  existingDialogs: DialogMessage[],
  newMessages: Message[],
  userId: number
): DialogMessage[] {
  const dialogsMap: { [key: number]: DialogMessage } = {};

  // Создаем структуру из существующих диалогов для удобного доступа
  existingDialogs.forEach((dialog) => {
    dialogsMap[dialog.dialog_user] = dialog;
  });

  // Обрабатываем новые сообщения
  newMessages.forEach(
    ({ id, time, from_user, to_user, message, delivered }) => {
      const dialogUser = from_user === userId ? to_user : from_user;

      // Если такого dialog_user еще нет, создаем новый диалог
      if (!dialogsMap[dialogUser]) {
        dialogsMap[dialogUser] = {
          userId,
          dialog_user: dialogUser,
          messages: [],
        };
      }

      // Проверка на наличие сообщения с таким id
      const existingMessage = dialogsMap[dialogUser].messages.find(
        (msg) => msg.id === id
      );
      if (!existingMessage) {
        // Добавляем сообщение, если его еще нет
        dialogsMap[dialogUser].messages.push({ id, time, message, delivered });
      }
    }
  );

  // Возвращаем массив из значений dialogsMap
  return Object.values(dialogsMap);
}
