import express from "express";
import { login, register, verifyToken } from "./authController";
import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const app = express();
const port = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/login", login);
app.post("/register", register);

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload; // Добавляем поле user
}

app.get("/protected", verifyToken, (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user; // Приведение к AuthenticatedRequest здесь
  res.status(200).json({ message: "Доступ разрешен", user });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
