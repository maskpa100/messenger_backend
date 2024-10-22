// Routers/auth.ts
import { Router } from "express";
import { login, register } from "../Controllers/auth";

const authRouter = Router();

authRouter.post("/login", login);

authRouter.post("/register", register);

export default authRouter;
