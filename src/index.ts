import express from "express";
import { login, register, verifyToken } from "./Controllers/auth";
import { Request, Response } from "express";
import cors from "cors";
import { AuthenticatedRequest } from "./types";
import authRouter from "./Routers/auth";
import messengersRouter from "./Routers/messengers";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/messenger", verifyToken, (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  res.status(200).json({ message: "Доступ разрешен", user, valid: true });
});

app.use("/auth", authRouter);
app.use("/messengers", messengersRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
