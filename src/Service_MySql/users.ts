import { query_MySql } from "../config/MySql";
import { User } from "./Types";

export const getUsers = async (userIds: number[]): Promise<User[]> => {
  const placeholders = userIds.map(() => "?").join(", ");

  const selectUsersSql = `SELECT id, email, family, name, avatar, time FROM users WHERE id IN (${placeholders})`;
  const result = await query_MySql(selectUsersSql, userIds);
  return result as User[];
};

export const getUserById = async (userId: number): Promise<User | null> => {
  const userCheckSql =
    "SELECT id, email, family, name, avatar, time FROM users WHERE id = ?";
  const result = await query_MySql(userCheckSql, [userId]);
  return result.length > 0 ? (result[0] as User) : null;
};
