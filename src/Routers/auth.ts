// Routers/auth.ts
import { Router } from "express";
import { login, register, verifyToken } from "../Controllers/auth";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types";
import { JwtPayload } from "jsonwebtoken";
import { query_MySql } from "../config/MySql";
import { info } from "../Controllers/info";

const authRouter = Router();

authRouter.post("/login", login);

authRouter.post("/register", register);

authRouter.get("/verify-token", verifyToken, info);

export default authRouter;
