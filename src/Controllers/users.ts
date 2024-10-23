import { Request, Response, NextFunction } from "express";
import { query_MySql } from "../config/MySql";
export const getUsersById = async (req: Request, res: Response) => {
  const { ById } = req.body;

  if (!Array.isArray(ById)) {
    res.status(400).json({ message: "ById должен быть массивом" });
    return;
  }

  const allAreNumbers = ById.every((id) => typeof id === "number");

  if (!allAreNumbers) {
    res
      .status(400)
      .json({ message: "Все элементы в ById должны быть числами" });
    return;
  }

  try {
    const placeholders = ById.map(() => "?").join(",");
    const query = `SELECT id, email, family, name, avatar, time FROM users WHERE id IN (${placeholders})`;

    const users = await query_MySql(query, ById);
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении пользователей", error: error });
  }
};
