type MessageData = {
  userId: number;
  dialog_userId: number;
  messages: Array<{
    id: number;
    time: Date;
    message: string;
    delivered: boolean;
  }>;
};

export function getUniqueUserIds(
  data: MessageData[],
  excludeUserId: number
): number[] {
  // Извлекаем все userId и dialog_user в один массив
  const userIds = data
    .map((item: any) => [item.userId, item.dialog_userId])
    .flat();

  // Убираем дубликаты, исключаем указанный userId, и возвращаем результат
  return [...new Set(userIds)].filter((id) => id !== excludeUserId);
}
