import { ResultSetHeader } from "mysql2";
import { query_MySql } from "../config/MySql";

export async function updateUser(
  id: number,
  family: string,
  name: string,
  avatar: string,
  city: string
): Promise<boolean> {
  const query = `
    UPDATE users 
    SET family = ?, name = ?, avatar = ?, city = ?
    WHERE id = ?
  `;
  const values = [family, name, avatar, city, id];

  const result = await query_MySql(query, values);
  const resultSetHeader = result as unknown as ResultSetHeader;
  return resultSetHeader.affectedRows > 0;
}
