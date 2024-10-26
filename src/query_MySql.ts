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
