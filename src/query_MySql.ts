import { ResultSetHeader } from "mysql2";
import { query_MySql } from "./config/MySql";

export const insertMessage = async (
  fromUserId: number,
  toUserId: number,
  message: string
): Promise<ResultSetHeader> => {
  const insertMessageSql = `
  INSERT INTO messengers (from_user, to_user, message) 
  VALUES (?, ?, ?)
`;
  const result = await query_MySql<ResultSetHeader>(insertMessageSql, [
    fromUserId, // ID отправителя
    toUserId, // ID получателя
    message, // текст сообщения
  ]);
  return result as unknown as ResultSetHeader;
};

export async function getMessage(id: number) {
  const query = "SELECT * FROM messengers WHERE id = ?";
  const results = await query_MySql(query, [id]);
  return results;
}

export const getUnreadMessages = async (userId: number) => {
  const unreadMessages = `SELECT m1.*
    FROM messengers m1
    JOIN (
        SELECT GREATEST(from_user, to_user) AS user1,
              LEAST(from_user, to_user) AS user2
        FROM messengers
        WHERE from_user = ? OR to_user = ?
        GROUP BY user1, user2
    ) m2 ON (GREATEST(m1.from_user, m1.to_user) = m2.user1 AND 
            LEAST(m1.from_user, m1.to_user) = m2.user2)
    WHERE m1.delivered = false
    ORDER BY m1.time DESC;`;
  const result = await query_MySql(unreadMessages, [userId, userId]);
  return result;
};
export const recentMessages = async (userId: number) => {
  const recentMessages = `SELECT m1.*
    FROM messengers m1
    JOIN (
        SELECT GREATEST(from_user, to_user) AS user1,
              LEAST(from_user, to_user) AS user2,
              MAX(time) AS last_time
        FROM messengers
        WHERE from_user = ? OR to_user = ?
        GROUP BY user1, user2
    ) m2 ON (GREATEST(m1.from_user, m1.to_user) = m2.user1 AND 
            LEAST(m1.from_user, m1.to_user) = m2.user2 AND 
            m1.time = m2.last_time)
    ORDER BY m1.time DESC`;
  const result = await query_MySql(recentMessages, [userId, userId]);
  return result;
};

export const getUsers = async (userIds: number[]) => {
  const placeholders = userIds.map(() => "?").join(", ");

  const selectUsersSql = `
    SELECT * FROM users 
    WHERE id IN (${placeholders})
  `;
  const result = await query_MySql(selectUsersSql, userIds);
  return result;
};
