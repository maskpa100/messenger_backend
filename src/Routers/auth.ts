// Routers/auth.ts
import { Router } from "express";
import { login, register, verifyToken } from "../Controllers/auth";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types";
import { JwtPayload } from "jsonwebtoken";
import { query_MySql } from "../config/MySql";

const authRouter = Router();

authRouter.post("/login", login);

authRouter.post("/register", register);

authRouter.get(
  "/verify-token",
  verifyToken,
  async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    const userId =
      user && typeof user !== "string" && (user as JwtPayload).userId
        ? (user as JwtPayload).userId
        : null;

    const getUserByIdSql =
      "SELECT id, family,email name, avatar FROM users WHERE id = ?";

    const resultUser = await query_MySql(getUserByIdSql, [userId]);
    console.log(resultUser[0].avatar);

    const userInfo = {
      userId: resultUser[0].id,
      username: resultUser[0].email,
      family: resultUser[0].family,
      name: resultUser[0].name,
      avatar: resultUser[0].avatar,
    };
    res.status(200).json({ message: "Доступ разрешен", userInfo, valid: true });
  }
);

export default authRouter;
