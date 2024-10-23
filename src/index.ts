import express from "express";
import { login, register, verifyToken } from "./Controllers/auth";
import { Request, Response } from "express";
import cors from "cors";
import { AuthenticatedRequest } from "./types";
import authRouter from "./Routers/auth";
import messengersRouter from "./Routers/messengers";
import userRouter from "./Routers/user";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/messengers", messengersRouter);
app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
