import { Router } from "express";
import { verifyToken } from "../Controllers/auth";
import {
  getDialogues,
  inboxMessengers,
  sendMessengers,
} from "../Controllers/Messengers";

const messengersRouter = Router();

messengersRouter.post("/send", verifyToken, sendMessengers);

messengersRouter.post("/inbox", verifyToken, inboxMessengers);

messengersRouter.post("/dialogues", verifyToken, getDialogues);
export default messengersRouter;
