// Routers/auth.ts
import { Router } from "express";
import { login, register, verifyToken } from "../Controllers/auth";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types";

const authRouter = Router();

authRouter.post("/login", login);

authRouter.post("/register", register);

authRouter.get("/verify-token", verifyToken, (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  res.status(200).json({ message: "Доступ разрешен", user, valid: true });
});

export default authRouter;
