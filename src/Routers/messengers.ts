import { Router } from "express";
import { verifyToken } from "../Controllers/auth";
import {
  getDialogues,
  inboxMessengers,
  sendMessengers,
  unreadMessages,
} from "../Controllers/Messengers";

const messengersRouter = Router();

messengersRouter.post("/send", verifyToken, sendMessengers);

messengersRouter.post("/inbox", verifyToken, inboxMessengers);

messengersRouter.post("/dialogues", verifyToken, getDialogues);

messengersRouter.get("/unread", unreadMessages);
export default messengersRouter;
