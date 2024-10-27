import { getUnreadMessages, recentMessages } from "../../query_MySql";
import { groupMessages } from "../../utils/groupMessages";
import { mergeMessages } from "../../utils/mergeMessages";

export const unreadMessages = async (userId: number) => {
  const resultUnreadMessages = await getUnreadMessages(userId);
  const resultRecentMessages = await recentMessages(userId);

  const data = {
    user: String(userId),
    messages: resultRecentMessages,
  };

  const resultGroupMessages = groupMessages(data);
  const resultMergeMessages = mergeMessages(
    resultGroupMessages,
    resultUnreadMessages,
    userId
  );
  return resultMergeMessages;
};
