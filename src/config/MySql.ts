import mysql from "mysql2/promise";
require("dotenv").config({ path: ".env.local" });

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DATABASE,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

export async function query_MySql<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  const [results] = await pool.execute(query, params);
  return results as T[];
}
