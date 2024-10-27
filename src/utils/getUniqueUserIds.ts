type MessageData = {
  userId: number;
  dialog_user: number;
  messages: Array<{
    id: number;
    time: string;
    message: string;
    delivered: number;
  }>;
};

export function getUniqueUserIds(
  data: MessageData[],
  excludeUserId: number
): number[] {
  // Извлекаем все userId и dialog_user в один массив
  const userIds = data
    .map((item: any) => [item.userId, item.dialog_user])
    .flat();

  // Убираем дубликаты, исключаем указанный userId, и возвращаем результат
  return [...new Set(userIds)].filter((id) => id !== excludeUserId);
}
