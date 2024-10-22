import { Router } from "express";
import { verifyToken } from "../Controllers/auth";
import { inboxMessengers, sendMessengers } from "../Controllers/Messengers";

const messengersRouter = Router();

messengersRouter.post("/send", verifyToken, sendMessengers);

messengersRouter.post("/inbox", verifyToken, inboxMessengers);

export default messengersRouter;
