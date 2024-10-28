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
  dialog_userId: number;
  messages: {
    id: number;
    from_user: number;
    to_user: number;
    time: string;
    message: string;
    delivered: number;
  }[];
};

export function groupMessages(data: {
  userId: string;
  messages: Message[];
}): DialogMessage[] {
  const userId = parseInt(data.userId, 10);
  const dialogs: { [key: number]: DialogMessage } = {};

  data.messages.forEach(
    ({ id, time, from_user, to_user, message, delivered }) => {
      const dialogUser = from_user === userId ? to_user : from_user;

      if (!dialogs[dialogUser]) {
        dialogs[dialogUser] = {
          userId,
          dialog_userId: dialogUser,
          messages: [],
        };
      }

      dialogs[dialogUser].messages.push({
        id,
        time,
        from_user,
        to_user,
        message,
        delivered,
      });
    }
  );

  return Object.values(dialogs);
}
