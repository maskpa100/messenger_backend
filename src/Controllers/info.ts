import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { JwtPayload } from "jsonwebtoken";
import { query_MySql } from "../config/MySql";
export const info = async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthenticatedRequest).user;
  const userId =
    user && typeof user !== "string" && (user as JwtPayload).userId
      ? (user as JwtPayload).userId
      : null;

  const getUserByIdSql =
    "SELECT id, family,email, name, avatar, city FROM users WHERE id = ?";

  const resultUser = await query_MySql(getUserByIdSql, [userId]);
  console.log(resultUser[0]);

  const userInfo = {
    userId: resultUser[0].id,
    email: resultUser[0].email,
    family: resultUser[0].family,
    name: resultUser[0].name,
    avatar: resultUser[0].avatar,
    city: resultUser[0].city,
  };
  res.status(200).json({ message: "Доступ разрешен", userInfo, valid: true });
};
