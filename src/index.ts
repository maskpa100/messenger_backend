import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import cors from "cors";
import authRouter from "./Routers/auth";
import messengersRouter from "./Routers/messengers";
import userRouter from "./Routers/user";
import { SECRET_KEY } from "./config/authSecret";
import { initWebSocketServer } from "./Routers/WebSocket";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/messengers", messengersRouter);
app.use("/users", userRouter);

initWebSocketServer(8080);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
