import { getUnreadMessages, getUsers, recentMessages } from "../../query_MySql";
import { getUniqueUserIds } from "../../utils/getUniqueUserIds";
import { groupMessages } from "../../utils/groupMessages";
import { mergeMessages } from "../../utils/mergeMessages";

export const unreadMessages = async (userId: number) => {
  const resultUnreadMessages = await getUnreadMessages(userId);
  const resultRecentMessages = await recentMessages(userId);
  const data = {
    userId: String(userId),
    messages: resultRecentMessages,
  };
  const resultGroupMessages = groupMessages(data);
  const resultMergeMessages = mergeMessages(
    resultGroupMessages,
    resultUnreadMessages,
    userId
  );
  const userIds = getUniqueUserIds(resultMergeMessages, userId);
  const users = await getUsers(userIds);
  const result = resultMergeMessages.map((dialog) => {
    const user = users.find(
      (user) => user.id === dialog.dialog_userId || user.id === dialog.userId
    );
    return { ...dialog, dialog_user: user || null };
  });
  return result;
};
