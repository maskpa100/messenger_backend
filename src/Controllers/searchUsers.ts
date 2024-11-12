import { Request, Response } from "express";
import { query_MySql } from "../config/MySql";

export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const family = req.query.family as string | undefined;
  const name = req.query.name as string | undefined;
  const city = req.query.city as string | undefined;

  const conditions: string[] = [];
  const values: string[] = [];

  // Добавляем условия для параметров, используя LIKE и LOWER для нечувствительного к регистру поиска
  if (family) {
    conditions.push("LOWER(family) LIKE ?");
    values.push(`%${family.toLowerCase()}%`);
  }
  if (name) {
    conditions.push("LOWER(name) LIKE ?");
    values.push(`%${name.toLowerCase()}%`);
  }
  if (city) {
    conditions.push("LOWER(city) LIKE ?");
    values.push(`%${city.toLowerCase()}%`);
  }

  const sqlQuery = `SELECT id, family, email, name, avatar, city FROM users${
    conditions.length ? " WHERE " + conditions.join(" AND ") : ""
  }`;

  try {
    const users = await query_MySql(sqlQuery, values);
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при поиске пользователей" });
  }
};
