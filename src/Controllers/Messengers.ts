import { JwtPayload } from "jsonwebtoken";
import { query_MySql } from "../config/MySql";
import { AuthenticatedRequest } from "../types";
import { Request, Response } from "express";

export const sendMessengers = async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  if (user && typeof user !== "string") {
    const { userId } = user as JwtPayload;
    try {
      const { to_user, message } = req.body;

      if (!to_user || !message) {
        res.status(400).json({ message: "Поля to_user и message обязательны" });
        return;
      }
      const userCheckSql = "SELECT * FROM users WHERE id = ?";
      const userExists = await query_MySql(userCheckSql, [to_user]);

      if (userExists.length === 0) {
        res.status(404).json({ message: "Пользователь не найден" });
        return;
      }

      const sql =
        "INSERT INTO messengers (from_user, to_user, message) VALUES (?, ?, ?)";
      await query_MySql(sql, [userId, to_user, message]);

      res.status(201).json({ message: "Сообщение отправлено успешно" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка при отправке сообщения", error });
    }
  } else {
    res.status(401).json({ message: "Не удалось получить пользователя" });
  }
};

export const inboxMessengers = async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  if (user && typeof user !== "string") {
    const { userId } = user as JwtPayload;
    try {
      const { dialog_user } = req.body;

      if (!dialog_user) {
        res.status(400).json({ message: "Поля dialog_user обязательно" });
        return;
      }
      const userCheckSql = "SELECT * FROM users WHERE id = ?";
      const userExists = await query_MySql(userCheckSql, [dialog_user]);

      if (userExists.length === 0) {
        res.status(404).json({ message: "Пользователь не найден" });
        return;
      }
      const sql =
        "SELECT * FROM messengers WHERE from_user IN (?, ?) OR to_user IN (?, ?)";
      const messages = await query_MySql(sql, [
        userId,
        dialog_user,
        userId,
        dialog_user,
      ]);
      res.status(200).json({
        messages: messages,
        user: user,
      });
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: "Ошибка при получении сообщений", error });
    }
  }
};