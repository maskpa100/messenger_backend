import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query_MySql } from "./config/MySql";
import { SECRET_KEY } from "./config/authSecret";

// Определение типа для токена
interface JwtPayload {
  userId: number;
  username: string;
}
interface User {
  id: number;
  email: string;
  password: string;
}
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    // Логика для поиска пользователя и проверки пароля
    // (предполагаем, что ваш код корректен и использует правильный SQL-запрос)
    const users = await query_MySql<User>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      res.status(400).json({ message: "Неверный логин или пароль" });
      return;
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Неверный логин или пароль 1" });
      return;
    }

    // Генерация JWT токена
    const token = jwt.sign(
      { userId: user.id, username: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Отправляем ответ с токеном
    res.status(200).json({ message: "Успешный вход", token });
  } catch (error) {
    // В случае ошибки отправляем ответ с кодом 500
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Проверяем, существует ли пользователь
    const userCheckQuery = "SELECT * FROM users WHERE email = ?";
    const existingUser = await query_MySql(userCheckQuery, [email]);

    if (existingUser.length > 0) {
      // Если пользователь существует, отправляем ответ и завершаем выполнение
      res.status(400).json({ message: "Пользователь уже существует" });
      return;
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const userInsertQuery = "INSERT INTO users (email, password) VALUES (?, ?)";
    await query_MySql(userInsertQuery, [email, hashedPassword]);

    // Отправляем ответ о успешной регистрации
    res.status(201).json({ message: "Пользователь зарегистрирован" });
    return;
  } catch (error) {
    // В случае ошибки отправляем ответ с кодом 500
    res.status(500).json({ message: "Ошибка сервера", error });
    return;
  }
};

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const verifyToken = (
  req: Request, // Оставляем тип Request здесь
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(403).json({ message: "Нет токена" });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    (req as AuthenticatedRequest).user = decoded; // Приведение к типу AuthenticatedRequest
    next();
  } catch (error) {
    res.status(401).json({ message: "Неверный токен", error });
  }
};
