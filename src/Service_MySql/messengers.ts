import { ResultSetHeader } from "mysql2";
import { query_MySql } from "../config/MySql";
import { Messengers } from "./Types";

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
    fromUserId,
    toUserId, // ID получателя
    message,
  ]);
  return result as unknown as ResultSetHeader;
};

export async function getMessage(id: number): Promise<Messengers[]> {
  const query = "SELECT * FROM messengers WHERE id = ?";
  const result = await query_MySql(query, [id]);
  return result as Messengers[];
}

export const getUnreadMessages = async (
  userId: number
): Promise<Messengers[]> => {
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
  return result as Messengers[];
};
export const recentMessages = async (userId: number): Promise<Messengers[]> => {
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
  return result as Messengers[];
};

export const getDialogMessages = async (
  userId: number,
  dialogUser: number
): Promise<Messengers[]> => {
  const sql =
    "SELECT * FROM messengers WHERE (from_user, to_user) IN ((?, ?), (?, ?))";
  const result = await query_MySql(sql, [
    userId,
    dialogUser,
    dialogUser,
    userId,
  ]);
  return result as Messengers[];
};
