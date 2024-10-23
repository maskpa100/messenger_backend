// Routers/auth.ts
import { Router } from "express";
import { login, register, verifyToken } from "../Controllers/auth";

const authRouter = Router();

authRouter.post("/login", login);

authRouter.post("/register", register);

authRouter.get("/verify-token", verifyToken);

export default authRouter;
