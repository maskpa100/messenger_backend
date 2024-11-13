import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import cors from "cors";
import authRouter from "./Routers/auth";
import messengersRouter from "./Routers/messengers";
import userRouter from "./Routers/user";
import { SECRET_KEY } from "./config/authSecret";
import { initWebSocketServer } from "./Routers/WebSocket";
import settingRouter from "./Routers/setting";
import { searchUsers } from "./Controllers/searchUsers";
const path = require("path");
import https from "https";
import fs from "fs";

const app = express();
const port = 5000;

const sslOptions = {
  key: fs.readFileSync("./server.key"), // Замените на путь к вашему файлу server.key
  cert: fs.readFileSync("./server.cert"), // Замените на путь к вашему файлу server.cert
};

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/messengers", messengersRouter);
app.use("/users", userRouter);
app.use("/setting", settingRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/search", searchUsers);

initWebSocketServer(8081);

https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Example app listening on HTTPS port ${port}`);
});
