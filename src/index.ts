import express from "express";
import cors from "cors";
import authRouter from "./Routers/auth";
import messengersRouter from "./Routers/messengers";
import userRouter from "./Routers/user";
import { initWebSocketServer } from "./Routers/WebSocket";
import settingRouter from "./Routers/setting";
import { searchUsers } from "./Controllers/searchUsers";
const path = require("path");
require("dotenv").config({ path: ".env.local" });
console.log(
  process.env.HOST,
  process.env.USER,
  process.env.PASSWORD,
  process.env.DATABASE
);

const app = express();
const port = 5000;

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
